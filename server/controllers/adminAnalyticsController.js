const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");




// ============================
// Admin Analytics Dashboard
// ============================


const adminAnalytics = async(req,res)=>{


try{


// Total Users

const users =
await User.countDocuments({

role:"user"

});



// Total Organizers

const organizers =
await User.countDocuments({

role:"organizer"

});




// Approved Organizers

const approvedOrganizers =
await User.countDocuments({

role:"organizer",

organizerStatus:"Approved"

});




// Pending Organizers

const pendingOrganizers =
await User.countDocuments({

role:"organizer",

organizerStatus:"Pending"

});




// Total Temples

const temples =
await Temple.countDocuments();




// Total Bookings

const bookings =
await Booking.countDocuments();





// Total Revenue

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

totalRevenue:{

$sum:"$amount"

}

}

}

]);





res.json({

users,

organizers,

approvedOrganizers,

pendingOrganizers,

temples,

bookings,

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









// ============================
// Monthly Booking Report
// ============================


const monthlyBookings = async(req,res)=>{


try{


const data =
await Booking.aggregate([

{

$group:{

_id:{

month:{
$month:"$createdAt"
}

},

total:{

$sum:1

}

}

},

{

$sort:{

"_id.month":1

}

}


]);



res.json(data);


}
catch(error){

res.status(500).json({

message:error.message

});

}


};








// ============================
// Monthly Revenue Report
// ============================


const monthlyRevenue = async(req,res)=>{


try{


const data =
await Booking.aggregate([


{

$match:{

paymentStatus:"Paid"

}

},


{

$group:{

_id:{

month:{
$month:"$createdAt"
}

},

revenue:{

$sum:"$amount"

}

}

},


{

$sort:{

"_id.month":1

}

}


]);



res.json(data);


}
catch(error){

res.status(500).json({

message:error.message

});

}


};









// ============================
// Top Temples
// ============================


const topTemples = async(req,res)=>{


try{


const data =
await Booking.aggregate([


{

$group:{

_id:"$templeId",

totalBookings:{

$sum:1

}

}

},


{

$sort:{

totalBookings:-1

}

},


{

$limit:5

},


{

$lookup:{

from:"temples",

localField:"_id",

foreignField:"_id",

as:"temple"

}

}


]);



res.json(data);



}
catch(error){

res.status(500).json({

message:error.message

});

}


};







module.exports={


adminAnalytics,

monthlyBookings,

monthlyRevenue,

topTemples


};