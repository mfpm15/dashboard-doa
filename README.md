# 🤲 Dashboard Doa - Islamic Prayer & Dhikr Manager

<div align="center">

![Dashboard Doa Logo](https://img.shields.io/badge/🤲-Dashboard_Doa-4CAF50?style=for-the-badge&labelColor=2E7D32)

**Aplikasi Modern untuk Mengelola Doa dan Zikir Islami**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)](https://web.dev/progressive-web-apps/)

[✨ Demo Live](https://dashboard-doa.vercel.app) • [📖 Dokumentasi](./docs) • [🚀 Quick Start](#quick-start)

</div>

---

## 🌟 Overview

**Dashboard Doa** adalah aplikasi web modern yang dirancang khusus untuk membantu umat Muslim dalam mengelola, mempelajari, dan mengamalkan doa-doa serta zikir yang autentik berdasarkan Al-Qur'an dan Hadis Shahih.

### ✨ Fitur Utama

| 🎯 **Fitur** | 📝 **Deskripsi** |
|-------------|------------------|
| 🤲 **Koleksi Doa Lengkap** | 24+ doa dan zikir dari sumber autentik (Al-Qur'an & Hadis Shahih) |
| 🎵 **Audio AI-Generated** | Generate audio untuk teks Arab, Latin, dan Terjemahan |
| 🔍 **Pencarian Canggih** | Search berdasarkan judul, kategori, tag, dan isi doa |
| 🎨 **Tipografi Arab** | Font Arab yang indah dengan kontrol ukuran dan line-height |
| 🌙 **Dark/Light Mode** | Theme system dengan dukungan system preference |
| 💾 **Local-First Storage** | Data tersimpan lokal dengan sinkronisasi antar tab |
| 📱 **PWA Ready** | Install sebagai aplikasi native di perangkat |
| 🤖 **AI Assistant** | Bantuan AI untuk pertanyaan seputar doa dan Islam |
| 📤 **Import/Export** | Backup dan restore data dalam format JSON, CSV, TXT |
| ♻️ **Recycle Bin** | Sistem trash untuk recovery doa yang terhapus |
| ⌨️ **Command Palette** | Navigasi cepat dengan Cmd/Ctrl+K |
| 🎭 **Text Synchronization** | Sinkronisasi audio dengan teks untuk belajar |

## 🛠 Tech Stack

- **Framework**: Next.js 14 dengan App Router
- **Styling**: Tailwind CSS dengan design tokens
- **Storage**: localStorage + IndexedDB
- **AI**: OpenRouter API dengan streaming
- **Audio**: Web Audio API dengan waveform visualization
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📁 Struktur Proyek

```
/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/ai/chat/     # AI proxy endpoint
│   │   ├── globals.css      # Tailwind + custom styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main dashboard
│   ├── components/          # React components
│   │   ├── ui/              # UI primitives
│   │   ├── audio/           # Audio components
│   │   ├── AppShell.tsx     # Main layout
│   │   ├── DataTable.tsx    # Item display
│   │   ├── FormModal.tsx    # Add/edit form
│   │   └── CommandPalette.tsx
│   ├── lib/                 # Utilities
│   │   ├── storage.ts       # localStorage ops
│   │   ├── audio/           # Audio utilities
│   │   └── ai/              # AI client & tools
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenRouter API key

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/doa-dashboard.git
cd doa-dashboard

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan OpenRouter API key Anda

# Start development server
npm run dev
```

### Environment Variables

```env
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_SITE_URL=https://your-site.example.com
OPENROUTER_SITE_NAME=Dashboard Doa
```

## 📖 Penggunaan

### Navigasi Dasar
- **Cmd/Ctrl+K**: Buka Command Palette
- **Cmd/Ctrl+N**: Tambah doa baru
- **Esc**: Tutup modal/palette

### Mengelola Doa
1. **Tambah Doa**: Klik tombol "+" atau gunakan Command Palette
2. **Edit**: Klik ikon edit pada kartu doa
3. **Cari**: Gunakan search bar atau Command Palette
4. **Filter**: Pilih kategori dan tag di sidebar

### Fitur Teks Arab
- Font otomatis: Noto Naskh Arabic, Amiri, Scheherazade New
- RTL support dengan `lang="ar"` dan `dir="rtl"`
- Kontrol ukuran font dan line-height
- Optimasi rendering dengan font-feature-settings

## 🎵 Audio System (Coming Soon)

### Features
- **Waveform Visualization**: Interactive peaks dengan click-to-seek
- **A-B Loop**: Set titik loop untuk latihan
- **Speed Control**: 0.5x - 1.75x dengan pitch preservation
- **Audio Processing**: Compressor + bass lift untuk clarity
- **Offline Cache**: IndexedDB storage untuk file audio
- **Text Sync**: Highlight teks Arab sesuai timing audio

### Supported Formats
- MP3, OPUS (recommended untuk ukuran file kecil)
- Drag-and-drop upload
- Recording user audio untuk latihan

## 🤖 AI Integration

### Tools Available
- `create_item`: Buat doa baru via natural language
- `search_items`: Pencarian dengan re-ranking semantik
- `analyze_text`: Parse teks campur → structured fields
- `suggest_categories_tags`: Auto-kategorisasi
- `quality_check`: Validasi kelengkapan dan konsistensi

### Example Usage
```
"Tambahkan doa istighfar dari HR Muslim"
"Cari doa untuk orang tua"
"Parse teks ini: [paste Arabic/Latin text]"
```

## 📊 Data Schema

### Item Structure
```typescript
interface Item {
  id: string;
  title: string;
  arabic?: string;          // Teks Arab
  latin?: string;           // Transliterasi
  translation_id?: string;  // Terjemahan Indonesia
  category: string;         // Kategori utama
  tags: string[];          // Tag untuk filtering
  source?: string;         // Referensi hadits/ayat
  favorite: boolean;       // Status favorit
  audio?: AudioTrack[];    // File audio (opsional)
  createdAt: number;
  updatedAt: number;
}
```

### Storage Keys
- `app:items:v1`: Array item doa
- `app:prefs:v1`: User preferences
- `app:trash:v1`: Soft-deleted items (30 hari)
- `app:draft:v1`: Auto-saved form draft

## 🔐 Privacy & Security

- **Local-first**: Semua data di browser, tidak ada server database
- **API Key Protection**: OpenRouter key hanya di server-side
- **No Analytics**: Tidak ada tracking pihak ketiga
- **Cross-tab Sync**: Storage event listener untuk sinkronisasi tab
- **Quota Management**: Auto-backup saat localStorage penuh

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## 📦 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard atau:
npx vercel --prod
```

### Environment Variables for Production
- `OPENROUTER_API_KEY`: Your OpenRouter key
- `OPENROUTER_SITE_URL`: Production URL
- `OPENROUTER_SITE_NAME`: App name

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind CSS utilities
- Maintain accessibility (ARIA labels, keyboard nav)
- Test across browsers and mobile devices
- Keep bundle size optimized

## 📋 Roadmap

### Milestone 2 (M2) - Audio Core
- [ ] IndexedDB audio storage
- [ ] Waveform component dengan peaks
- [ ] Audio player dengan controls
- [ ] A-B loop functionality
- [ ] Speed control dengan pitch preservation

### Milestone 3 (M3) - AI Integration
- [ ] Command palette dengan AI commands
- [ ] Streaming responses
- [ ] Tool calling untuk CRUD operations
- [ ] Semantic search dengan re-ranking

### Milestone 4 (M4) - Advanced Features
- [ ] AI Assist panel di form
- [ ] Text-to-audio synchronization
- [ ] Segment editor untuk timing
- [ ] Voice recording & search

### Milestone 5 (M5) - Import/Export
- [ ] JSON export dengan pretty formatting
- [ ] Import dengan diff preview
- [ ] Conflict resolution UI
- [ ] Batch operations

### Milestone 6 (M6) - PWA & Polish
- [ ] Service worker untuk offline
- [ ] App manifest untuk install
- [ ] Performance optimizations
- [ ] Accessibility audit
- [ ] Mobile responsiveness

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- [Noto Fonts](https://fonts.google.com/noto) untuk font Arab terbaik
- [OpenRouter](https://openrouter.ai) untuk AI API access
- [Lucide](https://lucide.dev) untuk icon set yang indah
- [Tailwind CSS](https://tailwindcss.com) untuk utility-first styling

---

**Dashboard Doa** - Menjaga tradisi dengan teknologi modern 🌙