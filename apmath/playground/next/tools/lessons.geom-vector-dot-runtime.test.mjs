// Actual page/deferred scripts, production Board and shell scene-copy boundary.
// Browser/mobile/independent visual audits are intentionally NOT_RUN here.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/vector-dot-lesson-runtime.mjs';
const lab=await load(),video=lab.video,plain=x=>JSON.parse(JSON.stringify(x));
const lessons=id=>video.lessonList(lab.def.lessons[id]),first=l=>l.chapters[0].cues[0].set;
const baseline=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const rawKeys=[...new Set(lab.list.flatMap(sc=>Object.keys(lab.api.initial(sc.id))))];
const manual=s=>Object.fromEntries(rawKeys.map(k=>[k,s[k]]));
const signature=f=>JSON.stringify({paths:f.paths,points:f.points,handles:f.handles.map(h=>[h.id,h.point]),circles:f.circles,texts:f.texts,canvas:f.canvas,focus:f.focus});
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<1e-7,`${msg}: ${a} ≈ ${b}`);
const eq=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<1e-7,P=(x,y)=>({x,y});
const pointPresent=(f,p)=>f.points.some(q=>eq(q.point,p));
function apply(cs,time,base,entry=false){const s=video.stateAt(cs,time,base);Object.assign(lab.s,s.nums,s.sets,{lessonOn:!entry,lessonEntry:entry,step:s.step,part:s.part});lab.tab='review';return lab.draw();}
function prepare(id,name){lab.go(id);const lesson=lessons(id).find(l=>l.label===name);assert.ok(lesson,`${id}/${name}`);return{lesson,cs:video.compileLesson(lesson),base:baseline()};}

test('seven real scenes bind 15 source goals and 21 inquiry concepts to the shared Player',t=>{
  const context={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),context);
  const cat=context.window.APLab.catalog.labs.find(x=>x.id==='geom-vector-dot'),ids=Array.from(lab.list,s=>s.id);
  assert.equal(ids.length,7);assert.equal(cat.sceneTotal,ids.length);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  for(const src of ['../kit/apl-video-core.js','../kit/apl-player.js','../kit/apl-toc.js','geom-vector-dot/lesson-core.js','geom-vector-dot/lesson-a.js','geom-vector-dot/lesson-b.js'])assert.ok(lab.loaded.includes(src));
  const goals={m1:['내적값'],m2:['성분내적','사잇각'],m3:['최댓값','최솟값'],m4:['최댓값','최솟값'],cmp5:['평행조건','수직조건','최소크기'],loc6:['직선거리','원점최대','원점최소'],prj7:['최대최소차','최대최소합']};
  let total=0,originals=0;
  for(const[i,id]of ids.entries()){
    assert.notEqual(lab.list[i],lab.def.scenes[i],'production shell copies the scene');assert.equal(lab.list[i].id,lab.def.scenes[i].id);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    for(const name of goals[id])assert.ok(lessons(id).some(l=>l.label===name&&!first(l).lvdConcept));
    for(const lesson of lessons(id)){
      total++;const init=first(lesson),cs=video.compileLesson(lesson);assert.ok(lesson.chapters.length>=5&&lesson.chapters.length<=6);assert.ok(cs.length>=60&&cs.length<=90);
      if(!init.lvdConcept){originals++;assert.equal(init.lvdQuestion,lab.api.question(id,init.lvdPacket));}
      assert.equal(init.lvdShowAnswer,false);assert.ok(cs.pins.length>=3);assert.ok(Object.keys(cs.tracks).every(k=>k.startsWith('lvd')));
      for(const key of Object.keys(cs.tracks))assert.ok(Number.isFinite(cs.start[key]));
      for(const text of [lesson.answer,init.lvdQuestion,...lesson.chapters.flatMap(ch=>ch.cues.map(c=>c.say||''))])for(const m of text.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true}),`${id}/${lesson.label}: ${m[1]}`);
    }
  }
  assert.equal(total,36);assert.equal(originals,15);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8'),/const DEFAULT_PLAYBACK_RATE = 2;/);
  t.diagnostic('7 scenes / 36 lessons: 15 source goals + 21 existing inquiry concepts; actual shell clones');
});

