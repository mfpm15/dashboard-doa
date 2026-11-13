# Doa Teduh

Website untuk membaca doa dari HP, menggunakan antarmuka **Doa Teduh v3.4 asli**.

**Website:** https://doa-solat.netlify.app/teduh/index.html

## Isi lengkap yang sudah langsung tersedia

- 13 fase dan 126 bagian bacaan dari kedua dokumen doa komprehensif.
- 99 Asmaul Husna dengan 101 bagian bacaan (dua variasi untuk nomor 34 dan 35).
- 7.578 blok konten, termasuk doa dan hajat pribadi lengkap.
- 38 doa pilihan, termasuk munajat pribadi ringkas.
- Rangkaian setelah salat 9/19 tahap, penghitung 33 kali, pencarian, bookmark, ukuran huruf, serta PWA offline.

## Source of truth

`public/teduh/data.js` dan `public/teduh/extras.js` berisi teks asli dari file HTML Doa Teduh v3.4 yang diberikan pemilik. Data ini **tidak dihasilkan ulang** saat build Netlify. Perubahan doa harus dilakukan dengan mengedit file tersebut; CI memvalidasi kelengkapannya.

```
public/teduh/
  index.html app.js style.css
  data.js extras.js
  guide.js salat.js
  sw.js manifest.webmanifest icon.svg
scripts/
  validate-reader.mjs write-deploy-meta.mjs
src/app/
  page.tsx layout.tsx viewport.ts
```

Next.js masih dipakai sebagai shell redirect karena adaptor Netlify aktif memerlukannya. Bacaan dan UI utama merupakan aplikasi statis ringan.

## Pengembangan dan deployment

Node.js 22 diperlukan.

```bash
npm ci
npm run build
npm run validate
npm run dev
```

Push ke `main` memicu Netlify otomatis. GitHub Actions memeriksa SHA commit produksi serta berkas UI dan doa lengkap.

## Privasi

**Pemilik secara eksplisit mengizinkan teks doa dan hajat pribadinya diterbitkan pada repository publik ini.** Artinya, konten dapat diakses, diunduh, dicari, dan disalin publik. Penghapusan file pada commit baru tidak menghapus isi dari riwayat Git. Jangan tambahkan kata sandi, token, nomor identitas, atau informasi rahasia lain.

## Validasi dalil

Isi dipertahankan sesuai file asli, bukan ditulis ulang atau diklaim telah sahih seluruhnya. Pemeriksaan sumber, lafal dan penilaian hadis pada 13 fase masih belum tuntas. Urutan doa setelah salat merupakan panduan praktis, bukan satu tata cara wajib.

## Pemulihan

Branch `backup/pre-static-cleanup-2026-11-13` tersedia sebagai titik pemulihan sebelum pembersihan lama.
