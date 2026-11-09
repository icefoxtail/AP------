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
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { deriveSparseFigureContract, evaluateSmokeSemanticCalibration, captureSmokeCalibrationFrame } from './scene-smoke-semantic-calibration.mjs';
import { sampleInitialFigure } from './middle-initial-figure-contracts.mjs';
import { adjudicateSmokeMeasurement } from './scene-smoke-measurement-gate.mjs';

// The high-school profile uses the same scene renderer, with the four contract
// viewports, both themes and explicit step/variant interactions. Legacy CLI
// behavior below remains unchanged.
if (process.argv.includes('--high-school')) {
  await import('./high-lab-browser-audit.mjs');
  process.exit(process.exitCode || 0);
}

// playwright는 전역 설치(NODE_PATH)인 경우가 많아 require로 불러옵니다.
const { chromium } = createRequire(import.meta.url)('playwright');
const argv = process.argv.slice(2);
const optVal = (k) => { const i = argv.indexOf(k); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, v === undefined ? 1 : 2); return v ?? ''; };
const onlyArg = optVal('--only');
const runsArg = optVal('--runs');
const reportArg = optVal('--report');
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

let browser, activeContext, activePage, activeRun, runIndex = 0, failed = 0;
const collectFinalFrame = new Function(`return function collectFinalFrame() {
  ${deriveSparseFigureContract.toString()}
  ${evaluateSmokeSemanticCalibration.toString()}
  ${captureSmokeCalibrationFrame.toString()}
  ${sampleInitialFigure.toString()}
  ${adjudicateSmokeMeasurement.toString()}
  const frame = captureSmokeCalibrationFrame();
  const previousDraws = window.__initialFigureDraws; let initial;
  try { window.__initialFigureDraws = frame.draws; initial = sampleInitialFigure(); }
  finally { if (previousDraws === undefined) delete window.__initialFigureDraws; else window.__initialFigureDraws = previousDraws; }
  const semantic = evaluateSmokeSemanticCalibration(frame, initial), measurement = adjudicateSmokeMeasurement(frame, semantic);
  return { id: lab.scene.id, ink: frame.legacy.ink, clipped: frame.legacy.clipped, samplingStep: frame.legacy.samplingStep,
    legacy: semantic.legacy, measurement, semantic: { status: semantic.status, analyticContract: semantic.contract?.key,
      applicable: semantic.contract?.applicable, failures: semantic.failures, unknown: semantic.unknown,
      checks: semantic.checks.map(({probes, ...check}) => check), initial },
    annotationObservation: { invocations: frame.annotations.length, glyphs: frame.glyphs.length, fractionBars: frame.fractionBars.length,
      complete: frame.annotationCaptureComplete && frame.glyphCaptureComplete && frame.fractionBarCaptureComplete } };
}`)();
const report = { version: 1, startedAt: new Date().toISOString(), source: null, alphaThreshold: 30, minimumInk: 200,
  clippingToleranceCssPx: 2, studentVisualQuality: 'NOT_ASSERTED', runs: [], sourceFiles: [] };
report.runs = pages.flatMap(file => RUNS.map(({ name, theme, ...device }) => ({ file, environment: name, theme, device,
  status: 'NOT_RUN', originalLegacyStatus: 'NOT_RUN', errors: [], rows: [] })));
