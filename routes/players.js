const router = require('express').Router();
const { Player, Event, PlayerEventBridge } = require('../models');
const db = require('../db');

const { BadRequestErrorHandler, InternalServerErrorHandler } = require('../util/errorHandlers');

// Get all players
router.get('/', async (req, res) => {
    try {
        const allPlayers = await db.getAllPlayers();
        res.json(allPlayers);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

router.get('/:username', async (req, res) => {
    try {
        const player = await db.getPlayerByUsername(req.params.username);
        res.json(player);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Get specified player events
router.get('/:username/events', async (req, res) => {
    try {
        const events = await db.getEventsByPlayerUsername(req.params.username, JSON.parse(req.query.config || '{}'));

        res.json(events);

    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Get specified player events count
router.get('/:username/events/count', async (req, res) => {
    try {
        const events = await db.getEventsByPlayerUsername(req.params.username, JSON.parse(req.query.config || '{}'));

        res.json(events.length);

    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new player
router.post('/', (req, res) => {
    const username = req.body.username;
    const newPlayer = new Player({username});

    newPlayer.save()
        .then(player => res.json(player))
        .catch(BadRequestErrorHandler(res));
});

// Update player
router.put('/:username', async (req, res) => {
    const fullname = req.body.fullname;
    try { 
        if (fullname && await db.playerDoesNotExist(fullname))
            throw new Error(`Player ${fullname} does not exist.`);
            
        const playerData = await db.editPlayer(req.params.username, fullname);

        res.json(playerData);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Delete player by id
router.delete('/:id', (req, res) => {
    Player.findByIdAndDelete(req.params.id, req.body)
        .then(player => res.json(player))
        .catch(BadRequestErrorHandler(res))
});

module.exports = router;