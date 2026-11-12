import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/prob-counting-lesson-runtime.mjs';
const lab=await load(),video=lab.video;
const plain=x=>JSON.parse(JSON.stringify(x,(_,v)=>Object.prototype.toString.call(v)==='[object Set]'?{set:[...v]}:v));
const lessons=id=>video.lessonList(lab.def.lessons[id]),base=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const sig=f=>createHash('sha256').update(JSON.stringify({paths:f.paths,points:f.points,canvas:f.canvas})).digest('hex');
const manual=()=>plain(Object.fromEntries(Object.entries(lab.s).filter(([k])=>!k.startsWith('lpc')&&!['lessonOn','lessonEntry','step','part','revealed','playing','dragging'].includes(k))));
function apply(c,t,b,entry=false){const s=video.stateAt(c,t,b);Object.assign(lab.s,s.nums,s.sets,{lessonOn:!entry,lessonEntry:entry,step:s.step,part:s.part});lab.tab='review';return lab.draw();}

test('all five catalog scenes bind 34 valid source and concept buttons in the actual HTML',t=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),ctx);
 assert.equal(ctx.window.APLab.catalog.labs.find(x=>x.id==='prob-counting').sceneTotal,5);
 assert.deepEqual(Array.from(lab.list,x=>x.id),['combo','func','perm','gap','circ']);
 assert.deepEqual(Object.keys(lab.def.lessons).sort(),Array.from(lab.list,x=>x.id).sort());
 let count=0,originals=0,concepts=0;
 for(const sc of lab.list){
  assert.notEqual(sc,lab.api.scenes.find(x=>x.id===sc.id),'real shell uses copied scenes');
  assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]});
  for(const q of lessons(sc.id)){
   count++;const s=q.chapters[0].cues[0].set,c=video.compileLesson(q);s.lpcConcept?concepts++:originals++;
   if(!s.lpcConcept)assert.equal(s.lpcQuestion,lab.api.question(sc.id,s.lpcKind));
   assert.equal(c.length,60);assert.ok(Object.keys(c.tracks).every(k=>k.startsWith('lpc')));
   for(const ch of q.chapters)for(const cue of ch.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
  }
 }
 assert.equal(count,34);assert.equal(originals,19);assert.equal(concepts,15);assert.ok(lab.loaded.includes('../kit/apl-player.js'));assert.deepEqual(lab.missing,[]);
 const playerSource=fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8');
 assert.equal(playerSource.match(/DEFAULT_PLAYBACK_RATE\s*=\s*([0-9.]+)/)?.[1],'2');assert.ok(playerSource.includes('this.rate = DEFAULT_PLAYBACK_RATE'));
 t.diagnostic('5 scenes / 34 lessons = 19 actual generator types + 15 source exploration concepts; validator0/0');
});
test('every cue and motion boundary draws finite native geometry without changing manual state',t=>{
 let frames=0;
 for(const sc of lab.list)for(const q of lessons(sc.id)){
  lab.go(sc.id);lab.draw();const before=manual(),c=video.compileLesson(q),b=base(),times=new Set([0,.9,47.999,c.length]);
  c.chapters.forEach((ch,i)=>q.chapters[i].cues.forEach(cue=>{times.add(ch.at+cue.at);if(cue.to){times.add(ch.at+cue.at+cue.dur/2);times.add(ch.at+cue.at+cue.dur);}}));
  let first,moving;
  for(const t of [...times].sort((a,b)=>a-b)){
   const f=apply(c,t,b);frames++;assert.ok(f.canvas.some(x=>x.name==='lineTo'||x.name==='arc'),sc.id+'/'+q.label+' native geometry');
   assert.ok(f.points.length+f.circles.length+f.paths.length>0);assert.deepEqual(plain(f.value),{});assert.equal(f.handles.length,0);
   if(t===0)first=sig(f);if(t===.9)moving=sig(f);
   assert.deepEqual(manual(),before,sc.id+'/'+q.label+' preserves arrays, sets and controls');
   assert.equal(lab.s.lpcShowAnswer,t>=48&&!q.chapters[0].cues[0].set.lpcConcept);
  }
  assert.notEqual(first,moving,sc.id+'/'+q.label+' visible introductory motion');
  assert.equal(sig(apply(c,60,b,true)),first,'entry resets the source picture');
 }
 t.diagnostic(frames+' native Board/canvas cue states; browser/mobile/independent visual NOT_RUN');
});
test('answer labels remain closed until the final chapter and open with the actual answer',()=>{
 for(const sc of lab.list)for(const q of lessons(sc.id)){
  const initial=q.chapters[0].cues[0].set;if(initial.lpcConcept)continue;
  lab.go(sc.id);const c=video.compileLesson(q),b=base(),I=lab.api.packet(sc.id,initial.lpcKind);
  const result=new RegExp('(?:=\\s*|답\\s*|남은 해\\s*)'+I.ans+'(?![0-9])');
  for(const t of [0,24,36,47.999])assert.ok(!apply(c,t,b).texts.some(x=>result.test(x)),sc.id+'/'+initial.lpcKind+' hides the numerical answer');
  assert.ok(apply(c,48,b).texts.some(x=>result.test(x)),sc.id+'/'+initial.lpcKind+' final source result label');
 }
});
test('deterministic source banks preserve original first problems and the new-problem random stream',async()=>{
 const again=await load(),standalone=await load({sourceOnly:true});
 for(const sc of lab.list){
  assert.deepEqual(Array.from(lab.api.types(sc.id)),Array.from(again.api.types(sc.id)));
  const a=again.go(sc.id),b=standalone.go(sc.id),firstKind=lab.api.types(sc.id)[0];
  assert.deepEqual(plain(a.vary.cur()),plain(lab.api.packet(sc.id,firstKind)));
  for(const kind of lab.api.types(sc.id))assert.deepEqual(plain(lab.api.packet(sc.id,kind)),plain(again.api.packet(sc.id,kind)));
  for(let i=0;i<5;i++){
   const previous=a.vary.cur().key;again.newProblem();standalone.newProblem();
   assert.notEqual(a.vary.cur().key,previous);assert.deepEqual(plain(a.vary.cur()),plain(b.vary.cur()));
  }
 }
});
test('selected new problems, original controls and drag handles survive play/replay/exit',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);lab.draw();lab.newProblem();const picked=plain(sc.vary.cur()),text=sc.problem.text(lab.s),before=manual();
  const c=video.compileLesson(lessons(sc.id)[0]),b=base(),f=apply(c,0,b);apply(c,60,b);assert.equal(sig(apply(c,0,b)),sig(f));
  assert.deepEqual(plain(sc.vary.cur()),picked);assert.deepEqual(manual(),before);
  lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.tab='problem';lab.draw();assert.equal(sc.problem.text(lab.s),text);
 }
 lab.go('combo');lab.draw();const before=lab.s.dv.slice(),handle=lab.draw().handles.find(x=>x.id==='dv0');assert.ok(handle);
 handle.options.drag({x:handle.point.x+40,y:handle.point.y});assert.notDeepEqual(Array.from(lab.s.dv),Array.from(before));
});
test('actual Player settle/release restore original scenes after both stopping and completing',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);lab.draw();const saved=manual(),picked=plain(sc.vary.cur());
  for(const q of lessons(sc.id))for(const ended of [false,true]){
   const c=video.compileLesson(q),b=base(),time=ended?c.length:26,player=Object.create(lab.aplab.Player.prototype);
   Object.assign(player,{lab,cs:c,base:b,t:time,state:ended?'ended':'playing',_lessonOn:true,_pre:{step:0,part:null}});
   apply(c,time,b);player._settle();player._release();lab.draw();
   assert.equal(lab.tab,'explore');assert.equal(lab.s.lessonOn,undefined);assert.deepEqual(manual(),saved);assert.deepEqual(plain(sc.vary.cur()),picked);
  }
 }
});
test('external Player state draws its source packet without overwriting live values',()=>{
 lab.go('combo');lab.draw();const c=video.compileLesson(lessons('combo').find(q=>q.label==='상한배분')),b=base(),st=video.stateAt(c,60,b);
 const external={...lab.s,...st.nums,...st.sets,lessonOn:true,lessonEntry:false,step:st.step},before=plain(lab.s),seen=[],original=lab.board._text;
 lab.board._text=function(x,y,t,...args){seen.push(String(t));return original.call(this,x,y,t,...args);};
 try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board._text=original;}
 assert.ok(seen.some(x=>x==='남은 해 29개'));assert.deepEqual(plain(lab.s),before);
});
test('source-only fallback retains all original scenes, review steps and native diagrams',async()=>{
 const fallback=await load({sourceOnly:true});assert.deepEqual(plain(fallback.def.lessons),{});
 for(const sc of fallback.list){fallback.go(sc.id);assert.ok(fallback.draw().canvas.length);fallback.tab='review';fallback.s.step=3;assert.ok(fallback.draw().canvas.length);assert.equal(sc.steps(fallback.s,fallback).length,3);}
});
