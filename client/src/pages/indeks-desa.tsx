import { useState, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  animate,
} from "framer-motion";
import {
  Award,
  Target,
  TrendingUp,
  Layers,
  Calendar,
  Loader2,
  BarChart3,
  Search,
  X,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  HeartPulse,
  Users,
  Store,
  Trees,
  Route as RouteIcon,
  Landmark,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIndeksDesa, useSiteSettings, useNagariProfile } from "@/lib/api";
import { getTenantName } from "@/lib/tenant-name";
import { accentByIndex } from "@/lib/accents";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import mapImage from "@assets/generated_images/digital_map_of_village.png";

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATUS_TIERS = [
  { key: "sangat tertinggal", label: "Sangat Tertinggal", short: "S. Tertinggal", min: 0 },
  { key: "tertinggal", label: "Tertinggal", short: "Tertinggal", min: 50 },
  { key: "berkembang", label: "Berkembang", short: "Berkembang", min: 60 },
  { key: "maju", label: "Maju", short: "Maju", min: 70 },
  { key: "mandiri", label: "Mandiri", short: "Mandiri", min: 80 },
] as const;

const SIX_DIMENSIONS: Array<{
  field:
    | "layanan_dasar"
    | "sosial"
    | "ekonomi"
    | "lingkungan"
    | "aksesibilitas"
    | "tata_kelola";
  label: string;
  short: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}> = [
  {
    field: "layanan_dasar",
    label: "Layanan Dasar",
    short: "Layanan Dasar",
    desc: "Pendidikan, kesehatan, air bersih, dan sanitasi dasar warga.",
    icon: HeartPulse,
  },
  {
    field: "sosial",
    label: "Sosial",
    short: "Sosial",
    desc: "Partisipasi sosial, keamanan, kelembagaan, dan gotong royong.",
    icon: Users,
  },
  {
    field: "ekonomi",
    label: "Ekonomi",
    short: "Ekonomi",
    desc: "Keragaman produksi lokal, pasar, logistik, dan akses perbankan.",
    icon: Store,
  },
  {
    field: "lingkungan",
    label: "Lingkungan",
    short: "Lingkungan",
    desc: "Pengelolaan sumber daya alam, kebersihan, dan tanggap bencana.",
    icon: Trees,
  },
  {
    field: "aksesibilitas",
    label: "Aksesibilitas",
    short: "Aksesibilitas",
    desc: "Konektivitas jalan, transportasi, dan akses fasilitas publik.",
    icon: RouteIcon,
  },
  {
    field: "tata_kelola",
    label: "Tata Kelola Pemerintahan",
    short: "Tata Kelola",
    desc: "Transparansi, akuntabilitas, dan efektivitas pelayanan nagari.",
    icon: Landmark,
  },
];

const THREE_PILLARS: Array<{
  field: "iks" | "ike" | "ikl";
  label: string;
  short: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}> = [
  {
    field: "iks",
    label: "Indeks Ketahanan Sosial (IKS)",
    short: "IKS (Sosial)",
    desc: "Kesehatan, pendidikan, modal sosial, dan permukiman.",
    icon: Users,
  },
  {
    field: "ike",
    label: "Indeks Ketahanan Ekonomi (IKE)",
    short: "IKE (Ekonomi)",
    desc: "Keragaman produksi, perdagangan, distribusi, dan keterbukaan wilayah.",
    icon: Store,
  },
  {
    field: "ikl",
    label: "Indeks Ketahanan Lingkungan (IKL)",
    short: "IKL (Lingkungan)",
    desc: "Kualitas ekologi, potensi bencana, dan mitigasi bencana.",
    icon: Trees,
  },
];

function formatScore(val: number | null | undefined, jenis: "indeks_desa" | "idm"): string {
  if (val === null || val === undefined || Number.isNaN(val)) return "—";
  if (jenis === "idm" && val <= 1.5) {
    return val.toLocaleString("id-ID", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return val.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizePercent(val: number, jenis: "indeks_desa" | "idm"): number {
  if (jenis === "idm" && val <= 1.5) {
    return Math.min(100, Math.max(0, Number((val * 100).toFixed(2))));
  }
  return Math.min(100, Math.max(0, Number(val.toFixed(2))));
}

function getTierIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("sangat tertinggal")) return 0;
  if (s.includes("tertinggal")) return 1;
  if (s.includes("berkembang")) return 2;
  if (s.includes("maju")) return 3;
  if (s.includes("mandiri")) return 4;
  return 2;
}

function statusBadgeStyle(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("mandiri")) return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
  if (s.includes("maju")) return "bg-sky-500/20 text-sky-200 border-sky-400/40";
  if (s.includes("berkembang")) return "bg-amber-500/20 text-amber-200 border-amber-400/40";
  return "bg-rose-500/20 text-rose-200 border-rose-400/40";
}

function statusPillLight(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("mandiri")) {
    return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
  }
  if (s.includes("maju")) {
    return "bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/25";
  }
  if (s.includes("berkembang")) {
    return "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/25";
  }
  return "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25";
}

