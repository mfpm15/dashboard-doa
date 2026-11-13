import type { Metadata } from 'next';
import { Inter, Noto_Naskh_Arabic, Amiri } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

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
  metadataBase: new URL('https://doa-solat.netlify.app'),
  title: {
    default: 'Doa Teduh — Panduan Doa dan Zikir',
    template: '%s | Doa Teduh'
  },
  description: 'Baca zikir setelah salat secara berurutan, doa pilihan dan perjalanan 13 fase dengan Arab, transliterasi, serta terjemahan.',
  keywords: [
    'doa islam', 'zikir', 'prayer', 'dhikr', 'islamic', 'quran', 'hadith',
    'audio quran', 'terjemahan', 'transliterasi', 'arab', 'muslim app',
    'PWA', 'local-first'
  ],
  authors: [{ name: 'Dashboard Doa Team' }],
  creator: 'Dashboard Doa Team',
  publisher: 'Doa Teduh',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Doa Teduh',
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
    url: 'https://doa-solat.netlify.app',
    siteName: 'Doa Teduh',
    title: 'Doa Teduh — Panduan Doa dan Zikir',
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
    title: 'Doa Teduh — Panduan Doa dan Zikir',
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
        <ServiceWorkerRegister />
        <div id="modal-root" />
        <div id="notification-root" />
      </body>
    </html>
  );
}
