const router = require('express').Router();
const { Character, Event, CharacterEventBridge } = require('../models');
const db = require('../db');

const ErrorResponse = require('../util/ErrorResponse');
const { BadRequestErrorHandler, InternalServerErrorHandler } = require('../util/errorHandlers');

// Get all characters
router.get('/', async (req, res, next) => {
    try {
        const allCharacters = await db.getAllCharacters();
        res.json(allCharacters);
    } catch (error) {
        return next(new ErrorResponse("Server Error", 500));
    }
});

router.get('/:username', async (req, res) => {
    try {
        const character = await db.getCharacterByUsername(req.params.username);
        res.json(character);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Get specified character events
router.get('/:username/events', async (req, res) => {
    try {
        const events = await db.getEventsByCharacterUsername(req.params.username, JSON.parse(req.query.config || '{}'));

        res.json(events);

    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Get specified character events count
router.get('/:username/events/count', async (req, res) => {
    try {
        const events = await db.getEventsByCharacterUsername(req.params.username, JSON.parse(req.query.config || '{}'));

        res.json(events.length);

    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new character
router.post('/', (req, res) => {
    const username = req.body.username;
    const newCharacter = new Character({username});

    newCharacter.save()
        .then(character => res.json(character))
        .catch(BadRequestErrorHandler(res));
});

// Update character
router.put('/:username', async (req, res) => {
    const fullname = req.body.fullname;
    try { 
        if (fullname && await db.characterDoesNotExist(fullname))
            throw new Error(`Character ${fullname} does not exist.`);
            
        const characterData = await db.editCharacter(req.params.username, fullname);

        res.json(characterData);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Delete character by id
router.delete('/:id', (req, res) => {
    Character.findByIdAndDelete(req.params.id, req.body)
        .then(character => res.json(character))
        .catch(BadRequestErrorHandler(res))
});

module.exports = router;