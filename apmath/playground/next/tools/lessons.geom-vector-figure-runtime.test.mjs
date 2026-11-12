// Production HTML, actual shared compiler/Player lifecycle and actual Board.
// This is native source QA; browser/mobile/independent visual QA is not claimed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/vector-figure-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-8,msg||a+' ≈ '+b);
const at=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-8;
const lessons=id=>video.lessonList(lab.def.lessons[id]),firstSet=l=>l.chapters[0].cues[0].set;
const base=cs=>({
 nums:Object.fromEntries(Object.keys(cs.tracks).map(k=>[k,typeof lab.s[k]==='number'?lab.s[k]:0])),
 sets:Object.fromEntries(cs.setKeys.map(k=>[k,lab.s[k]])),step:lab.s.step,part:lab.s.part
});
const signature=f=>createHash('sha256').update(JSON.stringify({
 paths:f.paths,points:f.points,handles:f.handles.map(h=>[h.id,h.point]),
 canvas:f.canvas.filter(op=>op.name!=='setTransform')
})).digest('hex');
function apply(compiled,t,initial,entry=false){
 const state=video.stateAt(compiled,t,initial);
 Object.assign(lab.s,state.nums,state.sets,{lessonOn:!entry,lessonEntry:entry,step:state.step,part:state.part});
 lab.tab='review';return lab.draw();
}
function select(id,label){
 lab.go(id);const lesson=lessons(id).find(x=>x.label===label);assert.ok(lesson);
 const compiled=video.compileLesson(lesson);return {lesson,compiled,initial:base(compiled)};
}
const handle=(f,id)=>{const h=f.handles.find(h=>h.id===id);assert.ok(h,'handle '+id);return h;};

test('six shell-cloned source scenes bind to 28 valid lessons and nine distinct first goals',t=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),ctx);
 const catalog=ctx.window.APLab.catalog.labs.find(x=>x.id==='geom-vector-figure');
 const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,6);assert.equal(ids.length,catalog.sceneTotal);
 assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());assert.deepEqual(lab.missing,[]);
 const goals={m1:['계수값','내분비'],m2:['영역넓이'],m3:['법선벡터','좌표값'],m4:['원의둘레','원의넓이'],cnd5:['최단거리'],ang6:['예각코사인']};
 for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','geom-vector-figure/lesson-core.js','geom-vector-figure/lesson-a.js','geom-vector-figure/lesson-b.js'])assert.ok(lab.loaded.includes(src));
 let count=0,concepts=0,original=0;
 for(const sc of lab.list){
  assert.notEqual(sc,lab.def.scenes.find(x=>x.id===sc.id),'actual shell stackScene+copy');
  assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]});
  assert.deepEqual(plain(lessons(sc.id).filter(x=>!firstSet(x).lvfConcept).map(x=>x.label)),goals[sc.id]);
  for(const lesson of lessons(sc.id)){
   count++;const init=firstSet(lesson),cs=video.compileLesson(lesson);
   init.lvfConcept?concepts++:original++;
   if(!init.lvfConcept)assert.equal(init.lvfQuestion,lab.api.question(sc.id));
   assert.equal(init.lvfShowAnswer,false);assert.ok(cs.length>=60&&cs.length<=72);
   for(const key of ['lvfQuestion','lvfConcept','lvfExplore','lvfTarget','lvfKnownMath','lvfInitial','lvfMode','lvfNormal'])assert.ok(Object.hasOwn(init,key));
   for(const key of [...Object.keys(cs.tracks),...cs.setKeys])assert.ok(key.startsWith('lvf'),'all native controls are isolated: '+key);
   for(const key of Object.keys(cs.tracks))assert.ok(Number.isFinite(cs.start[key]));
   for(const ch of lesson.chapters)for(const cue of ch.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
  }
 }
 assert.equal(count,28);assert.equal(original,9);assert.equal(concepts,19);
 const player=fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8');
 assert.match(player,/const DEFAULT_PLAYBACK_RATE = 2/);
 t.diagnostic('6 scenes / 28 lessons = 9 first-source goals + 19 concepts; validator 0 errors / 0 warnings');
});

test('every cue, movement midpoint and boundary draws finite native geometry and deterministic entry',t=>{
 let frames=0;
 for(const sc of lab.list)for(const lesson of lessons(sc.id)){
  lab.go(sc.id);const cs=video.compileLesson(lesson),initial=base(cs),packet=plain(lab.api.first(sc.id));
  const times=new Set([0,.9,cs.length]);
  cs.chapters.forEach((chapter,i)=>lesson.chapters[i].cues.forEach(cue=>{
   times.add(chapter.at+cue.at);
   if(cue.to){times.add(chapter.at+cue.at+cue.dur/2);times.add(chapter.at+cue.at+cue.dur);}
  }));
  let first,moving;
  for(const time of [...times].sort((a,b)=>a-b)){
   const f=apply(cs,time,initial);frames++;
   assert.ok(f.points.length||f.handles.length,sc.id+'/'+lesson.label+': geometric points present');
   assert.ok(f.canvas.some(op=>op.name==='lineTo'||op.name==='arc'),'actual canvas drawing');
   assert.deepEqual(plain(f.value),{},'legacy result readouts are closed');
   if(time===0)first=signature(f);if(time===.9)moving=signature(f);
   if(time<cs.chapters.at(-1).at)assert.equal(lab.s.lvfShowAnswer,false);
   if(time===cs.length)assert.equal(lab.s.lvfShowAnswer,true);
  }
  assert.notEqual(first,moving,sc.id+'/'+lesson.label+': first-second highlight motion is visible');
  assert.deepEqual(plain(lab.api.first(sc.id)),packet,'first packet remains immutable');
  assert.equal(signature(apply(cs,cs.length,initial,true)),first,sc.id+'/'+lesson.label+': entry restores the initial picture');
 }
 t.diagnostic(frames+' actual Board/canvas states; full browser/mobile/independent visual QA NOT_RUN');
});

