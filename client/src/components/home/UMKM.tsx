import { useState } from "react";
import { ArrowRight, Loader2, Phone, MapPin, User, MessageCircle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useUMKMDirectory } from "@/lib/api";
import { accentForName } from "@/lib/accents";
import { Link } from "wouter";

const waDigits = (raw?: string | null) => raw?.replace(/[^0-9]/g, "") || "";

export default function UMKM() {
  const { data: umkmResponse, isLoading } = useUMKMDirectory();
  const umkmList = umkmResponse?.data?.data?.slice(0, 6) || [];
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDetail = (item: any) => {
    setSelectedUMKM(item);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto flex justify-center">
          <Loader2 aria-hidden="true" className="w-8 h-8 text-nagari-red animate-spin" />
        </div>
      </section>
    );
  }

  if (umkmList.length === 0) return null;

  const selectedWa = selectedUMKM ? waDigits(selectedUMKM.no_wa || selectedUMKM.no_hp) : "";

  return (
    <section aria-label="Galeri UMKM Nagari" className="py-16 md:py-24 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2.5 text-nagari-red-ink font-medium text-[13px] mb-3">
              <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-red" />
              Pemberdayaan Ekonomi
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Galeri UMKM Nagari
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Usaha warga nagari beserta kontak pemiliknya. Hubungi langsung tanpa perantara.
            </p>
          </div>

          <div className="hidden md:block">
            <Link href="/umkm">
              <Button variant="outline" className="rounded-lg px-5 h-11 text-sm font-medium bg-card hover:bg-nagari-red text-foreground hover:text-white hover:border-nagari-red border-border transition-colors group">
                Lihat Semua UMKM
                <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkmList.map((item) => {
            const accent = accentForName(item.jenis_usaha);
            const wa = waDigits(item.no_wa || item.no_hp);

            return (
              <div key={item.id} className="h-full">
                <div className={`group h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}>
                  <div aria-hidden="true" className={`h-1 w-full ${accent.edge}`} />

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(item)}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative m-4 rounded-xl border border-border bg-muted">
                      {item.foto_url ? (
                        <img
                          src={item.foto_url}
                          alt={item.nama_usaha}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center px-4 text-center text-sm font-medium text-muted-foreground">
                          Foto belum tersedia
                        </div>
                      )}

                      <div className="absolute top-3 right-3 z-20">
                        <Badge className={`bg-background border border-border px-2.5 py-1 text-[13px] font-medium ${accent.ink}`}>
                          {item.jenis_usaha || "UMKM"}
                        </Badge>
                      </div>
                    </div>

                    <div className="px-5">
                      <h3 className={`text-xl font-serif font-bold text-foreground transition-colors leading-snug line-clamp-2 mb-2 ${accent.inkHover}`}>
                        {item.nama_usaha}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {item.produk}
                      </p>
                    </div>
                  </button>

                  <div className="px-5 pb-5 mt-auto pt-4">
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 min-w-0">
                        <span aria-hidden="true" className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${accent.chip}`}>
                          <User size={13} />
                        </span>
                        <span className="text-muted-foreground font-medium text-[13px] truncate">
                          {item.pemilik?.nama || item.nama_pemilik || "Pemilik belum dicatat"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {wa && (
                          <a
                            href={`https://wa.me/${wa}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${item.nama_usaha}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-lg bg-brand-wa/10 text-brand-wa border border-brand-wa/25 flex items-center justify-center transition-colors hover:bg-brand-wa/20"
                          >
                            <MessageCircle aria-hidden="true" size={16} />
                            <span className="sr-only">WhatsApp {item.nama_usaha}</span>
                          </a>
                        )}
                        {item.no_hp && (
                          <a
                            href={`tel:${item.no_hp}`}
                            className="w-11 h-11 rounded-lg bg-nagari-red/10 text-nagari-red-ink border border-nagari-red/25 flex items-center justify-center transition-colors hover:bg-nagari-red/20"
                          >
                            <Phone aria-hidden="true" size={16} />
                            <span className="sr-only">Telepon {item.nama_usaha}</span>
                          </a>
                        )}
                        {item.google_maps_url && (
                          <a
                            href={item.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-lg bg-cat-4/10 text-cat-4 border border-cat-4/25 flex items-center justify-center transition-colors hover:bg-cat-4/20"
                          >
                            <Map aria-hidden="true" size={16} />
                            <span className="sr-only">Lokasi {item.nama_usaha} di Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/umkm">
            <Button variant="outline" className="rounded-lg px-6 h-11 w-full text-sm font-medium bg-card hover:bg-nagari-red text-foreground hover:text-white hover:border-nagari-red border-border transition-colors">
              Lihat Semua UMKM
              <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-card border border-border shadow-lg [&>button]:z-50 [&>button]:w-11 [&>button]:h-11 [&>button]:rounded-lg [&>button]:bg-background [&>button]:border [&>button]:border-border [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:opacity-100">
          {selectedUMKM && (
            <div className="relative">
              <div className="relative h-56 md:h-72 w-full overflow-hidden bg-muted">
                {selectedUMKM.foto_url ? (
                  <img src={selectedUMKM.foto_url} alt={selectedUMKM.nama_usaha} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                    Foto belum tersedia
                  </div>
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

                <div className="absolute bottom-5 md:bottom-7 left-5 md:left-8 right-5 md:right-8 z-10">
                  <Badge className="bg-background text-nagari-red-ink border border-border px-3 py-1 mb-2.5 text-[13px] font-medium">
                    {selectedUMKM.jenis_usaha || "UMKM Lokal"}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight [overflow-wrap:anywhere]">
                    {selectedUMKM.nama_usaha}
                  </DialogTitle>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-nagari-red-ink mb-2">
                    Detail Produk &amp; Layanan
                  </h3>
                  <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                    {selectedUMKM.produk || selectedUMKM.deskripsi || "Keterangan produk belum dicatat."}
                  </DialogDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted p-5 rounded-xl border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User aria-hidden="true" size={15} className="text-nagari-red-ink" /> Informasi Pemilik
                    </h3>

                    <dl className="flex flex-col gap-3">
                      <div className="flex justify-between items-center gap-3 border-b border-border pb-3">
                        <dt className="text-[13px] font-medium text-muted-foreground">Nama Pemilik</dt>
                        <dd className="text-sm font-semibold text-foreground text-right">{selectedUMKM.pemilik?.nama || selectedUMKM.nama_pemilik || "—"}</dd>
                      </div>

                      <div className="flex justify-between items-center gap-3">
                        <dt className="text-[13px] font-medium text-muted-foreground">Kontak</dt>
                        <dd className="text-sm font-semibold text-foreground text-right tabular-nums">{selectedUMKM.no_wa || selectedUMKM.no_hp || "—"}</dd>
                      </div>
                    </dl>
                  </div>

                  {selectedUMKM.alamat && (
                    <div className="bg-muted p-5 rounded-xl border border-border flex flex-col justify-center">
                      <h3 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                        <MapPin aria-hidden="true" size={15} className="text-nagari-red-ink" /> Alamat Usaha
                      </h3>
                      <p className="text-foreground text-sm leading-relaxed">
                        {selectedUMKM.alamat}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
                  {selectedWa && (
                    <a
                      href={`https://wa.me/${selectedWa}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${selectedUMKM.nama_usaha}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-brand-wa text-brand-wa-foreground hover:brightness-95 rounded-lg h-12 font-medium text-sm transition-all">
                        <MessageCircle aria-hidden="true" size={18} className="mr-2" /> Hubungi via WhatsApp
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg h-12 font-medium text-sm border-border text-foreground hover:bg-muted"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Tutup Detail
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
