const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Calculate Rewards Progress
router.post('/rewards-progress', (req, res) => {
    const { subtotal } = req.body;

    if (subtotal === undefined) {
        return res.status(400).json({ error: 'subtotal is required' });
    }

    // Find next tier
    const sortedTiers = [...db.rewards.tiers].sort((a, b) => a.threshold - b.threshold);
    let currentTier = null;
    let nextTier = null;

    for (let i = 0; i < sortedTiers.length; i++) {
        if (subtotal >= sortedTiers[i].threshold) {
            currentTier = sortedTiers[i];
        } else {
            nextTier = sortedTiers[i];
            break;
        }
    }

    let progress = 0;
    let remaining = 0;

    if (nextTier) {
        remaining = nextTier.threshold - subtotal;
        const prevThreshold = currentTier ? currentTier.threshold : 0;
        const tierRange = nextTier.threshold - prevThreshold;
        const amountInTier = subtotal - prevThreshold;
        progress = (amountInTier / tierRange) * 100;
    } else {
        progress = 100;
    }

    res.json({
        subtotal,
        currentTier,
        nextTier,
        remaining,
        progressPercentage: Math.min(progress, 100),
        message: nextTier ? `Add $${remaining.toFixed(2)} to unlock ${nextTier.reward}!` : 'All rewards unlocked!'
    });
});

// Recommendations directly in Cart
router.post('/recommendations', (req, res) => {
    const { cartItemIds } = req.body; // array of product ids

    // Simple mock logic: recommend products not in cart
    const recommendations = db.products.filter(p => !cartItemIds.includes(p.id)).slice(0, 2);

    res.json({ recommendations });
});

module.exports = router;
