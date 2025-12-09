
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const transparentStyle = "bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/20 data-[state=open]:bg-white/10";
  const scrolledStyle = "bg-transparent text-foreground hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary data-[active]:bg-primary/5 data-[active]:text-primary data-[state=open]:bg-primary/5 data-[state=open]:text-primary";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-white/20 py-3" 
          : "bg-gradient-to-b from-black/60 to-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-3 group relative z-50">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-green-700 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg border border-white/20"
            >
              SP
            </motion.div>
            <div className={cn("flex flex-col transition-colors duration-300", (scrolled && !isOpen) ? "text-foreground" : "text-white")}>
              <span className="font-serif font-bold text-lg leading-tight tracking-wide">Sungai Pinang</span>
              <span className={cn("text-[10px] uppercase tracking-[0.2em] font-medium opacity-80", (scrolled && !isOpen) ? "text-primary" : "text-white/80")}>Portal Nagari</span>
            </div>
          </a>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), scrolled ? scrolledStyle : transparentStyle)}>
                    Beranda
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/profil">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), scrolled ? scrolledStyle : transparentStyle)}>
                    Profil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(scrolled ? scrolledStyle : transparentStyle)}>Pemerintahan</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl">
                    <ListItem href="/ppid" title="PPID & Dokumen" icon="📂">
                      Pusat informasi dan dokumentasi publik nagari.
                    </ListItem>
                    <ListItem href="/data-publik" title="Data Publik" icon="📊">
                      Statistik kependudukan dan data pembangunan.
                    </ListItem>
                    <ListItem href="/proyek" title="Proyek Pembangunan" icon="🏗️">
                      Transparansi progres pembangunan infrastruktur.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(scrolled ? scrolledStyle : transparentStyle)}>Layanan</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl">
                    <ListItem href="/layanan" title="Layanan Surat" icon="📝">
                      Pengurusan surat keterangan domisili, usaha, dll.
                    </ListItem>
                    <ListItem href="/pengaduan" title="Pengaduan" icon="📢">
                      Sampaikan aspirasi dan pengaduan masyarakat.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(scrolled ? scrolledStyle : transparentStyle)}>Potensi</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl">
                    <ListItem href="/umkm" title="UMKM" icon="🛍️">
                      Produk unggulan dan ekonomi kreatif masyarakat.
                    </ListItem>
                    <ListItem href="/fasilitas" title="Fasilitas & Wisata" icon="🕌">
                      Destinasi wisata dan sarana prasarana publik.
                    </ListItem>
                    <ListItem href="/gis" title="Peta Nagari (GIS)" icon="🗺️">
                      Peta digital wilayah dan persebaran potensi.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/berita">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), scrolled ? scrolledStyle : transparentStyle)}>
                    Berita
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/kontak">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), scrolled ? scrolledStyle : transparentStyle)}>
                    Kontak
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden lg:block">
          <Link href="/layanan">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className={cn(
                  "rounded-full font-medium shadow-lg hover:shadow-xl transition-all border px-6",
                  scrolled 
                    ? "bg-gradient-to-r from-primary to-green-600 text-white border-transparent" 
                    : "bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white hover:text-primary"
                )}
              >
                Layanan Online
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-full transition-colors relative z-50",
            (scrolled && !isOpen) ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-primary z-40 flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col gap-6 relative z-10 pb-10">
              <MobileLink href="/" onClick={() => setIsOpen(false)}>Beranda</MobileLink>
              
              <MobileSection title="Profil">
                <MobileLink href="/profil" onClick={() => setIsOpen(false)}>Profil Nagari</MobileLink>
              </MobileSection>

              <MobileSection title="Pemerintahan">
                <MobileLink href="/ppid" onClick={() => setIsOpen(false)}>PPID & Dokumen</MobileLink>
                <MobileLink href="/data-publik" onClick={() => setIsOpen(false)}>Data Publik</MobileLink>
                <MobileLink href="/proyek" onClick={() => setIsOpen(false)}>Proyek Pembangunan</MobileLink>
              </MobileSection>

              <MobileSection title="Layanan">
                <MobileLink href="/layanan" onClick={() => setIsOpen(false)}>Layanan Surat</MobileLink>
                <MobileLink href="/pengaduan" onClick={() => setIsOpen(false)}>Pengaduan Masyarakat</MobileLink>
              </MobileSection>

              <MobileSection title="Potensi">
                <MobileLink href="/umkm" onClick={() => setIsOpen(false)}>UMKM</MobileLink>
                <MobileLink href="/fasilitas" onClick={() => setIsOpen(false)}>Fasilitas & Wisata</MobileLink>
                <MobileLink href="/gis" onClick={() => setIsOpen(false)}>Peta Digital (GIS)</MobileLink>
              </MobileSection>

              <MobileLink href="/berita" onClick={() => setIsOpen(false)}>Berita</MobileLink>
              <MobileLink href="/kontak" onClick={() => setIsOpen(false)}>Kontak</MobileLink>
              
              <Link href="/layanan">
                <Button 
                  className="w-full mt-6 bg-white text-primary hover:bg-gray-100 rounded-full h-14 text-lg font-bold shadow-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Akses Layanan Online
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function ListItem({ className, title, children, href, icon, ...props }: any) {
  return (
    <li>
      <Link href={href}>
        <a
          className={cn(
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-accent-foreground focus:bg-green-50 focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="text-sm font-bold leading-none group-hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-lg">{icon}</span> {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground pl-7 mt-1 font-medium opacity-80">
            {children}
          </p>
        </a>
      </Link>
    </li>
  );
}

function MobileSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] px-4">{title}</h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode, onClick: () => void }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <a 
        onClick={onClick}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-xl text-lg font-medium transition-all",
          isActive 
            ? "bg-white/20 text-white shadow-inner" 
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        {children}
        <ChevronRight size={16} className="opacity-50" />
      </a>
    </Link>
  );
}