test('all cues and numerical transitions execute native vector geometry with finite canvas coordinates',t=>{
  let frames=0;
  for(const sc of lab.list)for(const lesson of lessons(sc.id)){
    lab.go(sc.id);const cs=video.compileLesson(lesson),base=baseline(),packet=lab.api.first(sc.id,first(lesson).lvdPacket),saved=plain(packet),times=new Set([0,.9,cs.length]);
    for(const[i,ch]of cs.chapters.entries())for(const cue of lesson.chapters[i].cues){times.add(ch.at+cue.at);if(cue.to)times.add(ch.at+cue.at+cue.dur/2);}
    for(const time of [...times].sort((a,b)=>a-b)){
      const f=apply(cs,time,base);frames++;assert.ok(f.canvas.some(o=>o.name==='lineTo'),`${sc.id}/${lesson.label}: native lines`);
      assert.ok(Object.values(f.focus).flat().every(Number.isFinite));assert.deepEqual(plain(f.value),{});
      assert.equal(lab.s.lvdShowAnswer,time>=cs.chapters.at(-1).at);assert.deepEqual(manual(lab.s),manual(base.nums),'isolated playback leaves raw controls intact');
      assert.equal(lab.scene.tick(lab.s,1,lab),false,'native autoplay cannot move a narrated frame');
    }
    assert.deepEqual(plain(packet),saved,'source packet is immutable during playback');
  }
  t.diagnostic(`${frames} actual Board/canvas frames; browser/mobile/independent visual review NOT_RUN`);
});

test('manual values, selected new packet, fit caches and pan/zoom survive all sibling lessons and replay',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);Object.assign(lab.s,{B1x:-2.5,B1y:1.5,A1x:5.5,A2x:2,A2y:4,B2x:-2,B2y:1,th34:315,r34:3.25,dk_ax:1,dk_ay:2,dk_bx:3,dk_by:1,dk_cx:2,dk_cy:-1,dk_k:.65,dk_mode:'perp',lc_Ax:-2,lc_Ay:2,lc_Bx:4,lc_By:1,lc_Px:1,lc_Py:-3,lc_f:4,pj_ux:3,pj_uy:-2,pj_t:-.5,pj_th:135,lens:'proj',pi:2});
    lab.tab='problem';lab.newProblem();lab.draw();const selected=sc.vary.cur(),n=sc.vary.n,question=sc.problem.text(lab.s,lab),chosen=manual(lab.s),params=plain(lab.params);
    lab.board.zoom=1.25;lab.board.panX=17;lab.board.panY=-9;lab.draw();const focus=plain(lab.board.focus),cache={__nq:lab.board.__nq,__ovk:lab.board.__ovk,__axes:lab.board.__axes};
    for(const lesson of lessons(sc.id)){
      const cs=video.compileLesson(lesson),base=baseline(),initial=signature(apply(cs,0,base));apply(cs,cs.length,base);
      assert.deepEqual(manual(lab.s),chosen);assert.equal(signature(apply(cs,0,base)),initial,`${sc.id}/${lesson.label}: replay initial frame`);
    }
    Object.assign(lab.s,{lessonOn:false,lessonEntry:false,step:0});lab.tab='problem';lab.draw();
    assert.deepEqual(manual(lab.s),chosen);assert.equal(sc.vary.cur(),selected);assert.equal(sc.vary.n,n);assert.equal(sc.problem.text(lab.s,lab),question);assert.deepEqual(plain(lab.params),params);
    assert.deepEqual(plain(lab.board.focus),focus);assert.equal(lab.board.zoom,1.25);assert.equal(lab.board.panX,17);assert.equal(lab.board.panY,-9);
    assert.deepEqual({__nq:lab.board.__nq,__ovk:lab.board.__ovk,__axes:lab.board.__axes},cache);
  }
});

test('stale final-to-entry restores the whole initial drawing snapshot without changing held state',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';lab.newProblem();lab.draw();const selected=manual(lab.s);
    for(const lesson of lessons(sc.id)){
      const cs=video.compileLesson(lesson),base=baseline(),initial=signature(apply(cs,0,base,true));
      apply(cs,cs.length,base);Object.assign(lab.s,{lessonOn:false,lessonEntry:true});const held=plain(lab.s);
      assert.equal(signature(lab.draw()),initial,`${sc.id}/${lesson.label}`);assert.deepEqual(plain(lab.s),held);assert.deepEqual(manual(lab.s),selected);
    }
  }
});

