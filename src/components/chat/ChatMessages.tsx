
import React from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatFeedback } from './ChatFeedback';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sandboxUrl?: string | null;
  feedbackMessage?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            {!message.isUser && (
              <ChatFeedback 
                sandboxUrl={message.sandboxUrl}
                feedbackMessage={message.feedbackMessage}
              />
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble-bot p-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Codix AI denkt nach...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
