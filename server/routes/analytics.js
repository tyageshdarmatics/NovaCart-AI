const express = require('express');
const router = express.Router();
const db = require('../data/db');

// Track events
router.post('/track', (req, res) => {
    const { eventType, value } = req.body;

    if (eventType === 'view') {
        db.analytics.views++;
    } else if (eventType === 'visitor') {
        db.analytics.visitors++;
    } else if (eventType === 'order') {
        db.analytics.orders++;
        if (value) db.analytics.totalRevenue += value;
    }

    res.json({ success: true, analytics: db.analytics });
});

// Get metrics
router.get('/metrics', (req, res) => {
    const cr = db.analytics.visitors > 0 ? ((db.analytics.orders / db.analytics.visitors) * 100).toFixed(2) : 0;
    const rpv = db.analytics.visitors > 0 ? (db.analytics.totalRevenue / db.analytics.visitors).toFixed(2) : 0;

    res.json({
        metrics: {
            ...db.analytics,
            conversionRate: cr,
            revenuePerVisitor: rpv
        }
    });
});

module.exports = router;
