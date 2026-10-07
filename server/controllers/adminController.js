const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");




// =========================
// Admin Dashboard
// =========================

const dashboard = async(req,res)=>{

    try{


        const users =
        await User.countDocuments({
            role:"user"
        });



        const organizers =
        await User.countDocuments({
            role:"organizer"
        });



        const admins =
        await User.countDocuments({
            role:"admin"
        });



        const temples =
        await Temple.countDocuments();



        const bookings =
        await Booking.countDocuments();



        const revenue =
        await Booking.aggregate([

            {
                $match:{
                    paymentStatus:"Paid"
                }
            },


            {
                $group:{

                    _id:null,

                    total:{
                        $sum:500
                    }

                }
            }

        ]);



        res.status(200).json({

            users,

            organizers,

            admins,

            temples,

            bookings,

            revenue:
            revenue.length ?
            revenue[0].total :
            0

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};







// =========================
// Get All Users
// =========================


const getAllUsers = async(req,res)=>{


    try{


        const users =
        await User.find()
        .select("-password");



        res.status(200).json({

            count:users.length,

            users

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









// =========================
// Delete User
// =========================


const deleteUser = async(req,res)=>{


    try{


        const user =
        await User.findById(req.params.id);



        if(!user){

            return res.status(404).json({

                message:"User Not Found"

            });

        }



        await User.findByIdAndDelete(
            req.params.id
        );



        res.status(200).json({

            message:"User Deleted Successfully"

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









// =========================
// Get All Temples
// =========================


const getAllTemples = async(req,res)=>{


    try{


        const temples =
        await Temple.find()

        .populate(
            "organizerId",
            "name email"
        )

        .sort({
            createdAt:-1
        });



        res.status(200).json({

            count:temples.length,

            temples

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









// =========================
// Delete Temple
// =========================


const deleteTemple = async(req,res)=>{


    try{


        const temple =
        await Temple.findById(
            req.params.id
        );



        if(!temple){

            return res.status(404).json({

                message:"Temple Not Found"

            });

        }



        await Temple.findByIdAndDelete(
            req.params.id
        );



        res.status(200).json({

            message:"Temple Deleted Successfully"

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};









// =========================
// Get All Bookings
// =========================


const getAllBookings = async(req,res)=>{


    try{


        const bookings =
        await Booking.find()


        .populate(
            "userId",
            "name email"
        )


        .populate(
            "templeId",
            "name location"
        )


        .populate(
            "slotId",
            "date startTime endTime"
        )


        .sort({

            createdAt:-1

        });





        let totalVisitors = 0;



        bookings.forEach((booking)=>{


            if(
                booking.bookingStatus==="Confirmed"
            ){

                totalVisitors +=
                booking.numberOfPeople;

            }


        });




        res.status(200).json({

            count:bookings.length,

            totalVisitors,

            bookings

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


};




const getOrganizers = async(req,res)=>{


try{


const organizers =
await User.find({

role:"organizer"

})
.select("-password");



res.json({

count:organizers.length,

organizers

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};


// Approve Organizer


const approveOrganizer = async(req,res)=>{


try{


const organizer =
await User.findById(req.params.id);



if(!organizer){

return res.status(404).json({

message:"Organizer Not Found"

});

}



organizer.organizerStatus="Approved";


await organizer.save();



res.json({

message:"Organizer Approved"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};





const rejectOrganizer = async(req,res)=>{


try{


const organizer =
await User.findById(req.params.id);



organizer.organizerStatus="Rejected";


await organizer.save();



res.json({

message:"Organizer Rejected"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};




// =========================
// Export
// =========================


module.exports={


    dashboard,

    getAllUsers,

    deleteUser,

    getAllTemples,

    deleteTemple,

    getAllBookings,
    getOrganizers,
    approveOrganizer,
    rejectOrganizer


};