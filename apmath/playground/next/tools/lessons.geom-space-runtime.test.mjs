// Minimum release checks: actual source closures, module loading and Board calls.
// These checks are not a full browser/mobile or independent visual review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/space-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base, entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return lab.draw();
}
const signature = frame => JSON.stringify({ paths: frame.paths, points: frame.points, plots: frame.plots.map(p => p.samples), circles: frame.circles });

test('catalog and actual HTML have the same complete scene registration and valid lesson sets', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'geom-space');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.deepEqual(lab.missing, []);
  for (const src of ['../kit/apl-player.js', '../kit/apl-video-core.js', 'geom-space/lesson-core.js', 'geom-space/lesson-a.js', 'geom-space/lesson-b.js']) assert.ok(lab.loaded.includes(src), src);
  let total = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(item => !firstSet(item).lgsConcept), `${id}: original problem is covered`);
    for (const lesson of lessons(id)) {
      total++;
      const init = firstSet(lesson), compiled = video.compileLesson(lesson);
      for (const key of ['lgsQuestion', 'lgsConcept', 'lgsExplore', 'lgsTarget', 'lgsShowAnswer', 'lgsMode', 'lgsStage', 'lgsKnownMath']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}: ${key} reset`);
      assert.equal(init.lgsShowAnswer, false);
      for(const text of [init.lgsQuestion,lesson.answer,...lesson.chapters.flatMap(c=>c.cues.map(q=>q.say||''))])for(const m of String(text).matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true,strict:'error'}),id);
      if (!init.lgsConcept) assert.equal(init.lgsQuestion, lab.api.question(id));
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${id}: ${key} start`);
    }
  }
  assert.equal(total,35);assert.equal(ids.length,9);
  assert.equal(ids.reduce((n,id)=>n+lessons(id).filter(x=>!firstSet(x).lgsConcept).length,0),13);
  t.diagnostic(`${ids.length} scenes / ${total} lessons, zero missing scene bindings`);
});

test('every authored cue renders finite native geometry and a real first-second emphasis', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const base = baseline(), compiled = video.compileLesson(lesson), original = plain(lab.api.first(sc.id));
    const times = new Set([0, 0.9, compiled.length]);
    compiled.chapters.forEach((chapter, i) => {
      for (const cue of lesson.chapters[i].cues) { times.add(chapter.at + cue.at); if(cue.to) { times.add(chapter.at+cue.at+cue.dur/2); times.add(chapter.at+cue.at+cue.dur); } }
    });
    // compileLesson preserves each chapter boundary; include both caption slots.
    for (const chapter of compiled.chapters) { times.add(chapter.at); times.add(chapter.at + 6); }
    let first, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(compiled, time, base); frames++;
      if (time === 0) first = signature(frame);
      if (time === 0.9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc' || op.name === 'roundRect'), `${sc.id}/${lesson.label}: core geometry is painted`);
      assert.ok(frame.space.length>0,`${sc.id}: production 3D space primitives`);
      for(const op of frame.space.filter(op=>op.name==='right')){
        const [o,a,b]=op.points,u={x:a.x-o.x,y:a.y-o.y,z:a.z-o.z},v={x:b.x-o.x,y:b.y-o.y,z:b.z-o.z};
        const dot=u.x*v.x+u.y*v.y+u.z*v.z,scale=Math.hypot(u.x,u.y,u.z)*Math.hypot(v.x,v.y,v.z);
        assert.ok(Math.abs(dot)<=1e-8*Math.max(1,scale),`${sc.id}/${lesson.label}: a native right-angle marker must be right in 3D`);
      }
      assert.deepEqual(plain(frame.value), {}, 'legacy answer cards remain isolated');
      assert.equal(sc.reviewTop(lab.s, lab), '');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lgsShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.lgsShowAnswer, true);
      if (sc.vary) assert.deepEqual(plain(sc.vary.cur()), original, 'automatic replay selects the first original');
    }
    assert.notEqual(motion, first, `${sc.id}/${lesson.label}: source geometry receives visible first-second emphasis`);
    assert.deepEqual(plain(lab.api.first(sc.id)), original, 'original source packet remains unchanged');
  }
  t.diagnostic(`${frames} production Board/canvas frames; full mobile and independent visual review NOT_RUN`);
});

