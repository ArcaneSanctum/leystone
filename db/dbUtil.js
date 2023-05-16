const event = require('./event');
const character = require('./character');
const characterEventBridge = require('./characterEventBridge');
const action = require('./action');
const clan = require('./clan');
const user = require('./user');

const clearDb = async () => {
    await event.deleteAllEvents();
    await character.deleteAllCharacters();
    await characterEventBridge.deleteAllCharacterEventBridges();
    await action.deleteAllActions();
    await clan.deleteAllClans();
    await user.deleteAllUsers();
}


module.exports = {
    clearDb,
}