import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { objectSha } from '../pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from './active-registry.mjs';
import {
  buildDecisionIsolatedInput,
  makeDifficultyEvidence,
  questionUidForSource,
  resolveMetaRoute,
  validateResolverEvidence,
  validateRuntimeMetaParity,
} from './rpm-active-resolver.mjs';
import { reviewedProblemTypeDisposition } from './normalize-rpm-primary-m1-m2.mjs';
import { buildAuditArtifacts, familyCoverage, missingCanonicalPathSentinels } from './audit-rpm-primary-m1-m2.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const crosswalkDir = path.join(ROOT, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');
const activeRegistry = loadActiveMetaRegistry(ROOT);

function sourceQuestion(relativeFile, questionNo) {
  const absolute = path.join(ROOT, relativeFile);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(absolute, 'utf8'), context, { filename: absolute });
  const question = context.window.questionBank.find(row => row.id === questionNo);
  assert.ok(question, `source question ${questionNo} exists in ${relativeFile}`);
  return question;
}

function makeInput(row, question, sourceArchiveFile, questionNo) {
  const contentHash = objectSha(question.content);
  const choicesHash = objectSha(question.choices || []);
  const solutionHash = objectSha(question.solution);
  return {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, questionNo),
      sourceIdentityKey: `${objectSha({ sourceArchiveFile, questionNo })}|${questionNo}`,
      sourceOrdinal: questionNo,
      contentHash,
      choicesHash,
      imageRefHash: objectSha(question.image || ''),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash },
    curriculumContext: {
      grade: 'M2', curriculum: '2015', scope: 'M2-2', standardCourse: '중2 수학',
      standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey,
    },
    semanticDecision: {
      primaryMethod: question.id === 6 ? '직각삼각형의 RHS 합동' : question.id === 7 ? '중점과 수선의 발에서 RHS 합동' : '직각삼각형의 RHA 합동',
      decisiveStep: question.id === 6 ? '(4),(7)이 빗변 5와 한 변 4로 RHS'
        : question.id === 7 ? 'MB=MC, MD=ME로 △BMD≡△CME'
          : '빗변과 한 예각의 대응으로 합동을 확정한다.',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
  };
}

function rowFor(rpmL4) {
  const data = JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle2.json'), 'utf8'));
  return data.records.find(row => row.curriculum === '2015' && row.scope === 'M2-2'
    && row.rpmPath.l3 === '직각삼각형의 합동' && row.rpmPath.l4 === rpmL4);
}

