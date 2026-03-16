import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, Phone, MapPin, Search, Filter, Star, Loader2, Store, X, User, Mail, Clock
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
import { useUMKMDirectory, useUMKMCategories } from "@/lib/api";
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

export default function UMKM() {
  const { data: umkmData, isLoading: umkmLoading } = useUMKMDirectory();
  const { data: categoriesData, isLoading: categoriesLoading } = useUMKMCategories();
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // API returns paginated data: response.data.data is the array
  const umkm = umkmData?.data?.data || [];
  const categories = categoriesData?.data || [];

  // Filter UMKM berdasarkan pencarian dan kategori
  const filteredUmkm = useMemo(() => {
    return umkm.filter((item: any) => {
      const matchesSearch = searchQuery === "" || 
        (item.name || item.nama || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || item.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.products || []).some((p: any) => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || 
        (item.category?.slug === selectedCategory) ||
        (item.category?.id?.toString() === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [umkm, searchQuery, selectedCategory]);

  const handleOpenDetail = (product: any) => {
    setSelectedUMKM(product);
    setIsDialogOpen(true);
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
             <div className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl sticky top-28 overflow-hidden relative">
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
                       className="pl-12 h-12 rounded-xl bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/30 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" 
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
                           ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]" 
                           : "bg-white/5 text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/10 hover:text-slate-800 dark:text-white"
                       }`}
                       onClick={() => setSelectedCategory("all")}
                     >
                       Semua
                     </Badge>
                     {categoriesLoading ? (
                       <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-[#3fd5ba] mx-2" />
                     ) : categories.length > 0 ? (
                       categories.map((cat: any) => (
                         <Badge 
                           key={cat.id || cat.name} 
                           className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 border ${
                             selectedCategory === (cat.slug || cat.name.toLowerCase()) 
                               ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]" 
                               : "bg-white/5 text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/10 hover:text-slate-800 dark:text-white"
                           }`}
                           onClick={() => setSelectedCategory(cat.slug || cat.name.toLowerCase())}
                         >
                           {cat.name}
                         </Badge>
                       ))
                     ) : (
                       ["Kuliner", "Kerajinan", "Fashion", "Jasa"].map((cat) => (
                         <Badge 
                           key={cat} 
                           className={`cursor-pointer px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 border ${
                             selectedCategory === cat.toLowerCase() 
                               ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-transparent shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]" 
                               : "bg-white/5 text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/10 hover:text-slate-800 dark:text-white"
                           }`}
                           onClick={() => setSelectedCategory(cat.toLowerCase())}
                         >
                           {cat}
                         </Badge>
                       ))
                     )}
                   </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-[#123136] to-[#0a1a1c] rounded-2xl border border-teal-300 dark:border-[#3fd5ba]/20 relative overflow-hidden text-center isolate">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[40px] -z-10" />
                    <div className="w-12 h-12 bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-300 dark:border-[#3fd5ba]/20 shadow-inner">
                        <Store size={20} />
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-base mb-2 font-serif">Punya Usaha Lokal?</h4>
                    <p className="text-xs text-slate-600 dark:text-white/50 mb-6 font-light leading-relaxed">Daftarkan etalase produk Anda secara gratis ke pemerintah Nagari.</p>
                    <Button className="w-full bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white rounded-xl uppercase tracking-widest text-[10px] font-bold h-11 border-none shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]">Registrasi Mitra</Button>
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
              <div className="text-center py-24 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
                <Store className="w-20 h-20 mx-auto text-slate-600 dark:text-white/10 mb-6 relative z-10" />
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
                {filteredUmkm.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={item}
                    className="h-full"
                  >
                    <Card className="overflow-hidden bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md hover:shadow-[0_0_30px_rgba(63,213,186,0.15)] transition-all duration-500 group border border-black/5 dark:border-white/10 hover:border-teal-300 dark:border-[#3fd5ba]/30 h-full flex flex-col rounded-3xl cursor-pointer relative" onClick={() => handleOpenDetail(product)}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none z-0" />
                      
                      <div className="aspect-[4/3] relative overflow-hidden z-10">
                        <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#0a1a1c]/80 group-hover:bg-slate-50/90 dark:bg-[#0a1a1c]/40 transition-colors z-10 duration-500" />
                        {product.foto ? (
                          <img src={product.foto} alt={product.nama_usaha} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center scale-100 group-hover:scale-110 transition-transform duration-700">
                            <Store className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] backdrop-blur-md border border-teal-300 dark:border-[#3fd5ba]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] px-3 py-1.5 uppercase tracking-widest text-[9px] font-bold">
                            {product.jenis_usaha || 'UMKM'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
                          <Button size="sm" className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)] rounded-xl font-bold uppercase tracking-widest text-[9px] px-4 h-9" onClick={(e) => { e.stopPropagation(); handleOpenDetail(product); }}>
                            <Search size={14} className="mr-1.5" /> Detail Profil
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 md:p-8 flex-1 relative z-20">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors line-clamp-2 leading-tight">
                            {product.nama_usaha}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 mb-4">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                          ))}
                          <span className="text-[10px] text-slate-600 dark:text-white/40 ml-1 font-bold tracking-widest uppercase">Verified</span>
                        </div>
                        <p className="text-slate-600 dark:text-white/50 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                          {product.produk || product.description || 'Tidak ada spesifikasi produk yang dicantumkan.'}
                        </p>
                        
                        <div className="space-y-3 text-sm text-slate-600 dark:text-white/70 bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 group-hover:bg-teal-600/5 dark:bg-[#3fd5ba]/5 transition-colors">
                          <div className="flex items-start gap-3">
                             <MapPin size={16} className="text-teal-600 dark:text-[#3fd5ba] shrink-0 mt-0.5" />
                             <span className="line-clamp-1 font-light">{product.alamat || 'Area Lokasi Usaha Nagari'}</span>
                          </div>
                          {product.no_hp && (
                            <div className="flex items-center gap-3">
                               <Phone size={16} className="text-teal-600 dark:text-[#3fd5ba] shrink-0" />
                               <span className="font-light truncate">{product.no_hp}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 md:px-8 border-t border-black/5 dark:border-white/5 mt-auto flex items-center justify-between bg-white/[0.02] relative z-20">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-600 dark:text-white/40 mb-1">Pengelola Mitra</span>
                            <span className="font-bold text-sm text-teal-600 dark:text-[#3fd5ba] line-clamp-1">{product.pemilik?.nama || product.nama_pemilik || 'Layanan Usaha'}</span>
                        </div>
                        <a href={`https://wa.me/${product.no_hp?.replace(/[^0-9]/g, '')}?text=Halo, saya mengunjungi Nagari Portal dan tertarik dengan UMKM ${product.nama_usaha}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 ml-3">
                          <Button size="icon" className="rounded-xl w-11 h-11 bg-[#128C7E] text-slate-800 dark:text-white hover:bg-[#075E54] shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-colors border-none group/wa">
                            <Phone size={18} className="group-hover/wa:-rotate-12 transition-transform" />
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-[2rem] bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {selectedUMKM && (
            <>
              {/* Header Image */}
              <div className="relative h-72 bg-gradient-to-br from-[#123136] to-[#0a1a1c]">
                {selectedUMKM.foto ? (
                  <img 
                    src={selectedUMKM.foto} 
                    alt={selectedUMKM.nama_usaha} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-24 h-24 text-slate-600 dark:text-white/10" />
                  </div>
                )}
                
                {/* Close Button overlay */}
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-800 dark:text-white hover:bg-black/70 transition-all z-20"
                >
                  <X size={20} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b2023] via-[#0b2023]/60 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8 z-10">
                  <Badge className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] font-bold uppercase tracking-widest text-[9px] border-none shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)] px-4 py-1.5 mb-4 hover:bg-teal-600 dark:hover:bg-white">
                    {selectedUMKM.jenis_usaha || 'UMKM'}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 dark:text-white leading-tight drop-shadow-lg">
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
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
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
                    {selectedUMKM.produk || selectedUMKM.description || selectedUMKM.deskripsi || 'Belum ada rincian produk/jasa yang ditambahkan oleh mitra secara publik.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Info Pemilik */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2">
                        <User size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> Informasi Penjual
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#123136] to-[#0a1a1c] border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                            <User size={20} className="text-slate-600 dark:text-white/50" />
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Pemilik Izin Usaha</p>
                            <p className="font-semibold text-slate-600 dark:text-white/90 text-sm">{selectedUMKM.pemilik?.nama || selectedUMKM.nama_pemilik || 'Anonim'}</p>
                        </div>
                        </div>
                        {selectedUMKM.no_hp && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#128C7E]/20 border border-[#128C7E]/30 flex items-center justify-center shrink-0">
                            <Phone size={20} className="text-[#128C7E]" />
                            </div>
                            <div>
                            <p className="text-slate-600 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Mobile / WhatsApp</p>
                            <p className="font-medium text-slate-600 dark:text-white/90 font-mono text-sm">{selectedUMKM.no_hp}</p>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>

                    <div className="space-y-6">
                        {/* Alamat */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 space-y-3 h-full">
                        <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> Lokasi Direktori
                        </h3>
                        <p className="text-slate-600 dark:text-white/60 text-sm font-light leading-relaxed">
                            {selectedUMKM.alamat || 'Area Lokasi Usaha Nagari Muaro, Kab. Pesisir Selatan'}
                        </p>
                        {selectedUMKM.jorong && (
                            <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/20 font-bold text-[10px] uppercase tracking-widest mt-2 px-3 py-1.5">
                            Wilayah: Jorong {selectedUMKM.jorong}
                            </Badge>
                        )}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                {(selectedUMKM.jam_operasional || selectedUMKM.email) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/5 dark:border-white/5 pt-6">
                    {selectedUMKM.jam_operasional && (
                      <div className="flex items-center gap-4 text-sm bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-xl">
                        <Clock size={20} className="text-teal-600 dark:text-[#3fd5ba]" />
                        <div>
                          <p className="text-slate-600 dark:text-white/40 font-bold uppercase tracking-widest text-[9px] mb-1">Jadwal Operasional</p>
                          <p className="font-medium text-slate-600 dark:text-white/90">{selectedUMKM.jam_operasional}</p>
                        </div>
                      </div>
                    )}
                    {selectedUMKM.email && (
                      <div className="flex items-center gap-4 text-sm bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-xl">
                        <Mail size={20} className="text-teal-600 dark:text-[#3fd5ba]" />
                        <div>
                          <p className="text-slate-600 dark:text-white/40 font-bold uppercase tracking-widest text-[9px] mb-1">Surel Elektronik</p>
                          <p className="font-medium text-slate-600 dark:text-white/90">{selectedUMKM.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-black/5 dark:border-white/10 pb-4">
                  <a 
                    href={`https://wa.me/${selectedUMKM.no_hp?.replace(/[^0-9]/g, '')}?text=Halo, saya mengetahui usaha ini dari Website SINTA Nagari dan tertarik dengan UMKM ${selectedUMKM.nama_usaha}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-[#128C7E] hover:bg-[#075E54] text-slate-800 dark:text-white rounded-xl h-14 uppercase font-bold tracking-widest text-[10px] shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all group">
                      <Phone size={18} className="mr-2 group-hover:-rotate-12 transition-transform" /> Percakapan WA
                    </Button>
                  </a>
                  {selectedUMKM.no_hp && (
                    <a href={`tel:${selectedUMKM.no_hp}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-14 uppercase font-bold tracking-widest text-[10px] border-black/5 dark:border-white/20 text-slate-600 dark:text-white/80 hover:bg-white/10 hover:text-slate-800 dark:text-white transition-colors bg-white/5 backdrop-blur-md">
                        Panggilan Langsung
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageBackground>
  );
}
