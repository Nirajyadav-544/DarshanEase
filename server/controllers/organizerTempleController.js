const Temple = require("../models/Temple");



// ======================
// Add Temple
// ======================

const addTemple = async(req,res)=>{

try{


const {
name,
location,
description,
openingTime,
closingTime
}=req.body;



const temple = await Temple.create({

name,

location,

description,


image:req.file ?
`/uploads/${req.file.filename}` 
: "",


openingTime,

closingTime,


organizerId:req.user._id


});



res.status(201).json({

message:"Temple Added Successfully",

temple

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};






// ======================
// My Temples
// ======================


const myTemples = async(req,res)=>{


try{


const temples =
await Temple.find({

organizerId:req.user._id

});



res.json({

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






// ======================
// Update Temple
// ======================


const updateTemple = async(req,res)=>{


try{


const temple =
await Temple.findOne({

_id:req.params.id,

organizerId:req.user._id

});



if(!temple){

return res.status(404).json({

message:"Temple Not Found"

});

}



temple.name =
req.body.name || temple.name;


temple.location =
req.body.location || temple.location;


temple.description =
req.body.description || temple.description;


temple.openingTime =
req.body.openingTime || temple.openingTime;


temple.closingTime =
req.body.closingTime || temple.closingTime;



if(req.file){

temple.image =
`/uploads/${req.file.filename}`;

}



await temple.save();



res.json({

message:"Temple Updated Successfully",

temple

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};






// ======================
// Delete Temple
// ======================


const deleteTemple = async(req,res)=>{


try{


const temple =
await Temple.findOneAndDelete({

_id:req.params.id,

organizerId:req.user._id

});



if(!temple){

return res.status(404).json({

message:"Temple Not Found"

});

}



res.json({

message:"Temple Deleted Successfully"

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};






module.exports={

addTemple,

myTemples,

updateTemple,

deleteTemple

};