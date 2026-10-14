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
const reviewedH1Args = (packId = 'H1_FOUNDATION', packVersion = '1.0.0') => {
  const input = args();
  const row = input.meta;
  const fieldsReviewed = [
    'curriculum', 'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit',
    'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
    'level', 'difficultyBucket', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4',
    'nativeCurriculum', 'nativeTaxonomyPath', 'nativeTaxonomyAuthority', 'rpmMapping',
    'registrationPackId', 'registrationPackVersion', 'sourceJsSha256', 'difficultyConfidence', 'difficultyReason', 'classificationEvidence',
  ];
  const witness = (role, char) => ({
    role, status: 'PASS', reviewerIdentity: role + '-reviewer', ref: role + '.json',
    sha256: char.repeat(64), artifactRawSha256: char.repeat(64), sourceJsSha256: row.sourceJsSha256, questionUid,
    sourceFingerprint: row.sourceFingerprint, contentFingerprint: row.contentFingerprint, fieldsReviewed,
  });
  row.metadataStatus = 'approved_exam_meta_source';
  row.curriculum = '2015';
  row.metadataRevision = 'meta-foundation:H1_ORIGINAL_SOURCE@1.0.0:reviewed-v1';
  row.reviewStatus = 'reviewed_pass';
  row.metaFoundationStatus = 'ACTIVE';
  row.registrationPackId = 'H1_ORIGINAL_SOURCE';
  row.registrationPackVersion = '1.0.0';
  row.catalogSourceJsSha256 = 'e'.repeat(64);
  row.fieldStatus.standardUnit = 'manual_review_pending';
  row.fieldStatus.subUnit = 'manual_review_pending';
  row.approvalEvidence = [];
  row.sourceJsSha256 = 'c'.repeat(64);
  row.reviewedOriginalMetaSourceJsSha256 = row.sourceJsSha256;
  row.reviewedOriginalMetaManifestPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/h1-fast-lane-c-20261013.original.json';
  row.reviewedOriginalMetaManifestSha256 = 'd'.repeat(64);
  row.problemTypeKey = 'PT_TEST_H1';
  row.templateKey = 'TPL_TEST_H1';
  row.crossConceptKeys = ['CC_TEST_H1'];
  row.conditionKeys = ['COND_TEST_H1'];
  row.integrationPattern = 'CASE_BRANCH';
  row.level = '중';
  row.difficultyBucket = 3;
  row.difficultyConfidence = 'high';
  row.nativeL1 = '함수'; row.nativeL2 = '지수함수'; row.nativeL3 = '그래프 해석'; row.nativeL4 = '조건별 교점 판단';
  row.nativeTaxonomyPath = ['H15-C-01', 'H15-C-01-GRAPH', 'PT_TEST_H1', 'TPL_TEST_H1'];
  row.nativeTaxonomyAuthority = {
    registrationPackId: 'H1_ORIGINAL_SOURCE', registrationPackVersion: '1.0.0',
    packId, packVersion, ownerPack: packId, ownerPackVersion: packVersion,
    taxonomyOwnerPack: packId, taxonomyOwnerPackVersion: packVersion,
    templateOwnerPack: packId, templateOwnerPackVersion: packVersion,
    bindingOwnerPack: 'H1_ORIGINAL_SOURCE', bindingOwnerPackVersion: '1.0.0', bindingDisposition: 'SOURCE_EXTENSION_ACTIVE_BINDING',
    standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, problemTypeKey: row.problemTypeKey, templateKey: row.templateKey,
  };
  row.nativeMetaStatus = 'CONFIRMED';
  row.classificationEvidence = { positiveCriterion: 'directly uses the target concept', negativeCriterion: 'distinguishes the neighboring concept' };
  row.rpmMapping = { authority: 'RPM_LOCKED', lockedMasterSha256: 'c8de39f9946e221538100880e3e0932fcfa10ac907c6a68079e560feb16c394c', status: 'NO_EQUIVALENT_PATH', lockedRowIds: [] };
  row.reviewedOriginalMetaEvidence = {
    schemaVersion: 'reviewed-original-exam-meta-v1', manifestPath: row.reviewedOriginalMetaManifestPath,
    manifestSha256: row.reviewedOriginalMetaManifestSha256, metadataRevision: row.metadataRevision,
    sourceJsSha256: row.sourceJsSha256, reviewWitnesses: [witness('AUTHOR_META_REVIEW', 'f'), witness('INDEPENDENT_META', '1')],
  };
  input.identity.sourceArchiveFile = row.sourceArchiveFile;
  return input;
};

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
  assert.equal(view.metaStatus.rpmL1, 'RECORDED');
  assert.equal(view.metaStatus.rpmL2, 'RECORDED');
  assert.equal(view.problemTypeKey, null);
  assert.equal(view.templateKey, null);
  assert.equal(view.metaCompleteness, 'EVIDENCE_DEBT');
  assert.equal(view.verifiedEligible, false);
  assert.deepEqual(view.canonicalAssignmentReasons, ['canonical_parent_missing']);
  assert.equal(view.assignmentEvidence, null);
});

