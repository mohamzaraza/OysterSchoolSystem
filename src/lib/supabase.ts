import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Used only when env vars are missing during CI/Vercel build (avoids prerender crash)
const BUILD_PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const BUILD_PLACEHOLDER_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

function isValidHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function resolveSupabaseConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (url && key && isValidHttpUrl(url)) {
    return { url, key }
  }

  return { url: BUILD_PLACEHOLDER_URL, key: BUILD_PLACEHOLDER_KEY }
}

let client: SupabaseClient | undefined

export function getSupabase(): SupabaseClient {
  if (!client) {
    const { url, key } = resolveSupabaseConfig()
    client = createClient(url, key)
  }
  return client
}

/** Shared Supabase client (lazy init so builds without env vars do not fail). */
export const supabase = getSupabase()
