import { useState, useMemo } from "react";
import {
  Phone,
  MapPin,
  Search,
  Filter,
  Loader2,
  Store,
  X,
  User,
  Map,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUMKMDirectory, useUMKMCategories, useSubmitUMKM } from "@/lib/api";
import { accentForName } from "@/lib/accents";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import umkmHeaderImage from "@assets/generated_images/traditional_woven_fabric_for_umkm.png";

const JENIS_USAHA_OPTIONS = [
  "Perdagangan",
  "Jasa",
  "Produksi",
  "Pertanian",
  "Lainnya",
];

export default function UMKM() {
  const { data: umkmData, isLoading: umkmLoading } = useUMKMDirectory();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useUMKMCategories();
  const submitUMKM = useSubmitUMKM();
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [regForm, setRegForm] = useState({
    nama_usaha: "",
    produk_layanan: "",
    alamat: "",
    nama_pemilik: "",
    no_wa: "",
    jenis_usaha: "Lainnya",
    deskripsi: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const umkm = umkmData?.data?.data || [];
  const categories: string[] = categoriesData?.data || [];

  const filteredUmkm = useMemo(() => {
    return umkm.filter((u: any) => {
      const matchesSearch =
        searchQuery === "" ||
        (u.nama_usaha || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.produk || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || u.jenis_usaha === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [umkm, searchQuery, selectedCategory]);

  const handleOpenDetail = (product: any) => {
    setSelectedUMKM(product);
    setIsDialogOpen(true);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regForm.nama_usaha.trim() ||
      !regForm.produk_layanan.trim() ||
      !regForm.alamat.trim() ||
      !regForm.nama_pemilik.trim() ||
      !regForm.no_wa.trim()
    ) {
      setRegError("Semua kolom wajib harus diisi.");
      return;
    }
    setRegLoading(true);
    setRegError(null);
    try {
      await submitUMKM.mutateAsync(regForm);
      setRegSuccess(true);
      setRegForm({
        nama_usaha: "",
        produk_layanan: "",
        alamat: "",
        nama_pemilik: "",
        no_wa: "",
        jenis_usaha: "Lainnya",
        deskripsi: "",
      });
    } catch (err: any) {
      setRegError(err?.message || "Gagal mengirim pendaftaran. Coba lagi.");
    } finally {
      setRegLoading(false);
    }
  };

  const getWhatsAppNumber = (product: any) =>
    product?.no_wa || product?.no_hp || "";

  if (umkmLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat data UMKM...
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
        title="UMKM & Ekonomi Kreatif"
        description="Jelajahi produk lokal dan usaha masyarakat nagari langsung dari pelaku UMKM setempat."
        image={umkmHeaderImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[320px] space-y-6 flex-shrink-0">
            <Card className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-24">
              <div className="px-6 py-4 border-b border-border bg-muted/50">
                <h2 className="font-serif font-bold text-lg flex items-center gap-2.5 text-foreground">
                  <Filter aria-hidden="true" size={18} className="text-nagari-red-ink" />
                  Saring Direktori
                </h2>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="umkm-search"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Cari Usaha atau Produk
                  </label>
                  <div className="relative">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="umkm-search"
                      placeholder="Cari nama toko atau produk..."
                      className="pl-10 h-11 rounded-lg bg-background border-border text-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[13px] font-semibold text-foreground block">
                    Kategori Usaha
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      aria-pressed={selectedCategory === "all"}
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3.5 h-10 rounded-lg text-[13px] font-medium border transition-colors ${
                        selectedCategory === "all"
                          ? "bg-nagari-red text-white border-nagari-red"
                          : "bg-background text-foreground border-border hover:bg-muted"
                      }`}
                    >
                      Semua
                    </button>
                    {categoriesLoading ? (
                      <Loader2
                        aria-hidden="true"
                        className="w-4 h-4 animate-spin text-nagari-red my-3 mx-2"
                      />
                    ) : (
                      (categories.length > 0
                        ? categories
                        : JENIS_USAHA_OPTIONS
                      ).map((cat: string) => {
                        const active = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 h-10 rounded-lg text-[13px] font-medium border transition-colors ${
                              active
                                ? "bg-nagari-red text-white border-nagari-red"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="p-5 bg-nagari-navy text-white rounded-xl text-center space-y-3">
                  <div className="w-11 h-11 bg-white/10 text-nagari-yellow rounded-xl flex items-center justify-center mx-auto border border-white/15">
                    <Store aria-hidden="true" size={20} />
                  </div>
                  <h3 className="font-bold text-white text-base font-serif">
                    Punya Usaha Lokal?
                  </h3>
                  <p className="text-[13px] text-white/80 leading-relaxed">
                    Daftarkan usaha Anda secara gratis di direktori resmi nagari.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setRegSuccess(false);
                      setRegError(null);
                      setIsRegisterDialogOpen(true);
                    }}
                    className="w-full bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg text-sm font-medium h-11"
                  >
                    Registrasi Mitra
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <div className="w-full flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-border gap-3">
              <p className="text-muted-foreground text-sm md:text-base">
                Menampilkan{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {filteredUmkm.length}
                </span>{" "}
                dari {umkm.length} usaha
                {searchQuery && (
                  <span className="ml-1.5">(kata kunci: "{searchQuery}")</span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-lg h-10 px-4 border-border text-sm"
                >
                  <X aria-hidden="true" className="w-4 h-4 mr-1.5" />
                  Bersihkan Filter
                </Button>
              )}
            </div>

            {filteredUmkm.length === 0 ? (
              <Card className="text-center py-16 px-6 bg-card rounded-2xl border border-border">
                <Store
                  aria-hidden="true"
                  className="w-12 h-12 mx-auto text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
                  {umkm.length === 0
                    ? "Belum ada mitra UMKM yang terdaftar."
                    : "Tidak ada usaha yang cocok dengan pencarian atau kategori yang dipilih."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg h-11 px-5 border-border"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset Pencarian
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUmkm.map((product: any) => {
                  const accent = accentForName(product.jenis_usaha);
                  const wa = getWhatsAppNumber(product);
                  const cleanWa = wa.replace(/[^0-9]/g, "");
                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden bg-card border border-border rounded-2xl h-full flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(product)}
                        className="aspect-[4/3] relative overflow-hidden bg-muted block w-full text-left"
                      >
                        {product.foto_url ? (
                          <img
                            src={product.foto_url}
                            alt={product.nama_usaha}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store
                              aria-hidden="true"
                              className="w-12 h-12 text-muted-foreground/40"
                            />
                          </div>
                        )}
                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-background/95 border border-border ${accent.ink}`}
                        >
                          {product.jenis_usaha || "UMKM"}
                        </span>
                      </button>

                      <CardContent className="p-5 flex-1 flex flex-col gap-4">
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(product)}
                            className="text-left"
                          >
                            <h3 className="font-serif font-bold text-lg text-foreground hover:text-nagari-red-ink transition-colors line-clamp-2 leading-snug">
                              {product.nama_usaha}
                            </h3>
                          </button>
                          <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">
                            {product.deskripsi ||
                              product.produk ||
                              "Informasi produk belum dicantumkan."}
                          </p>
                        </div>

                        <div className="space-y-2 text-[13px] text-muted-foreground bg-muted/50 p-3.5 rounded-xl border border-border mt-auto">
                          <div className="flex items-start gap-2.5">
                            <MapPin
                              aria-hidden="true"
                              size={15}
                              className="text-nagari-red-ink shrink-0 mt-0.5"
                            />
                            <span className="line-clamp-1">
                              {product.alamat || "Wilayah Nagari"}
                            </span>
                          </div>
                          {wa && (
                            <div className="flex items-center gap-2.5">
                              <MessageCircle
                                aria-hidden="true"
                                size={15}
                                className="text-emerald-700 dark:text-emerald-400 shrink-0"
                              />
                              <span className="truncate tabular-nums">{wa}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="px-5 py-4 border-t border-border flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[13px] text-muted-foreground block">
                            Pengelola
                          </span>
                          <span className="font-semibold text-sm text-foreground line-clamp-1">
                            {product.pemilik?.nama || "Mitra UMKM"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenDetail(product)}
                            className="h-11 px-3.5 rounded-lg border-border text-[13px] font-medium"
                          >
                            Detail
                          </Button>
                          {cleanWa && (
                            <a
                              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                                `Halo, saya melihat usaha ${product.nama_usaha} di Portal Nagari.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Hubungi ${product.nama_usaha} melalui WhatsApp`}
                              className="w-11 h-11 rounded-lg bg-brand-wa text-brand-wa-foreground flex items-center justify-center hover:brightness-95 transition-all"
                            >
                              <MessageCircle aria-hidden="true" size={18} />
                            </a>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UMKM Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-card border border-border">
          {selectedUMKM && (
            <>
              <div className="relative h-64 bg-nagari-navy">
                {selectedUMKM.foto_url ? (
                  <img
                    src={selectedUMKM.foto_url}
                    alt={selectedUMKM.nama_usaha}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store aria-hidden="true" className="w-16 h-16 text-white/25" />
                  </div>
                )}

                <button
                  type="button"
                  aria-label="Tutup detail UMKM"
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 w-11 h-11 bg-black/60 rounded-lg flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
                >
                  <X aria-hidden="true" size={20} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-nagari-navy via-nagari-navy/50 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 z-10">
                  <Badge className="bg-nagari-red text-white border-none text-[13px] font-medium px-3 py-1 mb-2">
                    {selectedUMKM.jenis_usaha || "UMKM"}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                    {selectedUMKM.nama_usaha}
                  </DialogTitle>
                </div>
              </div>

              <div className="p-6 space-y-6 bg-card">
                <div className="space-y-2">
                  <h3 className="font-bold font-serif text-lg text-foreground">
                    Deskripsi Usaha
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {selectedUMKM.deskripsi ||
                      selectedUMKM.produk ||
                      "Belum ada rincian produk atau layanan."}
                  </p>
                  {selectedUMKM.produk && selectedUMKM.deskripsi && (
                    <div className="p-3.5 bg-muted/60 rounded-xl border border-border">
                      <p className="text-[13px] font-semibold text-foreground mb-0.5">
                        Produk Utama
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUMKM.produk}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-5 rounded-xl border border-border space-y-3">
                    <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <User aria-hidden="true" size={16} className="text-nagari-red-ink" />
                      Informasi Penjual
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div>
                        <p className="text-[13px] text-muted-foreground">Pemilik Usaha</p>
                        <p className="font-semibold text-foreground">
                          {selectedUMKM.pemilik?.nama || "Mitra UMKM"}
                        </p>
                      </div>
                      {getWhatsAppNumber(selectedUMKM) && (
                        <div>
                          <p className="text-[13px] text-muted-foreground">WhatsApp</p>
                          <p className="font-medium text-foreground font-mono">
                            {getWhatsAppNumber(selectedUMKM)}
                          </p>
                        </div>
                      )}
                      {selectedUMKM.no_hp &&
                        selectedUMKM.no_wa &&
                        selectedUMKM.no_hp !== selectedUMKM.no_wa && (
                          <div className="flex items-center gap-2">
                            <Phone aria-hidden="true" size={14} className="text-muted-foreground" />
                            <span className="font-mono text-foreground">
                              {selectedUMKM.no_hp}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-5 rounded-xl border border-border space-y-3">
                    <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                      <MapPin aria-hidden="true" size={16} className="text-nagari-red-ink" />
                      Lokasi Usaha
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedUMKM.alamat || "Wilayah Nagari"}
                    </p>
                    {selectedUMKM.google_maps_url && (
                      <a
                        href={selectedUMKM.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-cat-2 hover:underline font-medium"
                      >
                        <Map aria-hidden="true" size={15} />
                        Buka di Google Maps
                        <ExternalLink aria-hidden="true" size={13} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  {getWhatsAppNumber(selectedUMKM) && (
                    <a
                      href={`https://wa.me/${getWhatsAppNumber(selectedUMKM).replace(
                        /[^0-9]/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Halo, saya melihat usaha ${selectedUMKM.nama_usaha} di Portal Nagari.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-brand-wa hover:brightness-95 text-brand-wa-foreground rounded-lg h-11 text-sm font-medium">
                        <MessageCircle aria-hidden="true" size={17} className="mr-2" />
                        Hubungi via WhatsApp
                      </Button>
                    </a>
                  )}
                  {selectedUMKM.google_maps_url && (
                    <a
                      href={selectedUMKM.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-lg h-11 border-border text-sm font-medium"
                      >
                        <Map aria-hidden="true" size={17} className="mr-2" />
                        Lihat Lokasi
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-card border border-border">
          <button
            type="button"
            aria-label="Tutup formulir registrasi"
            onClick={() => setIsRegisterDialogOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-20"
          >
            <X aria-hidden="true" size={18} />
          </button>

          {regSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle2 aria-hidden="true" size={28} />
              </div>
              <DialogTitle className="font-serif font-bold text-2xl text-foreground">
                Pendaftaran Berhasil
              </DialogTitle>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Terima kasih telah mendaftarkan UMKM Anda. Perangkat nagari akan memverifikasi data dalam 1–3 hari kerja.
              </p>
              <Button
                type="button"
                onClick={() => setIsRegisterDialogOpen(false)}
                className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-6 text-sm font-medium"
              >
                Tutup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegSubmit} className="space-y-5">
              <div className="pr-10">
                <DialogTitle className="font-serif font-bold text-2xl text-foreground">
                  Registrasi Mitra UMKM
                </DialogTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Daftarkan usaha Anda secara gratis ke direktori nagari.
                </p>
              </div>

              {regError && (
                <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle aria-hidden="true" size={16} />
                  {regError}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-nama-usaha"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Nama Usaha *
                  </label>
                  <Input
                    id="reg-nama-usaha"
                    required
                    value={regForm.nama_usaha}
                    onChange={(e) =>
                      setRegForm((p) => ({ ...p, nama_usaha: e.target.value }))
                    }
                    placeholder="Contoh: Warung Makan Sederhana"
                    className="h-11 rounded-lg bg-background border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-produk"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Produk / Layanan *
                  </label>
                  <Input
                    id="reg-produk"
                    required
                    value={regForm.produk_layanan}
                    onChange={(e) =>
                      setRegForm((p) => ({
                        ...p,
                        produk_layanan: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Kuliner, Tenun, Jasa Jahit"
                    className="h-11 rounded-lg bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reg-pemilik"
                      className="text-[13px] font-semibold text-foreground block"
                    >
                      Nama Pemilik *
                    </label>
                    <Input
                      id="reg-pemilik"
                      required
                      value={regForm.nama_pemilik}
                      onChange={(e) =>
                        setRegForm((p) => ({
                          ...p,
                          nama_pemilik: e.target.value,
                        }))
                      }
                      placeholder="Nama lengkap"
                      className="h-11 rounded-lg bg-background border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reg-wa"
                      className="text-[13px] font-semibold text-foreground block"
                    >
                      No. WhatsApp *
                    </label>
                    <Input
                      id="reg-wa"
                      required
                      value={regForm.no_wa}
                      onChange={(e) =>
                        setRegForm((p) => ({ ...p, no_wa: e.target.value }))
                      }
                      placeholder="08xxxxxxxxxx"
                      className="h-11 rounded-lg bg-background border-border"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-alamat"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Alamat Usaha *
                  </label>
                  <Input
                    id="reg-alamat"
                    required
                    value={regForm.alamat}
                    onChange={(e) =>
                      setRegForm((p) => ({ ...p, alamat: e.target.value }))
                    }
                    placeholder="Alamat lengkap lokasi usaha"
                    className="h-11 rounded-lg bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[13px] font-semibold text-foreground block">
                    Jenis Usaha
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {JENIS_USAHA_OPTIONS.map((j) => (
                      <button
                        key={j}
                        type="button"
                        aria-pressed={regForm.jenis_usaha === j}
                        onClick={() =>
                          setRegForm((p) => ({ ...p, jenis_usaha: j }))
                        }
                        className={`px-3.5 h-10 rounded-lg text-[13px] font-medium border transition-colors ${
                          regForm.jenis_usaha === j
                            ? "bg-nagari-red text-white border-nagari-red"
                            : "bg-background text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {j}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="reg-deskripsi"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    id="reg-deskripsi"
                    value={regForm.deskripsi}
                    onChange={(e) =>
                      setRegForm((p) => ({ ...p, deskripsi: e.target.value }))
                    }
                    placeholder="Ceritakan singkat tentang usaha Anda..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background text-foreground px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={regLoading}
                className="w-full bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-12 text-sm font-medium"
              >
                {regLoading ? (
                  <Loader2 aria-hidden="true" size={17} className="animate-spin mr-2" />
                ) : (
                  <Store aria-hidden="true" size={17} className="mr-2" />
                )}
                {regLoading ? "Mengirim..." : "Daftarkan UMKM Saya"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </PageBackground>
  );
}
