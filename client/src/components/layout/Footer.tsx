import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { getTenantName } from "@/lib/tenant-name";

const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

const isValidExternalUrl = (url?: string | null): url is string =>
  Boolean(url && url.trim() !== "" && url.trim() !== "#");

export default function Footer() {
  const { data: settingsResponse } = useSiteSettings();
  const settings = settingsResponse?.data;

  const siteName = getTenantName(settings);
  const siteLogo = getAbsoluteUrl(settings?.site_logo);
  const tagline = settings?.site_tagline || "Membangun Nagari Yang Maju dan Sejahtera";
  const address = settings?.contact_address;
  const phone = settings?.contact_phone;
  const email = settings?.contact_email;

  const socials = [
    { label: "Facebook", icon: Facebook, href: settings?.social_facebook },
    { label: "Instagram", icon: Instagram, href: settings?.social_instagram },
    { label: "YouTube", icon: Youtube, href: settings?.social_youtube },
  ].filter((item): item is { label: string; icon: typeof Facebook; href: string } =>
    isValidExternalUrl(item.href)
  );

  return (
    <footer className="bg-nagari-navy text-white py-16 border-t-4 border-nagari-red">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center border border-white/15 overflow-hidden flex-shrink-0 bg-white/5">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteName} className="w-full h-full object-contain bg-white p-1" />
                ) : (
                  <div className="w-full h-full bg-nagari-red flex items-center justify-center text-white font-serif font-bold text-base">
                    {siteName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-snug text-white">{siteName}</span>
                <span className="text-[13px] font-medium text-nagari-yellow">Portal Resmi Nagari</span>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {tagline}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-2.5 pt-1">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} ${siteName}`}
                    className="w-11 h-11 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-white border border-white/15"
                  >
                    <social.icon aria-hidden="true" size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:pl-6">
            <h3 className="font-semibold text-sm mb-4 text-nagari-yellow">Tautan Cepat</h3>
            <ul className="space-y-3">
              {[
                { label: "Profil & Sejarah", href: "/profil" },
                { label: "Layanan Mandiri", href: "/layanan" },
                { label: "Berita Terkini", href: "/berita" },
                { label: "Produk UMKM", href: "/umkm" },
                { label: "Dokumen Publik (PPID)", href: "/ppid" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors text-sm">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-nagari-yellow">Layanan Publik</h3>
            <ul className="space-y-3">
              {[
                { label: "Layanan Surat Administrasi", href: "/layanan" },
                { label: "Pengaduan Masyarakat", href: "/pengaduan" },
                { label: "Data Publik & Statistik", href: "/data-publik" },
                { label: "Infografis APB Nagari", href: "/infografis" },
                { label: "Peta Digital (WebGIS)", href: "/gis" },
              ].map((service) => (
                <li key={service.href}>
                  <Link href={service.href}>
                    <a className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors text-sm">
                      {service.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-nagari-yellow">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/85 text-sm">
                <MapPin aria-hidden="true" size={18} className="text-nagari-yellow shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address || "Kantor Wali Nagari"}</span>
              </li>
              {phone && (
                <li className="flex items-center gap-3 text-white/85 text-sm">
                  <Phone aria-hidden="true" size={18} className="text-nagari-yellow shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white hover:underline underline-offset-4">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 text-white/85 text-sm">
                  <Mail aria-hidden="true" size={18} className="text-nagari-yellow shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white hover:underline underline-offset-4 break-all">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/70">
          <p>
            &copy; {new Date().getFullYear()} <span className="text-white font-medium">{siteName}</span>. Hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/ppid"><a className="hover:text-white transition-colors">Keterbukaan Informasi</a></Link>
            <Link href="/pengaduan"><a className="hover:text-white transition-colors">Layanan Pengaduan</a></Link>
            <Link href="/kontak"><a className="hover:text-white transition-colors">Kontak Resmi</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
