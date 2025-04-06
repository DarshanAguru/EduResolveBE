import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import {
  ClusterMemoryStorePrimary,
  ClusterMemoryStoreWorker,
} from '@express-rate-limit/cluster-memory-store';
import cluster from 'cluster';
import os from 'node:os';
import mongoose from 'mongoose';

import studentAuthRouter from './Router/studentAuthRouter.js';
import localAdminAuthRouter from './Router/localAdminAuthRouter.js';
import teacherAuthRouter from './Router/teacherAuthRouter.js';
import logger from './utils/logger.js';

dotenv.config();

const port = process.env.PORT || 9003;
const numCPUs = Math.min(os.cpus().length, 2); // Limit to 4 workers max

// Primary process 

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  logger.info('Running in production mode with clustering');

  const rateLimiterStore = new ClusterMemoryStorePrimary();
  rateLimiterStore.init();


      // Fork worker processes
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        logger.warn(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart a new worker
      });
   

// Worker Process

} else {

  mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    logger.info('MongoDB connected successfully');
    mongoose.set('strictQuery', false);

  const app = express(); 

  // middlewares
  app.use(morgan('dev')); // dev environment logging
  app.use(express.json()); // parse JSON bodies
  app.use(helmet()); // secure headers
  app.use(
    cors({
      origin: ['http://localhost:9000'],
      methods: ['POST', 'PUT'],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

  // Apply rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    store: new ClusterMemoryStoreWorker(),
    skipSuccessfulRequests: true,
    validate: true,
  });

  app.use(limiter); // Apply rate limiting to all routes

  // Routes
  app.use('/students', studentAuthRouter);
  app.use('/teachers', teacherAuthRouter);
  // app.use('/mentors', mentorAuthRouter);
  app.use('/localAdmins', localAdminAuthRouter);
  // app.use('/globalAdmins', schoolAdminAuthRouter);

  app.get('/healthCheck/checkHealthOfServer', (req, res) => {
    res.status(200).json({ message: 'Auth Server is up and running' });
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
  });
})
.catch((err) => {
  logger.error('MongoDB connection failed', err);
});
}
