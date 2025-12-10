
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Download, Search, File, Filter, ChevronRight, Eye, FolderOpen, Calendar, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useDocuments, useCategories, CMS_API } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
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
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <PageHeader 
        title="PPID & Dokumen Publik" 
        description="Pusat Pengelola Informasi dan Dokumentasi. Akses transparansi dokumen dan regulasi nagari."
        image={documentImage}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/4 space-y-8"
          >
            <Card className="border-none shadow-lg rounded-3xl overflow-hidden sticky top-24">
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <CardTitle className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={20} className="text-primary" /> Filter Dokumen
                </CardTitle>
              </div>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Kata Kunci</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Cari dokumen..." 
                      className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Kategori</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white">
                      <SelectValue placeholder={categoriesLoading ? "Memuat..." : "Pilih kategori"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug || cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="regulation">Peraturan Nagari</SelectItem>
                          <SelectItem value="budget">Transparansi Anggaran</SelectItem>
                          <SelectItem value="planning">Perencanaan (RPJM/RKP)</SelectItem>
                          <SelectItem value="report">Laporan Kinerja</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Tahun</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      {availableYears.length > 0 ? (
                        availableYears.map((year: number) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 font-medium h-12 rounded-xl"
                    onClick={resetFilters}
                  >
                    <X size={16} className="mr-2" /> Reset Filter
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-green-700 text-white border-none shadow-xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <CardContent className="p-8 relative z-10">
                <h3 className="text-xl font-bold font-serif mb-3">Permohonan Informasi</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Tidak menemukan dokumen yang Anda cari? Ajukan permohonan informasi publik secara resmi melalui formulir digital.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold h-11 rounded-xl border-none shadow-md">
                  Ajukan Permohonan
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document List */}
          <div className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Arsip Dokumen</h2>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {filteredDocuments.length} dari {documents.length} Dokumen
                </span>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-500">Filter aktif:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                    Pencarian: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-primary/70">
                      <X size={14} />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                    Kategori: {categories.find(c => c.slug === selectedCategory || c.id.toString() === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-primary/70">
                      <X size={14} />
                    </button>
                  </Badge>
                )}
                {selectedYear !== "all" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                    Tahun: {selectedYear}
                    <button onClick={() => setSelectedYear("all")} className="ml-1 hover:text-primary/70">
                      <X size={14} />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            
            {documentsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Memuat dokumen...</span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                {hasActiveFilters ? (
                  <>
                    <p className="text-gray-600 text-lg mb-4">Tidak ada dokumen yang sesuai dengan filter</p>
                    <Button variant="outline" onClick={resetFilters} className="rounded-full">
                      <X size={16} className="mr-2" /> Reset Filter
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-600 text-lg">Belum ada dokumen tersedia</p>
                )}
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredDocuments.map((doc: any, index: number) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <FileText size={32} strokeWidth={1.5} />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium border-none px-3 py-1 rounded-lg">
                              {typeof doc.category === 'object' ? doc.category?.name : doc.category || 'Dokumen'}
                            </Badge>
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                              <Calendar size={12} /> {doc.year || new Date().getFullYear()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors leading-tight">
                            {doc.title || doc.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                              <File size={14} className="text-gray-400" /> {doc.type || 'PDF'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                              <FolderOpen size={14} className="text-gray-400" /> {doc.size || '-'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                          {doc.preview_url && (
                            <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 border-gray-200 hover:bg-gray-50 hover:text-primary font-medium" asChild>
                              <a href={doc.preview_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" /> Preview
                              </a>
                            </Button>
                          )}
                          <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-bold shadow-lg shadow-primary/20" asChild>
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

            {/* Pagination - only show if there are documents */}
            {filteredDocuments.length > 0 && (
              <div className="flex justify-center mt-12 gap-2">
                <Button variant="outline" disabled className="rounded-xl px-4 border-gray-200">Previous</Button>
                <Button variant="outline" className="bg-primary text-white border-primary rounded-xl px-4 shadow-md">1</Button>
                <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">2</Button>
                <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">3</Button>
                <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
