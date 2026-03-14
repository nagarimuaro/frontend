
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
    <section className="section-spacing -mt-24 relative z-20 container-padding pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="card-hover-lift border-none shadow-lg bg-white/95 backdrop-blur-sm h-full overflow-hidden group hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <CardContent className="p-8 flex flex-col items-center text-center relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-125 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                    <stat.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground font-serif tracking-tight leading-none">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                      {stat.suffix}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors pt-2">
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
