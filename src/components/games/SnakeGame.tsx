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

  // Reset game
  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateNewFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  }, [generateNewFood]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
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
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused(prev => !prev);
        }
        break;
      case 'escape':
        e.preventDefault();
        onClose();
        break;
      case 'r':
        e.preventDefault();
        if (gameOver) {
          resetGame();
        }
        break;
    }
  }, [direction, gameOver, onClose, resetGame]);

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



  return (
    <div className=" border border-green-500 p-4">
        {/* ASCII Game Board */}
        <div className="text-green-400 text-sm leading-none" style={{ fontFamily: 'UnifontExMono, monospace' }}>
          {Array.from({ length: GRID_SIZE }, (_, y) => {
            return (
              <div key={y} className="flex">
                {Array.from({ length: GRID_SIZE }, (_, x) => {
                  const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                  const isFood = food.x === x && food.y === y;
                  const isHead = snake[0]?.x === x && snake[0]?.y === y;

                  let char = '·'; // Empty space
                  if (isHead) char = '*'; // Snake head
                  else if (isSnake) char = 'o'; // Snake body
                  else if (isFood) char = '@'; // Food (apple)

                  return (
                    <span 
                      key={x} 
                      className="flex items-center justify-center"
                      style={{ 
                        width: 'min(1.5vw, 1.5vh, 20px)', 
                        height: 'min(1.5vw, 1.5vh, 20px)',
                        fontSize: 'min(1.2vw, 1.2vh, 16px)'
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-green-400" style={{ fontFamily: 'UnifontExMono, monospace' }}>
              <div className="text-lg mb-2">GAME OVER</div>
              <div className="text-sm mb-2">Score: {score}</div>
              <div className="text-xs">Press SPACE or R to restart</div>
            </div>
          </div>
        )}

        {/* Pause Screen */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-green-400 text-lg" style={{ fontFamily: 'UnifontExMono, monospace' }}>PAUSED</div>
          </div>
        )}
    </div>
  );
};

export { SnakeGame };
