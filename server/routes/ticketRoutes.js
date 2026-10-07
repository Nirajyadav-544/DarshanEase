const express=require("express");

const router=express.Router();

const protectUser=require("../middleware/authMiddleware");


const {
    downloadTicket
}=require("../controllers/ticketController");



router.get(
"/:id",
protectUser,
downloadTicket
);



module.exports=router;