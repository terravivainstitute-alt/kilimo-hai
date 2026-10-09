// Cloud name na upload preset ni vitambulisho vya umma (si siri).
// API Secret haitumiki hapa na isiwekwe kwenye msimbo wa tovuti.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "la3lqkey";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "kilimo-hai-unsigned";

export type ResourceType = "image" | "video";

interface CloudinaryResponse {
  secure_url?: string;
  error?: { message?: string };
}

function send(
  url: string,
  body: FormData,
  onProgress?: (percent: number) => void
): Promise<{ status: number; data: CloudinaryResponse }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      let data: CloudinaryResponse = {};
      try {
        data = JSON.parse(xhr.responseText) as CloudinaryResponse;
      } catch {
        // jibu lisilo JSON
      }
      resolve({ status: xhr.status, data });
    };
    xhr.onerror = () =>
      reject(new Error("Mtandao umekatika wakati wa kupakia. Jaribu tena."));
    xhr.send(body);
  });
}

function friendlyError(message?: string): string {
  const msg = message ?? "";
  if (/preset/i.test(msg)) {
    return `Preset "${UPLOAD_PRESET}" haikubaliki. Kwenye Cloudinary: Settings → Upload → Upload presets, hakikisha ipo na "Signing mode" ni Unsigned.`;
  }
  if (/cloud_name|cloud name/i.test(msg)) {
    return `Cloud name "${CLOUD_NAME}" si sahihi. Ipate kwenye Cloudinary Dashboard (juu kushoto).`;
  }
  if (/file size|too large|exceeds/i.test(msg)) {
    return "Faili ni kubwa kuliko inavyoruhusiwa na Cloudinary. Lipunguze kisha ujaribu tena.";
  }
  if (/format|not allowed|invalid image|unsupported/i.test(msg)) {
    return "Aina ya faili hii hairuhusiwi. Tumia JPG, PNG, WEBP (picha) au MP4 (video).";
  }
  return msg ? `Cloudinary: ${msg}` : "Imeshindikana kupakia faili. Jaribu tena.";
}

/** Pakia faili kwenye Cloudinary (unsigned) na urudishe URL yake ya umma (https). */
export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: ResourceType,
  onProgress?: (percent: number) => void
): Promise<string> {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const build = (withFolder: boolean) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("tags", `kilimo-hai,${folder}`);
    if (withFolder) fd.append("folder", `kilimo-hai/${folder}`);
    return fd;
  };

  let res = await send(endpoint, build(true), onProgress);

  // Akaunti zenye "dynamic folders" zinaweza kukataa parameter ya folder: jaribu bila hiyo
  if (res.status >= 400 && /folder/i.test(res.data.error?.message ?? "")) {
    res = await send(endpoint, build(false), onProgress);
  }

  if (res.status >= 200 && res.status < 300 && res.data.secure_url) {
    return res.data.secure_url;
  }
  throw new Error(friendlyError(res.data.error?.message));
}
