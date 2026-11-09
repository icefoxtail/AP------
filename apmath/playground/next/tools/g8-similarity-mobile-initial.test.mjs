/** Production Board coordinates for the two mobile problem-size regressions.
 * Actual Chromium screenshots remain the authority for visual readability.
 * node --test tools/g8-similarity-mobile-initial.test.mjs
 * node tools/g8-similarity-mobile-initial.test.mjs --baseline <before SHA>
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const unit = 'apmath/playground/next/labs/g8-similarity';
const baselineIndex = process.argv.indexOf('--baseline');
const baseline = baselineIndex < 0 ? null : process.argv[baselineIndex + 1];
const context = { window: {}, console, document: { documentElement: { dataset: {} }, getElementById: () => true, addEventListener() {} } };
vm.createContext(context);
for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 'solutions']) {
  const file = `${unit}/${name}.js`;
  const code = baseline && ['t4', 't8'].includes(name)
    ? execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding: 'utf8' })
    : fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInContext(code, context, { filename: file });
}
context.window.APLab = { clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n)) };
vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), context);
const G = context.window.APL_SM;
const scenes = context.window.APL_SM_GROUPS.flatMap((group) => group.scenes);
const sceneOf = (id) => scenes.find((scene) => scene.id === id);
const fresh = (id) => { const s = {}; sceneOf(id).enter(s); return s; };

function draw(id, s, width, height, tab = 'problem') {
  // Use the real Board's focus, scale, point transform and label scale. The
  // observed mobile shell reserves 58 pixels for the floating tools.
  const b = Object.create(context.window.APLab.Board.prototype);
  Object.assign(b, { W: width, H: height, pad: .02, kind: 'figure', aspect: '1:1',
    insets: { left: 0, right: 0, top: 0, bottom: 58 }, zoom: 1, panX: 0, panY: 0,
    fs: 1, thumb: false, panes: null, paneId: null, focus: { x: [-5, 5], y: [-4, 4] } });
  const paths = [], texts = [], arcs = [];
  b.path = (points, options = {}) => { paths.push({ points: points.map((p) => b.toS(p)), options }); return b; };
  b.arc = (at, radius, start, end, options = {}) => { arcs.push({ at: b.toS(at), radius: radius * b.k, start, end, options }); return b; };
  for (const name of ['point', 'right', 'ticks', 'handle', 'leader']) b[name] = () => b;
  b.text = (p, str, options = {}) => {
    const at = b.toS(p), size = (options.size || 16) * b.fs * b._ts();
    const metric = G.labelMetrics(str, size), x = at.x + (options.dx || 0), y = at.y + (options.dy || 0);
    texts.push({ text: String(str), x0: x - metric.width / 2, x1: x + metric.width / 2, y0: y - metric.height / 2, y1: y + metric.height / 2 });
    return b;
  };
  const scene = sceneOf(id);
  scene.draw(b, s, {}, { tab, s, scene });
  return { b, paths, texts, arcs };
}
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
function inside(result, width, height, why) {
  for (const path of result.paths) for (const p of path.points) {
    assert.ok(p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height - 58, `${why}: clipped path ${JSON.stringify(p)}`);
  }
  for (const text of result.texts) {
    assert.ok(text.x0 >= 0 && text.x1 <= width && text.y0 >= 0 && text.y1 <= height - 58, `${why}: clipped text ${JSON.stringify(text)}`);
  }
}

for (const [width, height] of [[390, 309], [360, 291]]) {
  test(`sm4-x ${width}px initial problem keeps the smaller triangle and angle marks readable`, (t) => {
    const s = fresh('sm4-x'), initial = draw('sm4-x', s, width, height), p = s.smPk, g = G.geo.xGeo(p.m, p.n, p.r);
    const shortBase = Math.min(G.dist(g.A, g.D), G.dist(g.B, g.C)) * initial.b.k;
    assert.ok(shortBase >= 36, `small triangle base ${shortBase}px is too short for point names and angle marks`);
    t.diagnostic(`sm4-x: small triangle base ${shortBase.toFixed(2)}px on ${width}×${height} with 58px bottom inset`);
    for (const [v, a, z] of [[g.A, g.D, g.O], [g.D, g.A, g.O], [g.B, g.C, g.O], [g.C, g.B, g.O]]) {
      const at = initial.b.toS(v), available = Math.min(G.dist(v, a), G.dist(v, z)) * initial.b.k;
      for (const arc of initial.arcs.filter((a) => G.dist(a.at, at) < 1e-8)) assert.ok(arc.radius <= available * .42, 'angle marker cannot cover most of a short side');
    }
    inside(initial, width, height, 'initial X');
    assert.ok(initial.texts.some((t) => t.text === 'x'));
    assert.equal(s.revealed, false);
    assert.equal(s.playing, false);
  });
  test(`sm8-proof ${width}px initial problem gives the centroid and both medians enough space`, (t) => {
    const s = fresh('sm8-proof'), initial = draw('sm8-proof', s, width, height), p = s.smPk, g = G.geo.cpGeo(p.t, p.s, p.th);
    const box = G.bboxOf([g.A, g.B, g.C]);
    const shownHeight = (box.y1 - box.y0) * initial.b.k;
    assert.ok(shownHeight >= 150, `centroid triangle height ${shownHeight}px crowds G, D, E and the length labels`);
    t.diagnostic(`sm8-proof: triangle height ${shownHeight.toFixed(2)}px on ${width}×${height} with 58px bottom inset`);
    for (const name of ['A', 'B', 'C', 'D', 'E', 'G', 'x']) assert.ok(initial.texts.some((t) => t.text === name), `missing ${name}`);
    inside(initial, width, height, 'initial centroid');
    assert.equal(s.revealed, false);
    assert.equal(s.playing, false);
  });
}

test('mobile fit preserves the generated givens, first solution drawing, final answer and geometry', () => {
  const variants = [];
  for (const [m, n] of [[1, 2], [2, 3], [1, 3], [3, 2], [2, 1], [3, 1]]) for (const r of [2, 3, 4]) for (const kind of [0, 1]) {
    variants.push(['sm4-x', { seed: 1, m, n, r, kind }]);
  }
  for (const t of [1, 4]) for (const s of [1, 4]) for (const th of [70, 110]) for (const kind of [0, 1, 2]) {
    variants.push(['sm8-proof', { seed: 1, t, s, th, kind }]);
  }
  for (const [id, pk] of variants) for (const [width, height] of [[390, 309], [360, 291]]) {
    const scene = sceneOf(id), s = fresh(id); s.smPk = { ...pk };
    const question = scene.problem.text(s), key = JSON.stringify(s.smPk);
    const problem = draw(id, s, width, height);
    inside(problem, width, height, `${id}/${JSON.stringify(pk)}/${width}`);
    const firstStep = draw(id, s, width, height, 'review');
    assert.deepEqual(firstStep.paths, problem.paths, `${id}: first solution retains the problem geometry`);
    assert.ok(firstStep.texts.some((t) => t.text === 'x'), `${id}: first step must not reveal the target`);
    const solution = scene.sm.solution(s);
    s.step = solution.steps.length;
    const finalStep = draw(id, s, width, height, 'review');
    assert.ok(finalStep.texts.some((t) => t.text === String(solution.targets.x)), `${id}: final target is shown at its original solution stage`);
    assert.equal(scene.problem.text(s), question, `${id}: fitting must not change the question`);
    assert.equal(JSON.stringify(s.smPk), key);
    assert.equal(s.revealed, false);
    if (id === 'sm4-x') {
      const g = G.geo.xGeo(pk.m, pk.n, pk.r);
      close(G.dist(g.B, g.C) / G.dist(g.A, g.D), pk.n / pk.m, 'parallel triangle similarity ratio');
      close(solution.targets.x, pk.kind === 0 ? pk.r * pk.n : 2 * pk.m, 'X problem answer');
    } else {
      const g = G.geo.cpGeo(pk.t, pk.s, pk.th);
      close(G.dist(g.A, g.G) / G.dist(g.G, g.D), 2, 'centroid ratio on AD');
      close(G.dist(g.B, g.G) / G.dist(g.G, g.E), 2, 'centroid ratio on BE');
      close(solution.targets.x, pk.kind === 1 ? pk.s : pk.t, 'centroid problem answer');
    }
  }
});
