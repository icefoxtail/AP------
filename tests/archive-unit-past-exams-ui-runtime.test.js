const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const archive2Session = require(path.join(archiveRoot, 'archive2-session.js'));

// 옛 주소(ready 없음)로 열어도 표 화면이 유일한 화면이다: 기본 주소가 옛 모양이다.
function createRuntime(options = {}) {
  let currentUrl = new URL(options.url || 'http://unit.test/archive/unit-past-exams.html?grade=h1&unit=H22-C-01');
  const elements = new Map();
  const grades = [];

  class FakeElement {
    constructor(id = '') {
      this.id = id; this.innerHTML = ''; this.textContent = ''; this.value = 'exam';
      this.checked = false; this.style = {}; this.dataset = {}; this.attributes = {};
      this.classList = { toggle: (name, on) => { this.attributes[`class:${name}`] = Boolean(on); } };
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    scrollIntoView() {}
    get selectedOptions() { return []; }
  }
  const getElement = id => {
    if (!elements.has(id)) elements.set(id, new FakeElement(id));
    return elements.get(id);
  };
  const document = {
    body: { appendChild() {} },
    createElement: () => new FakeElement(),
    getElementById: getElement,
    querySelectorAll(selector) {
      if (selector === '.ug-loading .ug-grade') return grades;
      return [];
    },
    querySelector() { return null; }
  };
  const setUrl = next => {
    currentUrl = new URL(next, currentUrl);
    window.location = currentUrl;
  };
  const history = {
    pushState(_state, _title, url) { setUrl(url); },
    replaceState(_state, _title, url) { setUrl(url); }
  };
  const window = {
    UnitPastExamsCore: core,
    questionIndex: options.questionIndex || [{
      sourceFile: 'original/high/h1/1mid/25_runtime.js', sourceOrdinal: 1, id: 1,
      grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
      question_uid: 'runtime-uid', subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중'
    }],
    ...(options.teacher ? { Archive2Session: archive2Session } : {}),
    ...(options.window || {}),
    location: currentUrl,
    addEventListener() {},
    scrollTo() {}
  };
  const stored = new Map(Object.entries(options.storage || {}));
  const context = {
    window, document, history, console, URL, URLSearchParams, Map, Set, Date, Math, Number, String, Boolean, Array, JSON, Promise,
    localStorage: {
      getItem: key => (options.teacher && key === 'APMATH_SESSION' ? JSON.stringify({ role: 'teacher' }) : (stored.has(key) ? stored.get(key) : null)),
      setItem: (key, value) => { stored.set(key, String(value)); }
    },
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    btoa: value => Buffer.from(value, 'binary').toString('base64')
  };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8'), context, { filename: 'unit-past-exams.js' });
  return { window, document, history, elements, grades, getElement, setUrl, stored, get url() { return currentUrl.toString(); } };
}

test('단원 x 단계 표 한 화면에서 칸을 눌러 바로 문제지를 만든다(주소에 ready가 없어도 같다)', () => {
  const runtime = createRuntime();
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /class="ug-table"/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /유사문제 먼저, 기출 다음/);
  assert.match(html, /aria-disabled="true"/, '유사문제 탭은 자리만 있고 누를 수 없다');
  assert.match(html, /유사문제 단계 작업이 끝나면 열립니다/);
  assert.match(html, /aria-label="다항식의 연산 단계 미지정 1문항"/);
  assert.match(html, /있는 만큼 전부/);
  assert.doesNotMatch(html, /세분 출제|unit-ready-paper|previewExistingPaper|fa-(solid|regular)|ug-fine/);
  assert.match(html, /id="ug-go"[^>]*disabled/, '아무것도 안 골랐으면 문제지 보기는 비활성');

  // 칸을 누르면 막힘 없이 바로 문제지가 만들어진다(문항이 1개여도 예외 없음).
  runtime.window.UnitPastExams.gridToggleCell('H22-C-01', 'none');
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항 · 1권/);
  assert.match(runtime.getElement('ug-table').innerHTML, /aria-pressed="true"/);
  // 칸마다 15문항이어도 모자란 칸은 막지 않고 있는 만큼만 넣는다.
  runtime.window.UnitPastExams.gridSetPer('15');
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항 · 1권/);
  assert.match(runtime.getElement('ug-bar').innerHTML, /모자란 칸 1곳은 있는 만큼만/);
  assert.match(runtime.getElement('ug-table').innerHTML, /is-short/);
  runtime.window.UnitPastExams.gridShowPapers();
  // 버튼 글자는 `출제`다(옛 `반에 출제`를 줄였다). 한 권뿐이면 전체 출제 버튼은 없다.
  assert.match(runtime.getElement('unit-content').innerHTML, /aria-label="[^"]* 출제">출제<\/button>/);
  assert.doesNotMatch(runtime.getElement('unit-content').innerHTML, /반에 출제|전체 출제/);
  // 줄 제목은 그 권을 구별해 주는 것(최신순이면 연도)이고, 고치기 버튼이 있다. 출력에 쓰는 title은 그대로 둔다.
  assert.match(runtime.getElement('unit-content').innerHTML, /<h3>2025년<\/h3>/);
  assert.match(runtime.getElement('unit-content').innerHTML, /gridOpenEdit\('grid-1'\)[^>]*>고치기</);
  assert.match(runtime.url, /view=papers/);
});

