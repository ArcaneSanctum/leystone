const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
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

//create Character model
const Character = mongoose.model('Character', characterSchema);

module.exports = Character;