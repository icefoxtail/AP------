'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseIndex, selectEntries } = require('../tools/4slot/existing-vector-svg-index-continuity.cjs');

const prefix = "(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
const suffix = ");\n}(typeof window !== 'undefined' ? window : globalThis));\n";
const ref = { path: 'archive/assets/images/공개/q7.svg' };
const record = (assetRef = 'assets/images/공개/q7.svg', visualRole = 'problem', extra = {}) => ({
  assetRef, visualRole, titleKo: '공개 도형', descriptionKo: '원본에 표시된 선과 점',
  provenanceStatus: 'SOURCE_BOUND', answerHintFree: true, sourceExamRef: 'public-bank',
  sourceQid: 'public-seven', svgSha256: 'a'.repeat(64), gitBlobSha: 'b'.repeat(40), ...extra
});
const doc = records => ({ schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1', sourceIndexSha256: 'sha256:' + 'c'.repeat(64),
  manifestSha256: 'sha256:' + 'd'.repeat(64), buildScope: { scopeMode: 'EXPLICIT_BASE' }, records });
const encode = value => Buffer.from(prefix + JSON.stringify(value) + suffix);

test('selects percent-encoded runtime aliases and preserves whole records for both roles', () => {
  const first = record('assets/images/%EA%B3%B5%EA%B0%9C/q7.svg', 'problem', { extraProvenance: { ordinal: 7 } });
  const second = record('/archive/assets/images/공개/q7.svg', 'solution');
  const parsed = parseIndex(encode(doc([second, record('assets/images/unrelated.svg'), first])));
  const selected = selectEntries(parsed, [ref]);
  assert.equal(selected.length, 2);
  assert(selected.includes(parsed.records[0]) && selected.includes(parsed.records[2]));
  assert.deepEqual(selected.find(row => row.visualRole === 'problem').extraProvenance, { ordinal: 7 });
});

test('rejects a normalized key and role duplicate even outside the selected cohort', () => {
  const rows = [record(), record('assets/images/unrelated.svg'), record('/archive/assets/images/unrelated.svg')];
  assert.throws(() => parseIndex(encode(doc(rows))), /RUNTIME_LOOKUP_REJECTED/);
});

test('revalidates the whole runtime lookup when a parsed object changes', () => {
  const parsed = parseIndex(encode(doc([record()])));
  parsed.records.push(record('archive/assets/images/공개/q7.svg'));
  assert.throws(() => selectEntries(parsed, [ref]), /RUNTIME_LOOKUP_REJECTED/);
});

test('permits two distinct roles but rejects equivalent encoded paths for the same role', () => {
  assert.equal(selectEntries(parseIndex(encode(doc([record(), record(undefined, 'solution')]))), [ref]).length, 2);
  assert.throws(() => parseIndex(encode(doc([record(), record('assets/images/%EA%B3%B5%EA%B0%9C/q7.svg')]))), /RUNTIME_LOOKUP_REJECTED/);
});

test('ignores unrelated records while every selected record field affects equality', () => {
  const baseline = parseIndex(encode(doc([record(), record('assets/images/unrelated.svg')])));
  const unrelated = structuredClone(baseline);unrelated.records[1].descriptionKo = '다른 문항의 표시';
  assert.deepEqual(selectEntries(baseline, [ref]), selectEntries(unrelated, [ref]));
  for (const field of ['descriptionKo', 'sourceQid', 'svgSha256', 'answerHintFree', 'provenanceStatus']) {
    const changed = structuredClone(baseline);changed.records[0][field] = field === 'answerHintFree' ? false : 'changed';
    assert.notDeepEqual(selectEntries(baseline, [ref]), selectEntries(changed, [ref]), field);
  }
});

test('preserves empty lookup footprints and detects introduction or removal of a consumed role', () => {
  const empty = parseIndex(encode(doc([record('assets/images/unrelated.svg')])));
  assert.deepEqual(selectEntries(empty, [ref]), []);
  const added = structuredClone(empty);added.records.push(record());
  assert.notDeepEqual(selectEntries(empty, [ref]), selectEntries(added, [ref]));
});

test('sorts selected whole records deterministically and does not mutate the index', () => {
  const value = parseIndex(encode(doc([record(undefined, 'solution'), record()])));
  const before = JSON.stringify(value);
  const a = selectEntries(value, [ref]), b = selectEntries({ ...value, records: [...value.records].reverse() }, [ref, ref]);
  assert.deepEqual(a, b);assert.equal(JSON.stringify(value), before);
});

test('rejects executable wrappers and trailing statements without evaluating them', () => {
  const value = encode(doc([record()]));
  for (const raw of [Buffer.concat([value, Buffer.from('globalThis.__bad = true;')]),
    Buffer.from(value.toString().replace('Object.freeze(', 'runArbitraryCode(')), Buffer.from('globalThis.__bad=true;')]) {
    assert.throws(() => parseIndex(raw), /WRAPPER/);
  }
  assert.equal(globalThis.__bad, undefined);
});

test('rejects malformed JSON, schema drift and unsupported immutable asset paths', () => {
  assert.throws(() => parseIndex(Buffer.from(prefix + '{bad}' + suffix)), /JSON/);
  const bad = doc([record()]);bad.schemaVersion = 'unexpected';assert.throws(() => parseIndex(encode(bad)), /SCHEMA/);
  const value = parseIndex(encode(doc([record()])));
  for (const p of ['assets/images/공개/q7.svg', 'archive/archive/assets/images/q7.svg',
    'archive/assets/../q7.svg', 'archive/assets/images/q7.svg#fragment', 'https://example.test/q7.svg']) {
    assert.throws(() => selectEntries(value, [{ path: p }]), /ASSET_PATH/);
  }
  assert.throws(() => selectEntries(value, []), /ASSET_REFS/);
});
