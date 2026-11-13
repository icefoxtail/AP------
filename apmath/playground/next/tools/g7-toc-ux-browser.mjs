/** Real browser regression checks for the G7 contents-first learning route.
 *
 * This checks navigation, selection, playback ownership and native exploration.
 * It inventories the existing proofs without replaying all of them; unchanged
 * mathematical/playback evidence remains a separate prerequisite.
 *
 * Run from the repository root with the HTTP server running. Optional inputs:
 * G7_BASE_URL, CHROME_PATH, G7_TOC_EVIDENCE, G7_TOC_BASELINE (previous browser
 * report.json), and G7_TOC_SCENARIOS (comma-separated names, for failed reruns).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = (process.env.G7_BASE_URL || 'http://127.0.0.1:8765/apmath/playground/next/labs/').replace(/\/?$/, '/');
const out = path.resolve(process.env.G7_TOC_EVIDENCE || process.env.G7_EVIDENCE || '.tmp/g7-toc-ux-browser');
const requested = new Set((process.env.G7_TOC_SCENARIOS || '').split(',').filter(Boolean));
const catalogContext = { window: {} };
vm.runInNewContext(fs.readFileSync('apmath/playground/next/kit/apl-catalog.js', 'utf8'), catalogContext);
const labs = catalogContext.window.APLab.catalog.labs.filter(row => row.course === 'g7');
const viewports = [
  { width: 1440, height: 900 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 }
];
const phone = viewports[3];
const report = {
  kind: 'G7_CONTENTS_UX_HTTP_CHROMIUM',
  commit: process.env.GITHUB_SHA || null,
  scenarios: [], inventory: [], screenshots: [], errors: [],
  reusedAnimationEvidence: process.env.G7_REFERENCE_EVIDENCE || 'NOT_PROVIDED',
  pedagogicalApproval: 'NOT_ASSIGNED', studentObservation: 'NOT_RUN'
};
fs.mkdirSync(out, { recursive: true });
const save = () => fs.writeFileSync(path.join(out, 'toc-ux-report.json'), JSON.stringify(report, null, 2) + '\n');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
let currentPage;

async function open(viewport = phone, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => report.errors.push({ url: page.url(), message: error.message }));
  page.on('console', message => {
    if (message.type() === 'error') report.errors.push({ url: page.url(), message: message.text() });
  });
  currentPage = page;
  return { page, context };
}

async function ready(page, id) {
  await page.waitForFunction(id => window.lab?.learning && lab.id === id, id);
  await page.evaluate(() => document.fonts.ready);
}

async function load(page, id, suffix = '') {
  // A fresh document is intentional: same-document hash navigation is checked
  // through back/forward separately, and must not masquerade as a shared link.
  await page.goto('about:blank');
  await page.goto(base + id + '.html' + suffix);
  await ready(page, id);
}

async function state(page) {
  return page.evaluate(() => ({
    lab: lab.id, scene: lab.scene.id, gi: lab.scene.gi || 0,
    choice: lab.learning.selectedItem().choice,
    planChoice: lab.learning.choice,
    legacyLabel: (lab.learning.active || lab.learning.plans()[lab.learning.choice])?.legacyLabel || '',
    view: lab.learning.view,
    mode: lab.learning.mode, elapsed: lab.learning.elapsed,
    active: lab.learning.active?.id || null,
    nativePlayer: lab.video.state, tocOpen: lab.toc.isOpen,
    url: location.href
  }));
}

function sameItem(actual, expected, message) {
  assert.deepEqual(
    { scene: actual.scene, gi: actual.gi, choice: actual.choice },
    { scene: expected.scene, gi: expected.gi, choice: expected.choice }, message
  );
}

async function contents(page, message = 'contents entry') {
  await page.waitForFunction(() => lab.learning.view === 'contents' && lab.toc.isOpen);
  const value = await state(page);
  assert.equal(value.active, null, `${message}: no proof owns the contents screen`);
  assert.notEqual(value.mode, 'playing', `${message}: no short starts without a leaf selection`);
  assert.notEqual(value.nativePlayer, 'playing', `${message}: no legacy animation starts behind contents`);
  assert.equal(await page.locator('body').evaluate(el => el.classList.contains('apl-g7-contents')), true);
  assert.equal(await page.locator('.apl-toc').getAttribute('role'), 'navigation');
  assert.equal(await page.locator('.apl-toc').isVisible(), true);
  assert.equal(await page.locator('.g7-learning').isVisible(), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, `${message}: horizontal overflow`);
  return value;
}

async function selected(page, item, { playing = false } = {}) {
  await page.waitForFunction(({ scene, choice, playing }) =>
    lab.learning.view === 'lesson' && lab.scene.id === scene &&
    lab.learning.selectedItem().choice === choice && !!lab.learning.active &&
    (!playing || (lab.learning.mode === 'playing' && lab.learning.elapsed > .12)),
  { scene: item.scene, choice: item.choice, playing });
  const value = await state(page);
  sameItem(value, item, 'the requested leaf owns the learning screen');
  if (item.legacyLabel !== undefined) assert.equal(value.legacyLabel, item.legacyLabel, 'the played proof has the label of the actual clicked leaf');
  assert.equal(value.tocOpen, false);
  assert.equal(await page.locator('.g7-learning-location').isVisible(), true);
  assert.equal(await page.locator('.apl-toc-btn').isVisible(), true);
  if (page.viewportSize().width < 860) assert.equal(await page.locator('.g7-learning-toc').isVisible(), true);
  return value;
}

async function items(page) {
  return page.evaluate(() => lab.learning.items().map(row => ({
    ...row, scene: lab.list[row.i].id, gi: lab.list[row.i].gi || 0
  })));
}

const leaf = (page, item) => page.locator(`.apl-toc button[data-i="${item.i}"][data-choice="${item.choice}"]`);
const playButton = page => page.locator('.g7-learning-controls .primary');
const exploreButton = page => page.locator('.g7-learning-controls').getByRole('button', { name: '직접 해 보기', exact: true });

async function pause(page) {
  if ((await state(page)).mode === 'playing') await playButton(page).click();
  await page.waitForFunction(() => lab.learning.mode === 'paused' || lab.learning.mode === 'ended');
  return state(page);
}

async function setProgress(page, value) {
  // Dispatch the real range control's input event. This is a seek check, never
  // reported as a normal-clock playback measurement.
  await page.locator('.g7-learning-range').evaluate((input, value) => {
    input.value = String(value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
  return state(page);
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(out, name), fullPage: false });
  report.screenshots.push(name);
}

async function drawing(page) {
  const result = await page.evaluate(() => {
    lab.render();
    const canvas = lab.ui.canvas, rgba = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let ink = 0;
    for (let i = 3; i < rgba.length; i += 4) if (rgba[i] > 20) ink++;
    return { width: lab.board.W, height: lab.board.H, ink };
  });
  assert.ok(result.width >= 150 && result.height >= 150 && result.ink > 200, `the selected drawing is present: ${JSON.stringify(result)}`);
  return result;
}

async function reachable(locator, message, { inViewport = false } = {}) {
  assert.equal(await locator.isVisible(), true, `${message}: visible`);
  if (!inViewport) await locator.scrollIntoViewIfNeeded();
  const result = await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const hit = document.elementFromPoint(x, y);
    return {
      width: r.width, height: r.height,
      inside: x >= 0 && x < innerWidth && y >= 0 && y < innerHeight,
      covered: !(hit && (hit === el || el.contains(hit)))
    };
  });
  assert.ok(result.width >= 28 && result.height >= 28, `${message}: usable target ${JSON.stringify(result)}`);
  assert.ok(result.inside && !result.covered, `${message}: reachable without an overlay ${JSON.stringify(result)}`);
  return result;
}

async function run(name, fn) {
  if (requested.size && !requested.has(name)) return;
  report.currentScenario = name;
  save();
  const started = Date.now();
  const result = await fn();
  report.scenarios.push({ name, status: 'PASS', elapsedMs: Date.now() - started, ...result });
  save();
  console.log(`${name}: PASS`);
}

function compareBaseline() {
  if (!process.env.G7_TOC_BASELINE) {
    report.preservationBaseline = { status: 'NOT_PROVIDED', note: 'Current source-to-DOM completeness is checked; previous inventory comparison requires the exact prior report.' };
    return;
  }
  const filename = path.resolve(process.env.G7_TOC_BASELINE);
  const previous = JSON.parse(fs.readFileSync(filename, 'utf8'));
  assert.equal(previous.status, 'TECHNICAL_CHECKS_PASSED', 'Only a successful prior browser report is a reusable inventory baseline');
  const seen = new Set();
  let scenes = 0, proofs = 0;
  for (const row of previous.coverage || []) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    const current = report.inventory.find(item => item.id === row.id);
    assert.ok(current, `previous unit remains reachable: ${row.id}`);
    for (let i = 0; i < row.inventory.length; i++) {
      const old = row.inventory[i];
      const now = current.scenes.find(scene => scene.id === old.id && scene.gi === (old.gi || 0));
      assert.ok(now, `previous scene remains reachable: ${row.id}/${old.id}@${old.gi || 0}`);
      const count = row.checks[i].shorts;
      assert.ok(now.proofs.length >= count, `previous proofs remain reachable: ${row.id}/${old.id}`);
      scenes++; proofs += count;
    }
  }
  assert.ok(seen.size > 0, 'The supplied baseline contains scene inventory');
  report.preservationBaseline = { status: 'PASS', file: filename, commit: previous.commit, scenes, proofs };
}

try {
  await run('contents-inventory', async () => {
    const { page, context } = await open();
    try {
      for (const unit of labs) {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await load(page, unit.id);
        await contents(page, unit.id);
        // Longer than the retired 600 ms entry timer. Normal motion is enabled.
        await page.waitForTimeout(850);
        await contents(page, `${unit.id}, after the old autoplay deadline`);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const inventory = await page.evaluate(() => {
          const groups = [...lab.toc.ui.list.querySelectorAll('.apl-toc-group')].map(group => ({
            title: group.querySelector('.apl-toc-gh')?.textContent || '',
            scenes: [...group.querySelectorAll('.apl-toc-item[data-i]')].map(row => +row.dataset.i)
          }));
          const rows = [...lab.toc.ui.list.querySelectorAll('.apl-toc-item[data-i]')].map(row => ({
            i: +row.dataset.i,
            choices: [...(row.matches('button[data-choice]') ? [row] : row.querySelectorAll('button[data-choice]'))].map(button => ({
              choice: +button.dataset.choice, i: +button.dataset.i,
              disabled: button.disabled, name: button.getAttribute('aria-label') || button.textContent,
              visible: button.checkVisibility()
            }))
          }));
          const expectedGroups = lab.groups.map((group, gi) => ({
            title: APLab.stripEmoji(group.title || ''),
            scenes: lab.list.flatMap((scene, i) => (scene.gi || 0) === gi ? [i] : [])
          })).filter(group => group.scenes.length);
          const catalogItems = lab.learning.items().map(({ i, choice, legacyLabel }) => ({ i, choice, legacyLabel }));
          // Use existing scene initialization and the actual proof builders as
          // the independent source of selectable proofs. No seek/live playback
          // or full-scene visual audit is performed in this inventory loop.
          const scenes = lab.list.map((scene, i) => {
            lab.goScene(i, { autoplay: false });
            lab.learning.pause();
            return {
              i, id: scene.id, gi: scene.gi || 0, title: scene.title,
              native: lab.video.lessonInfo(i).map(row => row.label || ''),
              proofs: lab.learning.plans().map((plan, choice) => ({ choice, id: plan.id, label: plan.legacyLabel || '' }))
            };
          });
          return { id: lab.id, groups, expectedGroups, rows, catalogItems, scenes };
        });
        assert.deepEqual(inventory.groups.map(group => group.scenes), inventory.expectedGroups.map(group => group.scenes), `${unit.id}: existing classification is preserved`);
        if (inventory.expectedGroups.length > 1) inventory.expectedGroups.forEach((group, i) => {
          assert.ok(inventory.groups[i].title.includes(group.title), `${unit.id}: group title ${group.title} remains visible`);
        });
        assert.deepEqual(inventory.rows.map(row => row.i), inventory.scenes.map(scene => scene.i), `${unit.id}: one contents row per original scene`);
        const expectedChoices = [];
        for (const scene of inventory.scenes) {
          assert.ok(scene.proofs.length > 0, `${unit.id}/${scene.id}: visual proofs remain registered`);
          const labels = scene.proofs.map(proof => proof.label);
          for (const label of scene.native) {
            const index = labels.indexOf(label);
            assert.ok(index >= 0, `${unit.id}/${scene.id}: native lesson "${label}" remains selectable`);
            labels.splice(index, 1);
          }
          const row = inventory.rows.find(row => row.i === scene.i);
          const sceneItems = inventory.catalogItems.filter(item => item.i === scene.i);
          assert.deepEqual(sceneItems.map(item => item.legacyLabel).sort(), scene.proofs.map(proof => proof.label).sort(), `${unit.id}/${scene.id}: metadata binds all actual proof labels despite preset-dependent proof order`);
          assert.deepEqual(row.choices.map(choice => choice.choice), sceneItems.map(item => item.choice), `${unit.id}/${scene.id}: every actual proof has a contents leaf`);
          for (const choice of row.choices) {
            assert.equal(choice.i, scene.i);
            assert.ok(choice.visible && !choice.disabled && choice.name.trim(), `${unit.id}/${scene.id}: each leaf is visible, named and enabled`);
            const item = sceneItems.find(item => item.choice === choice.choice);
            if (row.choices.length > 1 && item.legacyLabel) assert.ok(choice.name.includes(item.legacyLabel), `${unit.id}/${scene.id}: leaf label matches its actual proof destination`);
            expectedChoices.push({ i: scene.i, choice: choice.choice, legacyLabel: item.legacyLabel });
          }
        }
        assert.deepEqual(inventory.catalogItems, expectedChoices, `${unit.id}: item navigation follows the same complete leaf order`);
        assert.equal(new Set(expectedChoices.map(row => `${row.i}:${row.choice}`)).size, expectedChoices.length, `${unit.id}: no duplicate leaf destinations`);
        report.inventory.push(inventory);
        save();
      }
      report.conversion = {
        units: report.inventory.length,
        scenes: report.inventory.reduce((n, row) => n + row.scenes.length, 0),
        native: report.inventory.reduce((n, row) => n + row.scenes.reduce((m, scene) => m + scene.native.length, 0), 0),
        shorts: report.inventory.reduce((n, row) => n + row.scenes.reduce((m, scene) => m + scene.proofs.length, 0), 0)
      };
      compareBaseline();
      return { conversion: report.conversion };
    } finally { await context.close(); }
  });

  await run('responsive-navigation', async () => {
    const journeys = [];
    for (const viewport of viewports) {
      const { page, context } = await open(viewport);
      try {
        if (viewport.width === phone.width) {
          await page.goto(new URL('../index.html?portal=1#g7', base).href);
          await page.getByRole('button', { name: '목록으로 보기', exact: true }).click();
          await page.locator('.hub-card h3 a[href*="g7-polyhedra.html"]').click();
          await ready(page, 'g7-polyhedra');
        } else await load(page, 'g7-polyhedra');
        await contents(page);
        await screenshot(page, `polyhedra-${viewport.width}-entry.png`);
        await page.evaluate(() => history.replaceState({ ...history.state, unrelatedNavigation: { marker: 'preserve-me' } }, ''));
        const ordered = await items(page);
        const at = Math.floor(ordered.length / 2);
        const first = ordered[at], next = ordered[at + 1];
        assert.ok(first && next, 'representative unit has adjacent learning items');
        await leaf(page, first).scrollIntoViewIfNeeded();
        const position = await page.evaluate(() => ({ window: scrollY, list: lab.toc.ui.list.scrollTop }));
        await screenshot(page, `polyhedra-${viewport.width}-contents.png`);
        await leaf(page, first).click();
        await selected(page, first, { playing: true });
        const lessonHistoryLength = await page.evaluate(() => history.length);
        await pause(page);
        const figure = await drawing(page);
        assert.equal(await page.evaluate(() => !!document.fullscreenElement), false, 'selecting a lesson does not force fullscreen');
        await setProgress(page, 350);
        const beforeStep = await state(page);
        await page.locator('.g7-learning-progress').getByRole('button', { name: '다음 단계', exact: true }).click();
        const afterStep = await state(page);
        sameItem(afterStep, beforeStep, 'next step stays in the selected learning item');
        assert.ok(afterStep.elapsed > beforeStep.elapsed, 'next step advances the current proof');
        await page.locator('.g7-learning-progress').getByRole('button', { name: '이전 단계', exact: true }).click();
        assert.ok((await state(page)).elapsed < afterStep.elapsed, 'previous step rewinds the current proof');
        await page.locator('.g7-learning-range').focus();
        await page.locator('.g7-learning-range').press('End');
        assert.equal((await state(page)).mode, 'ended', 'the progress slider remains keyboard-operable');
        await setProgress(page, 350);
        const paused = await state(page);
        await exploreButton(page).click();
        await page.waitForFunction(() => lab.learning.mode === 'explore' && !lab.learning.active);
        assert.equal((await state(page)).view, 'lesson');
        assert.equal(await page.locator('.apl-panel').isVisible(), true, 'native exploration remains available');
        await screenshot(page, `polyhedra-${viewport.width}-explore.png`);
        await playButton(page).click();
        await page.waitForFunction(() => lab.learning.mode === 'playing');
        const continued = await pause(page);
        sameItem(continued, paused, 'exploration returns to the same proof choice');
        assert.ok(continued.elapsed >= paused.elapsed - .03 && continued.elapsed < paused.elapsed + .6, 'unchanged exploration returns to the saved proof position');
        await page.locator('.g7-learning-controls').getByRole('button', { name: /다시 보기/ }).click();
        await page.waitForFunction(() => lab.learning.mode === 'playing');
        const replayed = await pause(page);
        sameItem(replayed, first, 'replay keeps the selected learning item');
        assert.ok(replayed.elapsed < 1, 'replay deliberately restarts from the beginning');
        assert.equal(await page.evaluate(() => history.length), lessonHistoryLength, 'playback, seeking and exploration do not add back-button steps');
        await setProgress(page, 350);
        const savedFirst = await state(page);
        await reachable(page.locator('.g7-learning-next-item'), 'next learning item');
        await screenshot(page, `polyhedra-${viewport.width}-lesson.png`);
        await playButton(page).click();
        await page.locator('.g7-learning-next-item').click();
        await selected(page, next, { playing: true });
        await pause(page);
        await setProgress(page, 250);
        const savedNext = await state(page);
        await page.goBack();
        await selected(page, first);
        const previous = await state(page);
        assert.equal(previous.mode, 'paused', 'browser back restores a paused proof');
        assert.ok(previous.elapsed >= savedFirst.elapsed - .03 && previous.elapsed < savedFirst.elapsed + .6, 'browser back restores the prior playback position');
        await page.goForward();
        await selected(page, next);
        const forward = await state(page);
        assert.equal(forward.mode, 'paused');
        assert.ok(Math.abs(forward.elapsed - savedNext.elapsed) < .03, 'forward restores the selected proof position');
        assert.equal(await page.evaluate(() => history.state.unrelatedNavigation?.marker), 'preserve-me', 'learning navigation preserves unrelated history state');
        await page.waitForTimeout(850);
        assert.equal((await state(page)).elapsed, forward.elapsed, 'cancelled playback cannot restart after back/forward');
        // At the bottom of a long phone lesson, contents/back must still be
        // available without dismissing an animation overlay.
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await reachable(page.locator('.apl-toc-btn'), 'persistent contents button', { inViewport: true });
        await reachable(page.locator('.apl-back'), 'persistent back button', { inViewport: true });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
        await page.locator('.apl-toc-btn').click();
        await contents(page, 'contents during a selected proof');
        await page.goBack();
        await selected(page, next);
        assert.equal((await state(page)).mode, 'paused');
        await page.locator('.apl-back').click();
        await selected(page, first);
        await page.locator('.apl-back').click();
        await contents(page, 'internal back matches browser history');
        await page.waitForFunction(position => Math.abs(scrollY - position.window) <= 3 &&
          Math.abs(lab.toc.ui.list.scrollTop - position.list) <= 3, position);
        const returnedPosition = await page.evaluate(() => ({ window: scrollY, list: lab.toc.ui.list.scrollTop }));
        assert.ok(Math.abs(returnedPosition.window - position.window) <= 3 && Math.abs(returnedPosition.list - position.list) <= 3,
          `contents reading position is restored: ${JSON.stringify({ position, returnedPosition })}`);
        await page.keyboard.press('Escape');
        await contents(page, 'Escape cannot expose an unselected first animation');
        await leaf(page, next).click();
        await selected(page, next, { playing: true });
        await page.locator('.g7-learning-prev-item').click();
        await selected(page, first, { playing: true });
        await pause(page);
        if (viewport.width === phone.width) {
          for (const boundary of [ordered[0], ordered.at(-1)]) {
            await page.locator('.apl-toc-btn').click();
            await contents(page);
            await leaf(page, boundary).click();
            await selected(page, boundary, { playing: true });
            const selector = boundary === ordered[0] ? '.g7-learning-prev-item' : '.g7-learning-next-item';
            assert.equal(await page.locator(selector).isDisabled(), true, 'item navigation stops at the contents boundary');
          }
        }
        journeys.push({ viewport, first, next, figure, previous, forward, position, returnedPosition });
      } finally { await context.close(); }
    }
    return { journeys };
  });

  await run('exploration-reload-sharing', async () => {
    const { page, context } = await open();
    let shareURL, checkpoint, parameter;
    try {
      await load(page, 'g7-circle-sector');
      const ordered = await items(page);
      const area = ordered.find(row => row.scene === 'f1-star' && row.choice === 0);
      const perimeter = ordered.find(row => row.scene === 'f1-star' && row.choice === 1);
      assert.ok(area && perimeter, 'the independent area and perimeter proofs exist');
      await leaf(page, area).click();
      await selected(page, area, { playing: true });
      await pause(page);
      await setProgress(page, 400);
      await exploreButton(page).click();
      await page.waitForFunction(() => lab.learning.mode === 'explore');
      const slider = await page.evaluate(() => ({
        name: lab._ctls.f1_star_a.input.getAttribute('aria-label'), value: lab.s.f1_star_a
      }));
      const input = page.getByRole('slider', { name: slider.name, exact: true });
      await input.press('End');
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      parameter = await page.evaluate(() => lab.s.f1_star_a);
      assert.notEqual(parameter, slider.value, 'the original exploration slider changes its native value');
      const nativeState = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([key]) => !['lessonOn', 'lessonEntry', 'playing'].includes(key)))));
      await playButton(page).click();
      await selected(page, area, { playing: true });
      const fresh = await pause(page);
      assert.ok(fresh.elapsed < 1, 'changed exploration conditions start a newly bound proof from the beginning');
      assert.equal(await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(lab.s).filter(([key]) => !['lessonOn', 'lessonEntry', 'playing'].includes(key))))), nativeState, 'the proof does not mutate the live exploration state');
      await setProgress(page, 400);
      checkpoint = await state(page);
      await exploreButton(page).click();
      assert.equal(await page.evaluate(() => lab.s.f1_star_a), parameter, 'direct exploration restores the edited condition');
      await playButton(page).click();
      const resumed = await pause(page);
      assert.ok(resumed.elapsed >= checkpoint.elapsed - .03 && resumed.elapsed < checkpoint.elapsed + .6, 'returning without edits preserves proof progress');
      await setProgress(page, 400);
      checkpoint = await state(page);
      await page.locator('.g7-learning-next-item').click();
      await selected(page, perimeter, { playing: true });
      assert.equal((await state(page)).active, 'star-perimeter', 'next item selects the other proof, not its next step');
      await page.goBack();
      await selected(page, area);
      assert.equal((await state(page)).active, 'star-area');
      assert.equal(await page.evaluate(() => lab.s.f1_star_a), parameter);
      assert.ok(Math.abs((await state(page)).elapsed - checkpoint.elapsed) < .03);
      shareURL = page.url();
      await page.reload();
      await ready(page, 'g7-circle-sector');
      await selected(page, area);
      const reloaded = await state(page);
      assert.equal(reloaded.mode, 'paused');
      assert.ok(Math.abs(reloaded.elapsed - checkpoint.elapsed) < .03, 'reload restores playback progress');
      assert.equal(await page.evaluate(() => lab.s.f1_star_a), parameter, 'reload restores the same exploration instance');
      await page.waitForTimeout(850);
      assert.equal((await state(page)).elapsed, reloaded.elapsed, 'reload cannot silently autoplay');
      await screenshot(page, 'circle-390-reloaded-paused-instance.png');
      await load(page, 'g7-circle-sector');
      await contents(page, 'a unit link stays contents-first even after a saved lesson');
      await page.waitForTimeout(850);
      await contents(page, 'saved progress does not autoplay on a unit link');
    } finally { await context.close(); }
    const fresh = await open();
    try {
      await fresh.page.goto(shareURL);
      await ready(fresh.page, 'g7-circle-sector');
      const shared = await state(fresh.page);
      sameItem(shared, checkpoint, 'a new browser session resolves the shared selected proof');
      assert.equal(shared.view, 'lesson');
      assert.equal(shared.mode, 'paused');
      assert.equal(shared.active, checkpoint.active);
      assert.ok(Math.abs(shared.elapsed - checkpoint.elapsed) < .03, 'the shared progress is read from the URL, without session storage');
      assert.equal(await fresh.page.evaluate(() => lab.s.f1_star_a), parameter);
      return { checkpoint, shared, parameter, shareURL };
    } finally { await fresh.context.close(); }
  });

  await run('live-history-restoration', async () => {
    const { page, context } = await open();
    try {
      await load(page, 'g7-circle-sector');
      const item = (await items(page)).find(item => item.scene === 'f1-star' && item.choice === 0);
      await leaf(page, item).click();
      await selected(page, item, { playing: true });
      await page.waitForFunction(() => lab.learning.mode === 'playing' && lab.learning.elapsed >= 1.2);
      const playing = await state(page);
      // Deliberately do not pause, seek or call store before leaving. The
      // browser's prior entry snapshot may still say t=0 at this point.
      await page.goBack();
      await contents(page, 'back directly from a live animation');
      await page.goForward();
      await selected(page, item);
      const restored = await state(page);
      assert.equal(restored.mode, 'paused');
      assert.ok(Math.abs(restored.elapsed - playing.elapsed) < .3, 'forward uses the latest live progress, not the entry-time snapshot');
      await page.waitForTimeout(850);
      assert.equal((await state(page)).elapsed, restored.elapsed, 'restored live progress stays paused');
      await exploreButton(page).click();
      await page.waitForFunction(() => lab.learning.mode === 'explore');
      const originalCamera = await page.evaluate(() => ({ zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY }));
      await page.getByRole('button', { name: '확대', exact: true }).click();
      const camera = await page.evaluate(() => ({ zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY }));
      assert.notEqual(camera.zoom, originalCamera.zoom, 'the existing exploration zoom control changes the camera');
      // Leave immediately, including any pending view/scroll persistence work.
      await page.goBack();
      await contents(page, 'back directly after changing the exploration camera');
      await page.goForward();
      await page.waitForFunction(scene => lab.learning.view === 'lesson' && lab.scene.id === scene && lab.learning.mode === 'explore', item.scene);
      const restoredCamera = await page.evaluate(() => ({ zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY }));
      assert.deepEqual(restoredCamera, camera, 'forward restores the most recent native exploration camera');
      sameItem(await state(page), item);
      return { playing, restored, originalCamera, camera, restoredCamera };
    } finally { await context.close(); }
  });

  await run('direct-links-and-reduced-motion', async () => {
    const { page, context } = await open();
    const links = [];
    try {
      for (const suffix of ['#s=f1-star', '#s=f1-star&play=1']) {
        await load(page, 'g7-circle-sector', suffix);
        assert.equal((await state(page)).scene, 'f1-star');
        assert.equal((await state(page)).view, 'lesson');
        await page.waitForTimeout(850);
        const value = await state(page);
        assert.notEqual(value.mode, 'playing', `${suffix}: direct links do not silently start playback`);
        assert.notEqual(value.nativePlayer, 'playing', `${suffix}: the legacy player does not win the startup race`);
        links.push(value);
      }
      for (const suffix of ['#s=missing-g7-scene', '#s=f1-star&short=missing-g7-proof']) {
        await load(page, 'g7-circle-sector', suffix);
        await contents(page, `${suffix}: an invalid selection returns to the unit contents`);
        links.push(await state(page));
      }
      await load(page, 'g7-polyhedra', '#n=2');
      await contents(page, 'old group link opens its contents');
      await page.waitForFunction(() => {
        const heading = lab.toc.ui.list.querySelectorAll('.apl-toc-gh')[1].getBoundingClientRect();
        const header = document.querySelector('.apl-bar').getBoundingClientRect();
        return heading.top >= header.bottom && heading.bottom <= innerHeight;
      });
      const groupLink = await page.evaluate(() => {
        const group = lab.toc.ui.list.querySelectorAll('.apl-toc-group')[1];
        const heading = group.querySelector('.apl-toc-gh'), rect = heading.getBoundingClientRect();
        const header = document.querySelector('.apl-bar').getBoundingClientRect();
        return { title: heading.textContent, top: rect.top, bottom: rect.bottom, headerBottom: header.bottom,
          visible: rect.top >= header.bottom && rect.bottom <= innerHeight };
      });
      assert.ok(groupLink.visible, 'the linked group heading is fully visible below the fixed header without starting its first proof');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const all = await items(page), item = all.find(row => row.i > 0);
      const sceneTitle = page.locator('.apl-toc-item.multi .apl-toc-title').first();
      assert.match(await sceneTitle.getAttribute('aria-label'), /직접\s*해\s*보기/, 'the scene title names its direct exploration action');
      await sceneTitle.click();
      await page.waitForFunction(() => lab.learning.view === 'lesson' && lab.learning.mode === 'explore' && !lab.learning.active);
      await page.locator('.apl-toc-btn').click();
      await contents(page);
      await leaf(page, item).focus();
      await page.keyboard.press('Enter');
      await selected(page, item);
      const selectedReduced = await state(page);
      assert.equal(selectedReduced.mode, 'paused');
      assert.equal(selectedReduced.elapsed, 0);
      await page.waitForTimeout(850);
      assert.equal((await state(page)).elapsed, 0, 'reduced motion preserves a student-controlled start');
      await page.locator('.g7-learning-progress').getByRole('button', { name: '다음 단계', exact: true }).click();
      const stepped = await state(page);
      sameItem(stepped, item);
      assert.ok(stepped.elapsed > 0, 'the selected proof remains usable under reduced motion');
      return { links, groupLink, selectedReduced, stepped };
    } finally { await context.close(); }
  });

  await run('polyhedra-direct-manipulation', async () => {
    const { page, context } = await open(phone);
    const read = () => page.evaluate(() => ({ yaw: lab.s.phYaw, plane: lab.s.phTd, tiltA: lab.s.phTa, tiltB: lab.s.phTb }));
    try {
      await load(page, 'g7-polyhedra');
      await contents(page);
      const item = (await items(page)).find(item => item.scene === 'p4-1' && item.choice === 0);
      assert.ok(item, 'the cube-section learning item remains in contents');
      await leaf(page, item).click();
      await selected(page, item, { playing: true });
      await exploreButton(page).click();
      await page.waitForFunction(() => lab.learning.mode === 'explore' && !lab.learning.active);
      const before = await read();
      await page.getByRole('slider', { name: '좌우로 돌려 보기', exact: true }).press('ArrowRight');
      const rotated = await read();
      assert.notEqual(rotated.yaw, before.yaw, 'the original rotation slider changes the 3D view');
      await page.locator('canvas.apl-canvas').scrollIntoViewIfNeeded();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const handle = await page.evaluate(() => {
        const h = lab.board.handles.find(handle => handle.id === 'plane');
        if (!h) return null;
        const rect = lab.ui.canvas.getBoundingClientRect();
        const x = rect.left + h.x * rect.width / lab.board.W, y = rect.top + h.y * rect.height / lab.board.H;
        return { x, y, dx: rect.right - x > 60 ? 48 : -48 };
      });
      assert.ok(handle, 'the real cube-section drag handle is present after entering exploration');
      await page.mouse.move(handle.x, handle.y);
      await page.mouse.down();
      try {
        assert.equal(await page.evaluate(() => lab.board.dragging?.id), 'plane', 'the actual pointer acquires the plane handle');
        await page.mouse.move(handle.x + handle.dx, handle.y, { steps: 8 });
      } finally { await page.mouse.up(); }
      const edited = await read();
      assert.notEqual(edited.plane, before.plane, 'the real drag changes the section position');
      assert.equal(edited.yaw, rotated.yaw, 'moving the section preserves the chosen 3D rotation');
      await screenshot(page, 'polyhedra-p4-1-390-edited-exploration.png');
      await playButton(page).click();
      await selected(page, item, { playing: true });
      await pause(page);
      await exploreButton(page).click();
      await page.waitForFunction(() => lab.learning.mode === 'explore' && !lab.learning.active);
      const restored = await read();
      assert.deepEqual(restored, edited, 'short playback restores the edited rotation and section conditions exactly');
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await page.evaluate(() => lab.board.handles.some(handle => handle.id === 'plane')), true, 'the original drag handle returns after the proof');
      await page.locator('canvas.apl-canvas').scrollIntoViewIfNeeded();
      await screenshot(page, 'polyhedra-p4-1-390-restored-exploration.png');
      return { viewport: phone, item, before, rotated, edited, restored, pointer: 'mouse' };
    } finally { await context.close(); }
  });

  await run('coordinate-reading', async () => {
    const checks = [];
    report.coordinateChecks = checks;
    save();
    const targets = [
      { scene: 'coord-order', points: { P: { x: 3, y: 2 } } },
      { scene: 'read-coordinates', points: { P: { x: 4, y: 3 } } },
      { scene: 'quadrants-boundary', points: { P: { x: -3, y: 2 } } },
      // B is already the dotted path endpoint at t=0; its moving point label appears later.
      { scene: 'point-move', points: { A: { x: -2, y: 1 }, B: { x: 2, y: -2 } } },
      // The default axis-pair mode displays A/B; its alternate-mode Q is not drawn.
      { scene: 'axis-pair', points: { A: { x: 6, y: 0 }, B: { x: 0, y: -4 } } },
      { scene: 'axis-distance', points: { P: { x: 5, y: 4 } } },
      // This authored proof begins with papers/pins, then first shows axes at 5.8s.
      { scene: 'quantity-table', points: { P: { x: 3, y: 4 } }, firstCoordinateAt: 5.8 },
      // The default triangle uses Q as its displayed vertex C; C/D belong to the alternate trapezoid.
      { scene: 'coordinate-area', points: { A: { x: -1, y: 4 }, B: { x: -1, y: -1 }, Q: { x: 3, y: 0 } } }
    ];
    const coordinateViewports = [...viewports, { width: 320, height: 844 }];
    for (const viewport of coordinateViewports) {
      // These are static coordinate-frame checks, not additional live-playback audits.
      const { page, context } = await open(viewport, 'reduce');
      try {
        await load(page, 'g7-coordinate-graphs');
        const ordered = await items(page);
        for (const { scene, points: expectedPoints, firstCoordinateAt = 0 } of targets) {
          if ((await state(page)).view !== 'contents') await page.locator('.apl-toc-btn').click();
          await contents(page);
          const item = ordered.find(item => item.scene === scene);
          assert.ok(item, `${scene}: the coordinate-reading lesson is reachable from contents`);
          await leaf(page, item).click();
          const entry = await selected(page, item);
          assert.equal(entry.mode, 'paused', `${scene}: coordinate inspection does not replay the proof`);
          assert.equal(entry.elapsed, 0, `${scene}: explicit selection exposes the initial frame`);
          if (firstCoordinateAt) {
            // The real range has 1000 integer steps. Round up: 659/1000 of 8.8s
            // is 5.7992s and would still be the non-coordinate paper diagram.
            const value = await page.evaluate(time => Math.ceil(time / lab.learning.active.duration * 1000), firstCoordinateAt);
            await setProgress(page, value);
          }
          const proofPosition = (await state(page)).elapsed;
          for (const mode of ['proof', 'explore']) {
            if (mode === 'explore') await exploreButton(page).click();
            const actual = await page.evaluate(pointNames => {
              const board = lab.board, ctx = lab.ui.canvas.getContext('2d');
              const original = ctx.fillText, labels = [];
              const canvas = lab.ui.canvas, rect = canvas.getBoundingClientRect();
              const cssX = rect.width / canvas.width, cssY = rect.height / canvas.height;
              const boardState = () => {
                const spec = lab.scene._mf, values = APL_MF.values(spec, lab.s);
                const model = lab.learning.active ? lab.learning.active.model.m : spec.model(values);
                const points = Object.fromEntries(pointNames.map(name => {
                  const point = model[name] || null;
                  return [name, { model: point, pixel: point && board.toS(point) }];
                }));
                return structuredClone({ points, zoom: board.zoom, width: board.W, height: board.H, boardKind: board.kind,
                  focus: board.focus, insets: board.insets, pad: board.pad, font: board.font, fontScale: board.fs });
              };
              let drawState = null;
              // Observe the canvas commands that survive the actual axis
              // clipping logic. Keep the real draw call and rendering intact.
              ctx.fillText = function (text, x, y, ...rest) {
                const value = String(text), measured = this.measureText(value);
                if (!drawState && /^−?\d+(?:\.\d+)?$/.test(value) &&
                  ((this.textAlign === 'center' && this.textBaseline === 'top') ||
                   (this.textAlign === 'right' && this.textBaseline === 'middle'))) drawState = boardState();
                const metrics = Object.fromEntries(['width', 'actualBoundingBoxLeft', 'actualBoundingBoxRight', 'actualBoundingBoxAscent', 'actualBoundingBoxDescent']
                  .map(key => [key, measured[key]]));
                let bounds = null;
                if (Object.values(metrics).every(Number.isFinite)) {
                  // TextMetrics bearings already reflect the current textAlign
                  // and baseline. Transform the actual glyph corners into the
                  // displayed canvas's CSS pixels, including device scaling.
                  const scale = Number.isFinite(rest[0]) && rest[0] > 0 && rest[0] < measured.width ? rest[0] / measured.width : 1;
                  const xs = [x - measured.actualBoundingBoxLeft * scale, x + measured.actualBoundingBoxRight * scale];
                  const ys = [y - measured.actualBoundingBoxAscent, y + measured.actualBoundingBoxDescent];
                  const transform = this.getTransform();
                  const corners = xs.flatMap(px => ys.map(py => ({
                    x: (transform.a * px + transform.c * py + transform.e) * cssX,
                    y: (transform.b * px + transform.d * py + transform.f) * cssY
                  })));
                  bounds = { left: Math.min(...corners.map(point => point.x)), right: Math.max(...corners.map(point => point.x)),
                    top: Math.min(...corners.map(point => point.y)), bottom: Math.max(...corners.map(point => point.y)) };
                }
                labels.push({ text: value, x, y, align: this.textAlign, baseline: this.textBaseline, font: this.font, metrics, bounds });
                return original.call(this, text, x, y, ...rest);
              };
              try { lab.render(); } finally { ctx.fillText = original; }
              // _renderStage updates board insets after the picture is drawn.
              // Assert the positions used by the axis draw, keeping the later
              // shell state separately so evidence cannot mix the two frames.
              const postRenderState = boardState();
              const numericLabels = (align, baseline) => labels.filter(label => label.align === align && label.baseline === baseline && /^−?\d+(?:\.\d+)?$/.test(label.text));
              const tickGlyphs = { x: numericLabels('center', 'top'), y: numericLabels('right', 'middle') };
              const numbers = rows => rows.map(label => Number(label.text.replace('−', '-'))).sort((a, b) => a - b);
              const originGlyphs = labels.filter(label => label.text === 'O' && label.align === 'right' && label.baseline === 'top');
              return { ...(drawState || postRenderState), boardStatePhase: drawState ? 'axis-draw' : 'after-render', postRenderState,
                elapsed: lab.learning.elapsed, learningMode: lab.learning.mode,
                rangeStepSeconds: (lab.learning.active?.duration || 0) / 1000,
                xTicks: numbers(tickGlyphs.x), yTicks: numbers(tickGlyphs.y), tickGlyphs, originGlyphs };
            }, Object.keys(expectedPoints));
            const threshold = mode === 'proof' ? firstCoordinateAt : 0;
            const phase = threshold ? 'first-coordinate-frame' : 'initial';
            report.coordinateCurrent = { viewport, scene, mode, phase, threshold, ...actual };
            await page.locator('.apl-canvas-wrap').scrollIntoViewIfNeeded();
            await screenshot(page, `coordinates-${scene}-${viewport.width}-${mode}.png`);
            save();
            const tickSpacing = {};
            let figure, failure = null;
            try {
              assert.equal(actual.learningMode, mode === 'proof' ? 'paused' : 'explore', `${scene}/${mode}: static inspection remains student-controlled`);
              assert.equal(actual.boardKind, 'cartesian', `${scene}/${mode}: the measured frame actually shows the coordinate plane`);
              if (mode === 'proof') {
                assert.ok(actual.elapsed >= threshold && actual.elapsed <= threshold + actual.rangeStepSeconds + 1e-9,
                  `${scene}/${mode}: render the first available coordinate frame at or above ${threshold}s, got ${actual.elapsed}s`);
              } else assert.equal(actual.elapsed, proofPosition, `${scene}: exploration preserves the saved proof position`);
              assert.equal(actual.zoom, 1, `${scene}/${mode}: no zoom is required`);
              for (const ticks of [actual.xTicks, actual.yTicks]) {
                assert.ok(ticks.length >= 5 && ticks.every(Number.isInteger), `${scene}/${mode}: integer coordinate labels are visible`);
                for (let i = 1; i < ticks.length; i++) {
                  assert.equal(ticks[i] - ticks[i - 1], ticks[i - 1] === -1 && ticks[i] === 1 ? 2 : 1, `${scene}/${mode}: consecutive unit ticks (origin is O)`);
                }
              }
              for (const [axis, glyphs] of Object.entries(actual.tickGlyphs)) {
                for (const glyph of glyphs) {
                  assert.ok(glyph.bounds && Object.values(glyph.bounds).every(Number.isFinite) &&
                    glyph.bounds.right > glyph.bounds.left && glyph.bounds.bottom > glyph.bounds.top,
                  `${scene}/${mode}/${viewport.width}: actual glyph metrics are available for ${axis} tick ${glyph.text}`);
                }
                const start = axis === 'x' ? 'left' : 'top', end = axis === 'x' ? 'right' : 'bottom';
                const orderedGlyphs = [...glyphs].sort((a, b) => a.bounds[start] - b.bounds[start]);
                tickSpacing[axis] = orderedGlyphs.slice(1).map((glyph, i) => ({
                  from: orderedGlyphs[i].text, to: glyph.text,
                  gapCssPixels: glyph.bounds[start] - orderedGlyphs[i].bounds[end]
                }));
                for (const pair of tickSpacing[axis]) assert.ok(pair.gapCssPixels >= 0,
                  `${scene}/${mode}/${viewport.width}: actual ${axis} tick glyphs overlap (${pair.from}, ${pair.to}), gap ${pair.gapCssPixels.toFixed(3)} CSS px`);
              }
              for (const [name, expected] of Object.entries(expectedPoints)) {
                const point = actual.points[name];
                assert.deepEqual(point.model, expected, `${scene}/${mode}: the existing default model point ${name} is preserved`);
                for (const axis of ['x', 'y']) {
                  const ticks = actual[`${axis}Ticks`];
                  assert.ok(ticks.includes(expected[axis]) || (expected[axis] === 0 && actual.originGlyphs.length > 0),
                    `${scene}/${mode}: ${name}'s ${axis}=${expected[axis]} is labelled on the axis (O represents zero)`);
                }
                assert.ok(point.pixel.x > 0 && point.pixel.x < actual.width && point.pixel.y > 0 && point.pixel.y < actual.height,
                  `${scene}/${mode}: ${name} is inside the actual drawing area`);
              }
              figure = await drawing(page);
            } catch (error) {
              // Collect a measured case's assertion failure, not a failed
              // navigation, renderer or browser operation. The latter aborts.
              if (!(error instanceof assert.AssertionError)) throw error;
              failure = { message: error.message, operator: error.operator, actual: error.actual, expected: error.expected };
            }
            checks.push({ viewport, scene, mode, phase, status: failure ? 'FAIL' : 'PASS', failure,
              coordinateThresholdSeconds: threshold, ...actual, tickSpacing, figure });
            if (!failure) report.coordinateCurrent = null;
            save();
          }
        }
      } finally { await context.close(); }
    }
    assert.equal(checks.length, targets.length * coordinateViewports.length * 2, 'all selected coordinate scenes, viewports and modes are observed');
    const failures = checks.filter(check => check.status === 'FAIL');
    assert.equal(failures.length, 0, `${failures.length}/${checks.length} coordinate states failed; full case evidence is in coordinateChecks`);
    delete report.coordinateChecks;
    return { checks, staticStates: checks.length, normalPlayback: 'NOT_REPLAYED' };
  });

  await run('delayed-module-entry', async () => {
    const { page, context } = await open();
    let release;
    const held = new Promise(resolve => { release = resolve; });
    try {
      await page.route('**/apl-g7-learning.js*', async route => { await held; await route.continue(); });
      await page.goto(base + 'g7-coordinate-graphs.html', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.lab?.video);
      await page.waitForTimeout(850);
      const pending = await page.evaluate(() => ({
        installed: !!lab.learning,
        pending: document.body.classList.contains('apl-g7-loading'),
        native: lab.video.state,
        nativeEntry: !!lab.video.ui?.entry?.checkVisibility()
      }));
      assert.equal(pending.installed, false, 'the learning module is genuinely held back');
      assert.equal(pending.pending, true, 'contents-first intent is established before async installation');
      assert.notEqual(pending.native, 'playing', 'slow module loading cannot start a native first animation');
      assert.equal(pending.nativeEntry, false, 'the temporary native first-scene entry is not exposed');
      release();
      await ready(page, 'g7-coordinate-graphs');
      await contents(page, 'late installation ends at the unit contents');
      return { pending, installed: await state(page) };
    } finally { release(); await context.close(); }
  });

  await run('scope-boundaries', async () => {
    const { page, context } = await open();
    const results = [];
    try {
      for (const query of ['?manual=1', '?teach=1', '?mode=exam', '?mode=assessment', '?mode=test', '?assessment=1']) {
        await page.goto(base + 'g7-circle-sector.html' + query + '#s=f1-star');
        await page.waitForFunction(() => window.lab?.video);
        await page.waitForTimeout(350);
        const value = await page.evaluate(() => ({ learning: !!lab.learning, contents: document.body.classList.contains('apl-g7-contents'), pending: document.body.classList.contains('apl-g7-loading') }));
        assert.deepEqual(value, { learning: false, contents: false, pending: false }, `${query}: the G7 learning route does not take over other modes`);
        results.push({ query, ...value });
      }
      await page.goto(base + 'g8-linear-functions.html');
      await page.waitForFunction(() => window.lab?.video);
      await page.waitForTimeout(350);
      assert.equal(await page.evaluate(() => !!lab.learning || document.body.classList.contains('apl-g7-contents')), false, 'other grades retain their existing route');
      return { results, otherGrade: 'g8-linear-functions' };
    } finally { await context.close(); }
  });

  assert.ok(report.scenarios.length, 'At least one named scenario was selected');
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  report.status = 'UX_TECHNICAL_CHECKS_PASSED';
  delete report.currentScenario;
} catch (error) {
  report.status = 'FAIL';
  report.failure = error.stack;
  process.exitCode = 1;
  if (currentPage && !currentPage.isClosed()) {
    try { await screenshot(currentPage, 'failure.png'); } catch (_) { /* Preserve the original failure. */ }
  }
  console.error(error);
} finally {
  save();
  await browser.close();
}
console.log(JSON.stringify({ status: report.status, scenarios: report.scenarios.length, conversion: report.conversion, errors: report.errors.length, out }));
