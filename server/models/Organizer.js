const mongoose = require("mongoose");


const organizerSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        default:"organizer"
    }

},
{
    timestamps:true
});


module.exports = mongoose.model("Organizer", organizerSchema);