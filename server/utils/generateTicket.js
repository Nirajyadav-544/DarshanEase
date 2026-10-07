const PDFDocument = require("pdfkit");
const fs = require("fs");


const generateTicket = (booking)=>{

    return new Promise((resolve,reject)=>{


        const fileName =
        `ticket-${booking.bookingId}.pdf`;


        const path =
        `uploads/${fileName}`;



        const doc = new PDFDocument();



        const stream =
        fs.createWriteStream(path);



        doc.pipe(stream);



        doc.fontSize(22)
        .text("DARSHAN EASE",{
            align:"center"
        });



        doc.moveDown();



        doc.fontSize(16)
        .text("Darshan Booking Ticket");



        doc.moveDown();



        doc.fontSize(12)
        .text(
`
Booking ID:
${booking.bookingId}


Visitor Name:
${booking.visitorName}


Phone:
${booking.visitorPhone}


Number Of People:
${booking.numberOfPeople}


Status:
${booking.bookingStatus}


Thank You For Using Darshan Ease 🙏

`
        );



        doc.end();



        stream.on("finish",()=>{

            resolve(path);

        });



        stream.on("error",(error)=>{

            reject(error);

        });



    });

};


module.exports = generateTicket;