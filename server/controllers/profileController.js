const User = require("../models/User");
const bcrypt = require("bcrypt");
const Booking = require("../models/Booking");
const Favorite = require("../models/Favorite");



// ======================
// Get Profile
// ======================

const getProfile = async(req,res)=>{

try{


const user =
await User.findById(req.user._id)
.select("-password");


res.json({

user

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};





// ======================
// Update Profile
// ======================

const updateProfile = async(req,res)=>{

try{


const user =
await User.findById(req.user._id);



user.name =
req.body.name || user.name;



if(req.file){

user.profileImage =
`/uploads/${req.file.filename}`;

}



await user.save();



res.json({

message:"Profile Updated Successfully",

user

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


const changePassword = async(req,res)=>{

try{


const {
oldPassword,
newPassword
}=req.body;



const user =
await User.findById(req.user._id);



const match =
await bcrypt.compare(
oldPassword,
user.password
);



if(!match){

return res.status(400).json({

message:"Old Password Incorrect"

});

}



user.password =
await bcrypt.hash(
newPassword,
10
);



await user.save();



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
// Delete Account
// ======================


const deleteAccount = async(req,res)=>{

try{


await User.findByIdAndDelete(
req.user._id
);



res.json({

message:"Account Deleted Successfully"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};








// ======================
// Booking History
// ======================


const bookingHistory = async(req,res)=>{

try{


const bookings =
await Booking.find({

userId:req.user._id

})
.populate(
"templeId",
"name location"
);



res.json({

count:bookings.length,

bookings

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};







// ======================
// Favorite History
// ======================


const favoriteHistory = async(req,res)=>{

try{


const favorites =
await Favorite.find({

userId:req.user._id

})
.populate(
"templeId",
"name location"
);



res.json({

count:favorites.length,

favorites

});


}
catch(error){

res.status(500).json({

message:error.message

});

}

};






module.exports={

getProfile,

updateProfile,

changePassword,

deleteAccount,

bookingHistory,

favoriteHistory

};