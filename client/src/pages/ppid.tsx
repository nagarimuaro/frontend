import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Download, Search, File, Filter, Eye, FolderOpen, Calendar, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardTitle 
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useDocuments, useCategories, CMS_API } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import documentImage from "@assets/generated_images/document_archive_shelves.png"; // Placeholder until generated

export default function PPID() {
  const { data: documentsData, isLoading: documentsLoading } = useDocuments();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  
  const documents = documentsData?.data || [];
  const categories = categoriesData?.data || [];

  // Get unique years from documents
  const availableYears = useMemo(() => {
    const years = documents
      .map((doc: any) => doc.year)
      .filter((year: any) => year)
      .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
      .sort((a: number, b: number) => b - a);
    return years;
  }, [documents]);

  // Filter documents based on search, category, and year
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc: any) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        (doc.title || doc.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const docCategory = typeof doc.category === 'object' ? doc.category?.slug : doc.category;
      const docCategoryId = typeof doc.category === 'object' ? doc.category?.id?.toString() : null;
      const matchesCategory = selectedCategory === "all" || 
        docCategory === selectedCategory ||
        docCategoryId === selectedCategory ||
        doc.category_id?.toString() === selectedCategory;
      
      // Year filter
      const matchesYear = selectedYear === "all" || 
        doc.year?.toString() === selectedYear;
      
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [documents, searchQuery, selectedCategory, selectedYear]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedYear !== "all";

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="PPID & Dokumen Publik" 
        description="Pusat Pengelola Informasi dan Dokumentasi. Akses transparansi dokumen dan regulasi nagari secara terbuka."
        image={documentImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[350px] space-y-8 flex-shrink-0"
          >
            <Card className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-28 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="p-8 border-b border-black/5 dark:border-white/5 bg-white/[0.02]">
                <CardTitle className="text-xl font-serif font-bold text-slate-800 dark:text-white flex items-center gap-3">
                  <Filter size={20} className="text-teal-600 dark:text-[#3fd5ba]" /> Saring Dokumen
                </CardTitle>
              </div>
              <CardContent className="space-y-8 p-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Pencarian Teks</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-600 dark:text-white/30" />
                    <Input 
                      placeholder="Judul regulasi..." 
                      className="pl-12 h-12 rounded-xl bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-3.5 text-slate-600 dark:text-white/40 hover:text-slate-800 dark:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Jenis Arsip</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 rounded-xl bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all">
                      <SelectValue placeholder={categoriesLoading ? "Memuat..." : "Semua Kategori"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 text-slate-800 dark:text-white rounded-xl shadow-xl">
                      <SelectItem value="all" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Semua Kategori</SelectItem>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug || cat.id.toString()} className="focus:bg-white/10 focus:text-slate-800 dark:text-white">
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="regulation" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Peraturan Nagari</SelectItem>
                          <SelectItem value="budget" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Transparansi Anggaran</SelectItem>
                          <SelectItem value="planning" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Perencanaan (RPJM/RKP)</SelectItem>
                          <SelectItem value="report" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Laporan Kinerja</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Tahun Terbit</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-12 rounded-xl bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all">
                      <SelectValue placeholder="Semua Tahun" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 text-slate-800 dark:text-white rounded-xl shadow-xl">
                      <SelectItem value="all" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Semua Tahun</SelectItem>
                      {availableYears.length > 0 ? (
                        availableYears.map((year: number) => (
                          <SelectItem key={year} value={year.toString()} className="focus:bg-white/10 focus:text-slate-800 dark:text-white">
                            Tahun {year}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="2025" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Tahun 2025</SelectItem>
                          <SelectItem value="2024" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Tahun 2024</SelectItem>
                          <SelectItem value="2023" className="focus:bg-white/10 focus:text-slate-800 dark:text-white">Tahun 2023</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    className="w-full bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-bold tracking-widest uppercase text-[10px] h-12 rounded-xl mt-4"
                    onClick={resetFilters}
                  >
                    <X size={14} className="mr-2" /> Hapus Filter
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#103239] to-[#0a1a1c] border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_20px_rgba(63,213,186,0.1)] rounded-[2.5rem] overflow-hidden relative isolate">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <CardContent className="p-8 relative z-10 text-center">
                <div className="w-16 h-16 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <FileText size={28} className="text-teal-600 dark:text-[#3fd5ba]" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-4 text-slate-800 dark:text-white">Butuh Dokumen Lain?</h3>
                <p className="text-slate-600 dark:text-white/60 text-sm mb-8 font-light leading-relaxed">
                  Ajukan permohonan informasi publik secara resmi sesuai dengan UU KIP melalui formulir digital kami.
                </p>
                <Button className="w-full bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl border-none shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]">
                  Minta Dokumen
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document List */}
          <div className="w-full flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10 gap-4">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-white">Pustaka Dokumen</h2>
                <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-widest text-[10px] border border-teal-300 dark:border-[#3fd5ba]/20 px-4 py-2">
                  Total {filteredDocuments.length} Arsip
                </Badge>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/10">
                <span className="text-[10px] font-bold text-slate-600 dark:text-white/40 uppercase tracking-widest mr-2">Filter Aktif:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-teal-600/20 dark:bg-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] border-none px-3 py-1 font-medium rounded-md flex items-center gap-1">
                    Cari: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-1 opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-teal-600/20 dark:bg-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] border-none px-3 py-1 font-medium rounded-md flex items-center gap-1">
                    Kat: {categories.find(c => c.slug === selectedCategory || c.id.toString() === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {selectedYear !== "all" && (
                  <Badge variant="secondary" className="bg-teal-600/20 dark:bg-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] border-none px-3 py-1 font-medium rounded-md flex items-center gap-1">
                    Tahun: {selectedYear}
                    <button onClick={() => setSelectedYear("all")} className="ml-1 opacity-60 hover:opacity-100">
                      <X size={12} />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            
            {documentsLoading ? (
              <div className="flex items-center justify-center py-20 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-3xl border border-black/5 dark:border-white/5">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-[#3fd5ba]" />
                <span className="ml-3 text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest font-bold text-xs">Memuat arsip...</span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-24 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px]" />
                <FileText className="w-20 h-20 mx-auto text-slate-600 dark:text-white/10 mb-6 relative z-10" />
                {hasActiveFilters ? (
                  <>
                    <p className="text-slate-600 dark:text-white/60 text-lg mb-8 font-light relative z-10">Tidak ada dokumen yang sesuai dengan kombinasi filter</p>
                    <Button variant="outline" onClick={resetFilters} className="rounded-full bg-white/5 border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/10 uppercase tracking-widest font-bold text-[10px] relative z-10">
                      <X size={14} className="mr-2" /> Reset Form Pencarian
                    </Button>
                  </>
                ) : (
                  <p className="text-slate-600 dark:text-white/50 text-lg font-light relative z-10">Belum ada dokumen publik yang diunggah.</p>
                )}
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredDocuments.map((doc: any, index: number) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="group bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-black/5 dark:border-white/5 shadow-lg hover:shadow-[0_0_20px_rgba(63,213,186,0.1)] hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-all duration-300 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                        {/* Icon Container */}
                        <div className="w-16 h-16 rounded-2xl bg-[#143236] text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 shadow-inner group-hover:bg-teal-500 dark:bg-[#3fd5ba] group-hover:text-white dark:text-[#0a1a1c] group-hover:scale-110 transition-all duration-500">
                          <FileText size={28} strokeWidth={1.5} />
                        </div>
                        
                        {/* Meta & Title */}
                        <div className="flex-1 min-w-0 space-y-3 w-full">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/20 hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 transition-colors uppercase tracking-widest text-[9px] font-bold px-3">
                              {typeof doc.category === 'object' ? doc.category?.name : doc.category || 'Dokumen'}
                            </Badge>
                            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-white/40 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-black/5 dark:border-white/10">
                              <Calendar size={12} className="text-slate-600 dark:text-white/30" /> {doc.year || new Date().getFullYear()}
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold font-serif text-slate-800 dark:text-white group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors leading-tight drop-shadow-sm">
                            {doc.title || doc.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-white/50 font-medium">
                            <span className="flex items-center gap-1.5 opacity-80 uppercase tracking-widest font-bold">
                              <File size={14} className="text-teal-600/50 dark:text-[#3fd5ba]/50" /> {doc.type || 'PDF Format'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="flex items-center gap-1.5 opacity-80 uppercase tracking-widest font-bold">
                              <FolderOpen size={14} className="text-teal-600/50 dark:text-[#3fd5ba]/50" /> {doc.size || 'Unknown Size'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-black/5 dark:border-white/5 shrink-0">
                          {doc.preview_url && (
                            <Button variant="outline" className="flex-1 md:flex-none uppercase tracking-widest font-bold text-[10px] rounded-xl h-11 border-black/5 dark:border-white/10 bg-white/5 text-slate-800 dark:text-white hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 hover:border-teal-300 dark:border-[#3fd5ba]/30 hover:text-teal-600 dark:text-[#3fd5ba] backdrop-blur-md" asChild>
                              <a href={doc.preview_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" /> Lihat
                              </a>
                            </Button>
                          )}
                          <Button className="flex-1 md:flex-none uppercase tracking-widest font-bold text-[10px] bg-teal-500 dark:bg-[#3fd5ba] hover:bg-teal-600 dark:hover:bg-white text-white dark:text-[#0a1a1c] rounded-xl h-11 shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]" asChild>
                            <a href={CMS_API.DOCUMENT_DOWNLOAD(doc.slug)} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" /> Unduh
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredDocuments.length > 0 && (
              <div className="flex justify-center mt-12 gap-3">
                <Button variant="outline" disabled className="rounded-full px-6 border-black/5 dark:border-white/5 bg-white/5 text-slate-600 dark:text-white/30 font-bold uppercase tracking-widest text-[10px]">Prev</Button>
                <Button variant="outline" className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] border-none rounded-full w-10 h-10 p-0 shadow-[0_0_15px_rgba(63,213,186,0.4)] font-bold">1</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-white/10">2</Button>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-white/10">3</Button>
                <Button variant="outline" className="rounded-full px-6 border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/60 text-slate-800 dark:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
