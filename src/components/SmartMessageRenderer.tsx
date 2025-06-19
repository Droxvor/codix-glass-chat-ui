
import React from 'react';
import { parseMessage, ParsedMessage } from '@/utils/messageParser';
import {
  LovWriteBlock,
  LovThinkingBlock,
  LovDependencyBlock,
  LovSuccessBlock,
  LovEnvBlock,
  LovSecurityBlock
} from './LovableBlocks';

interface SmartMessageRendererProps {
  content: string;
}

export const SmartMessageRenderer: React.FC<SmartMessageRendererProps> = ({ content }) => {
  const parsedMessage = parseMessage(content);

  if (parsedMessage.type === 'text') {
    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {parsedMessage.content}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Render regular text content if exists */}
      {parsedMessage.content && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {parsedMessage.content}
        </p>
      )}
      
      {/* Render LovableClaude blocks */}
      {parsedMessage.blocks?.map((block, index) => {
        switch (block.type) {
          case 'lov-write':
            return (
              <LovWriteBlock
                key={index}
                content={block.content}
                filePath={block.metadata?.filePath || 'unknown'}
                language={block.metadata?.language || 'text'}
              />
            );
          case 'lov-thinking':
            return (
              <LovThinkingBlock
                key={index}
                content={block.content}
              />
            );
          case 'lov-add-dependency':
            return (
              <LovDependencyBlock
                key={index}
                content={block.content}
              />
            );
          case 'lov-env':
            return (
              <LovEnvBlock
                key={index}
                content={block.content}
              />
            );
          case 'lov-security-scan':
            return (
              <LovSecurityBlock
                key={index}
                content={block.content}
              />
            );
          case 'lov-success':
            return (
              <LovSuccessBlock
                key={index}
                content={block.content}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
