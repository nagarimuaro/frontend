
import { motion } from "framer-motion";
import { 
  Users, BarChart3, PieChart, TrendingUp, Building2, Map, ArrowUpRight 
} from "lucide-react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publicData } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import statsImage from "@assets/generated_images/digital_map_of_village.png"; // Placeholder

export default function PublicData() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <PageHeader 
        title="Data Publik & Statistik" 
        description="Dashboard data kependudukan, sosial, dan ekonomi Nagari Sungai Pinang yang transparan dan akuntabel."
        image={statsImage}
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard 
            title="Total Penduduk" 
            value={publicData.population.total.toLocaleString()} 
            icon={Users} 
            description="Jiwa"
            trend="+1.2%"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            title="Kepala Keluarga" 
            value={publicData.population.families.toLocaleString()} 
            icon={Building2} 
            description="KK"
            trend="+0.5%"
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard 
            title="Luas Wilayah" 
            value="12.5" 
            icon={Map} 
            description="km²"
            trend="Tetap"
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Anggaran Desa" 
            value="1.2 M" 
            icon={TrendingUp} 
            description="Tahun 2025"
            trend="+5%"
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        <Tabs defaultValue="population" className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="bg-white border border-gray-100 p-1.5 h-auto flex-wrap justify-center gap-2 rounded-full shadow-lg shadow-gray-100/50">
                <TabTrigger value="population">Kependudukan</TabTrigger>
                <TabTrigger value="education">Pendidikan</TabTrigger>
                <TabTrigger value="jobs">Pekerjaan</TabTrigger>
                <TabTrigger value="budget">Anggaran (APB)</TabTrigger>
            </TabsList>
          </div>

          <TabsContent value="population">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2rem] shadow-lg border-none overflow-hidden">
                <CardHeader className="bg-gray-50/50 pb-8">
                  <CardTitle className="font-serif text-2xl">Komposisi Gender</CardTitle>
                  <CardDescription>Perbandingan jumlah penduduk Laki-laki dan Perempuan</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-10 bg-white relative">
                  <div className="flex items-end gap-16 h-72 w-full justify-center">
                    <div className="flex flex-col items-center gap-4 w-28 group cursor-pointer">
                      <div className="flex flex-col items-center">
                         <span className="font-bold text-3xl text-blue-600 mb-1">{publicData.population.male}</span>
                         <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jiwa</span>
                      </div>
                      <div className="w-full bg-blue-50 rounded-2xl relative h-56 overflow-hidden border border-blue-100 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all">
                         <motion.div 
                           initial={{ height: 0 }} 
                           whileInView={{ height: "49%" }} 
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="absolute bottom-0 w-full bg-blue-500 rounded-b-2xl rounded-t-sm"
                         />
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-bold text-sm">
                        Laki-laki
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 w-28 group cursor-pointer">
                      <div className="flex flex-col items-center">
                         <span className="font-bold text-3xl text-pink-600 mb-1">{publicData.population.female}</span>
                         <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Jiwa</span>
                      </div>
                      <div className="w-full bg-pink-50 rounded-2xl relative h-56 overflow-hidden border border-pink-100 group-hover:shadow-lg group-hover:shadow-pink-200/50 transition-all">
                        <motion.div 
                           initial={{ height: 0 }} 
                           whileInView={{ height: "51%" }} 
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="absolute bottom-0 w-full bg-pink-500 rounded-b-2xl rounded-t-sm"
                         />
                      </div>
                      <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full text-pink-700 font-bold text-sm">
                        Perempuan
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] shadow-lg border-none overflow-hidden h-full">
                <CardHeader className="bg-gray-50/50">
                  <CardTitle className="font-serif text-2xl">Sebaran Usia</CardTitle>
                  <CardDescription>Distribusi penduduk berdasarkan kelompok usia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-10 bg-white">
                  <AgeGroup label="0-5 Tahun (Balita)" value={15} color="bg-green-500" bgColor="bg-green-50" textColor="text-green-700" />
                  <AgeGroup label="6-17 Tahun (Anak-anak)" value={25} color="bg-blue-500" bgColor="bg-blue-50" textColor="text-blue-700" />
                  <AgeGroup label="18-50 Tahun (Dewasa)" value={45} color="bg-purple-500" bgColor="bg-purple-50" textColor="text-purple-700" />
                  <AgeGroup label="> 50 Tahun (Lansia)" value={15} color="bg-orange-500" bgColor="bg-orange-50" textColor="text-orange-700" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <Card className="rounded-[2rem] shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="font-serif text-2xl">Tingkat Pendidikan</CardTitle>
                <CardDescription>Persentase tingkat pendidikan terakhir penduduk</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-8">
                  {publicData.education.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-gray-700 text-lg">{item.name}</span>
                        <span className="text-2xl font-bold text-primary">{item.value}%</span>
                      </div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           whileInView={{ width: `${item.value}%` }} 
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2rem] shadow-lg border-none overflow-hidden">
                <CardHeader className="bg-gray-50/50">
                  <CardTitle className="font-serif text-2xl">Profesi Penduduk</CardTitle>
                  <CardDescription>Mayoritas penduduk bekerja di sektor Pertanian</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {publicData.jobs.map((job, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-4 h-4 rounded-full shadow-sm ring-4 ring-white" style={{ backgroundColor: job.color }} />
                        <span className="flex-1 text-base font-bold text-gray-700">{job.name}</span>
                        <span className="font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg">{job.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="flex items-center justify-center bg-gray-50/50 rounded-[2rem] border-dashed border-2 border-gray-200">
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PieChart size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Visualisasi Grafik</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Grafik lingkaran interaktif akan ditampilkan di sini menggunakan data real-time dari server.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <Card className="rounded-[2rem] shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-serif text-2xl">Realisasi APB Nagari 2025</CardTitle>
                        <CardDescription>Laporan penyerapan anggaran pembangunan desa</CardDescription>
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm">
                        Tahun Anggaran Berjalan
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-10">
                <BudgetBar label="Bidang Penyelenggaraan Pemerintahan" value={95} color="bg-blue-500" />
                <BudgetBar label="Bidang Pembangunan Desa" value={80} color="bg-green-500" />
                <BudgetBar label="Bidang Pembinaan Kemasyarakatan" value={60} color="bg-orange-500" />
                <BudgetBar label="Bidang Pemberdayaan Masyarakat" value={45} color="bg-purple-500" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description, trend, color, bgColor }: any) {
  return (
    <motion.div 
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden h-full">
        <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center shadow-sm`}>
                <Icon size={28} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">
                <ArrowUpRight size={14} /> {trend}
            </div>
            </div>
            
            <div className="space-y-1">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-serif font-bold text-gray-900">{value}</h2>
                    <span className="text-sm font-medium text-gray-400">{description}</span>
                </div>
            </div>
        </CardContent>
        </Card>
    </motion.div>
  );
}

function AgeGroup({ label, value, color, bgColor, textColor }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-gray-700">{label}</span>
        <span className={`font-bold ${textColor} ${bgColor} px-3 py-1 rounded-lg`}>{value}%</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          whileInView={{ width: `${value}%` }} 
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`} 
        />
      </div>
    </div>
  );
}

function BudgetBar({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-base font-bold text-gray-700">
            <span>{label}</span>
            <span>{value}%</span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
             <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${color} rounded-full relative`}
             >
                <div className="absolute top-0 right-0 h-full w-1 bg-white/30" />
             </motion.div>
            </div>
        </div>
    )
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
    return (
        <TabsTrigger 
            value={value} 
            className="rounded-full px-8 py-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
        >
            {children}
        </TabsTrigger>
    )
}
