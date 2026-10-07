const User = require("../models/User");
const bcrypt = require("bcrypt");

const Temple = require("../models/Temple");
const Booking = require("../models/Booking");



// ======================
// Get Organizer Profile
// ======================

const getOrganizerProfile = async(req,res)=>{

try{


const organizer =
await User.findById(req.user._id)
.select("-password");


res.json({

organizer

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};





// ======================
// Update Organizer Profile
// ======================

const updateOrganizerProfile = async(req,res)=>{

try{


const organizer =
await User.findById(req.user._id);



organizer.name =
req.body.name || organizer.name;



if(req.file){

organizer.profileImage =
`/uploads/${req.file.filename}`;

}



await organizer.save();



res.json({

message:"Organizer Profile Updated Successfully",

organizer

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};







// ======================
// Change Password
// ======================


const changeOrganizerPassword = async(req,res)=>{

try{


const {
oldPassword,
newPassword
}=req.body;



const organizer =
await User.findById(req.user._id);



const match =
await bcrypt.compare(
oldPassword,
organizer.password
);



if(!match){

return res.status(400).json({

message:"Old Password Incorrect"

});

}



organizer.password =
await bcrypt.hash(
newPassword,
10
);



await organizer.save();



res.json({

message:"Password Changed Successfully"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};








// ======================
// Organizer Analytics
// ======================


const organizerAnalytics = async(req,res)=>{

try{


const organizerId =
req.user._id;




const temples =
await Temple.countDocuments({

organizerId

});



const bookings =
await Booking.countDocuments({

organizerId

});




const visitors =
await Booking.aggregate([

{

$match:{

organizerId

}

},

{

$group:{

_id:null,

totalVisitors:{

$sum:"$numberOfPeople"

}

}

}

]);





const revenue =
await Booking.aggregate([

{

$match:{

organizerId,

paymentStatus:"Paid"

}

},

{

$group:{

_id:null,

totalRevenue:{

$sum:"$amount"

}

}

}

]);





res.json({

temples,

bookings,

visitors:
visitors.length
?
visitors[0].totalVisitors
:
0,


revenue:
revenue.length
?
revenue[0].totalRevenue
:
0


});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};






module.exports={


getOrganizerProfile,

updateOrganizerProfile,

changeOrganizerPassword,

organizerAnalytics


};