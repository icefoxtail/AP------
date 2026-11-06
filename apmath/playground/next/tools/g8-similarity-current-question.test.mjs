/** Current-question math regression; drawing commands do not replace real browser review.
 * node tools/g8-similarity-current-question.test.mjs [--baseline SHA]
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url), here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../../..');
const unit = 'apmath/playground/next/labs/g8-similarity', baselineAt = process.argv.indexOf('--baseline'), baseline = baselineAt < 0 ? null : process.argv[baselineAt + 1];
const katex = require(path.join(root, 'apmath/playground/next/kit/vendor/katex/katex.min.js'));
const context = { window: {}, console, document: { documentElement: { dataset: {} }, getElementById: () => true, addEventListener() {} } };
vm.createContext(context);
for (const f of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 'solutions']) {
  let code;
  if (baseline) { try { code = execFileSync('git', ['show', `${baseline}:${unit}/${f}.js`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { if (f === 'solutions') continue; throw e; } }
  else code = fs.readFileSync(path.join(root, unit, f + '.js'), 'utf8');
  vm.runInContext(code, context, { filename: f + '.js' });
}
const G = context.window.APL_SM, groups = context.window.APL_SM_GROUPS, scenes = groups.flatMap(x => x.scenes), get = id => scenes.find(s => s.id === id);
const close = (a, b, why, tol = 1e-8) => assert.ok(Number.isFinite(a) && Math.abs(a - b) < tol * Math.max(1, Math.abs(b)), `${why}: ${a} != ${b}`);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a), ratio = (a, b) => { const d = gcd(a, b); return `${a / d}:${b / d}`; };
function oracle(id, p) {
  switch (id) {
    case 'sm1-corr': return (p.kind === 2 ? 16 : [6, 5, 2, 3][p.ask]) * p.n;
    case 'sm1-solid': { const b = { tet: [4, 3, 2], box: [3, 2, 2], cyl: [2, 4] }[p.type]; return p.type === 'tet' ? b.reduce((s, v, i) => s + (i === p.given ? 0 : v * p.n), 0) : b[p.ask] * p.n; }
    case 'sm1-len': return (p.ask === 0 ? p.p : p.q) * p.n;
    case 'sm1-always': { const a = ['tri', 'sq', 'circ', 'pent', 'rti'], t = p.items.find(t => p.askAlways ? a.includes(t) : !a.includes(t)); return { tri: '정삼각형', sq: '정사각형', circ: '원', pent: '정오각형', rti: '직각이등변삼각형', rec: '직사각형', rho: '마름모', iso: '이등변삼각형', par: '평행사변형', trp: '사다리꼴', rtr: '직각삼각형' }[t]; }
    case 'sm2-tile': return p.kind === 0 ? p.q ** 2 * p.c : p.kind === 1 ? ratio(p.p ** 2, p.q ** 2) : ratio(p.p, p.q);
    case 'sm2-cube': return p.kind === 0 ? p.k ** 3 : ratio(p.p ** 2, p.q ** 2);
    case 'sm2-solid': return [22 * p.n ** 2, 6 * p.n ** 3, ratio(p.m ** 3, p.n ** 3), ratio(p.m ** 2, p.n ** 2)][p.kind];
    case 'sm2-cone': { const [a, b, c] = [p.h1 ** 3, (p.h1 + p.h2) ** 3 - p.h1 ** 3, (p.h1 + p.h2 + p.h3) ** 3 - (p.h1 + p.h2) ** 3]; const d = gcd(gcd(a, b), c); return p.kind === 0 ? [a, b, c].map(x => x / d).join(':') : b * p.c; }
    case 'sm3-par': return p.kind === 0 ? p.r * p.m : p.kind === 2 ? 3 * p.k : p.r * (p.m + p.k);
    case 'sm3-flip': return p.kind === 0 ? 3 * p.n - 2 * p.m : p.r * p.n;
    case 'sm3-rot': return p.kind === 0 ? 4 * p.m : 5 * p.n;
    case 'sm3-sas': return p.kind === 0 ? 'SAS' : p.q * (p.n - p.m);
    case 'sm3-multi': return p.r * [p.a, p.a + p.bb, p.a + p.bb + p.c][p.kind];
    case 'sm3-ssa': { if (p.kind === 1) return Array.from({ length: p.c + 1 }, (_, n) => n).filter(n => n > p.c / 2 && n < p.c).length; const disc = p.a ** 2 - (p.c * .5) ** 2, proj = p.c * Math.sqrt(3) / 2; if (disc < 0) return 0; return [...new Set([proj - Math.sqrt(disc), proj + Math.sqrt(disc)])].filter(x => x > 1e-8).length; }
    case 'sm3-foldrect': { const [w, h, bf] = (p.typ === 'a' ? [8, 10, 6] : [9, 15, 12]).map(v => v * p.j); const ce = bf * (h - bf) / w; return p.kind === 0 ? ce : w - ce; }
    case 'sm3-foldequi': { const [bd, bf] = p.flip ? [9, 24] : [16, 6]; const ce = bf * (30 - bf) / bd; return p.kind === 0 ? ce : 30 - ce; }
    case 'sm3-trap': return p.kind === 0 ? p.a * p.bb * p.c : p.bb ** 2 * p.c;
    case 'sm4-conv': { const d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1); return [p.q * (p.N - d), p.rr * d, (p.q + p.rr) * d][p.kind]; }
    case 'sm4-x': return p.kind === 0 ? p.r * p.n : 2 * p.m;
    case 'sm4-ef': { const a = p.m * (p.m + p.n), b = p.n * (p.m + p.n); return a * b / (a + b) * (p.kind === 0 ? 2 : 1); }
    case 'sm4-mid': return [p.r, 2 * p.r, p.p + p.q + p.r][p.kind];
    case 'sm4-four': return p.kind === 0 ? (6 + 8 + 10) * p.t / 2 : (6 * p.t) * (8 * p.t) / 2 / 4;
    case 'sm4-vari': return p.kind === 0 ? p.a + p.bb : p.bb;
    case 'sm4-bis': return p.kind === 0 ? p.m : p.kind === 1 ? p.n : ratio(p.m, p.n);
    case 'sm4-bisx': return p.kind === 0 ? 2 * p.n : 2 * (p.n + p.g0);
    case 'sm5-lmn': return [p.bb * p.u, p.bb, p.a * p.u][p.kind];
    case 'sm5-trap': return p.kind === 0 ? p.a + p.m * p.t : p.a + (p.m + p.n) * p.t;
    case 'sm5-tmid': return [p.a0 + p.b0, 2 * p.b0, p.b0 - p.a0][p.kind];
    case 'sm6-trio': return p.kind === 0 ? 'angle C' : 'CH';
    case 'sm6-ab2': return p.kind === 0 ? p.b ** 2 + p.b * p.c : (15 * p.t) ** 2 / (25 * p.t);
    case 'sm6-ac2': return p.kind === 0 ? p.c ** 2 + p.b * p.c : (20 * p.t) ** 2 / (25 * p.t);
    case 'sm6-ah2': return p.kind === 0 ? p.b * p.c : (12 * p.t) ** 2 / (9 * p.t);
    case 'sm6-area': return (15 * p.t) * (20 * p.t) / ((p.kind === 0 ? 25 : 12) * p.t);
    case 'sm7-shadow': return p.kind === 0 ? p.h * p.k : p.s;
    case 'sm7-river': return p.kind === 0 ? p.m * p.w : p.n * p.u;
    case 'sm8-proof': return p.kind === 1 ? p.s : p.t;
    case 'sm8-six': return [p.u, 6 * p.u, 2 * p.u][p.kind];
    case 'sm8-gg': return p.kind === 0 ? 2 * p.k : 6 * p.k;
    case 'sm8-chain': return p.kind === 0 ? p.c : 18 * p.c;
    default: assert.fail(id);
  }
}
function checkText(t, why) {
  if (!t) return;
  assert.doesNotMatch(t, /undefined|NaN|Infinity|\[object Object\]|\\sqrt|√/, why);
  assert.equal((t.match(/\$/g) || []).length % 2, 0, why + ' delimiters');
  for (const m of t.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => katex.renderToString(m[1], { throwOnError: true, strict: false }), why + ': ' + m[1]);
}

test('all review text renders after the shell HTML-escape and math-parser pipeline', () => {
  // Raw TeX parsing alone misses G\' -> G&#39; in apl-shell._buildReview.
  // Load the real shared renderer, then apply the exact review-step pipeline.
  const htmlContext = { window: { katex }, URLSearchParams, location: { search: '' }, document: { documentElement: { setAttribute() {} } } };
  vm.createContext(htmlContext);
  vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-core.js'), 'utf8'), htmlContext);
  const APLab = htmlContext.window.APLab;
  const renderStep = text => APLab.renderMath(APLab.esc(String(text).replace(/^Step\s*\d+\s*·\s*/, '')).replace(/&amp;/g, '&'));
  assert.match(renderStep("$GG'=8$"), /katex-error/, 'negative control must reproduce the browser failure');
  for (const sc of scenes) for (const seed of [1, 17, 83, 997]) {
    const s = {}; sc.enter(s); s.smPk = sc.sm.gen(seed);
    sc.steps(s).forEach((step, i) => {
      const html = renderStep(step), why = `${sc.id}|${seed}|step ${i + 1}`;
      assert.doesNotMatch(html, /katex-error/, why);
      assert.equal((html.match(/class="katex"/g) || []).length, (step.match(/\$[^$]+\$/g) || []).length, why + ': all formulas rendered');
    });
  }
  for (const id of ['sm8-gg', 'sm8-chain']) for (const kind of [0, 1]) {
    const sc = get(id), s = {}; sc.enter(s); s.smPk = { ...sc.sm.gen(17), kind };
    assert.doesNotMatch(sc.steps(s).map(renderStep).join(''), /katex-error/, `${id}: kind ${kind}`);
  }
});
function board(width = 390, height = 460) {
  const log = [], b = { W: width, H: height, k: 35, fs: 1, pad: .02, thumb: false, insets: { left: 0, right: 0, top: 0, bottom: 0 }, log, toS(p) { return { x: width / 2 + p.x * this.k, y: height / 2 + p.y * this.k }; } };
  for (const name of ['text', 'path', 'circle', 'arc', 'point', 'ticks', 'right', 'handle']) b[name] = (...args) => {
    const point = p => assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `${name}: missing/non-finite endpoint`);
    if (name === 'path') { assert.ok(Array.isArray(args[0])); args[0].forEach(point); }
    else if (name === 'handle') point(args[1]);
    else { point(args[0]); if (name === 'ticks' || name === 'right') point(args[1]); if (name === 'right') point(args[2]); }
    const inspect = x => { if (typeof x === 'number') assert.ok(Number.isFinite(x), `${name}: non-finite`); else if (x && typeof x === 'object') Object.values(x).forEach(inspect); };
    args.forEach(inspect); log.push({ name, args }); return b;
  };
  return b;
}

