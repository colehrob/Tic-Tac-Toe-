export default function Lobby() {
    return (
      <div className="lobby-container">
        <h1>Tic Tac Toe</h1>
        <h2>Game Lobby</h2>
  
        <div className="form-group">
          <label>Player Name</label>
          <input
            type="text"
            placeholder="Enter your name"
          />
        </div>
  
        <div className="form-group">
          <label>Room Code</label>
          <input
            type="text"
            placeholder="Enter room code"
          />
        </div>
  
        <button>Join Game</button>
  
        <p>OR</p>
  
        <button>Create New Game</button>
      </div>
    );
  }