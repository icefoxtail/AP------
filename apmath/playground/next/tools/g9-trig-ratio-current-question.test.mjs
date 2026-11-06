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

// Canvas-command verification exercises the production draw paths, not pixels.
function board(width = 390, height = 490) {
  const log = [], b = { W: width, H: height, k: 35, fs: 1, pad: .02, insets: { left: 0, right: 0, top: 0, bottom: 0 }, thumb: false, _tgBoxes: [], log, toS(p) { return { x: width / 2 + p.x * this.k, y: height / 2 + p.y * this.k }; }, _P: p => p, _ts: () => 1 };
  for (const name of ['path', 'text', 'point', 'circle', 'arc', 'right', 'ticks', 'handle']) b[name] = (...args) => { const inspect = x => { if (typeof x === 'number') assert.ok(Number.isFinite(x), `non-finite ${name}`); else if (x && typeof x === 'object') Object.values(x).forEach(inspect); }; args.forEach(inspect); log.push({ name, args }); return b; };
  return b;
}
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
