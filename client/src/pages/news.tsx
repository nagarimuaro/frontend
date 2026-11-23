import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  User,
  Tag,
  Search,
  Clock,
  ArrowUpRight,
  Loader2,
  Newspaper,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNews, useCategories } from "@/lib/api";
import { accentForName } from "@/lib/accents";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";
import newsHeaderImage from "@assets/generated_images/community_meeting_for_news_section.png";

const PAGE_SIZE = 8;

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function News() {
  const { data: newsData, isLoading: newsLoading } = useNews();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const news = newsData?.data || [];
  const categories = categoriesData?.data || [];

  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of news as any[]) {
      const rawTags = Array.isArray(item.tags) ? item.tags : [];
      for (const t of rawTags) {
        const label = (typeof t === "string" ? t : t?.name || "").trim();
        if (label && label !== "[]") {
          counts.set(label, (counts.get(label) || 0) + 1);
        }
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [news]);

  const filteredNews = useMemo(() => {
    return news.filter((item: any) => {
      const matchesSearch =
        searchQuery === "" ||
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content || "").toLowerCase().includes(searchQuery.toLowerCase());

      const categorySlug =
        typeof item.category === "object" ? item.category?.slug : item.category;
      const categoryId =
        typeof item.category === "object"
          ? item.category?.id?.toString()
          : null;
      const matchesCategory =
        selectedCategory === "all" ||
        categorySlug === selectedCategory ||
        categoryId === selectedCategory;

      const matchesTag =
        selectedTag === "" ||
        (item.tags || []).some((t: any) =>
          (typeof t === "string" ? t : t?.name || "")
            .toLowerCase()
            .includes(selectedTag.toLowerCase())
        );

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [news, searchQuery, selectedCategory, selectedTag]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (newsLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat berita...
          </span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Berita & Informasi"
        description="Kabar terkini seputar kegiatan pemerintahan, pembangunan, dan kemasyarakatan di nagari."
        image={newsHeaderImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
              <p className="text-muted-foreground text-sm md:text-base">
                Menampilkan{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {filteredNews.length}
                </span>{" "}
                dari {news.length} berita
                {searchQuery && (
                  <span className="ml-1.5">(pencarian: "{searchQuery}")</span>
                )}
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedTag("");
                  }}
                  className="rounded-lg h-10 px-4 border-border text-sm"
                >
                  <X aria-hidden="true" className="w-4 h-4 mr-1.5" />
                  Reset Filter
                </Button>
              )}
            </div>

            {filteredNews.length === 0 ? (
              <Card className="text-center py-16 px-6 bg-card rounded-2xl border border-border">
                <Newspaper
                  aria-hidden="true"
                  className="w-12 h-12 mx-auto text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground text-base mb-6">
                  {news.length === 0
                    ? "Belum ada berita tersedia."
                    : "Tidak ada berita yang cocok dengan filter yang dipilih."}
                </p>
                {(searchQuery || selectedCategory !== "all" || selectedTag) && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg h-11 px-5 border-border"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedTag("");
                    }}
                  >
                    Reset Filter
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid gap-6">
                {paginatedNews.map((newsItem) => {
                  const categoryLabel = newsItem.category
                    ? typeof newsItem.category === "object"
                      ? newsItem.category.name
                      : newsItem.category
                    : null;
                  const accent = accentForName(categoryLabel);
                  const imageSrc =
                    (newsItem as any).featured_image_url ||
                    newsItem.featured_image;
                  return (
                    <article
                      key={newsItem.id}
                      className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col md:flex-row group transition-transform duration-150 hover:-translate-y-0.5"
                    >
                      <Link
                        href={`/berita/${newsItem.slug}`}
                        className="md:w-5/12 h-56 md:h-auto relative overflow-hidden block bg-muted shrink-0"
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={newsItem.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper
                              aria-hidden="true"
                              className="w-12 h-12 text-muted-foreground/40"
                            />
                          </div>
                        )}
                        {categoryLabel && (
                          <span
                            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[13px] font-semibold bg-background/95 border border-border ${accent.ink}`}
                          >
                            {categoryLabel}
                          </span>
                        )}
                      </Link>

                      <div className="p-6 md:w-7/12 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar aria-hidden="true" size={14} />
                              {formatDate(
                                newsItem.published_at || newsItem.created_at || ""
                              )}
                            </span>
                            {newsItem.author && (
                              <span className="inline-flex items-center gap-1.5">
                                <User aria-hidden="true" size={14} />
                                {typeof newsItem.author === "object"
                                  ? (newsItem.author as any).name
                                  : newsItem.author}
                              </span>
                            )}
                          </div>

                          <Link href={`/berita/${newsItem.slug}`}>
                            <h2 className="text-xl font-serif font-bold text-foreground group-hover:text-nagari-red-ink transition-colors leading-snug">
                              {newsItem.title}
                            </h2>
                          </Link>

                          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                            {newsItem.excerpt ||
                              (newsItem.content
                                ? `${newsItem.content.substring(0, 150)}...`
                                : "")}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-center gap-3">
                          <Link
                            href={`/berita/${newsItem.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-nagari-red-ink hover:underline"
                          >
                            Baca Selengkapnya
                            <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                          </Link>
                          <span className="text-[13px] text-muted-foreground inline-flex items-center gap-1.5">
                            <Clock aria-hidden="true" size={14} />
                            {newsItem.read_time || "3 menit"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Real Client Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Navigasi halaman berita"
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="rounded-lg h-11 px-4 border-border text-sm"
                >
                  Berikutnya
                </Button>
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Search */}
            <Card className="bg-card p-6 rounded-2xl border border-border space-y-3">
              <label
                htmlFor="news-search"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Search aria-hidden="true" size={16} className="text-nagari-red-ink" />
                Pencarian Berita
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
                />
                <Input
                  id="news-search"
                  placeholder="Ketik kata kunci..."
                  className="pl-10 h-11 rounded-lg bg-background border-border text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Card>

            {/* Categories */}
            <Card className="bg-card p-6 rounded-2xl border border-border space-y-4">
              <h2 className="text-sm font-semibold text-foreground">
                Kategori Topik
              </h2>
              <div className="space-y-1.5">
                <button
                  type="button"
                  aria-pressed={selectedCategory === "all"}
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full flex justify-between items-center px-3.5 h-11 rounded-lg text-sm font-medium transition-colors border ${
                    selectedCategory === "all"
                      ? "bg-nagari-red text-white border-nagari-red"
                      : "bg-background text-foreground border-transparent hover:bg-muted"
                  }`}
                >
                  <span>Semua Kategori</span>
                  <span className="tabular-nums text-[13px] opacity-85">
                    {news.length}
                  </span>
                </button>

                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin text-nagari-red" />
                  </div>
                ) : (
                  categories.map((cat) => {
                    const key = cat.slug || cat.id.toString();
                    const active = selectedCategory === key;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedCategory(key)}
                        className={`w-full flex justify-between items-center px-3.5 h-11 rounded-lg text-sm font-medium transition-colors border ${
                          active
                            ? "bg-nagari-red text-white border-nagari-red"
                            : "bg-background text-foreground border-transparent hover:bg-muted"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="tabular-nums text-[13px] opacity-85 shrink-0">
                          {(cat as any).news_count ?? 0}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Tags (hanya muncul bila berita memang punya tag) */}
            {availableTags.length > 0 && (
              <Card className="bg-card p-6 rounded-2xl border border-border space-y-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Tag aria-hidden="true" size={16} className="text-nagari-red-ink" />
                  Tagar Populer
                </h2>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const active = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedTag(active ? "" : tag)}
                        className={`px-3 h-9 rounded-lg text-[13px] font-medium border transition-colors ${
                          active
                            ? "bg-nagari-red text-white border-nagari-red"
                            : "bg-background text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
