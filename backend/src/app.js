import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
