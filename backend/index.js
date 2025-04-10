const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const cookiesParser = require('cookie-parser')
const router = require('./routes/index')
const http = require("http");
const socketHandler = require("./socket"); // Import socket logic

dotenv.config();
const app = express();
app.use(cors({
  origin: '*',  
    credentials: true 
}))
app.use(cookiesParser());
app.use(express.json());


// Connect to Database
connectDB();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true,  // ✅ This is required for `withCredentials: true`
  },
});

// Use the socket handler for real-time communication
socketHandler(io);

// Routes
app.use('/api',router)
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
