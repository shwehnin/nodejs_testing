const Joi = require("joi");

exports.category_create = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().allow(""),
}).options({allowUnknown: false});

exports.contact_create = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    
    body: Joi.string().required()
}).options({allowUnknown: false});


exports.user_create = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required()
}).options({allowUnknown: false});