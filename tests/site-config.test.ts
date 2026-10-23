import { afterEach, describe, expect, it, vi } from "vitest";

// lib/site-config.ts reads the environment once at import, so each case stubs env and re-imports it.
async function loadConfig(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value as string);
  return import("@/lib/site-config");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site config", () => {
  it("stays noindex with no canonical URL when NEXT_PUBLIC_SITE_URL is unset", async () => {
    const { siteConfig, canonicalUrl, pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: "", NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(siteConfig.publicUrl).toBeUndefined();
    expect(siteConfig.isIndexable).toBe(false);
    expect(siteConfig.metadataUrl).toBe("http://localhost:3010");
    expect(canonicalUrl("/services")).toBeUndefined();
    const meta = pageMetadata("T", "D", "/services");
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates).toBeUndefined();
  });

  it("rejects URLs that are not http(s) or do not parse", async () => {
    for (const bad of ["ftp://example.com", "javascript:alert(1)", "not a url"]) {
      const { siteConfig } = await loadConfig({ NEXT_PUBLIC_SITE_URL: bad, NEXT_PUBLIC_SITE_INDEXABLE: "true" });
      expect(siteConfig.publicUrl, bad).toBeUndefined();
      expect(siteConfig.isIndexable, bad).toBe(false);
    }
  });

  it("rejects base URLs whose query, fragment or credentials would leak into every canonical link", async () => {
    for (const bad of ["https://example.com/?ref=x", "https://example.com/#top", "https://example.com/?", "https://user:secret@example.com"]) {
      const { siteConfig } = await loadConfig({ NEXT_PUBLIC_SITE_URL: bad, NEXT_PUBLIC_SITE_INDEXABLE: "true" });
      expect(siteConfig.publicUrl, bad).toBeUndefined();
      expect(siteConfig.isIndexable, bad).toBe(false);
    }
  });

  it("strips every trailing slash so paths never start with //", async () => {
    const { siteConfig, canonicalUrl } = await loadConfig({ NEXT_PUBLIC_SITE_URL: "https://example.com/base//", NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(siteConfig.publicUrl).toBe("https://example.com/base");
    expect(canonicalUrl("/services")).toBe("https://example.com/base/services/");
  });

  it("needs both a public URL and NEXT_PUBLIC_SITE_INDEXABLE=true to allow indexing", async () => {
    const withoutFlag = await loadConfig({ NEXT_PUBLIC_SITE_URL: "https://example.com/", NEXT_PUBLIC_SITE_INDEXABLE: "yes" });
    expect(withoutFlag.siteConfig.publicUrl).toBe("https://example.com");
    expect(withoutFlag.siteConfig.isIndexable).toBe(false);

    const indexable = await loadConfig({ NEXT_PUBLIC_SITE_URL: "  https://example.com/  ", NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(indexable.siteConfig.isIndexable).toBe(true);
    expect(indexable.pageMetadata("T", "D", "/").robots).toEqual({ index: true, follow: true });
  });

  it("normalises paths and gives page canonicals the trailing slash the static export serves", async () => {
    const { absoluteUrl, canonicalUrl, pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: "https://example.com", NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(absoluteUrl("sitemap.xml")).toBe("https://example.com/sitemap.xml");
    expect(absoluteUrl("/sitemap.xml")).toBe("https://example.com/sitemap.xml");
    // next.config.ts sets trailingSlash: true, so /services redirects to /services/; a canonical must not redirect.
    expect(canonicalUrl("/services")).toBe("https://example.com/services/");
    expect(canonicalUrl("/services/")).toBe("https://example.com/services/");
    expect(canonicalUrl("/")).toBe("https://example.com/");
    expect(pageMetadata("T", "D", "/services").alternates).toEqual({ canonical: "https://example.com/services/" });
  });
});
