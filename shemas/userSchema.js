const Joi = require('joi');


const name = Joi.string().min(3).max(255).required();
const email = Joi.string().min(6).max(255).email().required();
const password = Joi.string().min(6).max(1024).required();
const itsonId = Joi.string().min(6).max(6).required();

const userRegisterSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    password: password.required(),
    itsonId: itsonId.required(),
});


const userLoginSchema = Joi.object({
    email: name.required(),
    password: password.required()
})

module.exports = { userRegisterSchema, userLoginSchema };