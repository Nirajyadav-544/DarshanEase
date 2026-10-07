const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {

addReview,

getTempleReviews,

updateReview,

deleteReview

}=require("../controllers/reviewController");



// Add Review

router.post(

"/add",

auth,

addReview

);



// Temple Reviews

router.get(

"/:templeId",

getTempleReviews

);



// Update Review

router.put(

"/:id",

auth,

updateReview

);



// Delete Review

router.delete(

"/:id",

auth,

deleteReview

);

module.exports=router;