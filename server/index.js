const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const openGames = [];
const activeGames = [];

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // CREATE GAME
  socket.on("createGame", () => {
    const roomId = socket.id;

    socket.join(roomId);

    openGames.push({
      roomId: roomId,
      players: [socket.id],
      squares: Array(9).fill(null),
      xIsNext: true,
    });

    console.log(`Game created: ${roomId}`);
    console.log("Open games:", openGames);

    socket.emit("gameCreated", {
      roomId: roomId,
    });
  });

  // JOIN GAME
  socket.on("joinGame", () => {
    if (openGames.length === 0) {
      socket.emit("noGamesAvailable");
      return;
    }

    const game = openGames[0];

    game.players.push(socket.id);

    socket.join(game.roomId);

    console.log(`Player ${socket.id} joined game ${game.roomId}`);

    // Move game from waiting → active
    openGames.shift();
    activeGames.push(game);

    // Tell first player they are X
    io.to(game.players[0]).emit("gameStarted", {
      roomId: game.roomId,
      player: "X",
    });

    // Tell second player they are O
    io.to(game.players[1]).emit("gameStarted", {
      roomId: game.roomId,
      player: "O",
    });

    console.log("Open games:", openGames);
    console.log("Active games:", activeGames);
  });

  // MAKE MOVE
  socket.on("makeMove", ({ roomId, index }) => {
    const game = activeGames.find(
      (game) => game.roomId === roomId
    );

    if (!game) {
      return;
    }

    // Don't allow occupied squares
    if (game.squares[index] !== null) {
      return;
    }

    const currentPlayer = game.xIsNext ? "X" : "O";

    // Make sure the correct player is making the move
    if (
      (currentPlayer === "X" && socket.id !== game.players[0]) ||
      (currentPlayer === "O" && socket.id !== game.players[1])
    ) {
      return;
    }

    // Update board
    game.squares[index] = currentPlayer;

    // Switch turns
    game.xIsNext = !game.xIsNext;

    // Send updated state to both players
    io.to(game.roomId).emit("gameState", {
      squares: game.squares,
      xIsNext: game.xIsNext,
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove waiting game
    const openIndex = openGames.findIndex(
      (game) => game.players.includes(socket.id)
    );

    if (openIndex !== -1) {
      openGames.splice(openIndex, 1);
      console.log("Removed abandoned game from queue.");
    }

    // Remove active game
    const activeIndex = activeGames.findIndex(
      (game) => game.players.includes(socket.id)
    );

    if (activeIndex !== -1) {
      const game = activeGames[activeIndex];

      io.to(game.roomId).emit("opponentDisconnected");

      activeGames.splice(activeIndex, 1);

      console.log("Removed active game.");
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});