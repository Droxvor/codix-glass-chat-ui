
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { createCodeSandbox } from './codesandbox.ts';
import { isCodeRequest, extractCode } from './code-detection.ts';
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

    const isCodeGeneration = isCodeRequest(message);
    console.log('Is code generation request:', isCodeGeneration);

    // Prepare system prompt
    const systemPrompt = getSystemPrompt(isCodeGeneration);

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
        system: systemPrompt,
        messages: messages,
        max_tokens: 1500
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
      const extractedCode = extractCode(aiResponse);
      if (extractedCode) {
        console.log('Extracted code for sandbox creation');
        
        // Create a title from the original message
        const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
        sandboxUrl = await createCodeSandbox(extractedCode, title, codesandboxApiKey);
        
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
