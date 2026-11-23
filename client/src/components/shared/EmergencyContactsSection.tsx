import {
  Phone,
  ShieldAlert,
  Flame,
  Ambulance,
  LifeBuoy,
  MessageCircle,
  Building2,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSiteSettings, useNagariProfile, useJorongs } from "@/lib/api";
import { getTenantWhatsAppNumber } from "@/lib/whatsapp";
import { getTenantName } from "@/lib/tenant-name";

const NATIONAL_HOTLINES = [
  {
    label: "Polisi / Keamanan",
    number: "110",
    note: "Darurat keamanan 24 jam",
    icon: ShieldAlert,
    chipClass: "bg-cat-2/10 text-cat-2",
    edgeClass: "bg-cat-2",
  },
  {
    label: "Ambulans & Medis",
    number: "119",
    note: "Gawat darurat kesehatan",
    icon: Ambulance,
    chipClass: "bg-cat-3/10 text-cat-3",
    edgeClass: "bg-cat-3",
  },
  {
    label: "Pemadam Kebakaran",
    number: "113",
    note: "Kebakaran & penyelamatan",
    icon: Flame,
    chipClass: "bg-nagari-red/10 text-nagari-red-ink",
    edgeClass: "bg-nagari-red",
  },
  {
    label: "Basarnas / Bencana",
    number: "115",
    note: "Evakuasi & SAR",
    icon: LifeBuoy,
    chipClass: "bg-cat-4/10 text-cat-4",
    edgeClass: "bg-cat-4",
  },
];

export default function EmergencyContactsSection() {
  const { data: settingsResponse } = useSiteSettings();
  const { data: profileResponse } = useNagariProfile();
  const { data: jorongsResponse } = useJorongs();

  const settings = settingsResponse?.data;
  const profile = profileResponse?.data;
  const tenantName = getTenantName(settings, profile?.nama_nagari);
  const waNumber = getTenantWhatsAppNumber(settings);
  const officePhone = settings?.contact_phone || profile?.telepon || "";
  const jorongs = jorongsResponse?.data || [];
  const jorongsWithContact = jorongs.filter(
    (j) => Boolean(j.kepala_jorong || j.telepon)
  );

  return (
    <section
      aria-label="Nomor darurat dan kontak cepat nagari"
      className="space-y-8"
    >
      <div className="pb-5 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-nagari-red-ink font-semibold text-[13px] mb-2">
            <Phone aria-hidden="true" size={15} />
            Kontak Cepat &amp; Darurat
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
            Nomor Penting &amp; Layanan Darurat
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            Ketuk nomor di bawah ini untuk langsung menelepon atau menghubungi perangkat {tenantName}.
          </p>
        </div>
      </div>

      {/* National Emergency Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NATIONAL_HOTLINES.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red"
            >
              <Card className="h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-foreground/25 group-hover:shadow-md">
                <div aria-hidden="true" className={`h-1 w-full ${item.edgeClass}`} />
                <CardContent className="p-5 flex flex-col justify-between gap-4 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.chipClass}`}
                    >
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border">
                      1-Klik Telepon
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-3xl font-serif font-bold text-foreground tabular-nums mt-1">
                      {item.number}
                    </p>
                    <p className="text-[13px] text-muted-foreground mt-1">
                      {item.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Kantor Nagari Quick Action Card */}
      {(officePhone || waNumber) && (
        <Card className="bg-nagari-navy text-white border border-border rounded-2xl">
          <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="w-11 h-11 rounded-xl bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                <Building2 aria-hidden="true" size={22} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-nagari-yellow mb-0.5">
                  Saluran Resmi Pemerintah Nagari
                </p>
                <h3 className="font-serif font-bold text-xl text-white">
                  Kantor Wali {tenantName}
                </h3>
                {officePhone && (
                  <p className="text-sm text-white/80 mt-1 tabular-nums">
                    Telepon kantor: {officePhone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {officePhone && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 md:flex-none rounded-lg h-11 px-5 border-white/25 bg-white/10 text-white hover:bg-white/20 text-sm font-medium"
                >
                  <a href={`tel:${officePhone}`}>
                    <Phone aria-hidden="true" size={16} className="mr-2" />
                    Telepon Kantor
                  </a>
                </Button>
              )}
              {waNumber && (
                <Button
                  asChild
                  className="flex-1 md:flex-none rounded-lg h-11 px-5 bg-brand-wa text-brand-wa-foreground hover:brightness-95 text-sm font-medium"
                >
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden="true" size={16} className="mr-2" />
                    WhatsApp Nagari
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kontak Cepat Wali Jorong (Tenant-Isolated) */}
      {jorongsWithContact.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif font-bold text-lg md:text-xl text-foreground">
              Kontak Cepat Wali Jorong ({jorongsWithContact.length})
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jorongsWithContact.map((jorong) => {
              const cleanTel = (jorong.telepon || "").replace(/[^0-9+]/g, "");
              return (
                <Card
                  key={jorong.id}
                  className="bg-card border border-border rounded-2xl"
                >
                  <CardContent className="p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-base text-foreground truncate">
                        Jorong {jorong.nama}
                      </p>
                      <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                        <UserCheck aria-hidden="true" size={14} className="shrink-0" />
                        <span className="truncate">
                          {jorong.kepala_jorong || "Wali Jorong"}
                        </span>
                      </p>
                      {jorong.telepon && (
                        <p className="text-[13px] font-medium text-foreground mt-1 tabular-nums">
                          {jorong.telepon}
                        </p>
                      )}
                    </div>

                    {cleanTel && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-lg h-11 px-3.5 border-border shrink-0"
                      >
                        <a
                          href={`tel:${cleanTel}`}
                          aria-label={`Telepon Wali Jorong ${jorong.nama}`}
                        >
                          <Phone aria-hidden="true" size={16} className="text-nagari-red-ink" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
