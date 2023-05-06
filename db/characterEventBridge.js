const deleteCharacterEventBridgesByEventId = (eventId) => {
    return CharacterEventBridge.deleteMany({ event: eventId });
}

const deleteAllCharacterEventBridges = () => {
    return CharacterEventBridge.deleteMany({});
}

module.exports = {
    deleteCharacterEventBridgesByEventId,
    deleteAllCharacterEventBridges
}