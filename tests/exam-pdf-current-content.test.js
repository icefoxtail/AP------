'use strict';

// 서버 PDF도 고쳐진 내용으로 (2026-11-24 원장 결정): 캐시 키가 시험지 내용에 따라 달라지고, 그릴 때 문항 내용을 지금 원본으로 덮되
// 못 받거나 확신이 없으면 출제 사본 그대로이며 다운로드는 어떤 경우에도 막히지 않는다. 결함 조건만 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath', 'worker-backup', 'worker');
const toUrl = file => String(new URL(`file:///${file.replace(/\\/g, '/')}`));
const loadHelper = () => import(toUrl(path.join(workerDir, 'helpers', 'exam-pdf-current.js')));
const loadRoute = () => import(toUrl(path.join(workerDir, 'routes', 'exam-pdf.js')));

const FILE = 'original/high/h1/1mid/example_exam.js';
const examText = (answer, content = '현재 발문') => `window.examTitle = "x";\nwindow.questionBank = ${JSON.stringify([
  { id: 1, content, choices: ['①', '②'], answer, solution: '해설' },
  { id: 2, content: '둘째', choices: ['a', 'b'], answer: 'b', solution: '해설2' },
])};\n`;
const respond = text => ({ ok: true, text: async () => text });
const fetchOf = (map, calls = []) => async url => {
  calls.push(String(url));
  const hit = Object.entries(map).find(([file]) => String(url).endsWith(encodeURI(file)) || String(url).endsWith(file));
  if (!hit || hit[1] === null) return { ok: false, status: 404, text: async () => '' };
  return respond(hit[1]);
};
const snapshotQuestions = () => [
  { id: 1, questionUid: 'qid_v1_' + '1'.repeat(64), sourceArchiveFile: FILE, sourceOrdinal: 1, content: '옛 발문', choices: ['①', '②'], answer: '①', solution: '옛 해설', score: 5 },
  { id: 2, questionUid: 'qid_v1_' + '2'.repeat(64), sourceArchiveFile: FILE, sourceOrdinal: 2, content: '둘째', choices: ['a', 'b'], answer: 'b', solution: '해설2', score: 6 },
];
const mixedAssignment = (extra = {}) => ({
  id: 'asg-1', class_id: 'class-1', archive_file: 'MIXED:abc', exam_title: '시험', question_count: 2, pdf_qpp: 4,
  mixed_payload_json: JSON.stringify({ questions: snapshotQuestions(), meta: {} }), ...extra,
});
// 브라우저 안에서 실행될 해석 글을 노드에서 같은 방식으로 돌려 본다.
const parserFrom = expression => new Function(`return ${expression}`)();

test('필요한 시험지 파일 지문: 내용이 바뀌면 달라지고, 같으면 같고, 못 받으면 알린다(예외 없음)', async () => {
  const { collectCurrentContent } = await loadHelper();
  const payload = JSON.parse(mixedAssignment().mixed_payload_json);
  const options = text => ({ baseUrl: 'https://example.test/archive', fetchImpl: fetchOf({ [`exams/${FILE}`]: text }) });
  const a = await collectCurrentContent({}, payload, options(examText('①')));
  const b = await collectCurrentContent({}, payload, options(examText('①')));
  const c = await collectCurrentContent({}, payload, options(examText('②')));
  assert.equal(a.complete, true);
  assert.deepEqual(a.files, [`exams/${FILE}`]);
  assert.equal(a.fingerprint, b.fingerprint, '같은 내용은 같은 지문');
  assert.notEqual(a.fingerprint, c.fingerprint, '정답 한 칸이 고쳐지면 지문이 달라진다');
  const down = await collectCurrentContent({}, payload, options(null));
  assert.equal(down.complete, false);
  assert.deepEqual(down.failed, [`exams/${FILE}`]);
  assert.notEqual(down.fingerprint, a.fingerprint);
  const throwing = await collectCurrentContent({}, payload, { baseUrl: 'https://example.test/archive', fetchImpl: async () => { throw new Error('boom'); } });
  assert.equal(throwing.complete, false);
  const none = await collectCurrentContent({}, { questions: [{ id: 1, sourceKind: 'generated', generatedUid: 'g1' }] }, options(examText('①')));
  assert.equal(none.fingerprint, '', '시험지 파일이 필요 없는 출제는 지문이 없다');
});

