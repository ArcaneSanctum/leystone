const { Player, Event, PlayerEventBridge, Action } = require('../models');
const { CATEGORIES } = require('../config.js');

const getNewPlayers = async (usernames) => {
    return await usernames.reduce(async (newPlayers, currentUsername) => {
        newPlayers = await newPlayers;
        return (await playerDoesNotExist(currentUsername)) ? newPlayers.concat([currentUsername]) : newPlayers;
    }, Promise.resolve([]));
}

const getAllPlayers = () => {
    return Player.find();
}

const getPlayerByUsername = (username) => {
    return Player.findOne({username: username});
}

const getEventById = (id) => {
    return Event.findOne({_id: id});
}

//Player.find({username: res.params.username})

const getPlayerIdsByUsernames = (usernames) => {
    return Player.find({
        username: {
            $in: usernames
        }
    }, '_id');
}

const getEventsByPlayerUsername = async (username, config = {}) =>  {
    const player = await getPlayerByUsername(username);
    const playerId = player._id;

    const nicknames = await getPlayerNicknamesByUsername(username);

    const query = {
        player: {
            $in : [playerId, ...nicknames.map(nickname => nickname._id)]
        }
    }
    
    const lowerTimeLimit = config.lowerTimeLimit ? new Date(config.lowerTimeLimit) : new Date(0);
    const upperTimeLimit = config.upperTimeLimit ? new Date(config.upperTimeLimit) : Date.now();

    query.timestamp = {
        $gte: lowerTimeLimit, 
        $lt: upperTimeLimit
    }

    const allBridgesForPlayerAndTimePeriod = await PlayerEventBridge.find(query);
    

    const categories = config.categories ||  (config.actionNames ? [] : CATEGORIES);
    const actions = config.actionNames || [];


    let results = Event.find({
        _id: {
            $in: allBridgesForPlayerAndTimePeriod.map(bridge => bridge.event)
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

const getPlayersByEventId = async (eventId) => {
    const allBridgesForEventByPlayerId = await PlayerEventBridge.find({event: eventId});
    return Player.find({
        _id: {
            $in: allBridgesForEventByPlayerId.map(bridge => bridge.player)
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

const playerDoesNotExist = async (username) => {
    return ! ( await playerExists(username) );
}

const playerExists = (username) => {
    return Player.exists({username});
}

const getPlayerNicknamesByUsername = (username) => {
    return Player.find({fullname: username}, 'username');
}


module.exports = {
    getNewPlayers,
    getAllPlayers,
    getPlayerByUsername,
    getEventById,
    getPlayerIdsByUsernames,
    getEventsByPlayerUsername,
    getPlayersByEventId,
    getActionByName,
    getAllActions,
    playerDoesNotExist,
    playerExists,
    getPlayerNicknamesByUsername
}