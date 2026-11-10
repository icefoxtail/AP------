// 해설(lesson) 브라우저 감사 — 해설이 있는 모든 장면(labs/*.html 중 APL_LESSONS 를 쓰는 실험실)을 실제 Chromium 으로 검사합니다.
// 실행(저장소 루트에서 서버를 띄운 뒤):
//   python3 -m http.server 8765 --bind 127.0.0.1 &
//   node apmath/playground/next/tools/lesson-browser-audit.mjs http://127.0.0.1:8765/apmath/playground/next/labs/ [--out DIR] [--only 실험실id:장면id,...]
// Playwright Chromium 이 없으면 CHROME_PATH 에 설치된 Chrome 경로를 줍니다. 판정 기준은 「학생이 실제 화면에서 해설을 끝까지 볼 수 있고, 나가도 탐구 화면이 깨끗한가」입니다.
// 장면마다 (390×844 휴대폰, 1024×768 태블릿 가로)에서:
//   진입 화면(▶ 가 화면 안 · 44px 이상 · 휴대폰은 탭·슬라이더 숨김 · 재생 안 함 · 정답 미공개)
//   ▶ 한 번 → 추가 입력 없이 ended, 끝 값이 해설의 최종 값과 같음, 끝 카드의 「다음 ▶」가 화면 안
//   멈춤·재개 ×5, 다시 보기 ×3 뒤 끝 상태가 같음
//   장마다 ✕ · 탭 전환 · 장면 이동으로 나가면 idle · 탐구 탭 · dragging false · 값이 params 범위 안 · 슬라이더 표시 = lab.s
//   콘솔 오류 0
// 한 장면에 해설이 여럿이면(배열) 해설마다 위 검사를 따로 하고, 진입 화면의 단추가 해설 수만큼 나란히 있는지(각 56px 이상, 360px 폭에서도 글자가 잘리지 않음),
// 단추 하나가 자기 해설을 바로 끝까지 재생하는지, 끝 카드의 「다음 ▶ 라벨」이 같은 장면의 다음 해설로 가는지, 해설을 오가도(겉넓이 → 부피 → 겉넓이) 처음 재생과 같은지 검사합니다.
//   --multi-fixture : 실제 해설이 하나뿐인 g7-surface-volume sv1-1 에 시험용 둘째 해설(부피, 이 파일 안의 FIXTURE_SECOND)을 불러올 때 끼워 넣어 위 여러 해설 검사를 돌립니다(학생에게 나가는 내용이 아님).
// 844×390(휴대폰 가로)에서는 진입 ▶·자막·조작·끝 카드가 화면 안에 있는지 봅니다. play=1 은 재생을 시작하고 manual=1 은 진입 화면을 달지 않는지 봅니다.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');
const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i < 0 ? null : args[i + 1]; };
if (!args[0] || args[0].startsWith('--')) throw Error('Supply the labs base URL, e.g. http://127.0.0.1:8765/apmath/playground/next/labs/');
const base = args[0].replace(/\/?$/, '/');
const out = arg('--out');
if (out) fs.mkdirSync(out, { recursive: true });
const labsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs');
const only = (arg('--only') || '').split(',').filter(Boolean).map((x) => x.split(':'));
const targets = [];
for (const f of fs.readdirSync(labsDir).filter((x) => x.endsWith('.html')).sort()) {
  const lab = f.replace(/\.html$/, '');
  if (!/APL_LESSONS/.test(fs.readFileSync(path.join(labsDir, f), 'utf8'))) continue;
  if (only.length && !only.some(([l]) => l === lab)) continue;
  targets.push(lab);
}
if (!targets.length) throw Error('No lab uses APL_LESSONS');

const VIEWS = [
  { name: '390x844', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, full: true },
  { name: '1024x768', viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 2, full: true },
  { name: '844x390', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, full: false },
  { name: '360x640', viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, full: false, entryOnly: true }
];
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { channel: 'chromium', headless: true });
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const multiFixture = args.includes('--multi-fixture');

/** 시험용 둘째 해설(원기둥 부피). 실제 장면 sv1-1 의 부피 모드를 쓰지만, 정리 탭 그림에 수치 라벨이 없어 학생용으로는 내보내지 않습니다. 오직 여러 해설 장치(단추·다음·오가기)를 검사하려는 것입니다. */
const FIXTURE_SECOND = {
  title: '원기둥의 부피(시험용)', label: '부피', tab: 'review', answer: '$45\\pi$', answerText: '$45\\pi$ cm³', summary: '부피 = 밑넓이 × 높이', task: '높이를 바꿔 보세요',
  chapters: [
    { length: 9, title: '조각으로 나누기', start: { sR: 3, sH: 5, sT: 0, svYaw: 28, svPitch: 22 }, cues: [{ at: 0, say: '원기둥을 높이 방향으로 나눠요.', set: { svShape: 'circ', sv11Mode: 'vol', sv11Started: true }, to: { sT: 1 }, dur: 5 }, { at: 5.5, say: '조각마다 밑면이 같아요.' }] },
    { length: 9, title: '쌓인 양', cues: [{ at: 0, say: '같은 밑면이 높이만큼 쌓여 있어요.', to: { sT: 0.5 }, dur: 5 }, { at: 6, say: '밑넓이는 $9\\pi$예요.' }] },
    { length: 9, title: '부피는?', cues: [{ at: 0, say: '부피 = 밑넓이 × 높이', to: { sT: 1 }, dur: 4 }, { at: 4.5, say: '부피 $=9\\pi\\times5=45\\pi$ cm³' }] }
  ]
};
const FIXTURE_INJECT = `(function(){var L=window.APL_LESSONS['g7-surface-volume'];L['sv1-1'].label='겉넓이';L['sv1-1']=[L['sv1-1'],${JSON.stringify(FIXTURE_SECOND)}];})();`;
/** 새 화면 문맥(--multi-fixture 이면 sv1-1 해설 파일에 시험용 둘째 해설을 덧붙여 받게 함). */
async function newCtx(opts) {
  const c = await browser.newContext(opts);
  if (multiFixture) {
    await c.route('**/g7-surface-volume/lesson.js', async (route) => {
      // 정적 서버가 순간적으로 연결을 끊을 수 있어 몇 번 다시 시도합니다(끝내 안 되면 페이지가 해설을 못 읽어 검사가 실패로 드러남)
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const resp = await route.fetch();
          await route.fulfill({ response: resp, body: (await resp.text()) + '\n' + FIXTURE_INJECT });
          return;
        } catch (e) { await sleep(300); }
      }
      await route.abort();
    });
  }
  return c;
}

