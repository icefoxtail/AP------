// 빠른 평가 안의 "준비된 평가지"(archive2-quick-packs.js)와 보관함이 같이 쓰는 평가팩 공용 코드(assessment-pack-core.js).
// 첫 화면 비용(팩 자료·공용 코드는 구역을 열 때만), 탭 구성(중간·기말·모의고사만), 카드 단추, 두 화면이 같은 코드를 쓴다는 것을 본다.
// 팩 수·문항 수 같은 운영 값은 고정하지 않는다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const Core = require('../archive/assessment/assessment-pack-core.js');
globalThis.AssessmentPackCore = Core;
const QuickPacks = require('../archive/archive2-quick-packs.js');

const pack = (id, category, extra = {}) => ({
  id, title: `제목 ${id}`, category, grade: '중1', scopeLabel: '범위 (M1-01) 설명', questionCount: 3, courseLabel: '중1 수학 1학기',
  difficultyMix: { 하: 1, 중: 1, 상: 1 }, skillMix: { 활용: 2 }, questions: [{ id: 1 }, { id: 2 }, { id: 3 }], ...extra,
});
const PACKS = [
  pack('UNIT_A', '단원평가'), pack('DIAG_A', '진단평가'), pack('TERM_A', '중간·기말평가'), pack('TERM_B', '중간·기말평가', { grade: '고11' }),
  pack('MOCK_A', Core.MOCK_CATEGORY),
];

