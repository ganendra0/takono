export function travelerDestinationSlug(path: string): string | null {
  const match = path.match(/^\/app\/destination\/([^/]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

export function scopedTravelerPath(destinationSlug: string, path = '/app'): string {
  if (travelerDestinationSlug(path)) return path;
  const suffix = path === '/app' ? '' : path.replace(/^\/app/, '');
  return `/app/destination/${encodeURIComponent(destinationSlug)}${suffix}`;
}
