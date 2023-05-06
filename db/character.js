const addCharacters = (usernames) => {
    return Character.insertMany(
        usernames.map(username => ({username}))
    );
}

const getNewCharacters = async (usernames) => {
    return await usernames.reduce(async (newCharacters, currentUsername) => {
        newCharacters = await newCharacters;
        return (await characterDoesNotExist(currentUsername)) ? newCharacters.concat([currentUsername]) : newCharacters;
    }, Promise.resolve([]));
}

const getAllCharacters = () => {
    return Character.find();
}

const getCharacterByUsername = (username) => {
    return Character.findOne({username: username});
}

const getCharacterIdsByUsernames = (usernames) => {
    return Character.find({
        username: {
            $in: usernames
        }
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

const characterDoesNotExist = async (username) => {
    return ! ( await characterExists(username) );
}

const characterExists = (username) => {
    return Character.exists({username});
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