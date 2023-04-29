const { Character, Event, CharacterEventBridge } = require('../models');
const { ObjectId } = require('mongoose').Types;
const { getArrayDifference } = require('../util/util');
const db = require('./get.js');

const editEvent = async (id, characterIds, timestamp) => {
    const oldEvent = await db.getEventById(id);
    const oldCharacterList = await db.getCharactersByEventId(id);
    const oldCharacterIds = oldCharacterList.map(character => character._id)

    const isTimestampDirty = String(timestamp) !== String(oldEvent.timestamp);
    const diff = getArrayDifference(oldCharacterIds.map(id => id.toString()), characterIds.map(character => character._id.toString()));
     
    if (isTimestampDirty) {
        const editedEvent = {
            name: oldEvent.name, 
            categoryValues: oldEvent.categoryValues,
            timestamp: timestamp
        };
        await Event.findByIdAndUpdate(id, editedEvent);

        //update existing event bridges with new timestamp
        await CharacterEventBridge.updateMany({event: id}, {timestamp: timestamp});
    }
    
    if (diff.added) 
        await CharacterEventBridge.insertMany(diff.added.map(stringId => ({character: new ObjectId(stringId), event: id, timestamp: timestamp})));
    
    if (diff.removed)
        await CharacterEventBridge.deleteMany({character: { $in: diff.removed.map(stringId => new ObjectId(stringId))}, event: id});

    return db.getEventById(id);
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


module.exports = {
    editEvent,
    editCharacter
}