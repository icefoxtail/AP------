'use strict';
// Guard: build_db.py registers only exam JS under PRODUCTION_EXAM_ROOTS
// (original / similar / types). An exam JS placed anywhere else (for example
// directly in archive/exams/) is never registered and is invisible in Archive 2.0.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const examsDir = path.resolve(__dirname, '..', 'archive', 'exams');
const ALLOWED_TOP_LEVEL = new Set(['original', 'similar', 'types', 'textbooks', 'test-fixtures']);

function walkJs(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, out);
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

const rel = (p) => path.relative(examsDir, p).split(path.sep).join('/');

test('no exam .js sits directly in archive/exams/', () => {
  const stray = fs.readdirSync(examsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => entry.name);
  assert.deepEqual(stray, [], `exam JS must live under original/similar/types, not archive/exams/ root: ${stray.join(', ')}`);
});

test('no .js under an unrecognised top-level folder of archive/exams/', () => {
  const misplaced = [];
  for (const entry of fs.readdirSync(examsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || ALLOWED_TOP_LEVEL.has(entry.name)) continue;
    for (const file of walkJs(path.join(examsDir, entry.name), [])) misplaced.push(rel(file));
  }
  assert.deepEqual(
    misplaced,
    [],
    `allowed top-level folders: ${[...ALLOWED_TOP_LEVEL].join(', ')}; misplaced: ${misplaced.join(', ')}`,
  );
});
