import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { Plus } from 'lucide-react';
import './CompleteTheLook.css';

interface CompleteTheLookProps {
    baseProductId: string;
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({ baseProductId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`http://localhost:3001/api/merchandising/complete-look/${baseProductId}`)
            .then(res => res.json())
            .then(data => setProducts(data.products));
    }, [baseProductId]);

    if (products.length === 0) return null;

    return (
        <div className="ctl-widget widget">
            <h3>Complete the Routine</h3>
            <p className="ctl-subtitle">Pair with your selection for maximum results.</p>

            <div className="ctl-grid">
                {products.map(product => (
                    <div key={product.id} className="ctl-card glass">
                        <img src={product.image} alt={product.title} />
                        <div className="ctl-info">
                            <h4>{product.title}</h4>
                            <p>${product.price.toFixed(2)}</p>
                            <button
                                className="btn btn-primary btn-sm ctl-add-btn"
                                onClick={() => addToCart(product)}
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
