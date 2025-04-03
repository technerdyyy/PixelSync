module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
    
        socket.on("chatMessage", (message) => {
            const fullMessage = {
                ...message,
                senderId: socket.id,  // Store sender's socket ID
            };
            console.log(socket.id);
            
    
            io.emit("message", fullMessage); // Broadcast to all clients
        });
    
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
  };
  