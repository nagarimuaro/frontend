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
  const umkmList = umkmResponse?.data?.data?.slice(0, 6) || [];
  const [selectedUMKM, setSelectedUMKM] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDetail = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedUMKM(item);
    setIsDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
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
    <section className="section-spacing bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PC9zdmc+')] opacity-30 -z-10" />

      <div className="container mx-auto container-padding relative z-20">
        <motion.div 
          className="max-w-3xl mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.p 
              className="text-primary font-bold text-sm uppercase tracking-wider mb-3 inline-block px-4 py-1.5 bg-primary/10 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              Produk & UMKM
            </motion.p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-4">
              Produk Unggulan <span className="text-secondary">Nagari</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">
              Dukung perekonomian lokal dengan membeli produk-produk berkualitas karya anak nagari. Mulai dari kerajinan tangan hingga kuliner khas.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {umkmList.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="group h-full"
              >
                <div 
                  className="professional-hover group bg-white border-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer h-full transition-all duration-300"
                  onClick={(e) => handleOpenDetail(item, e)}
                >
                  <motion.div className="aspect-[4/3] overflow-hidden relative">
                    {item.foto ? (
                      <img 
                        src={item.foto} 
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <img 
                        src={`https://source.unsplash.com/800x600/?${encodeURIComponent(item.jenis_usaha || 'business')},shop`} 
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.div className="absolute top-3 right-3 z-20">
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <Badge className="bg-white/95 text-foreground border-none px-2 py-1 text-xs font-semibold shadow-sm hover:bg-white transition-colors">
                          {item.jenis_usaha || 'UMKM'}
                        </Badge>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  <div className="p-5">
                    <h3 className="text-base font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                      {item.nama_usaha}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed group-hover:text-foreground transition-colors">
                      {item.produk}
                    </p>
                    
                    <motion.div 
                      className="flex items-center justify-between pt-4 border-t border-border"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-primary font-semibold text-xs uppercase tracking-wider">
                        {item.pemilik?.nama || 'Lihat Detail'}
                      </span>
                      <ArrowRight size={16} className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* UMKM Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl bg-white">
          {selectedUMKM && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Image */}
              <motion.div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <motion.div 
                  className="absolute bottom-4 left-6 right-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-primary text-white border-none shadow-md px-4 py-1.5 mb-3">
                    {selectedUMKM.jenis_usaha || 'UMKM'}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                    {selectedUMKM.nama_usaha}
                  </h2>
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Rating */}
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} className="fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.8) • Produk Terverifikasi</span>
                </motion.div>

                {/* Deskripsi Produk */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-bold text-gray-900">Produk / Layanan</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedUMKM.produk || selectedUMKM.deskripsi || 'Produk UMKM lokal berkualitas dari Nagari.'}
                  </p>
                </motion.div>

                {/* Info Pemilik */}
                <motion.div 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
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
                </motion.div>

                {/* Alamat */}
                <motion.div 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
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
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <a 
                    href={`https://wa.me/${selectedUMKM.no_hp?.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${selectedUMKM.nama_usaha}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-bold shadow-lg">
                        <Phone size={18} className="mr-2" /> Hubungi via WhatsApp
                      </Button>
                    </motion.div>
                  </a>
                  <Link href="/umkm" className="flex-1">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                      <Button variant="outline" className="w-full rounded-xl h-12 font-medium border-gray-200" onClick={() => setIsDialogOpen(false)}>
                        Lihat Semua UMKM
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

    </section>
  );
}
