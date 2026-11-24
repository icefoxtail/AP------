// 학생 포털 "유사 문항 풀어보기"의 같은 유형 길(유사 시험지가 없는 시험, 예: 선생님이 만든 모의고사).
// 순수 함수와 가짜 fetch만 쓴다: 운영 데이터의 정확한 개수는 고정하지 않고 규칙(제외·순서·결정성·더 풀기)을 검사한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.join(__dirname, '..');
const Rec = require('../apmath/student/self-study-record.js');
globalThis.StudentSelfStudyRecord = Rec;
const View = require('../apmath/student/self-study-view.js');
const Type = require('../apmath/student/self-study-type.js');
const html = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

const hex = (n) => n.toString(16).padStart(64, '0');
const uid = (n) => `qid_v1_${hex(n)}`;
const SCHEMA = 'archive2-student-type-v1';

// ---- 빌더: 합성 레코드 -> 조각 ----
const GRADE_RANK = { 고1: 1, 고2: 2, 고3: 3 };
const core = {
  gradeRank: (grade) => GRADE_RANK[String(grade || '')] || 0,
  generalUseEligibility: (record) => ({ ok: record.identityStatus === 'VERIFIED' && record.sourceIntegrityStatus === 'VERIFIED' }),
  difficultyEligible: (record) => Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5,
};
const unifiedStub = {
  buildIndex(records) {
    const byUid = new Map();
    for (const r of records) byUid.set(r.questionUid, { grade: r.sourceGrade, subject: 'MATH', unitKey: r.L1, originalCurriculum: '2022', unclassified: false });
    return { byUid, byRecord: new Map() };
  },
};
function rec(n, { file = `original/high/h1/1mid/f${n}.js`, tpl = '', pt = '', bucket = 2, grade = '고1', identity = 'VERIFIED', ordinal = 1 } = {}) {
  return {
    questionUid: uid(n), sourceFile: file, sourceOrdinal: ordinal, sourceQuestionNo: String(ordinal), sourceGrade: grade,
    identityStatus: identity, sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceFingerprint: `fp${n}`,
    curriculumKey: '2022', courseKey: 'H1', L1: 'A', L2: 'A2', L3: 'A3', problemTypeKey: pt, templateKey: tpl, difficultyBucket: bucket,
  };
}

