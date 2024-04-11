const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    categoryValues: {
        type: Map,
        of: Number,
        required: true
    },
    timestamp: { 
        type: Date,
        default: Date.now
    },
    clan: {
        type: ObjectId,
        required: true,
        ref: 'Clan'
    }
}, {
    timestamps: true
});

//create Character model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;