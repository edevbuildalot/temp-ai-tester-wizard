import { FastifyInstance } from 'fastify';
import { createUser, authenticateUser, createToken } from '../services/auth.js';

export function registerAuthRoutes(app: FastifyInstance) {
  app.post('/api/auth/signup', async (request, reply) => {
    const { email, password, name } = request.body as any;

    if (!email || !password || !name) {
      return reply.status(400).send({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password must be at least 6 characters' });
    }

    try {
      const user = createUser(email, password, name);
      const token = createToken(user.id);
      return { user: { id: user.id, email: user.email, name: user.name }, token };
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    try {
      const user = authenticateUser(email, password);
      const token = createToken(user.id);
      return { user: { id: user.id, email: user.email, name: user.name }, token };
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });
}