test('build part: only ladder-eligible rows, TPL/PT keys, offer flag needs an answer and a real explanation, same bytes twice', async () => {
  const part = await import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-student-type-part.mjs')).href);
  const Derive = require('../archive/archive2-derive.js');
  const Recs = require('../apmath/js/clinic-recommendations.js');
  const records = [
    rec(1, { tpl: 'TPL_X', pt: 'PT_X' }),
    rec(2, { tpl: 'TPL_X', pt: 'PT_X' }),                    // answer but only the stock explanation: not offered
    rec(3, { tpl: '', pt: 'PT_X' }),                           // PT only
    rec(4, { tpl: 'TPL_X', pt: 'PT_X', identity: 'UNVERIFIED' }), // not eligible: no row
    rec(5, { tpl: 'TPL_X', pt: 'PT_X', bucket: 0 }),           // no difficulty step: no row
    rec(6, { tpl: '', pt: '' }),                               // no type: no row
  ];
  const bank = {
    'original/high/h1/1mid/f1.js': [{ id: 1, answer: '3', solution: '풀이', content: 'q' }],
    'original/high/h1/1mid/f2.js': [{ id: 1, answer: '3', solution: '[JS 기준 풀이] 정답만', content: 'q' }],
    'original/high/h1/1mid/f3.js': [{ id: 1, answer: '3', solution: '', solutionImage: 'assets/s.svg', content: 'q' }],
  };
  const deps = { core, unified: unifiedStub, derive: Derive, recs: Recs };
  const rows = part.studentTypeRows(records, null, deps, (file) => bank[file] || null);
  const list = rows.get('고1|MATH');
  assert.deepEqual(list.map((row) => row.uid), [hex(1), hex(2), hex(3)]);
  assert.deepEqual(list.map((row) => row.flags & part.FLAG_OFFER ? 1 : 0), [1, 0, 1], 'answer + real explanation (text or figure) is what may be offered');
  assert.equal(list[2].tpl, '');
  assert.equal(list[2].pt, 'PT_X');
  const first = part.projectStudentType({ byCk: rows }, 'v1');
  const second = part.projectStudentType({ byCk: rows }, 'v1');
  for (const [rel, content] of first.files) assert.equal(content.toString(), second.files.get(rel).toString(), `same bytes: ${rel}`);
  const index = Type.parseIndex(JSON.parse(first.files.get('student-type/index.json')));
  assert.ok(index, 'the portal reads the index it is given');
  assert.deepEqual([...index.files.keys()].sort(), ['original/high/h1/1mid/f1.js', 'original/high/h1/1mid/f2.js', 'original/high/h1/1mid/f3.js']);
  const shard = Type.decodeShard(JSON.parse(first.files.get(`student-type/${index.shards[0].path}`)));
  assert.equal(shard.rows.length, 3);
  assert.equal(shard.byUid.get(hex(1)).offer, true);
  assert.equal(shard.byUid.get(hex(2)).offer, false);
  assert.ok(!/question|answer|solution/i.test(first.files.get(`student-type/${index.shards[0].path}`).toString().replace(/"schemaVersion":"[^"]*"/, '')), 'a shard holds no question text');
});

// ---- 선정 ----
function shardDoc(ck, rows) {
  const files = []; const keys = [];
  const idx = (list, value) => { let i = list.indexOf(value); if (i < 0) { list.push(value); i = list.length - 1; } return i; };
  return {
    schemaVersion: SCHEMA, indexVersion: 'v', ck, files, keys,
    items: rows.map((r) => [idx(files, r.file), r.ordinal || 1, String(r.ordinal || 1), r.tpl ? idx(keys, r.tpl) : -1, r.pt ? idx(keys, r.pt) : -1, r.flags ?? 7, r.bucket ?? 2, hex(r.n)]),
  };
}
const F = (n) => `original/high/h1/1mid/f${n}.js`;
const BASE = { n: 1, file: F(1), tpl: 'TPL_X', pt: 'PT_X', bucket: 3 };
const ROWS = [
  BASE,
  { n: 2, file: F(2), tpl: 'TPL_X', pt: 'PT_X', bucket: 3 },
  { n: 3, file: F(3), tpl: 'TPL_X', pt: 'PT_X', bucket: 1 },
  { n: 4, file: F(4), tpl: 'TPL_X', pt: 'PT_X', bucket: 4 },
  { n: 5, file: F(5), tpl: 'TPL_Y', pt: 'PT_X', bucket: 3 },
  { n: 6, file: F(6), tpl: 'TPL_Z', pt: 'PT_X', bucket: 3 },
  { n: 7, file: F(7), tpl: 'TPL_X', pt: 'PT_X', bucket: 3, flags: 3 }, // not offerable
  { n: 8, file: F(8), tpl: '', pt: 'PT_X', bucket: 3, flags: 6 },
];
const noExclusions = () => ({ uids: new Set(), positions: new Set(), files: new Set(), stems: new Set() });
const shardOf = () => Type.decodeShard(shardDoc('고1|MATH', ROWS));
const picksOf = (opts) => {
  const shard = shardOf();
  return Type.pickRound({ wrongs: [{ n: 1, base: shard.byUid.get(hex(1)), shard }], exclusions: noExclusions(), shown: new Set(), bad: new Set(), seed: 's', ...opts });
};

test('pickRound: same TPL first (closest difficulty), then same PT; at most 2; never the wrong question or a question that cannot be offered', () => {
  const picks = picksOf({});
  assert.equal(picks.length, 2);
  assert.deepEqual(picks.map((p) => p.rung), ['tpl', 'tpl']);
  assert.equal(picks[0].row.uid, hex(2), 'same difficulty step comes first');
  assert.ok(picks.every((p) => p.row.uid !== hex(1) && p.row.uid !== hex(7)));
  const three = picksOf({ perWrong: 5 });
  assert.deepEqual(three.map((p) => p.rung), ['tpl', 'tpl', 'tpl', 'pt', 'pt', 'pt'].slice(0, three.length));
  assert.deepEqual(three.map((p) => p.row.uid).slice(0, 3).sort(), [hex(2), hex(3), hex(4)].sort());
  assert.ok(three.slice(3).every((p) => p.row.pt === 'PT_X' && p.row.tpl !== 'TPL_X'), 'PT fills up only after the TPL pool is used');
  assert.ok(!three.some((p) => p.row.uid === hex(8) && p.rung === 'tpl'));
});

test('pickRound: same seed gives the same round; shown, bad, other wrong questions, open exams and the studied exam are never offered', () => {
  assert.deepEqual(picksOf({}).map((p) => p.row.uid), picksOf({}).map((p) => p.row.uid));
  const shown = picksOf({ shown: new Set([hex(2), hex(3)]) });
  assert.ok(shown.every((p) => ![hex(2), hex(3)].includes(p.row.uid)));
  const bad = picksOf({ bad: new Set([hex(2)]) });
  assert.ok(bad.every((p) => p.row.uid !== hex(2)));
  const ex = noExclusions();
  ex.uids.add(hex(2)); ex.positions.add(`${F(3)}#1`); ex.files.add(F(4)); ex.stems.add(Type.stemOf(F(5)));
  const out = picksOf({ exclusions: ex, perWrong: 9 }).map((p) => p.row.uid);
  assert.ok(![hex(2), hex(3), hex(4), hex(5)].some((u) => out.includes(u)), 'excluded by uid / position / file / paper family');
  // a similar paper of an open plain exam shares its stem
  assert.equal(Type.stemOf('similar/high/h1/x/26_학교_1학기_중간_고1_수학_유사2.js'), Type.stemOf('original/high/h1/x/26_학교_1학기_중간_고1_수학.js'));
});

test('pickRound: two wrong questions of one type never get the same question', () => {
  const shard = shardOf();
  const wrongs = [{ n: 1, base: shard.byUid.get(hex(1)), shard }, { n: 2, base: shard.byUid.get(hex(2)), shard }];
  const picks = Type.pickRound({ wrongs, exclusions: noExclusions(), shown: new Set(), bad: new Set(), seed: 's', perWrong: 2 });
  const uids = picks.map((p) => p.row.uid);
  assert.equal(new Set(uids).size, uids.length);
  assert.ok(uids.length >= 2);
});

// ---- 틀린 문항의 출처, 제외 목록 ----
const mixedExam = (extra = {}) => ({
  assignment_id: 'a1', archive_file: 'MIXED:mock', question_count: 3, is_submitted: 1,
  mixed_payload_json: JSON.stringify({ questions: [
    { questionUid: uid(1), sourceArchiveFile: F(1), sourceOrdinal: 1, id: 1 },
    { questionUid: uid(9), sourceArchiveFile: F(9), sourceOrdinal: 2, id: 2 },
    { sourceKind: 'generated', generatedUid: 'g1', id: 3 },
  ] }),
  ...extra,
});

test('wrongRefs: from the issued copy (uid, file, ordinal) or the plain exam file and its number; unknown origins are left out', () => {
  assert.deepEqual(Type.wrongRefs(mixedExam(), [1, 2, 3]).map((r) => [r.n, r.uid, r.file, r.ordinal]), [[1, hex(1), F(1), 1], [2, hex(9), F(9), 2]]);
  assert.deepEqual(Type.wrongRefs({ archive_file: 'exams/original/high/h1/1mid/a.js' }, [2, 4]).map((r) => [r.n, r.file, r.ordinal]),
    [[2, 'original/high/h1/1mid/a.js', 2], [4, 'original/high/h1/1mid/a.js', 4]]);
  assert.deepEqual(Type.wrongRefs({ archive_file: 'MIXED:none' }, [1]), []);
});

test('collectExclusions: studied exam, other exams not yet handed in; submitted, cancelled and review-only ones do not count', () => {
  const studied = mixedExam();
  const open = { assignment_id: 'b', archive_file: 'MIXED:m2', is_submitted: 0, mixed_payload_json: JSON.stringify({ questions: [{ questionUid: uid(50), sourceArchiveFile: F(50), sourceOrdinal: 4 }] }) };
  const plainOpen = { assignment_id: 'c', archive_file: 'exams/original/high/h1/1mid/open.js', is_submitted: 0 };
  const submitted = { assignment_id: 'd', archive_file: 'MIXED:m3', is_submitted: 1, mixed_payload_json: JSON.stringify({ questions: [{ questionUid: uid(60), sourceArchiveFile: F(60), sourceOrdinal: 1 }] }) };
  const cancelled = { assignment_id: 'e', archive_file: 'MIXED:m4', is_submitted: 0, is_cancelled: true, mixed_payload_json: JSON.stringify({ questions: [{ questionUid: uid(70) }] }) };
  const review = { assignment_id: 'f', archive_file: 'MIXED:m5', is_submitted: 0, is_review_only: true, mixed_payload_json: JSON.stringify({ questions: [{ questionUid: uid(80) }] }) };
  const unknown = { assignment_id: 'g', archive_file: 'MIXED:m6', mixed_payload_json: JSON.stringify({ questions: [{ questionUid: uid(90) }] }) };
  const ex = Type.collectExclusions([studied, open, plainOpen, submitted, cancelled, review, unknown], studied, Type.wrongRefs(studied, [1, 2]));
  for (const n of [1, 9, 50, 90]) assert.ok(ex.uids.has(hex(n)), `excluded uid ${n}`);
  for (const n of [60, 70, 80]) assert.ok(!ex.uids.has(hex(n)), `not excluded uid ${n}`);
  assert.ok(ex.positions.has(`${F(50)}#4`));
  assert.ok(ex.files.has('original/high/h1/1mid/open.js') && ex.stems.has(Type.stemOf('original/high/h1/1mid/open.js')));
});

// ---- 끝까지: 색인·조각·시험지 파일을 받아 한 판, 이어 열기, 더 풀기, 소진 ----
function fakeWorld({ blank = [] } = {}) {
  const rows = [];
  for (let i = 1; i <= 7; i += 1) rows.push({ n: i, file: F(i), tpl: 'TPL_X', pt: 'PT_X', bucket: 2 });
  rows.push({ n: 9, file: F(9), tpl: 'TPL_W', pt: 'PT_W', bucket: 2 }); // second wrong question, alone in its type
  const index = { schemaVersion: SCHEMA, indexVersion: 'v', shards: [{ ck: '고1|MATH', path: 'h1-math.json' }], files: Object.fromEntries(rows.map((r) => [r.file, 0])) };
  const shard = shardDoc('고1|MATH', rows);
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    const u = new URL(url);
    if (u.pathname.endsWith('/student-type/index.json')) return { ok: true, json: async () => index };
    if (u.pathname.endsWith('/student-type/h1-math.json')) return { ok: true, json: async () => shard };
    const m = /\/archive\/exams\/(.+\.js)$/.exec(decodeURIComponent(u.pathname));
    if (m) {
      const n = Number(/f(\d+)\.js$/.exec(m[1])?.[1]);
      const q = { id: 1, content: `문항 ${n}`, answer: '2', choices: ['a', 'b'], solution: blank.includes(n) ? '' : `풀이 ${n}` };
      return { ok: true, text: async () => `window.questionBank = ${JSON.stringify([q, { ...q, id: 2 }])};` };
    }
    return { ok: false };
  };
  return { fetchImpl, calls, index: Type.parseIndex(index) };
}
const memStorage = () => { const map = new Map(); return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)) }; };
const BASE_URL = 'https://x.test/apmath/student/index.html';

