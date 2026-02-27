const express = require('express');
const router = express.Router();
const db = require('../data/db');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Upsell triggered by Add to Cart
router.post('/upsell', async (req, res) => {
    const { productId, cartSubtotal, cartItems = [] } = req.body;

    try {
        // 1. Get current store catalog (Mocked via ShopifyService to match MVP)
        const catalog = db.products;

        // 2. Format cart context for the AI
        const addedProduct = catalog.find(p => p.id === productId);
        const cartContext = cartItems.map(item => item.title).join(', ');

        if (!addedProduct) {
            return res.json({ offer: null });
        }

        // 3. Construct the prompt for Gemini
        const prompt = `
        You are an elite E-commerce AI Merchandiser. 
        A customer just added "${addedProduct.title}" to their cart. 
        Their current cart total is $${cartSubtotal}.
        Items already in cart: ${cartContext || 'None'}.
        
        Here is the store's available product catalog:
        ${JSON.stringify(catalog.map(p => ({ id: p.id, title: p.title, price: p.price })))}
        
        Analyze the relationship between the added product and the catalog. 
        Select the SINGLE best product ID from the catalog to offer as an immediate, high-converting upsell or cross-sell.
        Do NOT recommend a product they already have in their cart.
        
        Return ONLY the numerical ID of the product. No extra text, no markdown.
        `;

        // 4. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const recommendedId = result.response.text().trim();

        console.log(`[Gemini AI] Recommended Upsell ID: ${recommendedId} for cart adding ${productId}`);

        // 5. Find the product and return offer
        const activeUpsell = catalog.find(p => p.id === recommendedId);

        if (activeUpsell) {
            res.json({ offer: activeUpsell, message: "AI Recommended Offer!" });
        } else {
            // AI returned an invalid ID, fallback to null
            console.warn('[Gemini AI] Returned invalid product ID.');
            res.json({ offer: null });
        }

    } catch (error) {
        console.error('[Gemini AI Error]', error);

        // Fallback to static rule engine if AI fails
        console.log('Falling back to static rules engine...');
        let activeUpsell = null;
        for (const rule of db.rules) {
            if (!rule.active) continue;
            if (rule.condition.type === 'cart_contains' && rule.condition.value === productId) {
                activeUpsell = db.products.find(p => p.id === rule.action.productId);
                break;
            }
        }
        res.json({ offer: activeUpsell, message: "Special offer unlocked!" });
    }
});

// Dynamic Bundles - Build Your Own
router.get('/bundles', (req, res) => {
    // Return a mock bundle configuration
    res.json({
        bundleId: 'b1',
        title: 'Custom Skincare Routine',
        description: 'Select 3 products and save 20%',
        requiredItems: 3,
        discountPercentage: 20,
        options: db.products
    });
});

// Complete the look
router.get('/complete-look/:productId', (req, res) => {
    const { productId } = req.params;
    const complementary = db.products.filter(p => p.id !== productId).slice(0, 3);
    res.json({ products: complementary });
});

module.exports = router;
