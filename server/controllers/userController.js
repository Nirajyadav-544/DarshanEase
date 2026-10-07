const User = require("../models/User");
const bcrypt = require("bcrypt");


// Get Profile

const getProfile = async(req,res)=>{

    try{

        const user = await User.findById(req.user.id)
        .select("-password");


        res.status(200).json({
            message:"User Profile",
            user
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Update Profile

const updateProfile = async(req,res)=>{

    try{

        const user = await User.findByIdAndUpdate(

            req.user.id,

            req.body,

            {
                new:true
            }

        ).select("-password");


        res.status(200).json({

            message:"Profile Updated",
            user

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Change Password

const changePassword = async(req,res)=>{

    try{

        const {
            oldPassword,
            newPassword
        }=req.body;


        const user = await User.findById(req.user.id);


        const match = await bcrypt.compare(
            oldPassword,
            user.password
        );


        if(!match){

            return res.status(400).json({
                message:"Old Password Wrong"
            });

        }


        user.password = await bcrypt.hash(
            newPassword,
            10
        );


        await user.save();


        res.json({

            message:"Password Changed Successfully"

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports={
    getProfile,
    updateProfile,
    changePassword
};