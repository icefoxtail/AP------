import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Mathematical and drawing-command checks. Browser layout has its own Chromium gate.
const root = process.env.G7_POLYGONS_SOURCE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g7-polygons');
const seededMath = Object.create(Math); let seed = 90463;
seededMath.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
const ctx = vm.createContext({ window: {}, Math: seededMath, document: {
  documentElement: { dataset: {} }, getElementById() { return null; }, createElement() { return {}; }, head: { append() {} }, addEventListener() {}
} });
for (const name of ['core', 't1', 't2', 't3', 't4']) vm.runInContext(fs.readFileSync(path.join(root, name + '.js'), 'utf8'), ctx, { filename: name + '.js' });
const G = ctx.window.APL_PG, groups = ctx.window.APL_PG_GROUPS, scenes = groups.flatMap((g) => g.scenes);
const params = Object.assign({}, ...groups.map((g) => g.params));
const by = (id) => scenes.find((sc) => sc.id === id);
function state(id, patch = {}) { const s = { step: 1 }; by(id).enter(s); Object.assign(s, patch); by(id).view(s, { tab: 'explore' }); s.step = patch.step ?? 1; return s; }
const model = (id, s) => by(id).pg.model(s);
const question = (id, s) => by(id).pg.prob(model(id, s), s);
const answer = (id, s) => question(id, s).choices.find((c) => c.ok);
const number = (text) => { const m = String(text).match(/-?\d+(?:\.\d+)?(?:\/\d+)?/); assert.ok(m, 'numeric value: ' + text); const [a, b = 1] = m[0].split('/').map(Number); return a / b; };
const close = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-6, `${why}: ${a} != ${b}`);
const finite = (x) => typeof x === 'number' ? Number.isFinite(x) : Array.isArray(x) ? x.every(finite) : x && typeof x === 'object' ? Object.values(x).every(finite) : true;
function render(id, s, tab, width = 900, height = 650) {
  const calls = [], b = { W: width, H: height, insets: { left: 0, right: 0, top: 0, bottom: 0 }, pad: .02, k: 80, thumb: false, calls };
  for (const method of ['path', 'seg', 'poly', 'text', 'point', 'arc', 'right', 'circle', 'ticks', 'handle']) b[method] = (...args) => { calls.push({ method, args }); return b; };
  const sc = by(id), lab = { tab, s, scene: sc }, v = sc.view(s, lab); sc.draw(b, s, v, lab);
  return { b, v, texts: calls.filter((c) => c.method === 'text').map((c) => String(c.args[1])) };
}
function verify(id, s) { const r = by(id).pg.verify(s); close(r.ans, r.model, id); for (const pair of r.extra || []) close(pair[0], pair[1], id + ' extra'); }
const area = (pts) => Math.abs(pts.reduce((sum, p, i) => { const q = pts[(i + 1) % pts.length]; return sum + p.x * q.y - q.x * p.y; }, 0) / 2);
const angle = (v, a, b) => { const u = { x: a.x - v.x, y: a.y - v.y }, w = { x: b.x - v.x, y: b.y - v.y }; return Math.atan2(Math.abs(u.x * w.y - u.y * w.x), u.x * w.x + u.y * w.y) * 180 / Math.PI; };

test('registered scenes produce finite drawings and five valid choices in all requested viewport dimensions', () => {
  assert.ok(scenes.length > 0); assert.equal(new Set(scenes.map((sc) => sc.id)).size, scenes.length);
  for (const sc of scenes) {
    const s = state(sc.id);
    for (let n = 0; n < 32; n++) {
      const q = question(sc.id, s); assert.equal(q.choices.length, 5, sc.id); assert.equal(q.choices.filter((c) => c.ok).length, 1, sc.id);
      assert.equal(new Set(q.choices.map((c) => c.p)).size, 5, sc.id);
      assert.ok(!/NaN|undefined/.test(JSON.stringify({ stem: q.stem, choices: q.choices })), sc.id);
      verify(sc.id, s); sc.pg.reroll(s);
    }
    for (const [w, h] of [[1440, 900], [820, 1180], [1024, 768], [390, 844]]) for (const tab of ['explore', 'review', 'problem']) {
      const s = state(sc.id);
      for (const step of tab === 'review' ? [1, sc.steps(s).length] : [1]) {
        s.step = step; const r = render(sc.id, s, tab, w, h);
        assert.ok(r.b.calls.length > 2 && finite(r.b.calls) && finite(r.b.focus), sc.id + '/' + tab);
      }
    }
    assert.ok(!/pg-fb|pg-ch ok|pg-ch bad/.test(sc.problem.text(state(sc.id))), sc.id + ' no initial verdict');
  }
});

