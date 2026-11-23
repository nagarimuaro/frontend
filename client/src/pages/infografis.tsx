import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  PiggyBank,
  Wallet,
  TrendingUp,
  ArrowDownRight,
  Briefcase,
  Loader2,
  FileBarChart,
  Search,
  X,
  Calendar,
} from "lucide-react";
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
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useKeuanganNagari } from "@/lib/api";
import { accentByIndex } from "@/lib/accents";

const CHART_HEX = [
  "#1d8680",
  "#24599e",
  "#237153",
  "#976316",
  "#a33b29",
  "#37539f",
];

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num || 0);

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

export default function Infografis() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [hoveredExpense, setHoveredExpense] = useState<number | null>(null);
  const [usageQuery, setUsageQuery] = useState("");

  const { data: keuanganResponse, isLoading, isFetching } = useKeuanganNagari(selectedYear);
  const data = keuanganResponse?.data;

  const availableYears = data?.availableYears || [];
  const activeYear = data?.activeYear ?? null;
  const year = data?.year || selectedYear || new Date().getFullYear();

  const incomeData = data?.incomeData || [];
  const totalIncome = Number(data?.totalIncome || 0);
  const financing = Number(data?.financing || 0);
  const totalBelanja = Number(data?.totalBelanja || 0);

  const expenseData = useMemo(
    () =>
      (data?.expenseData || []).map((item, idx) => ({
        ...item,
        chartFill: CHART_HEX[idx % CHART_HEX.length],
      })),
    [data]
  );

  const usagePlan = data?.usagePlan || [];
  const totalUsagePlan = Number(data?.totalUsagePlan || 0);
  const maxUsageAmount = useMemo(
    () => Math.max(...usagePlan.map((u) => Number(u.amount || 0)), 1),
    [usagePlan]
  );

  const filteredUsagePlan = useMemo(() => {
    const q = usageQuery.trim().toLowerCase();
    if (!q) return usagePlan;
    return usagePlan.filter((item) =>
      (item.text || "").toLowerCase().includes(q)
    );
  }, [usagePlan, usageQuery]);

  const activeExpenseDatum =
    hoveredExpense !== null ? expenseData[hoveredExpense] : null;

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data APB Nagari...
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
        title={`Infografis APB Nagari ${year}`}
        description="Transparansi Anggaran Pendapatan dan Belanja Nagari beserta rincian kegiatan prioritas yang bersumber langsung dari data keuangan resmi."
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        {/* Year Selector Bar */}
        {availableYears.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                <Calendar aria-hidden="true" size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Tahun Anggaran APB
                </p>
                <p className="text-[13px] text-muted-foreground">
                  Pilih tahun untuk membandingkan realisasi dan rencana anggaran.
                </p>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Pilih tahun anggaran"
              className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border self-start sm:self-auto"
            >
              {availableYears.map((y) => {
                const isSelected = year === y;
                return (
                  <button
                    key={y}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setHoveredExpense(null);
                      setSelectedYear(y);
                    }}
                    className={`relative px-4 h-10 rounded-lg text-sm font-medium transition-colors active:scale-[0.985] ${
                      isSelected
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="infografis-year-pill"
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
                      {activeYear === y ? " · Aktif" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={year}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: isFetching ? 0.65 : 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_UI }}
            className="space-y-14"
          >
            {/* Top Bento KPI Summary */}
            <section aria-label="Ringkasan APB Nagari">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 rounded-2xl bg-nagari-navy text-white border border-border p-6 md:p-7 flex flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-medium text-nagari-yellow mb-2">
                        Total Belanja APB {year}
                      </p>
                      <p className="text-3xl md:text-4xl font-serif font-bold tracking-tight tabular-nums leading-tight">
                        {formatRupiah(totalBelanja)}
                      </p>
                    </div>
                    <span className="w-11 h-11 rounded-xl bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                      <Wallet aria-hidden="true" size={22} />
                    </span>
                  </div>
                  <p className="text-[13px] text-white/75 pt-4 border-t border-white/12 leading-relaxed">
                    Terbagi ke dalam <strong className="text-white">{expenseData.length} bidang prioritas</strong> dan <strong className="text-white">{usagePlan.length} program/kegiatan</strong> utama nagari.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                    <div aria-hidden="true" className="h-1 w-full bg-cat-3" />
                    <CardContent className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="w-10 h-10 rounded-xl bg-cat-3/10 text-cat-3 flex items-center justify-center">
                          <TrendingUp aria-hidden="true" size={20} />
                        </span>
                        <span className="text-[13px] font-semibold px-2.5 py-1 rounded-md bg-muted text-foreground border border-border tabular-nums">
                          {incomeData.length} sumber
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-muted-foreground mb-1">
                          Total Pendapatan {year}
                        </p>
                        <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tabular-nums leading-tight">
                          {formatRupiah(totalIncome)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
                    <div aria-hidden="true" className="h-1 w-full bg-cat-2" />
                    <CardContent className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="w-10 h-10 rounded-xl bg-cat-2/10 text-cat-2 flex items-center justify-center">
                          <ArrowDownRight aria-hidden="true" size={20} />
                        </span>
                        <span className="text-[13px] font-medium text-muted-foreground">
                          SiLPA &amp; Netto
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-muted-foreground mb-1">
                          Pembiayaan Netto
                        </p>
                        <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tabular-nums leading-tight">
                          {formatRupiah(financing)}
                        </p>
                        <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">
                          Sisa lebih tahun sebelumnya dikurangi pengeluaran pembiayaan.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Pendapatan Section */}
            <section className="space-y-6">
              <div className="flex items-start gap-4 pb-5 border-b border-border">
                <div className="w-11 h-11 rounded-xl bg-nagari-red/10 text-nagari-red-ink border border-nagari-red/20 flex items-center justify-center shrink-0">
                  <PiggyBank aria-hidden="true" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Sumber Pendapatan Nagari {year}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-3xl">
                    Rincian penerimaan dari Dana Desa, Alokasi Dana Nagari, bagi hasil pajak, bantuan keuangan, dan Pendapatan Asli Nagari.
                  </p>
                </div>
              </div>

              {incomeData.length === 0 ? (
                <Card className="bg-card border border-border rounded-2xl p-10 text-center">
                  <FileBarChart aria-hidden="true" className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-base">
                    Rincian pendapatan tahun {year} belum tersedia.
                  </p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {incomeData.map((item, idx) => {
                    const accent = accentByIndex(idx);
                    const percent = Math.min(100, Math.max(0, Number(item.percent || 0)));
                    return (
                      <Card
                        key={item.label}
                        className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
                      >
                        <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
                        <CardContent className="p-6 flex-1 flex flex-col justify-between gap-5">
                          <div className="flex justify-between items-start gap-3">
                            <h3 className="text-sm font-semibold text-foreground leading-snug">
                              {item.label}
                            </h3>
                            <span
                              className={`text-[13px] font-semibold px-2.5 py-0.5 rounded-md whitespace-nowrap tabular-nums ${accent.chip}`}
                            >
                              {percent}%
                            </span>
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-serif font-bold text-foreground tabular-nums">
                              {formatRupiah(Number(item.value || 0))}
                            </p>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={prefersReducedMotion ? false : { scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                  duration: 0.48,
                                  delay: Math.min(idx * 0.04, 0.3),
                                  ease: EASE_ENTER,
                                }}
                                style={{
                                  width: `${Math.max(percent, 2)}%`,
                                  transformOrigin: "left center",
                                }}
                                className={`h-full rounded-full ${accent.edge}`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Belanja Section with Cross-Highlighted Donut */}
            <section className="space-y-6">
              <div className="flex items-start gap-4 pb-5 border-b border-border">
                <div className="w-11 h-11 rounded-xl bg-cat-1/10 text-cat-1 border border-cat-1/20 flex items-center justify-center shrink-0">
                  <Wallet aria-hidden="true" size={22} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Belanja Nagari per Bidang {year}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Arahkan kursor pada grafik atau kartu bidang untuk menyorot porsi anggaran.
                  </p>
                </div>
              </div>

              {expenseData.length === 0 ? (
                <Card className="bg-card border border-border rounded-2xl p-10 text-center">
                  <p className="text-muted-foreground text-base">
                    Rincian belanja tahun {year} belum tersedia.
                  </p>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                  <Card className="lg:col-span-5 bg-card border border-border rounded-2xl flex flex-col">
                    <CardContent className="p-6 md:p-7 flex-1 flex flex-col justify-between gap-6">
                      <div className="relative h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={104}
                              paddingAngle={2}
                              stroke="none"
                              dataKey="value"
                              isAnimationActive={!prefersReducedMotion}
                              animationDuration={550}
                              animationEasing="ease-out"
                              onMouseEnter={(_, idx) => setHoveredExpense(idx)}
                              onMouseLeave={() => setHoveredExpense(null)}
                            >
                              {expenseData.map((entry, idx) => (
                                <Cell
                                  key={entry.name}
                                  fill={entry.chartFill}
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

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                          <span className="text-[13px] font-medium text-muted-foreground line-clamp-1 max-w-[140px]">
                            {activeExpenseDatum ? activeExpenseDatum.name : "Total Belanja"}
                          </span>
                          <span className="text-xl font-serif font-bold text-foreground tabular-nums mt-0.5">
                            {activeExpenseDatum
                              ? `${activeExpenseDatum.percent}%`
                              : formatCompactRupiah(totalBelanja)}
                          </span>
                          {activeExpenseDatum && (
                            <span className="text-[13px] text-muted-foreground tabular-nums">
                              {formatCompactRupiah(activeExpenseDatum.value)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/50 border border-border p-4 rounded-xl flex items-center justify-between gap-3">
                        <span className="text-[13px] font-medium text-muted-foreground">
                          Total Belanja {year}
                        </span>
                        <span className="text-lg font-serif font-bold text-nagari-red-ink tabular-nums">
                          {formatRupiah(totalBelanja)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                    {expenseData.map((item, idx) => {
                      const percent = Math.min(100, Math.max(0, Number(item.percent || 0)));
                      const isHighlighted = hoveredExpense === idx;
                      const isDimmed =
                        hoveredExpense !== null && hoveredExpense !== idx;
                      return (
                        <div
                          key={item.name}
                          onMouseEnter={() => setHoveredExpense(idx)}
                          onMouseLeave={() => setHoveredExpense(null)}
                          className={`bg-card border rounded-2xl overflow-hidden flex flex-col transition-all duration-150 ${
                            isHighlighted
                              ? "border-foreground/30 shadow-sm"
                              : "border-border hover:border-foreground/20"
                          } ${isDimmed ? "opacity-55" : "opacity-100"}`}
                        >
                          <div
                            aria-hidden="true"
                            className="h-1 w-full"
                            style={{ backgroundColor: item.chartFill }}
                          />
                          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-muted-foreground mb-1 leading-snug">
                                {item.name}
                              </p>
                              <p className="text-xl md:text-2xl font-serif font-bold text-foreground tabular-nums">
                                {formatRupiah(Number(item.value || 0))}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={prefersReducedMotion ? false : { scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{
                                    duration: 0.48,
                                    delay: idx * 0.045,
                                    ease: EASE_ENTER,
                                  }}
                                  style={{
                                    width: `${Math.max(percent, 2)}%`,
                                    backgroundColor: item.chartFill,
                                    transformOrigin: "left center",
                                  }}
                                  className="h-full rounded-full"
                                />
                              </div>
                              <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                                {percent}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Rencana Penggunaan Dana Desa */}
            <section>
              <Card className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="bg-nagari-navy text-white p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <Briefcase aria-hidden="true" size={22} className="text-nagari-yellow" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        Rencana Penggunaan Dana Desa {year}
                      </h2>
                      <p className="text-sm text-white/80 mt-0.5">
                        {usagePlan.length} program dan kegiatan prioritas yang dianggarkan.
                      </p>
                    </div>
                  </div>

                  {usagePlan.length > 0 && (
                    <div className="relative w-full lg:w-72">
                      <label htmlFor="usage-search" className="sr-only">
                        Cari program atau kegiatan Dana Desa
                      </label>
                      <Search
                        aria-hidden="true"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
                      />
                      <Input
                        id="usage-search"
                        value={usageQuery}
                        onChange={(e) => setUsageQuery(e.target.value)}
                        placeholder="Cari nama kegiatan..."
                        className="pl-10 pr-9 h-11 rounded-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-nagari-yellow"
                      />
                      {usageQuery && (
                        <button
                          type="button"
                          aria-label="Hapus pencarian kegiatan"
                          onClick={() => setUsageQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <X aria-hidden="true" size={15} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <CardContent className="p-0">
                  {usagePlan.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12 px-6">
                      Rincian rencana penggunaan Dana Desa tahun {year} belum tersedia.
                    </p>
                  ) : filteredUsagePlan.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12 px-6">
                      Tidak ditemukan kegiatan dengan kata kunci “{usageQuery}”.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="w-[64px] text-center font-semibold text-muted-foreground text-[13px] py-4">
                              No
                            </TableHead>
                            <TableHead className="font-semibold text-muted-foreground text-[13px] py-4">
                              Program / Kegiatan Prioritas
                            </TableHead>
                            <TableHead className="text-right font-semibold text-muted-foreground text-[13px] py-4 pr-6">
                              Alokasi Anggaran
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsagePlan.map((item, idx) => {
                            const amount = Number(item.amount || 0);
                            const relPercent = Math.max(
                              3,
                              (amount / maxUsageAmount) * 100
                            );
                            const sharePercent =
                              totalUsagePlan > 0
                                ? ((amount / totalUsagePlan) * 100).toFixed(1)
                                : "0";
                            return (
                              <TableRow
                                key={`${item.text}-${idx}`}
                                className="border-b border-border hover:bg-muted/40 transition-colors"
                              >
                                <TableCell className="text-center font-semibold text-muted-foreground py-4 tabular-nums">
                                  {String(idx + 1).padStart(2, "0")}
                                </TableCell>
                                <TableCell className="py-4">
                                  <p className="text-foreground text-sm md:text-base font-medium leading-snug">
                                    {item.text}
                                  </p>
                                  <div className="mt-2 flex items-center gap-3 max-w-md">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        initial={
                                          prefersReducedMotion ? false : { scaleX: 0 }
                                        }
                                        animate={{ scaleX: 1 }}
                                        transition={{
                                          duration: 0.45,
                                          delay: Math.min(idx * 0.02, 0.28),
                                          ease: EASE_ENTER,
                                        }}
                                        style={{
                                          width: `${relPercent}%`,
                                          transformOrigin: "left center",
                                        }}
                                        className="h-full rounded-full bg-cat-2"
                                      />
                                    </div>
                                    <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">
                                      {sharePercent}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right py-4 pr-6 align-top">
                                  <span className="inline-block font-semibold text-foreground bg-muted px-3 py-1.5 rounded-lg border border-border tabular-nums whitespace-nowrap text-sm">
                                    {formatRupiah(amount)}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>

                <div className="bg-muted/50 p-6 md:px-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Total Alokasi Dana Desa {year}
                  </span>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-nagari-red-ink tabular-nums">
                    {formatRupiah(totalUsagePlan)}
                  </span>
                </div>
              </Card>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </PageBackground>
  );
}
