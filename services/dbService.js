const {atlas } = require('../config/dbConfig');

const mongoose = require('mongoose');

const startMongoAtlas = ()=>{
    mongoose.connect(atlas.url)
        .then(()=> console.log('Connected to MongoDB Atlas'))
        .catch((err)=> console.log('Could not connect to MongoDB Atlas'))
}

module.exports = { startMongoAtlas };
