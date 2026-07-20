// File: src/app/syarat-ketentuan/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Syarat & Ketentuan - Futura Docs',
  description: 'Syarat dan ketentuan penggunaan layanan Futura Docs.',
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">&larr; Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Syarat &amp; Ketentuan</h1>
        {/* TODO: ganti tanggal & nama badan usaha sesuai data resmi Anda */}
        <p className="text-slate-500 mb-10">Terakhir diperbarui: 20 Juli 2026. Berlaku untuk layanan yang dioperasikan oleh Futura Link ("Kami", "Layanan").</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">1. Tentang Layanan</h2>
            <p>Futura Docs adalah layanan pembuatan dokumen/surat berbasis web yang membantu pengguna menyusun surat melalui template instan maupun bantuan AI, lengkap dengan fitur kustomisasi (font, spasi, ukuran kertas, kop surat, dan tanda tangan digital), untuk kemudian diunduh dalam bentuk PDF.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">2. Akun Pengguna</h2>
            <p>Pengguna bertanggung jawab menjaga kerahasiaan akun dan kata sandi. Segala aktivitas yang terjadi melalui akun pengguna menjadi tanggung jawab pemilik akun.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">3. Layanan Berbayar (Premium)</h2>
            <p>Layanan Premium memberikan kuota pembuatan surat AI tambahan sesuai periode yang berlaku, dan diaktifkan otomatis setelah pembayaran melalui mitra payment gateway kami (Midtrans) berhasil dikonfirmasi.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">4. Pembayaran</h2>
            <p>Seluruh transaksi diproses secara aman melalui Midtrans. Kami tidak menyimpan data kartu pembayaran pengguna secara langsung di server kami.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">5. Kebijakan Pengembalian Dana</h2>
            <p>Ketentuan pengembalian dana diatur secara terpisah pada halaman <Link href="/kebijakan-pengembalian" className="text-blue-600 hover:underline">Kebijakan Pengembalian Dana</Link>.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">6. Tanggung Jawab Konten</h2>
            <p>Isi surat yang dibuat, termasuk hasil dari AI, sepenuhnya menjadi tanggung jawab pengguna. Kami menyarankan pengguna memeriksa kembali isi dokumen sebelum digunakan untuk keperluan resmi atau hukum.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">7. Perubahan Ketentuan</h2>
            <p>Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku sejak dipublikasikan di halaman ini.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">8. Kontak</h2>
            <p>Pertanyaan terkait syarat &amp; ketentuan dapat disampaikan melalui halaman <Link href="/kontak" className="text-blue-600 hover:underline">Kontak</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
