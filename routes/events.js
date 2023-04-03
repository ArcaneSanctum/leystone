const router = require('express').Router();
const { ObjectId } = require('mongoose').Types;
const { Player, Event } = require('../models');
const db = require('../db');

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

//Get all players by event id
router.get('/:id/players', async(req, res) => {
    try {
        const players = await db.getPlayersByEventId(req.params.id);
        res.json(players);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new event
router.post('/', async (req, res) => {
    const actionName = req.body.actionName;
    const playerUsernames = req.body.usernames;

    try {
        //check for action
        const action = await db.getActionByName(actionName);
        if (action === null) {
            return BadRequestErrorHandler(res)(`Invalid action name "${actionName}".`);
        }

        //add new users to database
        const newUsernames = await db.getNewPlayers(playerUsernames);
        await db.addPlayers(newUsernames);

        //retreive player Object IDs use to build PlayerEventBridges
        const playerIds = await db.getPlayerIdsByUsernames(playerUsernames);

        const eventData = await db.addEvent(action, playerIds);

        res.json({
            event: eventData,
            newPlayers: newUsernames
        }) 
    }
    catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Update event
router.put('/:id', async (req, res) => {
    const playerUsernames = req.body.usernames;
    const timestamp = req.body.timestamp;
    const id = new ObjectId(req.params.id);
    
    try {
        //add new users to database
        const newUsernames = await db.getNewPlayers(playerUsernames);
        await db.addPlayers(newUsernames);

        //retreive player Object IDs use to build PlayerEventBridges
        const playerIds = await db.getPlayerIdsByUsernames(playerUsernames);

        const eventData = await db.editEvent(id, playerIds, timestamp);

        res.json({
            event: eventData,
            newPlayers: newUsernames
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