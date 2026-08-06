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

  async headers() {
    return [
      {
        // Berlaku untuk semua route, termasuk /admin/*
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Khusus halaman admin: CSP lebih ketat lagi
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