function layoutBoard(width = 390, height = 324) {
  const b = board(width, height); b.insets.bottom = 58;
  Object.defineProperty(b, 'k', { get() {
    if (!this.focus) return 35;
    const w = this.W - this.insets.left - this.insets.right, h = this.H - this.insets.top - this.insets.bottom, p = this.pad * Math.min(w, h);
    return Math.min((w - 2 * p) / (this.focus.x[1] - this.focus.x[0]), (h - 2 * p) / (this.focus.y[1] - this.focus.y[0]));
  } });
  b.toS = function (p) { return { x: this.W / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k, y: (this.H - this.insets.bottom) / 2 + (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k }; };
  return b;
}
const labelCenter = (b, entry) => { const [p, , o] = entry.args, s = b.toS(p); return { x: s.x + (o.dx || 0), y: s.y + (o.dy || 0) }; };

test('mobile rotated shared vertices and centroid-copy point names stay outside the small figures', () => {
  const sc = get('sm3-rot'), s = {}; sc.enter(s);
  const inside = (p, a, c, d) => { const sign = (u, v, w) => (v.x - u.x) * (w.y - u.y) - (v.y - u.y) * (w.x - u.x); const x = [sign(a, c, p), sign(c, d, p), sign(d, a, p)]; return x.every(v => v > 1e-8) || x.every(v => v < -1e-8); };
  for (const angle of [0, 30, 90, 120, 180, 210, 270, 330, 360]) for (const progress of [0, .5, 1]) {
    Object.assign(s, { smOrot: angle, smOt: progress }); const b = layoutBoard(); sc.draw(b, s, {}, { tab: 'explore' });
    const g = sc.sm.model(s), name = b.log.find(x => x.name === 'text' && x.args[1] === 'A'), center = labelCenter(b, name);
    for (const tri of [[g.A, g.B, g.C], [g.A, g.D, g.E]]) assert.ok(!inside(center, ...tri.map(p => b.toS(p))), `${angle}|${progress}: A must be outside both triangles`);
  }
  Object.assign(s, { smOrot: 210, smOt: 0 }); const b = layoutBoard(); sc.draw(b, s, {}, { tab: 'explore' });
  const g = sc.sm.model(s), ys = [g.A, g.B, g.C, g.D, g.E].map(p => b.toS(p).y);
  assert.ok(Math.max(...ys) - Math.min(...ys) >= 190, 'short mobile board must retain a large rotated diagram');
  const cp = get('sm8-proof'), state = {}; cp.enter(state);
  for (const progress of [0, .25, .5, .75, 1]) {
    state.smGr = progress; const b = layoutBoard(); cp.draw(b, state, {}, { tab: 'explore' });
    const right = name => b.log.filter(x => x.name === 'text' && x.args[1] === name).sort((a, c) => c.args[0].x - a.args[0].x)[0];
    const center = labelCenter(b, right('G'));
    for (const name of ['D', 'E']) assert.ok(G.dist(center, labelCenter(b, right(name))) >= 25, `${progress}: copy G and ${name} must read as separate names`);
  }
});

test('parallel-line auxiliary names stay separate from the given segment lengths', () => {
  const sc = get('sm5-lmn'), s = {}; sc.enter(s); s.smPk = { seed: 1, a: 4, bb: 2, u: 2, kind: 0 }; s.step = 5;
  const b = layoutBoard(390, 412); sc.draw(b, s, {}, { tab: 'review' });
  const m = b.log.find(x => x.name === 'text' && x.args[1] === 'M'), length = b.log.find(x => x.name === 'text' && x.args[1] === '8');
  assert.ok(m && length);
  assert.ok(G.dist(labelCenter(b, m), labelCenter(b, length)) >= 28, 'M and 8 cannot form one apparent M8 label');
});

test('EF and river inverse ratios keep active smaller triangles sky and larger triangles green', () => {
  for (const id of ['sm4-ef', 'sm7-river']) for (const [m, n] of [[1, 3], [2, 3], [3, 1], [3, 2]]) for (const kind of [0, 1]) for (const [tab, step] of [['problem', 0], ['explore', 0], ['review', 2], ['review', 3], ['review', 4], ['review', 5]]) {
    const sc = get(id), s = {}; sc.enter(s); s.smPk = { ...sc.sm.gen(1), m, n, u: 2, w: 3, kind };
    Object.assign(s, { smEm: m, smEn: n, smRm: m, smRn: n, smRu: 2, smRw: 3, step });
    const b = board(); sc.draw(b, s, {}, { tab });
    const fills = b.log.filter(x => x.name === 'path' && x.args[0].length === 3 && ['sky', 'green'].includes(x.args[1]?.fill));
    const sky = fills.filter(x => x.args[1].fill === 'sky').map(x => G.polyArea(x.args[0])), green = fills.filter(x => x.args[1].fill === 'green').map(x => G.polyArea(x.args[0]));
    assert.ok(sky.length && green.length, `${id}|${tab}|${step}: both comparison figures remain`);
    assert.ok(Math.max(...sky) < Math.min(...green), `${id}|${m}:${n}|${tab}|${step}: actual area-color order`);
    const g = id === 'sm4-ef' ? G.geo.efGeo(m, n) : G.geo.rvGeo(m, n, 2, 3);
    const entries = id === 'sm4-ef' ? [[g.A, g.D, m <= n ? 'sky' : 'green'], [g.B, g.C, m <= n ? 'green' : 'sky']] : [[g.Q, g.D, m <= n ? 'sky' : 'green'], [g.A, g.E, m <= n ? 'green' : 'sky']];
    for (const [a, c, color] of entries) {
      const midpoint = G.mid(a, c), label = b.log.find(x => x.name === 'text' && G.dist(x.args[0], midpoint) < 1e-8 && /^\d+$/.test(x.args[1]));
      assert.equal(label?.args[2].color, color, `${id}|${m}:${n}|${tab}|${step}: matching dimension color`);
    }
  }
});

test('current rectangle problem survives exploration changes (baseline regression)', () => {
  const sc = get('sm1-len'), s = {}; sc.enter(s); s.smPk = sc.sm.gen(17);
  const before = JSON.stringify(sc.steps(s)); Object.assign(s, { smM2: 1, smN2: 5, smP: 4, smQ: 3 });
  assert.equal(JSON.stringify(sc.steps(s)), before, 'solution must read the generated problem, not exploration sliders');
  assert.equal(sc.sm.solution(s).answer, oracle(sc.id, s.smPk));
});

test('all 39 scenes: 64 generated questions, independent answers, exact text, state isolation', () => {
  assert.equal(scenes.length, 39);
  for (const sc of scenes) for (let seed = 1; seed <= 64; seed++) {
    const s = {}; sc.enter(s); s.smPk = sc.sm.gen(seed * 997); const q = sc.sm.questionOf(s), sol = sc.sm.solution(s), expected = oracle(sc.id, s.smPk);
    assert.equal(sol.answer, expected, `${sc.id}|${seed}: solution arithmetic`); assert.equal(sol.key, q.key); assert.ok(sol.steps.length >= 5, sc.id);
    assert.equal(q.choices.length, 5, sc.id); assert.equal(q.choices.filter(x => x.ok).length, 1, sc.id);
    const normalized = q.choices.map(c => {
      const t = String(c.t ?? c.h).replace(/\$|\s/g, '');
      if (/^\d+(?::\d+)+$/.test(t)) { const ns = t.split(':').map(Number), d = ns.reduce(gcd); return ns.map(x => x / d).join(':'); }
      return t;
    });
    assert.equal(new Set(normalized).size, 5, sc.id + ': equivalent duplicate choices');
    const right = q.choices.find(x => x.ok);
    if (typeof expected === 'number') close(Number(right.t ?? right.h?.replace('개', '')), expected, sc.id + ': answer choice');
    else if (/^\d+(?::\d+)+$/.test(expected)) assert.equal((right.h || right.t).replace(/\$|\s/g, ''), expected, sc.id);
    else if (expected === 'SAS') assert.match(right.h || right.p, /SAS/);
    else if (expected === 'angle C') assert.match(right.h, /\\angle C/);
    else if (expected === 'CH') assert.match(right.h, /\\overline\{CH\}/);
    else assert.equal(right.h, expected, sc.id);
    for (const text of [q.stem, q.html, ...sol.steps, ...q.choices.flatMap(x => [x.h, x.t && '$' + x.t + '$', x.hint])]) checkText(text, `${sc.id}|${seed}`);
    const original = JSON.stringify(sc.steps(s)), saved = JSON.stringify(s.smPk);
    for (const key of Object.keys(s)) if (key.startsWith('sm') && key !== 'smSeed' && typeof s[key] === 'number') s[key] += .13;
    assert.equal(JSON.stringify(sc.steps(s)), original, sc.id + ': exploration contamination');
    for (const tab of ['problem', 'review']) { const v = sc.view(s, { tab }); assert.equal(v.formula, ''); assert.equal(v.readouts.length, 0); }
    assert.equal(JSON.stringify(s.smPk), saved, sc.id + ': current question mutation');
  }
});

test('all drawing commands: first step equals the problem; all steps finite at four sizes', () => {
  for (const sc of scenes) for (const seed of [1, 17, 83, 997]) {
    const s = {}; sc.enter(s); s.smPk = sc.sm.gen(seed); s.step = 1;
    for (const [w, h] of [[1000, 650], [820, 740], [750, 510], [390, 460]]) {
      const problem = board(w, h), first = board(w, h); sc.draw(problem, s, {}, { tab: 'problem' }); sc.draw(first, s, {}, { tab: 'review' });
      assert.equal(JSON.stringify(first.log), JSON.stringify(problem.log), `${sc.id}|${seed}: first drawing changed the givens`);
      for (let step = 2; step <= sc.steps(s).length; step++) { s.step = step; const b = board(w, h); assert.doesNotThrow(() => sc.draw(b, s, {}, { tab: 'review' }), `${sc.id}|${seed}|${step}`); assert.ok(b.log.length > 5); }
      s.step = 1;
    }
    const b = board(); assert.doesNotThrow(() => sc.draw(b, s, {}, { tab: 'explore' }), sc.id);
  }
});

test('exploration geometry: rectangle similarity, true rhombus, apex angle, medial correspondence, SSA', () => {
  const sc = get('sm1-always'), s = {}; sc.enter(s);
  for (let k = 1; k <= 3; k++) for (let q = -1; q <= 2; q++) {
    Object.assign(s, { smFam: 'rec', smK2: k, smRq: q }); const m = sc.sm.model(s), left = G.geo.famPts('rec', 1, 0, m.q1), right = G.geo.famPts('rec', k, 6, q);
    const ar = G.dist(left[0], left[1]) / G.dist(left[1], left[2]), br = G.dist(right[0], right[1]) / G.dist(right[1], right[2]);
    assert.equal(m.ok, Math.abs(ar - br) < 1e-9, 'rectangle actual ratios vs status');
  }
  for (const angle of [30, 60, 100, 130]) {
    const rho = G.geo.famPts('rho', 2, 0, angle), side = G.dist(rho[0], rho[1]); rho.forEach((p, i) => close(G.dist(p, rho[(i + 1) % 4]), side, 'rhombus four equal sides'));
    const iso = G.geo.famPts('iso', 2, 0, angle); close(G.angBetween(iso[2], iso[0], iso[1]), angle, 'isosceles actual apex angle');
  }
  const g = G.geo.fourGeo(2); close(G.dist(g.D, g.E), G.dist(g.A, g.C) / 2, 'DE corresponds AC'); close(G.dist(g.E, g.F), G.dist(g.A, g.B) / 2, 'EF corresponds AB');
  for (const c of [6, 7, 10, 13]) for (const a of [c / 2 - .1, c / 2, c / 2 + .1, c - .1, c, c + .1]) assert.equal(G.geo.ssaGeo(a, c, 30).cnt, a < c / 2 ? 0 : a === c / 2 || a >= c ? 1 : 2);
});

test('coordinate area identities, bisector construction, distinct midpoint ticks, fraction bounds', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const p = get('sm3-trap').sm.gen(seed), g = G.geo.trapGeo(p.a, p.bb, p.c);
    close(G.polyArea([g.A, g.O, g.D]), g.S1, 'top triangle actual area'); close(G.polyArea([g.B, g.O, g.C]), g.S4, 'bottom triangle actual area');
    const z = get('sm4-bis').sm.gen(seed), h = G.geo.bisGeo(z.m, z.n);
    close(G.dist(h.A, h.E), G.dist(h.A, h.C), 'bisector proof AE = AC'); close(G.cross(G.sub(h.E, h.C), G.sub(h.D, h.A)), 0, 'CE parallel AD');
  }
  const sc = get('sm4-vari'), s = {}; sc.enter(s); const b = board(); sc.draw(b, s, {}, { tab: 'problem' });
  const ticks = b.log.filter(x => x.name === 'ticks').map(x => x.args[2].count); assert.deepEqual(ticks, [1, 1, 2, 2, 3, 3, 4, 4]);
  assert.ok(G.labelMetrics('\\frac{1234}{5}', 16).width > G.labelMetrics('\\frac{1}{5}', 16).width); assert.ok(G.labelMetrics('\\frac{1}{18}', 16).height > 30);
});