test('native numerical answer labels follow the last chapter and sibling answers remain hidden',()=>{
  for(const[id,name,pattern]of [['m2','사잇각',/^θ = 45°$/],['m3','반지름변화',/^최대 P_max \(27\.5\)$/],['cmp5','평행조건',/^a\+2b$/],['cmp5','수직조건',/^a−2b$/],['cmp5','최소크기',/^최소 \|u\| = 1$/],['loc6','직선거리',/^2$/],['loc6','원점최대',/^8$/],['loc6','원점최소',/^2$/],['prj7','최대최소차',/^M = 20$/],['prj7','최대최소합',/^m = −16$/]]){
    const{cs,base}=prepare(id,name),at=cs.chapters.at(-1).at;assert.ok(!apply(cs,at-.01,base).texts.some(s=>pattern.test(s)),`${id}/${name}: early answer`);
    const f=apply(cs,at,base);assert.ok(f.texts.some(s=>pattern.test(s)),`${id}/${name}: final label`);
  }
  const{cs,base}=prepare('m2','성분내적');assert.ok(!apply(cs,cs.length,base).texts.some(s=>/^θ\s*[≈=]/.test(s)),'component goal does not disclose its sibling angle');
  for(const id of ['m3','m4'])for(const name of ['최댓값','최솟값']){const{cs,base}=prepare(id,name);assert.ok(!apply(cs,cs.length,base).texts.some(s=>/^최대 P_max \(|^최소 P_min \(/.test(s)));}
});

test('all source figures keep the exact packet anchors, circles and extrema in the fitted viewport',()=>{
  for(const sc of lab.list)for(const lesson of lessons(sc.id).filter(l=>!first(l).lvdConcept)){
    const{cs,base}=prepare(sc.id,lesson.label),p=lab.api.first(sc.id,first(lesson).lvdPacket),f=apply(cs,cs.length,base),pts=[];
    if(sc.id==='m1')pts.push(P(0,0),P(p.a,0),P(p.xh,p.yb),P(p.xh,0));
    if(sc.id==='m2')pts.push(P(p.ax,p.ay),P(p.bx,p.by));
    if(sc.id==='m3'||sc.id==='m4'){
      const c=sc.id==='m3'?P(p.cx,p.cy):P(.6*p.d,.8*p.d),r=p.r;assert.ok(f.circles.some(q=>eq(q.center,c)&&Math.abs(q.radius-r)<1e-7));pts.push(c);
      if(sc.id==='m3')pts.push(P(p.ax,p.ay),P(c.x+p.r*p.ax/p.la,c.y+p.r*p.ay/p.la),P(c.x-p.r*p.ax/p.la,c.y-p.r*p.ay/p.la));
      else pts.push(P(-p.L,0),P(p.L,0),P(0,0),P(c.x+.6*p.r,c.y+.8*p.r),P(c.x-.6*p.r,c.y-.8*p.r));
    }
    if(sc.id==='cmp5'){
      pts.push(p.a,p.b);if(p.c)pts.push(p.c);
      const k=p.kind==='min'?-(p.a.x*p.b.x+p.a.y*p.b.y)/(p.b.x*p.b.x+p.b.y*p.b.y):p.k;pts.push(P(p.a.x+k*p.b.x,p.a.y+k*p.b.y));
    }
    if(sc.id==='loc6'){
      pts.push(p.A,p.B,p.M);assert.ok(f.circles.some(q=>eq(q.center,p.M)&&Math.abs(q.radius-p.R)<1e-7));
      if(p.kind==='dist'){const h=p.line[0]==='x'?P(p.line[1],p.M.y):P(p.M.x,p.line[1]);pts.push(h,P(p.M.x+(h.x-p.M.x)*p.R/p.dist,p.M.y+(h.y-p.M.y)*p.R/p.dist));}
      else{const scale=1+(p.kind==='omax'?1:-1)*p.R/p.OM;pts.push(P(p.M.x*scale,p.M.y*scale));}
    }
    if(sc.id==='prj7')pts.push(p.e.A,p.e.B,p.e.mx.p,p.e.mn.p);
    for(const p of pts){assert.ok(pointPresent(f,p),`${sc.id}/${lesson.label}: given/extreme point ${JSON.stringify(p)}`);const v=f.viewBox;assert.ok(p.x>=v.x0-1e-6&&p.x<=v.x1+1e-6&&p.y>=v.y0-1e-6&&p.y<=v.y1+1e-6,`${sc.id}/${lesson.label}: anchor in fitted view`);}
  }
});

test('authored numerical movements move the actual native handles and preserve original constraints',()=>{
  for(const[id,name,time,handle,expected]of [['m1','높이불변',18,'B1',P(3,1)],['m1','정사영부호',30,'B1',P(-2,4)],['m2','내적의부호',42,'B2',P(-3,1)],['m2','영벡터와각',42,'B2',P(0,0)],['m3','중심분해',42,'P34',P(2+2*Math.cos(7*Math.PI/6),1+2*Math.sin(7*Math.PI/6))],['m4','거리범위',42,'P34',P(.9,-1.3)],['cmp5','끝점의직선',30,'dkU',P(0,-.5)],['loc6','안팎의부호',42,'lcP',P(Math.sqrt(10),2)],['loc6','한점자취',18,'lcP',P(0,1)],['prj7','평행선탐구',42,'pjT',P(12/Math.sqrt(13),8/Math.sqrt(13))]]){
    const{cs,base}=prepare(id,name),initial=apply(cs,0,base),f=apply(cs,time,base),h=f.handles.find(h=>h.id===handle);assert.ok(h,`${id}/${name}: native handle`);near(h.point.x,expected.x);near(h.point.y,expected.y);assert.notEqual(signature(f),signature(initial));
  }
  for(const id of ['m3','m4'])for(const name of ['최댓값','최솟값']){
    const{cs,base}=prepare(id,name),f=apply(cs,cs.length,base),p=lab.api.first(id),sign=name==='최댓값'?1:-1;
    const c=id==='m3'?P(p.cx,p.cy):P(.6*p.d,.8*p.d),u=id==='m3'?P(p.ax/p.la,p.ay/p.la):P(.6,.8),target=P(c.x+sign*p.r*u.x,c.y+sign*p.r*u.y);
    assert.ok(f.points.some(q=>q.options.color==='amber'&&eq(q.point,target)),`${id}/${name}: moving P reaches the equality point`);
  }
  const{cs,base}=prepare('prj7','영벡터내적'),f=apply(cs,18,base);assert.ok(!f.handles.some(h=>h.id==='pjT'),'zero vector has no projection direction');
});

test('source-only loading preserves native dragging/new problems and repairs the zero-vector angle in canvas and tape',async()=>{
  const source=await load({sourceOnly:true});assert.equal(Object.keys(source.def.lessons).length,0);
  const dragCases={m1:['B1',P(-1.25,2.5),'B1x',-1.25],m2:['B2',P(-2,3),'B2x',-2],m3:['P34',P(2,3),'th34',90],m4:['P34',P(1,1.5),'th34',180],cmp5:['dkA',P(1,2),'dk_ax',1],loc6:['lcP',P(2,-1),'lc_Px',2],prj7:['pjU',P(0,0),'pj_ux',0]};
  for(const sc of source.list){
    source.go(sc.id);source.s.step=3;const f=source.draw(),[id,p,key,value]=dragCases[sc.id],h=f.handles.find(h=>h.id===id);assert.ok(h&&typeof h.options.drag==='function');h.options.drag(p);near(source.s[key],value);source.draw();
    source.tab='problem';const first=sc.vary.first(),saved=plain(first);for(let i=0;i<3;i++){const previous=sc.vary.cur(),n=sc.vary.n;source.newProblem();assert.notEqual(sc.vary.cur(),previous);assert.equal(sc.vary.n,n+1);source.draw();source.tab='review';source.s.step=3;source.draw();source.tab='problem';}assert.deepEqual(plain(first),saved);
  }
  source.go('m2');source.s.step=3;
  for(const values of [{A2x:4,A2y:2,B2x:0,B2y:0},{A2x:0,A2y:0,B2x:1,B2y:3}]){
    Object.assign(source.s,values);const f=source.draw();assert.ok(!f.texts.some(s=>/^θ\s*[≈=]|θ = 90°/.test(s)));assert.match(f.value.status.text,/정의되지/);assert.match(f.value.tape.title,/정의되지/);assert.doesNotMatch(f.value.tape.title,/cos θ|90\.0°/);
  }
  Object.assign(source.s,{A2x:4,A2y:2,B2x:-1,B2y:2});const right=source.draw();assert.ok(right.texts.includes('θ≈90.0°'));assert.match(right.value.tape.title,/θ = 90\.0°/);
});
