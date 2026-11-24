// 학생 화면은 출제 사본(mixed_payload_json)을 열 때 고쳐진 문항을 지금 원본 내용으로 덮어 그린다 (2026-11-24 원장 결정: "고쳐진 내용으로 항상").
// 결함 조건만 본다: 사본과 원본이 다르면 현재 내용, 못 읽거나 확신이 없으면 사본 그대로(빈 화면·오류·무한 대기 없음), 구성·순서·번호·배점 불변.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const Current = require(path.join(root, 'apmath/student/current-question-content.js'));
const ReviewOutput = require(path.join(root, 'apmath/student/archive-review-output.js'));
const Source = require(path.join(root, 'archive/archive2-source.js'));

const FILE = 'original/high/h1/1mid/example_exam.js';
const bankOf = () => [
  { id: 1, content: '1번 현재 발문', choices: ['①', '②'], answer: '①', solution: '현재 해설 1', score: 3 },
  { id: 2, content: '2번 현재 발문', choices: ['가', '나'], answer: '나', solution: '현재 해설 2', solutionImage: 'assets/images/x/new.svg', score: 4 },
  { id: 3, content: '3번 현재 발문', choices: [], answer: '7', solution: '현재 해설 3', score: 5 },
];
const issued = (n, extra = {}) => ({
  questionUid: 'qid_v1_' + String(n).repeat(64).slice(0, 64), id: n, sourceArchiveFile: FILE, sourceOrdinal: n, score: 10 + n, displayNo: 'N' + n,
  content: n + '번 옛 발문', choices: ['x'], answer: 'x', solution: '옛 해설 ' + n, solutionImage: 'assets/images/x/old.svg', sourceFingerprint: 'old-fp', ...extra,
});
const loader = (banks) => async (p) => {
  const bank = banks[p.replace(/^exams\//, '')];
  if (!bank) throw new Error('EXAM_FETCH_FAILED');
  return structuredClone(bank);
};

test('사본과 원본이 다르면 지금 원본 내용으로, 구성·순서·번호·배점·메타는 사본 그대로', async () => {
  const questions = [issued(1), issued(2), issued(3)];
  const out = await Current.overlay(questions, { fetchQuestionList: loader({ [FILE]: bankOf() }) });
  assert.equal(out.questions.length, 3);
  assert.deepEqual(out.questions.map(q => q.questionUid), questions.map(q => q.questionUid));
  assert.deepEqual(out.questions.map(q => q.content), ['1번 현재 발문', '2번 현재 발문', '3번 현재 발문']);
  assert.deepEqual(out.questions.map(q => q.answer), ['①', '나', '7']);
  assert.deepEqual(out.questions.map(q => q.solution), ['현재 해설 1', '현재 해설 2', '현재 해설 3']);
  assert.deepEqual(out.questions[1].choices, ['가', '나']);
  assert.equal(out.questions[1].solutionImage, 'assets/images/x/new.svg');
  assert.equal('solutionImage' in out.questions[0], false, '지금 원본에 없는 해설 그림은 사본에서도 빠진다');
  // 번호·배점·표시 번호·출처·지문은 사본 그대로
  assert.deepEqual(out.questions.map(q => [q.id, q.score, q.displayNo, q.sourceFingerprint, q.sourceOrdinal]),
    questions.map(q => [q.id, q.score, q.displayNo, q.sourceFingerprint, q.sourceOrdinal]));
  assert.equal(out.replaced, 3);
  assert.equal(questions[0].content, '1번 옛 발문', '입력 사본은 바뀌지 않는다');
});

test('원본과 같으면 같은 배열을 그대로 돌려준다', async () => {
  const bank = bankOf();
  const same = [{ ...bank[0], sourceArchiveFile: FILE, sourceOrdinal: 1, questionUid: 'qid_v1_' + 'a'.repeat(64) }];
  const out = await Current.overlay(same, { fetchQuestionList: loader({ [FILE]: bank }) });
  assert.equal(out.questions, same);
  assert.equal(out.replaced, 0);
});

test('음성: 위치가 없거나 파일을 못 받거나 번호가 다르면 그 문항은 사본 그대로(오류 없음)', async () => {
  const noPlace = { questionUid: 'qid_v1_' + 'b'.repeat(64), id: 1, content: '위치 없음', solution: '옛' };
  const generated = issued(1, { sourceKind: 'generated', generatedUid: 'gen-1' });
  const missingFile = issued(1, { sourceArchiveFile: 'original/high/h1/1mid/none.js' });
  const moved = issued(2, { id: 9 }); // 같은 자리에 다른 번호의 문항이 있다 = 시험지 안 순서가 바뀐 것
  const beyond = issued(3, { sourceOrdinal: 40, id: 40 });
  const questions = [noPlace, generated, missingFile, moved, beyond];
  const out = await Current.overlay(questions, { fetchQuestionList: loader({ [FILE]: bankOf() }) });
  assert.equal(out.questions.length, questions.length);
  assert.deepEqual(out.questions, questions);
  assert.equal(out.replaced, 0);
});

test('음성: 받기가 전부 실패하거나 파싱이 터져도 사본 그대로, 예외 없음', async () => {
  const questions = [issued(1), issued(2)];
  const failing = await Current.overlay(questions, { fetchQuestionList: async () => { throw new Error('network'); } });
  assert.equal(failing.questions, questions);
  const broken = await Current.overlay(questions, { fetchQuestionList: () => { throw new SyntaxError('boom'); } });
  assert.equal(broken.questions, questions);
  const junk = await Current.overlay(questions, { fetchQuestionList: async () => 'not a list' });
  assert.equal(junk.questions, questions);
  assert.equal((await Current.overlay(null)).questions, null);
  assert.deepEqual((await Current.overlay([])).questions, []);
  assert.equal((await Current.overlay(questions, {})).questions, questions, '받는 함수가 없으면 사본 그대로');
});

test('음성: 시간 예산을 넘기면 기다리지 않고 사본 그대로(무한 대기 없음)', async () => {
  const questions = [issued(1)];
  const started = Date.now();
  const out = await Current.overlay(questions, { budgetMs: 60, fetchQuestionList: () => new Promise(() => {}) });
  assert.ok(Date.now() - started < 1500, '예산을 넘기고도 오래 매이지 않는다');
  assert.equal(out.questions, questions);
});

test('한 파일이 실패해도 다른 파일의 문항은 덮는다', async () => {
  const other = 'original/high/h1/1mid/other_exam.js';
  const questions = [issued(1), issued(2, { sourceArchiveFile: other })];
  const out = await Current.overlay(questions, { fetchQuestionList: loader({ [FILE]: bankOf() }) });
  assert.equal(out.questions[0].content, '1번 현재 발문');
  assert.equal(out.questions[1], questions[1]);
  assert.equal(out.replaced, 1);
});

test('맞춤 모의고사 팩 문항(_sourceFile + _sourceQuestionNo)은 발문 외 칸만 덮는다', async () => {
  const pack = { id: 2, content: '2번 팩 발문(배점 없음)', choices: ['x'], answer: 'x', solution: '옛', _assessmentPackId: 'P1', _sourceFile: FILE, _sourceQuestionNo: '2', _sourceScoreLabels: '[4점]' };
  const out = await Current.overlay([pack], { fetchQuestionList: loader({ [FILE]: bankOf() }) });
  assert.equal(out.questions[0].content, '2번 팩 발문(배점 없음)', '팩 발문은 조립기가 배점 표기를 지운 사본이라 덮지 않는다');
  assert.equal(out.questions[0].solution, '현재 해설 2');
  assert.equal(out.questions[0].answer, '나');
  assert.equal(out.questions[0]._sourceScoreLabels, '[4점]');
  assert.deepEqual(Current.locate(pack), { file: FILE, ordinal: null, no: '2', pack: true });
});

test('옛 경로 표기(archive/exams/ 접두, 역슬래시)도 같은 파일로 읽는다', () => {
  assert.equal(Current.locate({ _sourceFile: 'archive/exams/' + FILE, _sourceQuestionNo: 3 }).file, FILE);
  assert.equal(Current.locate({ sourceArchiveFile: FILE.replace(/\//g, '\\'), sourceOrdinal: 1 }).file, FILE);
  assert.equal(Current.locate({ content: 'x' }), null);
});

test('진짜 시험지 파일: 해설을 일부러 옛 값으로 바꾼 사본이 지금 원본 해설로 돌아온다', async () => {
  const file = 'original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js';
  const full = path.join(root, 'archive/exams', file);
  assert.ok(fs.existsSync(full), '표본 시험지 파일이 있어야 한다(이름이 바뀌면 이 표본을 같은 형태의 다른 파일로 고친다)');
  const bank = Source.evaluate(fs.readFileSync(full, 'utf8'), file);
  const real = bank[7];
  const stale = { ...real, questionUid: 'qid_v1_' + 'c'.repeat(64), sourceArchiveFile: file, sourceOrdinal: 8, solution: '옛 해설(고치기 전)', answer: '0' };
  const out = await Current.overlay([stale], { fetchQuestionList: async () => structuredClone(bank) });
  assert.equal(out.questions[0].solution, real.solution);
  assert.equal(out.questions[0].answer, real.answer);
  assert.equal(out.questions[0].questionUid, stale.questionUid);
});

test('prepare(): 학생이 여는 envelope의 문항은 지금 내용이고 문항 수·순서·meta는 사본 그대로', async () => {
  const previous = globalThis.StudentCurrentContent;
  globalThis.StudentCurrentContent = {
    overlay: (questions) => Current.overlay(questions, { fetchQuestionList: loader({ [FILE]: bankOf() }) }),
  };
  try {
    const captured = [];
    const output = {
      publishOutputEnvelope: async (envelope) => { captured.push(envelope); return { outputRequestId: 'r', ownerId: 'o' }; },
      outputEnvelopeUrl: (page, base) => new URL(page + '?x=1', base),
    };
    const payload = { questions: [issued(1), issued(2)], meta: { qpp: 4, questionUids: ['u1', 'u2'], title: '사본 제목' } };
    const exam = { assignment_id: 'a1', archive_file: 'MIXED:archive2-k', question_count: 2, mixed_payload_json: JSON.stringify(payload) };
    const url = await ReviewOutput.prepare(exam, 'sol', output, 'https://x.test/apmath/student/index.html');
    assert.ok(url);
    assert.equal(captured.length, 1);
    assert.deepEqual(captured[0].questions.map(q => q.solution), ['현재 해설 1', '현재 해설 2']);
    assert.deepEqual(captured[0].meta.questionUids, ['u1', 'u2']);
    assert.equal(captured[0].meta.title, '사본 제목');
    assert.equal(captured[0].questionCount, 2);
    // 덮어 그리기가 터지면 사본 그대로 열린다
    globalThis.StudentCurrentContent = { overlay: async () => { throw new Error('boom'); } };
    await ReviewOutput.prepare(exam, 'sol', output, 'https://x.test/apmath/student/index.html');
    assert.deepEqual(captured[1].questions.map(q => q.solution), ['옛 해설 1', '옛 해설 2']);
    // 모듈이 없어도(옛 화면 캐시) 사본 그대로
    delete globalThis.StudentCurrentContent;
    await ReviewOutput.prepare(exam, 'sol', output, 'https://x.test/apmath/student/index.html');
    assert.deepEqual(captured[2].questions.map(q => q.solution), ['옛 해설 1', '옛 해설 2']);
  } finally {
    if (previous === undefined) delete globalThis.StudentCurrentContent; else globalThis.StudentCurrentContent = previous;
  }
});

test('오답 다시 풀기도 같은 규칙: 출제 사본의 문항을 지금 원본으로 덮고, 길이·순서·번호는 그대로이며 못 받으면 사본 그대로', async () => {
  const view = require(path.join(root, 'apmath/student/self-study-view.js'));
  const previous = globalThis.StudentCurrentContent;
  globalThis.StudentCurrentContent = Current;
  try {
    const source = 'window.questionBank = ' + JSON.stringify(bankOf()) + ';';
    const base = 'https://school.test/AP------/apmath/student/index.html';
    const frozen = JSON.stringify({ questions: [issued(1), issued(2)], meta: {} });
    const exam = { assignment_id: 'a1', archive_file: 'MIXED:k', mixed_payload_json: frozen };
    const ok = await view.loadExamQuestions(exam, { baseUrl: base, fetchImpl: async () => ({ ok: true, text: async () => source }) });
    assert.deepEqual(ok.map(q => q.id), [1, 2]);
    assert.deepEqual(ok.map(q => q.solution), ['현재 해설 1', '현재 해설 2']);
    const other = { ...exam, mixed_payload_json: JSON.stringify({ questions: [issued(1, { sourceArchiveFile: 'original/high/h1/1mid/never_loaded.js' })], meta: {} }) };
    const failed = await view.loadExamQuestions(other, { baseUrl: base, fetchImpl: async () => ({ ok: false }) });
    assert.deepEqual(failed.map(q => q.solution), ['옛 해설 1']);
  } finally {
    if (previous === undefined) delete globalThis.StudentCurrentContent; else globalThis.StudentCurrentContent = previous;
  }
});
