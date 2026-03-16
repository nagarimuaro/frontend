// API Configuration
export const API_BASE_URL = "https://muaro.sintanagari.cloud";

// CMS Public API Endpoints
export const CMS_API = {
  SITE_SETTINGS: `${API_BASE_URL}/api/cms/public/site-settings`,
  HERO_BANNERS: `${API_BASE_URL}/api/cms/public/hero-banners`,
  NEWS: `${API_BASE_URL}/api/cms/public/news`,
  NEWS_DETAIL: (slug: string) => `${API_BASE_URL}/api/cms/public/news/${slug}`,
  SERVICES: `${API_BASE_URL}/api/cms/public/services`,
  STAFF: `${API_BASE_URL}/api/cms/public/staff`,
  KATA_SAMBUTAN: `${API_BASE_URL}/api/cms/public/kata-sambutan`,
  DOCUMENTS: `${API_BASE_URL}/api/cms/public/documents`,
  DOCUMENT_DOWNLOAD: (slug: string) => `${API_BASE_URL}/api/cms/public/documents/${slug}/download`,
  CATEGORIES: `${API_BASE_URL}/api/cms/public/categories`,
  PAGES: (slug: string) => `${API_BASE_URL}/api/cms/public/pages/${slug}`,
};

// Public Data API Endpoints
export const PUBLIC_API = {
  DATA_OVERVIEW: `${API_BASE_URL}/api/public/data-overview`,
  NAGARI_PROFILE: `${API_BASE_URL}/api/public/nagari-profile`,
  NAGARI_STATS: `${API_BASE_URL}/api/public/nagari-stats`,
  JORONGS: `${API_BASE_URL}/api/public/jorongs`,
  WEBGIS: `${API_BASE_URL}/api/public/webgis`,
  PROJECTS: `${API_BASE_URL}/api/public/projects`,
  PROJECT_DETAIL: (id: number) => `${API_BASE_URL}/api/public/projects/${id}`,
  FACILITIES: `${API_BASE_URL}/api/public/facilities`,
  FACILITIES_CATEGORIES: `${API_BASE_URL}/api/public/facilities/categories`,
  FACILITY_DETAIL: (id: number) => `${API_BASE_URL}/api/public/facilities/${id}`,
  UMKM_DIRECTORY: `${API_BASE_URL}/api/public/umkm-directory`,
  UMKM_CATEGORIES: `${API_BASE_URL}/api/public/umkm-categories`,
  UMKM_SUBMIT: `${API_BASE_URL}/api/public/umkm/submit`,
  UMKM_STATUS: (id: string) => `${API_BASE_URL}/api/public/umkm/status/${id}`,
  LOCATION_INFO: `${API_BASE_URL}/api/public/location-info`,
  KEUANGAN: `${API_BASE_URL}/api/public/keuangan-nagari`,
};

// Pelayanan & Pengaduan API Endpoints
export const PELAYANAN_API = {
  SUBMIT: `${API_BASE_URL}/api/public/pelayanan`,
  TRACK: (trackingCode: string) => `${API_BASE_URL}/api/public/pelayanan/track/${trackingCode}`,
  COMPLAINTS_SUBMIT: `${API_BASE_URL}/api/public/complaints`,
  COMPLAINTS_TRACK: (id: string) => `${API_BASE_URL}/api/public/complaints/track/${id}`,
  COMPLAINTS_CATEGORIES: `${API_BASE_URL}/api/public/complaints/categories`,
  COMPLAINTS_STATS: `${API_BASE_URL}/api/public/complaints/stats`,
  COMPLAINTS_RECENT: `${API_BASE_URL}/api/public/complaints/recent`,
};
