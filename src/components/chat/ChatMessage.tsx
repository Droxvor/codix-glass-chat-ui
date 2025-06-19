
import React from 'react';
import { SmartMessageRenderer } from '../SmartMessageRenderer';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-3 smooth-transition ${
          message.isUser
            ? 'chat-bubble-user text-white'
            : 'chat-bubble-bot text-foreground'
        }`}
      >
        {message.isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <SmartMessageRenderer content={message.content} />
        )}
        <div className="flex justify-end mt-2">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
