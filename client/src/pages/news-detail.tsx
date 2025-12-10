
import { motion } from "framer-motion";
import { 
  Calendar, User, Tag, ChevronLeft, Clock, Share2, Facebook, Loader2, Newspaper, Eye, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsDetail, useNews } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat berita...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Newspaper className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Berita Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Berita yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/berita">
            <Button className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Berita
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {news.image ? (
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
            <Newspaper className="w-32 h-32 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <Link href="/berita">
            <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {news.category && (
                <Badge className="bg-primary text-white border-none shadow-md px-4 py-1.5 mb-4">
                  {typeof news.category === 'object' ? news.category.name : news.category}
                </Badge>
              )}
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight max-w-4xl">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> 
                  {formatDate(news.published_at || news.created_at || '')}
                </span>
                {news.author && (
                  <span className="flex items-center gap-2">
                    <User size={16} /> {typeof news.author === 'object' ? news.author.name : news.author}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Eye size={16} /> {news.views_count || 0} views
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-2/3"
            >
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                {/* Excerpt */}
                {news.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-primary pl-6 italic">
                    {news.excerpt}
                  </p>
                )}
                
                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: news.content || '' }}
                />

                {/* Tags */}
                {news.tags && news.tags.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <Tag size={18} className="text-gray-400" />
                      {news.tags.map((tag: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="px-3 py-1 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <Share2 size={18} /> Bagikan Berita:
                    </span>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      >
                        <Facebook size={16} className="mr-2" /> Facebook
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`, '_blank')}
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                      >
                        Copy Link
                      </Button>
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
              {/* Related News */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="font-serif font-bold text-xl mb-6 text-gray-900">Berita Terkait</h3>
                {relatedNews.length > 0 ? (
                  <div className="space-y-6">
                    {relatedNews.map((item) => (
                      <Link key={item.id} href={`/berita/${item.slug}`}>
                        <div className="group cursor-pointer">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                  <Newspaper className="w-6 h-6 text-primary/60" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm leading-snug mb-2">
                                {item.title}
                              </h4>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar size={12} /> {formatDate(item.published_at || item.created_at || '')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada berita terkait</p>
                )}
                
                <Link href="/berita">
                  <Button variant="outline" className="w-full mt-6 rounded-xl">
                    Lihat Semua Berita
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
