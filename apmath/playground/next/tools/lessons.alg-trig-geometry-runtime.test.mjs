// Production modules and Board/canvas execution. Browser/mobile/independent
// visual checks are NOT_RUN and are not implied by these VM assertions.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/trig-geometry-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const signature = f => JSON.stringify({ paths: f.paths, points: f.points, arcs: f.arcs, circles: f.circles, texts: f.boardTexts });
function apply(compiled, time, base, entry = false) {
  const value = video.stateAt(compiled, time, base);
  Object.assign(lab.s, value.nums, value.sets, { lessonOn: !entry, lessonEntry: entry, step: value.step, part: value.part });
  lab.tab = 'review';
  return lab.draw();
}
function prepare(id, label) {
  lab.go(id);
  const lesson = lessons(id).find(item => item.label === label);
  assert.ok(lesson, `${id}/${label}`);
  return { lesson, cs: video.compileLesson(lesson), base: baseline() };
}

test('catalog, first source questions, all lesson modules and validators are completely bound', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'alg-trig-geometry');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal); assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  for (const script of ['../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'alg-trig-geometry/lesson-core.js', 'alg-trig-geometry/lesson-a.js', 'alg-trig-geometry/lesson-b.js']) assert.ok(lab.loaded.includes(script), script);
  const splitGoals = { 'bas-1': ['반지름', '호길이', '중심각', '최대넓이'], 'bas-5': ['근개수', '근의합'], 'bas-6': ['현길이', '직각변'], 'bas-7': ['코사인값', '대각선'] };
  let count = 0, sourceGoals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(lesson => !firstSet(lesson).ltgConcept));
    assert.ok(lessons(id).some(lesson => firstSet(lesson).ltgConcept));
    for (const label of splitGoals[id] || []) assert.ok(lessons(id).some(lesson => lesson.label === label && !firstSet(lesson).ltgConcept), `${id}: separate original goal ${label}`);
    for (const lesson of lessons(id)) {
      count++;
      const init = firstSet(lesson), cs = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(cs.length >= 60 && cs.length <= 90);
      for (const key of ['ltgQuestion', 'ltgConcept', 'ltgTarget', 'ltgMode', 'ltgStage', 'ltgLabels', 'ltgShowAnswer', 'ltgInitial']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}/${key}`);
      assert.equal(init.ltgShowAnswer, false);
      if (!init.ltgConcept) { sourceGoals++; assert.equal(init.ltgQuestion, lab.api.question(id)); }
      assert.ok(cs.pins.length > 0, 'intermediate mathematical expressions are pinned');
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${id}/${key}`);
      const texts = [lesson.answer, init.ltgQuestion, ...lesson.chapters.flatMap(ch => ch.cues.map(cue => cue.say || ''))];
      for (const text of texts) for (const math of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(math[1], { throwOnError: true }), `${id}/${lesson.label}: ${math[1]}`);
    }
  }
  t.diagnostic(`${ids.length} scenes / ${count} lessons (${sourceGoals} original goals, ${count - sourceGoals} source inquiry concepts)`);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /const DEFAULT_PLAYBACK_RATE = 1\.5;/);
});

test('every cue paints finite native geometry and traces the actual figure in the first second', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const cs = video.compileLesson(lesson), base = baseline(), packet = lab.api.packet(sc.id), snapshot = plain(packet);
    const times = new Set([0, .9, cs.length]);
    for (const [i, chapter] of cs.chapters.entries()) for (const cue of lesson.chapters[i].cues) {
      times.add(chapter.at + cue.at);
      if (cue.to) times.add(chapter.at + cue.at + cue.dur / 2);
    }
    let start, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(cs, time, base); frames++;
      if (time === 0) start = signature(frame);
      if (time === .9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), `${sc.id}/${lesson.label}@${time}: source figure exists`);
      assert.deepEqual(plain(frame.value), {}, 'native result-card summary cannot bypass the authored captions');
      if (time < cs.chapters.at(-1).at) assert.equal(lab.s.ltgShowAnswer, false);
      if (time === cs.length) assert.equal(lab.s.ltgShowAnswer, true);
      if (sc.vary) assert.equal(sc.vary.cur(), packet, 'the lesson uses its first source packet');
      assert.equal(lab.api.packet(sc.id), packet);
      assert.ok(Object.values(frame.focus).flat().every(Number.isFinite));
      assert.ok(lab.s.t >= 0 && lab.s.t <= 1, 'authored positions remain in the original inquiry range');
    }
    assert.notEqual(start, motion, `${sc.id}/${lesson.label}: the source curve or outline is actually traced`);
    assert.deepEqual(plain(packet), snapshot);
  }
  t.diagnostic(`${frames} actual Board/canvas states; browser/mobile/independent visual audit NOT_RUN`);
});

