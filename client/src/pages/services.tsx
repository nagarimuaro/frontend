import { useState, useMemo } from "react";
import {
  FileText,
  Clock,
  CreditCard,
  Download,
  CheckCircle,
  ArrowRight,
  Loader2,
  MessageCircle,
  Search,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useServices, useSiteSettings, useNagariProfile } from "@/lib/api";
import { getTenantWhatsAppNumber } from "@/lib/whatsapp";
import { accentByIndex } from "@/lib/accents";
import { Link } from "wouter";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IkmSurveySection from "@/components/shared/IkmSurveySection";
import serviceImage from "@assets/generated_images/customer_service_counter.png";

export default function Services() {
  const { data: servicesData, isLoading } = useServices();
  const { data: settingsData } = useSiteSettings();
  const { data: profileData } = useNagariProfile();
  const [searchQuery, setSearchQuery] = useState("");

  const services = servicesData?.data || [];
  const whatsappNumber = getTenantWhatsAppNumber(settingsData?.data);
  const jamOperasional = profileData?.data?.jam_operasional;

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q)
    );
  }, [services, searchQuery]);

  const scheduleRows = useMemo(() => {
    if (!jamOperasional) {
      return [
        { label: "Senin – Kamis", hours: "08:00 – 16:00", closed: false },
        { label: "Jumat", hours: "08:00 – 11:30", closed: false },
        { label: "Sabtu – Minggu", hours: "Tutup", closed: true },
      ];
    }

    const weekdaySame =
      jamOperasional.senin &&
      jamOperasional.senin === jamOperasional.selasa &&
      jamOperasional.senin === jamOperasional.rabu &&
      jamOperasional.senin === jamOperasional.kamis;

    const rows: Array<{ label: string; hours: string; closed: boolean }> = [];
    if (weekdaySame) {
      rows.push({
        label: "Senin – Kamis",
        hours: jamOperasional.senin,
        closed: /tutup/i.test(jamOperasional.senin),
      });
    } else {
      const days: Array<[string, string | undefined]> = [
        ["Senin", jamOperasional.senin],
        ["Selasa", jamOperasional.selasa],
        ["Rabu", jamOperasional.rabu],
        ["Kamis", jamOperasional.kamis],
      ];
      for (const [day, val] of days) {
        if (val) rows.push({ label: day, hours: val, closed: /tutup/i.test(val) });
      }
    }

    if (jamOperasional.jumat) {
      rows.push({
        label: "Jumat",
        hours: jamOperasional.jumat,
        closed: /tutup/i.test(jamOperasional.jumat),
      });
    }

    const weekendSame =
      jamOperasional.sabtu && jamOperasional.sabtu === jamOperasional.minggu;
    if (weekendSame) {
      rows.push({
        label: "Sabtu – Minggu",
        hours: jamOperasional.sabtu,
        closed: /tutup/i.test(jamOperasional.sabtu),
      });
    } else {
      if (jamOperasional.sabtu) {
        rows.push({
          label: "Sabtu",
          hours: jamOperasional.sabtu,
          closed: /tutup/i.test(jamOperasional.sabtu),
        });
      }
      if (jamOperasional.minggu) {
        rows.push({
          label: "Minggu",
          hours: jamOperasional.minggu,
          closed: /tutup/i.test(jamOperasional.minggu),
        });
      }
    }

    return rows;
  }, [jamOperasional]);

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat daftar layanan...
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
        title="Layanan Mandiri"
        description="Urus dokumen administrasi kependudukan lebih mudah, cepat, dan transparan tanpa perlu antre lama di kantor nagari."
        image={serviceImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4 pb-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
                    Daftar Layanan Tersedia
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Klik jenis surat untuk melihat rincian persyaratan, estimasi waktu, dan tombol pengajuan.
                  </p>
                </div>
                <span className="text-[13px] font-semibold text-foreground bg-muted px-3.5 py-1.5 border border-border rounded-lg self-start sm:self-auto tabular-nums">
                  {filteredServices.length} dari {services.length} layanan
                </span>
              </div>

              {services.length > 0 && (
                <div className="relative">
                  <label htmlFor="services-search" className="sr-only">
                    Cari jenis layanan atau surat
                  </label>
                  <Search
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="services-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama surat (contoh: Domisili, Tidak Mampu, Usaha)..."
                    className="pl-10 pr-10 h-12 rounded-xl bg-card border-border text-base"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Hapus kata kunci pencarian layanan"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <X aria-hidden="true" size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {services.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <FileText
                  aria-hidden="true"
                  className="w-12 h-12 mx-auto text-muted-foreground mb-3"
                />
                <p className="text-muted-foreground text-base">
                  Belum ada layanan yang dipublikasikan.
                </p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl px-6">
                <Search
                  aria-hidden="true"
                  className="w-10 h-10 mx-auto text-muted-foreground mb-3"
                />
                <p className="text-muted-foreground text-base mb-5">
                  Tidak ada layanan yang cocok dengan “{searchQuery}”.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="rounded-lg h-11 px-5 border-border"
                >
                  Tampilkan Semua Layanan
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3.5">
                {filteredServices.map((service, idx) => {
                  const accent = accentByIndex(idx);
                  const waHref = whatsappNumber
                    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Halo, saya ingin mengajukan layanan: ${service.name}`
                      )}`
                    : null;

                  return (
                    <AccordionItem
                      key={service.id}
                      value={`item-${service.id}`}
                      className="border border-border rounded-2xl px-2 bg-card overflow-hidden transition-colors hover:border-foreground/25"
                    >
                      <AccordionTrigger className="hover:no-underline py-4 md:py-5 px-3 md:px-4 rounded-xl">
                        <div className="flex items-center gap-4 text-left w-full pr-2">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.chip}`}
                          >
                            {service.icon ? (
                              <img src={service.icon} alt="" className="w-5 h-5" />
                            ) : (
                              <FileText aria-hidden="true" size={20} strokeWidth={1.75} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-semibold text-foreground text-base md:text-lg leading-snug">
                              {service.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-[13px] text-muted-foreground inline-flex items-center gap-1.5 bg-muted border border-border px-2.5 py-0.5 rounded-md font-medium">
                                <Clock
                                  aria-hidden="true"
                                  size={13}
                                  className="text-nagari-red-ink"
                                />
                                {service.estimated_time || "1–3 hari kerja"}
                              </span>
                              <span className="text-[13px] text-cat-3 inline-flex items-center gap-1.5 bg-cat-3/10 border border-cat-3/25 px-2.5 py-0.5 rounded-md font-semibold">
                                <CreditCard aria-hidden="true" size={13} />
                                {service.fee || "Gratis"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pt-2 pb-6 px-3 md:px-5 border-t border-border">
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                          <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-nagari-red-ink mb-2">
                              Deskripsi Layanan
                            </p>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                              {service.description ||
                                "Layanan administrasi dari Kantor Wali Nagari."}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-auto">
                              {waHref ? (
                                <Button
                                  asChild
                                  className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg font-medium text-sm h-11 px-5 transition-colors active:scale-[0.985]"
                                >
                                  <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <MessageCircle
                                      aria-hidden="true"
                                      className="mr-2 w-4 h-4"
                                    />
                                    Ajukan via WhatsApp
                                  </a>
                                </Button>
                              ) : (
                                <Link href="/kontak">
                                  <Button className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg font-medium text-sm h-11 px-5 transition-colors active:scale-[0.985]">
                                    Ajukan di Kantor Nagari
                                    <ArrowRight
                                      aria-hidden="true"
                                      className="ml-2 w-4 h-4"
                                    />
                                  </Button>
                                </Link>
                              )}
                              {service.form_url && (
                                <Button
                                  variant="outline"
                                  className="rounded-lg border-border text-foreground hover:bg-muted h-11 px-4 text-sm font-medium transition-colors"
                                  asChild
                                >
                                  <a
                                    href={service.form_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download
                                      aria-hidden="true"
                                      className="mr-2 h-4 w-4"
                                    />
                                    Unduh Format
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          {service.requirements && service.requirements.length > 0 && (
                            <div className="bg-muted/50 p-5 rounded-xl border border-border h-full">
                              <h4 className="font-semibold text-sm text-foreground mb-3 pb-2.5 border-b border-border">
                                Syarat Dokumen Khusus
                              </h4>
                              <ul className="space-y-2.5">
                                {service.requirements.map((req, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2.5 text-sm text-foreground/90"
                                  >
                                    <CheckCircle
                                      aria-hidden="true"
                                      size={16}
                                      className="text-nagari-red-ink mt-0.5 shrink-0"
                                    />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <Card className="bg-nagari-navy text-white border-border rounded-2xl">
              <CardHeader className="pb-4 border-b border-white/15">
                <CardTitle className="text-nagari-yellow font-serif text-xl">
                  Panduan Layanan
                </CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  4 langkah mudah pengajuan surat
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-5">
                  {[
                    {
                      title: "Pilih Layanan",
                      desc: "Cari jenis surat yang dibutuhkan dan siapkan NIK/KK.",
                    },
                    {
                      title: "Kirim Persyaratan",
                      desc: "Sampaikan data dan foto dokumen pendukung via WhatsApp atau kantor.",
                    },
                    {
                      title: "Verifikasi Berjenjang",
                      desc: "Diperiksa Wali Jorong hingga Tanda Tangan Elektronik Wali Nagari.",
                    },
                    {
                      title: "Dokumen Digital Sah",
                      desc: "Terima surat ber-QR Code resmi, siap cetak dan tervalidasi.",
                    },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-lg bg-white/10 text-nagari-yellow border border-white/15 flex items-center justify-center text-[13px] font-semibold shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-white/80 mt-0.5 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-2xl text-foreground">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-nagari-red/10 text-nagari-red-ink">
                    <Clock aria-hidden="true" size={16} />
                  </span>
                  <span className="font-serif">Jam Operasional Kantor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border pt-2">
                {scheduleRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center text-sm py-3 gap-3"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        row.closed ? "text-nagari-red-ink" : "text-foreground"
                      }`}
                    >
                      {row.hours}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Link href="/verifikasi" className="block group">
              <Card className="bg-card border border-border rounded-2xl transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-foreground/25 group-hover:shadow-md">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-cat-3/10 text-cat-3 flex items-center justify-center shrink-0">
                      <ShieldCheck aria-hidden="true" size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-base text-foreground leading-snug">
                        Verifikasi E-Dokumen
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        Cek keaslian QR Code surat nagari
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    size={18}
                    className="text-muted-foreground shrink-0 transition-transform duration-150 group-hover:translate-x-[3px] group-hover:text-foreground"
                  />
                </CardContent>
              </Card>
            </Link>
          </aside>
        </div>
      </div>

      <IkmSurveySection category="Layanan Administrasi" />

      <Footer />
    </PageBackground>
  );
}
