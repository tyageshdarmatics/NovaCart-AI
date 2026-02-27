import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Star, ShieldCheck } from 'lucide-react';
import './CartDrawer.css';

export const CartDrawer: React.FC = () => {
    const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, toggleSubscription, subtotal, rewardsProgress, recommendations, addToCart } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="cart-overlay animate-fade-in" onClick={closeCart}>
            <div className="cart-drawer animate-slide-in" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="cart-header">
                    <div className="cart-header-top">
                        <h2>Your Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
                        <button className="btn-close" onClick={closeCart}><X size={24} /></button>
                    </div>

                    {/* Progress Bar */}
                    {rewardsProgress && (
                        <div className="rewards-progress-wrapper">
                            <p className="rewards-message">{rewardsProgress.message}</p>
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${rewardsProgress.progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart Items */}
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button className="btn btn-primary" onClick={closeCart}>Continue Shopping</button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <div className="cart-item-header">
                                        <h4>{item.title}</h4>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}><X size={16} /></button>
                                    </div>

                                    <div className="cart-item-price">
                                        {item.subscription ? (
                                            <>
                                                <span className="price discounted">${(item.price * 0.9).toFixed(2)}</span>
                                                <span className="price original">${item.price.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="price">${item.price.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-selector">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                        </div>
                                    </div>

                                    {/* Subscription Toggle widget */}
                                    <div className="subscription-toggle">
                                        <label className="toggle-label">
                                            <input
                                                type="checkbox"
                                                checked={item.subscription || false}
                                                onChange={() => toggleSubscription(item.id)}
                                            />
                                            <span className="toggle-text">Subscribe & Save 10%</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && cartItems.length > 0 && (
                    <div className="cart-recommendations">
                        <h3>You Might Also Like</h3>
                        <div className="recommendation-list">
                            {recommendations.map(rec => (
                                <div key={rec.id} className="recommendation-card glass">
                                    <img src={rec.image} alt={rec.title} />
                                    <div className="rec-details">
                                        <p className="rec-title">{rec.title}</p>
                                        <div className="rec-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" /> <span>{rec.rating}</span></div>
                                        <p className="rec-price">${rec.price.toFixed(2)}</p>
                                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(rec)}>Add</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-optin">
                            <label>
                                <input type="checkbox" />
                                <span>Text me with news and offers via SMS</span>
                            </label>
                        </div>

                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
                        </div>

                        <button className="btn btn-primary checkout-btn" onClick={() => window.location.href = '/checkout'}>
                            <ShieldCheck size={18} /> Secure Checkout
                        </button>

                        <div className="accelerated-checkout">
                            <button className="btn-shop-pay">Shop Pay</button>
                            <button className="btn-g-pay">G Pay</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
