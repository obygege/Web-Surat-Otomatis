/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan static generation untuk halaman yang butuh data
  output: 'standalone', 
  experimental: {
    // Membantu mencegah build hang pada project yang kompleks
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;