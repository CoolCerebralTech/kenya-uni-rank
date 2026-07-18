import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Access environment variables with type safety (thanks to vite-env.d.ts)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// UniPulse v3: Supabase is now OPTIONAL. When env vars are missing or the
// connection is down, the app gracefully falls back to a rich demo dataset
// (see ./demoData.ts) so the interview demo always looks alive.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Demo mode is active when env is missing OR an explicit flag is set.
// This lets us ship a fully-populated preview build for the interview.
export const DEMO_MODE: boolean =
  !isSupabaseConfigured ||
  String(import.meta.env.VITE_DEMO_MODE ?? 'true').toLowerCase() === 'true';

// Create typed Supabase client ONLY when configured; otherwise export null.
// Services check `isSupabaseConfigured` and fall back to demo data.
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false, // No auth for anonymous voting
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Optimize for high-frequency voting
        },
      },
    })
  : null;

// Export database type for use in services
export type SupabaseClient = typeof supabase;
