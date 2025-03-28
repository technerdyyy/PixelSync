const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);


app.get("/", (req, res) => {
    res.send("Welcome to Collaborative Pixel Art");
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
