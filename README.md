# Doa Teduh

Website doa dan zikir ringan, nyaman dibaca dari ponsel, tanpa iklan dan tanpa framework runtime. Antarmuka berlandaskan file **Doa Teduh v3.4** asli, bukan desain ulang.

**Website:** https://doa-solat.netlify.app

## Fitur

- Adab berdoa dan tiga alur terpandu: umum, setelah salat, dan ketika hujan.
- Rangkaian setelah salat dalam satu halaman, mode ringkas (9 tahap) atau lengkap (19 tahap), termasuk penghitung zikir 33 kali.
- Pustaka 38 bacaan pilihan, 13 fase, dan 99 Asmaul Husna.
- Arab, Latin, dan terjemahan, pengaturan ukuran huruf, mode gelap, dan tiga palet warna.
- Penanda selesai, bookmark, pencarian, navigasi kembali lengket, serta mode offline/PWA.
- Impor file HTML v3.4 asli **hanya di browser** untuk membaca munajat pribadi.

> Sumber doa berbeda-beda. Sebuah susunan bacaan dalam aplikasi merupakan panduan praktis, bukan klaim bahwa urutannya diwajibkan dalam satu riwayat. Audit semua kutipan dalam 13 fase masih perlu dilanjutkan.

## Struktur repository

```
public/teduh/                         # Aplikasi statis asli v3.4
  index.html, app.js, style.css       # Pembaca dan antarmuka
  extras.js, guide.js, salat.js      # Pilihan, alur, rangkaian
  import.html, import.js             # Impor naskah pribadi secara lokal
  private-loader.js                  # Muat data yang diimpor dari browser
  sw.js, manifest.webmanifest        # PWA / offline
src/content/doa-komprehensif/parts/
  part-01.ts ... part-13.ts          # Sumber 13 fase yang sudah ada di repository
scripts/
  generate-teduh-data.mjs            # Transformasi sumber menjadi data.js
  write-deploy-meta.mjs              # SHA commit untuk verifikasi deploy
  verify-static.mjs                  # Integrity test tanpa dependency
  build.mjs                          # Satu proses build
.github/workflows/ci.yml             # Pemeriksaan statis
.github/workflows/deploy.yml         # Validasi produksi Netlify
netlify.toml                          # Publish dir dan cache/redirect
```

Tidak memerlukan `npm install`, Next.js, React, atau bundler untuk situs publik.

## Menjalankan secara lokal

Prasyarat: Node.js 22 atau lebih baru.

```bash
node scripts/build.mjs
python3 -m http.server 8000 --directory public/teduh
```

Buka http://localhost:8000/. Gunakan server HTTP lokal agar service worker dan pembacaan script dapat diuji dengan benar. Untuk hanya memeriksa data, jalankan `node scripts/verify-static.mjs` setelah build.

## Deploy otomatis Netlify

Netlify sudah dikaitkan dengan repository ini. Konfigurasi **netlify.toml** menetapkan:

- Build: `node scripts/build.mjs`
- Publish directory: `public/teduh`
- Production branch: `main` melalui konfigurasi site Netlify.

Setelah push ke main, integrasi Git Netlify membangun otomatis. GitHub Actions kemudian memverifikasi bahwa `/deploy-meta.json` menayangkan SHA commit yang sama serta memeriksa aset asli. URL lama `/teduh/index.html` tetap diarahkan secara kompatibel ke aplikasi yang sama.

Titik pemulihan sebelum pembersihan: branch `backup/pre-static-cleanup-2026-11-13`.

## Konten pribadi dan keamanan

**Jangan commit file HTML offline v3.4 pribadi** atau data impor. Aplikasi publik menggunakan koleksi yang dibangun dari 13 file fase yang sudah ada di repository. Jika ingin melihat seluruh naskah pribadi persis seperti versi offline, buka `/import.html` dan impor file secara lokal; file tidak dikirim melalui jaringan. Data tersimpan di localStorage browser dan dapat dihapus melalui halaman impor.

**Perhatian:** sebagian sumber doa fase lama yang sudah berada dalam repository publik mungkin mengandung rincian pribadi. Membersihkan file dari commit terbaru tidak menghapus riwayat Git. Jika memerlukan kerahasiaan lebih kuat, lakukan audit sumber dan riwayat Git sebelum mempublikasikan atau membagikan repository lebih luas.
