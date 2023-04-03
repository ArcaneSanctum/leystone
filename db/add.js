const { Player, Event, PlayerEventBridge, Action} = require('../models')

const addPlayers = (usernames) => {
    return Player.insertMany(
        usernames.map(username => ({username}))
    );
}

const addEvent = async (action, playerIds) => {
    const newEvent = new Event({
        name: action.name, 
        categoryValues: action.categoryValues
    });
    
    const eventData = await newEvent.save();

    await PlayerEventBridge.insertMany(
        playerIds.map(playerId => ({player: playerId, event: eventData._id, timestamp: eventData.timestamp}))
    );

    return eventData;
}

const addAction = async (config) => {
    const newAction = new Action(config);
    
    const actionData = await newAction.save();

    return actionData;
}

module.exports = {
    addPlayers,
    addEvent,
    addAction
}