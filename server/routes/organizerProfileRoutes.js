const express=require("express");

const router=express.Router();


const auth =
require("../middleware/authMiddleware");


const organizerOnly =
require("../middleware/organizerMiddleware");


const upload =
require("../middleware/uploadMiddleware");



const {

getOrganizerProfile,

updateOrganizerProfile,

changeOrganizerPassword,

organizerAnalytics


}=require("../controllers/organizerProfileController");





// Profile

router.get(

"/",

auth,

organizerOnly,

getOrganizerProfile

);




// Update Profile

router.put(

"/update",

auth,

organizerOnly,

upload.single("image"),

updateOrganizerProfile

);




// Change Password

router.put(

"/password",

auth,

organizerOnly,

changeOrganizerPassword

);




// Analytics

router.get(

"/analytics",

auth,

organizerOnly,

organizerAnalytics

);



module.exports=router;