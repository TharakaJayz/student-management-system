import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.1"

import type { Database } from "../../../../types/supabase.ts"
import { AppError } from "./errors.ts"

export function getBearerToken(req: Request): string {
  const auth = req.headers.get("Authorization") ?? req.headers.get("authorization")
  const token = auth?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()

  if (!token) {
    throw new AppError("Missing Authorization Bearer token", 401)
  }

  return token
}

export async function getAuthenticatedUser(
  supabase: SupabaseClient<Database>,
  token: string,
) {
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    throw new AppError("Invalid or expired token", 401)
  }

  return data.user
}
