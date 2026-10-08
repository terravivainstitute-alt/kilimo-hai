"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PasswordInput } from "@/app/components/admin/ui";

type Stage = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiungo cha barua pepe kinaleta "recovery session" kiotomatiki
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setStage("ready");
    });

    supabase.auth.getSession().then(({ data }) => {
      setStage((prev) => (data.session ? "ready" : prev === "checking" ? "invalid" : prev));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password iwe na angalau herufi 8.");
      return;
    }
    if (password !== confirm) {
      setError("Password hazilingani. Jaribu tena.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Imeshindikana kubadilisha password. Omba kiungo kipya na ujaribu tena.");
      return;
    }

    setStage("done");
    setTimeout(() => router.push("/admin/dashboard"), 1500);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-forest-dark/10 bg-white p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-forest-dark">
          Weka password mpya
        </h1>

        {stage === "checking" && <p className="text-sm text-ink/50">Inakagua kiungo...</p>}

        {stage === "invalid" && (
          <>
            <p className="text-sm text-ink/75">
              Kiungo hiki si sahihi au muda wake umeisha. Omba kiungo kipya.
            </p>
            <Link href="/admin/forgot-password" className="inline-block text-sm text-forest hover:underline">
              Omba kiungo kipya
            </Link>
          </>
        )}

        {stage === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              label="Password mpya"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              minLength={8}
            />
            <PasswordInput
              label="Rudia password mpya"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              minLength={8}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
            >
              {loading ? "Inahifadhi..." : "Hifadhi password"}
            </button>
          </form>
        )}

        {stage === "done" && (
          <p className="rounded-md bg-leaf-light/40 px-4 py-3 text-sm text-forest-dark">
            Password imebadilishwa. Inakupeleka kwenye dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
