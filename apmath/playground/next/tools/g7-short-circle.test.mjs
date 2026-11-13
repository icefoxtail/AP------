import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { load } from './helpers/circle-lesson-runtime.mjs';
const require = createRequire(import.meta.url), api = require('../kit/apl-g7-short-circle.js');
const plain = x => JSON.parse(JSON.stringify(x));
const near = (a, b, eps = 1e-8) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const polyLength = p => p.slice(1).reduce((s, q, i) => s + distance(p[i], q), 0);
const xValue = x => x.c[0] / x.c[1] + Math.PI * x.p[0] / x.p[1] + Math.sqrt(3) * x.s[0] / x.s[1];
const rows = value => Array.isArray(value) ? Array.from(value) : [value];
const factory = (lab, id, values = {}) => { lab.go(id); Object.assign(lab.s, plain(values)); return api.registry[`g7-circle-sector/${id}`](lab, lab.s); };
const basicVariants = {
  '1101': { th: 120, r: 8 }, '1207': { al: 50, be: 130, r: 7 }, '1607': { ph: 50, r: 9 },
  '1102': { t1: 20, t2: 70, y: 100, u: 1.5 }, '1103': { a: 2, b: 3, c: 4 }, '1106': { al: 180, be: 80, S: 108 },
  '1209': { r: 9, th: 120 }, '1210': { r: 8, th: 135 }, '1609': { r: 12, th: 150 }, '1610': { r: 8, th: 135 }, '1808': { r: 10, th: 120 },
  '1719': { n: 8 }, '1807': { cof: 150 }, '1104': { al: 60, r: 36 }, '1105': { be: 54, r: 60 }, '1809': { i: 5, r: 9 }, x01: { n: 7, r: 8, t: .65 }
};
const variants = {
  ...Object.fromEntries(Object.entries(basicVariants).map(([id, q]) => [id, Object.fromEntries(Object.entries(q).map(([k, v]) => [`b${id}_${k}`, v]))])),
  'f1-ss2': { f1_ss2_a: 10 }, 'f1-lens': { f1_lens_a: 10 }, 'f1-ex22': { f1_ex22_a: 8 }, 'f1-ring': { f1_ring_R: 9, f1_ring_r: 3, f1_ring_th: 120 },
  rot: { f02_rot_r: 5, f02_rot_th: 90, f02_rot_sw: .37 }, sj1: { f02_sj1_a: 3, f02_sj1_b: 7 }, y12: { f02_y12_p: 4, f02_y12_q: 6 },
  cc08: { f02_cc08_R: 10 }, lune13: { f02_lune13_p: 5, f02_lune13_q: 12 }, petal15: { f02_petal15_a: 10 }, nc: { f02_nc_R: 9, f02_nc_n: 5 }, ns: { f02_ns_R: 9, f02_ns_n: 5 },
  'f3-leaf-len': { f3a: 10 }, 'f3-rect-sector': { f3b: 8, f3w: 3.5 }, 'f3-two-arcs': { f3a: 12 }, 'f3-crescent': { f3e: 10 }, 'f3-four-leaf': { f3e: 8 },
  'f3-two-circles': { f3r: 8, f3k: 1.75 }, 'f3-half-sector': { f3q: 16, f3x: 60 }, 'f3-two-rects': { f3h: 5, f3o: 1.5 },
  'f4-sq12': { f4_sq12_a: 8 }, 'f4-circ2': { f4_circ2_r: 4 }, 'f4-turn': { f4_turn_r: 6, f4_turn_th: 120 }, 'f4-slide': { f4_slide_W: 14, f4_slide_r: 4 },
  'f4-slideq': { f4_slideq_W: 14, f4_slideq_H: 10, f4_slideq_r: 3 }, 'f4-swirl': { f4_swirl_R: 10 }, 'f4-inscr': { f4_inscr_r: 6 }, 'f4-ringmv': { f4_ringmv_R: 10, f4_ringmv_r: 4, f4_ringmv_th: 90 },
  'f5-sn': { f5A: 8 }, 'f5-ring': { f5A: 18, f5B: 6, f5C: 135 }, 'f5-ring240': { f5A: 6, f5B: 3, f5C: 90 }, 'f5-star': { f5A: 10 }, 'f5-lens': { f5A: 18 },
  'f5-cut': { f5A: 10, f5B: 3 }, 'f5-track': { f5A: 7, f5B: 14 }, 'f5-sq4': { f5A: 5 }, 'f5-rect': { f5A: 6, f5B: 4 }, 'f5-tri3': { f5A: 7 }, 'f5-line': { f5A: 6, f5B: 4 },
  'rl-rect': { cfg: { w: 6, h: 8, track: 3, rolls: 4 } }, 'rl-tri': { cfg: { a: 6, track: 1, rolls: 3 } }, 'rl-rtri': { cfg: { a: 5, beta: 60, track: 1, rolls: 3 } },
  'rl-turn60': { cfg: { d: 6, at: 'C', deg: 30, track: 0, rolls: 1 } }, 'rl-turn45': { cfg: { d: 12, at: 'B', deg: 30, track: 2, rolls: 1 } },
  'rl-semi': { cfg: { R: 5, rolls: 3 } }, 'rl-square': { cfg: { a: 7, track: 0, rolls: 4 } },
  'sw-square': { swA: 7, swR: 1.5 }, 'sw-rect': { swW: 8, swH: 5, swR: 1.5 }, 'sw-tri': { swA: 8, swR: 2 }, 'sw-center': { swA: 7, swR: 1.5 }, 'sw-inside': { swI: 10, swR: 1.5 },
  'gt-kennel': { gtQ: 3, gtL: 5 }, 'gt-warehouse': { gtA: 7, gtB: 3, gtL: 9 }, 'gt-tri': { gtS: 6, gtL: 8 }, 'gt-hex': { gtH: 5, gtL: 12 }, 'gt-spiral': { gtP: 4, gtK: 4 }
};
for (const route of Object.keys(api.registry)) if (route.includes('/z')) variants[route.split('/')[1]] = { csR: 9, csA: 150, csS: 120, csN: 32, csQ: 240, csT: 67, csP: 43, csD: 66 };

