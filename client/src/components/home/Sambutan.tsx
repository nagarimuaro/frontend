import { useKataSambutan, useStaff } from "@/lib/api";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Sambutan() {
  const { data: sambutanResponse, isLoading } = useKataSambutan();
  const { data: staffResponse } = useStaff();
  const sambutan = sambutanResponse?.data;

  const staff = (staffResponse?.data || [])
    .filter((person) => !sambutan?.nama || person.name !== sambutan.nama)
    .sort((a, b) => Number(b.is_leadership) - Number(a.is_leadership) || a.sort_order - b.sort_order)
    .slice(0, 4);

  return (
    <section aria-label="Sambutan Wali Nagari dan Perangkat" className="py-16 md:py-24 px-4 md:px-6 bg-nagari-navy text-white">
      <div className="container mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 aria-hidden="true" className="w-8 h-8 text-nagari-yellow animate-spin" />
            <span className="sr-only">Memuat kata sambutan</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-10 md:gap-12">
            <div className="md:col-span-5">
              <div className="aspect-[3/4] max-h-[28rem] w-full rounded-2xl overflow-hidden border border-white/15 relative bg-white/5">
                {sambutan?.foto ? (
                  <img
                    src={sambutan.foto}
                    alt={`Foto ${sambutan?.nama || "Wali Nagari"}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center px-4 text-center text-sm font-medium text-white/70">
                    Foto belum tersedia
                  </div>
                )}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-nagari-navy via-nagari-navy/60 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="font-serif font-bold text-2xl text-white mb-1.5 [overflow-wrap:anywhere]">
                    {sambutan?.nama || "—"}
                  </p>
                  <p className="text-sm font-medium text-nagari-yellow">
                    {sambutan?.jabatan || "Wali Nagari"}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="inline-flex items-center gap-2.5 text-nagari-yellow font-medium text-[13px] mb-3">
                <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-yellow" />
                Sambutan Wali Nagari
              </p>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
                Pemerintahan Nagari untuk Masyarakat
              </h2>

              {sambutan?.kata_sambutan ? (
                <blockquote className="border-l-2 border-nagari-yellow pl-5 mb-8">
                  <p className="text-white/90 leading-relaxed text-base whitespace-pre-line">
                    {sambutan.kata_sambutan}
                  </p>
                </blockquote>
              ) : (
                <p className="mb-8 text-sm text-white/70">
                  Kata sambutan belum tersedia.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/profil" className="sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-lg h-11 px-6 text-sm font-medium bg-nagari-red text-white hover:bg-nagari-red-ink transition-colors group">
                    Lihat Profil Nagari
                    <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/kontak" className="sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/25 rounded-lg h-11 px-6 text-sm font-medium text-white transition-colors"
                  >
                    Hubungi Kantor Nagari
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {staff.length > 0 && (
          <div className="mt-14 pt-12 border-t border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="inline-flex items-center gap-2.5 text-nagari-yellow font-medium text-[13px] mb-2">
                  <span aria-hidden="true" className="h-0.5 w-6 bg-nagari-yellow" />
                  Struktur Pemerintahan
                </p>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                  Perangkat Nagari
                </h3>
              </div>
              <Link
                href="/profil"
                className="text-sm font-medium text-nagari-yellow underline underline-offset-4 hover:text-white transition-colors"
              >
                Lihat struktur lengkap
              </Link>
            </div>

            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {staff.map((person) => (
                <li key={person.id}>
                  <div className="h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <div className="aspect-square relative overflow-hidden bg-white/5">
                      {person.photo ? (
                        <img
                          src={person.photo}
                          alt={`Foto ${person.name}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center px-3 text-center text-[13px] font-medium text-white/65">
                          Foto belum tersedia
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="font-serif font-semibold text-white text-base leading-snug [overflow-wrap:anywhere]">
                        {person.name}
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-nagari-yellow [overflow-wrap:anywhere]">
                        {person.position}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
