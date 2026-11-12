// Execute the actual production HTML, apl-space projection and Board drawing.
// The minimal canvas recorder does not claim browser/mobile/visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/space-coord-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-8,msg||a+' ≈ '+b);
const lessons=id=>video.lessonList(lab.def.lessons[id]);
const firstSet=lesson=>lesson.chapters[0].cues[0].set;
const base=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const signature=f=>createHash('sha256').update(JSON.stringify({
 space:f.space,camera:f.spaceCameras,paths:f.paths,points:f.points,
 canvas:f.canvas.filter(op=>op.name!=='setTransform')
})).digest('hex');
function apply(compiled,t,initial,entry=false){
 const state=video.stateAt(compiled,t,initial);
 Object.assign(lab.s,state.nums,state.sets,{lessonOn:!entry,lessonEntry:entry,step:state.step,part:state.part});
 lab.tab='review';return lab.draw();
}
function select(id,label){
 lab.go(id);const lesson=lessons(id).find(x=>x.label===label);assert.ok(lesson);
 return {lesson,compiled:video.compileLesson(lesson),initial:base()};
}
const world=(x,y,z)=>({x,y:z,z:-y});
const at=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<1e-8;
const spacePoints=f=>f.space.filter(x=>x.name==='point');
const projection=(p,yaw,pitch)=>{
 const y=yaw*Math.PI/180,t=pitch*Math.PI/180;
 return {x:p.x*Math.cos(y)+p.y*Math.sin(y),y:p.z*Math.cos(t)-(p.x*Math.sin(y)-p.y*Math.cos(y))*Math.sin(t)};
};

test('catalog, shell-cloned scenes and all first-source targets bind to 32 valid lessons',t=>{
 const catalogContext={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),catalogContext);
 const catalog=catalogContext.window.APLab.catalog.labs.find(x=>x.id==='geom-space-coord');
 const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,8);assert.equal(ids.length,catalog.sceneTotal);
 assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());assert.deepEqual(lab.missing,[]);
 const targets={mode1:['최단거리','정사영비'],mode2:['교점내분비','교점좌표'],mode3:['단면반지름','단면넓이'],mode4:['최댓거리','최솟거리','접선길이'],mode5:['두점거리'],mode6:['접하는상수','다른단면'],mode7:['무게외분거리'],mode8:['삼각형넓이']};
 for(const src of ['../kit/apl-space.js','../kit/apl-player.js','../kit/apl-video-core.js','geom-space-coord/lesson-core.js','geom-space-coord/lesson-a.js','geom-space-coord/lesson-b.js'])assert.ok(lab.loaded.includes(src),src);
 let count=0,concepts=0,goals=0;
 for(const sc of lab.list){
  assert.notEqual(sc,lab.def.scenes.find(x=>x.id===sc.id),'actual shell stackScene+copy semantics');
  assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]});
  assert.deepEqual(plain(lessons(sc.id).filter(x=>!firstSet(x).lscConcept).map(x=>x.label)),targets[sc.id]);
  for(const lesson of lessons(sc.id)){
   count++;const init=firstSet(lesson),compiled=video.compileLesson(lesson);
   init.lscConcept?concepts++:goals++;
   if(!init.lscConcept)assert.equal(init.lscQuestion,lab.api.question(sc.id));
   for(const key of ['lscQuestion','lscConcept','lscExplore','lscTarget','lscShowAnswer','lscKnownMath','lscInitial','lscExtreme','lscTangent','lscLayers'])assert.ok(Object.hasOwn(init,key),sc.id+'/'+lesson.label+': '+key);
   assert.equal(init.lscShowAnswer,false);assert.ok(compiled.length>=60&&compiled.length<=72);
   for(const key of Object.keys(compiled.tracks))assert.ok(Number.isFinite(compiled.start[key]),'finite numeric starting track');
   for(const key of ['sd5','sd6','sd7','sd8'])assert.ok(!Object.hasOwn(compiled.start,key),'variant seed is not a lesson track');
   for(const ch of lesson.chapters)for(const cue of ch.cues)for(const match of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(match[1],{throwOnError:true});
  }
 }
 assert.equal(count,32);assert.equal(goals,14);assert.equal(concepts,18);
 t.diagnostic('8 scenes / 32 lessons = 14 first-source goals + 18 concepts; validator 0 errors / 0 warnings');
});

