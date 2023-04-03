const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
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

//create Action model
const Action = mongoose.model('Action', actionSchema);

module.exports = Action;