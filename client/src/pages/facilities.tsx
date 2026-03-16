import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, MapPin, Search, Loader2, X
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacilities, useFacilitiesCategories } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import facilityImage from "@assets/generated_images/nagari_office_building_exterior.png"; // Placeholder

export default function Facilities() {
  const { data: facilitiesData, isLoading: facilitiesLoading } = useFacilities();
  const { data: categoriesData, isLoading: categoriesLoading } = useFacilitiesCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // API returns paginated data: response.data.data is the array
  const facilities = facilitiesData?.data?.data || [];
  const categories = categoriesData?.data || [];

  // Filter fasilitas berdasarkan pencarian dan kategori
  const filteredFacilities = useMemo(() => {
    return facilities.filter((item: any) => {
      const matchesSearch = searchQuery === "" ||
        (item.nama || item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.deskripsi || item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.lokasi || item.address || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" ||
        (item.category?.slug === selectedCategory) ||
        (item.jenis || "").toLowerCase() === selectedCategory.toLowerCase() ||
        (item.category?.id?.toString() === selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [facilities, searchQuery, selectedCategory]);

  if (facilitiesLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat direktori...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Fasilitas & Wisata" 
        description="Jelajahi sarana publik, institusi pendidikan, layanan kesehatan, dan destinasi wisata unggulan di Nagari."
        image={facilityImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="w-full lg:w-auto"
           >
             <h2 className="text-[10px] uppercase font-bold tracking-widest text-teal-600 dark:text-[#3fd5ba] mb-4">Kategori Direktori</h2>
             <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 p-1.5 h-auto flex-wrap justify-start gap-2 rounded-2xl shadow-lg">
                <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Semua</TabsTrigger>
                {categoriesLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-[#3fd5ba] mx-4" />
                ) : Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat: any, idx: number) => (
                    <TabsTrigger key={cat?.id || idx} value={cat?.slug || cat?.id?.toString() || (typeof cat === 'string' ? cat : idx.toString())} className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">
                      {typeof cat === 'string' ? cat : cat?.name || cat?.nama || 'Kategori'}
                    </TabsTrigger>
                  ))
                ) : (
                  <>
                    <TabsTrigger value="pendidikan" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Pendidikan</TabsTrigger>
                    <TabsTrigger value="kesehatan" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Kesehatan</TabsTrigger>
                    <TabsTrigger value="ibadah" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Ibadah</TabsTrigger>
                    <TabsTrigger value="wisata" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-teal-500 dark:bg-[#3fd5ba] data-[state=active]:text-white dark:text-[#0a1a1c] text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Wisata</TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
           </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full lg:w-[400px]"
          >
             <h2 className="text-[10px] uppercase font-bold tracking-widest text-transparent mb-4 select-none hidden lg:block">.</h2>
            <div className="relative group">
              <div className="absolute inset-0 bg-teal-600/20 dark:bg-[#3fd5ba]/20 blur-xl rounded-full group-hover:bg-teal-600/30 dark:bg-[#3fd5ba]/30 transition-colors pointer-events-none opacity-0 group-focus-within:opacity-100" />
              <Search className="absolute left-5 top-4 h-5 w-5 text-teal-600 dark:text-[#3fd5ba] z-10" />
              <Input 
                placeholder="Cari lokasi atau nama fasilitas..." 
                className="pl-14 h-14 rounded-2xl bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/30 shadow-[0_0_20px_rgba(0,0,0,0.3)] focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>

        {/* Filter Result Counter */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/10">
          <p className="text-slate-600 dark:text-white/60 font-light">
            Menemukan <span className="font-bold text-teal-600 dark:text-[#3fd5ba]">{filteredFacilities.length}</span> dari {facilities.length} fasilitas
            {(searchQuery || selectedCategory !== "all") && (
              <span className="text-sm ml-2 text-slate-600 dark:text-white/40">
                {searchQuery && <span>(filter: "{searchQuery}")</span>}
              </span>
            )}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="text-slate-600 dark:text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 mr-1" /> Reset
            </Button>
          )}
        </div>

        {filteredFacilities.length === 0 ? (
          <div className="text-center py-20 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px]" />
            <Building2 className="w-20 h-20 mx-auto text-slate-600 dark:text-white/10 mb-6 relative z-10" />
            <p className="text-slate-600 dark:text-white/60 text-lg font-light relative z-10">
              {facilities.length === 0 ? "Data direktori fasilitas belum tersedia" : "Tidak ada lokasi yang cocok dengan filter pencarian"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                className="mt-8 rounded-full border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/10 relative z-10 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              >
                Kembalikan Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden h-full bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 hover:border-teal-300 dark:border-[#3fd5ba]/30 shadow-xl hover:shadow-[0_0_30px_rgba(63,213,186,0.15)] transition-all duration-500 rounded-3xl relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#0a1a1c]/80 group-hover:bg-slate-50/90 dark:bg-[#0a1a1c]/40 transition-colors z-10 duration-500" />
                    <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center scale-100 group-hover:scale-110 transition-transform duration-700">
                      <Building2 className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 backdrop-blur-md text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {facility.jenis || facility.category || 'Fasilitas'}
                      </Badge>
                    </div>
                    {facility.kondisi && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className={`backdrop-blur-md shadow-lg px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${
                        facility.kondisi === 'Baik' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                        facility.kondisi === 'Rusak Ringan' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {facility.kondisi}
                      </Badge>
                    </div>
                    )}
                    {facility.maps_url && (
                      <a href={facility.maps_url} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500 hover:scale-110">
                        <div className="bg-teal-500 dark:bg-[#3fd5ba] p-3 rounded-full shadow-[0_0_20px_rgba(63,213,186,0.5)] text-white dark:text-[#0a1a1c]">
                          <MapPin size={20} />
                        </div>
                      </a>
                    )}
                  </div>
                  <CardContent className="p-8 relative z-20">
                    <h3 className="font-serif font-bold text-2xl mb-3 text-slate-800 dark:text-white group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors leading-tight">
                      {facility.nama || facility.name || 'Fasilitas'}
                    </h3>
                    <p className="text-slate-600 dark:text-white/50 text-sm mb-6 line-clamp-2 font-light leading-relaxed">
                      {facility.deskripsi || facility.description || 'Tidak ada deskripsi rinci untuk fasilitas ini.'}
                    </p>
                    <div className="space-y-3">
                      {(facility.lokasi || facility.address) && (
                      <div className="flex items-start gap-3 text-slate-600 dark:text-white/70 text-sm bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-2xl group-hover:bg-teal-600/5 dark:bg-[#3fd5ba]/5 transition-colors">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-teal-600 dark:text-[#3fd5ba]" />
                        <span className="font-light leading-relaxed">{facility.lokasi || facility.address}</span>
                      </div>
                      )}
                      {facility.operating_hours && (
                        <div className="flex items-center gap-3 text-slate-600 dark:text-white/70 text-sm bg-white/5 border border-black/5 dark:border-white/5 p-4 rounded-2xl group-hover:bg-teal-600/5 dark:bg-[#3fd5ba]/5 transition-colors">
                          <span className="font-light leading-relaxed">Oprasional: <strong className="text-slate-800 dark:text-white ml-2">{facility.operating_hours}</strong></span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </PageBackground>
  );
}
