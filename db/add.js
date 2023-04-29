const { Character, Event, CharacterEventBridge, Action} = require('../models')

const addCharacters = (usernames) => {
    return Character.insertMany(
        usernames.map(username => ({username}))
    );
}

const addEvent = async (action, characterIds) => {
    const newEvent = new Event({
        name: action.name, 
        categoryValues: action.categoryValues
    });
    
    const eventData = await newEvent.save();

    await CharacterEventBridge.insertMany(
        characterIds.map(characterId => ({character: characterId, event: eventData._id, timestamp: eventData.timestamp}))
    );

    return eventData;
}

const addAction = async (config) => {
    const newAction = new Action(config);
    
    const actionData = await newAction.save();

    return actionData;
}

module.exports = {
    addCharacters,
    addEvent,
    addAction
}