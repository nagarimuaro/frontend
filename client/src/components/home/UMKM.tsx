import { useState } from "react";
import { ArrowRight, Star, Loader2, Phone, MapPin, User, X, Sparkles, MessageCircle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useUMKMDirectory } from "@/lib/api";
import { Link } from "wouter";

export default function UMKM() {
  const { data: umkmResponse, isLoading } = useUMKMDirectory();
  const umkmList = umkmResponse?.data?.data?.slice(0, 6) || [];
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDetail = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedUMKM(item);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-[#3fd5ba] animate-spin" />
        </div>
      </section>
    );
  }

  if (umkmList.length === 0) return null;

  return (
    <section className="px-4 md:px-6 relative pb-10">
      <div className="container mx-auto">
        
        {/* Header Setup */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Pemberdayaan Ekonomi
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Galeri <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">UMKM Nagari</span>
            </h2>
            <p className="text-slate-600 dark:text-white/40 mt-4 text-sm md:text-base leading-relaxed font-light">
              Dukung kemandirian lokal dengan membeli produk otentik berkualitas karya anak nagari.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link href="/umkm">
              <Button className="rounded-full px-8 h-12 text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                Jelajahi Semua Produk <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {umkmList.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 100 }}
              className="h-full"
            >
              <div 
                className="group h-full flex flex-col bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.05] rounded-[2rem] overflow-hidden cursor-pointer hover:bg-white dark:hover:bg-white/[0.03] hover:border-teal-300 dark:hover:border-[#3fd5ba]/30 transition-all duration-500 shadow-lg dark:shadow-xl relative"
                onClick={(e) => handleOpenDetail(item, e)}
              >
                {/* Image Showcase */}
                <div className="aspect-[4/3] overflow-hidden relative m-3 md:m-4 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-inner">
                  {item.foto_url ? (
                    <img src={item.foto_url} alt={item.nama_usaha} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-[#3fd5ba]/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 dark:bg-[#0a1a1c]/20 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Category Badge matching accent color */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-white/90 dark:bg-[#0a1a1c]/80 backdrop-blur-md text-teal-700 dark:text-[#3fd5ba] border border-teal-200 dark:border-[#3fd5ba]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md dark:shadow-lg">
                      {item.jenis_usaha || 'UMKM'}
                    </Badge>
                  </div>
                </div>
                
                {/* Content Box */}
                <div className="px-5 md:px-7 pb-6 md:pb-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-colors leading-snug line-clamp-2 mb-2">
                    {item.nama_usaha}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-white/40 text-sm line-clamp-2 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-white/60 transition-colors font-light mb-4 flex-1">
                    {item.produk}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-[#144749]/50 flex items-center justify-center border border-teal-100 dark:border-[#3fd5ba]/10">
                        <User size={10} className="text-teal-600 dark:text-[#3fd5ba]" />
                      </div>
                      <span className="text-teal-600/70 dark:text-[#3fd5ba]/70 font-bold text-[10px] uppercase tracking-widest">
                        {item.pemilik?.nama || item.nama_pemilik || 'SME'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {(item.no_wa || item.no_hp) && (
                        <a 
                          href={`https://wa.me/${(item.no_wa || item.no_hp)?.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${item.nama_usaha}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="WhatsApp"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#128C7E]/10 dark:bg-[#128C7E]/20 flex items-center justify-center hover:bg-[#128C7E] hover:text-white text-[#128C7E] transition-colors duration-300 border border-[#128C7E]/20">
                            <MessageCircle size={14} />
                          </div>
                        </a>
                      )}
                      {item.no_hp && (
                        <a 
                          href={`tel:${item.no_hp}`}
                          onClick={(e) => e.stopPropagation()}
                          title="Telepon"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-white text-blue-500 transition-colors duration-300 border border-blue-500/20">
                            <Phone size={14} />
                          </div>
                        </a>
                      )}
                      {item.google_maps_url && (
                        <a 
                          href={item.google_maps_url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Google Maps"
                        >
                          <div className="w-8 h-8 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white text-rose-500 transition-colors duration-300 border border-rose-500/20">
                            <Map size={14} />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/umkm">
            <Button className="rounded-full px-8 h-12 w-full text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20">
              Jelajahi Semua Produk <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>

      {/* Styled Dialog for WebGIS aesthetic */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-[2.5rem] bg-white dark:bg-[#0b2023] border border-black/10 dark:border-white/[0.08] shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {selectedUMKM && (
            <div className="relative">
              {/* Floating Close Button */}
              <div 
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/60 dark:bg-[#0a1a1c]/60 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white cursor-pointer hover:bg-teal-500 dark:hover:bg-[#3fd5ba] hover:text-white dark:hover:text-[#0a1a1c] transition-colors shadow-lg dark:shadow-xl"
              >
                <X size={16} strokeWidth={2.5} />
              </div>

              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                {selectedUMKM.foto_url ? (
                  <img src={selectedUMKM.foto_url} alt={selectedUMKM.nama_usaha} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-[#3fd5ba]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b2023] via-white/80 dark:via-[#0b2023]/40 to-transparent" />
                
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 z-10">
                  <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-700 dark:text-[#3fd5ba] border border-teal-600/30 dark:border-[#3fd5ba]/30 shadow-sm dark:shadow-lg px-4 py-1.5 mb-3 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    {selectedUMKM.jenis_usaha || 'UMKM Lokal'}
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-none">
                    {selectedUMKM.nama_usaha}
                  </h2>
                </div>
              </div>

              <div className="p-6 md:p-10 space-y-8 relative">
                {/* rating bar */}
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/[0.03] self-start inline-flex px-4 py-2 rounded-full border border-black/5 dark:border-white/[0.05]">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-teal-500 dark:text-[#3fd5ba] fill-teal-500 dark:fill-[#3fd5ba]" />)}
                  </div>
                  <div className="h-3 w-px bg-black/10 dark:bg-white/20" />
                  <span className="text-xs font-bold text-teal-600 dark:text-[#3fd5ba]">4.9</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-white/30 hidden md:inline ml-2">Verified Merchant</span>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-600 dark:text-[#3fd5ba] mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> Detail Produk/Layanan
                  </h3>
                  <p className="text-slate-600 dark:text-white/60 text-base md:text-lg leading-relaxed font-light">
                    {selectedUMKM.produk || selectedUMKM.deskripsi || 'Produk UMKM lokal unggulan berkualitas tinggi karya warga nagari.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-teal-50/50 dark:bg-[#144749]/20 p-5 md:p-6 rounded-3xl border border-teal-100 dark:border-[#3fd5ba]/10">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-white/40 mb-5 flex items-center gap-2">
                      <User size={12} className="text-teal-600 dark:text-[#3fd5ba]" /> Informasi Pemilik
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-black/5 dark:border-white/[0.05] pb-3">
                        <span className="text-xs font-semibold text-slate-500 dark:text-white/30 uppercase tracking-widest">Nama Seller</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedUMKM.pemilik?.nama || selectedUMKM.nama_pemilik || '-'}</span>
                      </div>
                      
                      {selectedUMKM.no_hp && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500 dark:text-white/30 uppercase tracking-widest">Kontak / WA</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-white">{selectedUMKM.no_hp}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedUMKM.alamat && (
                    <div className="bg-teal-50/50 dark:bg-[#144749]/20 p-5 md:p-6 rounded-3xl border border-teal-100 dark:border-[#3fd5ba]/10 flex flex-col justify-center">
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-white/40 mb-3 flex items-center gap-2">
                        <MapPin size={12} className="text-teal-600 dark:text-[#3fd5ba]" /> Titik Lokasi
                      </h3>
                      <p className="text-slate-700 dark:text-white/80 text-sm leading-relaxed font-medium">
                        {selectedUMKM.alamat}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-black/5 dark:border-white/[0.05]">
                  <a 
                    href={`https://wa.me/${selectedUMKM.no_hp?.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${selectedUMKM.nama_usaha}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1"
                  >
                    <Button className="w-full bg-[#1db954] hover:bg-[#1ed760] text-white dark:text-[#0a1a1c] rounded-full h-14 font-black tracking-wide text-xs md:text-sm shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all transform hover:scale-[1.02]">
                      <Phone size={18} className="mr-2.5" /> Hubungi via WhatsApp
                    </Button>
                  </a>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-full h-14 font-bold text-xs md:text-sm border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/5" 
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
