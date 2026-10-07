const uploadImage=(req,res)=>{

    try{

        if(!req.file){

            return res.status(400).json({

                message:"No Image Uploaded"

            });

        }


        res.status(200).json({

            message:"Image Uploaded Successfully",

            imageUrl:
            `http://localhost:5000/uploads/${req.file.filename}`

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};


module.exports={

    uploadImage

};