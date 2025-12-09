
import { motion } from "framer-motion";
import { 
  Building2, School, Stethoscope, Palmtree, MapPin, Search, Star 
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { facilities } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import facilityImage from "@assets/generated_images/nagari_office_building_exterior.png"; // Placeholder

export default function Facilities() {
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
             <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white border border-gray-100 p-1 h-auto flex-wrap justify-start gap-2 rounded-full shadow-sm">
                <TabsTrigger value="all" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Semua</TabsTrigger>
                <TabsTrigger value="education" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Pendidikan</TabsTrigger>
                <TabsTrigger value="health" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Kesehatan</TabsTrigger>
                <TabsTrigger value="worship" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Ibadah</TabsTrigger>
                <TabsTrigger value="tourism" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">Wisata</TabsTrigger>
              </TabsList>
            </Tabs>
           </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full lg:w-80"
          >
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Cari fasilitas..." className="pl-12 h-12 rounded-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-500 group border-none bg-white rounded-3xl shadow-sm">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10" />
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md border-none shadow-lg px-4 py-1.5 text-sm font-medium rounded-full">
                      {facility.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    <div className="bg-white/95 p-2 rounded-full shadow-lg text-primary">
                      <MapPin size={20} />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="font-serif font-bold text-2xl mb-3 text-gray-900 group-hover:text-primary transition-colors leading-tight">
                    {facility.name}
                  </h3>
                  <div className="flex items-start gap-3 text-gray-500 text-sm bg-gray-50 p-4 rounded-xl">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span className="font-medium leading-relaxed">{facility.address}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
