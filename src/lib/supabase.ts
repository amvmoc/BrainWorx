import { createClient } from '@supabase/supabase-js';

const cleanString = (str: string): string => {
  return str.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
};

const supabaseUrl = cleanString(import.meta.env.VITE_SUPABASE_URL || '');
const supabaseAnonKey = cleanString(import.meta.env.VITE_SUPABASE_ANON_KEY || '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  console.error('\n📋 To fix this in Vercel:');
  console.error('1. Go to Project Settings → Environment Variables');
  console.error('2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('3. Enable for Production, Preview, and Development');
  console.error('4. Click SAVE');
  console.error('5. Redeploy your project (without cache)\n');

  throw new Error('Missing Supabase environment variables. Please check the console for instructions.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