test('every authored cue and movement boundary draws finite native 3D and canvas geometry',t=>{
 let frames=0;
 for(const sc of lab.list)for(const lesson of lessons(sc.id)){
  lab.go(sc.id);const initial=base(),compiled=video.compileLesson(lesson),packet=plain(lab.api.first(sc.id));
  const times=new Set([0,.9,compiled.length]);
  compiled.chapters.forEach((chapter,i)=>lesson.chapters[i].cues.forEach(cue=>{
   times.add(chapter.at+cue.at);
   if(cue.to){times.add(chapter.at+cue.at+cue.dur/2);times.add(chapter.at+cue.at+cue.dur);}
  }));
  let first,moving;
  for(const time of [...times].sort((a,b)=>a-b)){
   const f=apply(compiled,time,initial);frames++;
   assert.ok(f.space.length>0&&f.spaceCameras.length>0,sc.id+'/'+lesson.label+': actual apl-space');
   assert.ok(spacePoints(f).length>0,sc.id+'/'+lesson.label+': actual geometric points');
   assert.ok(f.canvas.some(op=>op.name==='lineTo'||op.name==='arc'),'actual Board draws');
   assert.deepEqual(plain(f.value),{},'legacy result readouts remain closed during playback');
   if(time===0)first=signature(f);if(time===.9)moving=signature(f);
   if(time<compiled.chapters.at(-1).at)assert.equal(lab.s.lscShowAnswer,false);
   if(time===compiled.length)assert.equal(lab.s.lscShowAnswer,true);
  }
  assert.notEqual(first,moving,sc.id+'/'+lesson.label+': introductory camera movement is visible');
  assert.deepEqual(plain(lab.api.first(sc.id)),packet,'first packet is immutable');
  assert.equal(signature(apply(compiled,compiled.length,initial,true)),first,sc.id+'/'+lesson.label+': entry picture returns to its initial state');
 }
 t.diagnostic(frames+' actual apl-space / Board canvas states; full browser/mobile/independent visual QA NOT_RUN');
});

test('changed-number selections, sibling resets and manual viewport survive fixed-first playback',()=>{
 for(const id of ['mode5','mode6','mode7','mode8']){
  lab.go(id);lab.tab='problem';lab.newProblem(true);lab.newProblem();
  const seed=lab.s['sd'+id.slice(4)],picked=plain(lab.api.variant(id,seed)),sc=lab.scene;
  assert.notDeepEqual(picked,plain(lab.api.first(id)),'actual numeric variant handler');
  const question=sc.problem.text(lab.s,lab);lab.draw();
  const before={zoom:1.3,panX:11,panY:-7};Object.assign(lab.board,before);
  const lesson=lessons(id).find(x=>!firstSet(x).lscConcept),compiled=video.compileLesson(lesson),initial=base();
  const first=apply(compiled,0,initial);apply(compiled,compiled.length,initial);
  assert.equal(signature(apply(compiled,0,initial)),signature(first),'replay determinism');
  assert.equal(lab.s['sd'+id.slice(4)],seed,'selected seed preserved through playback');
  lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
  assert.equal(sc.problem.text(lab.s,lab),question);assert.deepEqual(plain(lab.api.variant(id,seed)),picked);
  for(const key of Object.keys(before))assert.equal(lab.board[key],before[key]);
 }
 let {compiled,initial}=select('mode5','원점대칭');apply(compiled,60,initial);
 assert.equal(lab.s.lscN_tgt,6);assert.equal(lab.s.lscN_kind,1);
 const sibling=lessons('mode5').find(x=>x.label==='두점거리');apply(video.compileLesson(sibling),0,base());
 assert.equal(lab.s.lscN_tgt,0);assert.equal(lab.s.lscN_kind,0);assert.equal(lab.s.lscExplore,false);
});

test('all lesson tracks preserve native manual controls through replay and exit',()=>{
 for(const sc of lab.list) {
  lab.go(sc.id);
  const nativeKeys=Object.keys(lab.api.initial(sc.id)).filter(k=>!k.startsWith('lsc'));
  Object.assign(lab.s,{yaw:51,pitch:29,t1:.77,t2:.31,d:4.3,th:1.2});
  const saved=Object.fromEntries(nativeKeys.map(k=>[k,plain(lab.s[k])]));
  for(const lesson of lessons(sc.id)) {
   const compiled=video.compileLesson(lesson),initial=base();
   apply(compiled,0,initial);apply(compiled,compiled.length,initial);
   for(const [key,value] of Object.entries(saved))assert.deepEqual(plain(lab.s[key]),value,sc.id+'/'+lesson.label+' preserves '+key);
   lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.tab='explore';lab.draw();
   for(const [key,value] of Object.entries(saved))assert.deepEqual(plain(lab.s[key]),value,'exit preserves '+key);
  }
 }
});

