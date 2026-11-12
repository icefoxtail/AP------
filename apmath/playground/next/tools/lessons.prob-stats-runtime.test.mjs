// Actual HTML, shell stackScene/copy, shared Player and Board/canvas.
// Native execution does not claim browser/mobile/independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/stats-lesson-runtime.mjs';
const lab=await load({forbidUnseeded:true}),video=lab.video,api=lab.api,M=api.math;
const plain=x=>JSON.parse(JSON.stringify(x));
const near=(a,b,msg,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,msg||a+' ≈ '+b);
const lessons=id=>video.lessonList(lab.def.lessons[id]),firstSet=l=>l.chapters[0].cues[0].set;
const base=cs=>({
 nums:Object.fromEntries(Object.keys(cs.tracks).map(k=>[k,typeof lab.s[k]==='number'?lab.s[k]:0])),
 sets:Object.fromEntries(cs.setKeys.map(k=>[k,lab.s[k]])),step:lab.s.step,part:lab.s.part
});
const signature=f=>createHash('sha256').update(JSON.stringify({
 paths:f.paths,plots:f.plots.map(p=>p.samples),points:f.points,handles:f.handles.map(h=>[h.id,h.point]),
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

test('seven shell-cloned source scenes bind all 18 original branches and 19 concepts to 37 valid lessons',t=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),ctx);
 const catalog=ctx.window.APLab.catalog.labs.find(x=>x.id==='prob-stats');
 const ids=Array.from(lab.list,x=>x.id);assert.equal(ids.length,7);assert.equal(ids.length,catalog.sceneTotal);
 assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());assert.deepEqual(lab.missing,[]);
 for(const src of ['../kit/apl-player.js','../kit/apl-video-core.js','prob-stats/lesson-core.js','prob-stats/lesson-a.js','prob-stats/lesson-b.js'])assert.ok(lab.loaded.includes(src));
 let count=0,concepts=0,original=0;
 for(const sc of lab.list){
  assert.notEqual(sc,lab.def.groups.flatMap(g=>g.scenes).find(x=>x.id===sc.id),'actual shell stackScene+copy');
  assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]});
  const originals=lessons(sc.id).filter(x=>!firstSet(x).lpsConcept);
  assert.deepEqual(plain(originals.map(x=>firstSet(x).lpsKind)).sort(),plain(api.kinds(sc.id)).sort());
  for(const lesson of lessons(sc.id)){
   count++;const init=firstSet(lesson),cs=video.compileLesson(lesson);
   init.lpsConcept?concepts++:original++;
   if(!init.lpsConcept)assert.equal(init.lpsQuestion,api.question(sc.id,init.lpsKind));
   assert.equal(init.lpsShowAnswer,false);assert.ok(cs.length>=60&&cs.length<=72);
   for(const key of ['lpsScene','lpsQuestion','lpsConcept','lpsExplore','lpsTarget','lpsKnownMath','lpsInitial','lpsKind'])assert.ok(Object.hasOwn(init,key));
   for(const key of [...Object.keys(cs.tracks),...cs.setKeys])assert.ok(key.startsWith('lps'),'all native controls are isolated: '+key);
   for(const key of Object.keys(cs.tracks))assert.ok(Number.isFinite(cs.start[key]));
   for(const ch of lesson.chapters)for(const cue of ch.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
  }
 }
 assert.equal(count,37);assert.equal(original,18);assert.equal(concepts,19);
 assert.match(fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8'),/const DEFAULT_PLAYBACK_RATE = 1\.5/);
 assert.equal(lab.randomCalls(),0);
 t.diagnostic('7 scenes / 37 lessons = 18 original source branches + 19 concepts; validator 0 errors / 0 warnings');
});

test('every authored cue and movement boundary draws finite native probability geometry and repeatable entry',t=>{
 let frames=0;
 for(const sc of lab.list)for(const lesson of lessons(sc.id)){
  lab.go(sc.id);const cs=video.compileLesson(lesson),initial=base(cs),packet=plain(api.first(sc.id));
  const times=new Set([0,.9,cs.length]);
  cs.chapters.forEach((chapter,i)=>lesson.chapters[i].cues.forEach(cue=>{
   times.add(chapter.at+cue.at);
   if(cue.to){times.add(chapter.at+cue.at+cue.dur/2);times.add(chapter.at+cue.at+cue.dur);}
  }));
  let first,moving;
  for(const time of [...times].sort((a,b)=>a-b)){
   const f=apply(cs,time,initial);frames++;
   assert.ok(f.paths.length||f.plots.length,sc.id+'/'+lesson.label+': native bars or curves present');
   assert.ok(f.canvas.some(op=>op.name==='lineTo'),'actual Board canvas drawing');
   assert.deepEqual(plain(f.value),{},'legacy result readouts are closed');
   if(time===0)first=signature(f);if(time===.9)moving=signature(f);
   if(time<cs.chapters.at(-1).at)assert.equal(lab.s.lpsShowAnswer,false);
   if(time===cs.length)assert.equal(lab.s.lpsShowAnswer,true);
  }
  assert.notEqual(first,moving,sc.id+'/'+lesson.label+': introductory trace is visible');
  assert.deepEqual(plain(api.first(sc.id)),packet,'first packet immutable');
  assert.equal(signature(apply(cs,cs.length,initial,true)),first,sc.id+'/'+lesson.label+': entry restores the initial picture');
 }
 assert.equal(lab.randomCalls(),0);
 t.diagnostic(frames+' actual Board/canvas states; full browser/mobile/independent visual QA NOT_RUN');
});

