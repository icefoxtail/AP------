// Release integration: the real HTML loader, source questions and playback state.
// These checks do not claim a real-browser or independent mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/trig-ratio-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const plain = value => JSON.parse(JSON.stringify(value));

test('production HTML registers all 51 source scenes with valid player lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'g9-trig-ratio');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.equal(lab.list.length, 51);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Array.from(lab.list, scene => scene.id).sort());
  for (const scene of lab.list) assert.deepEqual(video.validateLessonSet(lab.def.lessons[scene.id]), { errors: [], warnings: [] }, scene.id);
  const html = fs.readFileSync(new URL('../labs/g9-trig-ratio.html', import.meta.url), 'utf8');
  for (const filename of ['apl-video.css', 'apl-video-core.js', 'apl-player.js', 'apl-toc.js']) {
    assert.ok(html.includes('../kit/' + filename), filename + ' loaded by the student page');
    assert.ok(fs.existsSync(new URL('../kit/' + filename, import.meta.url)));
  }
});

test('fixed source questions are reproducible and cannot change the manual random stream', () => {
  const random = lab.math.random;
  for (const scene of lab.list) {
    const a = lab.api.fixedQuestion(scene.id, 97), b = lab.api.fixedQuestion(scene.id, 97);
    assert.deepEqual(plain(a), plain(b), scene.id + ': source figure, wording and choices are reproducible');
    assert.equal(lab.math.random, random, scene.id + ': manual random source restored');
    assert.ok(Object.isFrozen(a) && Object.isFrozen(a.fig) && Object.isFrozen(a.choices) && Object.isFrozen(a.solution));
    assert.equal(a.choices.length, 5);
    assert.equal(a.choices.filter(choice => choice.ok).length, 1);
    assert.equal(a.solution.key, a.key);
  }
  const source = lab.list[0].tg, original = source.gen;
  source.gen = () => { throw new Error('controlled source failure'); };
  try {
    assert.throws(() => lab.api.fixedQuestion(source.id), /controlled source failure/);
    assert.equal(lab.math.random, random, 'failed source generation also restores Math.random');
  } finally { source.gen = original; }
});

test('actual new-question clicks and lesson cues preserve the source-question boundary', () => {
  for (const id of ['r1-1', 'cut3060', 'trigTableCalc', 'asaSplit75', 'heightObtuse', 'quadSplitSum', 'r8-2', 'r9-2']) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    const scene = lab.go(id);
    const lesson = video.lessonList(lab.def.lessons[id]).find(item => item.chapters[0].cues[0].set.tgLessonProblem);
    assert.ok(lesson, id + ': a source problem example exists');
    const compiled = video.compileLesson(lesson);
    const apply = () => {
      const state = video.stateAt(compiled, 0, { nums: { ...lab.s }, sets: { ...lab.s }, step: lab.s.step, part: lab.s.part });
      Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, step: state.step });
      lab.tab = 'review';
    };
    apply();
    const original = plain(lab.s.q), question = scene.question(lab.s);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'problem';
    lab.newProblem();
    assert.equal(lab.s.tgSeed, 1, id + ': original click handler generated a new manual problem');
    assert.equal(lab.s.tgPick, null);
    assert.equal(lab.s.step, 1);
    const picked = { key: scene.id + '|' + lab.s.q.key + '|1', idx: 1 };
    lab.s.tgPick = picked;
    apply();
    assert.deepEqual(plain(lab.s.q), original, id + ': original source problem restored');
    assert.equal(scene.question(lab.s), question, id + ': wording and choices restored');
    assert.equal(lab.s.tgPick, picked, id + ': lesson cues do not overwrite a stored manual choice');
    lab.s.playing = true;
    const before = plain(lab.s);
    assert.equal(scene.tick(lab.s, 2, lab), false);
    assert.deepEqual(plain(lab.s), before, id + ': legacy tick cannot advance the lesson');
    const view = scene.view(lab.s, lab);
    assert.equal(view.formula, null);
    assert.equal(view.status, null);
    assert.equal(scene.reviewTop(lab.s), '');
    assert.ok(lab.draw().paths.length > 0, id + ': original geometry remains present');
  }
});

test('cached source prefixes retain the first deterministic match and restore random after predicate errors', () => {
  const source = lab.list.find(scene => scene.id === 'sasAcuteLen').tg;
  const original = source.gen, random = lab.math.random;
  let generated = 0;
  source.gen = function (...args) { generated++; return original.apply(this, args); };
  const fresh = accept => {
    lab.math.random = lab.api.seeded('lesson:sasAcuteLen:314');
    try { for (let i = 0; i < 1000; i++) { const q = original.call(source); if (accept(q)) return plain(q); } }
    finally { lab.math.random = random; }
    assert.fail('source fixture not found');
  };
  try {
    const first = lab.api.fixedQuestion(source.id, 314);
    const accept = q => q.key !== first.key;
    const second = lab.api.fixedQuestion(source.id, 314, accept), after = generated;
    assert.deepEqual(plain(second), fresh(accept), 'cached prefix preserves exact figure, conditions and choice order');
    assert.equal(lab.api.fixedQuestion(source.id, 314), first);
    assert.equal(lab.api.fixedQuestion(source.id, 314, accept), second);
    assert.equal(generated, after, 'repeated predicates do not regenerate a known prefix');
    assert.throws(() => lab.api.fixedQuestion(source.id, 315, () => { throw new Error('controlled predicate failure'); }), /controlled predicate failure/);
    assert.equal(lab.math.random, random, 'new-candidate predicate errors restore the manual random stream');
    assert.throws(() => lab.api.fixedQuestion(source.id, 314, () => { throw new Error('cached predicate failure'); }), /cached predicate failure/);
    assert.equal(lab.math.random, random, 'cached predicate errors leave the manual random stream unchanged');
  } finally { source.gen = original; lab.math.random = random; }
});
