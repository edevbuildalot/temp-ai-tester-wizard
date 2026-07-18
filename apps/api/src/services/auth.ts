import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { generateId } from './id.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tatw-dev-secret-change-in-prod';
const SALT_ROUNDS = 10;

export function createUser(email: string, password: string, name: string) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const id = generateId();
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)').run(id, email, passwordHash, name);

  return { id, email, name };
}

export function authenticateUser(email: string, password: string) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  return { id: user.id, email: user.email, name: user.name };
}

export function createToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}