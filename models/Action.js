const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1
    },
    categoryValues: {
        type: Map,
        of: Number,
        required: true
    },
    clan: {
        type: ObjectId,
        required: true,
        ref: 'Clan'
    }
}, {
    timestamps: true
});


actionSchema.index({ name: 1, clan: 1 }, { unique: true });

//create Action model
const Action = mongoose.model('Action', actionSchema);

module.exports = Action;