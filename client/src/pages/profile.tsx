import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  History,
  Target,
  Users,
  MapPin,
  Loader2,
  Phone,
  Mail,
  Clock,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNagariProfile, useStaff, useSiteSettings } from "@/lib/api";
import { getTenantName } from "@/lib/tenant-name";
import { accentByIndex } from "@/lib/accents";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import profileImage from "@assets/generated_images/portrait_of_nagari_head.png";

const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function Profil() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { data: profileData, isLoading: profileLoading } = useNagariProfile();
  const { data: staffData, isLoading: staffLoading } = useStaff();
  const { data: settingsData } = useSiteSettings();
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const profile = profileData?.data;
  const staff = staffData?.data || [];
  const tenantName = getTenantName(settingsData?.data, profile?.nama_nagari);

  const leaders = useMemo(
    () => staff.filter((person) => Boolean(person.is_leadership)),
    [staff]
  );

  const members = useMemo(
    () => staff.filter((person) => !person.is_leadership),
    [staff]
  );

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const m of members) {
      if (m.department && m.department.trim()) {
        set.add(m.department.trim());
      }
    }
    return Array.from(set);
  }, [members]);

  const filteredMembers = useMemo(() => {
    if (selectedDept === "all") return members;
    return members.filter((m) => (m.department || "").trim() === selectedDept);
  }, [members, selectedDept]);

  if (profileLoading || staffLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 gap-3 min-h-[60vh]">
          <Loader2 aria-hidden="true" className="w-7 h-7 text-nagari-red animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">
            Memuat profil nagari...
          </span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  const infoRows = [
    { label: "Nama Nagari", value: tenantName },
    { label: "Kecamatan", value: profile?.kecamatan },
    { label: "Kabupaten", value: profile?.kabupaten },
    { label: "Provinsi", value: profile?.provinsi || "Sumatera Barat" },
    { label: "Kode Pos", value: profile?.kode_pos },
    {
      label: "Luas Wilayah",
      value: profile?.luas_wilayah ? `${profile.luas_wilayah} km²` : null,
    },
    {
      label: "Ketinggian",
      value: profile?.ketinggian != null ? `${profile.ketinggian} mdpl` : null,
    },
  ].filter((row) => Boolean(row.value));

  const misiList =
    profile?.misi && profile.misi.length > 0
      ? profile.misi
      : [
          "Meningkatkan kualitas pelayanan publik",
          "Mengembangkan potensi ekonomi masyarakat",
          "Melestarikan adat dan budaya",
          "Meningkatkan infrastruktur dan fasilitas umum",
        ];

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Profil Nagari"
        description="Mengenal lebih dekat sejarah, identitas wilayah, visi misi, dan susunan perangkat pemerintahan nagari."
        image={profileImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16 md:space-y-20">
        {/* Sejarah & Identitas */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="inline-flex items-center gap-2 text-nagari-red-ink font-semibold text-[13px]">
              <History aria-hidden="true" size={15} />
              Sejarah &amp; Jati Diri
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Akar Sejarah &amp; Kearifan Lokal
            </h2>

            <div className="space-y-5 text-muted-foreground text-base leading-relaxed">
              <p className="whitespace-pre-line">
                {profile?.sejarah ||
                  `${tenantName} terletak di Kecamatan ${profile?.kecamatan || "—"}, Kabupaten ${profile?.kabupaten || "—"}, ${profile?.provinsi || "Sumatera Barat"}. Pemerintahan nagari hadir melayani masyarakat secara terbuka dan berlandaskan kearifan lokal Minangkabau.`}
              </p>

              <blockquote className="p-5 md:p-6 rounded-2xl bg-muted/60 border border-border border-l-4 border-l-nagari-red">
                <p className="font-serif italic text-foreground text-lg md:text-xl leading-relaxed">
                  “Adat Basandi Syarak, Syarak Basandi Kitabullah”
                </p>
              </blockquote>

              {profile?.potensi_unggulan && profile.potensi_unggulan.length > 0 && (
                <div className="pt-2 space-y-3">
                  <p className="text-[13px] font-semibold text-foreground">
                    Potensi Unggulan Nagari
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {profile.potensi_unggulan.map((potensi, i) => {
                      const accent = accentByIndex(i);
                      return (
                        <span
                          key={potensi}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium"
                        >
                          <span
                            aria-hidden="true"
                            className={`w-2 h-2 rounded-full ${accent.edge}`}
                          />
                          {potensi}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <Card className="bg-card border border-border rounded-2xl overflow-hidden">
              <div aria-hidden="true" className="h-1 w-full bg-nagari-red" />
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2.5 pb-3 border-b border-border">
                  <MapPin aria-hidden="true" size={18} className="text-nagari-red-ink" />
                  Identitas Administratif
                </h3>
                <dl className="divide-y divide-border">
                  {infoRows.map((row) => (
                    <div
                      key={row.label}
                      className="py-3 flex justify-between gap-4 text-sm"
                    >
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="font-semibold text-foreground text-right tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {(profile?.alamat_kantor || profile?.telepon || profile?.email) && (
              <Card className="bg-card border border-border rounded-2xl">
                <CardContent className="p-6 space-y-3.5 text-sm">
                  <h3 className="font-serif font-bold text-base text-foreground pb-2.5 border-b border-border flex items-center gap-2">
                    <Clock aria-hidden="true" size={16} className="text-nagari-red-ink" />
                    Kantor Wali Nagari
                  </h3>
                  {profile?.alamat_kantor && (
                    <p className="text-muted-foreground leading-relaxed">
                      {profile.alamat_kantor}
                    </p>
                  )}
                  <div className="space-y-2 pt-1">
                    {profile?.telepon && (
                      <a
                        href={`tel:${profile.telepon}`}
                        className="flex items-center gap-2.5 text-foreground hover:text-nagari-red-ink transition-colors"
                      >
                        <Phone aria-hidden="true" size={15} className="text-muted-foreground shrink-0" />
                        <span className="font-medium tabular-nums">{profile.telepon}</span>
                      </a>
                    )}
                    {profile?.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-2.5 text-foreground hover:text-nagari-red-ink transition-colors break-all"
                      >
                        <Mail aria-hidden="true" size={15} className="text-muted-foreground shrink-0" />
                        <span className="font-medium">{profile.email}</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="rounded-2xl bg-nagari-navy border border-white/10 text-white p-6 md:p-10 lg:p-14">
          <div className="max-w-3xl mb-10">
            <p className="inline-flex items-center gap-2 text-nagari-yellow font-semibold text-[13px] mb-3">
              <Target aria-hidden="true" size={15} />
              Visi &amp; Misi Pembangunan
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-snug tracking-tight">
              “
              {profile?.visi ||
                "Terwujudnya Nagari yang Maju, Mandiri, dan Berbudaya Berlandaskan Iman dan Taqwa"}
              ”
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {misiList.map((item, index) => (
              <div
                key={index}
                className="border border-white/15 bg-white/5 rounded-xl p-5 md:p-6 flex items-start gap-4"
              >
                <span className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 text-nagari-yellow flex items-center justify-center font-serif font-bold text-sm shrink-0 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-white/90 leading-relaxed text-base">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Struktur Pemerintahan */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-border">
            <div>
              <p className="inline-flex items-center gap-2 text-nagari-red-ink font-semibold text-[13px] mb-2">
                <Users aria-hidden="true" size={15} />
                Perangkat Nagari
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
                Struktur Pemerintahan
              </h2>
            </div>
            {staff.length > 0 && (
              <span className="text-[13px] font-semibold px-3.5 py-1.5 rounded-lg bg-muted text-foreground border border-border self-start md:self-auto tabular-nums">
                {staff.length} Perangkat Aktif
              </span>
            )}
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Users
                aria-hidden="true"
                className="w-12 h-12 mx-auto text-muted-foreground mb-3"
              />
              <p className="text-muted-foreground text-base">
                Belum ada data perangkat nagari yang dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured Pimpinan Nagari */}
              {leaders.length > 0 && (
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
                    <Award aria-hidden="true" size={15} className="text-nagari-red-ink" />
                    Pimpinan Pemerintahan Nagari
                  </p>
                  <div
                    className={`grid gap-6 ${
                      leaders.length === 1 ? "grid-cols-1 max-w-3xl" : "grid-cols-1 lg:grid-cols-2"
                    }`}
                  >
                    {leaders.map((leader) => (
                      <Card
                        key={leader.id}
                        className="bg-card border border-border rounded-2xl overflow-hidden group"
                      >
                        <div aria-hidden="true" className="h-1 w-full bg-nagari-red" />
                        <div className="grid sm:grid-cols-12">
                          <div className="sm:col-span-5 aspect-[4/5] sm:aspect-auto sm:min-h-[260px] relative overflow-hidden bg-muted">
                            {leader.photo ? (
                              <img
                                src={leader.photo}
                                alt={`Foto ${leader.name}`}
                                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users
                                  aria-hidden="true"
                                  className="w-14 h-14 text-muted-foreground/35"
                                />
                              </div>
                            )}
                          </div>
                          <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-4">
                            <div>
                              <span className="inline-block text-[13px] font-semibold px-2.5 py-0.5 rounded-md bg-nagari-red/10 text-nagari-red-ink mb-2.5">
                                {leader.position || leader.department || "Pimpinan Nagari"}
                              </span>
                              <h3 className="font-serif font-bold text-2xl text-foreground leading-snug">
                                {leader.name}
                              </h3>
                              {leader.description && (
                                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                                  {leader.description}
                                </p>
                              )}
                            </div>

                            {leader.department && leader.department !== leader.position && (
                              <p className="text-[13px] text-muted-foreground pt-3 border-t border-border">
                                Bidang: <strong className="text-foreground">{leader.department}</strong>
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Perangkat & Staf Grid */}
              {members.length > 0 && (
                <div className="space-y-6">
                  {departments.length > 1 && (
                    <div
                      role="tablist"
                      aria-label="Saring perangkat berdasarkan bidang"
                      className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-card border border-border"
                    >
                      {["all", ...departments].map((dept) => {
                        const active = selectedDept === dept;
                        return (
                          <button
                            key={dept}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setSelectedDept(dept)}
                            className={`relative px-3.5 h-10 rounded-lg text-[13px] font-medium transition-colors ${
                              active
                                ? "text-white"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="profile-dept-pill"
                                transition={
                                  prefersReducedMotion
                                    ? { duration: 0 }
                                    : { duration: 0.24, ease: EASE_UI }
                                }
                                className="absolute inset-0 rounded-lg bg-nagari-red"
                                aria-hidden="true"
                              />
                            )}
                            <span className="relative z-10">
                              {dept === "all" ? "Semua Bidang" : dept}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredMembers.map((person) => (
                      <div
                        key={person.id}
                        className="group rounded-2xl overflow-hidden border border-border bg-card flex flex-col"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                          {person.photo ? (
                            <img
                              src={person.photo}
                              alt={`Foto ${person.name}`}
                              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users
                                aria-hidden="true"
                                className="w-12 h-12 text-muted-foreground/35"
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-2">
                          <div>
                            {person.department && (
                              <p className="text-[13px] font-medium text-nagari-red-ink mb-1">
                                {person.department}
                              </p>
                            )}
                            <h3 className="font-serif font-bold text-lg text-foreground leading-snug">
                              {person.name}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {person.position}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </PageBackground>
  );
}
