import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import logger from '../utils/logger';
import terminalsRouter from './routes/terminals.routes';
import customersRouter from './routes/customers.routes';
import clockingsRouter from './routes/clockings.routes';
import activityLogsRouter from './routes/activity-logs.routes';

export function setupAPI(app: Express): void {
  
  app.use(cors());
  app.use(express.json());

  app.use('/api/terminals', terminalsRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/clockings', clockingsRouter);
  app.use('/api/activity-logs', activityLogsRouter);

  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
  });

  // Error handling middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`API Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  logger.info('API routes initialized');
} 