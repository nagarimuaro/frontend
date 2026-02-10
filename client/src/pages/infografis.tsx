
import { motion } from "framer-motion";
import {
    PiggyBank, Wallet, TrendingUp, ArrowDownRight, Briefcase, Building, Leaf, Users, ShieldAlert, Heart
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function Infografis() {

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

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 space-y-12">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Infografis APB Nagari 2025</h1>
                    <p className="text-gray-500 font-medium text-sm md:text-base">Transparansi Anggaran Pendapatan dan Belanja Nagari Muaro</p>
                </div>

                {/* Pendapatan */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-700">
                            <PiggyBank size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Pendapatan Nagari</h2>
                            <p className="text-sm text-gray-500">Estimasi penerimaan tahun 2025</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {incomeData.map((item, idx) => (
                            <Card key={idx} className="border shadow-sm">
                                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-gray-600 line-clamp-2">{item.label}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${item.color.replace('bg-', 'bg-')}`}>{item.percent}%</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{formatRupiah(item.value)}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-green-600 text-white border-none shadow-md">
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="opacity-90 font-medium">Total Pendapatan</p>
                                    <p className="text-2xl md:text-3xl font-bold">{formatRupiah(totalIncome)}</p>
                                </div>
                                <TrendingUp size={32} className="opacity-50" />
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-600 text-white border-none shadow-md">
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="opacity-90 font-medium">Pembiayaan Netto (SiLPA)</p>
                                    <p className="text-2xl md:text-3xl font-bold">{formatRupiah(financing)}</p>
                                </div>
                                <ArrowDownRight size={32} className="opacity-50" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Belanja */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-red-100 rounded-lg text-red-700">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Belanja Nagari</h2>
                            <p className="text-sm text-gray-500">Alokasi pengeluaran anggaran</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-1 shadow-sm border h-fit">
                            <CardContent className="p-4">
                                <div className="h-[300px] w-full">
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
                                            >
                                                {expenseData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value: number) => formatRupiah(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-center border-t pt-4">
                                    <p className="text-sm text-gray-500 uppercase font-bold">Total Belanja</p>
                                    <p className="text-xl font-bold text-gray-900">{formatRupiah(totalBelanja)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                            {expenseData.map((item, idx) => (
                                <Card key={idx} className="shadow-sm border border-l-4" style={{ borderLeftColor: item.fill }}>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-gray-500 font-medium mb-1">{item.name}</p>
                                        <p className="text-lg font-bold text-gray-900">{formatRupiah(item.value)}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="h-1.5 w-2/3 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.fill }} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{item.percent}%</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rencana Penggunaan - List View */}
                <Card className="shadow-md border-t-4 border-t-yellow-500">
                    <CardHeader className="bg-yellow-50">
                        <CardTitle className="text-yellow-800 text-lg md:text-xl">Rencana Penggunaan Dana Desa 2025</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[10%] text-center">No</TableHead>
                                        <TableHead className="w-[60%]">Program / Kegiatan</TableHead>
                                        <TableHead className="text-right">Anggaran</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usagePlan.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-yellow-50/30">
                                            <TableCell className="text-center font-medium text-gray-500">{idx + 1}</TableCell>
                                            <TableCell className="text-gray-700 font-medium">{item.text}</TableCell>
                                            <TableCell className="text-right font-bold text-gray-900 whitespace-nowrap">{formatRupiah(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="bg-yellow-100 p-4 text-center md:text-right">
                            <span className="font-bold text-yellow-800 mr-4">Total Penggunaan:</span>
                            <span className="font-black text-yellow-900 text-lg md:text-xl">{formatRupiah(1726390637)}</span>
                        </div>
                    </CardContent>
                </Card>

            </div>
            <Footer />
        </div>
    );
}