function qualityTag(percent: number): { label: string; tone: string } {
  if (percent >= 85) {
    return {
      label: "Sangat Baik",
      tone: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    };
  }
  if (percent >= 75) {
    return {
      label: "Baik",
      tone: "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/20",
    };
  }
  if (percent >= 65) {
    return {
      label: "Cukup",
      tone: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20",
    };
  }
  return {
    label: "Prioritas",
    tone: "text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20",
  };
}

function AnimatedScore({
  value,
  jenis,
  reducedMotion,
}: {
  value: number;
  jenis: "indeks_desa" | "idm";
  reducedMotion: boolean;
}) {
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE_ENTER,
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value, reducedMotion]);

  return <>{formatScore(display, jenis)}</>;
}

function ScoreGaugeRing({
  percent,
  reducedMotion,
}: {
  percent: number;
  reducedMotion: boolean;
}) {
  const size = 112;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const targetOffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="indeksRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5c542" />
            <stop offset="55%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#indeksRingGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={
            reducedMotion
              ? { strokeDashoffset: targetOffset }
              : { strokeDashoffset: circumference }
          }
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.05, ease: EASE_ENTER }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-serif font-bold text-white tabular-nums leading-none">
          {Math.round(clamped)}%
        </span>
        <span className="text-[11px] text-white/65 mt-1 font-medium">dari 100</span>
      </div>
    </div>
  );
}

function DeltaPill({
  delta,
  jenis,
  darkSurface = false,
  suffix = "",
}: {
  delta: number | null;
  jenis: "indeks_desa" | "idm";
  darkSurface?: boolean;
  suffix?: string;
}) {
  if (delta === null || Number.isNaN(delta)) return null;
  const absFormatted = formatScore(Math.abs(delta), jenis);

  if (Math.abs(delta) < 0.005) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums ${
          darkSurface
            ? "bg-white/10 text-white/80 border border-white/15"
            : "bg-muted text-muted-foreground border border-border"
        }`}
      >
        <Minus aria-hidden="true" size={12} />
        <span>Tetap{suffix}</span>
      </span>
    );
  }

  const isUp = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums border ${
        isUp
          ? darkSurface
            ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/35"
            : "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
          : darkSurface
            ? "bg-rose-500/20 text-rose-200 border-rose-400/35"
            : "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25"
      }`}
    >
      {isUp ? (
        <ArrowUpRight aria-hidden="true" size={13} />
      ) : (
        <ArrowDownRight aria-hidden="true" size={13} />
      )}
      <span>
        {isUp ? "+" : "-"}
        {absFormatted}
        {suffix}
      </span>
    </span>
  );
}

function CustomRadarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { label: string; percent: number; raw: number; delta: number | null };
  }>;
}) {
  if (!active || !payload || !payload[0]?.payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl bg-nagari-navy/95 text-white border border-white/15 px-3.5 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold text-nagari-yellow">{item.label}</p>
      <p className="text-base font-serif font-bold tabular-nums mt-0.5">
        {item.percent.toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        <span className="text-xs font-normal text-white/70 ml-1">/ 100</span>
      </p>
      {item.delta !== null && Math.abs(item.delta) >= 0.01 && (
        <p
          className={`text-[11px] mt-1 font-medium ${
            item.delta > 0 ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {item.delta > 0 ? "+" : ""}
          {item.delta.toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          dibanding tahun sebelumnya
        </p>
      )}
    </div>
  );
}

function CustomTrendTooltip({
  active,
  payload,
  jenis,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { tahun: number; skor: number; status: string };
  }>;
  jenis: "indeks_desa" | "idm";
}) {
  if (!active || !payload || !payload[0]?.payload) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-xl bg-nagari-navy/95 text-white border border-white/15 px-3.5 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-xs text-white/70 font-medium">Tahun {item.tahun}</p>
      <p className="text-lg font-serif font-bold tabular-nums mt-0.5 text-white">
        {formatScore(item.skor, jenis)}
      </p>
      <p className="text-xs font-semibold text-emerald-300 mt-0.5">
        Status: {item.status}
      </p>
    </div>
  );
}

export default function IndeksDesa() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [hoveredDim, setHoveredDim] = useState<string | null>(null);
  const [indikatorSearch, setIndikatorSearch] = useState("");
  const [indikatorDimFilter, setIndikatorDimFilter] = useState("all");

  const { data: indeksResp, isLoading, isFetching } = useIndeksDesa(selectedYear);
  const { data: settingsResp } = useSiteSettings();
  const { data: profileResp } = useNagariProfile();

  const payload = indeksResp?.data;
  const current = payload?.current ?? null;
  const availableYears = payload?.availableYears || [];
  const latestYear = payload?.latestYear ?? null;
  const history = payload?.history || [];
  const tenantName = getTenantName(settingsResp?.data, profileResp?.data?.nama_nagari);

  // Previous year entry from history for YoY deltas
  const previousRecord = useMemo(() => {
    if (!current || history.length < 2) return null;
    const idx = history.findIndex((h) => h.tahun === current.tahun);
    if (idx > 0) return history[idx - 1];
    return null;
  }, [current, history]);

  const yoyScoreDelta = useMemo(() => {
    if (!current || !previousRecord) return null;
    if (current.jenis !== previousRecord.jenis) return null;
    return Number((current.skor - previousRecord.skor).toFixed(current.jenis === "idm" ? 4 : 2));
  }, [current, previousRecord]);

  const dimensionRows = useMemo(() => {
    if (!current) return [];
    const dim = current.dimensi || {};
    const prevDim =
      previousRecord && previousRecord.jenis === current.jenis
        ? previousRecord.dimensi || {}
        : {};

    if (current.jenis === "idm") {
      return THREE_PILLARS.map((p) => {
        const raw = Number(dim[p.field] ?? 0);
        const prevRaw = prevDim[p.field];
        const delta =
          prevRaw !== undefined && prevRaw !== null
            ? Number((raw - Number(prevRaw)).toFixed(4))
            : null;
        return {
          key: p.field,
          label: p.label,
          short: p.short,
          desc: p.desc,
          icon: p.icon,
          raw,
          percent: normalizePercent(raw, "idm"),
          delta,
          hasValue: dim[p.field] !== undefined && dim[p.field] !== null,
        };
      }).filter((r) => r.hasValue);
    }

    return SIX_DIMENSIONS.map((d) => {
      const raw = Number(dim[d.field] ?? 0);
      const prevRaw = prevDim[d.field];
      const delta =
        prevRaw !== undefined && prevRaw !== null
          ? Number((raw - Number(prevRaw)).toFixed(2))
          : null;
      return {
        key: d.field,
        label: d.label,
        short: d.short,
        desc: d.desc,
        icon: d.icon,
        raw,
        percent: normalizePercent(raw, "indeks_desa"),
        delta,
        hasValue: dim[d.field] !== undefined && dim[d.field] !== null,
      };
    }).filter((r) => r.hasValue);
  }, [current, previousRecord]);

  const topDimension = useMemo(() => {
    if (dimensionRows.length === 0) return null;
    return [...dimensionRows].sort((a, b) => b.percent - a.percent)[0] ?? null;
  }, [dimensionRows]);

  const lowestDimension = useMemo(() => {
    if (dimensionRows.length < 2) return null;
    return [...dimensionRows].sort((a, b) => a.percent - b.percent)[0] ?? null;
  }, [dimensionRows]);

  const activeDimDetail = useMemo(() => {
    if (!hoveredDim) return null;
    return dimensionRows.find((d) => d.key === hoveredDim) ?? null;
  }, [hoveredDim, dimensionRows]);

  const indikatorDims = useMemo(() => {
    if (!current?.indikator) return [];
    const set = new Set<string>();
    for (const row of current.indikator) {
      if (row.dimensi?.trim()) set.add(row.dimensi.trim());
    }
    return Array.from(set);
  }, [current]);

  const filteredIndikator = useMemo(() => {
    const list = current?.indikator || [];
    const q = indikatorSearch.trim().toLowerCase();
    return list.filter((row) => {
      const matchDim =
        indikatorDimFilter === "all" || row.dimensi === indikatorDimFilter;
      const matchQ =
        !q ||
        row.nama.toLowerCase().includes(q) ||
        (row.dimensi || "").toLowerCase().includes(q) ||
        (row.keterangan || "").toLowerCase().includes(q) ||
        (row.kegiatan || "").toLowerCase().includes(q);
      return matchDim && matchQ;
    });
  }, [current, indikatorSearch, indikatorDimFilter]);

  const trendYDomain = useMemo((): [number, number] => {
    if (history.length === 0) return [0, 100];
    if (current?.jenis === "idm") return [0, 1];
    const scores = history.map((h) => Number(h.skor || 0));
    const minVal = Math.min(...scores);
    const maxVal = Math.max(...scores);
    const lower = Math.max(0, Math.floor((minVal - 8) / 5) * 5);
    const upper = Math.min(100, Math.ceil((maxVal + 5) / 5) * 5);
    return [lower, Math.max(upper, lower + 10)];
  }, [history, current]);

  const currentTierIndex = current ? getTierIndex(current.status) : 0;
  const currentPercent = current ? normalizePercent(current.skor, current.jenis) : 0;

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-36 gap-3 min-h-[65vh]">
          <Loader2 aria-hidden="true" className="w-8 h-8 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data resmi Indeks Desa...
          </span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Indeks Desa (IDM)"
        description="Potret resmi status kemandirian, capaian 6 dimensi pembangunan, serta tren kemajuan nagari berdasarkan penilaian Kemendes PDT."
        image={mapImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 space-y-10 md:space-y-14">
        {!current ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_ENTER }}
          >
            <Card className="bg-card border border-border rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-5">
                <BarChart3 aria-hidden="true" className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
                Data Indeks Desa Belum Dipublikasikan
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Pemerintah {tenantName} belum mempublikasikan skor Indeks Desa / IDM pada portal ini. Data akan tampil otomatis segera setelah disinkronkan oleh admin nagari.
              </p>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Year Selector Bar */}
            {availableYears.length > 1 && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_ENTER }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:px-6 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                    <Calendar aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Periode Penilaian Indeks Desa
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Bandingkan skor dan capaian dimensi {tenantName} antar tahun.
                    </p>
                  </div>
                </div>

                <div
                  role="tablist"
                  aria-label="Pilih tahun Indeks Desa"
                  className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border self-start sm:self-auto"
                >
                  {availableYears.map((y) => {
                    const active = current.tahun === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedYear(y)}
                        className={`relative px-4 h-10 rounded-lg text-sm font-semibold transition-colors active:scale-[0.98] ${
                          active
                            ? "text-white"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="indeks-desa-year-pill"
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 420, damping: 34 }
                            }
                            className="absolute inset-0 rounded-lg bg-nagari-red shadow-xs"
                            aria-hidden="true"
                          />
                        )}
                        <span className="relative z-10 tabular-nums">
                          {y}
                          {latestYear === y ? " · Terbaru" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={current.tahun}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: isFetching ? 0.65 : 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE_ENTER }}
                className="space-y-10 md:space-y-14"
              >
                {/* SECTION 1: HERO SCORE & KPI SUMMARY */}
                <section
                  aria-label="Ringkasan status dan skor Indeks Desa"
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch"
                >
                  {/* Signature Navy Score Card with Animated Gauge + Tier Ladder */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.48, ease: EASE_ENTER }}
                    className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-nagari-navy text-white border border-white/10 p-6 md:p-7 flex flex-col justify-between gap-6 shadow-md"
                  >
                    {/* Subtle editorial corner glow */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-400/12 blur-3xl"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-24 -left-20 w-56 h-56 rounded-full bg-nagari-yellow/10 blur-3xl"
                    />

                    {/* Top Row: Score + Circular Progress Gauge */}
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-nagari-yellow tracking-wide uppercase mb-2">
                          <Award aria-hidden="true" size={14} />
                          <span>
                            {current.jenis === "idm"
                              ? `Skor IDM ${current.tahun}`
                              : `Indeks Desa ${current.tahun}`}
                          </span>
                        </div>

                        <p className="text-4xl sm:text-5xl font-serif font-bold tracking-tight tabular-nums leading-none">
                          <AnimatedScore
                            value={current.skor}
                            jenis={current.jenis}
                            reducedMotion={prefersReducedMotion}
                          />
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusBadgeStyle(
                              current.status
                            )}`}
                          >
                            <CheckCircle2 aria-hidden="true" size={13} />
                            <span>Nagari {current.status}</span>
                          </span>
                          {yoyScoreDelta !== null && previousRecord && (
                            <DeltaPill
                              delta={yoyScoreDelta}
                              jenis={current.jenis}
                              darkSurface
                              suffix={` vs ${previousRecord.tahun}`}
                            />
                          )}
                        </div>
                      </div>

                      <ScoreGaugeRing
                        percent={currentPercent}
                        reducedMotion={prefersReducedMotion}
                      />
                    </div>

                    {/* 5-Stage Kemandirian Progression Ladder */}
                    <div className="relative z-10 pt-5 border-t border-white/12 space-y-2.5">
                      <div className="flex items-center justify-between text-[12px] text-white/70">
                        <span>Tingkat Kemandirian Nasional</span>
                        <span className="font-semibold text-white/90">
                          Tahap {currentTierIndex + 1} dari 5
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5" role="list" aria-label="Tingkatan status desa">
                        {STATUS_TIERS.map((tier, i) => {
                          const reached = i <= currentTierIndex;
                          const isCurrent = i === currentTierIndex;
                          return (
                            <div key={tier.key} role="listitem" className="space-y-1.5">
                              <div className="h-1.5 rounded-full bg-white/12 overflow-hidden">
                                {reached && (
                                  <motion.div
                                    initial={prefersReducedMotion ? false : { scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      duration: 0.45,
                                      delay: 0.15 + i * 0.08,
                                      ease: EASE_ENTER,
                                    }}
                                    style={{ transformOrigin: "left center" }}
                                    className={`h-full rounded-full ${
                                      isCurrent
                                        ? "bg-emerald-400"
                                        : "bg-white/60"
                                    }`}
                                  />
                                )}
                              </div>
                              <p
                                className={`text-[10px] sm:text-[11px] leading-tight truncate ${
                                  isCurrent
                                    ? "text-emerald-300 font-semibold"
                                    : reached
                                      ? "text-white/75"
                                      : "text-white/40"
                                }`}
                                title={tier.label}
                              >
                                {tier.short}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* 3 Clean Metric Cards */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                    <MetricCard
                      title="Status & Target"
                      value={current.status}
                      sub={
                        current.status.toLowerCase().includes("mandiri")
                          ? "Peringkat kemandirian tertinggi nasional telah tercapai."
                          : current.target_status
                            ? `Target berikutnya: Nagari ${current.target_status}.`
                            : "Penilaian resmi Kemendes PDT."
                      }
                      badge={
                        current.status.toLowerCase().includes("mandiri")
                          ? "Tertinggi"
                          : `Target: ${current.target_status || "Maju"}`
                      }
                      icon={Target}
                      accentIndex={2}
                      delay={0.08}
                      reducedMotion={prefersReducedMotion}
                    />

                    {yoyScoreDelta !== null && previousRecord ? (
                      <MetricCard
                        title={`Perubahan vs ${previousRecord.tahun}`}
                        value={`${yoyScoreDelta > 0 ? "+" : ""}${formatScore(
                          yoyScoreDelta,
                          current.jenis
                        )}`}
                        sub={
                          yoyScoreDelta > 0
                            ? `Meningkat dari ${formatScore(previousRecord.skor, current.jenis)} pada tahun ${previousRecord.tahun}.`
                            : yoyScoreDelta < 0
                              ? `Terkoreksi dari ${formatScore(previousRecord.skor, current.jenis)} pada tahun ${previousRecord.tahun}.`
                              : `Stabil sama dengan capaian tahun ${previousRecord.tahun}.`
                        }
                        badge={
                          yoyScoreDelta > 0
                            ? "Meningkat"
                            : yoyScoreDelta < 0
                              ? "Perlu Evaluasi"
                              : "Stabil"
                        }
                        icon={TrendingUp}
                        accentIndex={0}
                        delay={0.14}
                        reducedMotion={prefersReducedMotion}
                      />
                    ) : (
                      <MetricCard
                        title="Ambang Minimal"
                        value={formatScore(
                          current.status.toLowerCase().includes("mandiri") &&
                            current.jenis === "indeks_desa"
                            ? 80
                            : current.skor_minimal,
                          current.jenis
                        )}
                        sub={
                          current.status.toLowerCase().includes("mandiri")
                            ? "Ambang status Mandiri terpenuhi."
                            : "Nilai acuan status target berikutnya."
                        }
                        badge="Standar PDT"
                        icon={TrendingUp}
                        accentIndex={0}
                        delay={0.14}
                        reducedMotion={prefersReducedMotion}
                      />
                    )}

                    <MetricCard
                      title="Dimensi Unggulan"
                      value={topDimension ? topDimension.short : "—"}
                      sub={
                        topDimension
                          ? `Capaian tertinggi dengan nilai ${formatScore(topDimension.raw, current.jenis)} dari 100.`
                          : "Belum ada rincian dimensi."
                      }
                      badge={
                        topDimension
                          ? `${formatScore(topDimension.percent, "indeks_desa")}%`
                          : undefined
                      }
                      icon={Layers}
                      accentIndex={1}
                      delay={0.2}
                      reducedMotion={prefersReducedMotion}
                    />
                  </div>
                </section>

                {/* SECTION 2: RADAR CHART + 6 DIMENSION BREAKDOWN */}
                {dimensionRows.length > 0 && (
                  <section
                    aria-label="Peta capaian dan rincian per dimensi"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                  >
                    {/* Left: Radar Chart */}
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, ease: EASE_ENTER }}
                      className="lg:col-span-5 flex"
                    >
                      <Card className="w-full bg-card border border-border rounded-2xl flex flex-col shadow-xs overflow-hidden">
                        <div className="p-6 md:p-7 border-b border-border">
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                              Peta Capaian Dimensi
                            </h2>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border tabular-nums">
                              {dimensionRows.length}{" "}
                              {current.jenis === "idm" ? "Pilar" : "Dimensi"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                            Keseimbangan capaian pembangunan {tenantName} tahun {current.tahun} pada skala 0–100.
                          </p>
                        </div>

                        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                          <div className="w-full h-[300px] sm:h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                data={dimensionRows}
                              >
                                <defs>
                                  <linearGradient
                                    id="radarAreaFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#1d8680"
                                      stopOpacity={0.38}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#b82026"
                                      stopOpacity={0.14}
                                    />
                                  </linearGradient>
                                </defs>
                                <PolarGrid
                                  stroke="hsl(var(--border))"
                                  strokeDasharray="3 3"
                                />
                                <PolarAngleAxis
                                  dataKey="short"
                                  tick={{
                                    fill: "hsl(var(--foreground))",
                                    fontSize: 12,
                                    fontWeight: 500,
                                  }}
                                />
                                <PolarRadiusAxis
                                  angle={30}
                                  domain={[0, 100]}
                                  tickCount={5}
                                  tick={{
                                    fill: "hsl(var(--muted-foreground))",
                                    fontSize: 10,
                                  }}
                                  axisLine={false}
                                />
                                <Radar
                                  name="Capaian"
                                  dataKey="percent"
                                  stroke="#1d8680"
                                  strokeWidth={2.5}
                                  fill="url(#radarAreaFill)"
                                  dot={{
                                    r: 4,
                                    fill: "#1d8680",
                                    stroke: "#ffffff",
                                    strokeWidth: 2,
                                  }}
                                  activeDot={{
                                    r: 6,
                                    fill: "#b82026",
                                    stroke: "#ffffff",
                                    strokeWidth: 2,
                                  }}
                                  isAnimationActive={!prefersReducedMotion}
                                  animationDuration={750}
                                />
                                <RechartsTooltip content={<CustomRadarTooltip />} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Interactive Highlight Strip */}
                          <div className="rounded-xl bg-muted/55 border border-border/80 px-4 py-3 flex items-center justify-between gap-3">
                            {activeDimDetail ? (
                              <>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate">
                                    {activeDimDetail.label}
                                  </p>
                                  <p className="text-[12px] text-muted-foreground truncate">
                                    {activeDimDetail.desc}
                                  </p>
                                </div>
                                <span className="text-sm font-serif font-bold text-secondary-ink tabular-nums shrink-0">
                                  {formatScore(activeDimDetail.raw, current.jenis)}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 min-w-0">
                                  <Sparkles
                                    aria-hidden="true"
                                    size={15}
                                    className="text-secondary-ink shrink-0"
                                  />
                                  <p className="text-xs text-muted-foreground truncate">
                                    {lowestDimension
                                      ? `Fokus penguatan berikutnya: ${lowestDimension.short} (${formatScore(lowestDimension.raw, current.jenis)})`
                                      : "Arahkan kursor pada dimensi untuk menyorot capaian."}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Right: Interactive Dimension Breakdown Cards */}
                    <motion.div
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: 0.08, ease: EASE_ENTER }}
                      className="lg:col-span-7 flex"
                    >
                      <Card className="w-full bg-card border border-border rounded-2xl flex flex-col shadow-xs">
                        <div className="p-6 md:p-7 border-b border-border flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                              Rincian Skor per Dimensi
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                              Nilai pembentuk {current.jenis === "idm" ? "IDM" : "Indeks Desa"} {tenantName}
                              {previousRecord ? ` dibandingkan tahun ${previousRecord.tahun}` : ""}.
                            </p>
                          </div>
                        </div>

                        <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-center">
                          <div className="space-y-3.5">
                            {dimensionRows.map((dim, idx) => {
                              const accent = accentByIndex(idx);
                              const Icon = dim.icon;
                              const isHovered = hoveredDim === dim.key;
                              const isDimmed = hoveredDim !== null && !isHovered;
                              const q = qualityTag(dim.percent);

                              return (
                                <motion.div
                                  key={dim.key}
                                  initial={
                                    prefersReducedMotion ? false : { opacity: 0, x: -8 }
                                  }
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true, amount: 0.2 }}
                                  transition={{
                                    duration: 0.38,
                                    delay: idx * 0.05,
                                    ease: EASE_ENTER,
                                  }}
                                  onMouseEnter={() => setHoveredDim(dim.key)}
                                  onMouseLeave={() => setHoveredDim(null)}
                                  className={`group rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
                                    isHovered
                                      ? "border-secondary/50 bg-muted/45 shadow-xs"
                                      : "border-border/75 bg-card hover:bg-muted/25"
                                  } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2.5">
                                    <div className="flex items-start gap-3 min-w-0">
                                      <span
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${accent.chip}`}
                                      >
                                        <Icon aria-hidden={true} size={18} />
                                      </span>
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="font-semibold text-foreground text-sm sm:text-[15px] leading-snug">
                                            {dim.label}
                                          </span>
                                          <span
                                            className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${q.tone}`}
                                          >
                                            {q.label}
                                          </span>
                                        </div>
                                        <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug">
                                          {dim.desc}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <span
                                        className={`text-sm sm:text-[15px] font-serif font-bold px-2.5 py-0.5 rounded-lg tabular-nums ${accent.chip}`}
                                      >
                                        {formatScore(dim.raw, current.jenis)}
                                      </span>
                                      {dim.delta !== null && (
                                        <DeltaPill
                                          delta={dim.delta}
                                          jenis={current.jenis}
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      initial={
                                        prefersReducedMotion ? false : { scaleX: 0 }
                                      }
                                      whileInView={{ scaleX: 1 }}
                                      viewport={{ once: true, amount: 0.2 }}
                                      transition={{
                                        duration: 0.65,
                                        delay: 0.1 + idx * 0.06,
                                        ease: EASE_ENTER,
                                      }}
                                      style={{
                                        width: `${Math.max(dim.percent, 2)}%`,
                                        transformOrigin: "left center",
                                      }}
                                      className={`h-full rounded-full ${accent.edge}`}
                                    />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </section>
                )}

                {/* SECTION 3: HISTORICAL SCORE TREND + YEAR MILESTONES */}
                {history.length >= 2 && (
                  <motion.section
                    aria-label="Perkembangan skor antar tahun"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, ease: EASE_ENTER }}
                  >
                    <Card className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
                      <div className="p-6 md:p-7 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                            Tren Kemajuan Antar Tahun
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">
                            Perkembangan skor kemandirian {tenantName} dari tahun{" "}
                            {history[0].tahun} hingga {history[history.length - 1].tahun}.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted border border-border text-foreground self-start sm:self-auto">
                          <TrendingUp aria-hidden="true" size={14} className="text-secondary-ink" />
                          <span>{history.length} Periode Tercatat</span>
                        </span>
                      </div>

                      <CardContent className="p-6 md:p-7 space-y-6">
                        <div className="w-full h-[260px] sm:h-[280px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={history}
                              margin={{ top: 14, right: 20, left: 0, bottom: 4 }}
                            >
                              <defs>
                                <linearGradient
                                  id="trendAreaGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#1d8680"
                                    stopOpacity={0.28}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#1d8680"
                                    stopOpacity={0.02}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="tahun"
                                tick={{
                                  fill: "hsl(var(--foreground))",
                                  fontSize: 13,
                                  fontWeight: 600,
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={false}
                                dy={6}
                              />
                              <YAxis
                                domain={trendYDomain}
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                                axisLine={false}
                                tickLine={false}
                                width={42}
                              />
                              <RechartsTooltip
                                content={<CustomTrendTooltip jenis={current.jenis} />}
                              />
                              <Area
                                type="monotone"
                                dataKey="skor"
                                stroke="#1d8680"
                                strokeWidth={3}
                                fill="url(#trendAreaGradient)"
                                dot={{
                                  r: 5,
                                  fill: "#ffffff",
                                  stroke: "#1d8680",
                                  strokeWidth: 3,
                                }}
                                activeDot={{
                                  r: 7,
                                  fill: "#b82026",
                                  stroke: "#ffffff",
                                  strokeWidth: 2.5,
                                }}
                                isAnimationActive={!prefersReducedMotion}
                                animationDuration={750}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Interactive Year-by-Year Milestone Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/70">
                          {history.map((item, idx) => {
                            const prev = idx > 0 ? history[idx - 1] : null;
                            const stepDelta =
                              prev && prev.jenis === item.jenis
                                ? Number(
                                    (item.skor - prev.skor).toFixed(
                                      item.jenis === "idm" ? 4 : 2
                                    )
                                  )
                                : null;
                            const isSelected = item.tahun === current.tahun;
                            return (
                              <button
                                key={item.tahun}
                                type="button"
                                onClick={() => setSelectedYear(item.tahun)}
                                className={`text-left rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 ${
                                  isSelected
                                    ? "border-nagari-red bg-nagari-red/5 ring-1 ring-nagari-red/25"
                                    : "border-border bg-muted/25 hover:bg-muted/50"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-xs font-bold text-muted-foreground tabular-nums">
                                    Tahun {item.tahun}
                                  </span>
                                  <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusPillLight(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2">
                                  <span className="text-xl font-serif font-bold text-foreground tabular-nums">
                                    {formatScore(item.skor, item.jenis)}
                                  </span>
                                  {stepDelta !== null && (
                                    <DeltaPill delta={stepDelta} jenis={item.jenis} />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.section>
                )}

                {/* SECTION 4: INDIKATOR & REKOMENDASI (DESKTOP TABLE + MOBILE CARDS) */}
                {current.indikator && current.indikator.length > 0 && (
                  <motion.section
                    aria-label="Rincian indikator dan rekomendasi"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, ease: EASE_ENTER }}
                  >
                    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
                      <div className="bg-nagari-navy text-white p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                            Rincian Indikator &amp; Rekomendasi {current.tahun}
                          </h2>
                          <p className="text-sm text-white/78 mt-1">
                            {current.indikator.length} rincian capaian dimensi beserta rekomendasi tindak lanjut pembangunan {tenantName}.
                          </p>
                        </div>
                        <div className="relative w-full lg:w-72">
                          <label htmlFor="indikator-search" className="sr-only">
                            Cari indikator Indeks Desa
                          </label>
                          <Search
                            aria-hidden="true"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
                          />
                          <Input
                            id="indikator-search"
                            value={indikatorSearch}
                            onChange={(e) => setIndikatorSearch(e.target.value)}
                            placeholder="Cari dimensi atau kegiatan..."
                            className="pl-10 pr-9 h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/40"
                          />
                          {indikatorSearch && (
                            <button
                              type="button"
                              aria-label="Hapus pencarian indikator"
                              onClick={() => setIndikatorSearch("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-white"
                            >
                              <X aria-hidden="true" size={15} />
                            </button>
                          )}
                        </div>
                      </div>

                      {indikatorDims.length > 1 && (
                        <div className="px-5 md:px-6 py-3.5 border-b border-border bg-muted/30 flex flex-wrap gap-2">
                          {["all", ...indikatorDims].map((d) => {
                            const active = indikatorDimFilter === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setIndikatorDimFilter(d)}
                                className={`relative px-3.5 h-9 rounded-lg text-[13px] font-semibold transition-colors ${
                                  active
                                    ? "text-white"
                                    : "bg-card text-foreground border border-border hover:bg-muted"
                                }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="indeks-dim-filter"
                                    transition={
                                      prefersReducedMotion
                                        ? { duration: 0 }
                                        : { type: "spring", stiffness: 450, damping: 35 }
                                    }
                                    className="absolute inset-0 rounded-lg bg-nagari-red"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="relative z-10">
                                  {d === "all" ? "Semua Dimensi" : d}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <CardContent className="p-0">
                        {filteredIndikator.length === 0 ? (
                          <div className="py-12 px-6 text-center space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">
                              Tidak ditemukan indikator yang cocok dengan pencarian Anda.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setIndikatorSearch("");
                                setIndikatorDimFilter("all");
                              }}
                              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors"
                            >
                              <X aria-hidden="true" size={13} />
                              <span>Reset Filter</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                              <Table className="min-w-[720px]">
                                <TableHeader>
                                  <TableRow className="border-b border-border bg-muted/20 hover:bg-muted/20">
                                    <TableHead className="w-[60px] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">
                                      No
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">
                                      Dimensi &amp; Indikator
                                    </TableHead>
                                    <TableHead className="w-[155px] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">
                                      Capaian Skor
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">
                                      Keterangan &amp; Rekomendasi
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4 pr-6">
                                      Pelaksana
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredIndikator.map((row, idx) => {
                                    const accent = accentByIndex(idx);
                                    const ratio =
                                      row.skor != null &&
                                      row.skor_maks != null &&
                                      row.skor_maks > 0
                                        ? Math.min(
                                            100,
                                            Math.max(0, (row.skor / row.skor_maks) * 100)
                                          )
                                        : null;

                                    return (
                                      <TableRow
                                        key={`${row.nama}-${idx}`}
                                        className="border-b border-border/75 hover:bg-muted/30 transition-colors"
                                      >
                                        <TableCell className="text-center font-semibold text-muted-foreground tabular-nums py-4">
                                          {String(idx + 1).padStart(2, "0")}
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <span
                                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1 ${accent.chip}`}
                                          >
                                            {row.dimensi}
                                          </span>
                                          <p className="text-sm font-semibold text-foreground leading-snug">
                                            {row.nama}
                                          </p>
                                        </TableCell>
                                        <TableCell className="py-4">
                                          <div className="flex flex-col items-center gap-1.5">
                                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-muted border border-border text-sm font-bold text-foreground tabular-nums">
                                              {row.skor ?? "—"}
                                              {row.skor_maks ? ` / ${row.skor_maks}` : ""}
                                            </span>
                                            {ratio !== null && (
                                              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                  style={{ width: `${ratio}%` }}
                                                  className={`h-full rounded-full ${accent.edge}`}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-muted-foreground max-w-md">
                                          {row.keterangan && (
                                            <p className="text-foreground font-medium leading-snug">
                                              {row.keterangan}
                                            </p>
                                          )}
                                          {row.kegiatan && (
                                            <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                                              <span className="font-semibold text-secondary-ink">
                                                Saran:
                                              </span>{" "}
                                              {row.kegiatan}
                                            </p>
                                          )}
                                        </TableCell>
                                        <TableCell className="py-4 pr-6">
                                          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-muted/80 text-foreground border border-border">
                                            {row.pelaksana || "—"}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Mobile Card Stack (Zero Horizontal Scroll) */}
                            <div className="md:hidden divide-y divide-border">
                              {filteredIndikator.map((row, idx) => {
                                const accent = accentByIndex(idx);
                                const ratio =
                                  row.skor != null &&
                                  row.skor_maks != null &&
                                  row.skor_maks > 0
                                    ? Math.min(
                                        100,
                                        Math.max(0, (row.skor / row.skor_maks) * 100)
                                      )
                                    : null;

                                return (
                                  <div key={`${row.nama}-${idx}`} className="p-4 space-y-2.5">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <span
                                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1 ${accent.chip}`}
                                        >
                                          {row.dimensi}
                                        </span>
                                        <p className="text-sm font-semibold text-foreground leading-snug">
                                          {row.nama}
                                        </p>
                                      </div>
                                      <span className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs font-bold text-foreground tabular-nums shrink-0">
                                        {row.skor ?? "—"}
                                        {row.skor_maks ? `/${row.skor_maks}` : ""}
                                      </span>
                                    </div>

                                    {ratio !== null && (
                                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                          style={{ width: `${ratio}%` }}
                                          className={`h-full rounded-full ${accent.edge}`}
                                        />
                                      </div>
                                    )}

                                    {row.keterangan && (
                                      <p className="text-[13px] text-foreground/90 leading-snug">
                                        {row.keterangan}
                                      </p>
                                    )}
                                    {row.kegiatan && (
                                      <p className="text-xs text-muted-foreground leading-snug">
                                        <span className="font-semibold text-secondary-ink">
                                          Saran:
                                        </span>{" "}
                                        {row.kegiatan}
                                      </p>
                                    )}
                                    {row.pelaksana && (
                                      <p className="text-[11px] font-medium text-muted-foreground">
                                        Pelaksana: <strong className="text-foreground">{row.pelaksana}</strong>
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.section>
                )}

                {/* SECTION 5: OFFICIAL SOURCE & LEGAL BASIS VERIFICATION STRIP */}
                {current.catatan && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, ease: EASE_ENTER }}
                  >
                    <Card className="bg-muted/40 border border-border rounded-2xl">
                      <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <ShieldCheck aria-hidden="true" size={20} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            Sumber Data &amp; Dasar Penetapan
                          </p>
                          <p className="text-sm md:text-[15px] text-foreground/90 leading-relaxed whitespace-pre-line">
                            {current.catatan}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
      <Footer />
    </PageBackground>
  );
}

function MetricCard({
  title,
  value,
  sub,
  badge,
  icon: Icon,
  accentIndex,
  delay = 0,
  reducedMotion = false,
}: {
  title: string;
  value: string;
  sub?: string;
  badge?: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  accentIndex: number;
  delay?: number;
  reducedMotion?: boolean;
}) {
  const accent = accentByIndex(accentIndex);
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_ENTER }}
      className="flex"
    >
      <Card
        className={`group w-full bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
      >
        <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
        <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${accent.chip}`}
            >
              <Icon aria-hidden={true} size={20} />
            </span>
            {badge && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${accent.chip}`}
              >
                {badge}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl md:text-[26px] font-serif font-bold text-foreground tabular-nums leading-tight">
              {value}
            </p>
            {sub && (
              <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
                {sub}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