test('actual new-problem selections survive fixed-first playback, sibling transitions and viewport restoration',()=>{
 for(const id of ['m1','m2','m3','m4','cnd5','ang6']){
  lab.go(id);lab.tab='problem';lab.newProblem();const sc=lab.scene,picked=plain(sc.vary.cur());
  assert.notDeepEqual(picked,plain(lab.api.first(id)),'actual new-problem handler selects a different packet');
  const question=sc.problem.text(lab.s,lab);lab.draw();
  const before={zoom:1.3,panX:11,panY:-7};Object.assign(lab.board,before);
  const lesson=lessons(id).find(x=>!firstSet(x).lvfConcept),cs=video.compileLesson(lesson),initial=base(cs);
  const first=apply(cs,0,initial);apply(cs,cs.length,initial);
  assert.deepEqual(plain(sc.vary.cur()),plain(lab.api.first(id)),'first packet drawn while lesson is active');
  assert.equal(signature(apply(cs,0,initial)),signature(first),'replay determinism');
  lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
  assert.equal(sc.problem.text(lab.s,lab),question);assert.deepEqual(plain(sc.vary.cur()),picked);
  for(const key of Object.keys(before))assert.equal(lab.board[key],before[key]);
 }
 let {compiled,initial}=select('m2','평행사변형');apply(compiled,60,initial);assert.equal(lab.s.lvfS_preset2,'para');
 const sibling=video.compileLesson(lessons('m2').find(l=>l.label==='영역넓이'));apply(sibling,0,base(sibling));
 assert.equal(lab.s.lvfS_preset2,'trap');assert.equal(lab.s.lvfExplore,false);
 ({compiled,initial}=select('ang6','영벡터제외'));apply(compiled,60,initial);near(lab.s.lvfN_an_x2,0);
 const ordinary=video.compileLesson(lessons('ang6').find(l=>l.label==='예각코사인'));apply(ordinary,0,base(ordinary));
 near(lab.s.lvfN_an_x2,1);near(lab.s.lvfN_an_y2,3);
});

test('actual Player settle/release preserves all native controls after both interruption and completion',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);
  Object.assign(lab.s,{t1:.37,m2:1.15,n2:.45,preset2:'para',t3:-.4,th4:217,cn_lam:-1.75,cn_th:201,cn_r:1.7});
  if(sc.id==='cnd5')Object.assign(lab.s,{cn_Ax:2,cn_Ay:-1,cn_bx:2,cn_by:1,cn_Cx:-3,cn_Cy:1,cn_Px:.25,cn_Py:1.25});
  if(sc.id==='ang6')Object.assign(lab.s,{an_x1:4,an_y1:1,an_x2:2,an_y2:-3});
  const native=Object.fromEntries(lab.api.nativeKeys(sc.id).map(k=>[k,plain(lab.s[k])]));
  for(const lesson of lessons(sc.id))for(const ended of [false,true]){
   const cs=video.compileLesson(lesson),initial=base(cs),player=Object.create(lab.aplab.Player.prototype),time=ended?cs.length:26;
   Object.assign(player,{lab,cs,base:initial,t:time,state:ended?'ended':'playing',_lessonOn:true,_pre:{step:0,part:null}});
   apply(cs,time,initial);player._settle();player._release();lab.draw();
   assert.equal(lab.tab,'explore');assert.equal(lab.s.lessonOn,undefined);
   for(const [key,value] of Object.entries(native))assert.deepEqual(plain(lab.s[key]),value,sc.id+'/'+lesson.label+': manual '+key+' remains unchanged');
  }
 }
});

