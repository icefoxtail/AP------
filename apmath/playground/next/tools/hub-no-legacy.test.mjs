// AP Math Lab 2.0 · 허브·Universe·공통 셸에 이행기 흔적이 없는지 검사
// 실행: node --test apmath/playground/next/tools/hub-no-legacy.test.mjs
// 규칙(사용자 결정 2026-11-02): "2.0에 없는 건 연결하지 마." / "2.0에 이전 잔재가 있으면 안 돼."
//  1) 허브가 그린 화면에 '2.0'·'기존'·'미리보기'·'이전 실험실' 문구가 없다(허브 머리말·버튼·배지 기준).
//  2) 일반 첫 방문은 Universe: 허브를 바로 열면 Universe(학년 해시 유지) → 「입장」하면 허브(해시 유지), 실험실 뒤로 가기는 허브.
//     학생포털의 승인된 portal=1 진입은 학년별 허브를 바로 연다(학생포털 접근성 브라우저 검사가 검증).
//  3) 옛 labs/·teacher-hub·compare로 연결하지 않는다. 현재 승인된 학생포털 복귀와 Universe만 next/ 밖 목적지다.
// 정적 검사는 항상 돌고, 실제 화면 검사는 Playwright(Chromium)가 있을 때만 돈다(없으면 skip 사유를 출력).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYGROUND = path.resolve(NEXT, '..');
const read = (p) => fs.readFileSync(path.join(PLAYGROUND, p), 'utf8');
const BAN = ['2.0', '기존', '미리보기', '이전 실험실', '체험'];
const BAD_LINK = /teacher-hub|compare\.html|\/labs\/|nets-folding/;

