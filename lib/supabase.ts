import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://idxkstcogilutwvaocvx.supabase.co";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable__QRsUG4_Lp8aVPtwM37kKA_zTc67GHq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
