import midtransClient from 'midtrans-client';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Menerima data dari frontend
        const body = await req.json();
        const { order_id, gross_amount, customer_details } = body;

        // 1. VALIDASI DATA FRONTEND: Pastikan data transaksi tidak kosong
        if (!order_id || !gross_amount) {
            return NextResponse.json(
                { error: "Order ID dan Nominal (Gross Amount) wajib diisi." },
                { status: 400 }
            );
        }

        // 2. VALIDASI SERVER KEY: Mencegah error Midtrans 401 Unauthorized
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        if (!serverKey || serverKey.includes('YOUR_SERVER_KEY')) {
            console.error("🚨 ERROR SERVER: MIDTRANS_SERVER_KEY belum diatur di .env.local");
            return NextResponse.json(
                { error: "Sistem pembayaran sedang gangguan. Hubungi Admin." },
                { status: 500 }
            );
        }

        // 3. INISIALISASI MIDTRANS SNAP
        let snap = new midtransClient.Snap({
            isProduction: true, // Set 'false' untuk Sandbox (Testing)
            serverKey: serverKey
        });

        // 4. SUSUN PARAMETER TRANSAKSI
        let parameter = {
            transaction_details: {
                order_id: order_id,
                gross_amount: gross_amount
            },
            credit_card: {
                secure: true
            },
            // Fallback (cadangan) jika user belum login sempurna tapi memaksa bayar
            customer_details: customer_details || {
                first_name: "Pengguna Futura",
                email: "guest@futura.co.id"
            }
        };

        // 5. MINTA TOKEN KE SERVER MIDTRANS
        const transaction = await snap.createTransaction(parameter);

        // 6. KEMBALIKAN TOKEN KE FRONTEND UNTUK MEMUNCULKAN POP-UP
        return NextResponse.json({ token: transaction.token }, { status: 200 });

    } catch (error) {
        console.error("🚨 Detail Error Midtrans:", error.message);
        return NextResponse.json(
            { error: "Terjadi kesalahan internal pada Payment Gateway." },
            { status: 500 }
        );
    }
}