// Horizontal scanline integration measures arbitrary even-odd regions without
// using the production area expressions or production area-check implementation.
function xorArea(polys, n = 700) {
  const ys = polys.flat().map(p => p.y), y0 = Math.min(...ys), y1 = Math.max(...ys), dy = (y1 - y0) / n;
  let result = 0;
  for (let i = 0; i < n; i++) {
    const y = y0 + (i + .5) * dy, xs = [];
    for (const poly of polys) for (let j = 0; j < poly.length; j++) {
      const p = poly[j], q = poly[(j + 1) % poly.length];
      if ((p.y > y) !== (q.y > y)) xs.push(p.x + (q.x - p.x) * (y - p.y) / (q.y - p.y));
    }
    xs.sort((a, b) => a - b); for (let j = 0; j + 1 < xs.length; j += 2) result += (xs[j + 1] - xs[j]) * dy;
  }
  return result;
}

test('84 new routes and 95 exact labels complement the two existing circle routes', async () => {
  const lab = await load(), old = require('../kit/apl-g7-short-scenes.js');
  const existing = Object.keys(old.registry).filter(k => k.startsWith('g7-circle-sector/')).sort();
  assert.deepEqual(existing, ['g7-circle-sector/f1-star', 'g7-circle-sector/f3-leaf-area']);
  assert.equal(lab.list.length, 86); assert.equal(Object.keys(api.registry).length, 84);
  assert.deepEqual([...existing, ...Object.keys(api.registry)].sort(), Array.from(lab.list, s => `g7-circle-sector/${s.id}`).sort());
  let total = 0;
  for (const [route, create] of Object.entries(api.registry)) {
    const id = route.split('/')[1]; lab.go(id); Object.assign(lab.s, plain(variants[id]));
    Object.assign(lab.s, { rlSeed: 11, rlPick: 2, f5Seed: 13, f5Pick: 3, csdPick: 2, csdText: '147/4', csT: 63 });
    if (lab.scene.csKeys) { lab.s[lab.scene.csKeys.kseed] = 13; lab.s[lab.scene.csKeys.kpick] = { key: 'retained-current-selection', idx: 2 }; }
    const before = JSON.stringify(lab.s), plans = create(lab, lab.s); total += plans.length;
    assert.deepEqual(plans.map(p => p.legacyLabel), rows(lab.def.lessons[id]).map(p => p.label || ''), id);
    assert.deepEqual(api.lessonInfo[route], plans.map(p => ({ legacyLabel: p.legacyLabel, duration: p.duration })));
    for (const p of plans) {
      assert.equal(p.duration, 9.8); assert.ok(p.given && !/undefined|NaN/.test(p.given), `${id}: ${p.given}`);
      assert.deepEqual(p.model.sourceState, plain(lab.s));
      for (const t of [0, 1.4, 3.4, 5.6, 6.79]) assert.equal(p.frame(t, p.model).answer, false);
      assert.equal(p.frame(9.8, p.model).answer, true); assert.ok(p.frame(9.8, p.model).formula);
    }
    assert.equal(JSON.stringify(lab.s), before, `${id}: no input, answer, seed or motion changes`);
  }
  assert.equal(total, 95);
});

