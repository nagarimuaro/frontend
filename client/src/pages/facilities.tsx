
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Building2, School, Stethoscope, Palmtree, MapPin, Search, Star, Loader2, X
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacilities, useFacilitiesCategories } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat fasilitas...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Fasilitas & Wisata" 
        description="Jelajahi sarana publik, institusi pendidikan, layanan kesehatan, dan destinasi wisata unggulan."
        image={facilityImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="w-full lg:w-auto"
           >
             <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">Kategori Fasilitas</h2>
             <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="bg-white border border-gray-100 p-1 h-auto flex-wrap justify-start gap-2 rounded-full shadow-sm">
                <TabsTrigger value="all" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Semua</TabsTrigger>
                {categoriesLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat: any, idx: number) => (
                    <TabsTrigger key={cat?.id || idx} value={cat?.slug || cat?.id?.toString() || (typeof cat === 'string' ? cat : idx.toString())} className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                      {typeof cat === 'string' ? cat : cat?.name || cat?.nama || 'Kategori'}
                    </TabsTrigger>
                  ))
                ) : (
                  <>
                    <TabsTrigger value="pendidikan" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Pendidikan</TabsTrigger>
                    <TabsTrigger value="kesehatan" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Kesehatan</TabsTrigger>
                    <TabsTrigger value="ibadah" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Ibadah</TabsTrigger>
                    <TabsTrigger value="wisata" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Wisata</TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
           </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full lg:w-80"
          >
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Cari fasilitas..." 
              className="pl-12 h-12 rounded-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Filter Result Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-bold text-primary">{filteredFacilities.length}</span> dari {facilities.length} fasilitas
            {(searchQuery || selectedCategory !== "all") && (
              <span className="text-sm ml-2">
                {searchQuery && <span className="text-gray-500">(pencarian: "{searchQuery}")</span>}
              </span>
            )}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="text-gray-500 hover:text-primary"
            >
              <X className="w-4 h-4 mr-1" /> Reset Filter
            </Button>
          )}
        </div>

        {filteredFacilities.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {facilities.length === 0 ? "Belum ada data fasilitas tersedia" : "Tidak ada fasilitas yang cocok dengan filter"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              >
                Reset Filter
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
              >
                <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-500 group border-none bg-white rounded-3xl shadow-sm">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10" />
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-primary/60" />
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md border-none shadow-lg px-4 py-1.5 text-sm font-medium rounded-full">
                        {facility.jenis || facility.category || 'Fasilitas'}
                      </Badge>
                    </div>
                    {facility.kondisi && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className={`backdrop-blur-md border-none shadow-lg px-3 py-1 text-xs font-medium rounded-full ${
                        facility.kondisi === 'Baik' ? 'bg-green-500 text-white' : 
                        facility.kondisi === 'Rusak Ringan' ? 'bg-yellow-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}>
                        {facility.kondisi}
                      </Badge>
                    </div>
                    )}
                    {facility.maps_url && (
                      <a href={facility.maps_url} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                        <div className="bg-white/95 p-2 rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-colors">
                          <MapPin size={20} />
                        </div>
                      </a>
                    )}
                  </div>
                  <CardContent className="p-8">
                    <h3 className="font-serif font-bold text-2xl mb-3 text-gray-900 group-hover:text-primary transition-colors leading-tight">
                      {facility.nama || facility.name || 'Fasilitas'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {facility.deskripsi || facility.description || ''}
                    </p>
                    <div className="space-y-2">
                      {(facility.lokasi || facility.address) && (
                      <div className="flex items-start gap-3 text-gray-500 text-sm bg-gray-50 p-3 rounded-xl">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span className="font-medium leading-relaxed">{facility.lokasi || facility.address}</span>
                      </div>
                      )}
                      {facility.operating_hours && (
                        <div className="flex items-start gap-3 text-gray-500 text-sm bg-gray-50 p-3 rounded-xl">
                          <span className="font-medium leading-relaxed">⏰ {facility.operating_hours}</span>
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
    </div>
  );
}
