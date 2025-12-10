import { useEffect } from "react";
import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";

// Helper function to get absolute URL for images
const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export default function DynamicHead() {
  const { data: siteSettingsData } = useSiteSettings();
  const settings = siteSettingsData?.data;

  useEffect(() => {
    if (!settings) return;

    // Update favicon
    const faviconUrl = getAbsoluteUrl(settings.site_favicon);
    if (faviconUrl) {
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon) {
        existingFavicon.setAttribute("href", faviconUrl);
      } else {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
      }
    }

    // Update title
    if (settings.seo_meta_title || settings.site_name) {
      document.title = settings.seo_meta_title || settings.site_name;
    }

    // Update meta description
    if (settings.seo_meta_description || settings.site_description) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", settings.seo_meta_description || settings.site_description);
    }

    // Update OG image with site logo
    const logoUrl = getAbsoluteUrl(settings.site_logo);
    if (logoUrl) {
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", logoUrl);
    }

    // Update OG title
    if (settings.seo_meta_title || settings.site_name) {
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", settings.seo_meta_title || settings.site_name);
    }

    // Update OG description
    if (settings.seo_meta_description || settings.site_description) {
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", settings.seo_meta_description || settings.site_description);
    }

    // Update keywords
    if (settings.seo_keywords) {
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", settings.seo_keywords);
    }

  }, [settings]);

  return null; // This component doesn't render anything
}
