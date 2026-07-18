"use client";

import { useState, useEffect } from 'react';

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

export default function KeuanganPage() {
  const [periode, setPeriode] = useState(new Date().toISOString().slice(0, 7) + '-01');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama_biaya: '', jumlah: '', keterangan: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/dashboard-data?periode=${periode}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [periode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/modal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, periode }),
    });
    setForm({ nama_biaya: '', jumlah: '', keterangan: '' });
    setShowForm(false);
    setSaving(false);
    fetchData();
  };

  const handleHapus = async (id) => {
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

  const { summary, modalList } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">Laporan Keuangan</h2>
        <input
          type="month"
          value={periode.slice(0, 7)}
          onChange={(e) => setPeriode(e.target.value + '-01')}
          className="text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* RINGKASAN ANGKA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Untung Kotor</p>
          <p className="text-xl font-bold text-green-600">{formatRupiah(summary.untungKotor)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Modal</p>
          <p className="text-xl font-bold text-slate-700">{formatRupiah(summary.totalModal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Pajak (0,5%)</p>
          <p className="text-xl font-bold text-red-500">{formatRupiah(summary.totalPajak)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Untung Bersih</p>
          <p className="text-xl font-bold text-blue-600">{formatRupiah(summary.untungBersih)}</p>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Rincian Modal / Biaya</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            + Tambah
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              required
              placeholder="Nama biaya"
              value={form.nama_biaya}
              onChange={(e) => setForm({ ...form, nama_biaya: e.target.value })}
              className="text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              required
              type="number"
              placeholder="Jumlah (Rp)"
              value={form.jumlah}
              onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
              className="text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="Keterangan (opsional)"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              className="text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={saving}
              className="md:col-span-3 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        )}

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200">
              <th className="py-2 font-medium">Nama Biaya</th>
              <th className="py-2 font-medium">Keterangan</th>
              <th className="py-2 font-medium text-right">Jumlah</th>
              <th className="py-2 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {modalList.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-slate-400">Belum ada modal periode ini.</td></tr>
            ) : (
              modalList.map((m) => (
                <tr key={m.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{m.nama_biaya}</td>
                  <td className="py-3 text-slate-500">{m.keterangan || '-'}</td>
                  <td className="py-3 text-right font-medium">{formatRupiah(m.jumlah)}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleHapus(m.id)} className="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* INFO PAJAK */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-700 leading-relaxed">
        <strong>PPh Final UMKM 0,5%</strong> dihitung dari omzet bruto (untung kotor), sesuai PP 55/2022. Setor lewat DJP Online / e-Billing dengan kode akun pajak <strong>411128-420</strong>, paling lambat tanggal 15 bulan berikutnya.
      </div>
    </div>
  );
}
