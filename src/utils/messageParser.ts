
export interface ParsedMessage {
  type: 'text' | 'lovable';
  content: string;
  blocks?: LovableBlock[];
}

export interface LovableBlock {
  type: 'lov-write' | 'lov-thinking' | 'lov-add-dependency' | 'lov-env' | 'lov-security-scan' | 'lov-success';
  content: string;
  metadata?: {
    filePath?: string;
    language?: string;
  };
}

export function parseMessage(message: string): ParsedMessage {
  // Check if message contains LovableClaude tags
  const lovableTags = [
    '<lov-thinking>',
    '<lov-write',
    '<lov-add-dependency>',
    '<lov-env>',
    '<lov-security-scan>',
    '<lov-success>'
  ];
  
  const hasLovableTags = lovableTags.some(tag => message.includes(tag));
  
  if (!hasLovableTags) {
    return {
      type: 'text',
      content: message
    };
  }

  const blocks: LovableBlock[] = [];
  let textContent = message;

  // Extract lov-thinking blocks
  const thinkingRegex = /<lov-thinking>([\s\S]*?)<\/lov-thinking>/g;
  let match;
  while ((match = thinkingRegex.exec(message)) !== null) {
    blocks.push({
      type: 'lov-thinking',
      content: match[1].trim()
    });
    textContent = textContent.replace(match[0], '');
  }

  // Extract lov-write blocks
  const writeRegex = /<lov-write\s+file_path="([^"]+)">([\s\S]*?)<\/lov-write>/g;
  while ((match = writeRegex.exec(message)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    const language = getLanguageFromPath(filePath);
    
    blocks.push({
      type: 'lov-write',
      content: content,
      metadata: {
        filePath: filePath,
        language: language
      }
    });
    textContent = textContent.replace(match[0], '');
  }

  // Extract lov-add-dependency blocks
  const depRegex = /<lov-add-dependency>([\s\S]*?)<\/lov-add-dependency>/g;
  while ((match = depRegex.exec(message)) !== null) {
    blocks.push({
      type: 'lov-add-dependency',
      content: match[1].trim()
    });
    textContent = textContent.replace(match[0], '');
  }

  // Extract lov-env blocks
  const envRegex = /<lov-env>([\s\S]*?)<\/lov-env>/g;
  while ((match = envRegex.exec(message)) !== null) {
    blocks.push({
      type: 'lov-env',
      content: match[1].trim()
    });
    textContent = textContent.replace(match[0], '');
  }

  // Extract lov-security-scan blocks
  const securityRegex = /<lov-security-scan>([\s\S]*?)<\/lov-security-scan>/g;
  while ((match = securityRegex.exec(message)) !== null) {
    blocks.push({
      type: 'lov-security-scan',
      content: match[1].trim()
    });
    textContent = textContent.replace(match[0], '');
  }

  // Extract lov-success blocks
  const successRegex = /<lov-success>([\s\S]*?)<\/lov-success>/g;
  while ((match = successRegex.exec(message)) !== null) {
    blocks.push({
      type: 'lov-success',
      content: match[1].trim()
    });
    textContent = textContent.replace(match[0], '');
  }

  return {
    type: 'lovable',
    content: textContent.trim(),
    blocks: blocks
  };
}

function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return 'jsx';
    case 'ts':
      return 'typescript';
    case 'js':
      return 'javascript';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    default:
      return 'text';
  }
}
