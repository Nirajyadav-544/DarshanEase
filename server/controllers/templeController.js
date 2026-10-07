const Temple = require("../models/Temple");

// ======================
// Add Temple
// ======================

const addTemple = async (req, res) => {

    try {

        const {
            name,
            location,
            description,
            openingTime,
            closingTime
        } = req.body;

        const temple = await Temple.create({

            name,
            location,
            description,

            image: req.file
                ? `/uploads/${req.file.filename}`
                : "",

            openingTime,
            closingTime,

            organizerId: req.user._id

        });

        res.status(201).json({

            message: "Temple Added Successfully",
            temple

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Get All Temples
// ======================

const getAllTemples = async (req, res) => {

    try {

        const temples = await Temple.find()
            .populate("organizerId", "name email");

        res.status(200).json({

            count: temples.length,
            temples

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Organizer Own Temples
// ======================

const getMyTemples = async (req, res) => {

    try {

        const temples = await Temple.find({

            organizerId: req.user._id

        });

        res.status(200).json({

            count: temples.length,
            temples

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Get Single Temple
// ======================

const getSingleTemple = async (req, res) => {

    try {

        const temple = await Temple.findById(req.params.id)
            .populate("organizerId", "name email");

        if (!temple) {

            return res.status(404).json({

                message: "Temple Not Found"

            });

        }

        res.status(200).json(temple);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Update Temple
// ======================

const updateTemple = async (req, res) => {

    try {

        const temple = await Temple.findById(req.params.id);

        if (!temple) {

            return res.status(404).json({

                message: "Temple Not Found"

            });

        }

        if (temple.organizerId.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                message: "Not Allowed"

            });

        }

        temple.name = req.body.name || temple.name;
        temple.location = req.body.location || temple.location;
        temple.description = req.body.description || temple.description;
        temple.openingTime = req.body.openingTime || temple.openingTime;
        temple.closingTime = req.body.closingTime || temple.closingTime;

        if (req.file) {

            temple.image = `/uploads/${req.file.filename}`;

        }

        await temple.save();

        res.status(200).json({

            message: "Temple Updated Successfully",
            temple

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Delete Temple
// ======================

const deleteTemple = async (req, res) => {

    try {

        const temple = await Temple.findById(req.params.id);

        if (!temple) {

            return res.status(404).json({

                message: "Temple Not Found"

            });

        }

        if (temple.organizerId.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                message: "Not Allowed"

            });

        }

        await temple.deleteOne();

        res.status(200).json({

            message: "Temple Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================
// Search Temple
// ======================

const searchTemple = async (req, res) => {

    try {

        const { name, location } = req.query;

        let filter = {};

        if (name) {

            filter.name = {

                $regex: name,
                $options: "i"

            };

        }

        if (location) {

            filter.location = {

                $regex: location,
                $options: "i"

            };

        }

        const temples = await Temple.find(filter)
            .populate("organizerId", "name email");

        res.status(200).json({

            count: temples.length,
            temples

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    addTemple,
    getAllTemples,
    getMyTemples,
    getSingleTemple,
    updateTemple,
    deleteTemple,
    searchTemple

};