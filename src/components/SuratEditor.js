// File: src/components/SuratEditor.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { TEMPLATE_SURAT } from '../utils/dataSurat';

export default function SuratEditor({ setHalamanAktif }) {
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

    // TAMBAHAN: State untuk melacak ID dokumen di Database agar bisa di-Update
    const [documentId, setDocumentId] = useState(null);

    // State Kop Surat & Tanda Tangan
    const [kopSurat, setKopSurat] = useState({
        tampilkan: false,
        namaInstansi: '',
        alamatInstansi: '',
        kontakInstansi: '',
        logoKiri: null,
        logoKanan: null
    });
    const [tandaTangan, setTandaTangan] = useState(null);

    // State & Ref untuk Tanda Tangan Langsung (Digital Signature)
    const [sigMode, setSigMode] = useState('upload'); // 'upload' atau 'draw'
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // =================================================================
    // SISTEM KEAMANAN (ROUTE GUARD)
    // =================================================================
    useEffect(() => {
        const checkSecurityAndSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUserAktif(data?.session?.user || null);

            const freeUsed = localStorage.getItem('futura_free_used') === 'true';
            const premium = localStorage.getItem('futura_premium') === 'true';

            setHasUsedFree(freeUsed);
            setIsPremium(premium);

            // PROTEKSI HALAMAN: Jika jatah gratis habis dan bukan premium, MENTAL KE BERANDA!
            if (freeUsed && !premium) {
                setHalamanAktif('beranda');
            }
        };

        checkSecurityAndSession();
    }, [setHalamanAktif]);

    // =================================================================
    // FUNGSI TANDA TANGAN LANGSUNG (CANVAS)
    // =================================================================
    const startDrawing = (e) => {
        if (sigMode !== 'draw') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || sigMode !== 'draw') return;
        e.preventDefault(); // Mencegah scrolling layar saat menggambar di HP
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTandaTangan(null); // Hapus preview TTD
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setTandaTangan(canvas.toDataURL('image/png'));
            setNotifPopup({ title: "Tersimpan", message: "Tanda tangan digital berhasil disimpan.", type: "success" });
        }
    };

    // =================================================================
    // HANDLER INPUT & FILE
    // =================================================================
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

    // FUNGSI AUTO-RESIZE TEXTAREA (Agar PDF Sama Persis dengan Preview)
    const handleTextareaChange = (e) => {
        setIsiSurat(e.target.value);
        e.target.style.height = 'auto'; // Reset tinggi
        e.target.style.height = `${e.target.scrollHeight}px`; // Set sesuai isi
    };

    // Trigger auto-resize saat surat pertama kali di-generate
    useEffect(() => {
        const tx = document.getElementById('isi-surat-textarea');
        if (tx && isiSurat) {
            tx.style.height = 'auto';
            tx.style.height = `${tx.scrollHeight}px`;
        }
    }, [isiSurat, step]);

    // =================================================================
    // MESIN GENERATE AI (Perbaikan Prompt Cerdas)
    // =================================================================
    const prosesGenerate = async () => {
        if (!isPremium && hasUsedFree) {
            setHalamanAktif('beranda');
            return;
        }

        setStep('loading-ai');
        setDocumentId(null); // Reset ID Dokumen agar saat membuat draft baru terhitung sebagai Insert Baru

        try {
            const templateTerpilih = TEMPLATE_SURAT.find(t => t.id === templateAktif);
            const formAktif = templateTerpilih?.fields || [];

            let dataContext = '';
            formAktif.forEach(field => {
                if (dataForm[field.name]) {
                    dataContext += `- ${field.label}: ${dataForm[field.name]}\n`;
                }
            });

            // PROMPT AI DIPERBAIKI: Larangan tegas membuat tanda tangan ganda
            const promptAI = `Anda adalah sekretaris dan asisten pembuat surat profesional tingkat tinggi.
Tugas Anda: Buatkan draft dokumen formal yang rapi, berstandar administrasi Indonesia, berjenis "${templateTerpilih?.nama}".

Berikut adalah data spesifik yang diberikan oleh pengguna:
${dataContext}

Instruksi Cerdas:
1. Kembangkan alasan/inti surat secara KREATIF, LOGIS, dan PROFESIONAL agar surat tampak meyakinkan.
2. Pastikan surat memiliki struktur: Pembuka, Isi, dan Penutup.
3. SANGAT PENTING: JANGAN SEKALI-KALI menuliskan bagian tanda tangan di akhir surat (seperti "Hormat saya", "Mengetahui", nama terang, garis, dll). Sistem kami sudah mencetaknya secara otomatis di bawah!
4. JANGAN GUNAKAN simbol markdown seperti **, *, atau #. Tulis dalam teks polos dengan enter/spasi yang rapi.`;

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptAI }),
            });

            if (!response.ok) throw new Error("Gagal AI");
            const data = await response.json();

            setIsiSurat(bersihkanMarkdown(data.text));
            kunciAksesGratis();
        } catch (err) {
            setNotifPopup({ title: "Server Sibuk", message: "Koneksi ke AI terputus atau server sedang penuh. Silakan coba beberapa saat lagi.", type: "error" });
            setStep('form');
        }
    };

    const kunciAksesGratis = () => {
        setStep('editor');
        if (!isPremium) {
            localStorage.setItem('futura_free_used', 'true');
            setHasUsedFree(true);
        }
    };

    // =================================================================
    // FUNGSI SIMPAN KE DATABASE (SUPABASE)
    // =================================================================
    const simpanDokumen = async () => {
        if (!userAktif) {
            setNotifPopup({ title: "Akses Ditolak", message: "Anda harus login untuk menyimpan dokumen ke akun.", type: "error" });
            return;
        }

        const templateTerpilih = TEMPLATE_SURAT.find(t => t.id === templateAktif);
        const judulSurat = templateTerpilih ? templateTerpilih.nama : 'Dokumen AI Otomatis';

        try {
            if (documentId) {
                // UPDATE data jika dokumen sudah pernah disimpan di sesi ini
                const { error } = await supabase
                    .from('documents')
                    .update({
                        judul_surat: judulSurat,
                        isi_surat: isiSurat,
                        tipe_kertas: 'A4'
                    })
                    .eq('id', documentId)
                    .eq('user_id', userAktif.id); // Lapis keamanan ekstra memastikan milik user tersebut

                if (error) throw error;
                setNotifPopup({ title: "Diperbarui!", message: "Perubahan pada dokumen berhasil disimpan.", type: "success" });
            } else {
                // INSERT data baru jika dokumen belum pernah disimpan
                const { data, error } = await supabase
                    .from('documents')
                    .insert([
                        {
                            user_id: userAktif.id,
                            judul_surat: judulSurat,
                            isi_surat: isiSurat,
                            tipe_kertas: 'A4'
                        }
                    ])
                    .select();

                if (error) throw error;
                if (data && data.length > 0) {
                    setDocumentId(data[0].id); // Set State dengan ID dari Supabase agar selanjutnya menjadi Update
                }
                setNotifPopup({ title: "Tersimpan!", message: "Dokumen berhasil disimpan ke database akun Anda.", type: "success" });
            }
        } catch (error) {
            console.error("Error saving doc:", error);
            setNotifPopup({ title: "Gagal Simpan", message: "Terjadi kesalahan saat menyimpan dokumen ke server.", type: "error" });
        }
    };

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
                    customer_details: { first_name: dataForm.nama || 'Pengguna', email: userAktif.email || 'user@example.com' }
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
        const element = document.getElementById('kertas-surat');
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `Surat_${dataForm.nama || dataForm.nama1 || 'AI_Otomatis'}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            pagebreak: { mode: 'avoid-all' },
            html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
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

            {/* POP-UP NOTIFIKASI UMUM */}
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

            <div className="max-w-5xl mx-auto">
                <button onClick={() => setHalamanAktif('beranda')} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
                    <span>←</span> Kembali ke Beranda
                </button>

                {/* ========================================== */}
                {/* STEP 1: FORM INPUT */}
                {/* ========================================== */}
                {step === 'form' && (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
                            Super Editor AI <span className="text-yellow-400">⚡</span>
                        </h2>

                        <div className="space-y-10">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-700 mb-2">1. Pilih Jenis Dokumen</label>
                                <select value={templateAktif} onChange={(e) => {
                                    setTemplateAktif(e.target.value);
                                    setDataForm({});
                                }} className="px-4 py-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50">
                                    {TEMPLATE_SURAT.map(t => <option key={t.id} value={t.id}>{t.nama}</option>)}
                                </select>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                    <input type="checkbox" checked={kopSurat.tampilkan} onChange={(e) => setKopSurat({ ...kopSurat, tampilkan: e.target.checked })} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="font-bold text-slate-700">Gunakan Kop Surat Resmi</span>
                                </label>

                                {kopSurat.tampilkan && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-slide-up">
                                        <div className="space-y-4">
                                            <input type="text" name="namaInstansi" placeholder="Nama Instansi/Perusahaan" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-400" />
                                            <input type="text" name="alamatInstansi" placeholder="Alamat Lengkap Instansi" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-400" />
                                            <input type="text" name="kontakInstansi" placeholder="Telepon / Email / Website" onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-400" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kiri (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKiri')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kanan (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKanan')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">2. Isi Data Lengkap</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formAktif.map(field => {
                                        const isTextarea = field.name === 'poin' || field.name.toLowerCase().includes('alamat') || field.name.toLowerCase().includes('kuasa');
                                        return (
                                            <div key={field.name} className={`flex flex-col ${isTextarea ? 'md:col-span-2' : ''}`}>
                                                <label className="text-sm text-slate-600 mb-2 font-medium">{field.label}</label>
                                                {isTextarea ? (
                                                    <textarea name={field.name} onChange={handleFormChange} placeholder={field.placeholder} rows="4" className="px-4 py-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                                                ) : (
                                                    <input type="text" name={field.name} onChange={handleFormChange} placeholder={field.placeholder} className="px-4 py-3 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* FITUR TANDA TANGAN (UPLOAD / GAMBAR) */}
                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">3. Tanda Tangan (Opsional)</h3>

                                <div className="flex gap-3 mb-4">
                                    <button onClick={() => setSigMode('upload')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${sigMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Upload Gambar</button>
                                    <button onClick={() => setSigMode('draw')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${sigMode === 'draw' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Gambar Langsung</button>
                                </div>

                                {sigMode === 'upload' ? (
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ttd')} className="text-sm w-full md:w-1/2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
                                ) : (
                                    <div className="w-full md:w-1/2">
                                        <canvas
                                            ref={canvasRef}
                                            width={300}
                                            height={150}
                                            className="w-full bg-white border-2 border-dashed border-slate-300 rounded-md cursor-crosshair touch-none"
                                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                                        />
                                        <div className="flex justify-between mt-3">
                                            <button onClick={clearSignature} className="text-sm text-red-500 hover:text-red-700 font-medium">Hapus</button>
                                            <button onClick={saveSignature} className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded hover:bg-slate-900 transition">Simpan TTD</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="mt-12 flex justify-end">
                            <button onClick={prosesGenerate} className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition transform hover:-translate-y-1">
                                Generate dengan AI
                            </button>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* STEP 2: LOADING */}
                {/* ========================================== */}
                {step === 'loading-ai' && (
                    <div className="bg-white p-20 rounded-xl shadow-sm text-center flex flex-col items-center justify-center border border-slate-200 animate-scale-in">
                        <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-3">AI Sedang Merangkai Kata...</h3>
                        <p className="text-slate-500">Menganalisis data spesifik Anda dan menyusun bahasa formal yang sempurna.</p>
                    </div>
                )}

                {/* ========================================== */}
                {/* STEP 3: PREVIEW DOKUMEN & DOWNLOAD */}
                {/* ========================================== */}
                {step === 'editor' && (
                    <div className="animate-slide-up">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4 sticky top-24 z-30">
                            <h3 className="text-xl font-bold text-slate-800">Review & Edit Dokumen <span className="text-blue-500">(Versi AI)</span></h3>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('form')} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">Edit Form</button>

                                {/* TAMBAHAN: Tombol Simpan ke Database */}
                                <button onClick={simpanDokumen} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                                    Simpan
                                </button>

                                <button onClick={unduhPDF} className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Unduh PDF
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-12">
                            <div id="kertas-surat" className="bg-white mx-auto shadow-2xl" style={{ width: '210mm', minHeight: '297mm', padding: '25.4mm', boxSizing: 'border-box' }}>
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

                                {/* Auto-resize textarea agar di PDF tidak terpotong */}
                                <textarea
                                    id="isi-surat-textarea"
                                    className="w-full min-h-[150mm] resize-none outline-none text-justify text-black bg-transparent leading-relaxed overflow-hidden"
                                    value={isiSurat}
                                    onChange={handleTextareaChange}
                                    style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}
                                />

                                <div className="mt-8 flex justify-end" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt' }}>
                                    <div className="text-center w-64 text-black">
                                        <p className="mb-2">{dataForm.tempatTanggal || 'Tempat, Tanggal'}</p>
                                        <p className="mb-4">Hormat saya,</p>

                                        <div className="h-24 flex items-center justify-center my-2 relative">
                                            {tandaTangan ? (
                                                <img src={tandaTangan} alt="Tanda Tangan" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="text-slate-300 text-sm italic">(Area Tanda Tangan)</span>
                                            )}
                                        </div>

                                        <p className="font-bold underline">{dataForm.nama || dataForm.nama1 || 'Nama Lengkap / Instansi'}</p>
                                        {/* Untuk form yang punya 'posisi' atau 'jabatan', tampilkan di bawah nama jika ada */}
                                        {(dataForm.posisi || dataForm.jabatan) && (
                                            <p>{dataForm.posisi || dataForm.jabatan}</p>
                                        )}
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