// Create a users object to store username by socket ID
const users = {};

let Chat;
try {
    Chat = require("./models/Chat");
} catch (error) {
    console.error("Chat model not found. Please create the model first.");
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        
        // Handle user registration
        socket.on("registerUser", (userData) => {
            console.log(`User registered: ${userData.username} with socket ID ${socket.id}`);
            users[socket.id] = userData.username;
        });
        
        socket.on("chatMessage", (message) => {
            console.log("Original message received:", message);
            
            // Ensure the username is preserved and correct
            const fullMessage = {
                ...message,
                senderId: socket.id,
                username: message.username || users[socket.id] || "Anonymous"
            };
            
            console.log("Broadcasting message with username:", fullMessage.username);
            
            // Broadcast to all clients
            io.emit("message", fullMessage);
            
            // Save to database if Chat model is available
            if (Chat) {
                try {
                    const saveMessage = async () => {
                        let chat = await Chat.findOne();
                        
                        if (!chat) {
                            chat = new Chat({ messages: [] });
                        }
                        
                        chat.messages.push(fullMessage);
                        await chat.save();
                    };
                    
                    saveMessage().catch(err => {
                        console.error("Error saving message:", err);
                    });
                } catch (error) {
                    console.error("Error in chat save process:", error);
                }
            }
        });
        
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
            // Remove user data when they disconnect
            delete users[socket.id];
        });
    });
};