test('닫힌 구역은 제목과 열기 단추뿐이고 팩 카드·자료 요청이 없다', () => {
  Object.assign(QuickPacks.state, { open: false, status: 'idle', packs: [] });
  const html = QuickPacks.markup();
  assert.match(html, /id="quick-packs"/);
  assert.match(html, /data-qp="toggle"[^>]*aria-expanded="false"[^>]*>열기</);
  assert.match(html, /id="quick-packs-body"[^>]*\bhidden\b/);
  assert.doesNotMatch(html, /qk-pack"/);
});

test('이 구역은 단원평가·진단평가 팩을 걸러 내고 탭은 중간·기말·모의고사뿐이다', () => {
  const shown = QuickPacks.shownPacks(PACKS);
  assert.deepEqual(shown.map((item) => item.id).sort(), ['MOCK_A', 'TERM_A', 'TERM_B']);
  Object.assign(QuickPacks.state, { open: true, status: 'ready', packs: shown, category: '중간·기말평가', grade: '', query: '' });
  assert.deepEqual(QuickPacks.tabList().map((tab) => tab.label), ['중간·기말', '모의고사']);
  const html = QuickPacks.markup();
  assert.doesNotMatch(html, /단원평가|진단평가/);
  assert.equal((html.match(/class="qk-pack"/g) || []).length, 2, '선택한 탭의 팩만');
  assert.match(html, /data-qp="tab" data-category="중간·기말평가" aria-pressed="true"/);
});

test('카드: 시험지 확인·출제·정답·해설 단추, 분석표 링크(모의고사는 없음), 범위의 내부 단원 코드는 숨김', () => {
  const card = QuickPacks.cardMarkup(pack('TERM_X', '중간·기말평가', { title: '<b>제목</b>' }));
  for (const action of ['preview', 'assign', 'ans', 'sol']) assert.match(card, new RegExp(`data-qp="${action}" data-pack-id="TERM_X"`));
  assert.match(card, /href="assessment\/assessment-analysis\.html\?packId=TERM_X"/, '보관함과 같은 분석표 주소');
  assert.doesNotMatch(card, /<b>제목/, '제목은 이스케이프');
  assert.doesNotMatch(card, /M1-01/);
  const mock = QuickPacks.cardMarkup(pack('MOCK_X', Core.MOCK_CATEGORY));
  assert.doesNotMatch(mock, /assessment-analysis/);
});

test('검색·학년 필터는 보관함과 같은 규칙이다', () => {
  const packs = QuickPacks.shownPacks(PACKS);
  const ids = (options) => Core.filterPacks(packs, options).map((item) => item.id).sort();
  assert.deepEqual(ids({ category: '중간·기말평가' }), ['TERM_A', 'TERM_B']);
  assert.deepEqual(ids({ category: '중간·기말평가', grade: '고11' }), ['TERM_B']);
  assert.deepEqual(ids({ category: '중간·기말평가', query: 'term_a' }), ['TERM_A'], '이름·분류를 대소문자 없이 찾는다');
  assert.deepEqual(ids({ category: '중간·기말평가', query: '없는말' }), []);
});

test('첫 화면 비용: workspace.html은 작은 구역 파일만 올리고, 공용 코드·팩 자료는 구역을 열 때 받는다', () => {
  const html = read('archive', 'workspace.html');
  assert.match(html, /<script defer src="archive2-quick-packs\.js\?v=/);
  assert.doesNotMatch(html, /assessment-pack-core|assessment-packs-/, '팩 자료·공용 코드는 workspace.html에서 올리지 않는다');
  const source = read('archive', 'archive2-quick-packs.js');
  assert.match(source, /assessment\/assessment-packs-1sem\.generated\.js/);
  assert.match(source, /assessment\/assessment-pack-core\.js\?v=/);
  assert.match(source, /if \(state\.open && state\.status !== "ready"\) \{ refresh\(\); ensureLoaded\(\)/, '열 때 불러온다');
  assert.doesNotMatch(read('archive', 'archive2-workspace-compose.js'), /assessment-packs-/);
});

test('빠른 평가 화면이 구역을 끼워 넣고, 작업공간 상태에는 값을 더하지 않는다', () => {
  const compose = read('archive', 'archive2-workspace-compose.js');
  assert.match(compose, /window\.Archive2QuickPacks\?\.markup\?\.\(\)/);
  assert.doesNotMatch(compose, /quickState\.packs|state\.quickPacks/);
});

test('두 화면이 같은 공용 코드를 쓴다(두 벌 없음)와 배포 꾸러미·같은 ?v=', () => {
  const mvp = read('archive', 'assessment', 'assessment-mvp.html');
  assert.match(mvp, /assessment-pack-core\.js\?v=([\w.-]+)/);
  const mvpVersion = /assessment-pack-core\.js\?v=([\w.-]+)/.exec(mvp)[1];
  const quickVersion = /assessment-pack-core\.js\?v=([\w.-]+)/.exec(read('archive', 'archive2-quick-packs.js'))[1];
  assert.equal(mvpVersion, quickVersion, '같은 파일은 어디서나 같은 ?v=');
  for (const name of ['assessmentSnapshotTime', 'stableAssessmentJson', 'simpleAssessmentHash', 'function openAssessmentAssignedOutput', 'function assessmentAssignItem']) {
    assert.doesNotMatch(mvp, new RegExp(name), `${name}는 공용 코드에만 있다`);
  }
  const manifest = JSON.parse(read('tools', 'archive-pages-release-manifest.json'));
  assert.ok(manifest.archiveRootFiles.includes('archive2-quick-packs.js'));
  assert.ok(JSON.stringify(manifest).includes('archive/assessment/assessment-pack-core.js'));
});

test('MIXED 키·해시·출제 항목은 같은 팩에서 늘 같다(보관함과 같은 값)', () => {
  const item = Core.assignItem(PACKS[2]);
  assert.equal(item.snapshotKey, Core.assignKey(PACKS[2]));
  assert.match(item.snapshotKey, /^assessment_TERM_A_fnv1a_[0-9a-f]{8}$/);
  assert.equal(item.packId, 'TERM_A');
  assert.equal(item.packHash, Core.packHash(PACKS[2]));
  assert.equal(Core.assignKey(PACKS[2]), Core.assignKey({ ...PACKS[2], title: '다른 제목' }), '제목이 아니라 문항 구성으로 정한다');
});