test('exact arithmetic preserves fractional π coefficients and avoids invented chord values', async () => {
  assert.equal(api.math.exact(13 / 2), '\\frac{13\\pi}{2}');
  assert.equal(api.math.exact(-27 / 2, 81), '81-\\frac{27\\pi}{2}');
  assert.equal(api.math.exact(0, 0, 2), '2\\sqrt{3}');
  assert.equal(api.math.rat(Math.SQRT2), null);
  const lab = await load();
  for (const deg of [30, 60, 90, 120, 180]) {
    const p = factory(lab, 'z2-segment', { csR: 9, csS: deg })[0], f = p.frame(9.8, p.model).formula;
    if (deg !== 60 && deg !== 180) assert.ok(f.includes('\\overline{AB}'), 'unlearned chord calculation remains a named length');
    else assert.ok(f.includes(deg === 60 ? '+9' : '+18'));
  }
});

test('previously checked answers and typed inputs are preserved without leaking feedback into the given', async () => {
  const lab = await load();
  for (const id of ['gt-spiral', 'sw-square', 'f5-lens', 'f5-rect', 'f3-half-sector']) {
    lab.go(id);
    if (lab.scene.csd) {
      const q = lab.scene.csd.make(plain(lab.s));
      Object.assign(lab.s, { csdSig: lab.scene.csd.sig(lab.s), csdPick: q.free ? 1 : q.ans + 1, csdText: '21' });
    } else if (lab.scene.f5Choices) {
      const correct = lab.scene.f5Choices(lab.s).find(x => x.ok);
      lab.s.f5Pick = { key: lab.scene.f5PickKey(lab.s), idx: correct.i };
    } else {
      const q = lab.scene.f3.prob(lab.scene.f3.model(lab.s, true), lab.s);
      if (q.number) Object.assign(lab.s, { f3ans: String(q.number.answer), f3chk: true });
      else lab.s.f3pick = { key: `${lab.scene.f3.id}|${q.key}|${lab.s.f3seed || 0}`, idx: q.choices.findIndex(x => x.ok) };
    }
    const before = JSON.stringify(lab.s), p = api.registry[`g7-circle-sector/${id}`](lab, lab.s)[0];
    assert.ok(!/정답이에요|다시 생각|숫자 바꾸기|π 앞의 수/.test(p.given), id);
    assert.deepEqual(p.model.sourceState, plain(lab.s)); assert.equal(JSON.stringify(lab.s), before);
  }
});

