// API Types for all endpoints

// CMS API Types
export interface SiteSettings {
  tenant_name?: string;
  nama_nagari?: string;
  kabupaten?: string;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  whatsapp?: string;
  seo_keywords: string;
  seo_meta_description: string;
  seo_meta_title: string;
  site_description: string;
  site_favicon: string;
  site_logo: string;
  site_name: string;
  site_tagline: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
}

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobile_image: string;
  button_text: string;
  button_url: string;
  button_target: string;
  overlay_color: string;
  text_position: string;
  text_align: string;
  is_active: boolean;
  sort_order: number;
  image_url: string;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string;
  type: string;
  sort_order: number;
  is_active: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: number;
  author_id: number;
  status: string;
  is_featured: boolean;
  is_urgent: boolean;
  allow_comments: boolean;
  published_at: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  category: NewsCategory;
  // Additional optional fields
  image?: string;
  featured_image?: string;
  author?: string | { id: number; name: string };
  tags?: string[];
  read_time?: string;
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
    has_more: boolean;
  };
  message: string;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  estimated_time: string;
  fee: string;
  contact_info: string;
  sort_order: number;
  featured_image: string;
  icon?: string | null;
  form_url?: string | null;
  requirements?: string[] | null;
}

export interface Staff {
  id: number;
  name: string;
  position: string;
  department: string;
  description: string;
  photo: string;
  phone: string;
  email: string;
  is_leadership: boolean;
  status: string;
  sort_order: number;
  start_date: string;
}

export interface KataSambutan {
  nama: string;
  jabatan: string;
  foto: string;
  kata_sambutan: string;
  email: string;
  telepon: string;
  whatsapp: string | null;
  periode_mulai: string;
  periode_selesai: string | null;
}

export interface Document {
  id: number;
  title: string;
  slug: string;
  description: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  category_id: number;
  document_type: string;
  year: number;
  status: string;
  download_count: number;
  is_public: boolean;
  category: NewsCategory;
  file_url: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
  type: string;
  sort_order: number;
  is_active: boolean;
}

// Public Data API Types
export interface DataOverview {
  jumlah_penduduk: number;
  jumlah_kk: number;
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  luas_wilayah: string;
  ketinggian: number;
  jumlah_jorong: number;
  total_anggaran: number;
  total_pendapatan: number;
  total_belanja: number;
  tahun_anggaran?: number | null;
  total_fasilitas: number;
  total_umkm: number;
  total_layanan: number;
  proyek_berjalan: number;
  proyek_selesai: number;
  tahun: number;
}

export interface NagariStatsAgeGroup {
  label: string;
  count: number;
  value: number;
}

export interface NagariStatsCategoryItem {
  name: string;
  count: number;
  value: number;
}

export interface NagariStats {
  tahun: number;
  jumlah_penduduk: number;
  jumlah_kk?: number;
  jumlah_laki_laki: number;
  jumlah_perempuan: number;
  age_groups?: NagariStatsAgeGroup[];
  education?: NagariStatsCategoryItem[];
  jobs?: NagariStatsCategoryItem[];
}

export interface KeuanganNagariData {
  year: number;
  activeYear: number | null;
  availableYears: number[];
  incomeData: Array<{
    label: string;
    value: number;
    percent: number;
    color?: string;
  }>;
  totalIncome: number;
  financing: number;
  totalBelanja: number;
  expenseData: Array<{
    name: string;
    value: number;
    percent: number;
    fill?: string;
  }>;
  usagePlan: Array<{
    text: string;
    amount: number;
  }>;
  totalUsagePlan: number;
}

export interface VisitorStatsBucket {
  views: number;
  visitors: number;
}

export interface VisitorCountryStat {
  code: string;
  count: number;
}

export interface VisitorStatsData {
  website_id: string;
  script_url: string;
  host_url: string;
  online: number;
  today: VisitorStatsBucket;
  month: VisitorStatsBucket;
  total: VisitorStatsBucket;
  countries: VisitorCountryStat[];
  updated_at: string;
}

export interface VerificationDocumentData {
  nomor_surat: string;
  tracking_code?: string | null;
  tanggal_surat?: string | null;
  jenis_surat: string;
  nagari?: string | null;
  status?: string | null;
  pemohon?: {
    nama: string;
    nik_masked: string;
  };
  penandatangan?: {
    nama: string;
    jabatan: string;
  };
  verified_at?: string;
}

