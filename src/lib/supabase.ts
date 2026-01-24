import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Access environment variables with type safety (thanks to vite-env.d.ts)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail fast if config is missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL ERROR: Supabase environment variables are missing.');
  throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth for anonymous voting
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Optimize for high-frequency voting
    },
  },
});

// Export database type for use in services
export type SupabaseClient = typeof supabase;