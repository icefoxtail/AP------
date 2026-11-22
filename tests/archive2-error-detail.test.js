// 실패 문구에 "어느 시험지 몇 번 문항인지"가 들어가는지 지킨다 (2026-11-18).
// 결함 조건 위주: 한글 없는 원문이 상세에서 사라지는가, 파일·번호가 문구에 안 들어가는가, 여러 건이 줄어들지 않는가,
// 일반 문구 한 줄이 아니라 접힌 상세로 복사할 수 있는가. 시험지 데이터 없이 가짜 원본 파일로 돈다.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const ED = require('../archive/archive2-error-detail.js');
const Source = require('../archive/archive2-source.js');
const Assign = require('../archive/archive2-assign.js');

const FILE = 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js';
const FILE_SYNTAX = 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_구문오류.js';
const FILE_GONE = 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_없는파일.js';
const BASE = 'https://archive.test/archive/workspace.html';
const tick = () => new Promise((resolve) => setImmediate(resolve));

async function recordFor(file, ordinal, question, no = ordinal, overrides = {}) {
  return {
    sourceFile: file, sourceOrdinal: ordinal, sourceQuestionNo: no,
    questionUid: 'qid_v1_' + await Source.digest(file + '#' + ordinal),
    sourceFingerprint: await Source.fingerprint(question), ...overrides,
  };
}
const fetcherFor = (files) => async (url) => {
  const name = decodeURIComponent(new URL(url).pathname.replace(/^.*\/exams\//, ''));
  if (!(name in files)) return { ok: false, status: 404, text: async () => '' };
  return { ok: true, status: 200, text: async () => files[name] };
};
const bankSource = (questions) => 'window.questionBank = ' + JSON.stringify(questions) + ';';
async function restoreError(records, files) {
  try {
    await Source.restore(records, { sourceHashes: [] }, { fetcher: fetcherFor(files), baseUrl: BASE });
  } catch (error) { return error; }
  assert.fail('restore should have failed');
}

test('한글이 없는 원문은 버리지 않고 상세에 남기며, 일반 문구는 한글 한 문장이다', () => {
  const info = ED.describe(new Error("Unexpected token '}'"));
  assert.match(info.message, /^[^A-Za-z]*작업을 처리하지 못했습니다/);
  assert.doesNotMatch(info.message, /Unexpected/);
  assert.equal(info.hasDetail, true);
  assert.match(info.detailText, /원문: Unexpected token '}'/);
  assert.match(info.copyText, /원문: Unexpected token '}'/);
  // 서버 영문 문구(payload exceeds 900KB 등)와 응답 상태도 같다.
  const server = Object.assign(new Error('payload exceeds 900KB'), { status: 413, data: { error: 'payload exceeds 900KB' } });
  const serverInfo = ED.describe(server);
  assert.match(serverInfo.detailText, /서버 응답 상태: 413/);
  assert.match(serverInfo.detailText, /payload exceeds 900KB/);
  // 코드 접두어는 화면 문구에서 빠지고 코드 줄로 남는다.
  const coded = ED.describe(new Error('CANONICAL_AUTHORITY_UNAVAILABLE: 단원·분류 기준을 불러오지 못했습니다.'));
  assert.equal(coded.message, '단원·분류 기준을 불러오지 못했습니다.');
  assert.match(coded.detailText, /오류 코드: CANONICAL_AUTHORITY_UNAVAILABLE/);
});

test('평범한 한글 안내는 조용하다: 상세 버튼이 생기지 않는다', () => {
  const info = ED.describe(new Error('저장 결과를 먼저 확인해 주세요.'));
  assert.equal(info.message, '저장 결과를 먼저 확인해 주세요.');
  assert.equal(info.hasDetail, false);
  assert.equal(ED.markup(info), '');
});

test('파일과 문항 번호를 실은 오류는 시험지 이름과 번호가 한 줄에 들어간다', () => {
  const error = ED.annotate(new Error('문항의 source fingerprint가 일치하지 않습니다.'),
    { file: FILE, questionNo: 23, uid: 'qid_v1_abc', code: 'QUESTION_NOT_FOUND' });
  const info = ED.describe(error, { locatedFallback: '문제지를 불러오지 못했습니다.', screen: '문제지 만들기' });
  assert.equal(info.message,
    '문제지를 불러오지 못했습니다. — 2024 금당중 중3 2학기 중간 · 수학, 23번 문항: 원본 파일에서 이 문항을 찾지 못했습니다.');
  assert.match(info.detailText, /파일: original\/middle\/m3\/2mid\/24_금당중_2학기_중간_중3_수학\.js/);
  assert.match(info.detailText, /문항 번호: 23/);
  assert.match(info.detailText, /문항 UID: qid_v1_abc/);
  assert.match(info.detailText, /오류 코드: QUESTION_NOT_FOUND/);
  assert.match(info.copyText, /화면: 문제지 만들기/);
  assert.match(info.copyText, /시각: \d{4}-\d{2}-\d{2}T/);
});

test('annotate는 더 안쪽에서 아는 값을 덮어쓰지 않는다', () => {
  const error = ED.annotate(new Error('x'), { file: 'a/inner.js', code: 'INNER' });
  ED.annotate(error, { file: 'b/outer.js', code: 'OUTER', title: '바깥 제목' });
  assert.equal(error.apDetail.file, 'a/inner.js');
  assert.equal(error.apDetail.code, 'INNER');
  assert.equal(error.apDetail.title, '바깥 제목');
});

test('시험지 제목이 있으면 제목, 없으면 파일명에서 확장자와 밑줄을 정리한 이름을 쓴다', () => {
  assert.equal(ED.fileLabel('a/b/세미_자료.js'), '세미 자료');
  assert.equal(ED.fileLabel('a/b/세미_자료.js', '내가 붙인 제목'), '내가 붙인 제목');
  assert.equal(ED.fileLabel('MIXED:abc123'), '단원별 문제지');
  assert.equal(ED.fileLabel('exams/25_금당고_2학기_중간_고1_기출.js'), '2025 금당고 고1 2학기 중간');
});

test('여러 문항이 실패하면 처음 5개만 나열하고 "외 N개"로 줄인다', () => {
  const failures = Array.from({ length: 8 }, (_, i) => ({ file: FILE, questionNo: i + 1, code: 'QUESTION_NOT_FOUND' }));
  const error = Object.assign(new Error('x'), { apDetail: { failures } });
  const info = ED.describe(error, {});
  assert.match(info.where, /^8개 문항: /);
  for (const no of [1, 2, 3, 4, 5]) assert.match(info.where, new RegExp(`${no}번`));
  assert.doesNotMatch(info.where, /6번|7번|8번/);
  assert.match(info.where, /외 3개/);
  // 복사 글에는 전체 목록이 들어간다(고칠 사람이 하나도 놓치지 않게).
  assert.match(info.copyText, /실패한 문항 8개/);
  assert.match(info.copyText, /8번/);
});

test('복사 글의 원문은 200자까지, 상세 화면은 더 길게 보여 준다', () => {
  const long = 'E'.repeat(900);
  const info = ED.describe(new Error(long));
  const raw = (text) => text.split('\n').find((line) => line.startsWith('원문: ')).slice(4);
  assert.ok(raw(info.copyText).length <= 201);
  assert.ok(raw(info.detailText).length > 400);
});

test('Source.restore: 원본에 없는 문항은 어느 시험지 몇 번인지 오류에 실린다', async () => {
  const q1 = { id: 1, content: '첫 문항', answer: '1' };
  const files = { [FILE]: bankSource([q1]) };
  const missing = await recordFor(FILE, 5, { ...q1, id: 5 }, 23);
  const error = await restoreError([missing], files);
  assert.equal(error.message, '문항의 source fingerprint가 일치하지 않습니다.');
  assert.equal(error.apDetail.file, FILE);
  assert.equal(error.apDetail.questionNo, 23);
  assert.equal(error.apDetail.code, 'QUESTION_NOT_FOUND');
  assert.match(error.apDetail.uid, /^qid_v1_/);
  const info = ED.describe(error, {});
  assert.match(info.message, /23번 문항: 원본 파일에서 이 문항을 찾지 못했습니다\./);
  assert.match(info.message, /금당중/);
});

test('Source.restore: 내용이 바뀐 문항과 UID가 어긋난 문항은 코드가 다르고 번호가 같이 실린다', async () => {
  const q1 = { id: 1, content: '첫 문항', answer: '1' };
  const files = { [FILE]: bankSource([q1]) };
  const changed = await recordFor(FILE, 1, { ...q1, content: '다른 내용' }, 7);
  assert.equal((await restoreError([changed], files)).apDetail.code, 'QUESTION_CONTENT_CHANGED');
  const wrongUid = await recordFor(FILE, 1, q1, 8, { questionUid: 'qid_v1_ffff' });
  const uidError = await restoreError([wrongUid], files);
  assert.equal(uidError.apDetail.code, 'QUESTION_UID_MISMATCH');
  assert.equal(uidError.apDetail.questionNo, 8);
});

test('Source.restore: 여러 문항이 막히면 하나만 보이지 않고 모두 모인다(성공/실패 판정은 그대로)', async () => {
  const q = { id: 1, content: '첫 문항', answer: '1' };
  const files = { [FILE]: bankSource([q]) };
  const ok = await recordFor(FILE, 1, q, 1);
  const bad = await Promise.all([2, 3, 4].map((n) => recordFor(FILE, n, { ...q, id: n }, 20 + n)));
  const error = await restoreError([ok, ...bad], files);
  assert.equal(error.apDetail.failures.length, 3);
  assert.deepEqual(error.apDetail.failures.map((f) => f.questionNo), [22, 23, 24]);
  const info = ED.describe(error, {});
  assert.match(info.where, /^3개 문항: /);
  assert.match(info.where, /22번/);
  assert.match(info.where, /24번/);
});

test('Source.restore: 원본 파일 구문 오류의 영문 원문이 상세에 남고 파일 이름이 문구에 들어간다', async () => {
  const files = { [FILE_SYNTAX]: 'window.questionBank = [ {id: 1, ' };
  const q = { id: 1, content: 'c' };
  const error = await restoreError([await recordFor(FILE_SYNTAX, 1, q, 3)], files);
  assert.equal(error.apDetail.code, 'SOURCE_EVALUATE_FAILED');
  assert.equal(error.apDetail.file, FILE_SYNTAX);
  const info = ED.describe(error, {});
  assert.doesNotMatch(info.message, /Unexpected|SyntaxError/);
  assert.match(info.message, /금당중/);
  assert.match(info.detailText, new RegExp('원문: ' + String(error.message).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 20)));
});

test('Source.restore: 원본 파일을 못 내려받으면 어느 파일인지와 이 파일에서 가져오려던 번호가 실린다', async () => {
  const q = { id: 1, content: 'c' };
  const error = await restoreError([await recordFor(FILE_GONE, 1, q, 12)], {});
  assert.equal(error.apDetail.code, 'SOURCE_FETCH_FAILED');
  assert.equal(error.apDetail.file, FILE_GONE);
  assert.equal(error.apDetail.questionNo, 12);
  assert.match(ED.describe(error, {}).message, /12번 문항: 원본 파일을 내려받지 못했습니다\./);
});

test('markup: 상세는 버튼으로 열고 닫히고, 상세 글은 평소 HTML에 없다가 열 때 채워진다', () => {
  const error = ED.annotate(new Error('<b>Boom</b> & "quote"'), { file: FILE, questionNo: 3 });
  const html = ED.markup(ED.describe(error, {}));
  assert.match(html, /<button type="button" class="ap-error-detail-toggle" data-ap-error-toggle aria-expanded="false" aria-controls="(ap-error-detail-\d+)">상세 보기<\/button>/);
  const id = /aria-controls="([^"]+)"/.exec(html)[1];
  assert.match(html, new RegExp(`id="${id}" hidden`));
  // 서버 원문·내부 용어는 평소 화면 HTML에 섞여 나오지 않는다(열기 전에는 상자가 비어 있다).
  assert.doesNotMatch(html, /Boom|문항 번호|금당중/);
  assert.match(html, new RegExp(`data-ap-error-copy data-ap-error-id="${id}"`));
  const entry = ED.lookup(id);
  assert.match(entry.detailText, /문항 번호: 3/);
  assert.match(entry.copyText, /원문: <b>Boom<\/b> & "quote"/);
});

