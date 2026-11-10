/* ==========================================================================
   라벨 겹침·잘림 자동 검사 도구 (도형실험실 2.0)
   - 한 장면의 상태값(파라미터)을 범위로 훑으며 두 화면(태블릿 1024×768, 휴대폰 390×844)에서
     글자 라벨끼리 겹치거나 캔버스 밖으로 잘리는 값을 찾습니다.
   - 짧은 해설 영상 대본을 쓸 때 라벨이 깨끗한 값만 쓰도록 돕고,
     --all 로 실험실 전체 장면의 라벨 결함도 찾습니다.

   사용 예:
     node tools/label-sweep.mjs <base-url> g7-circle-sector --scene 1209 --param b1209_th --from 10 --to 350 --step 10 --fix b1209_r=12
     node tools/label-sweep.mjs <base-url> g7-circle-sector --scene f4-swirl --param f4_swirl_t --from 0 --to 1 --step 0.02
     node tools/label-sweep.mjs <base-url> g7-circle-sector --all

   base-url 예: http://127.0.0.1:8813/apmath/playground/next/labs/
   ========================================================================== */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import {
  analyze, formatRanges, genRange,
} from './label-sweep-lib.mjs';

// Playwright 는 전역 NODE_PATH 로 제공되어 ESM import 가 찾지 못하므로 require 로 읽습니다.
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

/* ---------- 화면(환경) ---------- */
const ENVS = [
  { name: '태블릿', viewport: { width: 1024, height: 768 } },
  { name: '휴대폰', viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
];

/* ---------- 인자 파싱 ---------- */
function parseArgs(argv) {
  const pos = [];
  const flags = [];
  const fix = {};
  let overlap = 0.15;
  let touch = 0.04;
  let stack = 1.5;
  let json = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') { flags.push('all'); continue; }
    if (a === '--overlap') { overlap = parseFloat(argv[++i]); continue; }
    if (a === '--stack-px') { stack = parseFloat(argv[++i]); continue; }
    if (a === '--touch') { touch = parseFloat(argv[++i]); continue; }
    if (a === '--json') { json = argv[++i]; continue; }
    if (a === '--fix') { const kv = argv[++i]; const k = kv.split('=')[0]; fix[k] = parseFloat(kv.slice(k.length + 1)); continue; }
    if (a.startsWith('--')) { flags.push([a.slice(2), argv[++i]]); continue; }
    pos.push(a);
  }
  const [baseUrl, lab] = pos;
  const opt = {};
  for (const f of flags) {
    if (Array.isArray(f)) opt[f[0]] = f[1];
    else opt[f] = true;
  }
  return { baseUrl, lab, all: !!opt.all, opt, fix, overlap, touch, stack, json };
}

function usage() {
  return [
    '사용법: node tools/label-sweep.mjs <base-url> <lab> [옵션]',
    '  --scene <id>      장면 id (예: 1209, f4-swirl)',
    '  --param <이름>    훑을 상태값 이름 (예: b1209_th)',
    '  --from <수>       시작 값',
    '  --to <수>         끝 값',
    '  --step <수>       간격',
    '  --fix <이름>=<값> 고정할 상태값 (여러 번 가능)',
    '  --overlap <비율>  겹침 기준(작은 상자 넓이 대비, 기본 0.15)',
    '  --stack-px <px>  위아래로 쌓인 두 줄의 세로 겹침 허용(기본 1.5, 4.5 로 올리면 줄 간격 수준은 깨끗으로 봄)',
    '  --touch <비율>    맞닿음 기준(기본 0.04, 겹침 기준 미만이면서 이 비율 이상)',
    '  --json <파일>     결과를 JSON 으로 저장',
    '  --all             모든 장면을 기본 상태로 한 번씩 검사',
  ].join('\n');
}

/* ---------- 브라우저 보조 ---------- */

// 페이지를 열고 window.lab 을 기다린 뒤 _text 래퍼를 설치합니다.
async function openPage(browser, baseUrl, lab, env) {
  const context = await browser.newContext({ viewport: env.viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e && e.message ? e.message : e}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
  const url = baseUrl.replace(/\/$/, '') + '/' + lab + '.html?manual=1';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.lab && window.APLab && window.APLab.Board, null, { timeout: 60000 });
  // 글꼴이 늦게 뜨면 글자 폭이 달라져 상자가 어긋나므로, 준비(또는 8초)까지 기다립니다.
  await page.evaluate(() => Promise.race([
    (document.fonts && document.fonts.ready) || Promise.resolve(),
    new Promise((r) => setTimeout(r, 8000)),
  ]));
  await page.evaluate(installCapture);
  return { page, context, errors };
}

