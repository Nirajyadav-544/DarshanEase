const mongoose = require("mongoose");

// =========================================================================
// ⏳ NESTED SLOT MATRIX SCHEMA (For Detailed Railway Capacity Routing)
// =========================================================================
const slotConfigurationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Morning", "Afternoon", "Evening", "VIP Fast-Track", "Maha Aarti Slot"],
        default: "Morning"
    },
    startTime: {
        type: String,
        required: true // e.g., "06:00 AM"
    },
    endTime: {
        type: String,
        required: true // e.g., "11:00 AM"
    },
    capacity: {
        type: Number,
        required: true,
        min: 0,
        default: 200 // Max capacity allowed for this explicit slice of time
    }
});

// =========================================================================
// 🛕 CENTRAL TEMPLE LEDGER SCHEMA
// =========================================================================
const templeSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    // 🌟 नेपाल के प्रांत/राज्य को ट्रैक करने के लिए
    state: {
        type: String,
        required: true,
        default: "Bagmati Province"
    },

    description: {
        type: String,
        required: true
    },

    // 🌟 नेपाल के मंदिरों की दिव्य गाथा स्टोर करने के लिए कड़ा हिस्ट्री लेज़र
    history: {
        type: String,
        required: true,
        default: "This celestial temple holds ancient spiritual heritage connected to the roots of Sanatan Dharma."
    },

    image: {
        type: String,
        default: ""
    },

    openingTime: {
        type: String,
        required: true
    },

    closingTime: {
        type: String,
        required: true
    },

    // 🚂 🌟 INTEGRATED RAILWAY SLOTS CRITERIA: Added capacity and structural matrix loops safely
    dailyCapacity: {
        type: Number,
        required: true,
        default: 1000 // Total combined target limit threshold per calendar day
    },

    slots: [slotConfigurationSchema], // Array indexing container mapping all slot times cleanly

    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // या "Organizer" जो आपके ऑथ स्कीमा का नाम हो
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Temple", templeSchema);