test('일반 원본 출제(사본 없음)는 출제 파일 하나의 지문을 쓴다. 안전하지 않은 경로는 받지 않는다', async () => {
  const { sourceFilesOf, safeExamPath } = await loadHelper();
  assert.deepEqual(sourceFilesOf({ archive_file: `exams/${FILE}` }, null), [`exams/${FILE}`]);
  assert.deepEqual(sourceFilesOf({ archive_file: FILE }, null), [`exams/${FILE}`]);
  assert.deepEqual(sourceFilesOf({ archive_file: 'MIXED:abc' }, null), []);
  for (const bad of ['../x.js', 'exams/../x.js', 'https://evil.test/a.js', 'exams/a.txt', 'exams/a b.js?x=1', 'exams/a+b.js'])
    assert.equal(safeExamPath(bad), '', bad);
});

test('덮어쓰기: 고쳐진 문항만 지금 내용으로, 길이·순서·번호·배점은 사본 그대로', async () => {
  const { overlayCurrentQuestions, PARSE_EXAM_SOURCES_EXPRESSION } = await loadHelper();
  const texts = new Map([[`exams/${FILE}`, examText('②', '고쳐진 발문')]]);
  const questions = snapshotQuestions();
  const out = await overlayCurrentQuestions(questions, texts, async sources => parserFrom(PARSE_EXAM_SOURCES_EXPRESSION)(sources));
  assert.equal(out.replaced, 1);
  assert.equal(out.questions.length, 2);
  assert.deepEqual(out.questions.map(q => q.questionUid), questions.map(q => q.questionUid));
  assert.equal(out.questions[0].answer, '②');
  assert.equal(out.questions[0].content, '고쳐진 발문');
  assert.equal(out.questions[0].solution, '해설');
  assert.deepEqual(out.questions.map(q => [q.id, q.score]), [[1, 5], [2, 6]]);
  assert.equal(questions[0].answer, '①', '입력 사본은 바뀌지 않는다');
});

test('덮어쓰기: 해석 실패·파일 없음·자리가 바뀐 문항은 사본 그대로(오류 없음)', async () => {
  const { overlayCurrentQuestions, PARSE_EXAM_SOURCES_EXPRESSION } = await loadHelper();
  const questions = snapshotQuestions();
  const parse = async sources => parserFrom(PARSE_EXAM_SOURCES_EXPRESSION)(sources);
  const broken = await overlayCurrentQuestions(questions, new Map([[`exams/${FILE}`, 'this is not js (']]), parse);
  assert.equal(broken.questions, questions);
  assert.equal(broken.replaced, 0);
  const empty = await overlayCurrentQuestions(questions, new Map(), parse);
  assert.equal(empty.questions, questions);
  const thrown = await overlayCurrentQuestions(questions, new Map([[`exams/${FILE}`, examText('②')]]), async () => { throw new Error('page closed'); });
  assert.equal(thrown.questions, questions);
  // 시험지에서 문항 번호가 달라졌으면(자리가 바뀜) 그 문항은 덮지 않는다.
  const moved = snapshotQuestions();
  moved[0].id = 9;
  const kept = await overlayCurrentQuestions(moved, new Map([[`exams/${FILE}`, examText('②', '고쳐진 발문')]]), parse);
  assert.equal(kept.questions[0].content, '옛 발문');
});

test('캐시 키: 시험지가 고쳐지면 PDF 키가 달라지고, 그대로면 같다. 내용 지문 없이는 옛 모양 그대로', async () => {
  const { buildPdfIdentity } = await loadRoute();
  const env = { ARCHIVE_PUBLIC_BASE_URL: 'https://example.test/archive' };
  const id = (text, assignment = mixedAssignment()) => buildPdfIdentity(assignment, { env, fetchImpl: fetchOf({ [`exams/${FILE}`]: text }) });
  const before = await id(examText('①'));
  const same = await id(examText('①'));
  const fixed = await id(examText('②'));
  assert.equal(before.hash, same.hash);
  assert.notEqual(before.hash, fixed.hash);
  assert.notEqual(before.objectKey, fixed.objectKey);
  assert.equal(before.content.complete, true);
  const plain = await buildPdfIdentity(mixedAssignment());
  assert.equal(plain.content, null, 'env·fetchImpl 없이는 지문을 만들지 않는다(네트워크 없음)');
  // 사본 없는 일반 원본 출제도 출제 파일이 고쳐지면 키가 달라진다(engine.html이 지금 파일을 열기 때문에 캐시만 문제다).
  const original = { id: 'asg-2', class_id: 'class-1', archive_file: `exams/${FILE}`, exam_title: '원본', question_count: 2, pdf_qpp: 4 };
  const o1 = await id(examText('①'), original);
  const o2 = await id(examText('②'), original);
  assert.notEqual(o1.hash, o2.hash);
});