test('옛 주소(ready 없음, 옛 값)로 열면 grade·unit을 이어받은 표가 열리고 옛 값은 주소에서 지워진다', async () => {
  const old = 'http://unit.test/archive/unit-past-exams.html?grade=h1&unit=H22-C-01&step=confirm&collection=1&collectionSchools=a%2Cb&subUnit=%5B%22x%22%5D&mode=advanced&blueprint=%5B%5D&difficulty=%EC%83%81&metaApproved=1&seed=s';
  const runtime = createRuntime({ url: old, teacher: true });
  await runtime.window.UnitPastExams.init();
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /class="ug-table"/, '표가 유일한 화면이다');
  assert.match(html, /class="ug-row is-checked"/, '옛 주소의 단원이 체크되어 있다');
  assert.match(html, /<input type="checkbox" data-focus="k:H22-C-01" checked/);
  assert.doesNotMatch(html, /unit-grade-card|unit-subject-card|unit-step-panel|unit-subunits|세분 출제/);
  const params = new URL(runtime.url).searchParams;
  assert.equal(params.get('grade'), 'h1');
  for (const key of ['unit', 'step', 'collection', 'collectionSchools', 'subUnit', 'mode', 'blueprint', 'difficulty', 'metaApproved', 'seed'])
    assert.equal(params.has(key), false, `${key} is removed from the address`);
  assert.match(runtime.getElement('unit-kicker').textContent, /고1/);
});

test('ready=1이 있는 주소와 학년 없는 주소도 표 화면이다', async () => {
  const withReady = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html?ready=1&grade=h1', teacher: true });
  await withReady.window.UnitPastExams.init();
  assert.match(withReady.getElement('unit-content').innerHTML, /class="ug-table"/);
  assert.match(withReady.url, /ready=1/, 'unrelated parameters are left alone');
  const noGrade = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html', teacher: true });
  await noGrade.window.UnitPastExams.init();
  const html = noGrade.getElement('unit-content').innerHTML;
  assert.match(html, /학년을 고르면 단원과 난이도 단계가 한눈에 보이는 표가 나옵니다/);
  for (const label of ['중1', '중2', '중3', '고1', '고2', '고3']) assert.match(html, new RegExp(`data-profile="[mh]\\d"[^>]*>${label}<`));
  assert.doesNotMatch(html, /unit-grade-card/);
});

test('자료를 해석하는 동안 표 뼈대(학년 버튼·탭·자리 표시)를 먼저 그리고 첫 그리기 문을 연 뒤에야 자료를 해석한다', async () => {
  const calls = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const boot = {
    mountProgress(el) { calls.push('mountProgress'); assert.ok(el); },
    firstPaint() { calls.push('firstPaint'); return Promise.resolve(); },
    setStage(stage) { calls.push('stage:' + stage); },
    finish(failed) { calls.push('finish:' + failed); }
  };
  const runtime = createRuntime({
    url: 'http://unit.test/archive/unit-past-exams.html?grade=h1', teacher: true,
    window: { Archive2Boot: boot, __ARCHIVE_METADATA_READY__: gate.then(() => ({})) }
  });
  const started = runtime.window.UnitPastExams.init();
  await new Promise(resolve => setImmediate(resolve));
  const loading = runtime.getElement('unit-content').innerHTML;
  assert.match(loading, /class="ug ug-loading"/);
  assert.match(loading, /role="tablist"/);
  assert.match(loading, /data-profile="h1"[^>]*aria-pressed="true"/);
  assert.match(loading, /onclick="UnitPastExams\.gridPickGradeEarly\('m2'\)"/, '표가 열리기 전의 학년 버튼은 누를 수 있다');
  assert.match(loading, /data-boot-label/);
  assert.doesNotMatch(loading, /class="ug-cell|ug-table"/, '칸 숫자는 자료가 준비된 뒤에만 나온다(가짜 숫자 없음)');
  assert.deepEqual(calls, ['mountProgress', 'firstPaint'], '뼈대를 그린 직후 첫 그리기 문을 연다');
  // 기다리는 동안 다른 학년을 먼저 누르면 그 학년으로 표가 열린다.
  runtime.window.UnitPastExams.gridPickGradeEarly('m2');
  release();
  await started;
  assert.deepEqual(calls, ['mountProgress', 'firstPaint', 'stage:index', 'finish:false']);
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /class="ug-table"/);
  assert.match(html, /data-profile="m2"[^>]*aria-pressed="true"/);
  assert.equal(new URL(runtime.url).searchParams.get('grade'), 'm2');
});

test('로그인이 없거나 자료가 없으면 새 모양의 안내가 나오고 옛 화면으로 보내는 링크가 없다', async () => {
  const loggedOut = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html?grade=h1' });
  await loggedOut.window.UnitPastExams.init();
  const login = loggedOut.getElement('unit-content').innerHTML;
  assert.match(login, /선생님 로그인이 필요합니다/);
  assert.match(login, /로그인 후 다시 확인/);
  assert.doesNotMatch(login, /index\.html|mixer\.html|아카이브로 돌아가기/);

  const noIndex = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html?grade=h1', teacher: true, questionIndex: null });
  noIndex.window.questionIndex = undefined;
  // loadScript never resolves in this fake DOM, so show the failure path directly: the message and the retry button.
  noIndex.window.UnitPastExams.renderSafeFallback('시험용 오류');
  const fallback = noIndex.getElement('unit-content').innerHTML;
  assert.match(fallback, /단원별 출제 도구를 불러오지 못했습니다/);
  assert.match(fallback, /시험용 오류/);
  assert.match(fallback, /onclick="location\.reload\(\)">다시 시도<\/button>/);
  assert.doesNotMatch(fallback, /index\.html|mixer\.html|기존 아카이브|기존 믹서/);
});

test('뒤로 가기(popstate)는 주소의 학년으로 표를 다시 그린다', async () => {
  const runtime = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html?grade=h1', teacher: true });
  await runtime.window.UnitPastExams.init();
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?grade=m1');
  runtime.window.UnitPastExams.gridRestoreFromUrl();
  assert.match(runtime.getElement('unit-content').innerHTML, /data-profile="m1"[^>]*aria-pressed="true"/);
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html');
  runtime.window.UnitPastExams.gridRestoreFromUrl();
  assert.match(runtime.getElement('unit-content').innerHTML, /학년을 고르면/);
});

