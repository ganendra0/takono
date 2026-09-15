import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {
  INITIAL_USERS,
  INITIAL_DESTINATIONS,
  INITIAL_EXPLORE_POINTS,
  INITIAL_QUIZZES,
  INITIAL_REWARDS,
  INITIAL_EVENTS,
  INITIAL_UMKM,
  INITIAL_QR_CODES,
  INITIAL_JOURNEYS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_ANALYTICS_EVENTS,
} from '../src/data/initialData';

export interface DbStatus {
  database: 'MySQL';
  connected: boolean;
  host: string;
  port: number;
  databaseName: string;
  mode: 'mysql_live' | 'memory_fallback';
  message: string;
}

let pool: Pool | null = null;
let isConnectedToMySQL = false;
let dbStatusMessage = 'Memulai inisialisasi basis data...';

// In-Memory Fallback State (initialized from initialData)
export const inMemoryStore = {
  users: [...INITIAL_USERS],
  destinations: [...INITIAL_DESTINATIONS],
  explorePoints: [...INITIAL_EXPLORE_POINTS],
  quizzes: [...INITIAL_QUIZZES],
  rewards: [...INITIAL_REWARDS],
  events: [...INITIAL_EVENTS],
  umkm: [...INITIAL_UMKM],
  qrCodes: [...INITIAL_QR_CODES],
  journeys: [...INITIAL_JOURNEYS],
  pointTransactions: [...INITIAL_POINT_TRANSACTIONS],
  analyticsEvents: [...INITIAL_ANALYTICS_EVENTS],
  passwordHashes: new Map<string, string>(),
};

// Seed default password hashes for inMemoryStore (default: 'takono123')
const defaultHashedPassword = bcrypt.hashSync('takono123', 10);
INITIAL_USERS.forEach((u) => {
  inMemoryStore.passwordHashes.set(u.email.toLowerCase(), defaultHashedPassword);
});

export async function getDbStatus(): Promise<DbStatus> {
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3307', 10);
  const databaseName = process.env.MYSQL_DATABASE || 'takono_db';

  return {
    database: 'MySQL',
    connected: isConnectedToMySQL,
    host,
    port,
    databaseName,
    mode: isConnectedToMySQL ? 'mysql_live' : 'memory_fallback',
    message: dbStatusMessage,
  };
}

export async function initDatabase(): Promise<void> {
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3307', 10);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'takono_db';

  console.log(`[DB] Mencoba menghubungkan ke MySQL di ${host}:${port}, database: ${database}...`);

  try {
    // 1. First connect without database to ensure database exists
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 3000,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // 2. Create connection pool to the database
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    });

    // Test query
    const [testRows] = await pool.query('SELECT 1 + 1 AS result');
    isConnectedToMySQL = true;
    dbStatusMessage = `Terhubung ke MySQL di ${host}:${port}/${database}`;
    console.log(`[DB] ✅ Berhasil terhubung ke MySQL Server: ${host}:${port}/${database}`);

    // 3. Run table DDL migrations
    await runMigrations(pool);

    // 4. Seed tables if empty
    await seedDatabaseIfEmpty(pool);
  } catch (err: any) {
    isConnectedToMySQL = false;
    dbStatusMessage = `Mode In-Memory Fallback aktif (${err.message || 'Koneksi MySQL ditolak/timeout'}). Siap otomatis beralih saat MySQL lokal dijalankan.`;
    console.warn(`[DB] ⚠️ Tidak dapat tersambung ke MySQL (${err.code || err.message}).`);
    console.warn(`[DB] ℹ️ Mengaktifkan Resilient In-Memory Engine. Seluruh fungsi REST API & Autentikasi tetap berjalan normal.`);
    console.warn(`[DB] 💡 Saat dijalankan di komputer lokal Anda dengan MySQL aktif, sistem akan langsung tersambung secara otomatis.`);
  }
}

