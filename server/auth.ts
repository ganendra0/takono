import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { isConnectedToMySQL, pool, inMemoryStore } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'takono_super_secret_jwt_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Express Auth Middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Token autentikasi tidak ditemukan. Harap login terlebih dahulu.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).json({ error: 'Token tidak valid atau telah kedaluwarsa.' });
    return;
  }

  (req as any).user = payload;
  next();
}

// User Registration
export async function registerHandler(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role = 'traveler', agencyName, umkmName } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nama lengkap, email, dan kata sandi wajib diisi.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Kata sandi minimal harus 6 karakter.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = ['traveler', 'manager', 'umkm', 'government', 'admin'].includes(role)
      ? role
      : 'traveler';

    // Check if user already exists
    if (isConnectedToMySQL && pool) {
      const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
      if (existing.length > 0) {
        res.status(409).json({ error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
        return;
      }
    } else {
      const existing = inMemoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        res.status(409).json({ error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
        return;
      }
    }

    const id = `user-${cleanRole}-${Date.now()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const avatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    const newUser = {
      id,
      name: name.trim(),
      email: cleanEmail,
      role: cleanRole,
      avatarUrl,
      pointsBalance: cleanRole === 'traveler' ? 50 : 0, // 50 Welcome bonus points for travelers!
      assignedDestinationId: cleanRole === 'manager' ? 'dest-penglipuran' : null,
      umkmId: cleanRole === 'umkm' ? `umkm-${Date.now()}` : null,
      agencyName: cleanRole === 'government' ? (agencyName || 'Dinas Pariwisata Daerah') : null,
      createdAt: new Date().toISOString(),
    };

    if (isConnectedToMySQL && pool) {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role, avatar_url, points_balance, assigned_destination_id, umkm_id, agency_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.id,
          newUser.name,
          newUser.email,
          passwordHash,
          newUser.role,
          newUser.avatarUrl,
          newUser.pointsBalance,
          newUser.assignedDestinationId,
          newUser.umkmId,
          newUser.agencyName,
        ]
      );
    } else {
      inMemoryStore.users.push(newUser as any);
      inMemoryStore.passwordHashes.set(cleanEmail, passwordHash);
    }

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      message: 'Pendaftaran akun berhasil!',
      token,
      user: newUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Gagal mendaftarkan pengguna: ' + (err.message || 'Internal error') });
  }
}

// User Login
export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    let user: any = null;
    let passwordHash: string | null = null;

    if (isConnectedToMySQL && pool) {
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
      if (rows.length > 0) {
        user = rows[0];
        passwordHash = user.password_hash;
      }
    } else {
      const found = inMemoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (found) {
        user = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          avatar_url: found.avatarUrl,
          points_balance: found.pointsBalance,
          assigned_destination_id: found.assignedDestinationId,
          umkm_id: found.umkmId,
          agency_name: found.agencyName,
        };
        passwordHash = inMemoryStore.passwordHashes.get(cleanEmail) || null;
      }
    }

    if (!user || !passwordHash) {
      res.status(401).json({ error: 'Email atau kata sandi tidak cocok.' });
      return;
    }

    // Compare bcrypt password
    const isPasswordValid = bcrypt.compareSync(password, passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Email atau kata sandi tidak cocok.' });
      return;
    }

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatar_url || user.avatarUrl,
      pointsBalance: user.points_balance ?? user.pointsBalance ?? 0,
      assignedDestinationId: user.assigned_destination_id || user.assignedDestinationId,
      umkmId: user.umkm_id || user.umkmId,
      agencyName: user.agency_name || user.agencyName,
    };

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      message: 'Login berhasil!',
      token,
      user: sanitizedUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses login: ' + (err.message || 'Internal error') });
  }
}

// Get Current User (`/api/auth/me`)
export async function meHandler(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      res.status(401).json({ error: 'Tidak terotentikasi.' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa.' });
      return;
    }

    let user: any = null;
    if (isConnectedToMySQL && pool) {
      const [rows]: any = await pool.query(
        'SELECT id, name, email, role, avatar_url, points_balance, assigned_destination_id, umkm_id, agency_name, created_at FROM users WHERE id = ?',
        [payload.id]
      );
      if (rows.length > 0) {
        const row = rows[0];
        user = {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          avatarUrl: row.avatar_url,
          pointsBalance: row.points_balance,
          assignedDestinationId: row.assigned_destination_id,
          umkmId: row.umkm_id,
          agencyName: row.agency_name,
        };
      }
    } else {
      user = inMemoryStore.users.find((u) => u.id === payload.id);
    }

    if (!user) {
      res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
      return;
    }

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// List all users for Admin or Switcher
export async function listUsersHandler(req: Request, res: Response): Promise<void> {
  try {
    if (isConnectedToMySQL && pool) {
      const [rows]: any = await pool.query(
        'SELECT id, name, email, role, avatar_url AS avatarUrl, points_balance AS pointsBalance, assigned_destination_id AS assignedDestinationId, umkm_id AS umkmId, agency_name AS agencyName FROM users ORDER BY created_at ASC'
      );
      res.json(rows);
    } else {
      res.json(inMemoryStore.users);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
