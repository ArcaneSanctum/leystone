const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const playerEventBridgeSchema = new mongoose.Schema({
    player: {
        type: ObjectId,
        required: true
    },
    event: {
        type: ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

playerEventBridgeSchema.index({ player: 1, event: 1 }, { unique: true });


//create Player model
const PlayerEventBridge = mongoose.model('PlayerEventBridge', playerEventBridgeSchema);

module.exports = PlayerEventBridge;