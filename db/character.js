const { Character, CharacterEventBridge } = require('../models');

const addCharacters = (usernames, clanId) => {
    return Character.insertMany(
        usernames.map(username => ({
            username,
            clan: clanId
        }))
    );
}

const getNewCharacters = async (usernames, clanId) => {
    return await usernames.reduce(async (newCharacters, currentUsername) => {
        newCharacters = await newCharacters;
        return (await characterDoesNotExist(currentUsername, clanId)) ? newCharacters.concat([currentUsername]) : newCharacters;
    }, Promise.resolve([]));
}

const getAllCharacters = () => {
    return Character.find();
}

const getCharacterByUsername = (username) => {
    return Character.findOne({username: username});
}

const getCharacterIdsByUsernames = (usernames, clanId) => {
    return Character.find({
        username: {
            $in: usernames
        },
        clan: clanId
    }, '_id');
}

const getCharactersByEventId = async (eventId) => {
    const allBridgesForEventByCharacterId = await CharacterEventBridge.find({event: eventId});
    return Character.find({
        _id: {
            $in: allBridgesForEventByCharacterId.map(bridge => bridge.character)
        }
    });
}

const characterDoesNotExist = async (username, clanId) => {
    return ! ( await characterExists(username, clanId) );
}

const characterExists = (username, clanId) => {
    return Character.exists({
        username,
        clan: clanId
    });
}

const getCharacterNicknamesByUsername = (username) => {
    return Character.find({fullname: username}, 'username');
}


const editCharacter = async (username, fullname) => {
    if (fullname) {
        // adding fullname
        const nicknames = await db.getCharacterNicknamesByUsername(username)
        console.log("NICKNAMES", nicknames);
        console.log("NICKNAMES", nicknames);
        if (nicknames.length) {
            //can not be a nickname if character has nicknames
            throw new Error(`'${username}' cannot be a nickname since it already has nicknames (${nicknames.slice(0, 3).join(', ')}...)`);
        }
        return Character.updateOne({username: username}, {fullname: fullname}, {new : true});

    } else {
        // remove fullname
        return Character.updateOne({username: username}, { $unset: { fullname: 1 } }, {new: true});
    }
}

const deleteAllCharacters = () => {
    return Character.deleteMany({});
}

module.exports = {
    addCharacters,
    getNewCharacters,
    getAllCharacters,
    getCharacterByUsername,
    getCharacterIdsByUsernames,
    getCharactersByEventId,
    characterDoesNotExist,
    characterExists,
    getCharacterNicknamesByUsername,
    editCharacter,
    deleteAllCharacters
}