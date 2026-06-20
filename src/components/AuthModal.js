"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Pastikan inisialisasi menggunakan ENV yang aman
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default function AuthModal({ onClose, onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // =================================================================
    // FUNGSI LOGIN / DAFTAR DENGAN EMAIL
    // =================================================================
    const handleAuthEmail = async (e) => {
        e.preventDefault();
        if (!supabase) return alert("Sistem database belum siap.");
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({ email, password });
            } else {
                result = await supabase.auth.signUp({ email, password });
                if (result.data?.user) {
                    await supabase.from('profiles').insert([{
                        id: result.data.user.id,
                        email: result.data.user.email
                    }]);
                }
            }

            if (result.error) throw result.error;

            alert(isLogin ? "Login Berhasil!" : "Daftar Berhasil! Silakan cek email/login.");
            if (result.data.user) {
                onLoginSuccess(result.data.user);
                onClose();
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // =================================================================
    // FUNGSI LOGIN DENGAN GOOGLE
    // =================================================================
    const handleGoogleLogin = async () => {
        if (!supabase) return alert("Sistem database belum siap.");
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Redirect kembali ke halaman saat ini setelah berhasil login
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
            // Catatan: Setelah klik, halaman akan reload ke Google. 
            // Supabase otomatis menangani sesinya setelah kembali ke web kita.
        } catch (error) {
            alert("Gagal memuat Login Google: " + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-2xl relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl">✕</button>
                <h3 className="text-2xl text-slate-900 mb-6 text-center">{isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</h3>

                {/* TOMBOL LOGIN GOOGLE */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 py-3 rounded-md hover:bg-slate-50 transition-colors mb-6 shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Lanjutkan dengan Google
                </button>

                <div className="flex items-center mb-6">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="px-3 text-xs text-slate-400">ATAU EMAIL</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* FORM LOGIN EMAIL */}
                <form onSubmit={handleAuthEmail} className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="anda@email.com" />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 mb-1 block">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-md focus:border-blue-500 focus:outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-4 shadow-sm font-medium">
                        {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline font-medium">
                        {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                    </button>
                </p>
            </div>
        </div>
    );
}