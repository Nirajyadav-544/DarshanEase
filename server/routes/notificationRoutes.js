const express = require("express");

const router = express.Router();


const auth = require("../middleware/authMiddleware");


const {

    createNotification,

    getMyNotifications,

    markRead,

    deleteNotification

} = require("../controllers/notificationController");





// ======================
// Create Notification
// User/System/Admin use
// ======================

router.post(

    "/create",

    auth,

    createNotification

);







// ======================
// Get My Notifications
// ======================

router.get(

    "/my",

    auth,

    getMyNotifications

);







// ======================
// Mark Notification Read
// ======================

router.put(

    "/read/:id",

    auth,

    markRead

);







// ======================
// Delete Notification
// ======================

router.delete(

    "/:id",

    auth,

    deleteNotification

);






module.exports = router;