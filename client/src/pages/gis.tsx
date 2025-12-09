
import { motion } from "framer-motion";
import { 
  Layers, Map as MapIcon, Info, Maximize2, ZoomIn, ZoomOut, Compass 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import mapImage from "@assets/generated_images/digital_map_of_village.png";

export default function GIS() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Peta Digital (GIS)" 
        description="Sistem Informasi Geografis untuk pemetaan wilayah, potensi lahan, dan infrastruktur Nagari Sungai Pinang."
        image={mapImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col lg:flex-row h-[85vh] min-h-[600px] relative"
        >
          {/* Sidebar Controls */}
          <div className="w-full lg:w-80 bg-white/95 backdrop-blur-md p-6 border-r border-gray-100 flex flex-col gap-8 z-10 shadow-lg lg:shadow-none">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                <Layers size={20} /> Layer Peta
              </h3>
              <div className="space-y-3">
                {["Batas Wilayah", "Jalan Nagari", "Persawahan", "Pemukiman", "Fasilitas Umum"].map((layer) => (
                  <motion.label 
                    key={layer} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <input type="checkbox" className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300" defaultChecked />
                    <span className="text-sm font-medium text-gray-700">{layer}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                <Info size={20} /> Legenda
              </h3>
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500/20 border-2 border-green-500 rounded-md"></div>
                  <span className="font-medium text-gray-600">Sawah / Pertanian</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-500/20 border-2 border-yellow-500 rounded-md"></div>
                  <span className="font-medium text-gray-600">Pemukiman</span>
                </div>
                 <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500/20 border-2 border-blue-500 rounded-md"></div>
                  <span className="font-medium text-gray-600">Sungai / Air</span>
                </div>
                 <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-500/20 border-2 border-gray-500 rounded-md"></div>
                  <span className="font-medium text-gray-600">Jalan</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg">
                <Maximize2 className="mr-2 h-4 w-4" /> Mode Layar Penuh
              </Button>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gray-100 group">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127669.96919056463!2d100.3551061!3d-0.9345797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942e2b117bb%3A0xb8468cb5c3046ba5!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1709823456789!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter contrast-[1.1] saturate-[0.8]"
              ></iframe>
              
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:text-primary">
                    <ZoomIn size={20} />
                 </motion.button>
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:text-primary">
                    <ZoomOut size={20} />
                 </motion.button>
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:text-primary mt-4">
                    <Compass size={20} />
                 </motion.button>
              </div>

              {/* Overlay info box that appears on hover/interaction */}
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl max-w-xs border border-white/20 hidden md:block"
              >
                <h4 className="font-bold text-gray-900 text-sm">Nagari Sungai Pinang</h4>
                <p className="text-xs text-gray-500 mt-1">Latitude: -0.9345 | Longitude: 100.3551</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Luas: 12.5 km²</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Elevasi: 450 mdpl</Badge>
                </div>
              </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
