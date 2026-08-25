import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, player, onSquareClick }) {
  const winner = calculateWinner(squares);

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="player">
        You are: {player}
      </div>

      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => onSquareClick(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => onSquareClick(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => onSquareClick(2)}
        />
      </div>

      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => onSquareClick(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => onSquareClick(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => onSquareClick(5)}
        />
      </div>

      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => onSquareClick(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => onSquareClick(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => onSquareClick(8)}
        />
      </div>
    </>
  );
}

export default function Game() {
  const location = useLocation();
  console.log("GAME LOCATION STATE:", location.state);

  const roomId = location.state?.roomId;

  const [myPlayer, setMyPlayer] = useState(
    location.state?.player ?? null
  );
  console.log("MY PLAYER STATE:", myPlayer);

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const [waiting, setWaiting] = useState(
    location.state?.waiting ?? true
  );

  // Listen for the game starting
  useEffect(() => {
    socket.on("gameStarted", ({ roomId, player }) => {
      console.log("Game started!");
      console.log("Room:", roomId);
      console.log("You are:", player);
    
      setWaiting(false);
      setMyPlayer(player);
    });

    return () => {
      socket.off("gameStarted");
    };
  }, []);

  // Listen for updated game state
  useEffect(() => {
    socket.on("gameState", (game) => {
      console.log("Received game state:", game);

      setSquares(game.squares);
      setXIsNext(game.xIsNext);
    });

    return () => {
      socket.off("gameState");
    };
  }, []);

  function handleClick(i) {
    if (waiting) {
      return;
    }

    if (squares[i]) {
      return;
    }

    if (
      (xIsNext && myPlayer !== "X") ||
      (!xIsNext && myPlayer !== "O")
    ) {
      console.log("STOPPED: not your turn");
      return;
    }

    console.log("Sending move to server");

    socket.emit("makeMove", {
      roomId: roomId,
      index: i,
    });
  }

  return (
    <div className="game">
      <div className="game-board-container">

        <div className={waiting ? "game-board blurred" : "game-board"}>
          <Board
            xIsNext={xIsNext}
            squares={squares}
            player={myPlayer}
            onSquareClick={handleClick}
          />
        </div>

        {waiting && (
          <div className="waiting-overlay">
            <h2>Waiting for opponent...</h2>
          </div>
        )}

      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }

  return null;
}