test('snake_case UID가 catalog 정규화를 거쳐 표의 문제지까지 전달된다', () => {
  const runtime = createRuntime();
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  runtime.window.UnitPastExams.gridToggleCell('H22-C-01', 'none');
  runtime.window.UnitPastExams.gridShowPapers();
  assert.match(runtime.getElement('unit-content').innerHTML, /문제지 1권|class="ug-paper"/);
  assert.equal(core.getQuestionUid({ question_uid: 'runtime-uid' }), 'runtime-uid');
});

test('고3은 고2와 같은 5과목 전환을 쓰고, 학년 버튼은 6개이다', () => {
  const runtime = createRuntime({ url: 'http://unit.test/archive/unit-past-exams.html?grade=h3' });
  runtime.window.UnitPastExams.gridSelectGrade('h3');
  const grid = runtime.getElement('unit-content').innerHTML;
  for (const label of ['중1', '중2', '중3', '고1', '고2', '고3']) assert.match(grid, new RegExp(`data-profile="[mh]\\d"[^>]*>${label}<`));
  for (const label of ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하']) assert.match(grid, new RegExp(`>${label}</button>`));
  assert.match(grid, /class="ug-courses"/);
  assert.match(runtime.getElement('unit-kicker').textContent, /고3/);
  assert.doesNotMatch(grid, /unit-subject-card|unit-grade-card/);
});

// ---- 단원별 기출 출제를 화면 안 패널로 (2026-11-11) ----
// 한 단원에 문항 130개(원본 시험지 26개)를 두어 문제지가 여러 권 나오게 한다.
const manyRecords = Array.from({ length: 130 }, (_, index) => ({
  sourceFile: `original/high/h1/1mid/25_runtime_${String(Math.floor(index / 5)).padStart(2, '0')}.js`, sourceOrdinal: (index % 5) + 1, id: (index % 5) + 1,
  grade: '고1', subject: '공통수학1', course: '공통수학1', standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산',
  question_uid: `runtime-uid-${index}`, subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중'
}));
function openPapersView(runtime) {
  runtime.setUrl('http://unit.test/archive/unit-past-exams.html?ready=1&grade=h1');
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  runtime.window.UnitPastExams.gridToggleCell('H22-C-01', 'none');
  runtime.window.UnitPastExams.gridShowPapers();
  return runtime.getElement('unit-content').innerHTML;
}
const fakePanel = (opened, { legacy = false } = {}) => ({
  open: options => { opened.push(options); return {}; }, isOpen: () => false, useLegacy: () => legacy, handlePopState: () => false,
});

test('여러 권이면 `전체 출제 (N권)` 버튼이 있고, 권마다 버튼은 `출제`다', () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  const html = openPapersView(runtime);
  const papers = (html.match(/class="ug-paper"/g) || []).length;
  assert.ok(papers >= 2, `문제지가 여러 권이어야 한다(${papers})`);
  assert.match(html, new RegExp(`class="ug-primary ug-assign-all"[^>]*>전체 출제 \\(${papers}권\\)</button>`));
  assert.equal((html.match(/class="ug-primary ug-assign"[^>]*>출제<\/button>/g) || []).length, papers);
  assert.doesNotMatch(html, /반에 출제/);
});

test('패널을 쓸 수 없으면(assign=legacy·스크립트 없음) 전체 출제 버튼이 없고 옛 iframe 경로로 간다', () => {
  for (const panel of [undefined, fakePanel([], { legacy: true })]) {
    const runtime = createRuntime({ questionIndex: manyRecords, window: panel ? { Archive2Assign: panel } : {} });
    const html = openPapersView(runtime);
    assert.ok((html.match(/class="ug-paper"/g) || []).length >= 2);
    assert.doesNotMatch(html, /전체 출제/);
    assert.match(html, /UnitPastExams\.assignPaper\(/, '권마다 `출제` 버튼은 옛 경로로 그대로 있다');
  }
  // 되돌림 길(iframe)은 지우지 않았다: 출제 포장(outputRequestId)으로 1.0 출제 화면을 연다.
  const js = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
  assert.match(js, /unitPastAssign/);
  assert.match(js, /unit-ready-assignment/);
  assert.match(js, /archive2Embedded/);
  assert.match(js, /outputRequestId/);
});

test('`출제`는 그 권 하나로, `전체 출제`는 모든 권으로 패널을 연다', () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  openPapersView(runtime);
  const html = runtime.getElement('unit-content').innerHTML;
  const papers = (html.match(/class="ug-paper"/g) || []).length;
  const first = html.match(/UnitPastExams\.assignPaper\('__grid__', '(grid-\d+)'/);
  assert.ok(first, '출제 버튼의 권 번호');
  runtime.window.UnitPastExams.assignPaper('__grid__', first[1], null);
  assert.equal(opened.length, 1);
  assert.equal(opened[0].items.length, 1);
  const item = opened[0].items[0];
  assert.equal(item.kind, 'unit');
  assert.match(item.snapshotKey, /^[a-zA-Z0-9_-]+$/);
  assert.ok(item.title && item.count > 0);
  assert.equal(opened[0].outputLinks, false, '단원 페이지에는 출력 처리기가 없어 결과 줄의 출력 버튼을 끈다');
  assert.equal(typeof opened[0].request, 'function');
  assert.equal(typeof opened[0].unit.load, 'function');
  assert.equal(runtime.getElement('unit-ready-assignment').innerHTML, '', 'iframe 모달은 열리지 않는다');
  runtime.window.UnitPastExams.assignAllPapers(null);
  assert.equal(opened.length, 2);
  assert.equal(opened[1].items.length, papers);
  assert.equal(new Set(opened[1].items.map(row => row.snapshotKey)).size, papers, '권마다 다른 문제지');
});

test('패널 request: 로그인이 없으면 요청 없이 status 401이다(패널이 로그인 안내를 그린다)', async () => {
  const opened = [];
  const runtime = createRuntime({ questionIndex: manyRecords, window: { Archive2Assign: fakePanel(opened) } });
  openPapersView(runtime);
  runtime.window.UnitPastExams.assignAllPapers(null);
  const request = opened[0].request;
  await assert.rejects(() => request('/qr-classes', { method: 'GET', timeoutMs: 30000 }), error => error.status === 401);
});

// ---- 행 펼침(중단원·소단원 묶음)과 유형 거르기 (계획 1b) ----
function createTreeRuntime(url, teacher = false) {
  const Tree = require(path.join(archiveRoot, 'archive2-unit-tree.js'));
  Tree.setGroups(JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'archive2-subunit-groups.json'), 'utf8')));
  const rec = (n, sub, extra = {}) => ({
    sourceFile: `original/high/h1/1mid/25_runtime${n}.js`, sourceOrdinal: n, id: n, grade: '고1', subject: '공통수학1', course: '공통수학1',
    standardUnitKey: 'H22-C-06', standardUnit: '여러 가지 방정식과 부등식', question_uid: `tree-uid-${n}`, subUnitKey: sub, subUnit: 'x', level: '중', ...extra
  });
  const questionIndex = [
    rec(1, 'H22-C-06-EQUATION', { problemTypeKey: 'PT_A', problemTypeLabel: '유형 가', metaFacetBound: true }),
    rec(2, 'H22-C-06-EQUATION'),
    rec(3, 'H22-C-06-SYSTEM', { problemTypeKey: 'PT_B', problemTypeLabel: '유형 나', metaFacetBound: true })
  ];
  return { Tree, runtime: createRuntime({ url, teacher, questionIndex, window: { Archive2UnitTree: Tree } }) };
}

