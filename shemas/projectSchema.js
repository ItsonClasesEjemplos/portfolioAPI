const Joi = require('joi');
const { ObjectId } = require('mongodb');


const id = Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectID');
const userId = Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectID');
const title = Joi.string().min(3).max(100);
const description = Joi.string().min(3).max(1024);
const repository = Joi.string().min(10).max(300);
const technologies = Joi.array();
const images = Joi.array();


const createProjectSchema = Joi.object({
    title: title.required(),
    description: description.required(),
    repository: repository,
    technologies: technologies,
    images: images
});


const getProjectSchema = Joi.object({
    id: id.required()
});


module.exports = {
    createProjectSchema,
    getProjectSchema
};
