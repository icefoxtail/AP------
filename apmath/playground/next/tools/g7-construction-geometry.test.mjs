import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Math and drawing-command regression tests. Actual browser layout is a separate gate.
const root = process.env.G7_CONSTRUCTION_SOURCE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../labs/g7-construction');
const seededMath = Object.create(Math);
let seed = 81273;
seededMath.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
const ctx = vm.createContext({ window: {}, Math: seededMath, document: {
  documentElement: { dataset: {} }, getElementById() { return null; },
  createElement() { return {}; }, head: { append() {} }, addEventListener() {}
} });
for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6']) vm.runInContext(fs.readFileSync(path.join(root, name + '.js'), 'utf8'), ctx, { filename: name + '.js' });
const G = ctx.window.APL_CN;
const groups = ctx.window.APL_CN_GROUPS;
const scenes = groups.flatMap((g) => g.scenes);
const params = Object.assign({}, ...groups.map((g) => g.params));
const by = (id) => scenes.find((sc) => sc.id === id);
const state = (id, patch = {}) => { const s = { step: 1 }; by(id).enter(s); Object.assign(s, patch); return s; };
const model = (id, s) => by(id).cn.model(s);
const question = (id, s) => by(id).cn.prob(model(id, s), s);
const answer = (id, s) => question(id, s).choices.find((c) => c.ok);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} != ${b}`);
const finite = (x) => typeof x === 'number' ? Number.isFinite(x) : Array.isArray(x) ? x.every(finite) : x && typeof x === 'object' ? Object.values(x).every(finite) : true;
function board(width = 900, height = 650) {
  const calls = [], b = { W: width, H: height, insets: { left: 0, right: 0, top: 0, bottom: 0 }, pad: .02, k: 40, thumb: false, calls };
  for (const method of ['path', 'seg', 'poly', 'text', 'point', 'arc', 'right', 'circle', 'ticks', 'handle']) b[method] = (...args) => { calls.push({ method, args }); return b; };
  return b;
}
function render(id, s, tab, width = 900, height = 650) {
  const b = board(width, height), sc = by(id), lab = { tab, s, scene: sc };
  const v = sc.view(s, lab); sc.draw(b, s, v, lab); return { b, v, texts: b.calls.filter((c) => c.method === 'text').map((c) => c.args[1]) };
}
function points(calls) {
  const out = []; const walk = (x) => { if (x && typeof x === 'object') { if (typeof x.x === 'number' && typeof x.y === 'number') out.push(x); else Object.values(x).forEach(walk); } };
  calls.filter((c) => c.method !== 'text').forEach((c) => walk(c.args)); return out;
}

// Canvas-space checks use representative stage sizes and conservative text widths.
// Browser CSS, real font metrics and device interaction remain separate gates.
function screenRender(id, patch, tab, width, height, inset = 0) {
  const b = board(width, height), sc = by(id), s = state(id, patch);
  b.insets.bottom = inset;
  Object.defineProperty(b, 'k', { get() {
    const aw = b.W - b.insets.left - b.insets.right, ah = b.H - b.insets.top - b.insets.bottom, pad = 2 * b.pad * Math.min(aw, ah);
    return Math.min((aw - pad) / (b.focus.x[1] - b.focus.x[0]), (ah - pad) / (b.focus.y[1] - b.focus.y[0]));
  } });
  s.cnQuestionKey = sc.id + '|' + question(id, s).key + '|' + (s.cnSeed || 0);
  const lab = { tab, s, scene: sc }, v = sc.view(s, lab);
  sc.draw(b, s, v, lab);
  const toS = (p) => ({ x: width / 2 + (p.x - (b.focus.x[0] + b.focus.x[1]) / 2) * b.k, y: (height - inset) / 2 + (p.y - (b.focus.y[0] + b.focus.y[1]) / 2) * b.k });
  const labels = b.calls.filter((c) => c.method === 'text').map(({ args: [p, text, o] }) => {
    const at = toS(p), size = o.size || 16, w = G.textW(text, size), x = at.x + (o.dx || 0), y = at.y + (o.dy || 0), x0 = o.align === 'left' ? x : o.align === 'right' ? x - w : x - w / 2;
    return { text, x0, x1: x0 + w, y0: y - size / 2, y1: y + size / 2 };
  });
  return { b, s, labels, toS };
}
const overlap = (a, b) => Math.min(a.x1, b.x1) > Math.max(a.x0, b.x0) && Math.min(a.y1, b.y1) > Math.max(a.y0, b.y0);

test('given angles and vertex names stay apart for every allowed ASA pair on representative stages', () => {
  for (const [w, h, inset] of [[1024, 700, 0], [820, 430, 58], [684, 500, 0], [390, 310, 58]]) {
    for (let A = 30; A <= 80; A += 5) for (let B = 30; B <= 80; B += 5) {
      const { labels } = screenRender('c5-2', { cnEA: A, cnEB: B }, 'problem', w, h, inset);
      assert.equal(labels.filter((l) => l.text === 'x°').length, 1);
      for (const label of labels) assert.ok(label.x0 >= 0 && label.x1 <= w && label.y0 >= 0 && label.y1 <= h - inset, `${A}/${B}/${w}: clipped ${label.text}`);
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) assert.ok(!overlap(labels[i], labels[j]), `${A}/${B}/${w}: ${labels[i].text} overlaps ${labels[j].text}`);
    }
  }
});

test('compact construction labels and dense candidate cards retain separate reading space', () => {
  for (let L = 2; L <= 4; L += .5) for (let phi = 5; phi <= 40; phi += 5) {
    const { labels } = screenRender('c1-1', { cnL: L, cnPhi: phi, step: 3 }, 'review', 390, 310, 58);
    assert.ok(!overlap(labels.find((l) => l.text === 'P'), labels.find((l) => /^PQ =/.test(l.text))), `${L}/${phi}: P and PQ`);
  }
  for (let a = 3; a <= 7; a++) for (let b = 3; b <= 7; b++) {
    const { labels } = screenRender('c6-1', { cnGa: a, cnGb: b }, 'explore', 390, 310, 58);
    const marks = labels.filter((l) => ['120°', '60°', 'P'].includes(l.text));
    for (let i = 0; i < marks.length; i++) for (let j = i + 1; j < marks.length; j++) assert.ok(!overlap(marks[i], marks[j]), `${a}/${b}: ${marks[i].text} and ${marks[j].text}`);
  }
  for (const patch of [{ cnTy: 0 }, { cnTy: 1, cnWs1: 9, cnWs2: 8, cnWth: 90 }, { cnTy: 2, cnUc: 9, cnUa: 70, cnUb: 60 }]) {
    const { b, labels, toS } = screenRender('c5-3', patch, 'problem', 390, 564, 58);
    const title = labels.find((l) => l.text === '기준 △ABC');
    assert.ok(!labels.some((l) => /합동 ✓|합동 아님/.test(l.text)), 'candidate verdict stays hidden');
    for (const other of labels.filter((l) => l !== title)) assert.ok(!overlap(title, other), 'reference title must not overlap a dimension');
    const cards = b.calls.filter((c) => c.method === 'path' && c.args[0].length === 4);
    assert.equal(cards.length, 6);
    for (const card of cards) { const p = card.args[0].map(toS); assert.ok(Math.max(...p.map((q) => q.x)) - Math.min(...p.map((q) => q.x)) > 160, 'mobile candidate card keeps readable width'); }
  }
});

test('registered scenes keep valid questions and finite geometry across all requested viewport sizes', () => {
  assert.ok(scenes.length > 0); assert.equal(new Set(scenes.map((sc) => sc.id)).size, scenes.length);
  for (const sc of scenes) {
    const s = state(sc.id);
    for (let variant = 0; variant < 40; variant++) {
      const q = question(sc.id, s);
      assert.equal(q.choices.length, 5, sc.id);
      assert.equal(q.choices.filter((c) => c.ok).length, 1, sc.id);
      assert.equal(new Set(q.choices.map((c) => c.p || c.h || c.t)).size, 5, sc.id);
      assert.ok(typeof q.key === 'string' && q.key.length > 0, sc.id + ' question identity');
      // The opaque cache key may serialize absent fields; students see only these fields.
      assert.ok(!/NaN|undefined/.test(JSON.stringify({ tag: q.tag, stem: q.stem, choices: q.choices })), sc.id + ' visible question');
      if (variant < 39) sc.cn.reroll(s);
    }
    for (const [w, h] of [[1440, 900], [820, 1180], [1024, 768], [390, 844]]) {
      for (const tab of ['explore', 'review', 'problem']) {
        const s = state(sc.id);
        for (const step of tab === 'review' ? [1, sc.steps(s).length] : [1]) {
          s.step = step;
          const r = render(sc.id, s, tab, w, h);
          assert.ok(r.b.calls.length > 2, sc.id);
          assert.ok(finite(r.b.calls), `${sc.id}/${tab}/${step}`);
          assert.ok(finite(r.b.focus), sc.id + ' focus');
          if (tab === 'problem') assert.ok(!r.texts.some((t) => /합동 ✓|합동 아님 ✗/.test(t)), sc.id + ' hides verdict');
        }
      }
    }
  }
});

test('SSS, SAS and ASA constructions reproduce independent side and angle measurements', () => {
  for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) for (let c = 1; c <= 10; c++) {
    const valid = a + b > c && b + c > a && c + a > b, tri = G.triSSS(a, b, c);
    assert.equal(!!tri, valid, `${a},${b},${c}`);
    if (tri) { close(distance(tri[1], tri[2]), a, 'BC'); close(distance(tri[0], tri[2]), b, 'CA'); close(distance(tri[0], tri[1]), c, 'AB'); }
  }
  for (let th = 25; th <= 120; th += 5) for (const b of [4, 9]) for (const c of [4, 9]) {
    const tri = G.triSAS(b, c, th); close(distance(tri[0], tri[2]), b, 'SAS side'); close(distance(tri[0], tri[1]), c, 'SAS base');
    close(-Math.atan2(tri[2].y, tri[2].x) * 180 / Math.PI, th, 'SAS included angle');
  }
  for (let A = 30; A <= 80; A += 5) for (let B = 30; B <= 80; B += 5) {
    const tri = G.triASA(6, A, B); close(-Math.atan2(tri[2].y, tri[2].x) * 180 / Math.PI, A, 'ASA A');
    close(Math.atan2(-tri[2].y, 6 - tri[2].x) * 180 / Math.PI, B, 'ASA B');
  }
});

test('triangle inequality equality is collinear, with no false triangular area', () => {
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
    const h = G.hinge(board(), [{ v: a }, { v: b }, { v: a + b }], 1);
    assert.equal(h.ok, false); close(h.tp.y, 0, 'left endpoint collinear'); close(h.tq.y, 0, 'right endpoint collinear'); close(distance(h.tp, h.tq), 0, 'endpoints meet on base');
  }
  for (const vals of [[3, 4, 5], [5, 6, 8]]) { const h = G.hinge(board(), vals.map((v) => ({ v })), 1); assert.equal(h.ok, true); close(distance(h.tp, h.tq), 0, 'valid triangle closes'); }
});

test('review steps immediately show their construction stage and exploration still plays and resets', () => {
  for (const sc of scenes.filter((sc) => sc.cn.anim && sc.cn.stepT)) {
    const s = state(sc.id), { key, dur = 6 } = sc.cn.anim;
    const actions = sc.actions(); s[key] = 0; actions.find((a) => a.id === 'play').run(s);
    sc.tick(s, dur / 2, { tab: 'explore' }); close(s[key], .5, sc.id + ' halfway');
    actions.find((a) => a.id === 'reset').run(s); assert.equal(s[key], 0); assert.equal(s.playing, false);
    for (let n = 1; n <= sc.steps(s).length; n++) { s.step = n; render(sc.id, s, 'review'); close(s[key], sc.cn.stepT(n, sc.cn.model(s)), sc.id + ' selected stage'); assert.equal(s.playing, false); }
  }
  const s = state('c1-1', { step: 3, cnT1: 0 });
  const r = render('c1-1', s, 'review'); assert.ok(r.texts.includes('Q')); assert.ok(r.texts.some((t) => /^PQ = 3/.test(t)));
});

test('the ruler label remains inside its fit range when starting the ruler scene', () => {
  for (const [w, h] of [[1440, 900], [820, 1180], [1024, 768], [390, 844]]) {
    const s = state('c1-1', { cnTool: 'ruler', cnT1: 0 }); const { b } = render('c1-1', s, 'explore', w, h);
    const label = b.calls.find((c) => c.method === 'text' && c.args[1] === '눈금 없는 자'); assert.ok(label);
    assert.ok(label.args[0].x >= b.focus.x[0] && label.args[0].x <= b.focus.x[1], 'ruler label world bounds');
  }
});

test('extreme sticks, dragged x, SSS endpoints and SAS or SSA vertices remain inside their geometry frame', () => {
  const cases = [
    ['c2-1', { cnA: 12, cnB: 12, cnC: 12 }],
    ['c2-2', { cnXa: 2, cnXb: 2, cnXx: 20 }],
    ['c2-3', { cnQ1: 12, cnQ2: 12, cnQ3: 12, cnQ4: 12 }],
    ['c3-1', { cnSa: 6, cnSb: 8, cnSc: 8, cnSphi: 175 }],
    ['c3-2', { cnMb: 9, cnMc: 4, cnMA: 120, cnMmode: 'inc' }],
    ['c3-2', { cnMb: 4, cnMc: 9, cnMA: 90, cnMmode: 'non' }]
  ];
  for (const [id, patch] of cases) {
    const { b } = render(id, state(id, patch), 'explore');
    const outside = points(b.calls).filter((p) => p.x < b.focus.x[0] - 1e-6 || p.x > b.focus.x[1] + 1e-6 || p.y < b.focus.y[0] - 1e-6 || p.y > b.focus.y[1] + 1e-6);
    assert.equal(outside.length, 0, id + ': ' + JSON.stringify(outside));
  }
});

test('SAS and ASA selections retain their correct marks in review', () => {
  for (const [condition, ticks, angleVertices] of [['SSS', 6, 0], ['SAS', 4, 2], ['ASA', 2, 4]]) {
    const r = render('c5-1', state('c5-1', { cnCond: condition, step: 1 }), 'review');
    assert.equal(r.b.calls.filter((c) => c.method === 'ticks').length, ticks, condition + ' side marks');
    const angles = r.b.calls.filter((c) => c.method === 'arc' && c.args.at(-1)?.sector);
    assert.equal(angles.length, angleVertices, condition + ' angle marks');
  }
});

test('current angle and congruence candidates are identical across explore, review and problem', () => {
  for (let A = 30; A <= 80; A += 5) for (let B = 30; B <= 80; B += 5) {
    const s = state('c5-2', { cnEA: A, cnEB: B }), m = model('c5-2', s);
    assert.equal(m.pk.A, A); assert.equal(m.pk.B, B); assert.equal(parseFloat(answer('c5-2', s).p), 180 - A - B);
  }
  const sc = by('c5-3'), s = state(sc.id);
  for (let n = 0; n < 80; n++) {
    const m = model(sc.id, s); assert.equal(m.pset, m.set); assert.equal(m.pk.ty, m.ty);
    const sideKey = (tri) => [distance(tri[0], tri[1]), distance(tri[1], tri[2]), distance(tri[2], tri[0])].sort((a, b) => a - b);
    const baseSides = sideKey(m.set.base.pts);
    for (const c of m.set.cands) { const side = sideKey(c.dsc.pts), actual = side.every((x, i) => Math.abs(x - baseSides[i]) < 1e-6); assert.equal(c.ok, actual); }
    for (const key of sc.controls(s)) { assert.ok(s[key] >= params[key].min && s[key] <= params[key].max, `${key}=${s[key]}`); }
    sc.cn.reroll(s);
  }
});

test('dependent length controls and exact equal-area rectangle labels remain consistent', () => {
  const s = state('c6-2', { cnHL: 4, cnHd: 8 }); params.cnHL.onInput(s); assert.equal(s.cnHd, 3); assert.equal(model('c6-2', s).d, s.cnHd);
  const sq = state('c6-3', { cnKa: 4, cnKe: 5 }); params.cnKa.onInput(sq); assert.equal(sq.cnKe, 4); assert.equal(model('c6-3', sq).e, sq.cnKe);
  const r = render('c4-2', state('c4-2', { cnOmode: 'area', cnRw: 6, cnRh: 4, cnRw2: 7 }), 'explore');
  assert.ok(r.texts.includes('24/7')); assert.ok(!r.texts.includes('3.4'));
  const measured = render('c6-1', state('c6-1', { cnGa: 5, cnGb: 4 }), 'explore').v;
  assert.ok(measured.readouts.find((r) => r.label === '∠BDC = ∠AEC').value.startsWith('≈ '));
  assert.ok(measured.formula.includes('\\approx'));
});

test('hidden-congruence coordinate verifiers agree with independently expected lengths and angles', () => {
  for (let a = 3; a <= 7; a++) for (let b = 3; b <= 7; b++) {
    const s = state('c6-1', { cnGa: a, cnGb: b }), m = model('c6-1', s);
    close(distance(m.B, m.D), distance(m.A, m.E), 'two equilateral triangles BD=AE'); close(m.apb, 60, 'intersection angle');
  }
  for (let L = 4; L <= 9; L++) for (let d = 1; d < L; d++) {
    const s = state('c6-2', { cnHL: L, cnHd: d }), { g } = model('c6-2', s);
    close(distance(g.C, g.E), d, 'CE=BD'); close(by('c6-2').cn.verify(s).ans[1], 120, 'DCE=120');
  }
  for (let th = 15; th <= 75; th += 5) {
    const s = state('c6-3', { cnKth: th }), g = model('c6-3', s).g;
    close(distance(g.B, g.E), distance(g.D, g.G), 'square BE=DG');
    const u = { x: g.E.x - g.B.x, y: g.E.y - g.B.y }, v = { x: g.G.x - g.D.x, y: g.G.y - g.D.y };
    close(u.x * v.x + u.y * v.y, 0, 'perpendicular connecting lines');
  }
  for (const [mode, bae, aed] of [['in', 75, 150], ['out', 15, 30]]) {
    const m = model('c6-4', state('c6-4', { cnJm: mode })); close(m.bae, bae, 'BAE'); close(m.aed, aed, 'AED'); close(distance(m.g.A, m.g.E), distance(m.g.D, m.g.E), 'AE=DE');
  }
});

test('generated length, angle, counting and correspondence answers match independent calculations', () => {
  const valid = (a, b, c) => a + b > c && b + c > a && c + a > b;
  for (const id of ['c2-1', 'c2-2', 'c2-3', 'c4-1', 'c4-3', 'c6-1', 'c6-2', 'c6-3', 'c6-4']) {
    const sc = by(id), s = state(id);
    for (let n = 0; n < 64; n++) {
      const pk = model(id, s).pk, q = question(id, s), selected = q.choices.find((c) => c.ok);
      let expected;
      if (id === 'c2-1') {
        for (const choice of q.choices) assert.equal(!!choice.ok, valid(pk.a, pk.b, parseFloat(choice.p)) === (pk.kind === 1));
      } else if (id === 'c2-2') {
        const candidates = Array.from({ length: 50 }, (_, i) => i + 1).filter((x) => valid(pk.a, pk.b, x));
        expected = pk.kind === 0 ? candidates.length : pk.kind === 1 ? Math.max(...candidates) : Math.min(...candidates);
      } else if (id === 'c2-3') {
        expected = 0;
        for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) for (let c = b + 1; c < 4; c++) if (valid(pk.v[a], pk.v[b], pk.v[c])) expected++;
      } else if (id === 'c4-1') {
        const point = (i) => 'DEF'[pk.p[i]], letters = (selected.h || selected.p || selected.t).replace(/[^A-F]/g, '');
        const want = pk.kind === 1 ? [[0, 1], [1, 2], [2, 0]][pk.q].map(point).sort().join('') : point(pk.q);
        assert.equal(letters.split('').sort().join(''), want);
      } else if (id === 'c4-3') expected = pk.kind === 0 ? (pk.n - pk.m) / pk.k : (pk.r - pk.q) / pk.p;
      else if (id === 'c6-1') expected = pk.kind === 0 ? 60 - pk.y : [60, 120, 60, 120][pk.q];
      else if (id === 'c6-2') expected = pk.kind === 2 ? 120 : pk.L - pk.c;
      else if (id === 'c6-3') expected = pk.kind === 0 ? (pk.n - pk.m) / pk.k : (pk.th - pk.q) / pk.p;
      else if (id === 'c6-4') expected = (pk.m === 'in' ? [75, 150, 15, 75] : [15, 30, 75, 15])[pk.q];
      if (expected !== undefined) close(parseFloat(selected.p), expected, `${id} variant ${n}`);
      sc.cn.reroll(s);
    }
  }
});

test('formulas and answer feedback follow the current stage and question', () => {
  for (const sc of scenes) {
    const s = state(sc.id); const v = render(sc.id, s, 'review').v;
    assert.ok(!v.formula, sc.id + ' no final formula in first review step');
  }
  const id = 'c5-2', sc = by(id), s = state(id), q = question(id, s);
  s.cnPick = { key: `${id}|${q.key}|0`, idx: q.choices.findIndex((c) => c.ok) }; s.revealed = true;
  s.step = sc.steps(s).length;
  s.cnEA += 5; render(id, s, 'problem'); assert.equal(s.cnPick, null); assert.equal(s.revealed, false); assert.equal(s.step, 0);
  // Opening the built-in answer panel does not set cnPick.
  const manual = state(id); render(id, manual, 'problem'); manual.revealed = true; manual.step = sc.steps(manual).length;
  manual.cnEB += 5; render(id, manual, 'problem'); assert.equal(manual.revealed, false); assert.equal(manual.step, 0);
  // Pure progress changes keep the current answer and selected review step.
  manual.revealed = true; manual.step = 2; manual.cnCt = .7;
  render(id, manual, 'explore'); assert.equal(manual.revealed, true); assert.equal(manual.step, 2);
});
