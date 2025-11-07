const mongoose = require('mongoose');
const { atlas } = require('../config/dbConfig');

let isConnected = false;
const startMongoAtlas = async () => {
    if (isConnected) {
        console.log('Reusing existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(atlas.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // mejora la estabilidad
        });

        isConnected = db.connections[0].readyState === 1;
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Could not connect to MongoDB Atlas:', err.message);
        throw err;
    }
};

module.exports = { startMongoAtlas };
