const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    discordGuildId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    lineBoardId: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

//create clan model
const Clan = mongoose.model('Clan', clanSchema);

module.exports = Clan;