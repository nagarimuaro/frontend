
import { motion } from "framer-motion";
import { 
  FileText, Download, Search, File, Filter, ChevronRight, Eye, FolderOpen, Calendar 
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
import { documents } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import documentImage from "@assets/generated_images/document_archive_shelves.png"; // Placeholder until generated

export default function PPID() {
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
                    <Input placeholder="Cari dokumen..." className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Kategori</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="regulation">Peraturan Nagari</SelectItem>
                      <SelectItem value="budget">Transparansi Anggaran</SelectItem>
                      <SelectItem value="planning">Perencanaan (RPJM/RKP)</SelectItem>
                      <SelectItem value="report">Laporan Kinerja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Tahun</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
                  Terapkan Filter
                </Button>
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
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{documents.length} Dokumen Tersedia</span>
            </div>
            
            <div className="grid gap-5">
              {documents.map((doc, index) => (
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
                            {doc.category}
                          </Badge>
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <Calendar size={12} /> {doc.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-gray-900 group-hover:text-primary transition-colors leading-tight">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                            <File size={14} className="text-gray-400" /> {doc.type}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                            <FolderOpen size={14} className="text-gray-400" /> {doc.size}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 border-gray-200 hover:bg-gray-50 hover:text-primary font-medium">
                          <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                        <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
                          <Download className="w-4 h-4 mr-2" /> Unduh
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12 gap-2">
              <Button variant="outline" disabled className="rounded-xl px-4 border-gray-200">Previous</Button>
              <Button variant="outline" className="bg-primary text-white border-primary rounded-xl px-4 shadow-md">1</Button>
              <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">2</Button>
              <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">3</Button>
              <Button variant="outline" className="rounded-xl px-4 border-gray-200 hover:bg-gray-50">Next</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
