import { useDataOverview } from "@/lib/api";
import { motion } from "framer-motion";
import { Users, Map, Calendar, Mountain, Wallet, Building2, Loader2 } from "lucide-react";

export default function Statistics() {
  const { data: overviewResponse, isLoading } = useDataOverview();
  const overview = overviewResponse?.data;

  const statistics = [
    { label: "Penduduk", value: overview?.jumlah_penduduk?.toLocaleString() || "-", icon: Users, suffix: "Jiwa", color: "#3fd5ba" },
    { label: "Luas Wilayah", value: overview?.luas_wilayah || "-", icon: Map, suffix: "km²", color: "#2b9a9e" },
    { label: "Jumlah KK", value: overview?.jumlah_kk?.toLocaleString() || "-", icon: Calendar, suffix: "KK", color: "#3fd5ba" },
    { label: "Ketinggian", value: overview?.ketinggian?.toString() || "-", icon: Mountain, suffix: "mdpl", color: "#2b9a9e" },
    { label: "Dana Nagari", value: (overview && overview.total_anggaran > 0) ? (overview.total_anggaran / 1000000).toFixed(1) : "-", icon: Wallet, suffix: (overview && overview.total_anggaran > 0) ? "M" : "", color: "#3fd5ba" },
    { label: "Jorong", value: overview?.jumlah_jorong?.toString() || "-", icon: Building2, suffix: "Unit", color: "#2b9a9e" },
  ];

  if (isLoading) {
    return (
      <section className="py-12 -mt-24 relative z-20 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-[#3fd5ba] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="-mt-16 relative z-20 px-4 md:px-6 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.04] rounded-2xl p-4 md:p-5 text-center group hover:bg-white dark:hover:bg-white/[0.06] hover:border-black/10 dark:hover:border-white/[0.1] transition-all cursor-pointer relative overflow-hidden shadow-lg"
              >
                {/* Hover gradient effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top, ${stat.color}, transparent 60%)` }}
                />
                
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors duration-300 relative z-10"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon size={18} strokeWidth={2} />
                </div>
                <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white font-serif tabular-nums leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-1.5 opacity-90" style={{ color: stat.color }}>
                  {stat.suffix}
                </p>
                <div className="h-px w-8 mx-auto bg-black/10 dark:bg-white/10 my-2" />
                <p className="text-[10px] text-slate-500 dark:text-white/40 font-medium tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
