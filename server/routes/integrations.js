const express = require('express');
const router = express.Router();

let integrations = [
    { id: 'klaviyo', name: 'Klaviyo', type: 'Email/SMS', connected: true },
    { id: 'attentive', name: 'Attentive', type: 'SMS', connected: false },
    { id: 'recharge', name: 'Recharge', type: 'Subscriptions', connected: true },
    { id: 'tapcart', name: 'Tapcart', type: 'Mobile App', connected: false }
];

router.get('/', (req, res) => {
    res.json({ integrations });
});

router.post('/sync', (req, res) => {
    const { id, connected } = req.body;
    const index = integrations.findIndex(i => i.id === id);

    if (index !== -1) {
        integrations[index].connected = connected;
        res.json({ success: true, integration: integrations[index] });
    } else {
        res.status(404).json({ error: 'Integration not found' });
    }
});

module.exports = router;
