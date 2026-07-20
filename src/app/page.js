"use client";

import React, { useState, useEffect } from 'react';
import SuratEditor from '../components/SuratEditor';
import TemplateInstan from '../components/TemplateInstan';
import AuthModal from '../components/AuthModal';
import { supabase } from '../utils/supabase';
import Image from 'next/image'


export default function Home() {
  const [tampilkanPilihan, setTampilkanPilihan] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState('beranda');

  // State untuk Autentikasi
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userAktif, setUserAktif] = useState(null);

  // State untuk Kuota & Premium Berbasis Waktu (SaaS)
  const [isPremium, setIsPremium] = useState(false);
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [premiumUntilDate, setPremiumUntilDate] = useState(null);

  // State untuk Loading & Notifikasi Pop-up
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [notifPopup, setNotifPopup] = useState(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  // State untuk Ulasan (Reviews)
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ nama: '', pekerjaan: '', rating: 5, komentar: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fake Nogif
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % fakeActivities.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 1. Mengecek sesi login dan Masa Aktif Premium di Database
  useEffect(() => {
    const checkSession = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;

      if (user) {
        setUserAktif(user);

        // Tarik data profil pengguna dari database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('premium_until, is_premium')
          .eq('id', user.id)
          .single();

        if (profile && profile.premium_until) {
          const validUntil = new Date(profile.premium_until);
          const sekarang = new Date();

          if (validUntil > sekarang) {
            setIsPremium(true);
            localStorage.setItem('futura_premium', 'true');
            setPremiumUntilDate(validUntil.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
          } else {
            setIsPremium(false);
            localStorage.removeItem('futura_premium');
            setPremiumUntilDate(null);
            await supabase.from('profiles').update({ is_premium: false }).eq('id', user.id);
          }
        } else {
          setIsPremium(false);
          localStorage.removeItem('futura_premium');
          setPremiumUntilDate(null);
        }
      } else {
        setIsPremium(false);
        localStorage.removeItem('futura_premium');
      }

      if (localStorage.getItem('futura_free_used') === 'true') {
        setHasUsedFree(true);
      }
    };

    checkSession();
    fetchReviews(); // Panggil fungsi ambil ulasan

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserAktif(null);
        setIsPremium(false);
        setPremiumUntilDate(null);
        localStorage.removeItem('futura_premium');
      } else if (event === 'SIGNED_IN') {
        checkSession();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // FUNGSI MENGAMBIL ULASAN DARI SUPABASE
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Ambil 6 ulasan terbaru

      if (data && data.length > 0) {
        setReviews(data);
      } else {
        // Fallback dummy jika tabel masih kosong
        setReviews([
          { id: 1, nama: "Andi Pratama", pekerjaan: "HR Manager", rating: 5, komentar: "Sangat membantu tugas HRD. Buat surat peringatan dan mutasi karyawan jadi hitungan detik." },
          { id: 2, nama: "Siti Nurhaliza", pekerjaan: "Mahasiswa Akhir", rating: 5, komentar: "Terbantu banget buat ngurus surat pengantar riset dan beasiswa. Nggak perlu pusing mikir kata-kata formal lagi." },
          { id: 3, nama: "Budi Santoso", pekerjaan: "Pemilik UMKM", rating: 5, komentar: "Sebagai orang desa yang baru melek digital, bikin Surat Perjanjian Jual Beli sekarang nggak usah repot bayar notaris mahal." }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // FUNGSI MENGIRIM ULASAN KE SUPABASE
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userAktif) return setNotifPopup({ title: "Akses Ditolak", message: "Silakan login terlebih dahulu untuk memberikan ulasan.", type: "warning" });
    if (!reviewForm.nama || !reviewForm.pekerjaan || !reviewForm.komentar) return setNotifPopup({ title: "Form Tidak Lengkap", message: "Harap isi semua kolom ulasan.", type: "warning" });

    setIsSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        user_email: userAktif.email,
        nama: reviewForm.nama,
        pekerjaan: reviewForm.pekerjaan,
        rating: reviewForm.rating,
        komentar: reviewForm.komentar
      }]);

      if (error) throw error;

      setNotifPopup({ title: "Terima Kasih!", message: "Ulasan Anda telah berhasil dikirim.", type: "success" });
      setReviewForm({ nama: '', pekerjaan: '', rating: 5, komentar: '' });
      fetchReviews(); // Refresh daftar ulasan
    } catch (error) {
      setNotifPopup({ title: "Gagal", message: "Gagal mengirim ulasan, pastikan koneksi internet stabil.", type: "error" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setNotifPopup({ title: "Berhasil", message: "Anda telah berhasil keluar.", type: "success" });
  };

  const handleBuatSurat = () => {
    setTampilkanPilihan(true);
    setTimeout(() => {
      const element = document.getElementById('pilihan-surat');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handlePilihMode = (mode) => {
    if (!isPremium && hasUsedFree) {
      setShowUpgradePopup(true);
    } else {
      setHalamanAktif(mode);
    }
  };

  const batalkanUpgrade = () => {
    setShowUpgradePopup(false);
    setTampilkanPilihan(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBayarPremium = async () => {
    if (!userAktif) {
      setNotifPopup({ title: "Akses Ditolak", message: "Silakan Login atau Daftar terlebih dahulu sebelum membeli Paket Pro.", type: "error" });
      setShowAuthModal(true);
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
          customer_details: { first_name: userAktif.email.split('@')[0], email: userAktif.email }
        })
      });

      const data = await response.json();

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: async function (result) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30);
            const formattedDate = expiry.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            const { error: dbError } = await supabase.from('profiles').upsert({
              id: userAktif.id,
              email: userAktif.email,
              is_premium: true,
              premium_until: expiry.toISOString()
            }, { onConflict: 'id' });

            if (dbError) {
              setNotifPopup({ title: "Peringatan", message: "Pembayaran berhasil, namun gagal sinkronisasi profil. Harap hubungi admin.", type: "warning" });
            } else {
              setNotifPopup({ title: "Pembayaran Sukses!", message: `Paket Pro Anda telah aktif hingga ${formattedDate}.`, type: "success" });
              setIsPremium(true);
              localStorage.setItem('futura_premium', 'true');
              setPremiumUntilDate(formattedDate);
            }
          },
          onPending: function (result) { setNotifPopup({ title: "Menunggu", message: "Menunggu pembayaran Anda diselesaikan...", type: "warning" }); },
          onError: function (result) { setNotifPopup({ title: "Gagal", message: "Pembayaran gagal diproses!", type: "error" }); },
          onClose: function () { setNotifPopup({ title: "Dibatalkan", message: "Anda menutup jendela sebelum menyelesaikan pembayaran.", type: "warning" }); }
        });
      } else {
        setNotifPopup({ title: "Error Sistem", message: "Sistem pembayaran belum siap. Pastikan koneksi internet stabil.", type: "error" });
      }
    } catch (error) {
      setNotifPopup({ title: "Error Server", message: "Terjadi kesalahan saat menghubungi server pembayaran.", type: "error" });
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Fake Nofif
  const fakeActivities = [
    { name: "Zorvian Keltro", action: "berhasil berlangganan Paket Pro" },
    { name: "Lunexa Vior", action: "baru saja membuat Surat Lamaran Kerja" },
    { name: "Treviko Sarn", action: "berhasil berlangganan Paket Pro" },
    { name: "Mirexon Tal", action: "baru saja membuat Surat Kuasa" },
    { name: "Kelvior Anza", action: "berhasil berlangganan Paket Pro" },
    { name: "Novyrex Lum", action: "baru saja membuat Surat Perjanjian" },
    { name: "Astrevio Nax", action: "berhasil berlangganan Paket Pro" },
    { name: "Veltron Iska", action: "baru saja mencetak Surat Keterangan" },
    { name: "Xavrion Teska", action: "berhasil berlangganan Paket Pro" },
    { name: "Lorvexa Kim", action: "baru saja membuat Surat Magang" },
  ];

  const [activityIndex, setActivityIndex] = useState(0);
  const [showFakeNotif, setShowFakeNotif] = useState(true);

  const hideFakeNotifTemporarily = () => {
    setShowFakeNotif(false);

    setTimeout(() => {
      setShowFakeNotif(true);
    }, 5000); // muncul lagi setelah 5 detik
  };

  return (
    <div className="min-h-screen flex flex-col font-normal text-futura-text bg-futura-bg relative scroll-smooth">

      {/* POP-UP NOTIFIKASI UMUM */}
      {notifPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
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

      {/* POP-UP UPGRADE PAKET PRO */}
      {showUpgradePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md px-4">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-2xl animate-scale-in">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Batas Gratis Habis!</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Anda telah menggunakan jatah pembuatan surat gratis. Tingkatkan ke Paket Pro hanya Rp 10.000/bulan untuk menikmati akses tanpa batas.</p>
            <div className="flex gap-4">
              <button onClick={batalkanUpgrade} className="w-full py-3 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition">Batal</button>
              <button
                onClick={() => { setShowUpgradePopup(false); handleBayarPremium(); }}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
              >
                Setuju & Bayar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={(user) => setUserAktif(user)} />
      )}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="text-2xl tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => { setHalamanAktif('beranda'); setTampilkanPilihan(false); }}>
          <Image src="/LOGO FUTURA LINK.png" alt="Futura Link" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="bg-gradient-to-r from-futura-primary to-futura-accent bg-clip-text text-transparent font-bold">Futura</span>
          <span className="text-gray-700">Docs</span>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          {['Beranda', 'Katalog Surat', 'Testimoni', 'Harga'].map((item, index) => (
            <a key={index} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => { setHalamanAktif('beranda'); if (item === 'Beranda') setTampilkanPilihan(false); }} className="text-futura-muted text-sm font-medium hover:text-futura-primary transition-all duration-300 relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-futura-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {userAktif ? (
            <div className="flex items-center gap-4">

              {/* INDIKATOR PENGGUNA PRO (CROWN ICON) */}
              {isPremium && (
                <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 text-yellow-700 px-3 py-1.5 rounded-full shadow-sm animate-pulse-slow">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <span className="text-xs font-bold tracking-wide">PRO</span>
                </div>
              )}

              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs text-slate-400">Login sebagai:</span>
                <span className="text-sm text-slate-700 font-medium truncate max-w-[150px]">{userAktif.email}</span>
              </div>
              <button onClick={handleLogout} className="border border-red-200 text-red-500 bg-red-50 text-sm px-4 py-2 rounded-md hover:bg-red-100 transition-colors font-medium">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="relative z-50 cursor-pointer bg-slate-900 text-white font-medium text-sm px-6 py-2.5 rounded-md hover:shadow-lg hover:bg-slate-800 transition-all duration-300">Masuk / Daftar</button>
          )}
        </div>
      </header>

      <main className="flex-grow relative z-20">
        {halamanAktif === 'beranda' && (
          <>
            <section id="beranda" className="relative flex flex-col items-center justify-center text-center px-4 py-32 lg:py-40 overflow-hidden bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white z-0 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="animate-scale-in inline-block border border-blue-200 bg-blue-50 text-futura-primary text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase shadow-sm">
                  Dipercaya oleh 500+ Profesional
                </div>
                <h1 className="animate-slide-left delay-100 text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                  Buat Surat Formal <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sekejap Mata
                  </span>
                </h1>
                <p className="animate-slide-up delay-200 text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Platform generator surat dengan 60+ template berstandar nasional dan dibekali asisten AI pintar. Selesaikan administrasi pekerjaan, sekolah, desa, dan bisnis tanpa perlu mengetik manual.
                </p>
                <button onClick={handleBuatSurat} className="relative z-50 cursor-pointer animate-scale-in delay-300 bg-blue-600 text-white font-medium text-xl px-12 py-5 rounded-md hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  Mulai Buat Surat Sekarang
                </button>
                <p className="mt-4 text-sm text-slate-400">Gratis 1x percobaan tanpa perlu kartu kredit.</p>
              </div>
            </section>

            {tampilkanPilihan && (
              <section id="pilihan-surat" className="py-20 px-6 bg-slate-50 border-t border-gray-200 relative">
                <div className="max-w-6xl mx-auto relative z-10">
                  <h2 className="animate-slide-left text-3xl font-bold text-center text-gray-900 mb-4">Pilih Cara Pembuatan</h2>
                  <p className="text-center text-slate-500 mb-12 max-w-lg mx-auto">Anda dapat memilih untuk membiarkan AI menyusun kalimat secara ajaib, atau menggunakan template instan kami.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div onClick={() => handlePilihMode('editor_ai')} className="group bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-400 cursor-pointer transition-all transform hover:-translate-y-1">
                      <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Super Editor AI</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">Cukup ketik alasan dengan bahasa sehari-hari, AI kami akan mengubahnya menjadi kalimat surat yang sangat formal dan profesional.</p>
                      <span className="text-sm font-medium text-blue-600 flex items-center gap-2">Pilih Mode AI <span className="transform group-hover:translate-x-2 transition-transform">→</span></span>
                    </div>

                    <div onClick={() => handlePilihMode('editor_instan')} className="group bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-400 cursor-pointer transition-all transform hover:-translate-y-1">
                      <div className="w-14 h-14 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Instan</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">Langsung isi form dan cetak. Sangat cocok jika Anda ingin surat yang cepat tanpa perlu modifikasi kalimat AI.</p>
                      <span className="text-sm font-medium text-purple-600 flex items-center gap-2">Pilih Mode Instan <span className="transform group-hover:translate-x-2 transition-transform">→</span></span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* SEKSI KATALOG SURAT (Dengan SVG Icons) */}
            <section id="katalog-surat" className="py-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Mendukung 60+ Jenis Dokumen</h2>
                  <p className="text-slate-600 max-w-2xl mx-auto">Satu platform untuk semua keperluan administrasi. Dari urusan kampus hingga legalitas bisnis.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { title: "Pekerjaan & HRD", desc: "Lamaran, Cuti, SP1, Paklaring, Resign", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> },
                    { title: "Desa", desc: "SKTM, SKU, Pengantar RT, Surat Pindah", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
                    { title: "Legal & Perjanjian", desc: "Jual Beli, Hutang, Surat Kuasa, Pranikah", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg> },
                    { title: "Akademik & Kampus", desc: "Beasiswa, Magang, Izin Riset, SKL", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg> },
                    { title: "Bisnis & Niaga", desc: "Invoice, Surat Jalan, Penawaran, MoU", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> },
                    { title: "Organisasi", desc: "Undangan, Proposal, SK Panitia, Mandat", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
                    { title: "Lain-Lain", desc: "Lapor Kehilangan, Ahli Waris, dll", icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg> },
                    {
                      title: "Dan Banyak Lagi", desc: "Template akan terus bertambah tiap bulan", icon: <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm9 4v6m3-3H9"
                        />
                      </svg>
                    }
                  ].map((cat, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-lg border border-slate-100 hover:shadow-md transition text-slate-700">
                      <div className="text-blue-500 mb-4">{cat.icon}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{cat.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SEKSI TESTIMONI (REAL TIME SUPABASE) */}
            <section id="testimoni" className="py-24 px-6 bg-slate-900 text-white border-t border-slate-800">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka?</h2>
                  <p className="text-slate-400">Ulasan asli dari ratusan profesional yang telah mempercayakan administrasinya kepada kami.</p>
                </div>

                {/* GRID ULASAN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {reviews.map((testi) => (
                    <div key={testi.id} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition">
                      <div className="flex text-yellow-400 mb-4">{"★".repeat(testi.rating)}</div>
                      <p className="text-slate-300 mb-6 italic leading-relaxed">"{testi.komentar}"</p>
                      <div>
                        <h4 className="font-bold text-blue-100">{testi.nama}</h4>
                        <p className="text-xs text-slate-500">{testi.pekerjaan}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FORM KIRIM ULASAN */}
                <div className="mt-16 bg-slate-800/50 border border-slate-700 rounded-xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-xl font-bold text-center mb-2">Bagikan Pengalaman Anda</h3>
                  <p className="text-sm text-slate-400 text-center mb-8">Bantu kami menjadi lebih baik dengan memberikan ulasan jujur Anda.</p>

                  {userAktif ? (
                    <form onSubmit={handleSubmitReview} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Nama Tampil</label>
                          <input type="text" required value={reviewForm.nama} onChange={(e) => setReviewForm({ ...reviewForm, nama: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Cth: Budi Santoso" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">Pekerjaan / Instansi</label>
                          <input type="text" required value={reviewForm.pekerjaan} onChange={(e) => setReviewForm({ ...reviewForm, pekerjaan: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Cth: Kepala Desa / HRD" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Ulasan Anda</label>
                        <textarea required value={reviewForm.komentar} onChange={(e) => setReviewForm({ ...reviewForm, komentar: e.target.value })} rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Tuliskan pengalaman Anda menggunakan Futura Docs..."></textarea>
                      </div>
                      <button type="submit" disabled={isSubmittingReview} className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
                        {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 bg-slate-900 rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm mb-4">Anda harus masuk untuk dapat memberikan ulasan.</p>
                      <button onClick={() => setShowAuthModal(true)} className="bg-slate-700 text-white text-sm px-6 py-2 rounded-md hover:bg-slate-600 transition">Masuk / Daftar</button>
                    </div>
                  )}
                </div>

                {/* FAKE REALTIME TICKER */}
                <div className="border-t border-slate-800 mt-16 pt-8 text-center">
                  <p className="text-sm text-slate-500 mb-4 uppercase tracking-widest">Aktivitas Terbaru</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-blue-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>Rizky*** baru saja berlangganan</span>
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-blue-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>PT. Maju*** mencetak MoU</span>
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-blue-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>Dimas*** baru saja berlangganan</span>
                    <span className="bg-slate-800 px-4 py-2 rounded-full text-blue-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>Desa Lumpa*** mencetak SKTM</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="harga" className="py-28 px-6 bg-slate-50 relative border-t border-gray-200">
              <div className="max-w-6xl mx-auto relative z-10">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Investasi Administrasi</h2>
                <p className="text-center text-slate-600 mb-16">Harga transparan. Satu kali bayar untuk efisiensi sebulan penuh.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">

                  <div className="bg-white border border-gray-200 p-10 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide">Trial</h3>
                    <div className="text-5xl font-bold text-gray-900 mb-6">Gratis</div>
                    <p className="text-slate-500 text-sm mb-8">Cocok untuk mencoba kemampuan AI kami.</p>
                    <ul className="text-gray-600 text-left space-y-4 mb-10 text-sm">
                      <li className="flex items-center gap-3"><span className="text-green-500 font-bold">✓</span> 1x Pembuatan Surat Bebas</li>
                      <li className="flex items-center gap-3"><span className="text-green-500 font-bold">✓</span> Fitur AI Generator Aktif</li>
                      <li className="flex items-center gap-3 text-slate-400"><span className="text-red-400 font-bold">✕</span> Ada Watermark / Iklan</li>
                    </ul>
                    <button
                      onClick={handleBuatSurat}
                      className={`w-full font-bold py-4 rounded-md transition-colors ${(!isPremium && hasUsedFree) ? 'border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 cursor-not-allowed' : 'border border-gray-300 text-gray-700 hover:bg-slate-50'}`}
                    >
                      {(!isPremium && hasUsedFree) ? 'Batas Gratis Habis' : 'Coba Sekarang'}
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 rounded-xl shadow-2xl transform md:scale-105 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-bl-lg">TERLARIS</div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Profesional</h3>
                    <div className="text-5xl font-bold text-white mb-6">Rp 10.000 <span className="text-lg font-normal text-white/70">/bulan</span></div>
                    <p className="text-blue-200 text-sm mb-8">
                      {premiumUntilDate ? `Status: Aktif s/d ${premiumUntilDate}` : 'Tidak ada biaya tersembunyi.'}
                    </p>
                    <ul className="text-white text-left space-y-4 mb-10 text-sm">
                      <li className="flex items-center gap-3"><span className="text-yellow-400 font-bold">✓</span> Pembuatan Surat Tanpa Batas</li>
                      <li className="flex items-center gap-3"><span className="text-yellow-400 font-bold">✓</span> Bebas Watermark & Bebas Iklan</li>
                      <li className="flex items-center gap-3"><span className="text-yellow-400 font-bold">✓</span> Bebas Gunakan Kop & Logo Instansi</li>
                      <li className="flex items-center gap-3"><span className="text-yellow-400 font-bold">✓</span> Super AI Prioritas Tanpa Antre</li>
                    </ul>
                    <button
                      onClick={handleBayarPremium}
                      disabled={isLoadingPayment || isPremium}
                      className="w-full font-bold bg-white text-blue-700 py-4 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-90"
                    >
                      {isPremium ? 'Paket Telah Aktif ✅' : (isLoadingPayment ? 'Memproses...' : 'Tingkatkan ke Pro')}
                    </button>
                  </div>

                </div>
              </div>
            </section>
          </>
        )}
        {/* Fake Notif - Hanya tampil di Landing Page */}
        {halamanAktif === "beranda" && (
          <div className="fixed bottom-5 left-5 z-50 animate-[popupSlide_2s_linear_infinite]">

            <div
              className="bg-white rounded-xl shadow-2xl border border-gray-200
      px-4 py-3 flex items-center gap-3
      max-w-xs sm:max-w-sm"
            >

              <div
                className="w-11 h-11 rounded-full bg-blue-100
        flex items-center justify-center"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A9 9 0 1118.878 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0"
                  />
                </svg>

              </div>

              <div>

                <p className="font-semibold text-gray-900 text-sm">
                  {fakeActivities[activityIndex].name}
                </p>

                <p className="text-xs text-gray-500">
                  {fakeActivities[activityIndex].action}
                </p>

                <p className="text-[10px] text-green-500 mt-1">
                  Baru saja
                </p>

              </div>

            </div>

          </div>
        )}


        {halamanAktif === 'editor_ai' && <SuratEditor setHalamanAktif={setHalamanAktif} />}
        {halamanAktif === 'editor_instan' && <TemplateInstan setHalamanAktif={setHalamanAktif} />}
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 px-6 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold text-lg">Futura Docs</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="/kontak" className="hover:text-white transition">Kontak Kami</a>
              <a href="/syarat-ketentuan" className="hover:text-white transition">Syarat &amp; Ketentuan</a>
              <a href="/kebijakan-pengembalian" className="hover:text-white transition">Kebijakan Pengembalian Dana</a>
            </div>
          </div>
          {/* TODO: ganti href di bawah dengan URL resmi Futura Link Anda */}
          <p>&copy; 2026 Hak Cipta Dilindungi. Dikembangkan oleh{' '}
            <a href="https://futuraalink.id" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white underline underline-offset-2">
              Futura Link
            </a>.
          </p>
        </div>
      </footer>
    </div>
  );
}