const express = require("express");
const router = express.Router();

const {
    dashboard,
    getAllUsers,
    deleteUser,
    getAllTemples,
    deleteTemple,
    getAllBookings,
    getOrganizers,
    approveOrganizer,
    rejectOrganizer
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


// =========================
// Dashboard
// =========================

router.get(
    "/dashboard",
    auth,
    adminOnly,
    dashboard
);


// =========================
// Users
// =========================

router.get(
    "/users",
    auth,
    adminOnly,
    getAllUsers
);

router.delete(
    "/user/:id",
    auth,
    adminOnly,
    deleteUser
);


// =========================
// Temples
// =========================

router.get(
    "/temples",
    auth,
    adminOnly,
    getAllTemples
);

router.delete(
    "/temple/:id",
    auth,
    adminOnly,
    deleteTemple
);


// =========================
// Bookings
// =========================

router.get(
    "/bookings",
    auth,
    adminOnly,
    getAllBookings
);


// =========================
// Organizers
// =========================

router.get(
    "/organizers",
    auth,
    adminOnly,
    getOrganizers
);

router.put(
    "/organizer/approve/:id",
    auth,
    adminOnly,
    approveOrganizer
);

router.put(
    "/organizer/reject/:id",
    auth,
    adminOnly,
    rejectOrganizer
);


module.exports = router;