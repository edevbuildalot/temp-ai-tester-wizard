import { FastifyInstance } from 'fastify';
import db from '../db.js';
import { generateId } from '../services/id.js';

export function registerWaitlistRoutes(app: FastifyInstance) {
  app.post('/api/waitlist', async (request, reply) => {
    const { email } = request.body as any;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.status(400).send({ error: 'A valid email is required' });
    }

    const existing = db.prepare('SELECT id FROM waitlist WHERE email = ?').get(email);
    if (existing) {
      return { message: "You're already on the waitlist!" };
    }

    const id = generateId();
    db.prepare('INSERT INTO waitlist (id, email) VALUES (?, ?)').run(id, email);

    return { message: "You're on the list! We'll be in touch." };
  });
}