/**
 * TripKita Database Migration
 * Jalankan: npm run db:migrate
 *
 * Script ini membuat semua tabel yang dibutuhkan di PostgreSQL.
 * Cocok digunakan dengan pgAdmin untuk melihat hasilnya.
 */

import 'reflect-metadata';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'tripkita_db',
});

const SQL_CREATE_TABLES = `
-- ========================
-- Table: packages (Paket Wisata)
-- ========================
CREATE TABLE IF NOT EXISTS packages (
  id              VARCHAR(36)    PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name            VARCHAR(255)   NOT NULL,
  location        VARCHAR(255)   NOT NULL,
  price           BIGINT         NOT NULL,
  duration        VARCHAR(100)   NOT NULL,
  description     TEXT,
  facilities      TEXT[]         DEFAULT '{}',
  schedule        VARCHAR(255),
  image           TEXT,
  category        VARCHAR(100),
  max_capacity    INT            DEFAULT 20,
  available_slots INT            DEFAULT 20,
  is_active       BOOLEAN        DEFAULT TRUE,
  created_at      TIMESTAMPTZ    DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    DEFAULT NOW()
);

-- ========================
-- Table: customers (Pelanggan)
-- ========================
CREATE TABLE IF NOT EXISTS customers (
  id          VARCHAR(36)   PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  phone       VARCHAR(20),
  address     TEXT,
  join_date   DATE          DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ   DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- ========================
-- Table: bookings (Pemesanan)
-- ========================
CREATE TABLE IF NOT EXISTS bookings (
  id              VARCHAR(36)   PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  package_id      VARCHAR(36)   NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
  customer_id     VARCHAR(36)   NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  booking_date    DATE          DEFAULT CURRENT_DATE,
  travel_date     DATE          NOT NULL,
  number_of_people INT          NOT NULL CHECK (number_of_people >= 1),
  total_price     BIGINT        NOT NULL,
  status          VARCHAR(20)   NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','cancelled')),
  payment_status  VARCHAR(20)   NOT NULL DEFAULT 'unpaid'
                    CHECK (payment_status IN ('unpaid','paid','refunded')),
  notes           TEXT,
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- ========================
-- Indexes untuk performa query
-- ========================
CREATE INDEX IF NOT EXISTS idx_bookings_package_id  ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status      ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_packages_category    ON packages(category);
CREATE INDEX IF NOT EXISTS idx_customers_email      ON customers(email);

-- ========================
-- Auto-update updated_at trigger
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_packages  ON packages;
DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
DROP TRIGGER IF EXISTS set_updated_at_bookings  ON bookings;

CREATE TRIGGER set_updated_at_packages
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🚀 Memulai migrasi database TripKita...');
    await client.query(SQL_CREATE_TABLES);
    console.log('✅ Tabel berhasil dibuat:');
    console.log('   - packages');
    console.log('   - customers');
    console.log('   - bookings');
    console.log('   - indexes & triggers');
    console.log('\n📋 Buka pgAdmin untuk melihat struktur tabel.');
  } catch (err) {
    console.error('❌ Migrasi gagal:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
