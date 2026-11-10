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
  const home = html.slice(html.indexOf('function renderHome('), html.indexOf('function renderAssignments('));
  const exams = home.indexOf('renderOmrHomeSection()');
  const lab = home.indexOf('renderGeometryLabEntry()');
  const review = home.indexOf('id="student-review-section"');
  const tools = home.indexOf('renderStudentQuickActions()');
  assert.ok(exams >= 0 && lab > exams && review > lab && tools > review, '실제 사용 우선순위에 따라 시험지 다음에 실험실을 두고 복습·기록과 과제 도구보다 앞에 둔다');
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

test('Universe와 허브에서 학생 포털로 같은 탭에 돌아갈 수 있고 좁은 화면도 기존 도구를 유지한다', () => {
  const playground = path.join(root, 'apmath', 'playground');
  const universe = fs.readFileSync(path.join(playground, 'index.html'), 'utf8');
  const universeStyles = fs.readFileSync(path.join(playground, 'universe', 'universe.css'), 'utf8');
  const hubSource = fs.readFileSync(path.join(playground, 'next', 'kit', 'apl-hub.js'), 'utf8');
  const hubStyles = fs.readFileSync(path.join(playground, 'next', 'kit', 'apl-hub.css'), 'utf8');
  const portalLink = universe.match(/<a class="universe-portal-link" href="([^"]+)" aria-label="학생 포털로 돌아가기">/);
  assert.ok(portalLink, 'Universe 머리글에 이름이 명확한 학생 포털 복귀 링크가 있어야 한다');
  assert.equal(path.resolve(playground, portalLink[1]), studentDir, '복귀는 학생 포털 경로로 간다');
  assert.ok(!portalLink[0].includes('target='), '복귀는 새 탭을 만들지 않는다');
  assert.match(universe, /class="webgl-fallback"[\s\S]*?class="universe-portal-link" href="\.\.\/student\/"/, '3D를 사용할 수 없어도 포털로 돌아갈 수 있다');

  const trail = hubSource.match(/const trail = ([\s\S]*?);\n/);
  assert.ok(trail, '허브 경로 내비게이션이 있어야 한다');
  const nav = vm.runInNewContext(trail[1], {
    h: (tag, attributes, ...children) => ({ tag, attributes, children }),
    icon: () => ''
  });
  const links = nav.children[0].children;
  assert.equal(nav.tag, 'nav');
  const hubPortal = links.find(link => link.attributes.class === 'hub-portal-link');
  assert.ok(hubPortal && hubPortal.tag === 'a', '허브에도 키보드로 선택할 수 있는 포털 복귀 링크가 있어야 한다');
  assert.equal(hubPortal.attributes['aria-label'], '학생 포털로 돌아가기');
  assert.equal(path.resolve(playground, 'next', hubPortal.attributes.href), studentDir, '허브 복귀 링크도 같은 학생 포털로 간다');
  assert.ok(links.some(link => link.attributes.href === '../index.html'), '기존 Universe 복귀 링크도 남겨 둔다');
  assert.match(universeStyles, /\.universe-portal-link\s*\{[^}]*min-height:\s*44px/, 'Universe 복귀 링크는 44px 터치 높이를 확보한다');
  assert.match(hubStyles, /\.hub-trail a\s*\{[^}]*min-height:\s*44px/, '허브 복귀 링크는 44px 터치 높이를 확보한다');
  assert.match(universeStyles, /\.top-controls\s*\{\s*grid-column:\s*1\s*\/\s*-1/, '좁은 화면의 기존 도구는 별도 행에 자리를 둔다');
  assert.ok(!/#btnToggleMotion\s*\{[^}]*display:\s*none/.test(universeStyles), '320px에서도 모션 버튼을 숨기지 않는다');
  for (const id of ['btnToggleHud', 'btnToggleMotion', 'btnEnterLab']) {
    assert.match(universe, new RegExp(`<button[^>]+id="${id}"`), `기존 ${id} 도구를 유지한다`);
  }
});
