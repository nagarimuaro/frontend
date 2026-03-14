
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
        <div className="flex justify-between items-end mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold text-xs uppercase tracking-wider mb-3 block opacity-75">Kabar Nagari</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Berita & Informasi <span className="text-secondary italic">Terkini</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/berita">
              <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/8 rounded-full px-6 h-11 font-semibold group">
                Arsip Berita <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Featured News */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer relative flex flex-col"
          >
            <Link href={`/berita/${featured.slug}`} className="flex flex-col h-full">
              <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-6 shadow-lg flex-shrink-0">
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors z-10 duration-300" />
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
              
              <div className="space-y-4 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium border-b border-border pb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {formatDate(featured.published_at)}</span>
                  <span className="flex items-center gap-1.5"><User size={14} className="text-primary" /> Admin Nagari</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {featured.title}
                </h3>
                
                <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed flex-1">
                  {featured.excerpt}
                </p>
                
                <Button variant="link" className="p-0 h-auto text-primary font-semibold group-hover:underline decoration-2 underline-offset-4 flex items-center gap-2 mt-2 w-fit">
                  Baca Selengkapnya <ChevronRight size={16} />
                </Button>
              </div>
            </Link>
          </motion.div>

          {/* Other News List */}
          <div className="flex flex-col gap-6">
            {others.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="flex gap-5 group cursor-pointer items-start p-4 rounded-lg hover:bg-accent transition-all hover:shadow-sm"
              >
                <Link href={`/berita/${item.slug}`} className="flex gap-5 items-start w-full">
                  <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden shrink-0 shadow-md relative flex-shrink-0">
                    <img 
                      src={item.featured_image_url || item.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 z-10">
                       <Badge 
                         className="bg-white/90 text-xs text-foreground border-none shadow-sm backdrop-blur-sm px-2 py-0.5 hover:bg-white transition-colors"
                       >
                          {item.category?.name || "Berita"}
                       </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Calendar size={12} /> {formatDate(item.published_at)}
                    </div>
                    
                    <h4 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
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
