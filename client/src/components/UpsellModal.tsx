import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Gift } from 'lucide-react';
import './UpsellModal.css';

export const UpsellModal: React.FC = () => {
    const { upsellOffer, closeUpsell, addToCart } = useCart();

    if (!upsellOffer) return null;

    const { offer, message } = upsellOffer;

    const handleAccept = () => {
        addToCart(offer);
        closeUpsell();
    };

    return (
        <div className="upsell-overlay animate-fade-in" onClick={closeUpsell}>
            <div className="upsell-modal animate-slide-in-up" onClick={e => e.stopPropagation()}>
                <button className="upsell-close" onClick={closeUpsell}><X size={20} /></button>

                <div className="upsell-header">
                    <Gift className="upsell-icon" size={32} />
                    <h2>{message}</h2>
                    <p>Add this premium upgrade to your order.</p>
                </div>

                <div className="upsell-product">
                    <img src={offer.image} alt={offer.title} />
                    <div className="upsell-details">
                        <h3>{offer.title}</h3>
                        <p className="upsell-price">${offer.price.toFixed(2)}</p>
                    </div>
                </div>

                <div className="upsell-actions">
                    <button className="btn btn-primary" onClick={handleAccept}>
                        Yes, Add to Order
                    </button>
                    <button className="btn btn-outline" onClick={closeUpsell}>
                        No Thanks
                    </button>
                </div>
            </div>
        </div>
    );
};
