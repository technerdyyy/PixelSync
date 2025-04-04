const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    room: {
        type: String,
        default: "general"
    }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);