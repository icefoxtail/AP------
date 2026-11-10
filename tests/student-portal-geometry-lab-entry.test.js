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
  assert.ok(home.indexOf('renderOmrHomeSection()') < home.indexOf('renderGeometryLabEntry()'), '학생의 주 사용 기능인 시험지를 실험실보다 먼저 노출한다');
});

test('입구 경로가 Universe(첫 화면)를 가리킨다', () => {
  const href = loadHrefFn({ homeData: null, session: {} })();
  const [file] = href.split('#');
  const target = path.resolve(studentDir, file);
  assert.equal(target, path.join(root, 'apmath', 'playground', 'index.html'));
  assert.ok(fs.existsSync(target), `${file} 가 존재해야 한다`);
  assert.equal(href, '../playground/index.html');
});

test('중1~중3은 Universe에 학년 해시(#g7~#g9)를 붙여 보내고, 그 밖은 해시 없이 보낸다', () => {
  const catalog = fs.readFileSync(path.join(root, 'apmath', 'playground', 'next', 'kit', 'apl-catalog.js'), 'utf8');
  const cases = { '중1': '#g7', '중2': '#g8', '중 3': '#g9', '중학교 2학년': '#g8', '고1': '', '': '' };
  for (const [grade, hash] of Object.entries(cases)) {
    const href = loadHrefFn({ homeData: { student: { grade } }, session: {} })();
    assert.equal(href, '../playground/index.html' + hash, `grade=${JSON.stringify(grade)}`);
    if (hash) assert.match(catalog, new RegExp(`"id": "${hash.slice(1)}"`), `${hash} 학년 필터가 허브 카탈로그에 있어야 한다`);
  }
  assert.equal(loadHrefFn({ homeData: null, session: { grade: '중3' } })(), '../playground/index.html#g9');
});

test('Universe는 받은 학년 해시를 허브로 그대로 넘기고, 허브를 바로 연 탭은 Universe로 보낸다', () => {
  const uni = fs.readFileSync(path.join(root, 'apmath', 'playground', 'index.html'), 'utf8');
  const hub = fs.readFileSync(path.join(root, 'apmath', 'playground', 'next', 'index.html'), 'utf8');
  assert.match(uni, /const hubHref = '\.\/next\/index\.html' \+ \(\/\^#\[a-z0-9\]\+\$\/\.test\(location\.hash\) \? location\.hash : ''\)/, 'Universe가 해시를 허브 주소에 붙인다');
  assert.ok(!/window\.location\.href = '\.\/next\/index\.html'/.test(uni), '해시를 버리는 직접 이동이 남아 있으면 안 된다');
  assert.match(uni, /sessionStorage\.setItem\('apl:viaUniverse', '1'\)/, 'Universe가 입구 표시를 남긴다');
  assert.match(hub, /location\.replace\('\.\.\/index\.html'\+location\.hash\)/, '허브를 바로 열면 해시를 유지한 채 Universe로 간다');
  assert.match(hub, /catch\(e\)\{\}/, 'sessionStorage가 막히면 허브를 그대로 보여 준다');
});
