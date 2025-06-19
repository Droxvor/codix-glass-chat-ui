
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { createCodeSandbox, createAdvancedCodeSandbox, LovableClaude } from './codesandbox.ts';
import { 
  extractCode, 
  containsLovableFormat, 
  extractThinking, 
  extractSecurityScan,
  extractLovWriteBlocks,
  extractDependencies,
  extractEnvVariables,
  extractSuccess
} from './code-detection.ts';
import { getSystemPrompt } from './prompts.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
const codesandboxApiKey = Deno.env.get('CODESANDBOX_API_KEY');

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

    // Prepare system prompt for LovableClaude
    const systemPrompt = getSystemPrompt();

    // Prepare messages for Claude API (only user/assistant messages)
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    console.log('Sending request to Claude API as LovableClaude...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        system: systemPrompt,
        messages: messages,
        max_tokens: 4000 // Increased for more detailed LovableClaude responses with tags
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        response: "Entschuldigung, es gab ein Problem beim Verarbeiten deiner Anfrage. LovableClaude ist momentan nicht verfügbar. Bitte versuche es in ein paar Minuten erneut.",
        success: false 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('LovableClaude response received successfully');

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response structure from Claude API');
    }

    const aiResponse = data.content[0].text;
    let sandboxUrl = null;
    let feedbackMessage = '';

    // Process LovableClaude format if detected
    if (containsLovableFormat(aiResponse)) {
      console.log('LovableClaude format detected - processing structured response...');
      
      // Log thinking process if present
      const thinking = extractThinking(aiResponse);
      if (thinking) {
        console.log('LovableClaude thinking:', thinking.substring(0, 200) + '...');
      }
      
      // Log security scan if present
      const securityScan = extractSecurityScan(aiResponse);
      if (securityScan) {
        console.log('Security scan results:', securityScan.substring(0, 200) + '...');
      }

      // Extract structured data for advanced CodeSandbox creation
      const lovWriteBlocks = extractLovWriteBlocks(aiResponse);
      const dependencies = extractDependencies(aiResponse);
      const envVariables = extractEnvVariables(aiResponse);
      const successMessage = extractSuccess(aiResponse);

      if (lovWriteBlocks.length > 0 && codesandboxApiKey) {
        console.log(`Found ${lovWriteBlocks.length} lov-write blocks for CodeSandbox creation`);
        
        const lovableData: LovableClaude = {
          files: lovWriteBlocks,
          dependencies: dependencies,
          envVariables: envVariables
        };

        // Create title from the original message
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
        
        sandboxUrl = await createAdvancedCodeSandbox(lovableData, title, codesandboxApiKey);
        
        if (sandboxUrl) {
          console.log('Advanced CodeSandbox created successfully:', sandboxUrl);
          feedbackMessage = `✅ CodeSandbox erstellt mit ${lovWriteBlocks.length} Dateien`;
          
          if (dependencies.length > 0) {
            feedbackMessage += `, ${dependencies.length} Dependencies`;
          }
          
          if (Object.keys(envVariables).length > 0) {
            feedbackMessage += `, ${Object.keys(envVariables).length} Umgebungsvariablen`;
          }
        } else {
          console.log('Advanced CodeSandbox creation failed');
          feedbackMessage = '⚠️ CodeSandbox-Erstellung fehlgeschlagen';
        }
      } else if (lovWriteBlocks.length > 0) {
        console.log('CodeSandbox API key not available for advanced creation');
        feedbackMessage = '⚠️ CodeSandbox API nicht verfügbar';
      }

      // Log success message if present
      if (successMessage) {
        console.log('Success message:', successMessage.substring(0, 200) + '...');
      }
    } else {
      // Fallback: Try to extract simple code for basic sandbox creation
      if (codesandboxApiKey) {
        const extractedCode = extractCode(aiResponse);
        if (extractedCode) {
          console.log('Extracted simple code for basic sandbox creation');
          
          const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
          sandboxUrl = await createCodeSandbox(extractedCode, title, codesandboxApiKey);
          
          if (sandboxUrl) {
            console.log('Basic CodeSandbox created successfully:', sandboxUrl);
            feedbackMessage = '✅ Einfache CodeSandbox erstellt';
          } else {
            console.log('Basic CodeSandbox creation failed');
          }
        } else {
          console.log('No code found in response for sandbox creation');
        }
      } else {
        console.log('CodeSandbox API key not available');
      }
    }

    // Prepare final response
    let finalResponse = aiResponse;
    if (feedbackMessage) {
      finalResponse += `\n\n💾 **CodeSandbox Status:** ${feedbackMessage}`;
    }

    return new Response(JSON.stringify({ 
      response: finalResponse,
      sandboxUrl: sandboxUrl,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in LovableClaude function:', error);
    return new Response(JSON.stringify({ 
      response: "Es gab einen technischen Fehler. Bitte versuche es erneut.",
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
