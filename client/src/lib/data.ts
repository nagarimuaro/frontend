
import { 
  Users, Map, Calendar, Mountain, Wallet, Building2, 
  FileText, ShoppingBag, Phone, Mail, MapPin, Facebook, Instagram, Youtube,
  File, Download, Search, Filter, ChevronRight, Clock, Info, CheckCircle2,
  AlertCircle, BarChart3, PieChart, TrendingUp, Layers, HardHat
} from "lucide-react";

import heroBg from "@assets/generated_images/hero_background_of_nagari_sungai_pinang.png";
import headPhoto from "@assets/generated_images/portrait_of_nagari_head.png";
import newsPhoto from "@assets/generated_images/community_meeting_for_news_section.png";
import umkmPhoto from "@assets/generated_images/traditional_woven_fabric_for_umkm.png";

// Import new images (using placeholders until generated)
// Ideally we would import the newly generated images here once the tool returns them
// For now we will use placeholders or the existing ones where appropriate

export const siteConfig = {
  name: "Portal Nagari Sungai Pinang",
  tagline: "Membangun Nagari Yang Maju dan Sejahtera",
  description: "Website resmi Pemerintah Nagari Sungai Pinang, Kabupaten Pasaman Barat.",
  contact: {
    address: "Jl. Raya Sungai Pinang, Kabupaten Pasaman Barat, Sumatera Barat",
    email: "info@sungaipinang.id",
    phone: "+62 756 123456",
    whatsapp: "+62 812 3456 7890",
    social: {
      facebook: "https://facebook.com/nagarisungaipinang",
      instagram: "https://instagram.com/nagarisungaipinang",
      youtube: "https://youtube.com/@nagarisungaipinang"
    }
  }
};

export const heroBanners = [
  {
    title: "Selamat Datang di Portal Nagari Sungai Pinang",
    subtitle: "Membangun Nagari Yang Maju dan Sejahtera",
    buttonText: "Pelajari Lebih Lanjut",
    buttonUrl: "/profil",
    image: heroBg,
    overlayColor: "rgba(0,0,0,0.5)"
  },
  {
    title: "Pelayanan Publik Terdepan",
    subtitle: "Melayani Dengan Sepenuh Hati untuk Kesejahteraan Masyarakat",
    buttonText: "Lihat Layanan",
    buttonUrl: "/layanan",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2000&auto=format&fit=crop",
    overlayColor: "rgba(0,0,0,0.5)"
  }
];

export const statistics = [
  { label: "Penduduk", value: "3,542", icon: Users, suffix: "Jiwa" },
  { label: "Luas Wilayah", value: "12.5", icon: Map, suffix: "km²" },
  { label: "Tahun Berdiri", value: "2001", icon: Calendar, suffix: "" },
  { label: "Ketinggian", value: "450", icon: Mountain, suffix: "mdpl" },
  { label: "Dana Desa", value: "1.2", icon: Wallet, suffix: "M" },
  { label: "Fasilitas", value: "15", icon: Building2, suffix: "Unit" },
];

export const services = [
  {
    id: 1,
    name: "Surat Keterangan Domisili",
    slug: "surat-keterangan-domisili",
    description: "Pelayanan pembuatan surat keterangan domisili untuk berbagai keperluan administrasi.",
    estimatedTime: "1-2 hari kerja",
    fee: "Gratis",
    requirements: [
      "Scan KTP Asli",
      "Scan KK Asli",
      "Surat Pengantar RT/RW"
    ],
    icon: FileText
  },
  {
    id: 2,
    name: "Surat Keterangan Tidak Mampu",
    slug: "surat-keterangan-tidak-mampu",
    description: "Pelayanan pembuatan surat keterangan tidak mampu untuk keperluan beasiswa dan bantuan sosial.",
    estimatedTime: "3-5 hari kerja",
    fee: "Gratis",
    requirements: [
      "Scan KTP Asli",
      "Scan KK Asli",
      "Foto Rumah (Depan, Samping, Dalam)"
    ],
    icon: FileText
  },
  {
    id: 3,
    name: "Surat Pengantar Nikah",
    slug: "surat-pengantar-nikah",
    description: "Layanan administrasi pengantar nikah untuk KUA.",
    estimatedTime: "1 hari kerja",
    fee: "Gratis",
    requirements: [
      "Fotocopy KTP Calon Suami & Istri",
      "Fotocopy KK Calon Suami & Istri",
      "Pas Foto 2x3 (3 lembar)"
    ],
    icon: Users
  },
  {
    id: 4,
    name: "Surat Izin Usaha Mikro",
    slug: "surat-izin-usaha",
    description: "Pembuatan surat keterangan usaha untuk UMKM.",
    estimatedTime: "2-3 hari kerja",
    fee: "Gratis",
    requirements: [
      "Scan KTP Pemilik Usaha",
      "Foto Lokasi Usaha",
      "Surat Pengantar Jorong"
    ],
    icon: ShoppingBag
  }
];

