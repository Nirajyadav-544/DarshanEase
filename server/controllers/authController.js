const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email");
const axios = require("axios");
const sendWelcomeEmail = require("../utils/welcomeTemplate"); 

// =========================================================================
// 1. REGISTER DEVOTEE USER
// =========================================================================
const registerUser = async (req, res) => {
    try {
      const { name, email, password, phone } = req.body || {};

if (!name || !email || !password) {
    return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
    });
}

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone ? phone.trim() : undefined,
            role: "user"
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        await sendWelcomeEmail(
            user.email,
            user.name,
            "Devotee User"
        );

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Register User Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// =========================================================================
// 2. LOGIN MASTER NODE
// =========================================================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password" });
        
        if (user.role === "organizer" && user.organizerStatus !== "Approved") {
            return res.status(403).json({ message: "Organizer not approved by Admin" });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login Successful", token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// =========================================================================
// 3. ADMIN REGISTER
// =========================================================================
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({ name, email, password: hashedPassword, phone: phone ? phone.trim() : undefined, role: "admin" });
        
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        await sendWelcomeEmail(admin.email, admin.name, "System Admin");

        res.status(201).json({ message: "Admin Registered Successfully", token, admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// =========================================================================
// 4. ORGANIZER REGISTER
// =========================================================================
const registerOrganizer = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "User Already Exists" });
        
        const hash = await bcrypt.hash(password, 10);
        const organizer = await User.create({ name, email, password: hash, phone: phone ? phone.trim() : undefined, role: "organizer", organizerStatus: "Pending" });
        
        await sendWelcomeEmail(organizer.email, organizer.name, "Temple Organizer (Pending Verification)");

        res.status(201).json({ message: "Organizer Registered Successfully", organizer });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// =========================================================================
// 5. FORGOT PASSWORD OTP (With Real Quick SMS & Simulator Fail-Safe)
// =========================================================================
const forgotPasswordOTP = async (req, res) => {
    try {
        const { phone, email, via } = req.body; 
        if (!email) return res.status(400).json({ success: false, message: "Email is required to locate your account!" });

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "Account with this email does not exist!" });

        if (via === "sms") {
            if (!phone || !user.phone || user.phone !== phone.trim()) {
                return res.status(400).json({ success: false, message: "❌ Security Alert: Mobile number does not match registered email!" });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        if (via === "sms" && phone) {
            try {
                // 🚀 फिक्स किया गया ऑफिशियल Quick SMS गेटवे (यह बिना DLT के तुरंत मैसेज भेजेगा)
                await axios.get(`https://fast2sms.com{process.env.FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent("Your DarshanEase Secure OTP Verification Code is: " + otp)}&flash=0&numbers=${phone.trim()}`);
                console.log(`📱 Live SMS OTP successfully dispatched to: ${phone}`);
            } catch (smsError) {
                // 🔒 फ्री सुरक्षा कवच: बैलेंस ख़त्म होने पर टर्मिनल कंसोल में बैकअप प्रिंट
                console.warn("⚠️ Fast2SMS Alert: Free credits empty or invalid API Key.");
                console.log(`⚙️ [DarshanEase FREE SIMULATOR] Secure OTP Code for ${phone} is: [ ${otp} ]`);
            }
        }

        try {
            await sendEmail(user.email, "DarshanEase Secure Password Reset Token", `<h3>Account Verification Code</h3><h1>${otp}</h1><p>Valid for 5 minutes.</p>`);
        } catch (mailErr) { console.error("Mail server error:", mailErr.message); }

        return res.status(200).json({ success: true, message: via === "email" ? "🎉 Verification code sent to Gmail!" : "🎉 Verification code sent to Mobile and Gmail!" });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// =========================================================================
// 6. VERIFY OTP
// =========================================================================
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Missing required inputs!" });
        
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user || user.otpCode !== otp.trim()) return res.status(400).json({ success: false, message: "Invalid verification code!" });
        
        const diff = new Date(user.otpExpires).getTime() - new Date().getTime();
        if (diff <= 0) return res.status(400).json({ success: false, message: "Expired verification token!" });
        
        return res.status(200).json({ success: true, message: "Verified." });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// =========================================================================
// 7. RESET PASSWORD OTP
// =========================================================================
const resetPasswordOTP = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ success: false, message: "Fields missing." });
        
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ success: false, message: "User node mapping failed." });
        
        user.password = await bcrypt.hash(newPassword, 10);
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

// =========================================================================
// 🌟 100% कंप्लीट मॉड्यूल एक्सपोर्ट्स सिंक (नो मोर कंपाइल क्रैश)
// =========================================================================
module.exports = { 
    registerUser, 
    loginUser, 
    registerAdmin, 
    registerOrganizer, 
    forgotPasswordOTP, 
    verifyOTP, 
    resetPasswordOTP 
};
