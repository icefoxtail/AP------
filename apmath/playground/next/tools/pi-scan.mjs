/* ==========================================================================
   π 꼴 점검 도구 (도형실험실 2.0)
   - 한 실험실의 모든 장면을 탐구 · 정리(마지막 단계까지) · 문제(정답 펼침) 탭으로 열어
     화면 글자(DOM 글자 + 캔버스에 그려진 글자)에서 소수(예: 28.27, 18.85)를 찾습니다.
   - 중학교 도형 단원은 넓이·둘레·호의 길이를 9π, 24+6π 처럼 π 를 남긴 꼴로 쓰므로
     화면에 소수가 보이면 학생이 헷갈립니다. 소수가 0개여야 통과입니다.
   - 허용 목록(ALLOW)은 비워 둡니다. 정말 소수가 필요한 장면은 고치지 말고 사람이 정합니다.

   사용법:
     node tools/pi-scan.mjs <base-url> <lab> [--scene <id,...>] [--file <파일명>] [--sweep] [--json <파일>]
   예:
     node apmath/playground/next/tools/pi-scan.mjs http://127.0.0.1:8850/apmath/playground/next/labs/ g7-circle-sector
   옵션:
     --scene <id,...>  쉼표로 나눈 장면만 검사
     --file <파일명>   labs/<lab>/ 아래 그 장면 코드 파일(예: f03.js, f03)에 정의된 장면만 검사
                       (장면 id → 파일 대응은 소스에서 `id: '<id>', title` 꼴을 찾아 도구가 정합니다. --map 으로 대응표 출력)
     --sweep           탐구 탭에서 막대마다 최소·최대·중간 몇 값에 멈춘 정지 상태도 검사(학생이 막대를 놓은 모습)
     --json <파일>  결과를 JSON 으로 저장
   종료 코드: 소수가 하나라도 있으면 1, 없으면 0.
   ========================================================================== */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

// 허용 목록: { scene: 장면 id, tab: 'explore|review|problem'(생략 가능), re: 글자 패턴 }. 비워 둡니다.
const ALLOW = [];

const DEC = /\d+\.\d+/g;
const APPROX = /[≈约]|약\s*\d/;

function parseArgs(argv) {
  const pos = []; const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--sweep') opt.sweep = true;
    else if (a === '--map') opt.map = true;
    else if (a === '--scene' || a === '--json' || a === '--file') opt[a.slice(2)] = argv[++i];
    else pos.push(a);
  }
  return { base: pos[0], lab: pos[1], opt };
}

const { base, lab, opt } = parseArgs(process.argv.slice(2));
if (!base || !lab) {
  console.error('사용법: node tools/pi-scan.mjs <base-url> <lab> [--scene <id,...>] [--file <파일명>] [--sweep] [--map] [--json <파일>]');
  process.exit(2);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  // 캔버스에 그려지는 글자(str)를 모읍니다. 원래 함수는 그대로 호출합니다.
  window.__piTexts = [];
  const hook = () => {
    const B = window.APLab && window.APLab.Board;
    if (!B || B.prototype.__piHooked) return !!B;
    B.prototype.__piHooked = true;
    const orig = B.prototype._text;
    B.prototype._text = function (x, y, str, o, screen) {
      if (str != null && str !== '' && !this._bbox && !this.thumb) window.__piTexts.push(String(str));
      return orig.apply(this, arguments);
    };
    return true;
  };
  const t = setInterval(() => { if (hook()) clearInterval(t); }, 1);
});
await page.goto(base.replace(/\/?$/, '/') + lab + '.html?manual=1', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.lab && window.lab.board && window.__piTexts);

// 현재 화면의 글자(캔버스 + DOM)를 모읍니다.
async function collect(tabId) {
  return page.evaluate(async (tab) => {
    const L = window.lab;
    if (L.tab !== tab) L.setTab(tab);
    L.s.playing = false;
    L.invalidate(true);
    L.render();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    window.__piTexts.length = 0;
    L.render();
    const canvas = window.__piTexts.slice();
    const dom = document.body.innerText;
    return { canvas, dom };
  }, tabId);
}

const findings = [];
function scanText(sceneId, tab, where, text, extra) {
  const hits = [];
  for (const m of text.matchAll(DEC)) {
    const i = m.index;
    hits.push({ kind: 'decimal', val: m[0], ctx: text.slice(Math.max(0, i - 14), i + m[0].length + 10).replace(/\s+/g, ' ') });
  }
  const ap = text.match(APPROX);
  if (ap) {
    const i = ap.index;
    hits.push({ kind: 'approx', val: ap[0], ctx: text.slice(Math.max(0, i - 14), i + 18).replace(/\s+/g, ' ') });
  }
  for (const h of hits) {
    if (ALLOW.some((a) => a.scene === sceneId && (!a.tab || a.tab === tab) && new RegExp(a.re).test(h.ctx))) continue;
    findings.push({ scene: sceneId, tab, where, extra: extra || '', ...h });
  }
}

const meta = await page.evaluate(() => window.lab.list.map((s, i) => ({ i, id: s.id, params: Object.entries(s.params || {}).length })));

