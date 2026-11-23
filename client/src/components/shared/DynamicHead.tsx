import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { getTenantName } from "@/lib/tenant-name";

// Helper function to get absolute URL for images
const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

// Create the tag on first use, then reuse it. Every call is idempotent, so a
// route change rewrites the same tags instead of appending duplicates.
const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setJsonLd = (id: string, data: unknown) => {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export default function DynamicHead() {
  const { data: siteSettingsData } = useSiteSettings();
  const settings = siteSettingsData?.data;
  const [location] = useLocation();

  useEffect(() => {
    // Origin is read from the browser instead of hardcoded: no invented domain,
    // and canonical / og:url stay correct in every environment.
    const origin = window.location.origin;
    const pageUrl = `${origin}${window.location.pathname}`;

    // Canonical + og:url must follow the route, not only the settings fetch.
    setLink("canonical", pageUrl);
    setMeta("property", "og:url", pageUrl);

    // The static og:image in index.html is a relative path; scrapers need an
    // absolute one. The 1200x630 card is kept as-is — the site logo is square
    // and makes a poor share preview, so it feeds the JSON-LD logo instead.
    const currentOgImage = document.head
      .querySelector<HTMLMetaElement>("meta[property='og:image']")
      ?.getAttribute("content") || "/opengraph.jpg";
    const absoluteOgImage = currentOgImage.startsWith("http")
      ? currentOgImage
      : `${origin}${currentOgImage.startsWith("/") ? "" : "/"}${currentOgImage}`;
    setMeta("property", "og:image", absoluteOgImage);
    setMeta("name", "twitter:image", absoluteOgImage);

    if (!settings) return;

    // Update favicon
    const faviconUrl = getAbsoluteUrl(settings.site_favicon);
    if (faviconUrl) {
      setLink("icon", faviconUrl);
    }

    const title = settings.seo_meta_title || settings.site_name;
    const tenantName = getTenantName(settings);
    const description = settings.seo_meta_description || settings.site_description;
    const logoUrl = getAbsoluteUrl(settings.site_logo);

    // Update title
    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }

    // Update meta description
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    // Update keywords
    if (settings.seo_keywords) {
      setMeta("name", "keywords", settings.seo_keywords);
    }

    setMeta("property", "og:site_name", tenantName);

    // Structured data. Every field is guarded: nothing is emitted that the CMS
    // did not actually supply.
    const sameAs = [settings.social_facebook, settings.social_instagram, settings.social_youtube]
      .filter((url): url is string => Boolean(url));

    const organization: Record<string, unknown> = {
      "@type": "GovernmentOrganization",
      name: tenantName,
      url: origin,
      description: description || undefined,
      logo: logoUrl,
      email: settings.contact_email || undefined,
      telephone: settings.contact_phone || undefined,
      address: settings.contact_address
        ? { "@type": "PostalAddress", streetAddress: settings.contact_address, addressCountry: "ID" }
        : undefined,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    };

    const website: Record<string, unknown> = {
      "@type": "WebSite",
      name: tenantName,
      alternateName: settings.site_tagline || undefined,
      url: origin,
      description: description || undefined,
      inLanguage: "id-ID",
    };

    setJsonLd("ld-json-site", {
      "@context": "https://schema.org",
      "@graph": [organization, website],
    });
  }, [settings, location]);

  return null; // This component doesn't render anything
}
