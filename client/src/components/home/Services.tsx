import { useServices } from "@/lib/api";
import { ArrowRight, Clock, CreditCard, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Services() {
  const { data: servicesResponse, isLoading } = useServices();
  const services = servicesResponse?.data?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-[#3fd5ba] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-6 relative">
      <div className="container mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Layanan Digital
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Birokrasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Cepat & Efisien</span>
            </h2>
            <p className="text-slate-600 dark:text-white/40 mt-4 text-sm md:text-base leading-relaxed font-light">
              Ajukan permohonan surat keterangan dan administrasi kependudukan dari mana saja. Pantau status pengajuan secara real-time.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link href="/layanan">
              <Button className="rounded-full px-8 h-12 text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                Semua Layanan <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="h-full"
            >
              <div className="group h-full flex flex-col bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.05] rounded-3xl overflow-hidden hover:bg-white dark:hover:bg-white/[0.03] hover:border-teal-300 dark:hover:border-[#3fd5ba]/30 transition-all duration-500 relative shadow-lg dark:shadow-xl">
                
                {/* Top glow decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-400/50 dark:via-[#3fd5ba]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-[#144749]/50 border border-teal-200 dark:border-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center mb-6 group-hover:bg-teal-100 dark:group-hover:bg-[#3fd5ba]/20 group-hover:scale-110 transition-all duration-500 shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.1)] group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(63,213,186,0.3)]">
                    <FileText size={24} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-white leading-snug mb-3 group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-colors line-clamp-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-white/30 text-xs md:text-sm line-clamp-3 mb-6 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-white/50 transition-colors font-light flex-1">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 pt-4 border-t border-black/5 dark:border-white/[0.05]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-white/30 flex items-center gap-2"><Clock size={13} className="text-teal-500/70 dark:text-[#3fd5ba]/50" /> Proses</span>
                      <span className="text-slate-700 dark:text-white/70 font-medium">{service.estimated_time}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-white/30 flex items-center gap-2"><CreditCard size={13} className="text-teal-500/70 dark:text-[#3fd5ba]/50" /> Biaya</span>
                      <span className="text-teal-600 dark:text-[#3fd5ba] font-bold">{service.fee}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 pt-0 z-10">
                  <Link href={`/layanan?service=${service.slug}`}>
                    <Button className="w-full bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white dark:bg-[#3fd5ba]/10 dark:hover:bg-[#3fd5ba] dark:text-[#3fd5ba] dark:hover:text-[#0a1a1c] rounded-2xl h-12 font-bold text-xs transition-colors duration-300">
                      Buat Permohonan
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/layanan">
            <Button className="rounded-full px-8 h-12 w-full text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20">
              Semua Layanan <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
