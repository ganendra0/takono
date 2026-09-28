const legacySections = new Set(['smart-guide', 'events', 'rewards', 'local-discovery', 'album', 'profile', 'explore', 'scan']);

export function travelerDestinationSlug(path: string): string | null {
  const match = path.match(/^\/app\/([^/]+)/);
  if (!match || legacySections.has(match[1])) return null;
  return decodeURIComponent(match[1]);
}

export function scopedTravelerPath(destinationSlug: string, path = '/app'): string {
  if (travelerDestinationSlug(path)) return path;
  const suffix = path === '/app' ? '' : path.replace(/^\/app/, '');
  return `/app/${encodeURIComponent(destinationSlug)}${suffix}`;
}
