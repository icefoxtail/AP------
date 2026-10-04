import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { objectSha } from '../../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from '../../meta-foundation/active-registry.mjs';
import {
  LEGACY_META_RESOLUTION_SCHEMA_V1,
  questionUidForSource,
  resolveMetaRoute,
} from '../../meta-foundation/rpm-active-resolver.mjs';
import { classification, reclassifyR1MetaItem } from '../read-only-r1-adapter.mjs';

const root = new URL('../../../../', import.meta.url).pathname.replace(/^\//, '').replaceAll('/', '\\');
const registry = loadActiveMetaRegistry(root);
const crosswalk = JSON.parse(fs.readFileSync(root + '\\archive\\data\\meta-foundation\\crosswalks\\rpm-primary-v1.0\\high1.json', 'utf8'));
const row = crosswalk.records.find(item => item.id === 'H1-RPM-029');

function inputFor(rowValue) {
  const sourceArchiveFile = 'original/high/h1/1final/semantic-authority-fixture.js';
  return {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, 1),
      sourceIdentityKey: 'semantic-authority-fixture|1',
      sourceOrdinal: 1,
      contentHash: objectSha('frozen source hash'),
      choicesHash: objectSha([]),
      imageRefHash: objectSha(''),
    },
    solutionIdentity: {
      status: 'VERIFIED_FINAL',
      independentVerification: true,
      solutionHash: objectSha('independently verified solution hash'),
    },
    curriculumContext: {
      grade: 'H1',
      curriculum: rowValue.curriculum,
      scope: rowValue.scope,
      standardCourse: rowValue.standardCourse,
      standardUnitKey: rowValue.standardUnitKey,
      subUnitKey: rowValue.subUnitKey,
    },
    semanticDecision: {
      primaryMethod: '이미 검증된 풀이에서 주개념을 사용한다.',
      decisiveStep: '독립 검증된 풀이의 결정적 단계다.',
      rpmPath: { curriculum: rowValue.curriculum, scope: rowValue.scope, ...rowValue.rpmPath },
    },
  };
}

test('legacy RPM migration-gap evidence reclassifies to semantic FINAL plus projection pending', () => {
  const input = inputFor(row);
  const current = resolveMetaRoute(input, { repoRoot: root, registry });
  assert.equal(current.semanticStatus, 'FINAL');
  assert.equal(current.projectionStatus, 'PROJECTION_BINDING_PENDING');
  const { evidenceSha, ...body } = current;
  const legacyBody = {
    ...body,
    schemaVersion: LEGACY_META_RESOLUTION_SCHEMA_V1,
    disposition: 'RPM_PRIMARY_MIGRATION_GAP',
    dispositionReason: 'DIRECT_BINDING_GAP',
    problemTypeKey: '',
    templateKey: '',
    advancedMetaEligible: false,
  };
  delete legacyBody.semanticStatus;
  delete legacyBody.rpmSemantic;
  delete legacyBody.projectionStatus;
  delete legacyBody.projectionReasonCode;
  delete legacyBody.legacyProjection;
  legacyBody.evidenceSha = objectSha(legacyBody);
  const result = reclassifyR1MetaItem({
    questionUid: input.sourceIdentity.questionUid,
    sourceOrdinal: 1,
    disposition: 'RPM_PRIMARY_MIGRATION_GAP',
    input,
    resolverEvidence: legacyBody,
  }, { repoRoot: root });
  assert.equal(result.status, 'PASS');
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_BINDING_PENDING');
});

