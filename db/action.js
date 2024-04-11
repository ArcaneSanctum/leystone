const { Action } = require('../models');

const addAction = async (config, clanId) => {
    const newAction = new Action({
        ...config,
        clan: clanId
    });
    
    const actionData = await newAction.save();

    return actionData;
}

const getActionByName = (actionName, clanId) => {
    return Action.findOne({
        name: actionName,
        clan: clanId
    });
}

const getAllActions = (clanId) => {
    return Action.find({
        clan: clanId
    });
}

const deleteAllActions = () => {
    return Action.deleteMany({});
}

module.exports = {
    addAction,
    getActionByName,
    getAllActions,
    deleteAllActions
}