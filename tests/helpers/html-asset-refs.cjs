'use strict';
// Shared checks for "this HTML page loads that script/stylesheet".
//
// Why this exists (2026-11-22): tests used to pin the literal `?v=20261122-…` text of each reference, so every screen
// PR that touched a file had to bump the `?v=` in the page and in these tests, and parallel PRs collided on that one
// line. The deployed Pages build now stamps the `?v=` of local script/link addresses with a hash of the file's bytes
// (tools/lib/stamp-html-versions.mjs), so a literal version is a changing value, not a defect condition.
// What stays a defect: the page does not load the file at all, loads it twice with different `?v=` values (the
// browser would keep two copies), or loads files in the wrong order. Those are what these helpers check.
//
// A reference is a `<script src>` or `<link href>` whose path (query and #fragment removed, leading ./ removed)
// equals `file` or ends with `/` + `file`. `file` may carry directories ('data/svg-accessibility-index.js') to tell
// apart same-named files. Text inside HTML comments is ignored.
const assert = require('node:assert');

const TAG = /<(script|link)\b([^>]*)>/gi;
const ATTR = { script: /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i, link: /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i };

function stripComments(html) { return String(html).replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length)); }

function splitAddress(address) {
  const noFragment = address.split('#')[0];
  const at = noFragment.indexOf('?');
  const pathPart = at >= 0 ? noFragment.slice(0, at) : noFragment;
  return { path: pathPart.replace(/^\.\//, ''), query: at >= 0 ? noFragment.slice(at + 1) : '' };
}

// All references to `file` in `html`: [{ tag, address, path, query, index }] in document order.
function findRefs(html, file, { tag } = {}) {
  const text = stripComments(html);
  const refs = [];
  for (const match of text.matchAll(TAG)) {
    const kind = match[1].toLowerCase();
    if (tag && kind !== tag) continue;
    const attribute = ATTR[kind].exec(match[2]);
    if (!attribute) continue;
    const address = attribute[1] ?? attribute[2];
    const { path, query } = splitAddress(address);
    if (path === file || path.endsWith('/' + file)) refs.push({ tag: kind, address, path, query, index: match.index });
  }
  return refs;
}

// The page loads `file` (with or without ?v=) and never with two different queries. Returns the references.
function assertLoads(html, file, label = 'page', options = {}) {
  const refs = findRefs(html, file, options);
  assert.ok(refs.length > 0, `${label} should load ${file}`);
  const queries = new Set(refs.map((ref) => ref.query));
  assert.ok(queries.size === 1, `${label} loads ${file} with different ?v= values: ${[...queries].map((q) => q || '(none)').join(' | ')}`);
  return refs;
}

function assertLoadsAll(html, files, label = 'page', options = {}) {
  for (const file of files) assertLoads(html, file, label, options);
}

// Document position of the (first) reference to `file`; fails when the page does not load it.
function loadIndex(html, file, label = 'page', options = {}) {
  return assertLoads(html, file, label, options)[0].index;
}

// `first` is loaded before `second` (ordering only; versions are not compared).
function assertLoadedBefore(html, first, second, label = 'page', options = {}) {
  assert.ok(loadIndex(html, first, label, options) < loadIndex(html, second, label, options), `${label} should load ${first} before ${second}`);
}

// The ?v= query a page uses for `file` ('' when none), for "same version in both places" consistency checks.
function versionOf(html, file, label = 'page', options = {}) {
  return assertLoads(html, file, label, options)[0].query;
}

// No two references in the page point at the same file with different ?v= values (local script/link only).
function assertNoMixedVersions(html, label = 'page') {
  const byPath = new Map();
  for (const match of stripComments(html).matchAll(TAG)) {
    const kind = match[1].toLowerCase();
    const attribute = ATTR[kind].exec(match[2]);
    if (!attribute) continue;
    const address = attribute[1] ?? attribute[2];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(address)) continue;
    const { path, query } = splitAddress(address);
    if (!/\.(?:m?js|css)$/i.test(path)) continue;
    if (!byPath.has(path)) byPath.set(path, new Set());
    byPath.get(path).add(query);
  }
  const mixed = [...byPath].filter(([, queries]) => queries.size > 1).map(([file, queries]) => `${file}: ${[...queries].join(' | ')}`);
  assert.deepStrictEqual(mixed, [], `${label} loads a file with different ?v= values:\n${mixed.join('\n')}`);
}

module.exports = { findRefs, assertLoads, assertLoadsAll, loadIndex, assertLoadedBefore, versionOf, assertNoMixedVersions };
