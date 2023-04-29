const { Character, Event, CharacterEventBridge, Action } = require('../models');
const { CATEGORIES } = require('../config.js');

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

const getEventById = (id) => {
    return Event.findOne({_id: id});
}

//Character.find({username: res.params.username})

const getCharacterIdsByUsernames = (usernames) => {
    return Character.find({
        username: {
            $in: usernames
        }
    }, '_id');
}

const getEventsByCharacterUsername = async (username, config = {}) =>  {
    const character = await getCharacterByUsername(username);
    const characterId = character._id;

    const nicknames = await getCharacterNicknamesByUsername(username);

    const query = {
        character: {
            $in : [characterId, ...nicknames.map(nickname => nickname._id)]
        }
    }
    
    const lowerTimeLimit = config.lowerTimeLimit ? new Date(config.lowerTimeLimit) : new Date(0);
    const upperTimeLimit = config.upperTimeLimit ? new Date(config.upperTimeLimit) : Date.now();

    query.timestamp = {
        $gte: lowerTimeLimit, 
        $lt: upperTimeLimit
    }

    const allBridgesForCharacterAndTimePeriod = await CharacterEventBridge.find(query);
    

    const categories = config.categories ||  (config.actionNames ? [] : CATEGORIES);
    const actions = config.actionNames || [];


    let results = Event.find({
        _id: {
            $in: allBridgesForCharacterAndTimePeriod.map(bridge => bridge.event)
        }
    });

    const categoryFilter =  {
        $or: categories.map(category => ({
            [`categoryValues.${category}`] : { $exists: true}
        }))
    }

    const nameFilter = {
        name: { $in: actions }
    }

    results = (categories.length) 
        ? results.or([ nameFilter, categoryFilter ]) 
        : results.find( nameFilter );

    return results;
}

const getCharactersByEventId = async (eventId) => {
    const allBridgesForEventByCharacterId = await CharacterEventBridge.find({event: eventId});
    return Character.find({
        _id: {
            $in: allBridgesForEventByCharacterId.map(bridge => bridge.character)
        }
    });
}

const getActionByName = (actionName) => {
    return Action.findOne({
        name: actionName
    });
}

const getAllActions = () => {
    return Action.find();
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


module.exports = {
    getNewCharacters,
    getAllCharacters,
    getCharacterByUsername,
    getEventById,
    getCharacterIdsByUsernames,
    getEventsByCharacterUsername,
    getCharactersByEventId,
    getActionByName,
    getAllActions,
    characterDoesNotExist,
    characterExists,
    getCharacterNicknamesByUsername
}