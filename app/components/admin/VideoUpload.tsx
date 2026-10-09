"use client";

import { useRef, useState } from "react";
import { uploadVideo } from "@/lib/storage";
import { toEmbedUrl, videoToItem } from "@/lib/media";

/** Video: pakia faili (hadi 50MB) au bandika kiungo cha YouTube/Vimeo */
export function VideoUpload({
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
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push(await uploadVideo(file, folder, setProgress));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Imeshindikana kupakia video.");
      }
    }
    if (added.length > 0) onChange([...values, ...added]);
    setProgress(null);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function addLink() {
    const url = link.trim();
    if (!url) return;
    if (!toEmbedUrl(url)) {
      setError("Kiungo hakikubaliki. Tumia kiungo cha YouTube au Vimeo.");
      return;
    }
    setError(null);
    onChange([...values, url]);
    setLink("");
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink/80">{label}</p>

      {values.length > 0 && (
        <ul className="mt-2 space-y-2">
          {values.map((url, i) => {
            const item = videoToItem(url);
            return (
              <li
                key={url}
                className="flex items-center justify-between gap-3 rounded-md border border-forest-dark/10 px-3 py-2 text-xs"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="h-10 w-16 shrink-0 overflow-hidden rounded bg-forest-dark">
                    {item.type === "video" && (
                      <video
                        src={`${item.url}#t=0.1`}
                        preload="metadata"
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    )}
                    {item.type === "embed" && item.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumb} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="truncate text-ink/60">
                    {item.type === "embed" ? "Kiungo: " : "Faili: "}
                    {url}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                  className="shrink-0 text-red-600 hover:underline"
                >
                  Ondoa
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-forest-dark/20 px-3 py-1.5 text-xs font-medium text-forest-dark hover:bg-cream disabled:opacity-60"
        >
          {busy ? `Inapakia video${progress !== null ? ` ${progress}%` : ""}... subiri` : "+ Pakia video (MP4, hadi 100MB)"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLink();
            }
          }}
          placeholder="Au bandika kiungo cha YouTube / Vimeo"
          className="min-w-0 flex-1 rounded-md border border-forest-dark/20 bg-white px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addLink}
          className="rounded-md border border-forest-dark/20 px-3 py-2 text-xs font-medium text-forest-dark hover:bg-cream"
        >
          Ongeza kiungo
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
