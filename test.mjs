import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const html = readFileSync(join(__dirname, 'index.html'), 'utf-8');
const js = readFileSync(join(__dirname, 'app.js'), 'utf-8');
const css = readFileSync(join(__dirname, 'style.css'), 'utf-8');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; } else { failed++; console.error(`FAIL: ${msg}`); }
}

assert(html.includes('<!DOCTYPE html>'), 'index.html has doctype');
assert(html.includes('</html>'), 'index.html closes html tag');
assert(html.includes('</body>'), 'index.html has body tag');
assert(html.includes('app.js'), 'index.html references app.js');
assert(html.includes('style.css'), 'index.html references style.css');
assert(js.length > 0, 'app.js is non-empty');
assert(css.length > 0, 'style.css is non-empty');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);