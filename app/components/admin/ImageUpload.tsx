"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/storage";

/** Picha moja (mfano: picha ya bidhaa, cover ya makala) */
export function SingleImageUpload({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Imeshindikana kupakia picha.");
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink/80">{label}</p>
      <div className="mt-1 flex items-center gap-4">
        <div className="h-20 w-28 overflow-hidden rounded-md border border-forest-dark/15 bg-cream">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs font-medium text-forest-dark hover:bg-cream disabled:opacity-60"
          >
            {busy ? "Inapakia..." : value ? "Badilisha picha" : "Pakia picha"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-600 hover:underline"
            >
              Ondoa picha
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Picha nyingi (mfano: picha za tukio) */
export function MultiImageUpload({
  label,
  values,
  onChange,
  folder,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push(await uploadImage(file, folder));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Imeshindikana kupakia picha.");
      }
    }
    if (added.length > 0) onChange([...values, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink/80">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {values.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-forest-dark/15 bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label="Ondoa picha"
              className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-md border border-dashed border-forest-dark/30 text-xs text-forest-dark hover:bg-cream disabled:opacity-60"
        >
          {busy ? "Inapakia..." : "+ Ongeza picha"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
