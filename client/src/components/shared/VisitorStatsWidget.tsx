import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BarChart3, Globe, X, ChevronUp } from "lucide-react";
import { useVisitorStats, useSiteSettings } from "@/lib/api";
import { getTenantName } from "@/lib/tenant-name";
import { accentByIndex } from "@/lib/accents";

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

function isoToFlag(code: string): string {
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "🌐";
  return String.fromCodePoint(
    0x1f1e6 + (upper.charCodeAt(0) - 65),
    0x1f1e6 + (upper.charCodeAt(1) - 65)
  );
}

const regionFormatter =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames !== "undefined"
    ? new Intl.DisplayNames(["id"], { type: "region" })
    : null;

function getCountryName(code: string): string {
  const upper = code.toUpperCase();
  try {
    return regionFormatter?.of(upper) || upper;
  } catch {
    return upper;
  }
}

export default function VisitorStatsWidget() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data: statsResponse } = useVisitorStats();
  const { data: settingsResponse } = useSiteSettings();

  const stats = statsResponse?.data ?? null;
  const tenantName = getTenantName(settingsResponse?.data);

  // Dynamically load Umami tracker script once per tenant website_id
  useEffect(() => {
    if (!stats?.website_id || !stats?.script_url) return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-sinta-umami="${stats.website_id}"]`
    );
    if (existing) return;

    // Remove any stale script from another tenant
    document
      .querySelectorAll("script[data-sinta-umami]")
      .forEach((node) => node.remove());

    const script = document.createElement("script");
    script.defer = true;
    script.src = stats.script_url;
    script.setAttribute("data-website-id", stats.website_id);
    if (stats.host_url) {
      script.setAttribute("data-host-url", stats.host_url);
    }
    script.setAttribute("data-sinta-umami", stats.website_id);
    document.head.appendChild(script);
  }, [stats?.website_id, stats?.script_url, stats?.host_url]);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const topCountries = useMemo(
    () => (stats?.countries || []).slice(0, 6),
    [stats?.countries]
  );

  const maxCountryCount = useMemo(
    () => Math.max(...topCountries.map((c) => c.count), 1),
    [topCountries]
  );

  if (!stats) return null;

  const totalViews = Number(stats.total?.views || 0);
  const todayViews = Number(stats.today?.views || 0);
  const monthViews = Number(stats.month?.views || 0);
  const onlineCount = Number(stats.online || 0);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 left-5 z-40 flex flex-col items-start"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="visitor-stats-panel"
            aria-label="Statistik pengunjung website nagari"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_UI }}
            style={{ transformOrigin: "bottom left" }}
            className="mb-3 w-[320px] sm:w-[348px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-card border border-border shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-nagari-navy text-white px-5 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    aria-hidden="true"
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      onlineCount > 0 ? "bg-emerald-400" : "bg-white/40"
                    }`}
                  />
                  <span className="text-[13px] font-medium text-nagari-yellow tabular-nums">
                    {onlineCount > 0
                      ? `${onlineCount.toLocaleString("id-ID")} sedang online`
                      : "Statistik Pengunjung"}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-base text-white truncate">
                  {tenantName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup panel statistik pengunjung"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>

            {/* Summary Counters */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/35">
              <div className="p-3.5 text-center">
                <p className="text-[13px] text-muted-foreground mb-0.5">Hari Ini</p>
                <p className="font-serif font-bold text-lg text-foreground tabular-nums leading-tight">
                  {todayViews.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-3.5 text-center">
                <p className="text-[13px] text-muted-foreground mb-0.5">Bulan Ini</p>
                <p className="font-serif font-bold text-lg text-foreground tabular-nums leading-tight">
                  {monthViews.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="p-3.5 text-center">
                <p className="text-[13px] text-muted-foreground mb-0.5">Total</p>
                <p className="font-serif font-bold text-lg text-nagari-red-ink tabular-nums leading-tight">
                  {totalViews.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Countries List */}
            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-foreground inline-flex items-center gap-1.5">
                  <Globe aria-hidden="true" size={14} className="text-nagari-red-ink" />
                  Negara Pengunjung
                </p>
                {stats.total.visitors > 0 && (
                  <span className="text-[13px] text-muted-foreground tabular-nums">
                    {stats.total.visitors.toLocaleString("id-ID")} unik
                  </span>
                )}
              </div>

              {topCountries.length === 0 ? (
                <p className="text-[13px] text-muted-foreground py-4 text-center bg-muted/40 rounded-xl border border-border">
                  Data negara akan tampil otomatis setelah kunjungan tercatat.
                </p>
              ) : (
                <ul className="space-y-3">
                  {topCountries.map((country, idx) => {
                    const accent = accentByIndex(idx);
                    const widthPct = Math.max(
                      6,
                      Math.round((country.count / maxCountryCount) * 100)
                    );
                    return (
                      <li key={country.code} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-[13px]">
                          <span className="flex items-center gap-2 min-w-0">
                            <span
                              aria-hidden="true"
                              className="text-base leading-none shrink-0"
                            >
                              {isoToFlag(country.code)}
                            </span>
                            <span className="font-medium text-foreground truncate">
                              {getCountryName(country.code)}
                            </span>
                          </span>
                          <span className="font-semibold text-foreground tabular-nums shrink-0">
                            {country.count.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={prefersReducedMotion ? false : { scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 0.42,
                              delay: idx * 0.04,
                              ease: EASE_ENTER,
                            }}
                            style={{
                              width: `${widthPct}%`,
                              transformOrigin: "left center",
                            }}
                            className={`h-full rounded-full ${accent.edge}`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Compact Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="visitor-stats-panel"
        aria-label={`Statistik pengunjung website: ${totalViews.toLocaleString("id-ID")} kunjungan`}
        className="inline-flex items-center gap-2.5 h-12 px-3.5 sm:px-4 rounded-full bg-card text-foreground border border-border shadow-md hover:-translate-y-0.5 hover:border-foreground/25 active:scale-[0.985] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red"
      >
        <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-nagari-red/10 text-nagari-red-ink shrink-0">
          <BarChart3 aria-hidden="true" size={15} />
          {onlineCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card"
            />
          )}
        </span>

        <span className="text-sm font-semibold tabular-nums leading-none">
          {totalViews.toLocaleString("id-ID")}
        </span>

        <span className="hidden sm:inline text-[13px] text-muted-foreground font-medium">
          kunjungan
        </span>

        <ChevronUp
          aria-hidden="true"
          size={15}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
}
