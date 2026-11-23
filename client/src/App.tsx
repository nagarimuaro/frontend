import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "framer-motion";

import Home from "@/pages/home";
import Profil from "@/pages/profile";
import Services from "@/pages/services";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import UMKM from "@/pages/umkm";
import Facilities from "@/pages/facilities";
import PPID from "@/pages/ppid";
import Complaints from "@/pages/complaints";
import GIS from "@/pages/gis";
import Projects from "@/pages/projects";
import PublicData from "@/pages/public-data";
import Monografi from "@/pages/monografi";
import Infografis from "@/pages/infografis";
import IndeksDesa from "@/pages/indeks-desa";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import Verification from "@/pages/verification";
import DynamicHead from "@/components/shared/DynamicHead";
import UrgentAnnouncementBar from "@/components/shared/UrgentAnnouncementBar";
import VisitorStatsWidget from "@/components/shared/VisitorStatsWidget";
import AccessibilityWidget from "@/components/shared/AccessibilityWidget";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  const [location] = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/verifikasi" component={Verification} />
      <Route path="/verifikasi-surat/:token" component={Verification} />
      <Route path="/profil" component={Profil} />
      <Route path="/monografi" component={Monografi} />
      <Route path="/layanan" component={Services} />
      <Route path="/berita" component={News} />
      <Route path="/berita/:slug" component={NewsDetail} />
      <Route path="/umkm" component={UMKM} />
      <Route path="/fasilitas" component={Facilities} />
      <Route path="/ppid" component={PPID} />
      <Route path="/pengaduan" component={Complaints} />
      <Route path="/gis" component={GIS} />
      <Route path="/proyek" component={Projects} />
      <Route path="/data-publik" component={PublicData} />
      <Route path="/infografis" component={Infografis} />
      <Route path="/indeks-desa" component={IndeksDesa} />
      <Route path="/idm" component={IndeksDesa} />
      <Route path="/kontak" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sinta-ui-theme">
      {/* reducedMotion="user" makes every framer-motion animation in the tree
          respect the OS "reduce motion" setting (WCAG 2.2 SC 2.3.3). */}
      <MotionConfig reducedMotion="user">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Skip link: first tab stop on every page, jumps past the fixed
                navbar to the page's <main id="main"> (WCAG 2.2 SC 2.4.1). */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-nagari-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Lewati ke konten utama
            </a>
            <DynamicHead />
            <UrgentAnnouncementBar />
            <Toaster />
            <Router />
            <VisitorStatsWidget />
            <AccessibilityWidget />
          </TooltipProvider>
        </QueryClientProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
