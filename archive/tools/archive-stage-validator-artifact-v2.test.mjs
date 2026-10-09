import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectSha } from './pipeline-core/canonical.mjs';
import { STUDENT_FIELDS, normalizeStudentBundle } from './archive-student-bundle.mjs';
import { validateArtifactContract, QUALITY_CONTRACT_V2 } from './archive-stage-validator-artifact-v2.mjs';
import {
  makeMetaValidatorReceipt,
  questionUidForSource,
  resolveMetaRoute,
  validateResolverEvidence,
} from './meta-foundation/rpm-active-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json';
const crosswalk = JSON.parse(fs.readFileSync(path.join(root, crosswalkPath), 'utf8'));
const rpmRow = crosswalk.records.find(row => row.curriculum === '2015' && row.mappingStatus === 'RPM_ONLY');

function fixture(standardCourse = '기하') {
  const q = {
    id: 1, level: '중', category: '', originalCategory: '', questionType: '객관식', layoutTag: '', tags: [], wide: false,
    content: '점 P의 좌표를 구하여라.', choices: ['1', '2'], answer: '1', solution: '좌표를 대입한다.\\n정답은 1이다.',
    standardCourse, standardUnitKey: rpmRow.standardUnitKey, standardUnit: '이차곡선', standardUnitOrder: 0,
    subUnitKey: null, subUnit: '정의와 방정식', subUnitConfidence: 'high', subUnitClassificationDepth: 'L2',
    problemTypeKey: null, templateKey: null, crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  };
  const sourceArchiveFile = 'archive/exams/original/high/h2/1mid/fixture.js';
  const input = {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, 1),
      sourceIdentityKey: objectSha('source fixture') + '|1',
      sourceOrdinal: 1,
      contentHash: objectSha(q.content),
      choicesHash: objectSha(q.choices),
      imageRefHash: objectSha({ image: '', visualAsset: '', fullPageImagePath: '', fullPageImageRelPath: '', sourceEvidencePath: '', sourcePageEvidencePaths: [] }),
    },
    solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: true, solutionHash: objectSha(q.solution) },
    curriculumContext: { grade: 'H2', curriculum: '2015', scope: '기하', subjectFamily: 'GEOMETRY', standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, subUnitKey: '' },
    semanticDecision: { primaryMethod: '정의에 따라 좌표를 대입한다.', decisiveStep: '정의 식에 좌표를 대입한다.', rpmPath: { curriculum: '2015', scope: '기하', ...rpmRow.rpmPath } },
  };
  const resolverEvidence = resolveMetaRoute(input, { repoRoot: root });
  const resolverValidation = validateResolverEvidence(input, resolverEvidence, { repoRoot: root });
  assert.equal(resolverValidation.status, 'PASS');
  assert.equal(resolverEvidence.semanticStatus, 'FINAL');
  assert.equal(resolverEvidence.projectionStatus, 'PROJECTION_UNMATERIALIZED');
  const disposition = {
    qid: 1,
    metaDebtFields: ['subUnitKey', 'problemTypeKey', 'templateKey'],
    metaDebtReason: 'H2 2015 Geometry RPM_ONLY has no current ACTIVE L2 compatibility projection.',
    rpmOnlyNullSubUnitProjection: {
      schemaVersion: 'JS_ARCHIVE_RPM_ONLY_NULL_SUBUNIT_PROJECTION_V1',
      input,
      resolverEvidence,
      validatorReceipt: makeMetaValidatorReceipt(resolverEvidence, resolverValidation),
    },
  };
  const evidence = {
    qualityContractVersion: QUALITY_CONTRACT_V2,
    examUid: 'fixture',
    artifactSha: objectSha('fixture artifact'),
    artifactDispositions: { artifactSha: objectSha('fixture artifact'), rows: [disposition] },
  };
  return { q, disposition, evidence };
}

function issuesFor({ q, disposition, evidence }, { stage = 'R3', assetRoot = path.join(root, 'archive') } = {}) {
  return validateArtifactContract({ stage, evidence, questions: [q], repoRoot: root, assetRoot }).issues;
}

const literalSelectorMarkers = ['①', '②', '③', '④', '⑤'];

function studentPayloadSha256ViaAdapter(question) {
  const student = Object.fromEntries(Object.entries(question).filter(([key]) => STUDENT_FIELDS.has(key)));
  const sourceRawSha256 = 'a'.repeat(64);
  let assetRoot;
  let assets = [];
  try {
    if (student.image) {
      assetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-student-payload-'));
      const assetBytes = Buffer.from('fixture student asset bytes');
      const assetPath = path.join(assetRoot, student.image);
      fs.mkdirSync(path.dirname(assetPath), { recursive: true });
      fs.writeFileSync(assetPath, assetBytes);
      assets = [{ ref: student.image, path: assetPath, sha256: createHash('sha256').update(assetBytes).digest('hex') }];
    }
    const normalized = normalizeStudentBundle({
      sourceRawSha256,
      rows: [{ qid: Number(question.id), student, assets }],
    }, { expectedSourceRawSha256: sourceRawSha256 });
    return normalized.rows[0].studentPayloadSha256;
  } finally {
    if (assetRoot) fs.rmSync(assetRoot, { recursive: true, force: true });
  }
}

