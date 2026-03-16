import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Layers, Map as MapIcon, Info, Loader2, Navigation
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWebGIS, useJorongs, useNagariProfile } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import mapImage from "@assets/generated_images/digital_map_of_village.png";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper: auto-zoom map to fit GeoJSON bounds
function MapBoundsUpdater({ regions }: { regions: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (regions && regions.length > 0) {
      try {
        const region = regions[0];
        if (region.geometry) {
          const parsedGeometry = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
          const finalGeom = parsedGeometry.geometry || parsedGeometry;
          const geojsonLayer = L.geoJSON(finalGeom);
          const bounds = geojsonLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
          }
        }
      } catch (e) {
        console.error("Failed to fit bounds:", e);
      }
    }
  }, [regions, map]);

  return null;
}

export default function GIS() {
  const { data: webgisData, isLoading: webgisLoading } = useWebGIS();
  const { data: jorongsData } = useJorongs();
  const { data: profileData } = useNagariProfile();
  
  const webgis = webgisData?.data;
  const jorongs = jorongsData?.data || [];
  const profile = profileData?.data;

  // Extract regions from API response
  const regions = webgis?.layers?.regions || [];
  const facilities = webgis?.layers?.facilities || (webgis as any)?.facilities || [];

  // Build GeoJSON FeatureCollection from regions
  const featureCollection = regions.length > 0 ? {
    type: "FeatureCollection",
    features: regions.map((region: any) => {
      let parsedGeometry = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
      return {
        type: "Feature",
        geometry: parsedGeometry.geometry || parsedGeometry,
        properties: region.properties || {}
      };
    })
  } as any : null;

  const defaultCenter: [number, number] = [
    webgis?.center?.lat || -0.67, 
    webgis?.center?.lng || 101.0
  ];

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="WebGIS Digital" 
        description="Sistem Informasi Geografis interaktif untuk pemetaan batas wilayah, potensi, dan sarana publik."
        image={mapImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-black/5 dark:border-white/10 flex flex-col lg:flex-row h-[85vh] min-h-[650px] relative overflow-hidden group/map"
        >
          {/* Subtle glow border effect */}
          <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] border border-teal-300 dark:border-[#3fd5ba]/20 opacity-0 group-hover/map:opacity-100 transition-opacity duration-1000" />
          
          {/* Sidebar Controls */}
          <div className="w-full lg:w-96 bg-slate-50/90 dark:bg-[#0a1a1c]/90 backdrop-blur-2xl p-8 border-r border-black/5 dark:border-white/10 flex flex-col gap-8 z-10 
                          shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)] lg:overflow-y-auto custom-scrollbar">
            
            <div className="text-center pb-6 border-b border-black/5 dark:border-white/10">
              <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-3 bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.15)]">
                <Navigation size={14} />
                <span>Navigasi Peta</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white tracking-wide">
                Panel Interaktif
              </h3>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Layers size={14} /> Layer Aktif
              </h4>
              <div className="space-y-3 relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#3fd5ba]/50 via-[#3fd5ba]/20 to-transparent pointer-events-none" />
                {["Batas Wilayah", "Fasilitas Umum", "Infrastruktur", "Tutupan Lahan"].map((layer: string, i: number) => (
                  <motion.label 
                    key={layer} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 pl-8 p-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors relative group"
                  >
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#3fd5ba] shadow-[0_0_8px_rgba(63,213,186,0.8)]" />
                    <input type="checkbox" className="w-5 h-5 text-teal-600 dark:text-[#3fd5ba] rounded bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/20 focus:ring-[#3fd5ba] focus:ring-offset-[#0a1a1c] cursor-pointer accent-[#3fd5ba]" defaultChecked={i < 2} />
                    <span className="text-sm font-medium text-slate-600 dark:text-white/80 group-hover:text-slate-800 dark:text-white transition-colors">{layer}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Jorongs List */}
            {jorongs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
                <h4 className="text-xs font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapIcon size={14} /> Entitas Wilayah
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {jorongs.map((jorong: any) => (
                    <div key={jorong.id} className="text-sm text-slate-600 dark:text-white/60 p-3 bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.05] hover:border-blue-500/30 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                        <span className="font-medium group-hover:text-slate-800 dark:text-white transition-colors">{jorong.nama}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-white/30 uppercase tracking-widest bg-white/[0.05] px-2 py-0.5 rounded">Jorong</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/10">
              <h4 className="text-xs font-bold text-slate-600 dark:text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={14} /> Legenda
              </h4>
              <div className="space-y-3 text-sm bg-white/[0.02] p-5 rounded-2xl border border-black/5 dark:border-white/5">
                {[
                  { color: "#ef4444", label: "Batas Wilayah Nagari", isLine: false },
                  { color: "#3b82f6", label: "Titik Pusat Jorong", isLine: false },
                  { color: "#22c55e", label: "Fasilitas Publik / Aset", isLine: false },
                  { color: "#9ca3af", label: "Jalan Utama", isLine: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.isLine ? (
                      <div className="w-6 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                    ) : (
                      <div 
                        className="w-4 h-4 rounded-full border-2" 
                        style={{ 
                          backgroundColor: `${item.color}33`, 
                          borderColor: item.color,
                          boxShadow: `0 0 10px ${item.color}40`
                        }}
                      />
                    )}
                    <span className="font-light text-slate-600 dark:text-white/70">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nagari Info */}
            {profile && (
              <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/10 relative">
                <div className="absolute -left-8 -top-8 w-24 h-24 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[20px]" />
                <h4 className="font-bold text-slate-800 dark:text-white text-base font-serif relative z-10">{profile.nama_nagari || 'Nagari'}</h4>
                <p className="text-xs text-slate-600 dark:text-white/50 mt-1 font-light relative z-10">
                  {profile.kecamatan && `Kec. ${profile.kecamatan}`}{profile.kabupaten && `, ${profile.kabupaten}`}
                </p>
                <div className="flex gap-2 mt-4 flex-wrap relative z-10">
                  {profile.luas_wilayah && (
                    <span className="text-[10px] font-bold text-teal-600 dark:text-[#3fd5ba] bg-teal-600/10 dark:bg-[#3fd5ba]/10 border border-teal-300 dark:border-[#3fd5ba]/20 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
                      Luas: {profile.luas_wilayah} km²
                    </span>
                  )}
                  {profile.ketinggian && (
                     <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
                      Elevasi: {profile.ketinggian} mdpl
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map Area - Leaflet */}
          <div className="flex-1 relative bg-slate-50 dark:bg-[#0a1a1c] map-dark-theme-wrapper">
            {/* Dark vignette effect over map edges */}
            <div className="absolute inset-0 z-[400] pointer-events-none rounded-r-[2.5rem] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />
            
            {webgisLoading ? (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#0a1a1c]/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full border-b-2 border-t-2 border-teal-300 dark:border-[#3fd5ba] animate-spin mb-4" />
                <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest font-bold text-xs">Merender Peta Spasial...</span>
              </div>
            ) : (
              <div className="w-full h-full [&>.leaflet-container]:bg-[#121212] [&>.leaflet-container]:h-full [&_.leaflet-control-zoom]:border-black/5 dark:border-white/10 [&_.leaflet-control-zoom]:shadow-lg [&_.leaflet-control-zoom-in]:bg-white dark:bg-[#0b2023] [&_.leaflet-control-zoom-in]:text-slate-800 dark:text-white [&_.leaflet-control-zoom-out]:bg-white dark:bg-[#0b2023] [&_.leaflet-control-zoom-out]:text-slate-800 dark:text-white hover:[&_.leaflet-control-zoom-in]:text-teal-600 dark:text-[#3fd5ba] hover:[&_.leaflet-control-zoom-out]:text-teal-600 dark:text-[#3fd5ba]">
                  <MapContainer 
                    center={defaultCenter} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    className="w-full h-full z-0"
                  >
                    {/* Menggunakan CartoDB Dark Matter tile layer untuk tema gelap / dark mode GIS */}
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      subdomains="abcd"
                      maxZoom={19}
                    />

                    {/* Auto-zoom to region bounds */}
                    <MapBoundsUpdater regions={regions} />

                    {/* Render GeoJSON Polygon (Batas Wilayah) */}
                    {featureCollection && (
                      <GeoJSON 
                        key={`regions-${regions.length}`}
                        data={featureCollection}
                        style={{
                          color: '#ef4444',
                          weight: 3,
                          opacity: 0.8,
                          fillOpacity: 0.1,
                          fillColor: '#f87171',
                          dashArray: '5, 10' // Putus-putus
                        }}
                        onEachFeature={(feature, layer) => {
                          if (feature.properties) {
                            const name = feature.properties.nama || feature.properties.wadmkd || 'Wilayah';
                            const desc = feature.properties.deskripsi || '';
                            layer.bindPopup(`
                              <div style="font-family: inherit; background:#0b2023; color:#fff; padding:4px;">
                                <strong style="color:#3fd5ba;font-size:14px;display:block;margin-bottom:4px;">${name}</strong>
                                ${desc ? `<span style="color:rgba(255,255,255,0.7);font-size:12px;">${desc}</span>` : '<span style="color:rgba(255,255,255,0.5);font-size:11px;">Batas Wilayah Nagari</span>'}
                              </div>
                            `);
                          }
                        }}
                      />
                    )}

                    {/* Render Facility Markers */}
                    {facilities.map((facility: any) => {
                      const coords = facility.geometry?.coordinates;
                      if (!coords || coords.length < 2) return null;
                      
                      // Using a custom divIcon for a more cyber look instead of default marker
                      const modernIcon = L.divIcon({
                        className: 'cyber-map-icon',
                        html: `<div style="width:16px;height:16px;background:#22c55e;border-radius:50%;border:2px solid #000;box-shadow:0 0 15px #22c55e;"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      });

                      return (
                        <Marker key={facility.id} position={[coords[1], coords[0]]} icon={modernIcon}>
                          <Popup>
                            <div style={{ fontFamily: 'inherit', background:'#0b2023', color:'#fff' }}>
                              <strong style={{color:'#22c55e', fontSize:'14px', display:'block'}}>{facility.properties?.nama || 'Fasilitas'}</strong>
                              {facility.properties?.jenis && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop:'4px', display:'inline-block' }}>{facility.properties.jenis}</span>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}

                    {/* Render Jorong Markers */}
                    {jorongs.map((jorong: any) => {
                      if (!jorong.koordinat_lat || !jorong.koordinat_lng) return null;
                      
                      const jorongIcon = L.divIcon({
                        className: 'cyber-map-icon-jorong',
                        html: `<div style="width:20px;height:20px;background:#3b82f6;border-radius:50%;border:3px solid #000;box-shadow:0 0 20px #3b82f6;"></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                      });

                      return (
                        <Marker 
                          key={`jorong-${jorong.id}`} 
                          position={[parseFloat(jorong.koordinat_lat), parseFloat(jorong.koordinat_lng)]}
                          icon={jorongIcon}
                        >
                          <Popup>
                            <div style={{ fontFamily: 'inherit', background:'#0b2023', color:'#fff' }}>
                              <strong style={{color:'#3b82f6', fontSize:'14px', display:'block'}}>Jorong {jorong.nama}</strong>
                              {jorong.kepala_jorong && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop:'6px', display:'inline-block' }}>Wali: <b>{jorong.kepala_jorong}</b></span>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
              </div>
            )}
          </div>
        </motion.div>

        {/* Custom style overrides for Leaflet Popups to match dark theme */}
        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-popup-content-wrapper {
            background-color: #0b2023 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
          }
          .leaflet-popup-tip {
            background-color: #0b2023 !important;
            border-top: 1px solid rgba(255,255,255,0.1);
            border-left: 1px solid rgba(255,255,255,0.1);
          }
          .leaflet-container a.leaflet-popup-close-button {
            color: rgba(255,255,255,0.5) !important;
          }
          .leaflet-container a.leaflet-popup-close-button:hover {
            color: #fff !important;
          }
        `}} />
      </div>
      <Footer />
    </PageBackground>
  );
}
