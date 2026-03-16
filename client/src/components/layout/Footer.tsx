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
    <footer className="bg-white dark:bg-[#061011] text-slate-800 dark:text-white py-16 md:py-20 border-t border-black/5 dark:border-white/[0.04] overflow-hidden relative transition-colors duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-400/30 dark:via-[#3fd5ba]/30 to-transparent opacity-80" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-400/10 dark:bg-[#3fd5ba]/[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-sky-200/20 dark:bg-[#144749]/[0.08] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] animate-in fade-in dark:hidden pointer-events-none transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at center, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 opacity-[0.02] hidden dark:block pointer-events-none transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(63,213,186,0.1)] border border-[#3fd5ba]/20 overflow-hidden flex-shrink-0 group-hover:shadow-[0_0_25px_rgba(63,213,186,0.2)] transition-shadow">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteName} className="w-full h-full object-contain bg-white/5 p-1" />
                ) : (
                  <div className="w-full h-full bg-[#144749]/50 flex items-center justify-center text-[#3fd5ba] font-serif font-bold text-lg">
                    {siteName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-snug tracking-wide group-hover:text-[#3fd5ba] transition-colors">{siteName}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-[#3fd5ba]/70">Portal Nagari</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-white/50 text-sm leading-relaxed font-light">
              "{tagline}"
              <br/><br/>
              Mewujudkan pemerintahan yang transparan, akuntabel, dan melayani dengan sepenuh hati melalui teknologi.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: facebook, color: "hover:bg-[#1877F2] hover:border-[#1877F2]" },
                { icon: Instagram, href: instagram, color: "hover:bg-[#E4405F] hover:border-[#E4405F]" },
                { icon: Youtube, href: youtube, color: "hover:bg-[#FF0000] hover:border-[#FF0000]" }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center transition-all duration-300 text-slate-600 dark:text-white border border-black/10 dark:border-white/10 ${social.color}`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="font-bold text-[11px] mb-6 text-teal-700 dark:text-[#3fd5ba] uppercase tracking-[0.2em]">Tautan Cepat</h3>
            <ul className="space-y-4">
              {[
                { label: "Profil & Sejarah", href: "/profil" },
                { label: "Layanan Mandiri", href: "/layanan" },
                { label: "Berita Terkini", href: "/berita" },
                { label: "Produk UMKM", href: "/umkm" },
                { label: "Dokumen Publik", href: "/ppid" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-slate-600 dark:text-white/60 hover:text-teal-600 dark:hover:text-[#3fd5ba] transition-colors text-sm flex items-center gap-3 group cursor-pointer font-medium">
                      <span className="w-1.5 h-px bg-teal-500/50 dark:bg-[#3fd5ba]/50 group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-[11px] mb-6 text-teal-700 dark:text-[#3fd5ba] uppercase tracking-[0.2em]">Layanan Publik</h3>
            <ul className="space-y-4">
              {[
                "Surat Keterangan Domisili",
                "Surat Pengantar Nikah",
                "Surat Keterangan Usaha",
                "Pengaduan Masyarakat",
                "Layanan Kependudukan",
              ].map((service) => (
                <li key={service} className="text-slate-600 dark:text-white/50 text-sm flex items-center gap-3 font-light">
                  <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[11px] mb-6 text-teal-700 dark:text-[#3fd5ba] uppercase tracking-[0.2em]">Hubungi Kami</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-slate-600 dark:text-white/70 text-sm group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center shrink-0 border border-black/10 dark:border-white/10 group-hover:border-teal-300 dark:group-hover:border-[#3fd5ba]/30 group-hover:bg-teal-50 dark:group-hover:bg-[#144749]/50 group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-all">
                  <MapPin size={18} />
                </div>
                <span className="pt-2 font-light leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-4 text-slate-600 dark:text-white/70 text-sm group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center shrink-0 border border-black/10 dark:border-white/10 group-hover:border-teal-300 dark:group-hover:border-[#3fd5ba]/30 group-hover:bg-teal-50 dark:group-hover:bg-[#144749]/50 group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-all">
                  <Phone size={18} />
                </div>
                <span className="font-light">{phone}</span>
              </li>
              <li className="flex items-center gap-4 text-slate-600 dark:text-white/70 text-sm group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center shrink-0 border border-black/10 dark:border-white/10 group-hover:border-teal-300 dark:group-hover:border-[#3fd5ba]/30 group-hover:bg-teal-50 dark:group-hover:bg-[#144749]/50 group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-all">
                  <Mail size={18} />
                </div>
                <span className="font-light">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/10 dark:border-white/[0.04] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-widest font-bold">
          <p className="flex items-center gap-2">
            &copy; {new Date().getFullYear()} <span className="text-teal-600 dark:text-[#3fd5ba]">{siteName}</span>. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-teal-600 dark:hover:text-[#3fd5ba] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-[#3fd5ba] transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-teal-600 dark:hover:text-[#3fd5ba] transition-colors">Peta Situs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
