"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandHistory } from './CommandHistory';
import { CommandInput } from './CommandInput';
import { executeCommand, CommandOutput } from '@/utils/commands';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{
    command: string;
    output: CommandOutput;
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Show welcome message on mount
  useEffect(() => {
    const welcomeCommand = executeCommand('motd');
    setHistory([{
      command: 'motd',
      output: welcomeCommand,
      timestamp: new Date()
    }]);
  }, []);

  const handleCommandSubmit = async (command: string) => {
    if (!command.trim()) return;

    setIsLoading(true);
    
    // Add command to history immediately with empty output
    const newEntry = {
      command,
      output: { type: 'text' as const, content: '', command: '' },
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, newEntry]);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 100));

    // Execute command and update output
    const output = executeCommand(command);
    
    setHistory(prev => 
      prev.map((entry, index) => 
        index === prev.length - 1 
          ? { ...entry, output }
          : entry
      )
    );

    setIsLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="h-screen bg-terminal-bg text-terminal-text font-mono flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-terminal-text-dim/20">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-terminal-text-dim text-sm">
          Terminal Portfolio
        </div>
      </div>

      {/* Command History */}
      <div className="flex-1 overflow-hidden">
        <CommandHistory history={history} />
        <div ref={historyEndRef} />
      </div>

      {/* Command Input */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2 text-terminal-text-dim text-sm"
          >
            Processing...
          </motion.div>
        )}
      </AnimatePresence>

      <CommandInput 
        onCommandSubmit={handleCommandSubmit}
        disabled={isLoading}
      />
    </div>
  );
};
