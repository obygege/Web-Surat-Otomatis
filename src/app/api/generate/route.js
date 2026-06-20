import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key Gemini tidak ditemukan di .env.local");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- SISTEM AUTO-RETRY ---
        let retries = 3; // Maksimal 3 kali percobaan
        let text = "";

        while (retries > 0) {
            try {
                // Mencoba mengirim request ke Google
                const result = await model.generateContent(prompt);
                text = result.response.text();
                break; // Jika sukses, langsung keluar dari loop (berhenti mencoba)

            } catch (err) {
                // Jika errornya karena server sibuk (503), kita coba lagi
                if (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("overloaded")) {
                    retries -= 1;
                    console.warn(`Server Google sibuk. Mencoba lagi... Sisa percobaan: ${retries}`);

                    if (retries === 0) {
                        throw new Error("Server AI Google sedang sangat sibuk. Mohon tunggu 1-2 menit dan klik tombol Generate lagi.");
                    }

                    // Jeda (Delay) 2 detik sebelum mencoba lagi agar tidak dianggap spam
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    // Jika errornya selain 503 (misal kuota habis atau API key salah), langsung lempar error
                    throw err;
                }
            }
        }

        // Mengembalikan teks hasil AI ke frontend
        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error dari Backend AI:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
}