import { useQuery, useMutation } from "@tanstack/react-query";
import { CMS_API, PUBLIC_API, PELAYANAN_API } from "./endpoints";
import type {
  ApiResponse,
  SiteSettings,
  HeroBanner,
  NewsItem,
  NewsResponse,
  Service,
  Staff,
  KataSambutan,
  Document,
  Category,
  DataOverview,
  NagariProfile,
  Jorong,
  WebGISData,
  Project,
  Facility,
  UMKM,
  ComplaintStats,
  PaginatedResponse,
} from "./types";

// Generic fetch function
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// ============ CMS API HOOKS ============

// Site Settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => fetchApi<ApiResponse<SiteSettings>>(CMS_API.SITE_SETTINGS),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Hero Banners
export function useHeroBanners() {
  return useQuery({
    queryKey: ["hero-banners"],
    queryFn: () => fetchApi<ApiResponse<HeroBanner[]>>(CMS_API.HERO_BANNERS),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// News
export function useNews(page = 1) {
  return useQuery({
    queryKey: ["news", page],
    queryFn: () => fetchApi<NewsResponse>(`${CMS_API.NEWS}?page=${page}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => fetchApi<ApiResponse<NewsItem>>(CMS_API.NEWS_DETAIL(slug)),
    enabled: !!slug,
  });
}

// Services
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => fetchApi<ApiResponse<Service[]>>(CMS_API.SERVICES),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Staff
export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => fetchApi<ApiResponse<Staff[]>>(CMS_API.STAFF),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Kata Sambutan
export function useKataSambutan() {
  return useQuery({
    queryKey: ["kata-sambutan"],
    queryFn: () => fetchApi<ApiResponse<KataSambutan>>(CMS_API.KATA_SAMBUTAN),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Documents
export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => fetchApi<ApiResponse<Document[]>>(CMS_API.DOCUMENTS),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchApi<ApiResponse<Category[]>>(CMS_API.CATEGORIES),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ============ PUBLIC DATA API HOOKS ============

// Data Overview
export function useDataOverview() {
  return useQuery({
    queryKey: ["data-overview"],
    queryFn: () => fetchApi<ApiResponse<DataOverview>>(PUBLIC_API.DATA_OVERVIEW),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Nagari Profile
export function useNagariProfile() {
  return useQuery({
    queryKey: ["nagari-profile"],
    queryFn: () => fetchApi<ApiResponse<NagariProfile>>(PUBLIC_API.NAGARI_PROFILE),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Nagari Stats
export function useNagariStats(year?: number) {
  return useQuery({
    queryKey: ["nagari-stats", year],
    queryFn: () => fetchApi<ApiResponse<any>>(`${PUBLIC_API.NAGARI_STATS}${year ? `?year=${year}` : ""}`),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Jorongs
export function useJorongs() {
  return useQuery({
    queryKey: ["jorongs"],
    queryFn: () => fetchApi<{ status: string; message: string; data: Jorong[]; total: number }>(PUBLIC_API.JORONGS),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// WebGIS
export function useWebGIS() {
  return useQuery({
    queryKey: ["webgis"],
    queryFn: () => fetchApi<ApiResponse<WebGISData>>(PUBLIC_API.WEBGIS),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Projects
export function useProjects(page = 1) {
  return useQuery({
    queryKey: ["projects", page],
    queryFn: () => fetchApi<ApiResponse<PaginatedResponse<Project>>>(`${PUBLIC_API.PROJECTS}?page=${page}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProjectDetail(id: number) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchApi<ApiResponse<Project>>(PUBLIC_API.PROJECT_DETAIL(id)),
    enabled: !!id,
  });
}

// Facilities
export function useFacilities(page = 1) {
  return useQuery({
    queryKey: ["facilities", page],
    queryFn: () => fetchApi<ApiResponse<PaginatedResponse<Facility>>>(`${PUBLIC_API.FACILITIES}?page=${page}`),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFacilitiesCategories() {
  return useQuery({
    queryKey: ["facilities-categories"],
    queryFn: () => fetchApi<ApiResponse<string[]>>(PUBLIC_API.FACILITIES_CATEGORIES),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useFacilityDetail(id: number) {
  return useQuery({
    queryKey: ["facility", id],
    queryFn: () => fetchApi<ApiResponse<Facility>>(PUBLIC_API.FACILITY_DETAIL(id)),
    enabled: !!id,
  });
}

// UMKM
export function useUMKMDirectory(page = 1) {
  return useQuery({
    queryKey: ["umkm-directory", page],
    queryFn: () => fetchApi<ApiResponse<PaginatedResponse<UMKM>>>(`${PUBLIC_API.UMKM_DIRECTORY}?page=${page}`),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useUMKMCategories() {
  return useQuery({
    queryKey: ["umkm-categories"],
    queryFn: () => fetchApi<ApiResponse<string[]>>(PUBLIC_API.UMKM_CATEGORIES),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Location Info
export function useLocationInfo() {
  return useQuery({
    queryKey: ["location-info"],
    queryFn: () => fetchApi<ApiResponse<{ locations: any[]; regions: any[] }>>(PUBLIC_API.LOCATION_INFO),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// ============ COMPLAINTS API HOOKS ============

// Complaint Categories
export function useComplaintCategories() {
  return useQuery({
    queryKey: ["complaint-categories"],
    queryFn: () => fetchApi<ApiResponse<string[]>>(PELAYANAN_API.COMPLAINTS_CATEGORIES),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Complaint Stats
export function useComplaintStats() {
  return useQuery({
    queryKey: ["complaint-stats"],
    queryFn: () => fetchApi<ApiResponse<ComplaintStats>>(PELAYANAN_API.COMPLAINTS_STATS),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Recent Complaints
export function useRecentComplaints() {
  return useQuery({
    queryKey: ["recent-complaints"],
    queryFn: () => fetchApi<ApiResponse<any[]>>(PELAYANAN_API.COMPLAINTS_RECENT),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Submit Complaint Mutation
export function useSubmitComplaint() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(PELAYANAN_API.COMPLAINTS_SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }
      return response.json();
    },
  });
}

// Submit Pelayanan Mutation
export function useSubmitPelayanan() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(PELAYANAN_API.SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit pelayanan");
      }
      return response.json();
    },
  });
}

// Track Pelayanan
export function useTrackPelayanan(trackingCode: string) {
  return useQuery({
    queryKey: ["track-pelayanan", trackingCode],
    queryFn: () => fetchApi<ApiResponse<any>>(PELAYANAN_API.TRACK(trackingCode)),
    enabled: !!trackingCode,
  });
}

// Track Complaint
export function useTrackComplaint(id: string) {
  return useQuery({
    queryKey: ["track-complaint", id],
    queryFn: () => fetchApi<ApiResponse<any>>(PELAYANAN_API.COMPLAINTS_TRACK(id)),
    enabled: !!id,
  });
}

// Submit UMKM Registration
export function useSubmitUMKM() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(PUBLIC_API.UMKM_SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit UMKM registration");
      }
      return response.json();
    },
  });
}

// Check UMKM Status
export function useUMKMStatus(id: string) {
  return useQuery({
    queryKey: ["umkm-status", id],
    queryFn: () => fetchApi<ApiResponse<any>>(PUBLIC_API.UMKM_STATUS(id)),
    enabled: !!id,
  });
}
