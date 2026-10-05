import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ASSETS = path.join(ROOT, 'archive', 'assets', 'images');
const WRITE = process.argv.includes('--write');

const TEXT_TAG = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
const COORDINATE_PAIR = /[（(]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[,，]\s*[−-]?(?:\d+(?:\.\d+)?|\.\d+)\s*[）)]/g;
const DECIMAL = /\d+\.\d+/;

function stripDecimalCoordinates(raw) {
  let removed = 0;
  const next = raw.replace(TEXT_TAG, (whole, attrs, body) => {
    let changed = false;
    const cleanedBody = body.replace(COORDINATE_PAIR, (pair) => {
      if (!DECIMAL.test(pair)) return pair;
      changed = true;
      removed += 1;
      return '';
    });
    if (!changed) return whole;

    let visible = cleanedBody
      .replace(/\s{2,}/g, ' ')
      .replace(/\s*[,，]\s*$/g, '')
      .replace(/([=＝:：])\s*$/g, '')
      .trim();
    if (!visible) return '';
    return `<text${attrs}>${visible}</text>`;
  });
  return { next, removed };
}

const changedFiles = [];
let removedLabels = 0;
for (const entry of fs.readdirSync(ASSETS, { recursive: true })) {
  if (!entry.endsWith('-solution.svg')) continue;
  const file = path.join(ASSETS, entry);
  const raw = fs.readFileSync(file, 'utf8');
  const result = stripDecimalCoordinates(raw);
  if (result.next === raw) continue;
  changedFiles.push(path.relative(ROOT, file).replaceAll(path.sep, '/'));
  removedLabels += result.removed;
  if (WRITE) fs.writeFileSync(file, result.next, 'utf8');
}

console.log(JSON.stringify({
  mode: WRITE ? 'write' : 'dry-run',
  changedFiles: changedFiles.length,
  removedCoordinateLabels: removedLabels,
  files: changedFiles,
}, null, 2));
