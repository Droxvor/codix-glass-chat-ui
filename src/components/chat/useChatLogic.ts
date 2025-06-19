
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatLogicProps {
  onSandboxCreate?: (url: string) => void;
}

export const useChatLogic = ({ onSandboxCreate }: UseChatLogicProps) => {
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

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleKeyPress,
  };
};
