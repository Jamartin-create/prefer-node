import 'reflect-metadata';
import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './plugin/better-auth';

async function bootstrap() {
  const authHandler = toNodeHandler(auth);

  const app = express();
  const server = http.createServer(app);

  try {
    await auth.api.getSession({
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    console.log('✅ BetterAuth configuration is valid');
  } catch (error) {
    console.error('❌ BetterAuth configuration error:', error);
  }

  // BetterAuth handler with additional debugging
  app.use('/api/auth/*', (req, res) => {
    console.log(`🔐 BetterAuth handling: ${req.method} ${req.url}`);
    console.log('🔐 Request body:', req.body);

    authHandler(req, res).catch(err => {
      console.error('BetterAuth handler error:', err);
      res.status(500).json({ error: 'Internal auth error' });
    });
  });
  
  
  // Security middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    exposedHeaders: ['set-cookie'],
  }));

  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);

  // Start server
  server.listen(3000, () => {
    console.log(`🚀 Server running on http://localhost:3000`);
    console.log(`📚 API Documentation: http://localhost:3000/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:3000/api/auth/*`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});