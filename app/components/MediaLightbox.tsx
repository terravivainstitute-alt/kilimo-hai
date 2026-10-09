"use client";

import { useEffect } from "react";
import { optimizeImage, withAutoplay, type MediaItem } from "@/lib/media";

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

/** Kijipicha cha picha au video (kwa gridi) */
export function MediaTile({
  item,
  alt,
  className = "",
}: {
  item: MediaItem;
  alt: string;
  className?: string;
}) {
  return (
    <span className={`relative block overflow-hidden bg-cream ${className}`}>
      {item.type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={optimizeImage(item.url, 700)} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      )}
      {item.type === "video" && (
        <video
          src={`${item.url}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          className="pointer-events-none h-full w-full object-cover"
        />
      )}
      {item.type === "embed" &&
        (item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumb} alt={alt} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="block h-full w-full bg-forest-dark" />
        ))}
      {item.type !== "image" && <PlayBadge />}
    </span>
  );
}

/** Video ya kucheza moja kwa moja ndani ya ukurasa (bila kufungua dirisha) */
export function InlinePlayer({ item }: { item: MediaItem }) {
  if (item.type === "embed") {
    return (
      <iframe
        src={item.url}
        title="Video"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-xl bg-black"
      />
    );
  }
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        controls
        playsInline
        preload="metadata"
        className="max-h-[75vh] w-full rounded-xl bg-black"
      />
    );
  }
  return null;
}

/** Dirisha la kutazama picha/video palepale, lenye mshale wa kwenda mbele/nyuma */
export default function MediaLightbox({
  items,
  index,
  onClose,
  onChange,
}: {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;

    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && items.length > 1) onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft" && items.length > 1)
        onChange((index - 1 + items.length) % items.length);
    }

    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, items.length, onClose, onChange]);

  if (index === null || !items[index]) return null;
  const item = items[index];
  const many = items.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-5xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.url}
            src={optimizeImage(item.url, 1600)}
            alt=""
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
        )}
        {item.type === "video" && (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-full rounded-lg bg-black"
          />
        )}
        {item.type === "embed" && (
          <iframe
            key={item.url}
            src={withAutoplay(item.url)}
            title="Video"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="aspect-video w-full rounded-lg bg-black"
          />
        )}
      </div>

      <button
        aria-label="Funga"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/20 px-3.5 py-1.5 text-white hover:bg-white/30"
      >
        ✕
      </button>

      {many && (
        <>
          <button
            aria-label="Iliyotangulia"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + items.length) % items.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-4 py-2 text-xl text-white hover:bg-white/30"
          >
            ‹
          </button>
          <button
            aria-label="Inayofuata"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % items.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-4 py-2 text-xl text-white hover:bg-white/30"
          >
            ›
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {index + 1} / {items.length}
          </span>
        </>
      )}
    </div>
  );
}
