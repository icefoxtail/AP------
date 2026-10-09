import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildApprovedSubunitAppendV1, buildTagMasterV1, mergeApprovedSubunitRows } from './build-tag-master-v1.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const compiledMasterPath = path.join(repoRoot, 'archive/data/master_tables/js_archive_tag_master.json');

test('full tag master compiler resolves the canonical document path and keeps old provenance references', () => {
  const currentMaster = JSON.parse(fs.readFileSync(compiledMasterPath, 'utf8'));
  const compiled = buildTagMasterV1();

  assert.equal(compiled.sourceDocument, 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md');
  const compiledByIdentity = new Map(compiled.master.map(row => [`${row.keyType}:${row.key}`, row]));
  for (const row of currentMaster) {
    assert.equal(compiledByIdentity.get(`${row.keyType}:${row.key}`)?.sourceUrlOrPath, row.sourceUrlOrPath);
  }
});

test('ROOT append-only compilation preserves all existing rows/order and adds only four R1-authorized child/concept pairs', () => {
  const beforeBytes = fs.readFileSync(compiledMasterPath);
  const baselinePath = path.join(repoRoot, 'archive/analysis/h2-intake-batch01-20261009/technical-subunit-authority-recovery/baseline/tag-master.before.json');
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const compiled = buildApprovedSubunitAppendV1();
  const subUnitKeys = [
    'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION',
    'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',
    'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION',
    'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH',
  ];
  const conceptKeys = [
    'EXPONENTIAL_FUNCTION_APPLICATION',
    'EXPONENTIAL_FUNCTION_GRAPH',
    'LOGARITHMIC_FUNCTION_APPLICATION',
    'LOGARITHMIC_FUNCTION_GRAPH',
  ];
  assert.deepEqual(compiled.master.slice(0, baseline.length), baseline);
  assert.deepEqual(compiled.master.slice(baseline.length).map(row => `${row.keyType}:${row.key}`).sort(), [
    ...subUnitKeys.map(key => `subUnitKey:${key}`),
    ...conceptKeys.map(key => `conceptClusterKey:${key}`),
  ].sort());
  assert.equal(compiled.appendOnlyRegistration.preservedExistingMasterRowCount, baseline.length);
  assert.equal(compiled.appendOnlyRegistration.appendedCompiledRecordCount, 8);
  assert.equal(compiled.appendOnlyRegistration.nonTargetRowsAndOrderPreserved, true);
  assert.equal(compiled.appendOnlyRegistration.perExamQidClassificationChanged, false);
  for (const row of compiled.master.slice(baseline.length)) assert.equal(row.sourceUrlOrPath, 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md');
  assert.deepEqual(fs.readFileSync(compiledMasterPath), beforeBytes, 'build-only path must not write the compiled master');
});

test('append-only merge rejects changed parents, missing approved rows, and any extra new row', () => {
  const definition = { standardUnitKey: 'H15-M1-03', standardUnit: '지수함수', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', subUnit: '지수함수의 그래프', conceptClusterKey: 'EXPONENTIAL_FUNCTION_GRAPH' };
  const parent = { key: 'H15-M1-03', keyType: 'standardUnitKey', labelKo: '지수함수', status: 'active' };
  const subUnit = { key: definition.subUnitKey, keyType: 'subUnitKey', labelKo: definition.subUnit, parentKey: definition.standardUnitKey, standardUnitKey: definition.standardUnitKey, subUnitKey: definition.subUnitKey, subUnit: definition.subUnit, conceptClusterKey: definition.conceptClusterKey, status: 'active', sourceUrlOrPath: 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md' };
  const concept = { key: definition.conceptClusterKey, keyType: 'conceptClusterKey', labelKo: definition.subUnit, parentKey: definition.subUnitKey, standardUnitKey: definition.standardUnitKey, subUnitKey: definition.subUnitKey, conceptClusterKey: definition.conceptClusterKey, status: 'active', sourceUrlOrPath: 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md' };
  const prior = [parent];
  assert.deepEqual(mergeApprovedSubunitRows(prior, [...prior, subUnit, concept], [definition]), [...prior, concept, subUnit]);
  assert.throws(() => mergeApprovedSubunitRows(prior, [...prior, { ...subUnit, parentKey: 'H15-M1-04' }, concept], [definition]), /APPROVED_SUBUNIT_GENERATED_ROW_MISMATCH/);
  assert.throws(() => mergeApprovedSubunitRows(prior, [...prior, subUnit], [definition]), /APPROVED_SUBUNIT_GENERATED_ROW_MISSING/);
  assert.throws(() => mergeApprovedSubunitRows(prior, [...prior, subUnit, concept, { key: 'UNAPPROVED', keyType: 'subUnitKey' }], [definition]), /TAG_MASTER_UNAPPROVED_INSERTION/);
});
