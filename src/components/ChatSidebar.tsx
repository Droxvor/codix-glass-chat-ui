import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSandboxCreate?: (url: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onToggle, onSandboxCreate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hallo! Ich bin Codix AI, dein intelligenter Code-Assistent. Wie kann ich dir heute beim Programmieren helfen?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending message to Claude API...');
      
      // Get conversation history (excluding the welcome message)
      const conversationHistory = messages.slice(1);
      
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          message: messageContent,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Fehler beim Aufrufen der Claude API');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unbekannter Fehler bei der API-Anfrage');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      console.log('AI response received and added to chat');

      // Handle sandbox creation
      if (data.sandboxUrl && onSandboxCreate) {
        console.log('Creating sandbox with URL:', data.sandboxUrl);
        onSandboxCreate(data.sandboxUrl);
        
        toast({
          title: "CodeSandbox erstellt!",
          description: "Dein generierter Code wurde in eine neue Sandbox geladen.",
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Entschuldigung, es gab einen Fehler beim Verarbeiten deiner Nachricht: ${error.message}. Bitte versuche es erneut.`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan">
                <span className="text-sm font-bold text-white">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Codix AI
                </h1>
                <p className="text-xs text-muted-foreground">Dein Code-Assistent</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 smooth-transition ${
                      message.isUser
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-bot text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
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

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Schreibe eine Nachricht..."
                  disabled={isLoading}
                  className="glass border-white/20 focus:border-cyan-400/50 focus:glow-cyan bg-white/5 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 glow-cyan smooth-transition disabled:opacity-50"
                size="sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Drücke Enter zum Senden
            </p>
          </div>
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
