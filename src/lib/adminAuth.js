import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const SECRET = process.env.ADMIN_JWT_SECRET; // string acak panjang, taruh di .env.local
const encodedSecret = new TextEncoder().encode(SECRET);

export function signAdminToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

// Dipakai di API route (Node.js runtime) — tetap pakai jsonwebtoken
export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Dipakai di middleware.js (Edge Runtime) — jsonwebtoken TIDAK jalan di Edge
// karena butuh modul Node 'crypto'. jose pakai Web Crypto API sehingga kompatibel.
export async function verifyAdminTokenEdge(token) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch {
    return null;
  }
}