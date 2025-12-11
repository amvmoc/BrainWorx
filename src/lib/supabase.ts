import { createClient } from '@supabase/supabase-js';

const cleanString = (str: string): string => {
  // Remove all control characters, non-printable characters, and keep only ASCII
  return str
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\x00-\x7F]/g, ''); // Remove any non-ASCII characters
};

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = cleanString(rawUrl);
const supabaseAnonKey = cleanString(rawKey);

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
