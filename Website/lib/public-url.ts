export function normalizePublicUrl(value?: string, fallback?: string) {
  const url = value?.trim() || fallback?.trim();
  if (!url) return undefined;

  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

export function normalizeApiBaseUrl(value?: string, fallback?: string) {
  const url = normalizePublicUrl(value, fallback)?.replace(/\/$/, "");
  if (!url) return undefined;

  return /\/api$/i.test(url) ? url : `${url}/api`;
}