test('actual new-problem choices, first packets and viewport remain intact through branch playback and reload',async()=>{
 const replay=await load({forbidUnseeded:true});
 for(const sc of lab.list){
  lab.go(sc.id);replay.go(sc.id);
  assert.deepEqual(plain(api.first(sc.id)),plain(replay.api.first(sc.id)),'first source packet is reproducible across loads');
  lab.tab='problem';lab.newProblem();replay.newProblem();
  const picked=plain(sc.vary.cur()),index=sc.vary.index,question=sc.problem.text(lab.s,lab);
  assert.notDeepEqual(picked,plain(api.first(sc.id)));assert.deepEqual(picked,plain(replay.scene.vary.cur()));
  lab.draw();const before={zoom:1.3,panX:11,panY:-7};Object.assign(lab.board,before);
  for(const lesson of lessons(sc.id).filter(x=>!firstSet(x).lpsConcept)){
   const cs=video.compileLesson(lesson),initial=base(cs),first=apply(cs,0,initial);apply(cs,cs.length,initial);
   assert.deepEqual(plain(sc.vary.cur()),plain(api.packet(sc.id,firstSet(lesson).lpsKind)));
   assert.equal(signature(apply(cs,0,initial)),signature(first),'replay determinism');
   lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.s.step=0;lab.tab='problem';lab.draw();
   assert.equal(sc.problem.text(lab.s,lab),question);assert.deepEqual(plain(sc.vary.cur()),picked);assert.equal(sc.vary.index,index);
   for(const key of Object.keys(before))assert.equal(lab.board[key],before[key]);
  }
 }
 assert.equal(replay.randomCalls(),0);
});

test('actual Player interruption and completion preserve every native scalar, sample array, counter and seed',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);
  Object.assign(lab.s,{ka:-2,kb:4,ln:32,lp:.35,lz1:-.7,lz2:1.1,sm:6,ss:3,sa:2,sb:9,tm1:22,tm2:12,tg1:3,tg2:6,ta:12,tb:19,qx1:2,qx2:4,qh:.25,qk:.4,qu:1,qv:5,on:16,pn:36});
  if(sc.id==='dist')Object.assign(lab.s,{kp:[.1,.2,.3,.3,.1],kshowY:true});
  if(sc.id==='binom')Object.assign(lab.s,{lcorr:true,lshow:false});
  if(sc.id==='sym')lab.s.tmove=false;
  if(sc.id==='pdf')lab.s.qmir=true;
  if(sc.id==='mean'){lab.s.opop='skew';lab.s.oseed=123456;api.samples.mean(lab.s,37);}
  if(sc.id==='ci'){lab.s.pc=99;lab.s.pseed=246810;api.samples.confidence(lab.s,43,true);}
  const native=Object.fromEntries(api.nativeKeys(sc.id).map(k=>[k,plain(lab.s[k])]));
  lab.newProblem();const selected=plain(sc.vary.cur()),index=sc.vary.index;
  for(const lesson of lessons(sc.id))for(const ended of [false,true]){
   const cs=video.compileLesson(lesson),initial=base(cs),player=Object.create(lab.aplab.Player.prototype),time=ended?cs.length:26;
   Object.assign(player,{lab,cs,base:initial,t:time,state:ended?'ended':'playing',_lessonOn:true,_pre:{step:0,part:null}});
   apply(cs,time,initial);player._settle();player._release();lab.draw();
   assert.equal(lab.tab,'explore');assert.equal(lab.s.lessonOn,undefined);
   for(const [key,value] of Object.entries(native))assert.deepEqual(plain(lab.s[key]),value,sc.id+'/'+lesson.label+': '+key+' unchanged');
   assert.deepEqual(plain(sc.vary.cur()),selected);assert.equal(sc.vary.index,index);
  }
 }
});

