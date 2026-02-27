import React, { useState, useEffect } from 'react';
import { useCart, type Product } from '../context/CartContext';
import { Plus, Check } from 'lucide-react';
import './DynamicBundle.css';

interface BundleOption {
    bundleId: string;
    title: string;
    description: string;
    requiredItems: number;
    discountPercentage: number;
    options: Product[];
}

export const DynamicBundle: React.FC = () => {
    const [bundleData, setBundleData] = useState<BundleOption | null>(null);
    const [selectedItems, setSelectedItems] = useState<Product[]>([]);
    const { addToCart, openCart } = useCart();

    useEffect(() => {
        fetch('http://localhost:3001/api/merchandising/bundles')
            .then(res => res.json())
            .then(data => setBundleData(data));
    }, []);

    if (!bundleData) return null;

    const toggleSelection = (product: Product) => {
        setSelectedItems(prev => {
            const isSelected = prev.find(p => p.id === product.id);
            if (isSelected) {
                return prev.filter(p => p.id !== product.id);
            }
            if (prev.length < bundleData.requiredItems) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const isComplete = selectedItems.length === bundleData.requiredItems;
    const originalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const discountedPrice = originalPrice * (1 - bundleData.discountPercentage / 100);

    const handleAddBundle = () => {
        if (!isComplete) return;
        selectedItems.forEach(item => {
            addToCart(item, false); // Add without subscription toggle by default
        });
        // Open cart automatically when bulk adding
        openCart();
        setSelectedItems([]); // reset
    };

    return (
        <div className="dynamic-bundle widget">
            <div className="bundle-header">
                <h3>{bundleData.title}</h3>
                <p>{bundleData.description}</p>
                <div className="bundle-progress">
                    Step {selectedItems.length} of {bundleData.requiredItems}
                </div>
            </div>

            <div className="bundle-options">
                {bundleData.options.map(product => {
                    const isSelected = selectedItems.some(p => p.id === product.id);
                    return (
                        <div
                            key={product.id}
                            className={`bundle-product-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSelection(product)}
                        >
                            <div className="selection-indicator">
                                {isSelected ? <Check size={16} /> : <Plus size={16} />}
                            </div>
                            <img src={product.image} alt={product.title} />
                            <div className="bp-info">
                                <h4>{product.title}</h4>
                                <p>${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bundle-footer">
                <div className="bundle-summary">
                    {isComplete ? (
                        <>
                            <span className="b-price-discounted">${discountedPrice.toFixed(2)}</span>
                            <span className="b-price-original">${originalPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span>Select {bundleData.requiredItems - selectedItems.length} more to unlock {bundleData.discountPercentage}% OFF</span>
                    )}
                </div>
                <button
                    className="btn btn-primary"
                    disabled={!isComplete}
                    onClick={handleAddBundle}
                >
                    Add Bundle to Cart
                </button>
            </div>
        </div>
    );
};
