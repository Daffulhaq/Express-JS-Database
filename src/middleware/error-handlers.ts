import type { NextFunction, Request, Response } from 'express';

// Dipasang setelah semua router: dipakai jika tidak ada route yang cocok.
export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
}

// Dipasang paling akhir: menangkap error, misalnya body JSON yang rusak.
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const status =
    typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
      ? err.status
      : 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status >= 500 ? 'Terjadi kesalahan pada server' : 'Request tidak valid',
  });
}