test('numeric labels for each first target appear with their own final conclusion',()=>{
 let {compiled,initial}=select('m1','내분비');
 assert.ok(!apply(compiled,42,initial).texts.some(x=>/AP : PB = 3:2/.test(x)));
 assert.ok(apply(compiled,48,initial).texts.some(x=>/AP : PB = 3:2/.test(x)));
 ({compiled,initial}=select('m3','법선벡터'));
 assert.ok(!apply(compiled,36,initial).texts.some(x=>/n = \(2, -3\)/.test(x)));
 assert.ok(apply(compiled,48,initial).texts.some(x=>/n = \(2, -3\)/.test(x)));
 ({compiled,initial}=select('m3','좌표값'));
 assert.ok(!apply(compiled,42,initial).texts.some(x=>/P\(7, 6\)/.test(x)));
 const point=apply(compiled,48,initial);assert.ok(point.texts.some(x=>/P\(7, 6\)/.test(x)));assert.equal(point.rights.length,0,'the sibling normal is not drawn');
 ({compiled,initial}=select('cnd5','최단거리'));
 assert.ok(!apply(compiled,54,initial).texts.some(x=>/최소 2/.test(x)));
 assert.ok(apply(compiled,60,initial).texts.some(x=>/최소 2/.test(x)));
 ({compiled,initial}=select('ang6','예각코사인'));
 assert.ok(!apply(compiled,42,initial).texts.some(x=>/cos θ = 3\/5/.test(x)));
 assert.ok(apply(compiled,48,initial).texts.some(x=>/cos θ = 3\/5/.test(x)));
});

test('native boundary pictures show actual intersections, zero-vector exclusions and scalar motion',()=>{
 let {compiled,initial}=select('cnd5','교차경계');
 let f=apply(compiled,0,initial);assert.ok(at(handle(f,'cnP').point,{x:0,y:0}));assert.ok(at(handle(f,'cnQ').point,{x:1,y:0}));
 f=apply(compiled,24,initial);assert.ok(at(handle(f,'cnP').point,handle(f,'cnQ').point));
 f=apply(compiled,36,initial);const P=handle(f,'cnP').point,Q=handle(f,'cnQ').point;
 assert.ok(at(P,Q));near(P.x,0);near(P.y,Math.sqrt(3)/2);
 assert.ok(!at(P,{x:0,y:0}),'the intersection differs from the foot');
 ({compiled,initial}=select('cnd5','영벡터'));f=apply(compiled,40.2,initial);
 assert.equal(f.rights.length,0);assert.ok(at(handle(f,'cnP').point,{x:2,y:0}));assert.ok(at(handle(f,'cnP').point,handle(f,'cnQ').point));
 ({compiled,initial}=select('cnd5','크기원'));
 const q0=handle(apply(compiled,0,initial),'cnQ').point,q1=handle(apply(compiled,16.2,initial),'cnQ').point;
 assert.ok(!at(q0,q1));near(Math.hypot(q1.x+4,q1.y-2),1);
 ({compiled,initial}=select('ang6','방향반전'));
 f=apply(compiled,12,initial);assert.equal(f.angles.length,2);assert.ok(f.angles.some(a=>a.options.color==='amber'&&at(a.b,{x:2,y:4})));
 ({compiled,initial}=select('ang6','수직과평행'));
 assert.equal(apply(compiled,0,initial).rights.length,1);f=apply(compiled,24,initial);assert.equal(f.rights.length,0);
 assert.ok(at(handle(f,'anD1').point,handle(f,'anD2').point));
 ({compiled,initial}=select('ang6','영벡터제외'));f=apply(compiled,12,initial);
 assert.equal(f.rights.length,0);assert.equal(f.angles.length,0);assert.ok(at(handle(f,'anD2').point,{x:1,y:1}));
 ({compiled,initial}=select('m4','끝점포함'));
 f=apply(compiled,16.2,initial);assert.ok(at(handle(f,'P4').point,{x:3,y:3}));
 f=apply(compiled,28.2,initial);assert.ok(at(handle(f,'P4').point,{x:-3,y:-1}));
 assert.ok(!f.texts.some(x=>/90°/.test(x)),'an endpoint has no right-angle label');
});

test('original drag handlers, external draw state and source-only registration remain functional',async()=>{
 lab.go('m1');handle(lab.draw(),'P1').options.drag({x:4,y:2});near(lab.s.t1,1);
 lab.go('m3');handle(lab.draw(),'P3').options.drag({x:-2,y:0});near(lab.s.t3,-1);
 lab.go('cnd5');handle(lab.draw(),'cnB').options.drag({x:0,y:0});near(lab.s.cn_bx,0);near(lab.s.cn_by,0);
 handle(lab.draw(),'cnP').options.drag({x:2,y:-1});near(lab.s.cn_Px,2);near(lab.s.cn_Py,-1);
 lab.go('ang6');handle(lab.draw(),'anD2').options.drag({x:2,y:-2});near(lab.s.an_x2,1);near(lab.s.an_y2,-3);
 const {compiled,initial}=select('m1','선분과연장'),state=video.stateAt(compiled,28.2,initial),old=lab.s.t1;
 const external={...lab.s,...state.nums,...state.sets,lessonOn:true,lessonEntry:false,step:state.step},seen=[],original=lab.board.handle;
 lab.board.handle=function(id,p,opts){seen.push({id,p:{...p}});return original.call(this,id,p,opts);};
 try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board.handle=original;}
 assert.ok(seen.some(h=>h.id==='P1'&&at(h.p,{x:7,y:1})),'external t=1.5 controls the actual original point');
 near(lab.s.t1,old,'external drawing does not mutate shell state');
 const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
 for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});
