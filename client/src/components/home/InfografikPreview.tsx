import { motion } from "framer-motion";
import { BarChart3, ArrowRight, TrendingUp, Wallet, Users2, HeartPulse, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useDataOverview } from "@/lib/api";

export default function InfografikPreview() {
  const { data: overviewResponse } = useDataOverview();
  const overview = overviewResponse?.data;

  const highlights = [
    { label: "Total Penduduk", value: overview?.jumlah_penduduk?.toLocaleString('id-ID') || "—", unit: "Jiwa", icon: Users2 },
    { label: "Kepala Keluarga", value: overview?.jumlah_kk?.toLocaleString('id-ID') || "—", unit: "KK", icon: Wallet },
    { label: "Laki-laki", value: overview?.jumlah_laki_laki?.toLocaleString('id-ID') || "—", unit: "Jiwa", icon: TrendingUp },
    { label: "Perempuan", value: overview?.jumlah_perempuan?.toLocaleString('id-ID') || "—", unit: "Jiwa", icon: HeartPulse },
  ];

  return (
    <section className="px-4 md:px-6 relative">
      <div className="container mx-auto">
        
        {/* Header - Horizontal Layout on Desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
              <BarChart3 className="w-3.5 h-3.5" />
              Infografis Data
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Demografi <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Nagari Aktual</span>
            </h2>
            <p className="text-slate-600 dark:text-white/40 mt-4 text-sm md:text-base leading-relaxed font-light">
              Angka yang berbicara. Ringkasan statistik kependudukan nagari secara transparan dan real-time.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link href="/infografis">
              <Button className="rounded-full px-8 h-12 text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                Detail Infografis <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Data Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
            >
              <div className="group h-full flex flex-row items-center gap-5 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.05] rounded-3xl p-6 lg:p-8 hover:bg-white dark:hover:bg-white/[0.03] hover:border-teal-300 dark:hover:border-[#3fd5ba]/30 transition-all duration-500 shadow-lg dark:shadow-xl overflow-hidden relative">
                
                {/* Accent glow on hover */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-1/2 bg-teal-400 dark:bg-[#3fd5ba] rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.6)]" />

                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-[#144749]/50 border border-teal-200 dark:border-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-[#3fd5ba]/20 transition-colors duration-500 shadow-inner flex-shrink-0">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.2em] mb-1">{item.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight tabular-nums group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-700 group-hover:to-emerald-600 dark:group-hover:from-white dark:group-hover:to-[#3fd5ba] transition-all duration-300">
                      {item.value}
                    </p>
                    <span className="text-[11px] font-bold text-teal-600/70 dark:text-[#3fd5ba]/70 uppercase tracking-widest">{item.unit}</span>
                  </div>
                </div>

                <ExternalLink size={16} className="absolute top-6 right-6 text-black/10 dark:text-white/10 group-hover:text-teal-500/40 dark:group-hover:text-[#3fd5ba]/40 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/infografis">
            <Button className="rounded-full px-8 h-12 w-full text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20">
              Detail Infografis <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
