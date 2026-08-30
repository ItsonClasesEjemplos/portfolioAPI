const Joi = require('joi');
const { ObjectId } = require('mongodb');

const id = Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectID');

const name = Joi.string().min(2).max(100);
const alias = Joi.string().min(2).max(100);
const description = Joi.string().min(3).max(2000);
const species = Joi.string().min(2).max(100);
const age = Joi.number().min(0);
const weakness = Joi.string().max(500);
const photo = Joi.string().uri().allow('');

const createCharacterSchema = Joi.object({
    name: name.required(),
    alias: alias.required(),
    description: description.required(),
    species: species.required(),
    age: age,
    weakness: weakness,
    photo: photo
});

const getCharacterSchema = Joi.object({
    id: id.required()
});

const getCharacterByNameSchema = Joi.object({
    name: name.required()
});

const getCharacterByAliasSchema = Joi.object({
    alias: alias.required()
});

module.exports = {
    createCharacterSchema,
    getCharacterSchema,
    getCharacterByNameSchema,
    getCharacterByAliasSchema
};
