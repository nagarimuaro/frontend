
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import Services from "@/components/home/Services";
import News from "@/components/home/News";
import UMKM from "@/components/home/UMKM";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import { staff } from "@/lib/data";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const headOfNagari = staff[0];

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <Statistics />
        
        {/* Welcome Section / Sambutan Wali Nagari */}
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-green-50/50 -z-10" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-white/50 flex flex-col md:flex-row items-center gap-12 md:gap-20 relative"
            >
              <div className="w-full md:w-5/12 relative group">
                <div className="absolute inset-0 bg-primary rounded-[2.5rem] rotate-6 scale-95 opacity-20 group-hover:rotate-3 transition-transform duration-500" />
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl relative z-10">
                  <img 
                    src={headOfNagari.photo} 
                    alt={headOfNagari.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                    <p className="font-serif font-bold text-2xl mb-1">{headOfNagari.name}</p>
                    <div className="h-1 w-12 bg-secondary rounded-full mb-2" />
                    <p className="text-sm font-medium uppercase tracking-widest opacity-90">Wali Nagari Sungai Pinang</p>
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
                    Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal digital resmi Nagari Sungai Pinang.
                  </p>
                  <p>
                    Platform ini adalah wujud komitmen kami untuk menghadirkan pemerintahan yang <strong>transparan</strong>, <strong>akuntabel</strong>, dan <strong>modern</strong>. Kami percaya bahwa teknologi dapat mendekatkan pelayanan kepada masyarakat.
                  </p>
                  <p>
                    Mari bersama-sama kita bangun Nagari Sungai Pinang menjadi nagari yang maju, mandiri, dan bermartabat.
                  </p>
                </div>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button className="rounded-full h-14 px-8 text-lg font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all">
                    Lihat Profil Pemerintahan <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="rounded-full h-14 px-8 text-lg font-medium border-gray-300 hover:bg-gray-50">
                    Hubungi Kami
                  </Button>
                </div>
              </div>
            </motion.div>
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
