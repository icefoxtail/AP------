/** Current-question regressions and independent numerical oracles.
 * Usage: node tools/g9-trig-ratio-current-question.test.mjs [--root checkout]
 * Does not substitute for real Chromium/visual review.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const arg = process.argv.indexOf('--root');
const root = arg < 0 ? path.resolve(here, '../../../..') : path.resolve(process.argv[arg + 1]);
const unit = path.join(root, 'apmath/playground/next/labs/g9-trig-ratio');
const katex = require(path.join(root, 'apmath/playground/next/kit/vendor/katex/katex.min.js'));
let seed = 1;
const context = { window: {}, document: { documentElement: { dataset: {} }, getElementById() { return true; }, addEventListener() {} }, console, setTimeout() {}, Math: Object.create(Math) };
context.Math.random = () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 2 ** 32; };
vm.createContext(context);
for (const f of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']) vm.runInContext(fs.readFileSync(path.join(unit, `${f}.js`), 'utf8'), context, { filename: `${f}.js` });
const G = context.window.APL_TG, groups = context.window.APL_TG_GROUPS, scenes = groups.flatMap(g => g.scenes);
const scene = id => { const sc = scenes.find(s => s.id === id); assert.ok(sc, id); return sc; };
const close = (actual, expected, why, tol = 1e-8) => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)), `${why}: ${actual} != ${expected}`);
const rad = x => x * Math.PI / 180, sn = x => Math.sin(rad(x)), cs = x => Math.cos(rad(x)), tn = x => Math.tan(rad(x));
const ratio = (fn, opposite, adjacent) => ({ s: opposite / Math.hypot(opposite, adjacent), c: adjacent / Math.hypot(opposite, adjacent), t: opposite / adjacent })[fn];
const round4 = x => Math.round(x * 1e4) / 1e4;

// Small arithmetic reader, independent of the production exact-number engine.
// It evaluates only the numeric/ratio TeX grammar emitted by these questions.
function evaluate(tex, vars = {}) {
  const s = String(tex).replace(/\\(sin|cos|tan)\s+([A-Za-z])/g, '\\$1{$2}').replace(/\$/g, '').replace(/\^\{\\circ\}/g, '').replace(/\\(?:left|right|,|!|;|\s)/g, '').replace(/\s+/g, '').replace(/−/g, '-');
  let i = 0;
  const group = () => { const open = s[i++], end = open === '{' ? '}' : ')'; assert.ok(open === '{' || open === '(', `group in ${s}`); const v = sum(); assert.equal(s[i++], end, s); return v; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); }
    if (s[i] === '-') { i++; return -atom(); }
    let v;
    if (s[i] === '{' || s[i] === '(') v = group();
    else if (/\d|\./.test(s[i] || '')) { const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); i += m[0].length; v = Number(m[0]); }
    else if (s[i] === '\\') {
      const cmd = s.slice(++i).match(/^[a-zA-Z]+/)[0]; i += cmd.length;
      if (cmd === 'frac') { const n = group(), d = group(); v = n / d; }
      else if (cmd === 'sqrt') v = Math.sqrt(group());
      else if (cmd === 'pi') v = Math.PI;
      else if (cmd === 'overline') { const e = s.indexOf('}', i); const name = s.slice(i + 1, e); i = e + 1; assert.ok(name in vars, name); v = vars[name]; }
      else if (['sin', 'cos', 'tan'].includes(cmd)) v = { sin: sn, cos: cs, tan: tn }[cmd](atom());
      else assert.fail(`unsupported \\${cmd} in ${s}`);
    } else { const name = s[i++]; assert.ok(name in vars, `${name} in ${s}`); v = vars[name]; }
    if (s[i] === '^') { i++; v **= atom(); }
    return v;
  };
  const product = () => {
    let v = atom();
    while (i < s.length && !['+', '-', '}', ')', '='].includes(s[i])) {
      if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { i += s.startsWith('\\times', i) ? 6 : 5; v *= atom(); }
      else if (s.startsWith('\\div', i)) { i += 4; v /= atom(); }
      else if (s[i] === '*') { i++; v *= atom(); }
      else if (s[i] === '/') { i++; v /= atom(); }
      else v *= atom();
    }
    return v;
  };
  function sum() { let v = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], w = product(); v = op === '+' ? v + w : v - w; } return v; }
  const value = sum(); assert.equal(i, s.length, `unread TeX: ${s.slice(i)} in ${s}`); return value;
}
function oracle(q) {
  const m = q.solution.math, a = m.angle;
  switch (m.kind) {
    case 'ratio': return ratio(m.fn, m.ref === 'A' ? m.a : m.b, m.ref === 'A' ? m.b : m.a);
    case 'ratio-length': return m[m.ask];
    case 'swap': { const angle = Math.atan2(m.a, m.b) * 180 / Math.PI; return evaluate(m.expression, { [q.fig.names.A]: angle, [q.fig.names.B]: 90 - angle }); }
    case 'altitude-ratio': return ratio(m.fn, m.ref === 'BAH' ? m.p : m.q, m.ref === 'BAH' ? m.q : m.p);
    case 'special-side': { const v = { a: sn(m.theta), b: cs(m.theta), c: 1 }; return m.given * v[m.askedSide] / v[m.givenSide]; }
    case 'special-angle': return m.theta;
    case 'chain': return { ab: m.height / sn(m.pair[0]), ac: m.height / sn(m.pair[1]), bc: m.height / tn(m.pair[0]) + m.height / tn(m.pair[1]) }[m.askedSide];
    case 'expression': { const [a, b, c] = m.angles; return { f1: () => sn(a) + cs(b) - tn(c), f2: () => sn(a) * cs(b) + tn(c), f3: () => tn(a) * cs(b) / sn(c), f4: () => sn(a) ** 2 + cs(b) ** 2 + tn(c) }[m.form](); }
    case 'unit-circle': return m.ask === 'ang' ? m.theta : { s: sn, c: cs, t: tn }[m.fn](m.theta);
    case 'table-expression': { const [v, w] = m.angles.map((x, i) => round4({ s: sn, c: cs, t: tn }[m.functions[i]](x))); return round4(m.op === '+' ? v + w : v - w); }
    case 'table-inverse': close(round4({ s: sn, c: cs, t: tn }[m.fn](m.answer)), m.value, q.key); return m.answer;
    case 'table-side': return round4(m.length * round4({ s: sn, c: cs, t: tn }[m.fn](m.theta)));
    case 'slope': return ratio(m.fn, m.opposite, m.adjacent);
    case 'sas': return Math.sqrt(m.a ** 2 + m.c ** 2 - 2 * m.a * m.c * cs(a));
    case 'complement': return 90 - a;
    case 'tan15': return m.ask === 'cd' ? m.scale * (2 + Math.sqrt(3)) : tn(m.ask === 't15' ? 15 : 75);
    case 'tape': return m.width / sn(a) * (m.ask === 'area' ? m.width : 1);
    case 'height': { const h = m.distance / (1 / tn(m.angles[0]) + (m.same ? -1 : 1) / tn(m.angles[1])); return m.ask === 'h' ? h : h / tn(m.angles[m.ask === 'bh' ? 0 : 1]); }
    case 'tree': return m.distance * tn(a) + m.eye;
    case 'pendulum': return m.length * (1 - cs(a));
    case 'broken-tree': { const h = m.distance * tn(a), l = m.distance / cs(a); return m.ask === 'H' ? h + l : m.ask === 'h' ? h : l; }
    case 'triangle-area': return m.b * m.c * sn(a) / 2;
    case 'equilateral': return m.ask === 'a' ? m.side : m.side * Math.sqrt(3) / 2 * (m.ask === 'S' ? m.side / 2 : 1);
    case 'area-side': return 2 * m.area / (m.c * sn(a));
    case 'angle-bisector': return 2 * m.b * m.c * cs(a / 2) / (m.b + m.c);
    case 'regular-area': return m.n * m.radius ** 2 * sn(360 / m.n) / 2;
    case 'diagonal-area': return m.p * m.q * sn(a) / 2;
    case 'diagonal-side': return 2 * m.area / (m.p * sn(a));
    case 'parallelogram': return m.ask === 'area' ? m.base * m.side * sn(a) : m.area / (m.base * sn(a));
    case 'rhombus-side': return m.side ** 2 * sn(a);
    case 'rhombus-diagonals': return m.p * m.q / 2;
    case 'split-area': return m.diagonal * (m.a * sn(m.angles[0]) + m.c * sn(m.angles[1])) / 2;
    case 'cube': return m.ask === 'ag' ? m.side * Math.sqrt(3) : ratio(m.ask, 1, Math.sqrt(2));
    case 'box': return m.ask === 'ag' ? Math.hypot(m.a, m.b, m.c) : ratio(m.ask, m.c, Math.hypot(m.a, m.b));
    case 'cone': { const r = m.slant * cs(a), h = m.slant * sn(a); return m.ask === 'V' ? Math.PI * r ** 2 * h / 3 : m.ask === 'r' ? r : h; }
    case 'tetrahedron': return m.ask === 'h' ? m.side * Math.sqrt(2 / 3) : m.ask === 'V' ? m.side ** 3 / (6 * Math.sqrt(2)) : 1 / Math.sqrt(3);
    case 'square-angle': { const x = Math.atan2(m.side, m.af) - Math.atan2(m.ce, m.side); return { s: Math.sin, c: Math.cos, t: Math.tan }[m.fn](x); }
    case 'fold': return { be: m.width / Math.sqrt(3), ae: 2 * m.width / Math.sqrt(3), ec: 2 * m.width / Math.sqrt(3), S: m.width ** 2 / Math.sqrt(3) }[m.ask];
    default: return null;
  }
}
function statementTruth(h, vars = {}) {
  const [lhs, rhs] = h.replace(/\$/g, '').split(/\\lt|\\gt|=/);
  const a = evaluate(lhs, vars), b = evaluate(rhs, vars);
  return h.includes('\\lt') ? a < b - 1e-9 : h.includes('\\gt') ? a > b + 1e-9 : Math.abs(a - b) < 1e-9;
}
function symbolic(q) {
  const m = q.solution.math, chosen = q.choices.find(c => c.ok);
  if (m.kind === 'comparison') {
    for (const it of m.items) { const truth = statementTruth(it.expression); assert.equal(truth, it.truth, q.key); assert.equal(it.correct, m.askRight ? truth : !truth, q.key); }
  } else if (m.kind === 'absolute') {
    for (const x of m.range[0] === 0 ? [7, 21, 43] : [47, 68, 86]) {
      const expected = evaluate(m.expression, { x }); const actual = evaluate(chosen.h, { x }); close(actual, expected, q.key);
    }
  } else if (m.kind === 'unit-segment') {
    const expected = m.expression.includes('90') ? m.expression.startsWith('\\sin') ? 'OB' : 'AB' : m.expression.startsWith('\\sin') ? 'AB' : m.expression.startsWith('\\cos') ? 'OB' : 'CD';
    assert.equal(chosen.h, `$\\overline{${expected}}$`, q.key);
  } else if (m.kind === 'nested') {
    const vars = { A: m.angle };
    for (const [i, letters] of [['B', 'C'], ['D', 'E'], ['F', 'G']].entries()) { const u = m.lengths[i]; vars['A' + letters[0]] = u; vars[letters.join('')] = u * tn(m.angle); vars['A' + letters[1]] = u / cs(m.angle); }
    for (const choice of q.choices) assert.equal(choice.ok, m.askWrong ? !statementTruth(choice.h, vars) : statementTruth(choice.h, vars), q.key);
  } else assert.fail(`No independent oracle: ${m.kind}`);
}
function checkMathText(text, why) {
  if (!text) return;
  assert.doesNotMatch(text, /undefined|NaN|Infinity|\[object Object\]/, why);
  assert.equal((text.match(/\$/g) || []).length % 2, 0, why + ': dollar delimiters');
  for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => katex.renderToString(m[1], { throwOnError: true, strict: false }), `${why}: ${m[1]}`);
}

test('r1-1 P0: 2, 3 and sin B must survive explore → current-question solution', () => {
  const sc = scene('r1-1'), s = {}; seed = 1; sc.enter(s);
  for (let i = 0; i < 20000; i++) { const q = sc.tg.gen(); if (q.key === 'r11|legs|s|false|2|3|BCA|0|true') { s.q = q; break; } }
  assert.equal(s.q.key, 'r11|legs|s|false|2|3|BCA|0|true');
  const steps = sc.steps(s).join('\n');
  assert.match(steps, /\\sin B/); assert.match(steps, /\\sqrt\{13\}/); assert.doesNotMatch(steps, /\\sin A|a=3|b=4|c=5/);
  assert.equal(sc.problem.answer(s).includes('\\frac{2\\sqrt{13}}{13}'), true);
  const fixed = sc.steps(s); s.t11a = 11; s.t11b = 12; assert.deepEqual(sc.steps(s), fixed, 'exploration must not replace a question solution');
});

test('all 51 scenes: current model, exact answer, all choice truth, and KaTeX over 32 seeds', () => {
  assert.equal(scenes.length, 51);
  let numeric = 0, symbolicCount = 0;
  for (const [idx, sc] of scenes.entries()) for (let variant = 0; variant < 32; variant++) {
    seed = (idx + 1) * 1009 + variant * 7919; const s = {}; sc.enter(s); const q = s.q;
    assert.ok(q.solution && q.solution.key === q.key, sc.id + ': current solution missing');
    assert.ok(q.solution.steps.length >= 4, sc.id + ': incomplete explanation');
    assert.equal(q.choices.length, 5); assert.equal(q.choices.filter(c => c.ok).length, 1);
    for (const text of [q.stem, q.html, ...q.solution.steps, ...q.choices.map(c => c.h || `$${c.t}$`)]) checkMathText(text, sc.id + '|' + variant);
    const answer = oracle(q);
    if (answer != null) {
      numeric++; close(q.solution.math.answer, answer, q.key);
      // Approximate choices are deliberately displayed to 2 decimals in a few
      // non-simple radicals. Exact TeX and four-decimal table answers remain strict.
      const correct = q.choices.find(c => c.ok), displayed = evaluate(correct.t);
      const approximate = /^-?\d+\.\d{1,2}$/.test(correct.t) && !q.table;
      close(displayed, answer, q.key + ': displayed correct choice', approximate ? .0051 / Math.max(1, Math.abs(answer)) : 1e-8);
    } else { symbolicCount++; symbolic(q); }
    const original = JSON.stringify(sc.steps(s)), savedQ = JSON.stringify(q);
    for (const key of Object.keys(s)) if (/^t\d/.test(key) && typeof s[key] === 'number') s[key] += 1;
    assert.equal(JSON.stringify(sc.steps(s)), original, sc.id + ': exploration leaked into solution');
    for (const tab of ['problem', 'review']) { const v = sc.view(s, { tab }); assert.equal(v.formula, ''); assert.equal(v.readouts.length, 0); }
    assert.equal(JSON.stringify(q), savedQ, sc.id + ': display mutated question');
  }
  assert.ok(numeric > 1400 && symbolicCount > 100);
});

test('tan 90° is undefined; acute SAS exterior foot has a positive distance', () => {
  assert.equal(G.tanD(90), null);
  const sc = scene('r3-1'), s = {}; sc.enter(s); s.t32 = 90;
  const v = sc.view(s, { tab: 'explore' }); assert.match(JSON.stringify(v), /정의되지 않음|없음/); assert.doesNotMatch(JSON.stringify(v), /Infinity|NaN/);
  const sas = scene('sasAcuteLen'), z = {}; sas.enter(z); Object.assign(z, { t43a: 2, t43c: 12, t43b: 20 });
  const m = sas.tg.model(z); close(m.hc.v, Math.abs(2 - 12 * cs(20)), 'HC is a length'); assert.ok(m.past);
});

test('renaming the current triangle also renames every wrong-choice explanation', () => {
  const originalRandom = context.Math.random, forms = new Set(); let ratioCases = 0;
  try {
    for (const id of ['refAngleSwap', 'r1-2']) for (let n = 0; n < 64; n++) {
      const gen = (j2, j1) => {
        seed = 1709 + n * 7919; let calls = 0;
        // Only the first two draws choose the names. All numerical/question
        // random draws remain identical under each of the six permutations.
        context.Math.random = () => ++calls === 1 ? (j2 + .1) / 3 : calls === 2 ? (j1 + .1) / 2 : originalRandom();
        return scene(id).tg.gen();
      };
      const base = gen(2, 1);
      if (id === 'refAngleSwap') forms.add(base.solution.math.expression);
      else if (base.key.includes('|ratio|')) ratioCases++;
      for (let j2 = 0; j2 < 3; j2++) for (let j1 = 0; j1 < 2; j1++) {
        const q = gen(j2, j1), names = q.fig.names;
        assert.deepEqual(q.choices.map(c => [c.t, c.ok]), base.choices.map(c => [c.t, c.ok]), id + ': unchanged mathematics');
        for (let i = 0; i < q.choices.length; i++) {
          const expected = base.choices[i].hint.replace(/[ABC]/g, x => names[x]);
          assert.equal(q.choices[i].hint, expected, `${id}/${q.key}/choice${i}: feedback must follow the renamed triangle`);
          checkMathText(q.choices[i].hint, id + ': feedback math');
        }
      }
    }
  } finally { context.Math.random = originalRandom; }
  assert.equal(forms.size, 5, 'all reference-angle expressions'); assert.ok(ratioCases > 0);
});

test('wrong-choice replay renders the current angle feedback without revealing the answer', () => {
  const fixtures = JSON.parse(fs.readFileSync(path.join(here, 'g8-g9-geometry-audit-targets-g9-trig-ratio.json'), 'utf8'));
  const cases = fixtures.filter(x => /^feedback-current-/.test(x.label)); assert.equal(cases.length, 2);
  for (const f of cases) {
    const sc = scene(f.id), s = {}; sc.enter(s); Object.assign(s, f.params);
    assert.equal(s.q.solution.key, s.q.key); assert.equal(s.revealed, false);
    const choice = s.q.choices[s.tgPick.idx], html = sc.problem.text(s);
    assert.equal(choice.ok, false); assert.ok(html.includes('class="tg-fb bad"'));
    assert.ok(html.includes(choice.hint)); assert.doesNotMatch(choice.hint, /(?:sin|cos|tan) B/);
    if (f.label.endsWith('first-term')) assert.match(choice.hint, /sin C.*cos A/);
    else assert.match(choice.hint, /cos A.*sin A.*sin C/);
    assert.doesNotMatch(html, /정답이에요!/);
    s.tgPick = null; assert.ok(!sc.problem.text(s).includes('class="tg-fb bad"'), 'unselected problem does not show feedback');
  }
});

// Canvas-command verification exercises the production draw paths, not pixels.
function board(width = 390, height = 490) {
  const log = [], b = { W: width, H: height, k: 35, fs: 1, pad: .02, insets: { left: 0, right: 0, top: 0, bottom: 0 }, thumb: false, _tgBoxes: [], log,
    area() { const i = this.insets; return { x: i.left, y: i.top, w: Math.max(10, width - i.left - i.right), h: Math.max(10, height - i.top - i.bottom) }; },
    toS(p) { const a = this.area(), f = this.focus || { x: [-width / 70, width / 70], y: [-height / 70, height / 70] }; return { x: a.x + a.w / 2 + (p.x - (f.x[0] + f.x[1]) / 2) * this.k, y: a.y + a.h / 2 + (p.y - (f.y[0] + f.y[1]) / 2) * this.k }; }, _P: p => p, _ts: () => 1 };
  Object.defineProperty(b, 'k', { get() { if (!this.focus) return 35; const a = this.area(), p = this.pad * Math.min(a.w, a.h); return Math.min((a.w - 2 * p) / (this.focus.x[1] - this.focus.x[0]), (a.h - 2 * p) / (this.focus.y[1] - this.focus.y[0])); } });
  for (const name of ['path', 'text', 'point', 'circle', 'arc', 'right', 'ticks', 'handle']) b[name] = (...args) => { const inspect = x => { if (typeof x === 'number') assert.ok(Number.isFinite(x), `non-finite ${name}`); else if (x && typeof x === 'object') Object.values(x).forEach(inspect); }; args.forEach(inspect); log.push({ name, args }); return b; };
  return b;
}

// Use production annotation geometry and the actual CI glyph widths for the
// captured 1:12 mobile case. This checks commands/clearance, not browser pixels.
const annotationScope = { window: { APLab: { clamp: (v, lo, hi) => Math.max(lo, Math.min(hi, v)) } } };
vm.runInNewContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit/apl-board.js'), 'utf8'), annotationScope);
const annotationProto = annotationScope.window.APLab.Board.prototype;
function annotationBoard(width, height) {
  const b = board(width, height);
  const captured = { A: [12.6171875, 17], B: [10.91552734375, 17], C: [12.47607421875, 17], '대변 1': [41.34619140625, 17], '이웃변 12': [66.5556640625, 17], '빗변 √145': [74.806640625, 17], '≈4.8°': [42.94500732421875, 16] };
  b.font = 'sans-serif';
  b.ctx = { font: '', save() {}, restore() {}, measureText(str) { const size = +(this.font.match(/([\d.]+)px/) || [])[1] || 17, m = captured[str]; return { width: m ? m[0] * size / m[1] : G.textW(str, size) }; } };
  b.toW = (x, y) => { const a = b.area(), f = b.focus; return { x: (x - a.x - a.w / 2) / b.k + (f.x[0] + f.x[1]) / 2, y: (y - a.y - a.h / 2) / b.k + (f.y[0] + f.y[1]) / 2 }; };
  b.seg = (p, q, o) => b.path([p, q], o);
  for (const method of ['_fracSplit', 'annotationSize', 'curveDim', 'leader']) b[method] = annotationProto[method];
  return b;
}
test('r1-1 short-side callout clears measured B/C names and still starts on BC', () => {
  const sc = scene('r1-1'), s = {}; sc.enter(s); Object.assign(s, { t11a: 1, t11b: 12 });
  const draw = (route) => {
    const b = annotationBoard(390, 411); b.insets.bottom = 60;
    if (!route) Object.defineProperty(b, '_tgRouteLeaderNames', { get: () => false, set() {} });
    sc.draw(b, s, {}, { tab: 'explore' }); return b;
  };
  const b = draw(true), prior = draw(false), leaders = b.log.filter(x => x.name === 'path' && x.args[1]?.width === 1.15);
  assert.equal(leaders.length, 1, 'keep one visible callout');
  const points = leaders[0].args[0].map(p => b.toS(p));
  assert.equal(points.length, 4, 'short orthogonal route, not a hidden line');
  close(points[0].x, 318.98, 'actual BC midpoint x'); close(points[0].y, 134.5, 'actual BC midpoint y');
  const overlaps = (a, z, q) => {
    assert.ok(Math.abs(a.x - z.x) < 1e-8 || Math.abs(a.y - z.y) < 1e-8, 'orthogonal segments');
    return Math.min(a.x, z.x) <= q.x1 && Math.max(a.x, z.x) >= q.x0 && Math.min(a.y, z.y) <= q.y1 && Math.max(a.y, z.y) >= q.y0;
  };
  for (const name of ['A', 'B', 'C']) {
    const q = b._tgBoxes.find(x => x.s === name), protectedBox = { x0: q.x0 - 1, x1: q.x1 + 1, y0: q.y0 - 1, y1: q.y1 + 1 };
    for (let i = 1; i < points.length; i++) assert.ok(!overlaps(points[i - 1], points[i], protectedBox), name + ': font, halo and leader stroke stay separate');
  }
  const vertices = b.log.filter(x => x.name === 'point').map(x => b.toS(x.args[0]));
  for (const p of vertices.slice(1)) for (let i = 1; i < points.length; i++) assert.ok(!overlaps(points[i - 1], points[i], { x0: p.x - 6, x1: p.x + 6, y0: p.y - 6, y1: p.y + 6 }), 'do not extend through B/C dots');
  const label = b._tgBoxes.find(x => x.s === '대변 1'); close(points.at(-1).y - label.y1, 4, 'visible line stops before label halo');
  assert.ok(points.reduce((sum, p, i) => sum + (i ? Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) : 0), 0) > 40, 'routing retains a visible connection');
  const withoutLeader = board => JSON.stringify(board.log.filter(x => x.name !== 'path' || x.args[1]?.width !== 1.15));
  assert.equal(withoutLeader(b), withoutLeader(prior), 'geometry, exact fractions/radicals and all text positions remain unchanged');
  assert.deepEqual(b.focus, prior.focus, 'fit remains unchanged');
  close((b._tgBoxes.find(x => x.s === 'B').x0 + b._tgBoxes.find(x => x.s === 'B').x1) / 2, 336.4741169459374, 'captured B center');
});
test('r1-1 routing is opt-in only for colliding exploration dimensions', () => {
  for (const [id, tab, thumb] of [['r1-1', 'explore', false], ['r1-1', 'problem', false], ['r1-1', 'review', false], ['r1-1', 'explore', true], ['r1-3', 'explore', false]]) {
    const sc = scene(id), s = {}; sc.enter(s); s.step = sc.steps(s).length;
    const draw = (route) => {
      const b = annotationBoard(thumb ? 240 : 390, thumb ? 150 : 411); b.thumb = thumb; b.insets.bottom = thumb ? 0 : 60;
      if (!route) Object.defineProperty(b, '_tgRouteLeaderNames', { get: () => false, set() {} });
      sc.draw(b, s, {}, { tab }); return b;
    };
    const b = draw(true), prior = draw(false);
    assert.equal(JSON.stringify(b.log), JSON.stringify(prior.log), `${id}/${tab}/thumb=${thumb}: retain original commands without a target collision`);
  }
});
test('all scene drawings: given → construction → final use current question; no non-finite geometry', () => {
  for (const sc of scenes) {
    seed = 1701; const s = {}; sc.enter(s);
    for (const tab of ['explore', 'problem', 'review']) for (const step of tab === 'review' ? [1, 2, 3, sc.steps(s).length] : [0]) {
      s.step = step; const b = board(); sc.draw(b, s, {}, { tab }); assert.ok(b.log.length > 5, sc.id);
    }
  }
  const sc = scene('r1-1'), s = {}; sc.enter(s); const originalDraw = sc.tg.draw, originalPdraw = sc.tg.pdraw;
  let current = false; sc.tg.draw = () => assert.fail('review used exploration drawing'); sc.tg.pdraw = (b, q, C) => { assert.equal(q, s.q); assert.ok(C.review); current = true; };
  sc.draw(board(), s, {}, { tab: 'review' }); assert.ok(current); sc.tg.draw = originalDraw; sc.tg.pdraw = originalPdraw;
  for (const id of ['solid3DTrig', 'r8-1', 'r8-2', 'r8-3']) {
    const sc = scene(id), z = {}; sc.enter(z); z.step = 2; const b = board(); sc.draw(b, z, {}, { tab: 'review' });
    assert.ok(b.log.some(x => x.name === 'right'), `${id}: explicit 3D right angle`);
    assert.ok(b.log.some(x => x.name === 'path' && x.args[1]?.dash), `${id}: hidden/auxiliary lines`);
  }
});


function fixedQuestion(id, key) {
  const sc = scene(id), s = {}; seed = 123; sc.enter(s);
  for (let i = 0; i < 30000 && s.q.key !== key; i++) s.q = sc.tg.gen();
  assert.equal(s.q.key, key); s.step = sc.steps(s).length;
  return { sc, s };
}
function labels(b) {
  return b.log.filter(x => x.name === 'text').map(x => {
    const [point, text, options] = x.args, screen = b.toS(point);
    return { text, ...options, x: screen.x + (options.dx || 0), y: screen.y + (options.dy || 0) };
  });
}
test('mobile labels identify whole/partial distances and separate nearby A/D and CH/angle', () => {
  for (const id of ['unitCircle', 'whyOuterTan']) {
    const key = id === 'unitCircle' ? 'uc|seg|30|s' : 'why|30|\\tan\\theta';
    const { sc, s } = fixedQuestion(id, key), b = board(390, 412); sc.draw(b, s, {}, { tab: 'review' });
    const a = labels(b).find(x => x.text === 'A'), d = labels(b).find(x => x.text === 'D');
    assert.ok(d.x - a.x > 35, id + ': point names must straddle the nearby vertices');
  }
  for (const [id, key, whole, part] of [
    ['sasAcuteLen', 'sasAcuteLen|45|\\sqrt{2}|6', '6', '5'],
    ['sasObtuseLen', 'sasObtuseLen|120|2|5', '5', '6']
  ]) {
    const { sc, s } = fixedQuestion(id, key), b = board(390, 412); sc.draw(b, s, {}, { tab: 'review' });
    const wholeLabel = labels(b).find(x => x.text === `BC = ${whole}`), partLabel = labels(b).find(x => x.text === `HC = ${part}`);
    assert.ok(wholeLabel && partLabel, id + ': named distances');
    assert.ok(partLabel.y - wholeLabel.y >= 45, id + ': whole and partial distances need distinct dimension rows');
    assert.ok(labels(b).some(x => x.text === 'BH = 1'));
  }
  const { sc, s } = fixedQuestion('areaObtuse', 'areaObtuse|150|2|7'), b = board(390, 412); sc.draw(b, s, {}, { tab: 'review' });
  const h = labels(b).find(x => x.text === 'CH = 1'), angle = labels(b).find(x => x.text === '∠CAH = 30°');
  assert.ok(h && angle, 'short height and exterior angle must be named');
  assert.ok(Math.abs(h.y - angle.y) > 40, '1 and 30° must not concatenate');
});
test('nested right triangles retain a usable mobile figure while ratios remain in cards', () => {
  const sc = scene('r1-3'), s = {}; sc.enter(s); const b = board(390, 328); sc.draw(b, s, {}, { tab: 'explore' });
  const points = b.log.filter(x => x.name === 'point').map(x => b.toS(x.args[0]));
  assert.ok(Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x)) > 200, 'default figure should span over 200 pixels');
  const cards = JSON.stringify(sc.view(s, { tab: 'explore' }).readouts);
  for (const fraction of ['BC}{AC', 'AB}{AC', 'BC}{AB']) assert.ok(cards.includes(fraction), fraction + ': keep corresponding-side ratios');
});

// Real 1440/1024 layouts leave the toolbar floating over the lower-right canvas.
// Use their final canvas dimensions and the shell's right inset, not viewport width.
function assertToolbarClear(b, context) {
  const labels = b._tgBoxes.filter(x => /^[A-G]$/.test(x.s));
  assert.ok(labels.length >= 3, context + ': vertex names');
  for (const x of labels) assert.ok(x.x1 <= b.W - 290 || x.y1 <= b.H - 54,
    `${context}: ${x.s} (${x.x0.toFixed(1)},${x.y0.toFixed(1)})–(${x.x1.toFixed(1)},${x.y1.toFixed(1)}) overlaps the toolbar`);
}
test('wide captured reference-swap and 1:2 tilted cases retain visible lower names', () => {
  const fixtures = JSON.parse(fs.readFileSync(path.join(here, 'g8-g9-geometry-audit-targets-g9-trig-ratio.json'), 'utf8'));
  const cases = fixtures.filter(x => /^toolbar-/.test(x.label)), overlaps = [];
  assert.equal(cases.length, 2);
  for (const f of cases) {
    const { id } = f, sc = scene(id), s = {}; sc.enter(s); Object.assign(s, f.params, { step: f.step });
    assert.equal(s.q.solution.key, s.q.key, id + ': fixed question/solution identity');
    close(s.q.solution.math.answer, id === 'refAngleSwap' ? 8 / 5 : 1 / 2, id + ': fixed production question answer');
    for (const [w, h] of [[1040, 746], [683, 614]]) {
      const b = board(w, h); b.insets.right = 16; sc.draw(b, s, {}, { tab: 'review' });
      try { assertToolbarClear(b, `${id}/captured/${w}×${h}`); } catch (e) { overlaps.push(e.message); }
    }
  }
  assert.deepEqual(overlaps, []);
});
test('wide current right triangles keep rotated and mirrored vertex names above the toolbar', () => {
  for (const id of ['r1-1', 'refAngleSwap', 'r1-2', 'r1-4', 'cut3060', 'cut45', 'r2-1', 'trigTableCalc', 'findFromHyp', 'findFromBase']) {
    seed = 1024; const sc = scene(id), s = {}; sc.enter(s);
    for (let n = 0; n < 32; n++) {
      if (n) s.q = sc.tg.gen(s.q);
      for (const [w, h] of [[1040, 746], [683, 614]]) for (const step of [1, 3, sc.steps(s).length]) {
        s.step = step; const b = board(w, h); b.insets.right = 16; sc.draw(b, s, {}, { tab: 'review' });
        assertToolbarClear(b, `${id}/${s.q.key}/${w}×${h}/step${step}`);
      }
    }
  }
});
test('wide nested right triangles keep B/D/F clear in short exploration canvases', () => {
  const sc = scene('r1-3'), s = {}; sc.enter(s);
  for (const th of [15, 25, 35, 50, 65, 75]) for (const us of [[3, 6, 9], [2, 5, 8], [4, 6, 10]]) {
    Object.assign(s, { t13t: th, t13u1: us[0], t13u2: us[1], t13u3: us[2] });
    for (const [w, h] of [[1040, 606], [683, 474]]) {
      const b = board(w, h); b.insets.right = 16; sc.draw(b, s, {}, { tab: 'explore' });
      assertToolbarClear(b, `r1-3/${th}/${us}/${w}×${h}`);
    }
  }
  sc.tg.init(s); const b = board(390, 412); b.insets.bottom = 58; sc.draw(b, s, {}, { tab: 'explore' });
  const xs = b.log.filter(x => x.name === 'point').map(x => b.toS(x.args[0]).x);
  assert.ok(Math.max(...xs) - Math.min(...xs) > 200, 'mobile bottom inset retains a figure wider than 200 pixels');
});


test('quadrilateral exploration reserves the mobile stage for the actual figure', () => {
  for (const id of ['quadSplitSum', 'quadUnfold2x', 'quadDiagHalf']) {
    const sc = scene(id), s = {}; sc.enter(s); const b = board(390, 328); sc.draw(b, s, {}, { tab: 'explore' });
    const points = b.log.filter(x => x.name === 'point').map(x => b.toS(x.args[0]));
    assert.ok(Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x)) > 180, id + ': useful width');
    const text = labels(b).map(x => x.text); assert.ok(text.includes('60°'), id + ': angle remains on its diagram');
    if (id === 'quadSplitSum') assert.ok(text.includes('45°'));
    assert.ok(sc.view(s, { tab: 'explore' }).readouts.length >= 2, id + ': exact area values remain in cards');
  }
});
