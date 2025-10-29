const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")

  module.exports.isLoggedIn = (req,res,next)=>{
  
  
  if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
    req.flash("error","you must be logged in to creat listing!")
    return  res.redirect("/login")
   }
   next();  
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl =req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
   const listing= await Listing.findById(id);
   if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of  this listing ");
   return res.redirect(`/listings/${id}`);

   }
   return next();
}

module.exports.validateListing = (req,res,next)=>{
  let {error} =  listingSchema.validate(req.body)
  
  
  // console.log(result)
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
 throw new ExpressError(400,  errMsg)
  }
  else{
    next();
  }

}