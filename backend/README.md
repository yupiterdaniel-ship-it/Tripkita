# TripKita Backend — NestJS + PostgreSQL

REST API untuk aplikasi wisata TripKita menggunakan **NestJS** dan **PostgreSQL** (pgAdmin).

---

## Prasyarat

| Tool | Versi |
|------|-------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| PostgreSQL | ≥ 14 |
| pgAdmin | 4 atau 8 |

---

## 1. Setup Database di pgAdmin

### Buat database baru
1. Buka **pgAdmin** → klik kanan **Databases** → **Create** → **Database**
2. Isi nama database: `tripkita_db`
3. Klik **Save**

### Konfigurasi koneksi
Catat nilai berikut dari pgAdmin:
- Host: `localhost`
- Port: `5432`
- Username: `postgres` (atau user kamu)
- Password: password yang kamu set saat install PostgreSQL

---

## 2. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit file `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password_kamu     # ← ganti ini
DB_DATABASE=tripkita_db

CORS_ORIGIN=http://localhost:5173
```

---

## 3. Install & Jalankan

```bash
# Install dependencies
npm install

# Buat tabel (migrasi)
npm run db:migrate

# Isi data awal (seed)
npm run db:seed

# Jalankan server (development)
npm run start:dev

# Atau build & run production
npm run build
npm run start
```

---

## 4. Verifikasi di pgAdmin

Setelah `db:migrate` dan `db:seed`, buka pgAdmin:

```
tripkita_db
  └── Schemas
        └── public
              └── Tables
                    ├── packages    (6 baris)
                    ├── customers   (5 baris)
                    └── bookings    (5 baris)
```

Klik kanan tabel → **View/Edit Data** → **All Rows** untuk melihat data.

---

## 5. Endpoint API

Server berjalan di: `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api/docs`

### Packages (Paket Wisata)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/packages` | Semua paket (opsional: `?category=Beach`) |
| GET | `/packages/categories` | Daftar kategori |
| GET | `/packages/:id` | Detail paket |
| POST | `/packages` | Tambah paket baru |
| PUT | `/packages/:id` | Update paket |
| DELETE | `/packages/:id` | Hapus paket |

### Customers (Pelanggan)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/customers` | Semua pelanggan (opsional: `?search=budi`) |
| GET | `/customers/:id` | Detail pelanggan |
| GET | `/customers/:id/bookings` | Riwayat booking pelanggan |
| POST | `/customers` | Tambah pelanggan |
| PUT | `/customers/:id` | Update pelanggan |
| DELETE | `/customers/:id` | Hapus pelanggan |

### Bookings (Pemesanan)
| Method | URL | Deskripsi |
|--------|-----|-----------|
| GET | `/bookings` | Semua booking (opsional: `?status=confirmed`) |
| GET | `/bookings/stats` | Statistik dashboard |
| GET | `/bookings/:id` | Detail booking |
| POST | `/bookings` | Buat booking baru |
| PUT | `/bookings/:id` | Update booking |
| PATCH | `/bookings/:id/cancel` | Batalkan booking |

---

## 6. Contoh Request

### Buat booking baru
```http
POST http://localhost:3000/bookings
Content-Type: application/json

{
  "packageId": "1",
  "customerId": "C001",
  "travelDate": "2026-08-01",
  "numberOfPeople": 2,
  "notes": "Mohon kamar dengan pemandangan laut"
}
```

### Tambah paket wisata
```http
POST http://localhost:3000/packages
Content-Type: application/json

{
  "name": "Paket Wisata Flores 3D2N",
  "location": "Flores, NTT",
  "price": 3500000,
  "duration": "3 Hari 2 Malam",
  "category": "Island & Culture",
  "maxCapacity": 15,
  "facilities": ["Hotel Bintang 3", "Transportasi AC", "Pemandu Wisata"]
}
```

---

## Struktur Proyek

```
src/
├── main.ts                    # Entry point + Swagger setup
├── app.module.ts              # Root module
├── database/
│   ├── database.module.ts     # Database provider (global)
│   ├── database.service.ts    # Pool & query helper
│   ├── migrate.ts             # npm run db:migrate
│   └── seed.ts                # npm run db:seed
├── packages/
│   ├── packages.module.ts
│   ├── packages.controller.ts
│   ├── packages.service.ts
│   └── packages.dto.ts
├── customers/
│   ├── customers.module.ts
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   └── customers.dto.ts
└── bookings/
    ├── bookings.module.ts
    ├── bookings.controller.ts
    ├── bookings.service.ts
    └── bookings.dto.ts
```

---

## Menghubungkan ke Frontend

Di file `TripKita Web Application/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Frontend sudah dikonfigurasi untuk memanggil `http://localhost:3000` melalui `src/app/utils/api.ts`.
