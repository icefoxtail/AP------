// Production HTML/deferred modules/native Board checks. Browser, full mobile
// and independent visual review remain NOT_RUN.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/ellipse-lesson-runtime.mjs';
const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const first = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const signature = f => JSON.stringify({ paths: f.paths, points: f.points, texts: f.boardTexts, focus: f.focus, segments: f.segments });
function apply(compiled, time, base, entry = false) {
  const s = video.stateAt(compiled, time, base);
  Object.assign(lab.s, s.nums, s.sets, { lessonOn: !entry, lessonEntry: entry, step: s.step, part: s.part });
  lab.tab = 'review'; return lab.draw();
}
function prepare(id, label) {
  lab.go(id); const lesson = lessons(id).find(l => l.label === label); assert.ok(lesson, `${id}/${label}`);
  return { lesson, cs: video.compileLesson(lesson), base: baseline() };
}

test('all twelve scenes, source goals, captions and common validators are bound', t => {
  const context = { window: {} }; vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const cat = context.window.APLab.catalog.labs.find(item => item.id === 'geom-ellipse'), ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, cat.sceneTotal); assert.equal(ids.length, 12); assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  const targets = { '1-A': ['초점거리', '삼각형둘레'], '1-B': ['직각넓이'], '1-C': ['현삼각형둘레'], '2-A': ['작도좌표'], '2-B': ['최대넓이'], '2-C': ['공통절편'], '3-A': ['대칭점거리', '중점거리'], '3-B': ['거리의곱'], '4-A': ['법선내분비'], '4-B': ['원점거리', '교점자취'], q5: ['공통초점둘레'], q6: ['두초점제곱합'] };
  for (const src of ['../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'geom-ellipse/lesson-core.js', 'geom-ellipse/lesson-a.js', 'geom-ellipse/lesson-b.js']) assert.ok(lab.loaded.includes(src));
  let count = 0, originals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    for (const target of targets[id]) assert.ok(lessons(id).some(l => l.label === target && !first(l).lelConcept));
    for (const lesson of lessons(id)) {
      count++; const init = first(lesson), cs = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 5 && lesson.chapters.length <= 6); assert.ok(cs.length >= 60 && cs.length <= 90);
      assert.equal(init.lelShowAnswer, false);
      if (!init.lelConcept) { originals++; assert.equal(init.lelQuestion, lab.api.question(id)); }
      assert.ok(cs.pins.length >= 4);
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${id}/${key}`);
      for (const text of [lesson.answer, init.lelQuestion, ...lesson.chapters.flatMap(ch => ch.cues.map(c => c.say || ''))]) for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(m[1], { throwOnError: true }), `${id}/${lesson.label}: ${m[1]}`);
    }
  }
  assert.equal(count, 35); assert.equal(originals, 15);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /const DEFAULT_PLAYBACK_RATE = 2;/);
  t.diagnostic('12 scenes / 35 lessons: 15 original goals and 20 existing inquiry topics');
});

test('every cue and native transition is finite and moves on the actual ellipse', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id); const cs = video.compileLesson(lesson), base = baseline(), packet = lab.api.first(sc.id), snapshot = plain(packet), times = new Set([0, .9, cs.length]);
    for (const [i, ch] of cs.chapters.entries()) for (const cue of lesson.chapters[i].cues) { times.add(ch.at + cue.at); if (cue.to) times.add(ch.at + cue.at + cue.dur / 2); }
    let start, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const f = apply(cs, time, base); frames++;
      if (time === 0) start = signature(f); if (time === .9) motion = signature(f);
      assert.ok(f.paths.some(p => p.points.length >= 100), `${sc.id}/${lesson.label}: native ellipse path`);
      assert.ok(f.canvas.some(op => op.name === 'lineTo')); assert.deepEqual(plain(f.value), {});
      assert.equal(sc.vary.cur(), packet); assert.ok(Object.values(f.focus).flat().every(Number.isFinite));
      assert.equal(lab.s.lelShowAnswer, time >= cs.chapters.at(-1).at);
    }
    assert.notEqual(start, motion, `${sc.id}/${lesson.label}: native ellipse trace`); assert.deepEqual(plain(packet), snapshot);
  }
  t.diagnostic(`${frames} native Board/canvas frames. Browser/mobile/independent visual review NOT_RUN`);
});

test('manual new-problem packet and camera survive every sibling and replay', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw();
    const chosen = sc.vary.cur(), question = sc.problem.text(), key = lab.__cqKey, oldMode = lab.__ovk;
    assert.notEqual(chosen, sc.vary.first()); lab.board.zoom = 1.25; lab.board.panX = 17; lab.board.panY = -9;
    const focus = plain(lab.board.focus);
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline(), init = signature(apply(cs, 0, base));
      apply(cs, cs.length, base); assert.equal(signature(apply(cs, 0, base)), init, `${sc.id}/${lesson.label}`);
    }
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: 0 }); lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), chosen); assert.equal(sc.problem.text(), question); assert.equal(lab.__cqKey, key); assert.equal(lab.__ovk, oldMode);
    assert.deepEqual(plain(lab.board.focus), focus); assert.equal(lab.board.zoom, 1.25); assert.equal(lab.board.panX, 17); assert.equal(lab.board.panY, -9);
  }
});

test('stale final-to-entry restores first geometry and labels without changing held state', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw(); const selected = sc.vary.cur(), question = sc.problem.text();
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline(), initial = signature(apply(cs, 0, base, true));
      apply(cs, cs.length, base); lab.s.lessonOn = false; lab.s.lessonEntry = true; const held = plain(lab.s);
      assert.equal(signature(lab.draw()), initial, `${sc.id}/${lesson.label}: final state cannot leak`); assert.deepEqual(plain(lab.s), held);
    }
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: 0 }); lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
  }
});

test('native numeric answers follow their caption, with sibling result labels hidden', () => {
  const checks = [
    ['1-A', '초점거리', /^PF = 3$/], ['1-B', '직각넓이', /^S = b² = 9$/], ['1-C', '현삼각형둘레', /^둘레 = 4a = 20$/],
    ['3-A', '대칭점거리', /^F'F'' = 2a = 10$/], ['3-A', '중점거리', /^OH₁ = a = 5$/], ['3-B', '거리의곱', /^d₁ × d₂ = b² = 9$/], ['4-A', '법선내분비', /^F'N : NF = PF' : PF = 3 : 1$/]
  ];
  for (const [id, name, pattern] of checks) {
    const { cs, base } = prepare(id, name), at = cs.chapters.at(-1).at;
    assert.ok(!apply(cs, at - .01, base).boardTexts.some(s => pattern.test(s)), `${id}/${name}: early result`);
    const final = apply(cs, at, base), item = final.textItems.find(item => pattern.test(item.text));
    assert.ok(item, `${id}/${name}: final native result`);
    assert.ok(item.x >= 0 && item.x <= lab.board.W && item.y >= 0 && item.y <= lab.board.H, `${id}/${name}: result inside native viewport`);
  }
  const { cs, base } = prepare('3-A', '대칭점거리');
  assert.ok(!apply(cs, cs.length, base).texts.some(s => /^OH₁ = a =/.test(s)), 'other target midpoint length stays hidden');
});

test('actual fold, affine contraction, optical ray and shared-focus moves remain synchronized', () => {
  const shape = f => JSON.stringify({ segments: f.segments, points: f.points, canvas: f.canvas.filter(o => o.name === 'moveTo' || o.name === 'lineTo') });
  for (const [id, name, key, from, to, expected] of [
    ['2-B', '세로축소', 'fold', 12, 18, 1], ['2-B', '평행현중점', 'fold', 12, 18, 1], ['3-A', '수선발자취', 'fold', 12, 18, 1],
    ['3-A', '접선최소합', 'tangentQOffset', 36, 42, 0], ['4-A', '반사광선', 'laser', 36, 42, 1],
    ['q5', '한초점소거', 'q5x', 36, 42, 1.2], ['q6', '합차로거리', 'q6a', 36, 42, 7]
  ]) {
    const { cs, base } = prepare(id, name), before = shape(apply(cs, from, base)), after = shape(apply(cs, to, base));
    assert.notEqual(before, after, `${id}/${name}: actual geometry`); assert.equal(lab.s[key], expected);
  }
  const { cs, base } = prepare('4-A', '반사광선'); apply(cs, 32, base); const old = lab.s.laser;
  assert.equal(lab.scene.tick(lab.s, 1, lab), false); assert.equal(lab.s.laser, old, 'native auto tick cannot move the authored optical ray');
});

test('x=0 horizontal tangents and crucial constructed points are actually visible', () => {
  let { cs, base } = prepare('2-C', '절편없는경우'); const f = apply(cs, 36, base);
  for (const y of [3, 4]) assert.ok(f.segments.some(s => Math.abs(s.p.y - y) < 1e-8 && Math.abs(s.q.y - y) < 1e-8 && Math.abs(s.p.x - s.q.x) > 6), `horizontal tangent y=${y}`);
  for (const [id, name, pointName, time] of [['2-C', '접선과닮음', /^x절편 T/, 48], ['3-A', '수선발자취', /^F″/, 42]]) {
    ({ cs, base } = prepare(id, name)); const frame = apply(cs, time, base), p = frame.points.find(p => pointName.test(p.options.label || ''));
    assert.ok(p, `${name}: constructed point exists`); const v = frame.viewBox;
    assert.ok(p.point.x >= v.x0 && p.point.x <= v.x1 && p.point.y >= v.y0 && p.point.y <= v.y1, `${name}: constructed point inside native viewport`);
  }
});

test('source-only load preserves all twelve manual drag and new-problem entry points', async () => {
  const source = await load({ sourceOnly: true }); assert.equal(Object.keys(source.def.lessons).length, 0);
  for (const sc of source.list) {
    source.go(sc.id); source.s.step = 3; const frame = source.draw(), packet = sc.vary.first(), snapshot = plain(packet);
    const handles = sc.id === 'q5' ? ['C'] : sc.id === 'q6' ? ['Ea', 'Eh'] : sc.id === '1-C' ? ['P', 'Q'] : sc.id === '4-B' ? ['M'] : ['P'];
    for (const [j, id] of handles.entries()) { const h = frame.handles.find(h => h.id === id); assert.ok(h && typeof h.options.drag === 'function', `${sc.id}/${id}`); const before = plain(source.s); h.options.drag({ x: id === 'Ea' ? 6.8 : 1.4 + j, y: .8 + j * .2 }); assert.notDeepEqual(plain(source.s), before); source.draw(); }
    source.tab = 'problem';
    for (let i = 0; i < 3; i++) { const prev = sc.vary.cur(); source.newProblem(); assert.notEqual(sc.vary.cur(), prev); source.draw(); source.tab = 'review'; source.s.step = 3; source.draw(); source.tab = 'problem'; }
    assert.equal(sc.vary.first(), packet); assert.deepEqual(plain(packet), snapshot);
  }
});
