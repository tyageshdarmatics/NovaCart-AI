import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Types
export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
}

export interface CartItem extends Product {
    quantity: number;
    subscription?: boolean;
}

export interface RewardsProgress {
    subtotal: number;
    currentTier: any;
    nextTier: any;
    remaining: number;
    progressPercentage: number;
    message: string;
}

interface CartContextType {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    cartItems: CartItem[];
    addToCart: (product: Product, subscription?: boolean) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    toggleSubscription: (productId: string) => void;
    subtotal: number;
    rewardsProgress: RewardsProgress | null;
    recommendations: Product[];
    upsellOffer: { offer: Product, message: string } | null;
    closeUpsell: () => void;
    fetchUpsell: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [rewardsProgress, setRewardsProgress] = useState<RewardsProgress | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [upsellOffer, setUpsellOffer] = useState<{ offer: Product, message: string } | null>(null);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.subscription ? item.price * 0.9 : item.price;
        return acc + (price * item.quantity);
    }, 0);

    const fetchUpsell = async (productId: string) => {
        try {
            const response = await fetch(`${API_URL}/merchandising/upsell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, cartSubtotal: subtotal })
            });
            const data = await response.json();
            if (data.offer) {
                setUpsellOffer(data);
            } else {
                openCart(); // If no upsell, just open cart normally
            }
        } catch (e) {
            openCart();
        }
    };

    // Fetch Rewards
    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await fetch(`${API_URL}/cart/rewards-progress`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subtotal })
                });
                const data = await response.json();
                setRewardsProgress(data);
            } catch (error) {
                console.error('Failed to fetch rewards progress', error);
            }
        };
        fetchRewards();
    }, [subtotal, cartItems]);

    // Fetch Recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!isCartOpen) return;
            try {
                const cartItemIds = cartItems.map(i => i.id);
                const response = await fetch(`${API_URL}/cart/recommendations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cartItemIds })
                });
                const data = await response.json();
                setRecommendations(data.recommendations || []);
            } catch (error) {
                console.error('Failed to fetch recommendations', error);
            }
        };
        fetchRecommendations();
    }, [isCartOpen, cartItems]);

    const addToCart = async (product: Product, subscription: boolean = false) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1, subscription }];
        });

        // Check for upsell offer first
        await fetchUpsell(product.id);
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(i => i.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
    };

    const toggleSubscription = (productId: string) => {
        setCartItems(prev => prev.map(i => {
            if (i.id === productId) {
                return { ...i, subscription: !i.subscription };
            }
            return i;
        }));
    };

    const closeUpsell = () => {
        setUpsellOffer(null);
        openCart(); // Usually open cart after dismissing
    };

    return (
        <CartContext.Provider value={{
            isCartOpen, openCart, closeCart, cartItems, addToCart, removeFromCart, updateQuantity, toggleSubscription, subtotal, rewardsProgress, recommendations,
            upsellOffer, closeUpsell, fetchUpsell
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