test('original result labels appear only with the corresponding final conclusion',()=>{
 for(const [id,label,needle] of [
  ['binom','이하확률','0.841'],['binom','이상확률','0.841'],['binom','구간확률','0.993'],
  ['std','왼쪽구간','k=0.158'],['std','평균가로질러','k=0.976'],['std','오른쪽구간','k=0.022'],
  ['std','모수역추론','0.624'],['sym','같은폭교점','0.136'],
  ['mean','평균이상','0.999'],['mean','평균이하','0.933'],['mean','평균구간','0.840'],
  ['ci','구간끝점','a = 8.5'],['ci','표본최소','n = 4']
 ]){
  const {compiled,initial}=select(id,label),last=compiled.chapters.at(-1).at;
  assert.ok(!apply(compiled,last-1,initial).texts.includes(needle),id+'/'+label+': target hidden before final');
  assert.ok(apply(compiled,last,initial).texts.includes(needle),id+'/'+label+': target drawn at final');
 }
 let {compiled,initial}=select('pdf','보완넓이');
 assert.ok(!apply(compiled,59,initial).texts.includes('61'));assert.ok(apply(compiled,60,initial).texts.includes('61'));
 ({compiled,initial}=select('ci','표본최소'));
 assert.ok(!apply(compiled,0,initial).texts.some(x=>x.includes('길이 = 15.68')));
 assert.ok(apply(compiled,12,initial).texts.some(x=>x.includes('길이 = 15.68')));
});

test('native transformed bars, corrected areas and normal curves follow the authored parameter changes',()=>{
 let {compiled,initial}=select('dist','영배변환');
 const start=apply(compiled,0,initial),collapsed=apply(compiled,12,initial);
 assert.equal(start.paths.filter(p=>p.options.fill==='sky').length,5);
 const only=collapsed.paths.filter(p=>p.options.fill==='sky');assert.equal(only.length,1);
 near(only[0].points[2].y,91,'one probability-one bar reaches y=1');
 ({compiled,initial}=select('binom','반칸보정'));
 const uncorrected=apply(compiled,0,initial).paths.find(p=>p.options.fill==='rose');
 const corrected=apply(compiled,24,initial).paths.find(p=>p.options.fill==='rose');
 assert.ok(corrected.points[0].x<uncorrected.points[0].x);assert.ok(corrected.points.at(-1).x>uncorrected.points.at(-1).x);
 ({compiled,initial}=select('sym','조각이동'));
 assert.ok(!apply(compiled,12,initial).paths.some(p=>p.options.fill==='violet'));
 assert.ok(apply(compiled,24,initial).paths.some(p=>p.options.fill==='violet'));
 ({compiled,initial}=select('sym','대칭평행이동'));
 assert.ok(!apply(compiled,36,initial).paths.some(p=>p.options.fill==='violet'));
 assert.ok(apply(compiled,42,initial).paths.some(p=>p.options.fill==='violet'));
 ({compiled,initial}=select('sym','폭과교점'));
 assert.equal(apply(compiled,12,initial).points.filter(p=>p.options.color==='ink').length,1);
 assert.equal(apply(compiled,24,initial).points.filter(p=>p.options.color==='ink').length,2);
 assert.equal(apply(compiled,36,initial).points.filter(p=>p.options.color==='ink').length,2);
 ({compiled,initial}=select('pdf','밀도조건'));
 const bad=apply(compiled,24,initial).paths.find(p=>p.options.color==='rose'&&p.points.length===4);
 assert.ok(bad);const zero=M.mkChart(M.BOX1,[-.6,6.9,-.06,.55]).Y(0);
 assert.ok(Math.min(...bad.points.map(p=>p.y))<zero,'g actually dips below the original zero axis');
 ({compiled,initial}=select('mean','복원평균분산'));
 assert.equal(apply(compiled,12,initial).paths.filter(p=>p.options.fill==='sky').length,0);
 assert.equal(apply(compiled,24,initial).paths.filter(p=>p.options.fill==='sky').length,17,'exact n=4 convolution has 17 possible means');
});

