const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'archive', 'assets', 'images');
const TEXT_TAG = /<text\b[^>]*>([\s\S]*?)<\/text>/gi;
const COORDINATE_PAIR = /[（(]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[,，]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[）)]/g;
const DECIMAL = /\d+\.\d+/;

const remaining = [];
for (const entry of fs.readdirSync(ASSETS, { recursive: true })) {
  if (!entry.endsWith('-solution.svg')) continue;
  const file = path.join(ASSETS, entry);
  const raw = fs.readFileSync(file, 'utf8');
  for (const match of raw.matchAll(TEXT_TAG)) {
    const text = match[1];
    if ([...text.matchAll(COORDINATE_PAIR)].some(([pair]) => DECIMAL.test(pair))) {
      remaining.push(`${path.relative(ROOT, file)}: ${text}`);
    }
  }
}

assert.deepEqual(remaining, [], `student-facing decimal point labels remain:\n${remaining.join('\n')}`);
console.log('SVG point decimal label check passed');
