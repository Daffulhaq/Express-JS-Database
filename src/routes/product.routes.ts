import { Router } from 'express';
import {
  createProduct,
  getProductById,
  getProducts,
} from '../controllers/product.controller.js';

const router = Router();

// Path di sini relatif terhadap titik pemasangan router (/products) di app.ts.
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;
