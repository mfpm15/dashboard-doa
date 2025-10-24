# Deployment Guide - Islamic Prayer Dashboard

## Netlify Deployment Instructions

Panduan langkah demi langkah untuk deploy Islamic Prayer Dashboard ke Netlify dengan semua fitur tetap berfungsi.

### Prerequisites

1. **GitHub Account**: Repository sudah di-push ke GitHub ✅
2. **Netlify Account**: Daftar di [netlify.com](https://netlify.com)
3. **OpenRouter API Key**: Siapkan API key OpenRouter (simpan secara aman)

### Step-by-Step Deployment

#### 1. Login ke Netlify

1. Buka [app.netlify.com](https://app.netlify.com)
2. Login dengan akun GitHub Anda

#### 2. Import Project dari GitHub

1. **Klik "Add new site"** → **"Import an existing project"**
2. **Pilih "Deploy with GitHub"**
3. **Authorize Netlify** untuk akses GitHub repositories
4. **Pilih repository "dashboard-doa"**

#### 3. Configure Deployment Settings

Sesuai interface Netlify yang Anda lihat:

```
Team: mfpm15's team
Project name: dashboard-doa (atau biarkan auto-generate)
Branch to deploy: main ✅
Base directory: (kosongkan) ✅
Build command: npm run build ✅
Publish directory: .next ✅
Functions directory: netlify/functions ✅
```

**PENTING**: Netlify sudah auto-detect Next.js, jadi settings di atas sudah benar!

#### 4. Add Environment Variables

**SEBELUM** klik "Deploy dashboard-doa", scroll ke bagian **"Environment variables"**:

1. **Klik "Add environment variables"**
2. **Set configuration:**
   - **Contents of .env file**: KOSONGKAN (jangan isi)
   - **Secret**: ✅ CENTANG (karena berisi API key)
   - **Scopes**: Biarkan "All scopes" ✅
   - **Deploy contexts**: Biarkan "All deploy contexts" ✅

3. **Masukkan 4 variables ini satu per satu:**

**Variable 1 (PALING PENTING):**
```
Key: OPENROUTER_API_KEY
Value: [PASTE API KEY ANDA – JANGAN DIBAGIKAN DI TEMPAT LAIN]
Secret: ✅ YA
```

**Variable 2:**
```
Key: OPENROUTER_SITE_URL
Value: https://dashboard-doa.netlify.app
Secret: ❌ TIDAK
```

**Variable 3:**
```
Key: OPENROUTER_SITE_NAME
Value: Islamic Prayer Dashboard
Secret: ❌ TIDAK
```

**Variable 4:**
```
Key: NEXT_PRIVATE_TARGET
Value: server
Secret: ❌ TIDAK
```

**⚠️ CATATAN PENTING**:
- **OPENROUTER_API_KEY** HARUS diset sebagai "Secret" ✅
- Yang lain bisa non-secret
- Jangan pernah commit nilai API key ke repository atau dokumentasi
- Setelah deploy selesai, URL mungkin berubah, update `OPENROUTER_SITE_URL` nanti
- Opsional: set `PRIMARY_MODEL` jika ingin memakai model selain default `tngtech/deepseek-r1t2-chimera:free`

#### 5. Deploy Website

1. **Review semua settings** yang sudah dikonfigurasi
2. **Pastikan 4 environment variables** sudah dimasukkan dengan benar
3. **Klik "Deploy dashboard-doa"** (tombol biru di bawah)
4. **Tunggu proses build** selesai (sekitar 2-3 menit)

#### 6. Verifikasi Deployment

Setelah build selesai:

1. **Klik URL site** yang muncul (biasanya format: https://random-name.netlify.app)
2. **Test fitur-fitur utama:**
   - ✅ Prayer cards tampil normal
   - ✅ Pencarian dan filter kategori berfungsi
   - ✅ Urutan doa tersimpan setelah menekan tombol panah
   - ✅ AI chat merespons tanpa error (tampilkan jawaban bermakna)

3. **Jika AI chat masih error** (seperti 404 atau "Page not found"):

   **Troubleshooting Steps:**

   a) **Check Environment Variables**:
   - Go to Site settings → Environment variables
   - Pastikan `OPENROUTER_API_KEY` ada dan diset sebagai Secret
   - Pastikan 4 variables lengkap sesuai panduan

   b) **Check Function Logs**:
   - Go to Site overview → Functions tab
   - Cari function `ai-chat` atau serupa
   - Check logs untuk error messages

   c) **Trigger New Deploy**:
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Konfigurasi baru mungkin butuh redeploy

   d) **Check Build Logs**:
   - Di deploy logs, pastikan API routes ter-detect:
   - Cari baris `ƒ /api/ai/chat` di build output
   - Jika tidak ada, ada masalah dengan Next.js config

   e) **Common Fixes for Client-Side Errors**:
   - Error "Application error: a client-side exception has occurred"
   - Biasanya disebabkan oleh hydration mismatch atau missing dependencies
   - Site sudah diperbaiki dengan ErrorBoundary dan hydration fixes
   - Jika masih error, cek browser console untuk detail error

   f) **Force Redeploy with Clear Cache**:
   - Go to Site settings → Build & deploy
   - Click "Clear cache and deploy site"
   - Ini akan rebuild dari clean state

