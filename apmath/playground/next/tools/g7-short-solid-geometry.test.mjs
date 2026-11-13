import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/solids-lesson-runtime.mjs';

const require=createRequire(import.meta.url),shorts=require('../kit/apl-g7-short-solid-geometry.js');
const PI=Math.PI,TAU=2*PI,DEG=PI/180;
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<=e*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:(a.z||0)-(b.z||0)});
const dot=(a,b)=>a.x*b.x+a.y*b.y+(a.z||0)*(b.z||0);
const norm=a=>Math.hypot(a.x,a.y,a.z||0);
const plain=v=>JSON.parse(JSON.stringify(v));
const plans=lab=>shorts.registry[`g7-solids/${lab.scene.id}`](lab,lab.s);
const plan=(lab,label)=>plans(lab).find(p=>p.legacyLabel===label);
const native=lab=>lab.scene.so.model(lab.s);
const question=lab=>lab.scene.so.prob(native(lab),lab.s);
const numeric=lab=>Number(question(lab).choices.find(q=>q.ok).p.match(/^[\d.]+/)?.[0]);
function capture(board,p,t){
  const out={paths:[],texts:[],textItems:[],circles:[]},old={path:board.path,_text:board._text,circle:board.circle};
  board.path=function(ps,options={}){out.paths.push({points:ps,options});return old.path.call(this,ps,options);};
  board._text=function(x,y,text,...rest){
    const value=String(text),o=rest[0]||{},height=(o.size||13)*this.fs*this._ts(),width=this.ctx.measureText(value).width;
    const left=o.align==='right'?x-width:o.align==='left'?x:x-width/2;
    out.texts.push(value);out.textItems.push({value,x,y,color:o.color,left:left-2,right:left+width+2,top:y-height/2-2,bottom:y+height/2+2});
    return old._text.call(this,x,y,text,...rest);
  };
  board.circle=function(center,r,options={}){out.circles.push({center,r,options});return old.circle.call(this,center,r,options);};
  try{board.begin();p.draw(board,t,p.model);board.end();return out;}finally{Object.assign(board,old);}
}
function separate(a,b,context){
  assert.ok(a&&b,`${context}: both labels exist`);
  assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,`${context}: ${a.value} and ${b.value} overlap at (${a.x},${a.y}) / (${b.x},${b.y})`);
}
function onCanvas(items,board,context){for(const x of items)assert.ok(x.left>=0&&x.right<=board.W&&x.top>=0&&x.bottom<=board.H,`${context}: ${x.value} leaves the canvas`);}
function shoelace(ps){return Math.abs(ps.reduce((sum,p,i)=>{const q=ps[(i+1)%ps.length];return sum+p.x*q.y-p.y*q.x;},0))/2;}
function derivative(fn,x,h=1e-5){const a=fn(x+h),b=fn(x-h);return{x:(a.x-b.x)/(2*h),y:(a.y-b.y)/(2*h),z:((a.z||0)-(b.z||0))/(2*h)};}
function curveLength(fn,a,b,n=1200){let old=fn(a),length=0;for(let i=1;i<=n;i++){const next=fn(a+(b-a)*i/n);length+=dist(old,next);old=next;}return length;}