/** 해설 JSON 의 최종 값(숫자·set)을 시간 순서대로 접어 구합니다. */
function finalValues(lesson) {
  const nums = {}, sets = {};
  lesson.chapters.forEach((ch) => {
    Object.assign(nums, ch.start || {});
    (ch.cues || []).forEach((c) => { Object.assign(nums, c.to || {}); Object.assign(sets, c.set || {}); });
  });
  return { nums, sets };
}

/** 해설 전체 시각으로 펼친 칸 목록(장 길이를 더해 at 을 맞춤). */
function globalCues(lesson) {
  const out = [];
  let off = 0;
  lesson.chapters.forEach((ch) => { (ch.cues || []).forEach((c) => out.push({ ...c, at: c.at + off })); off += ch.length; });
  return { cues: out, length: off };
}
/** 시각 t 까지의 set 값(해설이 정한 값). 정의된 적 없으면 undefined. */
function expectedSets(lesson, t) {
  const sets = {};
  globalCues(lesson).cues.forEach((c) => { if (c.at <= t + 1e-6 && c.set) Object.assign(sets, c.set); });
  return sets;
}
/** 시간 흐름을 비교할 표본 시각(진행 막대 0~1000 위치): 장 시작 직후 · 장 끝 직전 · 마지막 자막 직전 · 끝. */
function sampleTimes(lesson) {
  const g = globalCues(lesson);
  const times = [0.05];
  let off = 0;
  lesson.chapters.forEach((ch) => { times.push(off + 0.6, off + ch.length - 0.4); off += ch.length; });
  const lastSay = g.cues.filter((c) => c.say).at(-1).at;
  times.push(lastSay - 0.3, g.length - 0.05);
  return [...new Set(times.map((t) => Math.round((t / g.length) * 1000)))].sort((a, b) => a - b);
}

