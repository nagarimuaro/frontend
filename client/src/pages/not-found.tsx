import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageBackground from "@/components/layout/PageBackground";

export default function NotFound() {
  return (
    <PageBackground>
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[65vh]">
        <Card className="w-full max-w-md bg-card border border-border rounded-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center">
              <AlertCircle aria-hidden="true" className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tautan yang Anda buka tidak tersedia atau alamat halaman telah berubah.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-6 text-sm font-medium">
                  <ArrowLeft aria-hidden="true" className="mr-2 w-4 h-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </PageBackground>
  );
}
