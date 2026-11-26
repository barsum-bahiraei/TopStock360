export function normalizePublicUrl(value?: string, fallback?: string) {
  const url = value?.trim() || fallback?.trim();
  if (!url) return undefined;

  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}
