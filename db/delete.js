const { Character, Event, CharacterEventBridge, Action } = require('../models');

const deleteEventById = async (id) => {
    await deleteCharacterEventBridgesByEventId(id);
    return Event.deleteOne({_id: id});
}

const deleteCharacterEventBridgesByEventId = (eventId) => {
    return CharacterEventBridge.deleteMany({ event: eventId });
}

const deleteAllCharacters = () => {
    return Character.deleteMany({});
}

const deleteAllEvents = () => {
    return Event.deleteMany({});
}

const deleteAllCharacterEventBridges = () => {
    return CharacterEventBridge.deleteMany({});
}

const deleteAllActions = () => {
    return Action.deleteMany({});
}

module.exports = {
    deleteEventById,
    deleteCharacterEventBridgesByEventId,
    deleteAllCharacters,
    deleteAllEvents,
    deleteAllCharacterEventBridges,
    deleteAllActions
}