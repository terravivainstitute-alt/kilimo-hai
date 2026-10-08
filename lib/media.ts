export type MediaType = "image" | "video" | "embed";

export interface MediaItem {
  type: MediaType;
  /** image/video: URL ya faili. embed: URL ya kuonyesha (iframe) */
  url: string;
  /** picha ndogo ya kuonyesha kwa video za YouTube */
  thumb?: string;
}

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/;

/** Kiungo cha YouTube/Vimeo -> kiungo cha kuweka kwenye iframe. Si kiungo cha video = null */
export function toEmbedUrl(url: string): string | null {
  const yt = url.match(YOUTUBE);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(VIMEO);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export function videoToItem(url: string): MediaItem {
  const embed = toEmbedUrl(url);
  if (embed) {
    const yt = url.match(YOUTUBE);
    return {
      type: "embed",
      url: embed,
      thumb: yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : undefined,
    };
  }
  return { type: "video", url };
}

/** Picha zote kwanza, kisha video */
export function buildMedia(images: string[] = [], videos: string[] = []): MediaItem[] {
  return [
    ...images.filter(Boolean).map((url): MediaItem => ({ type: "image", url })),
    ...videos.filter(Boolean).map(videoToItem),
  ];
}

export function withAutoplay(embedUrl: string): string {
  return `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`;
}
