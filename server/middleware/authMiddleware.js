const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No Security Token Provided" });
        }

        // 🌟 सिंबल-फ्री रिप्लेसमेंट: स्क्वायर ब्रैकेट 'split' हटाकर सीधे क्लीन टोकन निकालना
        const token = authHeader.replace("Bearer ", "").trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Authorized User profile not found" });
        }

        req.user = user;
        return next(); // 🚀 सुरक्षित रूप से बुकिंग कंट्रोलर को आगे जाने का रास्ता देना
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token Node" });
    }
};

module.exports = protectUser;