test('단원 행을 펼치면 묶음표 이름의 소단원 행이 나오고, 소단원 칸만 골라 그 문항만 문제지가 된다', () => {
  const { Tree, runtime } = createTreeRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1');
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  assert.doesNotMatch(runtime.getElement('unit-content').innerHTML, /ug-subrow/, '처음에는 접혀 있다');
  assert.match(runtime.getElement('unit-content').innerHTML, /class="ug-expand"[^>]*aria-expanded="false"[^>]*aria-label="여러 가지 방정식과 부등식 소단원 펼치기"/);
  api.gridToggleOpen('H22-C-06');
  const table = runtime.getElement('ug-table').innerHTML;
  assert.match(table, /aria-expanded="true"/);
  assert.match(table, /class="ug-subrow[^"]*" data-unit="H22-C-06"/);
  assert.match(table, /여러 가지 방정식/);
  assert.match(table, /연립부등식/);
  assert.doesNotMatch(table, /핵심 개념/);
  const tree = Tree.createTree('h1', runtime.window.UnitPastExamsCore.buildCatalog(runtime.window.questionIndex, { profileId: 'h1' }).units);
  const system = tree.childrenOf('H22-C-06').find(child => child.name === '연립부등식');
  api.gridToggleCell('H22-C-06', 'none', system.key);
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항 · 1권/);
  assert.match(runtime.getElement('ug-sum').innerHTML, /여러 가지 방정식과 부등식 › 연립부등식 · 단계 미지정/);
  assert.match(runtime.getElement('ug-table').innerHTML, /aria-pressed="mixed"/, '단원 칸은 일부만 고른 상태');
  assert.match(runtime.url, /sel=H22-C-06(?:~|%7E)[^&]*%7Cnone/, '고른 소단원 칸이 주소에 남는다');
  api.gridShowPapers();
  assert.match(runtime.getElement('unit-content').innerHTML, /연립부등식/);
  // 단원 전체 칸을 켜면 같은 단계의 소단원 칸은 따로 두지 않고(포함), 소단원 칸을 끄면 나머지 소단원 칸으로 갈라진다.
  api.gridToggleCell('H22-C-06', 'none');
  assert.match(runtime.getElement('ug-table').innerHTML, /is-covered/);
  api.gridToggleCell('H22-C-06', 'none', system.key);
  assert.match(runtime.getElement('ug-bar').innerHTML, /2문항 · 1권/, '연립부등식을 뺀 나머지만 남는다');
});

test('유형 거르기: 기본은 전부이고, 유형을 끄면 숫자가 그 조건으로 다시 세어지며 유형 미지정도 끌 수 있다', () => {
  const { runtime } = createTreeRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1');
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleUnit('H22-C-06');
  const body = () => runtime.getElement('ug-types-body').innerHTML;
  assert.match(body(), /유형 미지정/);
  assert.match(body(), /유형 가/);
  assert.match(body(), /유형 나/);
  api.gridToggleCell('H22-C-06', 'none');
  assert.match(runtime.getElement('ug-bar').innerHTML, /3문항/);
  // 유형 미지정(맨 위)을 끄면 미지정 문항 1개가 빠진다.
  api.gridToggleType(0);
  assert.match(runtime.getElement('ug-bar').innerHTML, /2문항/);
  assert.match(runtime.getElement('ug-types-now').textContent, /1종 뺌/);
  assert.match(runtime.url, /notype=__none__/);
  api.gridToggleType(1);
  assert.match(runtime.getElement('ug-bar').innerHTML, /1문항/);
  api.gridResetTypes();
  assert.match(runtime.getElement('ug-bar').innerHTML, /3문항/);
  assert.doesNotMatch(runtime.url, /notype/);
});

test('주소의 sel·chk·notype로 다시 열면 같은 선택이다', async () => {
  const { runtime } = createTreeRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1&sel=H22-C-06%7Cnone&chk=H22-C-06&notype=__none__', true);
  await runtime.window.UnitPastExams.init();
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /<input type="checkbox" data-focus="k:H22-C-06" checked/);
  assert.match(html, /ug-bar-count">2문항 · 1권/);
  assert.match(html, /id="ug-types-now">1종 뺌/);
});