async function runMigrations(dbPool: Pool) {
  const DDLs = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('traveler', 'manager', 'umkm', 'government', 'admin') NOT NULL DEFAULT 'traveler',
      avatar_url TEXT,
      points_balance INT DEFAULT 0,
      assigned_destination_id VARCHAR(64) NULL,
      umkm_id VARCHAR(64) NULL,
      agency_name VARCHAR(255) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS destinations (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      tagline TEXT,
      description TEXT,
      province VARCHAR(100) NOT NULL,
      regency VARCHAR(100) NOT NULL,
      address TEXT,
      status VARCHAR(50) DEFAULT 'published',
      manager_id VARCHAR(64) NOT NULL,
      manager_name VARCHAR(255) NOT NULL,
      hero_image TEXT,
      ticket_price_idr INT DEFAULT 0,
      opening_hours VARCHAR(100),
      connected_umkm_ids JSON,
      qr_code_id VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS explore_points (
      id VARCHAR(64) PRIMARY KEY,
      destination_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      sequence_order INT DEFAULT 1,
      category VARCHAR(100) DEFAULT 'heritage',
      status VARCHAR(50) DEFAULT 'published',
      short_description TEXT,
      story TEXT,
      facts JSON,
      cultural_norms TEXT,
      eco_guidelines TEXT,
      etiquette TEXT,
      activity TEXT,
      coordinates JSON,
      location_name VARCHAR(255),
      estimated_minutes INT DEFAULT 15,
      completion_points INT DEFAULT 5,
      is_manager_recommended BOOLEAN DEFAULT FALSE,
      image_url TEXT,
      qr_code_id VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS quizzes (
      id VARCHAR(64) PRIMARY KEY,
      explore_point_id VARCHAR(64) NOT NULL,
      destination_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'published',
      questions JSON NOT NULL,
      points_per_correct INT DEFAULT 10,
      total_points_available INT DEFAULT 20,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS rewards (
      id VARCHAR(64) PRIMARY KEY,
      destination_id VARCHAR(64) NOT NULL,
      umkm_id VARCHAR(64),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      points_cost INT NOT NULL,
      initial_stock INT DEFAULT 100,
      current_stock INT DEFAULT 100,
      valid_until VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      terms TEXT,
      category VARCHAR(100) DEFAULT 'voucher',
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(64) PRIMARY KEY,
      destination_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      time VARCHAR(50),
      location VARCHAR(255),
      description TEXT,
      status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
      qr_code_id VARCHAR(100),
      badge_earned VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS umkm (
      id VARCHAR(64) PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      owner_name VARCHAR(255) NOT NULL,
      owner_id VARCHAR(64),
      category VARCHAR(100) DEFAULT 'culinary',
      address TEXT,
      phone VARCHAR(50),
      instagram VARCHAR(100),
      description TEXT,
      image_url TEXT,
      approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
      rejection_reason TEXT,
      associated_destination_ids JSON,
      views_count INT DEFAULT 0,
      traveler_interactions_count INT DEFAULT 0,
      verified_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS umkm_products (
      id VARCHAR(64) PRIMARY KEY,
      umkm_id VARCHAR(64) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price_idr INT NOT NULL,
      category VARCHAR(100) DEFAULT 'culinary',
      image_url TEXT,
      is_available BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS umkm_promotions (
      id VARCHAR(64) PRIMARY KEY,
      umkm_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      discount_percentage INT NOT NULL,
      promo_code VARCHAR(50) NOT NULL,
      valid_until DATE,
      redemption_count INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS point_transactions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      points_change INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      description TEXT,
      journey_id VARCHAR(64),
      destination_id VARCHAR(64),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS journeys (
      id VARCHAR(64) PRIMARY KEY,
      traveler_id VARCHAR(64) NOT NULL,
      destination_id VARCHAR(64) NOT NULL,
      status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME NULL,
      visited_points JSON,
      completed_quizzes JSON,
      claimed_rewards JSON,
      earned_points_total INT DEFAULT 0,
      notes TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS qr_codes (
      id VARCHAR(64) PRIMARY KEY,
      code VARCHAR(100) NOT NULL UNIQUE,
      target_type VARCHAR(50) NOT NULL,
      destination_id VARCHAR(64) NOT NULL,
      target_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      scans_count INT DEFAULT 0,
      last_scanned_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR(64) PRIMARY KEY,
      event_type VARCHAR(100) NOT NULL,
      target_id VARCHAR(64),
      destination_id VARCHAR(64),
      metadata JSON,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  ];

  for (const ddl of DDLs) {
    await dbPool.query(ddl);
  }
  console.log('[DB] ✅ Migrasi skema tabel MySQL selesai.');
}

async function seedDatabaseIfEmpty(dbPool: Pool) {
  const [usersCount]: any = await dbPool.query('SELECT COUNT(*) AS count FROM users');
  if (usersCount[0]?.count > 0) {
    console.log('[DB] Tabel MySQL sudah berisi data.');
    return;
  }

  console.log('[DB] Menyemai data awal (seeding) ke MySQL...');
  const defaultHash = bcrypt.hashSync('takono123', 10);

  // 1. Seed Users
  for (const u of INITIAL_USERS) {
    await dbPool.query(
      `INSERT INTO users (id, name, email, password_hash, role, avatar_url, points_balance, assigned_destination_id, umkm_id, agency_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        u.id,
        u.name,
        u.email,
        defaultHash,
        u.role,
        u.avatarUrl,
        u.pointsBalance || 0,
        u.assignedDestinationId || null,
        u.umkmId || null,
        u.agencyName || null,
      ]
    );
  }

  // 2. Seed Destinations
  for (const d of INITIAL_DESTINATIONS) {
    await dbPool.query(
      `INSERT INTO destinations (id, name, slug, tagline, description, province, regency, address, status, manager_id, manager_name, hero_image, ticket_price_idr, opening_hours, connected_umkm_ids, qr_code_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.id,
        d.name,
        d.slug,
        d.tagline,
        d.description,
        d.province,
        d.regency,
        d.address,
        d.status,
        d.managerId,
        d.managerName,
        d.heroImage,
        d.ticketPriceIdr,
        d.openingHours,
        JSON.stringify(d.connectedUmkmIds || []),
        d.qrCodeId,
      ]
    );
  }

  // 3. Seed Explore Points
  for (const p of INITIAL_EXPLORE_POINTS) {
    await dbPool.query(
      `INSERT INTO explore_points (id, destination_id, name, sequence_order, category, status, short_description, story, facts, cultural_norms, eco_guidelines, etiquette, activity, coordinates, location_name, estimated_minutes, completion_points, is_manager_recommended, image_url, qr_code_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.destinationId,
        p.name,
        p.sequenceOrder,
        p.category,
        p.status,
        p.shortDescription,
        p.story,
        JSON.stringify(p.facts || []),
        p.education?.culturalNorms || '',
        p.education?.ecoGuidelines || '',
        p.education?.etiquette || '',
        p.activity || '',
        JSON.stringify(p.coordinates || { lat: 0, lng: 0 }),
        p.locationName || '',
        p.estimatedMinutes || 15,
        p.completionPoints || 5,
        p.isManagerRecommended ? 1 : 0,
        p.imageUrl,
        p.qrCodeId,
      ]
    );
  }

  // 4. Seed Quizzes
  for (const q of INITIAL_QUIZZES) {
    await dbPool.query(
      `INSERT INTO quizzes (id, explore_point_id, destination_id, title, description, status, questions, points_per_correct, total_points_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.id,
        q.explorePointId,
        q.destinationId,
        q.title,
        q.description,
        q.status,
        JSON.stringify(q.questions || []),
        q.pointsPerCorrect,
        q.totalPointsAvailable,
      ]
    );
  }

  // 5. Seed UMKM
  for (const m of INITIAL_UMKM) {
    await dbPool.query(
      `INSERT INTO umkm (id, business_name, owner_name, owner_id, category, address, phone, instagram, description, image_url, approval_status, associated_destination_ids, views_count, traveler_interactions_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.businessName,
        m.ownerName,
        m.ownerId,
        m.category,
        m.address,
        m.phone,
        m.instagram || null,
        m.description,
        m.imageUrl,
        m.approvalStatus,
        JSON.stringify(m.associatedDestinationIds || []),
        m.viewsCount || 0,
        m.travelerInteractionsCount || 0,
      ]
    );

    // Seed products
    for (const prod of m.products || []) {
      await dbPool.query(
        `INSERT INTO umkm_products (id, umkm_id, name, description, price_idr, category, image_url, is_available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          m.id,
          prod.name,
          prod.description,
          prod.priceIdr,
          prod.category,
          prod.imageUrl,
          prod.isAvailable ?? true,
        ]
      );
    }

    // Seed promotions
    for (const promo of m.promotions || []) {
      await dbPool.query(
        `INSERT INTO umkm_promotions (id, umkm_id, title, description, discount_percentage, promo_code, valid_until, redemption_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          promo.id,
          m.id,
          promo.title,
          promo.description,
          promo.discountPercentage,
          promo.promoCode,
          promo.validUntil,
          promo.redemptionCount || 0,
        ]
      );
    }
  }

  // 6. Seed Rewards
  for (const r of INITIAL_REWARDS) {
    await dbPool.query(
      `INSERT INTO rewards (id, destination_id, umkm_id, title, description, points_cost, initial_stock, current_stock, valid_until, status, terms, category, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        r.id,
        r.destinationId,
        r.umkmId || null,
        r.title,
        r.description,
        r.pointsCost,
        r.initialStock,
        r.currentStock,
        r.validUntil,
        r.status,
        r.terms,
        r.category,
        r.imageUrl,
      ]
    );
  }

  // 7. Seed Events
  for (const e of INITIAL_EVENTS) {
    await dbPool.query(
      `INSERT INTO events (id, destination_id, title, date, time, location, description, status, qr_code_id, badge_earned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id,
        e.destinationId,
        e.title,
        e.date,
        e.time,
        e.location,
        e.description,
        e.status,
        e.qrCodeId,
        e.badgeEarned || null,
      ]
    );
  }

  console.log('[DB] ✅ Data awal berhasil disemai ke seluruh tabel MySQL.');
}

// Database query wrapper with seamless fallback
export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('[DB Query Error]', error);
      throw error;
    }
  }

  // If MySQL is not connected, this wrapper will throw so handlers can use fallback
  throw new Error('MySQL is not connected');
}

export { pool, isConnectedToMySQL };
