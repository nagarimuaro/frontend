import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, User, Tag, Search, Clock, ArrowUpRight, Loader2, Newspaper, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNews, useCategories } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";
import newsHeaderImage from "@assets/generated_images/community_meeting_for_news_section.png";

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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function News() {
  const { data: newsData, isLoading: newsLoading } = useNews();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  
  const news = newsData?.data || [];
  const categories = categoriesData?.data || [];

  // Filter berita berdasarkan pencarian, kategori, dan tag
  const filteredNews = useMemo(() => {
    return news.filter((item: any) => {
      const matchesSearch = searchQuery === "" ||
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const categorySlug = typeof item.category === 'object' ? item.category?.slug : item.category;
      const categoryId = typeof item.category === 'object' ? item.category?.id?.toString() : null;
      const matchesCategory = selectedCategory === "all" ||
        categorySlug === selectedCategory ||
        categoryId === selectedCategory;
      
      const matchesTag = selectedTag === "" ||
        (item.tags || []).some((t: any) => 
          (typeof t === 'string' ? t : t?.name || '').toLowerCase().includes(selectedTag.toLowerCase())
        );
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [news, searchQuery, selectedCategory, selectedTag]);

  if (newsLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-[70vh]">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat berita...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Berita & Informasi" 
        description="Kabar terkini seputar kegiatan pemerintahan, pembangunan, dan kemasyarakatan di Nagari."
        image={newsHeaderImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Filter Result Counter */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10">
              <p className="text-slate-600 dark:text-white/60 font-light">
                Menampilkan <span className="font-bold text-teal-600 dark:text-[#3fd5ba]">{filteredNews.length}</span> dari {news.length} berita
                {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                  <span className="text-xs ml-2 text-slate-600 dark:text-white/40">
                    {searchQuery && <span>(pencarian: "{searchQuery}")</span>}
                  </span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedTag(""); }}
                  className="text-slate-600 dark:text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 mr-1" /> Reset Filter
                </Button>
              )}
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-20 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-3xl border border-black/5 dark:border-white/10 shadow-lg">
                <Newspaper className="w-16 h-16 mx-auto text-slate-600 dark:text-white/20 mb-4" />
                <p className="text-slate-600 dark:text-white/50 text-lg font-light">
                  {news.length === 0 ? "Belum ada berita tersedia" : "Tidak ada berita yang cocok dengan filter"}
                </p>
                {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-full border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/10"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedTag(""); }}
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-8"
              >
                {filteredNews.map((newsItem) => (
                  <motion.div 
                    key={newsItem.id}
                    variants={item}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg border border-black/5 dark:border-white/10 hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-all duration-300 flex flex-col md:flex-row group h-full md:h-[280px]"
                  >
                    <Link href={`/berita/${newsItem.slug}`} className="md:w-5/12 h-64 md:h-auto relative overflow-hidden block">
                      {((newsItem as any).featured_image_url || newsItem.featured_image) ? (
                        <img 
                          src={(newsItem as any).featured_image_url || newsItem.featured_image} 
                          alt={newsItem.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#123136] flex items-center justify-center">
                          <Newspaper className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a1c]/80 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />
                      {newsItem.category && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 backdrop-blur-md text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30 shadow-lg shadow-black/50 px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                            {typeof newsItem.category === 'object' ? newsItem.category.name : newsItem.category}
                          </Badge>
                        </div>
                      )}
                    </Link>
                    <div className="p-8 md:w-7/12 flex flex-col justify-center relative">
                      <div className="flex items-center gap-4 text-[10px] text-slate-600 dark:text-white/50 mb-4 uppercase tracking-[0.2em] font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> 
                          {formatDate(newsItem.published_at || newsItem.created_at || '')}
                        </span>
                        {newsItem.author && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="flex items-center gap-1.5">
                              <User size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> {typeof newsItem.author === 'object' ? (newsItem.author as any).name : newsItem.author}
                            </span>
                          </>
                        )}
                      </div>
                      <Link href={`/berita/${newsItem.slug}`}>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white mb-4 group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors cursor-pointer leading-tight">
                          {newsItem.title}
                        </h3>
                      </Link>
                      <p className="text-slate-600 dark:text-white/60 text-sm line-clamp-2 mb-6 leading-relaxed font-light">
                        {newsItem.excerpt || newsItem.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="mt-auto pt-5 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                        <Link href={`/berita/${newsItem.slug}`}>
                          <Button variant="ghost" className="p-0 h-auto text-teal-600 dark:text-[#3fd5ba] justify-start font-bold uppercase tracking-widest text-xs hover:bg-transparent hover:text-slate-800 dark:text-white group/btn">
                            Baca Selengkapnya <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </Button>
                        </Link>
                        <span className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                          <Clock size={12} className="text-slate-600 dark:text-white/30" /> {newsItem.read_time || '3 min'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Pagination */}
            {filteredNews.length > 0 && (
              <div className="flex justify-center mt-16 gap-3">
                <Button variant="outline" disabled className="rounded-full px-6 border-black/5 dark:border-white/10 text-slate-600 dark:text-white/50 bg-white/5">Prev</Button>
                <Button variant="outline" className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-teal-300 dark:border-[#3fd5ba] rounded-full w-10 h-10 p-0 shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)] font-bold">1</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-slate-800 dark:text-white transition-colors">2</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-slate-800 dark:text-white transition-colors">3</Button>
                <Button variant="outline" className="rounded-full px-6 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-slate-800 dark:text-white transition-colors">Next</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-1/3 space-y-8 sticky top-28 h-fit"
          >
            {/* Search */}
            <div className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[40px] group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
              <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                <Search size={14} />
                <span>Pencarian</span>
              </div>
              <div className="relative z-10">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-teal-600/50 dark:text-[#3fd5ba]/50" />
                <Input 
                  placeholder="Ketik kata kunci..." 
                  className="pl-11 h-12 rounded-xl bg-white/[0.03] border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/30 focus:bg-white/[0.05] focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg relative overflow-hidden group">
              <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                <span>Kategori Topik</span>
              </div>
              <div className="space-y-2 relative z-10 w-full overflow-hidden">
                {/* All Categories Option */}
                <div 
                  onClick={() => setSelectedCategory("all")}
                  className={`flex justify-between items-center cursor-pointer p-3.5 rounded-xl transition-all border border-transparent ${
                    selectedCategory === "all" 
                      ? "bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.1)]" 
                      : "hover:bg-white/[0.03] hover:border-black/5 dark:border-white/5 text-slate-600 dark:text-white/70 hover:text-slate-800 dark:text-white"
                  }`}
                >
                  <span className={`text-sm font-medium transition-colors`}>Semua Kategori</span>
                  <Badge variant="secondary" className={`${
                    selectedCategory === "all" 
                      ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none" 
                      : "bg-white/5 text-slate-600 dark:text-white/40 border border-black/5 dark:border-white/10"
                  }`}>
                    {news.length}
                  </Badge>
                </div>

                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-teal-600/50 dark:text-[#3fd5ba]/50" />
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.slug || cat.id.toString())}
                      className={`flex justify-between items-center cursor-pointer p-3.5 rounded-xl transition-all border border-transparent ${
                        selectedCategory === cat.slug || selectedCategory === cat.id.toString() 
                          ? "bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.1)]" 
                          : "hover:bg-white/[0.03] hover:border-black/5 dark:border-white/5 text-slate-600 dark:text-white/70 hover:text-slate-800 dark:text-white"
                      }`}
                    >
                      <span className={`text-sm font-medium transition-colors line-clamp-1 break-all pr-2`}>{cat.name}</span>
                      <Badge variant="secondary" className={`${
                        selectedCategory === cat.slug || selectedCategory === cat.id.toString()
                          ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none" 
                          : "bg-white/5 text-slate-600 dark:text-white/40 border border-black/5 dark:border-white/10"
                      } shrink-0`}>
                        {(cat as any).news_count || 0}
                      </Badge>
                    </div>
                  ))
                ) : (
                  ["Pembangunan", "Pemerintahan", "Ekonomi", "Sosial", "Kesehatan", "Pendidikan"].map((cat) => (
                    <div 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat.toLowerCase())}
                      className={`flex justify-between items-center cursor-pointer p-3.5 rounded-xl transition-all border border-transparent ${
                        selectedCategory === cat.toLowerCase() 
                          ? "bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.1)]" 
                          : "hover:bg-white/[0.03] hover:border-black/5 dark:border-white/5 text-slate-600 dark:text-white/70 hover:text-slate-800 dark:text-white"
                      }`}
                    >
                      <span className={`text-sm font-medium transition-colors`}>{cat}</span>
                      <Badge variant="secondary" className={`${
                        selectedCategory === cat.toLowerCase()
                          ? "bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none" 
                          : "bg-white/5 text-slate-600 dark:text-white/40 border border-black/5 dark:border-white/10"
                      }`}>
                        0
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-lg relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] group-hover:bg-blue-500/10 transition-colors" />
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                <Tag size={14} />
                <span>Tagar Populer</span>
              </div>
              <div className="flex flex-wrap gap-2 relative z-10 w-full overflow-hidden">
                {["Dana Desa", "BLT", "Posyandu", "Jalan Tani", "UMKM", "Musyawarah", "Gotong Royong"].map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`cursor-pointer px-3.5 py-1.5 rounded-lg transition-all duration-300 font-medium ${
                      selectedTag === tag 
                        ? "bg-teal-600/20 dark:bg-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] border-teal-300 dark:border-[#3fd5ba]/50 shadow-[0_0_15px_rgba(63,213,186,0.2)]" 
                        : "bg-white/[0.02] text-slate-600 dark:text-white/60 border-black/5 dark:border-white/10 hover:bg-white/[0.05] hover:text-slate-800 dark:text-white hover:border-teal-300 dark:border-[#3fd5ba]/30"
                    }`}
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
