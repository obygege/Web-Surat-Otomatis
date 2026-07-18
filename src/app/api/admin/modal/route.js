import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { verifyAdminToken, signAdminToken } from '../../../../lib/adminAuth';

function cekAuth(req) {
  const token = req.cookies.get('admin_session')?.value;
  return token && verifyAdminToken(token);
}

export async function POST(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { nama_biaya, jumlah, periode, keterangan } = await req.json();

  if (!nama_biaya || !jumlah || !periode) {
    return NextResponse.json({ error: 'nama_biaya, jumlah, dan periode wajib diisi.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('modal_biaya')
    .insert([{ nama_biaya, jumlah, periode, keterangan }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data: data[0] });
}

export async function DELETE(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('modal_biaya').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
