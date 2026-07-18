import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { verifyAdminToken, signAdminToken } from '../../../../lib/adminAuth';

// Tarif PPh Final UMKM Perorangan sesuai PP 55/2022: 0,5% dari omzet bruto
const TARIF_PAJAK_UMKM = 0.005;

function cekAuth(req) {
  const token = req.cookies.get('admin_session')?.value;
  return token && verifyAdminToken(token);
}

export async function GET(req) {
  if (!cekAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  // periode dashboard, default bulan berjalan, format 'YYYY-MM-01'
  const periode = searchParams.get('periode') || new Date().toISOString().slice(0, 7) + '-01';

  // 1. Total pelanggan (semua yang pernah daftar)
  const { count: totalPelanggan } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. Total pelanggan aktif premium saat ini
  const { count: totalPremiumAktif } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true);

  // 3. Semua transaksi (untuk tabel & hitung omzet)
  const { data: transaksi, error: errTransaksi } = await supabaseAdmin
    .from('transaksi')
    .select('*')
    .order('tanggal_beli', { ascending: false });

  if (errTransaksi) {
    return NextResponse.json({ error: errTransaksi.message }, { status: 500 });
  }

  const transaksiSukses = (transaksi || []).filter(t => t.status === 'success');
  const totalPembayaran = transaksiSukses.length;
  const untungKotor = transaksiSukses.reduce((sum, t) => sum + Number(t.gross_amount), 0);

  // 4. Modal / biaya periode yang dipilih
  const { data: modalList } = await supabaseAdmin
    .from('modal_biaya')
    .select('*')
    .eq('periode', periode)
    .order('created_at', { ascending: false });

  const totalModal = (modalList || []).reduce((sum, m) => sum + Number(m.jumlah), 0);

  // 5. Pajak (PPh Final UMKM 0.5% dari omzet bruto/kotor, BUKAN dari untung bersih)
  const totalPajak = untungKotor * TARIF_PAJAK_UMKM;

  // 6. Untung bersih = untung kotor - modal - pajak
  const untungBersih = untungKotor - totalModal - totalPajak;

  return NextResponse.json({
    summary: {
      totalPelanggan: totalPelanggan || 0,
      totalPremiumAktif: totalPremiumAktif || 0,
      totalPembayaran,
      untungKotor,
      totalModal,
      totalPajak,
      tarifPajak: TARIF_PAJAK_UMKM,
      untungBersih,
      periode,
    },
    transaksi: transaksi || [],
    modalList: modalList || [],
  });
}
