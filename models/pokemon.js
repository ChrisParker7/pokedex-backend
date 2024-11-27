const mongoose = require('mongoose');
const { gameSettings } = require('../config/gameConfig');

const StatSchema = new mongoose.Schema({
    hp: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    'special-attack': { type: Number, required: true },
    'special-defense': { type: Number, required: true },
    speed: { type: Number, required: true }
});

// Remove or comment out the old MoveSchema
// const MoveSchema = new mongoose.Schema({ ... });

const LearnableMoveSchema = new mongoose.Schema({
    move: {
        type: String,  // German name as reference
        ref: 'Move',
        required: true
    },
    level_learned_at: {
        type: Number,
        required: true
    },
    current_pp: {
        type: Number,
        required: true
    },
    max_pp: {
        type: Number,
        required: true
    },
    moveDetails: {
        type: {
            type: String,
            required: true
        },
        power: Number,
        accuracy: Number,
        pp: Number,
        damage_class: String,
        priority: Number
    }
});

const EvolutionSchema = new mongoose.Schema({
    evolves_to: { type: String },
    level: { type: Number },
    item: { type: String, ref: 'Item' },
    friendship: { type: Number },
    condition: { type: String },  // For other evolution conditions
    trigger: { type: String }     // Evolution trigger type
});

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
    },
    level: {
        type: Number,
        default: gameSettings.startingLevel,
        min: 1,
        max: gameSettings.maxLevel
    },
    experience: {
        type: Number,
        default: gameSettings.startingExperience,
        min: 0
    },
    heldItem: {
        type: String,
        ref: 'Item',
        default: null
    },
    stats: {
        type: StatSchema,
        required: true
    },
    moves: [LearnableMoveSchema],  // Use LearnableMoveSchema instead of MoveSchema
    currentMoves: [{
        type: String,
        ref: 'Move'
    }],
    evolution: EvolutionSchema
});

// Add a validator for currentMoves
PokemonSchema.path('currentMoves').validate(function (value) {
    return value.length <= gameSettings.movesPerPokemon;
}, `Pokemon can only have up to ${gameSettings.movesPerPokemon} moves.`);

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;
