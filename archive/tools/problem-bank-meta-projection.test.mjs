import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const metaView = require('../problem-bank-meta.js');
const archive2Core = require('../archive2-core.js');

const sourceFile = 'original/high/h2/1mid/23_매산고_1학기_중간_고2_수학I.js';
const questionUid = 'qid_v1_' + 'a'.repeat(64);
const meta = () => ({
  questionUid,
  sourceArchiveFile: sourceFile,
  sourceOrdinal: 1,
  sourceFingerprint: 'a'.repeat(64),
  contentFingerprint: 'b'.repeat(64),
  metadataStatus: 'approved_partial_with_explicit_holds',
  fieldStatus: { standardUnit: 'approved_source', subUnit: 'approved_source', problemType: 'manual_review_pending', template: 'manual_review_pending' },
  standardCourse: '수학I',
  standardUnitKey: 'H15-M1-03',
  standardUnit: '지수함수',
  subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION',
  subUnit: '지수함수의 활용',
  approvalEvidence: ['R1.evidence.json'],
});
const identity = () => ({ questionUid, sourceArchiveFile: sourceFile, sourceOrdinal: 1 });
const scopeParent = () => ({
  grade: '고2', curriculumKey: '2015', courseKey: '수학I', standardUnitKey: 'H15-M1-03',
  subUnitKey: '', L1: '지수함수와 로그함수', L2: '지수함수',
});
const canonicalParent = () => ({ curriculumKey: '2015', courseKey: '수학I', L1: '지수함수와 로그함수', L2: '지수함수' });
const args = () => ({
  meta: meta(), identity: identity(), sourceFile, sourceOrdinal: 1, sourceGrade: '고2',
  sourceFingerprint: 'a'.repeat(64), assignmentFingerprint: 'b'.repeat(64),
  gradeCourseAllowlist: [{ grade: '고2', curriculumKey: '2015', courseKey: '수학I' }],
  scopeParents: [scopeParent()], canonicalParents: [canonicalParent()],
});

