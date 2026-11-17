'use strict';

// A comparison primitive for a separately closed, immutable UI contract.
// It grants no registration or review authority and never ignores a caller's
// source, asset, bank, metadata, identity or whole-file provenance checks.
const SvgAccessibility = require('../../archive/svg-accessibility.js');

const BASE_URL = 'https://svg-accessibility.invalid/archive/engine.html';
const INDEX_SCHEMA = 'SVG_STUDENT_ACCESSIBILITY_V1';
const PREFIX = "(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
const SUFFIX = ");\n}(typeof window !== 'undefined' ? window : globalThis));\n";
const TOP_KEYS = ['schemaVersion', 'sourceIndexSha256', 'manifestSha256', 'buildScope', 'records'];
const HASH = /^sha256:[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, row) => row && typeof row === 'object' && !Array.isArray(row)
  ? Object.fromEntries(Object.keys(row).sort().map(key => [key, row[key]])) : row);
const object = value => value && typeof value === 'object' && !Array.isArray(value);

function fail(code) { throw new Error('EXISTING_VECTOR_SVG_INDEX_' + code); }

function validateIndex(indexDoc) {
  if (!object(indexDoc) || stable(Object.keys(indexDoc).sort()) !== stable(TOP_KEYS.slice().sort()) ||
      indexDoc.schemaVersion !== INDEX_SCHEMA || !HASH.test(indexDoc.sourceIndexSha256 || '') ||
      !HASH.test(indexDoc.manifestSha256 || '') || !object(indexDoc.buildScope) ||
      !Array.isArray(indexDoc.records) || indexDoc.records.some(record => !object(record))) fail('SCHEMA');

  // Use the actual student runtime over the entire index, including unselected
  // entries. It rejects duplicates by normalized asset key plus visual role.
  // Validating only a filtered subset would miss a conflicting global lookup.
  try { SvgAccessibility.createResolver(indexDoc.records, { baseUrl: BASE_URL }); }
  catch { fail('RUNTIME_LOOKUP_REJECTED'); }
  return indexDoc.records;
}

function parseIndex(raw) {
  if (!Buffer.isBuffer(raw) || raw.length === 0) fail('BYTES');
  const text = raw.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(raw) || !text.startsWith(PREFIX) || !text.endsWith(SUFFIX)) fail('WRAPPER');
  let indexDoc;
  try { indexDoc = JSON.parse(text.slice(PREFIX.length, -SUFFIX.length)); }
  catch { fail('JSON'); }
  validateIndex(indexDoc);
  return indexDoc;
}

function selectEntries(indexDoc, assetRefs) {
  const records = validateIndex(indexDoc);
  if (!Array.isArray(assetRefs) || !assetRefs.length) fail('ASSET_REFS');
  const keys = new Set();
  for (const ref of assetRefs) {
    const p = ref && ref.path;
    if (typeof p !== 'string' || !p.startsWith('archive/assets/') || /[\\\x00-\x1f\x7f?#]/.test(p) ||
        p.split('/').some(part => !part || part === '.' || part === '..')) fail('ASSET_PATH');
    // A Git path starts at the repository root. Remove this prefix exactly
    // once before resolving it against the real archive/engine.html location.
    const key = SvgAccessibility.normalizeAssetRef(p.slice('archive/'.length), BASE_URL);
    if (!key) fail('ASSET_KEY');
    keys.add(key);
  }
  // Retain both roles and every own field. The solution fallback can consume a
  // problem record, and role/name/provenance changes must change the footprint.
  const selected = records.filter(record => ['problem', 'solution'].includes(record.visualRole) &&
    keys.has(SvgAccessibility.normalizeAssetRef(record.assetRef, BASE_URL)));
  return selected.slice().sort((left, right) => {
    const a = stable(left), b = stable(right);
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

module.exports = { BASE_URL, INDEX_SCHEMA, parseIndex, selectEntries };
