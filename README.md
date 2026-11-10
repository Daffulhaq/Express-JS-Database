# API Daftar Produk (Week 10)

Tugas Pemrograman Web Week 10. Lanjutan API produk Week 9: data produk sekarang disimpan di **PostgreSQL** lewat **Prisma**, sehingga tetap ada setelah Express dimulai ulang.

## Versi yang dipakai

| Komponen | Versi |
| --- | --- |
| Node.js | 22 (diuji dengan v22.23.4) |
| Express | ^5.3.0 |
| TypeScript | ^7.0.2 |
| Prisma (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) | 7.10.1 |
| PostgreSQL | 16 (diuji dengan 16.x) |

## Struktur proyek

```
prisma/
  schema.prisma          model Product
  migrations/            riwayat migration (di-commit ke Git)
  seed.ts                data awal: Buku dan Pulpen
prisma.config.ts         konfigurasi CLI Prisma (URL database, lokasi migration, seed)
src/
  lib/prisma.ts          membuat PrismaClient dengan adapter PostgreSQL
  routes/                memetakan method + path ke controller
  controllers/           membaca request, validasi, status + JSON response
  services/              akses database lewat Prisma
  utils/                 fungsi validasi id dan body produk
  middleware/            request logger, 404, error handler
```

Alur request: **route → controller → service → Prisma → PostgreSQL**.

## Instalasi

### 1. Install dependency

```bash
npm install
```

### 2. Siapkan PostgreSQL

Pakai PostgreSQL lokal yang sudah ada, atau jalankan lewat Docker (ganti `GANTI_PASSWORD`):

```bash
docker run --name pemweb-postgres \
  -e POSTGRES_USER=pemweb \
  -e POSTGRES_PASSWORD=GANTI_PASSWORD \
  -e POSTGRES_DB=products_db \
  -p 5432:5432 \
  -v pemweb_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

> Saat menguji "data tetap ada setelah restart", yang di-restart hanya **Express**. Jangan hapus container atau volume database.

Bila memakai user PostgreSQL sendiri (bukan superuser), user tersebut perlu hak `CREATEDB` karena `prisma migrate dev` membuat shadow database sementara.

### 3. Atur koneksi database

```bash
cp .env.example .env
```

Lalu ubah isi `.env`. Contoh isi `.env.example`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
```

`.env` sudah masuk `.gitignore`. Jangan commit password.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

Harus dijalankan **setelah** `.env` dibuat, karena `prisma.config.ts` membaca `DATABASE_URL`. Ulangi perintah ini setiap kali `schema.prisma` berubah.

### 5. Terapkan migration

```bash
npx prisma migrate dev
```

Perintah ini menerapkan folder `prisma/migrations` ke database dan membuat tabel `Product`.

### 6. (Opsional) Isi data awal

```bash
npm run db:seed
```

Menambahkan Buku (15000) dan Pulpen (5000) bila tabel masih kosong.

## Menjalankan

```bash
# Development (auto-reload)
npm run dev

# Produksi
npm run build
npm start
```

Server berjalan di `http://localhost:3000` (ubah dengan variabel `PORT`).

### Melihat isi database dengan Prisma Studio

```bash
npm run db:studio
```

Buka alamat yang tampil di terminal (biasanya `http://localhost:5555`).

## Daftar endpoint

Model `Product`: `id` (Int, dibuat database), `name` (String), `price` (Int, rupiah bulat).

| Method | Path | Body | Respons sukses | Respons gagal |
| --- | --- | --- | --- | --- |
| GET | `/products` | - | `200` + array produk | - |
| GET | `/products/:id` | - | `200` + satu produk | `400` id tidak valid, `404` tidak ditemukan |
| POST | `/products` | `{ "name": "Spidol", "price": 8000 }` | `201` + produk baru (dengan id dari database) | `400` body tidak valid |
| PUT | `/products/:id` | `{ "name": "Spidol Biru", "price": 9500 }` | `200` + produk setelah diubah | `400`, `404` |
| PUT | `/products` | `{ "id": 4, "name": "Spidol Biru", "price": 9500 }` | `200` + produk setelah diubah | `400`, `404` |
| DELETE | `/products/:id` | - | `200` + `{ "message": "Produk berhasil dihapus", "product": {...} }` | `400`, `404` |

Aturan validasi:

- `id` (di URL atau body): bilangan bulat positif, maksimal 2147483647.
- `name`: teks, tidak boleh kosong (spasi di awal/akhir dibuang).
- `price`: bilangan bulat (bukan teks, bukan desimal), minimal 0.
- Pada `PUT /products/:id`, bila body juga memuat `id`, nilainya harus sama dengan id di URL.
- Body JSON yang rusak menghasilkan `400`. Error server menghasilkan `500` dengan pesan umum tanpa detail koneksi.

Contoh respons error:

```json
{ "message": "price wajib berupa bilangan bulat (rupiah) dan tidak boleh negatif" }
```

## Mengubah struktur tabel

Mengubah `schema.prisma` saja **tidak** mengubah database. Alurnya:

```bash
# 1. ubah prisma/schema.prisma
# 2. catat dan terapkan perubahan sebagai migration
npx prisma migrate dev --name nama_perubahan
# 3. perbarui Prisma Client agar kode mengenali field baru
npx prisma generate
```

Folder `prisma/migrations` harus ikut di-commit. Jangan mengedit atau menghapus migration yang sudah diterapkan. Migration bukan backup, jadi menghapus kolom tetap menghapus isinya.

## Bukti pengujian

Lihat [Bukti Pengujian.md](Bukti%20Pengujian.md).
