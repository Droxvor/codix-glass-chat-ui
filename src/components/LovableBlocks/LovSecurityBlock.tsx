
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface LovSecurityBlockProps {
  content: string;
}

export const LovSecurityBlock: React.FC<LovSecurityBlockProps> = ({ content }) => {
  return (
    <div className="my-4 glass rounded-2xl overflow-hidden border border-red-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-400/20 flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Sicherheits-Scan</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-red-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
};
