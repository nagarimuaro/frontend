import { motion } from "framer-motion";
import { 
  Calendar, User, Tag, ChevronLeft, Clock, Share2, Facebook, Loader2, Newspaper, Eye, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsDetail, useNews } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";
import { Link, useParams } from "wouter";

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  
  const { data: newsData, isLoading, error } = useNewsDetail(slug);
  const { data: relatedNewsData } = useNews();
  
  const news = newsData?.data;
  const relatedNews = (relatedNewsData?.data || []).filter(item => item.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-screen">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat rincian berita...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  if (error || !news) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 min-h-screen text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center mb-6">
            <Newspaper className="w-10 h-10 text-slate-600 dark:text-white/30" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-4">Berita Tidak Ditemukan</h2>
          <p className="text-slate-600 dark:text-white/50 mb-8 font-light max-w-md mx-auto">Berita yang Anda cari tidak tersedia, sudah dihapus, atau URL tidak valid.</p>
          <Link href="/berita">
            <Button className="rounded-full bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white shadow-[0_0_20px_rgba(63,213,186,0.3)] font-bold uppercase tracking-widest text-xs px-8">
              <ArrowLeft className="w-4 h-4 mr-2" /> Index Berita
            </Button>
          </Link>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {((news as any).featured_image_url || news.featured_image) ? (
          <img 
            src={(news as any).featured_image_url || news.featured_image} 
            alt={news.title} 
            className="w-full h-full object-cover scale-105 opacity-60 mix-blend-luminosity"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 dark:bg-[#0a1a1c] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#144749]/50 to-transparent" />
            <Newspaper className="w-40 h-40 text-slate-600 dark:text-white/5 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a1c] via-[#0a1a1c]/60 to-[#0a1a1c]" />
        
        {/* Back Button */}
        <div className="absolute top-28 left-4 md:left-8 z-20">
          <Link href="/berita">
            <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 text-slate-800 dark:text-white hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-teal-600 dark:text-[#3fd5ba] hover:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors uppercase tracking-widest text-[10px] font-bold h-10 px-5">
              <ChevronLeft className="w-4 h-4 mr-1" /> Berita Utama
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {news.category && (
                  <Badge className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none shadow-[0_0_15px_rgba(63,213,186,0.4)] px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                    {typeof news.category === 'object' ? news.category.name : news.category}
                  </Badge>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/50 uppercase tracking-widest font-bold">
                  <Calendar size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> 
                  {formatDate(news.published_at || news.created_at || '')}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/50 uppercase tracking-widest font-bold">
                  <Clock size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> 
                  {news.read_time || '3 min'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 dark:text-white mb-6 leading-tight max-w-5xl drop-shadow-md">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 border-t border-black/5 dark:border-white/10 pt-6 max-w-3xl">
                {news.author && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600/20 dark:bg-[#3fd5ba]/20 flex items-center justify-center text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest font-bold">Jurnalis</p>
                      <p className="text-slate-800 dark:text-white text-sm font-medium">{typeof news.author === 'object' ? news.author.name : news.author}</p>
                    </div>
                  </div>
                )}
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/60 border border-black/5 dark:border-white/10">
                      <Eye size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest font-bold">Dibaca</p>
                      <p className="text-slate-600 dark:text-white/80 text-sm font-medium">{news.views_count || 0} Kali</p>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            {/* Main Content */}
            <motion.article 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-2/3"
            >
              <div className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-black/5 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative z-10">
                  {/* Excerpt */}
                  {news.excerpt && (
                    <p className="text-xl md:text-2xl text-teal-600/90 dark:text-[#3fd5ba]/90 leading-relaxed mb-10 font-serif border-l-4 border-teal-300 dark:border-[#3fd5ba] pl-8 italic drop-shadow-[0_0_10px_rgba(63,213,186,0.1)] py-2">
                      {news.excerpt}
                    </p>
                  )}
                  
                  {/* Content Style Override for Dark Mode */}
                  <style dangerouslySetInnerHTML={{__html:`
                    .cyber-prose {
                      color: rgba(255,255,255,0.7);
                      font-weight: 300;
                    }
                    .cyber-prose h1, .cyber-prose h2, .cyber-prose h3, .cyber-prose h4 {
                      color: white;
                      font-family: inherit;
                      font-weight: bold;
                    }
                    .cyber-prose a {
                      color: #3fd5ba;
                      text-decoration: underline;
                      text-underline-offset: 4px;
                    }
                    .cyber-prose strong, .cyber-prose b {
                      color: white;
                      font-weight: 600;
                    }
                    .cyber-prose img {
                      border-radius: 1.5rem;
                      border: 1px solid rgba(255,255,255,0.1);
                      margin-top: 2rem;
                      margin-bottom: 2rem;
                    }
                    .cyber-prose blockquote {
                      border-left-color: #3fd5ba;
                      background: rgba(255,255,255,0.02);
                      padding: 1rem 1.5rem;
                      border-radius: 0 1rem 1rem 0;
                      color: rgba(255,255,255,0.9);
                      font-style: italic;
                    }
                    .cyber-prose ul li::marker { color: #3fd5ba; }
                  `}} />

                  <div 
                    className="prose prose-lg max-w-none cyber-prose"
                    dangerouslySetInnerHTML={{ __html: news.content || '' }}
                  />

                  {/* Tags */}
                  {news.tags && news.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/10">
                      <div className="flex flex-wrap items-center gap-3">
                        <Tag size={18} className="text-teal-600 dark:text-[#3fd5ba]" />
                        {news.tags.map((tag: string, index: number) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="px-4 py-2 border-black/5 dark:border-white/10 bg-white/5 text-slate-600 dark:text-white/70 hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-teal-600 dark:text-[#3fd5ba] hover:border-teal-300 dark:border-[#3fd5ba]/50 transition-all cursor-pointer rounded-xl font-medium"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10 bg-white/[0.02] -mx-8 md:-mx-14 -mb-8 md:-mb-14 p-8 md:p-14">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <span className="text-slate-800 dark:text-white font-serif text-xl flex items-center gap-3">
                        Bagikan Berita <Share2 size={20} className="text-teal-600 dark:text-[#3fd5ba]" />
                      </span>
                      <div className="flex gap-3 flex-wrap">
                        <Button 
                          variant="outline" 
                          className="rounded-full bg-[#1877F2]/10 border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-slate-800 dark:text-white transition-colors"
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                        >
                          <Facebook size={16} className="mr-2" /> FB Share
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-full bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-slate-800 dark:text-white transition-colors"
                          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`, '_blank')}
                        >
                          Whatsapp
                        </Button>
                        <Button 
                          variant="outline" 
                          className="rounded-full bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white hover:bg-white/10"
                          onClick={() => navigator.clipboard.writeText(window.location.href)}
                        >
                          Salin Tautan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full lg:w-1/3 space-y-8"
            >
              {/* Related News Sticky */}
              <div className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg sticky top-28 overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="font-serif font-bold text-xl mb-8 text-slate-800 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-1 bg-teal-500 dark:bg-[#3fd5ba] rounded-full" /> Baca Juga
                </h3>
                {relatedNews.length > 0 ? (
                  <div className="space-y-6">
                    {relatedNews.map((item) => (
                      <Link key={item.id} href={`/berita/${item.slug}`}>
                        <div className="group/item cursor-pointer block p-4 -mx-4 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-black/5 dark:border-white/5 transition-all">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-50 dark:bg-[#0a1a1c] border border-black/5 dark:border-white/5">
                              {((item as any).featured_image_url || item.featured_image) ? (
                                <img 
                                  src={(item as any).featured_image_url || item.featured_image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover group-hover/item:scale-110 opacity-70 group-hover/item:opacity-100 transition-all duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#123136] flex items-center justify-center">
                                  <Newspaper className="w-6 h-6 text-teal-600/30 dark:text-[#3fd5ba]/30" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="font-medium text-slate-600 dark:text-white/90 group-hover/item:text-teal-600 dark:text-[#3fd5ba] transition-colors line-clamp-2 text-sm leading-snug mb-3">
                                {item.title}
                              </h4>
                              <span className="text-[10px] text-slate-600 dark:text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar size={12} className="text-teal-600/50 dark:text-[#3fd5ba]/50" /> {formatDate(item.published_at || item.created_at || '')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-white/40 text-sm font-light italic">Tidak ada saran berita lain.</p>
                )}
                
                <Link href="/berita">
                  <Button variant="outline" className="w-full mt-8 rounded-xl bg-transparent border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-bold py-6">
                    Lihat Indeks Berita
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </PageBackground>
  );
}
