
import { motion } from "framer-motion";
import { 
  Calendar, User, Tag, ChevronRight, Search, Clock, ArrowUpRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { news } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Berita & Informasi" 
        description="Kabar terkini seputar kegiatan pemerintahan, pembangunan, dan kemasyarakatan di Nagari Sungai Pinang."
        image={newsHeaderImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-8"
            >
              {news.map((newsItem) => (
                <motion.div 
                  key={newsItem.id}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group h-full md:h-[280px]"
                >
                  <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <Badge style={{ backgroundColor: newsItem.categoryColor }} className="text-white border-none shadow-md px-3 py-1">
                        {newsItem.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 md:w-7/12 flex flex-col justify-center relative">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-wider font-medium">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {newsItem.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1.5"><User size={14} className="text-primary" /> {newsItem.author}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {newsItem.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                       <Button variant="ghost" className="p-0 h-auto text-primary justify-start font-bold hover:no-underline group/btn hover:bg-transparent">
                        Baca Selengkapnya <ArrowUpRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </Button>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> 3 min read
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-16 gap-3">
              <Button variant="outline" disabled className="rounded-full px-6">Previous</Button>
              <Button variant="outline" className="bg-primary text-white border-primary rounded-full w-10 h-10 p-0 shadow-lg shadow-primary/30">1</Button>
              <Button variant="outline" className="rounded-full w-10 h-10 p-0 hover:bg-gray-50">2</Button>
              <Button variant="outline" className="rounded-full w-10 h-10 p-0 hover:bg-gray-50">3</Button>
              <Button variant="outline" className="rounded-full px-6 hover:bg-gray-50">Next</Button>
            </div>
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
                <Input placeholder="Cari berita..." className="pl-9 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Kategori</h3>
              <div className="space-y-2">
                {["Pembangunan", "Pemerintahan", "Ekonomi", "Sosial", "Kesehatan", "Pendidikan"].map((cat) => (
                  <div key={cat} className="flex justify-between items-center group cursor-pointer p-3 rounded-xl hover:bg-primary/5 transition-colors">
                    <span className="text-gray-600 group-hover:text-primary transition-colors text-sm font-medium">{cat}</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm">
                      {Math.floor(Math.random() * 20)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 text-gray-900">Tag Populer</h3>
              <div className="flex flex-wrap gap-2">
                {["Dana Desa", "BLT", "Posyandu", "Jalan Tani", "UMKM", "Musyawarah", "Gotong Royong"].map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
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
