const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  findRefs, assertLoads, assertLoadedBefore, versionOf, assertNoMixedVersions,
} = require('./helpers/html-asset-refs.cjs');

const page = `
<!-- <script src="old.js?v=1"></script> -->
<link rel="stylesheet" href="./a.css?v=20261122-x">
<script src="data/index.js"></script>
<script src='../archive/b.js?v=abc123def456' defer></script>
<script src="https://cdn.example/lib.js?v=1"></script>
`;

test('a page loads a file with or without ?v=, in any directory form', () => {
  assertLoads(page, 'a.css', 'page');
  assertLoads(page, 'index.js', 'page');
  assertLoads(page, 'data/index.js', 'page');
  assertLoads(page, 'b.js', 'page');
  assert.equal(versionOf(page, 'b.js'), 'v=abc123def456');
  assert.equal(versionOf(page, 'index.js'), '');
});

test('a file the page does not load, or only mentions in a comment, fails', () => {
  assert.throws(() => assertLoads(page, 'old.js', 'page'), /should load old\.js/);
  assert.throws(() => assertLoads(page, 'ex.js', 'page'), /should load ex\.js/);
  assert.equal(findRefs(page, 'a.css', { tag: 'script' }).length, 0);
});

test('the same file with two different ?v= values is a defect; identical repeats are not', () => {
  assert.throws(() => assertLoads('<script src="x.js?v=1"></script><script src="x.js?v=2"></script>', 'x.js', 'p'), /different \?v= values/);
  assertLoads('<script src="x.js?v=1"></script><script src="x.js?v=1"></script>', 'x.js', 'p');
  assert.throws(() => assertNoMixedVersions('<script src="x.js?v=1"></script><link href="x.js"></link>', 'p'), /different \?v= values/);
  assertNoMixedVersions(page, 'page');
});

test('load order is checked from the document position', () => {
  assertLoadedBefore(page, 'a.css', 'b.js', 'page');
  assert.throws(() => assertLoadedBefore(page, 'b.js', 'a.css', 'page'), /before/);
});
