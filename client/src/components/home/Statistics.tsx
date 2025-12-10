
import { useDataOverview } from "@/lib/api";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Map, Calendar, Mountain, Wallet, Building2, Loader2 } from "lucide-react";

export default function Statistics() {
  const { data: overviewResponse, isLoading } = useDataOverview();
  const overview = overviewResponse?.data;

  // Build statistics array from API data
  const statistics = overview ? [
    { label: "Penduduk", value: overview.jumlah_penduduk.toLocaleString(), icon: Users, suffix: "Jiwa" },
    { label: "Luas Wilayah", value: overview.luas_wilayah, icon: Map, suffix: "km²" },
    { label: "Jumlah KK", value: overview.jumlah_kk.toLocaleString(), icon: Calendar, suffix: "KK" },
    { label: "Ketinggian", value: overview.ketinggian.toString(), icon: Mountain, suffix: "mdpl" },
    { label: "Dana Nagari", value: overview.total_anggaran > 0 ? (overview.total_anggaran / 1000000).toFixed(1) : "-", icon: Wallet, suffix: overview.total_anggaran > 0 ? "M" : "" },
    { label: "Jorong", value: overview.jumlah_jorong.toString(), icon: Building2, suffix: "Unit" },
  ] : [];

  if (isLoading) {
    return (
      <section className="py-12 -mt-24 relative z-20 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 -mt-24 relative z-20 px-4 md:px-6 pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl h-full overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <CardContent className="p-6 flex flex-col items-center text-center relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-green-100 flex items-center justify-center text-primary mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <stat.icon size={22} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif tracking-tight">
                    {stat.value}
                    <span className="text-xs text-gray-500 font-sans ml-1 font-normal">{stat.suffix}</span>
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mt-1 font-medium group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
