
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
    <section className="section-spacing -mt-20 relative z-20 container-padding pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Card className="professional-hover border border-border shadow-sm bg-white h-full overflow-hidden group rounded-lg">
                <CardContent className="p-6 flex flex-col items-center text-center relative space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                    <stat.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground font-serif tracking-tight leading-none">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {stat.suffix}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
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