test('diagonal counts and interior triangle partitions agree with explicit enumeration and area', () => {
  for (let n = 3; n <= 12; n++) {
    let total = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (j !== i + 1 && !(i === 0 && j === n - 1)) total++;
    const all = state('p1-all', { pgN: n }); close(number(answer('p1-all', all).p), total, 'all diagonals');
    for (let v = 0; v < n; v++) { const one = state('p1-one', { pgN: n, pgV: v }); verify('p1-one', one); close(number(answer('p1-one', one).p), (n - 3) + (n - 2), 'one vertex plus triangles'); }
    for (const [ox, oy] of [[0, 0], [.4, .4], [10, -10]]) {
      const s = state('p3-inO', { pgOn: n, pgOx: ox, pgOy: oy }), m = model('p3-inO', s);
      let partition = 0; for (let i = 0; i < n; i++) partition += area([m.O, m.V[i], m.V[(i + 1) % n]]);
      close(partition, area(m.V), 'O remains inside, areas cover polygon'); close(number(answer('p3-inO', s).p), 180 * (n - 2), 'interior sum');
    }
  }
});

test('triangle exterior angles, star tips, bisectors and chained isosceles angles match coordinates', () => {
  for (let a = 30; a <= 80; a += 10) for (let b = 30; b <= 65; b += 5) verify('p2-ext', state('p2-ext', { pgEa: a, pgEb: b }));
  for (let mask = 0; mask < 16; mask++) { const s = state('p2-star', Object.fromEntries(['pgSa', 'pgSb', 'pgSc', 'pgSd'].map((k, i) => [k, mask & (1 << i) ? 40 : 30]))); verify('p2-star', s); }
  for (let a = 40; a <= 90; a += 2) for (let b = 40; b <= 60; b += 2) for (const k of [1, 2, 3]) verify('p2-bis', state('p2-bis', { pgKa: a, pgKb: b, pgK: k }));
  for (let x = 14; x <= 20; x++) verify('p2-chain', state('p2-chain', { pgCx: x }));
  for (let b = 40; b <= 70; b += 2) verify('p2-iso', state('p2-iso', { pgIb: b }));
});

test('all three bisector reviews show their own relation and keep the target unknown until the last step', () => {
  for (const [k, relation] of [[1, '2●+2×+∠A = 180°'], [2, '2●+2× = 180°+∠A'], [3, '2× = ∠A+2●,  × = ●+x']]) {
    const s = state('p2-bis', { pgK: k, step: 2 }); const r = render('p2-bis', s, 'review');
    assert.ok(r.texts.includes(relation), relation); assert.ok(r.texts.includes('x'));
    const m = model('p2-bis', s), target = G.dg(m.x), atTarget = (calls) => calls.filter((c) => c.method === 'text' && Math.hypot(c.args[0].x - m.g.X.x, c.args[0].y - m.g.X.y) < 1e-8).map((c) => c.args[1]);
    assert.ok(!atTarget(r.b.calls).includes(target), 'unrevealed target ' + target);
    s.step = 3; assert.ok(atTarget(render('p2-bis', s, 'review').b.calls).includes(target));
  }
});

