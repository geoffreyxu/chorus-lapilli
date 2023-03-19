import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [selected, setSelected] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [storeLast, setStoreLast] = useState(10);

  function handleClick(i) {
    if (calculateWinner(squares) || (squares[i] && moveNumber <= 5)) {
      return;
    }
    const nextSquares = squares.slice();
    if (selected) {
      let neighbors = isAdjacent(storeLast);
      if (nextSquares[i] === (xIsNext ? 'X' : 'O')) {
        setSelected(true);
        setStoreLast(i);
      }
      if (nextSquares[4] === (xIsNext ? 'X' : 'O')) {
        const winningMoves = existsWinningMove(nextSquares, xIsNext, storeLast);
        if (winningMoves && winningMoves.includes(i) && neighbors.includes(i) && nextSquares[i] === null) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[storeLast] = null;
          setMoveNumber(moveNumber + 1);  
          setXIsNext(!xIsNext);
          setSelected(false);
        }
        else if (winningMoves === null && storeLast === 4 && nextSquares[i] === null) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[storeLast] = null;
          setMoveNumber(moveNumber + 1);  
          setXIsNext(!xIsNext);
          setSelected(false);
        }
      }
      else {
        if (nextSquares[i] === null && neighbors.includes(i)) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[storeLast] = null;
          setMoveNumber(moveNumber + 1);     
          setXIsNext(!xIsNext);
          setSelected(false);
        }
      }
    }
    else {
      if (moveNumber <= 5) {
        if (xIsNext) {
          nextSquares[i] = 'X';
        } else {
          nextSquares[i] = 'O';
        }
        setXIsNext(!xIsNext);
        setMoveNumber(moveNumber + 1);
      }
      else {
        if (nextSquares[i] === (xIsNext ? 'X' : 'O')) {
          setSelected(true);
          setStoreLast(i);
        }
        else 
          setSelected(false);
      }
    }
    setSquares(nextSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function existsWinningMove(squares, turn, current) {
  let nonOverlap = [];
  let winningArray = [];
  let checkAdjacent = isAdjacent(current);
  for (var i = 0; i < checkAdjacent.length; i++)
    if (squares[checkAdjacent[i]] === null)
      nonOverlap.push(checkAdjacent[i]);
  for (var j = 0; j < nonOverlap.length; j++) {
    let newSquares = squares.slice();
    newSquares[current] = null;
    newSquares[nonOverlap[j]] = turn ? 'X' : 'O';
    if (calculateWinner(newSquares) !== null)
      winningArray.push(nonOverlap[j]);
  }
  if (winningArray.length > 0)
    return winningArray;
  else
    return null;
}


function isAdjacent(square) {
  let adjacent;
  if (square === 0)
    adjacent = [1, 3, 4];
  else if (square === 1)
    adjacent = [0, 2, 3, 4, 5];
  else if (square === 2)
    adjacent = [1, 4, 5];
  else if (square === 3)
    adjacent = [0, 1, 4, 6, 7];
  else if (square === 4)
    adjacent = [0, 1, 2, 3, 5, 6, 7, 8];
  else if (square === 5)
    adjacent = [1, 2, 4, 7, 8];
  else if (square === 6)
    adjacent = [3, 4, 7];
  else if (square === 7)
    adjacent = [3, 4, 5, 6, 8];
  else 
    adjacent = [4, 5, 7];
  return adjacent;
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
