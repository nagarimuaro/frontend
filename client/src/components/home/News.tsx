
import { useNews } from "@/lib/api";
import { Calendar, ArrowRight, User, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function News() {
  const { data: newsResponse, isLoading } = useNews();
  const newsItems = newsResponse?.data || [];
  
  const featured = newsItems.find(n => n.is_featured) || newsItems[0];
  const others = newsItems.filter(n => n.id !== featured?.id).slice(0, 3);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  if (!featured) {
    return null;
  }

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
            <Link href="/berita">
              <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full px-6 h-12 font-medium text-lg group">
                Arsip Berita <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
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
            <Link href={`/berita/${featured.slug}`}>
              <div className="relative overflow-hidden rounded-[2rem] aspect-[16/10] mb-8 shadow-2xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <img 
                  src={featured.category?.icon ? `https://cilandak.sintanagari.cloud/storage/${featured.id}/placeholder.jpg` : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"} 
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 z-20">
                  <Badge 
                    className="bg-white/95 hover:bg-white text-gray-900 border-none px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur-md"
                    style={{ color: featured.category?.color }}
                  >
                    {featured.category?.name || "Berita"}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-6 text-sm text-gray-500 font-medium border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-primary" /> {formatDate(featured.published_at)}</span>
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
            </Link>
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
                <Link href={`/berita/${item.slug}`} className="flex gap-6 items-center w-full">
                  <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 shadow-md relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2">
                       <Badge 
                         className="bg-white/90 text-xs text-gray-900 border-none shadow-sm backdrop-blur-sm px-2 py-0.5"
                         style={{ color: item.category?.color }}
                       >
                          {item.category?.name || "Berita"}
                       </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(item.published_at)}</span>
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
