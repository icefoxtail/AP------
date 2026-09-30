import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import { questionUidForSource, resolveMetaRoute } from './rpm-active-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const crosswalkRoot = path.join(root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
const rpmRoot = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0';
const crosswalkFiles = fs.readdirSync(crosswalkRoot).filter(file => /^high(?:1|2-).*\.json$/.test(file)).sort();
const registry = loadActiveMetaRegistry(root);
const projectionStatuses = new Set([
  'PROJECTION_REUSE', 'PROJECTION_BINDING_PENDING', 'PROJECTION_UNMATERIALIZED', 'META_ONLY_COMPATIBILITY_PENDING',
]);

function inputFor(row, file, ordinal, gradeOverride = '') {
  const grade = gradeOverride || (file === 'high1.json' ? 'H1' : 'H2');
  const sourceArchiveFile = `original/high/h${grade.slice(1)}/1final/${file.replace('.json', '')}-semantic-regression.js`;
  const questionUid = questionUidForSource(sourceArchiveFile, ordinal);
  return {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid,
      sourceIdentityKey: `${questionUid}|rpm-primary-high-school-regression`,
      sourceOrdinal: ordinal,
      contentHash: objectSha(`${file}|${row.id}|content`),
      choicesHash: objectSha([]),
      imageRefHash: objectSha({}),
    },
    solutionIdentity: {
      status: 'VERIFIED_FINAL',
      independentVerification: true,
      solutionHash: objectSha(`${file}|${row.id}|independently-verified-solution`),
    },
    curriculumContext: {
      grade,
      curriculum: row.curriculum,
      scope: row.scope,
      standardCourse: row.standardCourse || '',
      // Some legacy RPM_ONLY rows have no exact L1 projection. The synthetic
      // context value keeps semantic verification independent of that gap.
      standardUnitKey: row.standardUnitKey || `UNMAPPED-HS-${row.curriculum}-${row.scope}`,
      subUnitKey: row.subUnitKey || '',
    },
    semanticDecision: {
      primaryMethod: '독립 검증된 풀이의 주개념 적용',
      decisiveStep: 'RPM semantic path의 결정적 풀이 단계',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
  };
}

test('all H1/H2 RPM Primary crosswalk routes remain semantic FINAL independent of compatibility projection', () => {
  assert.equal(registry.status, 'ACTIVE');
  assert.deepEqual(crosswalkFiles, [
    'high1.json',
    'high2-calculus-calculus2.json',
    'high2-geometry.json',
    'high2-math1-algebra.json',
    'high2-math2-calculus1.json',
    'high2-probability-statistics.json',
  ]);

  let denominator = 0;
  const projections = {};
  for (const file of crosswalkFiles) {
    const crosswalk = JSON.parse(fs.readFileSync(path.join(crosswalkRoot, file), 'utf8'));
    const sourceMaster = JSON.parse(fs.readFileSync(path.join(root, `${rpmRoot}/00_POLICY/CANONICAL_MASTER.json`), 'utf8'));
    const expectedLevel = 'high';
    assert.ok(sourceMaster.records.some(record => record.level === expectedLevel && record.curriculum === crosswalk.records[0]?.curriculum),
      `${file}: corresponding HIGH RPM master records must exist`);

    crosswalk.records.forEach((row, index) => {
      const input = inputFor(row, file, index + 1);
      const result = resolveMetaRoute(input, { repoRoot: root, registry });
      assert.equal(result.semanticStatus, 'FINAL', `${file}/${row.id}: ${result.reasonCode || result.dispositionReason}`);
      assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL', `${file}/${row.id}`);
      assert.equal(result.rpmSemantic.l3, row.rpmPath.l3, `${file}/${row.id}: RPM L3`);
      assert.equal(result.rpmSemantic.l4, row.rpmPath.l4, `${file}/${row.id}: RPM L4`);
      assert.ok(projectionStatuses.has(result.projectionStatus), `${file}/${row.id}: ${result.projectionStatus}`);
      projections[result.projectionStatus] = (projections[result.projectionStatus] || 0) + 1;
      denominator += 1;
    });
  }

  assert.equal(denominator, 754);
  assert.ok(Object.values(projections).reduce((sum, count) => sum + count, 0) === denominator);
});

test('H3 semantic routing remains FINAL when no H3 compatibility crosswalk exists', () => {
  const crosswalk = JSON.parse(fs.readFileSync(path.join(crosswalkRoot, 'high2-geometry.json'), 'utf8'));
  const row = crosswalk.records.find(record => record.curriculum === '2015' && record.standardUnitKey);
  assert.ok(row);
  const result = resolveMetaRoute(inputFor(row, 'high2-geometry.json', 1, 'H3'), { repoRoot: root, registry });
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_UNMATERIALIZED');
  assert.equal(result.projectionReasonCode, 'CROSSWALK_COMPATIBILITY_ROUTE_UNAVAILABLE');
});
