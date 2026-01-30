
import { useState } from "react";
import { ArrowRight, Tag, ShoppingBag, Star, Loader2, Phone, MapPin, User, Clock, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useUMKMDirectory } from "@/lib/api";
import { Link } from "wouter";

export default function UMKM() {
  const { data: umkmResponse, isLoading } = useUMKMDirectory();
  // API returns paginated data: response.data.data is the array
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
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (umkmList.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-gray-50 overflow-hidden relative">
      {/* Top gradient fade for smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10" />
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <ShoppingBag size={16} />
              <span>Ekonomi Kreatif</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Produk Unggulan <span className="text-primary">Nagari</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg max-w-xl">
              Dukung perekonomian lokal dengan membeli produk-produk berkualitas karya anak nagari. Mulai dari kerajinan tangan hingga kuliner khas.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/umkm">
              <Button className="bg-primary text-white hover:bg-primary/90 transition-all rounded-full h-12 px-8 font-bold text-lg shadow-lg hover:shadow-primary/30 hidden md:flex gap-2 group">
                Lihat Katalog UMKM <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {umkmList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="group bg-white rounded-[2rem] overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all duration-500 border border-gray-100 hover:-translate-y-2 shadow-lg cursor-pointer"
                onClick={(e) => handleOpenDetail(item, e)}
              >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10" />
                    {item.foto ? (
                      <img 
                        src={item.foto} 
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img 
                        src={`https://source.unsplash.com/800x600/?${encodeURIComponent(item.jenis_usaha || 'business')},shop`} 
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white/90 hover:bg-white backdrop-blur-md text-gray-800 border border-gray-200 px-3 py-1 text-sm">
                        {item.jenis_usaha || 'UMKM'}
                      </Badge>
                    </div>
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm">
                    <Button variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary font-bold rounded-full px-8 h-12 text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors leading-tight">
                      {item.nama_usaha}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">(4.8)</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.produk}
                  </p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pemilik</p>
                        <span className="text-primary font-bold text-lg">
                          {item.pemilik?.nama || 'Hubungi Kami'}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors cursor-pointer">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/umkm">
            <Button className="w-full bg-primary text-white font-bold h-12 rounded-full">
              Lihat Katalog UMKM
            </Button>
          </Link>
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
                  <img 
                    src={`https://source.unsplash.com/800x600/?${encodeURIComponent(selectedUMKM.jenis_usaha || 'business')},shop`} 
                    alt={selectedUMKM.nama_usaha}
                    className="w-full h-full object-cover"
                  />
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
                  <Link href="/umkm" className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl h-12 font-medium border-gray-200" onClick={() => setIsDialogOpen(false)}>
                      Lihat Semua UMKM
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </section>
  );
}