test('toggleFrom과 copyFrom: 열 때 상세 글을 채우고, 복사는 클립보드로 한 번에 간다', async () => {
  const html = ED.markup(ED.describe(ED.annotate(new Error('Boom'), { file: FILE, questionNo: 3 }), {}));
  const id = /aria-controls="([^"]+)"/.exec(html)[1];
  const attrs = { 'aria-expanded': 'false', 'aria-controls': id };
  const button = {
    textContent: '상세 보기',
    getAttribute: (name) => attrs[name] ?? null, setAttribute: (name, value) => { attrs[name] = value; },
  };
  const pre = { textContent: '' };
  const panel = { hidden: true, querySelector: () => pre };
  const doc = { getElementById: (wanted) => (wanted === id ? panel : null) };
  assert.equal(ED.toggleFrom(button, doc), true);
  assert.match(pre.textContent, /문항 번호: 3/, '열 때 상세 글이 채워진다');
  assert.equal(panel.hidden, false);
  assert.equal(attrs['aria-expanded'], 'true');
  assert.equal(button.textContent, '상세 닫기');
  assert.equal(ED.toggleFrom(button, doc), false);
  assert.equal(panel.hidden, true);

  let copied = null;
  const note = { textContent: '' };
  const copyButton = { getAttribute: (name) => (name === 'data-ap-error-id' ? id : null), parentNode: { querySelector: () => note } };
  assert.equal(await ED.copyFrom(copyButton, { navigator: { clipboard: { writeText: async (text) => { copied = text; } } } }), true);
  assert.equal(copied, ED.lookup(id).copyText);
  assert.match(copied, /문항 번호: 3[\s\S]*원문: Boom/);
  assert.match(note.textContent, /복사했습니다/);
  // 클립보드를 못 쓰면 실패를 말한다(조용히 성공한 척하지 않는다).
  assert.equal(await ED.copyFrom(copyButton, { navigator: {}, document: { createElement() { throw new Error('no dom'); } } }), false);
  assert.match(note.textContent, /복사하지 못했습니다/);
});

