// File: src/components/TemplateInstan.js
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { TEMPLATE_SURAT } from '../utils/dataSurat';

export default function TemplateInstan({ setHalamanAktif }) {
    const [step, setStep] = useState('form');

    // State Autentikasi & Premium
    const [userAktif, setUserAktif] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [hasUsedFree, setHasUsedFree] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    // State Notifikasi Pop-up (Pengganti Alert)
    const [notifPopup, setNotifPopup] = useState(null);
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // State Data Surat
    const [templateAktif, setTemplateAktif] = useState(TEMPLATE_SURAT[0].id);
    const [dataForm, setDataForm] = useState({});
    const [isiSurat, setIsiSurat] = useState('');

    // State Kop Surat & TTD
    const [kopSurat, setKopSurat] = useState({
        tampilkan: false, namaInstansi: '', alamatInstansi: '', kontakInstansi: '', logoKiri: null, logoKanan: null
    });
    const [tandaTangan, setTandaTangan] = useState(null);

    // =================================================================
    // SISTEM KEAMANAN (ROUTE GUARD)
    // =================================================================
    useEffect(() => {
        const checkSecurityAndSession = async () => {
            // Ambil sesi user untuk pembayaran
            const { data } = await supabase.auth.getSession();
            setUserAktif(data?.session?.user || null);

            // Cek status kuota di lokal
            const freeUsed = localStorage.getItem('futura_free_used') === 'true';
            const premium = localStorage.getItem('futura_premium') === 'true';

            setHasUsedFree(freeUsed);
            setIsPremium(premium);

            // PROTEKSI HALAMAN: Jika jatah gratis habis dan bukan premium, LANGSUNG MENTAL KE BERANDA!
            if (freeUsed && !premium) {
                setHalamanAktif('beranda');
            }
        };

        checkSecurityAndSession();
    }, [setHalamanAktif]);

    const handleFormChange = (e) => setDataForm({ ...dataForm, [e.target.name]: e.target.value });
    const handleKopChange = (e) => setKopSurat({ ...kopSurat, [e.target.name]: e.target.value });

    const handleImageUpload = (e, target) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (target === 'logoKiri') setKopSurat({ ...kopSurat, logoKiri: reader.result });
                else if (target === 'logoKanan') setKopSurat({ ...kopSurat, logoKanan: reader.result });
                else if (target === 'ttd') setTandaTangan(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const bersihkanMarkdown = (teksRaw) => {
        return teksRaw.replace(/[*#`]/g, '');
    };

    // =================================================================
    // MESIN GENERATE INSTAN (Super Dinamis)
    // =================================================================
    const prosesGenerate = () => {
        // Proteksi Lapis Kedua saat tombol Generate ditekan
        if (!isPremium && hasUsedFree) {
            setHalamanAktif('beranda'); // Mental ke beranda
            return;
        }

        const templatePilihan = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.templateStandar || "";
        let hasilInstan = templatePilihan;

        // Loop otomatis ke semua form yang ada di template aktif
        const formAktif = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.fields || [];

        formAktif.forEach(field => {
            // Mencari tag {namaForm} di dalam template, lalu diganti input user
            const regex = new RegExp(`\\{${field.name}\\}`, 'g');
            const nilaiUser = dataForm[field.name];

            // Jika user tidak mengisi, tampilkan [Label] sebagai pengingat
            hasilInstan = hasilInstan.replace(regex, nilaiUser ? nilaiUser : `[${field.label}]`);
        });

        setIsiSurat(bersihkanMarkdown(hasilInstan));

        setStep('editor');
        if (!isPremium) {
            localStorage.setItem('futura_free_used', 'true');
            setHasUsedFree(true);
        }
    };

    // Fungsi Pembayaran dengan Pop-up Custom
    const handleBayarPremium = async () => {
        if (!userAktif) {
            setNotifPopup({ title: "Akses Ditolak", message: "Sesi login tidak ditemukan. Harap kembali ke beranda untuk login.", type: "error" });
            return;
        }

        setIsLoadingPayment(true);
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: `FUTURA-PRO-${Date.now()}`,
                    gross_amount: 10000,
                    customer_details: { first_name: dataForm.nama || dataForm.nama1 || 'Pengguna', email: userAktif.email || 'user@example.com' }
                })
            });
            const data = await response.json();

            if (window.snap) {
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        setNotifPopup({ title: "Pembayaran Sukses!", message: "Selamat datang di Mode Pro. Silakan nikmati akses tanpa batas.", type: "success" });
                        localStorage.setItem('futura_premium', 'true');
                        setIsPremium(true);
                        setShowPaymentModal(false);
                    },
                    onPending: function (result) { setNotifPopup({ title: "Menunggu", message: "Pembayaran sedang diproses...", type: "warning" }); },
                    onError: function (result) { setNotifPopup({ title: "Gagal", message: "Transaksi gagal diproses.", type: "error" }); },
                    onClose: function () { setNotifPopup({ title: "Dibatalkan", message: "Anda menutup jendela pembayaran.", type: "warning" }); }
                });
            }
        } catch (error) {
            setNotifPopup({ title: "Error Server", message: "Gagal memuat layanan pembayaran.", type: "error" });
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const unduhPDF = () => {
        const element = document.getElementById('kertas-surat-instan');
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `Surat_${dataForm.nama || dataForm.nama1 || 'Instan'}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            pagebreak: { mode: 'avoid-all' },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save().then(() => {
            setShowSuccessAnim(true);
            setTimeout(() => setShowSuccessAnim(false), 3500);
        });
    };

    const formAktif = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.fields || [];

    return (
        <div className="py-12 px-4 md:px-6 bg-slate-100 min-h-screen relative font-normal text-slate-800">

            {/* POP-UP NOTIFIKASI UMUM (Pengganti Alert) */}
            {notifPopup && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center shadow-2xl animate-scale-in">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${notifPopup.type === 'success' ? 'bg-green-100 text-green-500' : notifPopup.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
                            {notifPopup.type === 'success' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                            {notifPopup.type === 'error' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
                            {notifPopup.type === 'warning' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{notifPopup.title}</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{notifPopup.message}</p>
                        <button onClick={() => setNotifPopup(null)} className="w-full bg-slate-900 text-white py-3 rounded-md hover:bg-slate-800 transition">Mengerti</button>
                    </div>
                </div>
            )}

            {/* ANIMASI SUKSES UNDUH */}
            {showSuccessAnim && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-scale-in transform transition-all">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">Berhasil!</h3>
                        <p className="text-slate-500 text-sm">Dokumen PDF Anda telah diunduh.</p>
                    </div>
                </div>
            )}

            {/* Modal Pembayaran Bawaan */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                    <div className="bg-white p-8 rounded-md max-w-md w-full shadow-2xl text-center animate-scale-in">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Upgrade ke Pro</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">Batas gratis telah habis. Tingkatkan ke Paket Pro untuk akses tanpa batas.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPaymentModal(false)} className="w-full text-slate-600 border border-slate-300 py-3 rounded-md hover:bg-slate-50">Batal</button>
                            <button onClick={handleBayarPremium} disabled={isLoadingPayment} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition shadow-lg">
                                {isLoadingPayment ? 'Memuat...' : 'Bayar Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <button onClick={() => setHalamanAktif('beranda')} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
                    <span>←</span> Kembali ke Beranda
                </button>

                {step === 'form' && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                            Template Instan 📄
                        </h2>

                        <div className="space-y-10">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-700 mb-2">1. Pilih Jenis Dokumen</label>
                                <select value={templateAktif} onChange={(e) => {
                                    setTemplateAktif(e.target.value);
                                    setDataForm({}); // Bersihkan form saat ganti template
                                }} className="px-4 py-3 border border-slate-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-slate-50 overflow-y-auto max-h-60">
                                    {TEMPLATE_SURAT.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
                                </select>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" checked={kopSurat.tampilkan} onChange={(e) => setKopSurat({ ...kopSurat, tampilkan: e.target.checked })} className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                                    <span className="font-bold text-slate-700">Gunakan Kop Surat Resmi</span>
                                </label>

                                {kopSurat.tampilkan && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-slide-up">
                                        <div className="space-y-4">
                                            <input type="text" name="namaInstansi" placeholder="Nama Instansi/Perusahaan" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                            <input type="text" name="alamatInstansi" placeholder="Alamat Lengkap Instansi" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                            <input type="text" name="kontakInstansi" placeholder="Telepon / Email / Website" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kiri (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKiri')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kanan (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKanan')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">2. Isi Data Surat</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formAktif.map(field => {
                                        const isTextarea = field.name === 'poin' || field.name.toLowerCase().includes('alamat') || field.name.toLowerCase().includes('kuasa');
                                        return (
                                            <div key={field.name} className={`flex flex-col ${isTextarea ? 'md:col-span-2' : ''}`}>
                                                <label className="text-sm text-slate-600 mb-2 font-medium">{field.label}</label>
                                                {isTextarea ? (
                                                    <textarea name={field.name} onChange={handleFormChange} placeholder={field.placeholder} rows="4" className="px-4 py-3 border border-slate-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                                                ) : (
                                                    <input type="text" name={field.name} onChange={handleFormChange} placeholder={field.placeholder} className="px-4 py-3 border border-slate-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="text-sm font-bold text-slate-700 block mb-3">3. Tanda Tangan (Opsional)</label>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ttd')} className="text-sm w-full md:w-1/2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
                            </div>

                        </div>

                        <div className="mt-12 flex justify-end">
                            <button onClick={prosesGenerate} className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-purple-500/30 transition transform hover:-translate-y-1">
                                Generate Instan
                            </button>
                        </div>
                    </div>
                )}

                {step === 'editor' && (
                    <div className="animate-slide-up">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4 sticky top-24 z-30">
                            <h3 className="text-xl font-bold text-slate-800">Review & Edit Dokumen <span className="text-purple-500">(Versi Instan)</span></h3>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('form')} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Kembali ke Form</button>
                                <button onClick={unduhPDF} className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Unduh PDF
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-12">
                            <div id="kertas-surat-instan" className="bg-white mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm', padding: '25.4mm', boxSizing: 'border-box' }}>
                                {kopSurat.tampilkan && (
                                    <div className="border-b-[3px] border-black pb-4 mb-8 flex items-center justify-between">
                                        <div className="w-24 flex-shrink-0">
                                            {kopSurat.logoKiri && <img src={kopSurat.logoKiri} alt="Logo Kiri" className="w-full h-auto object-contain max-h-24" />}
                                        </div>
                                        <div className="flex-grow text-center px-4">
                                            <h1 className="text-2xl font-bold uppercase tracking-wide text-black mb-1">{kopSurat.namaInstansi || 'NAMA INSTANSI'}</h1>
                                            <p className="text-sm text-black mb-1">{kopSurat.alamatInstansi || 'Alamat Instansi Lengkap'}</p>
                                            <p className="text-xs text-black">{kopSurat.kontakInstansi || 'Kontak: -'}</p>
                                        </div>
                                        <div className="w-24 flex-shrink-0 text-right">
                                            {kopSurat.logoKanan && <img src={kopSurat.logoKanan} alt="Logo Kanan" className="w-full h-auto object-contain max-h-24 ml-auto" />}
                                        </div>
                                    </div>
                                )}

                                <textarea
                                    className="w-full h-full min-h-[150mm] resize-none outline-none text-justify text-black bg-transparent leading-relaxed"
                                    value={isiSurat}
                                    onChange={(e) => setIsiSurat(e.target.value)}
                                    style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}
                                />

                                <div className="mt-12 flex justify-end" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}>
                                    <div className="text-center w-64 text-black">
                                        <p className="mb-2">{dataForm.tempatTanggal || 'Tempat, Tanggal'}</p>
                                        <p className="mb-4">Hormat saya,</p>

                                        <div className="h-24 flex items-center justify-center my-2 relative group cursor-pointer border-2 border-transparent hover:border-dashed hover:border-slate-300 rounded transition">
                                            {tandaTangan ? (
                                                <img src={tandaTangan} alt="Tanda Tangan" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-slate-300 text-sm italic opacity-0 group-hover:opacity-100 transition">(Area Tanda Tangan)</span>
                                            )}
                                        </div>

                                        <p className="font-bold underline">{dataForm.nama || dataForm.nama1 || 'Nama Lengkap / Instansi'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}