test('native histogram densities and confidence rows use the deterministic sample snapshots, including rewind',()=>{
 let {compiled,initial}=select('mean','평균누적');
 const first=apply(compiled,16.2,initial);assert.ok(first.texts.some(x=>x.includes('n=4, 1번')));
 const hundred=apply(compiled,28.2,initial),digest=signature(hundred),state=api.initial('mean'),sample=api.samples.snapshot('mean',state,100);
 const w=.5,bins=new Map();for(const x of sample.omeans){const k=Math.round(x/w);bins.set(k,(bins.get(k)||0)+1);}
 const ymax=Math.max(1/(Math.sqrt(2)*Math.sqrt(2*Math.PI)),...Array.from(bins.values(),c=>c/(100*w)))*1.22;
 const bars=hundred.paths.filter(p=>p.options.fill==='sky');assert.equal(bars.length,bins.size);
 let area=0;for(const bar of bars){const ps=bar.points,dx=(ps[1].x-ps[0].x)/86*10,h=(ps[2].y-20)/38*ymax;near(dx,w);area+=dx*h;}
 near(area,1);assert.ok(hundred.texts.some(x=>x.includes('n=4, 100번')));
 apply(compiled,40.2,initial);assert.equal(signature(apply(compiled,28.2,initial)),digest,'histogram rewind is exact');
 ({compiled,initial}=select('ci','반복포함'));
 const frame=apply(compiled,40.2,initial),snapshot=api.samples.snapshot('ci',api.initial('ci'),1000);
 assert.equal(snapshot.ptot,1000);assert.equal(snapshot.prows.length,100);assert.ok(snapshot.phit>0&&snapshot.phit<1000);
 let move,line;const segments=[];
 for(const op of frame.canvas){
  if(op.name==='moveTo')move=op.args;
  else if(op.name==='lineTo')line=op.args;
  else if(op.name==='stroke'&&move&&line){
   const a=lab.board.toW(...move),b=lab.board.toW(...line);
   if(Math.abs(a.y-b.y)<1e-8&&a.y>15&&a.y<57&&Math.abs(a.x-b.x)>1&&
      (Math.abs(op.lineWidth/lab.board.lw-1.5)<1e-8||Math.abs(op.lineWidth/lab.board.lw-2.2)<1e-8))segments.push({a,b,width:op.lineWidth/lab.board.lw});
   move=line=null;
  }
 }
 assert.equal(segments.length,100);
 segments.forEach((seg,i)=>{
  const row=snapshot.prows[i];near(seg.a.y,57-(i+.5)*.42);near(seg.b.y,seg.a.y);
  near(seg.a.x,11+(Math.max(26,row.lo)-26)/48*86);near(seg.b.x,11+(Math.min(74,row.hi)-26)/48*86);
  near(seg.width,row.hit?1.5:2.2);assert.equal(row.hit,row.lo<=50&&row.hi>=50);
 });
 const digestCI=signature(frame);apply(compiled,16.2,initial);assert.equal(signature(apply(compiled,40.2,initial)),digestCI);
 ({compiled,initial}=select('ci','신뢰도길이'));
 apply(compiled,24,initial);near(lab.s.lpsN_pc,95);apply(compiled,36,initial);near(lab.s.lpsN_pc,99);
 const s90={...api.initial('ci'),pc:90},s99={...api.initial('ci'),pc:99};
 const r90=api.samples.snapshot('ci',s90,20).prows,r99=api.samples.snapshot('ci',s99,20).prows;
 r90.forEach((r,i)=>{near(r.x,r99[i].x);assert.ok(r99[i].lo<r.lo&&r99[i].hi>r.hi);});
});

test('original dragging, presets, external draw snapshots and source-only registration remain functional',async()=>{
 lab.go('dist');handle(lab.draw(),'k0').options.drag({x:25,y:62});near(lab.s.kp[0],.5);near(lab.s.kp.reduce((a,x)=>a+x,0),1);
 lab.go('std');const ct=M.mkChart(M.BOX_TOP,[-8,20,0,.43]);
 handle(lab.draw(),'sa').options.drag({x:ct.X(4),y:ct.Y(0)});near(lab.s.sa,4);
 lab.go('sym');const f=lab.draw(),h=handle(f,'hf');h.options.drag({x:11+25/40*86,y:h.point.y});near(lab.s.tm1,25);
 lab.go('pdf');const action=lab.scene.actions.find(p=>p.id==='norm');assert.ok(action);action.run(lab.s);near(lab.s.qh,.25);
 lab.go('mean');api.samples.mean(lab.s,7);const seed=lab.s.oseed;lab.params.on.onInput(lab.s);assert.equal(lab.s.omeans.length,0);assert.equal(lab.s.oseed,seed);
 const {compiled,initial}=select('dist','영배변환'),state=video.stateAt(compiled,12,initial),before=plain(lab.s.kp),nativeA=lab.s.ka;
 const external={...lab.s,...state.nums,...state.sets,lessonOn:true,lessonEntry:false,step:state.step},bars=[],path=lab.board.path;
 lab.board.path=function(ps,opts){if(opts.fill==='sky')bars.push(ps);return path.call(this,ps,opts);};
 try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board.path=path;}
 assert.equal(bars.length,1,'external prefixed a=0 affects the actual native drawing');near(lab.s.ka,nativeA);assert.deepEqual(plain(lab.s.kp),before);
 const standalone=await load({sourceOnly:true,forbidUnseeded:true});assert.deepEqual(plain(standalone.def.lessons),{});
 for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();standalone.newProblem();standalone.tab='problem';standalone.draw();}
 assert.equal(standalone.randomCalls(),0);
});
