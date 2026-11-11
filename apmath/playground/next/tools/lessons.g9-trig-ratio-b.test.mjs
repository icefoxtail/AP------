// Original fixed questions + independent trig/coordinate arithmetic + real Board commands.
// These source-level checks do not claim browser/mobile or independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/trig-ratio-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const lab = await load(), G = lab.api;
const counts = { findFromHyp: 8, findFromBase: 6, sasAcuteLen: 4, sasObtuseLen: 4, asaSplit75: 5, 'r4-2': 5, 'r4-3': 5, trapDontSplit60: 5,
  'r5-1': 4, heightObtuse: 3, std4560Height: 4, std3060Mountain: 2, treeEyeHeight: 4, pendulumSwing: 4, brokenTreeCone: 6 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, label = '') => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)), `${label}: ${a} ≈ ${b}`);
const sin = x => Math.sin(x * Math.PI / 180), cos = x => Math.cos(x * Math.PI / 180), tan = x => Math.tan(x * Math.PI / 180);
const len = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = pts => Math.abs(pts.reduce((sum, p, i) => sum + p.x * pts[(i + 1) % pts.length].y - p.y * pts[(i + 1) % pts.length].x, 0)) / 2;
const per = pts => pts.reduce((sum, p, i) => sum + len(p, pts[(i + 1) % pts.length]), 0);
const texts = f => f.texts.join('\n');
const visible = f => f.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0);
const signature = f => JSON.stringify(f.paths.map(p => [p.points, p.options]));

