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
    <section className="section-spacing bg-gradient-to-br from-background via-white to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PC9zdmc+')] opacity-30 -z-10" />
      
      <div className="container mx-auto container-padding relative z-10">
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
              Kabar Nagari
            </motion.p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
              Berita & <span className="text-primary">Informasi</span> Terkini
            </h2>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Featured News */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.div whileHover={{ y: -8 }} className="group cursor-pointer relative h-full">
              <Link href={`/berita/${featured.slug}`} className="flex flex-col h-full">
                <motion.div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-4 shadow-lg flex-shrink-0">
                  <motion.div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 duration-200" />
                  <img 
                    src={featured.featured_image_url || featured.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"} 
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <motion.div className="absolute top-4 left-4 z-20">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Badge 
                        className="bg-white/95 backdrop-blur-sm text-foreground border-none px-3 py-1 text-xs font-bold shadow-md hover:bg-white transition-colors"
                      >
                        {featured.category?.name || "Berita"}
                      </Badge>
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                <div className="space-y-3 flex flex-col flex-1">
                  <motion.div 
                    className="flex items-center gap-3 text-xs text-muted-foreground"
                    whileHover={{ x: 4 }}
                  >
                    <Calendar size={14} className="text-primary" />
                    <span className="font-medium">{formatDate(featured.published_at)}</span>
                  </motion.div>
                  
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {featured.title}
                  </h3>
                  
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed group-hover:text-foreground transition-colors">
                    {featured.excerpt}
                  </p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-primary font-semibold text-sm mt-2"
                    whileHover={{ x: 6 }}
                  >
                    Baca Selengkapnya <ArrowRight size={16} />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Other News List */}
          <motion.div className="flex flex-col gap-4">
            {others.map((item, index) => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
              >
                <motion.div whileHover={{ y: -4 }} className="group h-full">
                  <Link href={`/berita/${item.slug}`} className="cursor-pointer p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
                    <motion.div className="w-full aspect-[16/9] rounded-lg overflow-hidden mb-3 shadow-md">
                      <img 
                        src={item.featured_image_url || item.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <motion.div 
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        whileHover={{ x: 2 }}
                      >
                        <Calendar size={12} className="text-primary flex-shrink-0" />
                        <span className="font-medium">{formatDate(item.published_at)}</span>
                      </motion.div>
                      
                      <h4 className="text-sm font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
