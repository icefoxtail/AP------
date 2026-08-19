const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const optimizer = require(path.join(root, 'archive', 'print_math_optimizer.js'));

test('math optimizer targets a compact 192dpi atlas', () => {
  assert.equal(optimizer.DEFAULT_PRINT_DPI, 192);
  assert.equal(optimizer.captureScaleForDpi(192), 2);
});

test('math atlas packer deduplicates rendering space into bounded batches', () => {
  const entries = Array.from({ length: 20 }, (_, index) => ({
    key: `formula-${index}`,
    width: 180,
    height: 42,
    source: {}
  }));
  const batches = optimizer.packEntries(entries, { atlasWidth: 500, atlasHeight: 220 });
  assert.ok(batches.length > 1);
  assert.equal(batches.reduce((sum, batch) => sum + batch.placements.length, 0), entries.length);
  assert.ok(batches.every(batch => batch.height <= 220));
});

test('math optimizer caches atlases and restores original MathJax nodes', () => {
  const source = fs.readFileSync(path.join(root, 'archive', 'print_math_optimizer.js'), 'utf8');
  assert.match(source, /const atlasCache = new Map\(\)/);
  assert.match(source, /const pendingAtlases = new Map\(\)/);
  assert.match(source, /querySelectorAll\?\.\('mjx-container'\)/);
  assert.match(source, /replacement\.replaceWith\(original\)/);
  assert.match(source, /global\.URL\.revokeObjectURL\(url\)/);
});
