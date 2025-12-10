
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, User, Tag, ChevronRight, Search, Clock, ArrowUpRight, Loader2, Newspaper, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNews, useCategories } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Berita & Informasi" 
        description="Kabar terkini seputar kegiatan pemerintahan, pembangunan, dan kemasyarakatan di Nagari."
        image={newsHeaderImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Filter Result Counter */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-bold text-primary">{filteredNews.length}</span> dari {news.length} berita
                {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                  <span className="text-sm ml-2">
                    {searchQuery && <span className="text-gray-500">(pencarian: "{searchQuery}")</span>}
                  </span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedTag(""); }}
                  className="text-gray-500 hover:text-primary"
                >
                  <X className="w-4 h-4 mr-1" /> Reset Filter
                </Button>
              )}
            </div>

            {filteredNews.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <Newspaper className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">
                  {news.length === 0 ? "Belum ada berita tersedia" : "Tidak ada berita yang cocok dengan filter"}
                </p>
                {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
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
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group h-full md:h-[280px]"
                  >
                    <Link href={`/berita/${newsItem.slug}`} className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                      {newsItem.image ? (
                        <img 
                          src={newsItem.image} 
                          alt={newsItem.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Newspaper className="w-16 h-16 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      {newsItem.category && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white border-none shadow-md px-3 py-1">
                            {typeof newsItem.category === 'object' ? newsItem.category.name : newsItem.category}
                          </Badge>
                        </div>
                      )}
                    </Link>
                    <div className="p-8 md:w-7/12 flex flex-col justify-center relative">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-wider font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" /> 
                          {formatDate(newsItem.published_at || newsItem.created_at || '')}
                        </span>
                        {newsItem.author && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1.5">
                              <User size={14} className="text-primary" /> {typeof newsItem.author === 'object' ? (newsItem.author as any).name : newsItem.author}
                            </span>
                          </>
                        )}
                      </div>
                      <Link href={`/berita/${newsItem.slug}`}>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                          {newsItem.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {newsItem.excerpt || newsItem.content?.substring(0, 150) + '...'}
                      </p>
                      <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                        <Link href={`/berita/${newsItem.slug}`}>
                          <Button variant="ghost" className="p-0 h-auto text-primary justify-start font-bold hover:no-underline group/btn hover:bg-transparent">
                            Baca Selengkapnya <ArrowUpRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </Button>
                        </Link>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {newsItem.read_time || '3 min read'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Pagination - only show if there are filtered news */}
            {filteredNews.length > 0 && (
              <div className="flex justify-center mt-16 gap-3">
                <Button variant="outline" disabled className="rounded-full px-6">Previous</Button>
                <Button variant="outline" className="bg-primary text-white border-primary rounded-full w-10 h-10 p-0 shadow-lg shadow-primary/30">1</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 hover:bg-gray-50">2</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 hover:bg-gray-50">3</Button>
                <Button variant="outline" className="rounded-full px-6 hover:bg-gray-50">Next</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full lg:w-1/3 space-y-8 sticky top-24 h-fit"
          >
            {/* Search */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Pencarian</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari berita..." 
                  className="pl-9 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Kategori</h3>
              <div className="space-y-2">
                {/* All Categories Option */}
                <div 
                  onClick={() => setSelectedCategory("all")}
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-colors ${
                    selectedCategory === "all" ? "bg-primary/10 text-primary" : "hover:bg-primary/5 group"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    selectedCategory === "all" ? "text-primary" : "text-gray-600 group-hover:text-primary"
                  } transition-colors`}>Semua Kategori</span>
                  <Badge variant="secondary" className={`${
                    selectedCategory === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
                  }`}>
                    {news.length}
                  </Badge>
                </div>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.slug || cat.id.toString())}
                      className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-colors ${
                        selectedCategory === cat.slug || selectedCategory === cat.id.toString() 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-primary/5 group"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        selectedCategory === cat.slug || selectedCategory === cat.id.toString()
                          ? "text-primary" 
                          : "text-gray-600 group-hover:text-primary"
                      } transition-colors`}>{cat.name}</span>
                      <Badge variant="secondary" className={`${
                        selectedCategory === cat.slug || selectedCategory === cat.id.toString()
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
                      }`}>
                        {(cat as any).news_count || 0}
                      </Badge>
                    </div>
                  ))
                ) : (
                  ["Pembangunan", "Pemerintahan", "Ekonomi", "Sosial", "Kesehatan", "Pendidikan"].map((cat) => (
                    <div 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat.toLowerCase())}
                      className={`flex justify-between items-center cursor-pointer p-3 rounded-xl transition-colors ${
                        selectedCategory === cat.toLowerCase() 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-primary/5 group"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        selectedCategory === cat.toLowerCase()
                          ? "text-primary" 
                          : "text-gray-600 group-hover:text-primary"
                      } transition-colors`}>{cat}</span>
                      <Badge variant="secondary" className={`${
                        selectedCategory === cat.toLowerCase()
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
                      }`}>
                        0
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Tag Populer</h3>
              <div className="flex flex-wrap gap-2">
                {["Dana Desa", "BLT", "Posyandu", "Jalan Tani", "UMKM", "Musyawarah", "Gotong Royong"].map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-300 ${
                      selectedTag === tag 
                        ? "bg-primary text-white border-primary" 
                        : "hover:bg-primary hover:text-white hover:border-primary"
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
    </div>
  );
}
