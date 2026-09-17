import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const candidate = read('archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother-final-candidate.json');
const source = read('archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/source_manifest.json');
const master = read('docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');

function key(labels) {
  return [labels.L1, labels.L2, labels.L3, labels.L4].join('|');
}

const masterKeys = new Set();
for (const record of master.records || []) {
  for (const concept of record.concepts || []) {
    for (const problemType of concept.problemTypes || []) {
      masterKeys.add(key({ L1: record.majorUnit, L2: record.midUnit, L3: concept.concept, L4: problemType.problemType }));
    }
  }
}

test('HIGH1 Mother final candidate closes identity, Mother, and canonical gates', () => {
  assert.equal(candidate.scope, 'HIGH1_ONLY');
  assert.equal(candidate.expectedCount, source.records.length);
  assert.equal(candidate.expectedCount, 2498);
  assert.equal(candidate.aCount, 2498);
  assert.equal(candidate.bCount, 2498);
  assert.equal(candidate.finalizedDisagreementCount, 2277);
  assert.equal(candidate.unresolvedDisagreementCount, 0);
  assert.equal(candidate.errors.length, 0);
  assert.equal(candidate.readyForGate, true);
  assert.equal(candidate.canonicalCounts.CANONICAL_PATH_MATCH, 2193);
  assert.equal(candidate.canonicalCounts.EXPLICIT_NO_FIT_OR_UNKNOWN, 305);
  assert.equal(candidate.canonicalCounts.CANONICAL_PATH_UNMATCHED || 0, 0);
  assert.equal(candidate.records.length, 2498);
  assert.equal(new Set(candidate.records.map(record => record.recordIndex)).size, 2498);
  assert.equal(new Set(candidate.records.map(record => record.manifestUid)).size, 2498);
});

test('every final canonical match resolves to the current RPM master', () => {
  for (const record of candidate.records) {
    if (record.final.canonicalState !== 'CANONICAL_PATH_MATCH') continue;
    assert.ok(masterKeys.has(key(record.final.canonical)), `record ${record.recordIndex} has a non-master final path`);
  }
});

test('every final record has a recognized primary L1, including explicit no-fit records', () => {
  const primaryL1 = new Set((master.records || []).map(record => record.majorUnit));
  for (const record of candidate.records) {
    assert.ok(primaryL1.has(record.final.canonical.L1), `record ${record.recordIndex} has no recognized L1`);
  }
});

test('raw Mother canonical values remain auditable after resolution', () => {
  for (const record of candidate.records) {
    assert.deepEqual(Object.keys(record.final.canonicalRaw).sort(), ['L1', 'L2', 'L3', 'L4']);
    assert.equal(typeof record.final.canonicalResolution, 'string');
  }
});