test('new-problem selection and manual state survive fixed-first replay', () => {
  for (const sc of lab.list.filter(sc => sc.vary)) {
    lab.go(sc.id); lab.tab = 'problem';
    const first = plain(sc.vary.first());
    lab.newProblem();
    const chosen = plain(sc.vary.cur());
    assert.notDeepEqual(chosen, first, `${sc.id}: actual new-problem handler selects a variant`);
    const question = sc.problem.text(lab.s, lab), lesson = lessons(sc.id).find(item => !firstSet(item).lgsConcept);
    const compiled = video.compileLesson(lesson), base = baseline();
    const start = apply(compiled, 0, base);
    assert.equal(sc.question(lab.s, lab), lab.api.question(sc.id));
    apply(compiled, compiled.length, base);
    assert.equal(signature(apply(compiled, 0, base)), signature(start), `${sc.id}: replay is repeatable`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    lab.draw();
    assert.deepEqual(plain(sc.vary.cur()), chosen, 'manual choice is preserved');
    assert.equal(sc.problem.text(lab.s, lab), question);
  }
});

test('entry after a final frame and sibling transitions restore only the initial drawing', () => {
  for(const sc of lab.list) {
    lab.go(sc.id);const base=baseline();
    for(const lesson of lessons(sc.id)) {
      const compiled=video.compileLesson(lesson);
      const initial=signature(apply(compiled,0,base,true));
      apply(compiled,compiled.length,base);
      const held=plain(lab.s);
      lab.s.lessonOn=false;lab.s.lessonEntry=true;
      const entry=lab.draw();
      assert.equal(signature(entry),initial,sc.id+'/'+lesson.label);
      const after=plain(lab.s);after.lessonOn=held.lessonOn;after.lessonEntry=held.lessonEntry;
      assert.deepEqual(after,held,'entry drawing does not alter held state');
    }
  }
});

// A drawing-only replay must return the original camera as well as the variant.
test('manual pan and zoom survive first-source playback', () => {
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';lab.newProblem();lab.draw();
    Object.assign(lab.board,{zoom:1.7,panX:23,panY:-17});
    lab.draw(); // Let the native 3D auto-fit settle at the user's zoom first.
    const before={focus:plain(lab.board.focus),zoom:lab.board.zoom,panX:lab.board.panX,panY:lab.board.panY};
    const lesson=lessons(sc.id)[0],compiled=video.compileLesson(lesson),base=baseline();
    apply(compiled,0,base);apply(compiled,compiled.length,base);
    lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
    assert.deepEqual({focus:plain(lab.board.focus),zoom:lab.board.zoom,panX:lab.board.panX,panY:lab.board.panY},before,sc.id);
  }
});

test('all playback tracks leave native manual controls unchanged',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.s.yaw+=11;lab.s.pitch+=3;
    const keys=Object.keys(lab.api.initial(sc.id)),before=Object.fromEntries(keys.map(k=>[k,plain(lab.s[k])]));
    for(const lesson of lessons(sc.id)){
      const compiled=video.compileLesson(lesson),base=baseline();
      assert.ok(Object.keys(compiled.tracks).every(k=>k.startsWith('lgs')),lesson.label);
      apply(compiled,0,base);apply(compiled,compiled.length/2,base);apply(compiled,compiled.length,base);
      assert.deepEqual(Object.fromEntries(keys.map(k=>[k,plain(lab.s[k])])),before,`${sc.id}/${lesson.label}: native controls preserved`);
    }
  }
});

test('translated native 3D lines match the selected original model and pyramid boundaries remain finite',()=>{
  const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
  const xyz=(a,b)=>{for(const k of ['x','y','z'])close(a[k],b[k]);};
  for(const [label,key] of [['면대각선각','A'],['공간대각선각','B'],['면대각선비교','C'],['공간대각선비','D'],['뿔의두직선','P']]){
    lab.go('mode7');const lesson=lessons('mode7').find(l=>l.label===label),compiled=video.compileLesson(lesson),frame=apply(compiled,compiled.length,baseline());
    const g=lab.api.math.geo7(key,key==='B'?0:1),line=frame.space.find(q=>q.name==='line'&&q.options.color==='rose'&&q.options.width===4);
    assert.ok(line,label);xyz(line.points[0],g.L2c[0]);xyz(line.points[1],g.L2c[1]);
    const angle=frame.space.find(q=>q.name==='arc'&&q.options.color==='amber');assert.ok(angle,label);
    const [o,a,b]=angle.points,M=lab.api.math;close(Math.cos(M.angDeg(o,a,b)*Math.PI/180),g.cosv);
  }
  for(const [label,boundary] of [['퇴화경계',true],['불가능한길이',false]]){
    lab.go('mode6');const compiled=video.compileLesson(lessons('mode6').find(l=>l.label===label)),frame=apply(compiled,compiled.length,baseline());
    const p=frame.space.find(q=>q.name==='point'&&String(q.options.label).includes(boundary?'높이 0':'닿지 못함'));assert.ok(p,label);
    close(p.points[0].y,0);if(boundary)xyz(p.points[0],{x:0,y:0,z:0});else assert.ok(Math.hypot(p.points[0].x,p.points[0].z)>0);
  }
});

test('native 3D drag and camera orbit still operate after leaving a lesson',()=>{
  const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
  for(const id of ['mode5','mode8']){
    lab.go(id);const compiled=video.compileLesson(lessons(id)[0]);apply(compiled,compiled.length,baseline());
    Object.assign(lab.s,{lessonOn:false,lessonEntry:false,step:2});lab.tab='explore';
    const frame=lab.draw(),camera=lab.api.math.camOf(lab.s);
    if(id==='mode5'){
      const target={x:1.2,y:.3+3/Math.sqrt(10)*1.4,z:1.4/Math.sqrt(10)};
      frame.handles.find(h=>h.id==='R5').options.drag(lab.api.math.projPt(camera,target));close(lab.s.ru,1.2);close(lab.s.rv,1.4);
    }else{
      const target={x:1.2,y:lab.s.h8,z:2.6};
      frame.handles.find(h=>h.id==='P8').options.drag(lab.api.math.projPt(camera,target));close(lab.s.px8,1.2);close(lab.s.pz8,2.6);
    }
    const before=signature(lab.draw()),yaw=lab.s.yaw;lab.def.board.orbit(lab.s,30,10);assert.notEqual(lab.s.yaw,yaw);assert.notEqual(signature(lab.draw()),before);
  }
});
