import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard Doa - Kumpulan Doa & Zikir',
  description: 'Dashboard lokal-first untuk mengelola kumpulan doa dan zikir dengan fitur audio, AI assist, dan pencarian semantik',
  manifest: '/manifest.json',
  themeColor: '#14b8a6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dashboard Doa'
  }
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
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}