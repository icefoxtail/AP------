// Release safety: original fixed questions, independent coordinate arithmetic and
// production Board commands. Browser/mobile and independent visual QA are separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/trig-ratio-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const lab = await load();
const counts = { areaAcute: 2, areaObtuse: 2, equilFormula: 5, 'r6-1': 3, angleBisectLen: 2, regPolygonArea: 4,
  quadUnfold2x: 2, paraArea: 4, rhombusSquare: 4, quadDiagHalf: 2, quadSplitSum: 3,
  solid3DTrig: 5, 'r8-1': 5, 'r8-2': 6, 'r8-3': 4, 'r9-1': 7, 'r9-2': 5 };
const near = (a, b, why = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${why}: ${a} ≈ ${b}`);
const plain = x => JSON.parse(JSON.stringify(x));
const sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180);
const point = (x, y) => ({ x, y }), sub = (a, b) => point(a.x - b.x, a.y - b.y);
const cross = (a, b) => a.x * b.y - a.y * b.x, dot = (a, b) => a.x * b.x + a.y * b.y;
const length = a => Math.hypot(a.x, a.y);
const area = pts => Math.abs(pts.reduce((sum, p, i) => sum + cross(p, pts[(i + 1) % pts.length]), 0)) / 2;
const signature = frame => JSON.stringify(frame.paths.map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.points.length >= 2 && (p.options.color && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0));

// Parse only numeric fractions/radicals/pi emitted by the original source; this
// deliberately does not call the production exact-value engine or JavaScript eval.
function numeric(input) {
  const s = String(input).replace(/√(\d+)/g, '\\sqrt{$1}').replace(/\s+/g, '').replace(/−/g, '-').replace(/π/g, '\\pi');
  let i = 0;
  const group = () => { const open = s[i++], end = open === '{' ? '}' : ')'; assert.ok(['{', '('].includes(open), s); const n = sum(); assert.equal(s[i++], end, s); return n; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); }
    if (s[i] === '-') { i++; return -atom(); }
    if (s[i] === '{' || s[i] === '(') return group();
    if (s.startsWith('\\sqrt', i)) { i += 5; return Math.sqrt(group()); }
    if (s.startsWith('\\frac', i)) { i += 5; return group() / group(); }
    if (s.startsWith('\\pi', i)) { i += 3; return Math.PI; }
    const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); assert.ok(m, `number at ${s.slice(i)} in ${s}`); i += m[0].length; return Number(m[0]);
  };
  const product = () => {
    let n = atom();
    while (i < s.length && !['+', '-', '}', ')'].includes(s[i])) {
      if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { i += s.startsWith('\\times', i) ? 6 : 5; n *= atom(); }
      else if (s[i] === '/') { i++; n /= atom(); }
      else n *= atom();
    }
    return n;
  };
  function sum() { let n = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], rhs = product(); n = op === '+' ? n + rhs : n - rhs; } return n; }
  const n = sum(); assert.equal(i, s.length, s); return n;
}

function expected(q) {
  const m = q.solution.math, f = q.fig;
  switch (m.kind) {
    case 'triangle-area': return area([point(0, 0), point(m.c, 0), point(m.b * cos(m.angle), -m.b * sin(m.angle))]);
    case 'equilateral': return { h: Math.sqrt(m.side ** 2 - (m.side / 2) ** 2), S: Math.sqrt(3) * m.side ** 2 / 4, a: m.side }[m.ask];
    case 'area-side': return 2 * m.area / (m.c * sin(m.angle));
    case 'angle-bisector': {
      const B = point(m.c, 0), C = point(m.b * cos(m.angle), -m.b * sin(m.angle)), ray = point(cos(m.angle / 2), -sin(m.angle / 2));
      return cross(B, sub(C, B)) / cross(ray, sub(C, B));
    }
    case 'regular-area': return area(Array.from({ length: m.n }, (_, i) => point(m.radius * cos(360 * i / m.n), m.radius * sin(360 * i / m.n))));
    case 'diagonal-area': return area([point(-.3 * m.p, 0), point(.4 * m.q * cos(m.angle), -.4 * m.q * sin(m.angle)), point(.7 * m.p, 0), point(-.6 * m.q * cos(m.angle), .6 * m.q * sin(m.angle))]);
    case 'diagonal-side': return 2 * m.area / (m.p * sin(m.angle));
    case 'parallelogram': {
      const shape = [point(0, 0), point(m.base, 0), point(m.base + m.side * cos(m.angle), -m.side * sin(m.angle)), point(m.side * cos(m.angle), -m.side * sin(m.angle))];
      near(area(shape), m.area, 'parallelogram source area'); return m.ask === 'area' ? area(shape) : m.area / (m.base * sin(m.angle));
    }
    case 'rhombus-side': return m.side ** 2 * sin(m.angle);
    case 'rhombus-diagonals': return area([point(-m.q / 2, 0), point(0, -m.p / 2), point(m.q / 2, 0), point(0, m.p / 2)]);
    case 'split-area': return area([point(m.a * cos(m.angles[0]), -m.a * sin(m.angles[0])), point(0, 0), point(m.c * cos(m.angles[1]), m.c * sin(m.angles[1])), point(m.diagonal, 0)]);
    case 'cube': {
      const AE = m.side, EG = Math.hypot(m.side, m.side), AG = Math.hypot(EG, AE);
      return { ag: AG, s: AE / AG, c: EG / AG, t: AE / EG }[m.ask];
    }
    case 'box': {
      const AC = Math.hypot(m.a, m.b), AG = Math.hypot(AC, m.c);
      return { ag: AG, s: m.c / AG, c: AC / AG, t: m.c / AC }[m.ask];
    }
    case 'cone': {
      const r = m.slant * cos(m.angle), h = m.slant * sin(m.angle);
      near(Math.hypot(r, h), m.slant, 'cone section hypotenuse');
      return { h, r, V: Math.PI * r * r * h / 3 }[m.ask];
    }
    case 'tetrahedron': {
      const a = m.side, A = point(-a / 2, -a * Math.sqrt(3) / 6), B = point(a / 2, A.y), C = point(0, a * Math.sqrt(3) / 3);
      const R = length(A), h = Math.sqrt(a * a - R * R);
      return { h, V: area([A, B, C]) * h / 3, cos: R / a }[m.ask];
    }
    case 'square-angle': {
      const BE = point(m.side, -m.ce), BF = point(m.af, -m.side), product = length(BE) * length(BF);
      near(numeric(f.work.bef), Math.abs(cross(BE, BF)) / 2, 'central triangle area from cross product');
      assert.ok(dot(BE, BF) > 0, 'angle is acute, so cosine is positive');
      return { s: Math.abs(cross(BE, BF)) / product, c: dot(BE, BF) / product, t: Math.abs(cross(BE, BF)) / dot(BE, BF) }[m.fn];
    }
    case 'fold': {
      const w = m.width, A = point(0, -w), B = point(0, 0), E = point(w / Math.sqrt(3), 0), C = point(w * Math.sqrt(3), 0);
      const axis = sub(E, A), v = sub(B, A), scale = dot(v, axis) / dot(axis, axis), foot = point(A.x + scale * axis.x, A.y + scale * axis.y), reflected = point(2 * foot.x - B.x, 2 * foot.y - B.y);
      near(cross(sub(reflected, A), sub(C, A)), 0, 'B prime is on AC');
      near(length(sub(A, reflected)), length(sub(A, B)), 'reflection preserves AB');
      near(dot(sub(B, A), axis) / (length(v) * length(axis)), cos(30), 'fold angle is 30 degrees');
      return { be: length(sub(B, E)), ae: length(sub(A, E)), ec: length(sub(E, C)), S: area([A, E, C]) }[m.ask];
    }
    default: assert.fail('Unhandled source math kind: ' + m.kind);
  }
}

function unit(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  lab.s.tgPick = { key: 'manual-selection-before-lesson', idx: 2 };
  const lesson = lab.def.lessons[id][index];
  return { id, lesson, timeline: video.compileLesson(lesson), base: { ...lab.s }, scene: lab.scene };
}
function state(u, at, base = u.base) {
  const value = video.stateAt(u.timeline, at, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
function family(id, q) {
  const m = q.solution.math, f = q.fig;
  if (id === 'r9-1') return `${f.mid2}:${m.fn}`;
  if (id === 'paraArea') return m.ask === 'side' ? 'side' : m.angle < 90 ? 'acute' : 'obtuse';
  if (id === 'r6-1') return m.angle < 90 ? 'acute' : 'obtuse';
  if (id === 'regPolygonArea') return String(m.n);
  if (id === 'quadSplitSum') return f.be === f.de ? 'same' : 'mixed';
  return m.ask || m.kind;
}
const families = { areaAcute: ['triangle-area'], areaObtuse: ['triangle-area'], equilFormula: ['h', 'S', 'a'], 'r6-1': ['acute', 'obtuse'], angleBisectLen: ['angle-bisector'], regPolygonArea: ['6', '8', '12'],
  quadUnfold2x: ['diagonal-area'], paraArea: ['acute', 'obtuse', 'side'], rhombusSquare: ['rhombus-side', 'rhombus-diagonals'], quadDiagHalf: ['diagonal-side'], quadSplitSum: ['same', 'mixed'],
  solid3DTrig: ['ag', 's', 'c', 't'], 'r8-1': ['ag', 's', 'c', 't'], 'r8-2': ['h', 'r', 'V'], 'r8-3': ['h', 'V', 'cos'], 'r9-1': ['true:s', 'true:c', 'true:t', 'false:s', 'false:c', 'false:t'], 'r9-2': ['be', 'ae', 'ec', 'S'] };

test('C registers 17 scenes / 65 lessons with concepts, distinct source families and safe cue resets', t => {
  let concepts = 0, problems = 0;
  for (const [id, count] of Object.entries(counts)) {
    const list = lab.def.lessons[id]; assert.equal(list.length, count, id);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    const seen = [];
    for (const lesson of list) {
      const first = lesson.chapters[0].cues[0].set, timeline = video.compileLesson(lesson);
      assert.equal(first.tgSeed, 0); assert.equal(first.tgShowAnswer, false); assert.equal(first.tgCalculationReady, false);
      assert.equal('tgPick' in first, false); assert.ok(Object.isFrozen(first.q.fig)); assert.ok(Object.isFrozen(first.q.solution));
      assert.equal(lesson.chapters[0].start.tgCTrace, 0);
      const reveals = timeline.cues.filter(cue => cue.set?.tgShowAnswer);
      assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, lesson.chapters.length - 1);
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
        if (cue.say != null) {
          assert.doesNotMatch(cue.say, /undefined|NaN|Infinity|[\x00-\x08\x0b-\x1f]/);
          for (const match of cue.say.matchAll(/\$([^$]+)\$/g)) katex.renderToString(match[1], { throwOnError: true, strict: 'error' });
        }
        for (const key of Object.keys(cue.to || {})) { assert.ok(Number.isFinite(lesson.chapters[0].start[key]), key); assert.equal(key in first, false, 'sets must not freeze animated state'); }
      }
      if (first.tgLessonProblem) { problems++; seen.push(family(id, first.q)); } else { concepts++; assert.ok(first.tgCQuestion); }
    }
    assert.deepEqual(seen.sort(), families[id].slice().sort(), id);
  }
  assert.equal(concepts, 21); assert.equal(problems, 44);
  t.diagnostic('17 scenes / 65 lessons: 21 concepts + 44 distinct source problem variants');
});

test('C exact choices and final answers agree with independent geometric calculations', () => {
  for (const id of Object.keys(counts)) for (const lesson of lab.def.lessons[id]) {
    const first = lesson.chapters[0].cues[0].set, q = first.q, answer = expected(q), correct = q.choices.filter(c => c.ok);
    assert.equal(q.choices.length, 5); assert.equal(correct.length, 1);
    near(q.solution.math.answer, answer, q.key + ' source math'); near(numeric(correct[0].t), answer, q.key + ' exact choice');
    const canvasAnswer = numeric(q.ans[0]) * (q.solution.math.kind === 'cone' && q.fig.kind === 'V' ? Math.PI : 1);
    near(canvasAnswer, answer, q.key + ' original canvas answer convention');
    for (const choice of q.choices) katex.renderToString(choice.t, { throwOnError: true });
    if (first.tgLessonProblem) {
      assert.ok(lesson.answer.includes('=' + correct[0].t + '$'), q.key + ' authored answer');
      assert.ok(lesson.chapters.at(-1).cues.at(-1).say.includes('=' + correct[0].t + '$'), q.key + ' authored conclusion');
    }
  }
});

test('C production Board has finite geometry, immediate motion, fixed questions and replayable cues', t => {
  let frames = 0;
  for (const [id, count] of Object.entries(counts)) for (let i = 0; i < count; i++) {
    const u = unit(id, i), startState = state(u, 0), start = draw(startState), moving = draw(state(u, .75)), question = u.scene.question(startState);
    assert.ok(visible(start) && visible(moving)); assert.notEqual(signature(start), signature(moving), `${id}/${i}: visible first motion`);
    if (startState.tgLessonProblem) for (const choice of startState.q.choices) assert.ok(question.includes(choice.t), 'source question choices preserved');
    const reveal = u.timeline.cues.find(cue => cue.set?.tgShowAnswer).at;
    for (const at of [...u.timeline.cues.map(cue => cue.at), u.timeline.length]) {
      const s = state(u, at), frame = draw(s);
      assert.ok(visible(frame)); assert.doesNotMatch(frame.texts.join(' '), /undefined|NaN|Infinity/);
      assert.equal(frame.handles.length, 0); assert.equal(frame.value.formula, null); assert.equal(frame.value.rule, null);
      assert.equal(s.tgShowAnswer, at >= reveal); assert.deepEqual(plain(s.q), plain(startState.q));
      assert.equal(u.scene.question(s), question); assert.deepEqual(plain(s.tgPick), plain(u.base.tgPick));
      frames++;
    }
    const end = state(u, u.timeline.length), rewind = state(u, 0, end), again = draw(rewind);
    assert.equal(rewind.tgCTrace, 0); assert.equal(rewind.tgShowAnswer, false); assert.equal(rewind.tgCalculationReady, false);
    assert.equal(signature(again), signature(start), `${id}/${i}: replay restores source geometry`);
    const entry = draw({ ...startState, lessonEntry: true, step: 0 }), stale = draw({ ...end, lessonEntry: true, step: 99 });
    assert.equal(signature(stale), signature(entry), `${id}/${i}: entry suppresses stale geometry`);
    assert.deepEqual(stale.texts, entry.texts, `${id}/${i}: entry suppresses stale answers`);
  }
  t.diagnostic(`${frames} cue/end frames drawn through production source and Board`);
});

test('C diagonal construction, fixed-area slide and fold use the actual source geometry', () => {
  const u = unit('quadUnfold2x', 0), before = draw(state(u, 12)), middle = draw(state(u, 14)), after = draw(state(u, 18));
  const wide = frame => frame.paths.find(p => p.options.color === 'amber' && p.options.close && p.options.fill);
  assert.equal(wide(before), undefined); assert.ok(wide(middle).options.alpha > 0 && wide(middle).options.alpha < 1); assert.equal(wide(after).options.alpha, 1);
  const quad = after.paths.find(p => p.options.color === 'ink' && p.options.close && p.points.length === 4);
  near(area(wide(after).points), 2 * area(quad.points), 'constructed parallelogram is exactly twice the area');
  const v = unit('quadDiagHalf', 0), left = draw(state(v, 12)), right = draw(state(v, 18));
  const outline = frame => frame.paths.find(p => p.options.color === 'ink' && p.options.close && p.points.length === 4).points;
  assert.notDeepEqual(plain(outline(left)), plain(outline(right))); near(area(outline(left)), area(outline(right)), 'area remains fixed while intersection changes');
  const f = unit('r9-2', 0), flat = draw(state(f, 12)), folding = draw(state(f, 14)), folded = draw(state(f, 18));
  const sheet = frame => frame.paths.find(p => p.options.color === 'amber' && p.options.close && !p.options.fill).points;
  assert.notDeepEqual(plain(sheet(flat)), plain(sheet(folding))); assert.notDeepEqual(plain(sheet(folding)), plain(sheet(folded)));
  assert.ok(!folded.texts.includes('30°'), 'fold-angle conclusion is hidden until the final chapter');
  const final = draw(state(f, f.timeline.length)); assert.ok(final.texts.includes('30°'));
  const [A, E, Bprime] = sheet(final), w = state(f, 0).q.fig.w, C = point(w * Math.sqrt(3), 0);
  near(cross(sub(Bprime, A), sub(C, A)), 0, 'source reflected B is on diagonal AC');
  near(length(sub(Bprime, E)), length(E), 'source folding preserves BE');
});
