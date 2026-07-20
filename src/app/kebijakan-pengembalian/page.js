// File: src/app/kebijakan-pengembalian/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Kebijakan Pengembalian Dana - Futura Docs',
  description: 'Kebijakan pengembalian dana (refund) layanan Futura Docs.',
};

export default function KebijakanPengembalianPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">&larr; Kembali ke Beranda</Link>

        <h1 className="text-3xl font-bold mb-2">Kebijakan Pengembalian Dana</h1>
        <p className="text-slate-500 mb-10">Terakhir diperbarui: 20 Juli 2026.</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">1. Sifat Layanan</h2>
            <p>Futura Docs adalah produk digital. Setelah pembayaran Premium berhasil dikonfirmasi, akses/kuota layanan langsung aktif secara otomatis dan dapat langsung digunakan pada saat itu juga.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">2. Kebijakan Umum: Tidak Ada Pengembalian Dana</h2>
            <p>Karena sifatnya sebagai produk/layanan digital yang aktif secara instan setelah pembayaran, pada prinsipnya <strong>dana yang telah dibayarkan tidak dapat dikembalikan (non-refundable)</strong>, kecuali pada kondisi pengecualian di bawah ini.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">3. Pengecualian</h2>
            <p>Kami akan memproses pengembalian dana apabila:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Pembayaran berhasil didebet dari akun pengguna namun status Premium <em>tidak</em> aktif akibat kegagalan sistem di pihak kami (double charge / kegagalan teknis).</li>
              <li>Transaksi duplikat akibat gangguan sistem pembayaran.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">4. Cara Mengajukan</h2>
            <p>Ajukan permintaan melalui halaman <Link href="/kontak" className="text-blue-600 hover:underline">Kontak</Link> maksimal 3 x 24 jam setelah transaksi, dengan menyertakan bukti pembayaran/Order ID. Permintaan akan diproses maksimal 7 hari kerja setelah diverifikasi.</p>
          </section>

          <section>
            <h2 className="font-bold text-base text-slate-900 mb-2">5. Metode Pengembalian</h2>
            <p>Dana dikembalikan ke metode pembayaran asal yang digunakan saat transaksi melalui Midtrans, sesuai kebijakan dan waktu proses masing-masing bank/penyedia metode pembayaran.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
