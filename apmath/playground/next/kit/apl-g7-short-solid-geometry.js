/* G7 solids of revolution: current native geometry, exact arc-length development,
 * rigid section transport and a string carried on its actual conical surface.
 * This module is independent of the surface/volume reference shorts. */
(function(root,factory){
  'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(!root?.APLab)return;
  root.APLab.G7ShortSolidGeometry=api;Object.assign(root.APLab.G7Shorts=root.APLab.G7Shorts||{},api.registry);Object.assign(root.APLab.G7ShortInfo=root.APLab.G7ShortInfo||{},api.lessonInfo);
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const PI=Math.PI,TAU=2*PI,RAD=PI/180,V=(x,y,z=0)=>({x,y,z}),O=V(0,0),clamp=x=>Math.max(0,Math.min(1,x));
  const add=(a,b)=>V(a.x+b.x,a.y+b.y,(a.z||0)+(b.z||0)),sub=(a,b)=>V(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0)),mul=(a,k)=>V(a.x*k,a.y*k,(a.z||0)*k),mix=(a,b,u)=>add(a,mul(sub(b,a),u));
  const dot=(a,b)=>a.x*b.x+a.y*b.y+(a.z||0)*(b.z||0),length=a=>Math.hypot(a.x,a.y,a.z||0),distance=(a,b)=>length(sub(a,b)),mid=(a,b)=>mix(a,b,.5);
  const cross=(a,b)=>V(a.y*(b.z||0)-(a.z||0)*b.y,(a.z||0)*b.x-a.x*(b.z||0),a.x*b.y-a.y*b.x);
  const phase=(t,a,z)=>{const u=clamp((t-a)/(z-a));return u*u*(3-2*u);};
  const clone=s=>JSON.parse(JSON.stringify(s));
  const rotateX=(p,a)=>V(p.x,p.y*Math.cos(a)-(p.z||0)*Math.sin(a),p.y*Math.sin(a)+(p.z||0)*Math.cos(a));
  const rotateY=(p,a)=>V(p.x*Math.cos(a)+(p.z||0)*Math.sin(a),p.y,-p.x*Math.sin(a)+(p.z||0)*Math.cos(a));
  const polar=(r,a,y=0)=>V(r*Math.cos(a),y,r*Math.sin(a));
  const polar2=(r,a,c=O)=>V(c.x+r*Math.cos(a),c.y+r*Math.sin(a));
  const near=(a,b)=>Math.abs(a-b)<1e-8;
  function fraction(n,d=1){if(!Number.isFinite(n)||!Number.isFinite(d)||!d)throw Error('Invalid solid quantity');const q=n/d;if(near(q,Math.round(q)))return String(Math.round(q));for(let den=2;den<=1000;den++)if(near(q*den,Math.round(q*den)))return`${Math.round(q*den)}/${den}`;return`≈${Math.round(q*100)/100}`;}
  const tex=n=>{const s=fraction(n);return s.includes('/')?`\\frac{${s.split('/')[0]}}{${s.split('/')[1]}}`:s.startsWith('≈')?`\\approx ${s.slice(1)}`:s;};
  const pi=n=>near(n,1)?'π':`${fraction(n)}π`,piTex=n=>near(n,1)?'\\pi':`${tex(n)}\\pi`,cm=n=>`${fraction(n)} cm`;
  const F=(label,formula='')=>({label,formula}),NUM=['①','②','③','④','⑤'];
  const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const line=(b,a,z,color='ink',width=2.7,o={})=>b.path([a,z],{color,width,...o});
  const text=(b,p,s,color='ink',o={})=>b.text(p,s,{color,size:b.W<560?13:16,align:'center',baseline:'middle',weight:750,...o});
  const point=(b,p,s='',color='ink',o={})=>{b.point(p,{color,r:4});if(s)text(b,p,s,color,{dy:17,...o});};
  const poly=(b,ps,color='amber',alpha=.13,o={})=>b.path(ps,{close:true,color,fill:color,fillAlpha:alpha,width:2.5,...o});
  function setup(b,ps,pad=.14){const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),span=Math.max(x1-x0,y1-y0,1),m=span*pad;b.kind='cartesian';b.aspect='1:1';b.zoom=1;b.panX=0;b.panY=0;b.setPanes(null);b.setInsets({top:45,right:35,bottom:78,left:35});b.setFocus({x:[x0-m,x1+m],y:[y0-m,y1+m]},false);}
  function solidPoints(d,sol,project){const ps=[];for(const [r,y] of sol.poly)for(let i=0;i<48;i++)ps.push(project(polar(r,TAU*i/48,y)));return ps;}
  function camera(d,extra={}){return{...d.s,soLay:false,...extra};}
  function stage3(b,d,sol,extra=[],options={}){const D=d.S3.ctx(b,camera(d,options.camera),{lay:options.lay||false}),ps=solidPoints(d,sol,D.P);ps.push(D.P(V(0,sol.ymin-.5)),D.P(V(0,sol.ymax+.7)),...extra);setup(b,ps);return D;}
  function dim3(D,a,z,label,color='amber',offset={}){D.line(a,z,color,2.6);D.lab(mid(a,z),label,color,{dy:21,...offset});}
  function profileDims(D,d){const s=d.sol;if(s.sphere){dim3(D,V(0,-d.r),V(0,d.r),d.diameter?cm(2*d.r):`지름 ${cm(2*d.r)}`,'rose',{dx:-38,dy:0});if(!d.diameter)dim3(D,O,V(d.r,0),cm(d.r),'amber');return;}
    if(d.hypotenuse){const ps=s.poly.map(([r,y])=>V(r,y));dim3(D,ps[0],ps[1],cm(3*d.k),'amber',{dx:25,dy:12});dim3(D,ps[1],ps[2],cm(4*d.k),'amber',{dx:25,dy:-12});dim3(D,ps[0],ps[2],cm(5*d.k),'rose',{dx:-27,dy:0});return;}
    const bottom=s.bands[0],top=s.bands.at(-1),gap=s.hole||0;
    dim3(D,V(gap,bottom.y0),V(bottom.r0,bottom.y0),cm(bottom.r0-gap),'amber');
    if(gap)dim3(D,O,V(gap,0),`간격 ${cm(gap)}`,'rose',{dy:43});
    if(top.r1>0&&!near(top.r1,bottom.r0))dim3(D,V(0,top.y1),V(top.r1,top.y1),cm(top.r1),'amber',{dy:-20});
    dim3(D,V(bottom.r0,0),V(bottom.r0,s.ymax),cm(s.h),'amber',{dx:31,dy:0});
  }
  function revolutionDraw(b,t,d){
    const S=d.S3,sol=d.sol,D=stage3(b,d,sol,[],{lay:d.lay}),turn=TAU*phase(t,1.2,5.8);
    if(d.whole){if(turn>=PI)S.drawSolid(D,sol);else{S.drawFan(D,sol.poly,turn);S.drawFan(D,sol.poly.map(([r,y])=>[-r,y]),turn);}}
    else S.drawRevolve(D,sol,turn);
    const profiles=d.whole?[sol.poly,sol.poly.map(([r,y])=>[-r,y])]:[sol.poly];
    profiles.forEach(ps=>D.poly3(ps.map(([r,y])=>polar(r,turn,y)),{close:true,fill:'amber',fillAlpha:.16,color:'amber',width:3}));
    S.drawAxis(D,sol.ymin,sol.ymax,{label:'회전축 l'});profileDims(D,d);
    if(t>=5.8){const r=d.r||sol.rmax,y=sol.kind==='dbl'?sol.d.h1:sol.sphere?0:sol.ymin;D.line(V(0,y),V(r,y),'green',4);if(t>=7.5&&d.goal==='radius')D.lab(V(r/2,y),`r=${cm(r)}`,'green',{dy:42});}
    if(t>=6.2&&d.goal==='area'){const radius=d.r,pts=Array.from({length:73},(_,i)=>D.P(polar(radius,TAU*i/72,sol.ymin)));poly(b,pts,'green',.2,{dash:[5,4]});}
    if(t>=7.5&&d.goal==='height')D.lab(V(0,(sol.ymin+sol.ymax)/2),`h=${cm(sol.h)}`,'green',{dx:-35,dy:0});
  }
  const recipes={};
  function reg(id,label,motion,bind,draw,frame,given){(recipes[id]||=[]).push({label,motion,bind,draw,frame,given,duration:9.6});}
  const source=(d,updates={})=>d.D.model({...clone(d.s),...updates,lessonOn:false,lessonEntry:false});
  const question=(d,m=d.m)=>d.D.prob(m,d.s);
  const correct=Q=>Q.choices.findIndex(c=>c.ok);
  function revolveFrame(t,d){if(t<1.2)return F('회전축 위의 변과 축에서 떨어진 점의 거리를 확인합니다.');if(t<5.8)return F(d.whole?'원의 양쪽 반이 같은 공간을 지나며 한 입체를 채웁니다.':'같은 평면도형이 축을 중심으로 돌아 자취를 만듭니다.');if(t<7.5)return F(d.hypotenuse?'축의 양 끝은 고정되고, 나머지 꼭짓점이 가운데 원을 만듭니다.':d.sol.hole?'축 가까운 빈 공간은 회전하는 도형이 지나가지 않습니다.':d.goal==='height'?'축 위의 선분은 회전해도 두 끝의 높이가 그대로입니다.':'축에 수직인 선분은 원의 중심과 테두리를 잇습니다.');return F(d.goal==='area'?'밑면은 방금 확인한 반지름을 가진 원입니다.':d.goal==='height'?'축과 나란한 변이 높이가 됩니다.':d.goal==='radius'?'축에서 테두리까지의 거리가 반지름입니다.':d.whole?'지름을 축으로 돌린 원도 같은 하나의 구를 만듭니다.':'평면도형이 지나간 공간이 이 회전체입니다.',d.goal==='area'?`$S=\\pi\\times${tex(d.r)}^2=${piTex(d.r*d.r)}\\text{ cm}^2$`:d.goal==='radius'?`$r=${tex(d.r)}\\text{ cm}$`:d.goal==='height'?`$h=${tex(d.sol.h)}\\text{ cm}$`:d.sol.name);}

  for(const [goal,label] of [['make','만들기'],['radius','반지름'],['height','높이']])reg('s1-1',label,'rectangle-orbit-with-fixed-axis-and-radius',d=>{const practice=goal!=='make',r=practice?d.m.r2:d.m.R,h=practice?d.m.h2:d.m.h;return{...d,goal,r,h,practice,lay:practice&&d.m.ax==='h',sol:d.S3.solid('cyl',{R:r,h1:h}),answer:goal==='radius'?r:goal==='height'?h:'원기둥'};},revolutionDraw,revolveFrame,d=>`${d.practice?'현재 문제':'현재 탐구'} 직사각형 · 축에 수직인 변 ${cm(d.r)}, 축 위의 변 ${cm(d.h)}${d.lay?' · 가로 회전축':''}`);
  for(const [axis,label] of [['AB','AB축'],['BC','BC축'],['area','밑넓이']])reg('s1-2',label,'right-triangle-rotates-around-the-selected-given-leg',d=>{const practice=axis==='area',m=practice?d.m:source(d,{soAxis:axis}),r=practice?m.pa:m.r,h=practice?m.pb:m.h;return{...d,m,r,h,goal:practice?'area':'make',lay:practice&&m.pax==='h',sol:d.S3.solid('cone',{R:r,h1:h}),answer:practice?r*r:'원뿔'};},revolutionDraw,revolveFrame,d=>`${axis==='area'?'현재 문제':'현재 탐구 '+axis+' 회전축'} · 직각삼각형의 축 위 변 ${cm(d.h)}, 수직인 변 ${cm(d.r)}${axis==='area'?' · 밑면의 넓이':''}`);
  for(const area of [false,true])reg('s1-3',area?'큰밑넓이':'만들기','trapezoid-orbits-two-different-radius-circles',d=>{const r=area?d.m.pb:d.m.R,rt=area?d.m.pt:d.m.r,h=area?d.m.ph:d.m.h;return{...d,r,rt,h,goal:area?'area':'make',lay:area&&d.m.pax==='h',sol:d.S3.solid('frus',{R:r,r:rt,h1:h}),answer:area?r*r:'원뿔대'};},revolutionDraw,revolveFrame,d=>`${area?'현재 문제':'현재 탐구'} 사다리꼴 · 축에 수직인 두 변 ${cm(d.r)}, ${cm(d.rt)} · 높이 ${cm(d.h)}`);
  for(const [goal,label] of [['make','반원회전'],['radius','반지름'],['whole','원전체']])reg('s1-4',label,'semicircle-or-full-circle-orbit-around-its-diameter',d=>{const r=goal==='radius'?d.m.pR:d.m.R;return{...d,r,goal,whole:goal==='whole',diameter:goal==='radius',lay:goal==='radius'&&d.m.pax==='h',sol:d.S3.solid('sphere',{R:r}),answer:r};},revolutionDraw,revolveFrame,d=>`${goal==='radius'?'현재 문제':'현재 탐구'} ${goal==='whole'?'원 전체':'반원'} · 지름 ${cm(2*d.r)}를 회전축으로 1회전`);
  for(const [mode,label] of [['attached','축에붙임'],['detached','축에서떼기'],['hypotenuse','빗변축']])reg('s1-5',label,'axis-distance-controls-empty-core-or-two-cone-apices',d=>{
    const Q=question(d),active=mode==='attached'?d.m.c5==='rect0':mode==='detached'?d.m.c5==='rect1':['tri','leg'].includes(d.m.c5);
    let m=source(d,mode==='hypotenuse'?{soK5:'tri'}:{soK5:'rect',...(mode==='attached'?{soD:0}:{})}),sol=m.sol,k=m.k||1,hypotenuse=mode==='hypotenuse';
    if(active){if(d.m.c5==='rect0')sol=d.S3.solid('cyl',{R:d.m.pw,h1:4});else if(d.m.c5==='rect1')sol=d.S3.solid('hollow',{w:d.m.pw,g:2,h1:4});else if(d.m.c5==='tri'){sol=d.S3.solid('dbl',{R:2.4,h1:1.8,h2:3.2});k=1;}else{sol=d.S3.solid('cone',{R:3,h1:4});hypotenuse=false;}}
    return{...d,m,sol,k,hypotenuse,goal:'make',r:sol.rmax,active,Q,answer:sol.name,display:active&&d.m.c5==='leg'?'현재 문제 · 직각을 낀 변이 축':label};
  },revolutionDraw,revolveFrame,d=>`${d.active?'현재 문제':'현재 탐구 치수의 비교'} · ${d.hypotenuse?`직각삼각형 ${cm(3*d.k)}, ${cm(4*d.k)}, ${cm(5*d.k)}의 빗변이 축`:d.sol.hole?`직사각형 너비 ${cm(d.sol.d.w)}, 높이 ${cm(d.sol.h)} · 축까지 ${cm(d.sol.hole)}`:d.sol.kind==='cone'?'직각삼각형의 직각을 낀 변이 축':`직사각형 너비 ${cm(d.sol.rmax)}, 높이 ${cm(d.sol.h)} · 축에 붙음`}`);

  const profileName={cyl:'직사각형',cone:'직각삼각형',frus:'직각이 두 개인 사다리꼴',pencil:'직사각형과 직각삼각형',dbl:'축에 두 꼭짓점이 놓인 삼각형',stairs:'직사각형 두 개',sphere:'반원'};
  function inverseDraw(b,t,d){const S=d.S3,sol=d.sol,D=stage3(b,d,sol),u=phase(t,3.2,6.6),poly3=sol.poly.map(([r,y])=>polar(r,TAU*u,y));
    if(!d.sectionGiven||t>=3.2)S.drawSolid(D,sol,{fillAlpha:t<3.2?.13:.045,color:t>=3.2?'muted':'sky'});
    const right=sol.poly.map(([r,y])=>V(r,y)),left=sol.poly.map(([r,y])=>V(-r,y));
    if(t>=1||d.sectionGiven){D.poly3([...right,...left.reverse()],{close:true,color:'rose',fill:'rose',fillAlpha:.09,width:2,dash:t<3.2?[5,4]:undefined});}
    if(t>=2.4){D.poly3(right,{close:true,color:'amber',fill:'amber',fillAlpha:.2,width:3});if(t>=3.2)S.drawRevolve(D,sol,TAU*u,{fillAlpha:.08});D.poly3(poly3,{close:true,color:'amber',fill:'amber',fillAlpha:.12,width:2.5});}
    S.drawAxis(D,sol.ymin,sol.ymax,{label:'회전축 l'});
    if(t>=7.4)text(b,D.P(V(sol.rmax,sol.ymin)),profileName[sol.kind],'green',{dy:33,size:13});
  }
  for(const [kind,label] of [['frus','원뿔대'],['pencil','원뿔붙임'],['dbl','두원뿔']])reg('s1-6',label,'axial-cut-half-profile-and-physical-revolution-check',d=>{
    const actual=kind==='dbl'&&d.m.kind==='stairs'?'stairs':kind,currentQuestion=actual===d.m.kind,m=currentQuestion?d.m:source(d,{soK6:actual});
    // A comparison type has its own shape, but the visible question keeps its
    // original choices. Only that actual question may supply a choice number.
    const Q=currentQuestion?question(d):null;
    return{...d,m,sol:m.sol,Q,currentQuestion,answer:Q?correct(Q)+1:null,display:actual==='stairs'?'현재 계단 모양 회전체':currentQuestion?label:label+' 비교'};
  },inverseDraw,(t,d)=>t<1?F('현재 회전체의 바깥 경계와 높이가 꺾이는 지점을 확인합니다.'):t<3.2?F('축을 포함하는 평면으로 자른 뒤 축의 한쪽만 남깁니다.'):t<6.6?F('남긴 한쪽 도형을 같은 축 주위로 돌려 원래 입체와 맞춥니다.'):t<7.4?F('반지름이 변하는 높이까지 원래 입체와 같아야 합니다.'):F(`한쪽 평면도형은 ${profileName[d.sol.kind]}입니다.`,d.currentQuestion?`${NUM[d.answer-1]} · 현재 보기의 한쪽 평면도형`:`축 한쪽의 ${profileName[d.sol.kind]}`),d=>`${d.currentQuestion?'현재 문제':'현재 탐구 치수의 비교'} ${d.sol.name} · 큰 반지름 ${cm(d.sol.rmax)}, 전체 높이 ${cm(d.sol.h)} · 축 한쪽 도형 찾기`);
  const standard={cyl:{R:1.5,h1:3},cone:{R:1.6,h1:3},sphere:{R:1.6},frus:{R:1.8,r:.9,h1:3}};
  reg('s1-7','원기둥','invariant-circular-cross-section-under-any-axial-rotation',d=>{const kind=standard[d.m.k]?d.m.k:'cyl';return{...d,kind,sol:d.S3.solid(kind,standard[kind]),answer:true,display:standard[d.m.k]?d.m.name:'원기둥'};},(b,t,d)=>{
    const D=stage3(b,d,d.sol),a=d.m.rot+TAU*phase(t,1.3,6.4);d.S3.drawSolid(D,d.sol);d.S3.drawAxis(D,d.sol.ymin,d.sol.ymax,{label:'회전축 l'});const y=d.sol.sphere?0:d.sol.ymin,r=d.sol.rmax,p=polar(r,a,y);D.line(V(0,y),p,'amber',3);point(b,D.P(p),'P','amber');
  },(t,d)=>t<1.3?F('현재 회전체와 회전축에서 테두리까지의 거리를 확인합니다.'):t<6.4?F('점을 제자리에서 돌려도 같은 높이의 원둘레를 계속 따릅니다.'):t<7.4?F('어느 각도에서 보아도 축에서 경계까지의 거리가 같습니다.'):F(`${d.sol.name}은 한쪽 평면도형을 돌려 만들 수 있습니다.`,'회전체'),d=>`현재 ${d.sol.name} · 축을 중심으로 모든 방향의 경계 비교`);
  reg('s1-7','직육면체','actual-five-solids-compared-through-non-symmetry-rotation',d=>({...d,Q:question(d),answer:d.m.list.findIndex(k=>!standard[k])+1,display:'현재 다섯 입체 판별'}),(b,t,d)=>{
    const n=d.m.list.length,cols=b.W<560?2:3,rows=Math.ceil(n/cols),cellW=5,cellH=5.5;setup(b,[V(-cols*cellW/2,-rows*cellH/2),V(cols*cellW/2,rows*cellH/2)],.03);
    d.m.list.forEach((kind,i)=>{const x=(i%cols-(cols-1)/2)*cellW,y=((rows-1)/2-Math.floor(i/cols))*cellH-1.2,D=d.S3.ctx(b,{soYaw:-25,soPitch:25},{k:1,ox:x,oy:y}),a=PI/5*phase(t,1.3,6.4);
      if(standard[kind]){const s=d.S3.solid(kind,standard[kind]);d.S3.drawSolid(D,s);D.line(V(0,s.ymin),polar(s.rmax,a,s.ymin),'amber',2.3);}else{const ph=d.S3.polyhedron(kind);d.S3.drawPolyhedron(D,ph,a);if(t>=1.3){const ghost=d.S3.drawPolyhedron(d.S3.nullCtx(D),ph,0);b.path(ghost,{close:true,color:'amber',dash:[5,4],width:1.5});}}
      text(b,V(x,y-1.4),NUM[i],'ink');if(t>=7.4)text(b,V(x,y+3.5),standard[kind]?'항상 같은 윤곽':'회전체 아님',standard[kind]?'green':'rose',{size:12});
    });
  },(t,d)=>t<1.3?F('현재 문제의 다섯 입체를 같은 축 방향으로 놓습니다.'):t<6.4?F('각 입체를 36° 돌려 처음 윤곽과 겹쳐 봅니다.'):t<7.4?F('다각형 경계의 꼭짓점은 원둘레의 중간 부분을 채우지 못합니다.'):F('모든 회전각에서 같은 경계를 갖지 않는 입체를 고릅니다.',`${NUM[d.answer-1]} ${ {cuboid:'직육면체',pyr:'사각뿔',tri:'삼각기둥'}[d.m.list[d.answer-1]]}`),d=>`${clean(d.Q.stem)} · 현재 그림 ①~⑤의 순서 유지`);

  // Axial and perpendicular sections are derived from the same radius profile.
  function radiusAt(sol,y){if(sol.sphere)return Math.sqrt(Math.max(0,sol.sphere.R**2-(y-sol.sphere.cy)**2));const a=sol.bands.find(p=>y>=p.y0-1e-9&&y<=p.y1+1e-9)||sol.bands.at(-1);return a.r0+(a.r1-a.r0)*(y-a.y0)/(a.y1-a.y0);}
  function axial(sol){return sol.poly.map(([r,y])=>V(r,y)).concat(sol.poly.slice().reverse().map(([r,y])=>V(-r,y)));}
  const sectionName={cyl:'직사각형',cone:'이등변삼각형',frus:'등변사다리꼴',sphere:'원',dbl:'두 이등변삼각형을 붙인 도형'};
  function sectionSolid(d,kind,dim){if(kind==='dbl')return d.S3.solid(kind,{R:dim.R,h1:Math.ceil(dim.h1/2),h2:Math.floor(dim.h1/2)});return d.S3.solid(kind,dim);}
  function sectionPose(p,psi,u,shift,cam,cy=0){
    const yaw=Math.atan2(cam.sy,cam.cy),pitch=Math.atan2(cam.sp,cam.cp),a=psi+(-yaw-psi)*u,rad=V(Math.cos(a),0,Math.sin(a)),ey=V(0,1),normal=cross(rad,ey),up=add(mul(ey,Math.cos(-pitch*u)),mul(normal,Math.sin(-pitch*u))),screenRight=V(cam.cy,0,-cam.sy);
    return add(V(0,cy),add(add(mul(rad,p.x),mul(up,p.y-cy)),mul(screenRight,shift*u)));
  }
  function sectionDraw(b,t,d){
    const S=d.S3,sol=d.sol,D=S.ctx(b,camera(d)),centerY=(sol.ymin+sol.ymax)/2,shift=sol.rmax*3.4+1,extract=phase(t,2.2,5.2),psi=d.psi||0,points=axial(sol),f=p=>sectionPose(p,psi,extract,shift,D.cam,centerY);
    const active=points.map(f),extra=active.map(D.P);let duplicate=null;
    if(d.areaGoal&&sol.kind!=='cyl'&&t>=5.3){const R=sol.d.R,r=sol.kind==='frus'?sol.d.r:0,h=sol.h,C=V((R+r)/2,h/2),a=PI*phase(t,5.3,7.1);duplicate=points.map(p=>{const q=sub(p,C);return add(C,V(q.x*Math.cos(a)-q.y*Math.sin(a),q.x*Math.sin(a)+q.y*Math.cos(a)));}).map(f);extra.push(...duplicate.map(D.P));}
    setup(b,[...solidPoints(d,sol,D.P),...extra]);S.drawSolid(D,sol);S.drawAxis(D,sol.ymin,sol.ymax,{label:'회전축 l'});
    if(t>=.9){D.poly3(points.map(p=>polar(p.x,psi,p.y)),{close:true,fill:'rose',fillAlpha:.1,color:'rose',dash:[5,4],width:2});D.poly3(active,{close:true,fill:'amber',fillAlpha:.16,color:'amber',width:3});}
    if(d.areaGoal){const R=sol.d.R,h=sol.h,r=sol.kind==='frus'?sol.d.r:0;dim3(D,V(0,sol.ymin),V(R,sol.ymin),`r=${cm(R)}`,'sky');dim3(D,V(R,sol.ymin),V(R,sol.ymax),`h=${cm(h)}`,'sky',{dx:26,dy:0});if(r)dim3(D,V(0,h),V(r,h),cm(r),'sky',{dx:34,dy:-18,align:'left'});
      if(t>=5.2){const a=D.P(f(V(-R,0))),z=D.P(f(V(R,0))),c=D.P(f(V(0,0)));line(b,a,c,'amber',4);line(b,c,z,'green',4);text(b,mid(a,z),`지름 ${cm(2*R)}`,'amber',{dy:24});if(r)text(b,D.P(f(V(0,h))),`윗변 ${cm(2*r)}`,'amber',{dy:-22});}
      if(duplicate)D.poly3(duplicate,{close:true,fill:'green',fillAlpha:.1,color:'green',dash:[5,4],width:2});
    }else if(t>=6.3){const p=D.P(f(V(0,sol.ymin)));text(b,p,t>=7.4?sectionName[sol.kind]:'축 양쪽의 같은 경계',t>=7.4?'green':'amber',{dy:33,size:13});}
  }
  function circleSectionPose(r,angle,y,u,shift,cam){const right=V(cam.cy,0,-cam.sy),deep=V(cam.sy,0,cam.cy),pitch=Math.atan2(cam.sp,cam.cp),turn=(PI/2-pitch)*u,second=add(mul(deep,Math.cos(turn)),V(0,-Math.sin(turn)));return add(V(0,y),add(add(mul(right,r*Math.cos(angle)),mul(second,r*Math.sin(angle))),mul(right,shift*u)));}
  function perpendicularDraw(b,t,d){
    const S=d.S3,sol=d.sol,D=S.ctx(b,camera(d)),f0=(d.y-sol.ymin)/sol.h;let hfrac=f0;
    if(d.goal==='vary'){if(t<2.7)hfrac=f0+(.15-f0)*phase(t,1.2,2.7);else if(t<4.6)hfrac=.15+.7*phase(t,2.7,4.6);else hfrac=.85+(f0-.85)*phase(t,4.6,6.2);}
    const y=sol.ymin+sol.h*hfrac,r=radiusAt(sol,y),u=d.goal==='vary'?phase(t,6.2,7.1):phase(t,2.3,5.6),shift=3*sol.rmax+1;
    const ring=Array.from({length:73},(_,i)=>circleSectionPose(r,TAU*i/72,y,u,shift,D.cam));setup(b,[...solidPoints(d,sol,D.P),...ring.map(D.P)]);S.drawSolid(D,sol);S.drawAxis(D,sol.ymin,sol.ymax,{label:'회전축 l'});
    if(t>=.8){const split=S.splitRing(D,r,y);split.far.forEach(ps=>b.path(ps,{color:'rose',dash:[5,4],width:2.8}));split.near.forEach(ps=>b.path(ps,{color:'rose',width:3.5}));}
    if(t>=2.3||d.goal==='vary'){D.poly3(ring,{close:true,color:'amber',fill:'amber',fillAlpha:.1,width:3,dash:u<.3?[5,4]:undefined});const C=circleSectionPose(0,0,y,u,shift,D.cam),A=circleSectionPose(r,TAU*phase(t,5.6,7.3),y,u,shift,D.cam);D.line(C,A,'green',3);if(u>=.99)D.lab(C,d.goal==='radius'?(t>=7.6?`r=${cm(r)}`:'r=?'):'중심','green',{dy:23});}
    if(d.goal==='radius'){const H=sol.h,R=sol.d.R;dim3(D,O,V(R,0),`밑면 ${cm(R)}`,'sky');dim3(D,V(-R-.3,0),V(-R-.3,H),cm(H),'sky',{dx:-28,dy:0});dim3(D,V(-R-.3,0),V(-R-.3,H/2),cm(H/2),'amber',{dx:28,dy:0});
      if(t>=5.6){D.line(V(0,H),V(R,0),'amber',2.5);D.line(V(0,H/2),V(R/2,H/2),'green',3.5);b.ticks(D.P(V(0,H)),D.P(V(0,H/2)),{color:'rose',count:1});b.ticks(D.P(V(0,H/2)),D.P(O),{color:'rose',count:1});}}
  }
  for(const [goal,label] of [['shape','단면 모양'],['vary','크기 변화'],['radius','반지름']])reg('s2-1',label,'horizontal-radius-profile-cut-and-rigid-section-extraction',d=>{const numeric=goal==='radius',sol=numeric?d.S3.solid('cone',{R:d.m.pr,h1:d.m.ph}):d.m.sol,y=numeric?d.m.ph/2:d.m.u;return{...d,sol,y,goal,answer:numeric?d.m.pr/2:'원',practice:numeric&&d.m.kindP===2};},perpendicularDraw,
    (t,d)=>t<1.2?F('현재 자르는 높이와 축에 수직인 평면을 확인합니다.'):t<5.6?F(d.goal==='vary'?'평면을 위아래 높이로 옮겨 원의 크기가 어떻게 달라지는지 봅니다.':'잘린 원판을 가로로 꺼내 회전시켜 실제 모양을 봅니다.'):t<7.6?F(d.goal==='radius'?'꼭짓점에서 자른 평면까지의 높이가 전체 높이의 절반입니다.':'같은 높이에서는 축에서 경계까지의 거리가 어느 방향으로도 같습니다.'):F(d.goal==='radius'?'원뿔의 중간 높이에서 반지름도 절반입니다.':d.goal==='vary'?d.sol.kind==='cyl'?'원기둥은 어느 높이에서 잘라도 반지름이 같습니다.':d.sol.sphere?'구는 중심에서 가장 큰 원이 되고 양 끝으로 갈수록 작아집니다.':'원뿔·원뿔대에서는 자르는 높이에 따라 반지름이 달라집니다.':'이 입체의 두 끝 사이를 수직으로 자른 단면은 원입니다.',d.goal==='radius'?`$r=${tex(d.sol.d.R)}\\div2=${tex(d.answer)}\\text{ cm}$`:''),d=>d.goal==='radius'?`${d.practice?'현재 문제':'현재 문제 치수의 비교'} 원뿔 · 밑면 반지름 ${cm(d.m.pr)}, 높이 ${cm(d.m.ph)} · 밑면에서 ${cm(d.m.ph/2)} 위`: `현재 ${d.sol.name} · 회전축에 수직 · 현재 절단 높이 ${cm(d.y-d.sol.ymin)}`);
  // The native problem renderers for s2-2/s2-5 use this fixed shape template;
  // their exploration dimensions are a separate state and must not replace it.
  for(const compare of [false,true])reg('s2-2',compare?'방향 비교':'단면 모양','axial-plane-rotation-preserves-the-entire-cross-section',d=>{const sol=compare?d.m.sol:sectionSolid(d,d.m.pk,{R:3,r:2,h1:6});return{...d,sol,psi:compare?d.m.psi:0,compare,answer:sectionName[sol.kind]};},(b,t,d)=>{
    if(!d.compare){sectionDraw(b,t,d);return;}const S=d.S3,D=stage3(b,d,d.sol),psi=d.psi+PI/2*phase(t,1.2,6.2),ps=axial(d.sol);S.drawSolid(D,d.sol);D.poly3(ps.map(p=>polar(p.x,psi,p.y)),{close:true,fill:'amber',fillAlpha:.18,color:'amber',width:3,dash:[5,4]});S.drawAxis(D,d.sol.ymin,d.sol.ymax,{label:'회전축 l'});
    if(t>=6.2)D.poly3(ps.map(p=>polar(p.x,d.psi,p.y)),{close:true,color:'green',fillAlpha:0,fill:'green',dash:[5,4],width:2});
  },(t,d)=>t<1.2?F('자르는 평면이 회전축 전체를 포함해야 합니다.'):t<5.2?F(d.compare?'평면을 축 둘레로 제자리에서 돌립니다.':'축 양쪽의 단면을 가로로 꺼내 정면으로 돌립니다.'):t<7.4?F('같은 높이에서 양쪽 경계까지의 거리가 같으므로 축을 기준으로 대칭입니다.'):F(d.compare?'절단 방향을 바꾸어도 같은 단면이 포개집니다.':`이 회전체의 축을 포함한 단면은 ${d.answer}입니다.`,d.answer),d=>`${compare?'현재 탐구':'현재 문제'} ${d.sol.name} · 회전축을 포함하는 평면`);
  for(const [kind,label] of [['cyl','원기둥'],['cone','원뿔'],['frus','원뿔대']])reg('s2-3',label,'diameter-assembled-from-two-radii-before-section-area-dissection',d=>{const practice=d.m.pk===kind,dim=practice?d.m.pd:d.m.d,sol=sectionSolid(d,kind,dim),area=kind==='cyl'?2*dim.R*dim.h1:kind==='cone'?dim.R*dim.h1:(dim.R+dim.r)*dim.h1;return{...d,sol,practice,areaGoal:true,answer:area};},sectionDraw,
    (t,d)=>t<1.2?F('축을 포함하는 단면의 가로는 원의 양쪽 끝을 잇습니다.'):t<5.2?F('단면을 꺼내 축 양쪽에 반지름을 하나씩 놓습니다.'):t<7.4?F(d.sol.kind==='cyl'?'직사각형의 가로는 2r, 세로는 h입니다.':'같은 단면을 하나 더 뒤집어 붙이면 평행사변형이 됩니다.'):F('지름으로 구한 단면의 넓이입니다.',d.sol.kind==='cyl'?`$S=2\\times${tex(d.sol.d.R)}\\times${tex(d.sol.h)}=${tex(d.answer)}\\text{ cm}^2$`:d.sol.kind==='cone'?`$S=\\frac{2\\times${tex(d.sol.d.R)}\\times${tex(d.sol.h)}}2=${tex(d.answer)}\\text{ cm}^2$`:`$S=\\frac{(${tex(2*d.sol.d.r)}+${tex(2*d.sol.d.R)})\\times${tex(d.sol.h)}}2=${tex(d.answer)}\\text{ cm}^2$`),d=>`${d.practice?'현재 문제':'현재 탐구 치수의 비교'} ${d.sol.name} · 반지름 ${cm(d.sol.d.R)}${d.sol.kind==='frus'?', '+cm(d.sol.d.r):''} · 높이 ${cm(d.sol.h)} · 축 포함 단면의 넓이`);
  reg('s2-4','회전체 찾기','given-full-axial-section-halved-and-revolved',d=>{const sol=sectionSolid(d,d.m.pk,d.m.pd);return{...d,sol,sectionGiven:true,answer:sol.name};},inverseDraw,
    (t,d)=>t<1?F('그림은 회전축의 양쪽을 모두 포함한 단면입니다.'):t<3.2?F('대칭축 한쪽의 경계만 골라 냅니다.'):t<6.6?F('한쪽 부분을 축 둘레로 돌려 각 높이의 원을 복원합니다.'):t<7.4?F('반지름의 높이별 변화가 주어진 단면과 일치하는지 확인합니다.'):F('이 단면을 갖는 회전체입니다.',d.answer),d=>`현재 문제의 ${sectionName[d.sol.kind]} 단면 · 회전축 l 포함 · 한쪽 경계로 회전체 복원`);
  reg('s2-5','접어 보기','rigid-half-turn-in-space-around-the-symmetry-axis',d=>{const sol=sectionSolid(d,d.m.pk,{R:3,r:2,h1:6});return{...d,sol,answer:'선대칭도형'};},(b,t,d)=>{
    const S=d.S3,D=S.ctx(b,{soYaw:0,soPitch:0}),a=PI*phase(t,1.2,6.4),right=d.sol.poly.map(([r,y])=>V(r,y)),left=d.sol.poly.map(([r,y])=>V(-r*Math.cos(a),y,r*Math.sin(a)));setup(b,[...right,...d.sol.poly.map(([r,y])=>V(-r,y))]);D.poly3(right,{close:true,color:'sky',fill:'sky',fillAlpha:.14,width:3});D.poly3(left,{close:true,color:'amber',fill:'amber',fillAlpha:.14,width:2.7,dash:t>=6.4?[5,4]:undefined});S.drawAxis(D,d.sol.ymin,d.sol.ymax,{label:'접는 선 l'});
    if(t>=7.4)D.lab(V(0,d.sol.ymin),'같은 높이 · 같은 거리','green',{dy:32,size:13});
  },(t,d)=>t<1.2?F('축을 포함한 단면에서 같은 높이의 좌우 경계를 확인합니다.'):t<6.4?F('왼쪽 조각을 회전축을 접는 선으로 삼아 공간에서 반 바퀴 돌립니다.'):t<7.4?F('길이와 모양을 바꾸지 않은 조각이 오른쪽에 꼭 포개집니다.'):F('회전축이 대칭축인 선대칭도형입니다.'),d=>`현재 문제 ${d.sol.name}의 축 포함 단면 · 축 양쪽을 접어 비교`);
  for(const numeric of [false,true])reg('s2-6',numeric?'높이':'남은 입체','upper-cone-translates-horizontally-without-changing-height',d=>{const R=numeric?d.m.pR:d.m.R,H=numeric?d.m.pH:d.m.H,c=numeric?d.m.pc/4:d.m.c,hs=H*c,rs=R*c,hf=H-hs;return{...d,R,H,c,hs,rs,hf,numeric,big:d.S3.solid('cone',{R,h1:H}),frus:d.S3.solid('frus',{R,r:rs,h1:hf}),small:d.S3.solid('cone',{R:rs,h1:hs}),answer:numeric?hf:'원뿔대'};},(b,t,d)=>{
    const S=d.S3,base=S.ctx(b,camera(d)),u=phase(t,1.4,6.1),shift=(2*d.R+1)*u,origin=base.P(V(0,d.hf)),small=S.ctx(b,camera(d),{k:1,ox:origin.x+shift,oy:origin.y});setup(b,[...solidPoints(d,d.big,base.P),...solidPoints(d,d.small,small.P)]);
    S.drawSolid(base,d.frus);S.drawSolid(small,d.small,{color:'amber'});S.drawAxis(base,0,d.H,{label:'회전축 l'});dim3(base,V(-d.R-.4,0),V(-d.R-.4,d.H),`전체 ${cm(d.H)}`,'sky',{dx:-30,dy:0});dim3(small,O,V(0,d.hs),`작은 뿔 ${cm(d.hs)}`,'amber',{dx:30,dy:0});
    if(t>=6.1)dim3(base,V(d.R+.2,0),V(d.R+.2,d.hf),numeric&&t<7.5?'h=?':numeric?cm(d.hf):'남은 높이','green',{dx:28,dy:0});
  },(t,d)=>t<1.4?F('큰 원뿔을 밑면에 평행하게 잘라 위쪽 작은 원뿔을 구분합니다.'):t<6.1?F('작은 원뿔의 높이를 유지한 채 가로로 밀어 냅니다.'):t<7.5?F('남은 두 밑면 사이의 높이와 떼어 낸 높이를 합하면 전체 높이입니다.'):F(numeric?'전체 높이에서 작은 원뿔의 높이를 뺍니다.':'평행한 두 원과 그 사이의 옆면이 남습니다.',numeric?`$h=${tex(d.H)}-${tex(d.hs)}=${tex(d.answer)}\\text{ cm}$`:'원뿔대'),d=>`${numeric?'현재 문제':'현재 탐구'} 큰 원뿔 높이 ${cm(d.H)} · 잘라 낸 작은 원뿔 높이 ${cm(d.hs)} · 밑면에 평행하게 절단`);

  // Exact isometric developments. ds²+s²dφ² is unchanged for the cone;
  // ds²+dy² is unchanged for the cylinder. No screen-coordinate shape morph.
  function cylinderPoint(r,s,y,u){const k=(1-u)/r;if(Math.abs(k)<1e-9)return V(s,y,-r);return rotateY(V(Math.sin(k*s)/k,y,(1-Math.cos(k*s))/k-r),-PI/2*(1-u));}
  function conePoint(r,R,s,phi,u){const alpha=Math.asin(r/R)+(PI/2-Math.asin(r/R))*u,sa=Math.sin(alpha),psi=phi/sa,q=V(s*sa*Math.sin(psi),-s*Math.cos(alpha),-s*sa*Math.cos(psi));return add(V(0,Math.sqrt(R*R-r*r)),rotateY(rotateX(q,-PI/2*u),PI/2*(1-u)));}
  function surfaceMesh(point,low,high,start,end,parts=60){const faces=[];for(let i=0;i<parts;i++){const a=start+(end-start)*i/parts,z=start+(end-start)*(i+1)/parts;faces.push([point(low,a),point(high,a),point(high,z),point(low,z)]);}const ring=s=>Array.from({length:parts+1},(_,i)=>point(s,start+(end-start)*i/parts)),edge=a=>Array.from({length:21},(_,i)=>point(low+(high-low)*i/20,a));return{faces,boundaries:[ring(low),ring(high),edge(start),edge(end)]};}
  function triangleDepth(p,a,b,c){const det=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(det)<1e-10)return null;const w0=((b.y-c.y)*(p.x-c.x)+(c.x-b.x)*(p.y-c.y))/det,w1=((c.y-a.y)*(p.x-c.x)+(a.x-c.x)*(p.y-c.y))/det,w2=1-w0-w1;if(Math.min(w0,w1,w2)<-1e-7)return null;return w0*a.d+w1*b.d+w2*c.d;}
  function surfaceVisibility(projectedFaces,p){for(const f of projectedFaces){for(const idx of [[0,1,2],[0,2,3]]){const d=triangleDepth(p,f[idx[0]],f[idx[1]],f[idx[2]]);if(d!=null&&d>p.d+1e-5)return false;}}return true;}
  function drawRuns(b,points,visible,color='amber',width=3.5){let run=[],previous=null;const flush=()=>{if(run.length>=2)b.path(run,{color,width:previous?width:2,dash:previous?undefined:[5,4],alpha:previous?1:.65});};points.forEach((p,i)=>{const v=visible(p,i);if(previous!==null&&v!==previous){run.push(p);flush();run=[p];}else run.push(p);previous=v;});flush();}
  function surfaceDraw(b,D,mesh){const faces=mesh.faces.map(f=>f.map(D.P3)),ordered=faces.slice().sort((a,z)=>a.reduce((s,p)=>s+p.d,0)-z.reduce((s,p)=>s+p.d,0));for(const f of ordered){b.path(f,{close:true,fill:'halo',color:null});b.path(f,{close:true,fill:'amber',fillAlpha:.13,color:null});}for(const edge of mesh.boundaries){const ps=edge.map(D.P3);drawRuns(b,ps,p=>surfaceVisibility(faces,p));}return faces;}
  function developingCamera(d,u){const current=d.S3.camOf(d.s);return{soYaw:Math.atan2(current.sy,current.cy)/RAD*(1-u),soPitch:Math.atan2(current.sp,current.cp)/RAD*(1-u)};}
  function cylinderDevelopment(b,t,d){
    const u=phase(t,1.2,5.8),D=d.S3.ctx(b,developingCamera(d,u)),w=TAU*d.r,pointFn=(height,s)=>cylinderPoint(d.r,s,height,u),mesh=surfaceMesh(pointFn,0,d.h,0,w),ps=mesh.faces.flat().map(D.P);setup(b,ps,.1);
    if(t<1.2){d.S3.drawSolid(D,d.sol);dim3(D,O,V(d.r,0),`r=${cm(d.r)}`,'sky');dim3(D,V(d.r,0),V(d.r,d.h),`h=${cm(d.h)}`,'sky',{dx:30,dy:0});}
    else surfaceDraw(b,D,mesh);
    const seam0=D.P(pointFn(0,0)),seam1=D.P(pointFn(d.h,0));line(b,seam0,seam1,'rose',3);if(t<5.8)text(b,seam1,'자르는 선','rose',{dy:-21});
    if(t>=5.8){const a=D.P(pointFn(0,0)),z=D.P(pointFn(0,w)),h=D.P(pointFn(d.h,w));line(b,a,z,'green',4.5);text(b,mid(a,z),`${pi(2*d.r)} cm`,'green',{dy:25});text(b,mid(z,h),cm(d.h),'amber',{dx:30});if(t>=7.6&&d.areaGoal)text(b,D.P(pointFn(d.h/2,w/2)),`${pi(d.answer)} cm²`,'green');}
  }
  for(const area of [false,true])reg('s3-1',area?'옆넓이':'전개도','cylindrical-sheet-unbends-with-constant-circumferential-length',d=>{const r=area?d.m.pr:d.m.r,h=area?d.m.ph:d.m.h;return{...d,r,h,sol:d.S3.solid('cyl',{R:r,h1:h}),areaGoal:area,answer:2*r*h};},cylinderDevelopment,
    (t,d)=>t<1.2?F('원기둥의 한 모선을 따라 옆면을 자릅니다.'):t<5.8?F('세로 길이와 둘레를 따라 잰 길이를 유지하며 곡면을 펼칩니다.'):t<7.6?F('한 바퀴의 둘레가 직사각형의 가로, 높이가 세로입니다.',`$w=2\\pi\\times${tex(d.r)}=${piTex(2*d.r)}\\text{ cm}$`):F(area?'옆면인 직사각형의 가로와 세로를 곱합니다.':'펼친 옆면은 직사각형입니다.',area?`$S=${piTex(2*d.r)}\\times${tex(d.h)}=${piTex(d.answer)}\\text{ cm}^2$`:`가로 ${pi(2*d.r)} cm · 세로 ${cm(d.h)}`),d=>`${area?'현재 문제':'현재 탐구'} 원기둥 · 밑면 반지름 ${cm(d.r)}, 높이 ${cm(d.h)} · ${area?'옆넓이':'전개도'}`);

  function coneSpec(d,r,R,inner=0){const h=Math.sqrt(R*R-r*r),r1=inner*r/R;return{...d,r,R,inner,r1,h,x:360*r/R,sol:inner?d.S3.solid('frus',{R:r,r:r1,h1:(R-inner)*h/R}):d.S3.solid('cone',{R:r,h1:h})};}
  function coneDevelopment(b,t,d){
    const u=phase(t,1.2,5.7),D=d.S3.ctx(b,developingCamera(d,u)),angle=d.x*RAD,fn=(s,p)=>conePoint(d.r,d.R,s,p,u),mesh=surfaceMesh(fn,d.inner||0,d.R,-angle/2,angle/2),apex=V(0,d.h),ps=mesh.faces.flat().map(D.P),extra=[];
    const symbolic=d.goal==='ratio',fullCircle=t>=5.7&&['angle','ratio','side','surface'].includes(d.goal),circleAt=V(d.inner?-d.r1-.15*d.R:0,d.h-d.R-2*d.r-.3*d.R),smallCircleAt=V(d.r+.15*d.R,circleAt.y),baseCircle=t>=5.7&&!['slant','path','frustumPath'].includes(d.goal);
    if(fullCircle){for(let i=0;i<72;i++)extra.push(polar2(d.R,TAU*i/72,apex));}if(baseCircle){extra.push(V(circleAt.x-d.r,circleAt.y-d.r),V(circleAt.x+d.r,circleAt.y+d.r));if(d.inner)extra.push(V(smallCircleAt.x-d.r1,smallCircleAt.y-d.r1),V(smallCircleAt.x+d.r1,smallCircleAt.y+d.r1));}
    setup(b,[...ps,D.P(apex),...extra],.1);
    if(t<1.2)d.S3.drawSolid(D,d.sol);else surfaceDraw(b,D,mesh);
    const left=fn(d.R,-angle/2),right=fn(d.R,angle/2),topLeft=fn(d.inner||0,-angle/2),topRight=fn(d.inner||0,angle/2);
    D.line(topLeft,left,'rose',2.5);D.line(topRight,right,'rose',2.5);
    const radialLabel=`${d.inner?'r₂':'r'}=${cm(d.r)}`,slantLabel=symbolic?'R':d.goal==='slant'&&t<7.6?'R=?':`${d.inner?'R₂':'R'}=${cm(d.R)}`;
    if(t<1.2){dim3(D,O,V(d.r,0),radialLabel,'sky');const q=V(0,0,d.r);if(d.inner){const cut=mix(apex,q,d.inner/d.R);D.line(apex,cut,'muted',1.8,{dash:[5,4]});D.line(cut,q,'amber',2.6);D.lab(mid(apex,q),slantLabel,'amber',{dx:28,dy:0});D.lab(mid(apex,cut),`R₁=${cm(d.inner)}`,'muted',{dx:-28,dy:0});dim3(D,V(0,d.sol.h),V(d.r1,d.sol.h),`r₁=${cm(d.r1)}`,'sky',{dy:-20});}else dim3(D,apex,q,slantLabel,'amber',{dx:28,dy:0});}
    else if(u>=.99){text(b,mid(apex,left),slantLabel,'amber',{dx:-30,dy:-4});if(d.inner)text(b,mid(apex,topRight),`R₁=${cm(d.inner)}`,'rose',{dx:25,dy:0});}
    if(t>=5.7){if(fullCircle)b.circle(apex,d.R,{color:'muted',dash:[5,4],width:1.3});const arc=Array.from({length:61},(_,i)=>fn(d.R,-angle/2+angle*i/60));b.path(arc.map(D.P),{color:'green',width:4.5});
      const small=Math.min(d.R*.2,30/b.k),wedge=[apex,...Array.from({length:25},(_,i)=>polar2(small,-PI/2-angle/2+angle*i/24,apex))];poly(b,wedge,'rose',.14);
      const known=['slant','ratio','path','frustumPath'].includes(d.goal);text(b,V(0,d.h-small),known||t>=7.6?`${fraction(d.x)}°`:'x°','rose',{dy:19});
      if(baseCircle){b.circle(circleAt,d.r,{color:'sky',fill:'sky',fillAlpha:.06,width:2.5});const p=phase(t,5.7,7.2);b.path(Array.from({length:61},(_,i)=>polar2(d.r,PI/2+TAU*p*i/60,circleAt)),{color:'green',width:4.5});text(b,circleAt,d.goal==='surface'&&t>=7.6?`${pi(d.r*d.r)} cm²`:radialLabel,'sky',{size:13});text(b,V(circleAt.x,circleAt.y-d.r),symbolic?'2πr':`${pi(2*d.r)} cm`,'green',{dy:23,size:13});if(d.inner){b.circle(smallCircleAt,d.r1,{color:'rose',fill:'rose',fillAlpha:.06,width:2.5});b.path(Array.from({length:61},(_,i)=>polar2(d.r1,PI/2+TAU*p*i/60,smallCircleAt)),{color:'rose',width:4});text(b,smallCircleAt,`r₁=${cm(d.r1)}`,'rose',{size:13});text(b,V(smallCircleAt.x,smallCircleAt.y-d.r1),`${pi(2*d.r1)} cm`,'rose',{dy:23,size:13});}}
    }
  }
  function coneFrame(t,d){if(t<1.2)return F('밑면 반지름 r과 모선 R을 구별하고 옆면의 한 줄을 자릅니다.');if(t<5.7)return F('모선의 길이와 각 높이에서의 둘레 길이를 유지하며 옆면을 펼칩니다.');if(t<7.6)return F(d.goal==='net'?'부채꼴의 호와 밑면의 둘레는 원래 맞붙어 있던 같은 테두리입니다.':d.goal==='surface'?'옆면 부채꼴과 밑면 원 하나를 각각 계산해 더합니다.':'호가 전체 원의 둘레에서 차지하는 비율은 r/R입니다.',d.goal==='side'||d.goal==='surface'?`$S_{\\text{옆}}=\\frac{r}{R}\\pi R^2=\\pi Rr$`:'$\\frac{x}{360^{\\circ}}=\\frac{2\\pi r}{2\\pi R}=\\frac rR$');
    return d.goal==='net'?F('모선은 부채꼴의 반지름, 호는 밑면의 둘레입니다.',`호의 길이 = ${pi(2*d.r)} cm`):d.goal==='angle'?F('전체 360°에서 같은 비율을 취합니다.',`$x=360^{\\circ}\\times\\frac{${tex(d.r)}}{${tex(d.R)}}=${tex(d.x)}^{\\circ}$`):d.goal==='slant'?F('같은 호의 길이 식을 모선에 대해 풉니다.',`$R=\\frac{360\\times${tex(d.r)}}{${tex(d.x)}}=${tex(d.R)}\\text{ cm}$`):d.goal==='ratio'?F('둘레비의 공통인 2π를 약분합니다.',`$r:R=${tex(d.x)}:360=1:${tex(d.R/d.r)}$`):d.goal==='side'?F('부채꼴의 넓이는 밑면 반지름과 모선의 곱에 π를 곱한 값입니다.',`$S=\\pi\\times${tex(d.R)}\\times${tex(d.r)}=${piTex(d.r*d.R)}\\text{ cm}^2$`):F('원뿔의 밑면은 한 개입니다.',`$S=${piTex(d.r*d.R)}+${piTex(d.r*d.r)}=${piTex(d.r*d.R+d.r*d.r)}\\text{ cm}^2$`);}
  for(const [goal,label] of [['net','전개도'],['angle','중심각'],['slant','모선 길이']])reg('s3-2',label,'cone-sheet-opens-isometrically-and-matches-the-base-rim',d=>{const [r,R]=goal==='net'?[d.m.r,d.m.R]:d.m.q;return{...coneSpec(d,r,R),goal,answer:goal==='slant'?R:goal==='angle'?360*r/R:2*r,practice:goal!=='net'};},coneDevelopment,coneFrame,d=>`${d.practice?'현재 문제 치수':'현재 탐구'} 원뿔 · r=${cm(d.r)}, ${d.goal==='slant'?`중심각 ${fraction(d.x)}°, 모선 R=?`:`모선 R=${cm(d.R)}`}`);
  for(const [goal,label] of [['angle','중심각'],['ratio','반지름비']])reg('s3-3',label,'sector-and-whole-circle-arc-fractions-determine-the-radius-ratio',d=>({...coneSpec(d,d.m.qr,d.m.qr*d.m.qk),goal,answer:goal==='ratio'?d.m.qk:360/d.m.qk}),coneDevelopment,coneFrame,d=>d.goal==='ratio'?`현재 문제 · 밑면 반지름 r=${cm(d.r)}, 중심각 ${fraction(d.x)}° · 모선 R과의 비 r:R 구하기`:`현재 문제 치수 r=${cm(d.r)}, R=${cm(d.R)} · 중심각 x°`);
  for(const [goal,label] of [['side','옆넓이'],['surface','겉넓이']])reg('s3-4',label,'sector-fraction-area-plus-the-single-circular-base',d=>{const r=goal==='surface'?d.m.qr:d.m.r,R=goal==='surface'?d.m.qR:d.m.R;return{...coneSpec(d,r,R),goal,answer:r*R+(goal==='surface'?r*r:0)};},coneDevelopment,coneFrame,d=>`${d.goal==='surface'?'현재 문제':'현재 탐구'} 원뿔 · 밑면 반지름 ${cm(d.r)}, 모선 ${cm(d.R)} · ${d.goal==='surface'?'겉넓이':'옆넓이'}`);
  for(const area of [false,true])reg('s3-5',area?'옆넓이':'전개도','annular-conical-sheet-opens-with-both-rim-lengths-preserved',d=>{const k=area?d.m.qk:d.m.k,r1=area?d.m.q1:d.m.r1,r2=area?d.m.q2:d.m.r2,R1=k*r1,R2=k*r2;return{...coneSpec(d,r2,R2,R1),r1,r2,R1,R2,k,goal:area?'frustumArea':'frustumNet',answer:k*(r2*r2-r1*r1)};},(b,t,d)=>{
    coneDevelopment(b,t,d);if(t>=5.7){const apex=V(0,d.h),a=d.x*RAD,inner=Array.from({length:61},(_,i)=>polar2(d.R1,-PI/2-a/2+a*i/60,apex));b.path(inner,{color:'rose',width:4});if(t>=6.1){const innerSector=[apex,...inner];poly(b,innerSector,'rose',.07,{dash:[5,4]});text(b,apex,'잘라 낸 부분','rose',{dy:-22,size:13});}if(t>=7.6&&area)text(b,polar2((d.R1+d.R2)/2,-PI/2,apex),`${pi(d.answer)} cm²`,'green',{size:14});}
  },(t,d)=>t<1.2?F('원뿔대의 두 밑면과 모선 위 두 길이 R₁, R₂를 구별합니다.'):t<5.7?F('같은 비율의 원뿔 옆면을 펴면 부채꼴에서 작은 부채꼴을 뺀 띠가 됩니다.'):t<7.6?F('바깥 호는 큰 밑면 둘레, 안쪽 호는 작은 밑면 둘레와 같습니다.',`$\\frac{${tex(d.r1)}}{${tex(d.R1)}}=\\frac{${tex(d.r2)}}{${tex(d.R2)}}$`):F(area?'큰 부채꼴에서 잘라 낸 작은 부채꼴의 넓이를 뺍니다.':'두 부채꼴은 중심과 중심각이 같습니다.',area?`$S=\\pi(${tex(d.R2)}\\times${tex(d.r2)}-${tex(d.R1)}\\times${tex(d.r1)})=${piTex(d.answer)}\\text{ cm}^2$`:`바깥 호 ${pi(2*d.r2)} cm · 안쪽 호 ${pi(2*d.r1)} cm`),d=>`${area?'현재 문제':'현재 탐구'} 원뿔대 · 밑면 반지름 ${cm(d.r1)}, ${cm(d.r2)} · 펼친 반지름 R₁=${cm(d.R1)}, R₂=${cm(d.R2)}`);

  // A point on a developed sector is carried by the same isometry as the sheet.
  function sectorPoint(s,phi){return V(s*Math.sin(phi),-s*Math.cos(phi));}
  function pathPoint(d,p,u){return conePoint(d.r,d.R,Math.hypot(p.x,p.y),Math.atan2(p.x,-p.y),u);}
  const samples=(a,z,n=48)=>Array.from({length:n+1},(_,i)=>mix(a,z,i/n));
  function pathSamples(A,B,M){return M?samples(A,M,24).concat(samples(M,B,24).slice(1)):samples(A,B);}
  function closestOnSegment(P,A,B){const v=sub(B,A),u=clamp(dot(sub(P,A),v)/dot(v,v));return add(A,mul(v,u));}
  function pathLength(ps){return ps.slice(1).reduce((sum,p,i)=>sum+distance(p,ps[i]),0);}
  function stringDraw(b,t,d){
    coneDevelopment(b,t,d);const u=phase(t,1.2,5.7),D=d.S3.ctx(b,developingCamera(d,u)),a=d.x*RAD,A=sectorPoint(d.p,-a/2),B=sectorPoint(d.p,a/2),ring=Array.from({length:81},(_,i)=>sectorPoint(d.p,-a/2+a*i/80)),mesh=surfaceMesh((s,phi)=>conePoint(d.r,d.R,s,phi,u),d.inner||0,d.R,-a/2,a/2),faces=mesh.faces.map(f=>f.map(D.P3));
    const M=d.compare&&d.mode==='via'?mix(d.M,closestOnSegment(d.M,A,B),phase(t,5.7,7.2)):null,sourcePath=d.compare?(d.mode==='line'?pathSamples(A,B):d.mode==='via'?pathSamples(A,B,M):ring):ring;
    const drawPath=(ps,color,width=4)=>{const points=ps.map(p=>D.P3(pathPoint(d,p,u)));drawRuns(b,points,p=>surfaceVisibility(faces,p),color,width);};
    drawPath(sourcePath,'amber');if(t>=5.7){const progress=phase(t,5.7,7.2),linePts=samples(A,mix(A,B,progress));drawPath(linePts,'green',4.8);}
    point(b,D.P(pathPoint(d,A,u)),d.onGenerator?'P':'A','amber',{dx:!d.onGenerator&&t<1.2?13:-13,dy:19});if(u>.15)point(b,D.P(pathPoint(d,B,u)),d.onGenerator?'P′':'A′','amber',{dx:13,dy:19});
    if(d.compare&&d.mode==='via')point(b,D.P(pathPoint(d,M,u)),'M','amber',{dy:17});
    if(d.onGenerator){const C=D.P(V(0,d.h)),PP=D.P(pathPoint(d,A,u));text(b,mid(C,PP),`OP=${cm(d.p)}`,'rose',{dx:-27,dy:-3});}
    if(t>=6.2&&!d.compare){const apex=D.P(V(0,d.h));line(b,apex,D.P(pathPoint(d,A,u)),'rose',2.5,{dash:d.inner?[5,4]:undefined});line(b,apex,D.P(pathPoint(d,B,u)),'rose',2.5,{dash:d.inner?[5,4]:undefined});
      if(d.x===60){b.ticks(apex,D.P(pathPoint(d,A,u)),{color:'rose',count:1});b.ticks(apex,D.P(pathPoint(d,B,u)),{color:'rose',count:1});if(t>=7.2)b.ticks(D.P(pathPoint(d,A,u)),D.P(pathPoint(d,B,u)),{color:'green',count:1});}
      if(d.inner){const hole=[V(0,d.h),...Array.from({length:41},(_,i)=>add(V(0,d.h),sectorPoint(d.inner,-a/2+a*i/40)))];poly(b,hole,'rose',.08,{dash:[5,4]});text(b,V(0,d.h),'잘라 낸 부분','rose',{dy:-22,size:13});}
      if(t>=7.7)text(b,mid(D.P(pathPoint(d,A,u)),D.P(pathPoint(d,B,u))),cm(d.answer),'green',{dy:25});
    }
    if(t>=7.2&&d.compare){const cur=d.mode==='rim'?TAU*d.r:d.mode==='line'?distance(A,B):distance(A,M)+distance(M,B),best=distance(A,B);text(b,mid(D.P(pathPoint(d,A,u)),D.P(pathPoint(d,B,u))),near(cur,best)?'같은 선분 경로':'두 점 사이의 선분','green',{dy:29,size:13});}
  }
  reg('s4-1','최단 경로','same-string-isometrically-developed-then-a-bend-slides-onto-the-chord',d=>{const Q=question(d),m=d.m;return{...coneSpec(d,m.r,m.R),goal:'path',compare:true,p:m.R,mode:m.mode,M:V(m.M.x,m.M.y),Q,answer:correct(Q)+1};},stringDraw,
    (t,d)=>t<1.2?F('현재 끈은 원뿔의 옆면 위에서 한 바퀴 돌아 같은 점으로 옵니다.'):t<5.7?F('옆면과 그 위의 끈을 함께 펴면 같은 점 A가 두 끝 A, A′으로 나뉩니다.'):t<7.2?F(d.mode==='via'?'꺾이는 점 M을 선분 위로 옮기면 두 구간의 합은 선분의 길이에 가까워집니다.':'호와 두 끝을 잇는 선분을 비교합니다.'):t<7.7?F('전개도에서 곧은 선분인 경로는 입체 위에서는 곡선으로 보입니다.'):F('두 점을 잇는 선분에 해당하는 끈이 가장 짧습니다.',`${NUM[d.answer-1]} ${clean(d.Q.choices[d.answer-1].p)}`),d=>`현재 원뿔 r=${cm(d.r)}, R=${cm(d.R)} · 현재 ${d.mode==='rim'?'밑면 둘레를 따르는':d.mode==='via'?'점 M을 거치는':'전개도의 선분에 해당하는'} 끈${d.x===180?' · 꼭짓점 경유도 허용':''}`);
  function numericPathBind(d,angle,onGenerator){const active=d.m.qa===angle,r=active?d.m.qr:d.m.r,R=r*(angle===60?6:2),p=onGenerator?Math.min(active?d.m.qp:d.m.p,R):R;return{...coneSpec(d,r,R),goal:'path',compare:false,p,onGenerator,active,answer:angle===60?p:2*p};}
  for(const [angle,label] of [[60,'육십 도'],[180,'백팔십 도']])for(const onGenerator of [false,true])reg(onGenerator?'s4-3':'s4-2',label,'isometric-string-development-to-equilateral-side-or-a-diameter',d=>numericPathBind(d,angle,onGenerator),stringDraw,
    (t,d)=>t<1.2?F(d.onGenerator?'모선 전체와 출발점 P까지의 거리 OP를 구별합니다.':'현재 원뿔의 밑면 반지름과 모선을 확인합니다.'):t<5.7?F('옆면과 끈을 길이 변화 없이 함께 펼칩니다.'):t<6.8?F('부채꼴의 호가 밑면의 둘레와 같으므로 중심각을 구합니다.',`$x=360^{\\circ}\\times\\frac{${tex(d.r)}}{${tex(d.R)}}=${d.x}^{\\circ}$`):t<7.7?F(d.x===60?'같은 두 반지름 사이 각이 60°이므로 정삼각형입니다.':'180°이므로 두 끝과 꼭짓점은 한 직선 위에 있습니다.'):F(d.x===60?'정삼각형의 한 변은 사용한 반지름과 같습니다.':'허용된 꼭짓점 경유 경로에서 같은 길이를 두 번 더합니다.',`$${d.onGenerator?'PP^{\\prime}':'AA^{\\prime}'}=${d.x===180?`${tex(d.p)}+${tex(d.p)}=`:''}${tex(d.answer)}\\text{ cm}$`),d=>`${d.active?'현재 문제':'현재 탐구 치수의 '+angle+'° 비교'} · r=${cm(d.r)}, 모선 R=${cm(d.R)}${d.onGenerator?`, OP=${cm(d.p)}`:''}${angle===180?' · 꼭짓점 O를 지나는 경로도 포함':''}`);
  reg('s4-4','최단 거리','annular-sector-chord-checked-against-the-removed-inner-sector',d=>{const r2=d.m.qg,r1=Math.min(d.m.qf,r2-1),R2=6*r2,R1=6*r1;return{...coneSpec(d,r2,R2,R1),goal:'frustumPath',r1,r2,R1,R2,p:R2,onGenerator:false,answer:R2,clearance:R2*Math.cos(PI/6)-R1};},stringDraw,
    (t,d)=>t<1.2?F('원뿔대의 바깥 모선은 큰 원뿔 모선 R₂의 일부입니다.'):t<5.7?F('작은 원뿔을 잘라 낸 부분까지 보존하며 띠 모양으로 펼칩니다.'):t<6.8?F('두 끝을 잇는 선분이 잘라 낸 작은 부채꼴을 지나지 않는지 확인합니다.'):t<7.7?F('현재 선분은 띠 안에 있고, 큰 두 반지름 사이의 각은 60°입니다.'):F('정삼각형의 한 변이므로 선분의 길이는 큰 모선 R₂와 같습니다.',`$AA^{\\prime}=R_2=${tex(d.answer)}\\text{ cm}$`),d=>`현재 문제 · 큰 원뿔 r₂=${cm(d.r2)}, R₂=${cm(d.R2)} · 잘라 낸 작은 밑면 r₁=${cm(d.r1)} · 중심각 60°`);

  function build(lab,state){const G=typeof window==='undefined'?lab.api:window.APL_SO,D=lab.scene.so;if(!G?.S3||!D||!recipes[D.id])return[];const s=clone(state),m=D.model({...s,lessonOn:false,lessonEntry:false});return recipes[D.id].map((r,i)=>{const d=r.bind({G,S3:G.S3,D,s,m});return{id:`solid-geometry-${D.id}-${i}`,title:D.title,label:d.display||r.label,legacyLabel:r.label,duration:r.duration,stops:[1.2,3.2,5.7,6.8,7.7],model:d,given:r.given(d),motion:r.motion,draw:r.draw,frame:r.frame};});}
  const registry=Object.fromEntries(Object.keys(recipes).map(id=>[`g7-solids/${id}`,build]));
  const lessonInfo=Object.fromEntries(Object.entries(recipes).map(([id,rs])=>[`g7-solids/${id}`,rs.map(r=>({legacyLabel:r.label,duration:r.duration}))]));
  return{build,registry,lessonInfo,fraction,conePoint,cylinderPoint,sectionPose,circleSectionPose,radiusAt,axial,pathPoint,pathLength,closestOnSegment,sectorPoint,surfaceMesh,surfaceVisibility,triangleDepth};
});