test('projects reviewed original H1 semantics separately from RPM and keeps eligibility evidence distinct', () => {
  const input = reviewedH1Args();
  const { projection } = metaView.createSourceBoundDisplayProjection(input);
  assert.equal(projection.projectionStatus, 'DISPLAY_ONLY_SOURCE_BOUND');
  assert.equal(projection.nativeL1, '함수');
  assert.equal(projection.nativeL4, '조건별 교점 판단');
  assert.equal(projection.problemTypeKey, 'PT_TEST_H1');
  assert.equal(projection.templateKey, 'TPL_TEST_H1');
  assert.equal(projection.sourceBinding.sourceJsSha256, input.meta.sourceJsSha256);
  assert.equal(projection.sourceBinding.catalogSourceJsSha256, input.meta.catalogSourceJsSha256);
  assert.deepEqual(projection.rpmMapping, input.meta.rpmMapping);
  assert.equal('rpmL1' in projection, false);
  const row = {
    questionUid, sourceFile, sourceOrdinal: 1, sourceKind: 'original',
    metaProjection: projection, currentSourceJsSha256: input.meta.catalogSourceJsSha256,
    metadataAssignmentEvidence: { metadataRevision: input.meta.metadataRevision },
    rpmL1: null, rpmL2: null, rpmL3: null, rpmL4: null,
  };
  const [view] = metaView.buildIndex([row], []);
  assert.equal(view.problemTypeKey, 'PT_TEST_H1');
  assert.equal(view.templateKey, 'TPL_TEST_H1');
  assert.equal(view.crossConceptKeys[0], 'CC_TEST_H1');
  assert.equal(view.conditionKeys[0], 'COND_TEST_H1');
  assert.equal(view.integrationPattern, 'CASE_BRANCH');
  assert.equal(view.difficultyBucket, 3);
  assert.equal(view.nativeL1, '함수');
  assert.equal(view.nativeCurriculum, '2015');
  assert.equal(view.nativeL4, '조건별 교점 판단');
  assert.equal(view.rpmL1, null);
  assert.equal(view.rpmL2, null);
  assert.equal(view.rpmMapping.authority, 'RPM_LOCKED');
  assert.equal(view.verifiedEligible, false);
  assert.equal(metaView.query([view], {
    integrationPattern: 'CASE_BRANCH', nativeL1: '함수', nativeL2: '지수함수', nativeL3: '그래프 해석',
    nativeL4: '조건별 교점 판단', level: '중', nativeCurriculum: '2015',
    problemTypeKey: 'PT_TEST_H1', templateKey: 'TPL_TEST_H1',
    crossConceptKeys: ['CC_TEST_H1'], conditionKeys: ['COND_TEST_H1'],
  }).length, 1);
  const [staleView] = metaView.buildIndex([{ ...row, currentSourceJsSha256: '9'.repeat(64) }], []);
  assert.equal(staleView.metaProjectionStatus, 'SOURCE_META_STALE_OR_UNAVAILABLE');
  assert.equal(staleView.problemTypeKey, null);
  assert.equal(staleView.nativeL1, null);
  assert.equal(staleView.metaStatus.nativeL1, 'STALE');
  assert.equal(staleView.directSelectable, true);
  const [unavailableView] = metaView.buildIndex([{
    questionUid, sourceFile, sourceOrdinal: 1, sourceKind: 'original',
    metadataAssignmentEvidence: { metadataRevision: 'meta-foundation:H1_ORIGINAL_SOURCE@1.0.0:reviewed-v1' },
    currentSourceJsSha256: input.meta.sourceJsSha256,
    problemTypeKey: 'PT_TEST_H1', templateKey: 'TPL_TEST_H1', nativeL1: '함수',
  }], []);
  assert.equal(unavailableView.problemTypeKey, null);
  assert.equal(unavailableView.metaProjectionStatus, 'SOURCE_META_STALE_OR_UNAVAILABLE');
});

