import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guard = fs.readFileSync(path.join(root, 'archive/print_guard.js'), 'utf8');

assert.match(guard, /question-overflow/);
assert.match(guard, /math-overflow/);
assert.match(guard, /page-overflow/);
assert.match(guard, /MAX_REPAIR_PASSES\s*=\s*2/);
assert.match(guard, /MathJax\.startup\.promise/);
assert.match(guard, /window\.__AP_PRINT_AUDIT__/);
assert.match(guard, /인쇄 검수 통과/);

for (const relativePath of ['archive/engine.html', 'archive/mixed_engine.html', 'apmath/wrong_print_engine.html']) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  assert.match(source, /print_guard\.js/, `${relativePath} should load the shared print guard`);
  assert.match(source, /APPrintGuard\.prepare/, `${relativePath} should run preflight before printing`);
}

console.log('archive print preflight tests passed');
