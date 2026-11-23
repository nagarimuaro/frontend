import { useEffect } from "react";
import { ArrowRight, Loader2, Maximize2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useWebGIS } from "@/lib/api";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
    <section aria-label="Peta Wilayah Nagari" className="py-16 md:py-24 px-4 md:px-6 bg-muted/40">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2.5 text-nagari-red-ink font-medium text-[13px] mb-3">
              <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-red" />
              Sistem Informasi Geografis
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Peta Wilayah Nagari
            </h2>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Batas wilayah dan sebaran infrastruktur nagari di atas peta yang dapat digeser dan diperbesar.
            </p>
          </div>

          <div className="hidden md:block">
            <Link href="/gis">
              <Button className="rounded-lg px-5 h-11 text-sm font-medium bg-nagari-red text-white hover:bg-nagari-red-ink transition-colors group">
                Buka Peta Penuh
                <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-nagari-navy border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3.5 border-b border-white/10">
            <p className="flex items-center gap-2 text-[13px] font-medium text-white min-w-0">
              <Layers aria-hidden="true" className="w-4 h-4 flex-shrink-0 text-nagari-yellow" />
              <span className="truncate">Batas Wilayah Nagari</span>
            </p>
            <p className="flex items-center gap-2 text-[13px] font-medium text-nagari-yellow flex-shrink-0">
              <span aria-hidden="true" className="w-3 h-3 rounded-[3px] border-2 border-nagari-yellow bg-nagari-yellow/20" />
              {regions.length > 0 ? `${regions.length} wilayah` : "Belum ada data"}
            </p>
          </div>

          <div className="h-[320px] md:h-[440px] relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 aria-hidden="true" className="w-8 h-8 animate-spin text-nagari-yellow" />
                <span className="sr-only">Memuat peta</span>
              </div>
            ) : (
              <div className="w-full h-full dark:filter dark:saturate-150 dark:contrast-125 dark:sepia-[0.3] dark:hue-rotate-[190deg] dark:invert-[0.9] filter-none">
                <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false} dragging={true} zoomControl={false} className="w-full h-full z-0 bg-muted" style={{ minHeight: '100%' }}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.85} />
                  <MapBoundsUpdater regions={regions} />
                  {featureCollection && (
                    <GeoJSON
                      key={`p-${regions.length}`}
                      data={featureCollection}
                      style={{ className: "leaflet-region-nagari" }}
                    />
                  )}
                </MapContainer>
              </div>
            )}

            <Link
              href="/gis"
              className="absolute top-4 right-4 z-[400] inline-flex items-center gap-2 h-11 px-4 rounded-lg bg-nagari-red text-white shadow-sm transition-colors hover:bg-nagari-red-ink"
            >
              <Maximize2 aria-hidden="true" className="w-4 h-4" />
              <span className="text-sm font-medium">Peta Penuh</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/gis">
            <Button className="rounded-lg px-6 h-11 w-full text-sm font-medium bg-nagari-red text-white hover:bg-nagari-red-ink transition-colors">
              Buka Peta Penuh
              <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
