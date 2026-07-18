import jwt from 'jsonwebtoken';

const SECRET = process.env.ADMIN_JWT_SECRET; // string acak panjang, taruh di .env.local

export function signAdminToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
