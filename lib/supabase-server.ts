import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase";

const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

type NextInit = RequestInit & { next?: { revalidate: number } };

/** Kwa kurasa za umma: majibu yanahifadhiwa dakika 1 (ISR), kisha yanasasishwa. */
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  ...options,
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      const method = (init?.method ?? "GET").toUpperCase();
      if (method !== "GET") return fetch(input, init);
      return fetch(input, { ...init, next: { revalidate: 60 } } as NextInit);
    },
  },
});

/** Kwa API routes: data mpya kila mara, bila kuhifadhi. */
export const supabaseFresh = createClient(supabaseUrl, supabaseAnonKey, options);