test('creates a display-only projection from a source-bound approved core tag and unique canonical parent', () => {
  const result = metaView.createSourceBoundDisplayProjection(args());
  assert.equal(result.reason, '');
  assert.equal(result.projection.projectionStatus, 'DISPLAY_ONLY_SOURCE_BOUND');
  assert.equal(result.projection.displayOnly, true);
  assert.equal(result.projection.standardCourse, '수학I');
  assert.equal(result.projection.standardUnitKey, 'H15-M1-03');
  assert.equal(result.projection.subUnitKey, 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION');
  assert.equal(result.projection.L1, '지수함수와 로그함수');
  assert.equal(result.projection.L2, '지수함수');
  assert.equal(result.projection.parentBinding.resolution, 'CANONICAL_PARENT_LABEL_ONLY');
  assert.equal('problemTypeKey' in result.projection, false);
  assert.equal('templateKey' in result.projection, false);
});

test('uses an exact canonical subunit link when available', () => {
  const input = args();
  input.scopeParents = [{ ...scopeParent(), subUnitKey: meta().subUnitKey }];
  const result = metaView.createSourceBoundDisplayProjection(input);
  assert.equal(result.projection.parentBinding.resolution, 'EXACT_CANONICAL_SUBUNIT');
});

test('fails closed for stale source or assignment fingerprints', () => {
  const staleSource = args();
  staleSource.sourceFingerprint = 'c'.repeat(64);
  assert.equal(metaView.createSourceBoundDisplayProjection(staleSource).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
  const staleAssignment = args();
  staleAssignment.assignmentFingerprint = 'c'.repeat(64);
  assert.equal(metaView.createSourceBoundDisplayProjection(staleAssignment).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
});

test('fails closed for mismatched identity, unapproved core fields, or missing evidence', () => {
  const wrongIdentity = args();
  wrongIdentity.identity.sourceOrdinal = 2;
  assert.equal(metaView.createSourceBoundDisplayProjection(wrongIdentity).reason, 'DISPLAY_PROJECTION_IDENTITY_MISMATCH');
  const unapproved = args();
  unapproved.meta.fieldStatus.subUnit = 'manual_review_pending';
  assert.equal(metaView.createSourceBoundDisplayProjection(unapproved).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
  const noEvidence = args();
  noEvidence.meta.approvalEvidence = [];
  assert.equal(metaView.createSourceBoundDisplayProjection(noEvidence).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
});

test('fails closed for disallowed courses and absent or ambiguous canonical parents', () => {
  const disallowed = args();
  disallowed.gradeCourseAllowlist = [];
  assert.equal(metaView.createSourceBoundDisplayProjection(disallowed).reason, 'DISPLAY_PROJECTION_COURSE_NOT_ALLOWED');
  const absent = args();
  absent.scopeParents = [];
  assert.equal(metaView.createSourceBoundDisplayProjection(absent).reason, 'DISPLAY_PROJECTION_PARENT_MISSING');
  const ambiguous = args();
  ambiguous.scopeParents = [scopeParent(), { ...scopeParent(), L2: '다른 L2' }];
  assert.equal(metaView.createSourceBoundDisplayProjection(ambiguous).reason, 'DISPLAY_PROJECTION_PARENT_AMBIGUOUS');
});

test('original projection consumes only typed display-only metadata and does not confer verified eligibility', () => {
  const { projection } = metaView.createSourceBoundDisplayProjection(args());
  const row = {
    questionUid, sourceFile, sourceOrdinal: 1, sourceKind: 'original',
    canonicalAssignmentReasons: ['canonical_parent_missing'],
    assignmentEvidence: null, metaProjection: projection,
    problemTypeKey: null, templateKey: null,
  };
  const [view] = metaView.buildIndex([row], []);
  assert.equal(view.standardCourse, '수학I');
  assert.equal(view.standardUnitKey, 'H15-M1-03');
  assert.equal(view.standardUnit, '지수함수');
  assert.equal(view.subUnitKey, 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION');
  assert.equal(view.subUnit, '지수함수의 활용');
  assert.equal(view.rpmL1, '지수함수와 로그함수');
  assert.equal(view.rpmL2, '지수함수');
  assert.equal(view.metaStatus.rpmL1, 'CONFIRMED');
  assert.equal(view.metaStatus.rpmL2, 'CONFIRMED');
  assert.equal(view.problemTypeKey, null);
  assert.equal(view.templateKey, null);
  assert.equal(view.metaCompleteness, 'EVIDENCE_DEBT');
  assert.equal(view.verifiedEligible, false);
  assert.deepEqual(view.canonicalAssignmentReasons, ['canonical_parent_missing']);
  assert.equal(view.assignmentEvidence, null);
});

test('ignores untyped or unavailable nested projections', () => {
  const [view] = metaView.buildIndex([{
    questionUid, sourceFile, sourceOrdinal: 1, sourceKind: 'original',
    standardCourse: '기존 과목', L1: '기존 L1', L2: '기존 L2',
    meta: { standardCourse: '오염 중첩 과목', L1: '오염 중첩 L1', L2: '오염 중첩 L2' },
    metaProjection: { projectionStatus: 'DISPLAY_PROJECTION_UNAVAILABLE', displayOnly: true,
      standardCourse: '오염 과목', L1: '오염 L1', L2: '오염 L2' },
  }], []);
  assert.equal(view.standardCourse, '기존 과목');
  assert.equal(view.rpmL1, '기존 L1');
  assert.equal(view.rpmL2, '기존 L2');
});

test('projects all twenty published Maesan Math I core tags for search without changing canonical assignment status', () => {
  const packed = JSON.parse(fs.readFileSync(new URL('../data/archive2-catalog.json', import.meta.url), 'utf8'));
  const catalog = archive2Core.decodeCatalog(packed);
  const tagMasterBytes = fs.readFileSync(new URL('../data/master_tables/js_archive_tag_master.json', import.meta.url));
  const tagMaster = JSON.parse(tagMasterBytes.toString('utf8'));
  const sha256 = bytes => require('node:crypto').createHash('sha256').update(bytes).digest('hex');
  assert.equal(catalog.coreMetaFilterAuthority.path, 'data/master_tables/js_archive_tag_master.json');
  assert.equal(catalog.coreMetaFilterAuthority.sha256, sha256(tagMasterBytes));
  const newlyApprovedKeys = [
    'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH',
    'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION',
    'H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH',
    'H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION',
  ];
  for (const key of newlyApprovedKeys) {
    const option = catalog.coreMetaFilterOptions.subUnits.find(row => row.subUnitKey === key);
    assert.ok(option);
    assert.ok(option.standardCourses.includes('수학I'));
    assert.ok(tagMaster.some(row => row.keyType === 'subUnitKey' && row.key === key && row.status === 'active'));
  }
  const targetRows = catalog.records.filter(row => row.sourceFile === sourceFile);
  assert.equal(targetRows.length, 20);
  assert.ok(targetRows.every(row => row.metaProjectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND'));
  assert.ok(targetRows.every(row => row.metaProjection?.displayOnly === true));
  assert.ok(targetRows.every(row => row.canonicalAssignmentReasons.includes('canonical_parent_missing')));
  const projected = metaView.buildIndex(targetRows, []);
  const filtered = metaView.query(projected, { standardCourse: '수학I' });
  assert.equal(filtered.length, 20);
  assert.deepEqual(filtered.map(row => row.sourceOrdinal).sort((a, b) => a - b), Array.from({ length: 20 }, (_, i) => i + 1));
  assert.ok(filtered.every(row => row.rpmL1 && row.rpmL2 && row.standardCourse === '수학I'));
  assert.ok(filtered.every(row => row.verifiedEligible === false));
  const q10 = filtered.find(row => row.sourceOrdinal === 10);
  assert.equal(q10.standardUnit, '지수함수');
  assert.equal(q10.standardUnitKey, 'H15-M1-03');
  assert.equal(q10.subUnit, '지수함수의 활용');
  assert.equal(q10.subUnitKey, 'H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION');
  const expectedByKey = new Map([
    ['H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH', []],
    ['H15-M1-03-EXPONENTIAL_FUNCTION_APPLICATION', [10]],
    ['H15-M1-04-LOGARITHMIC_FUNCTION_GRAPH', [12]],
    ['H15-M1-04-LOGARITHMIC_FUNCTION_APPLICATION', [18]],
  ]);
  for (const [key, expectedQids] of expectedByKey) {
    const matches = metaView.query(projected, { subUnitKey: key });
    assert.deepEqual(matches.map(row => row.sourceOrdinal).sort((a, b) => a - b), expectedQids);
  }
  const exponentialGraphOption = catalog.coreMetaFilterOptions.subUnits.find(row => row.subUnitKey === 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH');
  assert.equal(exponentialGraphOption.label, '지수함수의 그래프');
  assert.deepEqual(metaView.query(projected, { standardUnitKey: 'H15-M1-03', subUnitKey: 'H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH' }), []);
  assert.deepEqual(targetRows.filter(row => row.metaProjection).map(row => row.metaProjection.subUnitKey).includes('H15-M1-03-EXPONENTIAL_FUNCTION_GRAPH'), false);
  const html = fs.readFileSync(new URL('../problem-bank-search.html', import.meta.url), 'utf8');
  assert.match(html, /<select id="standardUnitKey">/);
  assert.match(html, /<select id="subUnitKey">/);
  assert.match(html, /f\.standardUnitKey=el\('standardUnitKey'\)\.value/);
  assert.match(html, /f\.subUnitKey=el\('subUnitKey'\)\.value/);
  assert.match(html, /refreshCoreMetaKeyOptions/);
});
