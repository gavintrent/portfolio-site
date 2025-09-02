"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onClose: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;

  // Generate random food position
  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  // Check if position is occupied by snake
  const isSnakePosition = useCallback((pos: Position, snakeBody: Position[]): boolean => {
    return snakeBody.some(segment => segment.x === pos.x && segment.y === pos.y);
  }, []);

  // Generate new food position that's not on snake
  const generateNewFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = generateFood();
    } while (isSnakePosition(newFood, snakeBody));
    return newFood;
  }, [generateFood, isSnakePosition]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        e.preventDefault();
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 's':
      case 'arrowdown':
        e.preventDefault();
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'a':
      case 'arrowleft':
        e.preventDefault();
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'd':
      case 'arrowright':
        e.preventDefault();
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        e.preventDefault();
        setIsPaused(prev => !prev);
        break;
      case 'escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [direction, gameOver, onClose]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        
        // Move head
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateNewFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, generateNewFood]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateNewFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-6 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-400 font-mono text-xl">🐍 ASCII Snake Game</h2>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 font-mono text-sm"
          >
            [ESC] Close
          </button>
        </div>

        {/* Game Info */}
        <div className="flex justify-between items-center mb-4 text-green-300 font-mono text-sm">
          <div>Score: {score}</div>
          <div>{isPaused ? 'PAUSED' : gameOver ? 'GAME OVER' : 'PLAYING'}</div>
        </div>

        {/* Game Board */}
        <div className="bg-black border border-green-500 rounded p-2 mb-4">
          <div 
            className="grid gap-0"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;
              const isHead = snake[0]?.x === x && snake[0]?.y === y;

              return (
                <div
                  key={index}
                  className={`w-5 h-5 flex items-center justify-center text-xs font-mono ${
                    isHead ? 'text-yellow-400' :
                    isSnake ? 'text-green-400' :
                    isFood ? 'text-red-400' :
                    'text-gray-800'
                  }`}
                >
                  {isHead ? '●' : isSnake ? '○' : isFood ? '◆' : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="text-green-300 font-mono text-sm mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-green-400 mb-1">Controls:</div>
              <div>WASD or Arrow Keys - Move</div>
              <div>Space - Pause/Resume</div>
              <div>ESC - Close Game</div>
            </div>
            <div>
              <div className="text-green-400 mb-1">Legend:</div>
              <div>● Snake Head</div>
              <div>○ Snake Body</div>
              <div>◆ Food</div>
            </div>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="text-center">
            <div className="text-red-400 font-mono text-lg mb-4">GAME OVER!</div>
            <div className="text-green-300 font-mono mb-4">Final Score: {score}</div>
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white font-mono px-4 py-2 rounded"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Pause Screen */}
        {isPaused && !gameOver && (
          <div className="text-center">
            <div className="text-yellow-400 font-mono text-lg mb-4">PAUSED</div>
            <div className="text-green-300 font-mono">Press SPACE to resume</div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SnakeGame };
