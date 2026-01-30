
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroBanners } from "@/lib/api";
import { useRef } from "react";
import { Link } from "wouter";

export default function Hero() {
  const { data: bannersResponse, isLoading } = useHeroBanners();
  const banners = bannersResponse?.data || [];
  const banner = banners[0]; // Gunakan banner pertama saja
  
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Use data from API with fallbacks
  const title = banner?.title || "Selamat Datang di Portal Nagari";
  const subtitle = banner?.subtitle || "Membangun Nagari Yang Maju dan Sejahtera";
  const description = banner?.description || "";
  const buttonText = banner?.button_text || "Pelajari Lebih Lanjut";
  const buttonUrl = banner?.button_url || "/profil";
  const overlayColor = banner?.overlay_color || "rgba(0,0,0,0.4)";
  const textPosition = banner?.text_position || "center"; // center, left, right
  const textAlign = banner?.text_align || "center";
  
  // Image URL - prefer image_url, fallback to image field
  const imageUrl = banner?.image_url || banner?.image || "https://images.unsplash.com/photo-1598327774900-53093952f901?q=80&w=2000&auto=format&fit=crop";

  // Dynamic alignment classes
  const alignmentClasses = {
    container: textPosition === 'left' ? 'text-left items-start' : 
               textPosition === 'right' ? 'text-right items-end' : 
               'text-center items-center',
    buttons: textPosition === 'left' ? 'justify-start' : 
             textPosition === 'right' ? 'justify-end' : 
             'justify-center',
  };

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      ) : (
        <>
          {/* Parallax Background */}
          <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0 z-0"
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover scale-110"
            />
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          </motion.div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20">
            <div className={`max-w-4xl mx-auto flex flex-col ${alignmentClasses.container}`}>
              <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md border border-white/20 shadow-2xl"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Portal Resmi Nagari
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
              {title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className="inline-block mr-2 md:mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-base sm:text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed font-light tracking-wide"
            >
              {description || subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className={`flex flex-col sm:flex-row gap-4 ${alignmentClasses.buttons} px-4`}
            >
              <Link href="/layanan">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 h-14 text-lg font-medium shadow-xl shadow-secondary/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  Jelajahi Layanan <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={buttonUrl}>
                <Button size="lg" variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-white/30 rounded-full px-8 h-14 text-lg font-medium backdrop-blur-sm hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  <Play className="mr-2 w-5 h-5 fill-current" /> {buttonText}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-3 cursor-pointer z-10 hover:text-white transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll Down</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
        </>
      )}
    </section>
  );
}
