// 안티 렌더 공통: 저장소의 production render-plan.mjs를 직접 부른다(.tmp/work/render.mjs 래퍼 없이).
// 래퍼가 하던 일 중 필요한 것만 여기서 한다: 측정 제한 시간, Windows Chrome 경로, 동시에 렌더 하나만.
// PYTHONPATH는 production/worker.mjs가 스스로 정한다.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '../../../../..');
export const RENDER_PLAN = path.join(REPO, 'archive/tools/geometry-equation/production/render-plan.mjs');

export function renderEnv() {
  const env = {...process.env};
  if (!env.GEOMETRY_WORKER_TIMEOUT_MS) env.GEOMETRY_WORKER_TIMEOUT_MS = '30000';
  const winChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (!env.GEOMETRY_BROWSER_EXECUTABLE && fs.existsSync(winChrome)) env.GEOMETRY_BROWSER_EXECUTABLE = winChrome;
  return env;
}

// 한 번에 렌더 하나만: 디렉터리 하나가 자물쇠다(20분 넘은 것은 죽은 것으로 보고 치운다).
export function withRenderLock(fn) {
  const lock = path.join(REPO, '.tmp', 'antigravity-render.lock');
  fs.mkdirSync(path.dirname(lock), {recursive: true});
  const pause = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  for (;;) {
    try { fs.mkdirSync(lock); break; } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 20 * 60e3) fs.rmSync(lock, {recursive: true, force: true}); } catch { /* 다시 시도 */ }
      pause(3000);
    }
  }
  try { return fn(); } finally { fs.rmSync(lock, {recursive: true, force: true}); }
}
