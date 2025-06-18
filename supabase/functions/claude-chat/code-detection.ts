
export function extractCode(response: string): string | null {
  // Look for JSX code blocks first
  let codeMatch = response.match(/```jsx\n([\s\S]*?)\n```/);
  
  // If no JSX, look for JavaScript code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```javascript\n([\s\S]*?)\n```/);
  }
  
  // If no JavaScript, look for TypeScript code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```typescript\n([\s\S]*?)\n```/);
  }
  
  // If no specific language, look for generic code blocks
  if (!codeMatch) {
    codeMatch = response.match(/```\n([\s\S]*?)\n```/);
  }
  
  return codeMatch ? codeMatch[1] : null;
}
