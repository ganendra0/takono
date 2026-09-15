-- ==========================================================
-- TAKONO Database Schema (MySQL 8.0+)
-- Tourism Experience & Ecosystem Platform
-- ==========================================================

CREATE DATABASE IF NOT EXISTS takono_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE takono_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email),
  INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  category VARCHAR(100) DEFAULT 'Desa Adat & Budaya',
  province VARCHAR(100) NOT NULL,
  regency VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  village VARCHAR(100) NOT NULL,
  manager_name VARCHAR(255) NOT NULL,
  manager_id VARCHAR(64) NOT NULL,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'published',
  ticket_price_idr INT DEFAULT 0,
  banner_image_url TEXT,
  gallery_images JSON,
  rules_summary JSON,
  operating_hours VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_dest_province (province),
  INDEX idx_dest_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Explore Points Table
CREATE TABLE IF NOT EXISTS explore_points (
  id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Cagar Budaya',
  zone_type VARCHAR(100) DEFAULT 'Zona Utama',
  short_snippet VARCHAR(255),
  description TEXT,
  cultural_story TEXT,
  rules_and_etiquette JSON,
  qr_code_id VARCHAR(100),
  points_reward INT DEFAULT 25,
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  image_url TEXT,
  sequence_order INT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  INDEX idx_exp_dest (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id VARCHAR(64) PRIMARY KEY,
  explore_point_id VARCHAR(64) NOT NULL,
  destination_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  points_per_correct INT DEFAULT 15,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (explore_point_id) REFERENCES explore_points(id) ON DELETE CASCADE,
  INDEX idx_quiz_point (explore_point_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Destination Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'voucher_umkm',
  description TEXT,
  points_cost INT NOT NULL,
  initial_stock INT DEFAULT 100,
  current_stock INT DEFAULT 100,
  partner_umkm_id VARCHAR(64),
  discount_value_idr INT DEFAULT 0,
  image_url TEXT,
  status ENUM('active', 'out_of_stock', 'archived') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rwd_dest (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Events & Festivals Table
CREATE TABLE IF NOT EXISTS events (
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_evt_dest (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. UMKM Table
CREATE TABLE IF NOT EXISTS umkm (
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_umkm_status (approval_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. UMKM Products Table
CREATE TABLE IF NOT EXISTS umkm_products (
  id VARCHAR(64) PRIMARY KEY,
  umkm_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_idr INT NOT NULL,
  category VARCHAR(100) DEFAULT 'culinary',
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (umkm_id) REFERENCES umkm(id) ON DELETE CASCADE,
  INDEX idx_prod_umkm (umkm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. UMKM Promotions Table
CREATE TABLE IF NOT EXISTS umkm_promotions (
  id VARCHAR(64) PRIMARY KEY,
  umkm_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percentage INT NOT NULL,
  promo_code VARCHAR(50) NOT NULL,
  valid_until DATE,
  redemption_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (umkm_id) REFERENCES umkm(id) ON DELETE CASCADE,
  INDEX idx_promo_code (promo_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Point Transactions (Atomic Ledger)
CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  points_change INT NOT NULL,
  type ENUM('check_in', 'quiz', 'reward_redemption', 'event_badge', 'admin_adjustment') NOT NULL,
  description TEXT,
  journey_id VARCHAR(64),
  destination_id VARCHAR(64),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tx_user (user_id),
  INDEX idx_tx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Journeys Table
CREATE TABLE IF NOT EXISTS journeys (
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
  notes TEXT,
  INDEX idx_jrn_traveler (traveler_id),
  INDEX idx_jrn_dest (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. QR Codes Table
CREATE TABLE IF NOT EXISTS qr_codes (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  target_type ENUM('explore_point', 'event', 'destination_entrance', 'umkm_promo') NOT NULL,
  destination_id VARCHAR(64) NOT NULL,
  target_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scans_count INT DEFAULT 0,
  last_scanned_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_qr_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id VARCHAR(64) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  target_id VARCHAR(64),
  destination_id VARCHAR(64),
  metadata JSON,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_evt_type (event_type),
  INDEX idx_evt_dest (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
