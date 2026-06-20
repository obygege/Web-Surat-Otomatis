import Script from 'next/script';

export const metadata = {
  title: 'Surat Otomatis - Premium Automatic Letters',
  description: 'Layanan administrasi digital cerdas dengan AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Aturan Next.js: Semua Script "beforeInteractive" WAJIB di dalam <head> */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        {/* Script inline di Next.js wajib menggunakan dangerouslySetInnerHTML */}
        <Script id="tailwind-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    futura: { bg: '#f8fafc', card: '#ffffff', primary: '#0284c7', accent: '#9333ea', neon: '#06b6d4', text: '#0f172a', muted: '#64748b' }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-slate-50 text-slate-900" suppressHydrationWarning>

        {/* Script afterInteractive aman ditaruh di dalam body */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          strategy="afterInteractive"
        />

        {children}
      </body>
    </html>
  );
}