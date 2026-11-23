import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Users,
  Building2,
  Map as MapIcon,
  TrendingUp,
  Loader2,
  BarChart3,
  ChevronRight,
  Wallet,
  GraduationCap,
  Briefcase,
  PieChart as PieChartIcon,
  ArrowUpRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useDataOverview,
  useNagariStats,
  useNagariProfile,
  useKeuanganNagari,
} from "@/lib/api";
import { accentByIndex } from "@/lib/accents";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import statsImage from "@assets/generated_images/digital_map_of_village.png";

type TabId = "population" | "education" | "jobs" | "budget";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}> = [
  { id: "population", label: "Demografi Penduduk", icon: Users },
  { id: "education", label: "Tingkat Pendidikan", icon: GraduationCap },
  { id: "jobs", label: "Profesi & Pekerjaan", icon: Briefcase },
  { id: "budget", label: "Transparansi APB", icon: Wallet },
];

// Calibrated categorical hex palette matching --cat-1..6 (no purple/neon)
const CHART_HEX = [
  "#1d8680", // teal
  "#24599e", // blue
  "#237153", // moss
  "#976316", // ochre
  "#a33b29", // terracotta
  "#37539f", // slate-blue
];

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatCompactRupiah = (amount: number) => {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 2,
    })} M`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} Jt`;
  }
  return formatRupiah(amount);
};

function useCountUp(target: number, disabled: boolean, durationMs = 700): number {
  const [value, setValue] = useState(disabled ? target : 0);

  useEffect(() => {
    if (disabled || target <= 0) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, disabled, durationMs]);

  return value;
}

