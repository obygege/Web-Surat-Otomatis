# Panduan Setup Dashboard Admin

## 1. Install package tambahan
```bash
npm install bcryptjs jsonwebtoken dotenv
```

## 2. Tambahkan environment variable baru di `.env.local`
```
SUPABASE_SERVICE_ROLE_KEY=isi_dari_supabase_dashboard_settings_api
ADMIN_JWT_SECRET=buat_string_acak_panjang_minimal_32_karakter
```
Jangan lupa tambahkan juga kedua ini di **Vercel → Project Settings → Environment Variables** saat deploy.

## 3. Jalankan SQL schema
Buka Supabase → SQL Editor → paste isi `sql/01_schema.sql` → Run.

## 4. Salin semua folder/file ke project Next.js kamu
Struktur folder ini mengikuti Next.js App Router:
```
lib/supabaseAdmin.js
lib/adminAuth.js
middleware.js                              -> taruh di ROOT project (sejajar package.json)
app/api/admin/login/route.js
app/api/admin/logout/route.js
app/api/admin/dashboard-data/route.js
app/api/admin/modal/route.js
app/admin/login/page.js
app/admin/dashboard/layout.js
app/admin/dashboard/page.js
scripts/buat-admin.js
```
Sesuaikan path import relatif (`../../../../lib/...`) kalau struktur folder project kamu beda (misal pakai `src/app` bukan `app`).

## 5. Buat akun admin pertama
```bash
node scripts/buat-admin.js admin@futuradocs.com passwordKuat123 "Nama Kamu"
```

## 6. Hubungkan Midtrans ke tabel `transaksi` (WAJIB biar data pembayaran akurat)
Saat ini di `page.js` kamu, status premium di-update langsung dari `onSuccess` di browser — ini gampang dimanipulasi dan tidak tercatat di tabel `transaksi`. Idealnya:

1. Saat `handleBayarPremium` dipanggil, sebelum `window.snap.pay`, insert dulu row ke `transaksi` dengan status `pending`.
2. Buat endpoint `/api/payment/notification` yang menerima **webhook dari Midtrans** (Server Notification), verifikasi signature-nya, lalu update `transaksi.status` jadi `success`/`failed` + set `profiles.is_premium` dari situ (bukan dari client).

Kalau kamu mau, aku bisa bantu buatkan endpoint webhook ini juga di sesi berikutnya — itu akan membuat data di dashboard admin ini 100% akurat dan tahan manipulasi.

## 7. Buka dashboard
```
http://localhost:3000/admin/login
```

## Catatan keamanan
- Tabel `transaksi`, `modal_biaya`, `admin_users` sudah RLS-enabled tanpa policy apapun — hanya `service_role` key (dipakai di server) yang bisa akses. Anon key dari client tidak akan bisa baca data ini sama sekali.
- Cookie sesi admin bersifat `httpOnly` (tidak bisa dibaca JS di browser) dan `secure` otomatis aktif saat production (HTTPS).
- Tarif pajak PPh Final UMKM (0,5%) di-hardcode di `dashboard-data/route.js` — kalau status usaha kamu berubah jadi PT/CV nanti, rumus ini perlu diganti (kasih tahu aku, aku bantu sesuaikan).
