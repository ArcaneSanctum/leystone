/* ------       ADD FUNCTIONS       ------- */
const addEvent = async (action, characterIds) => {
    const newEvent = new Event({
        name: action.name, 
        categoryValues: action.categoryValues
    });
    
    const eventData = await newEvent.save();

    await CharacterEventBridge.insertMany(
        characterIds.map(characterId => ({character: characterId, event: eventData._id, timestamp: eventData.timestamp}))
    );

    return eventData;
}
/* ------                           ------- */

const getEventById = (id) => {
    return Event.findOne({_id: id});
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

const deleteAllEvents = () => {
    return Event.deleteMany({});
}

const deleteEventById = async (id) => {
    await deleteCharacterEventBridgesByEventId(id);
    return Event.deleteOne({_id: id});
}

module.exports = {
    addEvent,
    getEventById,
    getEventsByCharacterUsername,
    editEvent,
    deleteAllEvents,
    deleteEventById
}