test('current sector data produce correct length, area and inverse relationships', async () => {
  const lab = await load();
  for (const [r, th] of [[3, 45], [8, 135], [9, 240]]) for (const id of ['1209', '1210', '1609', '1610', '1808']) {
    const state = { [`b${id}_r`]: r, [`b${id}_th`]: th }, plans = factory(lab, id, state), arc = 2 * Math.PI * r * th / 360, area = Math.PI * r * r * th / 360;
    near(area, r * arc / 2); near(360 * area / (Math.PI * r * r), th); near(arc * 180 / (Math.PI * th), r);
    for (const p of plans) {
      assert.equal(p.model.values.r, r); assert.equal(p.model.values.th, th);
      const answer = id === '1609' ? `x=${th}` : id === '1808' ? `r=${r}` : id === '1210' || p.legacyLabel === '호의 길이' ? api.math.exact(arc / Math.PI) : api.math.exact(area / Math.PI);
      assert.ok(p.frame(9.8, p.model).formula.includes(answer), `${id}: ${answer}`);
    }
  }
});

test('inverse sector givens hide unknowns until their proof and canvas labels retain exact fractions', async () => {
  const lab = await load(), b = lab.board, originalText = b._text;
  const drawText = (plan, t) => {
    const labels = [];
    b._text = function (x, y, value, o, screen) { labels.push(String(value)); return originalText.call(this, x, y, value, o, screen); };
    try { b.begin(); plan.draw(b, t, plan.model); b.end(); } finally { b._text = originalText; }
    assert.ok(labels.every(value => !/\\(?:frac|dfrac|pi|sqrt)/.test(value)), labels.join(', '));
    return labels;
  };
  const fromArea = factory(lab, '1210', { b1210_r: 3, b1210_th: 45 })[0];
  assert.ok(drawText(fromArea, 0).includes('S=9π/8 cm²'), 'known area is attached to the original sector');
  const angle = factory(lab, '1609', { b1609_r: 3, b1609_th: 45 })[0];
  assert.ok(drawText(angle, 0).includes('9π/8 cm²'));
  const fromArc = factory(lab, '1610', { b1610_r: 3, b1610_th: 45 })[0];
  for (const t of [0, 1.4, 3.39]) {
    const labels = drawText(fromArc, t);
    assert.ok(labels.includes('r = ?') && labels.includes('45°') && labels.includes('3π/4 cm'));
    assert.ok(!labels.includes('r=3 cm') && !labels.includes('9π/8 cm²'));
    assert.ok(!fromArc.frame(t, fromArc.model).formula.includes('r=3'));
  }
  assert.ok(drawText(fromArc, 3.4).includes('r=3 cm'), 'radius appears after its arc-equation proof');
  assert.equal(fromArc.frame(3.4, fromArc.model).answer, false, 'derived radius is an intermediate result');
  assert.ok(fromArc.frame(6.8, fromArc.model).formula.includes('\\frac{9\\pi}{8}'));
  const diameterRatio = factory(lab, '1719', { b1719_n: 6 })[0];
  assert.ok(drawText(diameterRatio, 3.4).includes('1080/7°'), 'nonterminating angle is an exact fraction');
});

test('compound-circle areas and boundaries agree with independent disk/triangle arithmetic', () => {
  for (const [a, b] of [[2, 4], [3, 7], [5, 9]]) {
    const m = api.math.compoundModel('sj1', { a, b }); near(m.p, a * (a + b) / 4); near(m.perimeter, a + b);
    const two = api.math.compoundModel('y12', { p: a, q: b }); near(two.p, a * b); near(two.perimeter, 2 * (a + b));
  }
  for (const R of [4, 6, 9]) for (const n of [2, 3, 5]) for (const id of ['nc', 'ns']) {
    const m = api.math.compoundModel(id, { R, n }), scale = id === 'nc' ? 1 : .5;
    near(m.p, scale * R * R * (1 - 1 / n)); near(m.perimeter, 4 * scale * R);
    near(xorArea(m.items.map(p => p.poly)), m.p * Math.PI, .0015);
  }
  for (const [p, q] of [[3, 4], [5, 12], [4, 7]]) {
    const m = api.math.compoundModel('lune13', { p, q }); near(m.p, 0); near(m.constant, p * q / 2);
    near(xorArea(m.items.map(x => x.poly)), p * q / 2, .004);
  }
  for (const a of [6, 8, 10]) {
    const m = api.math.compoundModel('petal15', { a }); near(m.p, a * a / 8);
    m.items.forEach(p => near(api.math.area(p.poly), Math.PI * a * a / 24, .002));
  }
});

