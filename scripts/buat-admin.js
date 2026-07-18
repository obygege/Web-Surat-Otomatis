// Jalankan sekali di terminal untuk membuat akun admin pertama:
//   node scripts/buat-admin.js admin@email.com passwordRahasia123 "Nama Admin"
//
// Butuh package: bcryptjs, dotenv, @supabase/supabase-js (npm install bcryptjs dotenv)

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const [, , email, password, nama] = process.argv;

if (!email || !password) {
  console.error('Pakai: node scripts/buat-admin.js email password "Nama"');
  process.exit(1);
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ email, password_hash, nama: nama || 'Admin' }])
    .select();

  if (error) {
    console.error('Gagal buat admin:', error.message);
    process.exit(1);
  }

  console.log('Admin berhasil dibuat:', data[0].email);
}

main();
