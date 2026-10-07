"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Imeshindikana kuingia. Hakikisha email na password ni sahihi.");
    } else {
      router.push("/admin/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-forest-dark/10 bg-white p-8"
      >
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
          Admin Login
        </h1>

        <label className="mt-6 block text-sm font-medium text-ink/80">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-ink/80">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-forest-dark/20 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {loading ? "Inaingia..." : "Ingia"}
        </button>
      </form>
    </div>
  );
}
