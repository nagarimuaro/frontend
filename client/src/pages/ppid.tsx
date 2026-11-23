import { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Download,
  Search,
  File,
  Filter,
  Eye,
  FolderOpen,
  Calendar,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocuments, useCategories, CMS_API } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import documentImage from "@assets/generated_images/document_archive_shelves.png";

const PAGE_SIZE = 10;

export default function PPID() {
  const { data: documentsData, isLoading: documentsLoading } = useDocuments();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const documents = documentsData?.data || [];
  const categories = categoriesData?.data || [];

  const availableYears = useMemo(() => {
    const years = documents
      .map((doc: any) => doc.year)
      .filter((year: any) => Boolean(year))
      .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
      .sort((a: number, b: number) => b - a);
    return years;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc: any) => {
      const matchesSearch =
        searchQuery === "" ||
        (doc.title || doc.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const docCategory =
        typeof doc.category === "object" ? doc.category?.slug : doc.category;
      const docCategoryId =
        typeof doc.category === "object" ? doc.category?.id?.toString() : null;
      const matchesCategory =
        selectedCategory === "all" ||
        docCategory === selectedCategory ||
        docCategoryId === selectedCategory ||
        doc.category_id?.toString() === selectedCategory;

      const matchesYear =
        selectedYear === "all" || doc.year?.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [documents, searchQuery, selectedCategory, selectedYear]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "all" || selectedYear !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="PPID & Dokumen Publik"
        description="Pusat Pengelola Informasi dan Dokumentasi. Akses regulasi, laporan, dan arsip publik nagari secara terbuka."
        image={documentImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[320px] space-y-6 flex-shrink-0">
            <Card className="bg-card border border-border rounded-2xl overflow-hidden lg:sticky lg:top-24">
              <div className="px-6 py-4 border-b border-border bg-muted/50">
                <CardTitle className="text-lg font-serif font-bold text-foreground flex items-center gap-2.5">
                  <Filter aria-hidden="true" size={18} className="text-nagari-red-ink" />
                  Saring Dokumen
                </CardTitle>
              </div>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <label
                    htmlFor="ppid-search"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Pencarian Dokumen
                  </label>
                  <div className="relative">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="ppid-search"
                      placeholder="Cari judul regulasi..."
                      className="pl-10 pr-10 h-11 rounded-lg bg-background border-border text-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        aria-label="Hapus kata kunci pencarian"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1.5 w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <X aria-hidden="true" size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ppid-category"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Jenis Arsip
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger
                      id="ppid-category"
                      className="h-11 rounded-lg bg-background border-border text-foreground"
                    >
                      <SelectValue
                        placeholder={categoriesLoading ? "Memuat..." : "Semua Kategori"}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.slug || cat.id.toString()}
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ppid-year"
                    className="text-[13px] font-semibold text-foreground block"
                  >
                    Tahun Terbit
                  </label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger
                      id="ppid-year"
                      className="h-11 rounded-lg bg-background border-border text-foreground"
                    >
                      <SelectValue placeholder="Semua Tahun" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground rounded-xl">
                      <SelectItem value="all">Semua Tahun</SelectItem>
                      {availableYears.map((year: number) => (
                        <SelectItem key={year} value={year.toString()}>
                          Tahun {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-lg border-border text-foreground hover:bg-muted text-sm font-medium"
                    onClick={resetFilters}
                  >
                    <X aria-hidden="true" size={15} className="mr-2" />
                    Hapus Filter
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-nagari-navy text-white border border-border rounded-2xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center mx-auto">
                  <FileText aria-hidden="true" size={22} className="text-nagari-yellow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white mb-1.5">
                    Butuh Dokumen Lain?
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Ajukan permohonan informasi publik secara resmi sesuai UU KIP melalui saluran pengaduan &amp; permohonan nagari.
                  </p>
                </div>
                <Link href="/pengaduan" className="block">
                  <Button className="w-full bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 text-sm font-medium">
                    Ajukan Permohonan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Document List */}
          <div className="w-full flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-border gap-3">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Pustaka Dokumen
              </h2>
              <Badge
                variant="secondary"
                className="px-3 py-1.5 text-[13px] font-semibold bg-muted text-foreground border border-border"
              >
                Total {filteredDocuments.length} Arsip
              </Badge>
            </div>

            {documentsLoading ? (
              <div className="flex items-center justify-center py-20 bg-card rounded-2xl border border-border gap-3">
                <Loader2 aria-hidden="true" className="w-6 h-6 animate-spin text-nagari-red" />
                <span className="text-sm font-medium text-muted-foreground">
                  Memuat arsip dokumen...
                </span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-16 px-6 bg-card rounded-2xl border border-border">
                <FileText
                  aria-hidden="true"
                  className="w-12 h-12 mx-auto text-muted-foreground mb-4"
                />
                {hasActiveFilters ? (
                  <>
                    <p className="text-muted-foreground text-base mb-6">
                      Tidak ada dokumen yang sesuai dengan filter yang dipilih.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetFilters}
                      className="rounded-lg h-11 px-5 border-border"
                    >
                      <X aria-hidden="true" size={15} className="mr-2" />
                      Reset Pencarian
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-base">
                    Belum ada dokumen publik yang diunggah.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedDocuments.map((doc: any) => (
                  <Card
                    key={doc.id}
                    className="bg-card border border-border rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-nagari-red/10 text-nagari-red-ink border border-nagari-red/20 flex items-center justify-center shrink-0">
                        <FileText aria-hidden="true" size={22} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Badge
                            variant="secondary"
                            className="bg-muted text-foreground border border-border text-[13px] font-medium px-2.5 py-0.5"
                          >
                            {typeof doc.category === "object"
                              ? doc.category?.name
                              : doc.category || "Dokumen"}
                          </Badge>
                          <span className="text-[13px] font-medium text-muted-foreground inline-flex items-center gap-1.5">
                            <Calendar aria-hidden="true" size={14} />
                            {doc.year || new Date().getFullYear()}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold font-serif text-foreground leading-snug">
                          {doc.title || doc.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <File aria-hidden="true" size={14} />
                            {doc.type || "PDF"}
                          </span>
                          {doc.size && (
                            <span className="inline-flex items-center gap-1.5">
                              <FolderOpen aria-hidden="true" size={14} />
                              {doc.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border shrink-0">
                        {doc.preview_url && (
                          <Button
                            variant="outline"
                            className="flex-1 md:flex-none rounded-lg h-11 px-4 border-border text-sm font-medium"
                            asChild
                          >
                            <a
                              href={doc.preview_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye aria-hidden="true" className="w-4 h-4 mr-2" />
                              Lihat
                            </a>
                          </Button>
                        )}
                        <Button
                          className="flex-1 md:flex-none bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-4 text-sm font-medium"
                          asChild
                        >
                          <a
                            href={CMS_API.DOCUMENT_DOWNLOAD(doc.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download aria-hidden="true" className="w-4 h-4 mr-2" />
                            Unduh
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Real Client Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Navigasi halaman dokumen"
                className="flex items-center justify-center gap-2 pt-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg h-11 px-4 border-border text-sm"
                >
                  Sebelumnya
                </Button>
                <span className="px-3 text-sm font-medium text-muted-foreground tabular-nums">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg h-11 px-4 border-border text-sm"
                >
                  Berikutnya
                </Button>
              </nav>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
