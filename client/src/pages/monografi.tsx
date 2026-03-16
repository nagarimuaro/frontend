import { motion } from "framer-motion";
import { useState } from "react";
import {
    Map, Navigation, Ruler, Mountain, Users, Building2, GraduationCap, HeartPulse, Store, ChevronRight
} from "lucide-react";
import {
    Card, CardContent, CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDataOverview } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";

export default function Monografi() {
    const { data: overviewResponse } = useDataOverview();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const overview = overviewResponse?.data;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Data Kependudukan
    const populationData = [
        { label: "Jumlah Penduduk", value: overview?.jumlah_penduduk || "-", unit: "Jiwa" },
        { label: "Laki-laki", value: overview?.jumlah_laki_laki || "-", unit: "Jiwa" },
        { label: "Perempuan", value: overview?.jumlah_perempuan || "-", unit: "Jiwa" },
        { label: "Jumlah Kepala Keluarga", value: overview?.jumlah_kk || "-", unit: "KK" },
    ];

    // Data Statis
    const generalData = [
        { label: "Nama Nagari", value: "MUARO" },
        { label: "Kode Wilayah", value: "0110" },
        { label: "Kode Pos", value: "27513" },
        { label: "Kecamatan", value: "SIJUNJUNG" },
        { label: "Kabupaten", value: "SIJUNJUNG" },
        { label: "Provinsi", value: "SUMATERA BARAT" },
    ];

    const typologyData = [
        { label: "Tipologi", value: "Perladangan & Jasa" },
        { label: "Perkembangan", value: "Swasembada" },
        { label: "Luas Wilayah", value: "5.749 Ha" },
    ];

    const boundariesData = [
        { direction: "Utara", value: "Nagari Silokek" },
        { direction: "Selatan", value: "Nagari Sijunjung" },
        { direction: "Barat", value: "Nagari Padang Laweh" },
        { direction: "Timur", value: "Nagari Aie Angek" },
    ];

    const orbitrationData = [
        { label: "Jarak ke Kecamatan", value: "4 KM" },
        { label: "Jarak ke Kabupaten", value: "0 KM" },
        { label: "Jarak ke Provinsi", value: "100 KM" },
    ];

    const infrastructureData = {
        health: [
            { name: "Puskesmas", value: "1", avail: "Ada" },
            { name: "Pustu", value: "1", avail: "Ada" },
            { name: "Poskesri", value: "2", avail: "Ada" },
            { name: "Posyandu", value: "18", avail: "Ada" },
        ],
        education: [
            { name: "PAUD", value: "11", avail: "Ada" },
            { name: "TK", value: "3", avail: "Ada" },
            { name: "SD", value: "9", avail: "Ada" },
            { name: "SMP", value: "2", avail: "Ada" },
            { name: "SMA/SMK", value: "6", avail: "Ada" },
            { name: "Perguruan Tinggi", value: "2", avail: "Ada" },
        ],
        worship: [
            { name: "Masjid", value: "8", avail: "Ada" },
            { name: "Mushala", value: "31", avail: "Ada" },
        ],
        public: [
            { name: "Olahraga", value: "8", avail: "Ada" },
            { name: "Kesenian", value: "4", avail: "Ada" },
            { name: "Balai Adat", value: "1", avail: "Ada" },
            { name: "Pasar", value: "2", avail: "Ada" },
        ]
    };

    return (
        <PageBackground>
            <Navbar />
            <PageHeader
                title="Monografi Nagari"
                description="Data dan profil lengkap wilayah dengan informasi geografi, demografi, dan infrastruktur pendukung."
                image="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
                
                {/* Section 1: Identitas & Geografi */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    {/* Identitas Card */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="shadow-2xl shadow-black/40 border border-black/5 dark:border-white/10 overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl group hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-colors duration-500">
                            <motion.div
                                className="bg-white/[0.03] py-5 px-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 dark:bg-[#3fd5ba] shadow-[0_0_10px_rgba(63,213,186,0.5)]" />
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-[#3fd5ba] shadow-inner">
                                    <Map size={20} />
                                </div>
                                <CardTitle className="text-lg text-slate-800 dark:text-white font-serif tracking-wide">Identitas Wilayah</CardTitle>
                            </motion.div>
                            <CardContent className="p-0">
                                <Table>
                                    <TableBody>
                                        {generalData.map((item, idx) => (
                                            <TableRow key={idx} className="border-b border-black/5 dark:border-white/5 hover:bg-white/[0.02] transition-colors group/row">
                                                <TableCell className="text-slate-600 dark:text-white/60 font-light py-4 px-6 text-sm">{item.label}</TableCell>
                                                <TableCell className="text-right font-bold text-slate-800 dark:text-white py-4 px-6 group-hover/row:text-teal-600 dark:text-[#3fd5ba] transition-colors">{item.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Tipologi & Batas */}
                    <motion.div className="space-y-6" variants={containerVariants}>
                        {/* Tipologi Card */}
                        <motion.div variants={itemVariants} className="h-[calc(50%-12px)]">
                            <Card className="shadow-2xl shadow-black/40 border border-black/5 dark:border-white/10 overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl group hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-colors duration-500">
                                <div className="bg-white/[0.03] py-4 px-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4 relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                    <Mountain size={18} className="text-blue-400" />
                                    <CardTitle className="text-base text-slate-800 dark:text-white font-serif">Tipologi & Luas</CardTitle>
                                </div>
                                <CardContent className="pt-5 px-6 pb-6 space-y-4">
                                    {typologyData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
                                            <span className="text-sm font-light text-slate-600 dark:text-white/60">{item.label}</span>
                                            <span className="font-bold text-slate-800 dark:text-white text-sm bg-white/[0.05] px-3 py-1 rounded-lg border border-black/5 dark:border-white/10">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Batas Wilayah Card */}
                        <motion.div variants={itemVariants} className="h-[calc(50%-12px)]">
                            <Card className="shadow-2xl shadow-black/40 border border-black/5 dark:border-white/10 overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl group hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-colors duration-500">
                                <div className="bg-white/[0.03] py-4 px-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4 relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                                    <Ruler size={18} className="text-purple-400" />
                                    <CardTitle className="text-base text-slate-800 dark:text-white font-serif">Batas Wilayah</CardTitle>
                                </div>
                                <CardContent className="pt-5 px-6 pb-6 space-y-3">
                                    {boundariesData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <span className="text-xs font-bold text-slate-600 dark:text-white/40 uppercase tracking-widest w-20">{item.direction}</span>
                                            <span className="font-bold text-slate-600 dark:text-white/90 text-right text-sm">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Orbitrasi Card */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="shadow-2xl shadow-black/40 border border-black/5 dark:border-white/10 overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl group hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-colors duration-500">
                            <div className="bg-white/[0.03] py-5 px-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-black/5 dark:border-white/10 flex items-center justify-center text-orange-400 shadow-inner">
                                    <Navigation size={20} />
                                </div>
                                <CardTitle className="text-lg text-slate-800 dark:text-white font-serif tracking-wide">Orbitrasi</CardTitle>
                            </div>
                            <CardContent className="pt-6 px-6 pb-6 space-y-4">
                                {orbitrationData.map((item, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/[0.05] rounded-xl p-4 flex justify-between items-center hover:border-orange-400/30 hover:bg-white/[0.08] transition-all">
                                        <span className="text-sm font-light text-slate-600 dark:text-white/70">{item.label}</span>
                                        <span className="font-bold text-orange-400 text-sm">{item.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Section 2: Kependudukan (Full Width) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <Card className="shadow-2xl shadow-black/50 border border-black/5 dark:border-white/10 overflow-hidden bg-[#0A1A1C]">
                        <motion.div
                            className="bg-gradient-to-r from-[#123136] to-transparent border-b border-black/5 dark:border-white/10 text-slate-800 dark:text-white p-8 lg:p-10 relative overflow-hidden"
                            variants={itemVariants}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[80px]" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="p-4 bg-white/[0.05] border border-black/5 dark:border-white/10 rounded-2xl shadow-inner text-teal-600 dark:text-[#3fd5ba]">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Data Kependudukan</h3>
                                    <p className="text-teal-600/80 dark:text-[#3fd5ba]/80 text-sm font-bold uppercase tracking-widest">Statistik penduduk tahun berjalan</p>
                                </div>
                            </div>
                        </motion.div>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-black/5 dark:border-white/10 hover:bg-transparent">
                                        <TableHead className="w-[40%] text-slate-600 dark:text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] py-5 px-8">Kategori</TableHead>
                                        <TableHead className="text-center text-slate-600 dark:text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] py-5">Jumlah</TableHead>
                                        <TableHead className="text-center text-slate-600 dark:text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] py-5">Satuan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {populationData.map((item, idx) => (
                                        <TableRow key={idx} className="border-b border-black/5 dark:border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="font-light text-slate-600 dark:text-white/90 py-5 px-8 text-base">{item.label}</TableCell>
                                            <TableCell className="text-center font-serif font-bold text-2xl text-teal-600 dark:text-[#3fd5ba] py-5">{item.value}</TableCell>
                                            <TableCell className="text-center text-slate-600 dark:text-white/40 font-bold text-xs uppercase tracking-widest py-5">{item.unit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Section 3: Sarana Prasarana (Grid) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 border border-teal-300 dark:border-[#3fd5ba]/20 bg-teal-600/5 dark:bg-[#3fd5ba]/5 px-4 py-1.5 rounded-full">
                            <Building2 size={14} />
                            <span>Infrastruktur</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white tracking-tight">
                            Sarana & Prasarana
                        </h3>
                    </div>
                    
                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                    >
                        <InfraCard
                            title="Kesehatan"
                            icon={HeartPulse}
                            data={infrastructureData.health}
                            color="text-red-400"
                            shadowGlow="shadow-[0_0_15px_rgba(248,113,113,0.15)]"
                        />
                        <InfraCard
                            title="Pendidikan"
                            icon={GraduationCap}
                            data={infrastructureData.education}
                            color="text-blue-400"
                            shadowGlow="shadow-[0_0_15px_rgba(96,165,250,0.15)]"
                        />
                        <InfraCard
                            title="Ibadah"
                            icon={Building2}
                            data={infrastructureData.worship}
                            color="text-emerald-400"
                            shadowGlow="shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                        />
                        <InfraCard
                            title="Umum & Pasar"
                            icon={Store}
                            data={infrastructureData.public}
                            color="text-orange-400"
                            shadowGlow="shadow-[0_0_15px_rgba(251,146,60,0.15)]"
                        />
                    </motion.div>
                </motion.div>

            </div>
            <Footer />
        </PageBackground>
    );
}

function InfraCard({ title, icon: Icon, data, color, shadowGlow }: any) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Card className={`border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md overflow-hidden h-full hover:border-black/5 dark:border-white/20 transition-all duration-300 ${shadowGlow}`}>
                <div className="bg-white/[0.03] py-5 px-6 border-b border-white/[0.05]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl bg-white/[0.05] border border-black/5 dark:border-white/10 ${color}`}>
                                <Icon size={20} />
                            </div>
                            <h4 className={`font-serif font-bold text-lg text-slate-800 dark:text-white`}>{title}</h4>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-600 dark:text-white/50 hover:text-slate-800 dark:text-white transition-colors border border-black/5 dark:border-white/10"
                        >
                            <ChevronRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                    </div>
                </div>
                <CardContent className="p-0">
                    <ul className="divide-y divide-white/[0.05]">
                        {data.map((item: any, idx: number) => (
                            <li
                                key={idx}
                                className={`flex justify-between items-center p-4 text-sm group/item hover:bg-white/[0.03] transition-colors ${idx > 2 && !isExpanded ? 'hidden md:flex' : ''}`}
                            >
                                <span className="text-slate-600 dark:text-white/70 font-light group-hover/item:text-slate-800 dark:text-white transition-colors">{item.name}</span>
                                <span className={`font-bold px-3 py-1 rounded-lg bg-white/[0.05] border border-black/5 dark:border-white/10 ${color}`}>
                                    {item.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                {data.length > 3 && (
                    <div className="px-4 py-3 text-center border-t border-white/[0.05] bg-white/[0.01]">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-xs uppercase tracking-widest font-bold text-slate-600 dark:text-white/40 hover:text-slate-800 dark:text-white transition-colors md:hidden"
                        >
                            {isExpanded ? 'Sembunyikan' : `+${data.length - 3} Lagi`}
                        </button>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