export interface PublicSurveySummary {
  total_respondents: number;
  average_rating: number;
  ikm_score: number;
  predicate: string | null;
  distribution: {
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

export interface IndeksDesaDimensi {
  layanan_dasar?: number | null;
  sosial?: number | null;
  ekonomi?: number | null;
  lingkungan?: number | null;
  aksesibilitas?: number | null;
  tata_kelola?: number | null;
  iks?: number | null;
  ike?: number | null;
  ikl?: number | null;
}

export interface IndeksDesaIndikator {
  dimensi: string;
  nama: string;
  skor?: number | null;
  skor_maks?: number | null;
  keterangan?: string | null;
  kegiatan?: string | null;
  pelaksana?: string | null;
}

export interface IndeksDesaRecord {
  id: number;
  tahun: number;
  jenis: "indeks_desa" | "idm";
  skor: number;
  status: string;
  target_status?: string | null;
  skor_minimal?: number | null;
  dimensi: IndeksDesaDimensi;
  indikator: IndeksDesaIndikator[];
  catatan?: string | null;
  updated_at?: string | null;
}

export interface IndeksDesaResponse {
  availableYears: number[];
  latestYear: number | null;
  selectedYear: number | null;
  current: IndeksDesaRecord | null;
  history: Array<{
    tahun: number;
    jenis: "indeks_desa" | "idm";
    skor: number;
    status: string;
    dimensi: IndeksDesaDimensi;
  }>;
}

export interface NagariProfile {
  nama_nagari: string;
  kode_nagari: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  visi: string;
  misi: string[];
  sejarah: string;
  potensi_unggulan: string[];
  luas_wilayah: string;
  ketinggian: number;
  jumlah_jorong: number;
  batas_wilayah: {
    utara: string;
    selatan: string;
    timur: string;
    barat: string;
  };
  alamat_kantor: string;
  telepon: string;
  email: string;
  website: string;
  koordinat: {
    lat: number;
    lng: number;
  };
  logo: string | null;
  foto_kantor: string | null;
  jam_operasional: {
    senin: string;
    selasa: string;
    rabu: string;
    kamis: string;
    jumat: string;
    sabtu: string;
    minggu: string;
  };
}

export interface Jorong {
  id: number;
  nama: string;
  kode: string;
  kepala_jorong: string;
  alamat_kantor: string;
  telepon: string;
  luas_wilayah: string;
  jumlah_rt: number;
  jumlah_rw: number;
  koordinat: {
    lat: number;
    lng: number;
  };
  keterangan: string | null;
}

export interface WebGISData {
  center: {
    lat: number;
    lng: number;
  };
  layers: {
    locations: any[];
    regions: any[];
    jorongs: {
      id: number;
      type: string;
      geometry: {
        type: string;
        coordinates: number[];
      };
      properties: {
        nama: string;
        kode: string;
        kepala_jorong: string;
        luas_wilayah: string;
      };
    }[];
    facilities: any[];
    infrastruktur?: any[];
  };
}

export interface Project {
  id: number;
  name?: string;
  nama?: string;
  description?: string;
  deskripsi?: string;
  location?: string;
  lokasi?: string | null;
  budget?: number;
  anggaran?: number | string;
  progress?: number;
  progress_persen?: number;
  status: string;
  year?: number;
  tahun?: number;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  image?: string;
}

export interface Facility {
  id: number;
  // API may return either format
  name?: string;
  nama?: string;
  category?: string;
  jenis?: string;
  description?: string;
  deskripsi?: string;
  address?: string;
  lokasi?: string;
  image?: string;
  foto?: string;
  kondisi?: string;
  maps_url?: string;
  operating_hours?: string;
  koordinat?: {
    lat: number;
    lng: number;
  };
}

export interface UMKM {
  id: number;
  name?: string;
  nama_usaha: string;
  jenis_usaha: string;
  produk: string;
  deskripsi?: string;
  foto?: string;
  foto_url?: string;
  thumb_url?: string;
  image?: string;
  no_hp?: string;
  no_wa?: string;
  alamat?: string;
  google_maps_url?: string;
  jorong?: string;
  status?: string;
  nama_pemilik?: string;
  pemilik?: {
    id?: number;
    nama?: string;
    nik?: string;
  };
  category?: string;
  description?: string;
  price?: string;
  contact?: string;
  location?: string;
  owner?: string;
}

// Complaints API Types
export interface ComplaintStats {
  total_pengaduan: number;
  pengaduan_baru: number;
  dalam_proses: number;
  selesai: number;
  ditolak: number;
  pengaduan_bulan_ini: number;
  rata_rata_penyelesaian: number;
}

// Generic API Response
export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
