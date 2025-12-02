import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import routes from './routes';

const app = express();

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions: cors.CorsOptions = {
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
// app.use(errorHandler);


export default app;