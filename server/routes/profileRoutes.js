const express=require("express");

const router=express.Router();


const auth =
require("../middleware/authMiddleware");


const upload =
require("../middleware/uploadMiddleware");



const {

getProfile,

updateProfile,

changePassword,

deleteAccount,

bookingHistory,

favoriteHistory


}=require("../controllers/profileController");




// Get Profile

router.get(

"/",

auth,

getProfile

);




// Update Profile

router.put(

"/update",

auth,

upload.single("image"),

updateProfile

);




// Change Password

router.put(

"/password",

auth,

changePassword

);




// Delete Account

router.delete(

"/delete",

auth,

deleteAccount

);




// Booking History

router.get(

"/bookings",

auth,

bookingHistory

);




// Favorite History

router.get(

"/favorites",

auth,

favoriteHistory

);



module.exports=router;