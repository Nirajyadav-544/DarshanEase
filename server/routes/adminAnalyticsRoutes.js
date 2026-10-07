const express=require("express");

const router=express.Router();


const auth =
require("../middleware/authMiddleware");


const adminOnly =
require("../middleware/adminMiddleware");



const {

adminAnalytics,

monthlyBookings,

monthlyRevenue,

topTemples


}=require("../controllers/adminAnalyticsController");





// Main Dashboard

router.get(

"/",

auth,

adminOnly,

adminAnalytics

);





// Monthly Bookings

router.get(

"/monthly-bookings",

auth,

adminOnly,

monthlyBookings

);





// Monthly Revenue

router.get(

"/monthly-revenue",

auth,

adminOnly,

monthlyRevenue

);





// Top Temples

router.get(

"/top-temples",

auth,

adminOnly,

topTemples

);



module.exports=router;