"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TextField } from "@/app/components/admin/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      setError(
        error.status === 429
          ? "Umejaribu mara nyingi. Subiri dakika chache kisha ujaribu tena."
          : "Imeshindikana kutuma barua pepe. Jaribu tena baadaye."
      );
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
          Umesahau password?
        </h1>

        {sent ? (
          <>
            <p className="text-sm text-ink/75">
              Kama email hiyo imesajiliwa, utapokea kiungo cha kuweka password mpya.
              Angalia pia kwenye folda ya Spam.
            </p>
            <Link href="/admin/login" className="inline-block text-sm text-forest hover:underline">
              Rudi kwenye kuingia
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-ink/70">
              Andika email yako ya admin, tutakutumia kiungo cha kuweka password mpya.
            </p>
            <TextField label="Email" type="email" required value={email} onChange={setEmail} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
            >
              {loading ? "Inatuma..." : "Tuma kiungo"}
            </button>
            <Link href="/admin/login" className="block text-center text-xs text-forest hover:underline">
              Rudi kwenye kuingia
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