test('all 22 production scenes and 48 exact legacy labels draw current-state shorts on the production Board',async()=>{
  const lab=await load();
  assert.deepEqual(Object.keys(shorts.registry).sort(),Array.from(lab.list,s=>`g7-solids/${s.id}`).sort());
  let count=0;
  for(const scene of lab.list){lab.go(scene.id);const before=JSON.stringify(lab.s),ps=plans(lab),raw=lab.def.lessons[scene.id],old=Array.isArray(raw)?raw:[raw];count+=ps.length;
    assert.deepEqual(ps.map(p=>p.legacyLabel).sort(),Array.from(old,p=>p.label||'').sort());
    assert.deepEqual(shorts.lessonInfo[`g7-solids/${scene.id}`],ps.map(p=>({legacyLabel:p.legacyLabel,duration:p.duration})));
    for(const p of ps){assert.ok(p.duration>0&&p.duration<=9.8);assert.ok(p.given&&p.motion&&p.model.m);assert.ok(p.stops.every(t=>t>0&&t<p.duration));assert.notDeepEqual(p.frame(0,p.model),p.frame(p.duration,p.model));
      for(const [w,h] of [[1000,650],[700,500],[390,440]]){lab.board.resize(w,h);const first=capture(lab.board,p,0);assert.ok(first.paths.length>0,`${p.id} has a source figure`);
        for(const t of new Set([1.3,3.6,5.8,7.8,p.duration,...p.stops]))capture(lab.board,p,t);
        assert.deepEqual(capture(lab.board,p,0).texts,first.texts,'seeking back removes later conclusions');
      }
    }
    assert.equal(JSON.stringify(lab.s),before,'playback preserves controls, question values, choices, seed and progress');
  }
  assert.equal(lab.list.length,22);assert.equal(count,48);
});

test('actual question rerolls and exploration controls remain separate and match native numeric answers',async()=>{
  const lab=await load();
  const numericLabels={'s1-1':'반지름','s1-2':'밑넓이','s1-3':'큰밑넓이','s1-4':'반지름','s2-6':'높이','s3-1':'옆넓이','s3-4':'겉넓이','s3-5':'옆넓이','s4-4':'최단 거리'};
  for(const [id,label] of Object.entries(numericLabels)){lab.go(id);for(let i=0;i<8;i++){lab.scene.so.reroll(lab.s);const saved=JSON.stringify(lab.s),p=plan(lab,label);near(p.model.answer,numeric(lab));capture(lab.board,p,7.8);assert.equal(JSON.stringify(lab.s),saved);}}
  lab.go('s1-1');Object.assign(lab.s,{soR:8,soH1:12,soPw:3,soPh:7,soAx:'h'});near(plan(lab,'만들기').model.r,8);near(plan(lab,'만들기').model.sol.h,12);near(plan(lab,'반지름').model.r,7);near(plan(lab,'높이').model.answer,3);assert.equal(plan(lab,'반지름').model.lay,true);
  lab.go('s1-2');Object.assign(lab.s,{soA:7,soB:4,soPa:2,soPb:9});const AB=plan(lab,'AB축').model,BC=plan(lab,'BC축').model;near(AB.r,7);near(AB.h,4);near(BC.r,4);near(BC.h,7);near(plan(lab,'밑넓이').model.answer,4);
  lab.go('s1-3');Object.assign(lab.s,{soRB:9,soRT:2,soH1:8,soPB:5,soPT:3,soPH:6});near(plan(lab,'만들기').model.r,9);near(plan(lab,'큰밑넓이').model.r,5);near(plan(lab,'큰밑넓이').model.rt,3);
  lab.go('s2-1');for(const r of [2,4,6]){Object.assign(lab.s,{soP1:2,soPR:r,soPH:8,soK2:'sphere',soSR:7});const p=plan(lab,'반지름');near(p.model.answer,numeric(lab));near(p.model.y,4);assert.equal(plan(lab,'크기 변화').model.sol.kind,'sphere');}
  for(const id of ['s2-2','s2-5']){lab.go(id);Object.assign(lab.s,{soPK:'frus',soSR:12,soSr:8,soSH:17});const p=plans(lab)[0];assert.equal(p.model.sol.kind,'frus');near(p.model.sol.d.R,3);near(p.model.sol.d.r,2);near(p.model.sol.h,6);}
});

