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
import {
  GPT_INDEPENDENT_REVIEW_FALSE_PASS_RULES, flattenMaster, MASTER_PATH,
  reviewedProblemTypeDisposition, targetedFalsePassRegressionErrors, targetedFalsePassRowError,
  validateRpmSources,
} from './normalize-rpm-primary-m1-m2.mjs';
import { familyCoverage, missingCanonicalPathSentinels, validateTargetedFalsePassAudit } from './audit-rpm-primary-m1-m2.mjs';

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

test('RPM source and persisted crosswalk denominator remain closed with the omission sentinel', () => {
  const sourceValidation = validateRpmSources();
  assert.equal(sourceValidation.status, 'PASS', JSON.stringify(sourceValidation.errors));
  assert.equal(sourceValidation.rows, 468);
  assert.equal(sourceValidation.viewCount, 8);
  assert.equal(sourceValidation.duplicateSemanticTupleCount, 0);

  const master = flattenMaster(JSON.parse(fs.readFileSync(path.join(ROOT, MASTER_PATH), 'utf8')));
  const crosswalks = {
    middle1: JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle1.json'), 'utf8')),
    middle2: JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle2.json'), 'utf8')),
  };
  assert.equal(crosswalks.middle1.summary.recordCount, 232);
  assert.equal(crosswalks.middle2.summary.recordCount, 236);
  const projectionStatuses = new Set(['DIRECT_ACTIVE', 'FAMILY_ACTIVE', 'DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP', 'RPM_ONLY']);
  for (const row of [...crosswalks.middle1.records, ...crosswalks.middle2.records]) assert.ok(projectionStatuses.has(row.mappingStatus), row.id);

  const crosswalkRows = [...crosswalks.middle1.records, ...crosswalks.middle2.records];
  assert.equal(crosswalkRows.length, 468);
  const masterKeys = new Set(master.map(row => [
    row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4,
  ].join('|')));
  const crosswalkKeys = crosswalkRows.map(row => [
    row.curriculum, row.scope, row.rpmPath.majorUnit, row.rpmPath.midUnit, row.rpmPath.l3, row.rpmPath.l4,
  ].join('|'));
  assert.equal(new Set(crosswalkKeys).size, 468, 'crosswalk semantic tuples are unique');
  assert.deepEqual(crosswalkKeys.filter(key => !masterKeys.has(key)), [], 'no orphan crosswalk rows');
  const crosswalkKeySet = new Set(crosswalkKeys);
  assert.deepEqual([...masterKeys].filter(key => !crosswalkKeySet.has(key)), [], 'no missing crosswalk rows');

  const completeness = JSON.parse(fs.readFileSync(path.join(ROOT,
    'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization/rpm-completeness-audit.json'), 'utf8'));
  const semanticAudit = JSON.parse(fs.readFileSync(path.join(ROOT,
    'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization/crosswalk-semantic-audit.json'), 'utf8'));
  assert.equal(completeness.records.length, 468);
  assert.equal(semanticAudit.records.length, 468);
  assert.deepEqual(missingCanonicalPathSentinels(master, completeness.records), []);
  const requiredLedgerFields = ['curriculum', 'scope', 'rpmRecordId', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4',
    'existingMappingStatus', 'existingPTTPL', 'semanticRelation', 'curriculumPresence2015', 'curriculumPresence2022',
    'activeBinding', 'defectType', 'finalDisposition', 'repairAction', 'evidence'];
  assert.equal(semanticAudit.records.filter(row => requiredLedgerFields.some(field => !Object.hasOwn(row, field))).length, 0);
  assert.deepEqual(targetedFalsePassRegressionErrors(crosswalkRows), []);
  assert.equal(semanticAudit.summary.validationResults.targetedFalsePassErrors, 0);
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

test('GPT independent review false-pass families fail closed on all 18 reviewed mappings', () => {
  const finalRows = [
    ...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle1.json'), 'utf8')).records,
    ...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle2.json'), 'utf8')).records,
  ];
  const finalById = new Map(finalRows.map(row => [row.id, row]));
  const ledger = JSON.parse(fs.readFileSync(path.join(ROOT,
    'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization/crosswalk-semantic-audit.json'), 'utf8'));
  const ledgerById = new Map(ledger.records.map(row => [row.rpmRecordId, row]));
  let checked = 0;
  for (const rule of GPT_INDEPENDENT_REVIEW_FALSE_PASS_RULES) {
    for (const id of rule.ids) {
      const final = finalById.get(id);
      assert.ok(final, id + ': final crosswalk row exists');
      const unsafeStatus = id === 'M2-RPM-210' ? 'DIRECT_BINDING_GAP' : 'DIRECT_ACTIVE';
      const unsafe = {
        ...final,
        mappingStatus: unsafeStatus,
        problemTypeKey: rule.problemTypeKey,
        templateKey: rule.templateKey,
        bindingStatus: unsafeStatus === 'DIRECT_BINDING_GAP' ? 'MISSING' : 'ACTIVE',
      };
      assert.ok(rule.rejectStatuses.includes(unsafe.mappingStatus), id + ': reviewed mapping status');
      assert.equal(reviewedProblemTypeDisposition(unsafe), rule.disposition, id + ': normalizer must reject the false pass');
      assert.equal(targetedFalsePassRowError(unsafe)?.error, 'EXPECTED_RPM_ONLY', id + ': false-pass reason');
      assert.equal(validateTargetedFalsePassAudit([unsafe], { requireAll: false }).status, 'FAIL', id + ': auditor must fail the unsafe status');

      assert.equal(final.mappingStatus, 'RPM_ONLY', id + ': final status');
      assert.equal(final.mappingDispositionMemo, rule.disposition, id + ': deterministic normalizer disposition');
      assert.equal(final.bindingStatus, 'NO_ACTIVE_MAPPING', id + ': no active binding');
      for (const field of ['problemTypeKey', 'problemTypeLabelKo', 'ownerPack', 'templateKey',
        'templateLabelKo', 'templateCandidates', 'selectionRule', 'binding']) {
        assert.equal(Object.hasOwn(final, field), false, id + ': stale ' + field + ' pointer');
      }
      const auditRow = ledgerById.get(id);
      assert.equal(auditRow.reviewOrigin, 'GPT_INDEPENDENT_REVIEW', id + ': independent-review provenance');
      assert.equal(auditRow.finalDisposition, 'RPM_ONLY', id + ': audit ledger final status');
      assert.equal(auditRow.existingPTTPL.problemTypeKey, rule.problemTypeKey, id + ': pre-fix PT evidence');
      assert.equal(auditRow.existingPTTPL.templateKey, rule.templateKey, id + ': pre-fix TPL evidence');
      assert.ok(auditRow.reviewedMappingEvidence?.templates?.[0]?.definition, id + ': unsafe TPL definition preserved');
      const activeReviewedBinding = auditRow.reviewedMappingEvidence.exactCurriculumBindings.some(binding => binding.status === 'ACTIVE');
      assert.equal(auditRow.reviewedMappingEvidence.exactBindingStatus, activeReviewedBinding ? 'ACTIVE' : 'MISSING', id + ': exact pre-fix binding evidence');
      checked++;
    }
  }
  assert.equal(checked, 18);
  assert.deepEqual(targetedFalsePassRegressionErrors(finalRows), []);
  assert.equal(validateTargetedFalsePassAudit(finalRows).status, 'PASS');
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
    assert.equal(resolver.disposition, 'RPM_SEMANTIC_FINAL', JSON.stringify(resolver));
    assert.equal(resolver.semanticStatus, 'FINAL');
    assert.equal(resolver.projectionStatus, 'PROJECTION_REUSE');
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
  assert.equal(resolver.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(resolver.semanticStatus, 'FINAL');
  assert.equal(resolver.projectionStatus, 'PROJECTION_REUSE');
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
  assert.equal(resolver.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(resolver.semanticStatus, 'FINAL');
  assert.equal(resolver.projectionStatus, 'PROJECTION_REUSE');
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
  assert.equal(resolver.disposition, 'RPM_SEMANTIC_FINAL');
  assert.equal(resolver.semanticStatus, 'FINAL');
  assert.equal(resolver.projectionStatus, 'PROJECTION_REUSE');
  assert.equal(resolver.templateKey, 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE');
  assert.equal(validateResolverEvidence(input, resolver, { repoRoot: ROOT, registry: activeRegistry }).status, 'PASS');
});

test('compiled GLOBAL ACTIVE projection cannot change RPM semantic finality for all 468 M1/M2 paths', () => {
  assert.equal(activeRegistry.status, 'ACTIVE', JSON.stringify(activeRegistry.errors));
  const allRows = [...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle1.json'), 'utf8')).records,
    ...JSON.parse(fs.readFileSync(path.join(crosswalkDir, 'middle2.json'), 'utf8')).records];
  assert.equal(allRows.length, 468);
  const dispositions = { RPM_SEMANTIC_FINAL: 0, TRUE_META_HOLD: 0, ROUTE_OUT: 0 };
  const projections = { PROJECTION_REUSE: 0, PROJECTION_BINDING_PENDING: 0, PROJECTION_UNMATERIALIZED: 0, META_ONLY_COMPATIBILITY_PENDING: 0 };
  for (let index = 0; index < allRows.length; index++) {
    const row = allRows[index];
    const sourceArchiveFile = 'original/middle/m' + row.scope.slice(1, 2) + '/2mid/crosswalk-regression-' + row.id + '.js';
    const input = {
      sourceIdentity: {
        sourceArchiveFile, questionUid: questionUidForSource(sourceArchiveFile, 1),
        sourceIdentityKey: objectSha(sourceArchiveFile) + '|1', sourceOrdinal: 1,
        contentHash: objectSha(row.id), choicesHash: objectSha([]), imageRefHash: objectSha(''),
      },
      solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha('solution:' + row.id) },
      curriculumContext: { grade: row.scope.slice(0, 2), curriculum: row.curriculum, scope: row.scope,
        standardCourse: row.scope.startsWith('M1') ? '중1 수학' : '중2 수학', standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey || '' },
      semanticDecision: { primaryMethod: 'deterministic resolver fixture', decisiveStep: 'projection-only regression fixture; semantic path is locked RPM input',
        rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath } },
    };
    if (row.mappingStatus.startsWith('FAMILY')) {
      const bundle = buildDecisionIsolatedInput(input);
      input.familyTemplateSelection = { stage: 'POST_CROSSWALK', inputBundleSha: bundle.inputBundleSha,
        crosswalkRecordId: row.id, templateKey: row.templateCandidates[0].templateKey, decisiveStepReason: 'family projection fixture ' + row.id };
    }
    const resolved = resolveMetaRoute(input, { repoRoot: ROOT, registry: activeRegistry });
    assert.equal(resolved.disposition, 'RPM_SEMANTIC_FINAL', row.id + ': ' + JSON.stringify(resolved));
    assert.equal(resolved.semanticStatus, 'FINAL', row.id);
    assert.ok(Object.hasOwn(projections, resolved.projectionStatus), row.id + ': ' + resolved.projectionStatus);
    dispositions[resolved.disposition]++;
    projections[resolved.projectionStatus]++;
    const evidenceValidation = validateResolverEvidence(input, resolved, { repoRoot: ROOT, registry: activeRegistry });
    assert.equal(evidenceValidation.status, 'PASS', row.id + ': ' + JSON.stringify(evidenceValidation.errors));
    if (resolved.projectionStatus === 'PROJECTION_REUSE') {
      assert.ok(resolved.problemTypeKey, row.id + ': reusable projection needs PT');
      assert.equal(resolved.bindingIdentity.length > 0, true, row.id + ': reusable projection needs exact binding');
    } else {
      assert.equal(resolved.problemTypeKey, '', row.id + ': pending projection must not emit a production key');
      assert.equal(resolved.templateKey, '', row.id + ': pending projection must not emit a production key');
    }
  }
  assert.deepEqual(dispositions, { RPM_SEMANTIC_FINAL: 468, TRUE_META_HOLD: 0, ROUTE_OUT: 0 });
  assert.equal(Object.values(projections).reduce((sum, count) => sum + count, 0), 468);
});