test('concave, convex and straight-boundary shapes keep exact angles and the same question geometry', () => {
  for (const n of [4, 5, 6]) for (let j = 0; j <= 100; j++) {
    const s = state('p3-concave', { pgCn: n, pgCf: j / 100 }), m = model('p3-concave', s), v = m.g.V;
    assert.equal(m.gp, m.g, 'same geometry in every tab');
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const p = v[i], prev = v[(i + n - 1) % n], next = v[(i + 1) % n];
      const ux = p.x - prev.x, uy = p.y - prev.y, wx = next.x - p.x, wy = next.y - p.y;
      const interior = 180 - Math.atan2(ux * wy - uy * wx, ux * wx + uy * wy) * 180 / Math.PI;
      close(m.iv[i], interior, 'exact labelled interior'); sum += interior;
    }
    close(sum, 180 * (n - 2), 'concave/convex sum'); close(number(answer('p3-concave', s).p), angle(v[0], v.at(-1), v[1]), 'question target');
    const label = params.pgCf.format(s.pgCf, s);
    assert.equal(label, m.g.flat ? '일직선 경계' : m.g.concave ? '오목' : '볼록');
  }
});

test('exterior sectors meet at exactly one point on completion and still sum to 360 degrees', () => {
  for (let n = 3; n <= 12; n++) {
    const s = state('p3-ext360', { pgXn: n, pgXt: 1 }), r = render('p3-ext360', s, 'explore');
    const sectors = r.b.calls.filter((c) => c.method === 'arc' && c.args.at(-1)?.sector);
    assert.equal(sectors.length, n); let turn = 0;
    for (const c of sectors) { close(c.args[0].x, 0, 'sector center x'); close(c.args[0].y, 0, 'sector center y'); turn += c.args[3] - c.args[2]; }
    close(turn, Math.PI * 2, 'one full turn'); verify('p3-ext360', s);
    s.pgXt = 0; s.step = 2; render('p3-ext360', s, 'review'); assert.equal(s.pgXt, 1, 'selected review stage complete immediately');
  }
});

test('pentagon given and mixed angles are consistent at every boundary combination', () => {
  for (const id of ['p3-given', 'p3-mixed']) {
    const sc = by(id), keys = sc.controls();
    for (let mask = 0; mask < 16; mask++) {
      const s = state(id, Object.fromEntries(keys.map((k, i) => [k, mask & (1 << i) ? params[k].max : params[k].min]))), m = model(id, s);
      verify(id, s); close(number(answer(id, s).p), 540 - m.ints.slice(0, 4).reduce((a, b) => a + b, 0), 'pentagon missing interior');
    }
  }
});

test('regular polygon calculations retain exact fractions for all allowed side counts', () => {
  assert.ok(answer('p4-reg', state('p4-reg', { pgRn: 7 })).t.includes('\\dfrac{900}{7}'), 'the displayed answer retains the exact fraction');
  for (let n = 3; n <= 20; n++) { const s = state('p4-reg', { pgRn: n }); verify('p4-reg', s); close(number(answer('p4-reg', s).p), 180 * (n - 2) / n, 'exact regular interior'); }
  for (let n = 5; n <= 12; n++) for (let v = 0; v < n; v++) {
    const d = state('p4-diag', { pgDn: n, pgDv: v }); verify('p4-diag', d); close(number(answer('p4-diag', d).p), 360 / n, 'crossed diagonals');
    for (let k = 2; k <= Math.min(4, n - 2); k++) { const f = state('p4-fan', { pgFn: n, pgFv: v, pgFk: k }); verify('p4-fan', f); close(number(answer('p4-fan', f).p), k * 180 / n, 'fan angle'); }
  }
  const s = state('p4-reg', { pgRn: 7, step: 3 }), r = render('p4-reg', s, 'review');
  assert.ok(r.texts.some((t) => t.includes('900/7'))); assert.ok(!r.texts.some((t) => /128\.6|51\.4/.test(t)));
});