test('R1 adapter hydrates only source hashes from the frozen question for targeted semantic reclassification', () => {
  const complete = inputFor(row);
  const sourceQuestion = { content: 'frozen source question', choices: ['①', '②'], solution: 'independently verified solution hash', sourceIdentityKey: complete.sourceIdentity.sourceIdentityKey };
  const incomplete = { ...complete, sourceIdentity: { sourceFingerprint: objectSha({}) } };
  const result = reclassifyR1MetaItem({ questionUid: complete.sourceIdentity.questionUid, sourceOrdinal: 1,
    disposition: 'RPM_PRIMARY_MIGRATION_GAP', input: incomplete }, {
    repoRoot: root, sourceArchiveFile: complete.sourceIdentity.sourceArchiveFile, sourceQuestion,
  });
  assert.equal(result.semanticStatus, 'FINAL');
  assert.equal(result.projectionStatus, 'PROJECTION_BINDING_PENDING');
  assert.equal(result.resolverInputMode, 'FROZEN_SEMANTIC_INPUT');
});

test('legacy R1 adapter classifies projection-only gaps as META_ONLY, never as a semantic HOLD', () => {
  const row = {
    questionUid: questionUidForSource('original/high/h1/1final/semantic-authority-fixture.js', 1),
    sourceOrdinal: 1,
    disposition: 'ADVANCED_META_HOLD',
    reasonCode: 'R2_ADJUDICATION_REQUIRED',
    semanticStatus: 'FINAL',
    projectionStatus: 'PROJECTION_BINDING_PENDING',
    rpmSemantic: { status: 'FINAL', l3: 'RPM L3', l4: 'RPM L4' },
    legacyProjection: { status: 'PROJECTION_BINDING_PENDING', reasonCode: 'EXACT_ACTIVE_BINDING_PENDING' },
  };
  const result = classification(row, 'R1_RECEIPT.unresolvedItems');
  assert.equal(result.releaseEffect, 'META_ONLY');
  assert.equal(result.category, 'RPM_PROJECTION_PENDING');
  assert.notEqual(result.releaseEffect, 'RELEASE_BLOCKING');
});

test('only an explicit RPM semantic HOLD maps to RELEASE_BLOCKING', () => {
  const result = classification({
    disposition: 'TRUE_META_HOLD',
    semanticStatus: 'HOLD',
    rpmSemantic: { status: 'HOLD', reasonCode: 'RPM_PRIMARY_PATH_NOT_FOUND' },
    reasonCode: 'RPM_PRIMARY_PATH_NOT_FOUND',
  }, 'R1_META_SIDECAR.TRUE_META_HOLD');
  assert.equal(result.releaseEffect, 'RELEASE_BLOCKING');
  assert.equal(result.category, 'RPM_SEMANTIC_HOLD');
});

test('RPM semantic FINAL cannot hide a populated invalid canonical key', () => {
  const result = reclassifyR1MetaItem({
    questionUid: questionUidForSource('original/high/h1/1final/semantic-authority-fixture.js', 1),
    sourceOrdinal: 1,
    input: inputFor(row),
    candidateMeta: { problemTypeKey: 'PT_NOT_ACTIVE', templateKey: '', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' },
  }, { repoRoot: root });
  assert.equal(result.semanticStatus, 'FINAL');
  assert.ok(result.invalidCanonicalProjectionErrors.includes('ADVANCED_META_PROBLEM_TYPE_INVALID'));
  const finding = classification({
    semanticStatus: 'FINAL', projectionStatus: 'PROJECTION_BINDING_PENDING',
    invalidCanonicalProjectionErrors: result.invalidCanonicalProjectionErrors,
  }, 'R1_RECEIPT.rpmMigrationGaps');
  assert.equal(finding.releaseEffect, 'RELEASE_BLOCKING');
  assert.equal(finding.category, 'INVALID_CANONICAL_KEY');
});

test('a complete semantic and projection PASS is not carried as an R1 finding', () => {
  const result = classification({
    disposition: 'RPM_SEMANTIC_FINAL',
    semanticStatus: 'FINAL',
    projectionStatus: 'PROJECTION_REUSE',
    rpmSemantic: { status: 'FINAL' },
    legacyProjection: { status: 'PROJECTION_REUSE' },
  }, 'R1_META_SIDECAR.RPM_SEMANTIC_FINAL');
  assert.equal(result, null);
});
