const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "user"
    },

    organizerStatus: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Rejected"
        ],
        default: "Pending"
    },

    profileImage: String,

    // 🌟 सुरक्षा और ओटीपी रिकवरी के लिए जोड़े गए 3 सबसे महत्वपूर्ण फ़ील्ड्स
    phone: {
        type: String,
        sparse: true // sparse लगाने से पुराने यूज़र्स को डुप्लीकेट नंबर का एरर नहीं आएगा
    },

    otpCode: {
        type: String
    },

    otpExpires: {
        type: Date
    },

    status: {
        type: String,
        enum: ["Active", "Suspended"],
        default: "Active"
    },
    accountStatus: {
        type: String,
        enum: ["Active", "Suspended"],
        default: "Active"
    }
}, { timestamps: true });

module.exports = mongoose.model(
    "User",
    UserSchema
);
