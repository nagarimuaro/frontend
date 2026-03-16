import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Maximize2, Layers, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useWebGIS } from "@/lib/api";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBoundsUpdater({ regions }: { regions: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (regions && regions.length > 0) {
      try {
        const region = regions[0];
        if (region.geometry) {
          const parsed = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
          const finalGeom = parsed.geometry || parsed;
          const geojsonLayer = L.geoJSON(finalGeom);
          const bounds = geojsonLayer.getBounds();
          if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
        }
      } catch (e) { console.error("MapBoundsUpdater error:", e); }
    }
  }, [regions, map]);
  return null;
}

export default function PetaPreview() {
  const { data: webgisData, isLoading } = useWebGIS();
  const webgis = webgisData?.data;
  const regions = webgis?.layers?.regions || [];

  const featureCollection = regions.length > 0 ? {
    type: "FeatureCollection",
    features: regions.map((region: any) => {
      let pg = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
      return { type: "Feature", geometry: pg.geometry || pg, properties: region.properties || {} };
    })
  } as any : null;

  const defaultCenter: [number, number] = [webgis?.center?.lat || -0.67, webgis?.center?.lng || 101.0];

  return (
    <section className="px-4 md:px-6 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-600/20 dark:border-[#3fd5ba]/20">
              <Globe2 className="w-3.5 h-3.5" />
              Sistem Informasi Geografis
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Peta <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-[#3fd5ba] dark:to-[#2b9a9e]">Interaktif</span>
            </h2>
            <p className="text-slate-600 dark:text-white/40 mt-4 text-sm md:text-base leading-relaxed font-light">
              Melihat lebih jelas infrastruktur, distribusi wilayah, dan batas geografis dalam format WebGIS interaktif.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link href="/gis">
              <Button className="rounded-full px-8 h-12 text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20 transition-all group">
                Jelajahi Peta Penuh <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group"
        >
          {/* Glowing aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-emerald-400/10 dark:from-[#3fd5ba]/20 dark:to-[#2b9a9e]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/[0.08] rounded-3xl overflow-hidden relative shadow-lg dark:shadow-2xl">
            {/* Terminal/Browser bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-black/5 dark:border-white/[0.05] bg-slate-100/80 dark:bg-[#061011]/80">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-[#ff5f56] transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-[#ffbd2e] transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-[#27c93f] transition-colors" />
                </div>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
                <span className="text-[10px] text-slate-500 dark:text-white/30 font-mono tracking-wider flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-teal-500/50 dark:text-[#3fd5ba]/50" />
                  terminal@webgis:~
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#144749]/30 border border-teal-200 dark:border-[#3fd5ba]/10">
                <Layers className="w-3 h-3 text-teal-600 dark:text-[#3fd5ba]" />
                <span className="text-[9px] font-bold tracking-widest text-teal-600 dark:text-[#3fd5ba]">{regions.length > 0 ? 'LIVE' : 'SYNC'}</span>
                {regions.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#3fd5ba] animate-pulse ml-1" />}
              </div>
            </div>

            {/* Map Container */}
            <div className="h-[300px] md:h-[450px] relative">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-500/50 dark:text-[#3fd5ba]/50" />
                </div>
              ) : (
                <div className="w-full h-full dark:filter dark:saturate-150 dark:contrast-125 dark:sepia-[0.3] dark:hue-rotate-[190deg] dark:invert-[0.9] filter-none">
                  <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false} dragging={true} zoomControl={false} className="w-full h-full z-0 bg-slate-50 dark:bg-[#061011]" style={{ minHeight: '100%' }}>
                    <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.6} />
                    <MapBoundsUpdater regions={regions} />
                    {featureCollection && <GeoJSON key={`p-${regions.length}`} data={featureCollection} style={{ color: '#3fd5ba', weight: 3, fillOpacity: 0.15, fillColor: '#2b9a9e' }} />}
                  </MapContainer>
                </div>
              )}




              <Link href="/gis">
                <motion.div whileHover={{ scale: 1.05 }} className="absolute top-6 right-6 z-[400] bg-teal-500 dark:bg-[#3fd5ba] shadow-[0_0_15px_rgba(20,184,166,0.4)] dark:shadow-[0_0_20px_rgba(63,213,186,0.5)] rounded-full h-10 px-4 flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-teal-600 dark:hover:bg-white text-white dark:text-[#0a1a1c]">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Peta Penuh</span>
                </motion.div>
              </Link>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-white dark:from-[#0b2023] to-transparent pointer-events-none" />
          </div>
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/gis">
            <Button className="rounded-full px-8 h-12 w-full text-xs font-bold bg-slate-200/50 dark:bg-[#144749]/40 hover:bg-slate-200 dark:hover:bg-[#144749]/80 text-teal-700 dark:text-[#3fd5ba] border border-slate-300 dark:border-[#3fd5ba]/20">
              Jelajahi Peta Penuh <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
