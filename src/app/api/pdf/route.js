// File: src/app/api/pdf/route.js
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CHROMIUM_PACK_URL =
    'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar';

export async function POST(req) {
    let browser = null;

    try {
        // [PERBAIKAN WAJIB]: Gunakan req.text() BUKAN req.json()
        // Ini memastikan server menerima raw HTML tanpa mencoba mem-parsingnya sebagai JSON
        const htmlContent = await req.text();

        // Ambil nama file dari custom header yang dikirim client
        const filename = req.headers.get('x-filename') || 'suratotomatis.pdf';

        if (!htmlContent) {
            return NextResponse.json({ error: "Konten HTML kosong!" }, { status: 400 });
        }

        const isLocalDev = process.env.NODE_ENV === 'development';

        const launchOptions = {
            args: isLocalDev ? [] : chromium.args,
            defaultViewport: chromium.defaultViewport,
            headless: isLocalDev ? true : chromium.headless,
        };

        if (isLocalDev) {
            launchOptions.channel = 'chrome';
        } else {
            launchOptions.executablePath = await chromium.executablePath(CHROMIUM_PACK_URL);
        }

        browser = await puppeteer.launch(launchOptions);

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
                'Content-Disposition': `attachment; filename="${filename}"`,
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