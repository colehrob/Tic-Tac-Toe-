const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const openGames = [];

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

  // CREATE GAME
  socket.on("createGame", () => {
    const roomId = socket.id;

    // Put the player into their Socket.IO room
    socket.join(roomId);

    // Add the game to the waiting queue
    openGames.push({
      roomId: roomId,
      players: [socket.id],
    });

    console.log(`Game created: ${roomId}`);
    console.log("Open games:", openGames);

    // Tell the player their game was created
    socket.emit("gameCreated", {
      roomId: roomId,
    });
  });

  // JOIN GAME
  socket.on("joinGame", () => {
    // No games waiting
    if (openGames.length === 0) {
      socket.emit("noGamesAvailable");
      return;
    }

    // Get the first game in the queue
    const game = openGames[0];

    // Add the new player
    game.players.push(socket.id);

    // Put the new player into the same Socket.IO room
    socket.join(game.roomId);

    console.log(`Player ${socket.id} joined game ${game.roomId}`);

    // Tell both players that the game has started
    io.to(game.roomId).emit("gameStarted", {
      roomId: game.roomId,
      players: game.players,
    });

    // Remove the game from the waiting queue
    openGames.shift();

    console.log("Open games:", openGames);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove any game created by this player
    const index = openGames.findIndex(
      (game) => game.players.includes(socket.id)
    );

    if (index !== -1) {
      openGames.splice(index, 1);
      console.log("Removed abandoned game from queue.");
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});