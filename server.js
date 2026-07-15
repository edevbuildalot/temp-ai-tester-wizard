import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname)
const DATA_DIR = join(ROOT, 'data')
const DATA_FILE = join(DATA_DIR, 'waitlist.json')
const DIST_DIR = join(ROOT, 'dist')

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

function getWaitlist() {
  if (!existsSync(DATA_FILE)) {
    mkdirSync(DATA_DIR, { recursive: true })
    writeFileSync(DATA_FILE, '[]', 'utf-8')
    return []
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}

const port = parseInt(process.env.PORT || '3000', 10)

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/waitlist') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body)
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Invalid email address' }))
          return
        }
        const list = getWaitlist()
        if (list.includes(email)) {
          res.writeHead(409, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Already on the waitlist' }))
          return
        }
        list.push(email)
        writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    })
    return
  }

  if (!existsSync(DIST_DIR)) {
    res.writeHead(404)
    res.end('Run pnpm build first')
    return
  }

  let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url)
  if (!existsSync(filePath)) {
    filePath = join(DIST_DIR, 'index.html')
  }

  const ext = extname(filePath)
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  res.end(readFileSync(filePath))
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})