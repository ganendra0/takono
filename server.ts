import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getDbStatus } from './server/db';
import { registerHandler, loginHandler, meHandler, listUsersHandler } from './server/auth';
import apiRouter from './server/routes/api';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Database asynchronously (MySQL with graceful fallback)
  await initDatabase();

  // Authentication Routes
  app.post('/api/auth/register', registerHandler);
  app.post('/api/auth/login', loginHandler);
  app.get('/api/auth/me', meHandler);
  app.get('/api/auth/users', listUsersHandler);

  // Business & Tourism REST API Routes
  app.use('/api', apiRouter);

  // Development: Vite Middleware | Production: Static Asset Server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TAKONO] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[TAKONO] Fatal Server Startup Error:', err);
});
