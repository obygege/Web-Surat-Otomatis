// File: src/app/api/pdf/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { htmlContent } = await req.json();

        // 🔥 KITA HARDCODE API KEY-NYA DI SINI 🔥
        // Ini pakai kunci Basic Key lu yang tadi. 100% aman karena user gak bisa lihat file backend ini.
        const API_KEY = "sk_c5dfe841095ac110c41303a39620499b279b0b1b";

        if (!API_KEY) {
            return NextResponse.json({ error: "API Key kosong!" }, { status: 500 });
        }

        // Convert key ke format Basic Auth Base64 (Format wajib dari server Node.js ke PDFShift)
        const authHeader = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');

        // Tembak API PDFShift
        const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: htmlContent,
                format: 'A4',
                margin: '25.4mm'
            })
        });

        // Tangkap pesan error kalau masih gagal
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        // Ambil file PDF yang sudah dirender server PDFShift
        const pdfBuffer = await response.arrayBuffer();

        // Lempar kembali file PDF-nya ke frontend buat didownload
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="dokumen.pdf"',
            },
        });
    } catch (error) {
        console.error("API PDF Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}