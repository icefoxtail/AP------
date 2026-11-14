import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import { buildDecisionIsolatedInput, questionUidForSource, resolveMetaRoute } from './rpm-active-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const registry = loadActiveMetaRegistry(root);
const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json';
const crosswalk = JSON.parse(fs.readFileSync(path.join(root, crosswalkPath), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));

function inputFor(row) {
  const sourceArchiveFile = 'original/middle/m1/2mid/crosswalk-selection-fixture.js';
  return {
    sourceIdentity: {
      sourceArchiveFile, questionUid: questionUidForSource(sourceArchiveFile, 1), sourceOrdinal: 1,
      contentHash: objectSha('source fixture'), choicesHash: objectSha([]), imageRefHash: objectSha(''),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha('verified fixture') },
    curriculumContext: {
      grade: 'M1', curriculum: row.curriculum, scope: row.scope, standardCourse: '중1 수학',
      standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey,
    },
    semanticDecision: {
      primaryMethod: '검토된 RPM leaf를 고정한다.', decisiveStep: '해당 문항의 정확한 호환 연결을 선택한다.',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
  };
}

function fixture(t, id) {
  const original = clone(crosswalk.records.find(row => row.id === id));
  assert.ok(original, id);
  const input = inputFor(original);
  const baseline = resolveMetaRoute(input, { repoRoot: root, registry });
  assert.equal(baseline.semanticStatus, 'FINAL');
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rpm-add-only-selection-'));
  t.after(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }));
  for (const { path: relative } of baseline.authorityRefs) {
    const destination = path.join(fixtureRoot, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, relative), destination);
  }
  const rows = [clone(original)];
  const fixtureRegistry = {
    ...registry, bindingRows: clone(registry.bindingRows),
    problemTypes: new Map(registry.problemTypes), templates: new Map(registry.templates),
  };
  function bind(problemTypeKey) {
    fixtureRegistry.bindingRows = fixtureRegistry.bindingRows.filter(row => !(row.curriculum === original.curriculum
      && row.standardUnitKey === original.standardUnitKey && row.subUnitKey === original.subUnitKey
      && row.problemTypeKey === problemTypeKey));
    fixtureRegistry.bindingRows.push({
      problemTypeKey, curriculum: original.curriculum, standardUnitKey: original.standardUnitKey,
      subUnitKey: original.subUnitKey, standardCourse: input.curriculumContext.standardCourse,
      status: 'ACTIVE', ownerPack: 'MIDDLE1',
    });
  }
  function select(row, templateKey = row.templateKey) {
    input.familyTemplateSelection = {
      stage: 'POST_CROSSWALK', inputBundleSha: buildDecisionIsolatedInput(input).inputBundleSha,
      crosswalkRecordId: row.id, templateKey, decisiveStepReason: '고정한 문항의 검토 근거에 맞는 행과 template을 선택했다.',
    };
  }
  function resolve() {
    fs.writeFileSync(path.join(fixtureRoot, crosswalkPath), JSON.stringify({ ...crosswalk, records: rows }));
    return resolveMetaRoute(input, { repoRoot: fixtureRoot, registry: fixtureRegistry });
  }
  return { original, input, rows, fixtureRegistry, bind, select, resolve };
}

function bindingPromotion(row) {
  return {
    ...clone(row), id: `${row.id}-BINDING-TEST`, standardCourse: '중1 수학',
    mappingStatus: 'DIRECT_ACTIVE', bindingStatus: 'ACTIVE', promotesBindingGapRowId: row.id,
    binding: { curriculum: row.curriculum, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, ownerPack: 'MIDDLE1' },
  };
}

for (const id of ['M1-RPM-173', 'M1-RPM-179']) {
  test(`${id}: add-only same-method binding repair requires an exact post-lookup decision`, t => {
    const f = fixture(t, id);
    assert.equal(f.original.mappingStatus, 'DIRECT_BINDING_GAP');
    const promoted = bindingPromotion(f.original);
    f.rows.push(promoted); f.bind(promoted.problemTypeKey);
    assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
    f.select(promoted);
    const selected = f.resolve();
    assert.equal(selected.projectionStatus, 'PROJECTION_REUSE');
    assert.equal(selected.crosswalkRecordId, promoted.id);
    assert.equal(selected.problemTypeKey, f.original.problemTypeKey);
    assert.equal(selected.templateKey, f.original.templateKey);
    assert.deepEqual(f.rows[0], f.original);
    f.input.familyTemplateSelection.inputBundleSha = 'stale-hash';
    assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
    f.select(promoted); f.input.familyTemplateSelection.templateKey = 'TPL_NOT_LISTED';
    assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
  });
}

