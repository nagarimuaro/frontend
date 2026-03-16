import { motion } from "framer-motion";
import {
  History, Target, Users
} from "lucide-react";
import {
  Card, CardContent
} from "@/components/ui/card";
import { useNagariProfile, useStaff } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import profileImage from "@assets/generated_images/portrait_of_nagari_head.png";

export default function Profil() {
  const { data: profileData, isLoading: profileLoading } = useNagariProfile();
  const { data: staffData, isLoading: staffLoading } = useStaff();

  const profile = profileData?.data;
  const staff = staffData?.data || [];

  if (profileLoading || staffLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat profil...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Profil Nagari"
        description="Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Nagari."
        image={profileImage}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-32">
        {/* Sejarah - Animated Scroll Reveal */}
        <section className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-1.5 rounded-full border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.15)]">
              <History size={14} />
              <span>Sejarah Nagari</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 dark:text-white leading-[1.15] tracking-tight">
              Akar Sejarah & <br /><span className="text-teal-600 dark:text-[#3fd5ba] drop-shadow-[0_0_20px_rgba(63,213,186,0.4)]">Kearifan Lokal</span>
            </h2>
            <div className="space-y-6 text-slate-600 dark:text-white/70 text-base md:text-lg leading-relaxed font-light">
              <p>
                {profile?.sejarah || `Nagari ${profile?.nama_nagari || '...'} terbentuk sebagai hasil pemekaran wilayah. Nagari ini terletak di ${profile?.kecamatan || 'Kecamatan'}, ${profile?.kabupaten || 'Kabupaten'}, ${profile?.provinsi || 'Sumatera Barat'}.`}
              </p>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-black/5 dark:border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 dark:bg-[#3fd5ba] shadow-[0_0_10px_rgba(63,213,186,0.8)]" />
                <p className="font-serif italic text-slate-600 dark:text-white/90 text-xl leading-relaxed">
                  "Adat Basandi Syarak, Syarak Basandi Kitabullah"
                </p>
              </div>
              {profile?.potensi_unggulan && profile.potensi_unggulan.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {profile.potensi_unggulan.map((potensi: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-teal-50 dark:bg-[#144749]/50 border border-teal-300 dark:border-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] text-xs uppercase tracking-widest font-bold">
                      {potensi}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-teal-600/20 dark:bg-[#3fd5ba]/20 rounded-3xl blur-[40px] -z-10" />
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#0b2023]/80">
              <img
                src="https://sumbar.jadesta.com/imgpost/106151.jpg"
                alt="Sejarah Nagari"
                className="w-full h-full object-cover scale-110 hover:scale-100 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-[2s]"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/80 dark:bg-[#0b2023]/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/10 hidden md:flex group"
            >
              <div className="absolute inset-0 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-1 bg-teal-500 dark:bg-[#3fd5ba] mb-4 rounded-full shadow-[0_0_10px_rgba(63,213,186,0.5)]" />
              <span className="text-6xl font-bold text-slate-800 dark:text-white font-serif tracking-tighter drop-shadow-md group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors">24</span>
              <span className="text-teal-600/70 dark:text-[#3fd5ba]/70 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Tahun<br />Berdiri</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Visi Misi - Staggered Grid */}
        <section className="relative rounded-[3rem] overflow-hidden bg-[#0A1A1C] border border-black/5 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-slate-800 dark:text-white p-8 md:p-20">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#144749]/30 to-transparent pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3fd5ba]/[0.1] rounded-full blur-[100px]" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-8 border border-teal-300 dark:border-[#3fd5ba]/20 bg-teal-600/5 dark:bg-[#3fd5ba]/5 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(63,213,186,0.1)]">
              <Target size={14} />
              <span>Visi & Misi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight tracking-tight drop-shadow-lg">
              "{profile?.visi || 'Terwujudnya Nagari yang Maju, Mandiri, dan Berbudaya Berlandaskan Iman dan Taqwa'}"
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#3fd5ba] to-transparent mx-auto opacity-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {(profile?.misi || [
              "Meningkatkan kualitas pelayanan publik",
              "Mengembangkan potensi ekonomi masyarakat",
              "Melestarikan adat dan budaya",
              "Meningkatkan infrastruktur dan fasilitas umum"
            ]).map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border border-black/5 dark:border-white/5 shadow-lg bg-white/[0.02] backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/[0.05] hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-all duration-300 h-full group relative overflow-hidden">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3fd5ba]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-8 relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0b2023] border border-teal-300 dark:border-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(63,213,186,0.1)] group-hover:bg-teal-500 dark:bg-[#3fd5ba] group-hover:text-[#0b2023] transition-colors">
                        M{index + 1}
                      </div>
                    </h3>
                    <p className="text-slate-600 dark:text-white/70 leading-relaxed font-light group-hover:text-slate-800 dark:text-white transition-colors">{item}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Struktur Pemerintahan - Carousel/Grid */}
        <section>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
              <Users size={14} />
              <span>Perangkat Nagari</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white tracking-tight drop-shadow-md">
              Struktur Pemerintahan
            </h2>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-[#0b2023]/50 border border-black/5 dark:border-white/5 rounded-[3rem] backdrop-blur-md">
              <Users className="w-12 h-12 mx-auto text-slate-600 dark:text-white/20 mb-4" />
              <p className="text-slate-600 dark:text-white/40 uppercase tracking-widest text-xs font-bold">Belum ada data perangkat nagari</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {staff.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/10 bg-white dark:bg-[#0b2023]">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-50 dark:bg-[#144749]/30 flex items-center justify-center">
                        <Users className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a1c] via-[#0a1a1c]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-0 left-0 w-full p-6 text-slate-800 dark:text-white z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-8 h-1 bg-teal-500 dark:bg-[#3fd5ba] mb-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 shadow-[0_0_10px_rgba(63,213,186,0.5)]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-[#3fd5ba] mb-1">
                        {person.department || 'Perangkat'}
                      </p>
                      <h3 className="font-serif font-bold text-xl leading-tight mb-2">
                        {person.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-white/50 font-light uppercase tracking-wider">
                        {person.position}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </PageBackground>
  );
}
