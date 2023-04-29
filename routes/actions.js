const router = require('express').Router();
const { Action } = require('../models');
const db = require('../db');

const { BadRequestErrorHandler, InternalServerErrorHandler } = require('../util/errorHandlers');

// Get all actions
router.get('/', async (req, res) => {
    try {
        const allActions = await db.getAllActions();
        res.json(allActions);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Get action by name
router.get('/:name', async (req, res) => {
    try {
        const action = await db.getActionByName(req.params.name);
        res.json(action);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Create new action
router.post('/', async (req, res) => {
    const name = req.body.name;

    try {
        const newAction = await db.addAction({
            name,
            categoryValues: req.body.categoryValues
        });

        res.json(newAction);
    } catch (error) {
        BadRequestErrorHandler(res)(error);
    }
});

// Update action
router.put('/:id', (req, res) => {
    Action.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(character => res.json(character))
        .catch(BadRequestErrorHandler(res));
});

// Delete action by id
router.delete('/:id', (req, res) => {
    Action.findByIdAndDelete(req.params.id, req.body)
        .then(character => res.json(character))
        .catch(BadRequestErrorHandler(res))
});

module.exports = router;