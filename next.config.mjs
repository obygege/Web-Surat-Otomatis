/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  serverExternalPackages: ['@supabase/supabase-js', '@sparticuz/chromium', 'puppeteer-core'],

  outputFileTracingIncludes: {
    '/api/pdf/route': ['./node_modules/@sparticuz/chromium/**/*'],
  },

  // Hanya digunakan saat development (npm run dev)
  allowedDevOrigins: [
    '192.168.1.8',
    '10.18.118.146',
    '192.168.1.7',
    'localhost',
    '127.0.0.1',
  ],
};

export default nextConfig;