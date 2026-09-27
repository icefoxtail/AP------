import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { objectSha } from '../../pipeline-core/canonical.mjs';
import { makeQuestionSkeleton } from '../lib/js-candidate.mjs';
import { buildSourceMetadataFirstPass, loadSourceMetadataCatalog, makeSourceMetadataRecheckDraft, metadataProjection, reconcileSourceMetadata, validateSourceMetadata, validateSourceMetadataReconciliation } from '../lib/source-metadata.mjs';

const catalog = loadSourceMetadataCatalog();
const manifest = { examId: '25_학교고_1학기_중간_고1_공통수학1', grade: '고1', year: '25', course: '공통수학1', archiveRelativePath: 'original/high/h1/1mid/25_학교고_1학기_중간_고1_공통수학1.js' };
const binding = catalog.registry.bindingRows.find(row => row.curriculum === '2022' && row.standardUnitKey === 'H22-C-01' && row.subUnitKey === 'H22-C-01-POLYNOMIAL_BASIC');
const template = [...catalog.registry.templates.values()].find(row => row.parentProblemTypeKey === binding.problemTypeKey && row.status === 'ACTIVE');
function question() {
  return { ...makeQuestionSkeleton(1, manifest), sourceIdentityKey: `sha256:${'1'.repeat(64)}|1`, sourceOrdinal: 1, content: '정수 $x$에 대한 다항식을 나눈 나머지와 절댓값을 구하여라.', choices: ['1', '2', '3', '4', '5'], initialMetadataInput: { confidence: 'medium', reason: '발문의 다항식 나눗셈과 정수 조건을 읽고 1차 분류했다. 난이도는 풀이 전 예상이다.', sourceExcerpts: ['다항식을 나눈 나머지', '정수'], values: { standardUnitKey: 'H22-C-01', subUnitKey: 'H22-C-01-POLYNOMIAL_BASIC', problemTypeKey: binding.problemTypeKey, templateKey: template.templateKey, conditionKeys: ['COND_INTEGER'], crossConceptKeys: ['CC_ABSOLUTE_VALUE_EQUATION'], difficultyBucket: 3, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL', level: '중', tags: ['기출', '다항식'] }, unresolvedFields: [{ field: 'integrationPattern', reason: '실제 풀이에서 개념의 결합 방식을 다시 확인한다.' }] } };
}

test('source reading populates canonical L1/L2, active L3/L4, conditions, concepts and tentative difficulty', () => {
  const result = buildSourceMetadataFirstPass([question()], manifest, { catalog }), q = result.questions[0];
  assert.equal(q.standardCourse, '공통수학1'); assert.equal(q.standardUnit, '다항식의 연산'); assert.equal(q.standardUnitOrder, 1);
  assert.equal(q.subUnit, '다항식의 연산'); assert.equal(q.subUnitConfidence, 'candidate_evidence');
  assert.equal(q.problemTypeKey, binding.problemTypeKey); assert.equal(q.templateKey, template.templateKey); assert.equal(q.difficultyBucket, 3);
  assert.deepEqual(q.conditionKeys, ['COND_INTEGER']); assert.equal(q.metadataStatus, 'SOURCE_FIRST_PASS'); assert.equal(q.metadataReviewRequired, true);
  assert.equal(q.tagStatus, 'manual_review'); assert.equal(q.answer, ''); assert.equal(q.solution, '');
  assert.equal(q.sourceMetadataFirstPassSha, objectSha(result.report.items[0]));
  assert.equal(result.report.items[0].fieldStatus.integrationPattern.status, 'DEFERRED_TO_SOLUTION');
  assert.equal(Object.hasOwn(q, 'initialMetadataInput'), false);
});

test('unclassified compatibility input stays explicit and is never promoted to a final tag decision', () => {
  const raw = question(); delete raw.initialMetadataInput;
  const result = buildSourceMetadataFirstPass([raw], manifest, { catalog });
  assert.equal(result.report.classifiedCount, 0); assert.equal(result.report.items[0].status, 'FIRST_PASS_UNCLASSIFIED');
  assert.equal(result.questions[0].metadataReviewRequired, true); assert.equal(result.questions[0].difficultyBucket, 'UNKNOWN');
});

for (const [name, mutate, pattern] of [
  ['unknown key', input => { input.values.standardUnitKey = 'H22-NO-99'; }, /L1_INVALID/],
  ['wrong L2 parent', input => { input.values.subUnitKey = 'M1-01-PRIME_FACTORIZATION'; }, /L2_PARENT_INVALID/],
  ['cohort mismatch', input => { input.values.curriculum = '2015'; }, /COHORT_MISMATCH/],
  ['unknown advanced key', input => { input.values.problemTypeKey = 'PT_NOT_REGISTERED'; }, /CANONICAL_INVALID/],
  ['template parent mismatch', input => { input.values.templateKey = [...catalog.registry.templates.values()].find(row => row.parentProblemTypeKey !== binding.problemTypeKey).templateKey; }, /TEMPLATE_PARENT_MISMATCH/],
  ['source injection', input => { input.values.content = '덮어쓸 발문'; }, /FIELD_FORBIDDEN/],
  ['fabricated source excerpt', input => { input.sourceExcerpts = ['원문에 없는 문장']; }, /SOURCE_ANCHOR_REQUIRED/],
  ['difficulty inferred from level', input => { input.derivedFromLegacyLevel = true; }, /LEVEL_TO_DIFFICULTY_FORBIDDEN/],
]) test(`first-pass rejects ${name}`, () => {
  const raw = question(); mutate(raw.initialMetadataInput);
  assert.throws(() => buildSourceMetadataFirstPass([raw], manifest, { catalog }), pattern);
});

test('fresh solution decisions reconcile earlier tags and make a hash-bound change history without granting production PASS', t => {
  const first = buildSourceMetadataFirstPass([question()], manifest, { catalog });
  const solved = { ...first.questions[0], answer: '1', solution: '다항식을 나눈 나머지를 계산하고 정수 조건을 확인한다. 최종 값은 1이다.' };
  const decision = makeSourceMetadataRecheckDraft([solved]);
  assert.equal(Object.hasOwn(decision.items[0], 'previousMetadata'), false);
  Object.assign(decision.items[0], { values: { ...metadataProjection(solved), difficultyBucket: 2, level: '하', integrationPattern: 'SEQUENTIAL' }, reason: '풀이의 실제 계산 단계가 짧으므로 난이도 예상치를 낮추고 정수 조건의 순차 적용을 확인했다.', solutionExcerpts: ['다항식을 나눈 나머지를 계산하고 정수 조건을 확인한다.'] });
  const reconciled = reconcileSourceMetadata([solved], first.report, decision, manifest, { catalog });
  assert.equal(reconciled.questions[0].metadataStatus, 'SOLUTION_RECONCILED'); assert.equal(reconciled.questions[0].metadataReviewRequired, false);
  assert.equal(reconciled.report.items[0].status, 'ADJUSTED'); assert.ok(reconciled.report.items[0].changes.some(row => row.field === 'difficultyBucket'));
  assert.equal(reconciled.report.productionAuthorized, false);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-tag-review-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'archive-work/exams', manifest.archiveRelativePath), reports = path.join(root, 'archive-work/evidence', manifest.examId, 'reports');
  fs.mkdirSync(reports, { recursive: true }); fs.writeFileSync(path.join(reports, 'source_metadata_first_pass.json'), JSON.stringify(first.report));
  assert.deepEqual(validateSourceMetadataReconciliation(file, [solved]), ['SOURCE_METADATA_SOLUTION_RECHECK_REQUIRED']);
  fs.writeFileSync(path.join(reports, 'solution_metadata_reconciliation.json'), JSON.stringify(reconciled.report));
  assert.deepEqual(validateSourceMetadataReconciliation(file, reconciled.questions), []);
  for (const mutation of [q => { q.solution += '수정'; }, q => { q.difficultyBucket = 5; }, q => { delete q.sourceMetadataFirstPassSha; }, q => { q.content += '조건'; }]) {
    const q = structuredClone(reconciled.questions[0]); mutation(q);
    assert.ok(validateSourceMetadataReconciliation(file, [q]).length);
  }
});

test('solution recheck refuses copied projection defaults, visible prior tags, stale solution or non-anchored reasoning', () => {
  const first = buildSourceMetadataFirstPass([question()], manifest, { catalog });
  const solved = { ...first.questions[0], answer: '1', solution: '다항식을 나누면 1이다.' };
  const valid = makeSourceMetadataRecheckDraft([solved]); Object.assign(valid.items[0], { values: metadataProjection(solved), reason: '직접 계산한 결과를 기준으로 재검토했다.', solutionExcerpts: ['다항식을 나누면'] });
  for (const [mutate, pattern] of [
    [d => { d.priorTagsVisibleDuringFreshDecision = true; }, /RECHECK_CONTRACT/],
    [d => { d.items[0].solutionSha = 'stale'; }, /INPUT_STALE/],
    [d => { d.items[0].values = { standardUnitKey: 'H22-C-01' }; }, /FRESH_PROJECTION/],
    [d => { d.items[0].solutionExcerpts = ['없는 문장']; }, /SOLUTION_ANCHOR/],
    [d => { d.items[0].values.layoutTag = 'fullwidth'; }, /LAYOUT_PROTECTED/],
  ]) {
    const altered = structuredClone(valid); mutate(altered);
    assert.throws(() => reconcileSourceMetadata([solved], first.report, altered, manifest, { catalog }), pattern);
  }
});

test('canonical labels and order cannot be supplied independently of the selected unit', () => {
  assert.throws(() => validateSourceMetadata({ standardUnitKey: 'H22-C-01', standardUnit: '직선의 방정식' }, { manifest, catalog }), /LABEL_MISMATCH/);
  assert.throws(() => validateSourceMetadata({ standardUnitKey: 'H22-C-01', standardUnitOrder: 9 }, { manifest, catalog }), /ORDER_MISMATCH/);
});
