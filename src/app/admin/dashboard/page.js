"use client";

import { useState, useEffect } from 'react';

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalForm, setShowModalForm] = useState(false);
  const [form, setForm] = useState({ nama_biaya: '', jumlah: '', periode: new Date().toISOString().slice(0, 7) + '-01', keterangan: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/dashboard-data');
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/modal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ ...form, nama_biaya: '', jumlah: '', keterangan: '' });
    setShowModalForm(false);
    setSaving(false);
    fetchData();
  };

  const handleHapusModal = async (id) => {
    if (!confirm('Hapus item modal ini?')) return;
    await fetch('/api/admin/modal', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { summary, transaksi, modalList } = data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pelanggan"
          value={summary.totalPelanggan}
          accent="bg-blue-50 text-blue-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Total Pembayaran Sukses"
          value={summary.totalPembayaran}
          accent="bg-purple-50 text-purple-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Untung Kotor"
          value={formatRupiah(summary.untungKotor)}
          accent="bg-green-50 text-green-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 8v2m0-10a9 9 0 100 18 9 9 0 000-18z" /></svg>}
        />
        <StatCard
          label="Untung Bersih (setelah modal & pajak)"
          value={formatRupiah(summary.untungBersih)}
          accent="bg-amber-50 text-amber-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      {/* KEUANGAN DETAIL: MODAL + PAJAK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODAL */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Modal / Biaya Bulan Ini</h3>
              <p className="text-xs text-slate-400">Periode: {formatTanggal(summary.periode)}</p>
            </div>
            <button
              onClick={() => setShowModalForm(!showModalForm)}
              className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              + Tambah Modal
            </button>
          </div>

          {showModalForm && (
            <form onSubmit={handleSubmitModal} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
              <input
                required
                placeholder="Nama biaya (cth: Hosting, Domain, API)"
                value={form.nama_biaya}
                onChange={(e) => setForm({ ...form, nama_biaya: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                required
                type="number"
                placeholder="Jumlah (Rp)"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Keterangan (opsional)"
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Modal'}
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {modalList.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Belum ada data modal bulan ini.</p>
            ) : (
              modalList.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                  <div>
                    <p className="font-medium text-slate-800">{m.nama_biaya}</p>
                    {m.keterangan && <p className="text-xs text-slate-400">{m.keterangan}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700">{formatRupiah(m.jumlah)}</span>
                    <button onClick={() => handleHapusModal(m.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 text-sm font-bold text-slate-900">
            <span>Total Modal</span>
            <span>{formatRupiah(summary.totalModal)}</span>
          </div>
        </div>

        {/* PAJAK */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-1">Perhitungan Pajak</h3>
          <p className="text-xs text-slate-400 mb-4">PPh Final UMKM 0,5% dari omzet bruto (PP 55/2022)</p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span className="text-slate-500">Omzet Bruto (Untung Kotor)</span>
              <span className="font-medium text-slate-800">{formatRupiah(summary.untungKotor)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span className="text-slate-500">Tarif Pajak</span>
              <span className="font-medium text-slate-800">{(summary.tarifPajak * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Pajak Terutang</span>
              <span className="font-bold text-red-500">{formatRupiah(summary.totalPajak)}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 leading-relaxed">
              Setor pajak lewat aplikasi <strong>DJP Online / e-Billing</strong> dengan kode akun pajak <strong>411128-420</strong> (PPh Final UMKM), sebelum tanggal 15 bulan berikutnya. Angka ini estimasi otomatis, tetap cek ulang ke konsultan pajak untuk kepastian.
            </div>
          </div>
        </div>
      </div>

      {/* TABEL PEMBAYARAN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Data Pembayaran Semua Pelanggan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-5 font-medium">Email</th>
                <th className="py-3 px-5 font-medium">Jumlah</th>
                <th className="py-3 px-5 font-medium">Status</th>
                <th className="py-3 px-5 font-medium">Tanggal Beli</th>
                <th className="py-3 px-5 font-medium">Expired</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">Belum ada data transaksi.</td>
                </tr>
              ) : (
                transaksi.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-5 font-medium text-slate-800">{t.email}</td>
                    <td className="py-3 px-5">{formatRupiah(t.gross_amount)}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.status === 'success' ? 'bg-green-100 text-green-700' :
                        t.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500">{formatTanggal(t.tanggal_beli)}</td>
                    <td className="py-3 px-5 text-slate-500">{formatTanggal(t.tanggal_expired)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
