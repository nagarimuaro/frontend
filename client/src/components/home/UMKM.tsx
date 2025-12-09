
import { umkm } from "@/lib/data";
import { ArrowRight, Tag, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function UMKM() {
  return (
    <section className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A] z-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-30" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-30" />

      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm mb-4 bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
              <ShoppingBag size={16} />
              <span>Ekonomi Kreatif</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Produk Unggulan <span className="text-secondary">Nagari</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg max-w-xl">
              Dukung perekonomian lokal dengan membeli produk-produk berkualitas karya anak nagari. Mulai dari kerajinan tangan hingga kuliner khas.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button className="bg-white text-slate-900 hover:bg-secondary hover:text-white transition-all rounded-full h-12 px-8 font-bold text-lg shadow-lg hover:shadow-secondary/50 hidden md:flex gap-2 group">
              Lihat Katalog UMKM <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {umkm.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group bg-slate-800/50 backdrop-blur-sm rounded-[2rem] overflow-hidden hover:ring-2 hover:ring-secondary/50 transition-all duration-500 border border-white/5 hover:-translate-y-2 shadow-xl">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 z-10" />
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 text-sm">
                      {item.category}
                    </Badge>
                  </div>
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm">
                    <Button variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-secondary font-bold rounded-full px-8 h-12 text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold font-serif text-white group-hover:text-secondary transition-colors leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-secondary text-secondary" />
                    ))}
                    <span className="text-xs text-slate-400 ml-2">(4.8)</span>
                  </div>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-white/10">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Harga Mulai</p>
                        <span className="text-secondary font-bold text-xl">{item.price}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors cursor-pointer">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button className="w-full bg-white text-slate-900 font-bold h-12 rounded-full">
            Lihat Katalog UMKM
          </Button>
        </div>
      </div>
    </section>
  );
}
