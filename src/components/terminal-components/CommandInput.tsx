"use client";

import React, { useRef, useEffect } from 'react';

interface CommandInputProps {
  currentInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  showCursor: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  currentInput,
  onInputChange,
  onSubmit,
  isLoading,
  showCursor
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex items-center w-full relative">
      <span className="text-green-500 mr-2 text-xs flex items-center h-5" style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>$</span>
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => onInputChange(e.target.value)}
        className="flex-1 bg-transparent text-green-400 outline-none border-none text-xs min-w-0 w-full h-5 leading-none pr-6"
        placeholder=""
        disabled={isLoading}
        aria-label="Terminal command input"
        style={{ 
          minWidth: '200px',
          fontSize: '0.75rem',
          lineHeight: '1.25rem',
          paddingTop: '0.375rem',
          paddingBottom: '0.375rem',
          caretColor: 'transparent',
          fontFamily: 'UnifontExMono, monospace'
        }}
      />
      {/* Custom underscore cursor positioned over the input */}
      <span 
        className={`absolute text-green-400 text-xs pointer-events-none ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
        style={{
          left: `${currentInput.length + 2.5}ch`,
          top: '55%',
          transform: 'translateY(-50%)',
          fontFamily: 'UnifontExMono, monospace'
        }}
      >
        _
      </span>
      {isLoading && <span className="text-green-400 ml-2 text-xs">...</span>}
    </form>
  );
};
