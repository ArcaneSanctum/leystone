const { Player, Event, PlayerEventBridge, Action } = require('../models');

const deleteEventById = async (id) => {
    await deletePlayerEventBridgesByEventId(id);
    return Event.deleteOne({_id: id});
}

const deletePlayerEventBridgesByEventId = (eventId) => {
    return PlayerEventBridge.deleteMany({ event: eventId });
}

const deleteAllPlayers = () => {
    return Player.deleteMany({});
}

const deleteAllEvents = () => {
    return Event.deleteMany({});
}

const deleteAllPlayerEventBridges = () => {
    return PlayerEventBridge.deleteMany({});
}

const deleteAllActions = () => {
    return Action.deleteMany({});
}

module.exports = {
    deleteEventById,
    deletePlayerEventBridgesByEventId,
    deleteAllPlayers,
    deleteAllEvents,
    deleteAllPlayerEventBridges,
    deleteAllActions
}