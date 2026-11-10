import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js';

const router = Router();

// Path di sini relatif terhadap titik pemasangan router (/products) di app.ts.
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/', updateProduct); // id dikirim di body
router.put('/:id', updateProduct); // id dikirim di URL
router.delete('/:id', deleteProduct);

export default router;
