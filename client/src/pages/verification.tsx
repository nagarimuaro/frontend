import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ShieldCheck, ShieldAlert, FileText, User, UserCheck, Calendar, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface VerificationData {
  valid: boolean;
  data: {
    nomor_surat: string;
    tanggal_surat: string;
    jenis_surat: string;
    pemohon: {
      nama: string;
      nik_masked: string;
    };
    penandatangan: {
      nama: string;
      jabatan: string;
    };
    verified_at: string;
  };
}

export default function Verification() {
  const [match, params] = useRoute("/verifikasi-surat/:token");
  const token = params?.token;

  // URL Backend API
  const API_URL = `https://sintanagari.cloud/api/public/verifikasi-surat/${token}`;

  const { data, isLoading, isError } = useQuery<VerificationData>({
    queryKey: ["verification", token],
    queryFn: async () => {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    },
    enabled: !!token,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // INVALID STATE
  if (isError || !data?.valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md border-red-200 shadow-lg overflow-hidden">
          <div className="bg-red-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white mb-6 shadow-sm">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">TIDAK VALID</h1>
            <p className="text-red-100 text-sm">Dokumen tidak ditemukan di sistem kami.</p>
          </div>
          
          <CardContent className="p-8 text-center space-y-6">
            <p className="text-gray-600">
              QR Code yang Anda pindai mungkin rusak, palsu, atau sudah kedaluwarsa. Mohon hubungi Kantor Wali Nagari untuk verifikasi lebih lanjut.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-xs font-mono text-red-800 break-all">Token: {token}</p>
            </div>

            <Link href="/">
              <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
          
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Pemerintah Nagari Sijunjung</p>
          </div>
        </Card>
      </div>
    );
  }

  // VALID STATE
  const surat = data.data;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md border-green-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">DOKUMEN VALID</h1>
          <p className="text-green-100 mt-1 text-sm">Terdaftar resmi di Sinta Nagari</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Nomor Surat */}
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nomor Surat</h3>
            </div>
            <p className="text-lg font-bold text-gray-900 break-words">{surat.nomor_surat}</p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</h3>
              </div>
              <p className="text-gray-800 font-medium">
                {format(new Date(surat.tanggal_surat), "d MMMM yyyy", { locale: id })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jenis</h3>
              </div>
              <p className="text-gray-800 font-medium">{surat.jenis_surat}</p>
            </div>
          </div>

          {/* Pemohon */}
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pemohon</h3>
            </div>
            <p className="text-gray-900 font-medium">{surat.pemohon.nama}</p>
            <p className="text-sm text-gray-500 font-mono">NIK: {surat.pemohon.nik_masked}</p>
          </div>

          {/* Penandatangan */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ditandatangani Oleh</h3>
            </div>
            <div className="flex items-center mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{surat.penandatangan.nama}</p>
                <p className="text-xs text-gray-500">{surat.penandatangan.jabatan}</p>
              </div>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
            </Button>
          </Link>
        </CardContent>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">Verifikasi pada {format(new Date(), "d MMMM yyyy HH:mm", { locale: id })}</p>
        </div>
      </Card>
    </div>
  );
}
