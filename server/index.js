const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const rooms = {};

const app = express();

// Allow requests from React
app.use(cors());

const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("joinRoom", (roomCode) => {

  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});