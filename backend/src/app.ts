import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
// app.use(errorHandler);


export default app;