// File: src/app/api/pdf/route.js
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Binary Chromium diambil dari CDN saat runtime (bukan di-bundle),
// jadi tidak ada lagi masalah file .so kepotong saat build.
const CHROMIUM_PACK_URL =
    'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar';

export async function POST(req) {
    let browser = null;

    try {
        const { htmlContent, filename } = await req.json();

        if (!htmlContent) {
            return NextResponse.json({ error: "Konten HTML kosong!" }, { status: 400 });
        }

        const isLocalDev = process.env.NODE_ENV === 'development';

        browser = await puppeteer.launch({
            args: isLocalDev ? [] : chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: isLocalDev
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || undefined)
                : await chromium.executablePath(CHROMIUM_PACK_URL),
            headless: isLocalDev ? true : chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            printBackground: true,
            preferCSSPageSize: true,
        });

        await browser.close();
        browser = null;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename || 'dokumen.pdf'}"`,
            },
        });
    } catch (error) {
        console.error("API PDF Error:", error.message);
        if (browser) {
            try { await browser.close(); } catch (e) { }
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}