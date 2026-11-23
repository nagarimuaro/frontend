import type { Plugin } from "vite";

/**
 * Emits sitemap.xml at build time.
 *
 * A sitemap needs absolute URLs, and this repo does not know its own production
 * host — so the file is only written when SITE_URL (or VITE_SITE_URL) is set.
 * Without it the build logs one warning and skips the file, which is preferable
 * to shipping a sitemap full of wrong URLs.
 *
 *   SITE_URL=https://nagari.example.id npm run build
 *
 * Static routes only, mirroring client/src/App.tsx. Excluded on purpose:
 *   /berita/:slug            — one per article, needs the CMS to enumerate
 *   /verifikasi-surat/:token — token-scoped, not public content
 */

const ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/profil", changefreq: "monthly", priority: "0.8" },
  { path: "/monografi", changefreq: "monthly", priority: "0.7" },
  { path: "/layanan", changefreq: "weekly", priority: "0.9" },
  { path: "/berita", changefreq: "daily", priority: "0.9" },
  { path: "/umkm", changefreq: "weekly", priority: "0.7" },
  { path: "/fasilitas", changefreq: "monthly", priority: "0.7" },
  { path: "/ppid", changefreq: "monthly", priority: "0.7" },
  { path: "/pengaduan", changefreq: "monthly", priority: "0.6" },
  { path: "/gis", changefreq: "monthly", priority: "0.6" },
  { path: "/proyek", changefreq: "weekly", priority: "0.7" },
  { path: "/data-publik", changefreq: "weekly", priority: "0.7" },
  { path: "/infografis", changefreq: "weekly", priority: "0.7" },
  { path: "/kontak", changefreq: "monthly", priority: "0.6" },
];

export function sitemapPlugin(): Plugin {
  return {
    name: "nagari-sitemap",
    apply: "build",
    generateBundle() {
      const rawOrigin = process.env.SITE_URL || process.env.VITE_SITE_URL;

      if (!rawOrigin) {
        this.warn(
          "SITE_URL not set — skipping sitemap.xml. Re-run with SITE_URL=https://<domain> to generate it.",
        );
        return;
      }

      const origin = rawOrigin.replace(/\/+$/, "");
      const lastmod = new Date().toISOString().slice(0, 10);

      const urls = ROUTES.map(
        (route) => `  <url>
    <loc>${origin}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
      ).join("\n");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      });
    },
  };
}
