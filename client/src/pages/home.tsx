import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Demografi from "@/components/home/Demografi";
import News from "@/components/home/News";
import PetaPreview from "@/components/home/PetaPreview";
import UMKM from "@/components/home/UMKM";
import Sambutan from "@/components/home/Sambutan";
import IkmSurveySection from "@/components/shared/IkmSurveySection";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-background transition-colors duration-200">
      <Navbar />

      {/* id="main" is the skip-link target declared in App.tsx. */}
      <main id="main">
        <Hero />

        <div className="relative">
          <Demografi />
          <Sambutan />
          <News />
          <PetaPreview />
          <UMKM />
          <IkmSurveySection category="Portal Beranda" />
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
