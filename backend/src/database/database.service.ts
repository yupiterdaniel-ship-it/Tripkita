import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  onModuleInit() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'tripkita_db',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      this.logger.error('PostgreSQL pool error:', err);
    });

    this.logger.log(
      `Database pool created → ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'tripkita_db'}`,
    );
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database pool closed');
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      return await client.query<T>(sql, params);
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }
}