// ---- 출제 패널 ---------------------------------------------------------------------------------------------
const EXAM_FILE = '2024/금당중-중3-2학기-중간.js';
const httpError = (status, data) => Object.assign(new Error(data.error), { status, data });
function panelModel({ loadQuestions, post }) {
  const request = async (route, opt = {}) => {
    await tick();
    if (route === '/qr-classes') return { success: true, classes: [{ id: 'c1', name: '중3 A반', grade: '중3' }] };
    if (route.startsWith('/class-exam-assignments/roster?')) return { success: true, students: [{ id: 's1', name: '학생 1' }] };
    if (route.startsWith('/class-exam-assignments/recent-summary?')) return { success: true, assignments: [] };
    if (route === '/class-exam-assignments' && opt.method === 'POST') return post(opt);
    throw httpError(404, { error: 'no route ' + route });
  };
  const store = new Map();
  return Assign.createModel({
    items: [{ kind: 'original', file: EXAM_FILE, title: '2024 금당중 중3 2학기 중간', identityTitle: 'x', grade: '중3', subject: '중3 수학', count: 2, sourceHash: 'h', settings: undefined }],
    request, storage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
    now: () => Date.parse('2026-11-18T03:00:00Z'), recentCache: Assign.createRecentCache(),
    original: { indexVersion: 'idx', loadQuestions },
  });
}

