import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Map as MapIcon,
  Mountain,
  Ruler,
  Users,
  Building2,
  Loader2,
  ChevronRight,
  MapPin,
  UserCheck,
  Compass,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDataOverview,
  useNagariProfile,
  useSiteSettings,
  useFacilities,
  useJorongs,
} from "@/lib/api";
import { getTenantName } from "@/lib/tenant-name";
import { accentByIndex } from "@/lib/accents";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import mapImage from "@assets/generated_images/digital_map_of_village.png";

const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Monografi() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { data: overviewResponse, isLoading: loadingOverview } = useDataOverview();
  const { data: profileResponse, isLoading: loadingProfile } = useNagariProfile();
  const { data: settingsResponse } = useSiteSettings();
  const { data: facilitiesResponse } = useFacilities();
  const { data: jorongsResponse, isLoading: loadingJorongs } = useJorongs();

  const overview = overviewResponse?.data;
  const profile = profileResponse?.data;
  const tenantName = getTenantName(settingsResponse?.data, profile?.nama_nagari);
  const facilities = facilitiesResponse?.data?.data || [];
  const jorongs = jorongsResponse?.data || [];

  const isLoading = loadingOverview || loadingProfile || loadingJorongs;

  const totalPenduduk = Number(overview?.jumlah_penduduk || 0);
  const lakiLaki = Number(overview?.jumlah_laki_laki || 0);
  const perempuan = Number(overview?.jumlah_perempuan || 0);
  const genderBase = lakiLaki + perempuan || totalPenduduk;
  const malePct =
    genderBase > 0 ? Number(((lakiLaki / genderBase) * 100).toFixed(1)) : 0;
  const femalePct =
    genderBase > 0 ? Number(((perempuan / genderBase) * 100).toFixed(1)) : 0;

  const generalData = [
    { label: "Nama Nagari", value: tenantName },
    { label: "Kode Wilayah", value: profile?.kode_nagari },
    { label: "Kecamatan", value: profile?.kecamatan },
    { label: "Kabupaten", value: profile?.kabupaten },
    { label: "Provinsi", value: profile?.provinsi || "Sumatera Barat" },
    { label: "Kode Pos", value: profile?.kode_pos },
  ].filter((item) => Boolean(item.value));

  const boundariesData = [
    { direction: "Utara", value: profile?.batas_wilayah?.utara },
    { direction: "Timur", value: profile?.batas_wilayah?.timur },
    { direction: "Selatan", value: profile?.batas_wilayah?.selatan },
    { direction: "Barat", value: profile?.batas_wilayah?.barat },
  ];
  const hasAnyBoundary = boundariesData.some((b) => Boolean(b.value));

  const facilitiesByCategory = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const item of facilities) {
      const key = (item.jenis || item.category || "Fasilitas Umum").trim();
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }
    return Array.from(grouped.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [facilities]);

  const jorongCount =
    jorongs.length || overview?.jumlah_jorong || profile?.jumlah_jorong || 0;

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data monografi...
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
        title="Monografi Nagari"
        description="Lembar profil administratif, kondisi geografis, daftar wilayah jorong, dan ringkasan kependudukan resmi nagari."
        image={mapImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        {/* Top Geographic & Population Bento */}
        <section
          aria-label="Ringkasan geografis dan kependudukan"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <Card className="bg-nagari-navy text-white border border-border rounded-2xl">
            <CardContent className="p-6 flex flex-col justify-between gap-4 h-full">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-nagari-yellow">
                  Luas Wilayah
                </span>
                <Mountain aria-hidden="true" size={18} className="text-nagari-yellow" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold tabular-nums">
                  {profile?.luas_wilayah || overview?.luas_wilayah || "—"}
                  {(profile?.luas_wilayah || overview?.luas_wilayah) && (
                    <span className="text-sm font-sans font-medium text-white/75 ml-1.5">
                      km²
                    </span>
                  )}
                </p>
                {profile?.ketinggian != null && (
                  <p className="text-[13px] text-white/75 mt-1 tabular-nums">
                    Ketinggian {profile.ketinggian} mdpl
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <SummaryMetric
            label="Wilayah Administratif"
            value={jorongCount > 0 ? String(jorongCount) : "—"}
            unit={jorongCount > 0 ? "Jorong" : undefined}
            sub={profile?.kecamatan ? `Kec. ${profile.kecamatan}` : undefined}
            icon={Compass}
            accentIndex={0}
          />
          <SummaryMetric
            label="Jumlah Penduduk"
            value={totalPenduduk > 0 ? totalPenduduk.toLocaleString("id-ID") : "—"}
            unit={totalPenduduk > 0 ? "Jiwa" : undefined}
            sub={
              overview?.jumlah_kk
                ? `${Number(overview.jumlah_kk).toLocaleString("id-ID")} Kepala Keluarga`
                : undefined
            }
            icon={Users}
            accentIndex={1}
          />
          <SummaryMetric
            label="UMKM & Layanan Aktif"
            value={String(overview?.total_umkm ?? 0)}
            unit="UMKM"
            sub={`${overview?.total_layanan ?? 0} jenis layanan publik`}
            icon={Building2}
            accentIndex={2}
          />
        </section>

        {/* Identitas Wilayah & Kependudukan */}
        <section className="grid lg:grid-cols-12 gap-6">
          {/* Identitas & Batas Wilayah */}
          <Card className="lg:col-span-5 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center">
                <MapIcon aria-hidden="true" size={18} />
              </span>
              <CardTitle className="text-lg font-serif text-foreground">
                Identitas Wilayah
              </CardTitle>
            </div>
            <CardContent className="p-0 flex-1 flex flex-col justify-between">
              <Table>
                <TableBody>
                  {generalData.map((item) => (
                    <TableRow
                      key={item.label}
                      className="border-b border-border last:border-0"
                    >
                      <TableCell className="text-muted-foreground py-3.5 px-6 text-sm">
                        {item.label}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground py-3.5 px-6 text-sm">
                        {item.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {hasAnyBoundary && (
                <div className="p-6 pt-4 border-t border-border bg-muted/25 space-y-2.5">
                  <p className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                    <Ruler aria-hidden="true" size={14} className="text-nagari-red-ink" />
                    Batas Wilayah
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {boundariesData.map((b) => (
                      <div
                        key={b.direction}
                        className="p-2.5 rounded-lg bg-card border border-border"
                      >
                        <p className="text-[13px] text-muted-foreground">
                          {b.direction}
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {b.value || "Belum dicatat"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ringkasan Kependudukan */}
          <Card className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-cat-2/10 text-cat-2 flex items-center justify-center">
                  <Users aria-hidden="true" size={18} />
                </span>
                <CardTitle className="text-lg font-serif text-foreground">
                  Ringkasan Kependudukan
                </CardTitle>
              </div>
              <Link href="/data-publik" className="group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-nagari-red-ink hover:bg-nagari-red/10 h-9 px-3 rounded-lg text-[13px] font-medium"
                >
                  Statistik Lengkap
                  <ChevronRight
                    aria-hidden="true"
                    size={15}
                    className="ml-1 transition-transform duration-150 group-hover:translate-x-[3px]"
                  />
                </Button>
              </Link>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col justify-between gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="text-[13px] font-medium text-muted-foreground mb-1">
                    Total Penduduk Aktif
                  </p>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tabular-nums">
                    {totalPenduduk > 0 ? totalPenduduk.toLocaleString("id-ID") : "—"}
                    {totalPenduduk > 0 && (
                      <span className="text-sm font-sans font-medium text-muted-foreground ml-1.5">
                        Jiwa
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="text-[13px] font-medium text-muted-foreground mb-1">
                    Jumlah Kepala Keluarga
                  </p>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tabular-nums">
                    {overview?.jumlah_kk
                      ? Number(overview.jumlah_kk).toLocaleString("id-ID")
                      : "—"}
                    {overview?.jumlah_kk ? (
                      <span className="text-sm font-sans font-medium text-muted-foreground ml-1.5">
                        KK
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              {genderBase > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Laki-laki</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {lakiLaki.toLocaleString("id-ID")} jiwa ({malePct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={prefersReducedMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease: EASE_ENTER }}
                        style={{
                          width: `${malePct}%`,
                          transformOrigin: "left center",
                        }}
                        className="h-full rounded-full bg-cat-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-foreground">Perempuan</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {perempuan.toLocaleString("id-ID")} jiwa ({femalePct}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={prefersReducedMotion ? false : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.08, ease: EASE_ENTER }}
                        style={{
                          width: `${femalePct}%`,
                          transformOrigin: "left center",
                        }}
                        className="h-full rounded-full bg-cat-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-muted-foreground">
                  Ingin melihat persebaran wilayah secara spasial?
                </p>
                <Link href="/gis" className="group">
                  <Button
                    variant="outline"
                    className="rounded-lg h-10 px-4 text-sm font-medium border-border"
                  >
                    Buka Peta Digital
                    <ChevronRight
                      aria-hidden="true"
                      size={15}
                      className="ml-1.5 transition-transform duration-150 group-hover:translate-x-[3px]"
                    />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Daftar Wilayah Administratif (Jorong) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Daftar Wilayah Jorong
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                Pembagian wilayah administratif beserta Kepala / Wali Jorong di {tenantName}.
              </p>
            </div>
            <span className="text-[13px] font-semibold px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border self-start sm:self-auto tabular-nums">
              {jorongs.length} Jorong Aktif
            </span>
          </div>

          {jorongs.length === 0 ? (
            <Card className="bg-card border border-border rounded-2xl p-10 text-center">
              <MapPin aria-hidden="true" className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-base">
                Daftar wilayah jorong belum dipublikasikan untuk nagari ini.
              </p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jorongs.map((jorong, idx) => {
                const accent = accentByIndex(idx);
                return (
                  <Card
                    key={jorong.id}
                    className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
                    <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {jorong.kode && (
                            <p className="text-[13px] font-medium text-muted-foreground mb-0.5 tabular-nums">
                              {jorong.kode}
                            </p>
                          )}
                          <h3 className="font-serif font-bold text-lg text-foreground leading-snug">
                            Jorong {jorong.nama}
                          </h3>
                        </div>
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent.chip}`}
                        >
                          <MapPin aria-hidden="true" size={17} />
                        </span>
                      </div>

                      <div className="pt-3 border-t border-border space-y-1.5 text-[13px]">
                        <div className="flex items-center gap-2 text-foreground">
                          <UserCheck
                            aria-hidden="true"
                            size={15}
                            className="text-muted-foreground shrink-0"
                          />
                          <span className="text-muted-foreground">Wali Jorong:</span>
                          <span className="font-semibold truncate">
                            {jorong.kepala_jorong || "Belum dicatat"}
                          </span>
                        </div>
                        {jorong.luas_wilayah && (
                          <p className="text-muted-foreground tabular-nums pl-6">
                            Luas wilayah: {jorong.luas_wilayah}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Sarana & Prasarana (ditampilkan jika tersedia dari API fasilitas) */}
        {facilitiesByCategory.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-border">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Sarana &amp; Prasarana Tercatat
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  Rekapitulasi fasilitas publik yang terdaftar di basis data {tenantName}.
                </p>
              </div>
              <Link href="/fasilitas" className="group">
                <Button
                  variant="outline"
                  className="rounded-lg h-11 px-4 text-sm font-medium border-border"
                >
                  Lihat Daftar Fasilitas
                  <ChevronRight
                    aria-hidden="true"
                    size={16}
                    className="ml-1.5 transition-transform duration-150 group-hover:translate-x-[3px]"
                  />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {facilitiesByCategory.map((item, idx) => {
                const accent = accentByIndex(idx);
                return (
                  <Card
                    key={item.category}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
                    <CardContent className="p-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-medium text-muted-foreground mb-1">
                          {item.category}
                        </p>
                        <p className="text-2xl font-serif font-bold text-foreground tabular-nums">
                          {item.count}
                        </p>
                      </div>
                      <span
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.chip}`}
                      >
                        <Building2 aria-hidden="true" size={20} />
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </PageBackground>
  );
}

function SummaryMetric({
  label,
  value,
  unit,
  sub,
  icon: Icon,
  accentIndex,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  accentIndex: number;
}) {
  const accent = accentByIndex(accentIndex);
  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
      <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />
      <CardContent className="p-6 flex-1 flex flex-col justify-between gap-4">
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.chip}`}
        >
          <Icon aria-hidden={true} size={20} />
        </span>
        <div>
          <p className="text-[13px] font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-3xl font-serif font-bold text-foreground tabular-nums leading-none">
              {value}
            </p>
            {unit && (
              <span className={`text-[13px] font-semibold ${accent.ink}`}>
                {unit}
              </span>
            )}
          </div>
          {sub && (
            <p className="text-[13px] text-muted-foreground mt-1.5">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