test('generated shapes and shuffled choices bind to the actual stored problem without replacing its seed',async()=>{
  const lab=await load();lab.go('s1-5');
  for(const [kind,label,solid] of [['rect0','축에붙임','cyl'],['rect1','축에서떼기','hollow'],['tri','빗변축','dbl'],['leg','빗변축','cone']]){Object.assign(lab.s,{soC5:kind,soP5w:5,soK5:'rect',soW:9,soD:0});const p=plan(lab,label);assert.equal(p.model.sol.kind,solid);assert.equal(p.model.answer,question(lab).choices.find(q=>q.ok).p);if(kind==='leg')assert.match(p.label,/직각을 낀 변/);}
  const kindLabels={frus:'원뿔대',pencil:'원뿔붙임',dbl:'두원뿔',stairs:'두원뿔'};
  lab.go('s1-6');for(const [kind,label] of Object.entries(kindLabels))for(const seed of [2,37,201]){Object.assign(lab.s,{soK6:kind,soVR:5,soVr:2,soV1:7,soV2:3,soSeed:seed});const p=plan(lab,label);assert.equal(p.model.sol.kind,kind);assert.equal(p.model.answer,question(lab).choices.findIndex(c=>c.ok)+1);near(p.model.sol.rmax,5);assert.equal(lab.s.soSeed,seed);}
  lab.go('s1-7');for(const non of ['pyr','tri','cuboid'])for(const position of [0,2,4]){const list=['cyl','cone','sphere','frus'];list.splice(position,0,non);Object.assign(lab.s,{soP7:list,soSeed:position+83});const p=plan(lab,'직육면체');assert.deepEqual(plain(p.model.m.list),list);assert.equal(p.model.answer,position+1);assert.equal(p.model.answer,question(lab).choices.findIndex(c=>c.ok)+1);capture(lab.board,p,5.8);}
  lab.go('s4-1');for(const mode of ['rim','via','line'])for(const seed of [1,16,500]){Object.assign(lab.s,{soMode:mode,soSeed:seed});const old=JSON.stringify(lab.s),p=plans(lab)[0];assert.equal(p.model.answer,question(lab).choices.findIndex(c=>c.ok)+1);assert.equal(p.model.mode,native(lab).mode);capture(lab.board,p,3);capture(lab.board,p,8);assert.equal(JSON.stringify(lab.s),old);}
});

test('s1-6 comparison types never borrow a shuffled choice number from another question',async()=>{
  const lab=await load();lab.go('s1-6');
  const kinds={'원뿔대':'frus','원뿔붙임':'pencil','두원뿔':'dbl'},numbers=['①','②','③','④','⑤'];
  for(const currentKind of ['frus','pencil','dbl','stairs'])for(const seed of [2,37,201]){
    Object.assign(lab.s,{soK6:currentKind,soVR:5,soVr:2,soV1:7,soV2:3,soSeed:seed});
    const before=JSON.stringify(lab.s),Q=question(lab),answer=Q.choices.findIndex(c=>c.ok)+1;
    for(const p of plans(lab)){
      const expectedKind=p.legacyLabel==='두원뿔'&&currentKind==='stairs'?'stairs':kinds[p.legacyLabel],same=expectedKind===currentKind,final=p.frame(p.duration,p.model);
      assert.equal(p.model.sol.kind,expectedKind);near(p.model.sol.d.R,5);
      if(same){
        assert.equal(p.model.answer,answer);assert.deepEqual(plain(p.model.Q.choices),plain(Q.choices));
        assert.ok(final.formula.startsWith(numbers[answer-1]));assert.match(p.given,/현재 문제/);
      }else{
        assert.equal(p.model.Q,null);assert.equal(p.model.answer,null);
        assert.ok(!/[①②③④⑤]|현재 보기/.test(final.formula),'a comparison has no correspondence to the unchanged current choices');
        assert.match(p.given,/현재 탐구 치수의 비교/);assert.match(p.label,/비교/);
      }
    }
    assert.equal(JSON.stringify(lab.s),before,'the current type, dimensions, choices and seed remain unchanged');
  }
});

