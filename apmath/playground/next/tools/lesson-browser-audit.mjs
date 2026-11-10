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
  { name: '844x390', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, full: false }
];
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, headless: true } : { channel: 'chromium', headless: true });
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 해설 JSON 의 최종 값(숫자·set)을 시간 순서대로 접어 구합니다. */
function finalValues(lesson) {
  const nums = {}, sets = {};
  lesson.chapters.forEach((ch) => {
    Object.assign(nums, ch.start || {});
    (ch.cues || []).forEach((c) => { Object.assign(nums, c.to || {}); Object.assign(sets, c.set || {}); });
  });
  return { nums, sets };
}

for (const labId of targets) {
  // 장면 목록은 첫 페이지에서 읽습니다.
  const ctx0 = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const p0 = await ctx0.newPage();
  await p0.goto(`${base}${labId}.html`, { waitUntil: 'load' });
  await p0.waitForFunction(() => window.lab && lab.video && lab.list.length);
  const scenes = await p0.evaluate(() => lab.list.map((sc, i) => ({ i, id: String(sc.id), gi: sc.gi, lesson: lab.video.lessonOf(i) && lab.video.has(i) ? JSON.parse(JSON.stringify(lab.video.lessonOf(i))) : null })).filter((x) => x.lesson));
  await ctx0.close();
  for (const sc of scenes) {
    if (only.length && !only.some(([l, s]) => l === labId && (!s || s === sc.id))) continue;
    for (const view of VIEWS) {
      const rec = { lab: labId, scene: sc.id, view: view.name, checks: [], errors: [] };
      results.push(rec);
      const check = (name, pass, detail = '') => rec.checks.push({ name, status: pass ? 'PASS' : 'FAIL', detail: pass ? '' : String(detail).slice(0, 600) });
      const ctx = await browser.newContext({ viewport: view.viewport, isMobile: view.isMobile, hasTouch: view.hasTouch, deviceScaleFactor: view.deviceScaleFactor });
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
      const shot = async (label) => { if (out) await page.screenshot({ path: path.join(out, `${labId}-${sc.id}-${view.name}-${label}.png`) }); };
      const snapshot = () => page.evaluate((fv) => ({ nums: Object.fromEntries(Object.keys(fv.nums).map((k) => [k, lab.s[k]])), sets: Object.fromEntries(Object.keys(fv.sets).map((k) => [k, lab.s[k]])), step: lab.s.step, tab: lab.tab, dragging: lab.s.dragging, lessonOn: lab.s.lessonOn, state: lab.video.state }), finalValues(sc.lesson));
      const goButton = () => page.locator('.apl-lgo:visible').first();
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
        const len = await page.evaluate(() => lab.video.lengthOf(lab.index));
        // ---------- 진입 화면 ----------
        const entry = await rectOf('.apl-lgo');
        check('entry: ▶ button fully inside the viewport', inView(entry), JSON.stringify(entry));
        check('entry: ▶ button at least 44px high', !!entry && entry.h >= 44, JSON.stringify(entry));
        const st0 = await page.evaluate(() => ({ playing: lab.s.playing, revealed: lab.s.revealed, state: lab.video.state, lessonFirst: document.body.classList.contains('apl-lessonfirst'), label: document.querySelector('.apl-lgo')?.innerText }));
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
        }
        await shot('entry');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        check('entry: no horizontal overflow', !overflow);
        // 자동 재생이 없었는지(로드 직후 1초 더 기다려 봄)
        await sleep(800);
        check('entry: no autoplay', await page.evaluate(() => lab.video.state === 'idle' && !lab.s.playing));

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
          await load(`#s=${encodeURIComponent(sc.id + '@' + sc.gi)}&play=1`);
          await page.waitForFunction(() => lab.video.state === 'playing', null, { timeout: 5000 }).then(() => check('play=1 starts playback', true), () => check('play=1 starts playback', false, 'not playing'));
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
        check('ended: tab explore, dragging false, no lessonOn', e1.tab === 'explore' && e1.dragging === false && e1.lessonOn === undefined, JSON.stringify(e1));
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
          await page.evaluate((i) => lab.video.play(i), sc.i); // 시작은 API, 이동·나가기는 화면의 단추로
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
        // 「다음 ▶」: 다음 해설 장면을 한 번에 재생(없으면 목차)
        await page.evaluate((i) => lab.video.play(i), sc.i);
        await page.evaluate(() => { lab.video.rate = 8; lab.video.seek(lab.video.cs.length - 0.05); });
        await waitEnded();
        const expectNext = await page.evaluate(() => lab.video.nextIndex(lab.video.index));
        await page.locator('.apl-vnext').click();
        const after = await page.evaluate(() => ({ state: lab.video.state, index: lab.index, toc: !!(lab.toc && lab.toc.isOpen) }));
        check('「다음 ▶」: plays the next lesson/video scene (or opens the TOC when none)', expectNext >= 0 ? after.state === 'playing' && after.index === expectNext : after.state === 'idle' && after.toc, JSON.stringify({ expectNext, after }));
        if (expectNext >= 0) {
          // 「다음 ▶」 한 번으로 다음 장면도 추가 입력 없이 끝까지
          await page.evaluate(() => { lab.video.rate = 8; });
          await waitEnded();
          check('「다음 ▶」: the next scene also plays to the end with no further input', await page.evaluate((n) => lab.video.state === 'ended' && lab.index === n && lab.s.dragging === false, expectNext));
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
