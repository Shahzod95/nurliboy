import { createClient } from "@supabase/supabase-js";

// Server-side client — service role key faqat API route'larda ishlatiladi,
// brauzerga hech qachon yuborilmaydi.
export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
