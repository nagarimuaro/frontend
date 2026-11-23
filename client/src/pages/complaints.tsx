import { useState } from "react";
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  useComplaintCategories,
  useSubmitComplaint,
  useTrackComplaint,
} from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import complaintImage from "@assets/generated_images/customer_service_counter.png";

export default function Complaints() {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useComplaintCategories();
  const submitComplaint = useSubmitComplaint();
  const { toast } = useToast();

  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    whatsapp: "",
    kategori: "",
    judul: "",
    deskripsi: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [trackingId, setTrackingId] = useState("");
  const [submittedTrackId, setSubmittedTrackId] = useState("");
  const {
    data: trackedComplaint,
    isFetching: isTracking,
    refetch: refetchTracking,
  } = useTrackComplaint(submittedTrackId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, kategori: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim() || !formData.deskripsi.trim() || !formData.kategori) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi judul, kategori, dan isi laporan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitComplaint.mutateAsync({
        judul: formData.judul.trim(),
        deskripsi: formData.deskripsi.trim(),
        kategori: formData.kategori,
        prioritas: "Sedang",
        lokasi: {
          address: formData.nama.trim()
            ? `Pelapor: ${formData.nama.trim()}`
            : undefined,
        },
      });

      setSubmitSuccess(true);
      setSubmittedId(response.data?.id?.toString() || null);

      toast({
        title: "Laporan Terkirim",
        description: `ID Pengaduan Anda: ${response.data?.id}. Simpan ID ini untuk melacak status.`,
      });

      setFormData({
        nama: "",
        nik: "",
        whatsapp: "",
        kategori: "",
        judul: "",
        deskripsi: "",
      });
    } catch {
      toast({
        title: "Gagal Mengirim",
        description:
          "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = trackingId.trim();
    if (!cleaned) {
      toast({
        title: "ID Diperlukan",
        description: "Masukkan ID pengaduan untuk melacak status.",
        variant: "destructive",
      });
      return;
    }
    if (cleaned === submittedTrackId) {
      await refetchTracking();
    } else {
      setSubmittedTrackId(cleaned);
    }
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Layanan Pengaduan"
        description="Sampaikan aspirasi, saran, dan pengaduan Anda untuk kemajuan nagari. Identitas pelapor dijaga kerahasiaannya."
        image={complaintImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Lacak Laporan */}
          <Card className="bg-card border border-border rounded-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <Search aria-hidden="true" className="text-nagari-red-ink w-5 h-5" />
                <h2 className="font-serif font-bold text-xl text-foreground">
                  Lacak Status Pengaduan
                </h2>
              </div>

              <form
                onSubmit={handleTrackComplaint}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="complaint-track-id" className="sr-only">
                  ID Pengaduan
                </label>
                <Input
                  id="complaint-track-id"
                  placeholder="Ketik ID pengaduan Anda..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1 bg-background border-border text-foreground h-11 rounded-lg"
                />
                <Button
                  type="submit"
                  disabled={isTracking}
                  className="bg-nagari-red text-white hover:bg-nagari-red-ink h-11 px-6 rounded-lg shrink-0 text-sm font-medium"
                >
                  {isTracking ? (
                    <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search aria-hidden="true" className="w-4 h-4 mr-2" />
                  )}
                  Lacak
                </Button>
              </form>

              {trackedComplaint?.data && (
                <div className="mt-6 p-5 bg-muted/60 border border-border rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        {trackedComplaint.data.judul}
                      </p>
                      <p className="text-[13px] text-muted-foreground mt-1">
                        Kategori: {trackedComplaint.data.kategori}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-md text-[13px] font-semibold border ${
                        trackedComplaint.data.status === "Selesai"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : trackedComplaint.data.status === "Diproses"
                          ? "bg-cat-2/15 text-cat-2 border-cat-2/30"
                          : trackedComplaint.data.status === "Ditolak"
                          ? "bg-destructive/15 text-destructive border-destructive/30"
                          : "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {trackedComplaint.data.status}
                    </span>
                  </div>
                  {trackedComplaint.data.tanggapan && (
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <p className="text-[13px] font-semibold text-nagari-red-ink mb-1">
                        Tanggapan Resmi
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {trackedComplaint.data.tanggapan}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Laporan Berhasil */}
          {submitSuccess && submittedId && (
            <Card className="bg-card border border-border rounded-2xl text-center p-8">
              <div className="w-14 h-14 mx-auto bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 aria-hidden="true" className="w-7 h-7" />
              </div>
              <h2 className="font-serif font-bold text-foreground text-2xl mb-2">
                Laporan Berhasil Terkirim
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Terima kasih atas aspirasi Anda. Simpan ID pengaduan berikut untuk melacak status tindak lanjut:
              </p>

              <div className="bg-muted px-6 py-3 rounded-xl border border-border inline-block mb-6">
                <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                  {submittedId}
                </span>
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg h-11 px-5 border-border"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setSubmittedId(null);
                  }}
                >
                  Buat Laporan Baru
                </Button>
              </div>
            </Card>
          )}

          {/* Formulir */}
          {!submitSuccess && (
            <Card className="bg-card border border-border rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/40 p-6 md:p-8">
                <CardTitle className="text-2xl font-serif text-foreground">
                  Formulir Pengaduan
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm md:text-base mt-1">
                  Lengkapi formulir berikut dengan data yang jelas agar perangkat nagari dapat segera menindaklanjuti.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="complaint-nama"
                        className="text-[13px] font-semibold text-foreground block"
                      >
                        Nama Lengkap (Opsional)
                      </label>
                      <Input
                        id="complaint-nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        placeholder="Nama pelapor"
                        className="bg-background border-border text-foreground rounded-lg h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="complaint-nik"
                        className="text-[13px] font-semibold text-foreground block"
                      >
                        NIK (Opsional)
                      </label>
                      <Input
                        id="complaint-nik"
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        placeholder="16 digit NIK"
                        className="bg-background border-border text-foreground rounded-lg h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="complaint-wa"
                        className="text-[13px] font-semibold text-foreground block"
                      >
                        Nomor WhatsApp (Opsional)
                      </label>
                      <Input
                        id="complaint-wa"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                        className="bg-background border-border text-foreground rounded-lg h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="complaint-kategori"
                        className="text-[13px] font-semibold text-foreground block"
                      >
                        Kategori Laporan <span className="text-nagari-red-ink">*</span>
                      </label>
                      <Select
                        value={formData.kategori}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger
                          id="complaint-kategori"
                          className="bg-background border-border text-foreground rounded-lg h-11"
                        >
                          <SelectValue
                            placeholder={
                              categoriesLoading ? "Memuat..." : "Pilih kategori"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Memuat...
                            </SelectItem>
                          ) : Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((cat: any, idx: number) => (
                              <SelectItem
                                key={idx}
                                value={
                                  typeof cat === "string"
                                    ? cat
                                    : cat.slug || cat.name || String(idx)
                                }
                              >
                                {typeof cat === "string" ? cat : cat.name || cat}
                              </SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="Infrastruktur">
                                Infrastruktur &amp; Pembangunan
                              </SelectItem>
                              <SelectItem value="Pelayanan">
                                Pelayanan Publik
                              </SelectItem>
                              <SelectItem value="Keamanan">
                                Keamanan &amp; Ketertiban
                              </SelectItem>
                              <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                              <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="complaint-judul"
                      className="text-[13px] font-semibold text-foreground block"
                    >
                      Judul Laporan <span className="text-nagari-red-ink">*</span>
                    </label>
                    <Input
                      id="complaint-judul"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      placeholder="Contoh: Lampu penerangan jalan RT 01 mati"
                      required
                      className="bg-background border-border text-foreground rounded-lg h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="complaint-deskripsi"
                      className="text-[13px] font-semibold text-foreground block"
                    >
                      Isi Laporan <span className="text-nagari-red-ink">*</span>
                    </label>
                    <Textarea
                      id="complaint-deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      placeholder="Jelaskan detail kejadian, lokasi yang tepat, dan waktu kejadian..."
                      className="min-h-[150px] bg-background border-border text-foreground rounded-lg p-3.5"
                      required
                    />
                  </div>

                  <div className="bg-muted/60 border border-border rounded-xl p-4 flex gap-3 text-muted-foreground text-sm">
                    <AlertTriangle
                      aria-hidden="true"
                      className="shrink-0 w-5 h-5 text-amber-600 dark:text-nagari-yellow mt-0.5"
                    />
                    <p className="leading-relaxed">
                      Dengan mengirimkan laporan ini, Anda menyatakan informasi yang disampaikan adalah benar dan dapat dipertanggungjawabkan.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-nagari-red text-white hover:bg-nagari-red-ink h-12 rounded-lg font-medium text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send aria-hidden="true" className="mr-2 h-4 w-4" />
                        Kirim Laporan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Alur Tindak Lanjut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Send,
                title: "1. Kirim Laporan",
                desc: "Sampaikan pengaduan atau aspirasi dengan rincian yang jelas.",
              },
              {
                icon: CheckCircle2,
                title: "2. Verifikasi",
                desc: "Perangkat nagari memverifikasi laporan yang masuk.",
              },
              {
                icon: AlertTriangle,
                title: "3. Tindak Lanjut",
                desc: "Laporan ditindaklanjuti dan status dapat dilacak lewat ID.",
              },
            ].map((step) => (
              <Card
                key={step.title}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-11 h-11 mx-auto rounded-xl bg-muted text-nagari-red-ink flex items-center justify-center mb-4">
                  <step.icon aria-hidden="true" size={20} />
                </div>
                <h3 className="text-foreground font-semibold text-base mb-1.5">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
