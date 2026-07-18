import { FastifyInstance } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth.js';
import { runTest } from '../services/tester.js';
import db from '../db.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerTestRoutes(app: FastifyInstance) {
  app.post('/api/tests', { preHandler: authMiddleware }, async (request: AuthenticatedRequest, reply) => {
    const { url, prompt } = request.body as any;

    if (!url || !prompt) {
      return reply.status(400).send({ error: 'URL and prompt are required' });
    }

    try {
      new URL(url);
    } catch {
      return reply.status(400).send({ error: 'Invalid URL format' });
    }

    const result = await runTest(url, prompt, request.userId!);

    return {
      passed: result.passed,
      summary: result.summary,
      details: result.details,
      screenshotPath: result.screenshotPath,
    };
  });

  app.get('/api/tests', { preHandler: authMiddleware }, async (request: AuthenticatedRequest) => {
    const runs = db.prepare(
      'SELECT id, url, prompt, status, result, created_at, completed_at FROM test_runs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
    ).all(request.userId!) as any[];

    return { runs: runs.map(r => ({
      ...r,
      result: r.result ? JSON.parse(r.result) : null,
    }))};
  });

  app.get('/api/tests/:id', { preHandler: authMiddleware }, async (request: AuthenticatedRequest, reply) => {
    const { id } = request.params as any;
    const run = db.prepare(
      'SELECT id, url, prompt, status, result, screenshot_path, created_at, completed_at FROM test_runs WHERE id = ? AND user_id = ?'
    ).get(id, request.userId!) as any;

    if (!run) {
      return reply.status(404).send({ error: 'Test run not found' });
    }

    return {
      ...run,
      result: run.result ? JSON.parse(run.result) : null,
    };
  });

  app.get('/api/tests/:id/screenshot', { preHandler: authMiddleware }, async (request: AuthenticatedRequest, reply) => {
    const { id } = request.params as any;
    const run = db.prepare(
      'SELECT screenshot_path FROM test_runs WHERE id = ? AND user_id = ?'
    ).get(id, request.userId!) as any;

    if (!run || !run.screenshot_path) {
      return reply.status(404).send({ error: 'Screenshot not found' });
    }

    const filePath = path.join(__dirname, '../../data/screenshots', run.screenshot_path);
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ error: 'Screenshot file not found' });
    }

    const image = fs.readFileSync(filePath);
    reply.header('Content-Type', 'image/png');
    return reply.send(image);
  });
}