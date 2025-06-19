
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
  onKeyPress,
  inputRef,
}) => {
  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Schreibe eine Nachricht..."
            disabled={isLoading}
            className="glass border-white/20 focus:border-cyan-400/50 focus:glow-cyan bg-white/5 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          onClick={onSendMessage}
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
  );
};
