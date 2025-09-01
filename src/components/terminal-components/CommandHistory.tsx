"use client";

import React from 'react';

interface CommandOutput {
  type: 'text' | 'list' | 'error';
  content: string | string[];
  command: string;
}

interface CommandHistoryProps {
  history: Array<{
    command: string;
    output: CommandOutput;
    timestamp: Date;
  }>;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ history }) => {
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
    <>
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
    </>
  );
};