function fakeEnv({ bucket = {}, browser } = {}) {
  const updates = [];
  return {
    updates,
    env: {
      ARCHIVE_PUBLIC_BASE_URL: 'https://example.test/archive',
      BROWSER: browser === undefined ? {} : browser,
      EXAM_PDF_BUCKET: { head: async () => null, put: async () => { throw new Error('저장하면 안 된다'); }, ...bucket },
      DB: {
        prepare(sql) {
          return {
            bind() { return this; },
            async first() { return /FROM classes/.test(sql) ? { name: '반', teacher_name: '선생님' } : null; },
            async run() { updates.push(sql); return { success: true }; },
          };
        },
      },
    },
  };
}

test('내려받기 새로 만들기: 지문을 못 만들거나 새로 못 그리면 저장된 PDF를 그대로 준다(막지 않는다)', async () => {
  const { refreshAssignmentPdfIfStale, buildPdfIdentity } = await loadRoute();
  const stored = identity => mixedAssignment({
    pdf_status: 'ready', pdf_object_key: identity.objectKey, pdf_content_hash: identity.hash, pdf_page_count: 2,
  });
  const base = { env: { ARCHIVE_PUBLIC_BASE_URL: 'https://example.test/archive' } };
  const v1 = await buildPdfIdentity(mixedAssignment(), { ...base, fetchImpl: fetchOf({ [`exams/${FILE}`]: examText('①') }) });
  const ready = stored(v1);

  // 1) 그대로면 같은 행, 아무것도 쓰지 않는다.
  const a = fakeEnv();
  assert.equal(await refreshAssignmentPdfIfStale(a.env, ready, { fetchImpl: fetchOf({ [`exams/${FILE}`]: examText('①') }) }), ready);
  assert.equal(a.updates.length, 0);

  // 2) 시험지 파일을 못 받으면 고쳐졌는지 알 수 없으므로 그대로.
  const b = fakeEnv();
  assert.equal(await refreshAssignmentPdfIfStale(b.env, ready, { fetchImpl: fetchOf({ [`exams/${FILE}`]: null }) }), ready);
  assert.equal(b.updates.length, 0);

  // 3) 고쳐졌지만 브라우저 렌더가 안 되면 저장된 PDF 그대로, 상태도 failed로 바꾸지 않는다.
  const c = fakeEnv();
  assert.equal(await refreshAssignmentPdfIfStale(c.env, ready, { fetchImpl: fetchOf({ [`exams/${FILE}`]: examText('②') }) }), ready);
  assert.equal(c.updates.length, 0, '실패해도 DB 상태를 건드리지 않는다');

  // 4) 고쳐졌고 새 키의 PDF가 이미 있으면 그 PDF로 바꿔 가리킨다(다시 그리지 않는다).
  const fixedId = await buildPdfIdentity(mixedAssignment(), { ...base, fetchImpl: fetchOf({ [`exams/${FILE}`]: examText('②') }) });
  const d = fakeEnv({ bucket: { head: async key => (key === fixedId.objectKey ? { size: 1234, customMetadata: { pageCount: '3' } } : null) } });
  await refreshAssignmentPdfIfStale(d.env, ready, { fetchImpl: fetchOf({ [`exams/${FILE}`]: examText('②') }) });
  assert.equal(d.updates.length, 1);

  // 5) 이미 준비되지 않은 출제·바인딩 없는 환경은 건드리지 않는다.
  const e = fakeEnv();
  const notReady = { ...ready, pdf_status: 'failed' };
  assert.equal(await refreshAssignmentPdfIfStale(e.env, notReady), notReady);
  assert.equal(await refreshAssignmentPdfIfStale({}, ready), ready);
});

test('구조: 내려받기 길과 생성 길이 모두 고쳐진 내용 처리를 거치고, 인쇄 대기·불투명 치환 단계는 그대로다', () => {
  const route = fs.readFileSync(path.join(workerDir, 'routes', 'exam-pdf.js'), 'utf8');
  const exams = fs.readFileSync(path.join(workerDir, 'routes', 'exams.js'), 'utf8');
  assert.match(route, /current_content: content\.fingerprint/, '캐시 키에 내용 지문');
  assert.match(route, /renderWithSnapshotFallback/, '덮어 그린 PDF가 안 그려지면 사본으로 다시');
  assert.match(route, /Archive2PdfReadiness\.assertReady/, '인쇄 준비 확인(이미지 디코드·넘침)은 그대로');
  assert.match(exams, /createAssignmentPdfDownloadResponse\(env, await refreshAssignmentPdfIfStale\(env, assignment\)\)/);
});