test('출제 준비 실패: 원본의 몇 번 문항이 막혔는지 패널 문구와 상세에 나온다(콘솔에만 가지 않는다)', async () => {
  const loadQuestions = async () => {
    throw ED.annotate(new Error('원본 로드 실패 (404): ' + EXAM_FILE), { file: EXAM_FILE, questionNo: 14, code: 'QUESTION_NOT_FOUND' });
  };
  const model = panelModel({ loadQuestions, post: () => { throw new Error('should not post'); } });
  await model.load();
  await tick();
  await model.toggleClass('c1', true);
  assert.equal(await model.start(), false);
  assert.match(model.state.startError, /시험지 원본을 불러오지 못했습니다\./);
  assert.match(model.state.startError, /14번 문항/);
  assert.match(model.state.startErrorDetail.detailText, /문항 번호: 14/);
  assert.match(model.state.startErrorDetail.detailText, /오류 코드: QUESTION_NOT_FOUND/);
  const html = Assign.render(model).foot;
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /상세 보기/);
  assert.doesNotMatch(html, /QUESTION_NOT_FOUND|문항 번호/, '상세 글은 열기 전에는 HTML에 없다');
  // 다시 누르면(성공해도 실패해도) 이전 상세는 지워진다.
  model.state.startErrorDetail = { stale: true };
  await model.start();
  assert.notEqual(model.state.startErrorDetail?.stale, true);
});

