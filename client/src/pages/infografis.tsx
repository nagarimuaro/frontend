import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    PiggyBank, Wallet, TrendingUp, ArrowDownRight, Briefcase, Building, Leaf, Users, ShieldAlert, Heart, ChevronDown, Eye
} from "lucide-react";
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Animated Counter Component
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const startTime = Date.now();
        const frames = 60;
        const frameTime = (duration * 1000) / frames;

        const animateCount = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const value = Math.floor(progress * target);

            if (isMounted) {
                setCount(value);
            }

            if (progress < 1) {
                setTimeout(animateCount, frameTime);
            }
        };

        animateCount();
        return () => { isMounted = false; };
    }, [target, duration]);

    return <span>{count.toLocaleString('id-ID')}</span>;
}

export default function Infografis() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    // Data Pendapatan
    const incomeData = [
        { label: "Pendapatan Asli Nagari (PAN)", value: 10100000, percent: 0.30, color: "bg-green-500" },
        { label: "Dana Desa (DD)", value: 1594509000, percent: 47.77, color: "bg-blue-500" },
        { label: "Alokasi Dana Nagari (ADN)", value: 1293623000, percent: 38.75, color: "bg-purple-500" },
        { label: "Bagi Hasil Pajak & Retribusi", value: 125746694, percent: 3.77, color: "bg-orange-500" },
        { label: "Bantuan Keuangan Kab.", value: 300000000, percent: 8.99, color: "bg-teal-500" },
        { label: "Pendapatan Lain-lain", value: 14000000, percent: 0.42, color: "bg-gray-500" },
    ];

    const totalIncome = 3337978694;
    const financing = 300726242.81; // SiLPA
    const totalBelanja = 3638704936.81;

    // Data Belanja
    const expenseData = [
        { name: "Penyelenggaraan Pemerintahan", value: 1313815229.81, percent: 36.12, fill: "#059669" },
        { name: "Pembangunan Nagari", value: 1270441000, percent: 34.91, fill: "#dc2626" },
        { name: "Pembinaan Kemasyarakatan", value: 508460000, percent: 13.97, fill: "#d97706" },
        { name: "Pemberdayaan Masyarakat", value: 430988637, percent: 11.84, fill: "#db2777" },
        { name: "Penanggulangan Bencana", value: 115000000, percent: 3.16, fill: "#2563eb" },
    ];

    const usagePlan = [
        { text: "Penyediaan Operasional Pemerintah Desa", amount: 32898000 },
        { text: "Penyelenggaraan PAUD/TK/TPA/Non-Formal", amount: 109368000 },
        { text: "Penyelenggaraan Posyandu (Makanan Tambahan, dll)", amount: 203320000 },
        { text: "Penyuluhan dan Pelatihan Bidang Kesehatan", amount: 44591000 },
        { text: "Pengasuhan Bersama / Bina Keluarga Balita", amount: 73200000 },
        { text: "Pembangunan/Rehab Sarana Posyandu", amount: 69530000 },
        { text: "Pembangunan/Rehab Jalan Desa", amount: 216047000 },
        { text: "Pembangunan/Rehab Jalan Usaha Tani", amount: 392815000 },
        { text: "Pembangunan/Rehab Gorong-gorong", amount: 11250000 },
        { text: "Rehab Rumah Tidak Layak Huni (GAKIN)", amount: 100000000 },
        { text: "Fasilitas Pengelolaan Sampah", amount: 7000000 },
        { text: "Informasi Publik Desa (Poster/Baliho)", amount: 1920000 },
        { text: "Jaringan/Instalasi Komunikasi Lokal", amount: 10000000 },
        { text: "Ketahanan Pangan (Lumbung Desa)", amount: 204000000 },
        { text: "Teknologi Tepat Guna Pertanian", amount: 127258000 },
        { text: "Pelatihan Pemberdayaan Perempuan", amount: 8193637 },
        { text: "Penanggulangan Bencana", amount: 2000000 },
        { text: "Penanganan Keadaan Darurat", amount: 5000000 },
        { text: "Bantuan Langsung Tunai (BLT)", amount: 108000000 },
    ];

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 space-y-16">

                {/* Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center space-y-4 relative"
                >
                    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10" />
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Infografis APB Nagari 2025
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Transparansi Anggaran Pendapatan dan Belanja Nagari Muaro dengan visualisasi data yang interaktif
                    </motion.p>
                </motion.div>

                {/* Pendapatan Section */}
                <motion.div
                    className="space-y-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="flex items-center gap-3 border-b-2 border-green-500 pb-4"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl text-green-600"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <PiggyBank size={28} />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Pendapatan Nagari</h2>
                            <p className="text-sm text-gray-600">Estimasi penerimaan tahun 2025</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                        variants={containerVariants}
                    >
                        {incomeData.map((item, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <motion.div
                                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    className="group cursor-pointer"
                                >
                                    <Card className="border border-gray-200 bg-white overflow-hidden h-full transition-all duration-300">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex justify-between items-start gap-2">
                                                <span className="text-sm font-semibold text-gray-700 line-clamp-2">{item.label}</span>
                                                <motion.span
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-full text-white whitespace-nowrap ${item.color}`}
                                                    whileHover={{ scale: 1.15 }}
                                                >
                                                    {item.percent}%
                                                </motion.span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-2xl font-black text-gray-900">{formatRupiah(item.value)}</p>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={item.color}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percent * 3.33}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.2, delay: idx * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-8 relative z-10 flex justify-between items-center">
                                        <div>
                                            <p className="opacity-90 font-medium text-green-100 text-sm uppercase tracking-wide mb-2">Total Pendapatan</p>
                                            <p className="text-3xl md:text-4xl font-black">{formatRupiah(totalIncome)}</p>
                                        </div>
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <TrendingUp size={40} className="opacity-40" />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="group"
                            >
                                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-8 relative z-10 flex justify-between items-center">
                                        <div>
                                            <p className="opacity-90 font-medium text-blue-100 text-sm uppercase tracking-wide mb-2">Pembiayaan Netto</p>
                                            <p className="text-3xl md:text-4xl font-black">{formatRupiah(financing)}</p>
                                        </div>
                                        <motion.div
                                            animate={{ y: [0, 10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                        >
                                            <ArrowDownRight size={40} className="opacity-40" />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Belanja Section */}
                <motion.div
                    className="space-y-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="flex items-center gap-3 border-b-2 border-red-500 pb-4"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-xl text-red-600"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Wallet size={28} />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Belanja Nagari</h2>
                            <p className="text-sm text-gray-600">Alokasi pengeluaran anggaran</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="grid lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="shadow-lg border-0 overflow-hidden h-full bg-white">
                                <CardContent className="p-6">
                                    <motion.div
                                        className="h-[320px] w-full mb-6"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expenseData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    animationDuration={800}
                                                >
                                                    {expenseData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} stroke="#fff" />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: number) => formatRupiah(value)}
                                                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #eee', borderRadius: '8px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                    <motion.div
                                        className="text-center border-t pt-6"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        <p className="text-xs text-gray-600 uppercase font-bold tracking-wide mb-2">Total Belanja</p>
                                        <p className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{formatRupiah(totalBelanja)}</p>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            className="lg:col-span-2 grid sm:grid-cols-2 gap-5"
                            variants={containerVariants}
                        >
                            {expenseData.map((item, idx) => (
                                <motion.div key={idx} variants={itemVariants}>
                                    <motion.div
                                        whileHover={{ y: -5, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
                                        className="group"
                                    >
                                        <Card className="border-l-4 shadow-md overflow-hidden cursor-pointer transition-all" style={{ borderLeftColor: item.fill }}>
                                            <CardContent className="p-5 relative">
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundColor: item.fill }} />
                                                <div className="relative z-10">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">{item.name}</p>
                                                    <p className="text-2xl font-black text-gray-900 mb-3">{formatRupiah(item.value)}</p>
                                                    <div className="flex justify-between items-center gap-3">
                                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full rounded-full"
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${item.percent}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1.2, delay: idx * 0.1 }}
                                                                style={{ backgroundColor: item.fill }}
                                                            />
                                                        </div>
                                                        <motion.span
                                                            className="text-sm font-bold px-2 py-1 rounded-md"
                                                            style={{ backgroundColor: item.fill + '20', color: item.fill }}
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            {item.percent}%
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Rencana Penggunaan - Interactive */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <Card className="shadow-xl border-0 overflow-hidden bg-white">
                        <motion.div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-8"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <Briefcase size={28} />
                                </motion.div>
                                <h3 className="text-2xl font-black">Rencana Penggunaan Dana Desa 2025</h3>
                            </div>
                            <p className="text-yellow-100 text-sm">Transparansi pengalokasian Dana Desa untuk kegiatan pemberdayaan masyarakat</p>
                        </motion.div>

                        <CardContent className="p-0">
                            <motion.div
                                className="overflow-x-auto"
                                variants={itemVariants}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                                            <TableHead className="w-[10%] text-center font-bold">No</TableHead>
                                            <TableHead className="w-[60%] font-bold">Program / Kegiatan</TableHead>
                                            <TableHead className="text-right font-bold">Anggaran</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {usagePlan.map((item, idx) => (
                                            <motion.tr
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="border-b border-gray-100 hover:bg-yellow-50/50 transition-all duration-300 group cursor-pointer"
                                            >
                                                <TableCell className="text-center font-semibold text-gray-600 py-3">{String(idx + 1).padStart(2, '0')}</TableCell>
                                                <TableCell className="text-gray-700 font-medium py-3 group-hover:text-yellow-600 transition-colors">{item.text}</TableCell>
                                                <TableCell className="text-right font-bold text-gray-900 py-3 whitespace-nowrap">{formatRupiah(item.amount)}</TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </motion.div>
                        </CardContent>

                        <motion.div
                            className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 md:p-8 border-t-2 border-yellow-200"
                            variants={itemVariants}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="font-bold text-gray-800">Total Penggunaan Dana Desa:</span>
                                <motion.span
                                    className="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"
                                    initial={{ scale: 0.5 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    {formatRupiah(1726390637)}
                                </motion.span>
                            </div>
                        </motion.div>
                    </Card>
                </motion.div>

            </div>
            <Footer />
        </div>
    );
}