// ---- 조건 줄: 출처(전체 기출 | 학교 지정) · 연도 · 시험 · 학기 (계획 1c) ----
function createSourceRuntime(url = 'http://unit.test/archive/unit-past-exams.html?grade=h1', options = {}) {
  const rec = (n, school, yy, period, extra = {}) => ({
    sourceFile: `original/high/h1/${period}/${yy}_${school}.js`, sourceOrdinal: n, id: n, grade: '고1', subject: '공통수학1', course: '공통수학1',
    standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산', question_uid: `src-uid-${n}`, subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중', ...extra
  });
  const questionIndex = [
    rec(1, '순천고', 25, '1mid'), rec(2, '순천고', 25, '1mid'), rec(3, '순천고', 24, '2final'), rec(4, '순천고', 22, '1mid'),
    rec(5, '광양고', 25, '1final'), rec(6, '광양고', 25, '1final'), rec(7, '광양고', 23, '1mid'), rec(8, '금당고', 25, '2mid')
  ];
  return createRuntime({ url, questionIndex, ...options });
}
const bar = runtime => runtime.getElement('ug-bar').innerHTML;
// 권 목록에서 표로 돌아간다(뒤로 가기와 같다: 주소의 view를 지우고 주소대로 다시 그린다).
const backToTable = runtime => { const url = new URL(runtime.url); url.searchParams.delete('view'); runtime.setUrl(url.toString()); runtime.window.UnitPastExams.gridRestoreFromUrl(); };
const cond = runtime => runtime.getElement('ug-cond').innerHTML;

test('조건 줄: 기본은 전부 "전체"라 숫자·결과가 조건을 모르던 때와 같고, 조건을 바꾸면 주홍으로 표시된다', () => {
  const runtime = createSourceRuntime();
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /<section class="ug-cond" id="ug-cond"/);
  assert.match(html, /조건 없음 · 바꾸기/);
  for (const label of ['출처', '연도', '시험', '학기']) assert.match(html, new RegExp(`aria-label="${label}"`));
  assert.match(html, /aria-pressed="true" onclick="UnitPastExams\.gridSetSrc\('mode','all'\)">전체 기출</);
  assert.doesNotMatch(html, /is-changed|ug-cond-schools/, '기본에는 바뀐 조건도 학교 고르기 칸도 없다');
  api.gridToggleCell('H22-C-01', 'none');
  assert.match(bar(runtime), /8문항 · 1권/);
  assert.doesNotMatch(new URL(runtime.url).search, /sch=|yr=|ex=|sm=|grp=/, '기본값은 주소에 남기지 않는다');
  api.gridSetSrc('exam', 'mid');
  assert.match(cond(runtime), /ug-cond-grp is-changed" role="group" aria-label="시험"/);
  assert.match(cond(runtime), /조건 1개 · 바꾸기/);
  assert.match(bar(runtime), /5문항/, '중간고사만(순천고 3·광양고 1·금당고 1)');
});

