const Joi = require('joi');

const carSchema = Joi.object({
    car: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        email: Joi.string().email().required(),
        phone_number: Joi.string().required(),
        price: Joi.number().required(),
        VIN: Joi.string().required(),
        year_model: Joi.number().required(),
        transmission: Joi.string().required(),
        driven: Joi.string().required(),
        fuel_type: Joi.string().required(),
        owner: Joi.string().required(),
        pictureInside: Joi.string().optional(),
        pictureOutside: Joi.string().optional()
    }).required()
});

module.exports = { carSchema };


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().max(5).min(1),
        body: Joi.string().required()
    }).required()
})  