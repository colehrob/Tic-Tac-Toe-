import { useState } from "react";

function Lobby() {
  const [gameAction, setGameAction] = useState(null);
  const [gameType, setGameType] = useState(null);

  return (
    <div>
      <h1>Game Lobby</h1>

      {/* First prompt */}
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

      {/* Second prompt */}
      {gameAction && !gameType && (
        <div>
          <h2>
            {gameAction === "create"
              ? "What type of game would you like to create?"
              : "What type of game would you like to join?"}
          </h2>

          <button onClick={() => setGameType("public")}>
            Public
          </button>

          <button onClick={() => setGameType("private")}>
            Private
          </button>
        </div>
      )}

      {/* What happens after choosing public/private */}
      {gameType && (
        <div>
          <h2>
            {gameAction === "create" ? "Creating" : "Joining"} a{" "}
            {gameType} game...
          </h2>
        </div>
      )}
    </div>
  );
}

export default Lobby;