test('axial section areas equal independent polygon areas and two rotated copies double them',async()=>{
  const lab=await load();lab.go('s2-3');
  for(const R of [2,5,10])for(const h of [3,7,14])for(const kind of ['cyl','cone','frus']){const r=Math.max(1,Math.floor(R/2));Object.assign(lab.s,{soPK:kind,soPR:R,soPr2:r,soPH:h,soSR:3,soSr:1,soSH:5});const p=plans(lab).find(p=>p.model.sol.kind===kind),d=p.model,ps=shorts.axial(d.sol),area=shoelace(ps);near(area,d.answer);near(area,numeric(lab));
    const independent=kind==='cyl'?2*R*h:kind==='cone'?R*h:(R+r)*h;near(area,independent);
    if(kind!=='cyl'){const cx=(R+(kind==='frus'?r:0))/2,cy=h/2,rot=ps.map(p=>({x:2*cx-p.x,y:2*cy-p.y}));near(shoelace(rot),area);for(let i=1;i<ps.length;i++)near(dist(rot[i-1],rot[i]),dist(ps[i-1],ps[i]));near(area+shoelace(rot),2*independent);}
  }
  const S=lab.api.S3;
  for(const kind of ['cyl','cone','frus','dbl','sphere']){const sol=S.solid(kind,{R:5,r:2,h1:7,h2:3});for(const u of [.1,.3,.6,.9]){const y=sol.ymin+u*sol.h,r=shorts.radiusAt(sol,y),expected=kind==='sphere'?Math.sqrt(25-y*y):kind==='cyl'?5:kind==='cone'?5*(1-u):kind==='frus'?5-3*u:y<=7?5*y/7:5*(10-y)/3;near(r,expected);}}
});

test('section extraction is a rigid 3-D motion and its final projection has the true metric',async()=>{
  const lab=await load(),S=lab.api.S3,T=[{x:-4,y:0},{x:4,y:0},{x:2,y:7},{x:-2,y:7}];
  for(const yaw of [-70,-25,0,55])for(const pitch of [0,25,55]){const cam=S.camOf({soYaw:yaw,soPitch:pitch});
    for(const u of [0,.2,.5,.8,1]){const ps=T.map(p=>shorts.sectionPose(p,34*DEG,u,14,cam,3.5));for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++)near(dist(ps[i],ps[j]),dist(T[i],T[j]));
      if(u===1){const view=ps.map(p=>S.proj(cam,false,p));for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++)near(Math.hypot(view[i].x-view[j].x,view[i].y-view[j].y),dist(T[i],T[j]));}
      const ring=[0,.5,1.7,3.1,5].map(a=>shorts.circleSectionPose(4,a,3,u,14,cam));for(let i=0;i<ring.length;i++)for(let j=i+1;j<ring.length;j++)near(dist(ring[i],ring[j]),8*Math.abs(Math.sin(([0,.5,1.7,3.1,5][j]-[0,.5,1.7,3.1,5][i])/2)));
      if(u===1){const q=ring.map(p=>S.proj(cam,false,p));near(Math.hypot(q[0].x-q[2].x,q[0].y-q[2].y),dist(ring[0],ring[2]));}
    }
  }
});

test('cylinder and cone developments preserve the surface metric and every ring circumference at intermediate poses',()=>{
  for(const r of [1,3,8])for(const u of [0,.2,.6,1]){const p=s=>shorts.cylinderPoint(r,s,4,u),ds=derivative(p,r*1.3),dy=derivative(y=>shorts.cylinderPoint(r,r*1.3,y,u),4);near(norm(ds),1,1e-6);near(norm(dy),1);near(dot(ds,dy),0);near(curveLength(p,0,TAU*r),TAU*r,2e-6);if(u===1)near(dist(p(0),p(TAU*r)),TAU*r);}
  for(const [r,R] of [[1,6],[2,4],[4,5],[7,15]])for(const u of [0,.2,.6,1]){const s=.72*R,phi=.31*PI*r/R,ds=derivative(a=>shorts.conePoint(r,R,a,phi,u),s),dp=derivative(a=>shorts.conePoint(r,R,s,a,u),phi);near(norm(ds),1,1e-6);near(norm(dp),s,1e-6);near(dot(ds,dp),0,1e-6);
    for(const radius of [R,R*.35])near(curveLength(a=>shorts.conePoint(r,R,radius,a,u),-PI*r/R,PI*r/R),TAU*r*radius/R,2e-6);
    if(u===0)near(dist(shorts.conePoint(r,R,R,-PI*r/R,u),shorts.conePoint(r,R,R,PI*r/R,u)),0);
    if(u===1){const apex=shorts.conePoint(r,R,0,0,u),edge=shorts.conePoint(r,R,R,phi,u);near(dist(apex,edge),R);near(edge.z,0);}
  }
});