#### 7. Update Site URL (Optional)

Jika ingin custom domain atau update OPENROUTER_SITE_URL:

1. **Go to Site settings** → **Domain management**
2. **Update custom domain** (jika ada)
3. **Update environment variable** `OPENROUTER_SITE_URL` dengan URL final

#### 6. Netlify Plugin (Otomatis)

File `netlify.toml` sudah dikonfigurasi dengan plugin Next.js yang diperlukan:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 5. Deploy and Verify

1. **Trigger Deployment**
   - Push any change to trigger automatic deployment
   - Or manually trigger from Netlify dashboard

2. **Verify Features**
   - ✅ Daftar doa tampil dengan urutan yang sama seperti data awal
   - ✅ Pencarian dan filter kategori merespons sesuai kata kunci
   - ✅ Tombol panah mengubah urutan doa dan tetap tersimpan setelah refresh
   - ✅ AI chat memberikan jawaban yang relevan (tanpa error/`[]`)
   - ✅ Mode tema dan toggle transliterasi/terjemahan berfungsi

### Features Preserved in Deployment

- **Prayer Library**: 60+ doa autentik dengan teks Arab, latin, terjemahan, dan sumber.
- **Personal Order**: Urutan doa tersimpan lokal sehingga setiap pengguna memiliki susunan pribadi.
- **Display Controls**: Pengaturan ukuran huruf Arab, transliterasi, dan terjemahan disimpan antar sesi.
- **AI Assistant**: Integrasi OpenRouter dengan model default `tngtech/deepseek-r1t2-chimera:free` untuk menjawab pertanyaan seputar doa.

### Troubleshooting

#### API Key Issues
If AI chat doesn't work:
1. Verify environment variables in Netlify dashboard
2. Check API key validity at [openrouter.ai](https://openrouter.ai)
3. Review function logs in Netlify dashboard

#### Build Failures
Common solutions:
1. Check Node.js version (uses latest LTS)
2. Clear Netlify cache and redeploy
3. Verify all dependencies in `package.json`

#### Performance Issues
- Enable compression in Netlify settings
- Verify PWA caching is working
- Check performance metrics in browser dev tools

### Custom Domain (Optional)

To use a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update `OPENROUTER_SITE_URL` environment variable

### Monitoring and Analytics

Consider adding:
1. **Netlify Analytics**: Built-in traffic analytics
2. **Function Logs**: Monitor API usage
3. **Performance Monitoring**: Core Web Vitals tracking

### Backup and Recovery

- **Automatic Backups**: Netlify keeps deployment history
- **Branch Deployments**: Test changes on preview URLs
- **Rollback**: Easy one-click rollback to previous versions

## Success Indicators

After deployment, verify these work correctly:

1. **Homepage loads** with prayer times
2. **AI chat responds** without showing "[]"
3. **Audio playback** works with synchronization
4. **Voice commands** recognize speech
5. **Mobile gestures** respond to touch
6. **PWA install** prompt appears
7. **Offline mode** functions when network is disabled

## Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test API endpoints manually
4. Review browser console for errors

Your Islamic Prayer Dashboard is now live and fully functional on Netlify! 🚀
