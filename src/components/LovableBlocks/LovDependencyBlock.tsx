
import React from 'react';
import { Package } from 'lucide-react';

interface LovDependencyBlockProps {
  content: string;
}

export const LovDependencyBlock: React.FC<LovDependencyBlockProps> = ({ content }) => {
  const dependencies = content.split('\n').filter(dep => dep.trim());

  return (
    <div className="my-4 glass rounded-2xl overflow-hidden border border-orange-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-b border-orange-400/20 flex items-center space-x-2">
        <Package className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium text-orange-400">NPM Dependencies</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          {dependencies.map((dep, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <code className="text-sm text-foreground font-mono">{dep}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
