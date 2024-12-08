require('dotenv').config(); // Lädt Variablen aus .env
const mongoose = require('mongoose');
const axios = require('axios');
const Move = require('./models/move');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


const importMoves = async () => {
    try {
        // Get list of all moves
        const response = await axios.get('https://pokeapi.co/api/v2/move?limit=1000');
        const moves = response.data.results;

        for (const move of moves) {
            const moveData = await axios.get(move.url);
            const germanName = getGermanName(moveData.data.names);

            const moveDoc = {
                _id: germanName,  // Use German name as primary ID
                englishName: moveData.data.name,  // Store English name separately
                germanName: germanName,    // German name
                type: translateType(moveData.data.type.name),
                power: moveData.data.power,
                accuracy: moveData.data.accuracy,
                pp: moveData.data.pp,
                damage_class: moveData.data.damage_class.name,
                priority: moveData.data.priority,
                effect_entries: moveData.data.effect_entries.map(entry => ({
                    effect: entry.effect,
                    short_effect: entry.short_effect
                })),
                meta: {
                    crit_rate: moveData.data.meta?.crit_rate || 0,
                    drain: moveData.data.meta?.drain || 0,
                    healing: moveData.data.meta?.healing || 0,
                    min_hits: moveData.data.meta?.min_hits,
                    max_hits: moveData.data.meta?.max_hits,
                    min_turns: moveData.data.meta?.min_turns,
                    max_turns: moveData.data.meta?.max_turns,
                    stat_chance: moveData.data.meta?.stat_chance || 0,
                    status_chance: moveData.data.meta?.status_chance || 0,
                    flinch_chance: moveData.data.meta?.flinch_chance || 0,
                    stat_changes: moveData.data.stat_changes,
                    ailment: moveData.data.meta?.ailment?.name || null,
                    category: moveData.data.meta?.category?.name || 'damage'
                }
            };

            await Move.findOneAndUpdate(
                { _id: moveDoc._id },
                moveDoc,
                { upsert: true, new: true }
            );

            console.log(`Move ${germanName} (${moveData.data.name}) imported successfully`);
        }

        console.log('All moves imported successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error importing moves:', error);
        mongoose.connection.close();
    }
};

const getGermanName = (names) => {
    const germanName = names.find(name => name.language.name === 'de');
    return germanName ? germanName.name : names[0].name;
};

const translateType = (englishType) => {
    const typeMap = {
        'normal': 'Normal',
        'fire': 'Feuer',
        'water': 'Wasser',
        'electric': 'Elektro',
        'grass': 'Pflanze',
        'ice': 'Eis',
        'fighting': 'Kampf',
        'poison': 'Gift',
        'ground': 'Boden',
        'flying': 'Flug',
        'psychic': 'Psycho',
        'bug': 'Käfer',
        'rock': 'Gestein',
        'ghost': 'Geist',
        'dragon': 'Drache',
        'dark': 'Unlicht',
        'steel': 'Stahl',
        'fairy': 'Fee'
    };
    return typeMap[englishType] || englishType;
};

importMoves();
