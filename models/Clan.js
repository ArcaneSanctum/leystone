const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    categoryValues: {
        type: Map,
        of: Number,
        required: true
    },
}, {
    timestamps: true
});

//create clan model
const Clan = mongoose.model('Clan', clanSchema);

module.exports = Clan;