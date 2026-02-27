const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Get all rules
router.get('/', (req, res) => {
    res.json({ rules: db.rules });
});

// Add a new rule (mock logic builder)
router.post('/', (req, res) => {
    const newRule = {
        id: `r${Date.now()}`,
        ...req.body,
        active: true
    };
    db.rules.push(newRule);
    res.json({ success: true, rule: newRule });
});

// Evaluate rules against cart context
router.post('/evaluate', (req, res) => {
    const { cartItems, cartSubtotal } = req.body;
    let appliedRules = [];

    for (const rule of db.rules) {
        if (!rule.active) continue;

        if (rule.condition.type === 'cart_contains') {
            const hasItem = cartItems.some(i => i.id === rule.condition.value);
            if (hasItem) appliedRules.push(rule);
        } else if (rule.condition.type === 'cart_value_greater_than') {
            if (cartSubtotal > rule.condition.value) appliedRules.push(rule);
        }
    }

    res.json({ appliedRules });
});

module.exports = router;
