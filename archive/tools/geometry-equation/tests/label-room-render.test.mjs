// label-room (R1-2), the figures it rescues: each example plan below failed for lack of room at the Archive font (the failure is asserted first), composes with the room step of its kind, and when no step
// is allowed the best place is drawn with the shortfall recorded (BEST_EFFORT, never bound). Chrome + python observers: run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPlan} from '../production/render-plan.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {degradeCollector} from '../production/label-room.mjs';
import * as sdg from '../production/set-diagram-v1.mjs';
import * as scf from '../production/stat-chart-v1.mjs';

const plan = name => JSON.parse(fs.readFileSync(new URL(`./label-room-plans/${name}.json`, import.meta.url), 'utf8'));
const policy = {baseFontPx: 21, displayScale: 1, fontFloorCssPx: 11};
const identity = assetIdentity('label-room-example|1', 'SOLUTION_VISUAL', 'decisive-relation');
const attr = (svg, name) => svg.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const statCompose = async (p, browser, extra = {}, font = policy.baseFontPx) => {   // font: the one the Archive measured for that figure
  const model = scf.solveStatChart(p.chart), typographyPolicy = {...policy, baseFontPx: font};
  const size = scf.statChartSize(model, {fontPx: font, ...extra});
  return scf.composeStatChartFigure({plan: p, model, identity, typographyPolicy, browser, minSize: size, ...extra});
};
const setCompose = async (p, browser, extra = {}) => sdg.composeSetDiagramFigure({plan: p, model: sdg.solveDiagram(p.diagram), identity, typographyPolicy: policy, browser, ...extra});

test('a stacked-fraction z row (z=-2/3) that ran out of the frame: refused as written, composes with MARGIN (rows follow the real label heights)', {timeout: 600000}, async () => {
  const browser = await launchBrowser();
  try {
    const p = plan('stat-normal-z-fraction');
    const as = await statCompose(p, browser);
    assert.equal(as.status, 'STAT_LABEL_OUT_OF_BOUNDS', JSON.stringify(as.detail));
    const margin = await statCompose(p, browser, {room: 'MARGIN'});
    assert.equal(margin.status, 'COMPOSED', JSON.stringify(margin.detail));
    assert.equal(margin.staticAudit.status, 'PASS');
    assert.equal(margin.renderedLayout.status, 'PASS');
    assert.ok(Number(attr(margin.svg, 'height')) > scf.statChartSize(scf.solveStatChart(p.chart), {fontPx: 21}).height, 'the frame grew downward');
  } finally { await browser.close(); }
});

test('an x tick row of fractions over the z row (x-tick-0-label touches z-tick-0-label): MARGIN separates them', {timeout: 600000}, async () => {
  const browser = await launchBrowser();
  try {
    const p = plan('stat-normal-x-z-rows');
    const as = await statCompose(p, browser);
    assert.equal(as.status, 'STAT_LABELS_TOO_CLOSE', JSON.stringify(as.detail));
    const margin = await statCompose(p, browser, {room: 'MARGIN'});
    assert.equal(margin.status, 'COMPOSED', JSON.stringify(margin.detail));
  } finally { await browser.close(); }
});

test('end to end through the kind table: the tree binds without any rescue, and the set name on a circle line is rescued and recorded in fallback', {timeout: 900000}, async () => {
  const run = async (file, exam, ordinal, name) => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'label-room-'));
    const result = await renderPlan({item: {sourcePath: exam, ordinal, dir: name}, plan: fileURLToPath(new URL(`./label-room-plans/${file}.json`, import.meta.url)), outDir: out});
    return {result, out};
  };
  const tree = await run('stat-tree-branch-fraction', 'archive/exams/original/high/h2/1final/22_효천고_1학기_기말_고2_확률과통계.js', 22, 'tree');
  assert.equal(tree.result.status, 'ARCHIVE_BOUND', JSON.stringify(tree.result).slice(0, 500));
  // since main released the font floor (#2742) this tree fits as written (before: ROOM_MARGIN at pad 12); it stays as the example of a figure the ladder must not disturb
  assert.equal(tree.result.fallback, undefined);
  const set = await run('set-name-collision', 'archive/exams/original/high/h2/1final/20_제일고_1학기_기말_고2_확률과통계.js', 7, 'set');
  assert.equal(set.result.status, 'ARCHIVE_BOUND', JSON.stringify(set.result).slice(0, 500));
  assert.deepEqual(set.result.fallback.map(f => f.to), ['ROOM_LEADER']);
});

test('a Venn set name that stands on another circle\'s line (LABEL_GEOMETRY_COLLISION on the shade): LEADER keeps it clear of every circle line', {timeout: 600000}, async () => {
  const browser = await launchBrowser();
  try {
    const p = plan('set-name-collision');
    const as = await setCompose(p, browser);
    assert.equal(as.status, 'SET_DIAGRAM_RENDERED_LAYOUT_FAIL', JSON.stringify(as.detail));
    assert.ok(as.detail.errors.some(code => /^LABEL_GEOMETRY_COLLISION:set-name-/.test(code)));
    const led = await setCompose(p, browser, {room: 'LEADER'});
    assert.equal(led.status, 'COMPOSED', JSON.stringify(led.detail));
    assert.equal(led.staticAudit.status, 'PASS');
    assert.equal(led.renderedLayout.status, 'PASS');
  } finally { await browser.close(); }
});

