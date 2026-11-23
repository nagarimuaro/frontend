import type { SiteSettings } from "@/lib/api/types";

export function getTenantName(settings?: SiteSettings, profileName?: string | null): string {
  return settings?.tenant_name?.trim()
    || profileName?.trim()
    || settings?.nama_nagari?.trim()
    || settings?.site_name?.trim()
    || "Nagari";
}
