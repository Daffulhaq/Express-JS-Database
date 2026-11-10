import type { Request, Response } from 'express';
import * as productService from '../services/product.service.js';
import { parseId, validateProductBody } from '../utils/product-validation.js';

// Controller hanya mengurus HTTP: membaca request, memvalidasi, memilih status, dan mengirim JSON.
// Express 5 meneruskan error dari fungsi async ke errorHandler, jadi tidak perlu try/catch di sini.

// GET /products -> 200 + array seluruh produk dari database
export async function getProducts(req: Request, res: Response) {
  const products = await productService.findAll();
  res.status(200).json(products);
}

// GET /products/:id -> 200 + satu produk, 400 jika ID tidak valid, 404 jika tidak ada
export async function getProductById(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'id harus berupa bilangan bulat positif' });
    return;
  }

  const product = await productService.findById(id);
  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

// POST /products -> 201 + produk baru (ID berasal dari database)
export async function createProduct(req: Request, res: Response) {
  // Di Express 5, req.body bernilai undefined jika tidak ada body yang terbaca.
  const result = validateProductBody(req.body);
  if ('error' in result) {
    res.status(400).json({ message: result.error });
    return;
  }

  const newProduct = await productService.create(result.data);
  res.status(201).json(newProduct);
}

// PUT /products/:id  (id di URL)  atau  PUT /products  (id di body)
// Body sama dengan POST (name dan price). Jika id ada di URL dan di body, nilainya harus sama.
// -> 200 + produk setelah diubah, 400 jika tidak valid, 404 jika ID tidak ada
export async function updateProduct(req: Request, res: Response) {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const id = parseId(req.params.id ?? body.id);

  if (id === null) {
    res.status(400).json({ message: 'id wajib berupa bilangan bulat positif (di URL atau di body)' });
    return;
  }
  if (req.params.id !== undefined && body.id !== undefined && parseId(body.id) !== id) {
    res.status(400).json({ message: 'id pada body harus sama dengan id pada URL' });
    return;
  }

  const result = validateProductBody(body);
  if ('error' in result) {
    res.status(400).json({ message: result.error });
    return;
  }

  const product = await productService.update(id, result.data);
  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json(product);
}

// DELETE /products/:id -> 200 + produk yang dihapus, 400 jika ID tidak valid, 404 jika tidak ada
export async function deleteProduct(req: Request, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: 'id harus berupa bilangan bulat positif' });
    return;
  }

  const product = await productService.remove(id);
  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
    return;
  }

  res.status(200).json({ message: 'Produk berhasil dihapus', product });
}
