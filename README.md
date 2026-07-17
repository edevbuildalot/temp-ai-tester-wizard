# Token Wizard — AI Prompt Analyzer

A free, zero-dependency AI prompt analyzer. Count tokens, estimate costs across models, and get prompt quality insights — all in your browser. No data ever leaves your machine.

Built as engineering-as-marketing: a useful tool that demonstrates the quality of our work.

## Features

- **Token estimation** — rough count for any text (English, ~4 chars/token)
- **Cost estimates** — 6 popular models (GPT-4o, Claude 3.5, Gemini, etc.) with input/output toggle
- **Prompt quality insights** — checks for roles, examples, format specs, and constraints
- **Zero dependencies** — no build step, no frameworks, no API keys
- **100% client-side** — nothing is sent to a server

## Usage

Open `index.html` in any browser. Paste text. Get results instantly.

## Deploy

This is a static site. Deploy anywhere: GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static file server.

```sh
# No build step needed. Just serve the directory.
npx serve .
```

## License

MIT