import { NEWS_IMAGES_BUCKET } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function checkImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return `« ${file.name} » n'est pas une image JPG, PNG ou WebP.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `« ${file.name} » dépasse 5 Mo.`;
  }
  return null;
}

/**
 * Envoie une image dans le bucket `news-images` (depuis le navigateur, avec
 * la session de l'éditeur) et renvoie son URL publique.
 */
export async function uploadNewsImage(file: File, folder: "covers" | "content" | "whatsapp") {
  const problem = checkImageFile(file);
  if (problem) throw new Error(problem);

  const now = new Date();
  const month = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const path = `${folder}/${month}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(NEWS_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Envoi de « ${file.name} » impossible : ${error.message}`);

  return supabase.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}
