import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../services/auth.js';

export interface AuthenticatedRequest extends FastifyRequest {
  userId?: string;
}

export async function authMiddleware(request: AuthenticatedRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    reply.status(401).send({ error: 'Invalid or expired token' });
    return;
  }

  request.userId = payload.userId;
}