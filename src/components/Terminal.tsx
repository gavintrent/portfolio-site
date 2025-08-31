"use client";

import React, { useState, useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

interface CommandOutput {
  type: 'text' | 'list' | 'error';
  content: string | string[];
  command: string;
}

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{
    command: string;
    output: CommandOutput;
    timestamp: Date;
  }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Show welcome message on mount
  useEffect(() => {
    const welcomeCommand = executeCommand('motd');
    setHistory([{
      command: 'motd',
      output: welcomeCommand,
      timestamp: new Date()
    }]);
  }, []);

  const executeCommand = (command: string): CommandOutput => {
    const cleanCommand = command.trim().toLowerCase();
    
    if (!cleanCommand) {
      return { type: 'text', content: '', command: '' };
    }

    switch (cleanCommand) {
      case 'help':
      case 'ls':
        return {
          type: 'list',
          content: [
            'Available commands:',
            '  help     - Show this help message',
            '  about    - Display personal information',
            '  projects - List portfolio projects',
            '  contact  - Show contact information',
            '  clear    - Clear terminal history',
            '  ls       - List available commands (alias for help)',
            '  whoami   - Show current user (alias for about)',
            '  motd     - Display message of the day'
          ],
          command: cleanCommand
        };

      case 'about':
      case 'whoami':
        return {
          type: 'text',
          content: `${profile.name} - ${profile.title}\n\n${profile.bio}`,
          command: cleanCommand
        };

      case 'projects':
        return {
          type: 'list',
          content: projects.map(project => 
            `${project.title}${project.featured ? ' ★' : ''}\n  ${project.description}\n  Tech: ${project.technologies.join(', ')}\n  ${project.link ? `Demo: ${project.link}` : ''}${project.github ? `\n  GitHub: ${project.github}` : ''}`
          ),
          command: cleanCommand
        };

      case 'contact':
        return {
          type: 'list',
          content: [
            'Contact Information:',
            `  Email: ${profile.contact.email}`,
            `  GitHub: ${profile.contact.github}`,
            `  LinkedIn: ${profile.contact.linkedin}`
          ],
          command: cleanCommand
        };

      case 'clear':
        setHistory([]);
        return { type: 'text', content: '', command: cleanCommand };

      case 'motd':
        return {
          type: 'text',
          content: `Welcome to ${profile.name}'s Terminal Portfolio!\n\nType 'help' to see available commands.\nType 'about' to learn more about me.\nType 'projects' to view my work.\nType 'contact' to get in touch.\n\nHappy exploring! 🚀`,
          command: cleanCommand
        };

      default:
        return {
          type: 'error',
          content: `Command not found: ${command}. Type 'help' for available commands.`,
          command: cleanCommand
        };
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    const command = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);
    
    // Add command to history immediately
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
    inputRef.current?.focus();
  };

  const renderOutput = (output: CommandOutput) => {
    if (output.type === 'list' && Array.isArray(output.content)) {
      return (
        <div className="text-green-400">
          {output.content.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
      );
    }
    
    if (output.type === 'error') {
      return <div className="text-red-400">{output.content}</div>;
    }
    
    return <div className="text-green-400 whitespace-pre-wrap">{output.content}</div>;
  };

  return (
    <div className="bg-black text-green-400 minecraft-text rounded-lg shadow-2xl border border-green-500/30 overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-green-900/20 px-4 py-2 flex items-center justify-between border-b border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-green-400 text-sm">Terminal — bash</div>
        <div className="w-16"></div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 h-96 overflow-y-auto">
        {/* Command History */}
        {history.map((entry, index) => (
          <div key={index} className="mb-4">
            {/* Command Input */}
            <div className="flex items-center mb-2">
              <span className="text-green-500 mr-2">$</span>
              <span className="text-green-400">{entry.command}</span>
            </div>
            
            {/* Command Output */}
            {entry.output.content && (
              <div className="ml-4 mb-2">
                {renderOutput(entry.output)}
              </div>
            )}
          </div>
        ))}
        
        {/* Current Command Input */}
        <form onSubmit={handleCommandSubmit} className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 outline-none border-none"
            placeholder="Type a command..."
            disabled={isLoading}
          />
          {isLoading && <span className="text-green-400 ml-2">...</span>}
        </form>
        
        <div ref={historyEndRef} />
      </div>
    </div>
  );
};
