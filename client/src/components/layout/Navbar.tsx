import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { ThemeToggle } from "./ThemeToggle";
import { getTenantName } from "@/lib/tenant-name";

const getAbsoluteUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { data: settingsData } = useSiteSettings();
  const settings = settingsData?.data;

  const siteName = getTenantName(settings);
  const kabupaten = settings?.kabupaten?.trim().replace(/^(?:kabupaten|kab\.?)\s*/i, "");
  const locationLabel = kabupaten ? `Kab. ${kabupaten}` : "Portal Nagari";
  const siteLogo = getAbsoluteUrl(settings?.site_logo);
  const siteInitials = siteName.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase() || "NP";

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => (path === "/" ? location === "/" : location.startsWith(path));

  const linkClass = (active: boolean) =>
    cn(
      "px-3.5 py-2 rounded-lg text-[15px] font-medium transition-colors whitespace-nowrap",
      active
        ? "text-nagari-red-ink font-semibold underline decoration-2 underline-offset-8"
        : "text-foreground/80 hover:text-foreground hover:bg-muted"
    );

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-[72px] z-[100] bg-background border-b border-border">
        <nav
          aria-label="Navigasi utama"
          className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4"
        >
          <Link href="/">
            <a className="flex items-center gap-3 group relative z-50 min-w-0">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-border bg-card">
                {siteLogo ? (
                  <img src={siteLogo} alt={siteName} className="w-full h-full object-contain bg-white" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-nagari-navy text-white font-serif font-semibold text-sm">
                    {siteInitials}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 text-foreground">
                <span className="font-serif font-bold text-base leading-tight truncate">{siteName}</span>
                <span className="text-[13px] font-medium text-muted-foreground truncate">{locationLabel}</span>
              </div>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/"><a aria-current={isActive("/") ? "page" : undefined} className={linkClass(isActive("/"))}>Beranda</a></Link>

            <NavDropdown label="Profil" items={[
              { label: "Profil Nagari", href: "/profil" },
              { label: "Monografi", href: "/monografi" }
            ]} />

            <NavDropdown label="Pemerintahan" items={[
              { label: "PPID & Dokumen", href: "/ppid" },
              { label: "Data Publik", href: "/data-publik" },
              { label: "Infografis APB", href: "/infografis" },
              { label: "Indeks Desa (IDM)", href: "/indeks-desa" },
              { label: "Proyek Pembangunan", href: "/proyek" }
            ]} />

            <NavDropdown label="Layanan" items={[
              { label: "Layanan Surat", href: "/layanan" },
              { label: "Verifikasi Surat (TTE)", href: "/verifikasi" },
              { label: "Pengaduan", href: "/pengaduan" }
            ]} />

            <NavDropdown label="Potensi" items={[
              { label: "UMKM", href: "/umkm" },
              { label: "Fasilitas & Wisata", href: "/fasilitas" },
              { label: "Peta Digital (GIS)", href: "/gis" }
            ]} />

            <Link href="/berita"><a aria-current={isActive("/berita") ? "page" : undefined} className={linkClass(isActive("/berita"))}>Berita</a></Link>
            <Link href="/kontak"><a aria-current={isActive("/kontak") ? "page" : undefined} className={linkClass(isActive("/kontak"))}>Kontak</a></Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <ThemeToggle />
            <Link href="/layanan">
              <Button className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-5 text-sm font-medium transition-colors whitespace-nowrap">
                Layanan Online
              </Button>
            </Link>
          </div>

          {/* Tablet / Mobile Controls */}
          <div className="lg:hidden flex items-center gap-2 relative z-50 flex-shrink-0">
            <Link href="/layanan" className="hidden sm:inline-flex">
              <Button className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-4 text-sm font-medium transition-colors whitespace-nowrap">
                Layanan Online
              </Button>
            </Link>
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="w-11 h-11 rounded-lg border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-0 top-[72px] bg-background z-[99] flex flex-col px-6 py-6 overflow-y-auto border-t border-border"
        >
          <div className="flex flex-col gap-5 pb-10">
            <MobileLink href="/" onClick={() => setIsOpen(false)}>Beranda</MobileLink>

            <MobileSection title="Profil">
              <MobileLink href="/profil" onClick={() => setIsOpen(false)}>Profil Nagari</MobileLink>
              <MobileLink href="/monografi" onClick={() => setIsOpen(false)}>Monografi</MobileLink>
            </MobileSection>

            <MobileSection title="Pemerintahan">
              <MobileLink href="/ppid" onClick={() => setIsOpen(false)}>PPID & Dokumen</MobileLink>
              <MobileLink href="/data-publik" onClick={() => setIsOpen(false)}>Data Publik</MobileLink>
              <MobileLink href="/infografis" onClick={() => setIsOpen(false)}>Infografis APB</MobileLink>
              <MobileLink href="/indeks-desa" onClick={() => setIsOpen(false)}>Indeks Desa (IDM)</MobileLink>
              <MobileLink href="/proyek" onClick={() => setIsOpen(false)}>Proyek Pembangunan</MobileLink>
            </MobileSection>

            <MobileSection title="Layanan">
              <MobileLink href="/layanan" onClick={() => setIsOpen(false)}>Layanan Surat</MobileLink>
              <MobileLink href="/verifikasi" onClick={() => setIsOpen(false)}>Verifikasi Surat (TTE)</MobileLink>
              <MobileLink href="/pengaduan" onClick={() => setIsOpen(false)}>Pengaduan</MobileLink>
            </MobileSection>

            <MobileSection title="Potensi">
              <MobileLink href="/umkm" onClick={() => setIsOpen(false)}>UMKM</MobileLink>
              <MobileLink href="/fasilitas" onClick={() => setIsOpen(false)}>Fasilitas & Wisata</MobileLink>
              <MobileLink href="/gis" onClick={() => setIsOpen(false)}>Peta Digital (GIS)</MobileLink>
            </MobileSection>

            <MobileLink href="/berita" onClick={() => setIsOpen(false)}>Berita</MobileLink>
            <MobileLink href="/kontak" onClick={() => setIsOpen(false)}>Kontak</MobileLink>

            <Link href="/layanan">
              <Button className="w-full mt-2 bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-12 text-base font-medium" onClick={() => setIsOpen(false)}>
                Layanan Online
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function NavDropdown({ label, items }: { label: string; items: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `nav-menu-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hasActiveChild = items.some((item) => location.startsWith(item.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "px-3.5 py-2 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap",
          hasActiveChild
            ? "text-nagari-red-ink font-semibold"
            : "text-foreground/80 hover:text-foreground hover:bg-muted"
        )}
      >
        {label}
        <ChevronDown aria-hidden="true" size={16} className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-0 mt-1 w-56 bg-popover text-popover-foreground rounded-xl border border-border py-1.5 z-50 shadow-sm"
      >
        {items.map(item => (
          <Link key={item.href} href={item.href}>
            <a
              aria-current={location.startsWith(item.href) ? "page" : undefined}
              className={cn(
                "block px-4 py-2.5 text-sm transition-colors hover:bg-muted hover:text-foreground",
                location.startsWith(item.href) ? "text-nagari-red-ink font-semibold bg-muted/60" : "text-foreground/80"
              )}
            >
              {item.label}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-[13px] font-semibold px-3">{title}</p>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  const [location] = useLocation();
  const active = href === "/" ? location === "/" : location.startsWith(href);

  return (
    <Link href={href}>
      <a
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center justify-between min-h-[48px] px-3 py-2.5 rounded-lg text-base font-medium transition-colors hover:bg-muted",
          active ? "text-nagari-red-ink font-semibold bg-muted" : "text-foreground"
        )}
      >
        {children}
        <ChevronRight aria-hidden="true" size={16} className="text-muted-foreground" />
      </a>
    </Link>
  );
}
