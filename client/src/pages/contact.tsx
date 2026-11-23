import { useState } from "react";
import {
  MapPin, Phone, Mail, Send, MessageCircle, Loader2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/lib/api";
import { getTenantWhatsAppNumber } from "@/lib/whatsapp";
import { Link } from "wouter";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmergencyContactsSection from "@/components/shared/EmergencyContactsSection";
import contactImage from "@assets/generated_images/hero_background_of_nagari_sungai_pinang.png";

export default function Contact() {
  const { data: settingsData, isLoading } = useSiteSettings();
  const settings = settingsData?.data;
  const whatsappNumber = getTenantWhatsAppNumber(settings);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [statusMessage, setStatusMessage] = useState<string>("");

  const contactInfo = {
    address: settings?.contact_address || "Kantor Wali Nagari",
    phone: settings?.contact_phone || "",
    email: settings?.contact_email || "",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<typeof form> = {};
    if (!form.name.trim()) nextErrors.name = "Tuliskan nama lengkap Anda.";
    if (!form.subject.trim()) nextErrors.subject = "Tuliskan perihal pesan Anda.";
    if (!form.message.trim()) nextErrors.message = "Tuliskan isi pesan atau pertanyaan Anda.";
    if (form.email.trim() && !form.email.includes("@")) {
      nextErrors.email = "Tuliskan alamat email yang valid (mengandung @).";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("Mohon lengkapi kolom yang ditandai sebelum mengirim.");
      return;
    }

    const composedBody = [
      `Nama: ${form.name.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Perihal: ${form.subject.trim()}`,
      "",
      form.message.trim(),
    ].filter(Boolean).join("\n");

    if (whatsappNumber) {
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(composedBody)}`,
        "_blank",
        "noopener,noreferrer"
      );
      setStatusMessage("Jendela WhatsApp resmi nagari dibuka untuk mengirim pesan Anda.");
    } else if (contactInfo.email) {
      window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(composedBody)}`;
      setStatusMessage("Aplikasi email Anda dibuka untuk mengirim pesan ke kantor nagari.");
    } else {
      setStatusMessage("Kontak digital nagari belum dikonfigurasi. Silakan kunjungi Kantor Wali Nagari.");
    }
  };

  const mapsSearchUrl = settings?.contact_address
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(settings.contact_address)}`
    : null;

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Hubungi Kami"
        description="Sampaikan pertanyaan, keperluan administrasi, atau masukan melalui kontak resmi Kantor Wali Nagari."
        image={contactImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 space-y-16">
        <EmergencyContactsSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <p className="inline-flex items-center gap-2 text-nagari-red-ink font-medium text-[13px] mb-3">
                <MessageCircle aria-hidden="true" size={15} />
                Pusat Layanan Informasi
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
                Kontak Resmi Kantor Nagari
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base max-w-lg">
                Anda dapat menghubungi perangkat nagari melalui saluran di bawah ini atau datang langsung pada jam operasional kantor.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3 py-8">
                <Loader2 aria-hidden="true" className="w-5 h-5 animate-spin text-nagari-red" />
                <span className="text-muted-foreground text-sm font-medium">Memuat data kontak...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                <Card className="border-border bg-card rounded-2xl">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                      <MapPin aria-hidden="true" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-base mb-1">Alamat Kantor</h3>
                      <p className="text-foreground/90 text-sm leading-relaxed mb-1">{contactInfo.address}</p>
                      <p className="text-[13px] text-muted-foreground">Senin – Kamis (08:00 – 16:00), Jumat (08:00 – 11:30)</p>
                    </div>
                  </CardContent>
                </Card>

                {contactInfo.phone && (
                  <Card className="border-border bg-card rounded-2xl">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                        <Phone aria-hidden="true" size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-base mb-1">Telepon &amp; WhatsApp</h3>
                        <a href={`tel:${contactInfo.phone}`} className="text-nagari-red-ink font-medium text-sm hover:underline underline-offset-4">
                          {contactInfo.phone}
                        </a>
                        <p className="text-[13px] text-muted-foreground mt-1">Saluran informasi dan layanan nagari</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contactInfo.email && (
                  <Card className="border-border bg-card rounded-2xl">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-nagari-red/10 text-nagari-red-ink flex items-center justify-center shrink-0">
                        <Mail aria-hidden="true" size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-base mb-1">Email Resmi</h3>
                        <a href={`mailto:${contactInfo.email}`} className="text-nagari-red-ink font-medium text-sm hover:underline underline-offset-4 break-all">
                          {contactInfo.email}
                        </a>
                        <p className="text-[13px] text-muted-foreground mt-1">Untuk surat menyurat dan kerja sama</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/gis">
                    <Button variant="outline" className="rounded-lg h-11 px-5 text-sm font-medium border-border text-foreground hover:bg-muted">
                      <MapPin aria-hidden="true" className="mr-2 h-4 w-4" /> Lihat Peta Wilayah Nagari
                    </Button>
                  </Link>
                  {mapsSearchUrl && (
                    <Button asChild variant="outline" className="rounded-lg h-11 px-5 text-sm font-medium border-border text-foreground hover:bg-muted">
                      <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" /> Buka di Peta
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <Card className="bg-card border border-border rounded-2xl">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Kirim Pesan</h2>
              <p className="text-muted-foreground text-sm mb-6 pb-5 border-b border-border">
                Isi formulir berikut untuk mengirim pesan langsung ke saluran resmi Kantor Wali Nagari.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground block">
                      Nama Lengkap
                    </label>
                    <Input
                      id="contact-name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      placeholder="Nama Anda"
                      className="rounded-lg h-12 text-base"
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="text-[13px] text-nagari-red-ink">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-sm font-medium text-foreground block">
                      Alamat Email (opsional)
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      placeholder="nama@email.com"
                      className="rounded-lg h-12 text-base"
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="text-[13px] text-nagari-red-ink">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-subject" className="text-sm font-medium text-foreground block">
                    Perihal
                  </label>
                  <Input
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    placeholder="Contoh: Pertanyaan syarat surat domisili"
                    className="rounded-lg h-12 text-base"
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="text-[13px] text-nagari-red-ink">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground block">
                    Isi Pesan
                  </label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    placeholder="Tuliskan pertanyaan atau saran Anda di sini..."
                    className="min-h-[140px] rounded-lg p-3.5 text-base resize-y"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="text-[13px] text-nagari-red-ink">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-nagari-red hover:bg-nagari-red-ink text-white h-12 font-medium text-sm rounded-lg transition-colors"
                >
                  <Send aria-hidden="true" className="mr-2 h-4 w-4" />
                  {whatsappNumber ? "Kirim Pesan via WhatsApp" : "Kirim Pesan via Email"}
                </Button>

                {statusMessage && (
                  <p role="status" className="text-sm text-muted-foreground pt-1">
                    {statusMessage}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </PageBackground>
  );
}
