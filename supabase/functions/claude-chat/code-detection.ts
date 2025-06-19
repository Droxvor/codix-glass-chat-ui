
export function extractCode(response: string): string | null {
  // Look for JSX code blocks first (most common for React apps)
  let codeMatch = response.match(/```jsx\n([\s\S]*?)\n```/);
  
  // If no JSX, look for JavaScript code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```javascript\n([\s\S]*?)\n```/);
  }
  
  // If no JavaScript, look for TypeScript code blocks  
  if (!codeMatch) {
    codeMatch = response.match(/```typescript\n([\s\S]*?)\n```/);
  }
  
  // Look for React/TSX code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```tsx\n([\s\S]*?)\n```/);
  }
  
  // If no specific language, look for generic code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```\n([\s\S]*?)\n```/);
  }
  
  // Also check for LovableClaude's <lov-write> format (for future compatibility)
  if (!codeMatch) {
    const lovWriteMatch = response.match(/<lov-write[^>]*>([\s\S]*?)<\/lov-write>/);
    if (lovWriteMatch) {
      return lovWriteMatch[1];
    }
  }
  
  return codeMatch ? codeMatch[1] : null;
}

// Helper function to detect if response contains LovableClaude format tags
export function containsLovableFormat(response: string): boolean {
  const lovableTags = [
    '<lov-thinking>',
    '<lov-security-scan>',
    '<lov-add-dependency>',
    '<lov-env>',
    '<lov-write'
  ];
  
  return lovableTags.some(tag => response.includes(tag));
}

// Extract thinking blocks for logging/debugging
export function extractThinking(response: string): string | null {
  const thinkingMatch = response.match(/<lov-thinking>([\s\S]*?)<\/lov-thinking>/);
  return thinkingMatch ? thinkingMatch[1] : null;
}

// Extract security scan results
export function extractSecurityScan(response: string): string | null {
  const securityMatch = response.match(/<lov-security-scan>([\s\S]*?)<\/lov-security-scan>/);
  return securityMatch ? securityMatch[1] : null;
}
