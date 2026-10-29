import { timingSafeEqual } from 'node:crypto';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

export function requiresClientToken(host) {
  return !LOOPBACK_HOSTS.has(host);
}

export function matchesClientToken(header, expectedToken) {
  if (typeof header !== 'string' || !header.startsWith('Bearer ') || !expectedToken) return false;
  const supplied = Buffer.from(header.slice(7));
  const expected = Buffer.from(expectedToken);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
