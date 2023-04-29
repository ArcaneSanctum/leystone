const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const ROLES = {
    ADMIN: "ADMIN",
    DEFAULT: "DEFAULT"
}

const userSchema = new mongoose.Schema({
    discordUserId: {
        type: String,
        required: true,
        unique: true,
        minlength: 1
    },
    clans: [{
        type: ObjectId,
        required: true,
        ref: 'Clan'
    }],
    characters: [{
        type: ObjectId,
        ref: 'Character'
    }],
    roles: [{
        type: "String"
    }]
}, {
    timestamps: true
});

//create user model
const User = mongoose.model('user', userSchema);

module.exports = User;
module.exports.ROLES = ROLES;