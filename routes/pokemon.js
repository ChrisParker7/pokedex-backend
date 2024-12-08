const express = require('express');
const router = express.Router();
const Pokemon = require('../models/pokemon');
const Move = require('../models/move');

// First, define any specific routes
router.get('/debug/:name', async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Get move details with explicit field selection
        const moveDetails = await Move.find(
            { _id: { $in: pokemon.moves.map(m => m.move) } },
            'germanName type power accuracy pp damage_class'
        );

        res.json({
            pokemonMoves: pokemon.moves,
            foundMoveDetails: moveDetails,
            rawPokemon: pokemon.toObject()
        });
    } catch (error) {
        console.error('Debug route error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

// Then, define the generic route with parameter
router.get('/:name', async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }

        // Transform the moves data to include all necessary properties
        const transformedPokemon = {
            ...pokemon.toObject(),
            moves: pokemon.moves.map(move => ({
                move: move.move,  // Name of the move
                damage_class: move.moveDetails.damage_class,
                type: move.moveDetails.type,
                power: move.moveDetails.power,
                accuracy: move.moveDetails.accuracy,
                pp: move.moveDetails.pp,
                current_pp: move.moveDetails.pp,
                max_pp: move.moveDetails.pp,
                priority: move.moveDetails.priority || 0,
                level_learned_at: move.level_learned_at
            }))
        };

        res.json(transformedPokemon);
    } catch (error) {
        console.error('Error in pokemon route:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;