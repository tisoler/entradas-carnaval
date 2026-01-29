import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTUser {
  id: number;
  nombreUsuario: string;
  rol: string;
}

export function verifyToken(token: string): JWTUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function authenticateToken(request: NextRequest): JWTUser | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function generateToken(user: { id: number; nombreUsuario: string; rol: string }): string {
  return jwt.sign(
    { id: user.id, nombreUsuario: user.nombreUsuario, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function generateRefreshToken(user: { id: number; nombreUsuario: string; rol: string }): string {
  return jwt.sign(
    { id: user.id, nombreUsuario: user.nombreUsuario, rol: user.rol, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
