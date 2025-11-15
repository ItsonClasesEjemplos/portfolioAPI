const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    itsonId: {
        type: String,
        required: true,
        min: 6,
        max: 11
    }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;