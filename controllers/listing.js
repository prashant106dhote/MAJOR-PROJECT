const axios = require("axios");
const listing = require("../models/listing");
const Listing = require("../models/listing");

module.exports.index  = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index.ejs", { alllisting });
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  res.render("listings/show.ejs", { listing });
  console.log(listing);


  
}
module.exports.createListing = async (req, res) => {
   let url = req.file.path;
   let filename = req.file.filename;
   
   
  
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image ={url,filename}
  await newlisting.save();
  req.flash("success","New Listing Created!")
  res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename}
   await listing.save();
   } 
    req.flash("success"," Listing Updated!")
   
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
   req.flash("success"," Listing  is Deleted!")
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  await Listing.findById(id);
  if(!listing){
    req.flash("error","listing you requested for does not exist!")
    res.redirect("/listings");
  }
  
}
module.exports.renderNewForm = (req, res) => {
 
  res.render("listings/new.ejs");
}