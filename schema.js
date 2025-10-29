const Joi = require("joi")
const listing = require("./models/listing")
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(), 
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.allow("", null), 
  }).required()
});

module.exports.reviewSchema = Joi.object({

    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
  
})