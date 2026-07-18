import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerAuthRoutes } from './routes/auth.js';
import { registerTestRoutes } from './routes/tests.js';
import { registerWaitlistRoutes } from './routes/waitlist.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});

registerAuthRoutes(app);
registerTestRoutes(app);
registerWaitlistRoutes(app);

app.get('/api/health', async () => ({ status: 'ok' }));

const port = parseInt(process.env.PORT || '3001', 10);

try {
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`API server running on port ${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}