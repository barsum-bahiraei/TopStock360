import type { SellerImage } from "../models/seller";
import { normalizePublicUrl } from "~/shared/utils/public-url";

export function resolveSellerImageUrl(image: SellerImage | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image.url)) return image.url;

  const baseUrl = normalizePublicUrl(import.meta.env.VITE_MINIO_BASE_URL)?.replace(/\/$/, "");
  return baseUrl ? `${baseUrl}/${image.url.replace(/^\//, "")}` : null;
}
