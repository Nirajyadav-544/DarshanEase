const DarshanSlot = require("../models/DarshanSlot");
const Temple = require("../models/Temple");


// ======================
// Create Slot
// ======================

const createSlot = async (req, res) => {

    try {

        const {
            templeId,
            date,
            startTime,
            endTime,
            totalSeats
        } = req.body;

        // Temple Check

        const temple = await Temple.findById(templeId);

        if (!temple) {

            return res.status(404).json({
                message: "Temple Not Found"
            });

        }

        // Only Own Temple

        if (temple.organizerId.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "You Can Manage Only Your Temple"
            });

        }

        // Duplicate Slot Check

        const exist = await DarshanSlot.findOne({

            templeId,
            date,
            startTime

        });

        if (exist) {

            return res.status(400).json({
                message: "Slot Already Exists"
            });

        }

        const slot = await DarshanSlot.create({

            templeId,

            organizerId: req.user._id,

            date,

            startTime,

            endTime,

            totalSeats,

            availableSeats: totalSeats

        });

        res.status(201).json({

            message: "Darshan Slot Created Successfully",

            slot

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ======================
// Get Temple Slots
// ======================

const getTempleSlots = async (req, res) => {

    try {

        const slots = await DarshanSlot.find({

            templeId: req.params.templeId

        }).sort({

            date: 1,
            startTime: 1

        });

        res.status(200).json({

            count: slots.length,

            slots

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ======================
// Organizer Own Slots
// ======================

const getMySlots = async (req, res) => {

    try {

        const slots = await DarshanSlot.find({

            organizerId: req.user._id

        }).populate(

            "templeId",
            "name location"

        );

        res.status(200).json({

            count: slots.length,

            slots

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ======================
// Update Slot
// ======================

const updateSlot = async (req, res) => {

    try {

        const slot = await DarshanSlot.findById(req.params.id);

        if (!slot) {

            return res.status(404).json({

                message: "Slot Not Found"

            });

        }

        if (slot.organizerId.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                message: "Not Allowed"

            });

        }

        Object.assign(slot, req.body);

        await slot.save();

        res.status(200).json({

            message: "Slot Updated Successfully",

            slot

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ======================
// Delete Slot
// ======================

const deleteSlot = async (req, res) => {

    try {

        const slot = await DarshanSlot.findById(req.params.id);

        if (!slot) {

            return res.status(404).json({

                message: "Slot Not Found"

            });

        }

        if (slot.organizerId.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                message: "Not Allowed"

            });

        }

        await slot.deleteOne();

        res.status(200).json({

            message: "Slot Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




module.exports = {

    createSlot,

    getTempleSlots,

    getMySlots,

    updateSlot,

    deleteSlot

};