test('surface visibility distinguishes front and occluded back curves and virtual cone edges remain dashed',async()=>{
  const lab=await load(),S=lab.api.S3;lab.go('s3-2');
  const cam=S.camOf({soYaw:0,soPitch:0}),project=p=>S.proj(cam,false,p),r=3,R=9;
  const mesh=shorts.surfaceMesh((s,p)=>shorts.conePoint(r,R,s,p,0),0,R,-PI*r/R,PI*r/R),faces=mesh.faces.map(f=>f.map(project));
  const front=project(shorts.conePoint(r,R,R*.6,-PI*r/(2*R),0)),back=project(shorts.conePoint(r,R,R*.6,PI*r/(2*R),0));
  assert.equal(shorts.surfaceVisibility(faces,front),true);assert.equal(shorts.surfaceVisibility(faces,back),false);
  near(shorts.triangleDepth({x:.25,y:.25},{x:0,y:0,d:1},{x:1,y:0,d:2},{x:0,y:1,d:3}),1.75);
  assert.equal(shorts.triangleDepth({x:2,y:2},{x:0,y:0,d:1},{x:1,y:0,d:2},{x:0,y:1,d:3}),null);
  const draw=capture(lab.board,plan(lab,'전개도'),0);assert.ok(draw.paths.some(p=>p.options.dash?.length),'native 3-D solid retains hidden lines');
  lab.go('s3-5');const p=plan(lab,'전개도'),first=capture(lab.board,p,0),last=capture(lab.board,p,8);
  assert.ok(first.paths.some(p=>p.options.color==='muted'&&p.options.dash?.length),'removed cone extension is a dashed auxiliary');
  assert.ok(last.circles.some(q=>Math.abs(q.r-p.model.r1)<1e-8));assert.ok(last.circles.some(q=>Math.abs(q.r-p.model.r2)<1e-8));
});

test('current cone angle, slant, ratio and pi-area questions keep exact values and defer unknown conclusions',async()=>{
  const lab=await load();lab.go('s3-2');
  for(const q of [[2,6],[3,8],[4,9]])for(const type of ['x','R']){Object.assign(lab.s,{soQ:q,soQv:type,soNr:5,soNR:15});const p=plan(lab,type==='R'?'모선 길이':'중심각');near(p.model.answer,numeric(lab));near(p.model.r,q[0]);near(p.model.R,q[1]);const first=capture(lab.board,p,0);if(type==='R'){assert.ok(first.texts.includes('R=?'));assert.ok(!first.texts.includes(`R=${q[1]} cm`));}assert.equal(p.frame(0,p.model).formula,'');assert.ok(p.frame(9.6,p.model).formula.includes(String(p.model.answer)));}
  lab.go('s3-3');for(const k of [2,3,4,5,6])for(const r of [1,2,3]){Object.assign(lab.s,{soQk:k,soQr:r,soQv:'ratio'});const p=plan(lab,'반지름비'),q=question(lab).choices.find(c=>c.ok).p;assert.equal(p.model.answer,Number(q.split(':')[1]));assert.match(p.given,new RegExp(`r=${r} cm`));
    for(const t of [0,5.8,7.5]){const texts=capture(lab.board,p,t).texts;assert.ok(!texts.includes(`R=${r*k} cm`),'unknown R is not a given');assert.ok(!p.frame(t,p.model).formula.includes(`1:${k}`));}
    assert.match(p.frame(9.6,p.model).formula,new RegExp(`1:${k}`));
  }
  assert.equal(shorts.fraction(1,3),'1/3');assert.equal(shorts.fraction(45,8),'45/8');assert.equal(shorts.fraction(2.4),'12/5');
  lab.go('s3-5');for(const [k,r1,r2] of [[2,1,3],[3,2,5],[5,3,4]]){Object.assign(lab.s,{soQk:k,soQ1:r1,soQ2:r2});const p=plan(lab,'옆넓이');near(p.model.answer,numeric(lab));const area=(p.model.x/360)*(p.model.R2**2-p.model.R1**2);near(p.model.answer,area);assert.match(p.frame(9.6,p.model).formula,/\\pi/);assert.match(p.frame(9.6,p.model).formula,/cm\}\^2/);}
});

