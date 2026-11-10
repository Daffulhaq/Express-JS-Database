import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type { ProductInput } from '../utils/product-validation.js';

// Semua akses database untuk produk ada di sini. Controller tidak memanggil Prisma langsung.

export function findAll() {
  return prisma.product.findMany({ orderBy: { id: 'asc' } });
}

// Mengembalikan null jika ID tidak ditemukan.
export function findById(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

// ID dibuat oleh database (autoincrement), bukan oleh aplikasi.
export function create(data: ProductInput) {
  return prisma.product.create({ data });
}

// Mengembalikan null jika ID tidak ditemukan.
export async function update(id: number, data: ProductInput) {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (err) {
    if (isRecordNotFound(err)) return null;
    throw err;
  }
}

// Mengembalikan produk yang dihapus, atau null jika ID tidak ditemukan.
export async function remove(id: number) {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (isRecordNotFound(err)) return null;
    throw err;
  }
}

// P2025 = Prisma tidak menemukan baris yang akan diubah/dihapus.
function isRecordNotFound(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}
