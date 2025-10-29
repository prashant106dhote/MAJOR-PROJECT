if(process.env.NODE_ENV != "production"){

  require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const Review = require("./models/reviews.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const user = require("./routes/user.js");




const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
      secret:process.env.SECRET
  },
  touchAfter:24 * 3600,
 })
 store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
  
 })
const sessionOption = {
  store,
  secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
  expires: Date.now() + 7*24*60*60*1000,   // 7 din
  maxAge: 7*24*60*60*1000,
  httpOnly:true
}

}


 
app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success =req.flash("success")
  res.locals.error =req.flash("error");
  res.locals.currUser = req.user; 
  next();
})


app.use("/",user);

app.use("/listings",listings)

  app.use((err, req, res, next) => {
    const { statusCode=500, message="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs",{message});
  });

  app.use((req, res, next) => {
  res.locals.country = req.query.country || "";
  next();})

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/textlisting", async (_req, res) => {
  let sampalList = new Listing({
    title: "the mount",
    description: "very beautiful place",
    price: 3000,
    location: "Kashmir",
    country: "India",
  });
  await sampalList.save();
  console.log("Saved data");
  res.send("Successfully saved data");
});

const  validateReview = (req,res,next)=>{
  let {error} =  reviewSchema.validate(req.body.review )
  
  
  // console.log(result)
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
 throw new ExpressError(400,  errMsg)
  }
  else{
    next();
  }

}

// review
// post route
app.post("/listings/:id/reviews",validateReview,wrapAsync( async(req,res)=>{
 let listing =  await Listing.findById(req.params.id);
 let newReview  =  new Review(req.body.review);
 listing.reviews.push(newReview);
    
   await newReview.save();
   await listing.save();
   req.flash("success", "Review Added Successfully!"); 
    
  
   res.redirect(`/listings/${listing._id}`)
   
}))   

// delete Review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/listings/${id}`)
}))



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});