"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface GameOverSceneProps {
  onSceneChange: (scene: string) => void;
}

export const GameOverScene: React.FC<GameOverSceneProps> = ({ onSceneChange }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const gameOverText = "You leave without seeing Gavin's portfolio. Your company misses out on an excellent new grad candidate. You lose!";
  
  // Reset state and start typing animation when component mounts
  useEffect(() => {
    // Reset all state
    setDisplayText('');
    setShowGameOver(false);
    setIsTyping(false);
    
    // Small delay to ensure component is fully rendered, then start typing
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Typing animation
  useEffect(() => {
    if (isTyping) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < gameOverText.length) {
          setDisplayText(gameOverText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
          // Show game over elements after a delay
          setTimeout(() => {
            setShowGameOver(true);
          }, 1000); // 1 second delay after game over text completes
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [isTyping, gameOverText]);

  const handleTryAgain = () => {
    onSceneChange('room');
  };

  return (
    <>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pixel-art/night-scene-2.png"
          alt="Night scene background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Game Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Game Over Message */}
        <div className="flex-1 flex items-start justify-center pt-8 px-4">
          <div className="max-w-2xl animate-fade-in text-center">
            <span className="text-white minecraft-text text-lg font-bold">
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </div>
        </div>

        {/* Game Over Elements - only visible after game over text completes */}
        {showGameOver && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* GAME OVER Text */}
            <div className="text-center animate-fade-in">
              <h1 className="text-red-600 minecraft-text text-6xl font-bold game-over-pulse">
                GAME OVER
              </h1>
            </div>
            
            {/* Try Again Button */}
            <div className="animate-fade-in">
              <button
                onClick={handleTryAgain}
                className="relative hover:scale-105 transition-transform duration-200"
                aria-label="Try again"
              >
                <Image
                  src="/pixel-art/button-1.png"
                  alt="Try again button"
                  width={200}
                  height={100}
                  className="cursor-pointer"
                />
                <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                  Try Again?
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
