// Minimal release safety: actual HTML loader, all registered lessons, and real
// Board draw calls. These checks do not certify mobile layout or visual quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/surface-volume-lesson-runtime.mjs';
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

test('HTML, catalog and lesson map cover every surface-volume scene without duplicates', async t => {
  const lab = await load();
  const catalog = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), catalog);
  const declared = catalog.window.APLab.catalog.labs.find(x => x.id === lab.def.id);
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
      assert.ok(result.paths.length, `${id}/${lesson.label || lesson.title}: core solid is drawn`);
      assert.equal(result.value.card, null, id + ': exploration card hidden');
      assert.deepEqual(Array.from(result.value.readouts), [], id + ': exploration readouts hidden');
      assert.equal(result.value.formula, null, id + ': explanation owns formula timing');
      if (entry) assert.equal(lab.s.svShowV, false, id + ': prior conclusion reset');
      count++;
    }
  }
  t.diagnostic(`${count} source/Board safety frames; actual mobile playback quality NOT_RUN`);
});
