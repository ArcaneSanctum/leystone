const router = require('express').Router();
const { ObjectId } = require('mongoose').Types;
const { Event } = require('../models');
const db = require('../db');

const { verify } = require('../middleware/auth');

const { BadRequestErrorHandler, InternalServerErrorHandler } = require('../util/errorHandlers');

// Get all events
router.get('/', (req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(BadRequestErrorHandler(res));
});

// Get event by id
router.get('/:id', async (req, res) => {
    try {
        const event = await db.getEventById(req.params.id);
        res.json(event);
    } 
    catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

//Get all characters by event id
router.get('/:id/characters', async(req, res) => {
    try {
        const characters = await db.getCharactersByEventId(req.params.id);
        res.json(characters);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new event
router.post('/', verify, async (req, res) => {
    const actionName = req.body.actionName;
    const characterUsernames = req.body.usernames;
    const clanId = req.clanId;

    try {
        //check for action
        const action = await db.action.getActionByName(actionName, clanId);
        if (action === null) {
            return BadRequestErrorHandler(res)(`Invalid action name "${actionName}".`);
        }

        //add new users to database
        const newUsernames = await db.character.getNewCharacters(characterUsernames, clanId);
        await db.character.addCharacters(newUsernames, clanId);

        //retreive character Object IDs use to build CharacterEventBridges
        const characterIds = await db.character.getCharacterIdsByUsernames(characterUsernames, clanId);

        const eventData = await db.event.addEvent(action, characterIds, clanId);

        res.json({
            event: eventData,
            newCharacters: newUsernames
        });
    }
    catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Update event
router.put('/:id', async (req, res) => {
    const characterUsernames = req.body.usernames;
    const timestamp = req.body.timestamp;
    const id = new ObjectId(req.params.id);
    
    try {
        //add new users to database
        const newUsernames = await db.getNewCharacters(characterUsernames);
        await db.addCharacters(newUsernames);

        //retreive character Object IDs use to build CharacterEventBridges
        const characterIds = await db.getCharacterIdsByUsernames(characterUsernames);

        const eventData = await db.editEvent(id, characterIds, timestamp);

        res.json({
            event: eventData,
            newCharacters: newUsernames
        });
    } catch (error)  {
        console.log(error);
        BadRequestErrorHandler(res)(error);
    }
});

// Delete event by id
router.delete('/:id', async (req, res) => {
    try {
        const response = await db.deleteEventById(new ObjectId(req.params.id));

        res.json(response);
    } catch {
        BadRequestErrorHandler(res)(error);
    }
});

module.exports = router;