# Audit UI/UX Nagari-Portal (Standar `taste-skill-repo` v2.5.1)

**Target:** `Nagari-Portal` (`client/src/`)  
**Referensi Audit:** `tasteskill 2.5.1` (`/var/www/taste-skill-repo/skills/taste-skill/`: `SKILL.md`, `references/layout-v4.md`, `references/system.md`, `references/motion.md`, `references/copy.md`)  
**Klasifikasi Situs (`SKILL.md` §1):** `page-type: service` | `site-kind: other` (Portal Pemerintahan & Layanan Publik Nagari — bukan `tech`/`gaming`).

> **Catatan Teknis Pengecekan Browser:** Skrip headless Chrome (`consistency.mjs`) pada `taste-skill-repo` dijalankan terhadap build existing `dist/public/index.html`, namun Chromium menolak berjalan sebagai `root` tanpa flag `--no-sandbox` (dan sesuai aturan `SKILL.md` §6, file kit tidak diubah). Audit ini menggabungkan inspeksi kode statis menyeluruh pada seluruh 17 halaman dan komponen layout/home/shared serta validasi aturan `tasteskill 2.5.1` + WCAG 2.2.

---

## Ringkasan Eksekutif

Rasa "tidak nyaman" pada UI `Nagari-Portal` bukan sekadar selera visual — ada **bug kontras nyata, sisa find-and-replace tema yang rusak, 3 identitas warna yang saling bertabrakan, scroll-snap paksa yang menjebak pengguna, popup paksa di awal muat, dan beberapa tombol/form yang tidak berfungsi**.

| Prioritas | Kategori | Jumlah Temuan Utama | Dampak ke Pengguna |
| :--- | :--- | :---: | :--- |
| **P0 (Kritis)** | Bug Kontras, Broken CSS, Scroll-Snap, Popup Paksa | 6 | Teks hilang saat hover/light mode, scroll memantul, layar langsung diblokir popup |
| **P1 (Tinggi)** | Design System Terbelah 3, Tipografi <13px, Visual Slop | 4 | Portal terasa tidak profesional/tidak konsisten, sulit dibaca warga umum |
| **P2 (Sedang)** | Motion Berlebihan, Form Palsu, Tombol Mati, A11y & Data Dummy | 5 | Form kontak menipu user, tombol CTA mati, data antar nagari tercampur |

---

## 🔴 P0 — Bug Visual, Kontras & UX Kritis (Wajib Diperbaiki Pertama)

