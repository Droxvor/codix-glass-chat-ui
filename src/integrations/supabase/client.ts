// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xfsmhinfrdaszkjbozxl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmc21oaW5mcmRhc3pramJvenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTE4MDQsImV4cCI6MjA2NTgyNzgwNH0.1YWHSxsJIzeYj2CalqfiO2ruxzqYQ5smp-_eHZ_SRkQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);