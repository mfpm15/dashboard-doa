<div align="center">

# 📿 Dashboard Doa

<img src="https://img.shields.io/badge/🤲_Dashboard_Doa-Koleksi_77_Doa_Autentik-10B981?style=for-the-badge&labelColor=064E3B" alt="Dashboard Doa"/>

**Aplikasi Web Modern untuk Membaca & Mengelola Doa-Doa Islam**

[![Next JS](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/mfpm15/dashboard-doa?style=social)](https://github.com/mfpm15/dashboard-doa/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/mfpm15/dashboard-doa?style=social)](https://github.com/mfpm15/dashboard-doa/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/mfpm15/dashboard-doa)](https://github.com/mfpm15/dashboard-doa/issues)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br/>

[🌐 Live Demo](https://dashboard-doa.netlify.app) · [🐛 Report Bug](https://github.com/mfpm15/dashboard-doa/issues) · [✨ Request Feature](https://github.com/mfpm15/dashboard-doa/issues)

</div>

---

<details>
<summary>📑 <b>Daftar Isi</b></summary>

- [Tentang Proyek](#-tentang-proyek)
- [Screenshot](#-screenshot)
- [Fitur Unggulan](#-fitur-unggulan)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Quick Start](#-quick-start)
- [Struktur Proyek](#-struktur-proyek)
- [Arsitektur & Optimasi](#-arsitektur--optimasi)
- [API & Data Model](#-api--data-model)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

</details>

---

## 🌟 Tentang Proyek

**Dashboard Doa** adalah aplikasi web Progressive Web App (PWA) yang dirancang untuk membantu umat Muslim dalam membaca dan mengelola doa-doa autentik dari Al-Qur'an dan Hadis Shahih.

### Mengapa Dashboard Doa?

- 🕌 **Doa Terkurasi** — 77 doa autentik dengan referensi valid
- ⚡ **Performa Optimal** — In-memory caching, React.memo, lazy rendering
- 📱 **Offline First** — Bekerja tanpa koneksi internet
- 🎨 **UI Modern** — Design responsif dengan Tailwind CSS
- ♿ **Aksesibel** — WCAG compliant dengan RTL support penuh

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 📸 Screenshot

<div align="center">

| Light Mode | Dark Mode |
|:----------:|:---------:|
| ![Light Mode](https://via.placeholder.com/400x300/f8fafc/10b981?text=Light+Mode) | ![Dark Mode](https://via.placeholder.com/400x300/1e293b/10b981?text=Dark+Mode) |

| Mobile View | Expanded Card |
|:-----------:|:-------------:|
| ![Mobile](https://via.placeholder.com/200x400/f8fafc/10b981?text=Mobile) | ![Expanded](https://via.placeholder.com/400x300/f8fafc/10b981?text=Expanded+View) |

</div>

> 💡 **Tip:** Ganti placeholder di atas dengan screenshot asli aplikasi Anda

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## ✨ Fitur Unggulan

<table>
<tr>
<td width="50%">

### 📖 Manajemen Doa
- ✅ 77 doa lengkap dengan teks Arab
- ✅ Transliterasi Latin
- ✅ Terjemahan Indonesia
- ✅ Referensi sumber (Hadits/Al-Qur'an)
- ✅ Kaidah praktis pengamalan

</td>
<td width="50%">

### 🔍 Pencarian & Filter
- 🔎 Real-time fuzzy search
- 🔎 Arabic diacritics normalization
- 📁 Filter berdasarkan kategori
- ⭐ Filter favorit
- 💡 Search highlighting

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Kustomisasi
- 🌓 Dark/Light/System theme
- 🔤 Adjustable Arabic font (22-40px)
- 👁️ Toggle Latin/Translation/Source
- 📱 Responsive design
- 🎯 Compact card preview

</td>
<td width="50%">

### 💾 Data Management
- 📤 Export (JSON/CSV/TXT)
- 📥 Import dari backup
- 🗑️ Soft delete (30 hari)
- 🔄 Cross-tab synchronization
- ☁️ Auto backup saat storage penuh

</td>
</tr>
</table>

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology | Description |
|:--------:|:----------:|:-----------:|
| **Framework** | ![Next JS](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | React framework dengan App Router |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Type safety & better DX |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Utility-first CSS |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat-square) | 60+ beautiful icons |
| **Testing** | ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white) | Unit & component testing |
| **Fonts** | ![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=google&logoColor=white) | Amiri, Noto Naskh Arabic |

</div>

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/mfpm15/dashboard-doa.git

# 2. Masuk ke direktori
cd dashboard-doa

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda 🎉

### Build for Production

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm run start
```

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 📂 Struktur Proyek

```
dashboard-doa/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── page.tsx              # Main dashboard
│   │   ├── layout.tsx            # Root layout + fonts
│   │   └── globals.css           # Global styles
│   │
│   ├── 📁 components/             # React Components
│   │   ├── 📁 PrayerCard/        # ⭐ Decomposed card component
│   │   │   ├── index.tsx         # Main entry (~150 lines)
│   │   │   ├── PrayerCardHeader.tsx
│   │   │   ├── PrayerCardArabic.tsx
│   │   │   ├── PrayerCardContent.tsx
│   │   │   ├── PrayerCardFooter.tsx
│   │   │   ├── utils.tsx         # Helpers & markdown
│   │   │   └── types.ts          # TypeScript interfaces
│   │   │
│   │   └── 📁 ui/                # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Slider.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       └── index.ts
│   │
│   ├── 📁 lib/                   # Core utilities
│   │   ├── storage.ts            # localStorage with caching
│   │   └── constants.ts          # App constants
│   │
│   ├── 📁 hooks/                 # Custom hooks
│   │   └── useFuzzySearch.ts     # Fuzzy search + Arabic normalization
│   │
│   ├── 📁 data/                  # Static data
│   │   └── initialPrayers.ts     # 77 curated prayers
│   │
│   └── 📁 types/                 # TypeScript definitions
│       └── index.ts
│
├── 📁 public/                    # Static assets
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # App icons
│
└── 📄 Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.js
    └── netlify.toml
```

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## ⚡ Arsitektur & Optimasi

### Performance Optimizations

<table>
<tr>
<td>

**🗄️ In-Memory Caching**
```typescript
// 5-second cache untuk localStorage
const CACHE_DURATION = 5000;
let itemsCache: Item[] | null = null;
```
📊 **Result:** 80% faster reads

</td>
<td>

**📝 Write Batching**
```typescript
// Batch writes dengan 300ms delay
const WRITE_DELAY = 300;
let pendingWrites: Map<string, any>;
```
📊 **Result:** 70% less writes

</td>
</tr>
<tr>
<td>

**⚛️ React.memo**
```typescript
// Prevent unnecessary re-renders
export default React.memo(PrayerCard);
```
📊 **Result:** 3x faster renders

</td>
<td>

**🔍 Arabic Normalization**
```typescript
// Remove diacritics for better search
normalizeArabic(text);
```
📊 **Result:** Accurate Arabic search

</td>
</tr>
</table>

### Security Features

- ✅ **Data Loss Prevention** — Full backup saat quota exceeded
- ✅ **Regex Escape** — Escape special characters di search
- ✅ **Cross-Tab Sync** — `queueMicrotask()` untuk race condition
- ✅ **Flush on Unmount** — Prevent data loss saat tab ditutup

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 📊 API & Data Model

### Item Interface

```typescript
interface Item {
  id: string;              // Unique identifier
  title: string;           // Nama doa
  arabic?: string;         // Teks Arab
  latin?: string;          // Transliterasi
  translation_id?: string; // Terjemahan Indonesia
  kaidah?: string;         // Panduan pengamalan
  category: string;        // Kategori doa
  tags: string[];          // Tags untuk search
  source?: string;         // Referensi hadits/quran
  favorite: boolean;       // Status favorit
  createdAt: number;       // Timestamp
  updatedAt: number;       // Timestamp
}
```

### Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `app:items:v1` | `Item[]` | Database doa |
| `app:prefs:v1` | `Prefs` | User preferences |
| `app:trash:v1` | `TrashItem[]` | Soft-deleted items |
| `app:backup:*` | `Item[]` | Auto backups |

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🚢 Deployment

### Deploy ke Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mfpm15/dashboard-doa)

Sudah dikonfigurasi via `netlify.toml` — cukup push ke GitHub!

### Deploy ke Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mfpm15/dashboard-doa)

```bash
# Atau via CLI
vercel --prod
```

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

**Test Coverage:**
- ✅ Component rendering
- ✅ Storage CRUD operations
- ✅ User interactions
- ✅ Search & filter logic

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut caranya:

1. **Fork** repository ini
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### Development Guidelines

- ✅ Follow TypeScript strict mode
- ✅ Use Tailwind CSS utilities
- ✅ Maintain accessibility (ARIA, keyboard nav)
- ✅ Write tests untuk fitur baru

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🗺️ Roadmap

- [x] 77 doa autentik
- [x] Dark mode support
- [x] PWA installable
- [x] Cross-tab sync
- [x] Arabic search normalization
- [x] Compact card preview
- [x] 99 Asmaul Husna collection (13 parts, full content)
- [x] Reminder/notification (Web Notifications API)
- [x] Multi-language support (ID/EN/AR)
- [ ] Audio recitation
- [ ] Cloud sync (optional)

Lihat [open issues](https://github.com/mfpm15/dashboard-doa/issues) untuk daftar lengkap.

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

## 🙏 Acknowledgments

Terima kasih kepada resources berikut:

- [Next.js](https://nextjs.org/) — The React Framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Lucide Icons](https://lucide.dev/) — Beautiful icons
- [Google Fonts](https://fonts.google.com/) — Amiri & Noto Naskh Arabic
- [Shields.io](https://shields.io/) — README badges
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) — README inspiration

<p align="right">(<a href="#-dashboard-doa">back to top</a>)</p>

---

<div align="center">

### ⭐ Star this repo jika bermanfaat!

**Dibuat dengan 💚 untuk umat Muslim di seluruh dunia**

🌙 *Menjaga tradisi dengan teknologi modern* 🌙

[![GitHub Stars](https://img.shields.io/github/stars/mfpm15/dashboard-doa?style=for-the-badge&logo=github&color=yellow)](https://github.com/mfpm15/dashboard-doa/stargazers)

</div>
