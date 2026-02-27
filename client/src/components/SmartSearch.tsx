import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Star } from 'lucide-react';
import { useCart, type Product } from '../context/CartContext';
import './SmartSearch.css';

interface SearchResponse {
    suggestions: Product[];
    trending: Product[];
}

export const SmartSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResponse>({ suggestions: [], trending: [] });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/search/suggestions?q=${query}`);
                const data = await res.json();
                setResults(data);
            } catch (e) {
                console.error('Search failed', e);
            }
        };

        const timer = setTimeout(() => {
            if (isOpen) fetchResults();
        }, 300); // debounce

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleAdd = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        setIsOpen(false);
    };

    return (
        <div className="smart-search-wrapper" ref={wrapperRef}>
            <div className={`search-input-container ${isOpen ? 'active' : ''}`}>
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search products, routines..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <div className="search-dropdown animate-fade-in">
                    {query.length === 0 ? (
                        <div className="search-trending">
                            <h4><TrendingUp size={16} /> Trending Now</h4>
                            <div className="trending-list">
                                {results.trending.map(item => (
                                    <div key={item.id} className="trending-item" onClick={() => handleAdd(item, {} as any)}>
                                        <img src={item.image} alt={item.title} />
                                        <span>{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="search-results">
                            {results.suggestions.length > 0 ? (
                                results.suggestions.map(product => (
                                    <div key={product.id} className="search-result-item">
                                        <img src={product.image} alt={product.title} />
                                        <div className="sr-info">
                                            <h5>{product.title}</h5>
                                            <div className="sr-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> {product.rating}</div>
                                            <p className="sr-price">${product.price.toFixed(2)}</p>
                                        </div>
                                        <button className="btn btn-primary btn-sm sr-add" onClick={(e) => handleAdd(product, e)}>Add</button>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No products found for "{query}"</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
