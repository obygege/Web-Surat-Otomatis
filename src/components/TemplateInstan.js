// File: src/components/TemplateInstan.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { TEMPLATE_SURAT } from '../utils/dataSurat';

export default function TemplateInstan({ setHalamanAktif }) {
    const [step, setStep] = useState('form');

    // State Autentikasi & Premium
    const [userAktif, setUserAktif] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [hasUsedFree, setHasUsedFree] = useState(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    // State Notifikasi Pop-up
    const [notifPopup, setNotifPopup] = useState(null);
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // State Data Surat
    const [templateAktif, setTemplateAktif] = useState(TEMPLATE_SURAT[0].id);
    const [dataForm, setDataForm] = useState({});
    const [isiSurat, setIsiSurat] = useState('');
    const [documentId, setDocumentId] = useState(null);

    // State Loading PDF
    const [isDownloading, setIsDownloading] = useState(false);

    // Pengaturan Kertas, Font, dan Ukuran
    const [pengaturan, setPengaturan] = useState({
        kertas: 'a4', // 'a4' atau 'f4'
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '12pt',
        spasi: '1.5'
    });

    // State Kop Surat & TTD
    const [kopSurat, setKopSurat] = useState({
        tampilkan: false, namaInstansi: '', alamatInstansi: '', kontakInstansi: '', logoKiri: null, logoKanan: null
    });
    const [tandaTangan, setTandaTangan] = useState(null);

    // State & Ref Tanda Tangan Langsung
    const [sigMode, setSigMode] = useState('upload');
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const editorRef = useRef(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        const savedDraft = localStorage.getItem('surat_draft_instan_futura');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                if (parsed.step) setStep(parsed.step);
                if (parsed.templateAktif) setTemplateAktif(parsed.templateAktif);
                if (parsed.dataForm) setDataForm(parsed.dataForm);
                if (parsed.isiSurat) setIsiSurat(parsed.isiSurat);
                if (parsed.kopSurat) setKopSurat(parsed.kopSurat);
                if (parsed.tandaTangan) setTandaTangan(parsed.tandaTangan);
                if (parsed.documentId) setDocumentId(parsed.documentId);
                if (parsed.sigMode) setSigMode(parsed.sigMode);
                if (parsed.pengaturan) setPengaturan({ spasi: '1.5', ...parsed.pengaturan });
            } catch (e) {
                console.error("Gagal meload draft otomatis", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const draft = { step, templateAktif, dataForm, isiSurat, kopSurat, tandaTangan, documentId, sigMode, pengaturan };
        localStorage.setItem('surat_draft_instan_futura', JSON.stringify(draft));
    }, [step, templateAktif, dataForm, isiSurat, kopSurat, tandaTangan, documentId, sigMode, pengaturan]);

    useEffect(() => {
        const checkSecurityAndSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUserAktif(data?.session?.user || null);

            const freeUsed = localStorage.getItem('futura_free_used') === 'true';
            const premium = localStorage.getItem('futura_premium') === 'true';

            setHasUsedFree(freeUsed);
            setIsPremium(premium);
        };

        checkSecurityAndSession();
    }, [setHalamanAktif, step]);

    useEffect(() => {
        if (editorRef.current && step === 'editor') {
            if (editorRef.current.innerHTML !== isiSurat) {
                editorRef.current.innerHTML = isiSurat;
            }
        }
    }, [isiSurat, step]);

    const handleBuatBaru = () => {
        if (!isPremium && hasUsedFree) {
            setNotifPopup({
                title: "Akses Gratis Habis",
                message: "Anda sudah menggunakan jatah 1x Generate surat gratis. Untuk membuat surat baru tanpa batas, silakan upgrade ke Mode Pro.",
                type: "warning",
                isUpgrade: true
            });
            return;
        }

        localStorage.removeItem('surat_draft_instan_futura');
        setStep('form');
        setDataForm({});
        setIsiSurat('');
        setKopSurat({ tampilkan: false, namaInstansi: '', alamatInstansi: '', kontakInstansi: '', logoKiri: null, logoKanan: null });
        setTandaTangan(null);
        setDocumentId(null);
        setPengaturan({ kertas: 'a4', fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt', spasi: '1.5' });
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const startDrawing = (e) => {
        if (sigMode !== 'draw') return;
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || sigMode !== 'draw') return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTandaTangan(null);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            setTandaTangan(canvas.toDataURL('image/png'));
            setNotifPopup({ title: "Tersimpan", message: "Tanda tangan digital berhasil disimpan.", type: "success" });
        }
    };

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

    const prosesGenerate = () => {
        if (!isPremium && hasUsedFree) {
            handleBuatBaru();
            return;
        }

        const templatePilihan = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.templateStandar || "";
        let hasilInstan = templatePilihan;
        const formAktif = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.fields || [];

        formAktif.forEach(field => {
            const regex = new RegExp(`\\{${field.name}\\}`, 'g');
            const nilaiUser = dataForm[field.name];
            hasilInstan = hasilInstan.replace(regex, nilaiUser ? nilaiUser : `[${field.label}]`);
        });

        // Mengubah baris baru \n menjadi <br/> agar siap di-render oleh WYSIWYG
        const htmlFormatted = bersihkanMarkdown(hasilInstan).replace(/\n/g, '<br/>');
        setIsiSurat(htmlFormatted);

        setStep('editor');
        if (!isPremium) {
            localStorage.setItem('futura_free_used', 'true');
            setHasUsedFree(true);
        }
    };

    const syncTextBeforeProcess = () => {
        const divIsi = document.getElementById('isi-surat-textarea');
        if (divIsi) {
            let currentText = divIsi.innerHTML;
            setIsiSurat(currentText);
            return currentText;
        }
        return isiSurat;
    };

    const unduhPDF = async () => {
        syncTextBeforeProcess();

        setIsDownloading(true);
        setNotifPopup({ title: "Mengunduh PDF...", message: "File sedang dibuat di server dan akan langsung terunduh otomatis ke perangkat Anda...", type: "warning" });

        const isF4 = pengaturan.kertas === 'f4';
        const ukuranKertas = isF4 ? '215.9mm 330.2mm' : '210mm 297mm';

        const previewElement = document.getElementById('surat-paper-preview');

        if (!previewElement) {
            setIsDownloading(false);
            setNotifPopup({ title: "Error", message: "Gagal menemukan area preview dokumen.", type: "error" });
            return;
        }

        const clone = previewElement.cloneNode(true);
        const styleNodes = document.querySelectorAll('style, link[rel="stylesheet"]');
        let stylesHtml = '';
        styleNodes.forEach(node => {
            stylesHtml += node.outerHTML + '\n';
        });

        const baseUrl = window.location.origin;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="utf-8" />
                <base href="${baseUrl}" />
                <style>
                    * { box-sizing: border-box; }
                    @page { size: ${ukuranKertas}; margin: 0; }
                    body { 
                        margin: 0; 
                        padding: 0; 
                        background: #ffffff; 
                        color: #000000;
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                        font-family: ${pengaturan.fontFamily.replace(/"/g, "'")};
                    }
                    #surat-paper-preview { 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important; 
                        transform: none !important; 
                        min-height: auto !important;
                    }
                </style>
                ${stylesHtml}
            </head>
            <body>
                ${clone.outerHTML}
            </body>
            </html>
        `;

        try {
            const filename = `Surat_${dataForm.nama || dataForm.nama1 || 'Instan'}.pdf`;
            const response = await fetch('/api/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'x-filename': filename
                },
                body: htmlContent,
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setIsDownloading(false);
            setNotifPopup(null);
            setShowSuccessAnim(true);
            setTimeout(() => setShowSuccessAnim(false), 3500);
        } catch (err) {
            console.error("Gagal cetak server-side:", err);
            setIsDownloading(false);
            setNotifPopup({
                title: "Gagal Cetak",
                message: `Detail error asli: ${err?.message || err?.toString() || 'Tidak diketahui'}`,
                type: "error"
            });
        }
    };

    const handleBayarPremium = async () => {
        if (!userAktif) return setNotifPopup({ title: "Akses Ditolak", message: "Silakan login terlebih dahulu.", type: "error" });

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
                    onSuccess: function () {
                        setNotifPopup({ title: "Pembayaran Sukses!", message: "Selamat datang di Mode Pro. Silakan nikmati akses tanpa batas.", type: "success" });
                        localStorage.setItem('futura_premium', 'true');
                        setIsPremium(true);
                        setHasUsedFree(false);
                    },
                    onPending: function () { setNotifPopup({ title: "Menunggu", message: "Pembayaran sedang diproses...", type: "warning" }); },
                    onError: function () { setNotifPopup({ title: "Gagal", message: "Transaksi gagal diproses.", type: "error" }); },
                    onClose: function () { setNotifPopup({ title: "Dibatalkan", message: "Anda menutup jendela pembayaran.", type: "warning" }); }
                });
            }
        } catch (error) {
            setNotifPopup({ title: "Error Server", message: "Gagal memuat layanan pembayaran.", type: "error" });
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const formAktif = TEMPLATE_SURAT.find(t => t.id === templateAktif)?.fields || [];
    const paperWidth = pengaturan.kertas === 'f4' ? '215.9mm' : '210mm';
    const paperHeight = pengaturan.kertas === 'f4' ? '330.2mm' : '297mm';

    return (
        <div className="py-12 px-4 md:px-6 bg-slate-100 min-h-screen relative font-normal text-slate-800 overflow-hidden">

            {notifPopup && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center shadow-2xl animate-scale-in">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${notifPopup.type === 'success' ? 'bg-green-100 text-green-500' : notifPopup.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
                            {notifPopup.type === 'success' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                            {notifPopup.type === 'error' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>}
                            {notifPopup.type === 'warning' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{notifPopup.title}</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed whitespace-pre-wrap">{notifPopup.message}</p>

                        {notifPopup.isUpgrade ? (
                            <div className="flex gap-3">
                                <button onClick={() => setNotifPopup(null)} className="w-1/2 bg-slate-200 text-slate-800 py-3 rounded-md hover:bg-slate-300 transition font-medium">Batal</button>
                                <button onClick={() => { setNotifPopup(null); handleBayarPremium(); }} className="w-1/2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-bold">Upgrade Pro</button>
                            </div>
                        ) : (
                            notifPopup.type !== 'warning' && (
                                <button onClick={() => setNotifPopup(null)} className="w-full bg-slate-900 text-white py-3 rounded-md hover:bg-slate-800 transition">Mengerti</button>
                            )
                        )}
                    </div>
                </div>
            )}

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
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setHalamanAktif('beranda')} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition">
                        <span>←</span> Kembali ke Beranda
                    </button>

                    <button onClick={handleBuatBaru} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:border-red-300 transition shadow-sm text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Buat Surat Baru
                    </button>
                </div>

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
                                    setDataForm({});
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
                                            <input type="text" name="namaInstansi" placeholder="Nama Instansi/Perusahaan" value={kopSurat.namaInstansi || ''} onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                            <input type="text" name="alamatInstansi" placeholder="Alamat Lengkap Instansi" value={kopSurat.alamatInstansi || ''} onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                            <input type="text" name="kontakInstansi" placeholder="Telepon / Email / Website" value={kopSurat.kontakInstansi || ''} onChange={handleKopChange} className="w-full px-4 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-purple-400" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kiri (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKiri')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer border border-slate-200 p-1.5 rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-slate-500 block mb-1">Logo Kanan (Opsional)</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoKanan')} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer border border-slate-200 p-1.5 rounded-lg" />
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
                                                    <textarea name={field.name} value={dataForm[field.name] || ''} onChange={handleFormChange} placeholder={field.placeholder} rows="4" className="px-4 py-3 border border-slate-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                                                ) : (
                                                    <input type="text" name={field.name} value={dataForm[field.name] || ''} onChange={handleFormChange} placeholder={field.placeholder} className="px-4 py-3 border border-slate-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">3. Tanda Tangan (Opsional)</h3>
                                <div className="flex gap-3 mb-4">
                                    <button onClick={() => setSigMode('upload')} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${sigMode === 'upload' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Upload Gambar</button>
                                    <button onClick={() => setSigMode('draw')} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${sigMode === 'draw' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>Gambar Langsung</button>
                                </div>

                                {sigMode === 'upload' ? (
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ttd')} className="text-sm w-full md:w-1/2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer border border-slate-200 p-2 rounded-lg" />
                                ) : (
                                    <div className="w-full md:w-1/2 flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                                        <canvas
                                            ref={canvasRef}
                                            width={400}
                                            height={200}
                                            className="w-full max-w-sm h-[150px] bg-white border-2 border-dashed border-purple-300 rounded-xl cursor-crosshair touch-none shadow-sm transition hover:border-purple-500 mx-auto"
                                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                                        />
                                        <div className="flex justify-between w-full max-w-sm mx-auto mt-4 items-center">
                                            <button onClick={clearSignature} className="text-sm text-red-600 hover:text-red-800 font-bold px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition">Hapus TTD</button>
                                            <button onClick={saveSignature} className="text-sm bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition shadow-md font-bold">Simpan TTD</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end">
                            <button onClick={prosesGenerate} className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 transition transform hover:-translate-y-1">
                                Generate Instan
                            </button>
                        </div>
                    </div>
                )}

                {step === 'editor' && (
                    <div className="animate-slide-up relative">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4 sticky top-24 z-30">
                            <h3 className="text-xl font-bold text-slate-800">Review & Edit Dokumen <span className="text-purple-500">(Versi Instan)</span></h3>
                            <div className="flex gap-3">
                                <button disabled={isDownloading} onClick={() => setStep('form')} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition disabled:opacity-50">Edit Form</button>

                                <button disabled={isDownloading} onClick={unduhPDF} className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition flex items-center gap-2 disabled:opacity-50">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    {isDownloading ? 'Memproses...' : 'Unduh PDF Asli'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-6 items-center">
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 block mb-1 font-bold">Ukuran Kertas</label>
                                <select value={pengaturan.kertas} onChange={e => setPengaturan({ ...pengaturan, kertas: e.target.value })} className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 transition">
                                    <option value="a4">A4 (21 x 29.7 cm)</option>
                                    <option value="f4">F4 / Folio (21.5 x 33 cm)</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 block mb-1 font-bold">Jenis Font</label>
                                <select value={pengaturan.fontFamily} onChange={e => setPengaturan({ ...pengaturan, fontFamily: e.target.value })} className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 transition">
                                    <option value='"Times New Roman", Times, serif'>Times New Roman</option>
                                    <option value='Arial, Helvetica, sans-serif'>Arial</option>
                                    <option value='"Courier New", Courier, monospace'>Courier New</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 block mb-1 font-bold">Ukuran Font</label>
                                <select value={pengaturan.fontSize} onChange={e => setPengaturan({ ...pengaturan, fontSize: e.target.value })} className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 transition">
                                    <option value="10pt">10 pt</option>
                                    <option value="11pt">11 pt</option>
                                    <option value="12pt">12 pt (Standar)</option>
                                    <option value="14pt">14 pt</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-500 block mb-1 font-bold">Spasi Baris</label>
                                <select value={pengaturan.spasi} onChange={e => setPengaturan({ ...pengaturan, spasi: e.target.value })} className="bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-purple-500 transition">
                                    <option value="1">1.0 (Rapat)</option>
                                    <option value="1.15">1.15</option>
                                    <option value="1.5">1.5 (Standar)</option>
                                    <option value="2">2.0 (Renggang)</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto pb-12 flex md:justify-center bg-slate-200/50 p-2 md:p-6 rounded-xl border border-slate-300 shadow-inner">
                            <div id="surat-paper-preview" className="bg-white shadow-xl flex-shrink-0 relative transition-all duration-300" style={{ width: paperWidth, minHeight: paperHeight, padding: '25.4mm', boxSizing: 'border-box', backgroundColor: 'white', color: 'black', fontFamily: pengaturan.fontFamily }}>

                                {kopSurat.tampilkan && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid black', paddingBottom: '1rem', marginBottom: '2rem', width: '100%' }}>
                                        <div style={{ width: '6rem', flexShrink: 0 }}>
                                            {kopSurat.logoKiri && <img src={kopSurat.logoKiri} alt="Logo Kiri" style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '6rem' }} />}
                                        </div>
                                        <div style={{ flexGrow: 1, textAlign: 'center', padding: '0 1rem' }}>
                                            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'black', marginBottom: '4px', fontFamily: pengaturan.fontFamily }}>{kopSurat.namaInstansi || 'NAMA INSTANSI'}</h1>
                                            <p style={{ fontSize: '0.875rem', color: 'black', marginBottom: '4px', fontFamily: pengaturan.fontFamily }}>{kopSurat.alamatInstansi || 'Alamat Instansi Lengkap'}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'black', fontFamily: pengaturan.fontFamily }}>{kopSurat.kontakInstansi || 'Kontak: -'}</p>
                                        </div>
                                        <div style={{ width: '6rem', flexShrink: 0, textAlign: 'right' }}>
                                            {kopSurat.logoKanan && <img src={kopSurat.logoKanan} alt="Logo Kanan" style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '6rem', marginLeft: 'auto' }} />}
                                        </div>
                                    </div>
                                )}

                                <div
                                    id="isi-surat-textarea"
                                    ref={editorRef}
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => setIsiSurat(e.currentTarget.innerHTML)}
                                    style={{
                                        width: '100%',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        fontFamily: pengaturan.fontFamily,
                                        fontSize: pengaturan.fontSize,
                                        lineHeight: pengaturan.spasi,
                                        textAlign: 'justify',
                                        minHeight: '150mm',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: isiSurat }}
                                />

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem', fontFamily: pengaturan.fontFamily, fontSize: pengaturan.fontSize, width: '100%' }}>
                                    <div style={{ textAlign: 'center', width: '16rem', color: 'black' }}>
                                        <p style={{ marginBottom: '0.5rem' }}>{dataForm.tempatTanggal || 'Tempat, Tanggal'}</p>
                                        <p style={{ marginBottom: '1rem' }}>Hormat saya,</p>

                                        <div style={{ height: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0', position: 'relative' }}>
                                            {tandaTangan ? (
                                                <img src={tandaTangan} alt="Tanda Tangan" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                            ) : (
                                                <span style={{ color: '#cbd5e1', fontSize: '0.875rem', fontStyle: 'italic' }}>(Area Tanda Tangan)</span>
                                            )}
                                        </div>

                                        <p style={{ fontWeight: 'bold', textDecoration: 'underline', margin: 0 }}>{dataForm.nama || dataForm.nama1 || 'Nama Lengkap / Instansi'}</p>
                                        {(dataForm.posisi || dataForm.jabatan) && (
                                            <p style={{ margin: 0 }}>{dataForm.posisi || dataForm.jabatan}</p>
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