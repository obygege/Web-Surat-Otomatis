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

    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const cocok = await bcrypt.compare(password, admin.password_hash);
    if (!cocok) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const token = signAdminToken({ id: admin.id, email: admin.email, nama: admin.nama });

    const response = NextResponse.json({ success: true, nama: admin.nama });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 jam
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
