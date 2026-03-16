import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import Services from "@/components/home/Services";
import News from "@/components/home/News";
import UMKM from "@/components/home/UMKM";
import InfografikPreview from "@/components/home/InfografikPreview";
import MonografiPreview from "@/components/home/MonografiPreview";
import PetaPreview from "@/components/home/PetaPreview";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import { useKataSambutan } from "@/lib/api";
import { ArrowRight, Quote, Loader2, Sparkles, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  const { data: sambutanResponse, isLoading: isLoadingSambutan } = useKataSambutan();
  const sambutan = sambutanResponse?.data;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-slate-50 dark:bg-[#0a1a1c] transition-colors duration-500">
      <Navbar />
      
      <main>
        <Hero />

        {/* ===== LIGHTWEIGHT BACKGROUND (no parallax orbs, no blur, no noise) ===== */}
        <div className="relative">
          {/* Simple static gradient — GPU-friendly */}
          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 via-slate-50 to-emerald-50/20 dark:from-[#123136] dark:via-[#0a1a1c] dark:to-[#061011]" />

          <div className="relative z-10 pt-4 pb-20">
            {/* Statistics — overlaps hero */}
            <Statistics />

            {/* SPACER */}
            <div className="h-16 md:h-24" />

            {/* Sambutan Wali Nagari */}
            <section className="px-4 md:px-6 relative">
              <div className="container mx-auto">
                {isLoadingSambutan ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#2b9a9e] animate-spin" />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="group relative"
                  >
                    {/* Glowing aura behind the card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-200/50 via-emerald-200/50 to-cyan-200/50 dark:from-[#1a6669]/50 dark:via-[#2b9a9e]/30 dark:to-[#3fd5ba]/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 group-hover:duration-500 transition-opacity" />
                    
                    <div className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 lg:p-14 border border-black/5 dark:border-white/[0.08] flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden shadow-xl dark:shadow-2xl">
                      {/* Internal glass reflections */}
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent" />

                      <div className="w-full md:w-5/12 relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/20 shadow-xl dark:shadow-[-15px_15px_30px_rgba(0,0,0,0.5)] relative z-10">
                          <img 
                            src={sambutan?.foto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"} 
                            alt={sambutan?.nama || "Wali Nagari"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a1c] via-[#0a1a1c]/40 to-transparent opacity-80" />
                          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                            <p className="font-serif font-bold text-2xl md:text-3xl text-white mb-2 tracking-wide">{sambutan?.nama || "-"}</p>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-0.5 w-12 bg-teal-400 dark:bg-[#3fd5ba] rounded-full" />
                              <div className="h-0.5 w-2 bg-teal-400 dark:bg-[#3fd5ba] rounded-full opacity-60" />
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300 dark:text-[#3fd5ba]/80 flex items-center gap-2">
                              <Navigation className="w-3 h-3" /> {sambutan?.jabatan || "Wali Nagari"}
                            </p>
                          </div>
                        </div>
                        {/* Decorative wireframe behind image */}
                        <div className="absolute -bottom-6 -left-6 w-full h-full border border-teal-600/20 dark:border-[#2b9a9e]/20 rounded-2xl -z-10" />
                      </div>

                      <div className="w-full md:w-7/12 text-center md:text-left relative z-10">
                        <Quote className="absolute -top-8 -left-8 text-black/[0.03] dark:text-white/[0.04] w-28 h-28 rotate-180" />
                        
                        <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-6 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-2 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          Sepatah Kata
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-8 leading-[1.15]">
                          Sinergi <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Inovasi</span> <br className="hidden md:block" />
                          Membangun Nagari.
                        </h2>
                        
                        <div className="space-y-5 text-slate-600 dark:text-white/50 leading-relaxed text-sm md:text-base mb-8 font-light">
                          <p>
                            <span className="font-serif text-2xl text-teal-600 dark:text-[#3fd5ba] font-bold mr-1 leading-none">"</span>
                            {sambutan?.kata_sambutan || "Platform ini hadir sebagai wujud nyata komitmen kami mendekatkan pelayanan dengan teknologi, memastikan transparansi, dan membangun jembatan komunikasi yang tak terputus dengan warga."}
                          </p>
                          <p>Mari bersama-sama kita wujudkan nagari yang berdaya, mandiri, dan berbudaya tuju kehidupan yang lebih baik.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                          <Link href="/profil">
                            <Button className="rounded-full h-12 px-8 text-xs font-bold bg-teal-600 text-white dark:bg-white dark:text-[#0a1a1c] hover:bg-teal-700 dark:hover:bg-white/90 border-0 shadow-lg flex items-center gap-2 transition-all">
                              Jelajahi Profil <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href="/kontak">
                            <Button variant="outline" className="rounded-full h-12 px-8 text-xs font-bold border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2">
                              Hubungi Kami
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            {/* SPACER */}
            <div className="h-16 md:h-24" />
            <Services />

            {/* SPACER */}
            <div className="h-12 md:h-20" />
            <InfografikPreview />

            {/* SPACER */}
            <div className="h-12 md:h-20" />
            <MonografiPreview />

            {/* SPACER */}
            <div className="h-12 md:h-20" />
            <PetaPreview />

            {/* SPACER */}
            <div className="h-12 md:h-20" />
            <News />

            {/* SPACER */}
            <div className="h-12 md:h-20" />
            <UMKM />
            
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
