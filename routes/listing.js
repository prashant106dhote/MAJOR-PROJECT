const express = require("express")
const router = express.Router();
const Listing = require("../models/listing.js");


const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Review = require("../models/reviews.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")

const listingController = require("../controllers/listing.js")
const {storage} = require("../CloudConfig.js")

const multer  = require('multer')
const upload = multer({ storage })


router.get('/search', async (req, res) => {
  try {
    const { country } = req.query;
    let filter = {};

    if (country && country.trim() !== '') {
      // case-insensitive search (India / india / INdia sab chalega)
      filter.country = { $regex: new RegExp(country, 'i') };
    }

    const listings = await Listing.find(filter);

    res.render('listings/filterListing', {listings, country });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



router.route("/")
.get( wrapAsync(listingController.index))
.post(
 isLoggedIn,
  upload.single("listing[image]"),
   validateListing,
  wrapAsync(listingController.createListing));


  // New Route - Form to create new listing (Must be before "/:id")
router.get("/new",isLoggedIn,listingController.renderNewForm);






router.route("/:id")
// Update Route - Submit edited listing
.put(
  isLoggedIn , isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing))
  // Show Route
  .get( wrapAsync(listingController.showListing))
  // Delete Route
  .delete( isLoggedIn,isOwner ,wrapAsync(listingController.deleteListing));






// Edit Route - Form to edit a listing (Must be before "/:id")
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));
 







module.exports = router;