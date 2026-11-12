// Actual HTML/deferred modules/Board run here. Browser, mobile and independent
// visual review are NOT_RUN; these assertions do not imply visual QA approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/integral-lesson-runtime.mjs';
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

test('all eight source scenes, original goals, module registration, captions and validators are bound', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'calc1-integral');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal); assert.equal(ids.length, 8);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  const targets = { signed: ['정적분값', '실제넓이'], sixth: ['전체넓이', '이등분식'], cubic: ['가운데근', '한쪽넓이'], diff: ['두곡선넓이'], inverse: ['적분합'], areaab: ['직선기울기'], symint: ['우기적분', '점대칭값', '주기적분'], riemann: ['폭의배수', '이동구간'] };
  for (const script of ['../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'calc1-integral/lesson-core.js', 'calc1-integral/lesson-a.js', 'calc1-integral/lesson-b.js']) assert.ok(lab.loaded.includes(script));
  let count = 0, sourceGoals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    for (const target of targets[id]) assert.ok(lessons(id).some(l => l.label === target && !first(l).litConcept));
    assert.ok(lessons(id).some(l => first(l).litConcept));
    for (const lesson of lessons(id)) {
      count++; const init = first(lesson), cs = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 5 && lesson.chapters.length <= 6);
      assert.ok(cs.length >= 60 && cs.length <= 90);
      for (const key of ['litQuestion', 'litConcept', 'litTarget', 'litExplore', 'litStage', 'litLabels', 'litShowAnswer', 'litInitial']) assert.ok(Object.hasOwn(init, key));
      assert.equal(init.litShowAnswer, false);
      if (!init.litConcept) { sourceGoals++; assert.equal(init.litQuestion, lab.api.question(id, lesson.chapters[0].start.litPacket)); }
      assert.ok(cs.pins.length >= 4, 'intermediate mathematical expressions remain pinned');
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${id}/${key}`);
      for (const text of [lesson.answer, init.litQuestion, ...lesson.chapters.flatMap(ch => ch.cues.map(c => c.say || ''))]) for (const m of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(m[1], { throwOnError: true }), `${id}/${lesson.label}/${m[1]}`);
    }
  }
  assert.equal(count, 27); assert.equal(sourceGoals, 14);
  t.diagnostic(`${ids.length} scenes / ${count} lessons (${sourceGoals} original goals, ${count - sourceGoals} existing inquiry concepts)`);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /const DEFAULT_PLAYBACK_RATE = 2;/);
});

test('every cue and transition paints finite native curves with real first-second motion', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id); const cs = video.compileLesson(lesson), base = baseline(), packet = lab.api.first(sc.id, lesson.chapters[0].start.litPacket), snapshot = plain(packet);
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
      if (time < cs.chapters.at(-1).at) assert.equal(lab.s.litShowAnswer, false);
      if (time === cs.length) assert.equal(lab.s.litShowAnswer, true);
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
    const focus = plain(lab.board.focus), key = lab.board._ouKey;
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base));
      apply(cs, cs.length, base);
      assert.equal(signature(apply(cs, 0, base)), initial, `${sc.id}/${lesson.label}: reset`);
    }
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, step: 0 }); lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
    assert.deepEqual(plain(lab.board.focus), focus); assert.equal(lab.board._ouKey, key);
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


test('individual native answers, fractional values and the alternative source goals follow their own captions', () => {
  const checks=[
    ['signed','정적분값',/^I = S₁ − S₂ = 0$/],['signed','실제넓이',/^S = S₁ \+ S₂ = 8\/3$/],
    ['sixth','전체넓이',/^S₀ = 9\/2$/],['sixth','이등분식',/^\(3 − m\)³ = 27\/2$/],
    ['cubic','가운데근',/^β = 1$/],['cubic','한쪽넓이',/^S₁ = S₂ = 2$/],
    ['diff','두곡선넓이',/^S = ∫\|h\(x\)\|dx = 1\/24$/],['inverse','적분합',/ = 21\/4$/],
    ['areaab','직선기울기',/^m = [−-]?1\/2$/],['symint','우기적분',/∫f = 8$/],
    ['symint','점대칭값',/^4 × 4 = 16$/],['symint','주기적분',/^5 × 2 = 10$/],
    ['riemann','이동구간',/^∫ = 13\/3$/]
  ];
  for(const [id,name,answer] of checks){
    const {cs,base}=prepare(id,name),at=cs.chapters.at(-1).at;
    assert.ok(!apply(cs,at-.01,base).boardTexts.some(t=>answer.test(t)),`${id}/${name}: no early answer`);
    assert.ok(apply(cs,at,base).boardTexts.some(t=>answer.test(t)),`${id}/${name}: final answer on its native figure`);
  }
  const {cs,base}=prepare('signed','정적분값');
  assert.ok(!apply(cs,cs.length,base).boardTexts.some(t=>/^S =/.test(t)), 'the signed integral goal does not display the sibling total area');
});

test('original and exploration models remain distinct in source curves and Riemann widths', () => {
  for(const name of ['우기적분','점대칭값','주기적분']){
    const {lesson,cs,base}=prepare('symint',name),p=lab.api.first('symint',lesson.chapters[0].start.litPacket);
    const frame=apply(cs,0,base),f=p.t===3?p.v.g:p.v.f;
    assert.ok(frame.plots.some(plot=>[-.3,.3,1.3].every(x=>Math.abs(plot.evaluate(x)-f(x))<1e-10)),name);
    assert.equal(lab.scene.vary.cur(),p);
  }
  let {cs,base}=prepare('areaab','직선기울기');
  const original=apply(cs,0,base);
  assert.ok(original.plots.some(p=>Math.abs(p.evaluate(2)-4)<1e-10));
  ({cs,base}=prepare('areaab','벽과기울기'));
  const explore=apply(cs,0,base);
  assert.ok(explore.plots.some(p=>Math.abs(p.evaluate(2)-14/9)<1e-10));
  ({cs,base}=prepare('riemann','폭의배수'));
  assert.ok(apply(cs,12,base).boardTexts.includes('Δx = 2/n'));
  ({cs,base}=prepare('riemann','윗아랫합'));
  assert.ok(apply(cs,0,base).boardTexts.includes('Δx = 4/6'));
  apply(cs,42,base); assert.equal(lab.s.n8,24);
});

test('actual reflection, rotation, translation and split-window states change native polygons', () => {
  const shape=f=>JSON.stringify(f.canvas.filter(o=>o.name==='moveTo'||o.name==='lineTo'));
  for(const name of ['기함수회전','우함수접기','중심높이','주기이동']){
    const {cs,base}=prepare('symint',name),before=shape(apply(cs,12,base)),after=shape(apply(cs,18,base));
    assert.notEqual(before,after,name);
    assert.equal(lab.s.u7,1);
  }
  const {cs,base}=prepare('diff','세로길이');apply(cs,24,base);
  assert.equal(lab.s.dual,true);assert.equal(lab.board.panes.length,2);
});

test('source-only loading preserves native question selection and every manual drag entry point', async () => {
  const source=await load({sourceOnly:true});assert.equal(Object.keys(source.def.lessons).length,0);
  const handles={signed:'a',sixth:'beta',cubic:'beta',diff:'m',inverse:'A',areaab:'m',symint:'b',riemann:'dx'};
  for(const sc of source.list){
    source.go(sc.id);source.s.step=3;const frame=source.draw(),packet=sc.vary.first(),snapshot=plain(packet);
    const handle=frame.handles.find(h=>h.id===handles[sc.id]);
    assert.ok(handle&&typeof handle.options.drag==='function',sc.id+' original drag');
    const old=plain(source.s);handle.options.drag({x:1.4,y:.7});assert.notDeepEqual(plain(source.s),old);source.draw();
    source.tab='problem';
    for(let i=0;i<8;i++){
      const prev=sc.vary.cur();source.newProblem();assert.notEqual(sc.vary.cur(),prev,sc.id+' actual new-problem handler');
      source.draw();assert.ok(sc.problem.text());source.tab='review';source.s.step=3;source.draw();source.tab='problem';
    }
    assert.equal(sc.vary.first(),packet);assert.deepEqual(plain(packet),snapshot);
  }
});
