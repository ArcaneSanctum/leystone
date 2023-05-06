const router = require('express').Router();
const { Clan, Event, CharacterEventBridge } = require('../models');
const db = require('../db');

const { BadRequestErrorHandler, InternalServerErrorHandler } = require('../util/errorHandlers');

// Get all clans
router.get('/', async (req, res) => {
    try {
        const allClans = await db.clan.getAllClans();
        res.json(allClans);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const clan = await db.clan.getClanById(req.params.id);
        res.json(clan);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new clan
router.post('/', (req, res) => {
    const { name, discord_guild_id, line_board_id } = req.body;

    try {
        const newClan = db.clan.addClan(name, discord_guild_id, line_board_id);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
}); 

// Delete clan by id
router.delete('/:id', (req, res) => {
    Clan.findByIdAndDelete(req.params.id, req.body)
        .then(clan => res.json(clan))
        .catch(BadRequestErrorHandler(res))
});

module.exports = router;