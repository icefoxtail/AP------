// Run actual HTML, deferred modules, shell scene-copy boundary, 3D space and
// Board. Full browser/mobile and independent visual review remain NOT_RUN.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/projection-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=x=>JSON.parse(JSON.stringify(x)),lessons=id=>video.lessonList(lab.def.lessons[id]);
const first=l=>l.chapters[0].cues[0].set;
const baseline=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const signature=f=>JSON.stringify({space:f.space,paths:f.paths,texts:f.boardTexts,points:f.points,focus:f.focus});
const rawKeys=['yaw','pitch','th','board','sun','press','cn','mt','lens','acd','dir','v5','v6','v7'];
const manual=s=>Object.fromEntries(rawKeys.map(k=>[k,s[k]]));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≈ ${b}`);
const eq=(a,b)=>['x','y','z'].every(k=>Math.abs(a[k]-b[k])<1e-7);
const polygonPresent=(f,ps)=>f.space.calls.some(c=>c.method==='poly'&&c.points.length===ps.length&&ps.every(p=>c.points.some(q=>eq(p,q))));
function apply(cs,time,base,entry=false){const s=video.stateAt(cs,time,base);Object.assign(lab.s,s.nums,s.sets,{lessonOn:!entry,lessonEntry:entry,step:s.step,part:s.part});lab.tab='review';return lab.draw();}
function prepare(id,name){lab.go(id);const lesson=lessons(id).find(l=>l.label===name);assert.ok(lesson,`${id}/${name}`);return{lesson,cs:video.compileLesson(lesson),base:baseline()};}

test('all seven real scenes bind 13 source goals and 10 inquiry topics through the common Player',t=>{
  const context={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),context);
  const cat=context.window.APLab.catalog.labs.find(x=>x.id==='geom-projection'),ids=Array.from(lab.list,s=>s.id);
  assert.equal(ids.length,cat.sceneTotal);assert.equal(ids.length,7);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  for(const src of ['../kit/apl-space.js','../kit/apl-video-core.js','../kit/apl-player.js','../kit/apl-toc.js','geom-projection/lesson-core.js','geom-projection/lesson-a.js','geom-projection/lesson-b.js'])assert.ok(lab.loaded.includes(src));
  const goals={mode1:['높이','넓이'],mode2:['단면넓이','장축길이','단축길이'],mode3:['이면각코사인'],mode4:['그림자넓이'],mode5:['GCD넓이','GBC넓이','GBD넓이'],mode6:['단면코사인'],mode7:['ABC넓이','ABD넓이']};
  let total=0,originals=0;
  for(const [i,id]of ids.entries()){
    assert.notEqual(lab.list[i],lab.def.scenes[i],'actual shell copies scene objects');assert.equal(lab.list[i].id,lab.def.scenes[i].id);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    for(const goal of goals[id])assert.ok(lessons(id).some(l=>l.label===goal&&!first(l).lprConcept));
    for(const lesson of lessons(id)){
      total++;const init=first(lesson),cs=video.compileLesson(lesson),packet=lesson.chapters[0].start.lprVariant;
      assert.ok(lesson.chapters.length>=5&&lesson.chapters.length<=6);assert.ok(cs.length>=60&&cs.length<=90);assert.equal(init.lprShowAnswer,false);
      if(!init.lprConcept){originals++;assert.equal(init.lprQuestion,lab.api.question(id,packet));}
      assert.ok(cs.pins.length>=4);for(const key of Object.keys(cs.tracks)){assert.ok(key.startsWith('lpr'));assert.ok(Number.isFinite(cs.start[key]));}
      for(const text of [lesson.answer,init.lprQuestion,...lesson.chapters.flatMap(ch=>ch.cues.map(c=>c.say||''))])for(const m of text.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true}),`${id}/${lesson.label}: ${m[1]}`);
    }
  }
  assert.equal(total,23);assert.equal(originals,13);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8'),/const DEFAULT_PLAYBACK_RATE = 2;/);
  t.diagnostic('7 scenes / 23 lessons: 13 source goals + 10 existing inquiry topics; actual shell scene copies');
});

test('every cue and transition runs actual native 3D geometry with finite canvas coordinates',t=>{
  let frames=0;
  for(const sc of lab.list)for(const lesson of lessons(sc.id)){
    lab.go(sc.id);const cs=video.compileLesson(lesson),base=baseline(),packet=lab.api.first(sc.id,lesson.chapters[0].start.lprVariant),saved=plain(packet),times=new Set([0,.9,cs.length]);
    for(const [i,ch]of cs.chapters.entries())for(const cue of lesson.chapters[i].cues){times.add(ch.at+cue.at);if(cue.to)times.add(ch.at+cue.at+cue.dur/2);}
    let start,motion;
    for(const time of [...times].sort((a,b)=>a-b)){
      const f=apply(cs,time,base);frames++;if(time===0)start=signature(f);if(time===.9)motion=signature(f);
      assert.ok(f.space.cameras.length>=1);assert.ok(f.space.calls.some(c=>c.method==='poly'),`${sc.id}/${lesson.label}: actual native polygon`);
      assert.ok(f.canvas.some(o=>o.name==='lineTo'));assert.deepEqual(plain(f.value),{});
      assert.ok(Object.values(f.focus).flat().every(Number.isFinite));assert.equal(lab.s.lprShowAnswer,time>=cs.chapters.at(-1).at);
      assert.deepEqual(manual(lab.s),manual(base.nums),'playback changes only isolated lesson values');
    }
    assert.notEqual(start,motion,`${sc.id}/${lesson.label}: actual initial camera motion`);assert.deepEqual(plain(packet),saved);
  }
  t.diagnostic(`${frames} native 3D/Board/canvas frames. Browser/mobile/independent visual review NOT_RUN`);
});

test('manual camera, controls, selected new problem and focus survive every sibling and replay',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);Object.assign(lab.s,{yaw:23,pitch:26,th:42,board:47,sun:71,press:33,cn:2.1,mt:67,lens:'aux',acd:true,dir:-1});
    lab.tab='problem';if(+sc.id.slice(4)>=5)lab.newProblem();lab.draw();
    const chosen=manual(lab.s),question=sc.problem.text(lab.s,lab);lab.board.zoom=1.25;lab.board.panX=17;lab.board.panY=-9;lab.draw();const focus=plain(lab.board.focus);
    for(const lesson of lessons(sc.id)){
      const cs=video.compileLesson(lesson),base=baseline(),initial=signature(apply(cs,0,base));apply(cs,cs.length,base);
      assert.deepEqual(manual(lab.s),chosen);assert.equal(signature(apply(cs,0,base)),initial);
    }
    Object.assign(lab.s,{lessonOn:false,lessonEntry:false,step:0});lab.tab='problem';lab.draw();
    assert.deepEqual(manual(lab.s),chosen);assert.equal(sc.problem.text(lab.s,lab),question);assert.deepEqual(plain(lab.board.focus),focus);
    assert.equal(lab.board.zoom,1.25);assert.equal(lab.board.panX,17);assert.equal(lab.board.panY,-9);
  }
});

test('stale final-to-entry restores initial native figure and labels without mutating held manual state',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';if(+sc.id.slice(4)>=5)lab.newProblem();lab.draw();const selected=manual(lab.s);
    for(const lesson of lessons(sc.id)){
      const cs=video.compileLesson(lesson),base=baseline(),initial=signature(apply(cs,0,base,true));
      apply(cs,cs.length,base);Object.assign(lab.s,{lessonOn:false,lessonEntry:true});const held=plain(lab.s);
      assert.equal(signature(lab.draw()),initial,`${sc.id}/${lesson.label}`);assert.deepEqual(plain(lab.s),held);assert.deepEqual(manual(lab.s),selected);
    }
  }
});

test('native numeric answers follow the final chapter and other goals stay hidden',()=>{
  for(const [id,name,pattern]of [['mode1','넓이',/^A′ · S′≈12\.00$/],['mode2','장축길이',/^장축 2a≈12\.00$/],['mode2','단축길이',/^단축 2b=6$/],['mode3','이면각코사인',/^θ 54\.7°$/],['mode5','GCD넓이',/^θ ≈ 70\.5°$/],['mode6','단면코사인',/^θ ≈ 35\.3°$/]]){
    const {cs,base}=prepare(id,name),at=cs.chapters.at(-1).at;
    assert.ok(!apply(cs,at-.01,base).boardTexts.some(s=>pattern.test(s)),`${id}/${name}: premature answer`);
    const f=apply(cs,at,base),item=f.textItems.find(x=>pattern.test(x.text));assert.ok(item,`${id}/${name}: final native label`);
    assert.ok(item.x>=0&&item.x<=lab.board.W&&item.y>=0&&item.y<=lab.board.H,`${id}/${name}: label anchor within viewport`);
  }
  for(const [name,hidden]of [['단면넓이',/^장축 2a|^단축 2b/],['장축길이',/^단축 2b/],['단축길이',/^장축 2a/]]){
    const {cs,base}=prepare('mode2',name);assert.ok(!apply(cs,cs.length,base).boardTexts.some(s=>hidden.test(s)),name+' does not reveal sibling answer');
  }
  const {cs,base}=prepare('mode1','높이');assert.ok(!apply(cs,cs.length,base).boardTexts.some(s=>/^A′ · S′/.test(s)));
});

test('authored presses, point motions, shadows and camera sections change native geometry only',()=>{
  const shape=f=>JSON.stringify(f.space.calls);
  for(const [id,name,key,from,to,end]of [['mode1','길이방향','lprTh',12,18,30],['mode2','역산범위','lprTh',24,30,75],['mode4','일반광선','lprBoard',12,18,45],['mode5','평면투영비','lprPress',24,30,100],['mode6','높이와각','lprCn',36,42,6],['mode7','움직이는면','lprMt',36,42,100],['mode7','수직인면','lprMt',12,18,50]]){
    const {cs,base}=prepare(id,name),before=shape(apply(cs,from,base)),after=shape(apply(cs,to,base));assert.notEqual(before,after,`${id}/${name}`);near(lab.s[key],end);assert.deepEqual(manual(lab.s),manual(base.nums));
    assert.equal(lab.scene.tick(lab.s,1,lab),false);near(lab.s[key],end);
  }
  const {cs,base}=prepare('mode3','교선단면'),before=apply(cs,24,base).space.cameras[0],after=apply(cs,30,base).space.cameras[0];assert.notDeepEqual(before,after);near(after.yaw,-Math.PI/4);near(after.pitch,0);
});

test('actual source and projected polygons are bound to the selected packet and remain in the fitted viewport',()=>{
  const sourcePoints=(id,g)=>id==='mode1'?[g.B,g.C,g.A]:id==='mode2'?g.ell:id==='mode3'?[g.B,g.D,g.E]:id==='mode4'?g.disk:id==='mode5'?g.tri:id==='mode6'?[g.B,g.D,g.N]:[g.A,g.B,g.X];
  const projected=(id,g)=>id==='mode1'?[g.B,g.C,g.Ap]:id==='mode2'?g.base:id==='mode3'?[g.F,g.E,g.H]:id==='mode4'?g.shadow:id==='mode5'?g.triP:id==='mode6'?[g.B,g.D,g.C]:[g.A,g.B,g.Xp];
  for(const sc of lab.list)for(const lesson of lessons(sc.id).filter(l=>!first(l).lprConcept)){
    const {cs,base}=prepare(sc.id,lesson.label),g=lab.api.first(sc.id,lesson.chapters[0].start.lprVariant).check;
    for(const [time,ps]of [[0,sourcePoints(sc.id,g)],[cs.length,projected(sc.id,g)]]){
      const f=apply(cs,time,base);assert.ok(polygonPresent(f,ps),`${sc.id}/${lesson.label}: actual given/projected polygon`);
      const space=lab.context.APLab.space(lab.board,f.space.cameras[0]),xy=ps.map(space.P),v=f.viewBox;
      const twice=Math.abs(xy.reduce((sum,p,i)=>{const q=xy[(i+1)%xy.length];return sum+p.x*q.y-p.y*q.x;},0));assert.ok(twice>1e-4,`${sc.id}/${lesson.label}: essential figure does not collapse in camera`);
      for(const p of xy)assert.ok(p.x>=v.x0-1e-6&&p.x<=v.x1+1e-6&&p.y>=v.y0-1e-6&&p.y<=v.y1+1e-6,`${sc.id}/${lesson.label}: figure within fitted viewport`);
    }
  }
  const {cs,base}=prepare('mode7','수직인면'),f=apply(cs,cs.length,base),g=lab.api.geometry('mode7',{mt:50},true);
  assert.ok(f.space.calls.some(c=>c.method==='line'&&eq(c.points[0],g.A)&&eq(c.points[1],g.M)),'ACD projects to the actual segment AM');
});

test('source-only loading preserves native orbit, both 3D handles, and all registered new-problem controls',async()=>{
  const source=await load({sourceOnly:true});assert.equal(Object.keys(source.def.lessons).length,0);
  for(const sc of source.list){
    source.go(sc.id);source.s.step=3;const initialYaw=source.s.yaw;source.def.board.orbit(source.s,12,6);assert.notEqual(source.s.yaw,initialYaw);const f=source.draw();
    if(sc.id==='mode6'||sc.id==='mode7'){
      const id=sc.id==='mode6'?'projection-N':'projection-M',h=f.handles.find(h=>h.id===id);assert.ok(h&&typeof h.options.drag==='function');
      const g=source.api.geometry(sc.id,source.s,true),space=source.context.APLab.space(source.board,f.space.cameras[0]);
      const a=space.P(g.C),end=space.P(sc.id==='mode6'?g.G:g.D),p={x:a.x+.8*(end.x-a.x),y:a.y+.8*(end.y-a.y)};
      h.options.drag(p);near(source.s[sc.id==='mode6'?'cn':'mt'],sc.id==='mode6'?4.8:80);source.draw();
    }
    if(+sc.id.slice(4)>=5){
      source.tab='problem';const key='v'+sc.id.slice(4),packet=source.api.first(sc.id),saved=plain(packet);
      for(let i=0;i<3;i++){const previous=source.s[key],question=sc.problem.text(source.s,source);source.newProblem();assert.notEqual(source.s[key],previous);assert.notEqual(sc.problem.text(source.s,source),question);source.draw();source.tab='review';source.s.step=3;source.draw();source.tab='problem';}
      assert.deepEqual(plain(packet),saved);
    }
  }
});
