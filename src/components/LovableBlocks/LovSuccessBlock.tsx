
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface LovSuccessBlockProps {
  content: string;
}

export const LovSuccessBlock: React.FC<LovSuccessBlockProps> = ({ content }) => {
  return (
    <div className="my-4 glass rounded-2xl overflow-hidden border border-green-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-400/20 flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-green-400">Erfolgreich</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-green-300 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};
