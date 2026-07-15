# temp-ai-tester-wizard

Disposable browser environments for AI-driven QA testing. Spin up, test, destroy.

## Development

```bash
pnpm dev
```

## Production

```bash
pnpm build && pnpm start
```

The production server serves the built app and handles `/api/waitlist` POST requests, storing signups in `data/waitlist.json`.