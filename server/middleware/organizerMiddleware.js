const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectOrganizer = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "No Token Provided"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const organizer = await User.findById(decoded.id)
            .select("-password");

        if (!organizer) {

            return res.status(404).json({
                message: "Organizer Not Found"
            });

        }

        // Check Role

        if (organizer.role !== "organizer") {

            return res.status(403).json({
                message: "Organizer Access Only"
            });

        }

        // Check Approval

        if (organizer.organizerStatus !== "Approved") {

            return res.status(403).json({
                message: "Organizer Not Approved By Admin"
            });

        }

        req.user = organizer;

        next();

    }
    catch (error) {

        res.status(401).json({
            message: "Invalid Token"
        });

    }

};

module.exports = protectOrganizer;