export const news = [
  {
    id: 1,
    title: "Musyawarah Nagari Pembahasan RPJM Nagari 2024-2030",
    slug: "musyawarah-nagari-pembahasan-rpjm-nagari-2024-2030",
    excerpt: "Wali Nagari Sungai Pinang menggelar Musyawarah Nagari untuk membahas Rencana Pembangunan Jangka Menengah Nagari periode 2024-2030.",
    content: "<p>Pada hari Sabtu, 15 September 2024, Wali Nagari Sungai Pinang menggelar Musyawarah Nagari yang dihadiri oleh seluruh perangkat nagari, ninik mamak, dan perwakilan masyarakat. Agenda utama adalah pembahasan draft RPJM Nagari 2024-2030 yang akan menjadi panduan pembangunan nagari selama 6 tahun ke depan.</p><p>Dalam sambutannya, Wali Nagari menekankan pentingnya partisipasi masyarakat dalam perencanaan pembangunan agar program yang dijalankan benar-benar sesuai dengan kebutuhan riil di lapangan.</p>",
    category: "Pembangunan",
    categoryColor: "#3B82F6",
    date: "29 Nov 2025",
    author: "Admin Nagari",
    image: newsPhoto,
    isFeatured: true,
    isUrgent: false
  },
  {
    id: 2,
    title: "Pembangunan Jalan Nagari Tahap II Dimulai",
    slug: "pembangunan-jalan-nagari-tahap-ii-dimulai",
    excerpt: "Proyek pembangunan jalan nagari tahap II telah dimulai untuk meningkatkan aksesibilitas pertanian.",
    content: "<p>Pemerintah Nagari Sungai Pinang secara resmi memulai pembangunan jalan usaha tani tahap II. Proyek ini menghubungkan area persawahan di Jorong Timur dengan jalan utama nagari.</p><p>Diharapkan dengan adanya jalan ini, biaya angkut hasil panen petani dapat ditekan sehingga pendapatan petani meningkat.</p>",
    category: "Pembangunan",
    categoryColor: "#3B82F6",
    date: "26 Nov 2025",
    author: "Tim Pembangunan",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isUrgent: false
  },
  {
    id: 3,
    title: "Pelatihan Digital Marketing untuk UMKM",
    slug: "pelatihan-digital-marketing-umkm",
    excerpt: "Pemuda nagari mengadakan pelatihan pemasaran digital bagi pelaku usaha mikro.",
    content: "<p>Karang Taruna Nagari Sungai Pinang bekerja sama dengan Dinas Koperindag mengadakan pelatihan digital marketing. Pelatihan ini diikuti oleh 30 pelaku UMKM di nagari.</p>",
    category: "Ekonomi",
    categoryColor: "#10B981",
    date: "20 Nov 2025",
    author: "Karang Taruna",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isUrgent: false
  },
  {
    id: 4,
    title: "Penyaluran BLT Dana Desa Bulan November",
    slug: "penyaluran-blt-dana-desa-november",
    excerpt: "Pemerintah Nagari menyalurkan Bantuan Langsung Tunai (BLT) kepada 50 KPM.",
    content: "<p>Penyaluran BLT Dana Desa bulan November berjalan lancar di Aula Kantor Wali Nagari.</p>",
    category: "Sosial",
    categoryColor: "#F59E0B",
    date: "15 Nov 2025",
    author: "Kasi Kesejahteraan",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isUrgent: false
  },
  {
    id: 5,
    title: "Waspada Demam Berdarah di Musim Hujan",
    slug: "waspada-demam-berdarah",
    excerpt: "Masyarakat dihimbau untuk menjaga kebersihan lingkungan dan melakukan 3M plus.",
    content: "<p>Menghadapi musim penghujan, Wali Nagari mengeluarkan himbauan agar masyarakat aktif melakukan Pemberantasan Sarang Nyamuk (PSN).</p>",
    category: "Kesehatan",
    categoryColor: "#EF4444",
    date: "10 Nov 2025",
    author: "Bidan Desa",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isUrgent: true
  }
];

