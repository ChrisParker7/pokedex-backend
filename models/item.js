
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['healing', 'battle', 'catching', 'key', 'held']
    },
    attributes: [{
        type: String,
        enum: ['consumable', 'usable_in_battle', 'usable_outside_battle', 'holdable']
    }],
    price: {
        type: Number,
        default: 0,
        min: 0
    }
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;