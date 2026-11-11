// Production module/Board safety, source questions, and coordinate-based math.
// These command-level checks are not browser/mobile or independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/similarity-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const lab = await load(), G = lab.api;
const counts = { 'sm4-conv': 5, 'sm4-x': 3, 'sm4-ef': 3, 'sm4-mid': 5, 'sm4-four': 4, 'sm4-vari': 4, 'sm4-bis': 4, 'sm4-bisx': 3, 'sm5-lmn': 5, 'sm5-trap': 3, 'sm5-tmid': 5 };
const kinds = { 'sm4-conv': 3, 'sm4-x': 2, 'sm4-ef': 2, 'sm4-mid': 3, 'sm4-four': 2, 'sm4-vari': 2, 'sm4-bis': 3, 'sm4-bisx': 2, 'sm5-lmn': 3, 'sm5-trap': 2, 'sm5-tmid': 3 };
const plain = v => JSON.parse(JSON.stringify(v));
const near = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-7, `${label}: ${a} ≈ ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const perimeter = p => p.reduce((sum, q, i) => sum + distance(q, p[(i + 1) % p.length]), 0);
const area = p => Math.abs(p.reduce((sum, q, i) => sum + q.x * p[(i + 1) % p.length].y - q.y * p[(i + 1) % p.length].x, 0)) / 2;
const parallel = (a, b, c, d) => near((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x), 0, 'parallel');
const midpoint = (m, a, b) => { near(m.x, (a.x + b.x) / 2); near(m.y, (a.y + b.y) / 2); };
const text = frame => frame.texts.join('\n');
const signature = frame => JSON.stringify(frame.paths.filter(p => p.options.color !== null || p.options.fill).map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0);
function init(id, index) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  const lesson = lab.def.lessons[id][index];
  return { id, scene: lab.scene, lesson, compiled: video.compileLesson(lesson), base: { ...lab.s } };
}
function state(u, at, base = u.base) {
  const v = video.stateAt(u.compiled, at, { nums: { ...base }, sets: { ...base }, step: 0, part: null });
  return { ...base, ...v.nums, ...v.sets, step: v.step, part: v.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s) { Object.assign(lab.s, s); return lab.draw(); }
function quiz(u, s) { return u.scene.sm.questionOf(s); }
function geometry(id, p) {
  if (id === 'sm4-conv') {
    const d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1), tri = G.triTop(p.rr * p.N, p.q * p.N, p.p * p.N);
    return { ...tri, D: G.lerp(tri.A, tri.B, d / p.N), E: G.lerp(tri.A, tri.C, d / p.N) };
  }
  const functions = {
    'sm4-x': () => G.geo.xGeo(p.m, p.n, p.r), 'sm4-ef': () => G.geo.efGeo(p.m, p.n),
    'sm4-mid': () => G.geo.midGeo(p.p, p.q, p.r), 'sm4-four': () => G.geo.fourGeo(p.t),
    'sm4-vari': () => G.geo.vGeo(p.a, p.bb, p.th), 'sm4-bis': () => G.geo.bisGeo(p.m, p.n),
    'sm4-bisx': () => G.geo.bisxGeo(p.n, p.g0), 'sm5-lmn': () => G.geo.lmnGeo(p.a, p.bb, p.u),
    'sm5-trap': () => G.geo.trGeo(p.a, p.m, p.n, p.t), 'sm5-tmid': () => G.geo.midTrGeo(p.a0, p.b0)
  };
  return functions[id]();
}
function expected(id, p, g) {
  const len = (a, b) => distance(g[a], g[b]);
  switch (id) {
    case 'sm4-conv': return [len('E', 'C'), len('D', 'E'), len('A', 'E') + len('D', 'E')][p.kind];
    case 'sm4-x': return p.kind ? len('O', 'A') : len('B', 'C');
    case 'sm4-ef': return p.kind ? len('E', 'O') : len('E', 'F');
    case 'sm4-mid': return [len('D', 'E'), len('B', 'C'), perimeter([g.A, g.D, g.E])][p.kind];
    case 'sm4-four': return p.kind ? area([g.D, g.E, g.F]) : perimeter([g.D, g.E, g.F]);
    case 'sm4-vari': return p.kind ? len('B', 'D') : perimeter([g.E, g.F, g.Gp, g.H]);
    case 'sm4-bis': return p.kind === 2 ? len('A', 'B') / len('A', 'C') : p.kind ? len('D', 'C') : len('B', 'D');
    case 'sm4-bisx': return p.kind ? len('B', 'D') : len('C', 'D');
    case 'sm5-lmn': return [len('E', 'F'), len('B', 'C'), len('D', 'E')][p.kind];
    case 'sm5-trap': return p.kind ? len('B', 'C') : len('E', 'F');
    case 'sm5-tmid': return [len('E', 'F'), len('B', 'C'), len('Pp', 'Qp')][p.kind];
  }
}
function premises(id, g) {
  const len = (a, b) => distance(g[a], g[b]);
  switch (id) {
    case 'sm4-conv':
      parallel(g.D, g.E, g.B, g.C); near(len('A', 'D') / len('D', 'B'), len('A', 'E') / len('E', 'C')); break;
    case 'sm4-x':
      parallel(g.A, g.D, g.B, g.C); near(len('O', 'A') / len('O', 'C'), len('O', 'D') / len('O', 'B')); break;
    case 'sm4-ef':
      parallel(g.A, g.D, g.E, g.F); parallel(g.A, g.D, g.B, g.C);
      near(len('E', 'O'), len('O', 'F')); near(len('E', 'F'), 2 * len('A', 'D') * len('B', 'C') / (len('A', 'D') + len('B', 'C'))); break;
    case 'sm4-mid':
      midpoint(g.D, g.A, g.B); midpoint(g.E, g.A, g.C); parallel(g.D, g.E, g.B, g.C); near(2 * len('D', 'E'), len('B', 'C')); break;
    case 'sm4-four': {
      midpoint(g.D, g.A, g.B); midpoint(g.E, g.B, g.C); midpoint(g.F, g.C, g.A);
      const s = area([g.D, g.E, g.F]);
      for (const tri of [[g.A, g.D, g.F], [g.D, g.B, g.E], [g.F, g.E, g.C]]) near(area(tri), s);
      near(s * 4, area([g.A, g.B, g.C])); break;
    }
    case 'sm4-vari':
      midpoint(g.E, g.A, g.B); midpoint(g.F, g.B, g.C); midpoint(g.Gp, g.C, g.D); midpoint(g.H, g.D, g.A);
      parallel(g.E, g.F, g.H, g.Gp); parallel(g.F, g.Gp, g.E, g.H); near(perimeter([g.E, g.F, g.Gp, g.H]), len('A', 'C') + len('B', 'D')); break;
    case 'sm4-bis':
      near(G.angBetween(g.A, g.B, g.D), G.angBetween(g.A, g.D, g.C));
      near(len('B', 'D') / len('D', 'C'), len('A', 'B') / len('A', 'C')); parallel(g.C, g.E, g.A, g.D); break;
    case 'sm4-bisx':
      near(G.angBetween(g.A, g.C, g.D), G.angBetween(g.A, g.D, g.E));
      near(len('B', 'D') - len('C', 'D'), len('B', 'C')); near(len('B', 'D') / len('C', 'D'), len('A', 'B') / len('A', 'C')); break;
    case 'sm5-lmn':
      near(g.A.y, g.D.y); near(g.B.y, g.E.y); near(g.C.y, g.F.y); parallel(g.A, g.N, g.D, g.F);
      near(len('A', 'M'), len('D', 'E')); near(len('M', 'N'), len('E', 'F')); near(len('A', 'B') / len('B', 'C'), len('D', 'E') / len('E', 'F')); break;
    case 'sm5-trap':
      parallel(g.A, g.D, g.E, g.F); parallel(g.A, g.D, g.B, g.C); parallel(g.A, g.H, g.D, g.C);
      near(len('Gp', 'F'), len('A', 'D')); near(len('A', 'E') / len('A', 'B'), len('E', 'Gp') / len('B', 'H')); break;
    case 'sm5-tmid':
      midpoint(g.E, g.A, g.B); midpoint(g.F, g.D, g.C);
      near(len('E', 'F'), (len('A', 'D') + len('B', 'C')) / 2); near(len('Pp', 'Qp'), (len('B', 'C') - len('A', 'D')) / 2); break;
  }
}

test('B registers 11 scenes / 44 valid lessons and every original problem kind', () => {
  let concepts = 0, problems = 0;
  for (const [id, count] of Object.entries(counts)) {
    const set = lab.def.lessons[id]; assert.equal(set.length, count);
    const report = video.validateLessonSet(set); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    const seen = [];
    for (const lesson of set) {
      const first = lesson.chapters[0].cues[0].set, compiled = video.compileLesson(lesson);
      assert.equal(typeof first.smLessonProblem, 'boolean'); assert.equal(first.smShowAnswer, false); assert.equal(first.smCalculationReady, false); assert.equal(first.smSeed, 0);
      assert.equal(first.smPk.seed, 1); assert.equal(lesson.chapters[0].start.smBTrace, 0);
      assert.doesNotMatch(JSON.stringify(lesson), /undefined|NaN|Infinity|√|\\sqrt|\\t(?:imes)? /);
      const answer = compiled.cues.find(c => c.set?.smShowAnswer); assert.equal(answer.at, compiled.chapters.at(-1).at);
      if (first.smLessonProblem) { seen.push(first.smPk.kind); problems++; } else { concepts++; assert.ok(first.smBQuestion); }
    }
    assert.deepEqual(seen.sort(), Array.from({ length: kinds[id] }, (_, i) => i), id);
  }
  assert.equal(concepts, 17); assert.equal(problems, 27);
});

for (const id of Object.keys(counts)) {
  test(`${id}: source math and authored final answers match exact geometric lengths/areas`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s = state(u, 0), p = s.smPk, g = geometry(id, p);
      premises(id, g);
      if (!s.smLessonProblem) continue;
      const Q = quiz(u, s), correct = Q.choices.filter(c => c.ok); assert.equal(Q.choices.length, 5); assert.equal(correct.length, 1);
      const answer = expected(id, p, g), chosen = correct[0].p;
      if (id === 'sm4-bis' && p.kind === 2) {
        const [a, b] = chosen.split(':').map(Number); near(a / b, answer); assert.equal(G.gcd(a, b), 1);
        assert.ok(u.lesson.answer.endsWith(`${a}:${b}`));
      } else {
        near(Number(chosen), answer, id + ' option');
        const number = u.lesson.answer.match(/=([-\d.]+)$/); assert.ok(number); near(Number(number[1]), answer, id + ' authored');
      }
      const solution = u.scene.sm.solution(s);
      if (typeof solution.answer === 'number') near(solution.answer, answer);
    }
  });
  test(`${id}: real Board commands remain visible, finite and synchronized through all authored cues`, () => {
    for (let index = 0; index < counts[id]; index++) {
      const u = init(id, index), s0 = state(u, 0), a = draw(s0), b = draw(state(u, .75));
      assert.ok(visible(a) && visible(b)); assert.notEqual(signature(a), signature(b), id + '/' + index + ' actual first-second trace');
      const Q = quiz(u, s0), question = u.scene.question(s0), finalTime = u.compiled.chapters.at(-1).at;
      if (s0.smLessonProblem) for (const [i, c] of Q.choices.entries()) {
        const display = c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p;
        assert.ok(question.includes(G.NUM[i] + ' ' + display), 'original numbered choice ' + i);
      }
      for (const cue of u.compiled.cues) {
        const s = state(u, cue.at), frame = draw(s);
        assert.ok(visible(frame), id + '/' + index + '@' + cue.at);
        assert.equal(s.smShowAnswer, cue.at >= finalTime);
        assert.deepEqual(plain(quiz(u, s)), plain(Q)); assert.equal(u.scene.question(s), question);
        assert.doesNotMatch(text(frame) + question, /undefined|NaN|Infinity|√|\\sqrt/);
        if (s0.smLessonProblem && Object.keys(u.scene.sm.solution(s).targets).length) {
          if (cue.at < finalTime) assert.match(text(frame), /\bx\b/, 'unknown remains before answer');
          else assert.doesNotMatch(text(frame), /\b[xy]\b/, 'final queried labels are replaced');
        }
        if (!s0.smLessonProblem) assert.doesNotMatch(text(frame), /\b[xy]\b/, 'concept figures do not show unrelated unknowns');
      }
      const end = state(u, u.compiled.length), rewind = state(u, 0, end);
      assert.equal(rewind.smShowAnswer, false); assert.equal(rewind.smCalculationReady, false); assert.equal(rewind.smBTrace, 0);
      assert.deepEqual(plain(rewind.smPk), plain(s0.smPk)); assert.equal(signature(draw(rewind)), signature(a));
      const entry = { ...end, lessonEntry: true, lessonOn: false }, entryFrame = draw(entry);
      if (s0.smLessonProblem && Object.keys(u.scene.sm.solution(entry).targets).length) assert.match(text(entryFrame), /\bx\b/, 'entry overrides stale final state');
    }
  });
}
