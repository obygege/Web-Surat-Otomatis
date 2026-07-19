import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Pembuat Surat Otomatis',
  description: 'Layanan administrasi digital cerdas dengan AI',
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  metadataBase: new URL("https://suratotomatis.com"),

  title: {
    default: "Pembuat Surat Otomatis - Futura Link",
    template: "%s | Futura Docs",
  },

  description:
    "Buat surat resmi secara otomatis menggunakan AI. Mendukung lebih dari 60 template surat seperti surat lamaran kerja, surat kuasa, surat izin, surat perjanjian, surat keterangan, surat domisili, dan lainnya.",

  keywords: [
    "AI Pembuat Surat",
    "Generator Surat",
    "Buat Surat Online",
    "Surat Lamaran Kerja",
    "Surat Kuasa",
    "Surat Keterangan",
    "Surat Domisili",
    "Surat Perjanjian",
    "Surat Izin",
    "Surat Magang",
    "Surat Resign",
    "Template Surat",
    "Surat Desa",
    "Surat Resmi",
    "Surat Otomatis",
    "AI Indonesia",
    "Futura Docs"
  ],

  authors: [
    {
      name: "Futura Link"
    }
  ],

  creator: "Futura Link",

  publisher: "Futura Link",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: "large",
      maxSnippet: -1,
      maxVideoPreview: -1,
    },
  },

  openGraph: {
    title: "Futura Docs",
    description:
      "Platform AI Pembuat Surat Resmi Indonesia.",
    url: "https://futuradocs.id",
    siteName: "Futura Docs",
    locale: "id_ID",
    type: "website",

    images: [
      {
        url: "/seo-banner.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Futura Docs",
    description:
      "Platform AI Pembuat Surat Resmi Indonesia.",
    images: ["/seo-banner.png"],
  },

};




export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/*
          PERBAIKAN FINAL:
          Tailwind CDN + TailwindLoader.js SUDAH TIDAK DIPAKAI LAGI.
          Sekarang Tailwind di-compile saat build/dev lewat postcss
          (lihat postcss.config.mjs + globals.css yang di-import di atas).

          Ini menghilangkan semua akar masalah sebelumnya sekaligus:
          - Tidak ada lagi dependency ke CDN eksternal yang bisa
            lambat/diblokir/gagal load.
          - Tidak ada lagi race condition antara script CDN & config.
          - Tidak ada lagi risiko hydration ke-block oleh script pihak
            ketiga (beforeInteractive issue kemarin).

          Semua className Tailwind yang sudah dipakai di seluruh kode
          (page.js, SuratEditor.js, TemplateInstan.js, AuthModal.js,
          SuratTersimpan.js) TIDAK BERUBAH SAMA SEKALI - cuma cara
          Tailwind-nya di-generate yang berubah, dari CDN jadi build-time.
        */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
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