// File: src/app/api/pdf/route.js
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req) {
    let browser = null;

    try {
        const { htmlContent, filename } = await req.json();

        if (!htmlContent) {
            return NextResponse.json({ error: "Konten HTML kosong!" }, { status: 400 });
        }

        const isLocalDev = process.env.NODE_ENV === 'development';

        // 🔧 FIX: matikan graphics mode supaya Chromium nggak minta
        // lib grafis (termasuk libnss3.so) yang sering hilang di
        // runtime serverless Vercel (Amazon Linux 2023)
        if (!isLocalDev) {
            chromium.setGraphicsMode = false;
        }

        browser = await puppeteer.launch({
            args: isLocalDev ? [] : chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: isLocalDev
                ? (process.env.PUPPETEER_EXECUTABLE_PATH || undefined)
                : await chromium.executablePath(),
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