test('same-string mapping preserves lengths and all native shortest-path questions give the independent chord',async()=>{
  const lab=await load();
  for(const id of ['s4-2','s4-3']){lab.go(id);for(const angle of [60,180])for(const r of [1,3,4])for(const position of [1,3,6]){Object.assign(lab.s,{soQa:angle,soQr:r,soQp:position,soTr:7,soTp:9});const p=plan(lab,angle===60?'육십 도':'백팔십 도'),d=p.model,a=shorts.sectorPoint(d.p,-d.x*DEG/2),z=shorts.sectorPoint(d.p,d.x*DEG/2),chord=dist(a,z);near(chord,d.answer);near(d.answer,numeric(lab));
    near(dist(shorts.pathPoint(d,a,0),shorts.pathPoint(d,z,0)),0);near(dist(shorts.pathPoint(d,a,0),{x:d.r*d.p/d.R,y:d.h*(1-d.p/d.R),z:0}),0);near(dist(shorts.pathPoint(d,a,1),shorts.pathPoint(d,z,1)),chord);
    for(const u of [0,.3,.7,1]){const length=curveLength(v=>shorts.pathPoint(d,{x:a.x+(z.x-a.x)*v,y:a.y+(z.y-a.y)*v},u),0,1);near(length,chord,3e-5);}
    if(angle===180)assert.match(p.given,/꼭짓점 O/);
    if(id==='s4-3')near(d.p,Math.min(position,d.R));
  }}
  lab.go('s4-1');for(const [r,R] of [[1,6],[2,5],[3,6],[4,12]]){Object.assign(lab.s,{soTr:r,soTR:R});const d=plans(lab)[0].model,a=shorts.sectorPoint(d.R,-d.x*DEG/2),z=shorts.sectorPoint(d.R,d.x*DEG/2),M=d.M,foot=shorts.closestOnSegment(M,a,z);assert.ok(dist(a,M)+dist(M,z)>=dist(a,z)-1e-8);near(dist(a,foot)+dist(foot,z),dist(a,z));near(d.r,native(lab).r);near(d.R,native(lab).R);near(dist(a,z),native(lab).chord);}
});

test('every allowed frustum chord stays outside the removed cap and the active problem uses its own dimensions',async()=>{
  const lab=await load();lab.go('s4-4');
  for(let r2=2;r2<=7;r2++)for(let r1=1;r1<r2;r1++){Object.assign(lab.s,{soQg:r2,soQf:r1,soTg:7,soTf:6});const p=plans(lab)[0],d=p.model,A=shorts.sectorPoint(d.R2,-PI/6),B=shorts.sectorPoint(d.R2,PI/6);near(d.r2,r2);near(d.r1,r1);near(dist(A,B),d.answer);near(d.answer,numeric(lab));
    const foot=shorts.closestOnSegment({x:0,y:0},A,B),distanceFromApex=Math.hypot(foot.x,foot.y);assert.ok(distanceFromApex>d.R1);near(d.clearance,distanceFromApex-d.R1);
    for(const u of [0,.25,.5,.75,1]){const q={x:A.x+(B.x-A.x)*u,y:A.y+(B.y-A.y)*u};assert.ok(Math.hypot(q.x,q.y)>=d.R1);assert.ok(Math.hypot(q.x,q.y)<=d.R2+1e-7);}
    capture(lab.board,p,0);capture(lab.board,p,7.8);
  }
});

