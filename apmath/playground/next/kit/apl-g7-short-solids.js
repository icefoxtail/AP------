/* Grade 7 solid proofs: actual scene-bound dimensions, continuous rigid motion,
 * and a separately computed volume/area model. No shared explorer mutation. */
(function(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortSolids = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
})(typeof window === 'undefined' ? null : window, function() {
  'use strict';
  const PI = Math.PI, clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
  const smooth = x => { x=clamp(x);return x*x*(3-2*x); };
  const phase = (t,a,b) => smooth((t-a)/(b-a));
  const clone = x => JSON.parse(JSON.stringify(x));
  const near = (a,b) => Math.abs(a-b) <= 1e-7*Math.max(1,Math.abs(a),Math.abs(b));
  const p = (x,y) => ({x,y});
  const v = (x,y,z=0) => ({x,y,z});
  const plus = (a,b) => v(a.x+b.x,a.y+b.y,a.z+b.z);
  const number = n => String(Math.round(n*1e8)/1e8);
  const gcd = (a,b) => b ? gcd(b,a%b) : Math.abs(a);
  const rational = (n,d=1) => {const g=gcd(Math.round(n),d)||1;return d/g===1?String(n/g):`\\frac{${n/g}}{${d/g}}`;};
  const pi = (n,d=1) => n===0?'0':`${rational(n,d)==='1'?'':rational(n,d)}\\pi`;
  const positive = (...ns) => ns.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>0);

  function frustumModel(m) {
    const {r2,r1,h2,h1,R2,R1}=m;
    if (!positive(r2,r1,h2,h1,R2,R1) || r1>=r2 || h1>=h2 || R1>=R2 || !near(r1/r2,h1/h2) || !near(r1/r2,R1/R2) || !near(r2*r2+h2*h2,R2*R2)) throw RangeError('Invalid similar-cone dimensions');
    return {r2,r1,h2,h1,R2,R1,hf:h2-h1,theta:2*PI*r2/R2,largeSector:r2*R2,smallSector:r1*R1,ring:r2*R2-r1*R1,top:r1*r1,bottom:r2*r2,surface:r2*R2-r1*R1+r1*r1+r2*r2,largeVolume:r2*r2*h2,smallVolume:r1*r1*h1,volume:r2*r2*h2-r1*r1*h1};
  }
  function tankModel(m) {
    const {r,h,body}=m;
    if (!positive(r,h) || !['sph','cone','cyl'].includes(body) || (body==='sph'&&h<2*r)) throw RangeError('The solid must fit completely in the initially full tank');
    const height=body==='sph'?2*r:h, numerator=body==='sph'?4*r*r*r:body==='cone'?r*r*h:3*r*r*h;
    return {r,h,body,height,tank:r*r*h,numerator,remaining:3*r*r*h-numerator};
  }
  // Coefficient of pi. Depth is measured from the bottom of the actual body.
  // The sphere is a spherical cap; the cone points upward; a cylinder is linear.
  function submerged(m, depth) {
    const d=clamp(depth,0,m.height),r=m.r;
    if(m.body==='sph')return d*d*(r-d/3);
    if(m.body==='cone')return r*r*(d-d*d/m.h+d*d*d/(3*m.h*m.h));
    return r*r*d;
  }
  function tankPose(m,t) {
    const bottom=(m.h+.15*m.r)*(1-phase(t,1.1,5.1));
    const displacement=submerged(m,m.h-bottom);
    return {bottom,displacement,remaining:m.tank-displacement};
  }
  const label=(b,q,text,color='ink',o={})=>b.text(q,text,{align:'center',baseline:'middle',size:b.W<560?14:17,weight:750,color,...o});
  function prepare(b) {b.kind='figure';b.aspect='1:1';b.setPanes(null);b.setInsets({top:48,right:22,bottom:82,left:22});}
  function context(t) {return {tab:'review',review:true,problem:false,lesson:false,step:0,t};}

  function netGeometry(G,m) {
    // Use the production hinged mesh, at a finer polygonal sampling. Analytical
    // circle dimensions remain the authority; the mesh is a drawing approximation.
    const N=72, sn=G.solidNet(G.circleBase(m.r2,N),m.hf,m.r1/m.r2,Array(N).fill(true),N/2);
    return {sn,N};
  }
  function surfaceDraw(G,b,t,m,net) {
    prepare(b);
    const open=phase(t,.8,3.1), remove=phase(t,4.1,5.7), aux=phase(t,3.1,3.8), {sn,N}=net;
    const D=G.scene3(b,{},context(open),{yaw:28*(1-open),pitch:20*(1-open)});
    const poses=G.netPose(sn.net,open);
    // The top disk separates continuously from the side to remain identifiable.
    const finalPoses=G.netPose(sn.net,1);
    const flatCentre=k=>G.centroid(sn.net.pieces[k].pts.map(q=>G.applyT(finalPoses[k],q)));
    const bc=flatCentre(sn.bot),tc=flatCentre(sn.top),separate=phase(t,2.1,3.1);
    const target=plus(bc,v(m.r2+1.3*m.r1,0));
    poses[sn.top]=G.compose(G.shiftT(G.mul3(G.sub3(target,tc),separate)),poses[sn.top]);
    poses[sn.bot]=G.compose(G.shiftT(v(-.8*m.r1*separate,0)),poses[sn.bot]);
    const at=(k,q)=>G.applyT(poses[k],q);
    const apLocal=G.add3(sn.A[1],G.mul3(G.sub3(sn.B[1],sn.A[1]),1/(1-m.r1/m.r2)));
    const ap=at(1,apLocal);
    const order=Array.from({length:N},(_,i)=>(i+1)%N);
    const inner=order.map(k=>at(k,sn.B[k])).concat([at(0,sn.B[1])]);
    const small=[ap,...inner], all=sn.net.pieces.flatMap((pc,k)=>pc.pts.map(q=>at(k,q)));
    const planar=small.map(D.P), bounds=G.bboxOf(all.map(D.P));
    // Move the *same* auxiliary sector by a translation. Never subtract a disk.
    const dx=b.W<560?0:-1.5*m.r1, dy=-1.8*m.r1;
    const extra=planar.map(q=>p(q.x+dx*remove,q.y+dy*remove));
    D.fit(all,t>=3.1?extra.concat([D.P(ap)]):[],{l:30,r:34,t:76,b:95});
    const tp=G.netDraw(D,sn.net,poses,pc=>({fill:pc.tag==='bot'?'sky':pc.tag==='top'?'rose':'green',alpha:.18,edge:'ink',ew:2.2,edgeStyle:ed=>({color:pc.tag==='lat'?(ed.i===0?'sky':ed.i===2?'rose':'ink'):pc.tag==='bot'?'sky':'rose',width:2.3})}));
    for(const [index,name,color] of [[sn.bot,'아랫면','sky'],[sn.top,'윗면','rose']]) {
      const centre=G.centroid(tp[index].pts);
      const q=D.P(centre);
      label(b,q,name,color,{size:b.W<560?12:15});
    }
    if(t<3.1) {
      const side=tp[sn.root];label(b,D.P(side.c),'옆면','green',{size:14});
      // Surface proof uses slant lengths, not an overlapping height label.
      return;
    }
    const shifted=planar.map(q=>p(q.x+dx*remove,q.y+dy*remove));
    b.path(planar,{close:true,color:'rose',width:1.3,dash:[4,5],alpha:.45});
    b.path(shifted,{close:true,fill:'rose',fillAlpha:.2*aux,color:'rose',width:2.4,alpha:aux});
    const ac=p(D.P(ap).x+dx*remove,D.P(ap).y+dy*remove);
    const sc=G.bboxOf(shifted);
    label(b,p((sc.x0+sc.x1)/2,sc.y0),'계산용 작은 부채꼴','rose',{dy:-15,size:12});
    const a2=D.P(at(1,sn.A[1])),a1=D.P(at(1,sn.B[1]));
    b.path([D.P(ap),a2],{color:'ink',width:1.5,dash:[3,4]});
    label(b,p((D.P(ap).x+a2.x)/2,(D.P(ap).y+a2.y)/2),`큰 모선 ${m.R2}`,'ink',{dx:18,size:12});
    b.path([ac,p(a1.x+dx*remove,a1.y+dy*remove)],{color:'rose',width:1.5});
    if(remove>.95) label(b,p((ac.x+a1.x+dx*remove)/2,(ac.y+a1.y+dy*remove)/2),`작은 모선 ${m.R1}`,'rose',{dx:20,dy:12,size:12});
    if(t>=6.5) {
      const bottom=D.P(G.centroid(tp[sn.bot].pts)),top=D.P(G.centroid(tp[sn.top].pts));
      label(b,bottom,`${m.bottom}π`,'sky',{dy:21,size:14});
      label(b,top,`${m.top}π`,'rose',{dy:21,size:14});
      label(b,D.P(tp[sn.root].c),`${m.ring}π`,'green',{size:16});
    }
    void bounds;
  }
  function surfaceFrame(t,m) {
    if(t<.8)return{label:'윗면·아랫면·옆면, 실제 세 면을 확인합니다.',formula:''};
    if(t<3.1)return{label:'같은 면의 색을 따라 원뿔대를 펼칩니다.',formula:'겉넓이 = 옆넓이 + 두 원의 넓이'};
    if(t<4.1)return{label:'부채꼴 고리 안쪽을 보조 부채꼴로 채우면 큰 부채꼴입니다.',formula:`큰 부채꼴 $${pi(m.largeSector)}$ · 작은 부채꼴 $${pi(m.smallSector)}$`};
    if(t<6.5)return{label:'작은 부채꼴을 빼면 고리 모양 옆면이 남습니다.',formula:`옆넓이 $=${pi(m.largeSector)}-${pi(m.smallSector)}=${pi(m.ring)}$`};
    return{label:'옆넓이에 실제 윗면·아랫면의 넓이를 더합니다.',formula:`겉넓이 $=${pi(m.ring)}+${pi(m.top)}+${pi(m.bottom)}=${pi(m.surface)}\\;\\mathrm{cm}^2$`};
  }
  function volumeDraw(G,b,t,m) {
    prepare(b);const D=G.scene3(b,{},context(1),{yaw:26,pitch:18});
    const add=phase(t,.8,2),cut=phase(t,3.2,5.5),narrow=b.W<560;
    const shift=narrow?plus(D.hx(.7*m.r2*cut),v(0,1.3*m.h1*cut)):D.hx((m.r2+1.5*m.r1)*cut);
    const mesh=G.revolveMesh([[0,0],[m.r2,0],[m.r1,m.hf],[0,m.hf]],{N:48,tags:['bot','side','top']});
    const cap=G.revolveMesh([[0,0],[m.r1,0],[0,m.h1]],{N:48,O:plus(v(0,m.hf),shift),tags:['bot','side']});
    const all=mesh.faces.flatMap(f=>f.pts).concat(cap.faces.flatMap(f=>f.pts));
    D.fit(all,[],{l:42,r:45,t:74,b:104});
    D.body({mesh,fill:'green',alpha:.14,edge:'ink',edgeW:2.5});
    const apex=v(0,m.h2),left=plus(v(0,m.hf),D.hx(-m.r1)),right=plus(v(0,m.hf),D.hx(m.r1));
    if(add>.001) {
      D.line(left,apex,'rose',1.5,{dash:[5,5],alpha:add});D.line(right,apex,'rose',1.5,{dash:[5,5],alpha:add});
      D.body({mesh:cap,fill:'rose',alpha:.12*add,edge:'rose',edgeW:2.3,edgeFn:()=>({alpha:add})});
      D.tag(plus(v(0,m.h2),shift),cut<.01?'보조 원뿔':'빼는 작은 원뿔',{color:'rose',dy:-22,size:13});
      if(t>=2) {
        D.height(v(0,0),apex,`큰 높이 ${m.h2}`,{side:{x:-1,y:0},color:'ink',size:12});
        D.height(plus(v(0,m.hf),shift),plus(apex,shift),`작은 높이 ${m.h1}`,{side:{x:1,y:0},color:'rose',size:12});
      }
    }
    D.radius(v(0,0),D.hx(m.r2),`반지름 ${m.r2}`,{color:'sky',dash:true,size:13});
    if(t>=2)D.radius(plus(v(0,m.hf),shift),plus(plus(v(0,m.hf),shift),D.hx(m.r1)),`반지름 ${m.r1}`,{color:'rose',size:12});
    D.tag(v(0,m.hf*.45),t>=5.5?'남은 원뿔대':'원래 원뿔대',{color:'green',size:16});
  }
  function volumeFrame(t,m) {
    if(t<.8)return{label:'구할 입체는 원뿔대입니다.',formula:''};
    if(t<2)return{label:'윗부분을 보조 원뿔로 채워 큰 원뿔을 만듭니다.',formula:'큰 원뿔 = 원뿔대 + 작은 원뿔'};
    if(t<3.2)return{label:'같은 꼭짓점의 두 원뿔, 반지름과 높이를 각각 확인합니다.',formula:`큰 부피 $=\\frac13\\pi\\times${m.r2}^2\\times${m.h2}=${pi(m.largeVolume,3)}$`};
    if(t<6.5)return{label:'같은 작은 원뿔을 빼서 원뿔대만 남깁니다.',formula:`작은 부피 $=\\frac13\\pi\\times${m.r1}^2\\times${m.h1}=${pi(m.smallVolume,3)}$`};
    return{label:'큰 부피에서 작은 부피를 뺍니다.',formula:`부피 $=${pi(m.largeVolume,3)}-${pi(m.smallVolume,3)}=${pi(m.volume,3)}\\;\\mathrm{cm}^3$`};
  }
  function tankDraw(G,b,t,m) {
    prepare(b);const D=G.scene3(b,{},context(1),{yaw:0,pitch:15});
    const H=m.h/m.r,pose=tankPose(m,t),Y=pose.bottom/m.r;
    const bodyH=m.height/m.r, col=m.body==='sph'?'green':m.body==='cone'?'amber':'violet';
    const tank=G.revolveMesh([[0,0],[1,0],[1,H]],{N:48,tags:['bot','side']});
    const br=.85,bx=2.65,full=m.numerator/3/(m.r*m.r*m.r),BH=full/(br*br)+.35;
    const cup=G.revolveMesh([[0,0],[br,0],[br,BH]],{O:v(bx,0),N:48,tags:['bot','side']});
    const prof=m.body==='sph'?G.sphereProfile(1,-90,90,32):m.body==='cone'?[[0,0],[1,0],[0,H]]:[[0,0],[1,0],[1,H],[0,H]];
    const solid=G.revolveMesh(prof,{O:v(0,Y+(m.body==='sph'?1:0)),N:48,round:m.body==='sph'});
    const initTop=H+.15+bodyH;
    D.fit([v(-1.2,0,-1),v(3.7,0,1),v(-1.2,Math.max(initTop,BH),-1),v(3.7,Math.max(initTop,BH),1)],[],{l:32,r:24,t:65,b:100});
    // Filled water is drawn first; the continuously moving solid remains visible.
    D.body({mesh:G.revolveMesh([[0,0],[.99,0],[.99,H],[0,H]],{N:48}),fill:'sky',alpha:.14,edge:'sky',edgeW:1.1,hidden:false});
    D.body({mesh:solid,fill:col,alpha:.14,edge:col,edgeW:2.4,hidden:true});
    D.body({mesh:tank,fill:'sky',alpha:.025,edge:'ink',edgeW:2});
    D.body({mesh:cup,fill:'sky',alpha:.025,edge:'ink',edgeW:2});
    const depth=pose.displacement/(m.r*m.r*m.r*br*br);
    if(depth>1e-6)D.body({mesh:G.revolveMesh([[0,0],[br*.99,0],[br*.99,depth],[0,depth]],{O:v(bx,0),N:40}),fill:'sky',alpha:.14,edge:'sky',edgeW:1.8,hidden:false});
    D.line(v(1,H-.04),v(bx-br,H-.04),'ink',2);
    if(t>1.2&&t<5.1&&pose.displacement>0) { D.line(v(1,H-.04),v(bx-br,H-.04),'sky',4,{dash:[6,4]});D.line(v(bx-br,H-.04),v(bx-br,depth),'sky',3,{dash:[5,4]}); }
    D.tag(v(0,H),t<1.1?'가득 찬 수조':'수면 높이 유지',{dy:-14,size:12,color:'sky'});
    D.tag(v(bx,0),'넘친 물',{dy:24,size:13,color:'sky'});
    D.tag(v(0,Y+bodyH),{sph:'구',cone:'원뿔',cyl:'원기둥'}[m.body],{dy:-20,size:13,color:col});
    D.radius(v(0,0),v(1,0),`반지름 ${m.r}`,{color:'ink',size:12,dash:true});
    D.height(v(-1,0),v(-1,H),`높이 ${m.h}`,{side:{x:-1,y:0},size:12,color:'ink'});
    if(t>=5.6)D.tag(v(0,H*.5),m.target==='remain'?'남은 물':'물체가 차지한 공간',{color:m.target==='remain'?'sky':col,dy:0,size:13});
  }
  function tankFrame(t,m) {
    const name={sph:'구',cone:'원뿔',cyl:'원기둥'}[m.body];
    if(t<1.1)return{label:`물이 가득 찬 수조에 ${name}을 넣습니다.`,formula:'처음 물의 부피 = 수조의 부피'};
    if(t<5.1)return{label:'잠긴 부분만큼 물이 밀려나 옆으로 넘칩니다.',formula:'넘친 물의 부피 = 잠긴 부분의 부피'};
    if(t<6.8)return{label:`${name}이 완전히 잠겼으므로 물체 전체 부피만큼 넘쳤습니다.`,formula:`넘친 물 $=${pi(m.numerator,3)}\\;\\mathrm{cm}^3$`};
    return m.target==='over'?{label:'완전히 잠긴 물체의 부피가 넘친 물의 부피입니다.',formula:`넘친 물 $=${pi(m.numerator,3)}\\;\\mathrm{cm}^3$`}:{label:'수조 전체 공간에서 물체가 차지한 공간을 뺍니다.',formula:`남은 물 $=${pi(m.tank)}-${pi(m.numerator,3)}=${pi(m.remaining,3)}\\;\\mathrm{cm}^3$`};
  }
  const registry={
    'g7-surface-volume/sv2-4': (lab,s)=>{
      const G=typeof window==='undefined'?lab.G:window.APL_SV;
      if(!G||!lab.scene.sv?.model)return[];
      const original=lab.scene.sv.model(clone(s)),m=frustumModel(original),net=netGeometry(G,m);
      const shared={model:m,duration:9,stops:[.8,2,3.1,4.1,5.7,6.5],given:`아랫면 반지름 $${m.r2}$ · 윗면 반지름 $${m.r1}$ · 높이 $${m.hf}$ cm`};
      const surf={...shared,id:'frustum-surface',title:'원뿔대의 겉넓이',label:'겉넓이',legacyLabel:'겉넓이',given:`두 원의 반지름 $${m.r2},${m.r1}$ · 큰/작은 모선 $${m.R2},${m.R1}$ cm`,draw:(b,t,M)=>surfaceDraw(G,b,t,M,net),frame:surfaceFrame};
      const vol={...shared,id:'frustum-volume',title:'원뿔대의 부피',label:'부피',legacyLabel:'부피',given:`큰 원뿔: 반지름 $${m.r2}$·높이 $${m.h2}$ / 작은 원뿔: $${m.r1},${m.h1}$ cm`,draw:(b,t,M)=>volumeDraw(G,b,t,M),frame:volumeFrame};
      return original.mode==='vol'?[vol,surf]:[surf,vol];
    },
    'g7-surface-volume/sv3-4': (lab,s)=>{
      const G=typeof window==='undefined'?lab.G:window.APL_SV;
      if(!G||!lab.scene.sv?.model)return[];
      const original=lab.scene.sv.model(clone(s)),m=tankModel(original);
      return (original.mode==='over'?['over','remain']:['remain','over']).map(target=>({id:`tank-${target}`,title:target==='remain'?'수조에 남은 물':'수조에서 넘친 물',label:target==='remain'?'남은 물':'넘친 물',legacyLabel:target==='remain'?'남은 물':'넘친 물',duration:9,stops:[1.1,3.1,5.1,6.8],given:`수조 반지름 $${m.r}$ cm · 높이 $${m.h}$ cm · 처음에는 가득 참`,model:{...m,target},draw:(b,t,M)=>tankDraw(G,b,t,M),frame:tankFrame}));
    }
  };
  return{frustumModel,tankModel,submerged,tankPose,netGeometry,registry};
});
