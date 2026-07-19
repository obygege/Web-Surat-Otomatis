// File: src/app/api/pdf/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { htmlContent, filename } = await req.json();

        // 🔥 API KEY PDFSHIFT (server-only, aman karena tidak pernah dikirim ke browser)
        const API_KEY = process.env.PDFSHIFT_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ error: "API Key kosong!" }, { status: 500 });
        }

        const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');

        // Ukuran kertas & margin sudah ditentukan lewat CSS @page di dalam htmlContent
        // (dikirim dari frontend), jadi di sini kita tidak perlu override format lagi.
        const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: htmlContent,
                use_print: true, // hormati aturan @page dari CSS yang dikirim
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename || 'dokumen.pdf'}"`,
            },
        });
    } catch (error) {
        console.error("API PDF Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}