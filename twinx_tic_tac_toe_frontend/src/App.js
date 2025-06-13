import React, { useState } from 'react';
import './App.css';

/**
 * Color palette for quick usage
 *  primary: #4CAF50    (green)
 *  secondary: #FFC107  (amber)
 *  accent: #2196F3     (blue)
 */

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** A single square button in the Tic Tac Toe board. */
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === 'X' ? 'var(--ttt-primary)' : value === 'O' ? 'var(--ttt-accent)' : '',
        backgroundColor: highlight ? 'var(--ttt-secondary-light)' : 'var(--ttt-bg)',
        borderColor: highlight ? 'var(--ttt-secondary)' : 'var(--ttt-grid)',
        transition: 'background 0.18s, border 0.18s'
      }}
      aria-label={value ? `Cell ${value}` : 'Empty cell'}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /**
   * The 3x3 grid board for the game.
   * Highlights the winning combination if present.
   */
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={winningLine && winningLine.includes(i)}
      />
    );
  }
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row => (
        <div className="ttt-row" key={row}>
          { [0, 1, 2].map(col => renderSquare(row * 3 + col)) }
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function getWinner(squares) {
  /** Returns {winner, line} if found, else null. */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],  // rows
    [0,3,6],[1,4,7],[2,5,8],  // cols
    [0,4,8],[2,4,6]           // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(squares) {
  /** Returns true if all cells filled and no winner. */
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function GameStatus({ winner, draw, xIsNext }) {
  /** Displays the game's current status. */
  let text, color;
  if (winner) {
    text = `Winner: Player ${winner}`;
    color = winner === 'X' ? 'var(--ttt-primary)' : 'var(--ttt-accent)';
  } else if (draw) {
    text = 'Draw!';
    color = 'var(--ttt-secondary)';
  } else {
    text = `Current Turn: Player ${xIsNext ? 'X' : 'O'}`;
    color = xIsNext ? 'var(--ttt-primary)' : 'var(--ttt-accent)';
  }
  return <div className="ttt-status" style={{ color, fontWeight: 600 }}>{text}</div>;
}

// PUBLIC_INTERFACE
function App() {
  /** Main container for TwinX Tic Tac Toe. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]); // For minimal undo if needed.

  const result = getWinner(squares);
  const draw = !result && isDraw(squares);
  const handleSquareClick = (i) => {
    if (squares[i] || result) return; // Ignore filled/won
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setHistory([...history, squares]);
    setXIsNext(!xIsNext);
  };
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([]);
  };

  return (
    <div className="app ttt-app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "var(--ttt-primary)" }}>T</span> TwinX Tic Tac Toe
            </div>
            <button className="btn" onClick={handleRestart} style={{ background: 'var(--ttt-secondary)', color: '#fff' }}>
              Restart
            </button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container ttt-container">
          <div className="hero" style={{ paddingTop: 112 }}>
            <GameStatus
              winner={result ? result.winner : null}
              draw={draw}
              xIsNext={xIsNext}
            />
            <Board
              squares={squares}
              onSquareClick={handleSquareClick}
              winningLine={result ? result.line : null}
            />
            {(result || draw) && (
              <button className="btn btn-large" onClick={handleRestart}
                style={{
                  background: 'var(--ttt-primary)',
                  color: '#fff',
                  marginTop: 20,
                  minWidth: 120
                }}>
                Play Again
              </button>
            )}
            <div style={{
              marginTop: 20,
              color: "var(--ttt-grid)",
              fontSize: 14
            }}>
              TwinX Tic Tac Toe &middot; Modern, minimal, lightweight
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
