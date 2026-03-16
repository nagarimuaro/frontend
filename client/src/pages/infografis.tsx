import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    PiggyBank, Wallet, TrendingUp, ArrowDownRight, Briefcase, Leaf
} from "lucide-react";
import {
    Card, CardContent
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { PUBLIC_API } from "@/lib/api/endpoints";

export default function Infografis() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [activeYear, setActiveYear] = useState<number | null>(null);

    const fetchFinances = async (year?: number) => {
        try {
            setLoading(true);
            const tenantDomain = window.location.hostname;
            const yearParam = year ? `?year=${year}` : '';
            const response = await fetch(`${PUBLIC_API.KEUANGAN}${yearParam}`, {
                headers: { 'X-Tenant-Domain': tenantDomain }
            });
            const result = await response.json();
            if (result.status === 'success' && result.data) {
                setData(result.data);
                setAvailableYears(result.data.availableYears || []);
                setActiveYear(result.data.activeYear || null);
                if (!year) {
                    setSelectedYear(result.data.year);
                }
            }
        } catch (error) {
            console.error("Failed to fetch Keuangan data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinances();
    }, []);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        fetchFinances(year);
    };

    const incomeData = data?.incomeData || [];
    const totalIncome = data?.totalIncome || 0;
    const financing = data?.financing || 0; 
    const totalBelanja = data?.totalBelanja || 0;
    
    const expenseData = data?.expenseData || [];
    const usagePlan = data?.usagePlan || [];
    const totalUsagePlan = data?.totalUsagePlan || 0;
    const year = data?.year || selectedYear || new Date().getFullYear();

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
    };

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (loading) {
        return (
            <PageBackground>
                <Navbar />
                <div className="flex items-center justify-center py-32 space-x-3 min-h-screen">
                    <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
                    <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat APB...</span>
                </div>
                <Footer />
            </PageBackground>
        );
    }

    return (
        <PageBackground>
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 space-y-24">

                {/* Header with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center space-y-6 relative"
                >
                    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#3fd5ba]/[0.05] to-transparent rounded-full blur-[100px] -z-10" />
                    
                    <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.15)] mx-auto">
                        <TrendingUp size={14} />
                        <span>Transparansi Anggaran</span>
                    </div>

                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-slate-800 dark:text-white tracking-tight leading-[1.1]"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Infografis APB <br /><span className="text-teal-600 dark:text-[#3fd5ba] drop-shadow-[0_0_20px_rgba(63,213,186,0.3)]">Tahun {year}</span>
                    </motion.h1>

                    {/* Year Selector */}
                    {availableYears.length > 1 && (
                        <motion.div
                            className="flex justify-center pt-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-teal-300 dark:border-[#3fd5ba]/20 rounded-full px-6 py-3 shadow-[0_0_20px_rgba(63,213,186,0.1)]">
                                <span className="text-xs font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Tahun Anggaran:</span>
                                <div className="flex gap-2">
                                    {availableYears.map((y: number) => (
                                        <button
                                            key={y}
                                            onClick={() => handleYearChange(y)}
                                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                                selectedYear === y
                                                    ? 'bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] shadow-[0_0_15px_rgba(63,213,186,0.4)] scale-105'
                                                    : 'bg-white/5 text-slate-600 dark:text-white/70 hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-teal-300 dark:border-[#3fd5ba]/30 hover:text-teal-600 dark:text-[#3fd5ba]'
                                            }`}
                                        >
                                            {y}{activeYear === y ? ' ★' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Pendapatan Section */}
                <motion.div
                    className="space-y-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="flex flex-col md:flex-row md:items-center gap-6 border-b pb-8 border-black/5 dark:border-white/10"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-5 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-2xl text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_20px_rgba(63,213,186,0.15)] shrink-0"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <PiggyBank size={36} strokeWidth={2} />
                        </motion.div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white tracking-tight mb-2">Pendapatan Nagari</h2>
                            <p className="text-sm text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-widest mb-3">Estimasi penerimaan tahun {year}</p>
                            <p className="text-sm text-slate-600 dark:text-white/60 max-w-3xl leading-relaxed font-light">
                                Pendapatan Nagari bersumber dari Dana Desa (Pusat), Alokasi Dana Nagari (Daerah), Bagi Hasil Pajak, Bantuan Keuangan, serta Pendapatan Asli Nagari (PAN).
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incomeData.map((item: any, idx: number) => {
                            const colors = (() => {
                                switch (item.color) {
                                    case 'bg-green-500': return { fill: 'bg-teal-500 dark:bg-[#3fd5ba]', glow: 'shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]' };
                                    case 'bg-blue-500': return { fill: 'bg-[#60A5FA]', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' };
                                    case 'bg-purple-500': return { fill: 'bg-[#c084fc]', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' };
                                    case 'bg-orange-500': return { fill: 'bg-[#fb923c]', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]' };
                                    case 'bg-teal-500': return { fill: 'bg-[#2Dd4bF]', glow: 'shadow-[0_0_15px_rgba(45,212,191,0.3)]' };
                                    case 'bg-gray-500': return { fill: 'bg-[#94a3b8]', glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]' };
                                    default: return { fill: item.color, glow: '' };
                                }
                            })();
                            
                            // Map the raw tailwind classes back to hex for inline style if needed, or just use the utility mapped.
                            // To be safe with framer motion width animation dynamically, we'll keep the bg-class and let tailwind handle it.
                            
                            return (
                            <motion.div 
                                key={idx} 
                                variants={itemVariants}
                            >
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group cursor-pointer h-full"
                                >
                                    <div className="relative h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-teal-300 dark:border-[#3fd5ba]/30">
                                        <div className="p-6 md:p-8 space-y-6 relative z-10">
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-sm font-bold text-slate-600 dark:text-white/80 leading-snug line-clamp-2">{item.label}</h3>
                                                <motion.span
                                                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white dark:text-[#0a1a1c] whitespace-nowrap ${colors.fill} ${colors.glow}`}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {item.percent}%
                                                </motion.span>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{formatRupiah(item.value)}</p>
                                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full ${colors.fill} ${colors.glow}`}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.percent * 3.33}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.2, delay: idx * 0.1, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <motion.div variants={itemVariants}>
                            <motion.div whileHover={{ y: -8, scale: 1.01 }} className="group h-full relative">
                                <Card className="bg-[#123136]/80 text-slate-800 dark:text-white border-black/5 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-3xl overflow-hidden h-full relative group-hover:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[60px] group-hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 transition-all duration-500" />
                                    <CardContent className="p-8 relative z-10 flex justify-between items-center h-full">
                                        <div className="space-y-3">
                                            <p className="text-teal-600 dark:text-[#3fd5ba] text-[10px] font-bold uppercase tracking-[0.2em]">Total Pendapatan</p>
                                            <p className="text-4xl lg:text-5xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{formatRupiah(totalIncome)}</p>
                                        </div>
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="bg-white/5 border border-black/5 dark:border-white/10 p-5 rounded-2xl backdrop-blur-md hidden sm:block shadow-[0_0_20px_rgba(63,213,186,0.1)]"
                                        >
                                            <TrendingUp size={40} className="text-teal-600 dark:text-[#3fd5ba]" strokeWidth={2} />
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.div whileHover={{ y: -8, scale: 1.01 }} className="group h-full relative">
                                <Card className="bg-[#17233B]/80 text-slate-800 dark:text-white border-black/5 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-3xl overflow-hidden h-full relative group-hover:border-[#60A5FA]/50 transition-colors">
                                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#60A5FA]/10 rounded-full blur-[60px] group-hover:bg-[#60A5FA]/20 transition-all duration-500" />
                                    <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3">
                                                <p className="text-[#60A5FA] text-[10px] font-bold uppercase tracking-[0.2em]">Pembiayaan Netto</p>
                                                <p className="text-4xl lg:text-5xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{formatRupiah(financing)}</p>
                                            </div>
                                            <motion.div
                                                animate={{ y: [0, 10, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                                                className="bg-white/5 border border-black/5 dark:border-white/10 p-5 rounded-2xl backdrop-blur-md hidden sm:block shadow-[0_0_20px_rgba(96,165,250,0.1)]"
                                            >
                                                <ArrowDownRight size={40} className="text-[#60A5FA]" strokeWidth={2} />
                                            </motion.div>
                                        </div>
                                        <p className="text-slate-600 dark:text-white/40 text-xs mt-6 font-light leading-relaxed">
                                            Berasal dari SiLPA (Sisa Lebih Perhitungan Anggaran) tahun sebelumnya dikurangi pengeluaran pembiayaan.
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Belanja Section */}
                <motion.div
                    className="space-y-8 mt-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="flex flex-col md:flex-row md:items-center gap-6 border-b pb-8 border-black/5 dark:border-white/10"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="p-5 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)] shrink-0"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Wallet size={36} strokeWidth={2} />
                        </motion.div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white tracking-tight mb-2">Belanja Nagari</h2>
                            <p className="text-sm text-rose-500 font-bold uppercase tracking-widest">Alokasi pengeluaran anggaran</p>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <motion.div 
                            className="lg:col-span-1"
                            variants={itemVariants}
                        >
                            <Card className="shadow-2xl shadow-black/40 border border-black/5 dark:border-white/10 overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl rounded-3xl relative">
                                <CardContent className="p-8 flex flex-col h-full justify-between">
                                    <motion.div
                                        className="h-[300px] w-full mb-8 relative"
                                        initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, type: "spring" }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-36 h-36 bg-slate-50/90 dark:bg-[#0a1a1c]/80 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(244,63,94,0.2)] flex items-center justify-center flex-col z-10 px-3 text-center border border-rose-500/20">
                                                <span className="text-[10px] font-bold text-slate-600 dark:text-white/50 tracking-[0.2em] mb-1 uppercase">Total</span>
                                                <span className="text-sm sm:text-base font-black text-rose-500 tracking-tighter">{formatRupiah(totalBelanja).replace('Rp', '').trim()}</span>
                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={expenseData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={115}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    stroke="rgba(255,255,255,0.05)"
                                                    animationDuration={1500}
                                                >
                                                    {expenseData.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={1} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: number) => formatRupiah(value)}
                                                    contentStyle={{ backgroundColor: 'rgba(10, 26, 28, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </motion.div>
                                    
                                    <motion.div
                                        className="text-center bg-white/[0.03] border border-black/5 dark:border-white/5 p-6 rounded-2xl"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                        <p className="text-[10px] text-slate-600 dark:text-white/50 uppercase font-black tracking-[0.2em] mb-2">Total Anggaran Belanja</p>
                                        <p className="text-3xl font-black text-rose-500 tracking-tighter drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">{formatRupiah(totalBelanja)}</p>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
                            {expenseData.map((item: any, idx: number) => (
                                <motion.div 
                                    key={idx} 
                                    className="h-full"
                                    variants={itemVariants}
                                >
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        className="group h-full"
                                    >
                                        <div className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg rounded-2xl overflow-hidden relative transition-all duration-300 group-hover:border-rose-500/30 h-full flex flex-col">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: item.fill, boxShadow: `0 0 10px ${item.fill}` }} />
                                            <div className="p-6 pl-8 relative z-10 flex flex-col flex-grow justify-between">
                                                <div className="mb-6">
                                                    <p className="text-xs font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest mb-2 leading-snug">{item.name}</p>
                                                    <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{formatRupiah(item.value)}</p>
                                                </div>
                                                <div className="flex justify-between items-center gap-4 mt-auto">
                                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${item.percent}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1.5, delay: idx * 0.15, type: 'spring' }}
                                                            style={{ backgroundColor: item.fill, boxShadow: `0 0 10px ${item.fill}` }}
                                                        />
                                                    </div>
                                                    <motion.span
                                                        className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-black/5 dark:border-white/10"
                                                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: item.fill }}
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {item.percent}%
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Rencana Penggunaan - Interactive */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#fb923c]/10 rounded-3xl blur-[80px] group-hover:bg-[#fb923c]/20 transition-colors duration-500" />
                        <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/10 overflow-hidden bg-[#0A1A1C] rounded-3xl relative z-10">
                            <motion.div
                                className="bg-gradient-to-r from-[#2a1608] to-[#1a0e05] border-b border-orange-500/20 text-slate-800 dark:text-white p-8 lg:p-10 relative overflow-hidden"
                                variants={itemVariants}
                            >
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[60px]" />
                                
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                    <motion.div
                                        className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)] shrink-0 self-start md:self-center"
                                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Briefcase size={36} className="text-orange-500" strokeWidth={2} />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold tracking-tight text-slate-800 dark:text-white mb-2">Rencana Penggunaan Dana Desa {year}</h3>
                                        <p className="text-orange-500/80 font-bold text-[10px] tracking-[0.2em] uppercase">Transparansi pengalokasian Dana Desa prioritas nagari</p>
                                    </div>
                                </div>
                            </motion.div>

                            <CardContent className="p-0">
                                <motion.div
                                    className="overflow-x-auto"
                                    variants={itemVariants}
                                >
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow className="border-b border-black/5 dark:border-white/10 hover:bg-transparent">
                                                <TableHead className="w-[10%] text-center font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] text-[10px] py-5">No</TableHead>
                                                <TableHead className="w-[60%] font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] text-[10px] py-5">Program / Kegiatan Prioritas</TableHead>
                                                <TableHead className="text-right font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] text-[10px] py-5 pr-8">Alokasi Anggaran</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {usagePlan.map((item: any, idx: number) => (
                                                <TableRow
                                                    key={idx}
                                                    className="border-b border-black/5 dark:border-white/5 hover:bg-white/[0.02] transition-colors group"
                                                >
                                                    <TableCell className="text-center font-bold text-teal-600 dark:text-[#3fd5ba] py-6">
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <span className="text-slate-600 dark:text-white/80 font-light group-hover:text-slate-800 dark:text-white transition-colors text-base">{item.text}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right py-6 pr-8">
                                                        <span className="font-bold text-slate-800 dark:text-white bg-white/[0.05] border border-black/5 dark:border-white/10 px-4 py-2 rounded-lg group-hover:border-orange-500/50 group-hover:text-orange-400 transition-colors tracking-tight">
                                                            {formatRupiah(item.amount)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </motion.div>
                            </CardContent>

                            <motion.div
                                className="bg-white dark:bg-[#0b2023] p-8 lg:p-10 border-t border-orange-500/20"
                                variants={itemVariants}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                                            <Leaf size={20} strokeWidth={2} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-[0.2em]">Total Dana Desa:</span>
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span className="text-4xl md:text-5xl font-serif font-black text-orange-500 tracking-tighter drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                            {formatRupiah(totalUsagePlan)}
                                        </span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </Card>
                    </div>
                </motion.div>

            </div>
            <Footer />
        </PageBackground>
    );
}
