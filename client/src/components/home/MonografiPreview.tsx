import { motion } from "framer-motion";
import { ArrowRight, Mountain, Compass, Users, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useDataOverview } from "@/lib/api";

export default function MonografiPreview() {
  const { data: overviewResponse } = useDataOverview();
  const overview = overviewResponse?.data;

  const monografiItems = [
    { icon: MapPin, label: "Luas Wilayah", value: "5.749", suffix: "Ha", color: "#3fd5ba" },
    { icon: Mountain, label: "Tipologi", value: "Swasembada", suffix: "", color: "#2b9a9e" },
    { icon: Users, label: "Jumlah Jorong", value: overview?.jumlah_jorong?.toString() || "8", suffix: "Jorong", color: "#3fd5ba" },
    { icon: Compass, label: "Jarak Kab.", value: "0", suffix: "KM", color: "#2b9a9e" },
  ];

  const boundaries = [
    { dir: "Utara", val: "Nagari Silokek", icon: "↑" },
    { dir: "Timur", val: "Nagari Aie Angek", icon: "→" },
    { dir: "Selatan", val: "Nagari Sijunjung", icon: "↓" },
    { dir: "Barat", val: "Nagari Padang Lawej", icon: "←" },
  ];

  return (
    <section className="px-4 md:px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Header & Boundaries - Left Side on Desktop */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 lg:mb-12"
            >
              <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-6 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
                <Mountain className="w-3.5 h-3.5" />
                Profil Geografis
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                Identitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Wilayah</span>
              </h2>
              <p className="text-slate-600 dark:text-white/40 mt-5 text-sm md:text-base leading-relaxed font-light">
                Mengenal lebih dekat bentang alam, batas geografis, dan potensi komparatif nagari secara utuh.
              </p>
            </motion.div>

            {/* Boundaries Radar/Compass Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-3xl p-8 border border-black/5 dark:border-white/[0.05] shadow-lg dark:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/[0.02] dark:bg-[#3fd5ba]/[0.02] rounded-full border border-teal-500/10 dark:border-[#3fd5ba]/5 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-teal-500/20 dark:border-[#3fd5ba]/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-100 dark:bg-[#144749] border border-teal-400/50 dark:border-[#3fd5ba]/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-teal-500 dark:bg-[#3fd5ba] animate-pulse" />
              </div>

              <h3 className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-[0.3em] mb-8 text-center flex items-center justify-center gap-3 relative z-10">
                <Sparkles className="w-3 h-3 text-teal-500/60 dark:text-[#3fd5ba]/60" /> Titik Batas <Sparkles className="w-3 h-3 text-teal-500/60 dark:text-[#3fd5ba]/60" />
              </h3>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {boundaries.map((item, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.05 }} className="group">
                    <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-4 border border-black/5 dark:border-white/[0.05] hover:bg-teal-50 dark:hover:bg-[#144749]/40 hover:border-teal-300 dark:hover:border-[#3fd5ba]/20 transition-all text-center h-full flex flex-col justify-center gap-1.5 shadow-inner">
                      <span className="text-teal-500/50 dark:text-[#3fd5ba]/40 block text-sm font-bold group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] group-hover:-translate-y-1 transition-all">{item.icon}</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-white/30 uppercase tracking-[0.15em] block">{item.dir}</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-white/80 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats Grid - Right Side on Desktop */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {monografiItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                  className="h-full"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-white/80 dark:bg-gradient-to-br dark:from-[#0b2023]/80 dark:to-[#0b2023]/40 backdrop-blur-md border border-black/5 dark:border-white/[0.05] rounded-[2rem] p-6 lg:p-8 hover:bg-white dark:hover:bg-white/[0.04] transition-all group overflow-hidden relative shadow-lg dark:shadow-xl h-full flex flex-col justify-between"
                  >
                    {/* Hover subtle radial glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(circle at bottom right, ${item.color}15, transparent 70%)` }}
                    />

                    <div className="mb-6 z-10">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner"
                        style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}20` }}
                      >
                        <item.icon className="w-6 h-6" style={{ color: item.color }} strokeWidth={1.5} />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-[0.2em]">{item.label}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1 z-10 relative">
                      <p className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white tracking-tight tabular-nums group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-700 group-hover:to-emerald-600 dark:group-hover:from-white dark:group-hover:to-[#3fd5ba] transition-all duration-300">
                        {item.value}
                      </p>
                      {item.suffix && <span className="text-xs font-bold text-teal-600/70 dark:text-[#3fd5ba]/70 uppercase tracking-widest">{item.suffix}</span>}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-end"
            >
              <Link href="/monografi">
                <Button className="rounded-full px-8 h-12 w-full md:w-auto text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                  Semua Data Monografi <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
