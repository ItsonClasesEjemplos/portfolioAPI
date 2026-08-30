const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    alias:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    species:{
        type:String,
        required: true,
    },
    age: {
        type:Number,
        required: false,
    },
    weakness:{
        type: String,
        required: false,
    },
    photo:{
        type: String,
        required: false,
    }
})

const characterModel = mongoose.model('Character',CharacterSchema, 'Character');

module.exports = characterModel;