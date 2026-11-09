// usage: node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir>
// Limits concurrent official renders to RENDER_SLOTS (default 2): a slot lock is held only while render-plan runs; stale locks (>20 min) are cleared.
// 저장소 루트는 이 파일 위치(<repo>/.tmp/work/render.mjs) 기준으로 찾는다. 브라우저는 GEOMETRY_BROWSER_EXECUTABLE 환경변수, 없으면 Windows 기본 Chrome(있을 때), 없으면 엔진 기본(channel chrome).
import fs from 'node:fs'; import path from 'node:path'; import {spawnSync} from 'node:child_process'; import {fileURLToPath} from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(HERE, '..', '..');
if (!fs.existsSync(path.join(W, 'archive/tools/geometry-equation/production/render-plan.mjs'))) {
  console.error(`ERROR: ${W} 에서 render-plan.mjs를 찾지 못했다. 이 파일은 <저장소>/.tmp/work/ 에 있어야 한다(restore.sh).`); process.exit(2);
}
// 동시 렌더 슬롯 수: RENDER_SLOTS(기본 2, 1~8). 슬롯마다 render.lock.<n> 디렉터리 하나.
const SLOTS = Math.min(8, Math.max(1, Number.parseInt(process.env.RENDER_SLOTS || '2', 10) || 2));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let L = null;
for (;;) {
  // RENDER_PRIORITY=1(Sonnet 최종 등 게시 직전 단계)은 전용 우선 슬롯 render.lock.p를 먼저 쓴다.
  const names = (process.env.RENDER_PRIORITY ? ['p'] : []).concat(Array.from({length: SLOTS}, (_, i) => String(i)));
  for (const n of names) {
    if (L) break;
    const cand = path.join(HERE, 'render.lock.' + n);
    try { fs.mkdirSync(cand); fs.writeFileSync(path.join(cand, 'owner'), String(process.pid)); L = cand; }
    catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - fs.statSync(cand).mtimeMs > 20 * 60e3) fs.rmSync(cand, {recursive: true, force: true}); } catch {}
    }
  }
  if (L) break;
  await sleep(5000);
}
let code = 1;
try {
  const env = {...process.env, PYTHONPATH: path.join(W, '.tmp/apmath-visual-engine/dependencies/python')};
  // 부하가 높을 때 그래프 틀 단계가 기본 10초에 걸리지 않게(엔진 #1543의 환경변수, 상한 600000)
  if (!env.GEOMETRY_WORKER_TIMEOUT_MS) env.GEOMETRY_WORKER_TIMEOUT_MS = '30000';
  const winChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (!env.GEOMETRY_BROWSER_EXECUTABLE && fs.existsSync(winChrome)) env.GEOMETRY_BROWSER_EXECUTABLE = winChrome;
  const r = spawnSync(process.execPath, [path.join(W, 'archive/tools/geometry-equation/production/render-plan.mjs'), ...process.argv.slice(2)], {cwd: W, env, stdio: 'inherit'});
  code = r.status ?? 1;
} finally { fs.rmSync(L, {recursive: true, force: true}); }
process.exit(code);
