import { uploadToCloudinary } from "@/lib/cloudinary";

// Vikomo vya mpango wa bure wa Cloudinary
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

/** Pakia picha (hadi 10MB) na urudishe URL yake ya umma. */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Chagua faili la picha tu (JPG, PNG, WEBP au GIF).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Picha ni kubwa kuliko 10MB. Ipunguze kisha ujaribu tena.");
  }
  return uploadToCloudinary(file, folder, "image", onProgress);
}

/** Pakia video (MP4, WEBM au MOV, hadi 100MB) na urudishe URL yake ya umma. */
export async function uploadVideo(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!VIDEO_TYPES.includes(file.type)) {
    throw new Error("Chagua video ya aina MP4, WEBM au MOV.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error(
      "Video ni kubwa kuliko 100MB. Ipunguze, au iweke YouTube kisha ubandike kiungo chake."
    );
  }
  return uploadToCloudinary(file, folder, "video", onProgress);
}
