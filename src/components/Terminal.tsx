"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TerminalContainer, CommandProcessor, type CommandOutput } from './terminal-components';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{
    command: string;
    output: CommandOutput;
    timestamp: Date;
  }>>([{
    command: 'help',
    output: { 
      type: 'list', 
      content: [
        'Available commands:',
        '  help       - See a list of available commands',
        '  clear      - Clear the terminal',
        '  about      - Display info about me',
        '  projects   - List available projects',
        '  photography - Navigate to photo portfolio (coming soon)',
        '  contact    - Show contact information'
      ], 
      command: 'help' 
    },
    timestamp: new Date()
  }]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [showGameButtons, setShowGameButtons] = useState(false);
  const commandProcessor = useRef(new CommandProcessor());
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Blink every 500ms
    return () => clearInterval(cursorInterval);
  }, []);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim() || isLoading) return;
    
    const command = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);
    
    // Add command to history immediately
    const newEntry = {
      command,
      output: { type: 'text' as const, content: '', command: '' } as CommandOutput,
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, newEntry]);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute command
    const output = commandProcessor.current.executeCommand(command);
    
    // Handle special clear command
    if (output.content === 'CLEAR_TERMINAL') {
      handleClear();
      setIsLoading(false);
      return;
    }

    // Handle special continue-game command
    if (output.content === 'CONTINUE_GAME') {
      setShowGameButtons(true);
      setIsLoading(false);
      return;
    }
    
    // Update the entry with the output
    setHistory(prev => prev.map((entry, index) => 
      index === prev.length - 1 ? { ...entry, output } : entry
    ));
    
    setIsLoading(false);
    
    // Automatically refocus the input field
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 50);
  };

  const handleClear = () => {
    // Clear everything - no initial help message
    setHistory([]);
    setShowGameButtons(false);
    commandProcessor.current.setCurrentProject(null);
    
    // Maintain input focus after clearing
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 50);
  };

  return (
    <>
      <TerminalContainer
        history={history}
        currentInput={currentInput}
        onInputChange={setCurrentInput}
        onSubmit={handleCommandSubmit}
        isLoading={isLoading}
        showCursor={showCursor}
        historyEndRef={historyEndRef}
      />
      
      {/* Game Buttons - only visible after continue-game command */}
      {showGameButtons && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
          <div className="flex gap-12">
            <button
              className="relative hover:scale-105 transition-transform duration-200"
              aria-label="Option 1"
            >
              <Image
                src="/pixel-art/button-1.png"
                alt="Option 1 button"
                width={200}
                height={100}
                className="cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                Option 1
              </span>
            </button>
            <button
              className="relative hover:scale-105 transition-transform duration-200"
              aria-label="Option 2"
            >
              <Image
                src="/pixel-art/button-1.png"
                alt="Option 2 button"
                width={200}
                height={100}
                className="cursor-pointer"
              />
              <span className="absolute inset-0 flex items-center justify-center pt-2 text-white minecraft-text text-lg font-bold">
                Option 2
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
