"use client";

import { useState, useEffect } from 'react';

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

export default function PembayaranPage() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('semua');

  useEffect(() => {
    fetch('/api/admin/dashboard-data')
      .then((res) => res.json())
      .then((data) => {
        setTransaksi(data.transaksi || []);
        setLoading(false);
      });
  }, []);

  const filtered = filterStatus === 'semua' ? transaksi : transaksi.filter((t) => t.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusList = ['semua', 'success', 'pending', 'failed', 'expired'];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Pembayaran</h2>
          <p className="text-sm text-slate-500">Total {filtered.length} transaksi</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusList.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs font-medium px-3 py-2 rounded-lg capitalize transition ${
                filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-5 font-medium">Order ID</th>
                <th className="py-3 px-5 font-medium">Email</th>
                <th className="py-3 px-5 font-medium">Jumlah</th>
                <th className="py-3 px-5 font-medium">Metode</th>
                <th className="py-3 px-5 font-medium">Status</th>
                <th className="py-3 px-5 font-medium">Tanggal Beli</th>
                <th className="py-3 px-5 font-medium">Expired</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Belum ada data transaksi{filterStatus !== 'semua' ? ` dengan status "${filterStatus}"` : ''}.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-5 font-mono text-xs text-slate-500">{t.order_id}</td>
                    <td className="py-3 px-5 font-medium text-slate-800">{t.email}</td>
                    <td className="py-3 px-5">{formatRupiah(t.gross_amount)}</td>
                    <td className="py-3 px-5 text-slate-500 capitalize">{t.payment_type || '-'}</td>
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
