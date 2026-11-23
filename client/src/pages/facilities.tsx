import { useState, useMemo } from "react";
import {
  Building2, MapPin, Search, Loader2, X, Clock, ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFacilities, useFacilitiesCategories } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import facilityImage from "@assets/generated_images/nagari_office_building_exterior.png";

const tabTriggerClass =
  "rounded-lg px-4 h-10 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-nagari-red data-[state=active]:text-white transition-colors";

export default function Facilities() {
  const { data: facilitiesData, isLoading: facilitiesLoading } = useFacilities();
  const { data: categoriesData, isLoading: categoriesLoading } = useFacilitiesCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const facilities = facilitiesData?.data?.data || [];
  const categories = categoriesData?.data || [];

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
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">Memuat direktori fasilitas...</span>
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
        description="Sarana publik, institusi pendidikan, layanan kesehatan, rumah ibadah, dan destinasi wisata nagari."
        image={facilityImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-end mb-10 gap-6">
          <div className="w-full lg:w-auto">
            <p className="text-[13px] font-semibold text-foreground mb-2.5">Kategori Direktori</p>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="bg-card border border-border p-1.5 h-auto flex-wrap justify-start gap-1.5 rounded-xl">
                <TabsTrigger value="all" className={tabTriggerClass}>Semua</TabsTrigger>
                {categoriesLoading ? (
                  <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin text-nagari-red mx-3" />
                ) : Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat: any, idx: number) => (
                    <TabsTrigger
                      key={cat?.id || idx}
                      value={cat?.slug || cat?.id?.toString() || (typeof cat === "string" ? cat : idx.toString())}
                      className={tabTriggerClass}
                    >
                      {typeof cat === "string" ? cat : cat?.name || cat?.nama || "Kategori"}
                    </TabsTrigger>
                  ))
                ) : (
                  <>
                    <TabsTrigger value="pendidikan" className={tabTriggerClass}>Pendidikan</TabsTrigger>
                    <TabsTrigger value="kesehatan" className={tabTriggerClass}>Kesehatan</TabsTrigger>
                    <TabsTrigger value="ibadah" className={tabTriggerClass}>Ibadah</TabsTrigger>
                    <TabsTrigger value="wisata" className={tabTriggerClass}>Wisata</TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
          </div>

          <div className="w-full lg:w-96">
            <label htmlFor="facility-search" className="text-[13px] font-semibold text-foreground mb-2.5 block">
              Cari Fasilitas
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="facility-search"
                placeholder="Nama fasilitas atau lokasi..."
                className="pl-10 h-12 rounded-xl bg-card border-border text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Result Counter */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <p className="text-muted-foreground text-sm">
            Menampilkan <span className="font-semibold text-foreground">{filteredFacilities.length}</span> dari {facilities.length} fasilitas
            {searchQuery && <span className="ml-1.5">(kata kunci: “{searchQuery}”)</span>}
          </p>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="text-nagari-red-ink hover:bg-nagari-red/10 rounded-lg h-10 px-3 text-sm"
            >
              <X aria-hidden="true" className="w-4 h-4 mr-1" /> Reset Filter
            </Button>
          )}
        </div>

        {filteredFacilities.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Building2 aria-hidden="true" className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-base">
              {facilities.length === 0
                ? "Data direktori fasilitas belum tersedia."
                : "Tidak ada lokasi yang cocok dengan filter pencarian."}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="outline"
                className="mt-5 rounded-lg h-11 px-5 text-sm font-medium"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility: any) => (
              <Card key={facility.id} className="overflow-hidden h-full flex flex-col bg-card border border-border rounded-2xl">
                <div className="aspect-[16/10] relative overflow-hidden bg-nagari-navy flex items-center justify-center">
                  <Building2 aria-hidden="true" className="w-12 h-12 text-white/30" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background text-foreground border border-border px-2.5 py-1 text-[13px] font-medium">
                      {facility.jenis || facility.category?.name || facility.category || "Fasilitas"}
                    </Badge>
                  </div>
                  {facility.kondisi && (
                    <div className="absolute top-3 right-3">
                      <Badge className={`px-2.5 py-1 text-[13px] font-medium border ${
                        facility.kondisi === "Baik"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
                          : facility.kondisi === "Rusak Ringan"
                          ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800"
                          : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800"
                      }`}>
                        {facility.kondisi}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="font-serif font-bold text-xl mb-2 text-foreground leading-snug">
                    {facility.nama || facility.name || "Fasilitas"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                    {facility.deskripsi || facility.description || "Tidak ada deskripsi rinci untuk fasilitas ini."}
                  </p>

                  <div className="space-y-2.5 mt-auto">
                    {(facility.lokasi || facility.address) && (
                      <div className="flex items-start gap-2.5 text-foreground/90 text-sm bg-muted/60 border border-border p-3 rounded-xl">
                        <MapPin aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-nagari-red-ink" />
                        <span className="leading-relaxed">{facility.lokasi || facility.address}</span>
                      </div>
                    )}
                    {facility.operating_hours && (
                      <div className="flex items-center gap-2.5 text-foreground/90 text-sm bg-muted/60 border border-border p-3 rounded-xl">
                        <Clock aria-hidden="true" size={16} className="shrink-0 text-nagari-red-ink" />
                        <span>Operasional: <strong className="font-semibold">{facility.operating_hours}</strong></span>
                      </div>
                    )}
                    {facility.maps_url && (
                      <Button asChild variant="outline" className="w-full rounded-lg h-11 text-sm font-medium mt-2">
                        <a href={facility.maps_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink aria-hidden="true" className="mr-2 w-4 h-4" /> Buka Lokasi di Peta
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </PageBackground>
  );
}
