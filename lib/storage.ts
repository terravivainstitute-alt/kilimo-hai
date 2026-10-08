import { supabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;

/** Pakia picha kwenye Supabase Storage na urudishe URL yake ya umma. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Chagua faili la picha tu (JPG, PNG, WEBP au GIF).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Picha ni kubwa kuliko 5MB. Ipunguze kisha ujaribu tena.");
  }

  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });

  if (error) throw new Error(error.message);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

/** Pakia video (MP4, WEBM au MOV, hadi 50MB) na urudishe URL yake ya umma. */
export async function uploadVideo(file: File, folder: string): Promise<string> {
  if (!VIDEO_TYPES.includes(file.type)) {
    throw new Error("Chagua video ya aina MP4, WEBM au MOV.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      "Video ni kubwa kuliko 50MB. Ipunguze, au iweke YouTube kisha ubandike kiungo chake."
    );
  }

  const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });

  if (error) throw new Error(error.message);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
