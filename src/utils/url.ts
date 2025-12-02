// Dangerous URL schemes that should be blocked
const DANGEROUS_SCHEMES = [
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
  'about:',
  'blob:',
  'filesystem:',
];

// Only allow HTTP and HTTPS protocols
const SAFE_SCHEMES = ['http:', 'https:'];

export function isValidUrl(str: string): boolean {
  if (!str || str.trim().length === 0) {
    return false;
  }

  const trimmed = str.trim();
  const lowerCased = trimmed.toLowerCase();

  // Explicitly block dangerous schemes
  if (DANGEROUS_SCHEMES.some((scheme) => lowerCased.startsWith(scheme))) {
    return false;
  }

  // URL pattern regex - matches http(s):// URLs or domain names
  const urlPattern =
    /^(?:(?:https?:\/\/)?(?:www\.)?)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[^\s]*)?$/;

  // Check if it matches the URL pattern
  if (!urlPattern.test(trimmed)) {
    return false;
  }

  // Additional validation using URL constructor
  try {
    const parsed = new URL(trimmed);
    // Verify the protocol is safe
    return SAFE_SCHEMES.includes(parsed.protocol);
  } catch {
    // Try with https:// prefix for domain names
    try {
      const parsed = new URL(`https://${trimmed}`);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    // Only allow safe schemes
    if (SAFE_SCHEMES.includes(parsed.protocol)) {
      return trimmed;
    }
    // If scheme is unsafe, force https
    return `https://${trimmed}`;
  } catch {
    // If URL parsing fails, add https:// prefix
    return `https://${trimmed}`;
  }
}
