/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  serverExternalPackages: ['@supabase/supabase-js', '@sparticuz/chromium', 'puppeteer-core'],

  // Hanya digunakan saat development (npm run dev)
  allowedDevOrigins: [
    '192.168.1.8',
    '10.18.118.146',
    '192.168.1.7',
    'localhost',
    '127.0.0.1',
  ],

  // Kita amankan hal-hal basic saja, JANGAN pakai CSP default-src 'self' di Next.js 
  // tanpa konfigurasi nonce yang rumit, karena akan mematikan fungsi React/tombol.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Mencegah clickjacking
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;