test('fails closed when either original H1 Meta witness is absent, stale, or lacks field coverage', () => {
  const absent = reviewedH1Args();
  absent.meta.reviewedOriginalMetaEvidence.reviewWitnesses.pop();
  assert.equal(metaView.createSourceBoundDisplayProjection(absent).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
  const stale = reviewedH1Args();
  stale.meta.reviewedOriginalMetaEvidence.reviewWitnesses[1].sourceFingerprint = '9'.repeat(64);
  assert.equal(metaView.createSourceBoundDisplayProjection(stale).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
  const wrongSourceBytes = reviewedH1Args();
  wrongSourceBytes.meta.reviewedOriginalMetaEvidence.reviewWitnesses[0].sourceJsSha256 = '9'.repeat(64);
  assert.equal(metaView.createSourceBoundDisplayProjection(wrongSourceBytes).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
  const incomplete = reviewedH1Args();
  incomplete.meta.reviewedOriginalMetaEvidence.reviewWitnesses.forEach(witness => { witness.fieldsReviewed = ['problemTypeKey']; });
  assert.equal(metaView.createSourceBoundDisplayProjection(incomplete).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
  const oldR1 = reviewedH1Args();
  oldR1.meta.reviewedOriginalMetaEvidence.reviewWitnesses[0].role = 'R1_META';
  oldR1.meta.reviewedOriginalMetaEvidence.reviewWitnesses[0].status = 'REUSE_SOURCE_META_REVIEW';
  assert.equal(metaView.createSourceBoundDisplayProjection(oldR1).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
});

test('accepts an exact active non-H1 authority pack without relabeling its path as RPM', () => {
  const input = reviewedH1Args('MIDDLE1', '1.0.1');
  const { projection } = metaView.createSourceBoundDisplayProjection(input);
  assert.equal(projection.nativeTaxonomyAuthority.registrationPackId, 'H1_ORIGINAL_SOURCE');
  assert.equal(projection.nativeTaxonomyAuthority.packId, 'MIDDLE1');
  assert.equal(projection.nativeTaxonomyAuthority.ownerPack, 'MIDDLE1');
  assert.equal(projection.nativeTaxonomyAuthority.ownerPackVersion, '1.0.1');
  assert.equal('L1' in projection, false);
  assert.equal('rpmL1' in projection, false);
  const wrongVersion = reviewedH1Args('MIDDLE1', '1.0.0');
  assert.equal(metaView.createSourceBoundDisplayProjection(wrongVersion).reason, 'DISPLAY_PROJECTION_CORE_APPROVAL_MISSING');
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
  assert.match(html, /id="problemTypeKey"/);
  assert.match(html, /id="templateKey"/);
  assert.match(html, /id="crossConceptKey"/);
  assert.match(html, /id="conditionKey"/);
  assert.match(html, /id="integrationPattern"/);
  assert.match(html, /id="nativeCurriculum"/);
  assert.match(html, /id="level"/);
  assert.match(html, /id="rpmL1"/);
  assert.match(html, /원본 \$\{row\.nativeCurriculum/);
  assert.match(html, /원본 Meta 분류가 현재 자료와 연결되지 않아 표시되지 않습니다/);
  assert.match(html, /row\.nativeTaxonomyAuthority\?\.registrationPackId/);
  assert.match(html, /id="nativeL1"/);
  assert.match(html, /refreshCoreMetaKeyOptions/);
});
