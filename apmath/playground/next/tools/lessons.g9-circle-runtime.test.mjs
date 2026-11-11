// Release integration through the production HTML, source generators and Board.
// These checks do not claim a real-browser or independent mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-properties-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const plain = value => JSON.parse(JSON.stringify(value));

test('production HTML registers all 45 catalog scenes with valid player lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'g9-circle');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.equal(lab.list.length, 45);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Array.from(lab.list, scene => scene.id).sort());
  for (const scene of lab.list) assert.deepEqual(video.validateLessonSet(lab.def.lessons[scene.id]), { errors: [], warnings: [] }, scene.id);
  const html = fs.readFileSync(new URL('../labs/g9-circle.html', import.meta.url), 'utf8');
  for (const filename of ['apl-video.css', 'apl-video-core.js', 'apl-player.js', 'apl-toc.js']) {
    assert.ok(html.includes('../kit/' + filename), filename + ' loaded by the student page');
    assert.ok(fs.existsSync(new URL('../kit/' + filename, import.meta.url)));
  }
});

test('source packets reproduce the exact original generator without touching manual randomness', () => {
  const random = lab.math.random;
  for (const scene of lab.list) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.go(scene.id);
    const variant = 2, seed = 97;
    const a = lab.api.fixedPk(scene.id, variant, seed), b = lab.api.fixedPk(scene.id, variant, seed);
    const original = scene.ci.gen(lab.api.seeded('lesson|' + scene.id + '|' + seed), variant);
    assert.deepEqual(plain(a), plain(b), scene.id + ': fixed packet is reproducible');
    assert.deepEqual(plain(a), plain(original), scene.id + ': original generator and variant preserved');
    assert.ok(Object.isFrozen(a), scene.id + ': stored packet is immutable');
    assert.equal(lab.math.random, random, scene.id + ': manual random source is unchanged');
    lab.s.ciPk = a;
    const sol = scene.solution(lab.s), Q = sol.question;
    assert.equal(Q.choices.length, 5);
    assert.equal(Q.choices.filter(choice => choice.ok).length, 1);
    assert.equal(sol.key, Q.key);
    assert.deepEqual(plain(sol.model.q), plain(a));
  }
  const D = lab.list[0].ci, original = D.gen;
  D.gen = () => { throw new Error('controlled source failure'); };
  try {
    assert.throws(() => lab.api.fixedPk(D.id), /controlled source failure/);
    assert.equal(lab.math.random, random, 'failed source generation leaves manual randomness unchanged');
  } finally { D.gen = original; }
});

test('actual new-question clicks and lesson cues preserve wording, choices and manual picks', () => {
  for (const id of ['c1-1', 'c2-2', 'c3-2', 'c4-5', 'c5-6', 'c6-8', 'c7-2']) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    const scene = lab.go(id);
    const lesson = video.lessonList(lab.def.lessons[id]).find(item => item.chapters[0].cues[0].set.ciLessonProblem);
    assert.ok(lesson, id + ': original problem example exists');
    const compiled = video.compileLesson(lesson);
    const apply = () => {
      const state = video.stateAt(compiled, 0, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
      Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, step: state.step });
      lab.tab = 'review';
    };
    apply();
    const packet = plain(lab.s.ciPk), question = scene.question(lab.s), Q = plain(scene.solution(lab.s).question);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'problem';
    lab.newProblem();
    assert.equal(lab.s.ciSeed, 1, id + ': original click handler generated a new manual problem');
    assert.equal(lab.s.ciPick, null);
    assert.equal(lab.s.step, 1);
    const picked = { key: scene.id + '|' + scene.solution(lab.s).key + '|1', idx: 1 };
    lab.s.ciPick = picked;
    apply();
    assert.deepEqual(plain(lab.s.ciPk), packet, id + ': fixed original packet restored');
    assert.deepEqual(plain(scene.solution(lab.s).question), Q, id + ': original choices and question restored');
    assert.equal(scene.question(lab.s), question, id + ': lesson wording restored');
    assert.equal(lab.s.ciPick, picked, id + ': playback does not erase a manual choice');
    lab.s.playing = true;
    const before = plain(lab.s);
    assert.equal(scene.tick(lab.s, 2, lab), false);
    assert.deepEqual(plain(lab.s), before, id + ': old animation cannot advance the lesson');
    const view = scene.view(lab.s, lab);
    assert.equal(view.formula, null);
    assert.equal(view.status, null);
    assert.equal(scene.reviewTop(lab.s), '');
    assert.ok(lab.draw().paths.length > 0, id + ': source geometry remains present');
  }
});

test('entry previews cannot reveal a stale final answer or alter a fixed source packet', () => {
  for (const id of ['c1-1', 'c2-1', 'c4-1', 'c6-8']) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    const scene = lab.go(id);
    const lesson = video.lessonList(lab.def.lessons[id]).find(item => item.chapters[0].cues[0].set.ciLessonProblem);
    const compiled = video.compileLesson(lesson);
    const state = video.stateAt(compiled, compiled.length, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
    Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: true, step: state.step });
    const context = lab.api.baseCtx(lab.s, lab, false), packet = plain(lab.s.ciPk);
    assert.equal(context.step, 0);
    assert.equal(context.answer, false);
    assert.equal(context.calculation, false);
    const frame = lab.draw();
    assert.ok(frame.paths.length > 0, id + ': preview retains the real figure');
    assert.deepEqual(plain(lab.s.ciPk), packet);
    assert.ok(frame.texts.some(text => /(?:^x$|=\s*x$)/.test(text)), id + ': target remains unknown on entry');
    lab.s.lessonEntry = false;
  }
});
