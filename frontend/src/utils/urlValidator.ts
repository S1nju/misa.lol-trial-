/**
 * Validates whether a string is a valid absolute https:// URL with a hostname and valid port.
 */
export function isValidHttpsUrl(urlStr: string): boolean {
  if (!urlStr) return false;
  const trimmed = urlStr.trim();
  if (!trimmed.startsWith('https://')) return false;
  if (/\s/.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0;
  } catch {
    return false;
  }
}
