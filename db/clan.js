const { Clan } = require('../models');

const addClan = async (name, discordGuildId, lineBoardId) => {
    //if (discord_guild_id === null) throw Error();
    const newClan = new Clan({
        name: name, 
        discordGuildId: discordGuildId
    });

    const clanData = await newClan.save();
    
    return clanData;
}

const getClanByDiscordGuildId = (discordGuildId) => {
    return Clan.findOne({discordGuildId});
}

const editClan = () => {
    return;
}

const deleteAllClans = () => {
    return Clan.deleteMany({});
}



module.exports = {
    addClan,
    getClanByDiscordGuildId
}