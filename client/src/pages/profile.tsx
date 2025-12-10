
import { motion } from "framer-motion";
import { 
  History, Target, Users, Award, ChevronRight, Check, Loader2
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { useNagariProfile, useStaff } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat profil...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Profil Nagari" 
        description="Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Nagari."
        image={profileImage}
      />
      
      <div className="container mx-auto px-4 py-12 space-y-24">
        {/* Sejarah - Animated Scroll Reveal */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 px-4 py-1.5 rounded-full">
              <History size={16} />
              <span>Sejarah Nagari</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Akar Sejarah & <br/><span className="text-primary">Kearifan Lokal</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                {profile?.sejarah || `Nagari ${profile?.nama_nagari || 'Nagari'} terbentuk sebagai hasil pemekaran wilayah. Nagari ini terletak di ${profile?.kecamatan || 'Kecamatan'}, ${profile?.kabupaten || 'Kabupaten'}, ${profile?.provinsi || 'Sumatera Barat'}.`}
              </p>
              <p>
                Sejak dahulu, nagari ini dikenal sebagai sentra pertanian yang subur dan masyarakatnya yang menjunjung tinggi adat istiadat <span className="font-serif italic text-gray-900 font-medium">"Adat Basandi Syarak, Syarak Basandi Kitabullah"</span>.
              </p>
              {profile?.potensi_unggulan && profile.potensi_unggulan.length > 0 && (
                <p>
                  <strong>Potensi Unggulan:</strong> {profile.potensi_unggulan.join(', ')}
                </p>
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
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1598327774900-53093952f901?q=80&w=800&auto=format&fit=crop" 
                alt="Sejarah Nagari" 
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s]"
              />
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-8 -left-8 w-56 h-56 bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center border border-gray-100 hidden md:flex"
            >
              <div className="w-16 h-1 bg-secondary mb-4 rounded-full" />
              <span className="text-6xl font-bold text-gray-900 font-serif tracking-tighter">24</span>
              <span className="text-gray-500 font-medium mt-2 uppercase tracking-widest text-sm">Tahun<br/>Berdiri</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Visi Misi - Staggered Grid */}
        <section className="relative rounded-[3rem] overflow-hidden bg-primary text-white p-8 md:p-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-green-200 font-bold uppercase tracking-wider text-sm mb-6 border border-green-400/30 px-4 py-1.5 rounded-full">
              <Target size={16} />
              <span>Visi & Misi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              "{profile?.visi || 'Terwujudnya Nagari yang Maju, Mandiri, dan Berbudaya Berlandaskan Iman dan Taqwa'}"
            </h2>
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
                <Card className="border-none shadow-none bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 transition-colors h-full">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-lg">
                        {index + 1}
                      </div>
                      Misi {index + 1}
                    </h3>
                    <p className="text-green-50 leading-relaxed pl-[3.25rem]">{item}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Struktur Pemerintahan - Carousel/Grid */}
        <section>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4">
              <Users size={16} />
              <span>Perangkat Nagari</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
              Struktur Pemerintahan
            </h2>
          </div>

          {staff.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-3xl">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Belum ada data perangkat nagari</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {staff.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 relative shadow-lg">
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    {person.photo ? (
                      <img 
                        src={person.photo} 
                        alt={person.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                        <Users className="w-16 h-16 text-white/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        {person.department || 'Perangkat Nagari'}
                      </p>
                      <h3 className="font-serif font-bold text-xl leading-tight mb-1">
                        {person.name}
                      </h3>
                      <p className="text-sm text-gray-300 font-medium">
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
    </div>
  );
}
