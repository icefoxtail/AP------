// Minimum release check for the NEW middle-function content, using the unchanged
// native player at its normal speed. One real uninterrupted playback per scene.
// This is deliberately separate from the long repeated-pause/replay precision
// audit. No assertion below represents full human visual or original-source QA.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const args = process.argv.slice(2), arg = (key, fallback) => { const i = args.indexOf(key); return i < 0 ? fallback : args[i + 1]; };
const base = arg('--base', 'http://127.0.0.1:8765/apmath/playground/next/labs/').replace(/\/?$/, '/');
const ids = arg('--only', 'g7-coordinate-graphs,g7-proportion,g8-linear-functions,g9-quadratic-functions').split(',');
const out = path.resolve(arg('--out', '.tmp/middle-functions-browser'));
fs.mkdirSync(out, { recursive: true });
const report = { version: 1, source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  startedAt: new Date().toISOString(), scope: 'ALL_NEW_SCENES_NATIVE_ONE_CLICK_SINGLE_PASS',
  humanVisualPrecision: 'NOT_RUN', repeatedPauseReplayAudit: 'NOT_RUN', rows: [] };
const save = () => fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let failures = 0;
try {
  for (const id of ids) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const page = await context.newPage(), runtimeErrors = [];
    page.on('pageerror', e => runtimeErrors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') runtimeErrors.push(msg.text()); });
    await page.goto(`${base}${id}.html?theme=paper`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.lab?.video && window.lab.list.length);
    const scenes = await page.evaluate(() => lab.list.map((s, i) => ({ id: s.id, i, title: s.title, tier: s.group.id })));
    for (const scene of scenes) {
      const row = { lab: id, scene: scene.id, title: scene.title, tier: scene.tier, status: 'RUNNING', checks: [], screenshots: [] };
      report.rows.push(row); save();
      const check = (name, pass, evidence) => { row.checks.push({ name, status: pass ? 'PASS' : 'FAIL', evidence }); if (!pass) throw Error(name + ': ' + JSON.stringify(evidence)); };
      const shot = async name => {
        const file = `${id}--${scene.id}--${name}.png`;
        await page.screenshot({ path: path.join(out, file), fullPage: false }); row.screenshots.push(file);
      };
      try {
        // Each scene starts as a fresh student entry. Exploration preference is
        // session-wide in the native player; reset it before the next case.
        await page.evaluate(i => { lab.video.close(); lab.video._setExplored(false); lab.goScene(i); lab.render(); window.scrollTo(0, 0); }, scene.i);
        await page.locator('.apl-lgo:visible').waitFor();
        const initial = await page.evaluate(() => {
          const b = lab.board, r = lab.ui.canvas.getBoundingClientRect(), q = document.querySelector('.apl-question');
          const button = document.querySelector('.apl-lgo'), br = button.getBoundingClientRect();
          const image = b.ctx.getImageData(0, 0, lab.ui.canvas.width, lab.ui.canvas.height).data;
          let ink = 0; for (let i = 3; i < image.length; i += 16) if (image[i] > 30) ink++;
          return { state: lab.video.state, step: lab.s.step, revealed: lab.s.revealed,
            canvas: { width: r.width, height: r.height, top: r.top, bottom: r.bottom }, ink,
            question: q?.textContent.trim(), button: { left: br.left, right: br.right, top: br.top, bottom: br.bottom, height: br.height },
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            lessons: lab.video.entries(lab.index).length,
            parameterKeys: typeof lab.scene.controls === 'function' ? lab.scene.controls(lab.s) : lab.scene.controls };
        });
        check('idle entry with one native lesson and concealed answer', initial.state === 'idle' && !initial.revealed && initial.step === 0 && initial.lessons === 1, initial);
        check('initial graph occupies a usable mobile canvas', initial.ink > 200 && initial.canvas.width >= 300 && initial.canvas.height >= 200, initial.canvas);
        check('primary play button is on screen', initial.button.left >= 0 && initial.button.right <= 391 && initial.button.top >= 0 && initial.button.bottom <= 845 && initial.button.height >= 30, initial.button);
        check('question present and no horizontal overflow', !!initial.question && !initial.overflow, { question: initial.question, overflow: initial.overflow });
        await shot('entry');

        // One actual student click, then wait for the native clock. No seeks,
        // speed changes, synthetic end states or extra next-step clicks.
        await page.locator('.apl-lgo:visible').click();
        await page.waitForFunction(() => lab.video.state === 'playing' && lab.video.t > .3, null, { timeout: 8000 });
        const duration = await page.evaluate(() => lab.video.cs.length);
        await page.waitForFunction(() => lab.video.t > Math.min(11, lab.video.cs.length / 2) || lab.video.state === 'ended', null, { timeout: 18000 });
        const middle = await page.evaluate(() => ({ state: lab.video.state, time: lab.video.t, step: lab.s.step,
          caption: document.querySelector('.apl-vcap')?.textContent.trim(), answerShown: lab.scene.view(lab.s, lab).summary }));
        check('native playback advances with a caption', middle.time > 0 && !!middle.caption, middle);
        await shot('progress');
        await page.waitForFunction(() => lab.video.state === 'ended', null, { timeout: Math.ceil(duration * 1000) + 8000 });
        const end = await page.evaluate(() => {
          const answer = document.querySelector('.apl-vans'), r = answer.getBoundingClientRect();
          const sc = lab.scene, spec = sc._mf, values = APL_MF.values(spec, lab.s), model = spec.model(values);
          return { state: lab.video.state, time: lab.video.t, step: lab.s.step,
            answer: answer.textContent.trim(), answerVisible: answer.checkVisibility(),
            answerBox: { top: r.top, bottom: r.bottom, left: r.left, right: r.right },
            errors: spec.verify ? spec.verify(values, model) : [],
            finalSummary: sc.view(lab.s, lab).summary,
            maxStep: sc.steps(lab.s).length };
        });
        check('one click reaches native ended state', end.state === 'ended', end);
        check('last step and mathematical invariants hold', end.step === end.maxStep && !end.errors.length && !!end.finalSummary, end);
        check('native final answer is visible', end.answerVisible && !!end.answer && end.answerBox.top >= 0 && end.answerBox.bottom <= 845, end.answerBox);
        await shot('ended');

        await page.locator('.apl-vend [aria-label="직접 해 보기"]').click();
        await page.waitForFunction(() => lab.video.state === 'idle' && !document.body.classList.contains('apl-lessonfirst'));
        const range = page.locator('.apl-ctl input[type="range"]:visible').first();
        if (await range.count()) {
          const before = await range.inputValue();
          await range.press('End'); if (await range.inputValue() === before) await range.press('Home');
          const after = await range.inputValue();
          check('visible exploration slider responds', before !== after, { before, after });
          check('changing values conceals the solution again', await page.evaluate(() => lab.s.step === 0 && !lab.s.revealed && lab.scene.view(lab.s, lab).summary === null), {});
        }
        await page.getByRole('button', { name: '처음 값으로', exact: true }).click();
        const reset = await page.evaluate(() => {
          const spec = lab.scene._mf, got = APL_MF.values(spec, lab.s), expected = APL_MF.defaults(spec);
          return { matches: Object.keys(expected).every(k => got[k] === expected[k]), step: lab.s.step, zoom: lab.board.zoom };
        });
        check('reset returns both the values and view', reset.matches && reset.step === 0 && reset.zoom === 1, reset);
        check('no runtime errors', runtimeErrors.length === 0, runtimeErrors);
        row.status = 'PASS'; console.log(`PASS ${id}:${scene.id} native ${duration}s`);
      } catch (error) {
        row.status = 'FAIL'; row.error = error.message; failures++; console.error(`FAIL ${id}:${scene.id} ${error.message}`);
        await shot('failure').catch(() => {});
      }
      save();
    }
    await context.close();
  }
} catch (error) {
  failures++;
  report.fatalError = error.stack || error.message;
  console.error(report.fatalError);
} finally {
  report.finishedAt = new Date().toISOString(); report.status = failures ? 'FAIL' : 'PASS'; save(); await browser.close();
}
if (failures) process.exitCode = 1;
