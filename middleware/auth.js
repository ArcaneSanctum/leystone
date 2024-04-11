const db = require('../db');
const ErrorResponse = require('../util/ErrorResponse');


exports.verify = async(req, res, next) => {
    
    const clanIdentifier = req.body.discordGuildId || req.body.lineBoardId;
    const identifierType = req.body.discordGuildId ? 'discordGuildId' : 'lineBoardId';

    if (!clanIdentifier) 
        return next(new ErrorResponse("Clan identifier (Discord Guild Id / Line Board Id) missing from request body", 404));

    const clanId = await db.clan.getClanIdByClanIdentifier(clanIdentifier, identifierType);

    if (!clanId) 
        return next(new ErrorResponse("Clan identifier is not associated with any clan"));

    req.clanId = clanId;
    next();
}