import { useState, useMemo, useEffect } from "react";
import { Megaphone, ChevronRight, X } from "lucide-react";
import { Link } from "wouter";
import { useNews } from "@/lib/api";

export default function UrgentAnnouncementBar() {
  const { data: newsResponse } = useNews(1);
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  const urgentItem = useMemo(() => {
    const items = newsResponse?.data || [];
    return items.find((item) => Boolean(item.is_urgent)) ?? null;
  }, [newsResponse?.data]);

  const storageKey = useMemo(() => {
    if (!urgentItem || typeof window === "undefined") return null;
    return `${window.location.hostname}:urgent-dismissed:${urgentItem.id}`;
  }, [urgentItem]);

  useEffect(() => {
    if (!storageKey || !urgentItem) return;
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        setDismissedId(urgentItem.id);
      }
    } catch {
      // Ignore storage access errors
    }
  }, [storageKey, urgentItem]);

  if (!urgentItem || dismissedId === urgentItem.id) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedId(urgentItem.id);
    if (storageKey) {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div
      role="region"
      aria-label="Pengumuman penting nagari"
      className="fixed top-[72px] inset-x-0 z-[90] bg-nagari-navy text-white border-b border-white/15 shadow-sm"
    >
      <div className="container mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-3">
        <Link
          href={`/berita/${urgentItem.slug}`}
          className="group flex items-center gap-3 min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-yellow rounded-md"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-nagari-red text-white text-[13px] font-semibold shrink-0">
            <Megaphone aria-hidden="true" size={14} />
            <span className="hidden sm:inline">Pengumuman Penting</span>
            <span className="sm:hidden">Penting</span>
          </span>
          <span className="text-sm font-medium text-white truncate group-hover:underline underline-offset-4">
            {urgentItem.title}
          </span>
          <ChevronRight
            aria-hidden="true"
            size={16}
            className="text-nagari-yellow shrink-0 transition-transform duration-150 group-hover:translate-x-[3px]"
          />
        </Link>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup pita pengumuman penting"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
