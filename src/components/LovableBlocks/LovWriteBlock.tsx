
import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LovWriteBlockProps {
  content: string;
  filePath: string;
  language: string;
}

export const LovWriteBlock: React.FC<LovWriteBlockProps> = ({
  content,
  filePath,
  language
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 glass-strong rounded-2xl overflow-hidden border border-cyan-400/30 animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-400/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-mono text-cyan-400">{filePath}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-300">
            {language}
          </span>
        </div>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-cyan-400/20"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
        </Button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <pre className="text-sm text-foreground overflow-x-auto custom-scrollbar">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};
