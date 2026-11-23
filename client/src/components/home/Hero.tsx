import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroBanners, type HeroBanner } from "@/lib/api";
import { Link } from "wouter";

// Fallback banner when no banners exist in CMS
const DEFAULT_BANNER: Partial<HeroBanner> = {
  id: 0,
  title: "Portal Resmi Pemerintahan Nagari",
  subtitle: "Informasi publik, data kependudukan, dan layanan administrasi nagari.",
  description: "Akses layanan surat mandiri, berita terbaru, data transparansi APB, dan direktori UMKM langsung dari pemerintah nagari.",
  button_text: "Profil Nagari",
  button_url: "/profil",
  text_position: "left",
  overlay_color: "rgba(9, 20, 38, 0.35)",
};

export default function Hero() {
  const { data: bannersResponse, isLoading } = useHeroBanners();
  const rawBanners = bannersResponse?.data || [];

  const banners = rawBanners.length > 0
    ? rawBanners.filter((b: HeroBanner) => b.is_active !== false)
    : [DEFAULT_BANNER as HeroBanner];

  const activeBanners = banners.length > 0 ? banners : [DEFAULT_BANNER as HeroBanner];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentBanner = activeBanners[currentIndex] || activeBanners[0] || DEFAULT_BANNER;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const title = currentBanner.title || DEFAULT_BANNER.title!;
  const subtitle = currentBanner.subtitle || "";
  const description = currentBanner.description || "";
  const buttonText = currentBanner.button_text || "Profil Nagari";
  const buttonUrl = currentBanner.button_url || "/profil";
  const overlayColor = currentBanner.overlay_color;
  const textPosition = currentBanner.text_position || "left";
  const imageUrl = currentBanner.image_url || currentBanner.image || null;
  const mobileImageUrl = (currentBanner as any).mobile_image_url || currentBanner.mobile_image || imageUrl;

  const align = {
    items: textPosition === "right" ? "items-end text-right"
      : textPosition === "center" ? "items-center text-center"
      : "items-start text-left",
    buttons: textPosition === "right" ? "sm:justify-end"
      : textPosition === "center" ? "sm:justify-center"
      : "sm:justify-start",
    wrap: textPosition === "right" ? "ml-auto"
      : textPosition === "center" ? "mx-auto"
      : "",
  };

  return (
    <section
      aria-label="Banner Utama Portal Nagari"
      onTouchStart={activeBanners.length > 1 ? handleTouchStart : undefined}
      onTouchMove={activeBanners.length > 1 ? handleTouchMove : undefined}
      onTouchEnd={activeBanners.length > 1 ? handleTouchEnd : undefined}
      className="relative mt-[72px] min-h-[calc(100svh-72px)] flex items-center overflow-hidden bg-nagari-navy"
    >
      {/* Background image or solid navy ground */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {imageUrl ? (
          <picture className="w-full h-full">
            {mobileImageUrl && (
              <source media="(max-width: 768px)" srcSet={mobileImageUrl} />
            )}
            <img
              src={imageUrl}
              alt={title}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-nagari-navy" />
        )}

        {overlayColor && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
          />
        )}

        {/* Single contrast scrim so white headline always clears WCAG AA */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-nagari-navy/75 via-nagari-navy/55 to-nagari-navy/85"
        />
      </div>

      {isLoading ? (
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-3 py-24">
          <Loader2 aria-hidden="true" className="w-10 h-10 text-nagari-yellow animate-spin" />
          <span className="text-sm font-medium text-white/80">Memuat informasi nagari...</span>
        </div>
      ) : (
        <>
          <div className="container relative z-20 mx-auto px-4 md:px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`max-w-3xl flex flex-col ${align.items} ${align.wrap}`}
            >
              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-nagari-yellow mb-5">
                <MapPin aria-hidden="true" className="w-4 h-4" />
                Portal Resmi Nagari
              </p>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-5 leading-[1.12] tracking-tight [overflow-wrap:anywhere]">
                {title}
              </h1>

              {subtitle && (
                <p className="text-lg sm:text-xl text-white/95 font-medium mb-4 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="text-base text-white/85 mb-8 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              <div className={`flex flex-col sm:flex-row gap-3.5 w-full ${align.buttons}`}>
                <Link href="/layanan" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg px-6 h-12 text-sm font-medium transition-colors group whitespace-nowrap"
                  >
                    Ajukan Layanan Surat
                    <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>

                {buttonUrl && (
                  <Link href={buttonUrl} className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/30 text-white rounded-lg px-6 h-12 text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      {buttonText}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {activeBanners.length > 1 && (
            <div className="absolute bottom-6 inset-x-0 z-30">
              <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Banner sebelumnya"
                    className="w-11 h-11 rounded-lg bg-nagari-navy/80 hover:bg-nagari-navy border border-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft aria-hidden="true" className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Banner berikutnya"
                    className="w-11 h-11 rounded-lg bg-nagari-navy/80 hover:bg-nagari-navy border border-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight aria-hidden="true" className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-nagari-navy/80 px-3.5 py-2 rounded-lg border border-white/15">
                  <div className="flex items-center gap-1.5">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Tampilkan banner ${idx + 1}`}
                        aria-current={idx === currentIndex ? "true" : undefined}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentIndex ? "w-6 bg-nagari-yellow" : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[13px] font-medium text-white/90 tabular-nums">
                    {currentIndex + 1} / {activeBanners.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

