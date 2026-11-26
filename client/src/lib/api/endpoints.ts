// API Configuration - 100% dynamic multi-tenant resolution
// 1. Direct subdomain access (e.g. muaro.sintanagari.site) uses active subdomain.
// 2. Custom domains (e.g. nagarimuaro.id, nagaripulasan.id, nagaritimbulun.id, or any newly added nagari)
//    route to the central backend API (https://sintanagari.site).
//    The backend TenantMiddleware automatically resolves the nagari from the database
//    via the X-Tenant-Domain header. NO frontend code edits needed when adding new nagaris!
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    
    if (hostname.endsWith(".sintanagari.site") && hostname !== "sintanagari.site") {
      return `https://${hostname}`;
    }
  }
  
  // Central Multi-tenant Backend Gateway
  return "https://sintanagari.site";
};

export const API_BASE_URL = getApiBaseUrl();

// CMS Public API Endpoints
export const CMS_API = {
  get SITE_SETTINGS() { return `${getApiBaseUrl()}/api/cms/public/site-settings`; },
  get HERO_BANNERS() { return `${getApiBaseUrl()}/api/cms/public/hero-banners`; },
  get NEWS() { return `${getApiBaseUrl()}/api/cms/public/news`; },
  NEWS_DETAIL: (slug: string) => `${getApiBaseUrl()}/api/cms/public/news/${slug}`,
  get SERVICES() { return `${getApiBaseUrl()}/api/cms/public/services`; },
  get STAFF() { return `${getApiBaseUrl()}/api/cms/public/staff`; },
  get KATA_SAMBUTAN() { return `${getApiBaseUrl()}/api/cms/public/kata-sambutan`; },
  get DOCUMENTS() { return `${getApiBaseUrl()}/api/cms/public/documents`; },
  DOCUMENT_DOWNLOAD: (slug: string) => `${getApiBaseUrl()}/api/cms/public/documents/${slug}/download`,
  get CATEGORIES() { return `${getApiBaseUrl()}/api/cms/public/categories`; },
  PAGES: (slug: string) => `${getApiBaseUrl()}/api/cms/public/pages/${slug}`,
};

// Public Data API Endpoints
export const PUBLIC_API = {
  get DATA_OVERVIEW() { return `${getApiBaseUrl()}/api/public/data-overview`; },
  get NAGARI_PROFILE() { return `${getApiBaseUrl()}/api/public/nagari-profile`; },
  get NAGARI_STATS() { return `${getApiBaseUrl()}/api/public/nagari-stats`; },
  get JORONGS() { return `${getApiBaseUrl()}/api/public/jorongs`; },
  get WEBGIS() { return `${getApiBaseUrl()}/api/public/webgis`; },
  get PROJECTS() { return `${getApiBaseUrl()}/api/public/projects`; },
  PROJECT_DETAIL: (id: number) => `${getApiBaseUrl()}/api/public/projects/${id}`,
  get FACILITIES() { return `${getApiBaseUrl()}/api/public/facilities`; },
  get FACILITIES_CATEGORIES() { return `${getApiBaseUrl()}/api/public/facilities/categories`; },
  FACILITY_DETAIL: (id: number) => `${getApiBaseUrl()}/api/public/facilities/${id}`,
  get UMKM_DIRECTORY() { return `${getApiBaseUrl()}/api/public/umkm-directory`; },
  get UMKM_CATEGORIES() { return `${getApiBaseUrl()}/api/public/umkm-categories`; },
  get UMKM_SUBMIT() { return `${getApiBaseUrl()}/api/public/umkm/submit`; },
  UMKM_STATUS: (id: string) => `${getApiBaseUrl()}/api/public/umkm/status/${id}`,
  get LOCATION_INFO() { return `${getApiBaseUrl()}/api/public/location-info`; },
  get KEUANGAN() { return `${getApiBaseUrl()}/api/public/keuangan-nagari`; },
  get VISITOR_STATS() { return `${getApiBaseUrl()}/api/public/visitor-stats`; },
  VERIFY_SURAT: (token: string) => `${getApiBaseUrl()}/api/public/verifikasi-surat/${encodeURIComponent(token)}`,
  get SURVEY_SUMMARY() { return `${getApiBaseUrl()}/api/public/survey/summary`; },
  get SURVEY_SUBMIT() { return `${getApiBaseUrl()}/api/public/survey`; },
  get INDEKS_DESA() { return `${getApiBaseUrl()}/api/public/indeks-desa`; },
};

// Pelayanan & Pengaduan API Endpoints
export const PELAYANAN_API = {
  get SUBMIT() { return `${getApiBaseUrl()}/api/public/pelayanan`; },
  TRACK: (trackingCode: string) => `${getApiBaseUrl()}/api/public/pelayanan/track/${trackingCode}`,
  get COMPLAINTS_SUBMIT() { return `${getApiBaseUrl()}/api/public/complaints`; },
  COMPLAINTS_TRACK: (id: string) => `${getApiBaseUrl()}/api/public/complaints/track/${id}`,
  get COMPLAINTS_CATEGORIES() { return `${getApiBaseUrl()}/api/public/complaints/categories`; },
  get COMPLAINTS_STATS() { return `${getApiBaseUrl()}/api/public/complaints/stats`; },
  get COMPLAINTS_RECENT() { return `${getApiBaseUrl()}/api/public/complaints/recent`; },
};


