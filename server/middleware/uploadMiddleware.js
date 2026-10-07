const multer = require("multer");
const path = require("path");


// Storage Configuration

const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,"uploads/");

    },


    filename:function(req,file,cb){

        const uniqueName =
        Date.now() +
        "-" +
        file.originalname;


        cb(null,uniqueName);

    }

});




// File Filter

const fileFilter = (req,file,cb)=>{


    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png"

    ];



    if(allowedTypes.includes(file.mimetype)){

        cb(null,true);

    }
    else{

        cb(
            new Error("Only JPG, JPEG and PNG images are allowed"),
            false
        );

    }


};




// Upload Configuration

const upload = multer({

    storage:storage,

    fileFilter:fileFilter,


    limits:{

        fileSize:5 * 1024 * 1024

    }


});



module.exports = upload;