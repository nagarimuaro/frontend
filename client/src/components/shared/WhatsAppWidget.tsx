
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function WhatsAppWidget() {
  return (
    <a
      href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
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