### 1. Navbar Hilang Total (Teks Putih di Latar Putih) di Halaman Tanpa `PageHeader` Gelap
- **Lokasi:** [`client/src/components/layout/Navbar.tsx`](../client/src/components/layout/Navbar.tsx#L77-L105), [`client/src/pages/infografis.tsx`](../client/src/pages/infografis.tsx#L105-L107), [`client/src/pages/news-detail.tsx`](../client/src/pages/news-detail.tsx#L93-L107)
- **Masalah:** `Navbar` hanya menjadi solid jika `scrolled || location === "/gis"`. Saat berada di puncak halaman `infografis` atau `news-detail` (Light Mode), background halaman terang sementara teks navbar berwarna **putih (`text-white`) di atas `bg-transparent`** → seluruh menu navigasi **tidak terlihat** sampai user scroll. Selain itu, [`ThemeToggle.tsx`](../client/src/components/layout/ThemeToggle.tsx#L12) hardcoded `border-black/10 text-slate-800` yang bentrok di atas hero gelap.
- **Aturan `taste-skill` (`system.md` Nav):** Header harus selalu `fixed`, **background solid (opaque) + 1px bottom hairline sejak first paint**, tanpa blur/transparansi/perubahan warna saat scroll.

### 2. Bug Hover Tombol "Merah di atas Merah" (Teks Hilang Total)
- **Lokasi:**
  - [`client/src/components/home/News.tsx`](../client/src/components/home/News.tsx#L70) & [baris 205](../client/src/components/home/News.tsx#L205)
  - [`client/src/components/home/UMKM.tsx`](../client/src/components/home/UMKM.tsx#L73) & [baris 207](../client/src/components/home/UMKM.tsx#L207)
- **Kode Bermasalah:** `bg-muted hover:bg-nagari-red text-foreground hover:text-nagari-red`
- **Masalah:** Saat kursor menyentuh tombol *"Semua Berita"* atau *"Jelajahi Semua Produk"*, background berubah merah (`nagari-red`) dan teksnya juga berubah merah (`nagari-red`) → **kontras 1:1 (teks lenyap)**.
- **Aturan `taste-skill`:** `[text-contrast]`, `[button-styles]`.

### 3. Teks Kuning Terang (`#FBBF24`) di atas Latar Putih — Kontras 1.69:1 (Gagal WCAG)
- **Lokasi:** [`client/src/lib/accents.ts`](../client/src/lib/accents.ts#L35-L42), berdampak langsung pada [`Demografi.tsx`](../client/src/components/home/Demografi.tsx#L36-L44), [`News.tsx`](../client/src/components/home/News.tsx#L112-L126), dan [`UMKM.tsx`](../client/src/components/home/UMKM.tsx#L131-L189)
- **Masalah:** Di [`index.css`](../client/src/index.css#L148) sudah tercatat peringatan `yellow on white 1.69:1 — never text on a light surface`. Namun di `accents.ts`, token `--cat-*` yang sudah dikalibrasi 4.5:1 malah ditimpa menjadi `text-nagari-yellow` pada indeks ganjil. Akibatnya:
  - Kartu *Laki-laki*, *Perempuan*, dan *Luas Wilayah* di Beranda menampilkan satuan & ikon kuning pucat di atas putih.
  - Badge kategori Berita & UMKM serta tombol ikon Google Maps di kartu UMKM silau dan hampir tak terbaca di Light Mode.
- **Aturan `taste-skill`:** `[text-contrast]` (wajib ≥ 4.5:1 untuk teks, ≥ 7:1 untuk teks bacaan utama di `system.md`).

### 4. Sisa Find-and-Replace CSS yang Rusak di Hampir Semua Halaman Dalam
Ditemukan pola kelas Tailwind rusak akibat refactor massal yang tidak selesai:
- **`bg-nagari-red/50` pada tombol CTA utama** → Di Light Mode tombol tampil **merah muda pucat/transparan** seperti tombol *disabled*:
  - [`services.tsx`](../client/src/pages/services.tsx#L110), [`contact.tsx`](../client/src/pages/contact.tsx#L137), [`infografis.tsx`](../client/src/pages/infografis.tsx#L149), [`verification.tsx`](../client/src/pages/verification.tsx#L115), [`facilities.tsx`](../client/src/pages/facilities.tsx#L79-L93)
- **Tab aktif rusak di Dark Mode ([`facilities.tsx`](../client/src/pages/facilities.tsx#L79-L93)):** `data-[state=active]:bg-nagari-red/50 dark:bg-[#FBBF24]` lupa prefix `data-[state=active]:` pada class dark → **semua tab berwarna kuning bersamaan** di Dark Mode!
- **Hover color bocor di Dark Mode:** `group-hover:text-nagari-red-ink dark:text-[#FBBF24]` pada [`services.tsx`](../client/src/pages/services.tsx#L89) dan [`projects.tsx`](../client/src/pages/projects.tsx#L132) membuat judul berwarna kuning permanen di Dark Mode, bukan saat hover.
- **Overlay putih menutupi kartu gelap ([`projects.tsx`](../client/src/pages/projects.tsx#L115)):** `bg-slate-50/90` menutup area header kartu proyek di Light Mode sehingga teks putih di bawahnya kehilangan kontras.

### 5. Scroll-Snap Paksa (`snap-y snap-mandatory`) + Overlap `-mt-24` yang Mengganggu Navigasi
- **Lokasi:** [`client/src/pages/home.tsx`](../client/src/pages/home.tsx#L17), [`Demografi.tsx`](../client/src/components/home/Demografi.tsx#L69), [`News.tsx`](../client/src/components/home/News.tsx#L42)
- **Masalah:**
  - `<main className="snap-y snap-mandatory">` memaksa browser melompat antar-section secara agresif.
  - `News.tsx` tidak memiliki `snap-start` maupun `min-h-[100svh]`, sementara `Demografi.tsx` dan `Sambutan.tsx` sering lebih tinggi dari 1 layar di laptop/mobile → scroll terasa **memantul, melompati berita, atau tersangkut**.
  - `Demografi.tsx` menarik diri ke atas `-mt-16 md:-mt-24` menimpa bagian bawah `Hero.tsx` (yang juga memiliki kontrol pagination di `bottom-10`), menciptakan tabrakan visual.
- **Aturan `taste-skill` (`layout-v4.md` §2 & `motion.md` Scroll):** **Dilarang keras** `scroll-snap`, scroll-jacking, maupun `scroll-behavior: smooth` global ([`index.css`](../client/src/index.css#L237)).

### 6. Popup Paksa di Initial Load (`AIServicePopup`) & Bubble Berkedip (`WhatsAppWidget`)
- **Lokasi:** [`AIServicePopup.tsx`](../client/src/components/shared/AIServicePopup.tsx#L10-L148), [`WhatsAppWidget.tsx`](../client/src/components/shared/WhatsAppWidget.tsx#L17-L27)
- **Masalah:**
  - `AIServicePopup` memblokir seluruh halaman **setiap kali website dibuka/di-refresh** (`useState(true)` tanpa persistence).
  - Modal hardcoded warna Light Mode (`bg-white`, `text-gray-900`) sehingga menyilaukan di Dark Mode, tombol tutup (`X`) tidak memiliki `aria-label`, dan tombol batal berlabel menyesatkan *"Tutup Halaman Ini"*.
  - `WhatsAppWidget` memakai `animate-ping` terus-menerus tanpa tombol jeda dan menutupi konten di layar sempit.
- **Aturan `taste-skill` (`layout-v4.md` §2 The Shell):** *"No popups, newsletter modals, chat bubbles, help pills, back-to-top squares... nothing else is fixed."*

---

## 🟠 P1 — Inkonsistensi Design System, Tipografi & Visual Slop

### 7. "3 Tema Berbeda dalam 1 Website" — Melanggar Prinsip *One System* (`system.md`)
| Area | Warna Aksen Utama | Bentuk Tombol | Radius Kartu | Surface Dark Mode |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar** ([`Navbar.tsx`](../client/src/components/layout/Navbar.tsx)) | Teal (`#2b9a9e`) | `rounded-lg` (8px) | `rounded-lg` | `bg-background/90` |
| **Beranda** ([`Hero.tsx`](../client/src/components/home/Hero.tsx), [`Demografi.tsx`](../client/src/components/home/Demografi.tsx)) | Merah Gradient + Navy + Kuning | `rounded-full` (pill) | `rounded-2xl` & `rounded-3xl` | `bg-card` (`#171e2b`) |
| **Halaman Dalam** (`services`, `profile`, `contact`, `ppid`, `projects`, `infografis`) | Pink pudar (`red/50`) / Kuning / Hijau `#163c37` | `rounded-xl` & `rounded-full` | `rounded-[2.5rem]` & `rounded-[3rem]` | Hijau gelap lama `#0b2023` & `#143236` |

- **Aturan `taste-skill` (`system.md`):** Wajib **satu sistem ketat** di seluruh situs: 1 warna aksen utama (<3% layar, 90–95% netral), 1 pasang gaya tombol (`primary` & `secondary`), 1 skala radius (`soft`: `8px / 12px / 20px`), dan 1 keluarga kartu.
- **Footer ([`Footer.tsx`](../client/src/components/layout/Footer.tsx#L33)):** `border-t-[12px] border-nagari-red rounded-t-[3rem]` terlihat berat/berlebihan dibanding standar hairline/clean band.

### 8. Tipografi Sulit Dibaca Warga Umum & Font Generic (`layout-v4.md` §5, `system.md` Type)
- **Teks mikro (<13px) di ratusan tempat:** Penggunaan `text-[9px]`, `text-[10px]`, `text-[11px]` dengan `uppercase tracking-[0.2em]` sampai `tracking-[0.3em]` pada label kartu, tanggal, nama pemilik UMKM, tabel header, label form, dan footer. Ini jauh di bawah floor **13px** `taste-skill` dan menyulitkan warga awam/lansia.
- **`font-light` pada teks kecil (12–14px):** Membuat keterbacaan semakin tipis di layar standar/ponsel murah (melanggar `layout-v4.md` §5: *"No light weight under 20px"*).
- **Font Pairing (`Inter` + `Plus Jakarta Sans`):** Kedua font di [`client/index.html`](../client/index.html#L54) masuk daftar font generic yang dihindari `taste-skill` (`layout-v4.md` §5). Sementara `Newsreader` yang sudah dimuat untuk artikel berita sebenarnya jauh lebih berkarakter dan layak diangkat atau dipasangkan dengan display/body sans yang lebih khas.

### 9. Efek "AI-Slop" Tidak Sesuai Karakter Situs Pemerintahan (`SKILL.md` Rule 8)
- `Nagari-Portal` adalah portal layanan publik (`service / other`), bukan aplikasi AI/gaming/crypto.
- Namun hampir setiap komponen dibanjiri:
  - **Glowing blur orbs** (`blur-[60px]` s.d. `blur-[120px]`) di `Footer`, `Demografi`, `Sambutan`, `services`, `profile`, `contact`, `infografis`, `projects`, `ppid`, `public-data`, `verification`.
  - **Neon glow shadows** (`shadow-[0_0_20px_rgba(251,191,36,0.3)]`, `drop-shadow-[0_0_20px_...]`).
  - **Gradient text** di [`Hero.tsx`](../client/src/components/home/Hero.tsx#L252) dan [`contact.tsx`](../client/src/pages/contact.tsx#L57) (`from-[#FBBF24] to-blue-400`).
  - **Warna Violet/Purple** (`--cat-6: 266 38% 42%` di [`index.css`](../client/src/index.css#L109), `purple-400`/`purple-500` di [`monografi.tsx`](../client/src/pages/monografi.tsx#L183) & [`public-data.tsx`](../client/src/pages/public-data.tsx#L46)) — dilarang oleh `SKILL.md` §6.
  - **Backdrop blur berlebihan** di atas kartu solid (membuat performa scroll berat di HP kelas menengah).

### 10. Hero Beranda Terlalu Ramai & Auto-Carousel (`Hero.tsx`)
- **Lokasi:** [`client/src/components/home/Hero.tsx`](../client/src/components/home/Hero.tsx#L158-L377)
- **Masalah:**
  - Auto-playing carousel (`6.5s`) melanggar `SKILL.md` Rule 5 (*"No tilt, carousels or timed tabs"*) dan `layout-v4.md` §3 (*"Never a slider or crossfade"*).
  - Penghitung slide `01/03` muncul **dua kali** (di badge atas H1 dan di pagination bar bawah).
  - 4 lapisan gradient/scrim bertumpuk menutupi foto asli nagari hingga kusam.
  - Listener global `window.addEventListener("keydown")` untuk `ArrowLeft`/`ArrowRight` berpotensi membajak navigasi keyboard user.

---

## 🟡 P2 — Motion, Form/Link Rusak, Data Hardcoded & Aksesibilitas

### 11. Animasi Scroll & Transisi Halaman Mengganggu (`motion.md`)
- **Page Transition ([`App.tsx`](../client/src/App.tsx#L32-L52)):** `<AnimatePresence mode="wait">` + `Navbar` di-mount di dalam setiap halaman (yang punya `initial={{ y: -100 }}`) membuat header terus turun-naik dan halaman terasa lambat/berkedip setiap ganti rute.
- **Scroll Reveal di mana-mana (`whileInView`):** Semua kartu/heading pakai fade+slide saat scroll; di [`profile.tsx`](../client/src/pages/profile.tsx#L84) foto bahkan miring `rotate: 2` → melanggar `motion.md` (*"No card, row or tile ever fades, rises or staggers in as the page scrolls"*).
- **Hover berlebihan:** `whileHover={{ y: -8, scale: 1.01 }}` ([`news.tsx`](../client/src/pages/news.tsx#L150)), `whileHover={{ y: -5, x: 5 }}` ([`contact.tsx`](../client/src/pages/contact.tsx#L78)), `scale-110 hover:scale-100` ([`profile.tsx`](../client/src/pages/profile.tsx#L95)). Standar `motion.md`: kartu ber-link naik maksimal `2px`, foto zoom `1.02–1.03`.

### 12. Form Palsu, Tombol Mati & Link `#` (`system.md` Forms & `copy.md`)
- **Form Kontak Palsu ([`contact.tsx`](../client/src/pages/contact.tsx#L115)):** `onSubmit` hanya memanggil `setShowSuccessModal(true)` tanpa mengirim data ke API atau email mana pun, tanpa validasi, dan tanpa `htmlFor`/`id` pada `<label>` → melanggar `[form-send]` & `[field-label]`.
- **Tombol CTA Mati (tanpa handler/link):**
  - *"Ajukan Sekarang"* di [`services.tsx`](../client/src/pages/services.tsx#L110) tidak melakukan apa-apa saat diklik.
  - *"Buka Google Maps"* di [`contact.tsx`](../client/src/pages/contact.tsx#L168) tidak punya `href` maupun `onClick`.
  - Tombol ikon `<Scan />` di [`verification.tsx`](../client/src/pages/verification.tsx#L104) tidak punya aksi maupun `aria-label`.
- **Link Mati `href="#"`:** Footer ([`Footer.tsx`](../client/src/components/layout/Footer.tsx#L28-L30), [baris 158–160](../client/src/components/layout/Footer.tsx#L158-L160)) untuk *Kebijakan Privasi*, *Syarat & Ketentuan*, *Peta Situs*, dan fallback medsos.

### 13. Data Hardcoded / Palsu Lintas Tenant (`copy.md` — *No Invented Proof/Data*)
Karena SINTA adalah sistem **multi-tenant**, data hardcoded berikut sangat berisiko menampilkan data salah bagi nagari lain:
- [`profile.tsx`](../client/src/pages/profile.tsx#L93-L105): Gambar eksternal `sumbar.jadesta.com` + badge `"24 Tahun Berdiri"` statis.
- [`monografi.tsx`](../client/src/pages/monografi.tsx#L77-L116): Unsplash URL + data dummy jarak & fasilitas (18 Posyandu, 8 Masjid, 31 Mushala, dll).
- [`public-data.tsx`](../client/src/pages/public-data.tsx#L35-L119): Fallback persentase pendidikan/pekerjaan, trend `+1.2%` / `+5%`, dan angka `12.5 km²` / `1.2 M`.
- [`contact.tsx`](../client/src/pages/contact.tsx#L157): Embed Google Maps hardcoded ke Kota Padang.
- [`projects.tsx`](../client/src/pages/projects.tsx#L58): Judul hardcoded `"Tahun Anggaran 2025"` (padahal tahun aktif 2026).
- [`not-found.tsx`](../client/src/pages/not-found.tsx#L11-L16): Teks template developer berbahasa Inggris (*"Did you forget to add the page to the router?"*).

### 14. Celah Aksesibilitas (`system.md` Access)
- **Skip-link rusak di 14 halaman dalam:** [`App.tsx`](../client/src/App.tsx#L115) mengarah ke `#main`, namun [`PageBackground.tsx`](../client/src/components/layout/PageBackground.tsx#L11) tidak menaruh `id="main"` pada `<main>`.
- **Heading spacer kosong:** [`facilities.tsx`](../client/src/pages/facilities.tsx#L105) memakai `<h2 ...>.</h2>` hanya untuk menyamakan tinggi kolom.
- **Tap target < 44px:** Tombol aksi kontak UMKM (`w-9 h-9` = 36px di [`UMKM.tsx`](../client/src/components/home/UMKM.tsx#L169-L193)) dan tombol ikon navbar (`ThemeToggle` 36px).

---

## 🎯 Rekomendasi Rencana Perbaikan Bertahap

Agar aman untuk production dan tidak merusak integrasi API `cms/public/`:

1. **Fase 1 — Quick Fix Kritis (P0, dampak langsung terasa):**
   - Ubah `Navbar` menjadi **opaque solid + 1px hairline** konsisten di semua rute (memperbaiki menu hilang di `infografis` & `news-detail` sekaligus memperbaiki `ThemeToggle`), dan pindahkan `Navbar`/`Footer` ke layout stabil agar tidak ikut bounce saat pindah rute.
   - Perbaiki bug hover tombol di `News.tsx` & `UMKM.tsx` (`hover:text-white`).
   - Kembalikan `accents.ts` agar memakai token `--cat-*` yang sudah terkalibrasi ≥4.5:1 (hapus `text-nagari-yellow` di permukaan terang).
   - Hapus `snap-y snap-mandatory`, `-mt-24` overlap di `Demografi.tsx`, dan `scroll-behavior: smooth` global.
   - Hapus auto-open paksa `AIServicePopup` di initial load (atau ubah jadi akses dari menu/section layanan tanpa memblokir layar) dan hilangkan `animate-ping` di `WhatsAppWidget`.
2. **Fase 2 — Penyatuan Design System (P1):**
   - Tetapkan **1 sistem warna & tombol** resmi Nagari-Portal (netral + 1 aksen utama yang tegas di Light & Dark mode), hapus semua sisa `#0b2023`, `#143236`, `#163c37`, `bg-nagari-red/50`, blur orbs, neon shadows, dan ungu/violet.
   - Naikkan semua micro-text `9px–11px` menjadi minimal `13px` (sentence case) dan body `16px`, hapus `font-light` di teks kecil, serta rapikan skala radius (`8/12/16px`).
   - Sederhanakan `Hero.tsx` (hilangkan auto-carousel agresif/duplikasi counter & kurangi tumpukan scrim) dan rapikan `Footer.tsx`.
3. **Fase 3 — Polish Komponen Halaman Dalam, Form & Data (P2):**
   - Perbaiki `services.tsx`, `profile.tsx`, `contact.tsx`, `facilities.tsx`, `projects.tsx`, `monografi.tsx`, `infografis.tsx`, `public-data.tsx`, `ppid.tsx`, `verification.tsx`, dan `not-found.tsx`.
   - Hubungkan tombol CTA mati (ke WhatsApp layanan / Google Maps dinamis), perbaiki form kontak (validasi + arahkan ke endpoint/WhatsApp/mailto yang jelas), bersihkan data dummy multi-tenant, dan lengkapi `id="main"` + tap target ≥44px.
