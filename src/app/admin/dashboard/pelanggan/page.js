"use client";

import { useState, useEffect } from 'react';

const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

const formatRupiah = (angka) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

export default function PelangganPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cari, setCari] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', email: '', is_premium: false, premium_until: '' });
  const [saving, setSaving] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/pelanggan');
    const data = await res.json();
    setProfiles(data.profiles || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const bukaDetail = async (id) => {
    setSelectedId(id);
    setEditMode(false);
    setDetailLoading(true);
    const res = await fetch(`/api/admin/pelanggan?id=${id}`);
    const data = await res.json();
    setDetail(data);
    setEditForm({
      nama: data.profile?.nama || '',
      email: data.profile?.email || '',
      is_premium: data.profile?.is_premium || false,
      premium_until: data.profile?.premium_until ? data.profile.premium_until.slice(0, 10) : '',
    });
    setDetailLoading(false);
  };

  const tutupDetail = () => {
    setSelectedId(null);
    setDetail(null);
    setEditMode(false);
  };

  const handleSimpanEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/pelanggan', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedId,
        nama: editForm.nama,
        email: editForm.email,
        is_premium: editForm.is_premium,
        premium_until: editForm.premium_until ? new Date(editForm.premium_until).toISOString() : null,
      }),
    });
    setSaving(false);
    setEditMode(false);
    await bukaDetail(selectedId);
    fetchProfiles();
  };

  const handleHapus = async (id, nama) => {
    if (!confirm(`Yakin hapus pelanggan "${nama || id}"? Semua data transaksi & dokumen miliknya juga akan terhapus. Aksi ini tidak bisa dibatalkan.`)) return;
    await fetch('/api/admin/pelanggan', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    tutupDetail();
    fetchProfiles();
  };

  const filtered = profiles.filter(
    (p) =>
      p.email?.toLowerCase().includes(cari.toLowerCase()) ||
      p.nama?.toLowerCase().includes(cari.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Semua Pelanggan</h2>
          <p className="text-sm text-slate-500">Total {profiles.length} pelanggan terdaftar</p>
        </div>
        <input
          type="text"
          placeholder="Cari nama / email..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="w-full md:w-64 text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* GRID CARD PELANGGAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-sm col-span-full text-center py-10">Tidak ada data pelanggan.</p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => bukaDetail(p.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                  {(p.nama || p.email || '?').charAt(0).toUpperCase()}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_premium ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.is_premium ? 'Premium' : 'Gratis'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 truncate">{p.nama || 'Tanpa Nama'}</h3>
              <p className="text-sm text-slate-500 truncate mb-3">{p.email}</p>
              <p className="text-xs text-slate-400">Bergabung {formatTanggal(p.created_at)}</p>
            </div>
          ))
        )}
      </div>

      {/* MODAL DETAIL PELANGGAN */}
      {selectedId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4" onClick={tutupDetail}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading || !detail ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {(detail.profile.nama || detail.profile.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{detail.profile.nama || 'Tanpa Nama'}</h3>
                      <p className="text-sm text-slate-500">{detail.profile.email}</p>
                    </div>
                  </div>
                  <button onClick={tutupDetail} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
                </div>

                {!editMode ? (
                  <>
                    {/* RINGKASAN STATS */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-slate-900">{detail.totalPembayaran}</p>
                        <p className="text-xs text-slate-500">Pembayaran</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-sm font-bold text-slate-900">{formatRupiah(detail.totalNominal)}</p>
                        <p className="text-xs text-slate-500">Total Bayar</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-slate-900">{detail.totalDokumen}</p>
                        <p className="text-xs text-slate-500">Dokumen Dibuat</p>
                      </div>
                    </div>

                    {/* DETAIL STATUS */}
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Status Langganan</span>
                        <span className={`font-medium ${detail.profile.is_premium ? 'text-green-600' : 'text-slate-600'}`}>
                          {detail.profile.is_premium ? 'Premium Aktif' : 'Gratis'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Premium Sampai</span>
                        <span className="font-medium text-slate-800">{formatTanggal(detail.profile.premium_until)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Bergabung Sejak</span>
                        <span className="font-medium text-slate-800">{formatTanggal(detail.profile.created_at)}</span>
                      </div>
                    </div>

                    {/* HISTORI TRANSAKSI */}
                    {detail.transaksi.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Histori Pembayaran</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {detail.transaksi.map((t) => (
                            <div key={t.id} className="flex justify-between items-center text-sm bg-slate-50 rounded-lg px-3 py-2">
                              <div>
                                <p className="font-medium text-slate-800">{formatRupiah(t.gross_amount)}</p>
                                <p className="text-xs text-slate-400">{formatTanggal(t.tanggal_beli)}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                t.status === 'success' ? 'bg-green-100 text-green-700' :
                                t.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {t.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AKSI */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 bg-blue-50 text-blue-600 font-medium py-2.5 rounded-lg hover:bg-blue-100 transition text-sm"
                      >
                        Edit Data
                      </button>
                      <button
                        onClick={() => handleHapus(detail.profile.id, detail.profile.nama)}
                        className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition text-sm"
                      >
                        Hapus Pelanggan
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSimpanEdit} className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block font-medium">Nama</label>
                      <input
                        value={editForm.nama}
                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                        className="w-full text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block font-medium">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_premium"
                        checked={editForm.is_premium}
                        onChange={(e) => setEditForm({ ...editForm, is_premium: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="is_premium" className="text-sm text-slate-700">Status Premium Aktif</label>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block font-medium">Premium Sampai Tanggal</label>
                      <input
                        type="date"
                        value={editForm.premium_until}
                        onChange={(e) => setEditForm({ ...editForm, premium_until: e.target.value })}
                        className="w-full text-sm border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex-1 border border-slate-300 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition text-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                      >
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
