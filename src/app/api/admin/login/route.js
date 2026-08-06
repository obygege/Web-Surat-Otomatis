import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { signAdminToken } from '../../../../lib/adminAuth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    // 1. Ambil IP untuk identifikasi penyerang (Aman di Vercel)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const sejak = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // Rentang 15 menit

    // 2. Cek apakah IP dan Email ini sudah gagal 5 kali dalam 15 menit terakhir
    const { count: gagalCount } = await supabaseAdmin
      .from('admin_login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('ip', ip)
      .eq('success', false)
      .gte('created_at', sejak);

    if (gagalCount >= 5) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan gagal. Silakan coba lagi dalam 15 menit.' },
        { status: 429 }
      );
    }

    // 3. Proses Login Asli (seperti kode lu sebelumnya)
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      // Catat kegagalan ke database (wajib pakai await di Vercel)
      await supabaseAdmin.from('admin_login_attempts').insert([{ email, ip, success: false }]);
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const cocok = await bcrypt.compare(password, admin.password_hash);
    if (!cocok) {
      // Catat kegagalan ke database
      await supabaseAdmin.from('admin_login_attempts').insert([{ email, ip, success: false }]);
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    // 4. Jika sukses, catat kesuksesannya agar log rapi
    await supabaseAdmin.from('admin_login_attempts').insert([{ email, ip, success: true }]);

    // 5. Buat Token & Cookie (dengan sameSite: 'strict' untuk anti-CSRF)
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
    console.error('Login Admin Error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}