-- =========================================================
-- JALANKAN INI DI SUPABASE SQL EDITOR
-- =========================================================

-- 1. Tabel transaksi pembayaran (histori asli tiap pembayaran)
create table if not exists transaksi (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  user_id uuid references auth.users(id),
  email text,
  gross_amount numeric not null,
  status text not null default 'pending', -- pending | success | failed | expired
  payment_type text,
  midtrans_transaction_id text,
  tanggal_beli timestamptz default now(),
  tanggal_expired timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_transaksi_status on transaksi(status);
create index if not exists idx_transaksi_user on transaksi(user_id);

-- 2. Tabel modal / biaya operasional (diisi manual dari dashboard admin)
create table if not exists modal_biaya (
  id uuid primary key default gen_random_uuid(),
  nama_biaya text not null,
  jumlah numeric not null,
  periode date not null,       -- pakai tanggal 1 tiap bulan, misal '2026-07-01'
  keterangan text,
  created_at timestamptz default now()
);

create index if not exists idx_modal_periode on modal_biaya(periode);

-- 3. Tabel admin (login terpisah dari user biasa)
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  nama text,
  created_at timestamptz default now()
);

-- 4. RLS: kunci semua tabel ini dari akses publik/anon.
--    Dashboard admin HANYA boleh diakses lewat service_role key di server,
--    jadi anon/authenticated tidak perlu (dan tidak boleh) bisa baca langsung.
alter table transaksi enable row level security;
alter table modal_biaya enable row level security;
alter table admin_users enable row level security;

-- Tidak ada policy dibuat sama sekali untuk 3 tabel ini secara sengaja.
-- Artinya: anon key TIDAK BISA baca/tulis apapun ke tabel ini.
-- Hanya service_role key (dipakai di API route server) yang bisa akses,
-- karena service_role otomatis bypass RLS.