test('native cut regions match independent area subtraction for changed radii and angles', async () => {
  const lab = await load();
  for (const id of ['f1-ss2', 'f1-lens', 'f1-ex22', 'f1-ring']) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    near(xValue(M.resX), xValue(M.wholeX) - xValue(M.partX));
    near(xorArea([M.outer, ...M.cuts.flatMap(p => p.polys)]), xValue(M.resX), .002);
    assert.ok(p.frame(9.8, p.model).formula.includes(api.math.nativeExact(M.resX)));
  }
});

test('all fill-the-gap pieces remain rigid and meet the actual target without area loss', async () => {
  const lab = await load();
  for (const id of Object.keys(variants).filter(id => id.startsWith('f4-'))) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    for (const piece of M.pieces) {
      for (const u of [0, .27, .68, 1]) api.math.piecePose(piece, u).forEach((poly, i) => {
        near(api.math.area(poly), api.math.area(piece.polys[i]));
        for (let j = 1; j < poly.length; j++) near(distance(poly[j], poly[j - 1]), distance(piece.polys[i][j], piece.polys[i][j - 1]));
        if (piece.tf.kind === 'slide') poly.forEach((v, j) => near(v.y, piece.polys[i][j].y));
      });
      api.math.piecePose(piece, 1).forEach((poly, i) => poly.forEach((v, j) => near(distance(v, piece.dst[i][j]), 0)));
    }
    near(xorArea(M.shade0), xValue(M.resX), .002);
    near(xorArea(M.target), xValue(M.resX), .002);
  }
});

test('perimeter arcs, straight segments and wrapped-circle exterior angles agree numerically', async () => {
  const lab = await load();
  for (const id of Object.keys(variants).filter(id => id.startsWith('f5-'))) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native, parts = p.model.band ? api.math.bandParts(M) : M.P;
    const sum = parts.reduce((s, x) => s + (x.kind === 'arc' ? x.rcm * Math.abs(x.a1 - x.a0) : x.cm), 0);
    near(sum, M.total.n / M.total.d * Math.PI + M.total.c);
    if (p.model.band) {
      near(parts.filter(x => x.kind === 'arc').reduce((s, x) => s + Math.abs(x.a1 - x.a0), 0), 2 * Math.PI);
      parts.filter(x => x.kind === 'seg').forEach(x => near(distance(x.p, x.q), 2 * M.r));
    }
  }
});

test('equality questions retain exploration trials separately and use the actual question conditions', async () => {
  const lab = await load();
  for (const id of ['f3-rect-sector', 'f3-half-sector', 'f3-two-circles', 'f3-two-rects']) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    assert.deepEqual(plain(M), plain(lab.scene.f3.model(plain(lab.s), true)));
    assert.deepEqual(plain(p.model.live), plain(lab.scene.f3.model(plain(lab.s), false)));
    if (id === 'f3-rect-sector') { near(M.r * M.w, Math.PI * M.r * M.r / 4); assert.ok(p.given.includes('탐구 AD=')); assert.notEqual(M.w, p.model.live.w); }
    if (id === 'f3-half-sector') { near(Math.PI * M.r * M.r / 2, Math.PI * M.dia * M.dia * M.x / 360); assert.notEqual(M.x, p.model.live.x); }
    if (id === 'f3-two-circles') { near(M.d, M.r); near(M.area, 2 * M.r * M.r); assert.notEqual(M.d, p.model.live.d); }
    if (id === 'f3-two-rects') near(M.U, (M.wA + M.wB - M.o) * M.h);
  }
});