test('target labels and native tangency/shortcut geometry follow their explanation cues',()=>{
 let {compiled,initial}=select('mode2','교점좌표');
 assert.ok(!apply(compiled,36,initial).texts.some(x=>/P\(2,\s*[−-]3,\s*0\)/.test(x)));
 assert.ok(apply(compiled,48,initial).texts.some(x=>/P\(2,\s*[−-]3,\s*0\)/.test(x)));
 ({compiled,initial}=select('mode4','최댓거리'));
 let f=apply(compiled,30,initial);
 assert.ok(spacePoints(f).some(x=>at(x.points[0],world(-12/5,0,-9/5))),'maximizing point is on the opposite side of C');
 assert.ok(!spacePoints(f).some(x=>at(x.points[0],world(12/5,0,9/5))),'the sibling minimizing point stays off');
 assert.ok(!f.space.some(x=>x.name==='poly'&&x.points.length===96),'tangent circle stays off for a max-distance goal');
 ({compiled,initial}=select('mode4','접선길이'));f=apply(compiled,18,initial);
 assert.ok(f.space.some(x=>x.name==='poly'&&x.points.length===96),'source contact circle present with tangency');
 assert.ok(!f.texts.some(x=>/Qmax|Qmin/.test(x)));
 ({compiled,initial}=select('mode8','직각확인'));
 const earlier=apply(compiled,36,initial),last=apply(compiled,48,initial);
 const origin={x:2,y:2,z:4},F={x:6,y:0,z:0},H={x:0,y:6,z:0},size=.6;
 const delta=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z}),u=delta(F,origin),v=delta(H,origin);
 const lu=Math.hypot(u.x,u.y,u.z),lv=Math.hypot(v.x,v.y,v.z);
 const a={x:origin.x+size*u.x/lu,y:origin.y+size*u.y/lu,z:origin.z+size*u.z/lu};
 const c={x:origin.x+size*v.x/lv,y:origin.y+size*v.y/lv,z:origin.z+size*v.z/lv};
 const corner={x:a.x+size*v.x/lv,y:a.y+size*v.y/lv,z:a.z+size*v.z/lv};
 const expected=[a,corner,c].map(p=>projection(p,36,24));
 const matches=path=>path.points.length===3&&path.points.every((p,i)=>Math.hypot(p.x-expected[i].x,p.y-expected[i].y)<1e-8);
 assert.ok(!earlier.paths.some(matches),'the right-angle conclusion is not marked early');
 assert.ok(last.paths.some(matches),'actual projected right angle appears with the conclusion');
});

test('native boundary pictures distinguish a circle, tangent point, empty sphere and absent external point',()=>{
 let {compiled,initial}=select('mode3','교차와접촉');
 const circle=apply(compiled,12,initial),tangent=apply(compiled,28.2,initial),empty=apply(compiled,40.2,initial);
 const section=f=>f.space.some(x=>x.name==='poly'&&x.points.length===48);
 assert.ok(section(circle));assert.ok(!section(tangent));assert.ok(!section(empty));
 assert.ok(spacePoints(tangent).some(x=>at(x.points[0],world(0,0,0))),'actual tangent point H');
 ({compiled,initial}=select('mode6','구의존재'));
 const positive=apply(compiled,12,initial),point=apply(compiled,28.2,initial),none=apply(compiled,40.2,initial);
 const sphere=f=>f.space.some(x=>x.name==='poly'&&x.points.length===44);
 assert.ok(sphere(positive));assert.ok(!sphere(point));assert.ok(!sphere(none));
 ({compiled,initial}=select('mode7','외분점'));const absent=apply(compiled,36,initial);
 assert.equal(lab.s.lscN_m7,lab.s.lscN_n7);
 assert.ok(!spacePoints(absent).some(x=>x.args[1]?.r===7.5),'equal external weights have no fabricated X');
 ({compiled,initial}=select('mode8','진짜높이'));const end=apply(compiled,52.2,initial);
 assert.ok(end.space.some(x=>x.name==='line'&&at(x.points[0],world(6,6,0))&&at(x.points[1],world(3,3,0))),'height remains on the base at P=G');
});

test('original dragging/orbit, external player state and source-only registration remain functional',async()=>{
 lab.go('mode1');let f=lab.draw(),h=f.handles.find(x=>x.id==='coord-P');assert.ok(h);
 const finish=projection({x:3,y:4,z:0},lab.s.yaw,lab.s.pitch);h.options.drag(finish);near(lab.s.t1,1);
 lab.go('mode3');f=lab.draw();h=f.handles.find(x=>x.id==='coord-C');assert.ok(h);
 h.options.drag(projection({x:0,y:0,z:6},lab.s.yaw,lab.s.pitch));near(lab.s.d,6);
 const yaw=lab.s.yaw;lab.def.board.orbit(lab.s,10,10);assert.notEqual(lab.s.yaw,yaw);assert.ok(lab.s.pitch<=85);
 // Actual source draw consumes the external state supplied by the Player.
 const {compiled,initial}=select('mode3','교차와접촉'),snapshot=video.stateAt(compiled,40.2,initial);
 const external={...lab.s,...snapshot.nums,...snapshot.sets,lessonOn:true,lessonEntry:false,step:snapshot.step};
 const previousD=lab.s.d,seen=[],native=lab.aplab.space;
 lab.aplab.space=(b,c,o)=>{const sp=native(b,c,o),point=sp.point;sp.point=(p,opts)=>{seen.push({...p});return point(p,opts);};return sp;};
 try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.aplab.space=native;}
 assert.ok(seen.some(p=>at(p,world(0,0,6))),'external d=6 moves the native sphere center');
 assert.equal(lab.s.d,previousD,'external rendering does not mutate the shell state');
 const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
 for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});
