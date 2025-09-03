"use client";

import React from 'react';
import Image from 'next/image';
import { CommandHistory } from './CommandHistory';
import { CommandInput } from './CommandInput';

interface TerminalContainerProps {
  history: Array<{
    command: string;
    output: any;
    timestamp: Date;
  }>;
  currentInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  showCursor: boolean;
  historyEndRef: React.RefObject<HTMLDivElement>;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({
  history,
  currentInput,
  onInputChange,
  onSubmit,
  isLoading,
  showCursor,
  historyEndRef
}) => {
  return (
    <div className="relative inline-block bg-black terminal-container">
      {/* Terminal container image */}
      <Image
        src="/pixel-art/terminal.jpg"
        alt="Terminal Container"
        style={{
          width: 'calc(35vw)',
          height: 'calc(40vh)'
        }}
        width={500}
        height={400}
        className=""
      />
      
      {/* Terminal Content - positioned absolutely over the image */}
      <div className="absolute inset-0 z-10 pt-2 mr-4 mt-6 mb-4 pl-4 overflow-y-auto scrollbar-hide" style={{ fontFamily: 'UnifontExMono, monospace' }}>
        {/* Command History */}
        <CommandHistory history={history} />
        
        {/* Current Command Input */}
        <CommandInput
          currentInput={currentInput}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          showCursor={showCursor}
        />
        
        {/* Scroll reference for auto-scroll */}
        <div ref={historyEndRef} />
      </div>
    </div>
  );
};
