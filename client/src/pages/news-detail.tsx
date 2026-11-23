import { useState } from "react";
import {
  Calendar, User, Tag, ChevronLeft, Clock, Share2, Facebook, Loader2, Newspaper, Eye, ArrowLeft, MessageCircle, Copy, Check, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNewsDetail, useNews } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";
import { Link, useParams } from "wouter";

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateString;
  }
};

// The CMS `content` field is plain text with \n\n paragraph separators, not
// HTML. Injecting it raw collapses the newlines into one wall of text, so we
// wrap each run of lines in a <p> (escaping first). If the CMS ever returns
// real HTML, pass it through untouched.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function contentToHtml(content: string): string {
  if (!content) return "";
  // Already markup? Trust it.
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  const paragraphs = escapeHtml(content)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

// The CMS returns `tags` inconsistently — and often as stringified empty-array
// shells ("[]", "[\"[]\"]", or nested). Coerce to a clean string[] and drop the
// shells so a "#[]" badge can never render.
function cleanTagValue(v: unknown): string[] {
  if (typeof v !== "string") return [];
  const s = v.trim();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return cleanTagList(parsed);
    if (parsed && typeof parsed === "object") return [];
    return [s];
  } catch {
    return [s];
  }
}

function cleanTagList(arr: unknown[]): string[] {
  const out: string[] = [];
  for (const item of arr) out.push(...cleanTagValue(item));
  return out;
}

function normalizeTags(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return cleanTagList(tags);
  return cleanTagValue(tags);
}

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || '';
  const [copied, setCopied] = useState(false);

  const { data: newsData, isLoading, error } = useNewsDetail(slug);
  const { data: relatedNewsData } = useNews();

  const news = newsData?.data;
  const featuredImage = (news as any)?.featured_image_url || news?.featured_image;
  const relatedNews = (relatedNewsData?.data || []).filter(item => item.slug !== slug).slice(0, 4);
  const authorName = news && (typeof news.author === 'object' ? news.author.name : news.author);
  const categoryName = news && (typeof news.category === 'object' ? news.category.name : news.category);
  const tags = normalizeTags(news?.tags);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable */
    }
  };

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">Memuat rincian berita...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  if (error || !news) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6">
            <Newspaper aria-hidden="true" className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-3">Berita Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Berita yang Anda cari tidak tersedia, sudah dihapus, atau tautan tidak valid.</p>
          <Link href="/berita">
            <Button className="rounded-lg bg-nagari-red text-white hover:bg-nagari-red-ink h-11 px-6 text-sm font-medium">
              <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" /> Kembali ke Indeks Berita
            </Button>
          </Link>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />

      <header className="relative overflow-hidden bg-nagari-navy border-b border-white/10">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-nagari-navy via-nagari-navy to-nagari-red/40" />
        <div className="container relative z-10 mx-auto px-4 md:px-6 py-12 md:py-16 max-w-5xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-white/75 font-medium mb-6">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
            {categoryName && (
              <>
                <ChevronRight size={14} aria-hidden="true" />
                <span className="text-nagari-yellow">{categoryName}</span>
              </>
            )}
          </nav>

          {categoryName && (
            <div className="inline-flex items-center gap-3 mb-4">
              <span aria-hidden="true" className="h-0.5 w-8 bg-nagari-yellow rounded-full" />
              <span className="text-nagari-yellow font-semibold text-sm">{categoryName}</span>
            </div>
          )}

          <h1 className="font-news text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-[1.15] tracking-tight text-balance max-w-3xl">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-white/80">
            {authorName && (
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-nagari-yellow">
                  <User size={15} aria-hidden="true" />
                </span>
                <span className="font-medium text-white">{authorName}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={15} aria-hidden="true" /> {formatDate(news.published_at || news.created_at || '')}
            </span>
            {news.read_time && (
              <span className="flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> {news.read_time}</span>
            )}
            <span className="flex items-center gap-1.5 tabular-nums"><Eye size={15} aria-hidden="true" /> {news.views_count || 0} kali dibaca</span>
          </div>
        </div>
      </header>

      {/* Article */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14">
          <article className="flex-1 min-w-0 max-w-[720px]">
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-nagari-red-ink hover:underline mb-8"
            >
              <ChevronLeft aria-hidden="true" className="w-4 h-4" /> Kembali ke Berita
            </Link>

            {featuredImage && (
              <figure className="mb-10">
                <img
                  src={featuredImage}
                  alt={news.title}
                  className="w-full rounded-2xl border border-border object-cover"
                />
              </figure>
            )}

            {news.excerpt && (
              <p className="font-news text-xl md:text-2xl text-foreground leading-relaxed mb-10 border-l-4 border-nagari-red pl-6 italic">
                {news.excerpt}
              </p>
            )}

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: contentToHtml(news.content || '') }}
            />

            {tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Tag size={17} className="text-nagari-red-ink" aria-hidden="true" />
                  {tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1.5 border-border bg-muted/50 text-foreground rounded-lg text-[13px] font-medium"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-foreground font-serif font-semibold text-lg flex items-center gap-2.5">
                  <Share2 size={18} className="text-nagari-red-ink" aria-hidden="true" />
                  Bagikan Berita
                </span>
                <div className="flex gap-2.5 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg h-11 px-4 border-border text-foreground hover:bg-muted text-sm"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener,noreferrer')}
                  >
                    <Facebook size={15} className="mr-2" aria-hidden="true" /> Facebook
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg h-11 px-4 border-border text-foreground hover:bg-muted text-sm"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`, '_blank', 'noopener,noreferrer')}
                  >
                    <MessageCircle size={15} className="mr-2" aria-hidden="true" /> WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg h-11 px-4 border-border text-foreground hover:bg-muted text-sm"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <>
                        <Check size={15} className="mr-2 text-emerald-600" aria-hidden="true" /> Tautan Disalin
                      </>
                    ) : (
                      <>
                        <Copy size={15} className="mr-2" aria-hidden="true" /> Salin Tautan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 xl:w-96 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h2 className="font-serif font-bold text-lg text-foreground flex items-center gap-3 mb-5">
                  <span className="w-6 h-0.5 bg-nagari-red rounded-full" aria-hidden="true" />
                  Baca Juga
                </h2>
                {relatedNews.length > 0 ? (
                  <div className="space-y-3">
                    {relatedNews.map((item) => (
                      <Link key={item.id} href={`/berita/${item.slug}`}>
                        <div className="group cursor-pointer block p-2.5 -mx-2.5 rounded-xl hover:bg-muted transition-colors">
                          <div className="flex gap-3.5">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted border border-border">
                              {((item as any).featured_image_url || item.featured_image) ? (
                                <img
                                  src={(item as any).featured_image_url || item.featured_image}
                                  alt={item.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Newspaper className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-nagari-red-ink transition-colors line-clamp-2 text-sm leading-snug mb-1.5">
                                {item.title}
                              </h3>
                              <span className="text-[13px] text-muted-foreground flex items-center gap-1.5">
                                <Calendar size={13} aria-hidden="true" /> {formatDate(item.published_at || item.created_at || '')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Tidak ada saran berita lain.</p>
                )}

                <Link href="/berita">
                  <Button
                    variant="outline"
                    className="w-full mt-5 rounded-lg h-11 border-border text-foreground hover:bg-muted text-sm font-medium"
                  >
                    Lihat Indeks Berita
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </PageBackground>
  );
}
