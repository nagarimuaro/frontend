
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm border border-white/25"
            >
              Portal Resmi Nagari
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed"
            >
              {description || subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={`flex flex-col sm:flex-row gap-3 ${alignmentClasses.buttons} px-4`}
            >
              <Link href="/layanan">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-lg px-6 h-12 font-semibold shadow-lg shadow-secondary/25 hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                  Jelajahi Layanan <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={buttonUrl}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/15 text-white border-white/40 rounded-lg px-6 h-12 font-semibold backdrop-blur-sm hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                  <Play className="mr-2 w-5 h-5 fill-current" /> {buttonText}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>


        </>
      )}
    </section>
  );
}
