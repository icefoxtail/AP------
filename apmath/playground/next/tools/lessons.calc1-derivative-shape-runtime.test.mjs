// Actual HTML/deferred modules/Board run here. Browser, mobile and independent
// visual review are NOT_RUN; these assertions do not imply visual QA approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/derivative-shape-lesson-runtime.mjs';
const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const first = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const signature = f => JSON.stringify({ plots: f.plots.map(({evaluate, ...p}) => p), paths: f.paths, points: f.points, texts: f.boardTexts, focus: f.focus });
function apply(compiled, time, base, entry = false) {
  const s = video.stateAt(compiled, time, base);
  Object.assign(lab.s, s.nums, s.sets, { lessonOn: !entry, lessonEntry: entry, step: s.step, part: s.part });
  lab.tab = 'review'; return lab.draw();
}
function prepare(id, label) {
  lab.go(id);
  const lesson = lessons(id).find(l => l.label === label);
  assert.ok(lesson, `${id}/${label}`);
  return { lesson, cs: video.compileLesson(lesson), base: baseline() };
}

test('all seven source scenes, original goals, module registration, captions and validators are bound', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'calc1-derivative-shape');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal); assert.equal(ids.length, 7);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  const targets = { cubic: ['극값판별', '극값차', '중근판별'], quartic: ['극대없음', '극소위치'], roots: ['세실근', '두실근'], difference: ['접할높이', '극값개수'], integral: ['아래끝값'], always: ['최대이동'], rootcount: ['정수개수'] };
  for (const script of ['../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'calc1-derivative-shape/lesson-core.js', 'calc1-derivative-shape/lesson-a.js', 'calc1-derivative-shape/lesson-b.js']) assert.ok(lab.loaded.includes(script));
  let count = 0, sourceGoals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    for (const target of targets[id]) assert.ok(lessons(id).some(l => l.label === target && !first(l).ldsConcept));
    assert.ok(lessons(id).some(l => first(l).ldsConcept));
    for (const lesson of lessons(id)) {
      count++; const init = first(lesson), cs = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 5 && lesson.chapters.length <= 6);
      assert.ok(cs.length >= 60 && cs.length <= 90);
      for (const key of ['ldsQuestion', 'ldsConcept', 'ldsTarget', 'ldsExplore', 'ldsCase', 'ldsStage', 'ldsLabels', 'ldsShowAnswer', 'ldsRuler', 'ldsLine', 'ldsInitial']) assert.ok(Object.hasOwn(init, key));
      assert.equal(init.ldsShowAnswer, false);
      if (!init.ldsConcept) { sourceGoals++; assert.equal(init.ldsQuestion, lab.api.question(id)); }
      assert.ok(cs.pins.length >= 4, 'intermediate mathematical expressions remain pinned');
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${id}/${key}`);
      for (const text of [lesson.answer, init.ldsQuestion, ...lesson.chapters.flatMap(ch => ch.cues.map(c => c.say || ''))]) for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(m[1], { throwOnError: true }), `${id}/${lesson.label}/${m[1]}`);
    }
  }
  assert.equal(count, 23); assert.equal(sourceGoals, 12);
  t.diagnostic(`${ids.length} scenes / ${count} lessons (${sourceGoals} original goals, ${count - sourceGoals} existing inquiry concepts)`);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /const DEFAULT_PLAYBACK_RATE = 2;/);
});

test('every cue and transition paints finite native curves with real first-second motion', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id); const cs = video.compileLesson(lesson), base = baseline(), packet = lab.api.first(sc.id), snapshot = plain(packet);
    const times = new Set([0, .9, cs.length]);
    for (const [i, chapter] of cs.chapters.entries()) for (const cue of lesson.chapters[i].cues) {
      times.add(chapter.at + cue.at);
      if (cue.to) times.add(chapter.at + cue.at + cue.dur / 2);
    }
    let start, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const f = apply(cs, time, base); frames++;
      if (time === 0) start = signature(f);
      if (time === .9) motion = signature(f);
      assert.ok(f.plots.length >= 1, `${sc.id}/${lesson.label}@${time}: actual source curve`);
      assert.ok(f.canvas.some(op => op.name === 'lineTo'));
      assert.deepEqual(plain(f.value), {}, 'native result cards do not bypass captions');
      assert.equal(sc.vary.cur(), packet, 'first source packet survives manual variant selection');
      assert.ok(Object.values(f.focus).flat().every(Number.isFinite));
      if (time < cs.chapters.at(-1).at) assert.equal(lab.s.ldsShowAnswer, false);
      if (time === cs.length) assert.equal(lab.s.ldsShowAnswer, true);
    }
    assert.notEqual(start, motion, `${sc.id}/${lesson.label}: actual native curve is traced`);
    assert.deepEqual(plain(packet), snapshot);
  }
  t.diagnostic(`${frames} native Board/canvas states; browser/mobile/independent visual audit NOT_RUN`);
});

test('manual variant identity, question, focus and zoom survive every sibling and replay', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw();
    const selected = sc.vary.cur(), question = sc.problem.text();
    assert.notEqual(selected, sc.vary.first());
    lab.board.zoom = 1.25; lab.board.panX = 17; lab.board.panY = -9;
    const focus = plain(lab.board.focus), key = lab.board._cxKey;
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base));
      apply(cs, cs.length, base);
      assert.equal(signature(apply(cs, 0, base)), initial, `${sc.id}/${lesson.label}: reset`);
    }
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: 0 }); lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
    assert.deepEqual(plain(lab.board.focus), focus); assert.equal(lab.board._cxKey, key);
    assert.equal(lab.board.zoom, 1.25); assert.equal(lab.board.panX, 17); assert.equal(lab.board.panY, -9);
  }
});

test('stale final-to-entry restores the initial drawing and pane state without altering held data', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw();
    const selected = sc.vary.cur(), question = sc.problem.text();
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base, true)), panes = plain(sc.panes(lab.s) || null);
      apply(cs, cs.length, base); lab.s.lessonOn = false; lab.s.lessonEntry = true;
      const held = plain(lab.s);
      assert.equal(signature(lab.draw()), initial, `${sc.id}/${lesson.label}: final state cannot leak`);
      assert.deepEqual(plain(sc.panes(lab.s) || null), panes);
      assert.deepEqual(plain(lab.s), held);
    }
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: 0 }); lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
  }
});

test('native answer labels and integer ruler appear with their own final captions only', () => {
  const checks = [
    ['cubic', '극값판별', /^(극대|극소)$/], ['cubic', '극값차', /^Δy = 4$/],
    ['quartic', '극소위치', /γ=−1 → 극소 x=3/], ['roots', '세실근', /세 실근: 0 < C < 4/],
    ['roots', '두실근', /띠의 경계\(C = 0, 4\)/], ['difference', '접할높이', /^y = k = −3$/],
    ['difference', '극값개수', /극값 0개/], ['integral', '아래끝값', /^a = −1$/],
    ['always', '최대이동', /^h의 최솟값 2$/]
  ];
  for (const [id, name, answer] of checks) {
    const { cs, base } = prepare(id, name), at = cs.chapters.at(-1).at;
    assert.ok(!apply(cs, at - .01, base).boardTexts.some(t => answer.test(t)), `${id}/${name}: no early answer`);
    assert.ok(apply(cs, at, base).boardTexts.some(t => answer.test(t)), `${id}/${name}: final caption reveals native answer`);
  }
  let { cs, base } = prepare('roots', '세실근');
  assert.ok(!apply(cs, cs.length, base).boardTexts.some(t => /띠의 경계/.test(t)), 'three-root goal does not give the sibling boundary answer');
  ({ cs, base } = prepare('rootcount', '정수개수'));
  const before = apply(cs, 59.99, base), after = apply(cs, 60, base);
  assert.ok(!before.points.some(p => p.options.ref === 'strip'));
  const admitted = after.points.filter(p => p.options.ref === 'strip' && !p.options.hollow);
  assert.deepEqual(admitted.map(p => p.point.y), [-3, -2, -1]);
});

test('selected derivative cases and horizontal contacts use original source functions', () => {
  let { cs, base } = prepare('cubic', '중근판별');
  const double = apply(cs, 30, base);
  assert.ok(double.plots.every(p => p.options.ref === 'F2'));
  for (const p of double.plots) for (const x of [0, 1, 2]) assert.ok([3 * (x - 1) ** 2, (x - 1) ** 3].some(y => Math.abs(p.evaluate(x) - y) < 1e-12));
  ({ cs, base } = prepare('roots', '두실근'));
  for (const [time, height, roots] of [[24, 0, [0, 3]], [42, -4, [-1, 2]]]) {
    const f = apply(cs, time, base), contacts = f.points.filter(p => p.options.ref === 'lessonRoots');
    assert.equal(contacts.length, roots.length);
    contacts.forEach((p, i) => { assert.ok(Math.abs(p.point.x - roots[i]) < 1e-7); assert.equal(p.point.y, height); assert.ok(Math.abs(p.point.x ** 3 - 3 * p.point.x ** 2 - height) < 1e-7); });
  }
  ({ cs, base } = prepare('quartic', '중근전후'));
  apply(cs, 42, base); assert.equal(lab.api.quarticCase(lab.s), 'three');
  apply(cs, 60, base); assert.equal(lab.api.quarticCase(lab.s), 'left');
});

test('source-only loader retains manual diagrams, actual new-problem handlers and drag handles', async () => {
  const source = await load({ sourceOnly: true });
  assert.equal(Object.keys(source.def.lessons).length, 0);
  const dragIds = { cubic: 'beta', quartic: 'gamma', roots: 'beta', difference: 'k', integral: 'pin', always: 'A', rootcount: 'K' };
  for (const sc of source.list) {
    source.go(sc.id); source.s.step = 3;
    const firstPacket = sc.vary.first(), snapshot = plain(firstPacket), exploration = source.draw();
    const handle = exploration.handles.find(h => h.id === dragIds[sc.id]);
    assert.ok(handle && typeof handle.options.drag === 'function', `${sc.id}: original drag remains`);
    const state = plain(source.s); handle.options.drag({ x: 1.4, y: .7 });
    assert.notDeepEqual(plain(source.s), state, `${sc.id}: drag changes source parameter`); source.draw();
    source.tab = 'problem';
    for (let i = 0; i < 8; i++) {
      const before = sc.vary.cur(); source.newProblem(); assert.notEqual(sc.vary.cur(), before);
      source.draw(); assert.ok(sc.problem.text());
      source.tab = 'review'; source.s.step = 4; source.draw(); source.tab = 'problem';
    }
    assert.equal(sc.vary.first(), firstPacket); assert.deepEqual(plain(firstPacket), snapshot);
  }
});
