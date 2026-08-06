import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { signAdminToken } from '../../../../lib/adminAuth';

// Menggunakan dummy hash bcrypt yang VALID agar sistem tidak crash
// Ini adalah hash valid dari kata "dummy"
const DUMMY_HASH = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa';

const MAX_ATTEMPTS = 5;       // maksimal percobaan gagal
const WINDOW_MINUTES = 15;    // dalam rentang waktu ini (menit)
const LOCK_MINUTES = 15;      // durasi terkunci setelah kena limit (menit)

function getClientIp(req) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email: rawEmail, password } = body;

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const ip = getClientIp(req);
    const sejak = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    // 1. Cek Rate Limiting untuk Anti Brute-force
    const { count: gagalCount, error: errCount } = await supabaseAdmin
      .from('admin_login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('ip', ip)
      .eq('success', false)
      .gte('created_at', sejak);

    if (errCount) console.error('[DB Error] Gagal cek rate limit:', errCount);

    if (!errCount && gagalCount >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${LOCK_MINUTES} menit.` },
        { status: 429 }
      );
    }

    // 2. Ambil data admin berdasarkan email
    const { data: adminList, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .ilike('email', email);

    if (adminError) console.error('[DB Error] Gagal ambil data admin:', adminError);

    const admin = adminList && adminList.length === 1 ? adminList[0] : null;

    // 3. Verifikasi Password (Timing-safe)
    const hashUntukDicek = admin?.password_hash || DUMMY_HASH;

    let cocok = false;
    try {
      cocok = await bcrypt.compare(password, hashUntukDicek);
    } catch (bcryptErr) {
      // Jika masuk ke sini, berarti teks di kolom password_hash BUKAN format bcrypt yang valid
      console.error('[Bcrypt Error] Format hash tidak valid di database:', bcryptErr.message);
    }

    const berhasil = !adminError && !!admin && cocok;

    // 4. Catat percobaan log login secara asinkron dengan aman
    await supabaseAdmin
      .from('admin_login_attempts')
      .insert([{ email, ip, success: berhasil }])
      .catch((dbErr) => console.error('[DB Error] Gagal mencatat log attempt:', dbErr));

    if (!berhasil) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    // 5. Sukses Login: Buat Token & set Cookie
    const token = signAdminToken({ id: admin.id, email: admin.email, nama: admin.nama });
    const response = NextResponse.json({ success: true, nama: admin.nama });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 jam
    });

    return response;

  } catch (err) {
    console.error('[Server Error] Terjadi kesalahan saat admin login:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}