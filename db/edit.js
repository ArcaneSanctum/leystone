const { Player, Event, PlayerEventBridge } = require('../models');
const { ObjectId } = require('mongoose').Types;
const { getArrayDifference } = require('../util/util');
const db = require('./get.js');

const editEvent = async (id, playerIds, timestamp) => {
    const oldEvent = await db.getEventById(id);
    const oldPlayerList = await db.getPlayersByEventId(id);
    const oldPlayerIds = oldPlayerList.map(player => player._id)

    const isTimestampDirty = String(timestamp) !== String(oldEvent.timestamp);
    const diff = getArrayDifference(oldPlayerIds.map(id => id.toString()), playerIds.map(player => player._id.toString()));
     
    if (isTimestampDirty) {
        const editedEvent = {
            name: oldEvent.name, 
            categoryValues: oldEvent.categoryValues,
            timestamp: timestamp
        };
        await Event.findByIdAndUpdate(id, editedEvent);

        //update existing event bridges with new timestamp
        await PlayerEventBridge.updateMany({event: id}, {timestamp: timestamp});
    }
    
    if (diff.added) 
        await PlayerEventBridge.insertMany(diff.added.map(stringId => ({player: new ObjectId(stringId), event: id, timestamp: timestamp})));
    
    if (diff.removed)
        await PlayerEventBridge.deleteMany({player: { $in: diff.removed.map(stringId => new ObjectId(stringId))}, event: id});

    return db.getEventById(id);
}

const editPlayer = async (username, fullname) => {
    if (fullname) {
        // adding fullname
        const nicknames = await db.getPlayerNicknamesByUsername(username)
        console.log("NICKNAMES", nicknames);
        console.log("NICKNAMES", nicknames);
        if (nicknames.length) {
            //can not be a nickname if player has nicknames
            throw new Error(`'${username}' cannot be a nickname since it already has nicknames (${nicknames.slice(0, 3).join(', ')}...)`);
        }
        return Player.updateOne({username: username}, {fullname: fullname}, {new : true});

    } else {
        // remove fullname
        return Player.updateOne({username: username}, { $unset: { fullname: 1 } }, {new: true});
    }
}


module.exports = {
    editEvent,
    editPlayer
}