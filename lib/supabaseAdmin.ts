import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the secret key, which bypasses Row Level Security.
// Never import this file from a "use client" component.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  );
}
