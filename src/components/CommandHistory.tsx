"use client";

import React from 'react';
import { CommandOutput } from '@/utils/commands';
import { OutputBlock } from './OutputBlock';

interface CommandHistoryProps {
  history: Array<{
    command: string;
    output: CommandOutput;
    timestamp: Date;
  }>;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ history }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {history.map((entry, index) => (
        <div key={index} className="space-y-1">
          {/* Command input */}
          <div className="flex items-center space-x-2">
            <span className="text-terminal-text-bright">$</span>
            <span className="text-terminal-text">{entry.command}</span>
          </div>
          
          {/* Command output */}
          {entry.output.content && (
            <OutputBlock output={entry.output} />
          )}
        </div>
      ))}
    </div>
  );
};
