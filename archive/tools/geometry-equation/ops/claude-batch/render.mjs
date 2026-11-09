// usage: node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir>
// Serializes official renders: lock held only while render-plan runs; stale locks (>20 min) are cleared.
// 저장소 루트는 이 파일 위치(<repo>/.tmp/work/render.mjs) 기준으로 찾는다. 브라우저는 GEOMETRY_BROWSER_EXECUTABLE 환경변수, 없으면 Windows 기본 Chrome(있을 때), 없으면 엔진 기본(channel chrome).
import fs from 'node:fs'; import path from 'node:path'; import {spawnSync} from 'node:child_process'; import {fileURLToPath} from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(HERE, '..', '..');
if (!fs.existsSync(path.join(W, 'archive/tools/geometry-equation/production/render-plan.mjs'))) {
  console.error(`ERROR: ${W} 에서 render-plan.mjs를 찾지 못했다. 이 파일은 <저장소>/.tmp/work/ 에 있어야 한다(restore.sh).`); process.exit(2);
}
const L = path.join(HERE, 'render.lock');
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (;;) {
  try { fs.mkdirSync(L); fs.writeFileSync(path.join(L, 'owner'), String(process.pid)); break; }
  catch (e) {
    if (e.code !== 'EEXIST') throw e;
    try { if (Date.now() - fs.statSync(L).mtimeMs > 20 * 60e3) { fs.rmSync(L, {recursive: true, force: true}); continue; } } catch {}
    await sleep(5000);
  }
}
let code = 1;
try {
  const env = {...process.env, PYTHONPATH: path.join(W, '.tmp/apmath-visual-engine/dependencies/python')};
  const winChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (!env.GEOMETRY_BROWSER_EXECUTABLE && fs.existsSync(winChrome)) env.GEOMETRY_BROWSER_EXECUTABLE = winChrome;
  const r = spawnSync(process.execPath, [path.join(W, 'archive/tools/geometry-equation/production/render-plan.mjs'), ...process.argv.slice(2)], {cwd: W, env, stdio: 'inherit'});
  code = r.status ?? 1;
} finally { fs.rmSync(L, {recursive: true, force: true}); }
process.exit(code);