// _text 를 감싸 글자 내용(str)과 화면 상자(l,r,t,b)를 함께 모읍니다.
// - 재는 중(measure, _bbox 가 있음)에는 원래 함수만 호출해 맞춤 계산을 건드리지 않습니다.
// - 실제 그리기(_bbox 없음)에서는 원래 함수가 상자를 기록하도록 잠깐 _bbox 를 세워 읽고 원상 복구합니다.
// - 썸네일(thumb)은 글자 위치가 다르므로 건너뜁니다.
function installCapture() {
  const proto = window.APLab.Board.prototype;
  if (proto.__labelSweepHooked) return;
  proto.__labelSweepHooked = true;
  const orig = proto._text;
  const origBegin = proto.begin;
  window.__lsBoxes = [];
  // 다시 그릴 때마다 상자를 비웁니다(레이아웃 재조정으로 같은 장면이 두 번 그려져도 마지막 것만 남음).
  proto.begin = function (opts) {
    window.__lsBoxes.length = 0;
    return origBegin.call(this, opts);
  };
  proto._text = function (x, y, str, o = {}, screen = false) {
    if (str == null || str === '' || this.thumb) return this;
    if (this._bbox) return orig.call(this, x, y, str, o, screen); // measure 중
    const tmp = { texts: [] };
    this._bbox = tmp;
    try { orig.call(this, x, y, str, o, screen); }
    finally { this._bbox = null; }
    const t = tmp.texts[tmp.texts.length - 1];
    if (t && !screen) window.__lsBoxes.push({ str: String(str), l: x + t.l, r: x + t.r, t: y + t.t, b: y + t.b });
    return this;
  };
}

// 무대 크기(레이아웃)가 두 프레임 연속 그대로일 때까지 기다립니다.
// 좁은 화면에서 패널·폰트가 늦게 자리잡으며 캔버스가 다시 커지면 여러 번 그려질 수 있어서,
// 마지막(안정된) 그리기까지 기다린 뒤 상자를 읽습니다.
async function settle(page) {
  await page.evaluate(() => new Promise((resolve) => {
    let last = null;
    let stable = 0;
    let guard = 0;
    function check() {
      const b = window.lab && window.lab.board;
      const w = b ? b.W : -1;
      const h = b ? b.H : -1;
      if (last && w === last.w && h === last.h) stable++; else stable = 0;
      last = { w, h };
      if (stable >= 2 || ++guard > 60) resolve();
      else requestAnimationFrame(check);
    }
    requestAnimationFrame(check);
  }));
}

async function goScene(page, id) {
  await page.evaluate((sid) => {
    const i = window.lab.list.findIndex((x) => x.id === sid);
    if (i < 0) throw new Error('장면을 찾을 수 없습니다: ' + sid);
    window.lab.goScene(i);
    window.lab.s.playing = false; // 굴리기·움직이기 장면은 들어가자마자 저절로 재생되어 값이 흔들립니다(영상 재생기도 playing=false 로 고정)
  }, id);
  await settle(page);
}

async function setState(page, patch) {
  await page.evaluate((p) => {
    window.lab.s.playing = false;
    window.lab.set(p);
  }, patch);
  await settle(page);
}

async function readBoxes(page) {
  return page.evaluate(() => ({
    boxes: window.__lsBoxes.slice(),
    W: window.lab.board.W,
    H: window.lab.board.H,
  }));
}

/* ---------- 결과 정리 ---------- */
function describeResult(result) {
  const parts = [];
  for (const o of result.overlaps) parts.push(`겹침: 「${o.a}」×「${o.b}」`);
  for (const o of (result.touches || [])) parts.push(`맞닿음: 「${o.a}」×「${o.b}」`);
  for (const c of result.clips) parts.push(`잘림: 「${c.str}」`);
  return parts.length ? parts.join('; ') : 'OK';
}

function isClean(result) {
  return result.overlaps.length === 0 && (result.touches || []).length === 0 && result.clips.length === 0;
}

function pad(s, w) {
  const k = String(s);
  return k + ' '.repeat(Math.max(0, w - [...k].length));
}

/* ---------- 실행 ---------- */