test('manual variants, questions and board transforms survive replay and sibling transitions', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem';
    if (sc.vary) lab.newProblem();
    lab.draw();
    const selected = sc.vary?.cur(), question = sc.problem.text();
    if (sc.vary) assert.notEqual(selected, sc.vary.first(), `${sc.id}: actual new-problem handler selects another packet`);
    lab.board.zoom = 1.25; lab.board.panX = 17; lab.board.panY = -9;
    const focus = plain(lab.board.focus);
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base));
      apply(cs, cs.length, base);
      assert.equal(signature(apply(cs, 0, base)), initial, `${sc.id}/${lesson.label}: replay resets all native state`);
      assert.equal(lab.s.ltgShowAnswer, false);
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary?.cur(), selected); assert.equal(sc.problem.text(), question);
    assert.deepEqual(plain(lab.board.focus), focus);
    assert.equal(lab.board.zoom, 1.25); assert.equal(lab.board.panX, 17); assert.equal(lab.board.panY, -9);
  }
});

test('stale final-to-entry renders the first drawing snapshot without changing retained state', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; if (sc.vary) lab.newProblem(); lab.draw();
    const selected = sc.vary?.cur(), question = sc.problem.text();
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base, true));
      apply(cs, cs.length, base); lab.s.lessonOn = false; lab.s.lessonEntry = true;
      const held = plain(lab.s);
      assert.equal(signature(lab.draw()), initial, `${sc.id}/${lesson.label}: final labels and native stages cannot leak into entry`);
      assert.deepEqual(plain(lab.s), held);
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary?.cur(), selected); assert.equal(sc.problem.text(), question);
  }
});

test('native values, paired roots and alternative auxiliary angles follow their own captions', () => {
  let { cs, base } = prepare('bas-1', '중심각');
  assert.ok(!apply(cs, 47.9, base).boardTexts.includes('θ = 2 rad'));
  assert.ok(apply(cs, 48, base).boardTexts.includes('θ = 2 rad'));
  assert.ok(!apply(cs, 60, base).boardTexts.some(text => /r = 5|최댓값 S = 25/.test(text)), 'the angle lesson does not disclose sibling requested values');
  ({ cs, base } = prepare('bas-1', '호길이'));
  assert.ok(!apply(cs, 47.9, base).boardTexts.includes('l = 10'));
  assert.ok(apply(cs, 48, base).boardTexts.includes('l = 10'), 'the requested arc length is visible on its source arc at the final caption');
  ({ cs, base } = prepare('bas-2', '각변환합'));
  assert.ok(!apply(cs, 12, base).boardTexts.includes('P(4/5, 3/5)'));
  assert.ok(apply(cs, 18, base).boardTexts.includes('P(4/5, 3/5)'));
  assert.ok(!apply(cs, 24, base).boardTexts.includes('Q(-3/5, 4/5)'));
  assert.ok(apply(cs, 30, base).boardTexts.includes('Q(-3/5, 4/5)'));
  assert.ok(!apply(cs, 36, base).boardTexts.includes('R(3/5, 4/5)'));
  assert.ok(apply(cs, 42, base).boardTexts.includes('R(3/5, 4/5)'));
  ({ cs, base } = prepare('bas-3', '가중합'));
  assert.ok(!apply(cs, 24, base).boardTexts.some(text => text.includes('x₂+x₃ =')));
  assert.ok(apply(cs, 30, base).boardTexts.some(text => text.includes('x₂+x₃ = 3π/2')));
  ({ cs, base } = prepare('bas-6', '현길이'));
  assert.ok(!apply(cs, 47.9, base).boardTexts.some(text => text.includes('= 4√3')));
  const chord = apply(cs, 48, base).boardTexts;
  assert.ok(chord.some(text => text.includes('= 4√3'))); assert.ok(!chord.some(text => text.startsWith("A'C =")));
  ({ cs, base } = prepare('adv-2', '대칭넓이'));
  assert.ok(!apply(cs, 21.9, base).boardTexts.includes('∠POQ = π/3'));
  assert.ok(apply(cs, 22, base).boardTexts.includes('∠POQ = π/3'));
  assert.ok(apply(cs, 27, base).boardTexts.includes('OM = √3/2'));
  assert.ok(apply(cs, 32, base).boardTexts.includes('OM = \\frac{k}{√2}'));
  ({ cs, base } = prepare('adv-8', '인접보각'));
  const angleFrame = apply(cs, 6, base).boardTexts;
  assert.ok(angleFrame.includes('α')); assert.ok(angleFrame.includes('π−α'));
  assert.ok(!angleFrame.includes('BH = 1'), 'the alternative proof uses its adjacent angles, not a premature projection result');
  assert.ok(!apply(cs, 47.9, base).boardTexts.some(text => text.startsWith('AD = AB =')));
  assert.ok(apply(cs, 48, base).boardTexts.includes('AD = AB = 5'));
});

