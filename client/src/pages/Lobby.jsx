import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [gameAction, setGameAction] = useState(null);
  const [gameType, setGameType] = useState(null);
  const navigate = useNavigate();

  function handleGameType(type) {
    setGameType(type);

    if (gameAction === "create") {
      navigate("/game", {
        state: {
          gameAction: "create",
          gameType: type,
        },
      });
    }

    if (gameAction === "join") {
      
      if (type === "public") {
        console.log("Show public games");
      }

      if (type === "private") {
        console.log("Show room code input");
      }
    }
  }

  return (
    <div>
      <h1>Game Lobby</h1>

      {/* First question */}
      {!gameAction && (
        <div>
          <h2>What would you like to do?</h2>

          <button onClick={() => setGameAction("create")}>
            Create a Game
          </button>

          <button onClick={() => setGameAction("join")}>
            Join a Game
          </button>
        </div>
      )}

      {/* Second question */}
      {gameAction && !gameType && (
        <div>
          <h2>
            {gameAction === "create"
              ? "What type of game would you like to create?"
              : "What type of game would you like to join?"}
          </h2>

          <button onClick={() => handleGameType("public")}>
            Public
          </button>

          <button onClick={() => handleGameType("private")}>
            Private
          </button>
        </div>
      )}
    </div>
  );
}

export default Lobby;