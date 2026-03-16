import { useNews } from "@/lib/api";
import { Calendar, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function News() {
  const { data: newsResponse, isLoading } = useNews();
  const newsItems = newsResponse?.data || [];
  
  const featured = newsItems.find(n => n.is_featured) || newsItems[0];
  const others = newsItems.filter(n => n.id !== featured?.id).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 text-[#3fd5ba] animate-spin" />
        </div>
      </section>
    );
  }

  if (!featured) return null;

  return (
    <section className="px-4 md:px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Kabar Nagari
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Berita & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Publikasi Terkini</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link href="/berita">
              <Button className="rounded-full px-8 h-12 text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                Semua Berita <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured - Takes 7 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="group cursor-pointer h-full relative">
              <Link href={`/berita/${featured.slug}`} className="flex flex-col h-full bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.05] rounded-3xl p-4 md:p-6 hover:bg-white dark:hover:bg-white/[0.03] hover:border-teal-300 dark:hover:border-[#3fd5ba]/30 transition-all duration-500 shadow-lg dark:shadow-xl overflow-hidden group">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-400/10 dark:group-hover:bg-[#3fd5ba]/10 transition-colors duration-500" />
                
                <div className="relative overflow-hidden rounded-2xl aspect-[16/10] mb-6 ring-1 ring-black/5 dark:ring-white/[0.06] z-10 shadow-md dark:shadow-lg">
                  <div className="absolute inset-0 bg-black/5 dark:bg-[#0a1a1c]/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                  <img 
                    src={(featured as any).featured_image_url || featured.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200"} 
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none px-3 py-1 shadow-[0_0_10px_rgba(20,184,166,0.3)] dark:shadow-[0_0_15px_rgba(63,213,186,0.5)] font-bold text-[10px] uppercase tracking-wider">
                      {featured.category?.name || "Sorotan"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 z-10">
                  <div className="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/[0.05] pb-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-600/70 dark:text-[#3fd5ba]/70">
                      <Calendar size={13} className="text-teal-500 dark:text-[#3fd5ba]" />
                      <span>{formatDate(featured.published_at)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-[#3fd5ba] transition-colors leading-snug mb-3">
                    {featured.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-white/40 line-clamp-2 md:line-clamp-3 text-sm md:text-base leading-relaxed mb-6 font-light">
                    {featured.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                    Baca Selengkapnya <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Others List - Takes 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {others.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-1"
              >
                <motion.div whileHover={{ x: -5 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="group h-full">
                  <Link href={`/berita/${item.slug}`} className="cursor-pointer p-4 rounded-3xl bg-white/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/[0.04] hover:bg-white dark:hover:bg-[#0b2023]/80 hover:border-teal-300 dark:hover:border-[#3fd5ba]/20 transition-all flex flex-row items-center gap-5 h-full shadow-md dark:shadow-lg relative overflow-hidden">
                    
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-teal-500 dark:bg-[#3fd5ba] shadow-[0_0_10px_rgba(20,184,166,0.5)] dark:shadow-[0_0_10px_rgba(63,213,186,0.8)] rounded-r-md group-hover:h-1/2 transition-all duration-300" />

                    <div className="w-28 h-28 md:w-32 md:h-32 aspect-square flex-shrink-0 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/[0.06]">
                      <img 
                        src={(item as any).featured_image_url || item.featured_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="flex flex-col py-1">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-teal-600/60 dark:text-[#3fd5ba]/50 mb-2">
                        <Calendar size={11} className="text-teal-500 dark:text-[#3fd5ba]/70" />
                        <span>{formatDate(item.published_at)}</span>
                      </div>
                      <h4 className="text-sm md:text-base font-serif font-bold text-slate-700 dark:text-white/80 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-3 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/berita">
            <Button className="rounded-full px-8 h-12 w-full text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20">
              Semua Berita <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
