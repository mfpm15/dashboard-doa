/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Old links from the superseded dashboard all lead to the v3.4 reader.
  async redirects() {
    return [
      { source: '/koleksi', destination: '/teduh/index.html', permanent: false },
      { source: '/koleksi/:path*', destination: '/teduh/index.html', permanent: false },
      { source: '/setelah-salat', destination: '/teduh/index.html', permanent: false },
      { source: '/legacy', destination: '/teduh/index.html', permanent: false },
    ];
  },
};
module.exports = nextConfig;
