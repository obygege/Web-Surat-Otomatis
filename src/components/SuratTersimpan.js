"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function SuratTersimpan({ user, onEdit }) {
    const [daftarSurat, setDaftarSurat] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSuratTersimpan();
        }
    }, [user]);

    const fetchSuratTersimpan = async () => {
        setIsLoading(true);
        try {
            // Pastikan Anda sudah membuat tabel 'surat_tersimpan' di Supabase
            const { data, error } = await supabase
                .from('surat_tersimpan')
                .select('*')
                .eq('user_id', user.id) // Asumsi relasi berdasarkan ID user
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Jika tabel masih kosong/belum ada, kita set dummy data sementara agar UI bisa di-test
            if (!data || data.length === 0) {
                setDaftarSurat([
                    { id: 1, judul: "Surat Perjanjian Kerja Sama", tipe: "editor_ai", tanggal: "20 Mei 2026", status: "Selesai" },
                    { id: 2, judul: "Surat Pengantar RT/RW", tipe: "editor_instan", tanggal: "18 Mei 2026", status: "Draft" },
                ]);
            } else {
                setDaftarSurat(data);
            }
        } catch (error) {
            console.error("Gagal mengambil data surat:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Surat Tersimpan</h2>
                    <p className="text-slate-500">Kelola dan edit kembali dokumen yang pernah Anda buat sebelumnya.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : daftarSurat.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Dokumen</h3>
                        <p className="text-slate-500 mb-6">Anda belum menyimpan atau membuat surat apa pun.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-gray-200">
                                    <th className="py-4 px-6 font-medium">Judul Dokumen</th>
                                    <th className="py-4 px-6 font-medium">Tanggal</th>
                                    <th className="py-4 px-6 font-medium">Status</th>
                                    <th className="py-4 px-6 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daftarSurat.map((surat) => (
                                    <tr key={surat.id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <span className="font-medium text-gray-900">{surat.judul}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">{surat.tanggal}</td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${surat.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {surat.status || 'Tersimpan'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => onEdit(surat)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition"
                                            >
                                                Edit / Buka
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}