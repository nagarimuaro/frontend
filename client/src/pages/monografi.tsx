
import { motion } from "framer-motion";
import {
    Map, Navigation, Ruler, Mountain, Users, Building2, Warehouse, GraduationCap, HeartPulse, Store
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

    const overview = overviewResponse?.data;
    const stats = statsResponse?.data;

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
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-16 md:pt-32 space-y-8">

                {/* Header Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 border-b-4 border-primary inline-block pb-2">MONOGRAFI NAGARI</h1>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Data dan profil lengkap wilayah Nagari Muaro tahun berjalan.</p>
                </div>

                {/* Section 1: Identitas & Geografi */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Identitas */}
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                            <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                <Map size={20} /> Identitas Wilayah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableBody>
                                    {generalData.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-transparent">
                                            <TableCell className="text-gray-500 font-medium py-3 border-b">{item.label}</TableCell>
                                            <TableCell className="text-right font-bold text-gray-800 py-3 border-b">{item.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Tipologi & Batas */}
                    <div className="space-y-6">
                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-green-50 pb-4 border-b border-green-100">
                                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                                    <Mountain size={20} /> Tipologi & Luas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {typologyData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-dashed border-gray-200 last:border-0 pb-2 last:pb-0">
                                            <span className="text-sm text-gray-600">{item.label}</span>
                                            <span className="font-semibold text-gray-900">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-blue-50 pb-4 border-b border-blue-100">
                                <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                                    <Ruler size={20} /> Batas Wilayah
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 gap-2">
                                    {boundariesData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 w-20">{item.direction}</span>
                                            <span className="font-semibold text-gray-900 truncate">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Orbitrasi */}
                    <Card className="shadow-sm hover:shadow-md transition-shadow h-fit">
                        <CardHeader className="bg-orange-50 pb-4 border-b border-orange-100">
                            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                                <Navigation size={20} /> Orbitrasi (Jarak)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {orbitrationData.map((item, idx) => (
                                <div key={idx} className="bg-white border rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                    <span className="font-bold text-orange-600">{item.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Section 2: Kependudukan (Full Width) */}
                <Card className="shadow-sm overflow-hidden border-t-4 border-t-blue-500">
                    <CardHeader className="bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="text-blue-500" /> Data Kependudukan
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100 hover:bg-gray-100">
                                    <TableHead className="w-[40%] text-gray-700 font-bold">Kategori</TableHead>
                                    <TableHead className="text-center text-gray-700 font-bold">Jumlah</TableHead>
                                    <TableHead className="text-center text-gray-700 font-bold">Satuan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {populationData.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{item.label}</TableCell>
                                        <TableCell className="text-center font-bold text-lg">{item.value}</TableCell>
                                        <TableCell className="text-center text-gray-500">{item.unit}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Section 3: Sarana Prasarana (Grid) */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Building2 className="text-gray-700" /> Sarana & Prasarana
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfraCard title="Kesehatan" icon={HeartPulse} data={infrastructureData.health} color="text-red-600" bgColor="bg-red-50" />
                        <InfraCard title="Pendidikan" icon={GraduationCap} data={infrastructureData.education} color="text-blue-600" bgColor="bg-blue-50" />
                        <InfraCard title="Ibadah" icon={Building2} data={infrastructureData.worship} color="text-green-600" bgColor="bg-green-50" />
                        <InfraCard title="Umum & Pasar" icon={Store} data={infrastructureData.public} color="text-orange-600" bgColor="bg-orange-50" />
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}

function InfraCard({ title, icon: Icon, data, color, bgColor }: any) {
    return (
        <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardHeader className={`${bgColor} py-3 px-4 border-b`}>
                <div className="flex items-center gap-2">
                    <Icon size={18} className={color} />
                    <h4 className={`font-bold text-sm ${color}`}>{title}</h4>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <ul className="divide-y divide-gray-100">
                    {data.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between items-center p-3 text-sm hover:bg-gray-50">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
