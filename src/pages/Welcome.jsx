import { useState } from "react";

export default function Welcome() {
  const [playerName, setPlayerName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Player:", playerName);
  }

  return (
    <div>
      <h1>Tic-Tac-Toe Lobby</h1>

      <p>Enter your name to continue</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
        />
        <button type="submit">
          Continue
        </button>
      </form>
    </div>
  )

}