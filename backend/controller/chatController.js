const Chat = require("../models/Chat");

// Save message to database
exports.saveMessage = async (req, res) => {
    try {
        const { text, username, senderId, time, room = "general" } = req.body;
        
        // Find the chat document for this room or create it if it doesn't exist
        let chat = await Chat.findOne({ "messages.room": room });
        
        if (!chat) {
            chat = new Chat({ messages: [] });
        }
        
        // Add new message to the messages array
        chat.messages.push({
            text,
            username,
            senderId,
            time,
            room
        });
        
        await chat.save();
        
        return res.status(201).json({
            success: true,
            message: "Message saved successfully"
        });
    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save message",
            error: error.message
        });
    }
};

// Get chat history for a specific room
exports.getChatHistory = async (req, res) => {
    try {
        const { room = "general" } = req.params;
        
        const chat = await Chat.findOne({ "messages.room": room });
        
        if (!chat) {
            return res.status(200).json({
                success: true,
                messages: []
            });
        }
        
        // Filter messages for the requested room
        const roomMessages = chat.messages.filter(msg => msg.room === room);
        
        return res.status(200).json({
            success: true,
            messages: roomMessages
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history",
            error: error.message
        });
    }
};