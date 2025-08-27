"use client";

import React from 'react';
import { CommandOutput } from '@/utils/commands';

interface OutputBlockProps {
  output: CommandOutput;
}

export const OutputBlock: React.FC<OutputBlockProps> = ({ output }) => {
  const renderContent = () => {
    switch (output.type) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap text-terminal-text-dim">
            {output.content as string}
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-1">
            {(output.content as string[]).map((item, index) => (
              <div key={index} className="text-terminal-text-dim">
                {item}
              </div>
            ))}
          </div>
        );
      
      case 'link':
        return (
          <div className="space-y-2">
            {(output.content as { text: string; url: string }[]).map((link, index) => (
              <div key={index} className="text-terminal-text-dim">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-terminal-text-bright hover:underline cursor-pointer"
                >
                  {link.text}
                </a>
              </div>
            ))}
          </div>
        );
      
      case 'error':
        return (
          <div className="text-red-400">
            {output.content as string}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="terminal-line">
      {renderContent()}
    </div>
  );
};
