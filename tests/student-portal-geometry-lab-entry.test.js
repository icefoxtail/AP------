const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const studentDir = path.join(root, 'apmath', 'student');
const html = fs.readFileSync(path.join(studentDir, 'index.html'), 'utf8');

function loadHrefFn(ctx) {
  const match = html.match(/function geometryLabHref\(\) \{[\s\S]*?\n    \}\n/);
  assert.ok(match, 'geometryLabHref()가 학생 포털 index.html에 있어야 한다');
  return vm.runInNewContext(`${match[0]}; geometryLabHref`, ctx);
}

test('학생 포털 홈에 도형실험실 입구가 있고 학생 화면에만 렌더된다', () => {
  assert.match(html, /id="portal-geometry-lab-entry"/);
  assert.match(html, /도형을 직접 움직여 보기/);
  assert.match(html, /\$\{isTeacherPreview \? '' : renderGeometryLabEntry\(\)\}/, '선생님 미리보기에는 입구를 넣지 않는다');
  const home = html.slice(html.indexOf('function renderHome('));
  assert.ok(home.indexOf('renderGeometryLabEntry()') < home.indexOf('renderOmrHomeSection()'), '입구는 홈 위쪽(시험지 카드 앞)에 있어야 한다');
});

test('입구 경로가 실제 도형실험실 2.0 허브 파일을 가리킨다', () => {
  const href = loadHrefFn({ homeData: null, session: {} })();
  const [file] = href.split('#');
  const target = path.resolve(studentDir, file);
  assert.equal(target, path.join(root, 'apmath', 'playground', 'next', 'index.html'));
  assert.ok(fs.existsSync(target), `${file} 가 존재해야 한다`);
  assert.equal(href, '../playground/next/index.html');
});

test('중1~중3은 허브의 학년 필터(#g7~#g9)로, 그 밖은 첫 화면으로 연결된다', () => {
  const catalog = fs.readFileSync(path.join(root, 'apmath', 'playground', 'next', 'kit', 'apl-catalog.js'), 'utf8');
  const cases = { '중1': '#g7', '중2': '#g8', '중 3': '#g9', '중학교 2학년': '#g8', '고1': '', '': '' };
  for (const [grade, hash] of Object.entries(cases)) {
    const href = loadHrefFn({ homeData: { student: { grade } }, session: {} })();
    assert.equal(href, '../playground/next/index.html' + hash, `grade=${JSON.stringify(grade)}`);
    if (hash) assert.match(catalog, new RegExp(`"id": "${hash.slice(1)}"`), `${hash} 학년 필터가 허브 카탈로그에 있어야 한다`);
  }
  assert.equal(loadHrefFn({ homeData: null, session: { grade: '중3' } })(), '../playground/next/index.html#g9');
});
