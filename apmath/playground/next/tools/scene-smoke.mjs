// AP Math Lab 2.0 · 모든 장면 자동 렌더 검사 (Playwright 필요)
// 실행 예: (저장소 루트에서 정적 서버를 띄운 뒤)
//   python3 -m http.server 8765 &
//   node apmath/playground/next/tools/scene-smoke.mjs http://127.0.0.1:8765/apmath/playground/next/labs/
// 선택 옵션(인자 없으면 전체):
//   --only common-lines,geom-parabola   파일 이름(.html 앞부분)이 쉼표 목록과 같거나, /정규식/ 형태면 그 식에 맞는 실험실만
//   --runs tablet                        환경 이름에 이 글자가 든 환경만(PC·휴대폰·태블릿 등)
// 각 실험실의 모든 장면을 PC(칠판·종이 테마)·휴대폰·태블릿(세로 768×1024, 가로 1024×768) 크기로 열어
// ① 실행 오류 ② 빈 그림 ③ 깨진 패널 ④ 무대 밖으로 잘린 라벨 ⑤ 장면을 넘기다 사라진 조작부를 찾습니다.
// 기존 실험실에서 오류 장면 5개(삼각비 4, 피타고라스 1)를 찾아낸 방법과 같은 원리입니다.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// playwright는 전역 설치(NODE_PATH)인 경우가 많아 require로 불러옵니다.
const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const optVal = (k) => { const i = argv.indexOf(k); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, v === undefined ? 1 : 2); return v ?? ''; };
const onlyArg = optVal('--only');
const runsArg = optVal('--runs');
const base = (argv[0] || 'http://127.0.0.1:8765/apmath/playground/next/labs/').replace(/\/?$/, '/');
const onlyTest = (() => {
  if (!onlyArg) return null;
  const m = /^\/(.+)\/([a-z]*)$/.exec(onlyArg);
  if (m) { const re = new RegExp(m[1], m[2]); return (id) => re.test(id); }
  const set = new Set(onlyArg.split(',').map((x) => x.trim().replace(/\.html$/, '')).filter(Boolean));
  return (id) => set.has(id);
})();
const labsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs');
// 실험실 무대(window.lab)가 없는 안내 전용 페이지(이전됨)는 검사 대상이 아닙니다. 소스에 무대 틀(APLab 셸)이 없으면 건너뜁니다.
const pages = fs.readdirSync(labsDir).filter((f) => {
  if (!f.endsWith('.html')) return false;
  if (onlyTest && !onlyTest(f.replace(/\.html$/, ''))) return false;
  if (!/apl-shell\.js/.test(fs.readFileSync(path.join(labsDir, f), 'utf8'))) { console.log(`SKIP ${f} (실험실 무대 없음)`); return false; }
  return true;
});
const ALL_RUNS = [
  { name: 'PC·칠판', theme: 'board', viewport: { width: 1280, height: 820 } },
  { name: 'PC·종이', theme: 'paper', viewport: { width: 1280, height: 820 } },
  { name: '휴대폰', theme: 'board', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  // 태블릿은 주 화면입니다(설계 §5). 터치는 되지만 휴대폰 모드(isMobile)는 아닙니다.
  { name: '태블릿·세로', theme: 'board', viewport: { width: 768, height: 1024 }, hasTouch: true, deviceScaleFactor: 2 },
  { name: '태블릿·가로', theme: 'board', viewport: { width: 1024, height: 768 }, hasTouch: true, deviceScaleFactor: 2 }
];
const RUNS = runsArg ? ALL_RUNS.filter((r) => r.name.includes(runsArg)) : ALL_RUNS;
if (onlyTest && !pages.length) { console.error(`--only ${onlyArg}: 맞는 실험실이 없습니다`); process.exit(2); }
if (!RUNS.length) { console.error(`--runs ${runsArg}: 맞는 환경이 없습니다`); process.exit(2); }

const browser = await chromium.launch();
let failed = 0;
for (const file of pages) {
  for (const run of RUNS) {
    const { name, theme, ...device } = run;
    const ctx = await browser.newContext(device);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${base}${file}?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab && window.lab.board);
    const rows = await page.evaluate(async () => {
      const b = lab.board;
      // 실제로 그려진 라벨의 화면 상자를 기록합니다(가장자리에서 뒤집기·밀어 넣기까지 반영된 최종 위치).
      let boxes = [];
      const drawText = b._text;
      b._text = function (x, y, str, o = {}, screen) {
        if (str != null && str !== '' && !screen && !this._bbox) {
          const c = this.ctx;
          const size = (o.size || 13) * this.fs * this._ts();
          c.save();
          c.font = `${o.weight || 750} ${size}px ${this.font}`;
          const w = c.measureText(String(str)).width;
          c.restore();
          const al = o.align || 'center', bl = o.baseline || 'alphabetic';
          const x0 = x + (al === 'center' ? -w / 2 : al === 'right' || al === 'end' ? -w : 0);
          const y0 = y + (bl === 'middle' ? -size / 2 : bl === 'top' || bl === 'hanging' ? 0 : bl === 'bottom' ? -size : -size * 0.8);
          boxes.push({ x0, x1: x0 + w, y0, y1: y0 + size, str: String(str) });
        }
        return drawText.call(this, x, y, str, o, screen);
      };
      const out = [];
      for (let i = 0; i < lab.list.length; i++) {
        lab.goScene(i);
        lab.render();
        await new Promise((r) => requestAnimationFrame(r)); // 무대 위 칩·도구 크기가 정해진 뒤의 배치로 검사
        boxes = [];
        lab.render();
        const c = b.canvas;
        const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let ink = 0;
        // 표본 수는 캔버스 넓이와 상관없이 일정하게 둡니다(무대 위 띠·아래 받침으로 그림이 작아져도 가는 선 그림이 '빈 그림'으로 잘못 걸리지 않게. 예전 1280×820 캔버스 기준 31칸 간격과 같은 밀도).
        const step = Math.min(31, Math.max(1, Math.round((c.width * c.height) / 20360)));
        for (let k = 3; k < d.length; k += 4 * step) if (d[k] > 30) ink++;
        const clipped = boxes.filter((q) => Math.max(-q.x0, q.x1 - b.W, -q.y0, q.y1 - b.H) > 2).map((q) => q.str.slice(0, 20));
        // 장면을 차례로 넘긴 뒤에도 화면의 조작부(막대·칩·버튼)가 장면 정의와 같은 개수로 보이는지(같은 조작부 장면이 이어질 때 사라지던 오류)
        const L = (f) => (typeof f === 'function' ? f(lab.s) : f) || [];
        const want = L(lab.scene.controls).filter((k) => lab.params[k]).length + L(lab.scene.presets).length + L(lab.scene.actions).length;
        // 넓은 화면에서는 조작부가 무대 위 띠·아래 받침으로 옮겨 가므로(refs.controls 밖) 화면 전체에서 찾습니다. 장면 칩(.apl-subscenes)·도구 막대는 이 선택자에 걸리지 않습니다.
        const have = [...document.querySelectorAll('.apl-ctl, .apl-presets .apl-chip, .apl-actions-row button')].filter((e) => e.checkVisibility()).length;
        out.push({ id: lab.scene.id, ink, clipped, ctl: have === want ? '' : `${have}/${want}`, guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() });
      }
      b._text = drawText;
      return out;
    });
    const blank = rows.filter((r) => r.ink < 200);
    const noGuide = rows.filter((r) => !r.guide);
    const clipped = rows.filter((r) => r.clipped.length);
    const noCtl = rows.filter((r) => r.ctl);
    const ok = !errors.length && !blank.length && !noGuide.length && !clipped.length && !noCtl.length;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${file} [${name}] 장면 ${rows.length}개` +
      (errors.length ? ` · 오류 ${errors.length}: ${errors[0].slice(0, 120)}` : '') +
      (blank.length ? ` · 빈 그림: ${blank.map((r) => r.id).join(', ')}` : '') +
      (noGuide.length ? ` · 안내 없음: ${noGuide.map((r) => r.id).join(', ')}` : '') +
      (clipped.length ? ` · 잘린 라벨: ${clipped.map((r) => `${r.id}(${r.clipped.join(', ')})`).join('; ')}` : '') +
      (noCtl.length ? ` · 조작부 누락: ${noCtl.map((r) => `${r.id}(${r.ctl})`).join(', ')}` : ''));
    await ctx.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
