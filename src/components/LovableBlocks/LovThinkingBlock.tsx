
import React from 'react';
import { Brain } from 'lucide-react';

interface LovThinkingBlockProps {
  content: string;
}

export const LovThinkingBlock: React.FC<LovThinkingBlockProps> = ({ content }) => {
  return (
    <div className="my-4 glass rounded-2xl overflow-hidden border border-purple-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-400/20 flex items-center space-x-2">
        <Brain className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-400">AI Denkprozess</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
          {content}
        </p>
      </div>
    </div>
  );
};
