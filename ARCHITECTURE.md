# Dashboard Doa – Arsitektur Sederhana

## Ringkasan
Dashboard Doa kini difokuskan sebagai katalog doa terkurasi dengan pengalaman membaca yang nyaman. Fitur utama:
- 77 doa dan dzikir autentik dengan teks Arab, latin, dan terjemahan lengkap.
- Urutan terstruktur yang diawali dzikir pembuka lalu kategori doa tematik.
- Kontrol tampilan (tema, ukuran font Arab, transliterasi, terjemahan, sumber).
- Pencarian cepat dan filter kategori dengan penyimpanan preferensi lokal.
- Reorder manual menggunakan tombol naik/turun yang tersimpan di browser.

## Struktur Proyek
```
src/
├── app/
│   ├── globals.css      # Styling global + Tailwind
│   ├── layout.tsx       # Root layout, setup font & metadata
│   └── page.tsx         # Halaman utama Dashboard Doa
├── components/
│   ├── PrayerCardView.tsx  # Komponen kartu doa beserta interaksi
│   └── ui/
│       └── Icon.tsx        # Pembungkus ikon Lucide
├── data/
│   └── initialPrayers.ts   # Sumber data 77 doa terurut
├── lib/
│   └── storage.ts          # Utilitas localStorage + sinkronisasi tab
└── types/
    └── index.ts            # Definisi tipe Item & related types
```

## Alur Data
1. **Seed Data** – `initialPrayers.ts` dipakai saat pertama buka aplikasi atau saat versi data berubah (`DATA_VERSION`).
2. **Persistensi Lokal** – `lib/storage.ts` memuat/menyimpan doa, preferensi tampilan, dan tema ke localStorage.
3. **Normalisasi & Urutan** – `page.tsx` melakukan sort berdasarkan `CURATED_ORDER` sehingga UI selalu konsisten.
4. **Interaksi Pengguna** – Semua aksi (pencarian, filter, toggle tampilan, reorder) dikelola langsung di `page.tsx` dan diteruskan ke `PrayerCardView` untuk render.

## Tumpukan Teknologi
- **Next.js 14** (App Router, client components untuk interaksi UI).
- **TypeScript** dengan mode ketat.
- **Tailwind CSS** untuk styling responsif & dark mode.
- **Lucide React** untuk ikon.
- **localStorage** sebagai mekanisme persistensi ringan.

Tidak ada lagi dependensi AI, audio, IndexedDB, atau service worker. Pendekatan ini membuat kodebase ringkas, mudah dipelihara, dan cepat di-build.
