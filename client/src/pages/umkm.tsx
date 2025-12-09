
import { motion } from "framer-motion";
import { 
  ShoppingBag, Phone, MapPin, Search, Filter, Star 
} from "lucide-react";
import { 
  Card, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { umkm } from "@/lib/data";
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="UMKM & Ekonomi Kreatif" 
        description="Dukung produk lokal Nagari Sungai Pinang. Belanja produk asli berkualitas langsung dari pengrajin dan petani."
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
                     <Input placeholder="Cari produk..." className="pl-9 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all" />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-sm font-bold text-gray-700">Kategori</label>
                   <div className="flex flex-wrap gap-2">
                     {["Semua", "Kuliner", "Kerajinan", "Fashion", "Jasa"].map((cat) => (
                       <Badge 
                         key={cat} 
                         variant="outline" 
                         className="cursor-pointer px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                       >
                         {cat}
                       </Badge>
                     ))}
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
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {umkm.map((product) => (
                <motion.div
                  key={product.id}
                  variants={item}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-gray-100 h-full flex flex-col bg-white rounded-2xl">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md border-none shadow-lg px-3 py-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                        <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg rounded-full">
                          Quick View
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={12} className="fill-secondary text-secondary" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">(4.8)</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                           <MapPin size={14} className="text-primary shrink-0" />
                           <span className="truncate">{product.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Phone size={14} className="text-primary shrink-0" />
                           <span className="truncate">{product.contact}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between">
                      <span className="font-bold text-xl text-primary">{product.price}</span>
                      <Button size="icon" className="rounded-full w-10 h-10 bg-gray-900 text-white hover:bg-primary shadow-md transition-colors">
                        <ShoppingBag size={18} />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
