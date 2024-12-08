const express = require('express');
const mongoose = require('mongoose');
const Pokemon = require('./models/pokemon');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = 3000;

app.use(cors());


// Verbindung zur MongoDB-Datenbank herstellen
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Verbunden mit MongoDB');
}).catch(err => {
    console.error(err);
});

// Route, um Pokémon hinzuzufügen (Beispiel-Daten)
app.get('/add-pokemon', async (req, res) => {
    try {
        const newPokemon = new Pokemon({
            name: 'Pikachu',
            type: ['Electric'],
            height: 0.4,
            weight: 6,
        });
        await newPokemon.save();
        res.send('Pikachu wurde hinzugefügt!');
    } catch (error) {
        res.status(500).send('Fehler beim Hinzufügen des Pokémon');
    }
});

app.get('/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (error) {
        res.status(500).send('Fehler beim Abrufen der Pokémon');
    }
});

app.get('/pokemons/type/:type', async (req, res) => {
    try {
        const type = req.params.type;
        const pokemons = await Pokemon.find({ type: type });
        res.json(pokemons);
    } catch (error) {
        res.status(500).send('Fehler beim Filtern der Pokémon');
    }
});

app.get('/pokemon/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const pokemon = await Pokemon.findOne({ name: name });
        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).send('Pokémon nicht gefunden');
        }
    } catch (error) {
        res.status(500).send('Fehler beim Abrufen des Pokémon');
    }
});

app.get('/pokemon/:name/evolution-family', async (req, res) => {
    try {
        const name = req.params.name;
        const pokemon = await Pokemon.findOne({ name: name });

        if (!pokemon) {
            return res.status(404).send('Pokémon nicht gefunden');
        }

        // Get all Pokémon from the same evolution chain
        const evolutionFamily = await Pokemon.find({
            evolutionChainId: pokemon.evolutionChainId
        }).sort('id');

        res.json(evolutionFamily);
    } catch (error) {
        res.status(500).send('Fehler beim Abrufen der Entwicklungskette');
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
