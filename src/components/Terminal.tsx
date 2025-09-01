"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  const [showCursor, setShowCursor] = useState(true);
  const [currentProject, setCurrentProject] = useState<typeof projects[0] | null>(null);
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

  // Show initial help message on mount
  useEffect(() => {
    setHistory([{
      command: '',
      output: { type: 'text', content: 'Type help for a list of available commands.', command: '' },
      timestamp: new Date()
    }]);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Blink every 500ms
    return () => clearInterval(cursorInterval);
  }, []);

  const executeCommand = (command: string): CommandOutput => {
    const cleanCommand = command.trim().toLowerCase();
    
    if (!cleanCommand) {
      return { type: 'text', content: '', command: '' };
    }

    // Handle cd command for project navigation
    if (cleanCommand.startsWith('cd ')) {
      const targetDir = cleanCommand.substring(3).trim();
      
      // Check if target is a number (project ID)
      const projectNumber = parseInt(targetDir);
      if (!isNaN(projectNumber) && projectNumber >= 1 && projectNumber <= projects.length) {
        // Navigate by project number
        const project = projects[projectNumber - 1];
        setCurrentProject(project);
        return { 
          type: 'list', 
          content: [
            `Navigated to ${project.title} project`,
            '',
            'Available commands:',
            '  goto    - Open project link in browser (if deployed)',
            '  github  - Navigate to GitHub repository',
            '  info    - Get project information and details',
            '  back    - Return to project list'
          ],
          command: cleanCommand 
        };
      } else {
        // Check if target is a project name
        const projectNames = projects.map(p => p.title.toLowerCase().replace(/\s+/g, '-'));
        if (projectNames.includes(targetDir)) {
          const project = projects.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === targetDir);
          if (project) {
            setCurrentProject(project);
            return { 
              type: 'list', 
              content: [
                `Navigated to ${project.title} project`,
                '',
                'Available commands:',
                '  goto    - Open project link in browser (if deployed)',
                '  github  - Navigate to GitHub repository',
                '  info    - Get project information and details',
                '  back    - Return to project list'
              ],
              command: cleanCommand 
            };
          }
        }
        return { type: 'error', content: `Project '${targetDir}' not found. Use 'projects' to see available projects.`, command: cleanCommand };
      }
    }

    // Handle project-specific commands when a project is selected
    if (currentProject) {
      switch (cleanCommand) {
        case 'goto':
          if (currentProject.link) {
            window.open(currentProject.link, '_blank');
            return { type: 'text', content: `Opened ${currentProject.title} in new tab`, command: cleanCommand };
          } else {
            return { type: 'text', content: 'Not currently publicly deployed', command: cleanCommand };
          }
        case 'github':
          if (currentProject.github) {
            window.open(currentProject.github, '_blank');
            return { type: 'text', content: `Opened ${currentProject.title} GitHub in new tab`, command: cleanCommand };
          } else {
            return { type: 'text', content: 'GitHub repository not available', command: cleanCommand };
          }
        case 'info':
          return { 
            type: 'text', 
            content: `${currentProject.title}${currentProject.featured ? ' ★' : ''}\n\n${currentProject.description}\n\nTech: ${currentProject.technologies.join(', ')}`, 
            command: cleanCommand 
          };
        case 'back':
          setCurrentProject(null);
          return { 
            type: 'list', 
            content: [
              'Returned to project list',
              '',
              'Type cd [project-name-or-number] to navigate to a particular project',
              '',
              '\n',
              ...projects.map((project, index) => 
                `${index + 1}\t${project.title}`
              )
            ], 
            command: cleanCommand 
          };
        default:
          return { type: 'error', content: `Command not found: ${command}. Use goto, github, info, or back.`, command: cleanCommand };
      }
    }

    // Handle general commands when no project is selected
    switch (cleanCommand) {
      case 'help':
        return {
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
          command: cleanCommand
        };

      case 'clear':
        setHistory([]);
        setCurrentProject(null);
        return { type: 'text', content: '', command: cleanCommand };

      case 'about':
        return {
          type: 'text',
          content: `${profile.name} - ${profile.title}\n\n${profile.bio}`,
          command: cleanCommand
        };

      case 'projects':
        return {
          type: 'list',
          content: [
            'Type `cd [project-name-or-number]` to navigate to a particular project',
            '',
            '\n',
            ...projects.map((project, index) => 
              `${index + 1}\t${project.title}`
            )
          ],
          command: cleanCommand
        };

      case 'photography':
        return {
          type: 'text',
          content: 'Photography portfolio coming soon...',
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

      default:
        return { type: 'error', content: `Command not found: ${command}. Type 'help' for available commands.`, command: cleanCommand };
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
    
    // Automatically refocus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const renderOutput = (output: CommandOutput) => {
    if (output.type === 'list' && Array.isArray(output.content)) {
      return (
        <div className="text-green-400 text-xs">
          {output.content.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
      );
    }
    
    if (output.type === 'error') {
      return <div className="text-red-400 text-xs">{output.content}</div>;
    }
    
    return <div className="text-green-400 whitespace-pre-wrap text-xs">{output.content}</div>;
  };

  return (
    <div className="relative inline-block bg-black">
      {/* Terminal container image */}
      <Image
        src="/pixel-art/terminal.jpg"
        alt="Terminal Container"
        width={600}
        height={400}
        className=""
      />
      
      {/* Terminal Content - positioned absolutely over the image */}
      <div className="absolute inset-0 z-10 pt-2 mr-4 mt-6 mb-4 pl-4 overflow-y-auto scrollbar-hide" style={{ fontFamily: 'UnifontExMono, monospace' }}>
        {/* Command History */}
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {/* Command Input */}
            <div className="flex items-center mb-1">
              <span className="text-green-500 mr-2 text-xs">$</span>
              <span className="text-green-400 text-xs">{entry.command}</span>
            </div>
            
            {/* Command Output */}
            {entry.output.content && (
              <div className="ml-4 mb-1">
                {renderOutput(entry.output)}
              </div>
            )}
          </div>
        ))}
        
        {/* Current Command Input */}
        <form onSubmit={handleCommandSubmit} className="flex items-center w-full relative">
          <span className="text-green-500 mr-2 text-xs flex items-center h-5" style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 outline-none border-none text-xs min-w-0 w-full h-5 leading-none pr-6"
            placeholder=""
            disabled={isLoading}
            aria-label="Terminal command input"
            style={{ 
              minWidth: '200px',
              fontSize: '0.75rem', // text-xs
              lineHeight: '1.25rem', // 20px to match h-5
              paddingTop: '0.375rem', // Increase top padding
              paddingBottom: '0.375rem', // Increase bottom padding
              caretColor: 'transparent', // Hide the native cursor
              fontFamily: 'UnifontExMono, monospace'
            }}
          />
          {/* Custom underscore cursor positioned over the input */}
          <span 
            className={`absolute text-green-400 text-xs pointer-events-none ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
            style={{
              left: `${currentInput.length + 2.5}ch`, // Use ch units for both positioning and offset
              top: '55%',
              transform: 'translateY(-50%)',
              fontFamily: 'UnifontExMono, monospace'
            }}
          >
            _
          </span>
          {isLoading && <span className="text-green-400 ml-2 text-xs">...</span>}
        </form>
        
        <div ref={historyEndRef} />
      </div>
    </div>
  );
};
