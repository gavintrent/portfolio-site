"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Terminal } from '../Terminal';

interface ComputerSceneProps {
  onSceneChange: (scene: string) => void;
}

export const ComputerScene: React.FC<ComputerSceneProps> = ({ onSceneChange }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  
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
      <div className="absolute inset-0 z-1">
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
            height: 'auto'
          }}>
            <Terminal />
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
    </>
  );
};