test('impossible interior/exterior ratios remain the selected ratio and have an existence answer', () => {
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 4; b++) {
    const s = state('p4-ratio', { pgQa: a, pgQb: b }), m = model('p4-ratio', s), q = question('p4-ratio', s), nn = 2 * (a + b) / b;
    const valid = Number.isInteger(nn) && nn >= 3;
    assert.equal(m.valid, valid); assert.equal(m.pa, a); assert.equal(m.pb, b); assert.ok(q.stem.includes(`${a} : ${b}`));
    if (valid) close(number(answer('p4-ratio', s).p), nn, 'ratio n'); else assert.match(answer('p4-ratio', s).p, /존재하지/);
    verify('p4-ratio', s);
  }
});

test('joined regular polygons use the actual triangle, including reflex remaining angles and collinear cases', () => {
  for (let n = 3; n <= 8; n++) for (let m = 3; m <= 8; m++) {
    const s = state('p4-join', { pgJn: n, pgJm: m }), q = model('p4-join', s), { A, P, Q } = q.g;
    const exists = area([A, P, Q]) > 1e-8;
    assert.equal(q.valid, exists, `${n}+${m} triangle existence`); assert.equal(q.pr.n, n); assert.equal(q.pr.m, m);
    close(q.x, angle(A, P, Q), 'triangle apex');
    if (exists) close(number(answer('p4-join', s).p), angle(P, A, Q), 'triangle base'); else assert.match(answer('p4-join', s).p, /직선/);
    verify('p4-join', s);
  }
  const m = model('p4-join', state('p4-join', { pgJn: 3, pgJm: 3 })); close(m.gap, 240, 'remaining reflex angle'); close(m.x, 120, 'actual triangle apex'); close(m.base, 30, 'actual base angle');
});

test('step reveal, manual answer reset, progress and drag interactions stay coherent', () => {
  for (const sc of scenes) { const s = state(sc.id), v = render(sc.id, s, 'review').v; assert.ok(!v.formula, sc.id + ' early formula hidden'); }
  for (const sc of scenes) for (const preset of sc.presets()) { const s = state(sc.id); preset.apply(s); assert.ok(preset.on(s), sc.id + ' selected preset'); render(sc.id, s, 'explore'); verify(sc.id, s); }
  assert.ok(!render('p1-all', state('p1-all', { step: 2 }), 'review').texts.some((t) => t.includes('÷2')));
  for (const step of [1, 2]) assert.ok(render('p1-find', state('p1-find', { step }), 'review').texts.includes('?각형'));
  for (const id of ['p3-given', 'p3-mixed']) for (const step of [1, 2]) assert.ok(!render(id, state(id, { step }), 'review').texts.some((t) => /^x=\d/.test(t)));
  const id = 'p4-reg', sc = by(id), s = state(id); render(id, s, 'problem'); s.revealed = true; s.step = 3; s.pgRn = 7;
  render(id, s, 'problem'); assert.equal(s.revealed, false); assert.equal(s.step, 0); assert.equal(s.pgPick, null);
  s.revealed = true; s.step = 2; s.pgRt = .5; render(id, s, 'explore'); assert.equal(s.revealed, true); assert.equal(s.step, 2);
  for (const sc of scenes.filter((sc) => sc.pg.anim)) {
    const s = state(sc.id), a = sc.pg.anim; sc.actions().find((a) => a.id === 'reset').run(s); assert.equal(s[a.key], 0);
    sc.actions().find((a) => a.id === 'play').run(s); sc.tick(s, (a.dur || 6) / 2, { tab: 'explore' }); close(s[a.key], .5, sc.id + ' play');
  }
  for (const [id, name, point] of [['p1-one', 'v', { x: -1, y: 0 }], ['p2-ext', 'A', { x: .2, y: -1.4 }], ['p2-bis', 'A', { x: .1, y: -1.5 }], ['p3-concave', 'P', { x: -.4, y: 0 }], ['p3-inO', 'O', { x: 10, y: -10 }], ['p4-diag', 'v', { x: -1, y: 0 }], ['p4-fan', 'v', { x: -1, y: 0 }]]) {
    const s = state(id), r = render(id, s, 'explore'), handle = r.b.calls.find((c) => c.method === 'handle' && c.args[0] === name); assert.ok(handle, id + ' drag handle'); handle.args.at(-1).drag(point); verify(id, s);
  }
});
