
import { motion } from "framer-motion";
import { 
  History, Target, Users, Award, ChevronRight, Check 
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { staff } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import profileImage from "@assets/generated_images/portrait_of_nagari_head.png";

export default function Profil() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Profil Nagari" 
        description="Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Nagari Sungai Pinang."
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
                Nagari Sungai Pinang terbentuk pada tahun 2001 sebagai hasil pemekaran wilayah. Nama "Sungai Pinang" diambil dari sungai yang membelah nagari ini, yang di tepiannya banyak tumbuh pohon pinang, simbol ketahanan dan manfaat.
              </p>
              <p>
                Sejak dahulu, nagari ini dikenal sebagai sentra pertanian yang subur dan masyarakatnya yang menjunjung tinggi adat istiadat <span className="font-serif italic text-gray-900 font-medium">"Adat Basandi Syarak, Syarak Basandi Kitabullah"</span>.
              </p>
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
              "Terwujudnya Nagari Sungai Pinang yang Maju, Mandiri, dan Berbudaya Berlandaskan Iman dan Taqwa"
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {[
              { title: "Pemberdayaan Ekonomi", desc: "Meningkatkan perekonomian masyarakat melalui pengembangan UMKM dan pertanian modern." },
              { title: "Tata Kelola Pemerintahan", desc: "Mewujudkan tata kelola pemerintahan nagari yang transparan, akuntabel, dan melayani." },
              { title: "Infrastruktur", desc: "Meningkatkan kualitas infrastruktur dasar dan penunjang aktivitas masyarakat." },
              { title: "Sosial Budaya", desc: "Melestarikan nilai-nilai adat dan budaya serta meningkatkan kualitas kehidupan beragama." }
            ].map((item, index) => (
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
                      {item.title}
                    </h3>
                    <p className="text-green-50 leading-relaxed pl-[3.25rem]">{item.desc}</p>
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
                  <img 
                    src={person.photo} 
                    alt={person.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {person.department}
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
        </section>
      </div>
      <Footer />
    </div>
  );
}