function makeRuntimeProjection(input, resolverEvidence) {
  const difficultyEvidence = makeDifficultyEvidence({
    status: 'PASS', blindPassStatus: 'FRESH_INDEPENDENT', sourceFingerprint: resolverEvidence.sourceFingerprint,
    solutionHash: resolverEvidence.semanticInputBundle.solutionIdentity.solutionHash, independentOfSemanticPass: true,
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE',
    legacyLevelCompatibility: 'NORMAL', rationale: '수선·빗변·대응각 또는 변 비교의 단계 수로 판정한 회귀 fixture.',
    blindReviewerId: 'rpm-crosswalk-regression', decisionSha: objectSha({ questionUid: input.sourceIdentity.questionUid, type: 'RHS_RHA' }),
  });
  const row = rowFor(resolverEvidence.rpmPath.l4);
  const candidateMeta = {
    standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, standardCourse: '중2 수학',
    problemTypeKey: resolverEvidence.problemTypeKey, templateKey: resolverEvidence.templateKey,
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
  const runtimeRecord = {
    questionUid: input.sourceIdentity.questionUid, sourceFingerprint: resolverEvidence.sourceFingerprint,
    resolverEvidenceSha: resolverEvidence.evidenceSha, difficultyEvidenceSha: difficultyEvidence.evidenceSha,
    ...candidateMeta,
  };
  return { difficultyEvidence, candidateMeta, runtimeRecord };
}

test('RPM views/master and crosswalk close the full M1/M2 denominator with the omission sentinel', () => {
  const audit = buildAuditArtifacts();
  assert.equal(audit.summary.rpmFinalRecordCount, 468);
  assert.equal(audit.summary.crosswalkFinalRecordCount, 468);
  assert.equal(audit.summary.crosswalkMissingRows, 0);
  assert.equal(audit.summary.crosswalkOrphanRows, 0);
  assert.equal(audit.summary.duplicateRpmSemanticTuples, 0);
  assert.equal(audit.summary.viewParityErrors, 0);
  assert.equal(audit.summary.crosswalkFinalRpmOnlyRows, 265);
  assert.equal(audit.summary.bindingOnlyGapCrosswalkRows, 106);
  assert.deepEqual(audit.summary.validationResults, {
    activeProblemTypeTemplateParentIntegrityErrors: 0,
    exactBindingStatusMismatchErrors: 0,
    incompleteFamilyCandidateSets: 0,
    directSemanticEquivalenceErrors: 0,
  });
  assert.equal(audit.summary.omissions.initial2015, 2);
  assert.equal(audit.summary.omissions.repaired2015, 2);
  assert.equal(audit.summary.omissions['2022'], 0);
  assert.equal(audit.summary.rpmSemanticRelationRows.BOTH_PRESENT, 460);
  assert.equal(audit.summary.rpmSemanticRelationRows.LEGIT_CURRICULUM_DIFFERENCE, 6);
  assert.equal(audit.summary.rpmSemanticRelationRows.NEEDS_EVIDENCE, 2);

  const master = audit.rpmCompleteness.records;
  const crosswalk = audit.crosswalkSemantic.records;
  const requiredLedgerFields = ['curriculum', 'scope', 'rpmRecordId', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
    'existingMappingStatus', 'existingPTTPL', 'semanticRelation', 'curriculumPresence2015', 'curriculumPresence2022',
    'activeBinding', 'defectType', 'finalDisposition', 'repairAction', 'evidence'];
  assert.equal(crosswalk.filter(row => requiredLedgerFields.some(field => !Object.hasOwn(row, field))).length, 0,
    'each machine-audit row carries the required RPM, mapping, curriculum, binding and evidence fields');
  assert.deepEqual(missingCanonicalPathSentinels(master, crosswalk), []);
  const intentionallyIncompleteMaster = master.filter(row => !(row.curriculum === '2015' && row.scope === 'M2-2'
    && row.rpmL3 === '직각삼각형의 합동' && ['RHS', 'RHA'].includes(row.rpmL4)));
  const intentionallyIncompleteCrosswalk = crosswalk.filter(row => !(row.curriculum === '2015' && row.scope === 'M2-2'
    && row.rpmL3 === '직각삼각형의 합동' && ['RHS', 'RHA'].includes(row.rpmL4)));
  assert.equal(missingCanonicalPathSentinels(intentionallyIncompleteMaster, intentionallyIncompleteCrosswalk).length, 4,
    'a shared master/crosswalk omission must fail even when their mutual denominator parity is zero');
});

test('narrow direct/family mappings fail closed and a complete line-equation family passes', () => {
  const absolute = reviewedProblemTypeDisposition({
    problemTypeKey: 'PT_ABSOLUTE_VALUE_SIGN_EXTREMES', mappingStatus: 'DIRECT_ACTIVE',
    rpmPath: { l3: '절댓값', l4: '절댓값 조건으로 수 찾기' },
  });
  assert.equal(absolute, 'RPM_ONLY_TARGET_TOO_NARROW_OR_FAMILY_INCOMPLETE');
  const graphFamily = familyCoverage({ problemTypeKey: 'PT_M1_CONTEXT_GRAPH_INTERPRETATION', rpmPath: { l4: '그래프 해석' } }, [
    { templateKey: 'TPL_M1_CONTEXT_GRAPH_INTERPRETATION_CONTEXT_TO_RECIPROCAL_GRAPH' },
    { templateKey: 'TPL_M1_CONTEXT_GRAPH_INTERPRETATION_PERIODIC_GRAPH_CLAIMS' },
  ]);
  assert.equal(graphFamily.coverage, 'INCOMPLETE');
  const lineFamily = familyCoverage({ problemTypeKey: 'PT_LINE_EQUATION', rpmPath: { l4: '그래프 그리기' } }, [
    { templateKey: 'TPL_LINE_GRAPH_BY_COEFFICIENTS' }, { templateKey: 'TPL_LINE_POINT_SLOPE' },
    { templateKey: 'TPL_LINE_TWO_POINTS' }, { templateKey: 'TPL_LINE_MULTI_CONDITION' },
  ]);
  assert.equal(lineFamily.coverage, 'COMPLETE');
});

test('24 Sinheung q6/q7 resolve to the exact existing 2015 RHS binding and runtime projection', () => {
  assert.equal(activeRegistry.status, 'ACTIVE', JSON.stringify(activeRegistry.errors));
  const sourceFile = 'original/middle/m2/2mid/24_신흥중_2학기_중간_중2_수학.js';
  const relative = 'archive/exams/original/middle/m2/2mid/24_신흥중_2학기_중간_중2_수학.js';
  const rhsRow = rowFor('RHS');
  assert.ok(rhsRow);
  assert.equal(rhsRow.id, 'M2-RPM-070');
  assert.equal(rhsRow.mappingStatus, 'DIRECT_ACTIVE');
  assert.equal(rhsRow.bindingStatus, 'ACTIVE');
  assert.equal(rhsRow.problemTypeKey, 'PT_RIGHT_TRIANGLE_CONGRUENCE');
  assert.equal(rhsRow.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE');
  for (const qNo of [6, 7]) {
    const question = sourceQuestion(relative, qNo);
    const input = makeInput(rhsRow, question, sourceFile, qNo);
    const resolver = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
    assert.equal(resolver.disposition, 'EXISTING_REUSE', JSON.stringify(resolver));
    assert.equal(resolver.problemTypeKey, 'PT_RIGHT_TRIANGLE_CONGRUENCE');
    assert.equal(resolver.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE');
    assert.match(resolver.bindingIdentity, /^2015\|M2-05\|M2-05-TRIANGLE_PROPERTIES\|PT_RIGHT_TRIANGLE_CONGRUENCE\|MIDDLE_GEOMETRY/);
    assert.equal(validateResolverEvidence(input, resolver, { repoRoot: ROOT, registry: activeRegistry }).status, 'PASS');
    const { difficultyEvidence, candidateMeta, runtimeRecord } = makeRuntimeProjection(input, resolver);
    assert.equal(validateRuntimeMetaParity({
      questionUid: input.sourceIdentity.questionUid, sourceFingerprint: resolver.sourceFingerprint,
      resolverEvidence: resolver, difficultyEvidence, candidateMeta, runtimeRecord,
    }).status, 'PASS');
  }
});

test('migration-gap authority recovers only the semantically safe cases and preserves real holds', () => {
  const file = path.join(ROOT, 'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization/migration-gap-reassessment.json');
  const authority = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.deepEqual(authority.summary, {
    previousMigrationGapItems: 20,
    existingReuseRecovered: 4,
    actualBindingOnlyGap: 4,
    remainingSemanticGap: 12,
    affectedM1Items: 10,
    affectedM2Items: 10,
    relatedPreexistingReuseCount: 1,
    shinheungQ6Q7: [6, 7].map(questionNo => ({
      questionNo, finalDisposition: 'EXISTING_REUSE', rpmRecordId: 'M2-RPM-070',
      problemTypeKey: 'PT_RIGHT_TRIANGLE_CONGRUENCE', templateKey: 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE', exactBindingStatus: 'ACTIVE',
    })),
  });
  const record = (examUid, questionNo) => authority.records.find(row => row.examUid === examUid && row.questionNo === questionNo);
  assert.equal(record('23_이수중_2학기_중간_중2_수학', 3).finalDisposition, 'RPM_PRIMARY_MIGRATION_GAP',
    'comparison of multiple congruence criteria remains a real semantic gap');
  const rhaQ4 = record('23_이수중_2학기_중간_중2_수학', 4);
  assert.equal(rhaQ4.finalDisposition, 'EXISTING_REUSE');
  assert.equal(rhaQ4.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE');
  assert.equal(record('24_향림중_2학기_중간_중2_수학', 13).finalDisposition, 'RPM_PRIMARY_MIGRATION_GAP',
    'the full multi-condition selection question is not collapsed into an RHA-only mapping');
  assert.equal(record('23_향림중_2학기_중간_중2_수학', 2).finalDisposition, 'FAMILY_BINDING_GAP');
  assert.equal(authority.relatedPreexistingReuses[0].rpmRecordId, 'M2-RPM-070');
  assert.equal(authority.relatedPreexistingReuses[0].priorRpmPrimary, null);
});

test('23 Isu q4 resolves by its verified RHA decisive step rather than its stale RHS label', () => {
  const sourceFile = 'original/middle/m2/2mid/23_이수중_2학기_중간_중2_수학.js';
  const relative = `archive/exams/${sourceFile}`;
  const question = sourceQuestion(relative, 4);
  const row = rowFor('RHA');
  const input = makeInput(row, question, sourceFile, 4);
  input.semanticDecision.primaryMethod = '직각삼각형 RHA 합동';
  input.semanticDecision.decisiveStep = '빗변과 한 예각의 대응으로 두 직각삼각형의 합동을 확정한다.';
  const resolver = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
  assert.equal(resolver.disposition, 'EXISTING_REUSE');
  assert.equal(resolver.rpmPath.l4, 'RHA');
  assert.equal(resolver.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE');
  assert.equal(validateResolverEvidence(input, resolver, { repoRoot: ROOT, registry: activeRegistry }).status, 'PASS');
});

test('24 Yeonhyang q21 gets a restored RPM path for its already selected RHS reuse', () => {
  const sourceFile = 'original/middle/m2/2mid/24_연향중_2학기_중간_중2_수학.js';
  const question = sourceQuestion(`archive/exams/${sourceFile}`, 21);
  const row = rowFor('RHS');
  const input = makeInput(row, question, sourceFile, 21);
  input.semanticDecision.primaryMethod = '두 직각삼각형의 빗변·한 변으로 RHS 합동';
  input.semanticDecision.decisiveStep = 'CE=DE=4와 직각 구조로 빗변과 한 변이 대응한다.';
  const resolver = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
  assert.equal(resolver.disposition, 'EXISTING_REUSE');
  assert.equal(resolver.rpmPath.l4, 'RHS');
  assert.equal(resolver.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE');
  assert.equal(validateResolverEvidence(input, resolver, { repoRoot: ROOT, registry: activeRegistry }).status, 'PASS');
});

test('the repaired 2015 RHA path resolves through the existing RHA template and binding', () => {
  const sourceFile = 'original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
  const relative = 'archive/exams/original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
  const question = sourceQuestion(relative, 3);
  const row = rowFor('RHA');
  assert.equal(row.id, 'M2-RPM-071');
  const input = makeInput(row, question, sourceFile, 3);
  input.semanticDecision.primaryMethod = '직각삼각형 RHA 합동';
  input.semanticDecision.decisiveStep = '두 직각삼각형의 같은 빗변과 한 예각으로 합동을 확인한다.';
  const resolver = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
  assert.equal(resolver.disposition, 'EXISTING_REUSE');
  assert.equal(resolver.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE');
  assert.equal(validateResolverEvidence(input, resolver, { repoRoot: ROOT, registry: activeRegistry }).status, 'PASS');
});

test('compiled ACTIVE registry and all resolver routes remain deterministic for 468 rows', () => {
  assert.equal(activeRegistry.status, 'ACTIVE', JSON.stringify(activeRegistry.errors));
  const audit = buildAuditArtifacts();
  const allRows = [...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle1.json'), 'utf8')).records,
    ...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle2.json'), 'utf8')).records];
  assert.equal(allRows.length, 468);
  const dispositionFor = new Map(audit.crosswalkSemantic.records.map(row => [row.rpmRecordId, row.finalMappingStatus]));
  for (let index = 0; index < allRows.length; index++) {
    const row = allRows[index];
    const sourceArchiveFile = `original/middle/m${row.scope.slice(1, 2)}/2mid/crosswalk-regression-${row.id}.js`;
    const input = {
      sourceIdentity: {
        sourceArchiveFile, questionUid: questionUidForSource(sourceArchiveFile, 1),
        sourceIdentityKey: `${objectSha(sourceArchiveFile)}|1`, sourceOrdinal: 1,
        contentHash: objectSha(row.id), choicesHash: objectSha([]), imageRefHash: objectSha(''),
      },
      solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha(`solution:${row.id}`) },
      curriculumContext: { grade: row.scope.slice(0, 2), curriculum: row.curriculum, scope: row.scope,
        standardCourse: row.scope.startsWith('M1') ? '중1 수학' : '중2 수학', standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '' },
      semanticDecision: { primaryMethod: 'deterministic resolver fixture', decisiveStep: 'fixture only; semantic evidence is in the audit ledger', rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath } },
    };
    if (row.mappingStatus.startsWith('FAMILY')) {
      const bundle = buildDecisionIsolatedInput(input);
      input.familyTemplateSelection = { stage: 'POST_CROSSWALK', inputBundleSha: bundle.inputBundleSha,
        crosswalkRecordId: row.id, templateKey: row.templateCandidates[0].templateKey, decisiveStepReason: `fixture family selection for ${row.id}` };
    }
    const resolved = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
    const status = dispositionFor.get(row.id);
    const expected = status === 'DIRECT_ACTIVE' ? 'EXISTING_REUSE' : status === 'FAMILY_ACTIVE' ? 'FAMILY_REUSE' : 'RPM_PRIMARY_MIGRATION_GAP';
    assert.equal(resolved.disposition, expected, `${row.id}: ${JSON.stringify(resolved)}`);
    if (status === 'DIRECT_ACTIVE') {
      assert.equal(resolved.problemTypeKey, row.problemTypeKey, row.id);
      assert.equal(resolved.templateKey, row.templateKey, row.id);
    }
    if (status === 'RPM_ONLY' || status.endsWith('_BINDING_GAP')) {
      assert.equal(resolved.problemTypeKey, '', row.id);
      assert.equal(resolved.templateKey, '', row.id);
    }
  }
});
