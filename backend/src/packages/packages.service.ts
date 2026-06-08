import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePackageDto, UpdatePackageDto } from './packages.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PackagesService {
  constructor(private readonly db: DatabaseService) {}

  // ── Helpers ──────────────────────────────────────────────────
  private mapRow(row: any) {
    return {
      id: row.id,
      name: row.name,
      location: row.location,
      price: Number(row.price),
      duration: row.duration,
      description: row.description,
      facilities: row.facilities ?? [],
      schedule: row.schedule,
      image: row.image,
      category: row.category,
      maxCapacity: row.max_capacity,
      availableSlots: row.available_slots,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // ── CRUD ─────────────────────────────────────────────────────
  async findAll(category?: string) {
    let sql = `SELECT * FROM packages WHERE is_active = TRUE`;
    const params: any[] = [];
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    sql += ` ORDER BY created_at DESC`;
    const { rows } = await this.db.query(sql, params);
    return rows.map(this.mapRow);
  }

  async findOne(id: string) {
    const { rows } = await this.db.query(
      `SELECT * FROM packages WHERE id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Paket dengan id ${id} tidak ditemukan`);
    return this.mapRow(rows[0]);
  }

  async create(dto: CreatePackageDto) {
    const id = uuidv4();
    const { rows } = await this.db.query(
      `INSERT INTO packages (id, name, location, price, duration, description, facilities, schedule, image, category, max_capacity, available_slots)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        id,
        dto.name,
        dto.location,
        dto.price,
        dto.duration,
        dto.description ?? null,
        dto.facilities ?? [],
        dto.schedule ?? null,
        dto.image ?? null,
        dto.category ?? null,
        dto.maxCapacity ?? 20,
        dto.availableSlots ?? dto.maxCapacity ?? 20,
      ],
    );
    return this.mapRow(rows[0]);
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOne(id); // throws 404 if not found
    const fields: string[] = [];
    const params: any[] = [];

    const add = (col: string, val: any) => {
      params.push(val);
      fields.push(`${col} = $${params.length}`);
    };

    if (dto.name !== undefined) add('name', dto.name);
    if (dto.location !== undefined) add('location', dto.location);
    if (dto.price !== undefined) add('price', dto.price);
    if (dto.duration !== undefined) add('duration', dto.duration);
    if (dto.description !== undefined) add('description', dto.description);
    if (dto.facilities !== undefined) add('facilities', dto.facilities);
    if (dto.schedule !== undefined) add('schedule', dto.schedule);
    if (dto.image !== undefined) add('image', dto.image);
    if (dto.category !== undefined) add('category', dto.category);
    if (dto.maxCapacity !== undefined) add('max_capacity', dto.maxCapacity);
    if (dto.availableSlots !== undefined) add('available_slots', dto.availableSlots);
    if (dto.isActive !== undefined) add('is_active', dto.isActive);

    if (!fields.length) return this.findOne(id);

    params.push(id);
    const { rows } = await this.db.query(
      `UPDATE packages SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    return this.mapRow(rows[0]);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.query(`DELETE FROM packages WHERE id = $1`, [id]);
    return { message: `Paket ${id} berhasil dihapus` };
  }

  async getCategories() {
    const { rows } = await this.db.query(
      `SELECT DISTINCT category FROM packages WHERE category IS NOT NULL AND is_active = TRUE ORDER BY category`,
    );
    return rows.map((r) => r.category);
  }
}