test('loadRound: first round, reopen = same round, "more" = new questions only, then "none left"; downloads stay small', async () => {
  const world = fakeWorld();
  const storage = memStorage();
  const exam = mixedExam({ assignment_id: 'a-round' });
  const ctx = (extra) => ({ exam, wrongNumbers: [1], exams: [exam], index: world.index, studentId: 's1', storage, view: View, fetchImpl: world.fetchImpl, baseUrl: BASE_URL, refresher: null, ...extra });
  const first = await Type.loadRound(ctx({ mode: 'current' }));
  assert.equal(first.failed, false);
  assert.equal(first.questions.length, 2);
  for (const q of first.questions) {
    assert.match(q.ssKey, /^qid_v1_[a-f0-9]{64}$/);
    assert.equal(q.ssSrc, 1);
    assert.match(q.sourceLabel, /^1번과 같은 유형$/);
    assert.ok(q.answer && q.solution, 'answer and explanation come with the question');
  }
  const again = await Type.loadRound(ctx({ mode: 'current' }));
  assert.deepEqual(again.questions.map((q) => q.ssKey), first.questions.map((q) => q.ssKey), 'reopening continues the same round');
  const seen = new Set(first.questions.map((q) => q.ssKey));
  const more = await Type.loadRound(ctx({ mode: 'next' }));
  assert.equal(more.questions.length, 2);
  assert.ok(more.questions.every((q) => !seen.has(q.ssKey) && q.ssKey !== uid(1)), 'nothing shown before and not the wrong question');
  more.questions.forEach((q) => seen.add(q.ssKey));
  const third = await Type.loadRound(ctx({ mode: 'next' }));
  assert.equal(third.questions.length, 2);
  third.questions.forEach((q) => { assert.ok(!seen.has(q.ssKey)); seen.add(q.ssKey); });
  const dry = await Type.loadRound(ctx({ mode: 'next' }));
  assert.equal(dry.exhausted, true, 'the TPL pool (6 others) is used up and no other question shares the PT');
  assert.deepEqual(dry.questions, []);
  const reopened = await Type.loadRound(ctx({ mode: 'current' }));
  assert.deepEqual(reopened.questions.map((q) => q.ssKey), third.questions.map((q) => q.ssKey), 'after "none left" the last round is still what reopens');
  assert.ok(world.calls.every((url) => !/archive2-catalog.json|question-index|question_metadata/.test(url)), 'no catalog or index download');
  assert.ok(world.calls.filter((url) => /student-type\//.test(url)).length <= 12);
});

test('loadRound: a candidate whose file has no explanation is replaced by the next one; the linked-set skip keeps those numbers out', async () => {
  const world = fakeWorld({ blank: [2, 3, 4] });
  const exam = mixedExam({ assignment_id: 'a-blank' });
  const base = { exam, exams: [exam], index: world.index, studentId: 's1', storage: memStorage(), view: View, fetchImpl: world.fetchImpl, baseUrl: BASE_URL, refresher: null, mode: 'current' };
  const round = await Type.loadRound({ ...base, wrongNumbers: [1] });
  assert.equal(round.questions.length, 2);
  assert.ok(round.questions.every((q) => !['문항 2', '문항 3', '문항 4'].includes(q.content)));
  const skipped = await Type.loadRound({ ...base, storage: memStorage(), wrongNumbers: [1], skipNumbers: [1], withLinked: true });
  assert.deepEqual(skipped.questions, [], 'a number that already has a same-number similar question gets no type card in round 1');
});

test('loadRound: a wrong question without a type, or when the lookup cannot be read, gives no card and never throws', async () => {
  const world = fakeWorld();
  const exam = mixedExam({ assignment_id: 'a-none' });
  const noType = await Type.loadRound({ exam, wrongNumbers: [3], exams: [exam], index: world.index, studentId: 's1', storage: memStorage(), view: View, fetchImpl: world.fetchImpl, baseUrl: BASE_URL, refresher: null, mode: 'current' });
  assert.deepEqual(noType.questions, []);
  const broken = await Type.loadRound({ exam, wrongNumbers: [1], exams: [exam], index: world.index, studentId: 's1', storage: memStorage(), view: View, fetchImpl: async () => ({ ok: false }), baseUrl: BASE_URL, refresher: null, mode: 'current' });
  assert.equal(broken.failed, true);
  assert.equal(await Type.loadIndex(async () => ({ ok: false }), BASE_URL), null);
  assert.equal(await Type.loadIndex(async () => { throw new Error('offline'); }, BASE_URL), null);
});

test('canOffer: the card only needs the small index and the wrong numbers\' origin', () => {
  const world = fakeWorld();
  assert.equal(Type.canOffer(world.index, mixedExam(), [1]), true);
  assert.equal(Type.canOffer(world.index, mixedExam(), [3]), false, 'a generated question has no origin');
  assert.equal(Type.canOffer(null, mixedExam(), [1]), false);
  assert.equal(Type.canOffer(world.index, mixedExam(), []), false);
});

test('teacher view: type-based similar items (uid key, source number in src) show on the same "유사" line as same-number ones', () => {
  const Ws = require('../apmath/js/ws-self-study.js');
  const items = [
    { k: uid(2), u: uid(2), src: 4, r: 'c', why: null, n: 1, t: '2026-11-24T01:00:00Z' },
    { k: uid(3), u: uid(3), src: 4, r: 'w', why: 'calc', n: 1, t: '2026-11-24T01:01:00Z' },
    { k: uid(5), u: uid(5), src: 7, r: 'u', why: null, n: 1, t: '2026-11-24T01:02:00Z' },
  ];
  const summary = Ws.summarizeClass({ rows: [{ sid: 's1', name: '학생', pending: false, wrongs: [4, 7] }], selfStudy: [{ student_id: 's1', assignment_id: 'a1', kind: 'similar', total: 3, correct: 1, wrong: 2, items }], available: true });
  assert.equal(summary.byStudent.s1.text, '유사 1/3');
  assert.deepEqual(summary.stillWrong.map((row) => row.no).sort((a, b) => a - b), [4, 7], 'the original question number is kept (src)');
});

// ---- 포털 연결 ----
test('portal wiring: the type script loads after the similar one, the button also covers exams without a similar paper, "more" is a bottom action', () => {
  assert.match(html, /<script src="\.\/self-study-similar\.js\?v=[^"]+"><\/script>\s*<script src="\.\/self-study-type\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /typeof canOfferSelfStudyType === 'function' && canOfferSelfStudyType\(exam\)/);
  assert.match(html, /label: '다른 유사 문항 더 풀기'[\s\S]{0,160}more: true/);
  assert.match(html, /bottomActions: \[more, other\]\.filter\(Boolean\)/);
  assert.match(html, /더 풀 유사 문항이 없어요/);
  assert.match(html, /storage: selfStudyStorage\(\)/, 'the preview keeps the rule: no storage in the teacher preview');
  const source = fs.readFileSync(path.join(root, 'apmath/student/self-study-type.js'), 'utf8');
  assert.doesNotMatch(source, /method:\s*['"](?:POST|PUT|PATCH|DELETE)|apiPost|archive2-catalog\.json|question-index|question_metadata/);
});

// ---- 통신 오류는 "소진"이 아니다 (2026-11-24 검수 지적) ----
// 시험지 JS 요청만 골라 실패시키는 가짜 세계: fail(n) -> 'net'(끊김) | 'timeout'(응답 없음) | '503' | '404' | undefined.
function brokenWorld(fail) {
  const world = fakeWorld();
  const base = world.fetchImpl;
  const fetchImpl = async (url) => {
    const m = /\/archive\/exams\/.*f(\d+)\.js$/.exec(decodeURIComponent(new URL(url).pathname));
    const mode = m && fail(Number(m[1]));
    if (mode === 'net') throw new TypeError('Failed to fetch');
    if (mode === 'timeout') return new Promise(() => {});
    if (mode === '503') return { ok: false, status: 503 };
    if (mode === '404') return { ok: false, status: 404 };
    return base(url);
  };
  return { ...world, fetchImpl };
}
const roundCtx = (world, exam, storage, extra) => ({ exam, wrongNumbers: [1], exams: [exam], index: world.index, studentId: 's1', storage, view: View, fetchImpl: world.fetchImpl, baseUrl: BASE_URL, refresher: null, ...extra });

test('loadRound: every picked exam file fails to download (network / 5xx) -> "could not load", not "none left"; nothing is remembered; trying again works', async () => {
  for (const mode of ['net', '503']) {
    let down = true;
    const world = brokenWorld((n) => (down && n !== 1 ? mode : undefined));
    const exam = mixedExam({ assignment_id: `a-down-${mode}` });
    const storage = memStorage();
    for (const round of ['current', 'next']) {
      const failedRound = await Type.loadRound(roundCtx(world, exam, storage, { mode: round }));
      assert.equal(failedRound.failed, true, `${mode}/${round}: an error state`);
      assert.equal(failedRound.exhausted, false, `${mode}/${round}: not "none left"`);
      assert.deepEqual(failedRound.questions, []);
    }
    assert.deepEqual(Type.readRounds(storage, 's1', exam.assignment_id).rounds, [], 'a round that could not be read is not remembered as shown');
    down = false; // the connection is back: the same press now gives questions
    const again = await Type.loadRound(roundCtx(world, exam, storage, { mode: 'next' }));
    assert.equal(again.failed, false);
    assert.equal(again.exhausted, false);
    assert.equal(again.questions.length, 2);
  }
});

test('loadRound: a file that never answers times out and is an error state (not "none left"); the time limit is one constant', async () => {
  const Net = require('../apmath/student/student-fetch.js');
  assert.ok(Number.isFinite(Net.TIMEOUT_MS) && Net.TIMEOUT_MS >= 5000 && Net.TIMEOUT_MS <= 60000);
  const world = brokenWorld((n) => (n !== 1 ? 'timeout' : undefined));
  const exam = mixedExam({ assignment_id: 'a-slow' });
  const slow = await Type.loadRound(roundCtx(world, exam, memStorage(), { mode: 'current', timeoutMs: 30 }));
  assert.equal(slow.failed, true);
  assert.equal(slow.exhausted, false);
  assert.deepEqual(slow.questions, []);
  // index / shard requests have the limit too: a hanging lookup is "not available", never a hang
  const hang = () => new Promise(() => {});
  const started = Date.now();
  await assert.rejects(Net.request(hang, 'https://x.test/a.json', { read: 'json', timeoutMs: 30 }), (e) => e.code === 'REQUEST_TIMEOUT' && e.transient === true);
  assert.ok(Date.now() - started < 2000);
  const shardHang = await Type.loadRound(roundCtx(world, exam, memStorage(), { mode: 'current', timeoutMs: 30, fetchImpl: async (url) => (/h1-math\.json$/.test(url) ? hang() : world.fetchImpl(url)) }));
  assert.equal(shardHang.failed, true);
});

test('loadRound: one file that is really gone (404) is skipped for the next candidate; a file lost to the network only costs that question', async () => {
  const gone = brokenWorld((n) => (n === 2 ? '404' : undefined));
  const exam = mixedExam({ assignment_id: 'a-404' });
  const round = await Type.loadRound(roundCtx(gone, exam, memStorage(), { mode: 'current' }));
  assert.equal(round.failed, false);
  assert.equal(round.questions.length, 2, 'the missing file is replaced by another candidate');
  assert.ok(round.questions.every((q) => q.ssKey !== uid(2)));
  // a network failure of ONE file while others work: the round is filled from the rest, and that file is not recorded as shown
  const storage = memStorage();
  const flaky = brokenWorld((n) => (n === 2 ? 'net' : undefined));
  const exam2 = mixedExam({ assignment_id: 'a-flaky' });
  const partial = await Type.loadRound(roundCtx(flaky, exam2, storage, { mode: 'current' }));
  assert.equal(partial.failed, false);
  assert.equal(partial.questions.length, 2);
  const recorded = Type.readRounds(storage, 's1', exam2.assignment_id).rounds.flatMap((r) => r.picks.map((p) => p.uid));
  assert.ok(!recorded.includes(hex(2)), 'a question that could not be downloaded is not in the shown list');
  // all candidates 404 (really nothing usable): still "none left" for "more", not an error
  const allGone = brokenWorld((n) => (n !== 1 ? '404' : undefined));
  const dry = await Type.loadRound(roundCtx(allGone, mixedExam({ assignment_id: 'a-all404' }), memStorage(), { mode: 'next' }));
  assert.equal(dry.failed, false);
  assert.equal(dry.exhausted, true);
});

test('loadRound: reopening a remembered round whose files cannot be downloaded is an error state, then the round comes back', async () => {
  let down = false;
  const world = brokenWorld(() => (down ? 'net' : undefined));
  const exam = mixedExam({ assignment_id: 'a-reopen' });
  const storage = memStorage();
  const first = await Type.loadRound(roundCtx(world, exam, storage, { mode: 'current' }));
  assert.equal(first.questions.length, 2);
  down = true;
  const offline = await Type.loadRound(roundCtx(world, exam, storage, { mode: 'current' }));
  assert.equal(offline.failed, true);
  down = false;
  const back = await Type.loadRound(roundCtx(world, exam, storage, { mode: 'current' }));
  assert.deepEqual(back.questions.map((q) => q.ssKey), first.questions.map((q) => q.ssKey));
});

test('the same-number similar path shares the helper: all similar papers lost to the network is an error, a missing one is just dropped; the link map stays optional', async () => {
  const Similar = require('../apmath/student/self-study-similar.js');
  const Link = require('../apmath/student/similar-link.js');
  const map = Link.normalizeMap({ version: 1, map: { 'original/high/h1/1mid/a.js': [['similar/high/h1/1mid/a_유사1.js', 2]] } });
  const exam = { archive_file: 'exams/original/high/h1/1mid/a.js', question_count: 2 };
  const body = `window.questionBank = ${JSON.stringify([{ id: 1, answer: '1', content: 'a' }, { id: 2, answer: '1', content: 'b' }])};`;
  const make = (similarStatus) => async (url) => {
    if (/similar\//.test(decodeURIComponent(url))) {
      if (similarStatus === 'throw') throw new TypeError('offline');
      return { ok: false, status: similarStatus };
    }
    return { ok: true, text: async () => body };
  };
  const opts = (fetchImpl) => ({ view: View, link: Link, fetchImpl, baseUrl: BASE_URL });
  await assert.rejects(Similar.loadSimilarSets(exam, map, opts(make('throw'))), (e) => e.transient === true);
  await assert.rejects(Similar.loadSimilarSets(exam, map, opts(make(503))), (e) => e.transient === true);
  const missing = await Similar.loadSimilarSets(exam, map, opts(make(404)));
  assert.deepEqual(missing.similarSets, [], 'a similar paper that is really gone is dropped, as before');
  // the list's link map: a failed download is an empty map, never a throw
  assert.deepEqual(Object.keys(await Link.load(async () => { throw new Error('offline'); }, BASE_URL)), []);
  assert.deepEqual(Object.keys(await Link.load(async () => ({ ok: false, status: 503 }), BASE_URL)), []);
});

test('error screen: the view draws "could not load" with a retry button that keeps "more"; the portal uses it for a failed round and loads the helper first', () => {
  const screen = View.loadFailureHtml('유사 문항', "openSelfStudy('similar', 'a1', 'list', { more: true })");
  assert.match(screen, /role="alert"/);
  assert.match(screen, /유사 문항을 불러오지 못했어요/);
  assert.match(screen, /연결을 확인하고 다시 시도해 주세요/);
  assert.match(screen, /<button[^>]*data-ss-retry-load[^>]*>다시 불러오기<\/button>/);
  assert.match(screen, /onclick="openSelfStudy\(&#39;similar&#39;, &#39;a1&#39;, &#39;list&#39;, \{ more: true \}\)"/);
  assert.doesNotMatch(screen, /소진|더 풀 유사 문항이 없어요|찾지 못했어요/);
  assert.match(html, /<script src="\.\/student-fetch\.js\?v=[^"]+"><\/script>\s*<script src="\.\/similar-link\.js/);
  assert.match(html, /if \(round\.failed && !linked\.questions\.length\) throw new Error\('STUDENT_TYPE_FAILED'\)/);
  assert.match(html, /selfStudy\.loadFailureHtml\(/);
  assert.match(html, /const retryOpts = similar && opts\.more \? ', \{ more: true \}' : ''/);
  const exhaustedAt = html.indexOf('if (opts.more && round.exhausted)');
  const failedAt = html.indexOf('if (round.failed && !linked.questions.length)');
  assert.ok(exhaustedAt > 0 && exhaustedAt < failedAt, 'only an exhausted round (never a failed one) becomes "none left"');
});
