
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUMKMDirectory, useUMKMCategories } from "@/lib/api";
import type { UMKM as UMKMType } from "@/lib/api/types";
import PageHeader from "@/components/layout/PageHeader";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat data UMKM...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="UMKM & Ekonomi Kreatif" 
        description="Dukung produk lokal Nagari. Belanja produk asli berkualitas langsung dari pengrajin dan petani."
        image={umkmHeaderImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/4 space-y-6"
          >
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
               <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                 <Filter size={18} /> Filter Produk
               </h3>
               
               <div className="space-y-6">
                 <div className="space-y-3">
                   <label className="text-sm font-bold text-gray-700">Pencarian</label>
                   <div className="relative">
                     <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input 
                       placeholder="Cari produk..." 
                       className="pl-9 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-sm font-bold text-gray-700">Kategori</label>
                   <div className="flex flex-wrap gap-2">
                     <Badge 
                       variant={selectedCategory === "all" ? "default" : "outline"}
                       className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 ${
                         selectedCategory === "all" 
                           ? "bg-primary text-white" 
                           : "hover:bg-primary hover:text-white hover:border-primary"
                       }`}
                       onClick={() => setSelectedCategory("all")}
                     >
                       Semua
                     </Badge>
                     {categoriesLoading ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                     ) : categories.length > 0 ? (
                       categories.map((cat) => (
                         <Badge 
                           key={cat.id} 
                           variant={selectedCategory === cat.slug ? "default" : "outline"}
                           className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 ${
                             selectedCategory === cat.slug 
                               ? "bg-primary text-white" 
                               : "hover:bg-primary hover:text-white hover:border-primary"
                           }`}
                           onClick={() => setSelectedCategory(cat.slug)}
                         >
                           {cat.name}
                         </Badge>
                       ))
                     ) : (
                       ["Kuliner", "Kerajinan", "Fashion", "Jasa"].map((cat) => (
                         <Badge 
                           key={cat} 
                           variant={selectedCategory === cat.toLowerCase() ? "default" : "outline"}
                           className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 ${
                             selectedCategory === cat.toLowerCase() 
                               ? "bg-primary text-white" 
                               : "hover:bg-primary hover:text-white hover:border-primary"
                           }`}
                           onClick={() => setSelectedCategory(cat.toLowerCase())}
                         >
                           {cat}
                         </Badge>
                       ))
                     )}
                   </div>
                 </div>

                 <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                    <h4 className="font-bold text-secondary-foreground text-sm mb-2">Ingin Produk Anda Tampil?</h4>
                    <p className="text-xs text-gray-600 mb-3">Daftarkan usaha UMKM Anda secara gratis melalui layanan nagari.</p>
                    <Button size="sm" className="w-full bg-secondary text-white hover:bg-secondary/90 shadow-md">Daftar Sekarang</Button>
                 </div>
               </div>
             </div>
          </motion.div>

          {/* Product Grid */}
          <div className="w-full lg:w-3/4">
            {/* Filter Result Counter */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-bold text-primary">{filteredUmkm.length}</span> dari {umkm.length} UMKM
                {(searchQuery || selectedCategory !== "all") && (
                  <span className="text-sm ml-2">
                    {searchQuery && <span className="text-gray-500">(pencarian: "{searchQuery}")</span>}
                  </span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="text-gray-500 hover:text-primary"
                >
                  <X className="w-4 h-4 mr-1" /> Reset Filter
                </Button>
              )}
            </div>

            {filteredUmkm.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  {umkm.length === 0 ? "Belum ada data UMKM tersedia" : "Tidak ada UMKM yang cocok dengan filter"}
                </p>
                {(searchQuery || selectedCategory !== "all") && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredUmkm.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={item}
                    whileHover={{ y: -8 }}
                    className="h-full"
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-gray-100 h-full flex flex-col bg-white rounded-2xl cursor-pointer" onClick={() => handleOpenDetail(product)}>
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {product.foto ? (
                          <img src={product.foto} alt={product.nama_usaha} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <Store className="w-16 h-16 text-primary/60" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md border-none shadow-lg px-3 py-1">
                            {product.jenis_usaha || 'UMKM'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                          <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full" onClick={(e) => { e.stopPropagation(); handleOpenDetail(product); }}>
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                            {product.nama_usaha}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} className="fill-secondary text-secondary" />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {product.produk || 'Produk UMKM lokal berkualitas'}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                             <MapPin size={14} className="text-primary shrink-0" />
                             <span className="truncate">{product.alamat || 'Nagari'}</span>
                          </div>
                          {product.no_hp && (
                            <div className="flex items-center gap-2">
                               <Phone size={14} className="text-primary shrink-0" />
                               <span className="truncate">{product.no_hp}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between">
                        <span className="font-bold text-lg text-primary">{product.pemilik?.nama || 'Pemilik'}</span>
                        <a href={`https://wa.me/${product.no_hp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" className="rounded-full w-10 h-10 bg-green-600 text-white hover:bg-green-700 shadow-md transition-colors">
                            <Phone size={18} />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
          {selectedUMKM && (
            <>
              {/* Header Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/40">
                {selectedUMKM.foto ? (
                  <img 
                    src={selectedUMKM.foto} 
                    alt={selectedUMKM.nama_usaha} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-24 h-24 text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge className="bg-primary text-white border-none shadow-md px-4 py-1.5 mb-3">
                    {selectedUMKM.jenis_usaha || 'UMKM'}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                    {selectedUMKM.nama_usaha}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.8) • Produk Terverifikasi</span>
                </div>

                {/* Deskripsi Produk */}
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900">Produk / Layanan</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedUMKM.produk || selectedUMKM.deskripsi || 'Produk UMKM lokal berkualitas dari Nagari.'}
                  </p>
                </div>

                {/* Info Pemilik */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <User size={18} className="text-primary" /> Informasi Pemilik
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Nama Pemilik</p>
                        <p className="font-medium text-gray-900">{selectedUMKM.pemilik?.nama || selectedUMKM.nama_pemilik || '-'}</p>
                      </div>
                    </div>
                    {selectedUMKM.no_hp && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">No. Telepon</p>
                          <p className="font-medium text-gray-900">{selectedUMKM.no_hp}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alamat */}
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Lokasi Usaha
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {selectedUMKM.alamat || 'Nagari, Kecamatan Koto XI Tarusan'}
                  </p>
                  {selectedUMKM.jorong && (
                    <Badge variant="outline" className="text-xs">
                      Jorong {selectedUMKM.jorong}
                    </Badge>
                  )}
                </div>

                {/* Additional Info */}
                {(selectedUMKM.jam_operasional || selectedUMKM.email) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUMKM.jam_operasional && (
                      <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-xl">
                        <Clock size={16} className="text-primary" />
                        <div>
                          <p className="text-gray-500 text-xs">Jam Operasional</p>
                          <p className="font-medium text-gray-900">{selectedUMKM.jam_operasional}</p>
                        </div>
                      </div>
                    )}
                    {selectedUMKM.email && (
                      <div className="flex items-center gap-3 text-sm bg-gray-50 p-3 rounded-xl">
                        <Mail size={16} className="text-primary" />
                        <div>
                          <p className="text-gray-500 text-xs">Email</p>
                          <p className="font-medium text-gray-900">{selectedUMKM.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <a 
                    href={`https://wa.me/${selectedUMKM.no_hp?.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${selectedUMKM.nama_usaha}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-bold shadow-lg">
                      <Phone size={18} className="mr-2" /> Hubungi via WhatsApp
                    </Button>
                  </a>
                  {selectedUMKM.no_hp && (
                    <a href={`tel:${selectedUMKM.no_hp}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-12 font-medium border-gray-200">
                        <Phone size={18} className="mr-2" /> Telepon Langsung
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
