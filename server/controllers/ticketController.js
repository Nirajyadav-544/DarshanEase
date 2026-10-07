const Booking = require("../models/Booking");
const PDFDocument = require("pdfkit");


// Download Ticket PDF

const downloadTicket = async(req,res)=>{

    try{

        const booking = await Booking.findById(req.params.id)
        .populate("templeId","name location")
        .populate("slotId","date startTime endTime");


        if(!booking){

            return res.status(404).json({
                message:"Booking Not Found"
            });

        }



        const doc = new PDFDocument();


        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Darshan-Ticket-${booking.bookingId}.pdf`
        );


        doc.pipe(res);



        doc.fontSize(22)
        .text(
            "DARSHAN EASE",
            {
                align:"center"
            }
        );


        doc.moveDown();



        doc.fontSize(16)
        .text("Darshan Booking Ticket");



        doc.moveDown();



        doc.fontSize(12);


        doc.text(
            `Booking ID: ${booking.bookingId}`
        );


        doc.text(
            `Visitor Name: ${booking.visitorName}`
        );


        doc.text(
            `Phone: ${booking.visitorPhone}`
        );


        doc.text(
            `Temple: ${booking.templeId.name}`
        );


        doc.text(
            `Location: ${booking.templeId.location}`
        );


        doc.text(
            `Date: ${booking.slotId.date}`
        );


        doc.text(
            `Time: ${booking.slotId.startTime} - ${booking.slotId.endTime}`
        );


        doc.text(
            `People: ${booking.numberOfPeople}`
        );


        doc.text(
            `Status: ${booking.bookingStatus}`
        );


        doc.moveDown();


        doc.text(
            "Show this ticket during Darshan entry"
        );



        doc.end();



    }catch(error){


        res.status(500).json({
            message:error.message
        });


    }

};



module.exports={
    downloadTicket
};