test('comparison contact traces two moving roots into one without showing unrelated equation roots', () => {
  const { cs, base } = prepare('bas-5', '접점한개');
  const start = apply(cs, 0, base), before = apply(cs, 24, base), final = apply(cs, 60, base);
  assert.ok(start.boardTexts.includes('y = t (-4/5)'));
  assert.ok(before.boardTexts.includes('y = t (≈ -0.960)'));
  assert.ok(final.boardTexts.includes('y = t (-1)'));
  const contacts = f => f.points.filter(p => p.options.color === '#fbbf24' && p.options.label === '');
  assert.equal(contacts(start).length, 2); assert.equal(contacts(before).length, 2); assert.equal(contacts(final).length, 1);
  const gap = f => Math.abs(contacts(f)[1].point.x - contacts(f)[0].point.x);
  assert.ok(gap(before) < gap(start), 'the actual two painted contacts approach one another');
  assert.ok(!start.boardTexts.some(text => /^x[₁₂]/.test(text)));
  assert.ok(!final.boardTexts.some(text => /^x[₁₂]/.test(text)));
  assert.equal(lab.api.model('bas-5', .1).roots.length, 2);
  assert.equal(lab.api.model('bas-5', 0).roots.length, 1);
  assert.ok(final.boardTexts.some(text => text.includes('접함, 1개')));
});

test('reproduced dimension fractions use the existing stacked-fraction renderer', async () => {
  const source = await load({ sourceOnly: true });
  const labels = [];
  for (const id of ['bas-3', 'bas-6', 'adv-2', 'adv-6']) {
    source.go(id); source.tab = 'review'; source.s.step = 3;
    const frame = source.draw(); labels.push(...frame.boardTexts);
    assert.ok(!frame.canvasText.some(text => /(?:\d*π\/\d|k\/√2|k\/2|\\frac)/.test(text)), `${id}: fraction source is not painted as slash text or TeX`);
  }
  for (const needle of ['안쪽 두 교점', "A'C =", 'OM =', '고정 현 BC']) {
    const value = labels.find(text => text.startsWith(needle)); assert.ok(value, needle);
    const parts = source.board._fracSplit(value); assert.ok(parts?.some(part => part.n != null && part.d != null), value);
    const size = source.board.annotationSize(value, { size: 12, weight: 800 });
    assert.ok(size.height > 18 && Number.isFinite(size.width), 'fraction height is included in dimension sizing');
  }
});

test('source-only loading keeps all manual scenes and the actual four variant pools usable', async () => {
  const source = await load({ sourceOnly: true });
  assert.equal(Object.keys(source.def.lessons).length, 0);
  for (const sc of source.list) {
    source.go(sc.id); source.draw(); source.tab = 'review'; source.s.step = 3; source.draw();
    source.tab = 'explore'; source.s.step = 3; source.draw();
    if (!sc.vary) continue;
    const first = sc.vary.first(), snapshot = plain(first), size = source.variant[sc.id].pool.length, visited = new Set([sc.vary.idx()]);
    source.tab = 'problem';
    for (let n = 0; n < 64 && visited.size < size; n++) {
      const previous = sc.vary.idx(); source.newProblem();
      assert.notEqual(sc.vary.idx(), previous); visited.add(sc.vary.idx());
      source.draw(); assert.ok(sc.problem.text());
    }
    assert.equal(visited.size, size, `${sc.id}: every existing source variant was loaded through the real handler`);
    assert.equal(sc.vary.first(), first); assert.deepEqual(plain(first), snapshot);
  }
});