test('출제 준비 실패: 영문 오류(구문 오류 등)도 상세 원문에 남는다', async () => {
  const loadQuestions = async () => { throw new SyntaxError("Unexpected token '}'"); };
  const model = panelModel({ loadQuestions, post: () => { throw new Error('should not post'); } });
  await model.load();
  await tick();
  await model.toggleClass('c1', true);
  await model.start();
  assert.match(model.state.startError, /시험지 원본을 불러오지 못했습니다/);
  assert.doesNotMatch(model.state.startError, /Unexpected/);
  assert.match(model.state.startErrorDetail.detailText, /원문: Unexpected token '}'/);
  assert.match(model.state.startErrorDetail.detailText, /파일: 2024\/금당중-중3-2학기-중간\.js/);
});

test('서버가 거절한 건: 화면 문구는 그대로고, 서버 원문·응답 상태·시험지 이름이 상세에 남는다', async () => {
  const questions = [{ no: 1, content: 'a', answer: '1' }, { no: 2, content: 'b', answer: '2' }];
  const model = panelModel({
    loadQuestions: async () => questions,
    post: () => { throw httpError(409, { error: '문항 내용 fingerprint가 일치하지 않습니다.' }); },
  });
  await model.load();
  await tick();
  await model.toggleClass('c1', true);
  await model.start();
  await tick();
  const job = model.state.jobs[0];
  assert.equal(job.status, 'failed');
  assert.match(job.message, /출제하지 못했습니다/, '화면 문구는 그대로 일반 문구');
  assert.match(job.detail.detailText, /서버 응답 상태: 409/);
  assert.match(job.detail.detailText, /문항 내용 fingerprint가 일치하지 않습니다\./);
  assert.match(job.detail.detailText, /시험지: 2024 금당중 중3 2학기 중간/);
  const body = Assign.render(model).body;
  assert.match(body, /상세 보기/);
  assert.doesNotMatch(body, /fingerprint|서버 응답 상태/, '서버 원문은 열기 전에는 평소 화면 HTML에 섞이지 않는다');
});

// 파일을 개명한 시험지의 문항은 개명 전 UID를 그대로 둔다(카탈로그 만들기가 VERIFIED로 싣고 Worker도 통과시킨다). 화면 복원도 같은 판정을 따른다.
// 카탈로그의 identityByUid가 그 UID를 VERIFIED로 같은 파일·같은 순번에 묶은 경우만 허용하고, 나머지 검증(파일 SHA·지문·순번)은 그대로다.
const RENAMED_FROM = 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_구형이름.js';
async function renamedRecord(identityOverrides, recordOverrides = {}) {
  const q1 = { id: 1, content: '첫 문항', answer: '1' };
  const record = await recordFor(FILE, 1, q1, 1, {
    questionUid: 'qid_v1_' + await Source.digest(RENAMED_FROM + '#1'), ...recordOverrides,
  });
  const identity = identityOverrides === null ? undefined
    : { questionUid: record.questionUid, sourceArchiveFile: FILE, sourceOrdinal: 1, status: 'VERIFIED', ...identityOverrides };
  const catalog = { sourceHashes: [], canonicalAuthority: { identityByUid: identity ? { [record.questionUid]: identity } : {} } };
  return { record, catalog, files: { [FILE]: bankSource([q1]) } };
}
const restoreWith = (rename) => Source.restore([rename.record], rename.catalog, { fetcher: fetcherFor(rename.files), baseUrl: BASE });