function selectorFixture(referenceKind = 'QUESTION_CONTENT') {
  const f = fixture();
  f.q.choices = [...literalSelectorMarkers];
  f.q.preserveChoicePrefixes = false;
  f.q.content = '다음 풀이에서 첫 오류를 고르시오: ' + literalSelectorMarkers.join(' → ');
  const sourceArchiveFile = 'archive/exams/original/high/h2/1mid/fixture.js';
  const baselineSourceRawSha256 = 'a'.repeat(64);
  const sourceParity = {
    sourceArchiveFile,
    sourceOrdinal: 1,
    baselineSourceRawSha256,
    choicesExact: true,
  };
  f.evidence.sourceIdentity = {
    productionRelativePath: sourceArchiveFile,
    extractedBaselineSha256: baselineSourceRawSha256,
  };
  f.evidence.expectedSourceRawSha256 = 'c'.repeat(64);
  f.evidence.rows = [{ qid: 1, provenanceEvidence: { sourceParity } }];

  let sourceReference;
  if (referenceKind === 'QUESTION_CONTENT') {
    sourceReference = {
      kind: 'QUESTION_CONTENT',
      field: 'content',
      contentSha256: objectSha(f.q.content),
      markersObserved: [...literalSelectorMarkers],
      reviewed: true,
      observation: 'The exact ordered selector glyphs are present in the source question text.',
    };
  } else {
    f.q.image = 'assets/images/fixture/selector.png';
    sourceReference = {
      kind: 'PROBLEM_ASSET',
      ref: f.q.image,
      assetSha256: null,
      opened: true,
      sourceFidelity: 'EXACT_EXTRACTED_IMAGE',
      markersObserved: [...literalSelectorMarkers],
      observation: 'The exact ordered selector glyphs are visible in the opened source image.',
    };
  }

  const qEntries = Object.entries(f.q);
  const studentEntriesInSourceOrder = qEntries.filter(([key]) => STUDENT_FIELDS.has(key));
  const studentOrder = studentEntriesInSourceOrder.map(([key]) => key);
  const whitelistOrder = [...STUDENT_FIELDS].filter(key => Object.hasOwn(f.q, key));
  f.q = Object.fromEntries([
    ...studentEntriesInSourceOrder.reverse(),
    ...qEntries.filter(([key]) => !STUDENT_FIELDS.has(key)),
  ]);
  assert.notDeepEqual(studentOrder.reverse(), whitelistOrder, 'fixture must exercise a source-order variant');

  f.disposition.literalChoiceSelectorProof = {
    schemaVersion: 'JS_ARCHIVE_LITERAL_SELECTOR_PROOF_V1',
    qid: 1,
    artifactSha: f.evidence.artifactSha,
    studentPayloadSha256: studentPayloadSha256ViaAdapter(f.q),
    choicesSha256: objectSha(f.q.choices),
    markers: [...literalSelectorMarkers],
    sourceParity: { ...sourceParity },
    sourceReference,
  };
  return f;
}

test('accepts only resolver-proven H2 2015 Geometry RPM_ONLY null subUnitKey', () => {
  const f = fixture();
  assert.deepEqual(issuesFor(f), []);
});

test('accepts the canonical H2 2015 course label 기하와 벡터 for the same RPM proof', () => {
  const f = fixture('기하와 벡터');
  assert.deepEqual(issuesFor(f), []);
});

test('rejects arbitrary null subUnitKey without projection proof', () => {
  const f = fixture();
  delete f.disposition.rpmOnlyNullSubUnitProjection;
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
});

test('rejects altered resolver evidence and retains canonical authority hash checks', () => {
  const f = fixture();
  f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence.authorityRefs[0].sha256 = 'sha256:' + '0'.repeat(64);
  f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence.evidenceSha = objectSha(f.disposition.rpmOnlyNullSubUnitProjection.resolverEvidence);
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
});

test('rejects projection proof reused for an unknown course or curriculum', () => {
  const f = fixture();
  f.disposition.rpmOnlyNullSubUnitProjection.input.curriculumContext.curriculum = '2099';
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
});

