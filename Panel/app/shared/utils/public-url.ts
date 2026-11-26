export function normalizePublicUrl(value?: string) {
  const url = value?.trim();
  if (!url) return undefined;

  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

export function normalizeApiBaseUrl(value?: string) {
  const url = normalizePublicUrl(value)?.replace(/\/$/, "");
  if (!url) return undefined;

  return /\/api$/i.test(url) ? url : `${url}/api`;
}
