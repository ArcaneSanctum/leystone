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

    // const newCharacters = await db.findNewCharacters(['rbm', 'llama']);
    // console.log(newCharacters);

    await db.deleteAllEvents();
    await db.deleteAllCharacters();
    await db.deleteAllCharacterEventBridges();
    await db.deleteAllActions();

    const characters = await db.addCharacters(['rbm', 'llama']);
    const Gelebron = await db.addAction({name: 'Gelebron', categoryValues: {
        'RAID': 1,
        'EDL': 7
    }});
    const Snorri = await db.addAction({name: 'Snorri', categoryValues: {
        'RAID': 1,
        'LOWEDL': 4
    }});

    await db.addEvent(Gelebron, [characters.find(x => x.username === 'rbm'), characters.find(x => x.username === 'llama')]);
    await db.addEvent(Snorri, [characters.find(x => x.username === 'rbm'), characters.find(x => x.username === 'llama')]);

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

app.use('/characters', charactersRouter);
app.use('/events', eventsRouter);
app.use('/actions', actionsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server Started at port ${process.env.PORT}`);
});