export function isValidUrl(str: string): boolean {
  if (!str || str.trim().length === 0) {
    return false;
  }

  const trimmed = str.trim();

  // URL pattern regex - matches http(s):// URLs or domain names
  const urlPattern =
    /^(?:(?:https?:\/\/)?(?:www\.)?)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/;

  // Check if it matches the URL pattern
  if (!urlPattern.test(trimmed)) {
    return false;
  }

  // Additional validation using URL constructor
  try {
    new URL(trimmed);
    return true;
  } catch {
    // Try with https:// prefix for domain names
    try {
      new URL(`https://${trimmed}`);
      return true;
    } catch {
      return false;
    }
  }
}

export function normalizeUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    return `https://${url}`;
  }
}
