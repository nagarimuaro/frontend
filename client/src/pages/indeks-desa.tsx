import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  Info,
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

const SIX_DIMENSIONS: Array<{
  key: keyof NonNullable<ReturnType<typeof Object>>;
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
}> = [
  {
    key: "layanan_dasar" as never,
    field: "layanan_dasar",
    label: "Layanan Dasar",
    short: "Layanan Dasar",
    desc: "Pendidikan, kesehatan, air bersih, dan sanitasi dasar warga.",
  },
  {
    key: "sosial" as never,
    field: "sosial",
    label: "Sosial",
    short: "Sosial",
    desc: "Partisipasi sosial, keamanan, kelembagaan, dan gotong royong.",
  },
  {
    key: "ekonomi" as never,
    field: "ekonomi",
    label: "Ekonomi",
    short: "Ekonomi",
    desc: "Keragaman produksi lokal, pasar, logistik, dan akses perbankan.",
  },
  {
    key: "lingkungan" as never,
    field: "lingkungan",
    label: "Lingkungan",
    short: "Lingkungan",
    desc: "Pengelolaan sumber daya alam, kebersihan, dan tanggap bencana.",
  },
  {
    key: "aksesibilitas" as never,
    field: "aksesibilitas",
    label: "Aksesibilitas",
    short: "Aksesibilitas",
    desc: "Konektivitas jalan, transportasi, dan akses fasilitas publik.",
  },
  {
    key: "tata_kelola" as never,
    field: "tata_kelola",
    label: "Tata Kelola Pemerintahan",
    short: "Tata Kelola",
    desc: "Transparansi, akuntabilitas, dan efektivitas pelayanan nagari.",
  },
];

const THREE_PILLARS: Array<{
  field: "iks" | "ike" | "ikl";
  label: string;
  short: string;
  desc: string;
}> = [
  {
    field: "iks",
    label: "Indeks Ketahanan Sosial (IKS)",
    short: "IKS (Sosial)",
    desc: "Kesehatan, pendidikan, modal sosial, dan permukiman.",
  },
  {
    field: "ike",
    label: "Indeks Ketahanan Ekonomi (IKE)",
    short: "IKE (Ekonomi)",
    desc: "Keragaman produksi, perdagangan, distribusi, dan keterbukaan wilayah.",
  },
  {
    field: "ikl",
    label: "Indeks Ketahanan Lingkungan (IKL)",
    short: "IKL (Lingkungan)",
    desc: "Kualitas ekologi, potensi bencana, dan mitigasi bencana.",
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
    return Math.min(100, Math.max(0, Number((val * 100).toFixed(1))));
  }
  return Math.min(100, Math.max(0, Number(val.toFixed(1))));
}

