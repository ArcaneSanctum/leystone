const db = require('../db');


const clearDb = async () => {
    await db.event.deleteAllEvents();
    await db.character.deleteAllCharacters();
    await db.characterEventBridge.deleteAllCharacterEventBridges();
    await db.action.deleteAllActions();
    await db.clan.deleteAllClans();
    await db.user.deleteAllUsers();
}


module.exports = {
    clearDb
}