import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRequire } from 'node:module';

const labRoot = process.env.CIRCLE_LAB_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g9-circle');
const document = { documentElement: { dataset: {} }, getElementById() {}, createElement() { return {}; }, head: { append() {} }, addEventListener() {} };
const context = vm.createContext({ window: {}, document });
for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
  const file = path.join(labRoot, name + '.js');
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const groups = context.window.APL_CI_GROUPS;
const scenes = groups.flatMap(g => g.scenes);
const defaults = Object.assign({}, ...groups.map(g => g.params));
const state = sc => { const s = Object.fromEntries(Object.entries(defaults).map(([k, p]) => [k, p.value])); sc.enter(s); return s; };
const PC = { tab: 'problem', problem: true, review: false, step: 99, txt: true };
const G = context.window.APL_CI;
const katex = createRequire(import.meta.url)(path.resolve(labRoot, '../../kit/vendor/katex/katex.min.js'));
const close = (a, b, label) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${label}: ${a} != ${b}`);
function checkMath(html, label) {
  assert.doesNotMatch(html, /NaN|undefined|Infinity/, label);
  assert.equal((html.match(/\$/g) || []).length % 2, 0, `${label}: unbalanced math delimiters`);
  assert.doesNotMatch(html.replace(/\$[^$]*\$/g, ''), /\\[A-Za-z]+/, `${label}: TeX command outside math delimiters`);
  for (const [, tex] of html.matchAll(/\$([^$]+)\$/g)) katex.renderToString(tex, { throwOnError: true, strict: 'error' });
}
function board(W = 390, H = 440) {
  const items = [], b = { W, H, pad: .02, insets: { top: 0, bottom: 0, left: 0, right: 0 }, focus: { x: [-6, 6], y: [-6, 6] }, items };
  Object.defineProperty(b, 'k', { get() { return Math.min((W - 2 * .02 * Math.min(W, H)) / (this.focus.x[1] - this.focus.x[0]), (H - 2 * .02 * Math.min(W, H)) / (this.focus.y[1] - this.focus.y[0])); } });
  const P = p => { assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `invalid point: ${JSON.stringify(p)}`); };
  b.toS = p => { P(p); return { x: W / 2 + (p.x - (b.focus.x[0] + b.focus.x[1]) / 2) * b.k, y: H / 2 + (p.y - (b.focus.y[0] + b.focus.y[1]) / 2) * b.k }; };
  b.toW = (x, y) => ({ x: (x - W / 2) / b.k + (b.focus.x[0] + b.focus.x[1]) / 2, y: (y - H / 2) / b.k + (b.focus.y[0] + b.focus.y[1]) / 2 });
  b.path = (points, options) => { points.forEach(P); items.push({ type: 'path', points, options }); return b; };
  b.circle = (p, r, options) => { P(p); assert.ok(Number.isFinite(r) && r >= 0, 'invalid circle radius'); items.push({ type: 'circle', p, r, options }); return b; };
  b.arc = (p, r, a, z, options) => { P(p); assert.ok([r, a, z].every(Number.isFinite), 'invalid arc'); items.push({ type: 'arc', p, r, a, z, options }); return b; };
  for (const method of ['right', 'ticks']) b[method] = (...args) => { args.slice(0, method === 'right' ? 3 : 2).forEach(P); items.push({ type: method, args }); return b; };
  for (const method of ['point', 'handle']) b[method] = (...args) => { P(args[method === 'point' ? 0 : 1]); items.push({ type: method, args }); return b; };
  b.text = (p, str, o) => { P(p); assert.doesNotMatch(String(str), /NaN|undefined|Infinity|^\?$/); items.push({ type: 'text', p, str, o }); return b; };
  return b;
}

test('c1-1 solves the current R=17, AB=16 question, independent of exploration R=10, OM=6', () => {
  const sc = scenes.find(sc => sc.id === 'c1-1'), s = state(sc);
  s.ciPk = { kind: 0, am: 8, om: 15, R: 17, key: 'regression.17.16' };
  s.c1R = 10; s.c1d = 6;
  const Q = sc.ci.prob(sc.ci.model(s, PC), s);
  assert.match(Q.stem, /17/);
  assert.match(Q.stem, /16/);
  const steps = sc.steps(s).join('\n');
  assert.match(steps, /17/);
  assert.match(steps, /15/);
  assert.doesNotMatch(steps, /10\^2-6\^2/);
  assert.match(sc.steps(s).at(-1), /OM[^]*15/);
});

test('45 scenes × 120 deterministic questions: geometry, choices, current-target solution and TeX agree', () => {
  assert.equal(scenes.length, 45);
  let checked = 0;
  for (const sc of scenes) {
    assert.equal(typeof sc.ci.solve, 'function', `${sc.id}: missing current-question solution`);
    const s = state(sc), kinds = new Set();
    for (let seed = 0; seed < 120; seed++) {
      s.ciPk = sc.ci.gen(G.seeded(`circle-audit|${sc.id}|${seed}`), seed);
      kinds.add(s.ciPk.kind);
      const sol = sc.solution(s), Q = sol.question, label = `${sc.id}/${s.ciPk.key}`;
      assert.equal(sol.key, Q.key, label);
      assert.equal(JSON.stringify(sol.model.q), JSON.stringify(s.ciPk), label);
      assert.equal(sol.steps.length, 5, label);
      assert.equal(Q.choices.length, 5, `${label}: five choices retained`);
      assert.equal(Q.choices.filter(c => c.ok).length, 1, label);
      close(Q.chk[0], Q.chk[1], `${label}: drawn condition vs answer`);
      close(sol.value, Q.chk[1], `${label}: independent solution vs answer`);
      const correct = Q.choices.find(c => c.ok);
      if (typeof correct.value === 'number') close(correct.value, sol.value, `${label}: choice vs solution`);
      for (const text of [Q.stem || Q.html, ...sc.steps(s), ...Q.choices.map(c => c.h || `$${c.t}$`)]) checkMath(text, label);
      checked++;
    }
    const expectedKinds = { 'c1-2': 2, 'c1-5': 4, 'c2-2': 5, 'c2-7': 4, 'c4-5': 6 }[sc.id] || 3;
    assert.equal(kinds.size, expectedKinds, `${sc.id}: all generated variant families`);
  }
  assert.equal(checked, 5400);
});

test('all question variants draw through all five solution stages with finite geometry; first stage preserves the problem', () => {
  for (const sc of scenes) {
    const s = state(sc);
    for (let variant = 0; variant < 6; variant++) {
      s.ciPk = sc.ci.gen(G.seeded(`drawing|${sc.id}|${variant}`), variant);
      const key = JSON.stringify(s.ciPk), problemBoard = board();
      try {
        sc.draw(problemBoard, s, {}, { tab: 'problem' });
        const problemText = problemBoard.items.filter(x => x.type === 'text').map(x => x.str);
        for (let step = 1; step <= 5; step++) {
          s.step = step;
          const b = board();
          sc.draw(b, s, {}, { tab: 'review' });
          assert.equal(JSON.stringify(s.ciPk), key, `${sc.id}: solving mutated the question`);
          if (step === 1) assert.deepEqual(b.items.filter(x => x.type === 'text').map(x => x.str), problemText, `${sc.id}: first step diverges from problem`);
          for (const label of b.ciLabels) assert.ok(label.l >= 0 && label.r <= b.W + 1 && label.t >= 0 && label.b <= b.H + 1, `${sc.id}: clipped label ${label.text}`);
        }
      } catch (e) { e.message = `${sc.id}/${s.ciPk.key}: ${e.message}`; throw e; }
    }
  }
});

test('exploration remains independent; initial and slider endpoints render without corrupting questions', () => {
  for (const sc of scenes) {
    const s = state(sc), key = JSON.stringify(s.ciPk), cases = [Object.assign({}, s)];
    for (const id of sc.controls(s) || []) for (const end of ['min', 'max']) cases.push({ ...s, [id]: defaults[id][end] });
    for (const c of cases) {
      try { sc.draw(board(), c, {}, { tab: 'explore' }); const view = sc.view(c, { tab: 'explore' }); assert.doesNotMatch(JSON.stringify(view), /NaN|undefined/); }
      catch (e) { e.message = `${sc.id}: ${e.message}`; throw e; }
      assert.equal(JSON.stringify(c.ciPk), key, `${sc.id}: exploration mutated question`);
    }
  }
});

test('c4-1 center position and presets agree with geometric angle containment', () => {
  const sc = scenes.find(sc => sc.id === 'c4-1'), s = state(sc), EX = { tab: 'explore', problem: false };
  for (const th of [40, 60, 100, 120]) for (const preset of sc.presets(s)) {
    s.c4t = th; preset.apply(s);
    const g = sc.ci.model(s, EX).g;
    const total = G.angBetween(g.P, g.A, g.B), parts = G.angBetween(g.P, g.A, { x: 0, y: 0 }) + G.angBetween(g.P, { x: 0, y: 0 }, g.B);
    assert.equal(preset.on(s), true);
    if (g.cs === 'in' || g.cs === 'side') close(total, parts, 'O lies inside/on the inscribed angle');
    else assert.ok(parts > total + 1e-5, 'O lies outside the inscribed angle');
  }
});

test('answer leaks and unrelated unknowns stay absent in repaired question variants', () => {
  for (const [id, q, forbidden, required] of [
    ['c1-5', { kind: 3, R: 8, k: 4, key: 'angle-only' }, 'AB=x', 'x'],
    ['c2-6', { kind: 2, R: 9, r: 3, pbFull: 15, key: 'no-derived-PA' }, 'PA=5', 'AB=x'],
    ['c3-3', { kind: 2, a: 13, b: 14, c: 15, r: 4, key: 'unknown-radius' }, '4', 'x'],
    ['c3-6', { kind: 2, a: 4, b: 9, ab: 12, key: 'unknown-AD' }, '4', 'x']
  ]) {
    const sc = scenes.find(sc => sc.id === id), s = state(sc); s.ciPk = q;
    const b = board(); sc.draw(b, s, {}, { tab: 'problem' });
    const texts = b.items.filter(x => x.type === 'text').map(x => x.str);
    assert.ok(!texts.includes(forbidden), `${id}: leaked ${forbidden}`);
    assert.ok(texts.includes(required), `${id}: missing ${required}`);
  }
});

test('the inner circle chord unknown names AB and has a leader anchored to that segment', () => {
  const sc = scenes.find(sc => sc.id === 'c2-6'), s = state(sc);
  s.ciPk = { kind: 2, R: 9, r: 3, pbFull: 15, key: 'inner-chord-label' };
  const b = board(390, 310); sc.draw(b, s, {}, { tab: 'problem' });
  const labels = b.items.filter(item => item.type === 'text').map(item => item.str);
  assert.ok(labels.includes('AB=x'), 'the short chord target remains named when a label must move');
  assert.ok(!labels.includes('x') && !labels.includes('PA=5'), 'the problem neither assigns x to another radius nor reveals derived PA');
  const g = sc.ci.model(s, PC).g, midpoint = G.mid(g.A, g.B);
  const leader = b.items.find(item => item.type === 'path' && item.options.color === 'rose' && item.options.width === 1.2 && G.dist(item.points[0], midpoint) < 1e-9);
  assert.ok(leader, 'the callout starts on AB, not OB');
  const towardCenter = G.sub(g.O, midpoint), towardLabel = G.sub(leader.points[1], midpoint);
  assert.ok(towardCenter.x * towardLabel.x + towardCenter.y * towardLabel.y < 0, 'the leader goes away from the radius and toward the outside of AB');
});

test('a scene badge remains correct when a new question changes the unknown segment', () => {
  for (const sc of scenes) {
    const s = state(sc);
    for (let variant = 0; variant < 6; variant++) {
      s.ciPk = sc.ci.gen(G.seeded(`badge|${sc.id}|${variant}`), variant);
      assert.equal(sc.problem.tag(s), sc.title, `${sc.id}: an initially rendered badge identifies the scene, not a stale target`);
    }
  }
});

test('the folded-circle angle marker stays above the chord and the target is explicitly named', () => {
  const sc = scenes.find(sc => sc.id === 'c1-5'), s = state(sc);
  s.ciPk = { kind: 3, R: 8, k: 4, key: 'angle-label-in-sector' };
  const b = board(390, 252); sc.draw(b, s, {}, { tab: 'problem' });
  const x = b.items.find(item => item.type === 'text' && item.str === 'x');
  assert.ok(x, 'the unknown angle is marked near O');
  const p = b.toS(x.p), y = p.y + (x.o.dy || 0), chordY = b.toS({ x: 0, y: 4 }).y;
  assert.ok(y + (x.o.size || 16) / 2 < chordY, `the angle label at ${y} cannot look like a chord length below ${chordY}`);
  assert.ok(b.items.some(item => item.type === 'text' && item.str === '∠AOB=x'), 'the full angle name disambiguates the target');
});

test('circle-area answers remain above the bottom toolbar on landscape tablet canvases', () => {
  for (const [id, q] of [
    ['c7-1', { kind: 0, R: 4, phi: 150, key: 'area-caption-toolbar' }],
    ['c7-2', { kind: 2, R: 6, key: 'fold-caption-toolbar' }],
    ['c7-3', null]
  ]) {
    const sc = scenes.find(sc => sc.id === id), s = state(sc);
    if (q) s.ciPk = q;
    s.step = 5;
    const b = board(683, 614); sc.draw(b, s, {}, { tab: 'review' });
    const captions = b.ciLabels.filter(label => /넓이/.test(label.text));
    assert.ok(captions.length, id + ': the target-area caption is retained');
    for (const label of captions) assert.ok(label.b <= b.H - 74, `${id}: answer ends at ${label.b}, inside the toolbar zone`);
  }
});

test('common external tangents handle either radius order and the equal-radius rectangle', () => {
  const sc = scenes.find(sc => sc.id === 'c2-5'), s = state(sc);
  for (const [r1, r2] of [[1, 4], [4, 1], [4, 4]]) for (let kind = 0; kind < 3; kind++) {
    s.ciPk = { kind, r1, r2, key: `radius-order.${r1}.${r2}.${kind}` };
    const sol = sc.solution(s), text = sol.steps.join('\n');
    assert.doesNotMatch(text, /큰 반지름|작은 반지름|작은 원의 중심/, 'left and right do not imply larger and smaller');
    if (kind === 1) {
      assert.match(sol.steps[1], /반지름이 다르면/);
      assert.match(sol.steps[1], /같으면/);
      assert.doesNotMatch(sol.steps.slice(0, 3).join(' '), /길이가 같아요|H는 선분|H는 OA를/, 'unknown radius equality/order is not assumed before solving');
    }
    if (r1 === r2) {
      assert.match(text, /직사각형/);
      assert.doesNotMatch(text, /직각삼각형 OHO/, 'O=H does not define a triangle');
    } else assert.match(text, /\\lvert r_1-r_2\\rvert/, 'the difference used as a length is nonnegative');
    for (let step = 1; step <= 5; step++) {
      s.step = step; const b = board(); sc.draw(b, s, {}, { tab: 'review' });
      for (const item of b.items.filter(x => x.type === 'right')) {
        const [V, A, B] = item.args;
        assert.ok(G.dist(V, A) > 1e-7 && G.dist(V, B) > 1e-7, 'right-angle markers need two nonzero rays');
        close((A.x - V.x) * (B.x - V.x) + (A.y - V.y) * (B.y - V.y), 0, 'marked rays are perpendicular');
      }
    }
  }
  const common = scenes.find(sc => sc.id === 'c2-7'), c = state(common);
  for (const [r1, r2] of [[2, 6], [6, 2], [4, 4]]) {
    Object.assign(c, { c2cm: 'ext', c2r1: r1, c2r2: r2, c2d: 13 });
    const b = board(); common.draw(b, c, {}, { tab: 'explore' });
    for (const { args: [V, A, B] } of b.items.filter(x => x.type === 'right')) {
      assert.ok(G.dist(V, A) > 1e-7 && G.dist(V, B) > 1e-7, 'exploration must also omit degenerate right-angle markers');
    }
    assert.match(JSON.stringify(common.view(c, { tab: 'explore' })), /\|r₁ − r₂\|/, 'readout labels the absolute difference');
  }
});

test('equal-length marks and right-angle marks describe the actual solution geometry in all 45 scenes', t => {
  let frames = 0;
  for (const sc of scenes) {
    const s = state(sc);
    for (let seed = 0; seed < 24; seed++) {
      s.ciPk = sc.ci.gen(G.seeded(`mark-audit|${sc.id}|${seed}`), seed);
      for (let step = 1; step <= 5; step++) {
        s.step = step; const b = board(); sc.draw(b, s, {}, { tab: 'review' });
        const groups = new Map(), label = `${sc.id}/${s.ciPk.key}/step${step}`;
        for (const { args: [A, B, options] } of b.items.filter(x => x.type === 'ticks')) {
          const key = `${options.count || 1}:${options.color || 'amber'}`, length = G.dist(A, B);
          if (groups.has(key)) close(length, groups.get(key), `${label}: identical tick patterns must mean equal lengths`);
          else groups.set(key, length);
        }
        for (const { args: [V, A, B] } of b.items.filter(x => x.type === 'right')) {
          const a = G.dist(V, A), c = G.dist(V, B);
          assert.ok(a > 1e-7 && c > 1e-7, `${label}: right angle cannot use a zero-length ray`);
          close(((A.x - V.x) * (B.x - V.x) + (A.y - V.y) * (B.y - V.y)) / (a * c), 0, `${label}: right-angle rays`);
        }
        frames++;
      }
    }
  }
  t.diagnostic(`${frames} staged drawing frames independently checked for equal lengths and perpendicular rays`);
});

test('angle arc patterns denote equal angles rather than merely opposite comparison pairs', t => {
  const same = (a, c) => G.dist(a, c) < 1e-8;
  function check(b, label) {
    const angles = [];
    let sector;
    for (const item of b.items.filter(x => x.type === 'arc')) {
      const o = item.options || {};
      if (o.sector && o.fill && !o.color) { sector = item; continue; }
      if (o.color && o.width === 2.4 && sector && same(item.p, sector.p) && Math.abs(item.a - sector.a) < 1e-8 && Math.abs(item.z - sector.z) < 1e-8) {
        angles.push({ p: item.p, a: item.a, z: item.z, degrees: Math.abs(item.z - item.a) / G.DEG, color: o.color, rings: 1 });
        sector = null;
      } else if (o.color && o.width === 2.2) {
        const last = angles.at(-1);
        if (last && same(item.p, last.p) && Math.abs(item.a - last.a) < 1e-8 && Math.abs(item.z - last.z) < 1e-8) last.rings++;
      }
    }
    const groups = new Map();
    for (const a of angles) {
      const key = `${a.color}:${a.rings}`;
      if (groups.has(key)) close(a.degrees, groups.get(key), `${label}: equal arc pattern ${key}`);
      else groups.set(key, a.degrees);
    }
  }
  let frames = 0;
  for (const sc of scenes) {
    const s = state(sc);
    for (let seed = 0; seed < 24; seed++) {
      s.ciPk = sc.ci.gen(G.seeded(`arc-audit|${sc.id}|${seed}`), seed);
      for (let step = 1; step <= 5; step++) {
        s.step = step; const b = board(); sc.draw(b, s, {}, { tab: 'review' });
        check(b, `${sc.id}/${s.ciPk.key}/step${step}`); frames++;
      }
    }
  }
  for (const id of ['c5-1', 'c5-5', 'c5-6']) {
    const sc = scenes.find(x => x.id === id), s = state(sc);
    const cases = id === 'c5-1'
      ? [50, 70, 90, 110, 130].flatMap(c5A => [50, 90, 130].map(c5B => ({ c5A, c5B })))
      : id === 'c5-6' ? [0, 1, 2, 3, 4, 5].flatMap(c5ty => [55, 60, 65, 70, 75, 80].map(c5th => ({ c5ty, c5th })))
      : Array.from({ length: 81 }, (_, i) => ({ c5d: (-56 + i) / 10 }));
    for (const params of cases) {
      Object.assign(s, params); const b = board(); sc.draw(b, s, {}, { tab: 'explore' });
      check(b, `${id}/explore/${JSON.stringify(params)}`); frames++;
    }
    if (id === 'c5-5') for (const preset of sc.presets(s)) {
      preset.apply(s);
      const g = sc.ci.model(s, { tab: 'explore', problem: false }).g;
      assert.ok(g.cs.every(c => c.ok), 'the circle preset still reaches all three original snap conditions');
      const b = board(); sc.draw(b, s, {}, { tab: 'explore' });
      check(b, `${id}/preset/${preset.label}`); frames++;
    }
  }
  t.diagnostic(`${frames} question-stage and exploration frames checked against their actual angle measures`);
});
