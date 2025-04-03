const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const http = require("http");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const socketHandler = require("./socket"); // Import socket logic

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,  // ✅ This allows cookies and authentication headers
}));

// Connect to Database
connectDB();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,  // ✅ This is required for `withCredentials: true`
  },
});

// Use the socket handler for real-time communication
socketHandler(io);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
