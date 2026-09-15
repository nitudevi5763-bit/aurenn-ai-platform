import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Uses the SECRET key — bypasses Row Level Security.
// Only ever import this in server-side code, never in a 'use client' file.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
