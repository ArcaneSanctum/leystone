const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1
    },
    fullname: {
        type: String,
        minLength: 1
    },
    clan: {
        type: ObjectId,
        required: true,
        ref: 'Clan'
    }
}, {
    timestamps: true
});

characterSchema.index({ username: 1, clan: 1 }, { unique: true });

//create Character model
const Character = mongoose.model('Character', characterSchema);

module.exports = Character;