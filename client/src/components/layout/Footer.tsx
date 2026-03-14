
import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Helper function to get absolute URL for images
const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export default function Footer() {
  const { data: settingsResponse } = useSiteSettings();
  const settings = settingsResponse?.data;

  // Fallback values
  const siteName = settings?.site_name || "Portal Nagari";
  const siteLogo = getAbsoluteUrl(settings?.site_logo);
  const tagline = settings?.site_tagline || "Membangun Nagari Yang Maju dan Sejahtera";
  const address = settings?.contact_address || "-";
  const phone = settings?.contact_phone || "-";
  const email = settings?.contact_email || "-";
  const facebook = settings?.social_facebook || "#";
  const instagram = settings?.social_instagram || "#";
  const youtube = settings?.social_youtube || "#";

  return (
    <footer className="bg-gradient-to-br from-foreground/95 to-foreground text-white py-16 md:py-20 border-t border-border overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-25" />

      <div className="container mx-auto container-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center shadow-md border border-white/15 overflow-hidden flex-shrink-0">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteName} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-serif font-bold text-lg">
                    {siteName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-snug tracking-wide">{siteName}</span>
                <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Portal Nagari</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {tagline}. Mewujudkan pemerintahan yang transparan, akuntabel, dan melayani dengan sepenuh hati.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: facebook },
                { icon: Instagram, href: instagram },
                { icon: Youtube, href: youtube }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center hover:bg-primary transition-colors text-white border border-white/15 hover:border-primary"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-base mb-5 text-primary uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Profil Nagari", href: "/profil" },
                { label: "Layanan Surat", href: "/layanan" },
                { label: "Berita Terkini", href: "/berita" },
                { label: "Potensi UMKM", href: "/umkm" },
                { label: "Dokumen Publik", href: "/ppid" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group cursor-pointer">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-all" />
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-bold text-base mb-5 text-primary uppercase tracking-wider">Layanan Publik</h3>
            <ul className="space-y-2.5">
              {[
                "Surat Keterangan Domisili",
                "Surat Pengantar Nikah",
                "Surat Keterangan Usaha",
                "Pengaduan Masyarakat",
                "Layanan Kependudukan",
              ].map((service) => (
                <li key={service} className="text-white/70 text-sm hover:text-white transition-colors cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-base mb-5 text-primary uppercase tracking-wider">Hubungi Kami</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="pt-0.5">{address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Pemerintah {siteName}. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Peta Situs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
