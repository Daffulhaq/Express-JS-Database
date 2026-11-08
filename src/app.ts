import express from 'express';
import { errorHandler, notFound } from './middleware/error-handlers.js';
import { requestLogger } from './middleware/request-logger.js';
import productRouter from './routes/product.routes.js';

const app = express();

// Urutan penting: parser JSON dan logger dipasang sebelum router.
app.use(express.json());
app.use(requestLogger);

app.use('/products', productRouter);

// Dipasang setelah semua router.
app.use(notFound);
app.use(errorHandler);

export default app;
