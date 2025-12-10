
import { MessageCircle, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/lib/api";

export default function WhatsAppWidget() {
  const { data: settingsResponse, isLoading } = useSiteSettings();
  const settings = settingsResponse?.data;
  
  // Get WhatsApp number from settings
  const whatsappNumber = settings?.whatsapp || settings?.phone || '6281234567890';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  
  if (isLoading) return null;
  
  return (
    <a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
      <div className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all flex items-center gap-3 group-hover:pr-6">
        <MessageCircle size={28} />
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
          <span className="font-medium text-sm">Chat Layanan 24 Jam</span>
        </div>
      </div>
    </a>
  );
}
