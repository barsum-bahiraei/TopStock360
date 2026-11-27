import type { BrandImage } from "../models/brand";
import { normalizePublicUrl } from "~/shared/utils/public-url";

export function resolveBrandImageUrl(image: BrandImage | null): string | null {
  if (!image) return null;
  const baseUrl = normalizePublicUrl(import.meta.env.VITE_MINIO_BASE_URL)?.replace(/\/$/, "");
  if (/^https?:\/\//i.test(image.url)) {
    const parsedUrl = new URL(image.url);
    return parsedUrl.hostname === "minio" && baseUrl ? `${baseUrl}${parsedUrl.pathname}` : image.url;
  }
  return baseUrl ? `${baseUrl}/${image.url.replace(/^\//, "")}` : null;
}
