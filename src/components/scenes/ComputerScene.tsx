"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Terminal } from '../Terminal';
import { SnakeGame } from '../games/SnakeGame';

interface ComputerSceneProps {
  onSceneChange: (scene: string) => void;
}

export const ComputerScene: React.FC<ComputerSceneProps> = ({ onSceneChange }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showGameButtons, setShowGameButtons] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const terminalRef = useRef<any>(null);
  
  const introText = "You approach the computer and see a terminal open.";
  
  // Start typing animation when component mounts
  useEffect(() => {
    // Reset state and start typing
    setDisplayText('');
    setShowTerminal(false);
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
        if (index < introText.length) {
          setDisplayText(introText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
          // Show terminal after a delay
          setTimeout(() => {
            setShowTerminal(true);
          }, 1000); // 1 second delay after text completes
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [isTyping, introText]);

  const handleBackToRoom = () => {
    onSceneChange('room');
  };

  const handleHackSystem = () => {
    setShowGameButtons(false);
    terminalRef.current?.handleHackSystem();
  };

  const handleOpenGame = () => {
    setShowGameButtons(false);
    setShowSnakeGame(true);
    terminalRef.current?.handleOpenGame();
  };

  const handleCloseGame = () => {
    setShowSnakeGame(false);
  };

  const handleShowGameButtons = (show: boolean) => {
    setShowGameButtons(show);
  };

  return (
    <>
      {/* Animated background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ animationDuration: '20s' }}
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.4; // Half speed (0.5x)
            }
          }}
        >
          <source src="/dynamic/pixel_wall_spirals_balanced.webm" type="video/webm" />
        </video>
      </div>

      {/* Background image for computer desktop with terminal positioned relative to it */}
      <div className="absolute inset-0 z-1" style={{ pointerEvents: 'none' }}>
        <Image
          src="/pixel-art/blank-desk-2x.png"
          alt="Computer scene"
          fill
          className="object-cover"
          priority
        />
        
        {/* Terminal positioned relative to the desk image */}
        {showTerminal && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in" style={{ 
            top: '-36%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: 'auto',
            height: 'auto',
            pointerEvents: 'auto'
          }}>
            <Terminal 
              ref={terminalRef}
              onShowGameButtons={handleShowGameButtons}
            />
          </div>
        )}
      </div>

      {/* Computer Scene Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Intro Text - always rendered, just fades out */}
        <div className="flex-1 flex items-start justify-center pt-8 px-4">
          <div className="max-w-2xl animate-fade-in text-center">
            <span className={`text-white minecraft-text text-lg font-bold transition-opacity duration-1000 ${
              showTerminal ? 'opacity-0' : 'opacity-100'
            }`}>
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Game Buttons - rendered at scene level with high z-index */}
      {showGameButtons && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex gap-12">
            <button
              onClick={handleHackSystem}
              className="relative hover:scale-105 transition-transform duration-200"
              aria-label="Hack System"
            >
              <Image
                src="/pixel-art/button-1.png"
                alt="Hack System button"
                width={200}
                height={100}
                className="cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                Hack System
              </span>
            </button>
            <button
              onClick={handleOpenGame}
              className="relative hover:scale-105 transition-transform duration-200"
              aria-label="Open Game"
            >
              <Image
                src="/pixel-art/button-1.png"
                alt="Open Game button"
                width={200}
                height={100}
                className="cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                Open Game
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Snake Game Overlay */}
      {showSnakeGame && (
        <SnakeGame onClose={handleCloseGame} />
      )}
    </>
  );
};
