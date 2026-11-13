# Doa Teduh

Website untuk membaca doa dengan tenang di HP, menggunakan antarmuka **Doa Teduh v3.4 asli**. Aplikasi utama adalah HTML/CSS/JavaScript ringan di `public/teduh/`, bukan halaman dashboard Next.js lama.

**Live:** https://doa-solat.netlify.app/teduh/index.html

## Yang dipertahankan

- Adab berdoa, panduan berdoa, dan rangkaian setelah salat (9 tahap ringkas / 19 tahap lengkap).
- Penghitung zikir 33×, progres, bookmark, pencarian, mode fokus, 3 palet warna, mode gelap, serta pengaturan huruf Arab/Latin/arti.
- **38 doa pilihan**, **13 fase**, **99 Asmaul Husna**.
- Impor HTML v3.4 asli melalui `/teduh/import.html` — dibaca lokal di browser, tanpa unggah file.
- Service worker PWA untuk membaca offline; online memprioritaskan versi terkini.

## Struktur aktif

```
public/teduh/                          # Aplikasi mobile v3.4 asli
  index.html app.js style.css          # UI/UX dan pembaca
  extras.js guide.js salat.js          # Bacaan pilihan dan alur
  import.html import.js                # Impor naskah pribadi lokal
  private-loader.js                    # Memuat data browser saat tersedia
  sw.js manifest.webmanifest icon.svg  # Offline/PWA
src/content/doa-komprehensif/parts/
  part-01.ts .. part-13.ts             # Sumber 13 fase (sudah publik)
scripts/
  generate-teduh-data.mjs              # Membuat /teduh/data.js saat build
  write-deploy-meta.mjs                # Commit SHA untuk verifikasi Netlify
  validate-reader.mjs                  # Menguji 13/99/38 dan 9/19 langkah
src/app/page.tsx                       # Redirect root ke /teduh/index.html
src/app/layout.tsx                     # Shell Next.js minimal
.github/workflows/                    # CI dan verifikasi deployment
netlify.toml                            # Konfigurasi build Netlify aktif
```

Konfigurasi Next.js yang masih dibutuhkan sengaja dipertahankan karena **Netlify production site yang terpasang menggunakan adapter Next.js**. Migrasi statis sepenuhnya tidak digabungkan karena preview Netlify gagal pada konfigurasi site tersebut. Kode dashboard lama, komponen dan halaman yang tidak digunakan dihapus untuk mengurangi kerumitan.

## Menjalankan lokal

Prasyarat: Node 22, npm.

```bash
npm ci
npm run build
npm run validate
npm run dev
```

Buka http://localhost:3000/ (akan diarahkan ke pembaca asli).

## Otomatisasi Netlify

Push ke `main` memicu auto-deploy Netlify. GitHub Actions memeriksa SHA aktual di `/deploy-meta.json` dan melakukan smoke-test terhadap `/teduh/index.html`, `app.js`, `data.js`, `style.css`, serta halaman impor. Build lokal saja tidak dianggap sebagai bukti deployment berhasil.

## Privasi dan kesahihan

Naskah pribadi dari HTML offline **tidak boleh dikomit** ke repository publik. Impor melalui browser disimpan hanya pada perangkat pengguna (localStorage). Perhatikan bahwa file fase lama yang sudah berada di repository publik dapat mengandung rincian pribadi; penghapusan file dari commit baru saja tidak menghapus riwayat Git.

Setiap doa memiliki sumber yang perlu dinilai sesuai konteks. Rangkaian setelah salat merupakan panduan praktis dari sejumlah bacaan, bukan satu tata cara wajib yang diriwayatkan utuh. Audit seluruh lafal dan rujukan pada 13 fase belum lengkap.

## Pemulihan

Titik pemulihan sebelum pembersihan: [`backup/pre-static-cleanup-2026-11-13`](https://github.com/mfpm15/dashboard-doa/tree/backup/pre-static-cleanup-2026-11-13). Jangan menghapus branch tersebut sebelum memverifikasi pembaruan produksi.
