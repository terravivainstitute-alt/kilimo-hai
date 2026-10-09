import { supabase } from "@/lib/supabase";

/**
 * Futa picha/video za Cloudinary kupitia edge function "cloudinary-delete".
 * Ni jaribio la nyongeza: ikishindwa, rekodi tayari imeshafutwa na hakuna kinachovunjika.
 * Viungo visivyo vya Cloudinary (mf. YouTube) vinapuuzwa.
 */
export async function deleteCloudinaryAssets(
  urls: (string | null | undefined)[]
): Promise<void> {
  const list = urls.filter(
    (u): u is string => typeof u === "string" && u.includes("res.cloudinary.com/")
  );
  if (list.length === 0) return;
  try {
    await supabase.functions.invoke("cloudinary-delete", { body: { urls: list } });
  } catch {
    // acha tu
  }
}
