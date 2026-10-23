import type { Metadata } from 'next';
import { site } from '@/lib/site';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

// Paths are appended to this base, so a query, fragment or user:password would end up inside every
// canonical and sitemap URL: those are rejected. Every trailing slash is stripped.
function parsePublicUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (url.search || url.hash || url.username || url.password || /[?#]/.test(value)) return undefined;
    return url.toString().replace(/\/+$/, '');
  } catch {
    return undefined;
  }
}

const publicUrl = parsePublicUrl(configuredUrl);

export const siteConfig = {
  name: site.name,
  description: site.promise,
  publicUrl,
  metadataUrl: publicUrl ?? 'http://localhost:3010',
  isIndexable: Boolean(publicUrl) && process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
} as const;

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return siteConfig.metadataUrl + normalizedPath;
}

// next.config.ts sets trailingSlash: true, so every page lives at a path ending in "/".
// Page URLs (canonical, sitemap, structured data) use that form so they never point at a redirect.
export function pageUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return absoluteUrl(normalizedPath.endsWith('/') ? normalizedPath : normalizedPath + '/');
}

export function canonicalUrl(path: string) {
  return siteConfig.publicUrl ? pageUrl(path) : undefined;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    openGraph: { type: 'website', title, description, siteName: site.name },
    twitter: { card: 'summary', title, description },
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}
