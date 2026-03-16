import { motion } from "framer-motion";
import { 
  Users, BarChart3, PieChart, TrendingUp, Building2, Map, ArrowUpRight, Loader2 
} from "lucide-react";
import { 
  Card, CardContent, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataOverview, useNagariStats, useNagariProfile } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import statsImage from "@assets/generated_images/digital_map_of_village.png"; // Placeholder

export default function PublicData() {
  const { data: overviewResponse, isLoading: loadingOverview } = useDataOverview();
  const { data: statsResponse, isLoading: loadingStats } = useNagariStats();
  const { data: profileResponse, isLoading: loadingProfile } = useNagariProfile();

  const overview = overviewResponse?.data;
  const stats = statsResponse?.data;
  const profile = profileResponse?.data;

  const isLoading = loadingOverview || loadingStats || loadingProfile;

  // Use data from API - field names match backend response
  const population = {
    total: overview?.jumlah_penduduk || 0,
    male: overview?.jumlah_laki_laki || 0,
    female: overview?.jumlah_perempuan || 0,
    families: overview?.jumlah_kk || 0
  };

  const education = stats?.education || [
    { name: "SD/Sederajat", value: 15 },
    { name: "SMP/Sederajat", value: 25 },
    { name: "SMA/Sederajat", value: 35 },
    { name: "Diploma/Sarjana", value: 20 },
    { name: "Pasca Sarjana", value: 5 },
  ];

  const jobs = stats?.jobs || [
    { name: "Petani", value: 45, color: "#22c55e" },
    { name: "Pedagang", value: 20, color: "#3b82f6" },
    { name: "PNS/ASN", value: 10, color: "#a855f7" },
    { name: "Wiraswasta", value: 15, color: "#f97316" },
    { name: "Lainnya", value: 10, color: "#9ca3af" }, // muted gray for dark mode
  ];

  const areaSize = profile?.luas_wilayah || overview?.luas_wilayah || "12.5";
  const budget = overview?.total_anggaran 
    ? `${(overview.total_anggaran / 1000000000).toFixed(1)} M` 
    : "1.2 M";

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] space-x-3">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Sinkronisasi Data...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Data Publik & Statistik" 
        description="Dashboard data kependudukan, sosial, dan ekonomi Nagari secara transparan dan akurat yang langsung disinkronisasi dari Database."
        image={statsImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <StatCard 
            title="Total Penduduk" 
            value={population.total.toLocaleString()} 
            icon={Users} 
            description="Jiwa"
            trend="+1.2%"
            color="text-blue-400"
            bgColor="bg-blue-500/10"
            borderColor="border-blue-500/20"
            glowColor="rgba(59,130,246,0.3)"
          />
          <StatCard 
            title="Kepala Keluarga" 
            value={population.families.toLocaleString()} 
            icon={Building2} 
            description="KK"
            trend="+0.5%"
            color="text-purple-400"
            bgColor="bg-purple-500/10"
            borderColor="border-purple-500/20"
            glowColor="rgba(168,85,247,0.3)"
          />
          <StatCard 
            title="Luas Wilayah" 
            value={areaSize} 
            icon={Map} 
            description="km²"
            trend="Tetap"
            color="text-teal-600 dark:text-[#3fd5ba]"
            bgColor="bg-teal-600/10 dark:bg-[#3fd5ba]/10"
            borderColor="border-teal-300 dark:border-[#3fd5ba]/20"
            glowColor="rgba(63,213,186,0.3)"
          />
          <StatCard 
            title="Anggaran Nagari" 
            value={budget} 
            icon={TrendingUp} 
            description="Tahun Realisasi"
            trend="+5%"
            color="text-amber-400"
            bgColor="bg-amber-500/10"
            borderColor="border-amber-500/20"
            glowColor="rgba(245,158,11,0.3)"
          />
        </div>

        <Tabs defaultValue="population" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 p-1.5 h-auto flex-wrap justify-center gap-2 rounded-2xl shadow-xl">
                <TabTrigger value="population">Demografi Penduduk</TabTrigger>
                <TabTrigger value="education">Tingkat Pendidikan</TabTrigger>
                <TabTrigger value="jobs">Profesi & Pekerjaan</TabTrigger>
                <TabTrigger value="budget">Realisasi Anggaran</TabTrigger>
            </TabsList>
          </div>

          <TabsContent value="population">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <Card className="rounded-[2.5rem] bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="p-8 md:p-10 border-b border-black/5 dark:border-white/5 relative z-10">
                  <h3 className="font-serif font-bold text-2xl text-slate-800 dark:text-white md:text-3xl mb-2">Komposisi Gender</h3>
                  <p className="text-slate-600 dark:text-white/40 font-light text-sm">Perbandingan jumlah penduduk Laki-laki dan Perempuan berdasarkan basis data kependudukan.</p>
                </div>
                <CardContent className="flex flex-col items-center justify-center p-10 md:p-14 relative z-10">
                  <div className="flex items-end gap-12 md:gap-24 h-72 w-full justify-center relative">
                    {/* Grid lines background */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                      {[1,2,3,4,5].map((_, i) => <div key={i} className="w-full h-px border-t border-dashed border-white" />)}
                    </div>
                    
                    {/* Male Bar */}
                    <div className="flex flex-col items-center gap-6 w-28 group/bar cursor-pointer z-10">
                      <div className="flex flex-col items-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                         <span className="font-bold text-4xl text-blue-400 mb-1 leading-none">{population.male.toLocaleString()}</span>
                         <span className="text-[10px] text-slate-600 dark:text-white/50 font-bold uppercase tracking-[0.2em] mt-2">Jiwa</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-2xl relative h-[220px] overflow-hidden border border-black/5 dark:border-white/10 shadow-inner group-hover/bar:border-blue-400/50 group-hover/bar:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all">
                         <motion.div 
                           initial={{ height: 0 }} 
                           whileInView={{ height: `${Math.round(population.male / population.total * 100)}%` }} 
                           viewport={{ once: true }}
                           transition={{ duration: 2, ease: "easeOut", type: "spring", bounce: 0.2 }}
                           className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300 rounded-2xl relative overflow-hidden"
                         >
                            <div className="absolute inset-x-0 top-0 h-1 bg-white/50 rounded-full" />
                         </motion.div>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-xl border border-blue-500/30 text-blue-300 font-bold text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] uppercase tracking-wider">
                        Laki-laki
                      </div>
                    </div>

                    {/* Female Bar */}
                    <div className="flex flex-col items-center gap-6 w-28 group/bar cursor-pointer z-10">
                      <div className="flex flex-col items-center drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]">
                         <span className="font-bold text-4xl text-pink-400 mb-1 leading-none">{population.female.toLocaleString()}</span>
                         <span className="text-[10px] text-slate-600 dark:text-white/50 font-bold uppercase tracking-[0.2em] mt-2">Jiwa</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-2xl relative h-[220px] overflow-hidden border border-black/5 dark:border-white/10 shadow-inner group-hover/bar:border-pink-400/50 group-hover/bar:shadow-[0_0_30px_rgba(244,114,182,0.3)] transition-all">
                        <motion.div 
                           initial={{ height: 0 }} 
                           whileInView={{ height: `${Math.round(population.female / population.total * 100)}%` }} 
                           viewport={{ once: true }}
                           transition={{ duration: 2, ease: "easeOut", type: "spring", bounce: 0.2, delay: 0.2 }}
                           className="absolute bottom-0 w-full bg-gradient-to-t from-pink-600 via-pink-400 to-rose-300 rounded-2xl relative overflow-hidden"
                         >
                           <div className="absolute inset-x-0 top-0 h-1 bg-white/50 rounded-full" />
                         </motion.div>
                      </div>
                      <div className="flex items-center gap-2 bg-pink-500/20 px-4 py-1.5 rounded-xl border border-pink-500/30 text-pink-300 font-bold text-xs shadow-[0_0_15px_rgba(244,114,182,0.3)] uppercase tracking-wider">
                        Perempuan
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden h-full relative group">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
                <div className="p-8 md:p-10 border-b border-black/5 dark:border-white/5 relative z-10">
                  <h3 className="font-serif font-bold text-2xl text-slate-800 dark:text-white md:text-3xl mb-2">Sebaran Usia</h3>
                  <p className="text-slate-600 dark:text-white/40 font-light text-sm">Distribusi penduduk berdasarkan segmentasi dan kelompok usia dari balita hingga lansia.</p>
                </div>
                <CardContent className="space-y-10 p-8 md:p-14 relative z-10">
                  <AgeGroup label="0-5 Tahun (Balita)" value={15} glowColor="bg-teal-500 dark:bg-[#3fd5ba]" borderColor="border-teal-300 dark:border-[#3fd5ba]" textColor="text-teal-600 dark:text-[#3fd5ba]" />
                  <AgeGroup label="6-17 Tahun (Anak-anak)" value={25} glowColor="bg-blue-400" borderColor="border-blue-400" textColor="text-blue-400" />
                  <AgeGroup label="18-50 Tahun (Dewasa)" value={45} glowColor="bg-purple-400" borderColor="border-purple-400" textColor="text-purple-400" />
                  <AgeGroup label="> 50 Tahun (Lansia)" value={15} glowColor="bg-amber-400" borderColor="border-amber-400" textColor="text-amber-400" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <Card className="rounded-[2.5rem] bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
              <div className="p-8 md:p-12 border-b border-black/5 dark:border-white/5 relative z-10">
                <h3 className="font-serif font-bold text-3xl text-slate-800 dark:text-white mb-2">Tingkat Pendidikan Penduduk</h3>
                <p className="text-slate-600 dark:text-white/40 font-light text-sm max-w-xl">Persentase tingkat pendidikan terakhir dari seluruh warga penduduk nagari sebagai acuan kemajuan SDM.</p>
              </div>
              <CardContent className="p-8 md:p-14 relative z-10">
                <div className="space-y-10 max-w-4xl mx-auto">
                  {education.map((item: any, index: number) => (
                    <div key={index} className="space-y-4 group/item">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-600 dark:text-white/80 text-lg group-hover/item:text-slate-800 dark:text-white transition-colors">{item.name}</span>
                        <span className="text-3xl font-bold font-serif text-teal-600 dark:text-[#3fd5ba] group-hover/item:drop-shadow-md dark:shadow-[0_0_15px_rgba(63,213,186,0.5)] transition-all">{item.value}%</span>
                      </div>
                      <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-black/5 dark:border-white/10 shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           whileInView={{ width: `${item.value}%` }} 
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                           className="h-full bg-gradient-to-r from-purple-500 via-blue-400 to-[#3fd5ba] rounded-full relative"
                         >
                            <div className="absolute top-0 right-0 h-full w-2 bg-white/50 rounded-r-full" />
                         </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <Card className="rounded-[2.5rem] bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="p-8 md:p-10 border-b border-black/5 dark:border-white/5 relative z-10">
                  <h3 className="font-serif font-bold text-2xl md:text-3xl text-slate-800 dark:text-white mb-2">Profesi Penduduk</h3>
                  <p className="text-slate-600 dark:text-white/40 font-light text-sm">Distribusi mayoritas mata pencaharian warga.</p>
                </div>
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="space-y-4">
                    {jobs.map((job: any, index: number) => (
                      <div key={index} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 hover:border-black/5 dark:border-white/10 shadow-sm group">
                        <div className="w-5 h-5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ring-4 ring-white/10" style={{ backgroundColor: job.color }} />
                        <span className="flex-1 text-lg font-bold text-slate-600 dark:text-white/80 group-hover:text-slate-800 dark:text-white transition-colors">{job.name}</span>
                        <div className="relative">
                          <div className="absolute inset-0 opacity-20 blur-sm rounded-lg" style={{ backgroundColor: job.color }} />
                          <span className="font-bold text-xl px-4 py-2 rounded-xl relative z-10" style={{ color: job.color, backgroundColor: 'rgba(255,255,255,0.05)' }}>{job.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Data Visualization Placeholder Area */}
              <Card className="flex flex-col relative items-center justify-center bg-slate-50/90 dark:bg-[#0a1a1c]/80 backdrop-blur-md rounded-[2.5rem] border border-dashed border-black/5 dark:border-white/20 hover:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors group overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors duration-700" />
                <div className="text-center p-12 relative z-10">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-black/5 dark:border-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(63,213,186,0.2)]">
                    <PieChart size={40} className="text-teal-600/50 dark:text-[#3fd5ba]/50 group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mb-4">Grafik 3D Interaktif</h3>
                  <p className="text-slate-600 dark:text-white/40 max-w-sm mx-auto font-light leading-relaxed">
                    Visualisasi Doughnut & Polygon interaktif akan dirender menggunakan library WebGL/ECharts dari backend SINTA API pada rilis berikutnya.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <Card className="rounded-[2.5rem] bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-500/15 transition-colors" />
              <div className="p-8 md:p-12 border-b border-black/5 dark:border-white/5 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="font-serif font-bold text-3xl text-slate-800 dark:text-white mb-2">Realisasi APB Nagari 2025</h3>
                        <p className="text-slate-600 dark:text-white/40 font-light text-sm max-w-xl">Laporan penyerapan porsi Anggaran Pendapatan dan Belanja Nagari sesuai standar transparansi publik.</p>
                    </div>
                    <div className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30 shadow-[0_0_15px_rgba(63,213,186,0.2)] px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 dark:bg-[#3fd5ba] animate-pulse" /> Tahun Berjalan
                    </div>
                </div>
              </div>
              <CardContent className="space-y-10 p-8 md:p-14 relative z-10">
                <BudgetBar label="Bidang Penyelenggaraan Pemerintahan Desa" value={95} color="bg-blue-400" />
                <BudgetBar label="Bidang Pembangunan Dan Infrastruktur Desa" value={80} color="bg-teal-500 dark:bg-[#3fd5ba]" />
                <BudgetBar label="Bidang Pembinaan Kemasyarakatan" value={60} color="bg-rose-400" />
                <BudgetBar label="Bidang Pemberdayaan Ekonomi Masyarakat" value={45} color="bg-amber-400" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </PageBackground>
  );
}

function StatCard({ title, value, icon: Icon, description, trend, color, bgColor, borderColor, glowColor }: any) {
  return (
    <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
    >
        <Card className={`bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border ${borderColor} shadow-lg hover:shadow-[0_0_20px_${glowColor}] transition-all duration-300 rounded-[2rem] overflow-hidden h-full relative group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        <CardContent className="p-8 relative z-10">
            <div className="flex items-start justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl border ${borderColor} ${bgColor} ${color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={26} strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                <ArrowUpRight size={12} strokeWidth={3} /> {trend}
            </div>
            </div>
            
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h2 className={`text-4xl font-serif font-bold ${color} drop-shadow-[0_0_10px_${glowColor}]`}>{value}</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-white/30">{description}</span>
                </div>
            </div>
        </CardContent>
        </Card>
    </motion.div>
  );
}

function AgeGroup({ label, value, glowColor, borderColor, textColor }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-slate-600 dark:text-white/80">{label}</span>
        <span className={`font-bold ${textColor} border ${borderColor} bg-white/5 px-4 py-1.5 rounded-xl shadow-inner text-sm`}>{value}%</span>
      </div>
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-black/5 dark:border-white/5">
        <motion.div 
          initial={{ width: 0 }} 
          whileInView={{ width: `${value}%` }} 
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${glowColor} rounded-full relative shadow-[0_0_15px_${textColor}]`} 
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

function BudgetBar({ label, value, color }: any) {
    return (
        <div className="space-y-4 group/budget border-b border-black/5 dark:border-white/5 pb-8 last:border-0 last:pb-0">
            <div className="flex justify-between text-base font-bold text-slate-600 dark:text-white/80 md:text-lg">
              <span className="max-w-[80%] leading-snug">{label}</span>
              <span className="font-serif text-2xl drop-shadow-md">{value}%</span>
            </div>
            <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner p-[2px] border border-black/5 dark:border-white/10 group-hover/budget:border-black/5 dark:border-white/20 transition-colors">
             <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut", type: "spring" }}
                className={`h-full ${color} rounded-full relative overflow-hidden`}
             >
                <div className="absolute top-0 right-0 h-full w-2 bg-white/50 rounded-r-full" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/budget:animate-[shimmer_2s_infinite]" />
             </motion.div>
            </div>
        </div>
    )
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
    return (
        <TabsTrigger 
            value={value} 
            className="rounded-xl px-4 md:px-8 py-3 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] data-[state=active]:shadow-[0_0_20px_rgba(63,213,186,0.3)] transition-all"
        >
            {children}
        </TabsTrigger>
    )
}
