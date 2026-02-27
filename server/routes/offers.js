const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Post-purchase one-click offer
router.post('/post-purchase', (req, res) => {
    // Mock logic: Just recommend the highest value item as a one-time exclusive 30% off offer
    const offer = db.products.reduce((prev, current) => (prev.price > current.price) ? prev : current);

    res.json({
        offer: {
            ...offer,
            originalPrice: offer.price,
            offerPrice: offer.price * 0.7 // 30% off
        },
        message: "Wait! Add this to your order for 30% off. One click, no re-entering payment info."
    });
});

module.exports = router;
