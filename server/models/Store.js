const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    shop_domain: {
        type: String,
        required: true,
        unique: true
    },
    admin_access_token: {
        type: String,
        required: true
    },
    // We can add other store-specific configuration here later
    settings: {
        upsell_enabled: { type: Boolean, default: true },
        recommendations_enabled: { type: Boolean, default: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
