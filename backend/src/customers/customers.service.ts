import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customers.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CustomersService {
  constructor(private readonly db: DatabaseService) {}

  private mapRow(row: any) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      joinDate: row.join_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(search?: string) {
    let sql = `SELECT * FROM customers`;
    const params: any[] = [];
    if (search) {
      params.push(`%${search}%`);
      sql += ` WHERE name ILIKE $1 OR email ILIKE $1`;
    }
    sql += ` ORDER BY created_at DESC`;
    const { rows } = await this.db.query(sql, params);
    return rows.map(this.mapRow);
  }

  async findOne(id: string) {
    const { rows } = await this.db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Pelanggan dengan id ${id} tidak ditemukan`);
    return this.mapRow(rows[0]);
  }

  async create(dto: CreateCustomerDto) {
    // Cek email duplikat
    const exists = await this.db.query(
      `SELECT id FROM customers WHERE email = $1`,
      [dto.email],
    );
    if (exists.rows.length) {
      throw new ConflictException(`Email ${dto.email} sudah terdaftar`);
    }

    const id = uuidv4();
    const { rows } = await this.db.query(
      `INSERT INTO customers (id, name, email, phone, address, join_date)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, dto.name, dto.email, dto.phone ?? null, dto.address ?? null, dto.joinDate ?? new Date().toISOString().slice(0, 10)],
    );
    return this.mapRow(rows[0]);
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    if (dto.email) {
      const exists = await this.db.query(
        `SELECT id FROM customers WHERE email = $1 AND id != $2`,
        [dto.email, id],
      );
      if (exists.rows.length) throw new ConflictException(`Email ${dto.email} sudah digunakan`);
    }

    const fields: string[] = [];
    const params: any[] = [];
    const add = (col: string, val: any) => { params.push(val); fields.push(`${col} = $${params.length}`); };

    if (dto.name !== undefined) add('name', dto.name);
    if (dto.email !== undefined) add('email', dto.email);
    if (dto.phone !== undefined) add('phone', dto.phone);
    if (dto.address !== undefined) add('address', dto.address);

    if (!fields.length) return this.findOne(id);

    params.push(id);
    const { rows } = await this.db.query(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    return this.mapRow(rows[0]);
  }

  async remove(id: string) {
    await this.findOne(id);
    // Cek apakah masih ada booking aktif
    const active = await this.db.query(
      `SELECT id FROM bookings WHERE customer_id = $1 AND status != 'cancelled'`,
      [id],
    );
    if (active.rows.length) {
      throw new ConflictException('Pelanggan masih memiliki booking aktif dan tidak dapat dihapus');
    }
    await this.db.query(`DELETE FROM customers WHERE id = $1`, [id]);
    return { message: `Pelanggan ${id} berhasil dihapus` };
  }

  async getBookingHistory(customerId: string) {
    await this.findOne(customerId);
    const { rows } = await this.db.query(
      `SELECT b.*, p.name AS package_name, p.location, p.image
       FROM bookings b
       JOIN packages p ON p.id = b.package_id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [customerId],
    );
    return rows;
  }
}