test('Source.restore: 개명된 시험지의 문항은 카탈로그가 VERIFIED로 묶은 UID로 복원된다', async () => {
  const rename = await renamedRecord({});
  const [question] = await restoreWith(rename);
  assert.equal(question.questionUid, rename.record.questionUid);
  assert.equal(await Source.uidMatchesSource(rename.record, rename.catalog), true);
});

test('Source.restore: 개명 허용은 카탈로그가 같은 파일·순번·UID로 VERIFIED한 경우뿐이다(그 밖은 QUESTION_UID_MISMATCH)', async () => {
  const cases = {
    '카탈로그에 신원 없음': await renamedRecord(null),
    'VERIFIED 아님': await renamedRecord({ status: 'UNRESOLVED' }),
    '다른 파일': await renamedRecord({ sourceArchiveFile: FILE_SYNTAX }),
    '다른 순번': await renamedRecord({ sourceOrdinal: 2 }),
    '신원의 UID가 다름': await renamedRecord({ questionUid: 'qid_v1_' + 'a'.repeat(64) }),
  };
  for (const [label, rename] of Object.entries(cases)) {
    const failure = await restoreWith(rename).then(() => null, (error) => error);
    assert.equal(failure?.apDetail?.code, 'QUESTION_UID_MISMATCH', label);
  }
  // 카탈로그에 canonicalAuthority 자체가 없어도 개명 문항은 막힌다(기존 음성 시험과 같은 호출 모양).
  const bare = await renamedRecord({});
  assert.equal((await restoreError([bare.record], bare.files)).apDetail.code, 'QUESTION_UID_MISMATCH');
  // 지문이 바뀐 개명 문항은 UID 판정과 별개로 여전히 막힌다.
  const changed = await renamedRecord({}, { sourceFingerprint: 'f'.repeat(64) });
  assert.equal((await restoreWith(changed).then(() => null, (error) => error))?.apDetail?.code, 'QUESTION_CONTENT_CHANGED');
});

test('실제 자료: 개명 이력에 있는 시험지의 문항은 전부 화면 복원 판정을 통과하고 원본 파일에서 복원된다', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const { catalog } = require('./helpers/archive2-scope-harness.cjs');
  const archive = path.resolve(__dirname, '../archive');
  const identity = JSON.parse(fs.readFileSync(path.join(archive, 'data/question_identity_map.json'), 'utf8'));
  const renamedFiles = new Set((identity.verifiedPathRenameHistory || []).map((row) => row.to));
  const records = catalog.records.filter((record) => renamedFiles.has(record.sourceFile));
  assert.ok(renamedFiles.size > 0 && records.length > 0, '개명 이력과 그 시험지의 문항이 있다');
  for (const record of records) assert.equal(await Source.uidMatchesSource(record, catalog), true, record.questionUid);
  const restored = await Source.restore(records, catalog, {
    baseUrl: 'https://archive.test/archive/workspace.html',
    fetcher: async (url) => {
      const file = path.join(archive, decodeURIComponent(new URL(url).pathname.replace(/^\/archive\//, '')));
      return { ok: true, status: 200, text: async () => fs.readFileSync(file, 'utf8') };
    },
  });
  assert.deepEqual(restored.map((question) => question.questionUid), records.map((record) => record.questionUid));
  // 개명 이력 밖에서 UID가 공식과 다른 문항은 없다(다른 이유로 어긋난 문항이 조용히 통과하지 않게).
  const noIdentity = { ...catalog, canonicalAuthority: { identityByUid: {} } };
  const stray = [];
  for (const record of catalog.records) {
    if (!renamedFiles.has(record.sourceFile) && !(await Source.uidMatchesSource(record, noIdentity))) stray.push(record.questionUid);
  }
  assert.deepEqual(stray, []);
});
