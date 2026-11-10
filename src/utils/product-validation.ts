// Batas Int 32-bit PostgreSQL (tipe Int pada schema Prisma).
const INT32_MAX = 2_147_483_647;

export interface ProductInput {
  name: string;
  price: number;
}

// ID valid = bilangan bulat positif. Mengembalikan null jika tidak valid.
// Menerima string angka (dari URL, misalnya "3") maupun number (dari body JSON).
export function parseId(value: unknown): number | null {
  const id = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

  if (typeof id !== 'number' || !Number.isInteger(id) || id < 1 || id > INT32_MAX) {
    return null;
  }
  return id;
}

// Dipakai bersama oleh POST dan PUT (body keduanya sama: name dan price).
export function validateProductBody(body: unknown): { data: ProductInput } | { error: string } {
  const { name, price } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'name wajib berupa teks yang tidak kosong' };
  }
  if (typeof price !== 'number' || !Number.isInteger(price) || price < 0 || price > INT32_MAX) {
    return { error: 'price wajib berupa bilangan bulat (rupiah) dan tidak boleh negatif' };
  }

  return { data: { name: name.trim(), price } };
}
