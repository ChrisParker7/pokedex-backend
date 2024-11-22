const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: [String],
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    evolutionChainId: {
        type: Number,
        default: null
    }
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;
