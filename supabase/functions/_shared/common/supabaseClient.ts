import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"

function getSupabaseEnv() {
  const url = Deno.env.get("SUPABASE_URL")
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")

  if (!url || !anonKey) {
    throw new Error("Server misconfigured: missing SUPABASE_URL or SUPABASE_ANON_KEY")
  }

  return { url, anonKey }
}

export function createAnonClient(): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv()
  return createClient<Database>(url, anonKey, { auth: { persistSession: false } })
}

export function createUserClient(token: string): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv()

  return createClient<Database>(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  })
}
