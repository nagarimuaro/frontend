import { useNews } from "@/lib/api";
import { accentByIndex, accentForName } from "@/lib/accents";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function News() {
  const { data: newsResponse, isLoading } = useNews();
  const newsItems = newsResponse?.data || [];

  const featured = newsItems.find(n => n.is_featured) || newsItems[0];
  const others = newsItems.filter(n => n.id !== featured?.id).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto flex justify-center">
          <Loader2 aria-hidden="true" className="w-8 h-8 text-nagari-red animate-spin" />
        </div>
      </section>
    );
  }

  if (!featured) return null;

  const featuredAccent = featured.category?.name
    ? accentForName(featured.category.name)
    : accentByIndex(0);
  const featuredImage = (featured as any).featured_image_url || featured.featured_image;

  return (
    <section aria-label="Berita dan Publikasi Terkini" className="py-16 md:py-24 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2.5 text-nagari-red-ink font-medium text-[13px] mb-3">
              <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-red" />
              Kabar Nagari
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Berita &amp; Publikasi Terkini
            </h2>
          </div>

          <div className="hidden md:block">
            <Link href="/berita">
              <Button variant="outline" className="rounded-lg px-5 h-11 text-sm font-medium bg-card hover:bg-nagari-red text-foreground hover:text-white hover:border-nagari-red border-border transition-colors group">
                Lihat Semua Berita
                <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured */}
          <div className="lg:col-span-7">
            <Link
              href={`/berita/${featured.slug}`}
              className={`group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${featuredAccent.ring}`}
            >
              <div aria-hidden="true" className={`h-1 w-full ${featuredAccent.edge}`} />

              <div className="p-4 md:p-6 flex flex-col flex-1">
                <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-5 border border-border bg-muted">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
                      Gambar belum tersedia
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={`bg-background/95 border border-border px-3 py-1 font-medium text-[13px] ${featuredAccent.ink}`}>
                      {featured.category?.name || "Sorotan"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground mb-3">
                    <Calendar aria-hidden="true" size={14} className={featuredAccent.ink} />
                    <span>{formatDate(featured.published_at)}</span>
                  </div>

                  <h3 className={`text-xl md:text-2xl font-serif font-bold text-foreground transition-colors leading-snug mb-3 ${featuredAccent.inkHover}`}>
                    {featured.title}
                  </h3>

                  <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 text-base leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex items-center gap-2 text-nagari-red-ink font-medium text-sm">
                    Baca berita
                    <ArrowRight aria-hidden="true" size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Others List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {others.map((item, idx) => {
              const accent = item.category?.name
                ? accentForName(item.category.name)
                : accentByIndex(idx + 1);
              const image = (item as any).featured_image_url || item.featured_image;

              return (
                <div key={item.id} className="flex-1">
                  <Link
                    href={`/berita/${item.slug}`}
                    className={`group relative flex flex-row items-center gap-4 h-full p-4 rounded-2xl bg-card border border-border overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute left-0 top-4 bottom-4 w-1 rounded-r ${accent.edge}`}
                    />

                    <div className="w-24 h-24 md:w-28 md:h-28 aspect-square flex-shrink-0 rounded-xl overflow-hidden border border-border bg-muted ml-1">
                      {image ? (
                        <img
                          src={image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center px-2 text-center text-[13px] font-medium text-muted-foreground">
                          Tanpa foto
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col py-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground mb-1.5">
                        <Calendar aria-hidden="true" size={13} className={accent.ink} />
                        <span>{formatDate(item.published_at)}</span>
                      </div>
                      <h4 className={`text-base font-serif font-semibold text-foreground transition-colors line-clamp-3 leading-snug ${accent.inkHover}`}>
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden">
          <Link href="/berita">
            <Button variant="outline" className="rounded-lg px-6 h-11 w-full text-sm font-medium bg-card hover:bg-nagari-red text-foreground hover:text-white hover:border-nagari-red border-border transition-colors">
              Lihat Semua Berita
              <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
