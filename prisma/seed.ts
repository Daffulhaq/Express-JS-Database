import { prisma } from '../src/lib/prisma.js';

// Mengisi data awal (sama dengan data minggu ke-9) hanya jika tabel masih kosong.
async function main() {
  const total = await prisma.product.count();

  if (total > 0) {
    console.log(`Seed dilewati: tabel Product sudah berisi ${total} data.`);
    return;
  }

  await prisma.product.createMany({
    data: [
      { name: 'Buku', price: 15000 },
      { name: 'Pulpen', price: 5000 },
    ],
  });
  console.log('Seed selesai: Buku dan Pulpen ditambahkan.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
