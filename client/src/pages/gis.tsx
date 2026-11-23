import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Map as MapIcon, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Globe
} from "lucide-react";
import { useWebGIS, useJorongs, useNagariProfile } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper: Extract Centroid from GeoJSON geometry
function extractCentroid(geom: any, fallback: [number, number] = [-0.664676, 100.959335]): [number, number] {
  if (!geom) return fallback;
  try {
    let g = geom;
    if (typeof g === 'string') {
      try { g = JSON.parse(g); } catch (e) {}
    }
    if (g?.geometry) g = g.geometry;
    const rawCoords = g?.coordinates || g?.geojson?.coordinates || (Array.isArray(g) ? g : null);
    if (!rawCoords) return fallback;

    const points: [number, number][] = [];
    const traverse = (item: any) => {
      if (!Array.isArray(item) || item.length === 0) return;
      if (item.length >= 2 && typeof item[0] === 'number' && typeof item[1] === 'number') {
        const lng = Number(item[0]);
        const lat = Number(item[1]);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          points.push([lat, lng]);
        }
        return;
      }
      for (const child of item) traverse(child);
    };
    traverse(rawCoords);

    if (points.length === 0) return fallback;
    let sumLat = 0;
    let sumLng = 0;
    for (const pt of points) {
      sumLat += pt[0];
      sumLng += pt[1];
    }
    return [sumLat / points.length, sumLng / points.length];
  } catch (e) {
    return fallback;
  }
}

