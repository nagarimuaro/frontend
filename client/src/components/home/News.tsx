
import { news } from "@/lib/data";
import { Calendar, ArrowRight, User, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function News() {
  const featured = news.find(n => n.isFeatured) || news[0];
  const others = news.filter(n => n.id !== featured.id);

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold text-sm uppercase tracking-widest mb-3 block opacity-80">Kabar Nagari</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Berita & Informasi <span className="text-secondary italic">Terkini</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full px-6 h-12 font-medium text-lg group">
              Arsip Berita <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Featured News */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] aspect-[16/10] mb-8 shadow-2xl">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
              <img 
                src={featured.image} 
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 z-20">
                <Badge className="bg-white/95 hover:bg-white text-gray-900 border-none px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur-md">
                  {featured.category}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4 px-2">
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium border-b border-gray-100 pb-4">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-primary" /> {featured.date}</span>
                <span className="flex items-center gap-2"><User size={16} className="text-primary" /> Admin Nagari</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                {featured.title}
              </h3>
              
              <p className="text-gray-600 line-clamp-3 text-lg leading-relaxed">
                {featured.excerpt}
              </p>
              
              <Button variant="link" className="p-0 h-auto text-primary font-bold text-lg group-hover:underline decoration-2 underline-offset-4 flex items-center gap-2 mt-2">
                Baca Selengkapnya <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>

          {/* Other News List */}
          <div className="flex flex-col gap-8 justify-center">
            {others.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 group cursor-pointer items-center p-4 rounded-3xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 shadow-md relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2">
                     <Badge className="bg-white/90 text-xs text-gray-900 border-none shadow-sm backdrop-blur-sm px-2 py-0.5">
                        {item.category}
                     </Badge>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  </div>
                  
                  <h4 className="text-xl font-serif font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 hidden sm:block leading-relaxed">
                    {item.excerpt}
                  </p>
                  
                  <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
