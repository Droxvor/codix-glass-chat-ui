
// Enhanced code extraction with better cleaning and multiple format support
export function extractPureCode(response: string): string | null {
  let code = extractCode(response);
  
  if (!code) return null;
  
  // Remove common prefixes and explanatory text
  const prefixesToRemove = [
    'Hier ist der Code:',
    'Here is the code:',
    'Der Code lautet:',
    'Code:',
    '// Code:',
    '/* Code */',
    'Beispiel:',
    'Example:',
  ];
  
  prefixesToRemove.forEach(prefix => {
    const regex = new RegExp(`^\\s*${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'im');
    code = code?.replace(regex, '') || code;
  });
  
  // Remove trailing explanations
  const trailingToRemove = [
    'Das war der Code.',
    'That was the code.',
    'Ende des Codes.',
    'End of code.',
  ];
  
  trailingToRemove.forEach(trailing => {
    const regex = new RegExp(`\\s*${trailing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
    code = code?.replace(regex, '') || code;
  });
  
  // Remove excessive whitespace but preserve intentional formatting
  if (code) {
    code = code.replace(/^\s+|\s+$/g, ''); // Trim start and end
    code = code.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines
  }
  
  return code;
}

// Extract all lov-write blocks with enhanced metadata
export function extractAdvancedLovWriteBlocks(response: string): Array<{
  path: string;
  content: string;
  language: string;
  isNewFile: boolean;
  cleanContent: string;
}> {
  const lovWriteBlocks: Array<{
    path: string;
    content: string;
    language: string;
    isNewFile: boolean;
    cleanContent: string;
  }> = [];
  
  const regex = /<lov-write\s+file_path="([^"]+)">([\s\S]*?)<\/lov-write>/g;
  
  let match;
  while ((match = regex.exec(response)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    const language = getLanguageFromPath(filePath);
    const cleanContent = extractPureCode(content) || content;
    
    lovWriteBlocks.push({
      path: filePath,
      content: content,
      language: language,
      isNewFile: !response.includes(`// ... keep existing code`), // Simple heuristic
      cleanContent: cleanContent
    });
  }
  
  return lovWriteBlocks;
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
    case 'md':
      return 'markdown';
    default:
      return 'text';
  }
}

// Generate change summary from LovableClaude response
export function generateChangeSummary(response: string): string {
  const lovWriteBlocks = extractAdvancedLovWriteBlocks(response);
  const dependencies = extractDependencies(response);
  const envVariables = extractEnvVariables(response);
  
  if (lovWriteBlocks.length === 0 && dependencies.length === 0 && Object.keys(envVariables).length === 0) {
    return '';
  }
  
  let summary = '\n\n---\n**Änderungen:**\n';
  
  // Categorize files
  const newFiles = lovWriteBlocks.filter(block => block.isNewFile);
  const editedFiles = lovWriteBlocks.filter(block => !block.isNewFile);
  
  // New files
  if (newFiles.length > 0) {
    newFiles.forEach(file => {
      summary += `✅ Neue Datei: ${file.path}\n`;
    });
  }
  
  // Edited files  
  if (editedFiles.length > 0) {
    editedFiles.forEach(file => {
      summary += `✏️ Bearbeitet: ${file.path}\n`;
    });
  }
  
  // Dependencies
  if (dependencies.length > 0) {
    summary += `📦 Dependencies: ${dependencies.length} Pakete hinzugefügt\n`;
  }
  
  // Environment variables
  if (Object.keys(envVariables).length > 0) {
    summary += `🔧 Umgebungsvariablen: ${Object.keys(envVariables).length} konfiguriert\n`;
  }
  
  // If no deletions detected, add that info
  summary += `❌ Gelöscht: —\n`;
  
  summary += '---\n';
  
  return summary;
}