async function runSweep(browser, args) {
  const { baseUrl, lab, opt, fix, overlap, touch, stack } = args;
  const scene = opt.scene;
  const param = opt.param;
  const from = parseFloat(opt.from);
  const to = parseFloat(opt.to);
  const step = parseFloat(opt.step);
  const values = genRange(from, to, step);

  const perEnv = {};
  const errors = [];
  for (const env of ENVS) {
    const { page, context, errors: e } = await openPage(browser, baseUrl, lab, env);
    errors.push(...e);
    await goScene(page, scene);
    if (Object.keys(fix).length) await setState(page, fix);
    const arr = [];
    for (const v of values) {
      await setState(page, { [param]: v });
      const { boxes, W, H } = await readBoxes(page);
      arr.push({ v, result: analyze(boxes, W, H, overlap, 4, touch, stack) });
    }
    perEnv[env.name] = arr;
    await context.close();
  }

  // 표 출력
  const head = `장면 ${scene} · param ${param} · ${from}~${to} (step ${step})` + (Object.keys(fix).length ? ` · fix ${Object.entries(fix).map(([k, v]) => `${k}=${v}`).join(',')}` : '');
  console.log(head);
  console.log(pad('값', 10) + pad('태블릿', 44) + '휴대폰');
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    const t = describeResult(perEnv['태블릿'][i].result);
    const p = describeResult(perEnv['휴대폰'][i].result);
    console.log(pad(String(v), 10) + pad(t, 44) + p);
  }

  const cleanBoth = values.filter((v, i) => isClean(perEnv['태블릿'][i].result) && isClean(perEnv['휴대폰'][i].result));
  console.log(`\n깨끗한 값(두 환경 모두): ${formatRanges(cleanBoth, step) || '(없음)'}`);

  if (errors.length) {
    console.log('\n콘솔 오류:');
    for (const e of [...new Set(errors)]) console.log(`  - ${e}`);
  }

  return {
    lab, mode: 'sweep', scene, param, from, to, step, fix, overlap, touch, stack,
    environments: perEnv, cleanRanges: formatRanges(cleanBoth, step), errors: [...new Set(errors)],
  };
}

async function runAll(browser, args) {
  const { baseUrl, lab, overlap, touch, stack } = args;
  const perEnv = {};
  const errors = [];
  for (const env of ENVS) {
    const { page, context, errors: e } = await openPage(browser, baseUrl, lab, env);
    errors.push(...e);
    const scenes = await page.evaluate(() => window.lab.list.map((sc, i) => ({ i, id: sc.id, title: sc.title })));
    const arr = [];
    for (const sc of scenes) {
      await page.evaluate((i) => { window.lab.goScene(i); window.lab.s.playing = false; }, sc.i);
      await settle(page);
      const { boxes, W, H } = await readBoxes(page);
      arr.push({ id: sc.id, title: sc.title, result: analyze(boxes, W, H, overlap, 4, touch, stack) });
    }
    perEnv[env.name] = arr;
    await context.close();
  }

  const scenes = perEnv['태블릿'].map((x) => x.id);
  console.log(`모든 장면 (${scenes.length}) · 기본 상태 한 번씩`);
  console.log(pad('장면', 24) + pad('태블릿', 44) + '휴대폰');
  for (let i = 0; i < scenes.length; i++) {
    const t = describeResult(perEnv['태블릿'][i].result);
    const p = describeResult(perEnv['휴대폰'][i].result);
    console.log(pad(scenes[i], 24) + pad(t, 44) + p);
  }

  const defects = [];
  for (let i = 0; i < scenes.length; i++) {
    const id = scenes[i];
    const t = perEnv['태블릿'][i].result;
    const p = perEnv['휴대폰'][i].result;
    if (!isClean(t) || !isClean(p)) {
      defects.push({ id, title: perEnv['태블릿'][i].title, tablet: t, phone: p });
    }
  }
  if (defects.length) {
    console.log('\n결함 장면:');
    for (const d of defects) {
      if (!isClean(d.tablet)) console.log(`  ${d.id} [태블릿] ${describeResult(d.tablet)}`);
      if (!isClean(d.phone)) console.log(`  ${d.id} [휴대폰] ${describeResult(d.phone)}`);
    }
  } else {
    console.log('\n결함 장면: 없음');
  }

  if (errors.length) {
    console.log('\n콘솔 오류:');
    for (const e of [...new Set(errors)]) console.log(`  - ${e}`);
  }

  return {
    lab, mode: 'all', overlap, touch, stack,
    scenes: perEnv['태블릿'].map((x, i) => ({
      id: x.id, title: x.title,
      tablet: x.result, phone: perEnv['휴대폰'][i].result,
    })),
    errors: [...new Set(errors)],
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.baseUrl || !args.lab) {
    console.error(usage());
    process.exit(2);
  }
  if (!args.all && (!args.opt.scene || !args.opt.param || args.opt.from == null || args.opt.to == null || args.opt.step == null)) {
    console.error('훑기(--scene/--param/--from/--to/--step) 또는 --all 이 필요합니다.\n');
    console.error(usage());
    process.exit(2);
  }

  const browser = await chromium.launch();
  let result;
  try {
    result = args.all ? await runAll(browser, args) : await runSweep(browser, args);
  } finally {
    await browser.close();
  }

  if (args.json) {
    fs.writeFileSync(args.json, JSON.stringify(result, null, 2) + '\n');
    console.log(`\nJSON 저장: ${args.json}`);
  }
}

main().catch((e) => {
  console.error(e && e.stack ? e.stack : e);
  process.exit(1);
});
