import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://doa-solat.netlify.app'),
  title: 'Doa Teduh — Adab, Zikir dan Doa',
  description: 'Baca rangkaian setelah salat, 38 doa pilihan, 13 fase, dan 99 Asmaul Husna.',
  manifest: '/teduh/manifest.webmanifest',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Next.js only provides the compatible root redirect. The actual reader
  // and all fonts/styles are provided by /teduh/index.html.
  return <html lang="id"><body>{children}</body></html>;
}
