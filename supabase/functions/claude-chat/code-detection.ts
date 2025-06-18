
export function isCodeRequest(message: string): boolean {
  const codeKeywords = [
    'erstelle', 'create', 'component', 'button', 'react', 'javascript', 'typescript',
    'html', 'css', 'code', 'app', 'function', 'hook', 'page', 'website'
  ];
  return codeKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

export function extractCode(response: string): string | null {
  const codeMatch = response.match(/```jsx\n([\s\S]*?)\n```/);
  return codeMatch ? codeMatch[1] : null;
}
