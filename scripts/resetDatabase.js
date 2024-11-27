
const mongoose = require('mongoose');
const Pokemon = require('../models/pokemon');
const Move = require('../models/move');

const resetDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/pokedex');
        console.log('Connected to database');

        // Delete all documents from collections
        await Move.deleteMany({});
        await Pokemon.deleteMany({});

        console.log('Database reset successful');
    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        mongoose.connection.close();
    }
};

resetDatabase();