test('rolling preserves the live selection separately and measures the primary question path with rigid motion', async () => {
  const lab = await load();
  for (const id of Object.keys(variants).filter(id => id.startsWith('rl-'))) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    assert.deepEqual(p.model.liveCfg, variants[id].cfg); assert.equal(p.model.live.N, variants[id].cfg.rolls);
    if (M.kind !== 'semi') assert.equal(p.model.live.T, variants[id].cfg.track);
    if (p.model.fallback) { assert.notDeepEqual(M.cfg, p.model.liveCfg); assert.ok(p.given.includes('탐구 조건(')); }
    else assert.deepEqual(M.cfg, variants[id].cfg);
    for (const u of [0, .1, .35, .7, 1]) {
      const pose = api.math.rollingPose(M, u);
      for (let i = 1; i < M.nOut; i++) near(distance(pose.points[0], pose.points[i]), distance(M.states[0][0], M.states[0][i]));
    }
    let measured = 0, previous = api.math.rollingPose(M, 0).points[M.T];
    for (let j = 1; j <= 2400; j++) { const point = api.math.rollingPose(M, j / 2400).points[M.T]; measured += distance(point, previous); previous = point; }
    near(measured, M.total, 2e-6);
    assert.ok(p.given.includes(`${M.kind === 'semi' ? '중심' : '점'} ${M.names[M.T]}`));
  }
  const m = api.math.rollingModel('square', { a: 7, track: 0, rolls: 4 });
  assert.ok(m.totalTex.includes('x')); assert.ok(!m.totalTex.includes('1.414'));
  const hold = api.math.rollingModel('square', { a: 4, track: 2, rolls: 3 }); near(hold.turns[1].length, 0); near(hold.total, 4 * Math.PI);
});

test('primary rolling cfg and answer agree with the actual native probCfg for all targets and fallback boundaries', async () => {
  // A test-only read-only seam calls the actual closed-over production functions.
  // Production files are unchanged; the regular Board suite loads them verbatim.
  const source = fs.readFileSync(new URL('../labs/g7-circle-sector/rolling.js', import.meta.url), 'utf8');
  const needle = 'id: spec.id, title: spec.title, short: spec.short, rl: spec,';
  assert.equal(source.split(needle).length, 2);
  const instrumented = source.replace(needle, `${needle} __shortProbCfg: (s) => probCfg(spec, s), __shortQuestionModel: (s) => buildModel(spec, probCfg(spec, s)),`);
  const lab = await load('', { 'g7-circle-sector/rolling.js': instrumented });
  const cases = [];
  for (const a of [3, 7]) for (let track = 0; track < 4; track++) for (let rolls = 1; rolls <= 4; rolls++) cases.push(['rl-square', { a, track, rolls }]);
  for (const [w, h] of [[3, 4], [6, 8]]) for (let track = 0; track < 4; track++) for (let rolls = 1; rolls <= 4; rolls++) cases.push(['rl-rect', { w, h, track, rolls }]);
  for (const id of ['rl-tri', 'rl-rtri']) for (const a of [3, 5]) for (let track = 0; track < 3; track++) for (let rolls = 1; rolls <= 3; rolls++) cases.push([id, { a, ...(id === 'rl-rtri' ? { beta: 60 } : {}), track, rolls }]);
  for (const [id, at, degrees] of [['rl-turn60', 'C', [20, 30, 45, 60, 75]], ['rl-turn45', 'B', [20, 30, 45, 60, 70]]]) for (const d of [6, 9]) for (const deg of degrees) for (const track of [0, 2]) cases.push([id, { d, at, deg, track, rolls: 1 }]);
  for (const R of [3, 9]) cases.push(['rl-semi', { R, rolls: 3 }]);
  let fallback = 0, current = 0;
  for (const [id, cfg] of cases) {
    const p = factory(lab, id, { cfg, rlSeed: 17, rlPick: 3, rlT: .63 })[0], actualCfg = lab.scene.__shortProbCfg(lab.s), native = lab.scene.__shortQuestionModel(lab.s);
    assert.deepEqual(p.model.cfg, plain(actualCfg), `${id} ${JSON.stringify(cfg)}`);
    near(p.model.native.total, native.total * Math.PI); assert.equal(p.model.native.names[p.model.native.T], native.names[native.T]);
    assert.deepEqual(p.model.liveCfg, cfg); assert.equal(lab.s.rlSeed, 17); assert.equal(lab.s.rlPick, 3); assert.equal(lab.s.rlT, .63);
    if (p.model.fallback) fallback++; else current++;
  }
  assert.ok(fallback > 20 && current > 20, 'both default-question fallback and retained-current-question branches are exercised');
});

