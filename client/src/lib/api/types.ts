// API Types for all endpoints

// CMS API Types
export interface SiteSettings {
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
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
  total_fasilitas: number;
  total_umkm: number;
  total_layanan: number;
  proyek_berjalan: number;
  proyek_selesai: number;
  tahun: number;
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
  };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  budget: number;
  progress: number;
  status: string;
  year: number;
  image: string;
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
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  contact: string;
  location: string;
  owner: string;
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
