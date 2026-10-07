const express=require("express");

const router=express.Router();

const upload=require("../middleware/uploadMiddleware");

const protectOrganizer=require("../middleware/organizerMiddleware");

const {

uploadImage

}=require("../controllers/uploadController");



router.post(

"/",

protectOrganizer,

upload.single("image"),

uploadImage

);


module.exports=router;