import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { Product } from '../context/CartContext';

interface PostPurchaseOffer {
    offer: Product & { originalPrice: number, offerPrice: number };
    message: string;
}

export const PostPurchase: React.FC = () => {
    const [offerData, setOfferData] = useState<PostPurchaseOffer | null>(null);
    const [status, setStatus] = useState<'idle' | 'accepted' | 'declined'>('idle');

    useEffect(() => {
        fetch('http://localhost:3001/api/offers/post-purchase', { method: 'POST' })
            .then(res => res.json())
            .then(data => setOfferData(data));
    }, []);

    if (!offerData) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;

    if (status === 'accepted' || status === 'declined') {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                <h2>Order Complete!</h2>
                <p style={{ color: 'var(--text-muted)' }}>Thank you for your purchase. We are getting your order ready.</p>
                <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.href = '/'}>Return to Store</button>
            </div>
        );
    }

    const { offer, message } = offerData;

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <AlertTriangle size={48} color="var(--warning)" style={{ margin: '0 auto 1rem' }} />
                <h2>{message}</h2>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', border: '2px solid var(--primary)', textAlign: 'center' }}>
                <img src={offer.image} alt={offer.title} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }} />
                <h3>{offer.title}</h3>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0 2rem', fontSize: '1.5rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--success)' }}>${offer.offerPrice.toFixed(2)}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>${offer.originalPrice.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.125rem' }} onClick={() => setStatus('accepted')}>
                        Pay Now - One Click (Add to Order)
                    </button>
                    <button className="btn btn-outline" onClick={() => setStatus('declined')}>
                        Decline Offer & Complete Order
                    </button>
                </div>
            </div>
        </div>
    );
};
