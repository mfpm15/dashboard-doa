import type { Metadata } from 'next';
import { Inter, Noto_Naskh_Arabic, Amiri } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-naskh-arabic',
  display: 'swap'
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Dashboard Doa - Islamic Prayer & Dhikr Manager',
    template: '%s | Dashboard Doa'
  },
  description: 'Aplikasi modern untuk mengelola doa dan zikir Islami dengan fitur audio, pencarian canggih, dan sinkronisasi teks. Koleksi lengkap 24+ doa autentik dari Al-Qur\'an dan Hadis Shahih.',
  keywords: [
    'doa islam', 'zikir', 'prayer', 'dhikr', 'islamic', 'quran', 'hadith',
    'audio quran', 'terjemahan', 'transliterasi', 'arab', 'muslim app',
    'PWA', 'local-first'
  ],
  authors: [{ name: 'Dashboard Doa Team' }],
  creator: 'Dashboard Doa Team',
  publisher: 'Dashboard Doa',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dashboard Doa',
    startupImage: [
      {
        url: '/icons/icon-512x512.png',
        media: '(device-width: 768px) and (device-height: 1024px)'
      }
    ]
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://dashboard-doa.vercel.app',
    siteName: 'Dashboard Doa',
    title: 'Dashboard Doa - Islamic Prayer & Dhikr Manager',
    description: 'Aplikasi modern untuk mengelola doa dan zikir Islami dengan fitur audio yang kaya dan pencarian cerdas',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dashboard Doa - Islamic Prayer Manager'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard Doa - Islamic Prayer & Dhikr Manager',
    description: 'Aplikasi modern untuk mengelola doa dan zikir Islami',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  category: 'education'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${notoNaskhArabic.variable} ${amiri.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
        <div id="modal-root" />
        <div id="notification-root" />
      </body>
    </html>
  );
}
