const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL|| "http://localhost:5173",  
    credentials: true 
}))

// Connect to DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