export default function PublicData() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeTab, setActiveTab] = useState<TabId>("population");
  const [hoveredGender, setHoveredGender] = useState<number | null>(null);
  const [hoveredEdu, setHoveredEdu] = useState<string | null>(null);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [hoveredExpense, setHoveredExpense] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const { data: overviewResponse, isLoading: loadingOverview } = useDataOverview();
  const { data: statsResponse, isLoading: loadingStats } = useNagariStats();
  const { data: profileResponse, isLoading: loadingProfile } = useNagariProfile();
  const { data: keuanganResponse, isLoading: loadingKeuangan } = useKeuanganNagari();

  const overview = overviewResponse?.data;
  const stats = statsResponse?.data;
  const profile = profileResponse?.data;
  const keuangan = keuanganResponse?.data;

  const isLoading = loadingOverview || loadingStats || loadingProfile || loadingKeuangan;

  const male = Number(stats?.jumlah_laki_laki || overview?.jumlah_laki_laki || 0);
  const female = Number(stats?.jumlah_perempuan || overview?.jumlah_perempuan || 0);
  const genderSum = male + female;
  const totalPopulation = Number(
    stats?.jumlah_penduduk || overview?.jumlah_penduduk || genderSum || 0
  );
  const families = Number(overview?.jumlah_kk || stats?.jumlah_kk || 0);

  const genderBase = genderSum > 0 ? genderSum : totalPopulation;
  const malePercent =
    genderBase > 0 ? Number(((male / genderBase) * 100).toFixed(1)) : 0;
  const femalePercent =
    genderBase > 0 ? Number(((female / genderBase) * 100).toFixed(1)) : 0;
  const sexRatio = female > 0 ? Math.round((male / female) * 100) : null;

  const avgHousehold =
    families > 0 && totalPopulation > 0
      ? (totalPopulation / families).toLocaleString("id-ID", {
          maximumFractionDigits: 1,
        })
      : null;

  const areaSizeRaw = profile?.luas_wilayah || overview?.luas_wilayah || null;
  const areaNumeric = areaSizeRaw
    ? parseFloat(String(areaSizeRaw).replace(",", ".").replace(/[^0-9.]/g, ""))
    : NaN;
  const density =
    Number.isFinite(areaNumeric) && areaNumeric > 0 && totalPopulation > 0
      ? Math.round(totalPopulation / areaNumeric)
      : null;

  const education = Array.isArray(stats?.education) ? stats.education : [];
  const jobs = Array.isArray(stats?.jobs) ? stats.jobs : [];
  const ageGroups = Array.isArray(stats?.age_groups) ? stats.age_groups : [];

  const rawBudget = Number(
    keuangan?.totalBelanja ||
      keuangan?.totalIncome ||
      overview?.total_anggaran ||
      overview?.total_belanja ||
      overview?.total_pendapatan ||
      0
  );
  const budgetYear = keuangan?.year || overview?.tahun_anggaran || overview?.tahun;
  const budgetLabel = rawBudget > 0 ? formatCompactRupiah(rawBudget) : "—";

  const animatedPopulation = useCountUp(totalPopulation, prefersReducedMotion);
  const animatedFamilies = useCountUp(families, prefersReducedMotion);

  // Derived real insights
  const genderChartData = useMemo(
    () => [
      { name: "Laki-laki", value: male, percent: malePercent, color: CHART_HEX[1] },
      { name: "Perempuan", value: female, percent: femalePercent, color: CHART_HEX[0] },
    ],
    [male, female, malePercent, femalePercent]
  );

  const ageInsights = useMemo(() => {
    if (ageGroups.length === 0) return { dominant: null, productivePercent: null };
    const dominant = [...ageGroups].sort((a, b) => b.count - a.count)[0] ?? null;
    const productive = ageGroups
      .filter((g) => /18|36|dewasa|produktif/i.test(g.label))
      .reduce((acc, g) => acc + Number(g.value || 0), 0);
    return {
      dominant,
      productivePercent: productive > 0 ? Number(productive.toFixed(1)) : null,
    };
  }, [ageGroups]);

  const eduInsights = useMemo(() => {
    if (education.length === 0) {
      return { top: null, higherEdCount: 0, higherEdPercent: 0, totalCount: 0, maxVal: 100 };
    }
    const totalCount = education.reduce((acc, item) => acc + (item.count || 0), 0);
    const higherEdCount = education
      .filter((item) => /diploma|strata|sarjana|akademi|s1|s2|s3/i.test(item.name))
      .reduce((acc, item) => acc + (item.count || 0), 0);
    const higherEdPercent =
      totalCount > 0 ? Number(((higherEdCount / totalCount) * 100).toFixed(1)) : 0;
    const maxVal = Math.max(...education.map((i) => Number(i.value || 0)), 1);
    return {
      top: education[0],
      higherEdCount,
      higherEdPercent,
      totalCount,
      maxVal,
    };
  }, [education]);

  const jobSegments = useMemo(() => {
    if (jobs.length === 0) return [];
    const topFive = jobs.slice(0, 5).map((item, idx) => ({
      name: item.name,
      value: item.value,
      count: item.count,
      hex: CHART_HEX[idx % CHART_HEX.length],
      edgeClass: accentByIndex(idx).edge,
    }));
    const rest = jobs.slice(5);
    const restVal = Number(
      rest.reduce((acc, item) => acc + Number(item.value || 0), 0).toFixed(1)
    );
    const restCount = rest.reduce((acc, item) => acc + Number(item.count || 0), 0);
    if (restVal > 0) {
      topFive.push({
        name: "Profesi Lainnya",
        value: restVal,
        count: restCount,
        hex: CHART_HEX[5],
        edgeClass: accentByIndex(5).edge,
      });
    }
    return topFive;
  }, [jobs]);

  const expenseChartData = useMemo(() => {
    if (!keuangan?.expenseData) return [];
    return keuangan.expenseData.map((item, idx) => ({
      ...item,
      color: CHART_HEX[idx % CHART_HEX.length],
    }));
  }, [keuangan]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(TABS[(currentIndex + 1) % TABS.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(TABS[(currentIndex - 1 + TABS.length) % TABS.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(TABS[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(TABS[TABS.length - 1].id);
    }
  };

  const jumpToBudgetTab = () => {
    setActiveTab("budget");
    tabsRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] gap-3">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data statistik nagari...
          </span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  const activeGenderDatum =
    hoveredGender !== null ? genderChartData[hoveredGender] : null;
  const activeExpenseDatum =
    hoveredExpense !== null ? expenseChartData[hoveredExpense] : null;

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Data Publik & Statistik"
        description="Statistik kependudukan, pendidikan, mata pencaharian, dan transparansi anggaran yang disinkronisasi langsung dari basis data resmi nagari."
        image={statsImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        {/* Bento Key Metrics */}
        <section aria-label="Ringkasan angka utama nagari">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Anchor Navy Card: Total Penduduk + Gender Split */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_ENTER }}
              className="lg:col-span-5 rounded-2xl bg-nagari-navy text-white border border-border p-6 md:p-7 flex flex-col justify-between gap-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-nagari-yellow mb-2">
                    Penduduk Aktif Tercatat
                  </p>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <p className="text-4xl md:text-5xl font-serif font-bold tracking-tight tabular-nums leading-none">
                      {totalPopulation > 0
                        ? animatedPopulation.toLocaleString("id-ID")
                        : "—"}
                    </p>
                    {totalPopulation > 0 && (
                      <span className="text-sm font-medium text-white/75">
                        Jiwa
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-11 h-11 rounded-xl bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                  <Users aria-hidden="true" size={22} />
                </span>
              </div>

              {genderBase > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/12">
                  <div
                    className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden flex gap-0.5"
                    aria-hidden="true"
                  >
                    <motion.div
                      initial={prefersReducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.65, delay: 0.15, ease: EASE_ENTER }}
                      style={{
                        width: `${malePercent}%`,
                        transformOrigin: "left center",
                      }}
                      className="h-full bg-nagari-yellow rounded-l-full"
                    />
                    <motion.div
                      initial={prefersReducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.65, delay: 0.25, ease: EASE_ENTER }}
                      style={{
                        width: `${femalePercent}%`,
                        transformOrigin: "left center",
                      }}
                      className="h-full bg-white/70 rounded-r-full"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[13px] tabular-nums">
                    <span className="inline-flex items-center gap-2 text-white/90">
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full bg-nagari-yellow shrink-0"
                      />
                      Laki-laki {malePercent}%
                    </span>
                    <span className="inline-flex items-center gap-2 text-white/80">
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full bg-white/70 shrink-0"
                      />
                      Perempuan {femalePercent}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 3 Complementary KPI Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <MetricTile
                title="Kepala Keluarga"
                value={families > 0 ? animatedFamilies.toLocaleString("id-ID") : "—"}
                unit={families > 0 ? "KK" : undefined}
                caption={avgHousehold ? `Rata-rata ${avgHousehold} jiwa/KK` : undefined}
                icon={Building2}
                accentIndex={1}
                delay={0.06}
                reducedMotion={prefersReducedMotion}
              />

              <MetricTile
                title="Luas Wilayah"
                value={areaSizeRaw ? String(areaSizeRaw) : "—"}
                unit={
                  areaSizeRaw && !String(areaSizeRaw).toLowerCase().includes("km")
                    ? "km²"
                    : undefined
                }
                caption={
                  density ? `Kepadatan ~${density.toLocaleString("id-ID")} jiwa/km²` : undefined
                }
                icon={MapIcon}
                accentIndex={2}
                delay={0.12}
                reducedMotion={prefersReducedMotion}
              />

              <MetricTile
                title="Anggaran Nagari"
                value={budgetLabel}
                unit={
                  rawBudget > 0 ? (budgetYear ? `APB ${budgetYear}` : "APB") : undefined
                }
                caption={rawBudget > 0 ? "Lihat rincian APB" : "Belum dipublikasikan"}
                icon={TrendingUp}
                accentIndex={3}
                delay={0.18}
                reducedMotion={prefersReducedMotion}
                onClick={rawBudget > 0 ? jumpToBudgetTab : undefined}
              />
            </div>
          </div>
        </section>

        {/* Interactive Tabbed Exploration */}
        <section ref={tabsRef} className="space-y-8 scroll-mt-24">
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Kategori data statistik nagari"
              className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-xl bg-card border border-border"
            >
              {TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    className={`relative px-4 h-11 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red ${
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="public-data-tab-indicator"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 0.24, ease: EASE_UI }
                        }
                        className="absolute inset-0 rounded-lg bg-nagari-red"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Icon aria-hidden={true} size={16} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* TAB 1: DEMOGRAFI PENDUDUK */}
            {activeTab === "population" && (
              <motion.div
                key="population"
                role="tabpanel"
                id="panel-population"
                aria-labelledby="tab-population"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_UI }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Gender Donut + Interactive Cards */}
                <Card className="lg:col-span-5 bg-card border border-border rounded-2xl flex flex-col">
                  <div className="p-6 md:p-7 border-b border-border flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                        Komposisi Jenis Kelamin
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Arahkan kursor pada grafik untuk menyorot kategori.
                      </p>
                    </div>
                    {sexRatio !== null && (
                      <span className="text-[13px] font-semibold px-3 py-1 rounded-md bg-muted text-foreground border border-border whitespace-nowrap tabular-nums">
                        Rasio {sexRatio}:100
                      </span>
                    )}
                  </div>
                  <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-between gap-6">
                    {totalPopulation === 0 ? (
                      <EmptyDataState message="Data komposisi penduduk belum tersedia." />
                    ) : (
                      <>
                        <div className="relative h-56 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={genderChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={64}
                                outerRadius={92}
                                paddingAngle={3}
                                stroke="none"
                                isAnimationActive={!prefersReducedMotion}
                                animationDuration={550}
                                animationEasing="ease-out"
                                onMouseEnter={(_, idx) => setHoveredGender(idx)}
                                onMouseLeave={() => setHoveredGender(null)}
                              >
                                {genderChartData.map((entry, idx) => (
                                  <Cell
                                    key={entry.name}
                                    fill={entry.color}
                                    fillOpacity={
                                      hoveredGender === null || hoveredGender === idx
                                        ? 1
                                        : 0.3
                                    }
                                    style={{
                                      cursor: "pointer",
                                      transition: "fill-opacity 150ms ease",
                                    }}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>

                          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                            <span className="text-[13px] font-medium text-muted-foreground">
                              {activeGenderDatum ? activeGenderDatum.name : "Total Aktif"}
                            </span>
                            <span className="text-2xl font-serif font-bold text-foreground tabular-nums mt-0.5">
                              {activeGenderDatum
                                ? `${activeGenderDatum.percent}%`
                                : totalPopulation.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[13px] text-muted-foreground tabular-nums">
                              {activeGenderDatum
                                ? `${activeGenderDatum.value.toLocaleString("id-ID")} jiwa`
                                : "Jiwa"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {genderChartData.map((item, idx) => {
                            const isHighlighted = hoveredGender === idx;
                            const isDimmed = hoveredGender !== null && hoveredGender !== idx;
                            return (
                              <button
                                key={item.name}
                                type="button"
                                onMouseEnter={() => setHoveredGender(idx)}
                                onMouseLeave={() => setHoveredGender(null)}
                                onFocus={() => setHoveredGender(idx)}
                                onBlur={() => setHoveredGender(null)}
                                className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                                  isHighlighted
                                    ? "bg-muted border-foreground/25"
                                    : "bg-muted/40 border-border hover:bg-muted/70"
                                } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span
                                    aria-hidden="true"
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-[13px] font-medium text-muted-foreground">
                                    {item.name}
                                  </span>
                                </div>
                                <p className="text-xl font-serif font-bold text-foreground tabular-nums leading-tight">
                                  {item.value.toLocaleString("id-ID")}
                                </p>
                                <p className="text-[13px] font-semibold text-muted-foreground tabular-nums mt-0.5">
                                  {item.percent}% dari total
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Age Groups Breakdown */}
                <Card className="lg:col-span-7 bg-card border border-border rounded-2xl flex flex-col">
                  <div className="p-6 md:p-7 border-b border-border flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                        Sebaran Kelompok Usia
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Distribusi warga berdasarkan rentang umur pada basis data kependudukan.
                      </p>
                    </div>
                    {ageInsights.productivePercent !== null && (
                      <div className="px-3.5 py-2 rounded-xl bg-muted/60 border border-border shrink-0">
                        <p className="text-[13px] text-muted-foreground">
                          Usia Produktif (18–59)
                        </p>
                        <p className="text-lg font-serif font-bold text-foreground tabular-nums">
                          {ageInsights.productivePercent}%
                        </p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-center">
                    {ageGroups.length === 0 ? (
                      <EmptyDataState message="Rincian sebaran kelompok usia belum dipublikasikan untuk nagari ini." />
                    ) : (
                      <div className="space-y-5">
                        {ageGroups.map((group, idx) => {
                          const isDominant =
                            ageInsights.dominant?.label === group.label;
                          const accent = accentByIndex(idx);
                          return (
                            <AnimatedBarRow
                              key={group.label}
                              label={group.label}
                              badge={isDominant ? "Kelompok Terbesar" : undefined}
                              badgeClass={accent.chip}
                              valueLabel={`${group.count.toLocaleString("id-ID")} jiwa (${group.value}%)`}
                              percent={group.value}
                              barClass={accent.edge}
                              index={idx}
                              reducedMotion={prefersReducedMotion}
                            />
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TAB 2: TINGKAT PENDIDIKAN */}
            {activeTab === "education" && (
              <motion.div
                key="education"
                role="tabpanel"
                id="panel-education"
                aria-labelledby="tab-education"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_UI }}
                className="space-y-6"
              >
                {education.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InsightCard
                      label="Kategori Terbanyak"
                      value={eduInsights.top?.name || "—"}
                      sub={
                        eduInsights.top
                          ? `${eduInsights.top.count.toLocaleString("id-ID")} jiwa (${eduInsights.top.value}%)`
                          : undefined
                      }
                      accentIndex={0}
                    />
                    <InsightCard
                      label="Pendidikan Tinggi (D1–S3)"
                      value={`${eduInsights.higherEdCount.toLocaleString("id-ID")} jiwa`}
                      sub={`${eduInsights.higherEdPercent}% dari warga tercatat`}
                      accentIndex={1}
                    />
                    <InsightCard
                      label="Total Data Pendidikan"
                      value={`${eduInsights.totalCount.toLocaleString("id-ID")} jiwa`}
                      sub={`${education.length} kategori jenjang`}
                      accentIndex={2}
                    />
                  </div>
                )}

                <Card className="bg-card border border-border rounded-2xl">
                  <div className="p-6 md:p-7 border-b border-border">
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                      Peringkat Tingkat Pendidikan Penduduk
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Panjang batang diskalakan terhadap kategori terbesar agar perbandingan antar jenjang mudah dibaca.
                    </p>
                  </div>
                  <CardContent className="p-6 md:p-7">
                    {education.length === 0 ? (
                      <EmptyDataState message="Data statistik tingkat pendidikan belum dipublikasikan." />
                    ) : (
                      <div className="divide-y divide-border">
                        {education.map((item, idx) => {
                          const accent = accentByIndex(idx);
                          const scaledWidth = Math.max(
                            4,
                            (Number(item.value || 0) / eduInsights.maxVal) * 100
                          );
                          const isDimmed =
                            hoveredEdu !== null && hoveredEdu !== item.name;
                          return (
                            <div
                              key={item.name}
                              onMouseEnter={() => setHoveredEdu(item.name)}
                              onMouseLeave={() => setHoveredEdu(null)}
                              className={`py-4 first:pt-0 last:pb-0 transition-opacity duration-150 ${
                                isDimmed ? "opacity-55" : "opacity-100"
                              }`}
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-[13px] font-semibold text-muted-foreground tabular-nums w-6 shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <span className="font-medium text-foreground text-sm md:text-base">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-foreground tabular-nums">
                                  {item.count.toLocaleString("id-ID")} jiwa
                                  <span className="text-muted-foreground font-medium ml-1.5">
                                    ({item.value}%)
                                  </span>
                                </span>
                              </div>
                              <div className="pl-9">
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={
                                      prefersReducedMotion ? false : { scaleX: 0 }
                                    }
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      duration: 0.48,
                                      delay: Math.min(idx * 0.035, 0.35),
                                      ease: EASE_ENTER,
                                    }}
                                    style={{
                                      width: `${scaledWidth}%`,
                                      transformOrigin: "left center",
                                    }}
                                    className={`h-full rounded-full ${accent.edge}`}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TAB 3: PROFESI & PEKERJAAN */}
            {activeTab === "jobs" && (
              <motion.div
                key="jobs"
                role="tabpanel"
                id="panel-jobs"
                aria-labelledby="tab-jobs"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_UI }}
                className="space-y-6"
              >
                <Card className="bg-card border border-border rounded-2xl">
                  <div className="p-6 md:p-7 border-b border-border">
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                      Profesi &amp; Mata Pencaharian Penduduk
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Komposisi 5 kategori profesi utama beserta seluruh rincian pekerjaan warga tercatat.
                    </p>
                  </div>

                  <CardContent className="p-6 md:p-7 space-y-8">
                    {jobs.length === 0 ? (
                      <EmptyDataState message="Data statistik pekerjaan penduduk belum dipublikasikan." />
                    ) : (
                      <>
                        {/* Stacked Proportional Horizon Strip */}
                        <div className="space-y-3">
                          <div className="h-4 w-full rounded-full overflow-hidden flex gap-0.5 bg-muted p-0.5 border border-border">
                            {jobSegments.map((seg, idx) => {
                              const isDimmed =
                                hoveredJob !== null && hoveredJob !== seg.name;
                              return (
                                <motion.button
                                  key={seg.name}
                                  type="button"
                                  aria-label={`${seg.name}: ${seg.count.toLocaleString("id-ID")} jiwa (${seg.value}%)`}
                                  onMouseEnter={() => setHoveredJob(seg.name)}
                                  onMouseLeave={() => setHoveredJob(null)}
                                  onFocus={() => setHoveredJob(seg.name)}
                                  onBlur={() => setHoveredJob(null)}
                                  initial={
                                    prefersReducedMotion ? false : { scaleX: 0 }
                                  }
                                  animate={{ scaleX: 1 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: idx * 0.05,
                                    ease: EASE_ENTER,
                                  }}
                                  style={{
                                    width: `${Math.max(seg.value, 2)}%`,
                                    transformOrigin: "left center",
                                  }}
                                  className={`h-full first:rounded-l-full last:rounded-r-full transition-opacity duration-150 ${seg.edgeClass} ${
                                    isDimmed ? "opacity-30" : "opacity-100"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
                            {jobSegments.map((seg) => {
                              const isHighlighted = hoveredJob === seg.name;
                              return (
                                <button
                                  key={seg.name}
                                  type="button"
                                  onMouseEnter={() => setHoveredJob(seg.name)}
                                  onMouseLeave={() => setHoveredJob(null)}
                                  className={`inline-flex items-center gap-2 transition-colors ${
                                    isHighlighted
                                      ? "text-foreground font-semibold"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${seg.edgeClass}`}
                                  />
                                  <span>{seg.name}</span>
                                  <span className="tabular-nums font-medium">
                                    {seg.value}%
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive 2-Column Ranked Cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {jobs.map((job, idx) => {
                            const accent = accentByIndex(idx);
                            const maxJobVal = Math.max(jobs[0]?.value || 1, 1);
                            const barWidth = Math.max(
                              5,
                              (Number(job.value || 0) / maxJobVal) * 100
                            );
                            const isHighlighted = hoveredJob === job.name;
                            const isDimmed =
                              hoveredJob !== null &&
                              hoveredJob !== job.name &&
                              !(hoveredJob === "Profesi Lainnya" && idx >= 5);

                            return (
                              <div
                                key={job.name}
                                onMouseEnter={() => setHoveredJob(job.name)}
                                onMouseLeave={() => setHoveredJob(null)}
                                className={`p-4 rounded-xl border transition-all duration-150 ${
                                  isHighlighted
                                    ? "bg-muted/80 border-foreground/25"
                                    : "bg-muted/35 border-border hover:border-foreground/20"
                                } ${isDimmed ? "opacity-55" : "opacity-100"}`}
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="min-w-0">
                                    <p className="font-semibold text-foreground text-sm truncate">
                                      {job.name}
                                    </p>
                                    <p className="text-[13px] text-muted-foreground tabular-nums mt-0.5">
                                      {job.count.toLocaleString("id-ID")} jiwa
                                    </p>
                                  </div>
                                  <span
                                    className={`text-[13px] font-semibold px-2.5 py-0.5 rounded-md tabular-nums shrink-0 ${accent.chip}`}
                                  >
                                    {job.value}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                                  <motion.div
                                    initial={
                                      prefersReducedMotion ? false : { scaleX: 0 }
                                    }
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                      duration: 0.45,
                                      delay: Math.min(idx * 0.03, 0.3),
                                      ease: EASE_ENTER,
                                    }}
                                    style={{
                                      width: `${barWidth}%`,
                                      transformOrigin: "left center",
                                    }}
                                    className={`h-full rounded-full ${accent.edge}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TAB 4: TRANSPARANSI APB */}
            {activeTab === "budget" && (
              <motion.div
                key="budget"
                role="tabpanel"
                id="panel-budget"
                aria-labelledby="tab-budget"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_UI }}
                className="space-y-6"
              >
                {keuangan && (keuangan.totalIncome > 0 || keuangan.totalBelanja > 0) ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <InsightCard
                        label={`Total Pendapatan APB ${keuangan.year}`}
                        value={formatRupiah(keuangan.totalIncome)}
                        sub={`${keuangan.incomeData.length} sumber penerimaan`}
                        accentIndex={0}
                      />
                      <InsightCard
                        label={`Total Belanja APB ${keuangan.year}`}
                        value={formatRupiah(keuangan.totalBelanja)}
                        sub={`${keuangan.expenseData.length} bidang prioritas`}
                        accentIndex={1}
                      />
                      <InsightCard
                        label="Pembiayaan Netto"
                        value={formatRupiah(keuangan.financing || 0)}
                        sub="SiLPA & pembiayaan tahun berjalan"
                        accentIndex={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Expense Donut + Interactive Legend */}
                      <Card className="lg:col-span-6 bg-card border border-border rounded-2xl flex flex-col">
                        <div className="p-6 md:p-7 border-b border-border flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                              Alokasi Belanja per Bidang
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">
                              Proporsi belanja APB Nagari Tahun {keuangan.year}.
                            </p>
                          </div>
                          <span className="w-9 h-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                            <PieChartIcon aria-hidden="true" size={18} />
                          </span>
                        </div>
                        <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-between gap-6">
                          {expenseChartData.length === 0 ? (
                            <EmptyDataState message="Rincian belanja per bidang belum tersedia." />
                          ) : (
                            <>
                              <div className="relative h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={expenseChartData}
                                      dataKey="value"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={64}
                                      outerRadius={92}
                                      paddingAngle={2}
                                      stroke="none"
                                      isAnimationActive={!prefersReducedMotion}
                                      animationDuration={550}
                                      animationEasing="ease-out"
                                      onMouseEnter={(_, idx) => setHoveredExpense(idx)}
                                      onMouseLeave={() => setHoveredExpense(null)}
                                    >
                                      {expenseChartData.map((entry, idx) => (
                                        <Cell
                                          key={entry.name}
                                          fill={entry.color}
                                          fillOpacity={
                                            hoveredExpense === null || hoveredExpense === idx
                                              ? 1
                                              : 0.28
                                          }
                                          style={{
                                            cursor: "pointer",
                                            transition: "fill-opacity 150ms ease",
                                          }}
                                        />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>

                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                                  <span className="text-[13px] font-medium text-muted-foreground line-clamp-1 max-w-[140px]">
                                    {activeExpenseDatum
                                      ? activeExpenseDatum.name
                                      : `Total Belanja`}
                                  </span>
                                  <span className="text-xl font-serif font-bold text-foreground tabular-nums mt-0.5">
                                    {activeExpenseDatum
                                      ? `${activeExpenseDatum.percent}%`
                                      : formatCompactRupiah(keuangan.totalBelanja)}
                                  </span>
                                  {activeExpenseDatum && (
                                    <span className="text-[13px] text-muted-foreground tabular-nums">
                                      {formatCompactRupiah(activeExpenseDatum.value)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                {expenseChartData.map((item, idx) => {
                                  const isHighlighted = hoveredExpense === idx;
                                  const isDimmed =
                                    hoveredExpense !== null && hoveredExpense !== idx;
                                  return (
                                    <button
                                      key={item.name}
                                      type="button"
                                      onMouseEnter={() => setHoveredExpense(idx)}
                                      onMouseLeave={() => setHoveredExpense(null)}
                                      onFocus={() => setHoveredExpense(idx)}
                                      onBlur={() => setHoveredExpense(null)}
                                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                                        isHighlighted
                                          ? "bg-muted border-foreground/25"
                                          : "bg-transparent border-transparent hover:bg-muted/50"
                                      } ${isDimmed ? "opacity-55" : "opacity-100"}`}
                                    >
                                      <span className="flex items-center gap-2.5 min-w-0">
                                        <span
                                          aria-hidden="true"
                                          className="w-2.5 h-2.5 rounded-full shrink-0"
                                          style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm font-medium text-foreground truncate">
                                          {item.name}
                                        </span>
                                      </span>
                                      <span className="text-[13px] font-semibold text-foreground tabular-nums whitespace-nowrap">
                                        {formatCompactRupiah(item.value)} ({item.percent}%)
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Income Sources */}
                      <Card className="lg:col-span-6 bg-card border border-border rounded-2xl flex flex-col">
                        <div className="p-6 md:p-7 border-b border-border">
                          <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                            Sumber Pendapatan Nagari
                          </h2>
                          <p className="text-muted-foreground text-sm mt-1">
                            Rincian penerimaan APB Nagari Tahun Anggaran {keuangan.year}.
                          </p>
                        </div>
                        <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-center">
                          {keuangan.incomeData.length === 0 ? (
                            <EmptyDataState message="Rincian sumber pendapatan belum tersedia." />
                          ) : (
                            <div className="space-y-5">
                              {keuangan.incomeData.map((item, idx) => (
                                <AnimatedBarRow
                                  key={item.label}
                                  label={item.label}
                                  valueLabel={`${formatCompactRupiah(item.value)} (${item.percent}%)`}
                                  percent={item.percent}
                                  barClass={accentByIndex(idx).edge}
                                  index={idx}
                                  reducedMotion={prefersReducedMotion}
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Card className="bg-card border border-border rounded-2xl p-10">
                    <EmptyDataState message="Ringkasan APB Nagari belum dipublikasikan untuk tahun anggaran aktif." />
                  </Card>
                )}

                {/* Link Card to Full Infografis */}
                <Link href="/infografis" className="block group">
                  <Card className="bg-card border border-border rounded-2xl transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-foreground/25 group-hover:shadow-md">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 max-w-2xl">
                        <span className="w-11 h-11 rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                          <Wallet aria-hidden="true" size={22} />
                        </span>
                        <div className="space-y-1">
                          <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                            Infografis Lengkap &amp; Rencana Kegiatan APB
                          </h2>
                          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            Bandingkan data antar tahun anggaran dan telusuri rincian seluruh kegiatan prioritas Dana Desa di halaman Infografis APB.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-5 text-sm font-medium whitespace-nowrap active:scale-[0.985]"
                      >
                        Buka Infografis APB
                        <ChevronRight
                          aria-hidden="true"
                          size={16}
                          className="ml-1.5 transition-transform duration-150 group-hover:translate-x-[3px]"
                        />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <Footer />
    </PageBackground>
  );
}

function MetricTile({
  title,
  value,
  unit,
  caption,
  icon: Icon,
  accentIndex,
  delay,
  reducedMotion,
  onClick,
}: {
  title: string;
  value: string;
  unit?: string;
  caption?: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  accentIndex: number;
  delay: number;
  reducedMotion: boolean;
  onClick?: () => void;
}) {
  const accent = accentByIndex(accentIndex);
  const interactive = Boolean(onClick);

  const inner = (
    <div
      className={`h-full rounded-2xl bg-card border border-border overflow-hidden flex flex-col justify-between text-left transition-all duration-150 ${
        interactive
          ? "group hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md cursor-pointer"
          : ""
      }`}
    >
      <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.chip}`}
          >
            <Icon aria-hidden={true} size={20} />
          </span>
          {interactive && (
            <ArrowUpRight
              aria-hidden="true"
              size={18}
              className="text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
            />
          )}
        </div>

        <div>
          <p className="text-[13px] font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tabular-nums leading-tight">
              {value}
            </p>
            {unit && (
              <span className={`text-[13px] font-semibold ${accent.ink}`}>
                {unit}
              </span>
            )}
          </div>
          {caption && (
            <p className="text-[13px] text-muted-foreground mt-2 leading-snug">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_ENTER }}
      className="h-full"
    >
      {interactive ? (
        <button
          type="button"
          onClick={onClick}
          className="w-full h-full block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red"
        >
          {inner}
        </button>
      ) : (
        inner
      )}
    </motion.div>
  );
}

function InsightCard({
  label,
  value,
  sub,
  accentIndex,
}: {
  label: string;
  value: string;
  sub?: string;
  accentIndex: number;
}) {
  const accent = accentByIndex(accentIndex);
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden">
      <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
      <CardContent className="p-5 md:p-6">
        <p className="text-[13px] font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-serif font-bold text-foreground tabular-nums leading-snug">
          {value}
        </p>
        {sub && (
          <p className="text-[13px] text-muted-foreground mt-1.5 tabular-nums">
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AnimatedBarRow({
  label,
  badge,
  badgeClass,
  valueLabel,
  percent,
  barClass,
  index,
  reducedMotion,
}: {
  label: string;
  badge?: string;
  badgeClass?: string;
  valueLabel: string;
  percent: number;
  barClass: string;
  index: number;
  reducedMotion: boolean;
}) {
  const safePercent = Math.min(100, Math.max(2, Number(percent || 0)));
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-foreground">{label}</span>
          {badge && (
            <span
              className={`text-[13px] font-semibold px-2 py-0.5 rounded-md ${
                badgeClass || "bg-muted text-foreground"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <span className="font-semibold text-foreground tabular-nums text-right">
          {valueLabel}
        </span>
      </div>
      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={reducedMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.48,
            delay: Math.min(index * 0.045, 0.35),
            ease: EASE_ENTER,
          }}
          style={{
            width: `${safePercent}%`,
            transformOrigin: "left center",
          }}
          className={`h-full rounded-full ${barClass}`}
        />
      </div>
    </div>
  );
}

function EmptyDataState({ message }: { message: string }) {
  return (
    <div className="text-center py-10">
      <BarChart3
        aria-hidden="true"
        className="w-10 h-10 mx-auto text-muted-foreground mb-3"
      />
      <p className="text-muted-foreground text-sm md:text-base">{message}</p>
    </div>
  );
}
