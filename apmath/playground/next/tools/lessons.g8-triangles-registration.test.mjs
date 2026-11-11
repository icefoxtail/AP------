// Minimal release safety: actual HTML loader, all registered lessons, and real
// Board draw calls. These checks do not certify mobile layout or visual quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/triangles-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');

function frame(lab, id, lesson, time, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = core.compileLesson(lesson);
  const state = core.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, playing: false, dragging: !entry });
  lab.tab = entry ? 'explore' : timeline.tab || 'explore';
  // Set the fixed problem before its stage, as the production lesson does.
  lab.scene.view(lab.s, lab);
  lab.s.step = entry ? 0 : state.step;
  lab.s.part = state.part;
  return { ...lab.draw(), state, timeline };
}

test('HTML, catalog and lesson map cover every triangles scene without duplicates', async t => {
  const lab = await load();
  const catalog = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), catalog);
  const declared = catalog.window.APLab.catalog.labs.find(x => x.id === lab.def.id);
  const html = fs.readFileSync(new URL('../labs/g8-triangles.html', import.meta.url), 'utf8');
  for (const file of ['apl-video-core.js', 'apl-player.js', 'apl-toc.js', 'apl-video.css']) assert.ok(html.includes('../kit/' + file), file + ': production kit is connected');
  const ids = Array.from(lab.list, x => x.id), known = new Set(ids);
  assert.equal(known.size, ids.length, 'scene IDs are unique');
  assert.equal(ids.length, declared.sceneTotal, 'catalog denominator matches actual HTML modules');
  assert.deepEqual(ids.filter(id => !lab.def.lessons[id]), [], 'no unimplemented scenes');
  assert.deepEqual(Object.keys(lab.def.lessons).filter(id => !known.has(id)), [], 'no dangling lesson IDs');
  let count = 0;
  for (const [id, value] of Object.entries(lab.def.lessons)) {
    const report = core.validateLessonSet(value);
    assert.deepEqual(report.errors, [], id + ': full set validator');
    for (const lesson of core.lessonList(value)) {
      assert.deepEqual(core.validateLesson(lesson).warnings, [], id + ': validator warnings');
      count++;
    }
  }
  t.diagnostic(`${ids.length} actual scenes / ${count} registered explanations`);
});

test('each explanation loads and draws at entry, first cue and conclusion without exposing entry calculation panels', async t => {
  const lab = await load(); let count = 0;
  for (const [id, value] of Object.entries(lab.def.lessons)) for (const lesson of core.lessonList(value)) {
    const length = core.compileLesson(lesson).length;
    for (const [time, entry] of [[0, true], [0, false], [length, false]]) {
      const result = frame(lab, id, lesson, time, entry);
      assert.ok(result.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0), `${id}/${lesson.label || lesson.title}: visible core triangles figure is drawn`);
      assert.equal(result.value.card, null, id + ': exploration card hidden');
      assert.deepEqual(Array.from(result.value.readouts), [], id + ': exploration readouts hidden');
      assert.equal(result.value.formula, null, id + ': explanation owns formula timing');
      assert.equal(result.value.rule, null, id + ': concept conclusion follows the explanation timing');
      assert.equal(result.value.status, null, id + ': manual progress does not reveal a result');
      assert.equal(typeof lab.s.trLessonProblem, 'boolean', id + ': explicit concept or source-problem model');
      const question = lab.scene.question(lab.s);
      assert.equal(typeof question, 'string', id + ': visible question text');
      assert.doesNotMatch(question, /undefined|NaN|Infinity/, id + ': no missing numeric option text');
      if (lab.s.trLessonProblem) {
        const source = lab.scene.tr, quiz = source.prob(source.model(lab.s), lab.s);
        for (const choice of quiz.choices) assert.ok([choice.h, choice.t, choice.p].filter(x => x != null).some(x => question.includes(String(x))), id + ': every original option is visible');
      }
      assert.equal(lab.s.trSeed, 0, id + ': source question seed fixed');
      if (entry) { assert.equal(lab.s.trShowAnswer, false, id + ': prior conclusion reset'); assert.equal(lab.s.trCalculationReady, false, id + ': prior calculation reset'); }
      count++;
    }
  }
  t.diagnostic(`${count} source/Board safety frames; actual mobile playback quality NOT_RUN`);
});

test('a real new-problem action cannot change the fixed lesson when it is replayed', async () => {
  const lab = await load();
  for (const [id, value] of Object.entries(lab.def.lessons)) for (const lesson of core.lessonList(value)) {
    const initial = frame(lab, id, lesson, 1), timeline = initial.timeline;
    const fixedQuestion = lab.scene.question(lab.s);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'problem'; lab.scene.view(lab.s, lab);
    lab.newProblem();
    assert.equal(lab.s.trSeed, 1, id + ': actual new-problem handler ran');
    const pick = { key: 'previous-manual-problem', idx: 2 };
    lab.s.trPick = pick; lab.s.trShow = 'previous-manual-answer';
    const state = core.stateAt(timeline, 1, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
    Object.assign(lab.s, state.nums, state.sets, { step: state.step, part: state.part, lessonOn: true, lessonEntry: false, dragging: true, playing: false });
    lab.tab = timeline.tab;
    const again = lab.draw();
    assert.equal(lab.scene.question(lab.s), fixedQuestion, id + ': replay restores source question and original options');
    assert.deepEqual(again.texts, initial.texts, id + ': replay restores actual labels');
    assert.deepEqual(again.paths.map(x => x.points), initial.paths.map(x => x.points), id + ': replay restores actual geometry');
    assert.equal(lab.s.trPick, pick, id + ': manual choice untouched');
    assert.equal(lab.s.trShow, 'previous-manual-answer', id + ': manual answer visibility untouched');
    assert.equal(lab.scene.reviewTop(lab.s), '', id + ': previous problem recap hidden');
    lab.s.playing = true;
    const before = JSON.stringify(lab.s);
    assert.equal(lab.scene.tick(lab.s, .25, lab), false, id + ': legacy tick inactive during authored timeline');
    assert.equal(JSON.stringify(lab.s), before, id + ': no independent tick mutation');
    lab.s.playing = false;
  }
});
