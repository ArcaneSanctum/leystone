const { User } = require('../models');

const addUser = async (discordUserId) => {
    const newUser = new User({
        discordUserId: discordUserId, 
    });

    const userData = await newUser.save();
    
    return userData;
}

const getUserByDiscordId = (discordUserId) => {
    return User.findOne({discordUserId});
}

const editUser = () => {

}

const deleteAllUsers = () => {
    return User.deleteMany({});
}

module.exports = {
    deleteAllUsers
}