test('rejects a projection proof relabeled to an unknown standardCourse', () => {
  const f = fixture();
  f.q.standardCourse = '미분과 적분';
  f.disposition.rpmOnlyNullSubUnitProjection.input.curriculumContext.standardCourse = '미분과 적분';
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_RPM_ONLY_NULL_SUBUNIT_PROOF_INVALID:q1'));
  assert.ok(issues.includes('ARTIFACT_META_VALUE_REQUIRED:subUnitKey:q1'));
});

test('does not treat missing subUnitKey as the supported nullable projection', () => {
  const f = fixture();
  delete f.q.subUnitKey;
  const issues = issuesFor(f);
  assert.ok(issues.includes('ARTIFACT_META_FIELD_REQUIRED:subUnitKey:q1'));
});

function nonNullSubUnitFixture(standardUnitKey, subUnitKey, standardCourse = '기하와 벡터') {
  const f = fixture();
  f.q.standardCourse = standardCourse;
  f.q.standardUnitKey = standardUnitKey;
  f.q.subUnitKey = subUnitKey;
  f.q.subUnit = '기존 메타 라벨';
  f.disposition.metaDebtFields = ['problemTypeKey', 'templateKey'];
  delete f.disposition.rpmOnlyNullSubUnitProjection;
  return f;
}

test('rejects synthetic and other unregistered H15 geometry child keys on RPM_ONLY L1s', () => {
  for (const [unitKey, key] of [
    ['H15-GV-09', 'H15-GV-09-CORE'],
    ['H15-GV-09', 'H15-GV-09-INVENTED_CHILD'],
    ['H15-GV-07', 'H15-GV-07-CORE'],
  ]) {
    const f = nonNullSubUnitFixture(unitKey, key);
    assert.ok(issuesFor(f).includes('ARTIFACT_META_GEOMETRY_RPM_ONLY_NONCANONICAL_SUBUNIT_KEY:q1'), key);
  }
});

test('keeps an existing H15 legacy parent key and registered H22 geometry legacy child key valid', () => {
  const h15 = nonNullSubUnitFixture('H15-GV-09', 'H15-GV-09');
  assert.deepEqual(issuesFor(h15), []);
  const h22 = nonNullSubUnitFixture('H22-GE-01', 'H22-GE-01-CORE', '기하');
  const registered = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8')).records;
  assert.ok(registered.some(row => row.standardCourse === '기하' && row.standardUnitKey === 'H22-GE-01' && row.subUnitKey === 'H22-GE-01-CORE'));
  assert.deepEqual(issuesFor(h22), []);
});

test('accepts a content-referenced selector proof through CREATE/R1/R2/R3 and R3 full-qid dispositions', () => {
  for (const stage of ['CREATE', 'R1', 'R2', 'R3']) {
    const f = selectorFixture();
    if (stage === 'R3') f.evidence.rows = [];
    const issues = issuesFor(f, { stage });
    assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:')), false, `${stage}: ${issues.join(',')}`);
  }
});

test('binds student payload through normalizeStudentBundle in original source field order', () => {
  const f = selectorFixture();
  const sourceOrder = Object.keys(f.q).filter(key => STUDENT_FIELDS.has(key));
  const whitelistOrder = [...STUDENT_FIELDS].filter(key => Object.hasOwn(f.q, key));
  assert.notDeepEqual(sourceOrder, whitelistOrder);
  assert.equal(f.disposition.literalChoiceSelectorProof.studentPayloadSha256, studentPayloadSha256ViaAdapter(f.q));
  const issues = issuesFor(f);
  assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:')), false, issues.join(','));
});

