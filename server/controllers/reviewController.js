const Review = require("../models/Review");
const Temple = require("../models/Temple");



// Add Review

const addReview = async(req,res)=>{

    try{

        const {

            templeId,

            rating,

            comment

        } = req.body;


        const alreadyReviewed =
        await Review.findOne({

            userId:req.user._id,

            templeId

        });


        if(alreadyReviewed){

            return res.status(400).json({

                message:"You already reviewed this temple"

            });

        }


        const review =
        await Review.create({

            userId:req.user._id,

            templeId,

            rating,

            comment

        });


        res.status(201).json({

            message:"Review Added Successfully",

            review

        });

    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// Temple Reviews

const getTempleReviews = async(req,res)=>{

    try{

        const reviews =
        await Review.find({

            templeId:req.params.templeId

        })
        .populate("userId","name");


        const total =
        reviews.reduce(

            (sum,r)=>sum+r.rating,

            0

        );


        const averageRating =
        reviews.length
        ?
        (total/reviews.length).toFixed(1)
        :
        0;


        res.json({

            totalReviews:reviews.length,

            averageRating,

            reviews

        });

    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// Update Review

const updateReview = async(req,res)=>{

    try{

        const review =
        await Review.findOne({

            _id:req.params.id,

            userId:req.user._id

        });


        if(!review){

            return res.status(404).json({

                message:"Review Not Found"

            });

        }


        review.rating =
        req.body.rating || review.rating;

        review.comment =
        req.body.comment || review.comment;


        await review.save();


        res.json({

            message:"Review Updated",

            review

        });

    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// Delete Review

const deleteReview = async(req,res)=>{

    try{

        const review =
        await Review.findOneAndDelete({

            _id:req.params.id,

            userId:req.user._id

        });


        if(!review){

            return res.status(404).json({

                message:"Review Not Found"

            });

        }


        res.json({

            message:"Review Deleted"

        });

    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

module.exports={

    addReview,

    getTempleReviews,

    updateReview,

    deleteReview

};