test('best place: a figure the steps do not rescue is still drawn, never bound, with the shortfall as numbers', {timeout: 600000}, async () => {
  const browser = await launchBrowser();
  try {
    // the stacked-fraction figure at the frame as written: the label leaves the safe margin; the best place draws it where it is and says by how much
    const degrade = degradeCollector();
    const best = await statCompose(plan('stat-normal-z-fraction'), browser, {degrade});
    assert.equal(best.status, 'BEST_EFFORT');
    assert.ok(best.svg.startsWith('<svg'), 'the drawn figure is returned');
    const oob = degrade.items.find(item => item.code === 'STAT_LABEL_OUT_OF_BOUNDS');
    assert.ok(oob, JSON.stringify(degrade.items));
    assert.ok(oob.overflowPx > 0 && oob.labelHeightPx > 0 && typeof oob.cutOff === 'boolean');
    // the set name collision at its first place: the rendered check's codes come with the figure, not as a refusal
    const degradeSet = degradeCollector();
    const bestSet = await setCompose(plan('set-name-collision'), browser, {degrade: degradeSet});
    assert.equal(bestSet.status, 'BEST_EFFORT');
    assert.ok(bestSet.svg.includes('set-name-A'));
    assert.ok(degradeSet.items.some(item => item.code === 'OBSERVER_ERRORS' && item.errors.some(code => /LABEL_GEOMETRY_COLLISION/.test(code))), JSON.stringify(degradeSet.items));
  } finally { await browser.close(); }
});

// ---- the plane construction figure (R2): the ladder of render-plan after every older fallback, end to end (Chrome + python observers) ----------------------------------------------------
// Each plan below failed with LAYOUT_INVENTORY_INCOMPLETE as DeepSeek wrote it (a label without a place); the render rescues it, records the step in row.fallback, and the observers still pass (ARCHIVE_BOUND).
test('construction: a region value that does not fit inside its region goes out on a leader; a dimension line moves out for a label between it and the figure; the frame grows when nothing else helps', {timeout: 1800000}, async () => {
  const run = async (file, name) => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'label-room-'));
    const result = await renderPlan({item: {sourcePath: 'archive/exams/original/high/h2/1final/22_효천고_1학기_기말_고2_확률과통계.js', ordinal: 22, dir: name}, plan: fileURLToPath(new URL(`./label-room-plans/${file}.json`, import.meta.url)), outDir: out});
    return result;
  };
  const roomStep = result => (result.fallback ?? []).find(f => /^ROOM_/.test(f.to));
  const region = await run('construction-region-leader', 'region');
  assert.equal(region.status, 'ARCHIVE_BOUND', JSON.stringify(region).slice(0, 600));
  assert.equal(roomStep(region)?.to, 'ROOM_LEADER');
  assert.match(roomStep(region).from, /rABC-label/, 'the label that had no place is recorded');
  assert.deepEqual(roomStep(region).target.labels, ['rABC']);
  const dim = await run('construction-dimension-offset', 'dim');
  assert.equal(dim.status, 'ARCHIVE_BOUND', JSON.stringify(dim).slice(0, 600));
  assert.equal(roomStep(dim)?.to, 'ROOM_MARGIN');
  assert.ok(roomStep(dim).target.dimensionOffsetPx >= 40);
  const pad = await run('construction-frame-pad', 'pad');
  assert.equal(pad.status, 'ARCHIVE_BOUND', JSON.stringify(pad).slice(0, 600));
  assert.equal(roomStep(pad)?.to, 'ROOM_MARGIN');
  assert.ok(roomStep(pad).target.pad > 0 || roomStep(pad).target.dimensionOffsetPx > 0);
});

test('construction: a plan that carries roomPad is not refused: the first try ignores it (recorded), and a rescued figure rendered again from its bound plan comes out as the same SVG', {timeout: 1800000}, async () => {
  const item = name => ({sourcePath: 'archive/exams/original/high/h2/1final/22_효천고_1학기_기말_고2_확률과통계.js', ordinal: 22, dir: name});
  const render = async (p, name) => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'label-room-'));
    const result = await renderPlan({item: item(name), plan: p, outDir: out});
    return {result, out, svg: fs.existsSync(path.join(out, name + '-solution.svg')) ? fs.readFileSync(path.join(out, name + '-solution.svg'), 'utf8') : null, state: fs.existsSync(path.join(out, name + '-state.json')) ? JSON.parse(fs.readFileSync(path.join(out, name + '-state.json'), 'utf8')) : null};
  };
  // a plan that fits as written ignores an author's roomPad: same SVG as without it, and the row says so
  const fits = plan('stat-tree-branch-fraction');   // not a construction plan: no roomPad meaning, nothing to ignore
  assert.equal(fits.roomPad, undefined);
  for (const file of ['construction-frame-pad', 'construction-region-leader', 'construction-dimension-offset']) {
    const first = await render(plan(file), file);
    assert.equal(first.result.status, 'ARCHIVE_BOUND', file);
    assert.equal(first.result.ignoredAuthoredFields, undefined);
    // the bound plan is rendered again (a republish, a render after an engine change, a golden entry): never refused, the same figure
    const again = await render(first.state.plan, file);
    assert.equal(again.result.status, 'ARCHIVE_BOUND', file + ' ' + JSON.stringify(again.result).slice(0, 400));
    assert.equal(again.svg, first.svg, file + ': the same SVG');
    if (first.state.plan.roomPad !== undefined) assert.deepEqual(again.result.ignoredAuthoredFields, ['roomPad'], file);
  }
  // an author's roomPad on a plan the ladder rescues without a pad is dropped from the first try as well
  const withPad = await render({...plan('construction-region-leader'), roomPad: 0.24}, 'with-pad');
  assert.equal(withPad.result.status, 'ARCHIVE_BOUND');
  assert.deepEqual(withPad.result.ignoredAuthoredFields, ['roomPad']);
  assert.equal(withPad.svg, (await render(plan('construction-region-leader'), 'with-pad')).svg, 'same figure as the plan without roomPad');
});
