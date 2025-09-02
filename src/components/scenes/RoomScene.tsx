"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface RoomSceneProps {
  onSceneChange: (scene: string) => void;
}

export const RoomScene: React.FC<RoomSceneProps> = ({ onSceneChange }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(true);
  const [wakeProgress, setWakeProgress] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  
  const fullText = "You are in a room and find a computer. What do you do?";
  
  // Waking up animation
  useEffect(() => {
    if (isWakingUp) {
      const wakeTimer = setInterval(() => {
        setWakeProgress(prev => {
          if (prev >= 100) {
            clearInterval(wakeTimer);
            return 100;
          }
          return prev + 3; // Adjust speed here
        });
      }, 25);
      
      return () => clearInterval(wakeTimer);
    }
  }, [isWakingUp]);
  
  // Handle transition from wake-up to typing
  useEffect(() => {
    if (wakeProgress >= 100 && isWakingUp) {
      // Wake-up is complete, transition to awake state
      setIsWakingUp(false);
      // Add a delay before starting typing
      setTimeout(() => {
        setIsTyping(true);
      }, 1000); // 1 second delay after wake-up completes
    }
  }, [wakeProgress, isWakingUp]);
  
  // Typing animation
  useEffect(() => {
    if (isTyping) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setDisplayText(fullText.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
          // Add delay before showing buttons
          setTimeout(() => {
            setShowButtons(true);
          }, 1000); // 1 second delay after text completes
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [isTyping, fullText]);

  const handleGetCloser = () => {
    onSceneChange('computer');
  };

  const handleLeave = () => {
    onSceneChange('gameOver');
  };

  return (
    <>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/pixel-art/room-pixelified.png"
          alt="Adventure scene"
          fill
          className="object-cover"
          priority
        />
        
        {/* Computer screen glow effect */}
        <div className="absolute inset-0 z-10">
          {/* Responsive positioning with fine-tuned control */}
          <div 
            className="absolute bg-blue-400/60 rounded-lg blur-xl slow-pulse" 
            style={{ 
              top: 'calc(46vh)', 
              left: 'calc(50vw - 19vw)',
              width: 'calc(18vw)',
              height: 'calc(20vh)'
            }}
          ></div>
          <div 
            className="absolute bg-blue-300/70 rounded-lg blur-lg slow-pulse" 
            style={{ 
              top: 'calc(46vh)', 
              left: 'calc(50vw - 19vw)',
              width: 'calc(18vw)',
              height: 'calc(20vh)'
            }}
          ></div>
          <div 
            className="absolute bg-blue-200/80 rounded-lg blur-md slow-pulse" 
            style={{ 
              top: 'calc(46vh)', 
              left: 'calc(50vw - 19vw)',
              width: 'calc(18vw)',
              height: 'calc(20vh)'
            }}
          ></div>
        </div>

        {/* Lamp glow effect */}
        <div className="absolute inset-0 z-10">
          {/* Responsive positioning with fine-tuned control */}
          <div 
            className="absolute bg-yellow-400/60 rounded-lg blur-xl" 
            style={{ 
              top: 'calc(50vh - 23vh)', 
              left: 'calc(50vw + 3vw)',
              width: 'calc(6vw)',
              height: 'calc(6vw)'
            }}
          ></div>
          <div 
            className="absolute bg-yellow-200/80 rounded-lg blur-lg" 
            style={{ 
              top: 'calc(50vh - 23vh)', 
              left: 'calc(50vw + 3vw)',
              width: 'calc(6vw)',
              height: 'calc(6vw)'
            }}
          ></div>
        </div>
      </div>

      {/* Waking up overlay - starts dark and gradually fades */}
      {isWakingUp && (
        <div 
          className="absolute inset-0 z-20 bg-black transition-all duration-2000 ease-out"
          style={{ 
            opacity: Math.max(0, (100 - wakeProgress) / 100),
            pointerEvents: wakeProgress < 100 ? 'auto' : 'none'
          }}
        />
      )}

      {/* Game Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Prompt - only visible after waking up */}
        {!isWakingUp && (
          <div className="flex-1 flex items-start justify-center pt-8 px-4">
            <div className="max-w-2xl animate-fade-in text-center">
              <span className="text-white minecraft-text text-lg font-bold">
                {displayText}
                {isTyping && <span className="animate-pulse">|</span>}
              </span>
            </div>
          </div>
        )}

        {/* Choice Buttons - only visible after typing completes and delay */}
        {!isWakingUp && showButtons && (
          <div className="flex justify-center pb-8 px-4 animate-fade-in">
            <div className="flex gap-12">
              <button
                onClick={handleGetCloser}
                className="relative hover:scale-105 transition-transform duration-200"
                aria-label="Get closer to the computer"
              >
                <Image
                  src="/pixel-art/button-1.png"
                  alt="Get closer button"
                  width={200}
                  height={100}
                  className="cursor-pointer"
                />
                <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                  Get Closer
                </span>
              </button>
              <button
                onClick={handleLeave}
                className="relative hover:scale-105 transition-transform duration-200"
                aria-label="Leave the room"
              >
                <Image
                  src="/pixel-art/button-1.png"
                  alt="Leave button"
                  width={200}
                  height={100}
                  className="cursor-pointer"
                />
                <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                  Leave
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
