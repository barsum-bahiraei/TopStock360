import type { ProductListOutput } from "../models/product";
import { normalizePublicUrl } from "~/shared/utils/public-url";

export function resolveProductImageUrl(image: ProductListOutput["image"]): string | null {
  if (!image) return null;

  const path = image.url;
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = normalizePublicUrl(import.meta.env.VITE_MINIO_BASE_URL)?.replace(/\/$/, "");
  return baseUrl ? `${baseUrl}/${path.replace(/^\//, "")}` : null;
}
