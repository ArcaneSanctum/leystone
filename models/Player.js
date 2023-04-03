const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    fullname: {
        type: String,
        minLength: 1
    }
}, {
    timestamps: true
});

//create Player model
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;