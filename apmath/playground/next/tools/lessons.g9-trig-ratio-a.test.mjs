// Fixed source questions, independent arithmetic and the actual lesson/Board path.
// This focused safety suite does not claim a browser or mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/trig-ratio-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const lab = await load();
const counts = { 'r1-1': 7, refAngleSwap: 7, 'r1-2': 8, 'r1-3': 5, simRightTri: 7, 'r1-4': 7,
  cut3060: 7, cut45: 5, chainSpecial: 5, 'r2-1': 6, 'r2-2': 5, 'r2-3': 5, absSignJudge: 8,
  unitCircle: 7, whyOuterTan: 6, 'r3-1': 3, 'r3-2': 4, trigTableCalc: 5, lineSlope: 4 };
const ids = Object.keys(counts), plain = x => JSON.parse(JSON.stringify(x));
const sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180), tan = d => Math.tan(d * Math.PI / 180);
const round = x => Math.round(x * 1e4) / 1e4, trig = (f, d) => ({ s: sin, c: cos, t: tan })[f](d);
const ratio = (fn, a, b) => ({ s: a / Math.hypot(a, b), c: b / Math.hypot(a, b), t: a / b })[fn];
const near = (a, b, why) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${why}: ${a} ≈ ${b}`);
const qOf = l => l.chapters[0].cues[0].set.q;
const examples = id => lab.def.lessons[id].filter(l => l.chapters[0].cues[0].set.tgLessonProblem).map(qOf);
const eqSet = (actual, expected, why) => assert.deepEqual([...new Set(actual)].sort(), [...expected].sort(), why);

// A restricted arithmetic reader, independent of production's exact-value engine.
// It accepts only the numeric/ratio/function grammar used by the original source.
function evaluate(input, vars = {}) {
  const s = String(input).replace(/√(\d+)/g, '\\sqrt{$1}').replace(/\\(sin|cos|tan)\s+([A-Za-z])/g, '\\$1{$2}')
    .replace(/\$/g, '').replace(/\^\{\\circ\}|°/g, '').replace(/\\(?:left|right|,|!|;|\s)/g, '').replace(/\s+/g, '').replace(/−/g, '-');
  let i = 0;
  const group = () => { const open = s[i++], end = open === '{' ? '}' : ')'; assert.ok(open === '{' || open === '(', s); const v = sum(); assert.equal(s[i++], end, s); return v; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); }
    if (s[i] === '-') { i++; return -atom(); }
    let v;
    if (s[i] === '{' || s[i] === '(') v = group();
    else if (/\d|\./.test(s[i] || '')) { const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); assert.ok(m, s); i += m[0].length; v = Number(m[0]); }
    else if (s[i] === '\\') {
      const cmd = s.slice(++i).match(/^[a-zA-Z]+/)[0]; i += cmd.length;
      if (cmd === 'frac') { const n = group(), d = group(); v = n / d; }
      else if (cmd === 'sqrt') v = Math.sqrt(group());
      else if (cmd === 'overline') { const end = s.indexOf('}', i), name = s.slice(i + 1, end); i = end + 1; assert.ok(name in vars, name); v = vars[name]; }
      else if (['sin', 'cos', 'tan'].includes(cmd)) v = { sin, cos, tan }[cmd](atom());
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
  function sum() { let v = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], n = product(); v = op === '+' ? v + n : v - n; } return v; }
  const value = sum(); assert.equal(i, s.length, `unread ${s.slice(i)} in ${s}`); return value;
}
function truth(expression, vars = {}) {
  const [left, right] = expression.replace(/\$/g, '').split(/\\lt|\\gt|=/), a = evaluate(left, vars), b = evaluate(right, vars);
  return expression.includes('\\lt') ? a < b - 1e-9 : expression.includes('\\gt') ? a > b + 1e-9 : Math.abs(a - b) < 1e-9;
}
function oracle(q) {
  const m = q.solution.math, f = q.fig, inverse = { s: Math.asin, c: Math.acos, t: Math.atan };
  switch (m.kind) {
    case 'ratio': near(m.c, Math.hypot(m.a, m.b), q.key); return ratio(m.fn, m.ref === 'A' ? m.a : m.b, m.ref === 'A' ? m.b : m.a);
    case 'ratio-length': return evaluate(f.side.c.t) * (m.ask === 'a' ? f.a : f.b) / Math.hypot(f.a, f.b);
    case 'swap': { const a = Math.atan2(m.a, m.b) * 180 / Math.PI; return evaluate(m.expression, { [f.names.A]: a, [f.names.B]: 90 - a }); }
    case 'altitude-ratio': return ratio(m.fn, m.ref === 'BAH' ? m.p : m.q, m.ref === 'BAH' ? m.q : m.p);
    case 'special-side': {
      const unit = { a: sin(m.theta), b: cos(m.theta), c: 1 }, scale = evaluate(f.side[m.givenSide].t) / unit[m.givenSide];
      for (const k of ['a', 'b', 'c']) near(evaluate(f.solutionSide[k]), scale * unit[k], q.key + '/' + k);
      return scale * unit[m.askedSide];
    }
    case 'special-angle': return inverse[m.fn](m.numerator / m.denominator) * 180 / Math.PI;
    case 'chain': {
      const height = evaluate(f.g) * sin(m.pair[m.givenSide === 'ab' ? 0 : 1]); near(m.height, height, q.key + ' height');
      return { ab: height / sin(m.pair[0]), ac: height / sin(m.pair[1]), bc: height / tan(m.pair[0]) + height / tan(m.pair[1]) }[m.askedSide];
    }
    case 'expression': { const [a, b, c] = m.angles; return { f1: () => sin(a) + cos(b) - tan(c), f2: () => sin(a) * cos(b) + tan(c), f3: () => tan(a) * cos(b) / sin(c), f4: () => sin(a) ** 2 + cos(b) ** 2 + tan(c) }[m.form](); }
    case 'unit-circle': return m.ask === 'seg' ? trig(m.fn, m.theta) : inverse[m.fn](evaluate(f.value)) * 180 / Math.PI;
    case 'table-expression': { const [a, b] = m.angles.map((x, i) => round(trig(m.functions[i], x))); near(a, m.values[0], q.key); near(b, m.values[1], q.key); return round(m.op === '+' ? a + b : a - b); }
    case 'table-inverse': { const angles = f.angs.filter(a => round(trig(m.fn, a)) === m.value); assert.equal(angles.length, 1); return angles[0]; }
    case 'table-side': near(m.value, round(trig(m.fn, m.theta)), q.key); return round(m.length * round(trig(m.fn, m.theta)));
    case 'slope': return ratio(m.fn, m.opposite, m.adjacent);
    default: return null;
  }
}
function symbolic(q) {
  const m = q.solution.math, correct = q.choices.find(c => c.ok);
  if (m.kind === 'absolute') {
    for (const x of m.range[0] === 0 ? [7, 21, 43] : [47, 68, 86]) {
      const e = m.coefficients, expected = evaluate(m.expression, { x });
      near(evaluate(correct.h, { x }), expected, q.key); near(e.k + e.s * sin(x) + e.c * cos(x) + e.t * tan(x), expected, q.key);
    }
  } else if (m.kind === 'comparison') {
    for (const item of m.items) { const value = truth(item.expression); assert.equal(item.truth, value); assert.equal(item.correct, m.askRight ? value : !value); }
  } else if (m.kind === 'nested') {
    const vars = { A: m.angle };
    for (const [i, [foot, top]] of [['B', 'C'], ['D', 'E'], ['F', 'G']].entries()) { const n = m.lengths[i]; vars['A' + foot] = n; vars[foot + top] = n * tan(m.angle); vars['A' + top] = n / cos(m.angle); }
    for (const c of q.choices) assert.equal(c.ok, m.askWrong ? !truth(c.h, vars) : truth(c.h, vars), q.key);
  } else if (m.kind === 'unit-segment') {
    const expected = m.expression.includes('90') ? m.expression.startsWith('\\sin') ? 'OB' : 'AB' : m.expression.startsWith('\\sin') ? 'AB' : m.expression.startsWith('\\cos') ? 'OB' : 'CD';
    assert.equal(m.segment, expected); assert.equal(correct.h, `$\\overline{${expected}}$`);
  } else assert.fail('Unhandled A symbolic family ' + m.kind);
}
function init(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  lab.s.tgPick = { key: 'manual choice', idx: 2 };
  return { id, scene: lab.scene, lesson: lab.def.lessons[id][index], compiled: video.compileLesson(lab.def.lessons[id][index]), base: { ...lab.s } };
}
function state(u, time, base = u.base) {
  const v = video.stateAt(u.compiled, time, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...v.nums, ...v.sets, step: v.step, part: v.part, lessonOn: true, lessonEntry: false, dragging: true, playing: false };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
const signature = frame => JSON.stringify(frame.paths.map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.points.length > 1 && (p.options.width || p.options.fill));
const texts = frame => frame.texts.join('\n');

test('A registers 19 scenes / 111 lessons with complete authored source families and valid captions', () => {
  let concepts = 0, problems = 0;
  for (const id of ids) {
    const list = lab.def.lessons[id]; assert.equal(list.length, counts[id]);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    for (const l of list) {
      const first = l.chapters[0].cues[0].set;
      assert.equal(first.tgSeed, 0); assert.equal(first.tgShowAnswer, false); assert.equal(first.tgCalculationReady, false); assert.equal('tgPick' in first, false);
      assert.ok(Object.isFrozen(first.q) && Object.isFrozen(first.q.fig) && Object.isFrozen(first.q.solution));
      if (first.tgLessonProblem) problems++; else { concepts++; assert.ok(first.tgAQuestion); }
      for (const c of l.chapters) for (const cue of c.cues) if (cue.say) for (const m of cue.say.matchAll(/\$([^$]+)\$/g)) katex.renderToString(m[1], { throwOnError: true });
    }
  }
  assert.equal(concepts, 31); assert.equal(problems, 80);
  eqSet(examples('r1-1').map(q => `${q.key.split('|')[1]}:${Number.isInteger(q.key.split('|')[1] === 'legs' ? q.solution.math.c : q.solution.math.b)}`), ['legs:true', 'legs:false', 'hyp:true', 'hyp:false']);
  assert.equal(new Set(examples('refAngleSwap').map(q => q.solution.math.expression.replace(/[ABC]/g, 'X'))).size, 5);
  eqSet(examples('r1-2').map(q => q.key.split('|').slice(1, 3).join(':')), ['ratio:s', 'ratio:c', 'ratio:t', 'len:s', 'len:c', 'len:t']);
  eqSet(examples('r1-3').map(q => q.solution.math.askWrong), [true, false]);
  eqSet(examples('simRightTri').map(q => q.solution.math.ref + ':' + q.solution.math.fn), ['BAH:s', 'BAH:c', 'BAH:t', 'HAC:s', 'HAC:c', 'HAC:t']);
  eqSet(examples('r1-4').map(q => q.key.split('|').slice(1, 3).join(':')), ['legs:s', 'legs:c', 'legs:t', 'hyp:s', 'hyp:c', 'hyp:t']);
  for (const [id, expected] of [['cut3060', ['a:b', 'a:c', 'b:a', 'b:c', 'c:a', 'c:b']], ['cut45', ['a:c', 'b:c', 'c:a', 'c:b']], ['chainSpecial', ['ab:ac', 'ab:bc', 'ac:ab', 'ac:bc']]]) eqSet(examples(id).map(q => q.solution.math.givenSide + ':' + q.solution.math.askedSide), expected, id);
  eqSet(examples('r2-1').map(q => q.solution.math.fn), ['s', 'c', 't']);
  eqSet(examples('r2-2').map(q => q.solution.math.form), ['f1', 'f2', 'f3', 'f4']);
  eqSet(examples('r2-3').map(q => q.solution.math.askRight), [true, false]);
  const abs = lab.def.lessons.absSignJudge.map(qOf); assert.equal(new Set(abs.map(q => q.solution.math.expression)).size, 4);
  for (const expression of new Set(abs.map(q => q.solution.math.expression))) eqSet(abs.filter(q => q.solution.math.expression === expression).map(q => q.solution.math.range.join(',')), ['0,45', '45,90']);
  eqSet(examples('unitCircle').map(q => q.solution.math.ask + ':' + q.solution.math.fn), ['seg:s', 'seg:c', 'seg:t', 'ang:s', 'ang:c', 'ang:t']);
  assert.equal(new Set(examples('whyOuterTan').map(q => q.solution.math.expression)).size, 5);
  eqSet(examples('r3-1').map(q => q.solution.math.op), ['+', '-']);
  for (const id of ['r3-2', 'trigTableCalc', 'lineSlope']) eqSet(examples(id).map(q => q.solution.math.fn), ['s', 'c', 't'], id);
});

test('A original exact choices agree with independent trigonometry, radicals, tables and symbolic signs', () => {
  for (const id of ids) for (const l of lab.def.lessons[id]) {
    const q = qOf(l), chosen = q.choices.filter(c => c.ok), value = oracle(q);
    assert.equal(q.choices.length, 5); assert.equal(chosen.length, 1); assert.equal(q.solution.key, q.key);
    if (value == null) symbolic(q);
    else { near(q.solution.math.answer, value, q.key); near(evaluate(chosen[0].t), value, q.key + ' exact choice'); }
    if (l.chapters[0].cues[0].set.tgLessonProblem) {
      assert.equal(l.answer, lab.api.NUM[q.choices.findIndex(c => c.ok)]);
      assert.ok(l.answerText.includes(chosen[0].h ?? `$${chosen[0].t}$`));
      assert.ok(l.chapters.at(-1).cues.at(-1).say.includes(chosen[0].h ?? `$${chosen[0].t}$`));
    }
  }
});

test('A production Board replays 888 cue frames with first-second motion, stable questions and preserved manual choices', () => {
  let frames = 0;
  for (const id of ids) for (let index = 0; index < counts[id]; index++) {
    const u = init(id, index), s0 = state(u, 0), start = draw(s0), moving = draw(state(u, .8));
    const q = plain(s0.q), question = u.scene.question(s0), pick = s0.tgPick;
    assert.ok(visible(start) && visible(moving)); assert.notEqual(signature(start), signature(moving), id + '/' + index + ': actual edge or geometry moves within 1 second');
    if (s0.tgLessonProblem) for (const [i, c] of s0.q.choices.entries()) assert.ok(question.includes(lab.api.NUM[i] + ' ' + (c.h ?? `$${c.t}$`)), id + ': original choice preserved');
    for (const t of [0, .8, 6, 12, 18, 24, 30, 35.9]) {
      const s = state(u, t), frame = draw(s); frames++;
      assert.ok(visible(frame), id); assert.doesNotMatch(texts(frame), /NaN|undefined|Infinity|\[object Object\]/, id);
      assert.equal(s.tgShowAnswer, t >= 30); assert.equal(s.tgPick, pick); assert.deepEqual(plain(s.q), q); assert.equal(u.scene.question(s), question);
      if (t < 24) assert.equal(s.tgShowAnswer, false);
    }
    const end = state(u, u.compiled.length), rewind = state(u, 0, end);
    assert.equal(rewind.tgShowAnswer, false); assert.equal(rewind.tgCalculationReady, false); assert.equal(rewind.tgATrace, 0);
    assert.equal(signature(draw(rewind)), signature(start), id + '/' + index + ': replay restores geometry');
    assert.deepEqual(plain(rewind.q), q);
  }
  assert.equal(frames, 888);
});

test('A queried lengths and angles remain unknown until the final cue, including source x-angle correction', () => {
  for (const id of ['cut3060', 'cut45', 'r2-1', 'unitCircle', 'r3-2', 'trigTableCalc']) {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index);
      if (!u.lesson.chapters[0].cues[0].set.tgLessonProblem) continue;
      assert.match(texts(draw(state(u, 24))), /\bx\b/, id + ': unresolved query');
      assert.doesNotMatch(texts(draw(state(u, 30))), /\bx\b/, id + ': resolved query');
    }
  }
  const square = init('cut45', 0);
  assert.doesNotMatch(texts(draw(state(square, 0))), /√2|\\sqrt\{2\}|1 : 1/);
  assert.doesNotMatch(texts(draw(state(square, 24))), /1 : 1 : √2/);
  assert.match(texts(draw(state(square, 30))), /1 : 1 : √2/);
  const table = init('trigTableCalc', 0);
  assert.doesNotMatch(texts(draw(state(table, 24))), /5\.736|8\.192/);
  assert.match(texts(draw(state(table, 30))), /5\.736/);
});

test('A concept drawing follows actual rotation, cuts, reference-angle colors and the requested table cells', () => {
  const rotation = init('r1-4', 0); assert.equal(state(rotation, 0).t16r, 40); assert.equal(state(rotation, 6).t16r, 100);
  for (const id of ['cut3060', 'cut45']) { const u = init(id, 0); assert.equal(state(u, 0).t2s, 0); assert.equal(state(u, 6).t2s, 1); assert.notEqual(signature(draw(state(u, 0))), signature(draw(state(u, 6)))); }
  const swap = init('refAngleSwap', 0), before = draw(state(swap, 6)), after = draw(state(swap, 12));
  const opposite = f => f.textItems.find(t => t.text === '대변 3' || t.text === '대변 4')?.text;
  assert.equal(opposite(before), '대변 3'); assert.equal(opposite(after), '대변 4');
  const table = init('r3-1', 1), q = qOf(table.lesson), frame = draw(state(table, 12));
  for (const value of q.solution.math.values) assert.ok(frame.textItems.some(t => t.text === value.toFixed(4) && t.options?.color === 'amber'), 'the original requested table cells are highlighted');
});