test('midpoint-quadrilateral overlays use both actual diagonal-corresponding segments', () => {
  const sc = get('sm4-vari'), s = {}; sc.enter(s); s.step = 3;
  const p = s.smPk, g = G.geo.vGeo(p.a, p.bb, p.th), b = board();
  sc.draw(b, s, {}, { tab: 'review' });
  const match = (a, c) => Math.abs(a.x - c.x) < 1e-9 && Math.abs(a.y - c.y) < 1e-9;
  assert.ok(b.log.some(x => x.name === 'path' && x.args[1]?.color === 'sky' && x.args[0].length === 2 && match(x.args[0][0], g.H) && match(x.args[0][1], g.Gp)), 'HG must highlight the real fourth midpoint');
  assert.throws(() => board().path([g.H, undefined], {}), /missing\/non-finite endpoint/);
});

test('SAS and X-shaped similarity reserve different arc marks for unequal angle groups', () => {
  for (const id of ['sm3-sas', 'sm4-x']) for (const seed of [63, 3102, 17, 997]) {
    const sc = get(id), s = {}; sc.enter(s); s.smPk = sc.sm.gen(seed);
    for (const tab of ['problem', 'explore', 'review']) for (const step of tab === 'review' ? [2, 3, 5] : [0]) {
      s.step = step; const b = board(); sc.draw(b, s, {}, { tab });
      const angles = [];
      for (const x of b.log) if (x.name === 'arc') {
        const [v, r, from, to, o] = x.args;
        if (o.color && o.width === 2.4) angles.push({ color: o.color, rings: 1, value: Math.abs(to - from), v, from, to });
        else if (o.color && o.width === 2.2) { const a = angles.at(-1); if (a && a.v.x === v.x && a.v.y === v.y && a.from === from && a.to === to) a.rings++; }
      }
      const groups = new Map();
      for (const a of angles) { const key = a.color + ':' + a.rings; if (groups.has(key)) close(a.value, groups.get(key), `${id}|${seed}|${tab}|${step}: false equality mark ${key}`); else groups.set(key, a.value); }
    }
  }
});

