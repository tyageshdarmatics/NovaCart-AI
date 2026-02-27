// db.js: Mock database for NovaCart AI
const db = {
    cart: {
        items: [],
        subtotal: 0,
        currency: 'USD'
    },
    products: [
        { id: '1', title: 'Premium Hydration Serum', price: 45.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Serum', rating: 4.8, reviews: 124 },
        { id: '2', title: 'Vitamin C Brightening Mask', price: 32.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Mask', rating: 4.9, reviews: 89 },
        { id: '3', title: 'Daily Defense Moisturizer', price: 55.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Moisturizer', rating: 4.7, reviews: 210 },
        { id: '4', title: 'Gentle Exfoliating Cleanser', price: 28.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Cleanser', rating: 4.6, reviews: 156 },
        { id: '5', title: 'Overnight Repair Cream', price: 65.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Repair+Cream', rating: 4.9, reviews: 302 }
    ],
    rewards: {
        tiers: [
            { id: 't1', threshold: 50, reward: 'Free Shipping', type: 'shipping' },
            { id: 't2', threshold: 100, reward: 'Free Mystery Gift', type: 'gift', giftProductId: '5' },
            { id: 't3', threshold: 150, reward: '10% Off Entire Order', type: 'discount' }
        ]
    },
    rules: [
        { id: 'r1', name: 'Suggest Mask when Serum added', condition: { type: 'cart_contains', value: '1' }, action: { type: 'recommend', productId: '2' }, active: true },
        { id: 'r2', name: 'High Value Upsell', condition: { type: 'cart_value_greater_than', value: 100 }, action: { type: 'show_upsell_modal', productId: '5' }, active: true }
    ],
    analytics: {
        totalRevenue: 0,
        visitors: 0,
        views: 0,
        orders: 0
    }
};

module.exports = db;