// 장면 id → 장면 코드 파일. labs/<lab>/*.js 와 labs/<lab>.html 소스에서 `id: '<id>', title` 꼴을 찾고, 없으면 `id: '<id>'` 꼴을 찾습니다.
const LABS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs');
const srcFiles = [];
if (fs.existsSync(path.join(LABS, lab))) for (const f of fs.readdirSync(path.join(LABS, lab))) if (f.endsWith('.js') && !/^video/.test(f)) srcFiles.push([f, path.join(LABS, lab, f)]);
if (fs.existsSync(path.join(LABS, lab + '.html'))) srcFiles.push([lab + '.html', path.join(LABS, lab + '.html')]);
const srcText = srcFiles.map(([f, p]) => [f, fs.readFileSync(p, 'utf8')]);
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function fileOf(id) {
  for (const re of [new RegExp(`\\bid:\\s*['"]${esc(id)}['"],\\s*title`), new RegExp(`\\bid:\\s*['"]${esc(id)}['"]`), new RegExp(`['"]${esc(id)}['"]`), new RegExp(`\\bid:\\s*['"]${esc(id.replace(/^f\d-/, ''))}['"],\\s*title`)]) {
    const hit = srcText.filter(([, t]) => re.test(t)).map(([f]) => f);
    if (hit.length) return hit.join('+');
  }
  return '(찾지 못함)';
}
for (const m of meta) m.file = fileOf(m.id);
if (opt.map) { for (const m of meta) console.log(`${m.id}\t${m.file}`); process.exit(0); }
const wantFile = opt.file ? opt.file.replace(/\.js$/, '') : null;
const wantScenes = opt.scene ? new Set(opt.scene.split(',').map((x) => x.trim()).filter(Boolean)) : null;
const sceneList = meta.filter((m) => (!wantScenes || wantScenes.has(m.id)) && (!wantFile || m.file.split('+').some((f) => f.replace(/\.(js|html)$/, '') === wantFile)));
if (!sceneList.length) { console.error('맞는 장면이 없습니다'); process.exit(2); }
const fileById = Object.fromEntries(meta.map((m) => [m.id, m.file]));

for (const m of sceneList) {
  await page.evaluate((i) => { window.lab.goScene(i); window.lab.s.playing = false; }, m.i);
  const avail = await page.evaluate(() => ['explore', 'review', 'problem'].filter((t) => window.lab._tabAvailable(t)));
  for (const tab of avail) {
    if (tab === 'review') await page.evaluate(() => { const st = (typeof window.lab.scene.steps === 'function' ? window.lab.scene.steps(window.lab.s) : window.lab.scene.steps) || []; window.lab.setStep(st.length); });
    if (tab === 'problem') await page.evaluate(() => { window.lab.s.revealed = true; });
    const r = await collect(tab);
    scanText(m.id, tab, '캔버스', r.canvas.join(' | '));
    scanText(m.id, tab, '화면글', r.dom);
  }
  if (opt.sweep) {
    // 탐구 탭: 장면이 쓰는 막대마다 최소·최대·몇 개의 중간 값에 멈춘 정지 상태
    const ctl = await page.evaluate(() => {
      const L = window.lab; const sc = L.scene;
      const keys = (typeof sc.controls === 'function' ? sc.controls(L.s) : sc.controls) || [];
      return keys.filter((k) => L.params[k] && typeof L.params[k].min === 'number').map((k) => ({ k, ...L.params[k] }));
    });
    for (const p of ctl) {
      const st = p.step || 0.01;
      const n = Math.round((p.max - p.min) / st);
      const picks = [...new Set([0, 1, Math.floor(n / 3), Math.floor(n / 2), Math.floor((2 * n) / 3), n - 1, n].filter((x) => x >= 0 && x <= n))];
      for (const q of picks) {
        const v = +(p.min + q * st).toFixed(6);
        const keep = await page.evaluate(({ k }) => window.lab.s[k], p);
        await page.evaluate(({ k, v }) => { window.lab.s.tab = 'explore'; window.lab.set({ [k]: v }); }, { k: p.k, v });
        const r = await collect('explore');
        scanText(m.id, 'explore', '막대 ' + p.k + '=' + v, r.canvas.join(' | ') + ' ' + r.dom);
        await page.evaluate(({ k, keep }) => window.lab.set({ [k]: keep }), { k: p.k, keep });
      }
    }
  }
}
await browser.close();

// 같은 (장면, 탭, 글자 조각)은 한 줄로 합칩니다.
const TABNAME = { explore: '탐구', review: '정리(마지막 단계)', problem: '문제' };
const seen = new Map();
for (const f of findings) {
  const key = [f.scene, f.tab, f.where, f.kind, f.val, f.ctx].join('\u0001');
  if (!seen.has(key)) seen.set(key, f);
}
const rows = [...seen.values()];
const scenes = new Set(rows.map((r) => r.scene));
const byFile = {};
for (const r of rows) byFile[fileById[r.scene]] = (byFile[fileById[r.scene]] || 0) + 1;
console.log(`장면 ${sceneList.length}개 검사 · 소수/근삿값이 나온 장면 ${scenes.size}개 · 총 ${rows.length}개` + (errors.length ? ` · 실행 오류 ${errors.length}: ${errors[0].slice(0, 100)}` : ''));
console.log('파일별: ' + (Object.entries(byFile).map(([f, n]) => `${f} ${n}`).join(' · ') || '없음'));
console.log('장면\t파일\t탭\t구분\t종류\t소수 글자\t앞뒤 글자');
for (const r of rows) console.log(`${r.scene}\t${fileById[r.scene]}\t${TABNAME[r.tab] || r.tab}\t${r.where === '캔버스' ? '캔버스' : r.where === '화면글' ? 'DOM' : r.where}\t${r.kind === 'decimal' ? '소수' : '근삿값'}\t${r.val}\t「${r.ctx}」`);
console.log(`합계 ${rows.length}`);
if (opt.json) fs.writeFileSync(opt.json, JSON.stringify({ scenes: sceneList.length, byFile, rows }, null, 1));
process.exit(rows.length || errors.length ? 1 : 0);
