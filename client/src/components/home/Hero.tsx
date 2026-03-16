import { motion } from "framer-motion";
import { ArrowRight, Play, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroBanners } from "@/lib/api";
import { Link } from "wouter";

export default function Hero() {
  const { data: bannersResponse, isLoading } = useHeroBanners();
  const banners = bannersResponse?.data || [];
  const banner = banners[0];

  // Use data from API with fallbacks
  const title = banner?.title || "Selamat Datang di Portal Nagari";
  const subtitle = banner?.subtitle || "Membangun Nagari Yang Maju dan Sejahtera";
  const description = banner?.description || "";
  const buttonText = banner?.button_text || "Pelajari Lebih Lanjut";
  const buttonUrl = banner?.button_url || "/profil";
  const overlayColor = banner?.overlay_color || "rgba(10, 26, 28, 0.6)"; // Default to dark teal overlay
  const textPosition = banner?.text_position || "center"; // center, left, right
  
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
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0a1a1c]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-[#0a1a1c]">
          <Loader2 className="w-12 h-12 text-[#3fd5ba] animate-spin" />
        </div>
      ) : (
        <>
          {/* Static Background — no parallax, no blur */}
          <div className="absolute inset-0 z-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor }}
            />
            {/* Gradient fade at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-50 dark:from-[#0a1a1c] to-transparent" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 md:px-6 pt-20">
            <div className={`max-w-4xl mx-auto flex flex-col ${alignmentClasses.container}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full flex flex-col items-center md:items-start"
                style={{ alignItems: textPosition === 'left' ? 'flex-start' : textPosition === 'right' ? 'flex-end' : 'center' }}
              >
                <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#3fd5ba]/10 text-[#3fd5ba] text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#3fd5ba]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Portal Resmi Nagari
                </div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.15] tracking-tight drop-shadow-2xl"
                >
                  {title}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed font-light"
                >
                  {description || subtitle}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`flex flex-col sm:flex-row gap-4 ${alignmentClasses.buttons} w-full`}
                >
                  <Link href="/layanan">
                    <Button size="lg" className="bg-[#3fd5ba] hover:bg-white text-[#0a1a1c] rounded-full px-8 h-14 text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(63,213,186,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 w-full sm:w-auto group">
                      Jelajahi Layanan <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href={buttonUrl}>
                    <Button size="lg" variant="outline" className="bg-[#144749]/40 hover:bg-[#144749]/80 text-[#3fd5ba] border-[#3fd5ba]/20 hover:border-[#3fd5ba]/50 rounded-full px-8 h-14 text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto">
                      <Play className="mr-3 w-4 h-4 fill-current" /> {buttonText}
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