test('keeps immutable intake baseline binding distinct from a changed current source SHA', () => {
  const f = selectorFixture();
  f.evidence.expectedSourceRawSha256 = 'c'.repeat(64);
  f.evidence.sourceInputArtifactSha256 = 'd'.repeat(64);
  f.evidence.sourceIdentity.extractedBaselineSha256 = 'a'.repeat(64);
  assert.equal(issuesFor(f).some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:')), false);
  f.evidence.sourceIdentity.extractedBaselineSha256 = 'b'.repeat(64);
  assert.ok(issuesFor(f).includes('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q1:i0'));
});

test('accepts an asset-referenced selector proof only when the current referenced bytes match its SHA', () => {
  const f = selectorFixture('PROBLEM_ASSET');
  delete f.q.preserveChoicePrefixes;
  f.disposition.literalChoiceSelectorProof.studentPayloadSha256 = studentPayloadSha256ViaAdapter(f.q);
  const assetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-literal-selector-'));
  const assetPath = path.join(assetRoot, f.q.image);
  const assetBytes = Buffer.from('fixture source image bytes');
  fs.mkdirSync(path.dirname(assetPath), { recursive: true });
  fs.writeFileSync(assetPath, assetBytes);
  f.disposition.literalChoiceSelectorProof.sourceReference.assetSha256 = createHash('sha256').update(assetBytes).digest('hex');
  try {
    const issues = issuesFor(f, { assetRoot });
    assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:')), false, issues.join(','));
    assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_ASSET_REF_INVALID:')), false, issues.join(','));
    f.disposition.literalChoiceSelectorProof.sourceReference.assetSha256 = '0'.repeat(64);
    assert.ok(issuesFor(f, { assetRoot }).includes('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q1:i0'));
  } finally {
    fs.rmSync(assetRoot, { recursive: true, force: true });
  }
});

test('keeps choice-label rejection for absent, stale, mismatched, or unreferenced selector proof', () => {
  const mutations = [
    f => { delete f.evidence.artifactDispositions; },
    f => { delete f.disposition.literalChoiceSelectorProof; },
    f => { f.disposition.literalChoiceSelectorProof.artifactSha = 'stale-artifact'; },
    f => { f.disposition.literalChoiceSelectorProof.studentPayloadSha256 = '0'.repeat(64); },
    f => { f.disposition.literalChoiceSelectorProof.choicesSha256 = '0'.repeat(64); },
    f => { f.disposition.literalChoiceSelectorProof.qid = 2; },
    f => { f.disposition.literalChoiceSelectorProof.sourceParity.choicesExact = false; },
    f => { f.evidence.rows[0].provenanceEvidence.sourceParity.sourceArchiveFile = 'original/high/h2/1mid/other.js'; },
    f => { f.evidence.rows[0].provenanceEvidence.sourceParity.sourceOrdinal = 2; },
    f => { f.evidence.rows[0].provenanceEvidence.sourceParity.baselineSourceRawSha256 = 'b'.repeat(64); },
    f => { f.evidence.sourceIdentity.productionRelativePath = 'archive/exams/original/high/h2/1mid/other.js'; },
    f => { f.evidence.sourceIdentity.extractedBaselineSha256 = 'b'.repeat(64); },
    f => {
      f.q.content = '원본 marker reference가 없는 본문';
      f.disposition.literalChoiceSelectorProof.sourceReference.contentSha256 = objectSha(f.q.content);
      f.disposition.literalChoiceSelectorProof.studentPayloadSha256 = studentPayloadSha256ViaAdapter(f.q);
    },
  ];
  for (const [index, mutate] of mutations.entries()) {
    const f = selectorFixture();
    mutate(f);
    const issues = issuesFor(f);
    assert.ok(issues.includes('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q1:i0'), `mutation ${index}: ${issues.join(',')}`);
  }
});

test('rejects forced prefix preservation and appended, reordered, partial, repeated, extra, unknown, and empty choices', () => {
  const mutations = [
    f => { f.q.preserveChoicePrefixes = true; },
    f => { f.q.preserveChoicePrefixes = 'true'; },
    f => { f.q.preserveChoicePrefixes = 1; },
    f => { f.q.choices[0] = '① appended text'; },
    f => { f.q.choices = ['②', '①', '③', '④', '⑤']; },
    f => { f.q.choices = ['①', '②', '③']; },
    f => { f.q.choices = ['①', '②', '③', '④', '④']; },
    f => { f.q.choices = ['①', '②', '③', '④', '⑥']; },
    f => { f.q.choices = ['⑥', '⑦', '⑧', '⑨', '⑩']; },
    f => { f.q.choices = ['①', '②', '③', '④', '']; },
    f => { f.q.choices = []; },
  ];
  for (const mutate of mutations) {
    const f = selectorFixture();
    mutate(f);
    const issues = issuesFor(f);
    assert.notDeepEqual(issues, [], `unexpected acceptance for ${JSON.stringify(f.q.choices)}`);
    if (f.q.choices.some(choice => typeof choice === 'string' && /^\s*[①②③④⑤]/.test(choice))) {
      assert.ok(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:q1:')));
    }
    if (f.q.choices.length > 0 && f.q.choices.every(choice => typeof choice === 'string' && /^[①-⑳]$/u.test(choice))) {
      assert.ok(issues.includes('ARTIFACT_CHOICE_LITERAL_SELECTOR_UNSUPPORTED:q1'));
    }
    if (f.q.choices.length === 0) assert.ok(issues.includes('ARTIFACT_CHOICE_LITERAL_SELECTOR_PROOF_INVALID:q1'));
  }
});

test('does not treat a normal subjective empty choices array as a literal-selector proof failure', () => {
  const f = fixture();
  f.q.choices = [];
  const issues = issuesFor(f);
  assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_LITERAL_SELECTOR_')), false, issues.join(','));
  assert.equal(issues.some(issue => issue.startsWith('ARTIFACT_CHOICE_ENGINE_LABEL_DUPLICATED:')), false, issues.join(','));
});
