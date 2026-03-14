import { motion } from "framer-motion";
import { useState } from "react";
import {
    Map, Navigation, Ruler, Mountain, Users, Building2, Warehouse, GraduationCap, HeartPulse, Store, ChevronRight, Plus, Minus
} from "lucide-react";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNagariStats, useDataOverview } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Monografi() {
    const { data: statsResponse } = useNagariStats();
    const { data: overviewResponse } = useDataOverview();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const overview = overviewResponse?.data;
    const stats = statsResponse?.data;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
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
        { direction: "Barat", value: "Nagari Padang Lawej" },
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 space-y-16">

                {/* Header Title with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12 relative"
                >
                    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tight"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            MONOGRAFI NAGARI
                        </span>
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Data dan profil lengkap wilayah Nagari Muaro dengan informasi geografi, demografi, dan infrastruktur pendukung
                    </motion.p>
                </motion.div>

                {/* Section 1: Identitas & Geografi */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >

                    {/* Identitas Card */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="group h-full"
                        >
                            <Card className="shadow-lg border-0 overflow-hidden h-full bg-white">
                                <motion.div
                                    className="bg-gradient-to-r from-primary/10 to-primary/5 py-4 px-6 border-b border-primary/20 flex items-center gap-3 group-hover:from-primary/20 transition-all duration-300"
                                    whileHover={{ paddingLeft: 24 }}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Map size={24} className="text-primary" />
                                    </motion.div>
                                    <CardTitle className="text-lg text-primary font-bold">Identitas Wilayah</CardTitle>
                                </motion.div>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            {generalData.map((item, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="hover:bg-primary/5 transition-colors group/row border-b"
                                                >
                                                    <TableCell className="text-gray-600 font-medium py-4 px-4">{item.label}</TableCell>
                                                    <TableCell className="text-right font-bold text-gray-900 py-4 px-4 group-hover/row:text-primary transition-colors">{item.value}</TableCell>
                                                </motion.tr>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Tipologi & Batas */}
                    <motion.div
                        className="space-y-6"
                        variants={containerVariants}
                    >
                        {/* Tipologi Card */}
                        <motion.div variants={itemVariants}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group h-full"
                            >
                                <Card className="shadow-lg border-0 overflow-hidden h-full bg-white">
                                    <motion.div
                                        className="bg-gradient-to-r from-green-100 to-green-50 py-4 px-6 border-b border-green-200 flex items-center gap-3 group-hover:from-green-200 transition-all duration-300"
                                        whileHover={{ paddingLeft: 24 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Mountain size={24} className="text-green-700" />
                                        </motion.div>
                                        <CardTitle className="text-lg text-green-700 font-bold">Tipologi & Luas</CardTitle>
                                    </motion.div>
                                    <CardContent className="pt-5 px-6 pb-6">
                                        <div className="space-y-4">
                                            {typologyData.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex justify-between items-center pb-4 border-b border-dashed border-gray-200 last:border-0 last:pb-0 group/item cursor-pointer"
                                                >
                                                    <span className="text-sm font-medium text-gray-700 group-hover/item:text-green-600 transition-colors">{item.label}</span>
                                                    <motion.span
                                                        className="font-bold text-gray-900 bg-green-50 px-3 py-1 rounded-lg group-hover/item:bg-green-100 transition-all"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        {item.value}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Batas Wilayah Card */}
                        <motion.div variants={itemVariants}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                className="group h-full"
                            >
                                <Card className="shadow-lg border-0 overflow-hidden h-full bg-white">
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-100 to-blue-50 py-4 px-6 border-b border-blue-200 flex items-center gap-3 group-hover:from-blue-200 transition-all duration-300"
                                        whileHover={{ paddingLeft: 24 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Ruler size={24} className="text-blue-700" />
                                        </motion.div>
                                        <CardTitle className="text-lg text-blue-700 font-bold">Batas Wilayah</CardTitle>
                                    </motion.div>
                                    <CardContent className="pt-5 px-6 pb-6">
                                        <div className="space-y-3">
                                            {boundariesData.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-all group/item cursor-pointer"
                                                >
                                                    <span className="text-sm font-semibold text-gray-600 w-20 group-hover/item:text-blue-600">{item.direction}</span>
                                                    <motion.span
                                                        className="font-semibold text-gray-900 text-right truncate group-hover/item:text-blue-700"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        {item.value}
                                                    </motion.span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Orbitrasi Card */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="group h-full"
                        >
                            <Card className="shadow-lg border-0 overflow-hidden h-full bg-white">
                                <motion.div
                                    className="bg-gradient-to-r from-orange-100 to-orange-50 py-4 px-6 border-b border-orange-200 flex items-center gap-3 group-hover:from-orange-200 transition-all duration-300"
                                    whileHover={{ paddingLeft: 24 }}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Navigation size={24} className="text-orange-700" />
                                    </motion.div>
                                    <CardTitle className="text-lg text-orange-700 font-bold">Orbitrasi</CardTitle>
                                </motion.div>
                                <CardContent className="pt-5 px-6 pb-6 space-y-4">
                                    {orbitrationData.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-gradient-to-r from-orange-50 to-transparent border border-orange-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all group/item cursor-pointer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <span className="text-sm font-medium text-gray-700 group-hover/item:text-orange-600">{item.label}</span>
                                            <span className="font-bold text-orange-600 bg-white px-3 py-1 rounded-md group-hover/item:bg-orange-100 transition-all">{item.value}</span>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Section 2: Kependudukan (Full Width) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <Card className="shadow-xl border-0 overflow-hidden bg-white">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white p-8"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Users size={32} />
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl font-black">Data Kependudukan</h3>
                                    <p className="text-blue-100 text-sm">Statistik penduduk Nagari Muaro tahun berjalan</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="overflow-x-auto"
                            variants={itemVariants}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-blue-50 to-transparent hover:bg-gradient-to-r hover:from-blue-100 hover:to-transparent">
                                        <TableHead className="w-[40%] text-gray-800 font-bold text-base">Kategori</TableHead>
                                        <TableHead className="text-center text-gray-800 font-bold text-base">Jumlah</TableHead>
                                        <TableHead className="text-center text-gray-800 font-bold text-base">Satuan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {populationData.map((item, idx) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer"
                                        >
                                            <TableCell className="font-semibold text-gray-800 py-5 group-hover:text-blue-600 transition-colors">{item.label}</TableCell>
                                            <TableCell className="text-center font-black text-lg text-gray-900 group-hover:scale-110 transition-transform py-5">{item.value}</TableCell>
                                            <TableCell className="text-center text-gray-600 font-medium py-5">{item.unit}</TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </motion.div>
                    </Card>
                </motion.div>

                {/* Section 3: Sarana Prasarana (Grid) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.h3
                        className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Building2 size={28} />
                        </motion.div>
                        Sarana & Prasarana
                    </motion.h3>
                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                    >
                        <InfraCard
                            title="Kesehatan"
                            icon={HeartPulse}
                            data={infrastructureData.health}
                            color="text-red-600"
                            bgColor="from-red-100 to-red-50"
                            borderColor="border-red-200"
                        />
                        <InfraCard
                            title="Pendidikan"
                            icon={GraduationCap}
                            data={infrastructureData.education}
                            color="text-blue-600"
                            bgColor="from-blue-100 to-blue-50"
                            borderColor="border-blue-200"
                        />
                        <InfraCard
                            title="Ibadah"
                            icon={Building2}
                            data={infrastructureData.worship}
                            color="text-green-600"
                            bgColor="from-green-100 to-green-50"
                            borderColor="border-green-200"
                        />
                        <InfraCard
                            title="Umum & Pasar"
                            icon={Store}
                            data={infrastructureData.public}
                            color="text-orange-600"
                            bgColor="from-orange-100 to-orange-50"
                            borderColor="border-orange-200"
                        />
                    </motion.div>
                </motion.div>

            </div>
            <Footer />
        </div>
    );
}

function InfraCard({ title, icon: Icon, data, color, bgColor, borderColor }: any) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                whileHover={{ y: -8 }}
                className="group h-full cursor-pointer"
            >
                <Card className={`border-0 shadow-lg overflow-hidden h-full bg-white transition-all duration-300 ${borderColor ? 'border-t-4 ' + borderColor.replace('border-', 'border-t-') : ''}`}>
                    <motion.div
                        className={`bg-gradient-to-r ${bgColor} py-5 px-5 border-b border-opacity-30`}
                        whileHover={{ paddingLeft: 24 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className={`p-2 rounded-lg ${bgColor.split('to-')[1] ? 'bg-' + bgColor.split('to-')[1] : 'bg-white/50'}`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Icon size={24} className={color} />
                                </motion.div>
                                <h4 className={`font-black text-base ${color}`}>{title}</h4>
                            </div>
                            <motion.button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`p-2 rounded-lg transition-all ${color} bg-white/30 hover:bg-white/60`}
                                whileHover={{ scale: 1.1 }}
                            >
                                <ChevronRight
                                    size={18}
                                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                />
                            </motion.button>
                        </div>
                    </motion.div>
                    <CardContent className="p-0">
                        <motion.ul
                            className="divide-y divide-gray-100"
                            initial={{ height: "auto" }}
                            animate={{ height: "auto" }}
                        >
                            {data.map((item: any, idx: number) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`flex justify-between items-center p-4 text-sm group/item hover:bg-gray-50/80 transition-all ${idx > 2 && !isExpanded ? 'hidden md:flex' : ''}`}
                                >
                                    <span className="text-gray-700 font-medium group-hover/item:font-bold transition-all">{item.name}</span>
                                    <motion.span
                                        className={`font-black px-2.5 py-1 rounded-lg ${color} bg-white/40 group-hover/item:bg-white/80 transition-all`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {item.value}
                                    </motion.span>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </CardContent>
                    {data.length > 3 && (
                        <motion.div
                            className={`px-4 py-3 text-center border-t text-sm font-semibold transition-all`}
                            style={{ background: `linear-gradient(to right, ${color === 'text-red-600' ? 'rgb(254, 242, 242)' : color === 'text-blue-600' ? 'rgb(239, 246, 255)' : color === 'text-green-600' ? 'rgb(240, 253, 250)' : 'rgb(254, 247, 237)'})` }}
                        >
                            <motion.button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`text-center w-full py-1 ${color} font-bold hover:scale-105 transition-transform`}
                            >
                                {isExpanded ? 'Sembunyikan' : `+${data.length - 3} Lagi`}
                            </motion.button>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </motion.div>
    );
}
