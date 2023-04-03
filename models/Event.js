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
    }
}, {
    timestamps: true
});

//create Player model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;