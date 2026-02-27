const express = require('express');
const router = express.Router();
const db = require('../data/db');

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get search suggestions
router.get('/suggestions', async (req, res) => {
    const query = req.query.q?.toLowerCase() || '';

    if (!query) {
        return res.json({ suggestions: [], trending: db.products.slice(0, 3) });
    }

    try {
        const catalog = db.products;

        // 1. Construct prompt to parse intent and find best matches
        const prompt = `
        You are a smart AI E-commerce Search Engine.
        The user searched for: "${query}".
        
        Here is the available catalog:
        ${JSON.stringify(catalog.map(p => ({ id: p.id, title: p.title, description: p.title })))}
        
        Find all products that are semantically relevant to the search query. Consider synonyms, use-cases, and general intent (e.g. "dry skin" should match a "Moisturizer").
        
        Return a simple comma-separated list of product IDs that match, ordered by relevance. If no products match, return "NONE".
        Do not return anything else except the IDs or "NONE".
        `;

        // 2. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const textResponse = result.response.text().trim();

        console.log(`[Gemini Search] Query: "${query}" | AI Response IDs: ${textResponse}`);

        if (textResponse === "NONE" || !textResponse) {
            return res.json({ suggestions: [], trending: [] });
        }

        // 3. Parse IDs and return full products
        const matchedIds = textResponse.split(',').map(id => id.trim());
        const suggestions = catalog.filter(p => matchedIds.includes(p.id));

        // Sort by the order Gemini returned them in
        suggestions.sort((a, b) => matchedIds.indexOf(a.id) - matchedIds.indexOf(b.id));

        res.json({ suggestions, trending: [] });
    } catch (error) {
        console.error('[Gemini AI Search Error]', error);

        // Fallback to basic string matching
        console.log('Falling back to basic string matching...');
        const results = db.products.filter(p => p.title.toLowerCase().includes(query));
        res.json({ suggestions: results, trending: [] });
    }
});

module.exports = router;