export const umkm = [
  {
    id: 1,
    name: "Songket Sungai Pinang",
    category: "Kerajinan",
    description: "Kain tenun songket berkualitas tinggi dengan motif khas daerah. Dibuat dengan alat tenun tradisional oleh pengrajin berpengalaman.",
    price: "Rp 1.500.000",
    image: umkmPhoto,
    contact: "0812-3456-7890",
    location: "Jorong Tengah"
  },
  {
    id: 2,
    name: "Kopi Robusta Pinang",
    category: "Kuliner",
    description: "Biji kopi robusta pilihan yang dipetik dari dataran tinggi Sungai Pinang. Memiliki cita rasa kuat dan aroma yang khas.",
    price: "Rp 45.000 / 250gr",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
    contact: "0813-4567-8901",
    location: "Jorong Bukit"
  },
  {
    id: 3,
    name: "Keripik Sanjai Balado",
    category: "Kuliner",
    description: "Oleh-oleh khas yang renyah dengan bumbu balado pedas manis. Tanpa bahan pengawet.",
    price: "Rp 15.000 / bungkus",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
    contact: "0821-5678-9012",
    location: "Jorong Pasar"
  },
  {
    id: 4,
    name: "Anyaman Bambu Kreatif",
    category: "Kerajinan",
    description: "Berbagai produk anyaman bambu seperti tas, topi, dan wadah serbaguna. Ramah lingkungan dan estetik.",
    price: "Mulai Rp 25.000",
    image: "https://images.unsplash.com/photo-1519219356345-77984428383f?q=80&w=800&auto=format&fit=crop",
    contact: "0852-6789-0123",
    location: "Jorong Hilir"
  }
];

export const staff = [
  {
    id: 1,
    name: "H. Ahmad Syukri, S.Sos",
    position: "Wali Nagari",
    department: "Pemerintahan",
    photo: headPhoto,
    isLeadership: true
  },
  {
    id: 2,
    name: "Drs. Bambang Sutrisno",
    position: "Sekretaris Nagari",
    department: "Sekretariat",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    isLeadership: true
  },
  {
    id: 3,
    name: "Siti Aminah, S.Pd",
    position: "Kasi Pemerintahan",
    department: "Pemerintahan",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    isLeadership: false
  },
  {
    id: 4,
    name: "Rudi Hartono, SE",
    position: "Kaur Keuangan",
    department: "Keuangan",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    isLeadership: false
  }
];

export const documents = [
  {
    id: 1,
    title: "Peraturan Nagari No. 1 Tahun 2024",
    category: "Peraturan Nagari",
    year: 2024,
    size: "2.4 MB",
    type: "PDF",
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Profil Nagari Sungai Pinang 2024",
    category: "Profil",
    year: 2024,
    size: "5.1 MB",
    type: "PDF",
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Laporan Realisasi APB Nagari 2023",
    category: "Transparansi Anggaran",
    year: 2023,
    size: "1.8 MB",
    type: "PDF",
    downloadUrl: "#"
  },
  {
    id: 4,
    title: "RPJM Nagari 2019-2025",
    category: "Perencanaan",
    year: 2019,
    size: "8.5 MB",
    type: "PDF",
    downloadUrl: "#"
  }
];

export const projects = [
  {
    id: 1,
    title: "Pembangunan Jalan Usaha Tani Jorong Timur",
    location: "Jorong Timur",
    budget: "Rp 150.000.000",
    progress: 75,
    status: "Sedang Berjalan",
    year: 2025,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Rehabilitasi Posyandu Mawar",
    location: "Jorong Tengah",
    budget: "Rp 45.000.000",
    progress: 100,
    status: "Selesai",
    year: 2024,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pembangunan Saluran Irigasi Tersier",
    location: "Jorong Hilir",
    budget: "Rp 85.000.000",
    progress: 30,
    status: "Sedang Berjalan",
    year: 2025,
    image: "https://images.unsplash.com/photo-1596627008709-32247dc2e08c?q=80&w=800&auto=format&fit=crop"
  }
];

export const facilities = [
  {
    id: 1,
    name: "Masjid Raya Sungai Pinang",
    category: "Ibadah",
    address: "Jl. Utama No. 1",
    image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "SDN 01 Sungai Pinang",
    category: "Pendidikan",
    address: "Jl. Pendidikan No. 5",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Puskesmas Pembantu",
    category: "Kesehatan",
    address: "Jl. Kesehatan No. 2",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Air Terjun Lubuk Bulan",
    category: "Wisata",
    address: "Kawasan Hutan Lindung",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800&auto=format&fit=crop"
  }
];

export const publicData = {
  population: {
    total: 3542,
    male: 1750,
    female: 1792,
    families: 890
  },
  jobs: [
    { name: "Petani", value: 65, color: "#10B981" },
    { name: "Pedagang", value: 15, color: "#F59E0B" },
    { name: "PNS/TNI/Polri", value: 5, color: "#3B82F6" },
    { name: "Lainnya", value: 15, color: "#6B7280" }
  ],
  education: [
    { name: "SD", value: 30 },
    { name: "SMP", value: 25 },
    { name: "SMA", value: 35 },
    { name: "Perguruan Tinggi", value: 10 }
  ]
};
