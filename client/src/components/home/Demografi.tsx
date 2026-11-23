import {
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Building2, CircleUser, House,
  Map, Mountain, UserRound, Users2, Wallet, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useDataOverview, useNagariProfile } from "@/lib/api";
import { ACCENTS } from "@/lib/accents";

export default function Demografi() {
  const { data: overviewResponse, isLoading } = useDataOverview();
  const { data: profileResponse } = useNagariProfile();
  const overview = overviewResponse?.data;
  const batas = profileResponse?.data?.batas_wilayah;

  const penduduk = overview?.jumlah_penduduk;

  const figures = [
    { label: "Kepala Keluarga", value: overview?.jumlah_kk?.toLocaleString("id-ID"), unit: "KK", icon: House, accent: ACCENTS[2] },
    { label: "Laki-laki", value: overview?.jumlah_laki_laki?.toLocaleString("id-ID"), unit: "Jiwa", icon: UserRound, accent: ACCENTS[3] },
    { label: "Perempuan", value: overview?.jumlah_perempuan?.toLocaleString("id-ID"), unit: "Jiwa", icon: CircleUser, accent: ACCENTS[5] },
    { label: "Ketinggian", value: overview?.ketinggian?.toLocaleString("id-ID"), unit: "mdpl", icon: Mountain, accent: ACCENTS[4] },
    { label: "Luas Wilayah", value: overview?.luas_wilayah, unit: "km²", icon: Map, accent: ACCENTS[1] },
    { label: "Jumlah Jorong", value: overview?.jumlah_jorong?.toLocaleString("id-ID"), unit: "Jorong", icon: Building2, accent: ACCENTS[0] },
  ];

  const anggaran = overview?.total_anggaran;
  const anggaranScaled =
    !anggaran || anggaran <= 0 ? null
    : anggaran >= 1_000_000_000 ? { value: (anggaran / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 }), unit: "Miliar Rupiah" }
    : anggaran >= 1_000_000 ? { value: (anggaran / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 }), unit: "Juta Rupiah" }
    : { value: anggaran.toLocaleString("id-ID"), unit: "Rupiah" };

  const boundaries = [
    { dir: "Utara", value: batas?.utara, icon: ArrowUp },
    { dir: "Timur", value: batas?.timur, icon: ArrowRight },
    { dir: "Selatan", value: batas?.selatan, icon: ArrowDown },
    { dir: "Barat", value: batas?.barat, icon: ArrowLeft },
  ];

  return (
    <section
      aria-label="Data ringkas nagari"
      className="py-16 md:py-24 px-4 md:px-6 bg-background"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2.5 text-nagari-red-ink font-medium text-[13px] mb-3">
              <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-red" />
              Data Nagari
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Demografi &amp; Wilayah
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Angka pokok kependudukan, bentang wilayah, dan batas nagari langsung dari data yang dipakai perangkat nagari.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 aria-hidden="true" className="w-8 h-8 text-nagari-red animate-spin" />
            <span className="sr-only">Memuat data nagari</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:auto-rows-fr">
              {/* Hero figure */}
              <div className="col-span-2 lg:row-span-2 rounded-2xl bg-nagari-navy border border-border p-6 md:p-8 flex flex-col justify-between min-h-[12rem]">
                <div>
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-nagari-yellow mb-5">
                    <Users2 aria-hidden="true" className="w-6 h-6" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm font-medium text-nagari-yellow">
                    Total Penduduk
                  </p>
                </div>

                <p className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight tabular-nums leading-none mt-6">
                  {penduduk?.toLocaleString("id-ID") || "—"}
                  {penduduk ? (
                    <span className="ml-2 align-baseline font-sans text-sm font-medium text-white/80">
                      Jiwa
                    </span>
                  ) : null}
                </p>
              </div>

              {figures.map((item) => (
                <div key={item.label} className="h-full">
                  <div className="h-full flex flex-col justify-between bg-card border border-border rounded-2xl overflow-hidden">
                    <div aria-hidden="true" className={`h-1 w-full ${item.accent.edge}`} />
                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${item.accent.chip}`}>
                          <item.icon aria-hidden="true" size={18} strokeWidth={1.75} />
                        </span>
                        <p className="text-[13px] font-medium text-muted-foreground">
                          {item.label}
                        </p>
                      </div>

                      <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight tabular-nums leading-none [overflow-wrap:anywhere]">
                        {item.value || "—"}
                        {item.value ? (
                          <span className={`ml-1.5 align-baseline font-sans text-[13px] font-medium ${item.accent.ink}`}>
                            {item.unit}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {anggaranScaled && (
                <div className="col-span-2 h-full">
                  <div className="h-full flex flex-col justify-between bg-card border border-border rounded-2xl overflow-hidden">
                    <div aria-hidden="true" className="h-1 w-full bg-nagari-red" />
                    <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 bg-nagari-red/10 text-nagari-red-ink">
                          <Wallet aria-hidden="true" size={18} strokeWidth={1.75} />
                        </span>
                        <p className="text-[13px] font-medium text-muted-foreground">
                          Anggaran Nagari {overview?.tahun ? overview.tahun : ""}
                        </p>
                      </div>

                      <p className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight tabular-nums leading-none [overflow-wrap:anywhere]">
                        {anggaranScaled.value}
                        <span className="ml-1.5 align-baseline font-sans text-[13px] font-medium text-nagari-red-ink">
                          {anggaranScaled.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-5">
                Batas Wilayah Nagari
              </h3>

              <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {boundaries.map((item) => (
                  <div
                    key={item.dir}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
                  >
                    <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-muted text-nagari-red-ink flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[13px] font-medium text-muted-foreground">
                        {item.dir}
                      </dt>
                      <dd className="text-sm font-semibold text-foreground leading-snug [overflow-wrap:anywhere]">
                        {item.value || "Belum dicatat"}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/infografis" className="sm:w-auto">
            <Button className="w-full sm:w-auto rounded-lg px-6 h-11 text-sm font-medium bg-nagari-red text-white hover:bg-nagari-red-ink transition-colors group">
              Lihat Infografis APB
              <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/monografi" className="sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-lg px-6 h-11 text-sm font-medium border-border text-foreground hover:bg-muted transition-colors"
            >
              Baca Data Monografi
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