try { report.source = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
for (const file of ['scene-smoke.mjs', 'scene-smoke-semantic-calibration.mjs', 'scene-smoke-measurement-gate.mjs', 'middle-initial-figure-contracts.mjs'])
  report.sourceFiles.push({ file, sha256: createHash('sha256').update(fs.readFileSync(new URL(file, import.meta.url))).digest('hex') });
try {
browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
for (const file of pages) {
  for (const run of RUNS) {
    const { name, theme, ...device } = run;
    activeRun = report.runs[runIndex++]; activeRun.status = 'RUNNING'; activeRun.stage = 'new-context';
    const ctx = activeContext = await browser.newContext(device);
    const page = activePage = await ctx.newPage();
    const errors = activeRun.errors;
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    activeRun.stage = 'navigation';
    await page.goto(`${base}${file}?theme=${theme}`, { waitUntil: 'networkidle' });
    activeRun.stage = 'wait-for-shell';
    await page.waitForFunction(() => window.lab && window.lab.board);
    activeRun.stage = 'scene-rendering';
    const rows = await page.evaluate(async ({ collector }) => {
      const collect = new Function('return (' + collector + ')')();
      const out = [];
      const progress = window.__sceneSmokeProgress = { rows: out, sceneIds: lab.list.map(scene => scene.id), activeId: null };
      for (let i = 0; i < lab.list.length; i++) {
        progress.activeId = lab.list[i].id;
        lab.goScene(i);
        lab.render();
        await new Promise((r) => requestAnimationFrame(r)); // 무대 위 칩·도구 크기가 정해진 뒤의 배치로 검사
        // Observe this same final render, including actual emitted glyphs. The
        // old sampled ink, raw TeX boxes and 200/30/2px thresholds are retained.
        const observed = collect();
        // 장면을 차례로 넘긴 뒤에도 화면의 조작부(막대·칩·버튼)가 장면 정의와 같은 개수로 보이는지(같은 조작부 장면이 이어질 때 사라지던 오류)
        const L = (f) => (typeof f === 'function' ? f(lab.s) : f) || [];
        const want = L(lab.scene.controls).filter((k) => lab.params[k]).length + L(lab.scene.presets).length + L(lab.scene.actions).length;
        // 넓은 화면에서는 조작부가 무대 위 띠·아래 받침으로 옮겨 가므로(refs.controls 밖) 화면 전체에서 찾습니다. 장면 칩(.apl-subscenes)·도구 막대는 이 선택자에 걸리지 않습니다.
        const have = [...document.querySelectorAll('.apl-ctl, .apl-presets .apl-chip, .apl-actions-row button')].filter((e) => e.checkVisibility()).length;
        out.push({ ...observed, ctl: have === want ? '' : `${have}/${want}`, guide: !!document.querySelector('.apl-guide .apl-rich')?.textContent.trim() });
      }
      progress.activeId = null;
      return out;
    }, { collector: collectFinalFrame.toString() });
    const blank = rows.filter((r) => r.ink < 200);
    const noGuide = rows.filter((r) => !r.guide);
    const clipped = rows.filter((r) => r.clipped.length);
    const noCtl = rows.filter((r) => r.ctl);
    const measurementFailed = rows.filter(r => r.measurement.status !== 'PASS');
    const ok = !errors.length && !measurementFailed.length && !noGuide.length && !noCtl.length;
    if (!ok) failed++;
    Object.assign(activeRun, { status: ok ? 'PASS' : 'FAIL', rows, stage: 'complete',
      originalLegacyStatus: errors.length || blank.length || noGuide.length || clipped.length || noCtl.length ? 'FAIL' : 'PASS' });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${file} [${name}] 장면 ${rows.length}개` +
      (errors.length ? ` · 오류 ${errors.length}: ${errors[0].slice(0, 120)}` : '') +
      (blank.length ? ` · 기존 저잉크 관측(<200): ${blank.map((r) => r.id).join(', ')}` : '') +
      (noGuide.length ? ` · 안내 없음: ${noGuide.map((r) => r.id).join(', ')}` : '') +
      (clipped.length ? ` · 기존 raw 라벨 경계: ${clipped.map((r) => `${r.id}(${r.clipped.join(', ')})`).join('; ')}` : '') +
      (measurementFailed.length ? ` · 표시 계약 실패: ${measurementFailed.map(r => `${r.id}(${r.measurement.failures.join(',')})`).join('; ')}` : '') +
      (noCtl.length ? ` · 조작부 누락: ${noCtl.map((r) => `${r.id}(${r.ctl})`).join(', ')}` : ''));
    for (const row of rows.filter(r => r.measurement.corrections.length)) console.log(JSON.stringify({ type: 'MEASUREMENT_CORRECTION',
      file, environment: name, id: row.id, originalLegacyStatus: row.legacy.status, finalStatus: row.measurement.status, corrections: row.measurement.corrections }));
    await ctx.close();
    activeContext = activePage = null;
  }
}
} catch (error) {
  failed++;
  report.abort = { name: error.name || 'Error', message: error.message || String(error),
    file: activeRun?.file || null, environment: activeRun?.environment || null, stage: activeRun?.stage || 'launch' };
  if (activeRun) {
    activeRun.status = 'FAIL'; activeRun.originalLegacyStatus = 'UNKNOWN'; activeRun.abort = report.abort;
    activeRun.remainingSceneCoverage = 'UNKNOWN';
    try {
      const progress = await activePage?.evaluate(() => window.__sceneSmokeProgress || null);
      if (progress) {
        activeRun.rows = progress.rows; activeRun.failedSceneId = progress.activeId;
        const completed = new Set(progress.rows.map(row => row.id));
        activeRun.notRunSceneIds = progress.sceneIds.filter(id => !completed.has(id) && id !== progress.activeId);
        activeRun.remainingSceneCoverage = 'RECORDED';
      }
    } catch { /* A crashed page cannot provide partial rows; keep UNKNOWN. */ }
  }
  console.error(`FAIL scene smoke aborted: ${JSON.stringify(report.abort)}`);
} finally {
  for (const [resource, value] of [['context', activeContext], ['browser', browser]]) {
    try { await value?.close(); }
    catch (error) { failed++; (report.cleanupErrors ||= []).push({ resource, message: error.message || String(error) }); }
  }
  report.finishedAt = new Date().toISOString(); report.status = failed ? 'FAIL' : 'PASS';
  if (reportArg) { fs.mkdirSync(path.dirname(path.resolve(reportArg)), { recursive: true }); fs.writeFileSync(reportArg, JSON.stringify(report, null, 2) + '\n'); }
}
process.exit(failed ? 1 : 0);
