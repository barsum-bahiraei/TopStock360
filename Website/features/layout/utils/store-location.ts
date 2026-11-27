export const storeLatitude = 35.842144;
export const storeLongitude = 50.972031;
export const neshanWebUrl = `https://neshan.org/maps/share/${storeLatitude},${storeLongitude}`;

export function getNeshanLocationUrl(userAgent: string): string {
  if (/Android/i.test(userAgent)) {
    return `intent://nshn.ir/?lat=${storeLatitude}&lng=${storeLongitude}#Intent;scheme=https;package=org.rajman.neshan.traffic.tehran.navigator;S.browser_fallback_url=${encodeURIComponent(neshanWebUrl)};end`;
  }
  return neshanWebUrl;
}