for (const labId of targets) {
  // 장면 목록은 첫 페이지에서 읽습니다.
  const ctx0 = await newCtx({ viewport: { width: 1024, height: 768 } });
  const p0 = await ctx0.newPage();
  await p0.goto(`${base}${labId}.html`, { waitUntil: 'load' });
  await p0.waitForFunction(() => window.lab && lab.video && lab.list.length);
  const scenes = await p0.evaluate(() => lab.list.map((sc, i) => { const E = lab.video.entries(i); return { i, id: String(sc.id), gi: sc.gi, lessons: E.length && E[0].kind === 'lesson' ? JSON.parse(JSON.stringify(lab.video.lessonsOf(i))) : null }; }).filter((x) => x.lessons));
  await ctx0.close();
  // 해설마다 한 단위(k)로 검사합니다. 해설이 하나뿐인 장면은 지금까지와 같습니다.
  const units = scenes.flatMap((sc) => sc.lessons.map((lesson, k) => ({ ...sc, k, n: sc.lessons.length, lesson })));
  for (const sc of units) {
    if (only.length && !only.some(([l, s]) => l === labId && (!s || s === sc.id))) continue;
    for (const view of VIEWS) {
      if (view.entryOnly && sc.n < 2) continue; // 360px 진입 화면은 단추가 여럿일 때만
      const rec = { lab: labId, scene: sc.n > 1 ? `${sc.id}#${sc.lesson.label}` : sc.id, view: view.name, checks: [], errors: [] };
      results.push(rec);
      const check = (name, pass, detail = '') => rec.checks.push({ name, status: pass ? 'PASS' : 'FAIL', detail: pass ? '' : String(detail).slice(0, 600) });
      const ctx = await newCtx({ viewport: view.viewport, isMobile: view.isMobile, hasTouch: view.hasTouch, deviceScaleFactor: view.deviceScaleFactor });
      const page = await ctx.newPage();
      page.on('pageerror', (e) => rec.errors.push('pageerror: ' + e.message));
      // 「Failed to load resource」는 어느 주소인지 알 수 없으므로 requestfailed 로 따로 봅니다: 이 서버(실험실 자체) 자원이 실패한 것만 오류, 외부 CDN(글꼴)의 끊김은 실험실 코드 문제가 아니므로 셉니다.
      page.on('console', (m) => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) rec.errors.push('console: ' + m.text()); });
      page.on('requestfailed', (r) => { if (new URL(r.url()).origin === new URL(base).origin) rec.errors.push(`request failed: ${r.url()} ${r.failure() && r.failure().errorText}`); });
      page.on('response', (r) => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) rec.errors.push(`HTTP ${r.status()}: ${r.url()}`); });
      const url = `${base}${labId}.html#s=${encodeURIComponent(sc.id + '@' + sc.gi)}`;
      const load = async (hash) => {
        await page.goto(hash == null ? url : `${base}${labId}.html${hash}`, { waitUntil: 'load' });
        if (hash != null) await page.reload({ waitUntil: 'load' }); // 해시만 바뀌면 새 문서가 아니므로
        await page.waitForFunction(() => window.lab && lab.video && lab.list.length && lab.board);
        await page.waitForFunction(() => document.fonts.ready.then(() => true));
        await sleep(500);
      };
      const rectOf = (sel) => page.evaluate((s) => { const e = document.querySelector(s); if (!e || !e.checkVisibility()) return null; const r = e.getBoundingClientRect(); return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; }, sel);
      const inView = (r) => !!r && r.top >= -0.5 && r.left >= -0.5 && r.bottom <= r.vh + 0.5 && r.right <= r.vw + 0.5;
      const shot = async (label) => { if (out) await page.screenshot({ path: path.join(out, `${labId}-${sc.id}${sc.n > 1 ? '-' + sc.k : ''}-${view.name}-${label}.png`) }); };
      const snapshot = () => page.evaluate((fv) => ({ nums: Object.fromEntries(Object.keys(fv.nums).map((k) => [k, lab.s[k]])), sets: Object.fromEntries(Object.keys(fv.sets).map((k) => [k, lab.s[k]])), step: lab.s.step, tab: lab.tab, dragging: !!lab.s.dragging, lessonOn: lab.s.lessonOn, state: lab.video.state }), finalValues(sc.lesson));
      const goButton = () => page.locator('.apl-lgo:visible').nth(sc.k);
      const snapshotOf = (lesson) => page.evaluate((fv) => ({ nums: Object.fromEntries(Object.keys(fv.nums).map((k) => [k, lab.s[k]])), sets: Object.fromEntries(Object.keys(fv.sets).map((k) => [k, lab.s[k]])), step: lab.s.step, tab: lab.tab, dragging: !!lab.s.dragging, lessonOn: lab.s.lessonOn, state: lab.video.state }), finalValues(lesson));
      const waitEnded = (ms = 60000) => page.waitForFunction(() => lab.video.state === 'ended', null, { timeout: ms });
      const clean = async (label) => {
        await sleep(250);
        const d = await page.evaluate(() => {
          const bad = [];
          for (const [k, p] of Object.entries(lab.params || {})) {
            const v = lab.s[k];
            if (typeof p.min === 'number' && typeof p.max === 'number' && (typeof v !== 'number' || v < p.min - 1e-9 || v > p.max + 1e-9)) bad.push(`${k}=${v} not in ${p.min}~${p.max}`);
          }
          const mismatch = Object.entries(lab._ctls || {}).filter(([id, c]) => Math.abs(+c.input.value - lab.s[id]) > (+c.input.step || 0.001) / 2 + 1e-6).map(([id, c]) => `${id}: slider ${c.input.value} vs s ${lab.s[id]}`);
          return { state: lab.video.state, raf: lab.video._raf, tab: lab.tab, dragging: lab.s.dragging, lessonOn: lab.s.lessonOn, bad, mismatch, vid: document.body.classList.contains('apl-vid') };
        });
        check(`leave ${label}: player idle`, d.state === 'idle' && d.raf === 0 && !d.vid, JSON.stringify(d));
        check(`leave ${label}: tab explore, dragging false, no lessonOn`, d.tab === 'explore' && d.dragging === false && d.lessonOn === undefined, JSON.stringify(d));
        check(`leave ${label}: params in range`, !d.bad.length, JSON.stringify(d.bad));
        check(`leave ${label}: slider values equal lab.s`, !d.mismatch.length, JSON.stringify(d.mismatch));
      };
      try {
        await load();
        const narrow = view.viewport.width <= 859;
        const len = await page.evaluate((k) => lab.video.lengthOf(lab.index, k), sc.k);
        if (view.entryOnly) {
          // 360×640: 해설 단추가 모두 화면 안, 56px 이상, 글자가 잘리지 않음
          const bs = await page.evaluate(() => [...document.querySelectorAll('.apl-lgo')].filter((e) => e.checkVisibility()).map((e) => { const r = e.getBoundingClientRect(), l = e.querySelector('.l'); return { text: e.innerText.replace(/\s+/g, ' '), top: r.top, left: r.left, bottom: r.bottom, right: r.right, h: r.height, vw: innerWidth, vh: innerHeight, clipped: l ? l.scrollWidth > l.clientWidth + 1 || e.scrollWidth > e.clientWidth + 1 : false }; }));
          check('360px entry: one button per lesson, all inside the viewport, 56px+, label not clipped', bs.length === sc.n && bs.every((b) => inView(b) && b.h >= 56 && !b.clipped), JSON.stringify(bs));
          await shot('entry');
          check('console errors 0', !rec.errors.length, rec.errors.join(' | '));
          await ctx.close();
          continue;
        }
        // ---------- 진입 화면 ----------
        const entry = await page.evaluate((k) => { const e = [...document.querySelectorAll('.apl-lgo')].filter((x) => x.checkVisibility())[k]; if (!e) return null; const r = e.getBoundingClientRect(); return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; }, sc.k);
        check('entry: ▶ button fully inside the viewport', inView(entry), JSON.stringify(entry));
        check('entry: ▶ button at least 44px high (56px when there are several lessons)', !!entry && entry.h >= (sc.n > 1 ? 56 : 44), JSON.stringify(entry));
        if (sc.n > 1) {
          const bs = await page.evaluate(() => [...document.querySelectorAll('.apl-lgo')].filter((e) => e.checkVisibility()).map((e) => { const r = e.getBoundingClientRect(); return { text: e.innerText.replace(/\s+/g, ' '), top: Math.round(r.top), w: Math.round(r.width) }; }));
          check('entry: one button per lesson, side by side (same row), each with its label and seconds', bs.length === sc.n && new Set(bs.map((b) => b.top)).size === 1 && bs.every((b, k) => b.text.includes(sc.lessons[k].label) && b.text.includes(String(Math.round(sc.lessons[k].chapters.reduce((a, c) => a + c.length, 0))))), JSON.stringify(bs));
        }
        const st0 = await page.evaluate((k) => ({ playing: lab.s.playing, revealed: lab.s.revealed, state: lab.video.state, lessonFirst: document.body.classList.contains('apl-lessonfirst'), label: [...document.querySelectorAll('.apl-lgo')].filter((x) => x.checkVisibility())[k]?.innerText }), sc.k);
        check('entry: idle, not playing, answer not revealed', st0.state === 'idle' && !st0.playing && !st0.revealed, JSON.stringify(st0));
        check('entry: lesson-first class matches the width', st0.lessonFirst === narrow, JSON.stringify(st0));
        check('entry: label shows the length', new RegExp(`${Math.round(len)}초`).test(st0.label || ''), JSON.stringify(st0));
        if (narrow) {
          const vis = await page.evaluate(() => ({
            tabs: [...document.querySelectorAll('.apl-tab')].filter((e) => e.checkVisibility()).length,
            sliders: [...document.querySelectorAll('input[type=range]')].filter((e) => e.checkVisibility()).length,
            presets: [...document.querySelectorAll('.apl-presets .apl-chip, .apl-actions-row button')].filter((e) => e.checkVisibility()).length,
            inDom: document.querySelectorAll('input[type=range]').length
          }));
          check('entry: tabs, sliders and presets hidden but kept in the DOM', vis.tabs === 0 && vis.sliders === 0 && vis.presets === 0 && vis.inDom > 0, JSON.stringify(vis));
          const link = await rectOf('.apl-lmanual');
          check('entry: 「직접 해 보기」 link visible inside the viewport', inView(link), JSON.stringify(link));
          const q = await page.evaluate(() => { const e = document.querySelector('.apl-question .q'); return e ? { clipped: e.scrollWidth > e.clientWidth + 1, ws: getComputedStyle(e).whiteSpace } : null; });
          check('entry: question text is not truncated', !q || (!q.clipped && q.ws !== 'nowrap'), JSON.stringify(q));
          const qs = await page.evaluate(() => [...document.querySelectorAll('.apl-question')].filter((e) => e.checkVisibility()).map((e) => e.innerText));
          check('entry: exactly one question is shown', qs.length === 1, JSON.stringify(qs));
          // 진입 화면의 그림은 ▶ 가 시작할 때(t=0)의 모습: 첫 장 start 값과 at:0 칸의 set, 탭·lessonOn 은 그대로
          const first = sc.lessons[0];
          const c0 = first.chapters[0].cues.find((c) => c.at === 0) || {};
          const want = { nums: first.chapters[0].start || {}, sets: c0.set || {} };
          const got = await page.evaluate((w) => ({ nums: Object.fromEntries(Object.keys(w.nums).map((k) => [k, lab.s[k]])), sets: Object.fromEntries(Object.keys(w.sets).map((k) => [k, lab.s[k]])), tab: lab.tab, lessonOn: lab.s.lessonOn }), want);
          const startBad = [...Object.entries(want.nums).filter(([k, v]) => Math.abs(got.nums[k] - v) > 1e-6), ...Object.entries(want.sets).filter(([k, v]) => JSON.stringify(got.sets[k]) !== JSON.stringify(v))];
          check('entry: the figure shows the FIRST lesson start state (chapter 1 start + at:0 set), no lessonOn/tab change', !startBad.length && got.tab === 'explore' && got.lessonOn === undefined, JSON.stringify({ want, got }));
        }
        await shot('entry');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        check('entry: no horizontal overflow', !overflow);
        // 자동 재생이 없었는지(로드 직후 1초 더 기다려 봄)
        await sleep(800);
        check('entry: no autoplay', await page.evaluate(() => lab.video.state === 'idle' && !lab.s.playing));

        // ---------- 첫 재생의 시간 흐름(새 화면에서 ▶ 후 바로 멈추고 표본 시각으로 이동) ----------
        const sample = async (pg) => {
          const rows = [];
          for (const v of sampleTimes(sc.lesson)) {
            await pg.locator('.apl-vrange').fill(String(v));
            await sleep(60);
            rows.push(await pg.evaluate((fv) => ({ t: +lab.video.t.toFixed(3), nums: Object.fromEntries(Object.keys(fv.nums).map((k) => [k, lab.s[k]])), sets: Object.fromEntries(Object.keys(fv.sets).map((k) => [k, lab.s[k]])), step: lab.s.step }), finalValues(sc.lesson)));
          }
          return rows;
        };
        let timelineA = null;
        if (view.full) {
          const ctxA = await newCtx({ viewport: view.viewport, isMobile: view.isMobile, hasTouch: view.hasTouch, deviceScaleFactor: view.deviceScaleFactor });
          const pageA = await ctxA.newPage();
          await pageA.goto(url, { waitUntil: 'load' });
          await pageA.waitForFunction(() => window.lab && lab.video && lab.board);
          await sleep(500);
          await pageA.locator('.apl-lgo:visible').nth(sc.k).click();
          await pageA.locator('.apl-vmini').click();
          timelineA = await sample(pageA);
          await ctxA.close();
        }

        // ---------- 한 번 눌러 끝까지(실시간) ----------
        const dbl = view.full;
        if (dbl) await goButton().dblclick({ delay: 30 }); else await goButton().click();
        await page.waitForFunction(() => lab.video.state === 'playing');
        const rate = await page.evaluate(async () => { const t0 = lab.video.t, w0 = performance.now(); await new Promise((r) => setTimeout(r, 900)); return (lab.video.t - t0) / ((performance.now() - w0) / 1000); });
        check('tap: double tap starts one loop (about 1x speed)', rate > 0.6 && rate < 1.5, rate);
        if (!view.full) {
          // 휴대폰 가로: 재생 중·멈춤·끝 카드에서 자막·조작이 화면 안에 있는지만 봅니다.
          const cap = await rectOf('.apl-vcap'), prog = await rectOf('.apl-vprog');
          check('landscape playing: caption and progress inside the viewport', inView(cap) && inView(prog), JSON.stringify({ cap, prog }));
          await shot('playing');
          await page.locator('.apl-vmini').click();
          await sleep(200);
          const ctl = await rectOf('.apl-vctl'), play = await rectOf('.apl-vctl .primary');
          check('landscape paused: control row inside the viewport', inView(ctl) && inView(play), JSON.stringify({ ctl, play }));
          await shot('paused');
          await page.evaluate(() => { lab.video.rate = 8; });
          await page.locator('.apl-vctl .primary').click();
          await waitEnded();
          const card = await rectOf('.apl-vend'), nxt = await rectOf('.apl-vnext');
          check('landscape end card: card and 「다음 ▶」 inside the viewport', inView(card) && inView(nxt), JSON.stringify({ card, nxt }));
          await shot('end');
          // play=1 / manual=1
          // play=1 은 첫 해설, play=<label> 은 그 이름의 해설(여럿일 때), play=2·3 은 그 번째
          const pv = sc.n > 1 ? encodeURIComponent(sc.lesson.label) : '1';
          await load(`#s=${encodeURIComponent(sc.id + '@' + sc.gi)}&play=${pv}`);
          await page.waitForFunction((k) => lab.video.state === 'playing' && lab.video.lessonIndex === k, sc.k, { timeout: 5000 }).then(() => check(`play=${sc.n > 1 ? sc.lesson.label : 1} starts that lesson`, true), () => check(`play=${sc.n > 1 ? sc.lesson.label : 1} starts that lesson`, false, 'not playing the expected lesson'));
          if (sc.n > 1) {
            await load(`#s=${encodeURIComponent(sc.id + '@' + sc.gi)}&play=${sc.k + 1}`);
            await page.waitForFunction((k) => lab.video.state === 'playing' && lab.video.lessonIndex === k, sc.k, { timeout: 5000 }).then(() => check(`play=${sc.k + 1} starts lesson ${sc.k + 1}`, true), () => check(`play=${sc.k + 1} starts lesson ${sc.k + 1}`, false, 'not playing the expected lesson'));
          }
          await page.goto(`${base}${labId}.html?manual=1#s=${encodeURIComponent(sc.id + '@' + sc.gi)}`, { waitUntil: 'load' });
          await page.reload({ waitUntil: 'load' });
          await page.waitForFunction(() => window.lab && lab.video && lab.board);
          await sleep(400);
          const man = await page.evaluate(() => ({ cls: document.body.classList.contains('apl-lessonfirst'), entry: !document.querySelector('.apl-lentry').hidden, tabs: [...document.querySelectorAll('.apl-tab')].filter((e) => e.checkVisibility()).length }));
          check('manual=1: explore UI as before (no lesson-first, no entry button)', !man.cls && !man.entry && man.tabs > 0, JSON.stringify(man));
          check('console errors 0', !rec.errors.length, rec.errors.join(' | '));
          await ctx.close();
          continue;
        }
        await waitEnded(Math.round(len * 1000) + 20000);
        const e1 = await snapshot();
        const fv = finalValues(sc.lesson);
        const numBad = Object.entries(fv.nums).filter(([k, v]) => typeof e1.nums[k] !== 'number' || Math.abs(e1.nums[k] - v) > 1e-6);
        const setBad = Object.entries(fv.sets).filter(([k, v]) => JSON.stringify(e1.sets[k]) !== JSON.stringify(v));
        check('tap: reaches ended with no further input', e1.state === 'ended');
        check('tap: final lab.s equals the lesson final values', !numBad.length && !setBad.length, JSON.stringify({ numBad, setBad, e1 }));
        const maxStep = Math.max(0, ...sc.lesson.chapters.flatMap((ch) => ch.cues.map((c) => c.step ?? 0)));
        if (narrow) {
          // 해설의 끝 화면(영상 화면 유지): 마지막 장면 그대로(정리 탭 해설이면 정리 탭·마지막 단계)를 끝 카드를 닫을 때까지 붙든다
          check('ended (narrow): the final frame is kept (review tab + last step for review lessons)', e1.lessonOn === true && e1.tab === (sc.lesson.tab || 'explore') && !!e1.dragging === (sc.lesson.tab === 'review') && (sc.lesson.tab !== 'review' || e1.step === maxStep), JSON.stringify({ e1, maxStep }));
        } else check('ended (wide): tab explore, dragging false, no lessonOn', e1.tab === 'explore' && e1.dragging === false && e1.lessonOn === undefined, JSON.stringify(e1));
        if (sc.lesson.answer) {
          const ans = await page.evaluate(() => { const e = document.querySelector('.apl-vans'); if (!e || !e.checkVisibility()) return null; const r = e.getBoundingClientRect(); return { text: e.innerText, top: r.top, left: r.left, bottom: r.bottom, right: r.right, vw: innerWidth, vh: innerHeight }; });
          const digits = (/[0-9]+/.exec(sc.lesson.answer) || [''])[0];
          check('ended: the end card shows 「정답 …」 with the lesson answer, inside the viewport', !!ans && ans.text.includes('정답') && ans.text.includes(digits) && inView(ans), JSON.stringify({ ans, digits }));
        }
        const nxt = await rectOf('.apl-vnext');
        check('ended: 「다음 ▶」/「목차로」 inside the viewport and 44px+', inView(nxt) && nxt.h >= 44, JSON.stringify(nxt));
        const again = await rectOf('.apl-vend-btns .apl-vbtn');
        check('ended: secondary buttons inside the viewport', inView(again), JSON.stringify(again));
        await shot('end');

        // ---------- 빠르게 돌려 보는 검사(재생 속도만 키움) ----------
        await page.evaluate(() => { lab.video.rate = 6; });
        // 다시 보기 ×3
        for (let n = 0; n < 3; n++) {
          await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
          await waitEnded();
          if (n === 0) await page.evaluate(() => { lab.video.rate = 6; });
        }
        const e2 = await snapshot();
        check('replay x3: same final state', JSON.stringify(e1) === JSON.stringify(e2), JSON.stringify({ e1, e2 }));
        // 다시 보기 뒤의 시간 흐름 = 첫 재생의 시간 흐름, 그리고 결론(정답을 드러내는 set)은 그 칸이 오기 전에 켜지지 않는다
        if (timelineA) {
          await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
          await page.locator('.apl-vmini').click();
          const timelineB = await sample(page);
          const diff = timelineA.map((a, i) => ({ a, b: timelineB[i] })).filter(({ a, b }) => !b || Math.abs(a.t - b.t) > 1e-6 || Object.keys(a.nums).some((k) => Math.abs(a.nums[k] - b.nums[k]) > 1e-6) || JSON.stringify(a.sets) !== JSON.stringify(b.sets) || a.step !== b.step);
          check('replay: state timeline equals the first play at every sample time (not only at the end)', !diff.length && timelineA.length === timelineB.length, JSON.stringify(diff.slice(0, 2)));
          const early = [...timelineA.map((r) => ['first', r]), ...timelineB.map((r) => ['replay', r])].filter(([, r]) => Object.entries(expectedSets(sc.lesson, r.t)).some(([k, v]) => JSON.stringify(r.sets[k]) !== JSON.stringify(v)));
          check('first play & replay: every set value (reveal state) equals what the lesson has set up to that time (nothing is revealed before its cue)', !early.length, JSON.stringify(early.slice(0, 2)));
          await page.evaluate(() => { lab.video.rate = 6; });
          await page.locator('.apl-vctl .primary').click();
          await waitEnded();
        }
        // 멈춤·재개 ×5
        await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
        await page.waitForFunction(() => lab.video.state === 'playing');
        for (let n = 0; n < 5; n++) {
          await sleep(180);
          await page.evaluate(() => { lab.video.rate = 6; });
          await page.locator('.apl-vmini').click();
          const t = await page.evaluate(() => lab.video.t);
          await sleep(120);
          check(`pause ${n + 1}: time frozen`, await page.evaluate((t0) => lab.video.state === 'paused' && Math.abs(lab.video.t - t0) < 0.01 && lab.video._raf === 0, t));
          if (n === 0) await shot('paused');
          await page.locator('.apl-vctl .primary').click();
          await page.waitForFunction(() => lab.video.state === 'playing' || lab.video.state === 'ended');
        }
        await waitEnded();
        const e3 = await snapshot();
        check('pause/resume x5: same final state', JSON.stringify(e1) === JSON.stringify(e3), JSON.stringify({ e1, e3 }));

        // ---------- 장마다 나가기 ----------
        const chapters = await page.evaluate(() => { lab.video.cs && 0; return lab.video.cs.chapters.map((c) => ({ at: c.at, length: c.length })); });
        const len2 = await page.evaluate(() => lab.video.cs.length);
        const startAgain = async () => {
          await page.evaluate(([i, k]) => lab.video.play(i, k), [sc.i, sc.k]); // 시작은 API, 이동·나가기는 화면의 단추로
          await page.waitForFunction(() => lab.video.state === 'playing');
          await page.locator('.apl-vmini').click();
        };
        for (let k = 0; k < chapters.length; k++) {
          const to = Math.min(len2 - 0.2, chapters[k].at + 1.2);
          const seek = async () => { await page.locator('.apl-vrange').fill(String(Math.round((to / len2) * 1000))); await sleep(150); };
          // ✕
          await startAgain(); await seek();
          const title = await page.evaluate(() => lab.video.ui.tText.textContent);
          check(`chapter ${k + 1}: header title follows the chapter after a seek`, title.startsWith(`${k + 1}/${chapters.length}`), title);
          if (k === 1) await shot('chapter2-paused');
          if (sc.lesson.tab === 'review') {
            // 정리 탭 해설: 멈춘 채로 그림을 직접 끌어 봐도(끌기가 끝나며 dragging 이 false 가 되어도) 장면 tick 이 값을 목표값으로 끌어당기지 않고, 끌기는 동작한다
            const toKeys = [...new Set(sc.lesson.chapters.flatMap((ch) => ch.cues.flatMap((c) => Object.keys(c.to || {}))))];
            const before = await page.evaluate((keys) => Object.fromEntries(keys.map((x) => [x, lab.s[x]])), toKeys);
            const box = await page.locator('.apl-canvas').boundingBox();
            await page.mouse.move(box.x + box.width * 0.12, box.y + box.height * 0.12);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.18, { steps: 6 });
            const during = await page.evaluate(() => ({ dragging: lab.s.dragging, state: lab.video.state }));
            await page.mouse.up();
            await sleep(900);
            const after = await page.evaluate((keys) => ({ vals: Object.fromEntries(keys.map((x) => [x, lab.s[x]])), dragging: lab.s.dragging, state: lab.video.state }), toKeys);
            const moved = toKeys.filter((x) => Math.abs(after.vals[x] - before[x]) > 0.011);
            check(`chapter ${k + 1}: pointer drag while paused works (dragging true during) and the paused values do not drift afterwards`, during.dragging === true && after.dragging === true && after.state === 'paused' && !moved.length, JSON.stringify({ before, during, after, moved }));
          }
          await page.locator('.apl-vctl .apl-vbtn.ghost').click();
          await clean(`ch${k + 1} ✕`);
          // 탭 전환
          await startAgain(); await seek();
          const alt = await page.evaluate(() => ['review', 'problem'].find((t) => t !== lab.tab && lab._tabAvailable(t)) || null);
          if (alt) {
            await page.evaluate((t) => lab.setTab(t), alt);
            check(`chapter ${k + 1}: tab switch lands on ${alt}`, await page.evaluate((t) => lab.tab === t && lab.video.state === 'idle', alt));
            await page.evaluate(() => lab.setTab('explore'));
          } else rec.checks.push({ name: `chapter ${k + 1}: tab switch`, status: 'NOT_RUN', detail: 'no alternate tab' });
          await clean(`ch${k + 1} tab`);
          // 장면 이동
          await startAgain(); await seek();
          await page.evaluate((i) => lab.goScene((i + 1) % lab.list.length), sc.i);
          await clean(`ch${k + 1} scene change`);
          await page.evaluate((i) => lab.goScene(i), sc.i);
          await clean(`ch${k + 1} back`);
        }
        // ---------- 끝 카드에서 나가기(모든 길) ----------
        const toEnded = async () => {
          await page.evaluate(([i, k]) => { lab.video.play(i, k); lab.video.rate = 8; lab.video.seek(lab.video.cs.length - 0.05); }, [sc.i, sc.k]);
          await waitEnded();
          await sleep(200);
        };
        await toEnded(); await page.locator('.apl-vend-btns button', { hasText: '직접 해 보기' }).click(); await clean('ended 「직접 해 보기」');
        await toEnded(); await page.locator('.apl-vendx').click(); await clean('ended ✕');
        await toEnded(); await page.evaluate((i) => lab.goScene((i + 1) % lab.list.length), sc.i); await clean('ended scene change');
        await page.evaluate((i) => lab.goScene(i), sc.i);
        await toEnded();
        const altE = await page.evaluate(() => ['review', 'problem'].find((t) => t !== lab.tab && lab._tabAvailable(t)) || null);
        if (altE) { await page.evaluate((t) => lab.setTab(t), altE); check(`ended: tab switch lands on ${altE}`, await page.evaluate((t) => lab.tab === t && lab.video.state === 'idle', altE)); await page.evaluate(() => lab.setTab('explore')); }
        await clean('ended tab switch');
        await toEnded(); await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
        check('ended 「다시 보기」: plays again', await page.evaluate(() => lab.video.state === 'playing'));
        await page.evaluate(() => lab.video.close()); await clean('ended replay then ✕');
        // 「다음 ▶」: 같은 장면의 다음 해설 → 다음 해설·영상 장면을 한 번에 재생(없으면 목차)
        await page.evaluate(([i, k]) => lab.video.play(i, k), [sc.i, sc.k]);
        await page.evaluate(() => { lab.video.rate = 8; lab.video.seek(lab.video.cs.length - 0.05); });
        await waitEnded();
        const expectNext = await page.evaluate(() => lab.video.nextTarget());
        const nextText = await page.evaluate(() => document.querySelector('.apl-vnext').innerText);
        if (expectNext && expectNext.label) check('「다음 ▶」: the button names the next lesson of the same scene', nextText.includes(expectNext.label), nextText);
        await page.locator('.apl-vnext').click();
        const after = await page.evaluate(() => ({ state: lab.video.state, index: lab.index, k: lab.video.lessonIndex, toc: !!(lab.toc && lab.toc.isOpen) }));
        check('「다음 ▶」: plays the next lesson of the scene, else the next lesson/video scene (or opens the TOC when none)', expectNext ? after.state === 'playing' && after.index === expectNext.i && after.k === expectNext.k : after.state === 'idle' && after.toc, JSON.stringify({ expectNext, after }));
        if (expectNext) {
          // 「다음 ▶」 한 번으로 다음 것도 추가 입력 없이 끝까지
          await page.evaluate(() => { lab.video.rate = 8; });
          await waitEnded();
          check('「다음 ▶」: the next one also plays to the end with no further input', await page.evaluate((t) => lab.video.state === 'ended' && lab.index === t.i && lab.video.lessonIndex === t.k && !!lab.s.dragging === (innerWidth <= 859 && lab.video.cs.tab === 'review'), expectNext));
          if (expectNext.i === sc.i) {
            // 같은 장면의 다음 해설: 끝 값이 그 해설의 값이고, 다시 보기는 방금 본 그 해설을 다시, 그리고 처음 해설로 돌아와도 처음 재생과 같다
            const other = sc.lessons[expectNext.k];
            const o1 = await snapshotOf(other);
            const fvo = finalValues(other);
            const bad = [...Object.entries(fvo.nums).filter(([k, v]) => Math.abs(o1.nums[k] - v) > 1e-6), ...Object.entries(fvo.sets).filter(([k, v]) => JSON.stringify(o1.sets[k]) !== JSON.stringify(v))];
            check(`switch: lesson 「${other.label}」 ends at its own final values`, !bad.length, JSON.stringify({ bad, o1 }));
            await shot(`lesson${expectNext.k}-end`);
            await page.evaluate(() => { lab.video.rate = 8; });
            await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
            check('switch: 「다시 보기」 replays the lesson just watched', await page.evaluate((k) => lab.video.lessonIndex === k && lab.video.state === 'playing', expectNext.k));
            await waitEnded();
            const o2 = await snapshotOf(other);
            check('switch: replay of the second lesson ends the same', JSON.stringify(o1) === JSON.stringify(o2), JSON.stringify({ o1, o2 }));
            // 처음 해설로 돌아가기: 끝 카드에서 「직접 해 보기」 → 패널 맨 위의 해설 단추
            await page.locator('.apl-vend-btns button', { hasText: '직접 해 보기' }).click();
            await sleep(300);
            await page.locator('.apl-lgo:visible').nth(sc.k).click();
            check('switch back: the first lesson button plays the first lesson', await page.evaluate((k) => lab.video.lessonIndex === k && lab.video.state === 'playing', sc.k));
            await page.evaluate(() => { lab.video.rate = 8; });
            await waitEnded();
            const e4 = await snapshot();
            check('switch back: the first lesson ends exactly as on its first play', JSON.stringify(e1) === JSON.stringify(e4), JSON.stringify({ e1, e4 }));
            if (timelineA) {
              await page.locator('.apl-vend-btns button', { hasText: '다시 보기' }).click();
              await page.locator('.apl-vmini').click();
              const timelineC = await sample(page);
              const diffC = timelineA.map((a, i) => ({ a, b: timelineC[i] })).filter(({ a, b }) => !b || Math.abs(a.t - b.t) > 1e-6 || Object.keys(a.nums).some((k) => Math.abs(a.nums[k] - b.nums[k]) > 1e-6) || JSON.stringify(a.sets) !== JSON.stringify(b.sets) || a.step !== b.step);
              check('switch back: state timeline of the first lesson equals its first play (no value leaks from the other lesson)', !diffC.length, JSON.stringify(diffC.slice(0, 2)));
            }
            await page.evaluate(() => { lab.video.rate = 8; });
          }
        }
        await page.evaluate(() => { lab.video.close(); });
        // ✕ 뒤에는 이 실험실의 세션 동안 탐구 화면이 열린 채 ▶ 가 패널 맨 위에 남는다
        await page.evaluate((i) => lab.goScene(i), sc.i);
        await sleep(300);
        const kept = await page.evaluate(() => ({ lessonFirst: document.body.classList.contains('apl-lessonfirst'), entry: !document.querySelector('.apl-lentry').hidden && document.querySelector('.apl-lentry').dataset.mode, tabs: [...document.querySelectorAll('.apl-tab')].filter((e) => e.checkVisibility()).length, sliders: [...document.querySelectorAll('input[type=range]')].filter((e) => e.checkVisibility()).length }));
        check('after 「직접 해 보기」: explore UI opens and ▶ stays at the top of the panel (remembered for the session)', !kept.lessonFirst && kept.entry === 'inline' && (kept.sliders > 0), JSON.stringify(kept));
        await shot('explore');
        check('console errors 0', !rec.errors.length, rec.errors.join(' | '));
      } catch (e) {
        rec.errors.push('audit: ' + e.stack);
        check('audit ran to completion', false, e.message);
      }
      await ctx.close();
    }
  }
}
await browser.close();
if (out) fs.writeFileSync(path.join(out, 'lesson-audit-results.json'), JSON.stringify(results, null, 2));
let failed = 0;
for (const r of results) {
  const fails = r.checks.filter((c) => c.status === 'FAIL');
  const notRun = r.checks.filter((c) => c.status === 'NOT_RUN');
  if (fails.length || r.errors.length) failed++;
  console.log(`${fails.length || r.errors.length ? 'FAIL' : 'PASS'} ${r.lab} ${r.scene} [${r.view}] checks ${r.checks.length} fail ${fails.length}${notRun.length ? ` not-run ${notRun.length}` : ''}`);
  fails.forEach((c) => console.log(`   - ${c.name}: ${c.detail}`));
  r.errors.forEach((e) => console.log(`   ! ${e.slice(0, 300)}`));
}
console.log(failed ? `${failed} run(s) failed` : 'all lesson audit runs passed');
if (failed) process.exitCode = 1;
