import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const TARGET_DIR = path.join(ARCHIVE, 'exams', 'original', 'high', 'h1');

let changedFiles = 0;
let removedBlankRuns = 0;

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

for (const filePath of walk(TARGET_DIR)) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.replace(/((?:\r?\n)[ \t]*){3,}(?="subUnitKey"\s*:)/g, '\n    ');
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    changedFiles += 1;
    removedBlankRuns += (before.match(/((?:\r?\n)[ \t]*){3,}(?="subUnitKey"\s*:)/g) || []).length;
  }
}

console.log(JSON.stringify({ status: 'CLEANED_ROLLBACK_BLANK_LINES', changedFiles, removedBlankRuns }, null, 2));
