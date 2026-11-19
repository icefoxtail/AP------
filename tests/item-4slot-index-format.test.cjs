'use strict';
// archive/data/item-4slot-index.json is stored one row per line so a registration that changes a few rows changes a few lines
// in git. This checks the format (defects only, no operating counts): the committed file is exactly what the one writer
// function produces from its own parsed content, and a one-row change touches one line.
const { test } = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { item4SlotIndexText, INDEX_PATH } = require('../tools/4slot/item-4slot-index-format.cjs');
const root = path.resolve(__dirname, '..');

const sample = () => ({
  schemaVersion: 'archive-item-4slot-runtime-v1', builderSha256: 'a'.repeat(64), sourceMutation: 0,
  counts: { files: 2, records: 3 },
  files: [{ path: 'a', n: 1 }, { path: 'b', note: 'line\nbreak "q" 한글' }],
  records: [{ questionUid: 'u1', method: [1, 2] }, { questionUid: 'u2', method: [] }, { questionUid: 'u3', x: null }],
  pending: [],
  terms: { v1: [{ id: 1, ko: 'x' }], v2: [{ id: 2, ko: 'y' }] },
  inputDigest: 'b'.repeat(64)
});
const lineSet = text => { const m = new Map(); for (const l of text.split('\n')) m.set(l, (m.get(l) || 0) + 1); return m; };
function changedLines(a, b) { // lines of b that are not in a (multiset), i.e. what git would show as added
  const have = lineSet(a); let n = 0;
  for (const l of b.split('\n')) { const c = have.get(l) || 0; if (c) have.set(l, c - 1); else n++; }
  return n;
}

test('the text form parses back to the same object with the same key order', () => {
  const doc = sample(), text = item4SlotIndexText(doc);
  assert.equal(JSON.stringify(JSON.parse(text)), JSON.stringify(doc));
  assert.deepEqual(Object.keys(JSON.parse(text)), Object.keys(doc));
  assert(text.endsWith('}\n') && !text.endsWith('\n\n') && !text.includes('\r') && text.charCodeAt(0) !== 0xFEFF);
  assert.equal(item4SlotIndexText(JSON.parse(text)), text, 'stable under parse and write again');
});

test('every row and every terms version sits on one line; empty and scalar values stay inline', () => {
  const text = item4SlotIndexText(sample()), lines = text.split('\n');
  for (const needle of ['"path":"a"', '"questionUid":"u2"', '"v2":']) assert.equal(lines.filter(l => l.includes(needle)).length, 1, needle);
  assert(lines.includes('  "pending": [],'));
  assert(lines.includes('  "counts": {"files":2,"records":3},'));
  assert(lines.every(l => !/^\s*$/.test(l) || l === ''));
});

test('changing one row changes exactly one line', () => {
  const a = sample(), b = sample();
  b.records[1].method = [3];
  assert.equal(changedLines(item4SlotIndexText(a), item4SlotIndexText(b)), 1);
  const c = sample(); c.files.push({ path: 'c' }); c.counts.files = 3;
  assert.equal(changedLines(item4SlotIndexText(a), item4SlotIndexText(c)), 3, 'one new row plus its counts line plus the comma on the row above');
});

test('the committed index is exactly the writer function applied to its own content', () => {
  const full = path.join(root, INDEX_PATH);
  if (!fs.existsSync(full)) return;
  const raw = fs.readFileSync(full);
  assert.notEqual(raw[0], 0xEF, 'no BOM');
  const text = raw.toString('utf8');
  assert(!text.includes('\r'), 'LF only');
  const doc = JSON.parse(text);
  // assert.ok, not assert.equal: a failing equal would print two 20 MB strings.
  assert.ok(item4SlotIndexText(doc) === text, 'index is not in the row-per-line form: run node tools/4slot/build-4slot-runtime.cjs --write (or item-4slot-index-format.cjs --write)');
  assert(text.split('\n').length > doc.records.length, 'one record per line');
});