test('binding-gap promotion cannot replace a different method, link, native binding or inactive row', t => {
  const f = fixture(t, 'M1-RPM-173');
  const valid = bindingPromotion(f.original);
  f.bind(valid.problemTypeKey);
  for (const [label, mutate] of [
    ['wrong predecessor', row => { row.promotesBindingGapRowId = 'unrelated-id'; }],
    ['wrong PT', row => { row.problemTypeKey = 'PT_M1_SEGMENT_LENGTH_RELATIONS'; }],
    ['wrong TPL', row => { row.templateKey = 'TPL_M1_SEGMENT_LENGTH_RELATIONS_RATIO_AND_MIDPOINT'; }],
    ['binding context override', row => { row.binding.subUnitKey = 'M1-05-POSITION_RELATION'; }],
    ['inactive declaration', row => { row.bindingStatus = 'MISSING'; }],
  ]) {
    const row = clone(valid); mutate(row); f.rows.splice(1, f.rows.length, row); f.select(row);
    assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_COMPATIBILITY_ROW_AMBIGUOUS', label);
  }
  f.rows.splice(1, f.rows.length, clone(valid)); f.select(valid);
  const template = f.fixtureRegistry.templates.get(valid.templateKey);
  f.fixtureRegistry.templates.set(valid.templateKey, { ...template, status: 'INACTIVE' });
  assert.equal(f.resolve().projectionReasonCode, 'ACTIVE_TEMPLATE_PROJECTION_NOT_MATERIALIZED');
  assert.deepEqual(f.rows[0], f.original);
});

function mixedFixture(t) {
  const f = fixture(t, 'M1-RPM-175');
  assert.equal(f.original.mappingStatus, 'FAMILY_ACTIVE');
  // Synthetic machine keys exercise the new row-selection contract without editing production taxonomy.
  const problemTypeKey = 'PT_FIXTURE_ADJACENT_ANGLE_DIVISION';
  const templateKey = 'TPL_FIXTURE_ADJACENT_ANGLE_DIVISION';
  f.fixtureRegistry.problemTypes.set(problemTypeKey, { problemTypeKey, ownerPack: 'MIDDLE1', status: 'ACTIVE' });
  f.fixtureRegistry.templates.set(templateKey, { templateKey, parentProblemTypeKey: problemTypeKey, ownerPack: 'MIDDLE1', status: 'ACTIVE' });
  const direct = {
    id: `${f.original.id}-ADJACENT-TEST`, curriculum: f.original.curriculum, scope: f.original.scope,
    rpmPath: clone(f.original.rpmPath), standardUnitKey: f.original.standardUnitKey, subUnitKey: f.original.subUnitKey,
    standardCourse: '중1 수학', mappingStatus: 'DIRECT_ACTIVE', bindingStatus: 'ACTIVE',
    problemTypeKey, templateKey, ownerPack: 'MIDDLE1',
  };
  f.rows.push(direct); f.bind(direct.problemTypeKey); f.bind(f.original.problemTypeKey);
  return { ...f, direct };
}

test('mixed ACTIVE family/direct rows preserve both methods and require a row-local template decision', t => {
  const f = mixedFixture(t);
  const familyTemplate = f.original.templateCandidates[0].templateKey;
  assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
  for (const [row, templateKey] of [[f.original, familyTemplate], [f.direct, f.direct.templateKey]]) {
    f.select(row, templateKey);
    const selected = f.resolve();
    assert.equal(selected.projectionStatus, 'PROJECTION_REUSE');
    assert.equal(selected.crosswalkRecordId, row.id);
    assert.equal(selected.problemTypeKey, row.problemTypeKey);
    assert.equal(selected.templateKey, templateKey);
  }
  for (const [row, wrongTemplate] of [[f.original, f.direct.templateKey], [f.direct, familyTemplate]]) {
    f.select(row, wrongTemplate);
    assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
  }
  f.select(f.direct); f.input.familyTemplateSelection.inputBundleSha = 'stale-hash';
  assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
  f.select(f.direct); f.input.familyTemplateSelection.stage = 'PRE_CROSSWALK';
  assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_ROW_SELECTION_PENDING');
  assert.deepEqual(f.rows[0], f.original);
});

test('mixed-row selection still rejects wrong template parent, inactive keys and missing exact binding', t => {
  const f = mixedFixture(t);
  f.select(f.direct);
  const template = f.fixtureRegistry.templates.get(f.direct.templateKey);
  f.fixtureRegistry.templates.set(f.direct.templateKey, { ...template, parentProblemTypeKey: f.original.problemTypeKey });
  assert.equal(f.resolve().projectionReasonCode, 'ACTIVE_TEMPLATE_PROJECTION_NOT_MATERIALIZED');
  f.fixtureRegistry.templates.set(f.direct.templateKey, { ...template, status: 'INACTIVE' });
  assert.equal(f.resolve().projectionReasonCode, 'ACTIVE_TEMPLATE_PROJECTION_NOT_MATERIALIZED');
  f.fixtureRegistry.templates.set(f.direct.templateKey, template);
  const problemType = f.fixtureRegistry.problemTypes.get(f.direct.problemTypeKey);
  f.fixtureRegistry.problemTypes.set(f.direct.problemTypeKey, { ...problemType, status: 'INACTIVE' });
  assert.equal(f.resolve().projectionReasonCode, 'ACTIVE_PROBLEM_TYPE_PROJECTION_NOT_MATERIALIZED');
  f.fixtureRegistry.problemTypes.set(f.direct.problemTypeKey, problemType);
  f.fixtureRegistry.bindingRows = f.fixtureRegistry.bindingRows.filter(row => row.problemTypeKey !== f.direct.problemTypeKey);
  assert.equal(f.resolve().projectionReasonCode, 'EXACT_ACTIVE_BINDING_PENDING');
  f.direct.bindingStatus = 'MISSING';
  assert.equal(f.resolve().projectionReasonCode, 'CROSSWALK_COMPATIBILITY_ROW_AMBIGUOUS');
});
