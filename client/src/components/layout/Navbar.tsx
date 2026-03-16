import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { ThemeToggle } from "./ThemeToggle";

const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: settingsData } = useSiteSettings();
  const settings = settingsData?.data;

  const siteName = settings?.site_name || "Nagari";
  const siteLogo = getAbsoluteUrl(settings?.site_logo);
  const siteInitials = siteName.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase() || "SP";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (menuRef.current) {
        menuRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const navItemClass = scrolled
    ? "text-slate-700 dark:text-white/80 hover:text-teal-600 dark:hover:text-[#3fd5ba]"
    : "text-white hover:text-white/80";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.05] py-3 shadow-lg"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 group relative z-50">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0 border border-black/5 dark:border-white/10">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteName} className="w-full h-full object-contain bg-white dark:bg-white/5" />
                ) : (
                  <div className={cn("w-full h-full flex items-center justify-center text-teal-700 dark:text-[#3fd5ba] font-serif font-bold text-sm bg-teal-50 dark:bg-[#144749]/50")}>
                    {siteInitials}
                  </div>
                )}
              </div>
              <div className={cn("flex flex-col transition-colors duration-300", scrolled ? "text-slate-900 dark:text-white" : "text-white")}>
                <span className="font-serif font-bold text-base leading-snug tracking-wide">{siteName}</span>
                <span className={cn("text-xs uppercase tracking-wider font-medium opacity-75", scrolled ? "text-teal-600 dark:text-[#3fd5ba]/70" : "text-white/70")}>Portal Nagari</span>
              </div>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/"><a className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", location === '/' ? "text-teal-600 dark:text-[#3fd5ba]" : navItemClass)}>Beranda</a></Link>

            <NavDropdown label="Profil" scrolled={scrolled} items={[
              { label: "Profil Nagari", href: "/profil" },
              { label: "Monografi", href: "/monografi" }
            ]} />

            <NavDropdown label="Pemerintahan" scrolled={scrolled} items={[
              { label: "PPID & Dokumen", href: "/ppid" },
              { label: "Data Publik", href: "/data-publik" },
              { label: "Infografis APB", href: "/infografis" },
              { label: "Proyek Pembangunan", href: "/proyek" }
            ]} />

            <NavDropdown label="Layanan" scrolled={scrolled} items={[
              { label: "Layanan Surat", href: "/layanan" },
              { label: "Pengaduan", href: "/pengaduan" }
            ]} />

            <NavDropdown label="Potensi" scrolled={scrolled} items={[
              { label: "UMKM", href: "/umkm" },
              { label: "Fasilitas & Wisata", href: "/fasilitas" },
              { label: "Peta Digital (GIS)", href: "/gis" }
            ]} />

            <Link href="/berita"><a className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", location.startsWith('/berita') ? "text-teal-600 dark:text-[#3fd5ba]" : navItemClass)}>Berita</a></Link>
            <Link href="/kontak"><a className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", location === '/kontak' ? "text-teal-600 dark:text-[#3fd5ba]" : navItemClass)}>Kontak</a></Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/layanan">
              <Button className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white rounded-lg h-10 px-6 text-sm font-semibold transition-all">
                Layanan Online
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-2 relative z-50">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} className="text-teal-600 dark:text-[#3fd5ba]" /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-[#0a1a1c] z-[99] flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 relative z-10 pb-10">
              <MobileLink href="/" onClick={() => setIsOpen(false)}>Beranda</MobileLink>

              <MobileSection title="Profil">
                <MobileLink href="/profil" onClick={() => setIsOpen(false)}>Profil Nagari</MobileLink>
                <MobileLink href="/monografi" onClick={() => setIsOpen(false)}>Monografi</MobileLink>
              </MobileSection>

              <MobileSection title="Pemerintahan">
                <MobileLink href="/ppid" onClick={() => setIsOpen(false)}>PPID & Dokumen</MobileLink>
                <MobileLink href="/data-publik" onClick={() => setIsOpen(false)}>Data Publik</MobileLink>
                <MobileLink href="/infografis" onClick={() => setIsOpen(false)}>Infografis APB</MobileLink>
                <MobileLink href="/proyek" onClick={() => setIsOpen(false)}>Proyek Pembangunan</MobileLink>
              </MobileSection>

              <MobileSection title="Layanan">
                <MobileLink href="/layanan" onClick={() => setIsOpen(false)}>Layanan Surat</MobileLink>
                <MobileLink href="/pengaduan" onClick={() => setIsOpen(false)}>Pengaduan</MobileLink>
                <MobileLink href="/verifikasi" onClick={() => setIsOpen(false)}>Verifikasi Dokumen</MobileLink>
              </MobileSection>

              <MobileSection title="Potensi">
                <MobileLink href="/umkm" onClick={() => setIsOpen(false)}>UMKM</MobileLink>
                <MobileLink href="/fasilitas" onClick={() => setIsOpen(false)}>Fasilitas & Wisata</MobileLink>
                <MobileLink href="/gis" onClick={() => setIsOpen(false)}>Peta Digital (GIS)</MobileLink>
              </MobileSection>

              <MobileLink href="/berita" onClick={() => setIsOpen(false)}>Berita</MobileLink>
              <MobileLink href="/kontak" onClick={() => setIsOpen(false)}>Kontak</MobileLink>

              <Link href="/layanan">
                <Button className="w-full mt-6 bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white rounded-lg h-11 font-semibold" onClick={() => setIsOpen(false)}>
                  Akses Layanan Online
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavDropdown({ label, scrolled, items }: { label: string; scrolled: boolean; items: Array<{ label: string; href: string }> }) {
  return (
    <div className="relative group">
      <button className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1", scrolled ? "text-slate-700 dark:text-white/80 hover:text-teal-600 dark:hover:text-[#3fd5ba]" : "text-white hover:text-white/80")}>
        {label}
        <ChevronRight size={16} className="group-hover:rotate-90 transition-transform" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#0b2023]/95 backdrop-blur-xl rounded-lg shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
        {items.map(item => (
          <Link key={item.href} href={item.href}>
            <a className="block px-4 py-2 text-sm text-slate-600 dark:text-white/70 hover:text-teal-600 dark:hover:text-[#3fd5ba] hover:bg-teal-50/50 dark:hover:bg-white/[0.03] transition-colors">{item.label}</a>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-teal-600/60 dark:text-[#3fd5ba]/40 text-xs font-bold uppercase tracking-widest px-4">{title}</h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href}>
      <a onClick={onClick} className="flex items-center justify-between px-4 py-3 rounded-lg text-lg font-medium text-slate-700 dark:text-white/80 hover:bg-teal-50 dark:hover:bg-white/10 hover:text-teal-700 dark:hover:text-white transition-all">
        {children}
        <ChevronRight size={16} className="opacity-50 text-teal-600 dark:text-[#3fd5ba]" />
      </a>
    </Link>
  );
}
