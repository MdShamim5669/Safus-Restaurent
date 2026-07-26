import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './module/middleware/globalErrorHandler';
import { notFoundMiddleware } from './module/middleware/notFoundMiddleware';
import routes from './module/routes';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Application Routes
app.use('/api/v1', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('🍳 SaFus Restaurant API Server Running!');
});

// Global Error Handler & 404
app.use(globalErrorHandler);
app.use(notFoundMiddleware);

export default app;
