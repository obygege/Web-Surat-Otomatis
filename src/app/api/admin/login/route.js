import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { signAdminToken } from '../../../../lib/adminAuth';

// Hash "kosong" dipakai supaya bcrypt.compare tetap jalan walau email
// tidak ditemukan -> waktu respons konsisten, tidak bocorin email mana yang valid.
const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8u8gN8b9M8P1c1u1i1i1i1i1i1i1i1';

const MAX_ATTEMPTS = 5;       // maksimal percobaan gagal
const WINDOW_MINUTES = 15;    // dalam rentang waktu ini
const LOCK_MINUTES = 15;      // durasi terkunci setelah kena limit

function getClientIp(req) {
  // Vercel/Next selalu isi x-forwarded-for di edge/proxy mereka
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req) {
  try {
    const { email: rawEmail, password } = await req.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const ip = getClientIp(req);
    const sejak = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    // 1. Cek apakah email+IP ini sedang kena rate limit
    const { count: gagalCount, error: errCount } = await supabaseAdmin
      .from('admin_login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('ip', ip)
      .eq('success', false)
      .gte('created_at', sejak);

    if (!errCount && gagalCount >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${LOCK_MINUTES} menit.` },
        { status: 429 }
      );
    }

    // 2. Ambil data admin
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    // 3. Selalu jalankan bcrypt.compare (pakai dummy hash kalau admin tidak ada)
    //    supaya waktu respons sama antara "email salah" dan "password salah".
    const hashUntukDicek = admin?.password_hash || DUMMY_HASH;
    const cocok = await bcrypt.compare(password, hashUntukDicek);
    const berhasil = !error && !!admin && cocok;

    // 4. Catat percobaan (sukses maupun gagal) -- jangan await biar tidak
    //    memperlambat response, tapi tetap ditangkap errornya.
    supabaseAdmin
      .from('admin_login_attempts')
      .insert([{ email, ip, success: berhasil }])
      .then(() => { })
      .catch(() => { });

    if (!berhasil) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

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
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}