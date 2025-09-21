import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard Doa - Islamic Prayer & Dhikr Manager',
    template: '%s | Dashboard Doa'
  },
  description: 'Aplikasi modern untuk mengelola doa dan zikir Islami dengan fitur audio AI-generated, pencarian canggih, dan sinkronisasi teks. Koleksi lengkap 24+ doa autentik dari Al-Qur\'an dan Hadis Shahih.',
  keywords: [
    'doa islam', 'zikir', 'prayer', 'dhikr', 'islamic', 'quran', 'hadith',
    'audio quran', 'terjemahan', 'transliterasi', 'arab', 'muslim app',
    'PWA', 'AI assistant', 'local-first'
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
    description: 'Aplikasi modern untuk mengelola doa dan zikir Islami dengan fitur audio AI-generated dan AI assistant',
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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