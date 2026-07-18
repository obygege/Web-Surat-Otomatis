"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const MENU = [
  { key: 'ringkasan', label: 'Ringkasan', href: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'pelanggan', label: 'Pelanggan', href: '/admin/dashboard/pelanggan', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { key: 'pembayaran', label: 'Pembayaran', href: '/admin/dashboard/pembayaran', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'keuangan', label: 'Keuangan', href: '/admin/dashboard/keuangan', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 8v2m0-10a9 9 0 100 18 9 9 0 000-18z' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* SIDEBAR - desktop only */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-white shrink-0 sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Futura Docs</p>
              <p className="text-xs text-slate-500 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {MENU.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {loggingOut ? 'Keluar...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-slate-900 text-sm">Admin Panel</span>
          </div>
          <h1 className="hidden md:block text-lg font-bold text-slate-900">
            {MENU.find((m) => m.href === pathname)?.label || 'Dashboard'}
          </h1>
          <button onClick={handleLogout} className="md:hidden text-red-500 text-sm font-medium">
            Logout
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>

        {/* FOOTER - desktop only, mobile pakai bottom nav */}
        <footer className="hidden md:block border-t border-slate-200 bg-white px-8 py-4 text-center text-xs text-slate-400">
          &copy; 2026 Futura Docs Admin Panel. Internal use only.
        </footer>
      </div>

      {/* BOTTOM NAV - mobile only, gaya mobile apps */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 py-2">
        {MENU.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition ${active ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d={item.icon} /></svg>
              <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
