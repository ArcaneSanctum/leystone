const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const characterEventBridgeSchema = new mongoose.Schema({
    character: {
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

characterEventBridgeSchema.index({ character: 1, event: 1 }, { unique: true });


//create Character model
const CharacterEventBridge = mongoose.model('CharacterEventBridge', characterEventBridgeSchema);

module.exports = CharacterEventBridge;