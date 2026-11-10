import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Dibaca oleh CLI Prisma (migrate, studio, db seed).
// Koneksi untuk kode aplikasi ada di src/lib/prisma.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { url: env('DATABASE_URL') },
});