test('rhombus similarity allows a cyclic change of corresponding vertices', () => {
  const sc = get('sm1-always'), s = {}; sc.enter(s);
  for (const k of [1, 2, 3]) for (let angle = 30; angle <= 130; angle += 10) {
    Object.assign(s, { smFam: 'rho', smK2: k, smAq: angle }); const m = sc.sm.model(s);
    const a = G.geo.famPts('rho', 1, 0, m.q1), b = G.geo.famPts('rho', k, 10, angle);
    const matches = [0, 1, 2, 3].some(shift => a.every((p, i) => {
      const j = (i + shift) % 4;
      return Math.abs(G.dist(p, a[(i + 1) % 4]) * k - G.dist(b[j], b[(j + 1) % 4])) < 1e-8 && Math.abs(G.angBetween(p, a[(i + 1) % 4], a[(i + 3) % 4]) - G.angBetween(b[j], b[(j + 1) % 4], b[(j + 3) % 4])) < 1e-8;
    }));
    assert.equal(m.ok, matches, `rhombus ${angle}° at scale ${k}`);
  }
  Object.assign(s, { smFam: 'rho', smK2: 2, smAq: 80 });
  const b = board(); sc.draw(b, s, {}, { tab: 'explore' });
  const marked = b.log.filter(x => x.name === 'arc' && x.args[4]?.color === 'rose' && x.args[4].width === 2.4);
  assert.equal(marked.length, 2); marked.forEach(x => close(Math.abs(x.args[3] - x.args[2]) * 180 / Math.PI, 100, 'corresponding obtuse corners'));
});


