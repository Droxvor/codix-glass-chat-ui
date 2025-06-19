
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
  
  // Also check for LovableClaude's <lov-write> format
  if (!codeMatch) {
    const lovWriteMatch = response.match(/<lov-write[^>]*>([\s\S]*?)<\/lov-write>/);
    if (lovWriteMatch) {
      return lovWriteMatch[1];
    }
  }
  
  return codeMatch ? codeMatch[1] : null;
}

// Extract all lov-write blocks with their file paths
export function extractLovWriteBlocks(response: string): Array<{path: string, content: string}> {
  const lovWriteBlocks: Array<{path: string, content: string}> = [];
  const regex = /<lov-write\s+file_path="([^"]+)">([\s\S]*?)<\/lov-write>/g;
  
  let match;
  while ((match = regex.exec(response)) !== null) {
    lovWriteBlocks.push({
      path: match[1],
      content: match[2].trim()
    });
  }
  
  return lovWriteBlocks;
}

// Extract dependencies from lov-add-dependency blocks
export function extractDependencies(response: string): string[] {
  const dependencies: string[] = [];
  const regex = /<lov-add-dependency>([\s\S]*?)<\/lov-add-dependency>/g;
  
  let match;
  while ((match = regex.exec(response)) !== null) {
    const depContent = match[1].trim();
    
    // Try to parse as JSON first
    try {
      const depObj = JSON.parse(depContent);
      if (typeof depObj === 'object' && depObj !== null) {
        Object.entries(depObj).forEach(([pkg, version]) => {
          if (typeof pkg === 'string' && typeof version === 'string') {
            dependencies.push(`${pkg}@${version}`);
          }
        });
      }
    } catch {
      // If not valid JSON, try to extract package names from text
      const lines = depContent.split('\n');
      lines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine && !cleanLine.startsWith('//') && !cleanLine.startsWith('#') && !cleanLine.startsWith('{') && !cleanLine.startsWith('}')) {
          // Handle package@version format
          if (cleanLine.includes('@') && !cleanLine.startsWith('@')) {
            dependencies.push(cleanLine);
          } else if (cleanLine.length > 0 && !cleanLine.includes('{') && !cleanLine.includes('}')) {
            // Add @latest if no version specified
            dependencies.push(`${cleanLine}@latest`);
          }
        }
      });
    }
  }
  
  return dependencies;
}

// Extract environment variables from lov-env blocks
export function extractEnvVariables(response: string): Record<string, string> {
  const envVars: Record<string, string> = {};
  const regex = /<lov-env>([\s\S]*?)<\/lov-env>/g;
  
  let match;
  while ((match = regex.exec(response)) !== null) {
    const envContent = match[1].trim();
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const cleanLine = line.trim();
      if (cleanLine && cleanLine.includes('=')) {
        const [key, ...valueParts] = cleanLine.split('=');
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value;
      }
    });
  }
  
  return envVars;
}

// Helper function to detect if response contains LovableClaude format tags
export function containsLovableFormat(response: string): boolean {
  const lovableTags = [
    '<lov-thinking>',
    '<lov-security-scan>',
    '<lov-add-dependency>',
    '<lov-env>',
    '<lov-write',
    '<lov-success>'
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

// Extract success messages
export function extractSuccess(response: string): string | null {
  const successMatch = response.match(/<lov-success>([\s\S]*?)<\/lov-success>/);
  return successMatch ? successMatch[1] : null;
}