// Stylesheets and other assets use href too. Only actual navigation anchors
// and literal location assignments are destinations covered by this rule.
function universeNavigationTargets(source) {
  return [
    ...[...source.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])([^"']+)\1/g)].map(match => match[2]),
    ...[...source.matchAll(/(?:window\.)?location\.href\s*=\s*(["'])([^"']+)\1/g)].map(match => match[2])
  ];
}
function allowedUniverseTarget(target) {
  return target === '../student/' || target === '${hubHref}' || /^\.\/(next\/index\.html|index\.html|universe\/.*)$/.test(target);
}

test('허브·Universe·셸 소스에 옛 화면으로 가는 경로가 없다', () => {
  for (const f of ['next/kit/apl-hub.js', 'next/kit/apl-shell.js', 'next/kit/apl-core.js', 'next/index.html']) {
    const src = read(f).split('\n').filter((l) => !/^\s*(\/\/|\/\*|\*)/.test(l)).join('\n');
    assert.ok(!/teacher-hub|compare\.html|\.legacy\b/.test(src), `${f}: 옛 화면 경로`);
  }
  const uni = read('index.html');
  const targets = universeNavigationTargets(uni);
  assert.ok(targets.length > 0);
  for (const target of targets) assert.ok(allowedUniverseTarget(target), `Universe 링크: ${target}`);
  const fixture = '<link rel="stylesheet" href="../css/student-navigation.css?v=test"><a href="../labs/old.html">이전</a><script>location.href="/labs/old.html"</script>';
  assert.deepEqual(universeNavigationTargets(fixture), ['../labs/old.html', '/labs/old.html'], '공통 CSS만 제외하고 실제 옛 화면 링크와 이동문은 계속 검사한다');
  for (const target of universeNavigationTargets(fixture)) assert.equal(allowedUniverseTarget(target), false, '옛 화면 이동 금지는 완화하지 않는다');
  assert.ok(fs.existsSync(path.join(PLAYGROUND, '../student/index.html')), '학생포털 복귀는 실제 운영 진입점이어야 한다');
  assert.ok(!/<title>[^<]*(2\.0|미리보기)/.test(read('next/index.html')), 'next/index.html title');
});

let chromium = null;
try { ({ chromium } = createRequire(import.meta.url)('playwright')); } catch (e) { /* 아래에서 skip */ }

function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
  const srv = http.createServer((req, res) => {
    const p = path.join(PLAYGROUND, decodeURIComponent(req.url.split(/[?#]/)[0]));
    if (!p.startsWith(PLAYGROUND) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

test('허브 화면: 금지 문구 0, 외부 경로는 Universe·학생포털 복귀만 (첫 방문·재방문, 노선도·목록)', { skip: chromium ? false : 'playwright 없음 — 화면 검사 NOT_RUN' }, async (t) => {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser;
  try { browser = await chromium.launch(); } catch (e) { srv.close(); t.skip('Chromium 실행 불가 — 화면 검사 NOT_RUN'); return; }
  try {
    for (const visit of ['first', 'return']) {
      for (const view of ['map', 'list']) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
        await ctx.addInitScript(([v, vw]) => {
          sessionStorage.setItem('apl:viaUniverse', '1'); // Universe를 거쳐 온 탭
          localStorage.setItem('apl:hubViewV2', JSON.stringify(vw));
          if (v === 'return') localStorage.setItem('apl:recent', JSON.stringify([{ id: 'calc1-tangent', title: '접선', course: '미적분Ⅰ', href: 'next/labs/calc1-tangent.html', at: Date.now() }]));
        }, [visit, view]);
        const page = await ctx.newPage();
        await page.goto(`${base}/next/index.html`, { waitUntil: 'load' });
        await page.waitForSelector('.hub-wrap .hub-metro, .hub-wrap .hub-card');
        const info = await page.evaluate(() => {
          // 카탈로그 본문(요약·장면 이름·단원)은 수학 내용이라 제외하고, 허브의 안내·버튼·배지·머리말만 봅니다.
          const own = [...document.querySelectorAll('.hub-top, .hub-trail, .hub-intro, .hub-bar, .hub-shelf > h2, .hub-metro .legend, .hub-metro .note, .hub-foot, .hub-badges, .hub-empty, noscript')];
          return {
            text: own.map((e) => e.innerText || e.textContent).join('\n') + '\n' + document.title,
            links: [...document.querySelectorAll('a[href]')].map((a) => new URL(a.getAttribute('href'), location.href).pathname),
            cta: (document.querySelector('#hubCta') || {}).innerText || ''
          };
        });
        for (const w of BAN) assert.ok(!info.text.includes(w), `[${visit}/${view}] 금지 문구 '${w}'`);
        assert.ok(info.links.length > 40, 'a 링크를 찾지 못함');
        for (const p of info.links) {
          const ok = p.startsWith('/next/') || p === '/index.html' || p === '/student/';
          assert.ok(ok && !BAD_LINK.test(p.replace('/next/labs/', '/next-lab/')), `[${visit}/${view}] next/ 밖 링크: ${p}`);
        }
        assert.match(info.cta, visit === 'first' ? /^시작하기 · / : /^이어서 하기 · /, `주 행동 문구 (${visit})`);
        assert.equal(info.cta.trim().split('\n').filter(Boolean).length, 1, '주 행동은 하나');
        await ctx.close();
      }
    }
  } finally { await browser.close(); srv.close(); }
});

test('Universe 경유 흐름: 허브 직접 열기→Universe(해시 유지), 입장→허브(해시 유지), 실험실 뒤로→허브, 저장소 차단 시 허브', { skip: chromium ? false : 'playwright 없음 — 흐름 검사 NOT_RUN' }, async (t) => {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}`;
  let browser;
  try { browser = await chromium.launch(); } catch (e) { srv.close(); t.skip('Chromium 실행 불가 — 흐름 검사 NOT_RUN'); return; }
  const mk = async (init) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
    if (init) await ctx.addInitScript(init);
    return { ctx, page: await ctx.newPage() };
  };
  try {
    // 1) 허브를 바로 열면(표시 없음) Universe로, 학년 해시 유지
    let { ctx, page } = await mk();
    await page.goto(`${base}/next/index.html#g8`);
    await page.waitForURL(/\/index\.html#g8$/);
    assert.ok(!page.url().includes('/next/'), `Universe로 가야 함: ${page.url()}`);
    // 2) Universe 「입장」→ 허브, 학년 해시 유지 + 그 학년 필터가 눌려 있음
    await page.waitForSelector('#btnEnterLab');
    await page.evaluate(() => document.getElementById('btnEnterLab').click());
    await page.waitForURL(/\/next\/index\.html#g8$/, { timeout: 15000 });
    await page.waitForSelector('.hub-course[aria-pressed="true"]');
    assert.match(await page.locator('.hub-course[aria-pressed="true"]').first().innerText(), /중2/);
    // 3) 허브에서 실험실을 열고 뒤로(←) 가면 허브(Universe로 되돌려 보내지 않음)
    await page.goto(`${base}/next/labs/calc1-tangent.html`);
    await page.waitForSelector('.apl-back');
    await page.click('.apl-back');
    await page.waitForURL(/\/next\/index\.html/);
    await page.waitForSelector('.hub-metro');
    await ctx.close();
    // 4) 장면 공유 링크처럼 실험실을 바로 열어도 Universe로 가지 않는다
    ({ ctx, page } = await mk());
    await page.goto(`${base}/next/labs/calc1-tangent.html#s=tangent`);
    await page.waitForSelector('.apl-back');
    assert.match(page.url(), /\/next\/labs\/calc1-tangent\.html/);
    await ctx.close();
    // 5) sessionStorage를 못 쓰면 허브를 그대로 보여 준다(학생이 막히지 않게)
    ({ ctx, page } = await mk(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } }); }));
    await page.goto(`${base}/next/index.html#g9`);
    await page.waitForSelector('.hub-metro');
    assert.match(page.url(), /\/next\/index\.html#g9$/);
    await ctx.close();
  } finally { await browser.close(); srv.close(); }
});
