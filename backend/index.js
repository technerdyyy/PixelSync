const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const cookiesParser = require('cookie-parser')
const router = require('./routes/index')
dotenv.config();

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_URL|| "http://localhost:5173",  
    credentials: true 
}))
app.use(cookiesParser())
app.use(express.json()) 

// Connect to DB
connectDB();

// Routes
app.use('/api',router)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
