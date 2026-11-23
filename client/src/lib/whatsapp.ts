import type { SiteSettings } from "@/lib/api/types";

export function getTenantWhatsAppNumber(settings?: SiteSettings | null): string | null {
  for (const value of [settings?.contact_whatsapp, settings?.whatsapp]) {
    if (!value) continue;

    let number = value.replace(/\D/g, "");
    if (number.startsWith("0")) number = `62${number.slice(1)}`;

    if (number.length >= 8 && number.length <= 15) return number;
  }

  return null;
}
