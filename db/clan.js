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

const getClanByLineBoardId = (lineBoardId) => {
    return Clan.findOne({lineBoardId});
}

const getClanIdByClanIdentifier = async (clanIdentifier, identifierType) => {
    if (identifierType === 'discordGuildId') {
        const clan = await getClanByDiscordGuildId(clanIdentifier);
        return clan?._id;
    }
    else if (identifierType === 'lineBoardId') {
        const clan = await getClanByLineBoardId(clanIdentifier);
        return clan?._id;
    }
    else {
        return null;
    }
}

const editClan = () => {
    return;
}

const getAllClans = () => {
    return Clan.find({});
}

const deleteAllClans = () => {
    return Clan.deleteMany({});
}



module.exports = {
    addClan,
    getClanByDiscordGuildId,
    getClanByLineBoardId,
    getClanIdByClanIdentifier,
    editClan,
    deleteAllClans,
    getAllClans
}