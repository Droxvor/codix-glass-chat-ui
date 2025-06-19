
import React from 'react';
import { Shield } from 'lucide-react';

interface LovEnvBlockProps {
  content: string;
}

export const LovEnvBlock: React.FC<LovEnvBlockProps> = ({ content }) => {
  const envVars = content.split('\n').filter(line => line.trim() && line.includes('='));

  return (
    <div className="my-4 glass rounded-2xl overflow-hidden border border-blue-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-b border-blue-400/20 flex items-center space-x-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-blue-400">Umgebungsvariablen</span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="space-y-2">
          {envVars.map((envVar, index) => {
            const [key, value] = envVar.split('=');
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <code className="text-sm text-blue-300 font-mono">{key}</code>
                <span className="text-xs text-muted-foreground">=</span>
                <code className="text-sm text-foreground font-mono">{value}</code>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
