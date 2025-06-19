
import React from 'react';

export const ChatHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan">
          <span className="text-sm font-bold text-white">C</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Codix AI
          </h1>
          <p className="text-xs text-muted-foreground">Dein Code-Assistent</p>
        </div>
      </div>
    </div>
  );
};
