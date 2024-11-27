const mongoose = require('mongoose');

const StatChangeSchema = new mongoose.Schema({
    stat: String,
    change: Number
});

const EffectEntrySchema = new mongoose.Schema({
    effect: String,
    short_effect: String
});

const MoveMeta = new mongoose.Schema({
    crit_rate: { type: Number, default: 0 },
    drain: { type: Number, default: 0 },
    healing: { type: Number, default: 0 },
    min_hits: { type: Number, default: null },
    max_hits: { type: Number, default: null },
    min_turns: { type: Number, default: null },
    max_turns: { type: Number, default: null },
    stat_chance: { type: Number, default: 0 },
    status_chance: { type: Number, default: 0 },
    flinch_chance: { type: Number, default: 0 },
    stat_changes: [StatChangeSchema],
    ailment: { type: String, default: null },
    category: { type: String, required: true }
});

const MoveSchema = new mongoose.Schema({
    _id: {
        type: String,  // Will store German name as ID
        required: true
    },
    englishName: {    // Store English name separately
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    germanName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        default: null
    },
    accuracy: {
        type: Number,
        default: null
    },
    pp: {
        type: Number,
        required: true
    },
    damage_class: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        default: 0
    },
    effect: String,
    learnMethods: [{
        method: {
            type: String,
            ref: 'MoveLearnMethod',
            required: true
        },
        versionGroups: {
            type: [String],
            required: true
        }
    }]
});

const Move = mongoose.model('Move', MoveSchema);

module.exports = Move;