test('학교 지정: 학교 검색·칩, 숫자가 그 학교·연도 문항 수로 바뀌고 주소·저장에 남는다', () => {
  const runtime = createSourceRuntime();
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleCell('H22-C-01', 'none');
  api.gridSetSrc('mode', 'school');
  let html = cond(runtime);
  assert.match(html, /class="ug-cond-schools"/);
  assert.match(html, /순천고<\/span><span class="ug-school-n">4문항/, '학교 목록에 문항 수가 함께 나온다(많은 학교부터)');
  api.gridSchoolQuery('광양');
  assert.match(runtime.getElement('ug-school-results').innerHTML, /광양고/);
  assert.doesNotMatch(runtime.getElement('ug-school-results').innerHTML, /순천고/);
  api.gridAddSchool(0);
  html = cond(runtime);
  assert.match(html, /class="ug-chip"[^>]*aria-label="광양고 빼기/, '고른 학교는 칩으로 쌓인다');
  assert.match(html, /조건 1개 · 바꾸기/);
  // 고른 뒤 "마침"을 누르면 검색 칸·목록이 "학교 1곳 · 바꾸기" 한 줄로 접히고, 바꾸기로 다시 펼친다.
  api.gridSchoolEdit(false);
  html = cond(runtime);
  assert.match(html, /class="ug-cond-schools is-folded"[\s\S]*학교 1곳[\s\S]*광양고[\s\S]*바꾸기/);
  assert.doesNotMatch(html, /id="ug-school-q"/, '접힌 줄에는 검색 칸이 없다');
  api.gridSchoolEdit(true);
  assert.match(cond(runtime), /id="ug-school-q"/);
  assert.match(bar(runtime), /3문항 · 1권/, '표·요약이 광양고 문항 수로 바뀐다');
  assert.match(runtime.getElement('ug-sum').innerHTML, /광양고 · 다항식의 연산/);
  assert.match(runtime.getElement('ug-filter-note').textContent, /광양고 조건의 문항 수/);
  assert.equal(new URL(runtime.url).searchParams.get('sch'), '광양고');
  assert.equal(JSON.parse(runtime.stored.get('archive2.unitGrid.v1')).src.schools[0], '광양고');
  // 연도: 최근 3년(학교마다 자료가 있는 최신 연도), 직접 고르기
  api.gridSetSrc('year', 'r3');
  assert.equal(new URL(runtime.url).searchParams.get('yr'), 'r3');
  api.gridSetSrc('year', 'range');
  assert.match(cond(runtime), /class="ug-cond-range"/);
  api.gridSetRange('from', '2025');
  api.gridSetRange('to', '2025');
  assert.equal(new URL(runtime.url).searchParams.get('yr'), '2025-2025');
  assert.match(bar(runtime), /2문항 · 1권/, '광양고 2025년만');
  // 조건 모두 지우기는 기본으로 되돌린다.
  api.gridCondReset();
  assert.match(cond(runtime), /조건 없음 · 바꾸기/);
  assert.match(bar(runtime), /8문항 · 1권/);
  assert.doesNotMatch(new URL(runtime.url).search, /sch=|yr=/);
});

test('학교를 2곳 이상 고르면 묶기 선택이 생기고, 학교별로 한 권씩이면 학교마다 권과 제목이 따로다', () => {
  const runtime = createSourceRuntime();
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleCell('H22-C-01', 'none');
  api.gridSetSrc('mode', 'school');
  api.gridAddSchool(0);
  assert.equal(runtime.getElement('ug-group').innerHTML, '', '학교가 1곳이면 묶기 선택이 없다');
  api.gridAddSchool(0);
  const group = runtime.getElement('ug-group').innerHTML;
  assert.match(group, /한 권으로 섞기/);
  assert.match(group, /학교별로 한 권씩/);
  assert.match(runtime.getElement('ug-opt-now').textContent, /한 권으로 섞기/);
  api.gridShowPapers();
  let list = runtime.getElement('unit-content').innerHTML;
  assert.equal((list.match(/class="ug-paper"/g) || []).length, 1, '섞기: 한 권');
  assert.match(list, /원본 시험지 \d+개 · 광양고·순천고 20\d\d/, '섞은 권 줄에 원본 시험지 수와 학교·연도 요약');
  backToTable(runtime);
  api.gridSetSrc('group', 'school');
  assert.equal(new URL(runtime.url).searchParams.get('grp'), 'school');
  api.gridShowPapers();
  list = runtime.getElement('unit-content').innerHTML;
  assert.equal((list.match(/class="ug-paper"/g) || []).length, 2, '학교별: 학교마다 한 권');
  assert.match(list, /<h3>(순천고|광양고) · /);
  assert.match(list, /<h3>(순천고|광양고) · \d{4}[^<]*년<\/h3>/, '학교별 권은 줄 제목에 학교·연도가 있다');
  assert.doesNotMatch(list, /원본 시험지 \d+개 · (순천고|광양고)/, '줄 제목에 있는 학교·연도를 줄 아래에서 되풀이하지 않는다');
  assert.match(list, /학교별로 한 권씩/);
  // 학교를 하나로 줄이면 묶기 선택이 사라지고 섞기로 돌아간다.
  backToTable(runtime);
  api.gridRemoveSchool(0);
  assert.equal(runtime.getElement('ug-group').innerHTML, '');
  assert.doesNotMatch(runtime.url, /grp=/);
});

test('조건(학교·연도·시험·학기·묶기)이 주소와 저장에 남아 다시 열면 같은 화면이다', async () => {
  const url = 'http://unit.test/archive/unit-past-exams.html?grade=h1&sch=%EC%88%9C%EC%B2%9C%EA%B3%A0%2C%EA%B4%91%EC%96%91%EA%B3%A0&yr=2023-2025&ex=mid&sm=1&grp=school&sel=H22-C-01%7Cnone';
  const runtime = createSourceRuntime(url, { teacher: true });
  await runtime.window.UnitPastExams.init();
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /조건 4개 · 바꾸기/);
  assert.match(html, /class="ug-cond-schools is-folded"[\s\S]*학교 2곳[\s\S]*순천고, 광양고/, '다시 열면 고른 학교는 한 줄로 접혀 있다');
  runtime.window.UnitPastExams.gridSchoolEdit(true);
  const edit = cond(runtime);
  assert.match(edit, /class="ug-chip"[^>]*aria-label="순천고 빼기/);
  assert.match(edit, /class="ug-chip"[^>]*aria-label="광양고 빼기/);
  runtime.window.UnitPastExams.gridSchoolEdit(false);
  assert.match(html, /class="ug-cond-range"/);
  assert.match(html, /gridSetSrc\('group','school'\)[^>]*>학교별로 한 권씩/);
  assert.match(html, /<details class="ug-options" id="ug-opts" open>/, '학교가 2곳 이상이면 묶기가 있는 접이식이 펼쳐진다');
  // 저장만으로도 같은 조건: 주소에 조건이 없으면 저장값을 쓴다.
  const stored = runtime.stored.get('archive2.unitGrid.v1');
  const again = createSourceRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1', { teacher: true, storage: { 'archive2.unitGrid.v1': stored } });
  await again.window.UnitPastExams.init();
  assert.match(again.getElement('unit-content').innerHTML, /조건 4개 · 바꾸기/);
  assert.equal(new URL(again.url).searchParams.get('sch'), '순천고,광양고');
});

test('휴대폰 조건 시트: 열고 닫을 수 있고, 닫으면 단추로 돌아온다', () => {
  const runtime = createSourceRuntime();
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  assert.doesNotMatch(runtime.getElement('unit-content').innerHTML, /ug-cond-body is-open/);
  assert.match(runtime.getElement('unit-content').innerHTML, /aria-expanded="false" aria-controls="ug-cond-body"/);
  api.gridCondOpen();
  assert.match(cond(runtime), /ug-cond-scrim is-open/);
  assert.match(cond(runtime), /ug-cond-body is-open/);
  assert.match(cond(runtime), /aria-expanded="true"/);
  assert.match(cond(runtime), /이 조건으로 보기 · 8문항/);
  api.gridCondClose();
  assert.doesNotMatch(cond(runtime), /ug-cond-body is-open/);
  assert.match(cond(runtime), /aria-expanded="false"/);
  assert.match(cond(runtime), /gridSetSrc\('year','r5'\)/);
});

test('유형 거르기: 전체 끄기·전체 켜기 단추로 하나만 남기기 쉽다', () => {
  const { runtime } = createTreeRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1');
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleUnit('H22-C-06');
  api.gridToggleCell('H22-C-06', 'none');
  const body = () => runtime.getElement('ug-types-body').innerHTML;
  assert.match(body(), /gridResetTypes\(\)"[^>]*disabled>전체 켜기/, '다 켜져 있으면 전체 켜기는 눌리지 않는다');
  assert.match(bar(runtime), /3문항/);
  api.gridTypesOffAll();
  assert.match(runtime.getElement('ug-types-now').textContent, /3종 뺌/);
  assert.match(body(), /gridTypesOffAll\(\)"[^>]*disabled>전체 끄기/);
  assert.doesNotMatch(bar(runtime), /\d문항 · \d권/, '전부 끄면 고른 문항이 없다');
  api.gridToggleType(2); // 유형 가
  assert.match(bar(runtime), /1문항/);
  api.gridResetTypes();
  assert.match(bar(runtime), /3문항/);
});

test('유형 거르기 중에 단원 칸을 풀면 나머지 소단원 칸은 거른 숫자 기준으로 켜진다', () => {
  const { Tree, runtime } = createTreeRuntime('http://unit.test/archive/unit-past-exams.html?grade=h1');
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleUnit('H22-C-06');
  api.gridToggleCell('H22-C-06', 'none');
  assert.match(bar(runtime), /3문항/);
  // 유형 미지정(방정식 소단원의 2번 문항)을 끄면 방정식은 유형 가 1문항, 연립부등식은 유형 나 1문항이 남는다.
  api.gridToggleType(0);
  api.gridToggleOpen('H22-C-06');
  const catalog = runtime.window.UnitPastExamsCore.buildCatalog(runtime.window.questionIndex, { profileId: 'h1' });
  const tree = Tree.createTree('h1', catalog.units);
  const system = tree.childrenOf('H22-C-06').find(child => child.name === '연립부등식');
  assert.ok(system);
  api.gridToggleCell('H22-C-06', 'none', system.key);
  // 연립부등식 칸을 끄면 단원 전체 칸이 풀리고 나머지 소단원 칸이 켜지는데, 거르기 전 숫자가 아니라 거른 숫자로 판단한다.
  const cells = new URL(runtime.url).searchParams.get('sel');
  assert.match(cells, /H22-C-06~[^,|]+\|none/);
  assert.doesNotMatch(cells, new RegExp(`~${system.key}\\|none`));
  assert.match(bar(runtime), /1문항 · 1권/);
});

test('권 목록의 "문제지 만들기에서 열기"는 그 권의 UID 목록을 기존 ?uid= 길로 새 창에 넘긴다', () => {
  const opened = [];
  const runtime = createRuntime({ window: { open: (url, target) => { opened.push({ url, target }); return {}; } } });
  const api = runtime.window.UnitPastExams;
  api.gridSelectGrade('h1');
  api.gridToggleCell('H22-C-01', 'none');
  api.gridShowPapers();
  const html = runtime.getElement('unit-content').innerHTML;
  assert.match(html, /openPaperInCompose\('__grid__', 'grid-1', this\)[^>]*>문제지 만들기에서 열기</);
  // 시험지·해설·정답·고치기·출제는 그대로다.
  for (const label of ['시험지', '해설', '정답', '고치기', '출제']) assert.match(html, new RegExp(`>${label}</button>`));

  api.openPaperInCompose('__grid__', 'grid-1');
  assert.equal(opened.length, 1);
  assert.equal(opened[0].target, '_blank');
  const url = new URL(opened[0].url, 'http://unit.test/archive/unit-past-exams.html');
  assert.equal(url.pathname, '/archive/workspace.html');
  assert.equal(url.searchParams.get('view'), 'compose');
  assert.deepEqual(url.searchParams.getAll('uid'), ['runtime-uid'], '그 권의 문항 UID만, 새 전달 형식 없음');
  assert.match(runtime.getElement('unit-status').textContent, /1문항을 문제지 만들기에서 열었습니다/);

  // 한도: 문항 수와 주소 길이에 걸리면 창을 열지 않고 한국어로 알린다.
  const many = n => ({ records: Array.from({ length: n }, (_, i) => ({ questionUid: `qid_v1_${String(i).padStart(64, '0')}` })) });
  assert.match(api.composeEntryUrl(many(401)).error, /400문항까지만/);
  assert.match(api.composeEntryUrl(many(120)).error, /문항이 많아 .* 넘길 수 없습니다/);
  assert.match(api.composeEntryUrl({ records: [{}] }).error, /알아볼 수 없어/);
  assert.ok(api.composeEntryUrl(many(80)).url, '한 권 최대 80문항은 넘길 수 있다');
});

// ---- 문항 목록 조각 경로 (2단계 2-3): 학년을 고르면 그 학년의 조각만 받는다 ---------------------------------------------------------------
// 조각 파일 대신 손으로 만든 두 학년짜리 가짜 조각을 쓰는 로더(조립·합치는 코드는 진짜). 같은 결과인지는 tests/archive2-catalog-shards-compose.test.js가
// 진짜 입력으로 보증하고, 여기서는 "언제 무엇을 받는가"와 실패했을 때 화면이 멈추지 않는지만 본다.
const shardApi = require(path.join(archiveRoot, 'archive2-catalog-shards.js'));
const makeShardSite = () => {
  const uid = n => `qid_v1_${String(n).padStart(64, '0')}`;
  const exam = (file, n, unitKey, unitName, subKey) => ({
    key: file.includes('/middle/') ? 'm1' : 'high1-common',
    records: [{ questionUid: uid(n), sourceFile: file, sourceOrdinal: 1, sourceQuestionNo: '1', identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceFingerprint: 'f'.repeat(8), difficultyBucket: 3 }],
    unit: { schemaVersion: shardApi.UNIT_PAST_SCHEMA, index: [[1, unitName, unitKey, subKey, '핵심', '중', '시험고', '시험고', 2025, '1', 'mid']], meta: [{ questionUid: true, difficultyBucket: 3, standardUnitKey: unitKey }] },
  });
  const docs = {
    'high1-common': exam('original/high/h1/1mid/25_runtime.js', 1, 'H22-C-01', '다항식의 연산', 'H22-C-01-CORE'),
    m1: exam('original/middle/m1/1mid/25_runtime.js', 2, 'M1-01', '소인수분해', 'M1-01-PRIME_FACTORIZATION'),
  };
  const common = { unitPast: { schemaVersion: shardApi.UNIT_PAST_SCHEMA, indexColumns: ['id', 'standardUnit', 'standardUnitKey', 'subUnitKey', 'subUnit', 'level', 'school', 'schoolKey', 'examYear', 'semester', 'examType'],
    runtime: { ownedScopes: [], taxonomyRows: [] }, subUnitLabels: {} }, labels: { problemTypes: {}, templates: {} } };
  const state = { calls: [], fail: null, created: 0 };
  const loader = {
    loadIndex: async () => ({}), loadCommon: async () => common,
    examFiles: () => Object.values(docs).map(doc => doc.records[0].sourceFile),
    keysFor: ({ exams }) => ({ keys: [...new Set((exams || []).map(file => Object.entries(docs).find(([, doc]) => doc.records[0].sourceFile === file)[0]))], unknownExams: [] }),
    loadCatalog: async ({ shards }) => {
      state.calls.push([...shards]);
      if (state.fail) throw state.fail;
      return { unitPast: { ready: true, common: common.unitPast, docs: shards.map(key => ({ key, ...docs[key] })) } };
    },
  };
  return { state, api: { ...shardApi, shardsDisabled: shardApi.shardsDisabled, createLoader: () => { state.created += 1; return loader; } } };
};

test('조각 경로: 학년을 고를 때에야 그 학년 조각만 받아 표를 그리고, 받은 조각은 다시 받지 않는다', async () => {
  const site = makeShardSite();
  const runtime = createRuntime({ teacher: true, questionIndex: [], url: 'http://unit.test/archive/unit-past-exams.html', window: { Archive2CatalogShards: site.api } });
  await runtime.window.UnitPastExams.init();
  assert.equal(site.state.created, 1, 'the loader is used');
  assert.deepEqual(site.state.calls, [], 'no question list is fetched before a grade is chosen');
  assert.match(runtime.getElement('unit-content').innerHTML, /학년을 고르면 단원과 난이도 단계가 한눈에 보이는 표가 나옵니다/);
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  for (let i = 0; i < 20; i += 1) await Promise.resolve();
  assert.deepEqual(site.state.calls, [['high1-common']], 'only the shard of the grade');
  assert.match(runtime.getElement('unit-content').innerHTML, /class="ug-table"/);
  assert.match(runtime.getElement('unit-content').innerHTML, /aria-label="다항식의 연산 [^"]*1문항"/);
  runtime.window.UnitPastExams.gridSelectGrade('m1');
  for (let i = 0; i < 20; i += 1) await Promise.resolve();
  assert.deepEqual(site.state.calls, [['high1-common'], ['m1']], 'the second grade adds its own shard');
  assert.match(runtime.getElement('unit-content').innerHTML, /소인수분해/);
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  assert.equal(site.state.calls.length, 2, 'a grade already held is not fetched again');
});

test('조각 경로: 저장된 학년이 있으면 그 학년 조각을 먼저 받고 처음부터 표를 그린다', async () => {
  const site = makeShardSite();
  const runtime = createRuntime({ teacher: true, questionIndex: [], url: 'http://unit.test/archive/unit-past-exams.html?grade=h1', window: { Archive2CatalogShards: site.api } });
  await runtime.window.UnitPastExams.init();
  assert.deepEqual(site.state.calls, [['high1-common']]);
  assert.match(runtime.getElement('unit-content').innerHTML, /class="ug-table"/);
});

test('조각 경로: ?shards=0이면 조각을 쓰지 않고 옛 문항 색인 그대로 표를 그린다', async () => {
  const site = makeShardSite();
  const runtime = createRuntime({ teacher: true, url: 'http://unit.test/archive/unit-past-exams.html?shards=0', window: { Archive2CatalogShards: site.api } });
  await runtime.window.UnitPastExams.init();
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  assert.equal(site.state.created, 0, 'the loader is never created');
  assert.match(runtime.getElement('unit-content').innerHTML, /class="ug-table"/);
  assert.match(runtime.getElement('unit-content').innerHTML, /aria-label="다항식의 연산 [^"]*1문항"/);
});

test('조각 경로: 연결이 끊기면 한국어 안내를 하고 학년 단추를 다시 누르면 받아 열린다(화면은 멈추지 않는다)', async () => {
  const site = makeShardSite();
  const runtime = createRuntime({ teacher: true, questionIndex: [], url: 'http://unit.test/archive/unit-past-exams.html', window: { Archive2CatalogShards: site.api } });
  await runtime.window.UnitPastExams.init();
  site.state.fail = Object.assign(new Error('network'), { code: 'CATALOG_SHARD_NETWORK', retryable: true });
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  for (let i = 0; i < 20; i += 1) await Promise.resolve();
  assert.equal(runtime.getElement('unit-status').textContent, shardApi.NETWORK_MESSAGE);
  assert.doesNotMatch(runtime.getElement('unit-content').innerHTML, /class="ug-table"/, 'no table from a failed load');
  site.state.fail = null;
  runtime.window.UnitPastExams.gridSelectGrade('h1');
  for (let i = 0; i < 20; i += 1) await Promise.resolve();
  assert.match(runtime.getElement('unit-content').innerHTML, /class="ug-table"/);
});