// These checks use production Board coordinates and padded text extents. The
// canvas shim measures glyph width deterministically; new browser screenshots
// remain necessary to approve actual font/layout appearance after the fix.
const visualSizes=[[390,581],[820,880],[1023,581],[1439,713]];
test('visual regression: removed-cap descriptions clear the central angle and small slant length',async()=>{
  const lab=await load();
  for(const id of ['s3-5','s4-4']){
    lab.go(id);
    for(const [k,r1,r2] of [[3,2,4],[2,1,3],[5,3,5]]){
      Object.assign(lab.s,{soFk:k,soF1:r1,soF2:r2,soQk:k,soQ1:r1,soQ2:r2,soQg:r2,soQf:r1});
      const saved=JSON.stringify(lab.s);
      for(const p of plans(lab))for(const [w,h] of visualSizes)for(const t of [6.2,7.1,9.6]){
        lab.board.resize(w,h);const items=capture(lab.board,p,t).textItems,description=items.find(x=>x.value==='잘라 낸 부분');
        const angle=items.find(x=>/°$/.test(x.value)),slant=items.find(x=>x.value.startsWith('R₁='));
        separate(description,angle,`${id}/${p.legacyLabel}/${w}/${t}`);separate(description,slant,`${id}/${p.legacyLabel}/${w}/${t}`);
        onCanvas([description,angle,slant],lab.board,id);
      }
      assert.equal(JSON.stringify(lab.s),saved,'labels do not change the current question or exploration dimensions');
    }
  }
});

test('visual regression: starting point A stays outside its given base-radius label',async()=>{
  const lab=await load();
  for(const id of ['s4-1','s4-2','s4-4']){
    lab.go(id);
    for(const r of [1,2,4]){
      Object.assign(lab.s,{soTr:r,soTR:6*r,soQa:60,soQr:r,soQg:r+1,soQf:1});
      const saved=JSON.stringify(lab.s);
      for(const p of plans(lab))for(const [w,h] of visualSizes)for(const t of [0,.6,1.19]){
        lab.board.resize(w,h);const items=capture(lab.board,p,t).textItems,A=items.find(x=>x.value==='A'),radius=items.find(x=>/^r(?:₂)?=/.test(x.value));
        separate(A,radius,`${id}/${p.legacyLabel}/${w}/${t}`);onCanvas([A,radius],lab.board,id);
      }
      assert.equal(JSON.stringify(lab.s),saved);
    }
  }
});

test('visual regression: the frustum top-radius value clears its rotation-axis label',async()=>{
  const lab=await load();lab.go('s2-3');
  for(const active of [false,true])for(const [R,r,h,pitch] of [[3,2,6,25],[2,1,8,6],[5,4,3,80],[15,14,20,25]]){
    Object.assign(lab.s,{soPK:active?'frus':'cyl',soSR:R,soSr:r,soSH:h,soPR:R,soPr2:r,soPH:h,soPitch:pitch});
    const saved=JSON.stringify(lab.s),p=plan(lab,'원뿔대');
    for(const [w,height] of visualSizes)for(const t of [0,4,7.1,9.6]){
      lab.board.resize(w,height);const items=capture(lab.board,p,t).textItems,axis=items.find(x=>x.value==='회전축 l'),radius=items.find(x=>x.value===`${r} cm`&&x.color==='sky');
      separate(axis,radius,`s2-3/${active}/${R}/${r}/${pitch}/${w}/${t}`);onCanvas([axis,radius],lab.board,'s2-3');
    }
    assert.equal(JSON.stringify(lab.s),saved);
  }
});