function statusBadgeStyle(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("mandiri")) return "bg-emerald-500/20 text-emerald-200 border-emerald-400/35";
  if (s.includes("maju")) return "bg-sky-500/20 text-sky-200 border-sky-400/35";
  if (s.includes("berkembang")) return "bg-amber-500/20 text-amber-200 border-amber-400/35";
  return "bg-rose-500/20 text-rose-200 border-rose-400/35";
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

  const dimensionRows = useMemo(() => {
    if (!current) return [];
    const dim = current.dimensi || {};

    if (current.jenis === "idm") {
      return THREE_PILLARS.map((p) => {
        const raw = Number(dim[p.field] ?? 0);
        return {
          key: p.field,
          label: p.label,
          short: p.short,
          desc: p.desc,
          raw,
          percent: normalizePercent(raw, "idm"),
          hasValue: dim[p.field] !== undefined && dim[p.field] !== null,
        };
      }).filter((r) => r.hasValue);
    }

    return SIX_DIMENSIONS.map((d) => {
      const raw = Number(dim[d.field] ?? 0);
      return {
        key: d.field,
        label: d.label,
        short: d.short,
        desc: d.desc,
        raw,
        percent: normalizePercent(raw, "indeks_desa"),
        hasValue: dim[d.field] !== undefined && dim[d.field] !== null,
      };
    }).filter((r) => r.hasValue);
  }, [current]);

  const topDimension = useMemo(() => {
    if (dimensionRows.length === 0) return null;
    return [...dimensionRows].sort((a, b) => b.percent - a.percent)[0] ?? null;
  }, [dimensionRows]);

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

  const scoreGap =
    current && current.skor_minimal != null
      ? Number((current.skor_minimal - current.skor).toFixed(current.jenis === "idm" ? 4 : 2))
      : null;

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data Indeks Desa...
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
        description="Potret status kemandirian dan perkembangan nagari berdasarkan Indeks Desa (6 Dimensi Kemendes PDT) serta histori Indeks Desa Membangun."
        image={mapImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        {!current ? (
          <Card className="bg-card border border-border rounded-2xl p-10 md:p-14 text-center max-w-2xl mx-auto">
            <BarChart3
              aria-hidden="true"
              className="w-12 h-12 mx-auto text-muted-foreground mb-4"
            />
            <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
              Data Indeks Desa Belum Dipublikasikan
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Pemerintah {tenantName} belum mempublikasikan skor Indeks Desa / IDM pada portal ini. Data akan tampil otomatis segera setelah diperbarui oleh admin nagari.
            </p>
          </Card>
        ) : (
          <>
            {/* Year Selector Bar */}
            {availableYears.length > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                    <Calendar aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Tahun Penilaian Indeks Desa
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Pilih tahun untuk melihat capaian dan perkembangan antar periode.
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
                        className={`relative px-4 h-10 rounded-lg text-sm font-medium transition-colors active:scale-[0.985] ${
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
                                : { duration: 0.24, ease: EASE_UI }
                            }
                            className="absolute inset-0 rounded-lg bg-nagari-red"
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
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={current.tahun}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: isFetching ? 0.65 : 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_UI }}
                className="space-y-12"
              >
                {/* Bento KPI Summary */}
                <section
                  aria-label="Ringkasan status dan skor Indeks Desa"
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                >
                  {/* Navy Anchor Card */}
                  <div className="lg:col-span-5 rounded-2xl bg-nagari-navy text-white border border-border p-6 md:p-7 flex flex-col justify-between gap-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-medium text-nagari-yellow mb-2">
                          {current.jenis === "idm"
                            ? `Skor IDM Tahun ${current.tahun}`
                            : `Skor Indeks Desa ${current.tahun}`}
                        </p>
                        <p className="text-4xl md:text-5xl font-serif font-bold tracking-tight tabular-nums leading-none">
                          {formatScore(current.skor, current.jenis)}
                        </p>
                      </div>
                      <span className="w-11 h-11 rounded-xl bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                        <Award aria-hidden="true" size={22} />
                      </span>
                    </div>

                    <div className="pt-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[13px] text-white/75 mb-1">
                          Status Kemandirian
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-md border text-sm font-semibold ${statusBadgeStyle(
                            current.status
                          )}`}
                        >
                          Nagari {current.status}
                        </span>
                      </div>
                      <span className="text-[13px] text-white/75">
                        {current.jenis === "idm"
                          ? "3 Pilar (IKS · IKE · IKL)"
                          : "6 Dimensi Permendesa 9/2024"}
                      </span>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <MetricCard
                      title="Target Status"
                      value={current.target_status || current.status}
                      sub={
                        current.target_status && current.target_status !== current.status
                          ? "Tahap kemandirian berikutnya"
                          : "Status tertinggi tercapai"
                      }
                      icon={Target}
                      accentIndex={0}
                    />
                    <MetricCard
                      title="Skor Minimal Target"
                      value={formatScore(current.skor_minimal, current.jenis)}
                      sub={
                        scoreGap !== null
                          ? scoreGap > 0
                            ? `Selisih +${formatScore(scoreGap, current.jenis)} poin`
                            : "Ambang minimal terpenuhi"
                          : "Acuan ambang status"
                      }
                      icon={TrendingUp}
                      accentIndex={1}
                    />
                    <MetricCard
                      title="Dimensi Tertinggi"
                      value={topDimension ? topDimension.short : "—"}
                      sub={
                        topDimension
                          ? `Skor ${formatScore(topDimension.raw, current.jenis)}`
                          : "Belum ada rincian dimensi"
                      }
                      icon={Layers}
                      accentIndex={2}
                    />
                  </div>
                </section>

                {/* Radar Chart + Dimension Breakdown */}
                {dimensionRows.length > 0 && (
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <Card className="lg:col-span-5 bg-card border border-border rounded-2xl flex flex-col">
                      <div className="p-6 md:p-7 border-b border-border">
                        <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                          Peta Capaian Dimensi
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                          Visualisasi keseimbangan antar dimensi pada tahun {current.tahun}.
                        </p>
                      </div>
                      <CardContent className="p-4 sm:p-6 flex-1 flex items-center justify-center">
                        <div className="w-full h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="72%"
                              data={dimensionRows}
                            >
                              <PolarGrid stroke="hsl(var(--border))" />
                              <PolarAngleAxis
                                dataKey="short"
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 12,
                                }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={false}
                                axisLine={false}
                              />
                              <Radar
                                name="Capaian (%)"
                                dataKey="percent"
                                stroke="#b82026"
                                strokeWidth={2}
                                fill="#b82026"
                                fillOpacity={0.2}
                                isAnimationActive={!prefersReducedMotion}
                                animationDuration={550}
                              />
                              <RechartsTooltip
                                formatter={(value: number) => [
                                  `${value}%`,
                                  "Capaian",
                                ]}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-7 bg-card border border-border rounded-2xl flex flex-col">
                      <div className="p-6 md:p-7 border-b border-border">
                        <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                          Rincian Skor per Dimensi
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                          Nilai masing-masing dimensi pembentuk skor {current.jenis === "idm" ? "IDM" : "Indeks Desa"} {tenantName}.
                        </p>
                      </div>
                      <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-center">
                        <div className="space-y-5">
                          {dimensionRows.map((dim, idx) => {
                            const accent = accentByIndex(idx);
                            const isDimmed =
                              hoveredDim !== null && hoveredDim !== dim.key;
                            return (
                              <div
                                key={dim.key}
                                onMouseEnter={() => setHoveredDim(dim.key)}
                                onMouseLeave={() => setHoveredDim(null)}
                                className={`space-y-2 transition-opacity duration-150 ${
                                  isDimmed ? "opacity-55" : "opacity-100"
                                }`}
                              >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <div>
                                    <span className="font-semibold text-foreground text-sm md:text-base">
                                      {dim.label}
                                    </span>
                                    <p className="text-[13px] text-muted-foreground">
                                      {dim.desc}
                                    </p>
                                  </div>
                                  <span
                                    className={`text-sm font-semibold px-2.5 py-0.5 rounded-md tabular-nums shrink-0 ${accent.chip}`}
                                  >
                                    {formatScore(dim.raw, current.jenis)}
                                  </span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={
                                      prefersReducedMotion ? false : { scaleX: 0 }
                                    }
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      duration: 0.48,
                                      delay: idx * 0.045,
                                      ease: EASE_ENTER,
                                    }}
                                    style={{
                                      width: `${Math.max(dim.percent, 2)}%`,
                                      transformOrigin: "left center",
                                    }}
                                    className={`h-full rounded-full ${accent.edge}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Historical Score Trend */}
                {history.length >= 2 && (
                  <section>
                    <Card className="bg-card border border-border rounded-2xl">
                      <div className="p-6 md:p-7 border-b border-border">
                        <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                          Perkembangan Skor Antar Tahun
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">
                          Tren nilai kemandirian {tenantName} dari tahun {history[0].tahun} hingga {history[history.length - 1].tahun}.
                        </p>
                      </div>
                      <CardContent className="p-6 md:p-7">
                        <div className="w-full h-[260px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={history}
                              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                vertical={false}
                              />
                              <XAxis
                                dataKey="tahun"
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 13,
                                }}
                              />
                              <YAxis
                                tick={{
                                  fill: "hsl(var(--muted-foreground))",
                                  fontSize: 13,
                                }}
                              />
                              <RechartsTooltip
                                formatter={(value: number) => [value, "Skor"]}
                              />
                              <Area
                                type="monotone"
                                dataKey="skor"
                                stroke="#1d8680"
                                strokeWidth={2.5}
                                fill="#1d8680"
                                fillOpacity={0.14}
                                isAnimationActive={!prefersReducedMotion}
                                animationDuration={550}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Catatan Nagari */}
                {current.catatan && (
                  <Card className="bg-muted/45 border border-border rounded-2xl">
                    <CardContent className="p-6 flex items-start gap-3.5">
                      <Info
                        aria-hidden="true"
                        size={18}
                        className="text-nagari-red-ink mt-0.5 shrink-0"
                      />
                      <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
                        {current.catatan}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Indikator & Rekomendasi Table */}
                {current.indikator && current.indikator.length > 0 && (
                  <section>
                    <Card className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="bg-nagari-navy text-white p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-serif font-bold text-white">
                            Rincian Indikator &amp; Rekomendasi {current.tahun}
                          </h2>
                          <p className="text-sm text-white/80 mt-1">
                            {current.indikator.length} indikator penilaian dan saran tindak lanjut pembangunan nagari.
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
                            placeholder="Cari indikator atau kegiatan..."
                            className="pl-10 pr-9 h-11 rounded-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
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
                        <div className="px-6 py-3.5 border-b border-border bg-muted/35 flex flex-wrap gap-2">
                          {["all", ...indikatorDims].map((d) => {
                            const active = indikatorDimFilter === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setIndikatorDimFilter(d)}
                                className={`px-3 h-9 rounded-lg text-[13px] font-medium border transition-colors ${
                                  active
                                    ? "bg-nagari-red text-white border-nagari-red"
                                    : "bg-card text-foreground border-border hover:bg-muted"
                                }`}
                              >
                                {d === "all" ? "Semua Dimensi" : d}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table className="min-w-[720px]">
                            <TableHeader>
                              <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="w-[56px] text-center text-[13px] font-semibold text-muted-foreground py-4">
                                  No
                                </TableHead>
                                <TableHead className="text-[13px] font-semibold text-muted-foreground py-4">
                                  Dimensi &amp; Indikator
                                </TableHead>
                                <TableHead className="text-center text-[13px] font-semibold text-muted-foreground py-4">
                                  Skor
                                </TableHead>
                                <TableHead className="text-[13px] font-semibold text-muted-foreground py-4">
                                  Keterangan / Rekomendasi
                                </TableHead>
                                <TableHead className="text-[13px] font-semibold text-muted-foreground py-4 pr-6">
                                  Pelaksana
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredIndikator.map((row, idx) => (
                                <TableRow
                                  key={`${row.nama}-${idx}`}
                                  className="border-b border-border hover:bg-muted/35"
                                >
                                  <TableCell className="text-center font-semibold text-muted-foreground tabular-nums py-4">
                                    {String(idx + 1).padStart(2, "0")}
                                  </TableCell>
                                  <TableCell className="py-4">
                                    <p className="text-[13px] font-semibold text-nagari-red-ink">
                                      {row.dimensi}
                                    </p>
                                    <p className="text-sm font-medium text-foreground mt-0.5">
                                      {row.nama}
                                    </p>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <span className="inline-block px-2.5 py-1 rounded-md bg-muted border border-border text-sm font-semibold text-foreground tabular-nums">
                                      {row.skor ?? "—"}
                                      {row.skor_maks ? ` / ${row.skor_maks}` : ""}
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-4 text-sm text-muted-foreground">
                                    {row.keterangan && (
                                      <p className="text-foreground/90">{row.keterangan}</p>
                                    )}
                                    {row.kegiatan && (
                                      <p className="text-[13px] mt-1">
                                        Rekomendasi: {row.kegiatan}
                                      </p>
                                    )}
                                  </TableCell>
                                  <TableCell className="py-4 pr-6 text-[13px] font-medium text-foreground">
                                    {row.pelaksana || "—"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
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
  icon: Icon,
  accentIndex,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  accentIndex: number;
}) {
  const accent = accentByIndex(accentIndex);
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
      <CardContent className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-4">
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.chip}`}
        >
          <Icon aria-hidden={true} size={20} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-serif font-bold text-foreground tabular-nums leading-snug">
            {value}
          </p>
          {sub && (
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">
              {sub}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
