const Notification = require("../models/Notification");



// ======================
// Create Notification
// ======================

const createNotification = async(req,res)=>{

    try{


        const {
            title,
            message,
            type
        } = req.body;



        const notification =
        await Notification.create({

            userId:req.user._id,

            title,

            message,

            type

        });



        res.status(201).json({

            message:"Notification Created",

            notification

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};





// ======================
// Get My Notifications
// ======================


const getMyNotifications = async(req,res)=>{

    try{


        const notifications =
        await Notification.find({

            userId:req.user._id

        })
        .sort({

            createdAt:-1

        });



        res.status(200).json({

            count:notifications.length,

            notifications

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};







// ======================
// Mark Notification Read
// ======================


const markRead = async(req,res)=>{

    try{


        const notification =
        await Notification.findByIdAndUpdate(

            req.params.id,

            {
                isRead:true
            },

            {
                new:true
            }

        );



        if(!notification){

            return res.status(404).json({

                message:"Notification Not Found"

            });

        }



        res.json({

            message:"Notification Read",

            notification

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};








// ======================
// Delete Notification
// ======================


const deleteNotification = async(req,res)=>{

    try{


        const notification =
        await Notification.findByIdAndDelete(

            req.params.id

        );



        if(!notification){

            return res.status(404).json({

                message:"Notification Not Found"

            });

        }



        res.json({

            message:"Notification Deleted"

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};








module.exports={


    createNotification,

    getMyNotifications,

    markRead,

    deleteNotification


};