// Vector Marker Generator for POI & Fasilitas
function createPortalMarkerIcon(type: string = 'Lokasi', color: string = '#37539f') {
  const t = (type || '').toLowerCase();
  let emoji = '📍';
  let bg = color;

  if (t.includes('sakit') || t.includes('puskesmas') || t.includes('posyandu') || t.includes('klinik') || t.includes('kesehatan')) {
    emoji = '🏥';
    bg = '#dc2626';
  } else if (t.includes('sekolah') || t.includes('pendidikan') || t.includes('sd') || t.includes('smp') || t.includes('sma') || t.includes('pesantren')) {
    emoji = '🎓';
    bg = '#37539f';
  } else if (t.includes('masjid') || t.includes('musholla') || t.includes('ibadah') || t.includes('surau')) {
    emoji = '🕌';
    bg = '#059669';
  } else if (t.includes('kantor') || t.includes('pemerintahan') || t.includes('balai') || t.includes('desa') || t.includes('nagari')) {
    emoji = '🏢';
    bg = '#1d4ed8';
  } else if (t.includes('kebun') || t.includes('perkebunan') || t.includes('tani') || t.includes('sawah') || t.includes('hutan')) {
    emoji = '🌴';
    bg = '#16a34a';
  } else if (t.includes('umkm') || t.includes('pasar') || t.includes('usaha') || t.includes('toko') || t.includes('warung')) {
    emoji = '🏪';
    bg = '#d97706';
  } else if (t.includes('infrastruktur') || t.includes('jembatan') || t.includes('jalan') || t.includes('irigasi') || t.includes('drainase')) {
    emoji = '🏗️';
    bg = '#f59e0b';
  }

  return L.divIcon({
    className: 'portal-custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        background: ${bg};
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        cursor: pointer;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 14px;
          line-height: 1;
        ">${emoji}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

// Basemap Tiles: Standar (Default) and Satelit
const BASEMAP_TILES = {
  street: {
    name: 'Peta Standar (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19
  },
  satellite: {
    name: 'Citra Satelit (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: 'abcd',
    maxZoom: 19
  }
};

// Helper: Invalidate map size on load/resize to guarantee full canvas rendering
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

// Helper: Auto-zoom map to fit all regions and jorongs
function MapBoundsUpdater({ regions, jorongs, flyToCoords }: { regions: any[], jorongs: any[], flyToCoords: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (flyToCoords) {
      map.flyTo(flyToCoords, 16, { duration: 1.2 });
      return;
    }

    if (regions && regions.length > 0) {
      try {
        const totalBounds = L.latLngBounds([]);
        
        // Find Batas Nagari first or aggregate all
        const batasNagari = regions.find(r => r.properties?.tipe === 'Batas Nagari' || r.properties?.tipe === 'Nagari');
        const targetRegions = batasNagari ? [batasNagari] : regions;

        targetRegions.forEach(region => {
          if (region.geometry) {
            const parsedGeometry = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
            const finalGeom = parsedGeometry.geometry || parsedGeometry;
            const geojsonLayer = L.geoJSON(finalGeom);
            const b = geojsonLayer.getBounds();
            if (b.isValid()) {
              totalBounds.extend(b);
            }
          }
        });

        // Also extend with jorong coordinates
        if (!batasNagari && jorongs && jorongs.length > 0) {
          jorongs.forEach(j => {
            if (j.koordinat_lat && j.koordinat_lng) {
              totalBounds.extend([parseFloat(j.koordinat_lat), parseFloat(j.koordinat_lng)]);
            }
          });
        }

        if (totalBounds.isValid()) {
          map.fitBounds(totalBounds, { padding: [40, 40], maxZoom: 13 });
        }
      } catch (e) {
        console.error("Failed to fit bounds:", e);
      }
    }
  }, [regions, jorongs, flyToCoords, map]);

  return null;
}

export default function GIS() {
  const { data: webgisData, isLoading: webgisLoading } = useWebGIS();
  const { data: jorongsData } = useJorongs();
  const { data: profileData } = useNagariProfile();
  
  const webgis = webgisData?.data;
  const jorongs = jorongsData?.data || [];
  const profile = profileData?.data;

  // Extract all layers from API response
  const regions = useMemo(() => webgis?.layers?.regions || [], [webgis]);
  const facilities = useMemo(() => webgis?.layers?.facilities || (webgis as any)?.facilities || [], [webgis]);
  const locations = useMemo(() => webgis?.layers?.locations || [], [webgis]);
  const infrastruktur = useMemo(() => (webgis?.layers as any)?.infrastruktur || [], [webgis]);

  // Sort regions: Outer Batas Nagari first (rendered at bottom), Inner Jorongs & Zonasi rendered on top
  const sortedRegions = useMemo(() => {
    return [...regions].sort((a, b) => {
      const isNagariA = ['nagari', 'batas nagari'].includes(String(a.properties?.tipe || '').toLowerCase());
      const isNagariB = ['nagari', 'batas nagari'].includes(String(b.properties?.tipe || '').toLowerCase());
      if (isNagariA && !isNagariB) return -1;
      if (!isNagariA && isNagariB) return 1;
      return 0;
    });
  }, [regions]);

  // Active Basemap: DEFAULT TO STREET (Peta Standar)
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Layer Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    regions: true,
    jorongs: true,
    facilities: true,
    locations: true,
    infrastruktur: true
  });

  const defaultCenter: [number, number] = useMemo(() => {
    return [
      webgis?.center?.lat || -0.664676, 
      webgis?.center?.lng || 100.959335
    ];
  }, [webgis]);

  const currentTile = BASEMAP_TILES[mapView] || BASEMAP_TILES.street;

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden select-none">
      <Navbar />
      
      {/* FULL-PAGE WEBGIS CONTAINER PLACED STRICTLY BELOW NAVBAR */}
      <main
        id="main"
        className={`relative w-full overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 z-[99999] h-screen bg-background' 
            : 'h-[calc(100vh-72px)] mt-[72px]'
        }`}
        style={{ minHeight: '400px' }}
      >
        {/* Tailwind Leaflet CSS Overrides */}
        <style>{`
          .leaflet-container {
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
            background: #f8fafc !important;
          }
          .leaflet-container img.leaflet-tile {
            max-width: none !important;
            max-height: none !important;
            width: 256px !important;
            height: 256px !important;
          }
          .leaflet-container img {
            max-width: none !important;
            max-height: none !important;
          }
          .leaflet-tile {
            visibility: inherit !important;
          }
          .leaflet-pane {
            z-index: 400 !important;
          }
          .leaflet-top,
          .leaflet-bottom {
            z-index: 500 !important;
          }
        `}</style>

        {/* FLOATING SIDEBAR CONTROL PANEL (Positioned below navbar inside map canvas) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -340, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-6 left-4 sm:left-6 z-[500] w-80 max-w-[calc(100%-2rem)] max-h-[calc(100%-4rem)] bg-card rounded-2xl shadow-lg border border-border flex flex-col overflow-hidden text-foreground"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-nagari-red flex items-center justify-center text-white">
                    <Globe aria-hidden="true" size={18} />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold tracking-tight text-foreground">WebGIS Nagari</h1>
                    <p className="text-[13px] text-muted-foreground">Peta Spasial &amp; Fasilitas</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Sembunyikan panel peta"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-10 h-10 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                  title="Sembunyikan Panel"
                >
                  <ChevronLeft aria-hidden="true" size={18} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto custom-scrollbar space-y-4 flex-1">
                {/* Basemap Switcher: Standar vs Satelit */}
                <div className="space-y-1.5">
                  <span className="text-[13px] font-semibold text-muted-foreground block">
                    Mode Peta
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-muted p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMapView('street')}
                      className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-[13px] font-semibold transition-colors ${
                        mapView === 'street'
                          ? 'bg-card text-nagari-red-ink shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Standar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapView('satellite')}
                      className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg text-[13px] font-semibold transition-colors ${
                        mapView === 'satellite'
                          ? 'bg-card text-nagari-red-ink shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Satelit
                    </button>
                  </div>
                </div>

                {/* Layer Visibility Toggles */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Layers aria-hidden="true" size={14} /> Layer Spasial
                    </span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { key: 'regions', label: 'Batas & Zonasi', count: regions.length, color: '#b82026' },
                      { key: 'locations', label: 'Titik POI (RS, Sekolah, dll)', count: locations.length, color: '#37539f' },
                      { key: 'facilities', label: 'Aset & Fasilitas Nagari', count: facilities.length, color: '#1e7a56' },
                      { key: 'infrastruktur', label: 'Infrastruktur', count: infrastruktur.length, color: '#b7791f' },
                      { key: 'jorongs', label: 'Pusat Jorong', count: jorongs.length, color: '#2b6cb0' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={layerVisibility[item.key as keyof typeof layerVisibility]}
                            onChange={(e) => setLayerVisibility({ ...layerVisibility, [item.key]: e.target.checked })}
                            className="w-4 h-4 rounded border-border cursor-pointer accent-nagari-red"
                          />
                          <span className="text-[13px] font-medium text-foreground">{item.label}</span>
                        </div>
                        <span
                          className="text-[13px] font-semibold px-2 py-0.5 rounded-md tabular-nums"
                          style={{ backgroundColor: `${item.color}18`, color: item.color }}
                        >
                          {item.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Jorong Focus */}
                {jorongs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <MapIcon aria-hidden="true" size={14} /> Daftar Jorong ({jorongs.length})
                    </span>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {jorongs.map((jorong: any) => (
                        <button
                          key={jorong.id}
                          type="button"
                          onClick={() => {
                            if (jorong.koordinat_lat && jorong.koordinat_lng) {
                              setFlyToCoords([parseFloat(jorong.koordinat_lat), parseFloat(jorong.koordinat_lng)]);
                            }
                          }}
                          className="w-full text-left text-[13px] p-2.5 rounded-xl bg-muted/50 border border-border flex items-center justify-between hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2 h-2 rounded-full bg-cat-2 flex-shrink-0" />
                            <span className="font-medium truncate text-foreground">
                              {jorong.nama}
                            </span>
                          </div>
                          <span className="text-[13px] font-semibold text-nagari-red-ink shrink-0 ml-2">
                            Fokus
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Footer: Nagari Summary */}
              {profile && (
                <div className="p-3.5 bg-muted/50 border-t border-border text-[13px]">
                  <div className="font-semibold text-foreground truncate">{profile.nama_nagari || 'Nagari'}</div>
                  <div className="text-[13px] text-muted-foreground mt-0.5">
                    {profile.kecamatan && `Kec. ${profile.kecamatan}`}{profile.kabupaten && `, ${profile.kabupaten}`}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING TOGGLE BUTTON WHEN SIDEBAR IS CLOSED */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-6 left-4 sm:left-6 z-[500] flex items-center gap-2 bg-card px-4 h-11 rounded-xl shadow-md border border-border text-[13px] font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Layers aria-hidden="true" size={16} className="text-nagari-red-ink" />
            <span>Buka Panel Peta</span>
            <ChevronRight aria-hidden="true" size={16} />
          </button>
        )}

        {/* FLOATING TOP-RIGHT UTILITIES */}
        <div className="absolute top-6 right-4 sm:right-6 z-[500] flex items-center gap-2">
          {/* Quick Basemap Pill */}
          <div className="bg-card p-1 rounded-xl shadow-md border border-border flex gap-1">
            <button
              type="button"
              onClick={() => setMapView('street')}
              className={`px-3 h-9 rounded-lg text-[13px] font-semibold transition-colors ${
                mapView === 'street'
                  ? 'bg-nagari-red text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Standar
            </button>
            <button
              type="button"
              onClick={() => setMapView('satellite')}
              className={`px-3 h-9 rounded-lg text-[13px] font-semibold transition-colors ${
                mapView === 'satellite'
                  ? 'bg-nagari-red text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Satelit
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            aria-label={isFullscreen ? 'Keluar layar penuh' : 'Mode layar penuh'}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-card w-11 h-11 rounded-xl shadow-md border border-border text-foreground hover:bg-muted flex items-center justify-center transition-colors"
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 aria-hidden="true" size={16} /> : <Maximize2 aria-hidden="true" size={16} />}
          </button>
        </div>

        {/* LOADING STATE */}
        {webgisLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-background">
            <div className="w-10 h-10 rounded-full border-4 border-nagari-red border-t-transparent animate-spin mb-4" />
            <span className="text-muted-foreground font-medium text-sm">
              Memuat peta spasial nagari...
            </span>
          </div>
        ) : (
          <div className="w-full h-full relative" style={{ height: '100%', width: '100%' }}>
            <MapContainer 
              center={defaultCenter} 
              zoom={12} 
              scrollWheelZoom={true} 
              zoomControl={false}
              className="w-full h-full z-0"
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                key={mapView}
                attribution={currentTile.attribution}
                url={currentTile.url}
                subdomains={currentTile.subdomains}
                maxZoom={currentTile.maxZoom}
              />

              {/* Force map resize recalculation on render */}
              <MapResizer />

              {/* Reposition zoom control to bottom-right to keep left area unobstructed */}
              <ZoomControl position="bottomright" />

              {/* Auto-fit map to region and jorong bounds */}
              <MapBoundsUpdater regions={regions} jorongs={jorongs} flyToCoords={flyToCoords} />

              {/* LAYER 1: REGIONS (Batas Wilayah & Poligon Zonasi) */}
              {layerVisibility.regions && sortedRegions.map((region: any) => {
                if (!region.geometry) return null;
                let parsedGeom = typeof region.geometry === 'string' ? JSON.parse(region.geometry) : region.geometry;
                const finalGeom = parsedGeom.geometry || parsedGeom;
                const regColor = region.properties?.warna || '#ef4444';
                const props = region.properties || {};
                const isNagari = ['nagari', 'batas nagari'].includes(String(props.tipe || '').toLowerCase());
                const isJorong = String(props.tipe || '').toLowerCase().includes('jorong');

                // Display Name Formatting
                let displayName = props.nama || 'Wilayah';
                let displaySubtitle = props.tipe || 'Zonasi';

                if (isNagari) {
                  displayName = displayName.toLowerCase().includes('nagari') ? displayName : `Batas Nagari ${displayName}`;
                  displaySubtitle = 'Wilayah Administrasi Nagari';
                } else if (isJorong) {
                  displayName = displayName.toLowerCase().includes('jorong') ? displayName : `Jorong ${displayName}`;
                  displaySubtitle = 'Wilayah Administratif Jorong';
                }

                return (
                  <GeoJSON 
                    key={`portal-reg-${region.id}-${mapView}`}
                    data={{
                      type: "Feature",
                      geometry: finalGeom,
                      properties: props
                    } as any}
                    style={{
                      color: regColor,
                      weight: isNagari ? 3.5 : 2.5,
                      opacity: 0.9,
                      fillOpacity: isNagari ? 0.04 : 0.28,
                      fillColor: regColor,
                      dashArray: isNagari ? '6, 6' : undefined
                    }}
                    onEachFeature={(feature, layer) => {
                      const p = feature.properties || {};
                      const luas = p.luas_wilayah ? `${Number(p.luas_wilayah).toFixed(2)} Ha` : null;
                      const centroid = extractCentroid(finalGeom, defaultCenter);
                      const cLat = centroid[0];
                      const cLng = centroid[1];
                      const hasStats = p.total_warga !== undefined || p.total_kk !== undefined || p.kepala_jorong;
                      const hasSocial = (p.kemiskinan || 0) > 0 || (p.rtlh || 0) > 0 || (p.stunting || 0) > 0 || (p.disabilitas || 0) > 0;

                      layer.bindPopup(`
                        <div style="font-family: inherit; min-width: 260px; max-width: 320px; font-size: 12px; color: #1e293b; line-height: 1.4;">
                          <!-- Header: Nama Wilayah + Badge Tipe + Luas -->
                          <div style="margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
                            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
                              ${displayName}
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b;">
                              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${regColor};"></span>
                              <span style="font-weight: 700; color: ${regColor};">${displaySubtitle}</span>
                              ${luas ? `<span>· Luas: <strong>${luas}</strong></span>` : ''}
                            </div>
                          </div>

                          ${p.deskripsi ? `
                            <div style="font-size: 11.5px; color: #475569; margin-bottom: 8px; background: #f8fafc; padding: 6px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                              ${p.deskripsi}
                            </div>
                          ` : ''}

                          <!-- Info Demografi & Sosial Warga -->
                          ${hasStats ? `
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; font-size: 11.5px;">
                              ${p.kepala_jorong ? `<div style="color: #166534; font-size: 11px; margin-bottom: 4px;">Wali Jorong: <strong style="color: #14532d;">${p.kepala_jorong}</strong></div>` : ''}
                              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; color: #166534; font-size: 11.5px;">
                                <span>👥 Penduduk: <strong style="color: #14532d;">${(p.total_warga || 0).toLocaleString('id-ID')}</strong></span>
                                <span>🏠 KK: <strong style="color: #14532d;">${(p.total_kk || 0).toLocaleString('id-ID')}</strong></span>
                              </div>
                              ${hasSocial ? `
                                <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #86efac; font-size: 10.5px; color: #15803d; display: flex; flex-wrap: gap: 5px;">
                                  ${(p.kemiskinan || 0) > 0 ? `<span style="background: #dcfce7; padding: 1px 5px; border-radius: 3px;">Miskin: <strong>${p.kemiskinan}</strong></span>` : ''}
                                  ${(p.rtlh || 0) > 0 ? `<span style="background: #dcfce7; padding: 1px 5px; border-radius: 3px;">RTLH: <strong>${p.rtlh}</strong></span>` : ''}
                                  ${(p.stunting || 0) > 0 ? `<span style="background: #dcfce7; padding: 1px 5px; border-radius: 3px;">Stunting: <strong>${p.stunting}</strong></span>` : ''}
                                  ${(p.disabilitas || 0) > 0 ? `<span style="background: #dcfce7; padding: 1px 5px; border-radius: 3px;">Disabilitas: <strong>${p.disabilitas}</strong></span>` : ''}
                                </div>
                              ` : ''}
                            </div>
                          ` : ''}

                          <!-- Footer Koordinat & Link -->
                          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; color: #64748b; padding-top: 4px;">
                            <span>📍 Pusat: ${cLat.toFixed(5)}, ${cLng.toFixed(5)}</span>
                            <a href="https://www.google.com/maps?q=${cLat},${cLng}" target="_blank" rel="noreferrer" style="color: #059669; font-weight: 700; text-decoration: none;">
                              Google Maps ↗
                            </a>
                          </div>
                        </div>
                      `);
                    }}
                  />
                );
              })}

              {/* LAYER 2: POI LOCATIONS (Titik Penting: RS, Sekolah, Kebun, dll) */}
              {layerVisibility.locations && locations.map((loc: any) => {
                const coords = loc.geometry?.coordinates;
                if (!coords || coords.length < 2) return null;
                const props = loc.properties || {};
                const phone = props.telepon || '';
                const cleanPhone = phone.replace(/[^0-9]/g, '');

                return (
                  <Marker 
                    key={`portal-loc-${loc.id}`} 
                    position={[coords[1], coords[0]]} 
                    icon={createPortalMarkerIcon(props.jenis, '#37539f')}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'inherit', minWidth: '250px', maxWidth: '300px', fontSize: '12px', color: '#1e293b' }}>
                        {/* Optional Photo Thumbnail */}
                        {props.foto && (
                          <div style={{ width: '100%', height: '110px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                            <img src={props.foto} alt={props.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13.5px', color: '#0f172a', lineHeight: 1.3 }}>{props.nama}</strong>
                          <span style={{ backgroundColor: '#eef2ff', color: '#37539f', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                            {props.jenis || 'Lokasi'}
                          </span>
                        </div>

                        {/* Alamat */}
                        {props.alamat && (
                          <div style={{ fontSize: '11.5px', color: '#334155', margin: '4px 0', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{ color: '#059669', flexShrink: 0 }}>📍</span>
                            <span style={{ fontWeight: 600 }}>{props.alamat}</span>
                          </div>
                        )}

                        {/* Detail Pengelola & Jam Operasional */}
                        {(props.penanggung_jawab || props.jam_operasional) && (
                              <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', margin: '6px 0', fontSize: '11px', color: '#475569' }}>
                                {props.penanggung_jawab && <div style={{ marginBottom: '2px' }}>👤 Pengelola: <strong style={{ color: '#0f172a' }}>{props.penanggung_jawab}</strong></div>}
                                {props.jam_operasional && <div>⏰ Jam: <strong style={{ color: '#0f172a' }}>{props.jam_operasional}</strong></div>}
                              </div>
                        )}

                        {/* Deskripsi */}
                        {props.deskripsi && (
                          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', margin: '4px 0' }}>
                            {props.deskripsi}
                          </div>
                        )}

                        {/* Telepon & WhatsApp Actions */}
                        {phone && (
                          <div style={{ display: 'flex', gap: '6px', margin: '8px 0', alignItems: 'center' }}>
                            <a 
                              href={`tel:${phone}`}
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px 8px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}
                            >
                              📞 {phone}
                            </a>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', backgroundColor: '#25d366', color: '#ffffff', fontSize: '11px', fontWeight: 800, textDecoration: 'none' }}
                              >
                                WhatsApp ↗
                              </a>
                            )}
                          </div>
                        )}

                        {/* Footer Link */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontSize: '10.5px' }}>
                          <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{coords[1].toFixed(5)}, {coords[0].toFixed(5)}</span>
                          <a
                            href={`https://www.google.com/maps?q=${coords[1]},${coords[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                          >
                            Petunjuk Arah ↗
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* LAYER 3: FACILITIES (Aset & Sarana Publik) */}
              {layerVisibility.facilities && facilities.map((facility: any) => {
                const coords = facility.geometry?.coordinates;
                if (!coords || coords.length < 2) return null;
                const props = facility.properties || {};

                return (
                  <Marker 
                    key={`portal-fac-${facility.id}`} 
                    position={[coords[1], coords[0]]} 
                    icon={createPortalMarkerIcon(props.nama + ' ' + (props.jenis || ''), '#22c55e')}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'inherit', minWidth: '220px', maxWidth: '280px', fontSize: '12px', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13.5px', color: '#0f172a', lineHeight: 1.3 }}>{props.nama}</strong>
                          <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                            {props.jenis || 'Aset / Fasilitas'}
                          </span>
                        </div>
                        {props.lokasi && (
                          <div style={{ fontSize: '11.5px', color: '#334155', margin: '4px 0' }}>
                            📍 {props.lokasi}
                          </div>
                        )}
                        {props.kondisi && (
                          <div style={{ fontSize: '11px', color: '#475569', margin: '4px 0' }}>
                            Kondisi: <strong style={{ color: String(props.kondisi).toLowerCase().includes('baik') ? '#16a34a' : '#d97706' }}>{props.kondisi}</strong>
                          </div>
                        )}
                        {props.deskripsi && (
                          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', margin: '4px 0' }}>
                            {props.deskripsi}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontSize: '10.5px' }}>
                          <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{coords[1].toFixed(5)}, {coords[0].toFixed(5)}</span>
                          <a
                            href={`https://www.google.com/maps?q=${coords[1]},${coords[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                          >
                            Petunjuk Arah ↗
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* LAYER 4: INFRASTRUKTUR */}
              {layerVisibility.infrastruktur && infrastruktur.map((infra: any) => {
                const coords = infra.geometry?.coordinates;
                if (!coords || coords.length < 2) return null;
                const props = infra.properties || {};

                return (
                  <Marker 
                    key={`portal-infra-${infra.id}`} 
                    position={[coords[1], coords[0]]} 
                    icon={createPortalMarkerIcon(props.kategori || 'Infrastruktur', '#f59e0b')}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'inherit', minWidth: '220px', maxWidth: '280px', fontSize: '12px', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '13.5px', color: '#0f172a', lineHeight: 1.3 }}>{props.nama}</strong>
                          <span style={{ backgroundColor: '#fffbeb', color: '#b45309', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                            {props.kategori || 'Infrastruktur'}
                          </span>
                        </div>
                        {(props.jorong || props.lokasi) && (
                          <div style={{ fontSize: '11.5px', color: '#334155', margin: '4px 0' }}>
                            📍 {props.jorong || props.lokasi}
                          </div>
                        )}
                        {props.kondisi && (
                          <div style={{ fontSize: '11px', color: '#475569', margin: '4px 0' }}>
                            Kondisi: <strong>{props.kondisi}</strong>
                          </div>
                        )}
                        {props.deskripsi && (
                          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', margin: '4px 0' }}>
                            {props.deskripsi}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontSize: '10.5px' }}>
                          <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{coords[1].toFixed(5)}, {coords[0].toFixed(5)}</span>
                          <a
                            href={`https://www.google.com/maps?q=${coords[1]},${coords[0]}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                          >
                            Buka Maps ↗
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* LAYER 5: JORONGS (Pusat & Demografi Jorong) */}
              {layerVisibility.jorongs && jorongs.map((jorong: any) => {
                if (!jorong.koordinat_lat || !jorong.koordinat_lng) return null;
                const lat = parseFloat(jorong.koordinat_lat);
                const lng = parseFloat(jorong.koordinat_lng);
                const stats = jorong.total_warga !== undefined || jorong.total_kk !== undefined;

                return (
                  <Marker 
                    key={`portal-jorong-${jorong.id}`} 
                    position={[lat, lng]}
                    icon={createPortalMarkerIcon('kantor', '#3b82f6')}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'inherit', minWidth: '240px', maxWidth: '300px', fontSize: '12px', color: '#1e293b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '14px', color: '#1d4ed8' }}>
                            Jorong {jorong.nama}
                          </strong>
                          <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            Pusat Jorong
                          </span>
                        </div>
                        
                        {jorong.kepala_jorong && (
                          <div style={{ fontSize: '11.5px', color: '#334155', marginBottom: '6px' }}>
                            👤 Wali Jorong: <strong>{jorong.kepala_jorong}</strong>
                          </div>
                        )}

                        {stats && (
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 8px', marginBottom: '6px', fontSize: '11px', color: '#166534' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                              <span>👥 <strong>{(jorong.total_warga || 0).toLocaleString('id-ID')}</strong> Warga</span>
                              <span>🏠 <strong>{(jorong.total_kk || 0).toLocaleString('id-ID')}</strong> KK</span>
                            </div>
                          </div>
                        )}

                        {jorong.alamat_kantor && (
                          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>
                            🏢 Balai: {jorong.alamat_kantor}
                          </div>
                        )}

                        {jorong.telepon && (
                          <div style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>
                            📞 Kontak: <strong>{jorong.telepon}</strong>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontSize: '10.5px' }}>
                          <span>📍 {lat.toFixed(5)}, {lng.toFixed(5)}</span>
                          <a
                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}
                          >
                            Google Maps ↗
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* Custom style overrides for Leaflet Popups */}
        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-popup-content-wrapper {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 14px !important;
            box-shadow: 0 12px 35px rgba(0,0,0,0.18) !important;
            padding: 4px !important;
          }
          .leaflet-popup-tip {
            background-color: #ffffff !important;
            border-top: 1px solid #cbd5e1;
            border-left: 1px solid #cbd5e1;
          }
          .leaflet-container a.leaflet-popup-close-button {
            color: #94a3b8 !important;
            padding: 4px !important;
          }
          .leaflet-container a.leaflet-popup-close-button:hover {
            color: #0f172a !important;
          }
        `}} />
      </main>
    </div>
  );
}
