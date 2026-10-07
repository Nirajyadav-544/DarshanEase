const mongoose = require("mongoose");


const favoriteSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    templeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Temple",
        required:true
    }

},
{
    timestamps:true
});


module.exports = mongoose.model("Favorite", favoriteSchema);