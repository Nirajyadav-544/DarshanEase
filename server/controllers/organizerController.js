const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ===================================
// Organizer Register
// ===================================

const registerOrganizer = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingOrganizer = await User.findOne({ email });

        if (existingOrganizer) {
            return res.status(400).json({
                message: "Organizer already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const organizer = await User.create({

            name,
            email,
            password: hashedPassword,
            role: "organizer",
            organizerStatus: "Pending"

        });

        res.status(201).json({

            message: "Organizer Registered Successfully. Waiting For Admin Approval",

            organizer: {

                id: organizer._id,
                name: organizer.name,
                email: organizer.email,
                role: organizer.role,
                organizerStatus: organizer.organizerStatus

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ===================================
// Organizer Login
// ===================================

const loginOrganizer = async (req, res) => {

    try {

        const { email, password } = req.body;

        const organizer = await User.findOne({
            email,
            role: "organizer"
        });

        if (!organizer) {

            return res.status(404).json({
                message: "Organizer not found"
            });

        }

        if (organizer.organizerStatus !== "Approved") {

            return res.status(403).json({
                message: "Your account is not approved by Admin"
            });

        }

        const isMatch = await bcrypt.compare(

            password,
            organizer.password

        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(

            {

                id: organizer._id,
                role: organizer.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            message: "Organizer Login Successful",

            token,

            organizer: {

                id: organizer._id,
                name: organizer.name,
                email: organizer.email,
                role: organizer.role

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ===================================
// Organizer Dashboard
// ===================================

const dashboard = async (req, res) => {

    try {

        const temples = await Temple.countDocuments({

            organizerId: req.user.id

        });

        const bookings = await Booking.countDocuments({

            organizerId: req.user.id

        });

        const visitors = await Booking.aggregate([

            {

                $match: {

                    organizerId: req.user.id,
                    bookingStatus: "Confirmed"

                }

            },

            {

                $group: {

                    _id: null,

                    total: {

                        $sum: "$numberOfPeople"

                    }

                }

            }

        ]);

        res.status(200).json({

            temples,

            bookings,

            visitors: visitors.length ? visitors[0].total : 0

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===================================
// Organizer Temple Management
// ===================================

const addTemple = async(req,res)=>{

};

const getMyTemples = async(req,res)=>{

};

const updateTemple = async(req,res)=>{

};

const deleteTemple = async(req,res)=>{

};


module.exports={

    registerOrganizer,

    loginOrganizer,

    dashboard,

    addTemple,

    getMyTemples,

    updateTemple,

    deleteTemple

};