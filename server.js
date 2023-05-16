const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error);
});

database.once('connected', async () => {
    console.log('MongoDB connection successfully established!');

    const db = require('./db');

    console.log('DB: ', db);
    await db.util.clearDb();

    const clan = await db.clan.addClan("Test Clan", "001");

    const characters = await db.character.addCharacters(['rbm', 'llama'], clan.id);
    const Gelebron = await db.action.addAction({name: 'Gelebron', categoryValues: {
        'RAID': 1,
        'EDL': 7
    }}, clan.id);
    const Snorri = await db.action.addAction({name: 'Snorri', categoryValues: {
        'RAID': 1,
        'LOWEDL': 4
    }}, clan.id);

    const rbm = await db.character.getCharacterByUsername('rbm');
    const llama = await db.character.getCharacterByUsername('llama');

    await db.event.addEvent(Gelebron, [rbm, llama], clan.id);
    await db.event.addEvent(Snorri, [rbm, llama], clan.id);

    const filterByActionGelebron = '?config=%7B%22actionNames%22%3A%5B%22Gelebron%22%5D%7D';
    const filterByCategoryRaid = '?config=%7B%22categories%22%3A%5B%22RAID%22%5D%7D';
    const filterByCategoryEDL = '?config=%7B%22categories%22%3A%5B%22EDL%22%5D%7D';
    const filterByCategoryLowEDLAndActionGelebron = '?config=%7B%22categories%22%3A%5B%22LOWEDL%22%5D%2C%22actionNames%22%3A%5B%22Gelebron%22%5D%7D';
    const filterByCategoryEDLAndActionSnorri = '?config=%7B%22categories%22%3A%5B%22EDL%22%5D%2C%22actionNames%22%3A%5B%22Snorri%22%5D%7D';
    const filterBeforeJan1st2020At3_24AM = '?config=%7B%22upperTimeLimit%22%3A%222020-01-01T08%3A24%3A00.000Z%22%7D';
    const filterBeforeJan1st2025At3_24AM = '?config=%7B%22upperTimeLimit%22%3A%222025-01-01T08%3A24%3A00.000Z%22%7D';
    
    
});



const app = express();

app.use(cors());
app.use(express.json());

const charactersRouter = require('./routes/characters');
const eventsRouter = require('./routes/events');
const actionsRouter = require('./routes/actions');
const clansRouter = require('./routes/clans');

app.use('/characters', charactersRouter);
app.use('/events', eventsRouter);
app.use('/actions', actionsRouter);
app.use('/clans', clansRouter);

//must come last
const errorHandler = require('./middleware/error');
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server Started at port ${process.env.PORT}`);
});