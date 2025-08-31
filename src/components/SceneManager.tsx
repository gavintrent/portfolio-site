"use client";

import React, { useState } from 'react';
import { RoomScene, GameOverScene, ComputerScene } from './scenes';

export const SceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState('room');

  const handleSceneChange = (scene: string) => {
    setCurrentScene(scene);
  };

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Only render the current scene */}
      {currentScene === 'room' && (
        <RoomScene onSceneChange={handleSceneChange} />
      )}
      
      {currentScene === 'gameOver' && (
        <GameOverScene onSceneChange={handleSceneChange} />
      )}
      
      {currentScene === 'computer' && (
        <ComputerScene onSceneChange={handleSceneChange} />
      )}
    </div>
  );
};
