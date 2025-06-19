
import React from 'react';
import { CheckCircle, AlertCircle, Code, Package, Settings } from 'lucide-react';

interface ChatFeedbackProps {
  sandboxUrl?: string | null;
  feedbackMessage?: string;
}

export const ChatFeedback: React.FC<ChatFeedbackProps> = ({ 
  sandboxUrl, 
  feedbackMessage 
}) => {
  if (!sandboxUrl && !feedbackMessage) return null;

  return (
    <div className="mt-4 space-y-2">
      {/* Sandbox Creation Success */}
      {sandboxUrl && (
        <div className="glass rounded-xl p-3 border border-green-400/30 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
              CodeSandbox erstellt
            </span>
            <a 
              href={sandboxUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 underline ml-auto"
            >
              Öffnen →
            </a>
          </div>
        </div>
      )}

      {/* General Feedback */}
      {feedbackMessage && (
        <div className="glass rounded-xl p-3 border border-blue-400/30">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              {feedbackMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
