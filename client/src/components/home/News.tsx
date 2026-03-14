
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
    <section className="section-spacing bg-background relative">
      <div className="container mx-auto container-padding">
        <div className="max-w-3xl mb-12 md:mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-3">Kabar Nagari</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
              Berita & Informasi Terkini
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured News */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 group cursor-pointer relative"
          >
            <Link href={`/berita/${featured.slug}`} className="flex flex-col h-full">
              <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-4 shadow-sm flex-shrink-0">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 duration-200" />
                <img 
                  src={featured.featured_image_url || featured.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"} 
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20">
                  <Badge 
                    className="bg-white/95 backdrop-blur-sm text-foreground border-none px-3 py-1 text-xs font-bold shadow-md hover:bg-white transition-colors"
                  >
                    {featured.category?.name || "Berita"}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar size={12} className="text-primary" />
                  <span>{formatDate(featured.published_at)}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {featured.title}
                </h3>
                
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Other News List */}
          <div className="flex flex-col gap-4">
            {others.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link href={`/berita/${item.slug}`} className="group cursor-pointer p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col h-full">
                  <div className="w-full aspect-[16/9] rounded-md overflow-hidden mb-3 shadow-sm">
                    <img 
                      src={item.featured_image_url || item.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} className="text-primary" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                    
                    <h4 className="text-sm font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
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
