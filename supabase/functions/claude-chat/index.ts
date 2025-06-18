
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
const codesandboxApiKey = Deno.env.get('CODESANDBOX_API_KEY');

// Helper function to detect if prompt is asking for code generation
function isCodeRequest(message: string): boolean {
  const codeKeywords = [
    'erstelle', 'create', 'component', 'button', 'react', 'javascript', 'typescript',
    'html', 'css', 'code', 'app', 'function', 'hook', 'page', 'website'
  ];
  return codeKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Helper function to create a CodeSandbox
async function createCodeSandbox(code: string, title: string): Promise<string | null> {
  if (!codesandboxApiKey) {
    console.log('CodeSandbox API key not available');
    return null;
  }

  try {
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${codesandboxApiKey}`,
      },
      body: JSON.stringify({
        files: {
          'package.json': {
            content: JSON.stringify({
              name: title.toLowerCase().replace(/\s+/g, '-'),
              version: '1.0.0',
              main: 'index.js',
              dependencies: {
                'react': '^18.0.0',
                'react-dom': '^18.0.0',
                'react-scripts': '^5.0.0'
              },
              scripts: {
                start: 'react-scripts start',
                build: 'react-scripts build'
              }
            }, null, 2)
          },
          'public/index.html': {
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
          },
          'src/index.js': {
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
          },
          'src/App.js': {
            content: code
          }
        },
        template: 'create-react-app'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return `https://codesandbox.io/s/${data.sandbox_id}`;
    } else {
      console.error('CodeSandbox creation failed:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error creating CodeSandbox:', error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    const { message, conversationHistory = [] } = await req.json();
    
    console.log('Received message:', message);
    console.log('Conversation history length:', conversationHistory.length);

    const isCodeGeneration = isCodeRequest(message);
    console.log('Is code generation request:', isCodeGeneration);

    // Prepare messages for Claude API
    let systemPrompt = "Du bist Codix AI, ein intelligenter Code-Assistent. Du hilfst Benutzern beim Programmieren, erklärst Konzepte und unterstützt bei der Entwicklung. Antworte auf Deutsch und sei hilfreich und freundlich. Du kannst bei React, JavaScript, TypeScript, CSS, HTML und allgemeinen Programmierfragen helfen.";

    if (isCodeGeneration) {
      systemPrompt += `

WICHTIG: Da der Benutzer Code erstellen möchte, antworte im folgenden Format:

1. Beginne mit einer kurzen Erklärung (1-2 Sätze)
2. Dann schreibe "```jsx" gefolgt von einem vollständigen, ausführbaren React-Code
3. Beende den Code mit "```"
4. Füge eine kurze Beschreibung hinzu, was der Code macht

Der Code sollte:
- Eine vollständige React-Komponente oder App sein
- Alle nötigen Imports enthalten
- Moderne React-Patterns verwenden (Hooks, funktionale Komponenten)
- Gut strukturiert und kommentiert sein
- Sofort ausführbar sein ohne weitere Dependencies außer React

Beispiel-Format:
Hier ist ein einfacher Button für dich:

\`\`\`jsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Mein Button</h1>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Geklickt: {count} mal
      </button>
    </div>
  );
}

export default App;
\`\`\`

Diese Komponente erstellt einen klickbaren Button mit einem Zähler.`;
    }

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    console.log('Sending request to Claude API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1500,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Claude API response received');

    const aiResponse = data.content[0].text;
    let sandboxUrl = null;

    // Extract code and create sandbox if this is a code generation request
    if (isCodeGeneration && codesandboxApiKey) {
      const codeMatch = aiResponse.match(/```jsx\n([\s\S]*?)\n```/);
      if (codeMatch) {
        const extractedCode = codeMatch[1];
        console.log('Extracted code for sandbox creation');
        
        // Create a title from the original message
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
        sandboxUrl = await createCodeSandbox(extractedCode, title);
        
        if (sandboxUrl) {
          console.log('CodeSandbox created:', sandboxUrl);
        }
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sandboxUrl: sandboxUrl,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in claude-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
