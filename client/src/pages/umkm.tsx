import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, Phone, MapPin, Search, Filter, Star, Loader2, Store, X, User, Mail, Clock, Map, MessageCircle, ExternalLink, CheckCircle2, AlertCircle
} from "lucide-react";
import { 
  Card, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useUMKMDirectory, useUMKMCategories, useSubmitUMKM } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import umkmHeaderImage from "@assets/generated_images/traditional_woven_fabric_for_umkm.png";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const JENIS_USAHA_OPTIONS = ["Perdagangan", "Jasa", "Produksi", "Pertanian", "Lainnya"];

export default function UMKM() {
  const { data: umkmData, isLoading: umkmLoading } = useUMKMDirectory();
  const { data: categoriesData, isLoading: categoriesLoading } = useUMKMCategories();
  const submitUMKM = useSubmitUMKM();
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Registration form state
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
  
  // API returns paginated data: response.data.data is the array
  const umkm = umkmData?.data?.data || [];
  // Categories API returns array of strings like ["Perdagangan", "Jasa", ...]
  const categories: string[] = categoriesData?.data || [];

  // Filter UMKM — match jenis_usaha string directly
  const filteredUmkm = useMemo(() => {
    return umkm.filter((u: any) => {
      const matchesSearch = searchQuery === "" || 
        (u.nama_usaha || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.produk || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        u.jenis_usaha === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [umkm, searchQuery, selectedCategory]);

  const handleOpenDetail = (product: any) => {
    setSelectedUMKM(product);
    setIsDialogOpen(true);
  };

  // Registration form handler
  const handleRegSubmit = async () => {
    if (!regForm.nama_usaha || !regForm.produk_layanan || !regForm.alamat || !regForm.nama_pemilik || !regForm.no_wa) {
      setRegError("Semua field wajib harus diisi.");
      return;
    }
    setRegLoading(true);
    setRegError(null);
    try {
      await submitUMKM.mutateAsync(regForm);
      setRegSuccess(true);
      setRegForm({ nama_usaha: "", produk_layanan: "", alamat: "", nama_pemilik: "", no_wa: "", jenis_usaha: "Lainnya", deskripsi: "" });
    } catch (err: any) {
      setRegError(err?.message || "Gagal mengirim pendaftaran. Coba lagi.");
    } finally {
      setRegLoading(false);
    }
  };

  const getWhatsAppNumber = (product: any) => {
    return product.no_wa || product.no_hp || "";
  };

  if (umkmLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat data UMKM...</span>
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
        description="Dukung produk lokal Nagari asli ciptaan masyarakat. Jelajahi UMKM berkualitas langsung dari pengrajin dan petani."
        image={umkmHeaderImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4 space-y-6 flex-shrink-0"
          >
             <div className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl sticky top-28 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-40 h-40 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[40px] pointer-events-none" />
               <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                 <Filter size={20} className="text-teal-600 dark:text-[#3fd5ba]" /> Saring Direktori
               </h3>
               
               <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50">Cari Cepat</label>
                   <div className="relative">
                     <Search className="absolute left-4 top-3.5 h-4 w-4 text-teal-600/50 dark:text-[#3fd5ba]/50 z-10" />
                     <Input 
                       placeholder="Cari toko/produk..." 
                       className="pl-12 h-12 rounded-xl bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-teal-300 dark:focus:border-[#3fd5ba]/50 transition-all font-light" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                 </div>

                 <div className="space-y-4">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50">Kategori Usaha</label>
                   <div className="flex flex-wrap gap-2">
                     <Badge 
                       className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 border ${
                         selectedCategory === "all" 
                           ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent shadow-sm" 
                           : "bg-white/5 text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/10"
                       }`}
                       onClick={() => setSelectedCategory("all")}
                     >
                       Semua
                     </Badge>
                     {categoriesLoading ? (
                       <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-[#3fd5ba] mx-2" />
                     ) : (categories.length > 0 ? categories : JENIS_USAHA_OPTIONS).map((cat: string) => (
                       <Badge 
                         key={cat} 
                         className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 border ${
                           selectedCategory === cat 
                             ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent shadow-sm" 
                             : "bg-white/5 text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/10"
                         }`}
                         onClick={() => setSelectedCategory(cat)}
                       >
                         {cat}
                       </Badge>
                     ))}
                   </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-[#123136] to-[#0a1a1c] rounded-2xl border border-teal-300 dark:border-[#3fd5ba]/20 relative overflow-hidden text-center isolate">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[40px] -z-10" />
                    <div className="w-12 h-12 bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-300 dark:border-[#3fd5ba]/20 shadow-inner">
                        <Store size={20} />
                    </div>
                    <h4 className="font-bold text-white text-base mb-2 font-serif">Punya Usaha Lokal?</h4>
                    <p className="text-xs text-white/50 mb-6 font-light leading-relaxed">Daftarkan etalase produk Anda secara gratis ke pemerintah Nagari.</p>
                    <Button 
                      onClick={() => { setRegSuccess(false); setRegError(null); setIsRegisterDialogOpen(true); }}
                      className="w-full bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white rounded-xl uppercase tracking-widest text-[10px] font-bold h-11 border-none shadow-sm"
                    >
                      Registrasi Mitra
                    </Button>
                 </div>
               </div>
             </div>
          </motion.div>

          {/* Product Grid */}
          <div className="w-full flex-1">
            {/* Filter Result Counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
              <p className="text-slate-600 dark:text-white/60 font-light">
                Ditemukan <span className="font-bold text-teal-600 dark:text-[#3fd5ba]">{filteredUmkm.length}</span> usaha dari {umkm.length} direktori
                {(searchQuery || selectedCategory !== "all") && (
                  <span className="text-sm ml-2 text-slate-600 dark:text-white/40">
                    {searchQuery && <span>(filter: "{searchQuery}")</span>}
                  </span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full h-9 uppercase tracking-widest text-[10px] font-bold px-4"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" /> Bersihkan Filter
                </Button>
              )}
            </div>

            {filteredUmkm.length === 0 ? (
              <div className="text-center py-24 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-sm rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
                <Store className="w-20 h-20 mx-auto text-slate-300 dark:text-white/10 mb-6 relative z-10" />
                <p className="text-slate-600 dark:text-white/60 text-lg font-light relative z-10 mb-8 max-w-sm mx-auto">
                  {umkm.length === 0 ? "Belum ada mitra UMKM yang terdaftar di basis data." : "Ups, tidak ada yang cocok. Coba ubah kata kunci atau hapus kategori."}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button 
                    variant="outline" 
                    className="relative z-10 bg-white/5 border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/10 rounded-full uppercase tracking-widest text-[10px] font-bold h-11 px-8"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  >
                    Reset Form Pencarian
                  </Button>
                )}
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredUmkm.map((product: any) => (
                  <motion.div
                    key={product.id}
                    variants={item}
                    className="h-full"
                  >
                    <Card className="overflow-hidden bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-sm hover:shadow-lg transition-all duration-500 group border border-black/5 dark:border-white/10 hover:border-teal-300 dark:hover:border-[#3fd5ba]/30 h-full flex flex-col rounded-3xl cursor-pointer relative" onClick={() => handleOpenDetail(product)}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none z-0" />
                      
                      <div className="aspect-[4/3] relative overflow-hidden z-10">
                        <div className="absolute inset-0 bg-black/5 dark:bg-[#0a1a1c]/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                        {product.foto_url ? (
                          <img 
                            src={product.foto_url} 
                            alt={product.nama_usaha}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center">
                            <Store className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30 px-3 py-1.5 uppercase tracking-widest text-[9px] font-bold">
                            {product.jenis_usaha || 'UMKM'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
                          <Button size="sm" className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white shadow-sm rounded-xl font-bold uppercase tracking-widest text-[9px] px-4 h-9" onClick={(e) => { e.stopPropagation(); handleOpenDetail(product); }}>
                            <Search size={14} className="mr-1.5" /> Detail Profil
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 md:p-8 flex-1 relative z-20">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-colors line-clamp-2 leading-tight">
                            {product.nama_usaha}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mb-4">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[10px] text-slate-600 dark:text-white/40 ml-1 font-bold tracking-widest uppercase">Verified</span>
                        </div>
                        <p className="text-slate-600 dark:text-white/50 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                          {product.deskripsi || product.produk || 'Tidak ada spesifikasi produk yang dicantumkan.'}
                        </p>
                        
                        <div className="space-y-3 text-sm text-slate-600 dark:text-white/70 bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 group-hover:bg-teal-600/5 dark:group-hover:bg-[#3fd5ba]/5 transition-colors">
                          <div className="flex items-start gap-3">
                             <MapPin size={16} className="text-teal-600 dark:text-[#3fd5ba] shrink-0 mt-0.5" />
                             <span className="line-clamp-1 font-light">{product.alamat || 'Area Lokasi Usaha Nagari'}</span>
                          </div>
                          {getWhatsAppNumber(product) && (
                            <div className="flex items-center gap-3">
                               <MessageCircle size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                               <span className="font-light truncate">{getWhatsAppNumber(product)}</span>
                            </div>
                          )}
                          {product.google_maps_url && (
                            <div className="flex items-center gap-3">
                               <Map size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                               <span className="font-light text-blue-600 dark:text-blue-400 text-xs">Lihat di Google Maps</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 md:px-8 border-t border-black/5 dark:border-white/5 mt-auto flex items-center justify-between bg-white/[0.02] relative z-20">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/40 mb-1">Pengelola Mitra</span>
                            <span className="font-bold text-sm text-teal-600 dark:text-[#3fd5ba] line-clamp-1">{product.pemilik?.nama || 'Layanan Usaha'}</span>
                        </div>
                        <a href={`https://wa.me/${getWhatsAppNumber(product)?.replace(/[^0-9]/g, '')}?text=Halo, saya mengunjungi Nagari Portal dan tertarik dengan UMKM ${product.nama_usaha}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 ml-3">
                          <Button size="icon" className="rounded-xl w-11 h-11 bg-[#128C7E] text-white hover:bg-[#075E54] shadow-sm transition-colors border-none group/wa">
                            <MessageCircle size={18} className="group-hover/wa:-rotate-12 transition-transform" />
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* UMKM Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-[2rem] bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 shadow-2xl">
          {selectedUMKM && (
            <>
              {/* Header Image */}
              <div className="relative h-72 bg-gradient-to-br from-[#123136] to-[#0a1a1c]">
                {selectedUMKM.foto_url ? (
                  <img 
                    src={selectedUMKM.foto_url} 
                    alt={selectedUMKM.nama_usaha}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-24 h-24 text-white/10" />
                  </div>
                )}
                
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all z-20"
                >
                  <X size={20} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2023] via-[#0b2023]/60 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8 z-10">
                  <Badge className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] font-bold uppercase tracking-widest text-[9px] border-none shadow-sm px-4 py-1.5 mb-4 hover:bg-teal-600 dark:hover:bg-white">
                    {selectedUMKM.jenis_usaha || 'UMKM'}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight drop-shadow-lg">
                    {selectedUMKM.nama_usaha}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8 bg-white dark:bg-[#0b2023]">
                {/* Rating */}
                <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-6">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Terverifikasi
                  </span>
                </div>

                {/* Deskripsi Produk */}
                <div className="space-y-3">
                  <h3 className="font-bold font-serif text-xl text-slate-800 dark:text-white">Etalase & Pelayanan</h3>
                  <p className="text-slate-600 dark:text-white/60 leading-relaxed font-light text-sm md:text-base">
                    {selectedUMKM.deskripsi || selectedUMKM.produk || 'Belum ada rincian produk/jasa yang ditambahkan oleh mitra.'}
                  </p>
                  {selectedUMKM.produk && selectedUMKM.deskripsi && (
                    <div className="mt-2 p-3 bg-teal-50 dark:bg-[#144749]/30 rounded-xl border border-teal-200 dark:border-[#3fd5ba]/10">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-teal-700 dark:text-[#3fd5ba] mb-1">Produk Utama</p>
                      <p className="text-sm text-slate-700 dark:text-white/70 font-light">{selectedUMKM.produk}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Info Pemilik */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2">
                        <User size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> Informasi Penjual
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#123136] to-[#0a1a1c] border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                            <User size={20} className="text-white/50" />
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Pemilik Usaha</p>
                            <p className="font-semibold text-slate-800 dark:text-white/90 text-sm">{selectedUMKM.pemilik?.nama || 'Anonim'}</p>
                        </div>
                        </div>
                        {getWhatsAppNumber(selectedUMKM) && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#128C7E]/20 border border-[#128C7E]/30 flex items-center justify-center shrink-0">
                            <MessageCircle size={20} className="text-[#128C7E]" />
                            </div>
                            <div>
                            <p className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">WhatsApp</p>
                            <p className="font-medium text-slate-800 dark:text-white/90 font-mono text-sm">{getWhatsAppNumber(selectedUMKM)}</p>
                            </div>
                        </div>
                        )}
                        {selectedUMKM.no_hp && selectedUMKM.no_wa && selectedUMKM.no_hp !== selectedUMKM.no_wa && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                            <Phone size={20} className="text-blue-500" />
                            </div>
                            <div>
                            <p className="text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Telepon</p>
                            <p className="font-medium text-slate-800 dark:text-white/90 font-mono text-sm">{selectedUMKM.no_hp}</p>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>

                    {/* Alamat & Maps */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 space-y-3 h-full">
                        <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> Lokasi Usaha
                        </h3>
                        <p className="text-slate-600 dark:text-white/60 text-sm font-light leading-relaxed">
                            {selectedUMKM.alamat || 'Area Lokasi Usaha Nagari'}
                        </p>
                        {selectedUMKM.google_maps_url && (
                            <a href={selectedUMKM.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                              <Map size={16} /> Buka di Google Maps <ExternalLink size={12} />
                            </a>
                        )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black/5 dark:border-white/10 pb-4">
                  <a 
                    href={`https://wa.me/${getWhatsAppNumber(selectedUMKM)?.replace(/[^0-9]/g, '')}?text=Halo, saya mengetahui usaha ini dari Website SINTA Nagari dan tertarik dengan UMKM ${selectedUMKM.nama_usaha}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl h-14 uppercase font-bold tracking-widest text-[10px] shadow-sm transition-all group">
                      <MessageCircle size={18} className="mr-2 group-hover:-rotate-12 transition-transform" /> Hubungi via WhatsApp
                    </Button>
                  </a>
                  {selectedUMKM.google_maps_url && (
                    <a href={selectedUMKM.google_maps_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-14 uppercase font-bold tracking-widest text-[10px] border-black/5 dark:border-white/20 text-slate-600 dark:text-white/80 hover:bg-white/10 bg-white/5">
                        <Map size={18} className="mr-2" /> Lihat Lokasi
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-[2rem] bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 shadow-2xl">
          <div className="p-8">
            <button 
              onClick={() => setIsRegisterDialogOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 transition-all z-20"
            >
              <X size={18} />
            </button>

            {regSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-800 dark:text-white mb-3">Pendaftaran Berhasil!</h3>
                <p className="text-slate-600 dark:text-white/50 text-sm font-light leading-relaxed max-w-sm mx-auto mb-8">
                  Terima kasih telah mendaftarkan UMKM Anda. Tim kami akan memverifikasi data dalam 1-3 hari kerja.
                </p>
                <Button onClick={() => setIsRegisterDialogOpen(false)} className="bg-teal-600 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] rounded-xl h-12 px-8 uppercase tracking-widest text-[10px] font-bold">
                  Tutup
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-teal-100 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-slate-800 dark:text-white">Registrasi Mitra UMKM</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm mt-2 font-light">Daftarkan usaha Anda secara gratis</p>
                </div>

                {regError && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 text-sm">
                    <AlertCircle size={16} /> {regError}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Nama Usaha *</label>
                    <Input value={regForm.nama_usaha} onChange={(e) => setRegForm(p => ({...p, nama_usaha: e.target.value}))} placeholder="Contoh: Warung Makan Sederhana" className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Produk / Layanan *</label>
                    <Input value={regForm.produk_layanan} onChange={(e) => setRegForm(p => ({...p, produk_layanan: e.target.value}))} placeholder="Contoh: Nasi Padang, Rendang, Soto" className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Nama Pemilik *</label>
                      <Input value={regForm.nama_pemilik} onChange={(e) => setRegForm(p => ({...p, nama_pemilik: e.target.value}))} placeholder="Nama lengkap" className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">No. WhatsApp *</label>
                      <Input value={regForm.no_wa} onChange={(e) => setRegForm(p => ({...p, no_wa: e.target.value}))} placeholder="08xx-xxxx-xxxx" className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Alamat Usaha *</label>
                    <Input value={regForm.alamat} onChange={(e) => setRegForm(p => ({...p, alamat: e.target.value}))} placeholder="Alamat lengkap lokasi usaha" className="h-12 rounded-xl border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Jenis Usaha</label>
                    <div className="flex flex-wrap gap-2">
                      {JENIS_USAHA_OPTIONS.map((j) => (
                        <Badge
                          key={j}
                          className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border ${
                            regForm.jenis_usaha === j
                              ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent"
                              : "bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                          }`}
                          onClick={() => setRegForm(p => ({...p, jenis_usaha: j}))}
                        >
                          {j}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/50 mb-2 block">Deskripsi (Opsional)</label>
                    <textarea 
                      value={regForm.deskripsi} 
                      onChange={(e) => setRegForm(p => ({...p, deskripsi: e.target.value}))} 
                      placeholder="Ceritakan tentang usaha Anda..."
                      rows={3}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleRegSubmit} 
                  disabled={regLoading}
                  className="w-full mt-8 bg-teal-600 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-700 dark:hover:bg-white rounded-xl h-14 uppercase tracking-widest text-[10px] font-bold disabled:opacity-50"
                >
                  {regLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Store size={18} className="mr-2" />}
                  {regLoading ? "Mengirim..." : "Daftarkan UMKM Saya"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

    <Footer />
    </PageBackground>
  );
}
