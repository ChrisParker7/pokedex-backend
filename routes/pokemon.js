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

        // No need to look up moves separately since details are stored in the document
        const transformedPokemon = {
            ...pokemon.toObject(),
            moves: pokemon.moves.map(move => ({
                move: move.move,
                level_learned_at: move.level_learned_at,
                current_pp: move.current_pp,
                max_pp: move.max_pp,
                moveDetails: move.moveDetails
            }))
        };

        res.json(transformedPokemon);
    } catch (error) {
        console.error('Error in pokemon route:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;