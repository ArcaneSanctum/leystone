const addAction = async (config) => {
    const newAction = new Action(config);
    
    const actionData = await newAction.save();

    return actionData;
}

const getActionByName = (actionName) => {
    return Action.findOne({
        name: actionName
    });
}

const getAllActions = () => {
    return Action.find();
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