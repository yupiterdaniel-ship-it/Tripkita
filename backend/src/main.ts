import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── CORS ──────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ── Swagger / API Docs ────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('TripKita API')
    .setDescription('REST API untuk aplikasi wisata TripKita')
    .setVersion('1.0')
    .addTag('packages', 'Manajemen paket wisata')
    .addTag('customers', 'Manajemen pelanggan')
    .addTag('bookings', 'Manajemen pemesanan')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start ─────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port);
  console.log(`\n🚀 TripKita API berjalan di http://localhost:${port}`);
  console.log(`📚 Swagger docs   → http://localhost:${port}/api/docs`);
  console.log(`🗄️  Database       → ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_DATABASE || 'tripkita_db'}\n`);
}

bootstrap();
