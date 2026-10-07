const Favorite = require("../models/Favorite");

// =========================================================================
// ❤️ 1. ADD TO FAVORITE: Atomic Deduplication (Never Throws Stale 400 Blocks)
// =========================================================================
const addFavorite = async (req, res) => {
    try {
        const { templeId } = req.params;
        const userId = req.user.id;

        // Inspects if the relational binding token already exists inside the cloud cluster collection
        const exist = await Favorite.findOne({ userId, templeId });

        if (exist) {
            // 🚀 ID POTENCY FIX: If already saved, return a clean 200 Success state instead of a blocking 400 error!
            return res.status(200).json({
                success: true,
                message: "Already Added To Favorite",
                favorite: exist
            });
        }

        // Creates a new tracking document token cleanly
        const favorite = await Favorite.create({ userId, templeId });

        return res.status(201).json({
            success: true,
            message: "Added To Favorite",
            favorite
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// =========================================================================
// 📡 2. GET MY FAVORITES: Auto-Flattened Data Stream (Locks onto Front-End UI Keys)
// =========================================================================
const getMyFavorites = async (req, res) => {
    try {
        const rawFavorites = await Favorite.find({ userId: req.user.id })
            .populate("templeId");

        // 🚀 THE ULTIMATE CROSS-STACK SYNC GUARD:
        // Extracts the populated nested temple objects out of the parent wrapper block 
        // to return a flat temple document array matching exactly what your front-end maps!
        const flattenedTemplesArray = rawFavorites
            .filter(item => item && item.templeId) // Drop corrupted or dangling document traces safely
            .map(item => {
                return {
                    ...item.templeId._doc, // Copies all primary temple schemas parameters (name, location, state, image)
                    favoriteRecordId: item._id // Backs up the favorite collection index tracking string
                };
            });

        return res.status(200).json({
            success: true,
            message: "My Favorites",
            favorites: flattenedTemplesArray // Sends a highly readable flat array straight to your layout grids
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// =========================================================================
// 💔 3. REMOVE FROM FAVORITE: Emergency Eraser
// =========================================================================
const removeFavorite = async (req, res) => {
    try {
        const { templeId } = req.params;
        const userId = req.user.id;

        const deletedDocument = await Favorite.findOneAndDelete({ userId, templeId });

        return res.status(200).json({
            success: true,
            message: "Removed From Favorite",
            deletedId: templeId
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addFavorite,
    getMyFavorites,
    removeFavorite
};
