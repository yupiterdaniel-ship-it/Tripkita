import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBookingDto, UpdateBookingDto } from './bookings.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(private readonly db: DatabaseService) {}

  private mapRow(row: any) {
    return {
      id: row.id,
      packageId: row.package_id,
      customerId: row.customer_id,
      bookingDate: row.booking_date,
      travelDate: row.travel_date,
      numberOfPeople: row.number_of_people,
      totalPrice: Number(row.total_price),
      status: row.status,
      paymentStatus: row.payment_status,
      notes: row.notes,
      // joined fields (opsional)
      packageName: row.package_name,
      packageLocation: row.location,
      packageImage: row.image,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(status?: string, paymentStatus?: string) {
    let sql = `
      SELECT b.*,
             p.name  AS package_name,
             p.location,
             p.image,
             c.name  AS customer_name,
             c.email AS customer_email
      FROM bookings b
      JOIN packages  p ON p.id = b.package_id
      JOIN customers c ON c.id = b.customer_id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { params.push(status); sql += ` AND b.status = $${params.length}`; }
    if (paymentStatus) { params.push(paymentStatus); sql += ` AND b.payment_status = $${params.length}`; }
    sql += ` ORDER BY b.created_at DESC`;
    const { rows } = await this.db.query(sql, params);
    return rows.map(this.mapRow);
  }

  async findOne(id: string) {
    const { rows } = await this.db.query(
      `SELECT b.*,
              p.name  AS package_name,
              p.location,
              p.image,
              c.name  AS customer_name,
              c.email AS customer_email
       FROM bookings b
       JOIN packages  p ON p.id = b.package_id
       JOIN customers c ON c.id = b.customer_id
       WHERE b.id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Booking dengan id ${id} tidak ditemukan`);
    return this.mapRow(rows[0]);
  }

  async create(dto: CreateBookingDto) {
    // Validasi package tersedia
    const pkgRes = await this.db.query(
      `SELECT id, price, available_slots FROM packages WHERE id = $1 AND is_active = TRUE`,
      [dto.packageId],
    );
    if (!pkgRes.rows.length) throw new NotFoundException(`Paket ${dto.packageId} tidak ditemukan`);
    const pkg = pkgRes.rows[0];

    if (pkg.available_slots < dto.numberOfPeople) {
      throw new BadRequestException(
        `Slot tersedia hanya ${pkg.available_slots}, tidak cukup untuk ${dto.numberOfPeople} orang`,
      );
    }

    // Validasi customer
    const custRes = await this.db.query(`SELECT id FROM customers WHERE id = $1`, [dto.customerId]);
    if (!custRes.rows.length) throw new NotFoundException(`Pelanggan ${dto.customerId} tidak ditemukan`);

    const totalPrice = Number(pkg.price) * dto.numberOfPeople;
    const id = uuidv4();

    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO bookings (id, package_id, customer_id, travel_date, number_of_people, total_price, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [id, dto.packageId, dto.customerId, dto.travelDate, dto.numberOfPeople, totalPrice, dto.notes ?? null],
      );

      // Kurangi available_slots
      await client.query(
        `UPDATE packages SET available_slots = available_slots - $1 WHERE id = $2`,
        [dto.numberOfPeople, dto.packageId],
      );

      await client.query('COMMIT');
      return this.findOne(rows[0].id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async update(id: string, dto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    const fields: string[] = [];
    const params: any[] = [];
    const add = (col: string, val: any) => { params.push(val); fields.push(`${col} = $${params.length}`); };

    if (dto.travelDate !== undefined) add('travel_date', dto.travelDate);
    if (dto.numberOfPeople !== undefined) add('number_of_people', dto.numberOfPeople);
    if (dto.status !== undefined) add('status', dto.status);
    if (dto.paymentStatus !== undefined) add('payment_status', dto.paymentStatus);
    if (dto.notes !== undefined) add('notes', dto.notes);

    if (!fields.length) return booking;

    params.push(id);
    await this.db.query(
      `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${params.length}`,
      params,
    );
    return this.findOne(id);
  }

  async cancel(id: string) {
    const booking = await this.findOne(id);
    if (booking.status === 'cancelled') throw new BadRequestException('Booking sudah dibatalkan');

    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [id]);
      // Kembalikan slot
      await client.query(
        `UPDATE packages SET available_slots = available_slots + $1 WHERE id = $2`,
        [booking.numberOfPeople, booking.packageId],
      );
      await client.query('COMMIT');
      return this.findOne(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getDashboardStats() {
    const [totalBookings, totalRevenue, pendingBookings, totalCustomers, totalPackages] =
      await Promise.all([
        this.db.query(`SELECT COUNT(*) AS count FROM bookings`),
        this.db.query(`SELECT COALESCE(SUM(total_price),0) AS total FROM bookings WHERE payment_status = 'paid'`),
        this.db.query(`SELECT COUNT(*) AS count FROM bookings WHERE status = 'pending'`),
        this.db.query(`SELECT COUNT(*) AS count FROM customers`),
        this.db.query(`SELECT COUNT(*) AS count FROM packages WHERE is_active = TRUE`),
      ]);

    return {
      totalBookings: Number(totalBookings.rows[0].count),
      totalRevenue: Number(totalRevenue.rows[0].total),
      pendingBookings: Number(pendingBookings.rows[0].count),
      totalCustomers: Number(totalCustomers.rows[0].count),
      totalPackages: Number(totalPackages.rows[0].count),
    };
  }
}
