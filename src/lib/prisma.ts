import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi nilainya.');
}

// Prisma 7 mengakses PostgreSQL lewat adapter (driver pg).
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Satu instance dipakai bersama oleh seluruh aplikasi.
export const prisma = new PrismaClient({ adapter });
