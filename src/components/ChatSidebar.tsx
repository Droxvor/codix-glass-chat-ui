
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import { useChatLogic } from './chat/useChatLogic';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSandboxCreate?: (url: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onToggle, onSandboxCreate }) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleKeyPress,
  } = useChatLogic({ onSandboxCreate });

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 glass-strong glow-cyan hover:glow-blue smooth-transition"
        size="sm"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-40 smooth-transition ${
          isOpen ? 'w-[80%] max-w-md' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="h-full glass-strong border-r border-white/20 flex flex-col">
          <ChatHeader />
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
            messagesEndRef={messagesEndRef} 
          />
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            inputRef={inputRef}
          />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 smooth-transition"
          onClick={onToggle}
        />
      )}
    </>
  );
};