// Read only the numeric radical/fraction grammar emitted in the source choices.
// This is independent of the production V arithmetic engine; no eval is used.
function number(input) {
  const s = String(input).replace(/√(\d+)/g, '\\sqrt{$1}').replace(/\^\{\\circ\}|°|\$/g, '').replace(/\\(?:left|right|,|!|;)/g, '').replace(/\s+/g, '').replace(/−/g, '-');
  let i = 0;
  const group = () => { const open = s[i++], end = open === '{' ? '}' : ')'; assert.ok(['{', '('].includes(open), s); const x = sum(); assert.equal(s[i++], end, s); return x; };
  const atom = () => {
    if (s[i] === '+') { i++; return atom(); }
    if (s[i] === '-') { i++; return -atom(); }
    if (s[i] === '{' || s[i] === '(') return group();
    if (s.startsWith('\\sqrt', i)) { i += 5; return Math.sqrt(group()); }
    if (s.startsWith('\\frac', i)) { i += 5; const n = group(), d = group(); return n / d; }
    const m = s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/); assert.ok(m, `number at ${s.slice(i)} in ${s}`); i += m[0].length; return Number(m[0]);
  };
  const product = () => {
    let x = atom();
    while (i < s.length && !['+', '-', '}', ')'].includes(s[i])) {
      if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { i += s.startsWith('\\times', i) ? 6 : 5; x *= atom(); }
      else if (s[i] === '/') { i++; x /= atom(); }
      else if (s[i] === '*') { i++; x *= atom(); }
      else x *= atom();
    }
    return x;
  };
  function sum() { let x = product(); while (s[i] === '+' || s[i] === '-') { const op = s[i++], y = product(); x = op === '+' ? x + y : x - y; } return x; }
  const value = sum(); assert.equal(i, s.length, `unread ${s.slice(i)}`); return value;
}
function fixture(q) {
  const m = q.solution.math, f = q.fig;
  switch (m.kind) {
    case 'special-side': {
      const unit = { a: sin(m.theta), b: cos(m.theta), c: 1 };
      const scale = m.given / unit[m.givenSide];
      for (const key of ['a', 'b', 'c']) near(number(f.solutionSide[key]), scale * unit[key], 'source side ' + key);
      near(f.a / f.b, tan(m.theta), 'source right-triangle shape');
      return scale * unit[m.askedSide];
    }
    case 'sas': {
      const A = { x: m.c * cos(m.angle), y: -m.c * sin(m.angle) }, B = { x: 0, y: 0 }, C = { x: m.a, y: 0 }, H = { x: A.x, y: 0 };
      near(len(A, B), m.c); near(len(B, C), m.a);
      assert.equal(H.x < 0, m.angle > 90, 'obtuse foot lies on the extension');
      near(number(f.work.ah), len(A, H)); near(number(f.work.bh), len(B, H)); near(number(f.work.hc), len(H, C));
      near(len(H, C), m.angle > 90 ? m.a + len(B, H) : m.a - len(B, H));
      return len(A, C);
    }
    case 'chain': {
      const A = { x: 0, y: -m.height }, B = { x: -m.height / tan(m.pair[0]), y: 0 }, C = { x: m.height / tan(m.pair[1]), y: 0 };
      const sides = { ab: len(A, B), ac: len(A, C), bc: len(B, C) };
      near(number(f.g), sides[m.givenSide]); near(f.exact.h.v, m.height);
      for (const [key, value] of Object.entries(sides)) near(f.exact[key].v, value);
      return sides[m.askedSide];
    }
    case 'tan15': {
      const k = m.scale, A = { x: 0, y: -k }, B = { x: k * Math.sqrt(3), y: 0 }, C = { x: 0, y: 0 }, D = { x: k * (2 + Math.sqrt(3)), y: 0 };
      near(len(A, B), len(B, D), 'isosceles construction'); near(number(f.work.CD), len(C, D));
      return m.ask === 'cd' ? len(C, D) : m.ask === 't15' ? len(A, C) / len(C, D) : len(C, D) / len(A, C);
    }
    case 'tape': {
      const w = m.width, side = w / sin(m.angle), offset = w / tan(m.angle);
      const pts = [{ x: 0, y: 0 }, { x: side, y: 0 }, { x: side + offset, y: -w }, { x: offset, y: -w }];
      for (let i = 0; i < 4; i++) near(len(pts[i], pts[(i + 1) % 4]), side, 'rhombus side');
      near(number(f.side), side); near(number(f.area), area(pts)); near(per(pts), 4 * side);
      return m.ask === 'side' ? side : area(pts);
    }
    case 'complement': return 90 - m.angle;
    case 'height': {
      const h = m.distance / (1 / tan(m.angles[0]) + (m.same ? -1 : 1) / tan(m.angles[1]));
      const bh = h / tan(m.angles[0]), ch = h / tan(m.angles[1]);
      for (const [key, value] of Object.entries({ h, bh, ch })) { near(f.R[key], value, 'source geometry ' + key); near(number(f.work[key]), value, 'source exact length ' + key); }
      near(m.same ? bh - ch : bh + ch, m.distance, 'ground partition');
      if (f.mount) near(Math.hypot(h, ch), m.distance, 'mountain AC = BC');
      return { h, bh, ch }[m.ask];
    }
    case 'tree': {
      const up = m.distance * tan(m.angle); near(number(f.up), up); near(number(f.height), up + m.eye);
      return up + m.eye;
    }
    case 'pendulum': {
      const drop = m.length * cos(m.angle), swing = { x: m.length * sin(m.angle), y: drop };
      near(len({ x: 0, y: 0 }, swing), m.length, 'unchanged rope'); near(number(f.drop), drop);
      assert.ok(drop > 0 && drop < m.length); return m.length - drop;
    }
    case 'broken-tree': {
      const h = m.distance * tan(m.angle), L = Math.hypot(m.distance, h), H = h + L;
      for (const [key, value] of Object.entries({ h, L, H })) near(number(f.work[key]), value);
      near(L, m.distance / cos(m.angle), 'broken segment hypotenuse');
      return { h, L, H }[m.ask];
    }
    default: assert.fail('Unhandled source kind ' + m.kind);
  }
}
function init(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  const lesson = lab.def.lessons[id][index];
  lab.s.tgPick = { key: 'unrelated manual choice', idx: 2 };
  return { id, scene: lab.scene, lesson, compiled: video.compileLesson(lesson), base: { ...lab.s } };
}
function state(u, at, base = u.base) {
  // Use the actual source.enter step (normally 1), matching the real player's base.
  const value = video.stateAt(u.compiled, at, { nums: { ...base }, sets: { ...base }, step: base.step, part: base.part });
  return { ...base, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
function types(id, q) {
  const m = q.solution.math;
  switch (id) {
    case 'findFromHyp': return `${m.theta}:${m.askedSide}`;
    case 'findFromBase': return `${m.givenSide}:${m.askedSide}`;
    case 'sasAcuteLen': case 'sasObtuseLen': return String(m.angle);
    case 'asaSplit75': return `${m.givenSide}:${m.askedSide}`;
    case 'trapDontSplit60': return q.fig.pair.join(',');
    case 'treeEyeHeight': case 'pendulumSwing': return String(m.angle);
    default: return m.ask;
  }
}
const families = { findFromHyp: ['30:a', '30:b', '45:a', '45:b', '60:a', '60:b'], findFromBase: ['a:b', 'a:c', 'b:a', 'b:c'],
  sasAcuteLen: ['30', '45', '60'], sasObtuseLen: ['120', '135', '150'], asaSplit75: ['ac:ab', 'ac:bc', 'bc:ab', 'bc:ac'],
  'r4-2': ['t15', 't75', 'cd'], 'r4-3': ['side', 'area'], trapDontSplit60: ['45,60', '60,45', '45,30', '30,45'],
  'r5-1': ['h', 'bh', 'ch'], heightObtuse: ['h', 'bh'], std4560Height: ['h', 'bh', 'ch'], std3060Mountain: ['h'],
  treeEyeHeight: ['30', '45', '60'], pendulumSwing: ['30', '45', '60'], brokenTreeCone: ['h', 'L', 'H'] };

test('B registers all 15 scenes / 69 valid lessons and all authored source families', () => {
  let concepts = 0, problems = 0;
  for (const [id, count] of Object.entries(counts)) {
    const list = lab.def.lessons[id]; assert.equal(list.length, count);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    const seen = [];
    for (const lesson of list) {
      const first = lesson.chapters[0].cues[0].set, c = video.compileLesson(lesson);
      assert.equal(first.tgSeed, 0); assert.equal(first.tgShowAnswer, false); assert.equal(first.tgCalculationReady, false); assert.equal(typeof first.tgLessonProblem, 'boolean');
      assert.equal('tgPick' in first, false); assert.ok(Object.isFrozen(first.q.fig)); assert.ok(Object.isFrozen(first.q.solution));
      assert.equal(lesson.chapters[0].start.tgBTrace, 0);
      assert.equal(c.cues.find(cue => cue.set?.tgShowAnswer).at, c.chapters.at(-1).at);
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
        if (cue.say == null) continue;
        assert.doesNotMatch(cue.say, /undefined|NaN|Infinity/);
        for (const match of cue.say.matchAll(/\$([^$]+)\$/g)) katex.renderToString(match[1], { throwOnError: true });
      }
      if (first.tgLessonProblem) { problems++; seen.push(types(id, first.q)); } else { concepts++; assert.ok(first.tgBQuestion); }
    }
    assert.deepEqual(seen.sort(), [...families[id]].sort(), id);
  }
  assert.equal(concepts, 22); assert.equal(problems, 47);
});

for (const id of Object.keys(counts)) {
  test(`${id}: exact source choice and authored final answer match independent geometry`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s = state(u, 0), q = s.q, answer = fixture(q), correct = q.choices.filter(c => c.ok);
      assert.equal(q.choices.length, 5); assert.equal(correct.length, 1);
      near(q.solution.math.answer, answer, q.key + ' source solution');
      near(number(correct[0].t), answer, q.key + ' exact TeX choice'); near(number(q.ans[0]), answer, q.key + ' source figure answer');
      for (const choice of q.choices) katex.renderToString(choice.t, { throwOnError: true });
      if (s.tgLessonProblem) {
        assert.equal(u.lesson.answer, G.NUM[q.choices.findIndex(c => c.ok)]);
        assert.ok(u.lesson.answerText.includes(`$${correct[0].t}$`));
        assert.ok(u.lesson.chapters.at(-1).cues[0].say.includes(`=${correct[0].t}$`));
      }
    }
  });
  test(`${id}: actual source Board stays finite, moves within 1s, gates answers and replays`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s0 = state(u, 0), start = draw(s0), early = draw(state(u, .75)), q = plain(s0.q), question = u.scene.question(s0);
      assert.equal(u.base.step, 1, 'source.enter base step used by the player');
      assert.ok(visible(start) && visible(early)); assert.notEqual(signature(start), signature(early), id + '/' + index + ' source edge moves within 1s');
      if (s0.tgLessonProblem) for (const [i, choice] of s0.q.choices.entries()) assert.ok(question.includes(G.NUM[i] + ' $' + choice.t + '$'), 'original numbered choice');
      const finalTime = u.compiled.chapters.at(-1).at;
      for (const cue of u.compiled.cues) {
        const s = state(u, cue.at), frame = draw(s);
        assert.ok(visible(frame)); assert.doesNotMatch(texts(frame), /undefined|NaN|Infinity/);
        assert.equal(s.tgShowAnswer, cue.at >= finalTime); assert.deepEqual(plain(s.q), q); assert.equal(u.scene.question(s), question);
        assert.deepEqual(plain(s.tgPick), plain(u.base.tgPick), 'manual selection preserved');
        if (s0.tgLessonProblem && !(id === 'r4-2' && s0.q.fig.kind !== 'cd')) {
          if (cue.at < finalTime) assert.match(texts(frame), /\bx\b/, 'target remains unknown before final chapter');
          else assert.doesNotMatch(texts(frame), /\bx\b/, 'final queried target replaced');
        }
      }
      const end = state(u, u.compiled.length), rewind = state(u, 0, end), again = draw(rewind);
      assert.equal(rewind.tgShowAnswer, false); assert.equal(rewind.tgCalculationReady, false); assert.equal(rewind.tgBTrace, 0);
      assert.deepEqual(plain(rewind.q), q); assert.equal(signature(again), signature(start), 'replay restores geometry');
      const entry = draw({ ...s0, lessonEntry: true, step: 0 });
      const stale = draw({ ...end, lessonEntry: true, step: 99 });
      assert.equal(signature(stale), signature(entry), 'entry suppresses stale solution geometry');
      assert.deepEqual(stale.texts, entry.texts, 'entry suppresses stale answer labels');
    }
  });
}

test('B concept annotations identify top angles, an isosceles mountain and both altitude choices', () => {
  const tower = init('r5-1', 0), ts = state(tower, 12), tf = draw(ts), m = ts.q.solution.math;
  assert.ok(tf.texts.includes('x') && tf.texts.includes('y'), 'top-angle symbols remain x and y');
  near(m.distance / (tan(90 - m.angles[0]) + tan(90 - m.angles[1])), ts.q.fig.R.h, 'top-angle height formula');
  const mountain = init('std3060Mountain', 0), ms = state(mountain, 12), mf = draw(ms);
  near(ms.q.fig.R.h, ms.q.fig.a0 * Math.sqrt(3) / 2, 'isosceles height');
  assert.ok(mf.paths.filter(p => p.options.color === 'amber').length >= 2, 'matching AC / BC tick commands');
  const trap = init('trapDontSplit60', 0), wrong = draw(state(trap, 12)), right = draw(state(trap, 24));
  assert.ok(wrong.paths.some(p => p.options.color === 'red'), 'incorrect C altitude is explicitly red');
  assert.ok(right.paths.some(p => p.options.color === 'violet'), 'correct A altitude is drawn');
  assert.notEqual(signature(wrong), signature(right));
});
