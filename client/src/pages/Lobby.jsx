import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./Lobby.css";

function Lobby() {
  const [gameAction, setGameAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("gameCreated", () => {
      navigate("/game");
    });

    socket.on("gameStarted", () => {
      navigate("/game");
    });

    socket.on("noGamesAvailable", () => {
      alert("There are no games available right now.");
    });

    return () => {
      socket.off("gameCreated");
      socket.off("gameStarted");
      socket.off("noGamesAvailable");
    };
  }, [navigate]);

  function handleCreateGame() {
    socket.emit("createGame");
  }

  function handleJoinGame() {
    socket.emit("joinGame");
  }

  return (
    <div>
      <h1>Game Lobby</h1>

      {!gameAction && (
        <div>
          <h2>What would you like to do?</h2>

          <button
            onClick={() => {
              setGameAction("create");
              handleCreateGame();
            }}
          >
            Create a Game
          </button>

          <button
            onClick={() => {
              setGameAction("join");
              handleJoinGame();
            }}
          >
            Join a Game
          </button>
        </div>
      )}
    </div>
  );
}

export default Lobby;