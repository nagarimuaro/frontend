
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import Services from "@/components/home/Services";
import News from "@/components/home/News";
import UMKM from "@/components/home/UMKM";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import { useKataSambutan } from "@/lib/api";
import { ArrowRight, Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  const { data: sambutanResponse, isLoading: isLoadingSambutan } = useKataSambutan();
  const sambutan = sambutanResponse?.data;

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <Statistics />
        
        {/* Welcome Section / Sambutan Wali Nagari */}
        <section className="py-20 md:py-24 px-4 md:px-6 relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10 opacity-40" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/3 rounded-full blur-3xl -z-10 opacity-40" />

          <div className="container mx-auto">
            {isLoadingSambutan ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-border flex flex-col md:flex-row items-center gap-8 md:gap-12 relative"
              >
                <div className="w-full md:w-5/12 relative group">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border-4 border-primary/20 shadow-md">
                    <img 
                      src={sambutan?.foto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"} 
                      alt={sambutan?.nama || "Wali Nagari"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                      <p className="font-serif font-bold text-2xl mb-1">{sambutan?.nama || "-"}</p>
                      <div className="h-1 w-12 bg-secondary rounded-full mb-2" />
                      <p className="text-sm font-medium uppercase tracking-widest opacity-90">{sambutan?.jabatan || "Wali Nagari"}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-7/12 text-center md:text-left relative">
                  <Quote className="absolute -top-10 -left-10 text-primary/10 w-32 h-32 rotate-180" />
                  
                  <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-6 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Sambutan Wali Nagari
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
                    Membangun Nagari dengan <span className="text-primary italic">Inovasi</span> & <span className="text-secondary italic">Hati</span>
                  </h2>
                  
                  <div className="space-y-6 text-gray-600 leading-relaxed text-lg md:text-xl font-light">
                    <p>
                      <span className="font-serif text-2xl text-primary font-bold mr-1">"</span>
                      Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal digital resmi nagari kami.
                    </p>
                    <p>
                      {sambutan?.kata_sambutan || "Platform ini adalah wujud komitmen kami untuk menghadirkan pemerintahan yang transparan, akuntabel, dan modern. Kami percaya bahwa teknologi dapat mendekatkan pelayanan kepada masyarakat."}
                    </p>
                    <p>
                      Mari bersama-sama kita bangun nagari yang maju, mandiri, dan bermartabat.
                    </p>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link href="/profil">
                      <Button className="rounded-lg h-11 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                        Lihat Profil Pemerintahan <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/kontak">
                      <Button variant="outline" className="rounded-lg h-11 px-6 text-sm font-semibold border-border hover:bg-accent">
                        Hubungi Kami
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <Services />
        <News />
        <UMKM />
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
