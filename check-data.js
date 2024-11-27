
const mongoose = require('mongoose');
const Pokemon = require('./models/pokemon');
const Move = require('./models/move');

mongoose.connect('mongodb://localhost:27017/pokedex')
    .then(async () => {
        // Count documents
        const pokemonCount = await Pokemon.countDocuments();
        const moveCount = await Move.countDocuments();

        console.log(`Found ${pokemonCount} Pokemon`);
        console.log(`Found ${moveCount} Moves`);

        // Get example Pokemon
        const examplePokemon = await Pokemon.findOne().populate('currentMoves');
        console.log('\nExample Pokemon:', {
            name: examplePokemon.name,
            types: examplePokemon.type,
            moves: examplePokemon.currentMoves
        });

        // Get example Move
        const exampleMove = await Move.findOne();
        console.log('\nExample Move:', {
            name: exampleMove.name,
            germanName: exampleMove.germanName,
            type: exampleMove.type,
            power: exampleMove.power
        });

        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error:', error);
        mongoose.connection.close();
    });