import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  HardHat,
  ChevronRight,
  Loader2,
  FolderKanban,
  MapPin,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/api";
import { Link } from "wouter";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import projectImage from "@assets/generated_images/village_infrastructure_project.png";

type StatusFilter = "all" | "Berjalan" | "Selesai" | "Perencanaan";

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

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

const formatDateShort = (raw?: string | null) => {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
};

export default function Projects() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: projectsData, isLoading } = useProjects(1, {
    status: "all",
    perPage: 50,
  });
  const projects = projectsData?.data?.data || [];

  const counts = useMemo(() => {
    let selesai = 0;
    let berjalan = 0;
    let perencanaan = 0;
    let totalBudget = 0;

    for (const p of projects) {
      if (p.status === "Selesai") selesai += 1;
      else if (p.status === "Berjalan") berjalan += 1;
      else if (p.status === "Perencanaan") perencanaan += 1;
      totalBudget += Number(p.budget ?? p.anggaran ?? 0);
    }

    return {
      all: projects.length,
      Berjalan: berjalan,
      Selesai: selesai,
      Perencanaan: perencanaan,
      totalBudget,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === "all") return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  const latestYear =
    projects.reduce((max, p) => {
      const y = Number(p.year || p.tahun || 0);
      return y > max ? y : max;
    }, 0) || new Date().getFullYear();

  const filterTabs: Array<{ id: StatusFilter; label: string; count: number }> = [
    { id: "all", label: "Semua", count: counts.all },
    { id: "Berjalan", label: "Berjalan", count: counts.Berjalan },
    { id: "Selesai", label: "Selesai", count: counts.Selesai },
    ...(counts.Perencanaan > 0
      ? [{ id: "Perencanaan" as StatusFilter, label: "Perencanaan", count: counts.Perencanaan }]
      : []),
  ];

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data proyek...
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
        title="Proyek Pembangunan"
        description="Pantau realisasi fisik, nilai anggaran, dan status pembangunan infrastruktur serta pemberdayaan masyarakat nagari secara terbuka."
        image={projectImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
        {/* Bento Summary Strip */}
        <section
          aria-label="Ringkasan proyek pembangunan"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          <div className="lg:col-span-5 rounded-2xl bg-nagari-navy text-white border border-border p-6 md:p-7 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-nagari-yellow mb-1.5">
                  Total Nilai Proyek Tercatat
                </p>
                <p className="text-3xl md:text-4xl font-serif font-bold tracking-tight tabular-nums">
                  {counts.totalBudget > 0
                    ? formatCompactRupiah(counts.totalBudget)
                    : "—"}
                </p>
              </div>
              <span className="w-11 h-11 rounded-xl bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                <Wallet aria-hidden="true" size={22} />
              </span>
            </div>
            <p className="text-[13px] text-white/75 pt-4 border-t border-white/12">
              {counts.all} kegiatan pembangunan hingga Tahun Anggaran {latestYear}.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatusSummaryTile
              label="Sedang Berjalan"
              value={counts.Berjalan}
              icon={HardHat}
              edgeClass="bg-cat-2"
              chipClass="bg-cat-2/10 text-cat-2"
            />
            <StatusSummaryTile
              label="Selesai"
              value={counts.Selesai}
              icon={CheckCircle2}
              edgeClass="bg-cat-3"
              chipClass="bg-cat-3/10 text-cat-3"
            />
            <StatusSummaryTile
              label="Perencanaan"
              value={counts.Perencanaan}
              icon={Clock}
              edgeClass="bg-cat-4"
              chipClass="bg-cat-4/10 text-cat-4"
            />
          </div>
        </section>

        {/* Filter Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Daftar Kegiatan Pembangunan
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Menampilkan {filteredProjects.length} proyek
              {statusFilter !== "all" ? ` berstatus ${statusFilter}` : ""}.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Saring proyek berdasarkan status"
            className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-card border border-border self-start sm:self-auto"
          >
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`relative px-3.5 h-10 rounded-lg text-sm font-medium transition-colors active:scale-[0.985] ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-status-pill"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.24, ease: EASE_UI }
                      }
                      className="absolute inset-0 rounded-lg bg-nagari-red"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5 tabular-nums">
                    {tab.label}
                    <span
                      className={`text-[13px] ${
                        isActive ? "text-white/85" : "text-muted-foreground"
                      }`}
                    >
                      ({tab.count})
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={statusFilter}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE_UI }}
          >
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <FolderKanban
                  aria-hidden="true"
                  className="w-12 h-12 mx-auto text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground text-base">
                  Belum ada proyek pembangunan pada kategori ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProjects.map((project, idx) => {
                  const progress = Math.min(
                    100,
                    Math.max(0, Number(project.progress ?? project.progress_persen ?? 0))
                  );
                  const year = project.year || project.tahun || latestYear;
                  const startStr = formatDateShort(project.tanggal_mulai);
                  const endStr = formatDateShort(project.tanggal_selesai);
                  const isDone = project.status === "Selesai";
                  const isOngoing = project.status === "Berjalan";

                  const edgeClass = isDone
                    ? "bg-cat-3"
                    : isOngoing
                    ? "bg-cat-2"
                    : "bg-cat-4";
                  const badgeClass = isDone
                    ? "bg-cat-3/10 text-cat-3 border-cat-3/25"
                    : isOngoing
                    ? "bg-cat-2/10 text-cat-2 border-cat-2/25"
                    : "bg-cat-4/10 text-cat-4 border-cat-4/25";

                  return (
                    <Card
                      key={project.id}
                      className="overflow-hidden bg-card border border-border rounded-2xl h-full flex flex-col"
                    >
                      <div aria-hidden="true" className={`h-1 w-full ${edgeClass}`} />

                      <CardContent className="p-6 flex-1 flex flex-col gap-5">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5 font-medium text-foreground tabular-nums">
                              <Calendar
                                aria-hidden="true"
                                size={14}
                                className="text-nagari-red-ink"
                              />
                              TA {year}
                            </span>
                            {startStr && (
                              <span className="tabular-nums">
                                {startStr}
                                {endStr ? ` – ${endStr}` : ""}
                              </span>
                            )}
                          </div>

                          <Badge
                            variant="outline"
                            className={`px-2.5 py-0.5 text-[13px] font-semibold border ${badgeClass}`}
                          >
                            {project.status || "Dalam Proses"}
                          </Badge>
                        </div>

                        <div>
                          <CardTitle className="font-serif text-xl text-foreground leading-snug mb-2">
                            {project.name || project.nama}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                            {project.description ||
                              project.deskripsi ||
                              "Kegiatan pembangunan dan pemberdayaan nagari."}
                          </p>
                        </div>

                        {(project.location || project.lokasi) && (
                          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                            <MapPin
                              aria-hidden="true"
                              size={14}
                              className="text-nagari-red-ink shrink-0"
                            />
                            <span>{project.location || project.lokasi}</span>
                          </div>
                        )}

                        <div className="space-y-4 mt-auto pt-2">
                          <div className="flex justify-between items-center bg-muted/50 px-4 py-3.5 rounded-xl border border-border">
                            <span className="text-[13px] font-medium text-muted-foreground">
                              Nilai Anggaran
                            </span>
                            <span className="font-serif font-bold text-lg text-foreground tabular-nums">
                              {formatRupiah(
                                Number(project.budget ?? project.anggaran ?? 0)
                              )}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-[13px] font-medium">
                              <span className="text-muted-foreground">
                                Realisasi Fisik
                              </span>
                              <span className="font-semibold text-foreground tabular-nums">
                                {progress}%
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
                                  delay: Math.min(idx * 0.035, 0.28),
                                  ease: EASE_ENTER,
                                }}
                                style={{
                                  width: `${Math.max(progress, 2)}%`,
                                  transformOrigin: "left center",
                                }}
                                className={`h-full rounded-full ${edgeClass}`}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t border-border p-3 px-4 mt-auto">
                        <Link href="/ppid" className="w-full group">
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-foreground hover:bg-muted h-11 rounded-lg text-sm font-medium"
                          >
                            <span>Lihat Dokumen &amp; Transparansi PPID</span>
                            <ChevronRight
                              aria-hidden="true"
                              size={16}
                              className="transition-transform duration-150 group-hover:translate-x-[3px]"
                            />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </PageBackground>
  );
}

function StatusSummaryTile({
  label,
  value,
  icon: Icon,
  edgeClass,
  chipClass,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  edgeClass: string;
  chipClass: string;
}) {
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      <div aria-hidden="true" className={`h-1 w-full ${edgeClass}`} />
      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${chipClass}`}
        >
          <Icon aria-hidden={true} size={20} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-muted-foreground mb-0.5">
            {label}
          </p>
          <p className="text-3xl font-serif font-bold text-foreground tabular-nums leading-none">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