test('swept bands and remaining rope sectors use actual radii, exterior angles and units', async () => {
  const lab = await load();
  for (const id of ['sw-square', 'sw-rect', 'sw-tri', 'sw-center']) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    near(M.C.reduce((s, c) => s + c.deg, 0), 360);
    near(M.Lc, M.per + 2 * Math.PI * M.r);
    near(M.area, M.per * 2 * M.r + Math.PI * (2 * M.r) ** 2);
    for (const u of [0, .2, .7, 1]) { const c = M.centerAt(M.Lc * u); near(Math.hypot(c.p[0] - c.contact[0], c.p[1] - c.contact[1]), M.r); }
  }
  const inside = factory(lab, 'sw-inside', variants['sw-inside'])[0].model.native;
  near(inside.area, inside.a ** 2 - (inside.a - 4 * inside.r) ** 2 - 4 * (inside.r ** 2 - Math.PI * inside.r ** 2 / 4));
  for (const id of ['gt-kennel', 'gt-warehouse', 'gt-tri', 'gt-hex', 'gt-spiral']) {
    const p = factory(lab, id, variants[id])[0], M = p.model.native;
    const coeff = M.secs.reduce((s, q) => s + q.R ** 2 * q.deg / 360, 0); near(coeff, M.area.n / M.area.d);
    if (id !== 'gt-spiral') M.order.forEach(q => { near(q.R, M.L - q.used); assert.ok(q.R > 0); });
    else M.secs.forEach((q, i) => { near(q.R, M.p * (i + 1)); near(q.deg, 60); });
    assert.ok(p.frame(9.8, p.model).formula.includes(id === 'gt-spiral' ? '\\mathrm{cm}^2' : '\\mathrm{m}^2'));
  }
});

test('production Board draws full geometry at entry and all stages at 390/1440 without modifying live state', async () => {
  const lab = await load(), b = lab.board, originalPath = b.path, originalText = b._text;
  let paths = [], labels = [];
  b.path = function (pts, o) { paths.push(Array.from(pts, p => ({ x: p.x ?? p[0], y: p.y ?? p[1] }))); return originalPath.call(this, pts, o); };
  b._text = function (x, y, value, o, screen) { labels.push({ x, y, value: String(value) }); return originalText.call(this, x, y, value, o, screen); };
  try {
    for (const width of [390, 1440]) for (const changed of [false, true]) for (const route of Object.keys(api.registry)) {
      const id = route.split('/')[1], plans = factory(lab, id, changed ? variants[id] : {}), before = JSON.stringify(lab.s);
      b.resize(width, width === 390 ? 600 : 760);
      for (const p of plans) for (const t of new Set([0, 1.4, 2.6, 3.4, 4.6, 5.6, 6.8, 9.8, ...p.stops])) {
        paths = []; labels = []; b.begin(); p.draw(b, t, p.model); b.end();
        assert.ok(paths.length > 0, `${id}/${p.legacyLabel}: geometry at ${t}`);
        for (const q of paths.flat()) assert.ok(Number.isFinite(q.x) && Number.isFinite(q.y), id);
        for (const q of labels) {
          assert.ok(!/undefined|NaN|Infinity/.test(q.value), `${id}: ${q.value}`);
          assert.ok(q.x >= 0 && q.x <= b.W && q.y >= 0 && q.y <= b.H, `${id}/${p.legacyLabel}/${width}/${t}: ${q.value} anchor (${q.x},${q.y})`);
        }
        const f = p.frame(t, p.model); assert.ok(!/undefined|NaN|Infinity/.test(f.label + f.formula));
      }
      assert.equal(JSON.stringify(lab.s), before, `${id}: drawing is read only`);
    }
  } finally { b.path = originalPath; b._text = originalText; }
});
