// "틀린 유형 기준" 후보 선정(ClinicRecommendations.build의 selectionBasis: 'wrong_type').
// 순수 함수만 돌린다(화면·카탈로그 파일을 읽지 않는다): 가짜 학생 기록 + 작은 합성 카탈로그.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');

const Recs = require(path.join(__dirname, '../apmath/js/clinic-recommendations.js'));
const Derive = require(path.join(__dirname, '../archive/archive2-derive.js'));

const uid = (n) => `qid_v1_${n.toString(16).padStart(64, '0')}`;
const GRADE_RANK = { 고1: 1, 고2: 2, 고3: 3 };

// archive2Core 대역: 후보 자격 판정은 이 테스트의 관심사가 아니라 합성 레코드에 맞춘 최소 구현이다.
const core = {
  gradeRank: (grade) => GRADE_RANK[String(grade || '')] || 0,
  generalUseEligibility: (record) => ({ ok: record.identityStatus === 'VERIFIED' && record.sourceIntegrityStatus === 'VERIFIED' }),
  difficultyEligible: (record) => Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5,
  pathKey: (meta, depth) => JSON.stringify(['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4'].slice(0, depth).map((f) => String(meta[f] || ''))),
  advancedEligible: () => true,
};

// 단원 두 개(A, B) × 유형(PT) 세 개 × 세부 유형(TPL) 여럿. 모두 고1 수학 같은 L1.
function record(n, { unit, pt, tpl, bucket = 2, grade = '고1', file = 'original/high/h1/1mid/fx.js' }) {
  return {
    questionUid: uid(n), sourceFile: file, sourceOrdinal: n, sourceQuestionNo: n, sourceGrade: grade,
    identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceFingerprint: `fp${n}`,
    curriculumKey: '2022', courseKey: 'H1', L1: unit, L2: `${unit}-2`, L3: `${unit}-3`,
    problemTypeKey: pt, templateKey: tpl, difficultyBucket: bucket,
  };
}
// 오답이 될 문항 3개(유형 2종): 1번 PT_X/TPL_X1, 2번 PT_X/TPL_X1(같은 유형 다른 오답), 3번 PT_Y/TPL_Y1
const WRONG = [
  record(1, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 2 }),
  record(2, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 3 }),
  record(3, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1', bucket: 2 }),
];
const POOL = [
  record(11, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 2 }),
  record(12, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 3 }),
  record(13, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 2 }),
  record(14, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X2', bucket: 2 }),
  record(21, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1', bucket: 2 }),
  record(22, { unit: 'B', pt: 'PT_Y', tpl: 'TPL_Y1', bucket: 3 }),
  record(23, { unit: 'B', pt: 'PT_Z', tpl: 'TPL_Z1', bucket: 2 }),
  record(31, { unit: 'A', pt: 'PT_W', tpl: 'TPL_W1', bucket: 2 }),
  record(91, { unit: 'A', pt: 'PT_X', tpl: 'TPL_X1', bucket: 2, grade: '고2' }), // 학년 초과(반은 고1)
];
const CATALOG = [...WRONG, ...POOL];

// 학생 s1: 세션 e1(시험 a1)에서 1·2·3번 모두 오답 + 4번은 정답. 세션 e0(옛 시험)에서 11번(후보)을 이미 풀었다.
function snapshotRow(sessionId, orderNo, rec, status) {
  const meta = {};
  for (const field of ['curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'problemTypeKey', 'templateKey', 'difficultyBucket']) meta[field] = rec[field];
  return {
    session_id: sessionId, order_no: orderNo, result_status: status,
    source_question_uid: rec.questionUid, source_archive_file: rec.sourceFile, source_question_ordinal: rec.sourceOrdinal,
    source_question_no: rec.sourceQuestionNo, source_identity_status: 'VERIFIED', canonicalMeta: meta,
  };
}
function history(extra = {}) {
  return {
    sessions: [
      { id: 'e1', student_id: 's1', assignment_id: 'a1', question_count: 4, exam_date: '2026-11-20' },
      { id: 'e0', student_id: 's1', assignment_id: 'a0', question_count: 1, exam_date: '2026-10-01' },
      { id: 'o1', student_id: 's2', assignment_id: 'a1', question_count: 4, exam_date: '2026-11-20' },
    ],
    resultItems: [
      snapshotRow('e1', 1, WRONG[0], 'wrong'), snapshotRow('e1', 2, WRONG[1], 'wrong'), snapshotRow('e1', 3, WRONG[2], 'wrong'),
      snapshotRow('e1', 4, POOL[7], 'correct'),
      snapshotRow('e0', 1, POOL[0], 'correct'),
      snapshotRow('o1', 1, WRONG[2], 'wrong'), snapshotRow('o1', 2, POOL[7], 'correct'),
      snapshotRow('o1', 3, POOL[7], 'correct'), snapshotRow('o1', 4, POOL[7], 'correct'),
    ],
    assignmentQuestions: [], wrongAnswers: [],
    ...extra,
  };
}
function baseInput(extra = {}) {
  return {
    ...history(), studentIds: ['s1', 's2'], candidateRecords: CATALOG, archive2Core: core, canonicalAuthority: null,
    targetGrade: '고1', countPerStudent: 5, recommendationOptions: { countPerStudent: 5, difficultyMode: 'match_wrong', selectedDifficultyBuckets: [] },
    ...extra,
  };
}
const sha = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

// 기존 방식(개념 경로 기준)의 출력 지문: 이 변경 전 코드로 한 번 잰 값. 다르면 기존 방식 결과가 바뀐 것이다.
const PATH_MODE_GOLDEN = '3b5b1e26ecb9c4ac13956ef3585b32ddd2ac1e35564f6979b48b931a58478d35';

// ---- 화면 어댑터(clinic-print.js의 clinicPrintBuildTypeLadder)를 가짜 window로 돌려 진짜 archive2-derive와 연결한다 ----
const fs = require('node:fs');
const vm = require('node:vm');
function loadClinicPrint() {
  const win = {
    addEventListener() {}, Archive2Core: core, Archive2Derive: Derive, ClinicRecommendations: Recs,
    // 통합 단원 색인 대역: 모든 문항을 (고1, 수학) 묶음, 단원 = L1 로 놓는다.
    Archive2UnifiedUnits: {
      buildIndex(records) {
        const byUid = new Map();
        for (const r of records) byUid.set(r.questionUid, { grade: '고1', subject: '수학', unitKey: r.L1, originalCurriculum: '2022', unclassified: false });
        return { byUid, byRecord: new Map() };
      },
    },
  };
  const context = {
    window: win,
    document: { getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; } },
    state: { db: {} }, localStorage: { getItem() { return null; }, setItem() {} }, URL, URLSearchParams, console,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../apmath/js/clinic-print.js'), 'utf8'), context);
  return context;
}
const catalogOf = (records) => ({ records, catalog: { projectionPolicy: null } });
const mapUids = (items) => items.map((item) => item.sourceQuestionUid);
const num = (u) => parseInt(u.slice(-8), 16);

function buildType(extra = {}, { buckets = null, grade = '고1', records = CATALOG } = {}) {
  const c = loadClinicPrint();
  const catalog = catalogOf(records);
  const ladder = c.clinicPrintBuildTypeLadder(catalog, grade, buckets);
  const prepared = c.clinicPrintGetPreparedCandidateRecords(catalog);
  return Recs.build(baseInput({ candidateRecords: prepared, selectionBasis: 'wrong_type', typeLadder: ladder, targetGrade: grade, ...extra }));
}

test('기존 방식(개념 경로 기준) 결과가 이 변경 전과 같다', () => {
  assert.equal(sha(Recs.build(baseInput())), PATH_MODE_GOLDEN);
  // selectionBasis를 명시해도(기본값) 같다
  assert.equal(sha(Recs.build(baseInput({ selectionBasis: 'concept_path' }))), PATH_MODE_GOLDEN);
});

test('틀린 UID 3개(유형 2종): 새 방식 후보는 그 2종에 속하고 이미 본·틀린 문항·상위 학년은 없다', () => {
  const result = buildType({ countPerStudent: 4, recommendationOptions: { countPerStudent: 4, difficultyMode: 'match_wrong', selectedDifficultyBuckets: [] } });
  assert.equal(result.status, 'ready');
  assert.equal(result.selectionBasis, 'wrong_type');
  assert.equal(result.coverage.selectionBasis, 'wrong_type');
  const s1 = result.candidates.find((g) => g.studentId === 's1');
  assert.equal(s1.selectionBasis, 'wrong_type');
  assert.equal(s1.items.length, 4);
  for (const item of s1.items) {
    assert.ok(['TPL_X1', 'TPL_Y1'].includes(item.templateKey), `${item.templateKey} 는 틀린 유형(TPL_X1·TPL_Y1)이어야 한다`);
    assert.ok(['PT_X', 'PT_Y'].includes(item.problemTypeKey));
    assert.equal(item.recommendationReason.basis, 'wrong_type');
    assert.equal(item.recommendationReason.typeRung, 'template');
  }
  const picked = new Set(mapUids(s1.items).map(num));
  assert.equal(picked.size, 4, '같은 문항이 두 번 나오지 않는다');
  for (const n of [1, 2, 3]) assert.ok(!picked.has(n), '틀린 문항 자체는 나오지 않는다');
  assert.ok(!picked.has(11), '이미 푼 문항(11)은 나오지 않는다');
  assert.ok(!picked.has(91), '반 학년보다 높은 학년 문항(91)은 나오지 않는다');
  assert.deepEqual([...picked].sort((a, b) => a - b), [12, 13, 21, 22]);
});

test('같은 유형이 모자라면 한 단계 위(유형 → 단원)로 내려가고 단계가 기록된다', () => {
  const result = buildType();
  const s1 = result.candidates.find((g) => g.studentId === 's1');
  assert.equal(s1.items.length, 5);
  const fifth = s1.items[4];
  assert.equal(fifth.recommendationReason.typeRung, 'type');
  assert.equal(fifth.problemTypeKey, 'PT_X');
  assert.equal(num(fifth.sourceQuestionUid), 14);
  assert.equal(s1.typeBasis.rungCounts.template, 4);
  assert.equal(s1.typeBasis.rungCounts.type, 1);
});

test('이미 푼 문항도 포함을 켜면 본 문항도 후보가 된다', () => {
  const result = buildType({ includeSeenQuestionUids: true, countPerStudent: 5 });
  const s1 = result.candidates.find((g) => g.studentId === 's1');
  assert.ok(new Set(mapUids(s1.items).map(num)).has(11));
});

test('난이도 직접 선택(3단계만)이면 사다리 후보도 3단계 문항뿐이다', () => {
  const options = { countPerStudent: 5, difficultyMode: 'selected', selectedDifficultyBuckets: [3] };
  const result = buildType({ recommendationOptions: options }, { buckets: [3] });
  const s1 = result.candidates.find((g) => g.studentId === 's1');
  assert.ok(s1.items.length >= 1);
  for (const item of s1.items) assert.equal(item.difficultyBucket, 3);
});

test('시험 단위: 고른 시험(세션)의 오답만 기준이 된다', () => {
  // o1 세션(학생 s2의 시험)만 고르면 s1에게는 기준 오답이 없다
  const result = buildType({ evidenceSessionIds: ['o1'] });
  assert.equal(result.coverage.evidenceSessionCount, 1);
  const s1 = result.candidates.find((g) => g.studentId === 's1');
  const s2 = result.candidates.find((g) => g.studentId === 's2');
  assert.equal(s1.items.length, 0);
  assert.equal(s1.typeBasis.fallbackReason, 'no_wrong');
  assert.ok(s2.items.length >= 2);
  // 같은 세부 유형(TPL_Y1) 후보가 먼저, 그 뒤는 더 넓은 단. 틀린 유형이 아닌 시험 범위 밖 문항(PT_W 등)은 없다.
  assert.deepEqual(s2.items.slice(0, 2).map((item) => item.templateKey), ['TPL_Y1', 'TPL_Y1']);
  for (const item of s2.items) assert.notEqual(item.recommendationReason.typeRung, 'none');
  // e0만 고르면(정답뿐인 옛 시험) 오답 근거 자체가 없다
  const none = buildType({ evidenceSessionIds: ['e0'] });
  assert.equal(none.status, 'no_canonical_evidence');
});

test('유형 정보가 없는 오답은 개념 경로 기준으로 떨어지고 그렇게 표시된다', () => {
  const untyped = record(5, { unit: 'A', pt: '', tpl: '', bucket: 2 });
  const records = [...CATALOG, untyped];
  const extraHistory = history();
  extraHistory.sessions.push({ id: 'u1', student_id: 's3', assignment_id: 'a1', question_count: 1, exam_date: '2026-11-20' });
  extraHistory.resultItems.push(snapshotRow('u1', 1, untyped, 'wrong'));
  const result = buildType({ ...extraHistory, studentIds: ['s1', 's2', 's3'] }, { records });
  const s3 = result.candidates.find((g) => g.studentId === 's3');
  assert.equal(s3.selectionBasis, 'concept_path');
  assert.equal(s3.typeBasis.fallbackReason, 'no_type_info');
  assert.ok(s3.items.length > 0, '유형이 없어도 개념 경로로 후보는 나온다');
  for (const item of s3.items) assert.equal(item.recommendationReason.basis, 'wrong_frequency');
  // 다른 학생은 그대로 유형 기준
  assert.equal(result.candidates.find((g) => g.studentId === 's1').selectionBasis, 'wrong_type');
});

test('사다리 모듈이 없으면 조용히 기본 방식으로 가지 않고 옵션 오류로 알린다', () => {
  const result = Recs.build(baseInput({ selectionBasis: 'wrong_type' }));
  assert.equal(result.status, 'invalid_options');
  assert.ok(result.errors.some((e) => e.code === 'type_ladder_unavailable'));
});

test('계보 표식: 틀린 유형 기준만 coverage.selectionBasis를 남기고 기본 방식은 표식이 그대로다', async () => {
  const ClinicAssessment = require(path.join(__dirname, '../apmath/js/clinic-assessment.js'));
  const uuids = ['11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333'];
  let n = 0;
  const client = ClinicAssessment.create({
    request: async () => ({ status: 200, data: {} }), archive2Core: core, createId: () => uuids[n++ % uuids.length],
    storage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  });
  const makeSelections = (result) => {
    const group = result.candidates.find((g) => g.studentId === 's1');
    return [{
      classId: 'c1', className: '고1 A', grade: '고1', studentId: 's1',
      items: group.items.slice(0, 2).map((item) => ({
        candidate: { ...item, sourceContentVerificationStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED' },
        record: { sourceFile: item.sourceArchiveFile, sourceOrdinal: item.sourceQuestionOrdinal, sourceFingerprint: item.sourceFingerprint, sourceGrade: '고1', identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED' },
        question: { questionUid: item.sourceQuestionUid, sourceFile: item.sourceArchiveFile, sourceOrdinal: item.sourceQuestionOrdinal, sourceFingerprint: item.sourceFingerprint, sourceGrade: '고1' },
      })),
    }];
  };
  const planFor = async (result) => client.createPlan({
    title: '보충', examDate: '2026-11-23', indexVersion: 'v1', selections: makeSelections(result),
    recommendationOptions: result.recommendationOptions, coverage: result.coverage,
  });
  const markerOf = (plan) => plan.cohorts[0].contentBatches[0].saveBody.papers[0].meta.clinicRecommendationAssessment;
  const typePlan = await planFor(buildType());
  assert.equal(markerOf(typePlan).coverage.selectionBasis, 'wrong_type');
  const pathPlan = await planFor(Recs.build(baseInput()));
  assert.ok(!('selectionBasis' in markerOf(pathPlan).coverage), '기본 방식 표식에는 새 값이 없다');
});
