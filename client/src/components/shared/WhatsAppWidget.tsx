
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/api";
import { getTenantWhatsAppNumber } from "@/lib/whatsapp";

export default function WhatsAppWidget() {
  const { data: settingsResponse } = useSiteSettings();
  const whatsappNumber = getTenantWhatsAppNumber(settingsResponse?.data);

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 h-12 px-4 rounded-full bg-brand-wa text-brand-wa-foreground shadow-md hover:brightness-95 transition-all"
      aria-label="Hubungi layanan nagari via WhatsApp"
    >
      <MessageCircle aria-hidden="true" size={20} />
      <span className="font-medium text-sm hidden sm:inline">Layanan WhatsApp</span>
    </a>
  );
}
