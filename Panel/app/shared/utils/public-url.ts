export function normalizePublicUrl(value?: string) {
  const url = value?.trim();
  if (!url) return undefined;

  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}
