"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TextField, PasswordInput } from "@/app/components/admin/ui";

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
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-8"
      >
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
          Admin Login
        </h1>

        <TextField label="Email" type="email" required value={email} onChange={setEmail} />
        <PasswordInput label="Password" value={password} onChange={setPassword} />

        <div className="text-right">
          <Link
            href="/admin/forgot-password"
            className="text-xs text-forest hover:underline"
          >
            Umesahau password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {loading ? "Inaingia..." : "Ingia"}
        </button>
      </form>
    </div>
  );
}
