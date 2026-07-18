"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

// Komponen ini KHUSUS menangani load Tailwind CDN + config-nya.
// Dibuat client component ("use client") supaya boleh pakai useEffect/onLoad,
// dan supaya urutan eksekusi terjamin: CDN Tailwind harus benar-benar
// selesai (window.tailwind ada) baru config di-set. Ini yang kemarin
// tidak terjamin saat pakai 2 <Script strategy="afterInteractive"> terpisah
// di layout.js (Server Component) - urutan load-nya race condition,
// makanya kadang stylenya hilang / config tidak kepakai.
export default function TailwindLoader() {
    const [cdnLoaded, setCdnLoaded] = useState(false);

    useEffect(() => {
        // Jaga-jaga kalau script sudah ke-load dari cache/navigasi sebelumnya
        if (typeof window !== 'undefined' && window.tailwind) {
            applyConfig();
        }
    }, [cdnLoaded]);

    const applyConfig = () => {
        if (typeof window !== 'undefined' && window.tailwind) {
            window.tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            futura: { bg: '#f8fafc', card: '#ffffff', primary: '#0284c7', accent: '#9333ea', neon: '#06b6d4', text: '#0f172a', muted: '#64748b' }
                        }
                    }
                }
            };
        }
    };

    return (
        <Script
            src="https://cdn.tailwindcss.com"
            strategy="afterInteractive"
            onLoad={() => {
                setCdnLoaded(true);
                applyConfig();
            }}
        />
    );
}