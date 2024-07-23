import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

const GameBoard = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore')) || 0;
  });
  const boardRef = useRef(null);
  const boardSize = 20;

  const handleKeyDown = (e) => {
    switch (e.keyCode) {
      case 37: // Left arrow
        setDirection({ x: -1, y: 0 });
        break;
      case 38: // Up arrow
        setDirection({ x: 0, y: -1 });
        break;
      case 39: // Right arrow
        setDirection({ x: 1, y: 0 });
        break;
      case 40: // Down arrow
        setDirection({ x: 0, y: 1 });
        break;
      default:
        break;
    }
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('highScore', score);
      }
      return;
    }

    newSnake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      });
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    if (isGameOver) return;
    document.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(moveSnake, 200);
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, food, isGameOver, score, highScore]);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 15, y: 15 });
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-board" ref={boardRef}>
      {isGameOver && (
        <div className="game-over">
          Game Over
          <button className="restart-button" onClick={restartGame}>Restart</button>
        </div>
      )}
      <div className="score">Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
      {snake.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{
            left: `${segment.x * 20}px`,
            top: `${segment.y * 20}px`,
          }}
        />
      ))}
      <div
        className="food"
        style={{
          left: `${food.x * 20}px`,
          top: `${food.y * 20}px`,
        }}
      />
    </div>
  );
};

export default GameBoard;
