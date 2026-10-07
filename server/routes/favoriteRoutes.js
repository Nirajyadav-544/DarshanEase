const express = require("express");
const router = express.Router();

// 🔒 Authorized guard intercept node mapping
const protectUser = require("../middleware/authMiddleware");

// Destructured controller method bounds
const {
    addFavorite,
    getMyFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

// =========================================================================
// ❤️ 1. ADD TO FAVORITES ENDPOINTS (Universal Variable Proxy Injection)
// =========================================================================

// Pattern A: Matches your controller design hook: /api/favorite/add/:templeId
router.post(
    "/add/:templeId",
    protectUser,
    addFavorite
);

// Pattern B: 🌟 SECURE BINDING: Intercepts raw frontend cards payload: API.post('/favorite', { templeId })
router.post(
    "/",
    protectUser,
    async (req, res, next) => {
        try {
            const targetId = req.body.templeId || req.body.id;
            
            if (targetId) {
                // Injects the variable into all scopes so your controller never reads an undefined parameter
                req.params.templeId = targetId; 
                req.params.id = targetId;
                req.body.templeId = targetId;
                req.body.id = targetId;
                
                console.log(`📡 Route Proxy active. Forwarding mapped temple asset parameter string: ${targetId}`);
                return addFavorite(req, res, next);
            }
            
            return res.status(400).json({ success: false, message: "❌ Missing temple identifier key inside payload parameters." });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
);

// =========================================================================
// 📡 2. MY FAVORITES LEDGER QUERY ENDPOINT
// =========================================================================
router.get(
    "/",
    protectUser,
    getMyFavorites
);

// =========================================================================
// 💔 3. REMOVE FROM FAVORITES ENDPOINTS
// =========================================================================
router.delete(
    "/remove/:templeId",
    protectUser,
    removeFavorite
);

router.delete(
    "/:templeId",
    protectUser,
    removeFavorite
);
// =========================================================================
// 🧹 EMERGENCY LEDGER FLUSH: Clears stuck mock IDs out of your account array
// =========================================================================
router.post("/clear-stuck-cache", protectUser, async (req, res) => {
    try {
        const userId = req.user.id;
        // Wipes the entire favorites array clean inside MongoDB for this specific user
        await User.findByIdAndUpdate(userId, { $set: { favorites: [] } });
        console.log(`🧹 Database Flush: Cleared all legacy favorite IDs for User: ${userId}`);
        return res.status(200).json({ success: true, message: "Database array flushed clean! Test your heart clicks now." });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

