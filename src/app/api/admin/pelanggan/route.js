import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { verifyAdminToken } from '../../../../lib/adminAuth';

function cekAuth(req) {
  const token = req.cookies.get('admin_session')?.value;
  return token && verifyAdminToken(token);
}

export async function GET(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    // Detail 1 pelanggan + histori transaksinya
    const { data: profile, error: errProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (errProfile || !profile) {
      return NextResponse.json({ error: 'Pelanggan tidak ditemukan.' }, { status: 404 });
    }

    const { data: transaksi } = await supabaseAdmin
      .from('transaksi')
      .select('*')
      .eq('user_id', id)
      .order('tanggal_beli', { ascending: false });

    const transaksiSukses = (transaksi || []).filter((t) => t.status === 'success');
    const totalPembayaran = transaksiSukses.length;
    const totalNominal = transaksiSukses.reduce((sum, t) => sum + Number(t.gross_amount), 0);

    const { data: dokumen } = await supabaseAdmin
      .from('documents')
      .select('id, judul_surat, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      profile,
      transaksi: transaksi || [],
      totalPembayaran,
      totalNominal,
      totalDokumen: dokumen?.length || 0,
      dokumen: dokumen || [],
    });
  }

  // List semua pelanggan
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profiles: profiles || [] });
}

export async function PATCH(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, nama, email, is_premium, premium_until } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID pelanggan wajib diisi.' }, { status: 400 });
  }

  const updateData = {};
  if (nama !== undefined) updateData.nama = nama;
  if (email !== undefined) updateData.email = email;
  if (is_premium !== undefined) updateData.is_premium = is_premium;
  if (premium_until !== undefined) updateData.premium_until = premium_until || null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data: data[0] });
}

export async function DELETE(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID pelanggan wajib diisi.' }, { status: 400 });
  }

  // Hapus dulu data terkait supaya tidak nyangkut foreign key
  await supabaseAdmin.from('transaksi').delete().eq('user_id', id);
  await supabaseAdmin.from('documents').delete().eq('user_id', id);
  await supabaseAdmin.from('profiles').delete().eq('id', id);

  // Hapus juga akun login (auth.users) miliknya
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    // Profil sudah terhapus meski akun auth gagal dihapus - tetap laporkan
    return NextResponse.json({ warning: 'Data profil terhapus, tapi akun auth gagal dihapus: ' + error.message });
  }

  return NextResponse.json({ success: true });
}
