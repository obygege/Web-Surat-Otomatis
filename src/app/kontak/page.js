// File: src/app/kontak/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Kontak Kami - Futura Docs',
  description: 'Pusat bantuan dan kontak resmi Futura Docs.',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">&larr; Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Pusat Bantuan &amp; Kontak</h1>
        <p className="text-slate-500 mb-10">Kami siap membantu Anda. Silakan hubungi kami melalui salah satu kanal di bawah ini.</p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-1">Email Dukungan</h2>
            <p className="text-slate-500 text-sm mb-3">Respon dalam 1x24 jam kerja.</p>
            {/* TODO: ganti dengan email resmi Anda */}
            <a href="mailto:support@futuralink.id" className="text-blue-600 font-medium hover:underline">
              support@futuralink.id
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-1">WhatsApp / Telepon</h2>
            <p className="text-slate-500 text-sm mb-3">Jam operasional: 09.00 - 21.00 WIB.</p>
            {/* TODO: ganti dengan nomor WhatsApp resmi Anda */}
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
              +62 812-3456-7890
            </a>
          </div>
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-1">Alamat Operasional</h2>
          {/* TODO: ganti dengan alamat resmi Anda */}
          <p className="text-slate-600 text-sm">Futura Link, Indonesia.</p>
        </div>

        <div className="mt-10 flex gap-4 text-sm">
          <Link href="/syarat-ketentuan" className="text-slate-500 hover:text-blue-600 hover:underline">Syarat &amp; Ketentuan</Link>
          <Link href="/kebijakan-pengembalian" className="text-slate-500 hover:text-blue-600 hover:underline">Kebijakan Pengembalian Dana</Link>
        </div>
      </div>
    </div>
  );
}
