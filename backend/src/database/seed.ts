/**
 * TripKita Database Seeder
 * Jalankan: npm run db:seed
 *
 * Script ini mengisi database dengan data awal (sample data).
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

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Memulai seeding data TripKita...\n');
    await client.query('BEGIN');

    // ─────────────────────────────────────────
    // 1. Packages
    // ─────────────────────────────────────────
    console.log('📦 Memasukkan data packages...');
    await client.query(`
      INSERT INTO packages (id, name, location, price, duration, description, facilities, schedule, image, category, max_capacity, available_slots)
      VALUES
        ('1', 'Paket Wisata Bali 3D2N', 'Bali, Indonesia', 2500000, '3 Hari 2 Malam',
         'Nikmati keindahan pulau Bali dengan mengunjungi tempat-tempat iconic seperti Tanah Lot, Uluwatu, dan pantai-pantai indah.',
         ARRAY['Hotel Bintang 4','Transportasi AC','Pemandu Wisata','Makan 3x Sehari','Tiket Masuk Wisata'],
         'Berangkat setiap Senin, Rabu, Jumat',
         'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
         'Beach & Culture', 20, 12),

        ('2', 'Paket Wisata Yogyakarta 2D1N', 'Yogyakarta, Indonesia', 1200000, '2 Hari 1 Malam',
         'Jelajahi keajaiban candi Borobudur dan Prambanan, serta nikmati kuliner khas Yogyakarta.',
         ARRAY['Hotel Bintang 3','Transportasi AC','Pemandu Wisata','Makan 2x Sehari','Tiket Masuk Candi'],
         'Berangkat setiap hari',
         'https://images.unsplash.com/photo-1598535398949-df8b57c32727',
         'Culture & History', 25, 8),

        ('3', 'Paket Wisata Bromo 2D1N', 'Bromo, Jawa Timur', 1500000, '2 Hari 1 Malam',
         'Saksikan sunrise spektakuler di Gunung Bromo dan jelajahi padang savana yang memukau.',
         ARRAY['Homestay','Jeep 4WD','Pemandu Wisata','Makan 2x Sehari','Jaket Hangat'],
         'Berangkat Sabtu & Minggu',
         'https://images.unsplash.com/photo-1605640840605-14ac1855827b',
         'Mountain & Adventure', 15, 5),

        ('4', 'Paket Wisata Raja Ampat 5D4N', 'Raja Ampat, Papua Barat', 8500000, '5 Hari 4 Malam',
         'Diving dan snorkeling di surga bawah laut Indonesia. Nikmati keindahan terumbu karang.',
         ARRAY['Resort Tepi Pantai','Speedboat','Diving Guide','Makan 3x Sehari','Peralatan Snorkeling'],
         'Berangkat setiap Minggu',
         'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
         'Beach & Diving', 10, 3),

        ('5', 'Paket Wisata Lombok 4D3N', 'Lombok, NTB', 3200000, '4 Hari 3 Malam',
         'Jelajahi keindahan pantai-pantai eksotis Lombok, termasuk Pink Beach dan Gili Trawangan.',
         ARRAY['Hotel Bintang 4','Boat & Car','Pemandu Wisata','Makan 3x Sehari','Peralatan Snorkeling'],
         'Berangkat Selasa & Jumat',
         'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
         'Beach & Island', 18, 10),

        ('6', 'Paket Wisata Labuan Bajo 4D3N', 'Labuan Bajo, NTT', 4500000, '4 Hari 3 Malam',
         'Kunjungi Pulau Komodo dan temui komodo asli. Island hopping ke Pink Beach dan Padar Island.',
         ARRAY['Hotel Bintang 3','Kapal Phinisi','Pemandu Wisata','Makan 3x Sehari','Tiket Taman Nasional'],
         'Berangkat setiap Senin & Kamis',
         'https://images.unsplash.com/photo-1570789210967-2cac24afeb00',
         'Island & Wildlife', 12, 7)
      ON CONFLICT (id) DO NOTHING;
    `);

    // ─────────────────────────────────────────
    // 2. Customers
    // ─────────────────────────────────────────
    console.log('👥 Memasukkan data customers...');
    await client.query(`
      INSERT INTO customers (id, name, email, phone, address, join_date)
      VALUES
        ('C001', 'Budi Santoso',    'budi.santoso@email.com',    '081234567890', 'Jl. Sudirman No. 123, Jakarta',         '2025-01-15'),
        ('C002', 'Siti Nurhaliza',  'siti.nurhaliza@email.com',  '081298765432', 'Jl. Gatot Subroto No. 45, Bandung',     '2025-02-20'),
        ('C003', 'Ahmad Wijaya',    'ahmad.wijaya@email.com',    '081345678901', 'Jl. Diponegoro No. 78, Surabaya',       '2025-03-10'),
        ('C004', 'Dewi Lestari',    'dewi.lestari@email.com',    '081456789012', 'Jl. Thamrin No. 56, Jakarta',           '2025-04-05'),
        ('C005', 'Rudi Hartono',    'rudi.hartono@email.com',    '081567890123', 'Jl. Malioboro No. 12, Yogyakarta',      '2025-05-01')
      ON CONFLICT (id) DO NOTHING;
    `);

    // ─────────────────────────────────────────
    // 3. Bookings
    // ─────────────────────────────────────────
    console.log('📅 Memasukkan data bookings...');
    await client.query(`
      INSERT INTO bookings (id, package_id, customer_id, booking_date, travel_date, number_of_people, total_price, status, payment_status)
      VALUES
        ('B001', '1', 'C001', '2026-05-15', '2026-06-10', 2, 5000000,  'confirmed', 'paid'),
        ('B002', '2', 'C002', '2026-05-18', '2026-06-05', 4, 4800000,  'confirmed', 'paid'),
        ('B003', '3', 'C003', '2026-05-20', '2026-06-15', 3, 4500000,  'pending',   'unpaid'),
        ('B004', '4', 'C004', '2026-05-22', '2026-07-01', 2, 17000000, 'confirmed', 'paid'),
        ('B005', '5', 'C005', '2026-05-25', '2026-06-20', 2, 6400000,  'pending',   'unpaid')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('\n✅ Seeding selesai!');
    console.log('   - 6 paket wisata');
    console.log('   - 5 pelanggan');
    console.log('   - 5 booking');
    console.log('\n📋 Buka pgAdmin → tripkita_db untuk melihat data.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding gagal:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
