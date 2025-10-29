const mongoose  =  require("mongoose");
// const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review =  require("./reviews.js");
const { string } = require("joi");

 const listingSchema  = new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    image:{
       url:String,
       filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
     owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        },
    

  
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
    }

  })
const listing = new mongoose.model("listing",listingSchema)
module.exports = listing;