test('X-shaped generated inverse ratios keep smaller sky and larger green', () => {
  const sc = get('sm4-x');
  for (const [m, n] of [[1, 2], [3, 1], [3, 2]]) for (const kind of [0, 1]) for (const tab of ['problem', 'review', 'explore']) {
    const s = {}; sc.enter(s); s.smPk = { seed: 63, m, n, r: 2, kind }; Object.assign(s, { smXm: m, smXn: n, smXr: 2, step: 3 });
    const b = board(); sc.draw(b, s, {}, { tab });
    const fills = b.log.filter(x => x.name === 'path' && x.args[1]?.fill && x.args[0].length === 3 && ['sky', 'green'].includes(x.args[1].fill));
    assert.ok(fills.length >= 2);
    const sky = fills.filter(x => x.args[1].fill === 'sky').map(x => G.polyArea(x.args[0]));
    const green = fills.filter(x => x.args[1].fill === 'green').map(x => G.polyArea(x.args[0]));
    assert.ok(Math.max(...sky) < Math.min(...green), `${m}:${n}|${kind}|${tab}: incorrect area-color order`);
    const g = G.geo.xGeo(m, n, 2);
    for (const [value, color] of [[g.OC, m <= n ? 'green' : 'sky'], [g.OD, m <= n ? 'sky' : 'green']]) {
      if (kind === 0 && value === g.OD && tab !== 'explore') continue;
      assert.ok(b.log.some(x => x.name === 'text' && String(x.args[1]) === String(value) && x.args[2].color === color), `${m}:${n}|${kind}|${tab}: side label must follow its triangle`);
    }
  }
});
