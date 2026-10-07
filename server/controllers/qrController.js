const Booking = require("../models/Booking");


// Verify QR Booking

const verifyQR = async(req,res)=>{

    try{

        const {bookingId}=req.body;


        const booking = await Booking.findOne({
            bookingId
        })
        .populate("templeId","name location")
        .populate("userId","name email");



        if(!booking){

            return res.status(404).json({
                message:"Invalid QR / Booking Not Found"
            });

        }



        if(booking.bookingStatus==="Cancelled"){

            return res.status(400).json({
                message:"Booking Cancelled"
            });

        }



        res.status(200).json({

            message:"Valid Darshan Pass ✅",

            visitor:{
                name:booking.visitorName,
                phone:booking.visitorPhone,
                people:booking.numberOfPeople
            },

            temple:booking.templeId,

            bookingId:booking.bookingId,

            paymentStatus:booking.paymentStatus

        });



    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports={
    verifyQR
};