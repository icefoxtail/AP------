/* Grade 7 measurement: independently constructed, current-condition visual proofs.
 * The analytic model uses rational coefficients of 1 and pi. Curved meshes are
 * drawing approximations only; no mesh area is used as an exact answer.
 * Native models are evaluated on copies. Explorer values and question seeds are
 * never changed, and the old lesson clocks/draw functions are never replayed. */
(function(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root?.APLab) return;
  root.APLab.G7ShortMeasurement = api;
  Object.assign(root.APLab.G7Shorts = root.APLab.G7Shorts || {}, api.registry);
  Object.assign(root.APLab.G7ShortInfo = root.APLab.G7ShortInfo || {}, api.lessonInfo);
})(typeof window === 'undefined' ? null : window, function() {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, DURATION = 9.8;
  const clamp = (x,a=0,b=1) => Math.max(a,Math.min(b,x));
  const ease = x => { x=clamp(x); return x*x*(3-2*x); };
  const phase = (t,a,b) => ease((t-a)/(b-a));
  const clone = x => JSON.parse(JSON.stringify(x));
  const v = (x,y,z=0) => ({x,y,z});
  const add3 = (a,b) => v(a.x+b.x,a.y+b.y,a.z+b.z);
  const sub3 = (a,b) => v(a.x-b.x,a.y-b.y,a.z-b.z);
  const mul3 = (a,k) => v(a.x*k,a.y*k,a.z*k);
  const dot3 = (a,b) => a.x*b.x+a.y*b.y+a.z*b.z;
  const cross3 = (a,b) => v(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
  const norm3 = a => Math.hypot(a.x,a.y,a.z);
  const unit3 = a => mul3(a,1/(norm3(a)||1));
  const mix3 = (a,b,u) => add3(a,mul3(sub3(b,a),u));
  const center = p => mul3(p.reduce(add3,v(0,0,0)),1/p.length);
  const gcd = (a,b) => b ? gcd(b,a%b) : Math.abs(a);
  function rational(x) {
    if (!Number.isFinite(x)) throw RangeError('A finite measurement is required');
    const sign=x<0?-1:1; x=Math.abs(x);
    let a0=0,a1=1,b0=1,b1=0,z=x;
    for(let k=0;k<20;k++) {
      const q=Math.floor(z),a=q*a1+a0,b=q*b1+b0;
      if(b>1000000)break;
      a0=a1;a1=a;b0=b1;b1=b;
      if(Math.abs(a/b-x)<1e-10)break;
      z=1/(z-q);
    }
    const g=gcd(a1,b1)||1;return[sign*a1/g,b1/g];
  }
  const fraction = (n,d=1) => {const g=gcd(n,d)||1;return[n/g,d/g];};
  const fadd = (a,b) => fraction(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
  const fmul = (a,b) => fraction(a[0]*b[0],a[1]*b[1]);
  const value = (c=0,p=0) => ({c:rational(c),p:rational(p)});
  const sum = (...vs) => vs.reduce((a,b)=>({c:fadd(a.c,b.c),p:fadd(a.p,b.p)}),value());
  const times = (a,k) => ({c:fmul(a.c,rational(k)),p:fmul(a.p,rational(k))});
  const minus = (a,b) => sum(a,times(b,-1));
  const numeric = a => a.c[0]/a.c[1]+PI*a.p[0]/a.p[1];
  const texFraction = f => f[1]===1?String(f[0]):`${f[0]<0?'-':''}\\frac{${Math.abs(f[0])}}{${f[1]}}`;
  const number = x => texFraction(rational(x));
  function tex(a) {
    const c=a.c,p=a.p;
    if(!p[0])return texFraction(c);
    const abs=Math.abs(p[0]),term=p[1]===1?`${abs===1?'':abs}\\pi`:`\\frac{${abs===1?'':abs}\\pi}{${p[1]}}`;
    return `${c[0]?texFraction(c):''}${p[0]<0?'-':c[0]?'+':''}${term}`;
  }
  function plain(a) {return tex(a).replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'$1/$2').replace(/\\pi/g,'π');}
  const unit = dim => `\\,\\mathrm{cm}${dim===1?'':`^${dim}`}`;
  const exact = (a,dim=2) => `$${tex(a)}${unit(dim)}$`;
  const textNumber = x => plain(value(x));
  const ctx = t => ({tab:'review',review:true,problem:false,lesson:false,step:0,t});
  const pointsOf = mesh => mesh.faces.flatMap(f=>f.pts);
  function prepare(b) {b.kind='figure';b.aspect='1:1';b.setPanes(null);b.setInsets({top:44,right:18,bottom:78,left:18});}
  function scene(G,b,m,t,angles) {prepare(b);return G.scene3(b,m.camera||{},ctx(t),angles||{});}
  function fit(D,points,extra=[]) {D.fit(points,extra,{l:38,r:38,t:66,b:96});}
  function body(D,mesh,color='sky',opt={}) {D.body({mesh,fill:color,alpha:.12,edge:'ink',edgeW:2.2,...opt});}
  function tag(D,p,str,color='ink',opt={}) {D.tag(p,str,{color,size:D.narrow?12:14,...opt});}
  function label2(b,p,str,color='ink',opt={}) {b.text(p,str,{color,size:b.W<560?12:15,weight:750,align:'center',baseline:'middle',...opt});}
  function measureHeight(D,h,x=0,z=0) {D.height(v(x,0,z),v(x,h,z),`높이 ${textNumber(h)}`,{size:12,side:{x:-1,y:0},color:'ink'});}
  function ring(G,r,y=0,n=48) {return G.circleBase(r,n).map(p=>v(p[0],y,p[1]));}
  function rectangle(a,b) {return[[-a/2,-b/2],[a/2,-b/2],[a/2,b/2],[-a/2,b/2]];}
  function sectorPolygon(r,degrees,n=48) {
    return[[0,0],...Array.from({length:n+1},(_,i)=>{const a=degrees*PI/180*i/n;return[r*Math.cos(a),r*Math.sin(a)];})];
  }
  function stadiumHalf(w,r,n=40) {
    // Three straight sides of the rectangle and one semicircle share a diameter.
    return[[-w,-r],[0,-r],...Array.from({length:n},(_,i)=>{const a=-PI/2+PI*(i+1)/n;return[r*Math.cos(a),r*Math.sin(a)];}),[-w,r]];
  }
  function baseFor(G,id,M) {
    if(M.bm) {
      const b=M.bm;
      const area=b.shape==='circ'?value(0,b.r*b.r):value(Math.abs(b.poly.reduce((s,p,i)=>{const q=b.poly[(i+1)%b.poly.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2);
      const perimeter=b.shape==='circ'?value(0,2*b.r):value(b.poly.reduce((s,p,i)=>{const q=b.poly[(i+1)%b.poly.length];return s+Math.hypot(q[0]-p[0],q[1]-p[1]);},0));
      return {poly:b.poly.map(p=>p.slice()),smooth:b.smooth&&b.smooth.slice(),root:b.root,name:b.name,given:b.given,area,perimeter,shape:b.shape,r:b.r,sides:b.sides&&b.sides.slice()};
    }
    if(id==='sv1-2') {
      const poly=sectorPolygon(M.r,M.th);
      return {poly,smooth:poly.map((_,i)=>i>1&&i<poly.length-1),root:0,name:'부채꼴',given:`반지름 ${M.r} cm · 중심각 ${M.th}°`,area:value(0,M.r*M.r*M.th/360),perimeter:value(2*M.r,M.r*M.th/180),shape:'sector',r:M.r,th:M.th};
    }
    if(id==='sv1-5') {
      const poly=stadiumHalf(M.w,M.r);
      return {poly,smooth:poly.map((_,i)=>i>1&&i<poly.length-2),root:poly.length-1,name:'직사각형과 반원',given:`직사각형 길이 ${M.w} cm · 반원 반지름 ${M.r} cm`,area:value(2*M.w*M.r,M.r*M.r/2),perimeter:value(2*M.w+2*M.r,M.r),shape:'halfround',r:M.r,w:M.w};
    }
    return {poly:G.circleBase(M.r,64),smooth:Array(64).fill(true),root:32,name:'원',given:`반지름 ${M.r} cm`,area:value(0,M.r*M.r),perimeter:value(0,2*M.r),shape:'circ',r:M.r};
  }
  function prismModel(G,id,M) {
    const base=baseFor(G,id,M),h=M.h;
    return {base,h,area:base.area,perimeter:base.perimeter,lateral:times(base.perimeter,h),surface:sum(times(base.area,2),times(base.perimeter,h)),volume:times(base.area,h)};
  }
  function prismGeometry(G,m) {return G.solidNet(m.base.poly,m.h,1,m.base.smooth,m.base.root);}
  function netDraw(G,b,t,m,net,start=.8,end=4) {
    const u=phase(t,start,end),yaw=(m.camera.svYaw??28)*(1-u),pitch=(m.camera.svPitch??22)*(1-u),D=scene(G,b,m,u,{yaw,pitch});
    const poses=G.netPose(net.net,u),pts=net.net.pieces.flatMap((pc,i)=>pc.pts.map(p=>G.applyT(poses[i],p)));
    fit(D,pts);
    const focus=t<4.9?'base':t<6.8?'side':'all';
    const tp=G.netDraw(D,net.net,poses,pc=>{
      const base=pc.tag==='bot'||pc.tag==='top'||pc.tag==='base';
      return {fill:base?'sky':'green',alpha:focus==='all'||(focus==='base')===base?.16:.05,edge:'ink',ew:2.1};
    });
    const at=(k,p)=>G.applyT(poses[k],p),bot=net.bot??0;
    if(u<.02&&m.h&&m.kind!=='cone') {
      const A=net.A||net.net.pieces[bot].pts,cent=m.kind?.startsWith('triangle')?m.A[0]:center(A),top=add3(cent,v(0,m.h,0));
      D.height(cent,top,`높이 ${textNumber(m.h)}`,{size:12,side:{x:-1,y:0}});
    }
    if(u>.96) {
      [net.bot,net.top].filter(k=>k>=0).forEach((k,i)=>tag(D,tp[k].c,i?'윗면':'아랫면','sky',{dy:i?-9:9}));
      const k=(net.lat||[])[Math.floor((net.lat||[]).length/2)];
      if(k!=null)tag(D,tp[k].c,'옆면','green');
    }
    return{D,poses,tp,at,u};
  }
  function prismAreaDraw(G,b,t,m) {
    const net=m.geometry||(m.geometry=prismGeometry(G,m)),q=netDraw(G,b,t,m,net);
    const {D,tp,at,u}=q,base=m.base;
    if(u<.9) {
      const c=center(net.A),rim=net.A[0];
      if(base.r)D.radius(at(net.bot,c),at(net.bot,rim),`반지름 ${base.r}`,{size:12,dash:true});
      else if(base.sides)for(let i=0;i<Math.min(2,base.sides.length);i++)D.edgeLab(at(net.bot,net.A[i]),at(net.bot,net.A[(i+1)%net.A.length]),textNumber(base.sides[i]),{size:12,from:at(net.bot,c)});
    }
    if(t>=4) {
      const k=net.bot;tag(D,tp[k].c,plain(m.area),'sky',{dy:22});
      if(net.top>=0)tag(D,tp[net.top].c,plain(m.area),'sky',{dy:22});
      const lat=net.lat.flatMap(k=>tp[k].pts),bb=G.bboxOf(lat.map(D.P));
      label2(b,{x:(bb.x0+bb.x1)/2,y:bb.y1},`둘레 ${plain(m.perimeter)}`,'green',{dy:22});
      if(t>=5.2)label2(b,{x:bb.x1,y:(bb.y0+bb.y1)/2},`높이 ${m.h}`,'green',{dx:16,align:'left',size:12});
    }
  }
  function prismAreaFrame(t,m) {
    const b=m.base;
    if(t<.8)return{label:`현재 ${b.name} 밑면과 기둥의 높이를 확인합니다.`,formula:''};
    if(t<4)return{label:'같은 면을 경첩을 따라 펼칩니다. 밑면 두 개와 옆면을 구분합니다.',formula:'겉넓이 = 두 밑면 + 옆면'};
    if(t<5.2)return{label:b.shape==='sector'?'부채꼴 둘레에는 호와 반지름 두 개가 모두 들어갑니다.':b.shape==='halfround'?'직사각형과 반원이 맞붙은 지름은 바깥 둘레에서 빠집니다.':'밑면 둘레의 각 부분이 옆면의 가로와 이어집니다.',formula:`밑넓이 $S=${tex(m.area)}$ · 밑면 둘레 $P=${tex(m.perimeter)}$`};
    if(t<6.8)return{label:'옆면 전체의 가로는 밑면의 둘레, 세로는 기둥의 높이입니다.',formula:`옆넓이 $=${tex(m.perimeter)}\\times${m.h}=${tex(m.lateral)}$`};
    return{label:'펼친 실제 면의 넓이를 모두 더합니다.',formula:`겉넓이 $=2\\times(${tex(m.area)})+(${tex(m.lateral)})=${tex(m.surface)}${unit(2)}$`};
  }
  function prismVolumeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),base=m.base,whole=G.prismMesh(base.poly,0,m.h,{simple:true,smooth:base.smooth});
    fit(D,pointsOf(whole));body(D,whole,'sky',{alpha:.035,edgeW:1.7});
    const f=phase(t,1.2,5.1),height=m.h*f;
    if(height>1e-6)body(D,G.prismMesh(base.poly,0,height,{simple:true,smooth:base.smooth}),'green',{alpha:.13,edge:'green',edgeW:1.4});
    D.panel(base.poly.map(p=>v(p[0],0,p[1])),'sky',.18,'sky',2);
    for(let j=1;j<5;j++)if(f>=j/5)D.path(base.poly.map(p=>v(p[0],m.h*j/5,p[1])),'green',1.1,{close:true,dash:[3,4],alpha:.55});
    const xs=base.poly.map(p=>p[0]),zs=base.poly.map(p=>p[1]),left=Math.min(...xs),z=Math.max(...zs);
    measureHeight(D,m.h,left,z);
    const c=center(base.poly.map(p=>v(p[0],0,p[1])));
    tag(D,c,t>=2?`밑넓이 ${plain(m.area)}`:'같은 밑면','sky',{dy:20});
    if(t>=5.1)tag(D,v(c.x,m.h*.55,c.z),'같은 단면이 높이만큼','green',{size:12});
  }
  function prismVolumeFrame(t,m) {
    if(t<1.2)return{label:'현재 밑면과 높이를 가진 기둥입니다.',formula:''};
    if(t<3.3)return{label:'어느 높이에서 잘라도 밑면과 합동인 단면이 나옵니다.',formula:`단면의 넓이 $S=${tex(m.area)}${unit(2)}$`};
    if(t<6.8)return{label:'같은 단면을 빈틈없이 채우면 기둥 전체가 됩니다.',formula:`부피 = 밑넓이 × 높이 = $(${tex(m.area)})\\times${m.h}$`};
    return{label:'높이에 따라 쌓인 양을 곱합니다.',formula:`부피 $=${tex(m.volume)}${unit(3)}$`};
  }
  function rollDraw(G,b,t,m) {
    const D=scene(G,b,m,t,{yaw:15,pitch:24}),u=phase(t,.8,5.6),theta=TAU*u,x=m.base.r*theta,r=m.base.r,h=m.h;
    const mesh=G.revolveMesh([[0,0],[r,0],[r,h],[0,h]],{N:48,axis:'z',O:v(x,r,-h/2)});
    fit(D,[v(-r,0,-h/2),v(TAU*r+r,2*r,h/2),v(-r,2*r,h/2),v(TAU*r+r,0,-h/2)]);
    if(x>1e-6)D.panel([v(0,0,-h/2),v(x,0,-h/2),v(x,0,h/2),v(0,0,h/2)],'green',.16,'green',2.3);
    body(D,mesh,'sky');
    // No-slip motion: x = r theta; the painted generator returns to contact.
    const a=-PI/2-theta,mark=v(x+r*Math.cos(a),r+r*Math.sin(a),-h/2),mark2=v(mark.x,mark.y,h/2);
    D.line(mark,mark2,'amber',3.5);D.dot(mark2,'amber',4);
    D.line(v(0,0,h/2),v(TAU*r,0,h/2),'green',2,{dash:[4,4]});
    D.radius(v(x,r,h/2),v(x+r,r,h/2),`반지름 ${r}`,{size:12});
    tag(D,v(x,r*2,0),u<.99?'표시한 선을 따라 굴립니다':'정확히 한 바퀴','amber',{dy:-20,size:12});
    if(t>=5.6)D.edgeLab(v(0,0,h/2),v(TAU*r,0,h/2),`굴린 거리 ${plain(m.perimeter)}`,{size:13,side:{x:0,y:1},color:'green'});
  }
  function rollFrame(t,m) {
    if(t<.8)return{label:'원기둥 표면에 시작 선을 표시합니다.',formula:''};
    if(t<5.6)return{label:'미끄러지지 않고 한 바퀴 굴리면 원의 둘레 한 번이 바닥에 닿습니다.',formula:'굴린 거리 = 밑면 원의 둘레'};
    return{label:'표시가 다시 바닥에 닿았습니다. 높이는 굴린 거리에 곱하지 않습니다.',formula:`거리 $=2\\pi\\times${m.base.r}=${tex(m.perimeter)}${unit(1)}$`};
  }

  function coneModel(M) {
    const r=M.r,h=M.h,l=M.R??Math.hypot(r,h);
    return {kind:'cone',name:'원뿔',r,h,l,area:value(0,r*r),perimeter:value(0,2*r),lateral:value(0,r*l),surface:value(0,r*r+r*l),volume:value(0,r*r*h/3),largeVolume:value(0,r*r*h/3),wholePrism:value(0,r*r*h)};
  }
  function squarePyramidModel(M) {
    const a=M.a2,b=M.a1,h=M.hf,l=M.lf;
    return {kind:b?'square-frustum':'square-pyramid',name:b?'사각뿔대':'사각뿔',a,b,h,l,h2:M.h2,h1:M.h1,base:rectangle(a,a),ratio:b/a,area:value(a*a),top:value(b*b),lateral:value(2*(a+b)*l),surface:value(a*a+b*b+2*(a+b)*l),largeVolume:value(a*a*M.h2/3),smallVolume:value(b*b*M.h1/3),volume:value((a*a*M.h2-b*b*M.h1)/3),wholePrism:value(a*a*h)};
  }
  function triangularPyramidModel(frustrum) {
    const ratio=frustrum?.5:0,h=frustrum?4.5:9,base=[[0,0],[6,0],[0,8]],apex=v(0,9,0),A=base.map(p=>v(p[0],0,p[1])),B=A.map(p=>mix3(p,apex,1-ratio));
    const faces=[{pts:[A[0],A[2],A[1]],tag:'bot'}];
    for(let i=0;i<3;i++)faces.push({pts:ratio?[A[i],A[(i+1)%3],B[(i+1)%3],B[i]]:[A[i],A[(i+1)%3],apex],tag:'lat'});
    if(ratio)faces.push({pts:B,tag:'top'});
    const areas=faces.map(f=>{let a=0;for(let i=1;i<f.pts.length-1;i++)a+=norm3(cross3(sub3(f.pts[i],f.pts[0]),sub3(f.pts[i+1],f.pts[0])))/2;return a;});
    return {kind:ratio?'triangle-frustum':'triangle-pyramid',name:ratio?'삼각뿔대':'삼각뿔',base,ratio,h,h2:9,h1:ratio?4.5:0,apex,faces,faceAreas:areas,A,B,area:value(24),top:value(24*ratio*ratio),lateral:value(114*(1-ratio*ratio)),surface:value(areas.reduce((a,b)=>a+b,0)),largeVolume:value(72),smallVolume:value(72*ratio**3),volume:value(72*(1-ratio**3)),wholePrism:value(24*h)};
  }
  function triangularNet(G,m) {
    const mesh=G.polyMesh(m.faces,center(m.A.concat(m.B))),pieces=mesh.faces.map((f,i)=>({pts:f.pts,n:f.n,tag:f.tag,parent:i===0?-1:i===4?1:0,hinge:i===0?null:i===4?[m.B[0],m.B[1]]:[m.A[(i-1)%3],m.A[i%3]],edges:f.pts.map((_,k)=>({i:k,kind:'c'}))}));
    return {net:G.netBuild(pieces,0),bot:0,top:m.ratio?4:-1,lat:[1,2,3],A:m.A,B:m.B};
  }
  function pyramidGeometry(G,m) {
    if(m.kind.startsWith('triangle'))return triangularNet(G,m);
    const circular=m.kind==='cone'||m.kind==='cone-frustum';
    return G.solidNet(circular?G.circleBase(m.r??m.r2,64):m.base,m.h,m.kind==='cone'?0:m.ratio,circular?Array(64).fill(true):null,circular?32:0);
  }
  function pyramidMesh(G,m) {
    if(m.kind.startsWith('triangle'))return G.polyMesh(m.faces,center(m.A.concat(m.B)));
    if(m.kind==='cone')return G.revolveMesh([[0,0],[m.r,0],[0,m.h]],{N:48,tags:['bot','lat']});
    if(m.kind==='cone-frustum')return G.revolveMesh([[0,0],[m.r2,0],[m.r1,m.h],[0,m.h]],{N:48,tags:['bot','lat','top']});
    return G.loftMesh(m.base,0,m.h,m.ratio,0,0);
  }
  function pyramidAreaDraw(G,b,t,m) {
    const net=m.geometry||(m.geometry=pyramidGeometry(G,m)),{D,tp,at,u}=netDraw(G,b,t,m,net);
    if(m.kind==='cone') {
      const c=center(net.A),ap=net.B[0];
      if(u<.9)D.radius(at(net.bot,c),at(net.bot,net.A[0]),`반지름 ${m.r}`,{dash:true,size:12});
      const side=net.lat[0];D.edgeLab(at(side,net.A[0]),at(side,ap),`모선 ${textNumber(m.l)}`,{size:12,from:tp[side].c});
      if(t>=4)tag(D,tp[net.bot].c,plain(m.area),'sky',{dy:22});
      if(t>=5.2)tag(D,tp[net.lat[Math.floor(net.lat.length/2)]].c,`호 ${plain(m.perimeter)}`,'green',{dy:20,size:12});
    } else if(m.kind.startsWith('triangle')) {
      D.edgeLab(at(0,m.A[0]),at(0,m.A[1]),'6',{from:tp[0].c,size:12});
      D.edgeLab(at(0,m.A[0]),at(0,m.A[2]),'8',{from:tp[0].c,size:12});
      if(t>=4)tp.forEach((f,i)=>{if(t>=5.2||i===0||i===4)tag(D,f.c,textNumber(m.faceAreas[i]),i===0||i===4?'sky':'green',{dy:18,size:12});});
    } else {
      const c=tp[net.bot].c;
      D.edgeLab(at(net.bot,net.A[0]),at(net.bot,net.A[1]),`한 변 ${m.a}`,{from:c,size:12});
      if(t>=4)tag(D,c,plain(m.area),'sky',{dy:22});
      if(net.top>=0&&t>=4)tag(D,tp[net.top].c,`한 변 ${m.b} · 넓이 ${plain(m.top)}`,'sky',{dy:22,size:12});
      if(t>=5.2)tag(D,tp[net.lat[0]].c,`옆면 높이 ${textNumber(m.l)}`,'green',{dy:18,size:12});
    }
  }
  function pyramidAreaFrame(t,m) {
    if(t<.8)return{label:`현재 ${m.name}의 실제 밑면과 옆면을 확인합니다.`,formula:''};
    if(t<4)return{label:'면의 길이를 바꾸지 않고 펼쳐 각 면의 모양을 확인합니다.',formula:m.kind==='cone'?'부채꼴의 반지름 = 원뿔의 모선':'밑면과 옆면은 서로 다른 면입니다.'};
    if(m.kind==='cone') {
      if(t<5.2)return{label:'부채꼴의 호는 밑면 원의 둘레와 같습니다.',formula:`호 $=2\\pi\\times${m.r}=${tex(m.perimeter)}$`};
      if(t<6.8)return{label:'부채꼴 넓이는 모선과 호의 길이의 곱의 절반입니다.',formula:`옆넓이 $=\\frac12\\times${number(m.l)}\\times${tex(m.perimeter)}=${tex(m.lateral)}$`};
    } else {
      if(t<5.2)return{label:m.ratio?'아랫면과 잘라 생긴 윗면을 각각 셉니다.':'뿔에는 밑면이 한 개입니다.',formula:`밑면 넓이 $=${tex(m.area)}${m.ratio?`+${tex(m.top)}`:''}$`};
      if(t<6.8)return{label:m.kind.startsWith('triangle')?'각 옆면의 넓이를 더합니다.':'옆면의 높이는 입체의 수직 높이와 다릅니다.',formula:m.kind.startsWith('triangle')?`옆넓이 $=${m.faceAreas.slice(1,4).map(number).join('+')}=${tex(m.lateral)}$`:`옆넓이 $=4\\times\\frac12\\times(${m.a}+${m.b})\\times${number(m.l)}=${tex(m.lateral)}$`};
    }
    return{label:'펼친 모든 겉면의 넓이를 한 번씩 더합니다.',formula:`겉넓이 $=${tex(m.area)}${m.ratio?`+${tex(m.top)}`:''}+${tex(m.lateral)}=${tex(m.surface)}${unit(2)}$`};
  }
  function pyramidVolumeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=pyramidMesh(G,m),circular=m.kind==='cone',r=circular?m.r:Math.max(...m.base.flat().map(Math.abs)),shift=D.hx((2.6*r+1)*phase(t,.8,2)),base=circular?G.circleBase(m.r,48):m.base;
    const prism=G.prismMesh(base,0,m.h,{simple:true,smooth:circular?Array(48).fill(true):null}),ref=G.xfMesh(prism,G.shiftT(shift));
    fit(D,pointsOf(mesh).concat(t>.8?pointsOf(ref):[]));
    if(t>.8)body(D,ref,'sky',{alpha:.03,edge:'muted',edgeW:1.5});
    body(D,mesh,'amber');
    const q=3*phase(t,2,6.2);
    if(q>1e-6) {
      const y=m.h*q/3,fill=G.xfMesh(G.prismMesh(base,0,y,{simple:true,smooth:circular?Array(48).fill(true):null}),G.shiftT(shift));
      body(D,fill,'green',{edge:'green',edgeW:1.5,alpha:.12});
      for(let i=1;i<3;i++)D.path(base.map(p=>add3(v(p[0],m.h*i/3,p[1]),shift)),'green',1.3,{close:true,dash:[4,4]});
      tag(D,add3(center(base.map(p=>v(p[0],m.h,p[1]))),shift),`${Math.min(3,Math.floor(q+1e-8))}번 채움`,'green',{dy:-17});
    }
    const baseC=center(base.map(p=>v(p[0],0,p[1])));
    D.height(v(0,0,0),v(0,m.h,0),`수직 높이 ${textNumber(m.h)}`,{size:12,side:{x:-1,y:0},dash:true});
    tag(D,baseC,t>=2?`밑넓이 ${plain(m.area)}`:'밑면','sky',{dy:20});
    if(t>=2)tag(D,add3(v(0,m.h*.5),shift),'같은 밑면·높이','sky',{size:12});
  }
  function pyramidVolumeFrame(t,m) {
    if(t<.8)return{label:'밑면과 그 밑면에 수직인 높이를 확인합니다.',formula:''};
    if(t<2)return{label:`${m.name}과 밑면·높이가 같은 기둥을 놓습니다.`,formula:`기둥의 부피 $=(${tex(m.area)})\\times${number(m.h)}$`};
    if(t<6.8)return{label:'뿔의 부피를 세 번 옮긴 양이 같은 밑면·높이의 기둥을 채웁니다.',formula:'뿔의 부피 = 같은 밑면·높이의 기둥 부피 ÷ 3'};
    return{label:'수직 높이를 사용해 기둥 부피의 3분의 1을 구합니다.',formula:`부피 $=\\frac13\\times(${tex(m.area)})\\times${number(m.h)}=${tex(m.volume)}${unit(3)}$`};
  }
  function cubePyramids(G,a) {
    const O=v(0,0,0),bases=[[[a,0,0],[a,a,0],[a,a,a],[a,0,a]],[[0,a,0],[a,a,0],[a,a,a],[0,a,a]],[[0,0,a],[a,0,a],[a,a,a],[0,a,a]]];
    return bases.map(list=>{const P=list.map(p=>v(...p)),faces=[{pts:P,tag:'base'},...P.map((p,i)=>({pts:[p,P[(i+1)%4],O],tag:'side'}))];return G.polyMesh(faces,center(P.concat([O])));});
  }
  function cubeThirdDraw(G,b,t,m) {
    const D=scene(G,b,m,t),parts=cubePyramids(G,m.a),u=phase(t,1.4,4.8),moves=[-1,0,1].map(k=>D.hx(k*m.a*1.7*u)),meshes=parts.map((p,i)=>G.xfMesh(p,G.shiftT(moves[i])));
    fit(D,meshes.flatMap(pointsOf));
    if(t<1.4)body(D,G.boxMesh(0,m.a,0,m.a,0,m.a),'sky',{alpha:.04});
    if(t>=.8)D.bodies(meshes.map((mesh,i)=>({mesh,fill:['sky','amber','green'][i],alpha:.12,edge:'ink',edgeW:2})));
    if(t>=4.8)meshes.forEach((mesh,i)=>tag(D,center(pointsOf(mesh)),`합동 ${i+1}`,['sky','amber','green'][i],{dy:12}));
    D.edgeLab(v(0,0,m.a),v(m.a,0,m.a),`모서리 ${m.a}`,{size:12,side:{x:0,y:1}});
  }
  function cubeThirdFrame(t,m) {
    if(t<.8)return{label:'한 꼭짓점에서 마주 보는 세 면을 밑면으로 삼습니다.',formula:''};
    if(t<4.8)return{label:'정육면체가 빈틈이나 겹침 없이 합동인 사각뿔 세 개로 나뉩니다.',formula:`정육면체의 부피 $=${m.a}^3=${tex(m.big)}$`};
    if(t<6.8)return{label:'세 뿔은 회전하면 서로 포개집니다. 한 뿔은 전체의 3분의 1입니다.',formula:'사각뿔 하나 = 정육면체 ÷ 3'};
    return{label:'세 합동 부분 중 하나의 부피를 구합니다.',formula:`사각뿔의 부피 $=${tex(m.big)}\\div3=${tex(m.volume)}${unit(3)}$`};
  }
  function frustumVolumeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=pyramidMesh(G,m),top=m.base.map(p=>[p[0]*m.ratio,p[1]*m.ratio]),cap=G.loftMesh(top,m.h,m.h2,0,0,0),u=phase(t,3.2,5.6),extent=Math.max(...m.base.flat().map(Math.abs)),shift=D.hx((2.4*extent+1)*u),moving=G.xfMesh(cap,G.shiftT(shift));
    fit(D,pointsOf(mesh).concat(t>.8?pointsOf(moving):[]));body(D,mesh,'green');
    if(t>.8)body(D,moving,'rose',{alpha:.12*phase(t,.8,1.8),edge:'rose',edgeFn:()=>({alpha:phase(t,.8,1.8)})});
    if(t>1.8) {
      D.height(v(0,0),v(0,m.h2),`큰 높이 ${textNumber(m.h2)}`,{side:{x:-1,y:0},size:12,dash:true});
      D.height(add3(v(0,m.h),shift),add3(v(0,m.h2),shift),`작은 높이 ${textNumber(m.h1)}`,{side:{x:1,y:0},size:12,color:'rose'});
    }
    tag(D,center(m.base.map(p=>v(p[0],0,p[1]))),t>=2?`큰 밑넓이 ${plain(m.area)}`:'아랫면','sky',{dy:21,size:12});
    if(t>=3.2)tag(D,add3(center(top.map(p=>v(p[0],m.h,p[1]))),shift),`작은 밑넓이 ${plain(m.top)}`,'rose',{dy:21,size:12});
  }
  function frustumVolumeFrame(t,m) {
    if(t<.8)return{label:`남은 입체는 ${m.name}입니다. 잘린 자리에 작은 뿔을 보충합니다.`,formula:''};
    if(t<3.2)return{label:'옆면을 같은 꼭짓점까지 이어 큰 뿔을 만듭니다.',formula:`큰 뿔 $=\\frac13\\times(${tex(m.area)})\\times${number(m.h2)}=${tex(m.largeVolume)}$`};
    if(t<6.8)return{label:'보충했던 같은 작은 뿔을 옆으로 꺼냅니다.',formula:`작은 뿔 $=\\frac13\\times(${tex(m.top)})\\times${number(m.h1)}=${tex(m.smallVolume)}$`};
    return{label:'전체 큰 뿔에서 잘라 낸 작은 뿔만 뺍니다.',formula:`부피 $=${tex(m.largeVolume)}-${tex(m.smallVolume)}=${tex(m.volume)}${unit(3)}$`};
  }
  function rotationConeDraw(G,b,t,m) {
    if(t>=2.2){pyramidAreaDraw(G,b,t-1.4,m);return;}
    const D=scene(G,b,m,t),theta=TAU*phase(t,.5,2.2),profile=[[0,0],[m.r,0],[0,m.h]],mesh=G.revolveMesh(profile,{N:48,a0:0,a1:Math.max(.00001,theta)});
    fit(D,[v(-m.r,0,-m.r),v(m.r,m.h,m.r)]);
    if(theta>.0001)body(D,mesh,'sky');
    D.panel([v(0,0),v(m.r,0),v(0,m.h)],'amber',.13,'amber',2.5);
    D.line(v(0,-m.h*.1),v(0,m.h*1.1),'rose',2,{dash:[5,4]});
    D.edgeLab(v(0,0),v(m.r,0),`반지름이 될 변 ${m.r}`,{size:12,side:{x:0,y:1}});
    D.height(v(0,0),v(0,m.h),`회전축 ${m.h}`,{size:12,side:{x:-1,y:0},color:'rose'});
  }
  function rotatedConeVolumeDraw(G,b,t,m) {
    if(t<2.2){rotationConeDraw(G,b,t,m);return;}
    pyramidVolumeDraw(G,b,t-1.4,m);
  }
  function rotatedConeFrame(t,m) {
    if(t<2.2)return{label:'선택한 회전축은 높이, 축에 수직인 직각변은 반지름이 됩니다.',formula:t<.5?'':`반지름 $r=${m.r}$ · 높이 $h=${m.h}$ · 모선 $l=${textNumber(m.l)}$`};
    return m.target==='volume'?pyramidVolumeFrame(Math.min(9.8,t-.8),m):pyramidAreaFrame(Math.min(9.8,t-.8),m);
  }

  // Mesh concatenation must offset face indices used by hidden-edge decisions.
  // The individual meshes stay independent mathematical parts.
  function mergeMeshes(list) {
    const faces=[],edges=[];
    for(const mesh of list){const offset=faces.length;faces.push(...mesh.faces);edges.push(...mesh.edges.map(e=>({...e,f1:e.f1>=0?e.f1+offset:e.f1,f2:e.f2>=0?e.f2+offset:e.f2})));}
    return{faces,edges};
  }
  const SPHERES={full:{fraction:1,flats:[],name:'구'},half:{fraction:.5,flats:[1],name:'반구'},quarter:{fraction:.25,flats:[.5,.5],name:'1/4 구'},eighth:{fraction:.125,flats:[.25,.25,.25],name:'1/8 구'},threequarter:{fraction:.75,flats:[.5,.5],name:'3/4이 남은 구'},seveneighth:{fraction:.875,flats:[.25,.25,.25],name:'7/8이 남은 구'}};
  function sphereModel(r,kind='full') {
    const shape=SPHERES[kind];if(!shape)throw RangeError('Unknown spherical portion');
    const curve=value(0,4*shape.fraction*r*r),flats=shape.flats.map(f=>value(0,f*r*r));
    return {kind,r,name:shape.name,fraction:shape.fraction,flatFractions:shape.flats.slice(),curve,flats,surface:sum(curve,...flats),volume:value(0,4*shape.fraction*r**3/3),wholeArea:value(0,4*r*r),wholeVolume:value(0,4*r**3/3)};
  }
  function sphereGeometry(G,m) {
    const r=m.r,N=48,n=28,full=()=>G.revolveMesh(G.sphereProfile(r,-90,90,n),{N,round:true});
    if(m.kind==='full')return full();
    if(m.kind==='half')return G.revolveMesh([[0,0],...G.sphereProfile(r,0,90,n)],{N,tags:['flat']});
    if(m.kind==='quarter')return G.revolveMesh(G.sphereProfile(r,-90,90,n),{N,a0:PI,a1:1.5*PI});
    if(m.kind==='eighth')return G.revolveMesh([...G.sphereProfile(r,-90,0,n),[0,0]],{N,a0:PI,a1:1.5*PI,tags:Array(n).fill('curve').concat('flat')});
    if(m.kind==='threequarter')return G.revolveMesh(G.sphereProfile(r,-90,90,n),{N,a0:PI/2,a1:TAU});
    const lower=G.revolveMesh(G.sphereProfile(r,-90,0,n),{N}),upper=G.revolveMesh(G.sphereProfile(r,0,90,n),{N,a0:PI/2,a1:TAU});
    // The removed upper octant exposes a horizontal quarter disk. The other
    // three quarters of the equator are interior joins, not exposed faces.
    lower.edges=lower.edges.filter(e=>!(Math.abs(e.a.y)<1e-7&&Math.abs(e.b.y)<1e-7));
    upper.edges=upper.edges.filter(e=>!(Math.abs(e.a.y)<1e-7&&Math.abs(e.b.y)<1e-7));
    const flat=[v(0,0),...Array.from({length:25},(_,i)=>v(r*Math.cos(PI/2*i/24),0,r*Math.sin(PI/2*i/24)))];
    const cap=G.polyMesh([{pts:flat,n:v(0,1),tag:'flat',cut:true}],v(0,-r/2));
    const mesh=mergeMeshes([lower,upper,cap]);mesh.silhouetteParts=[lower,upper];return mesh;
  }
  function sphericalFlats(G,m) {
    const r=m.r,n=48;
    const sector3=(u,w,angle)=>[v(0,0),...Array.from({length:n+1},(_,i)=>add3(mul3(u,r*Math.cos(angle*i/n)),mul3(w,r*Math.sin(angle*i/n))))];
    if(m.kind==='half')return[{pts:ring(G,r),n:v(0,-1),c:v(0,0)}];
    if(m.kind==='quarter'||m.kind==='threequarter') {
      const sign=m.kind==='quarter'?-1:1;
      return[{pts:sector3(v(0,-1),v(sign,0),PI),n:v(0,0,1)},{pts:sector3(v(0,-1),v(0,0,sign),PI),n:v(1,0)}].map(f=>({...f,c:center(f.pts)}));
    }
    if(m.kind==='eighth')return[
      {pts:sector3(v(-1,0),v(0,0,-1),PI/2),n:v(0,1)},
      {pts:sector3(v(-1,0),v(0,-1),PI/2),n:v(0,0,1)},
      {pts:sector3(v(0,0,-1),v(0,-1),PI/2),n:v(1,0)}
    ].map(f=>({...f,c:center(f.pts)}));
    if(m.kind==='seveneighth')return[
      {pts:sector3(v(1,0),v(0,0,1),PI/2),n:v(0,1)},
      {pts:sector3(v(1,0),v(0,1),PI/2),n:v(0,0,1)},
      {pts:sector3(v(0,0,1),v(0,1),PI/2),n:v(1,0)}
    ].map(f=>({...f,c:center(f.pts)}));
    return[];
  }
  function faceToViewer(G,D,f,u,offset=0) {
    let n=unit3(f.n),axis=cross3(n,D.vw),angle=Math.acos(clamp(dot3(n,D.vw),-1,1));
    if(norm3(axis)<1e-9)axis=v(1,0);
    const T=G.rotAbout(f.c,unit3(axis),angle*u),sh=D.hx(offset);
    return f.pts.map(p=>add3(G.applyT(T,p),sh));
  }
  function sphereCutDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=m.geometry||(m.geometry=sphereGeometry(G,m)),flats=sphericalFlats(G,m),u=phase(t,2.8,5.4),copies=flats.map((f,i)=>faceToViewer(G,D,f,u,m.r*(2.7+2.1*i)*u));
    fit(D,pointsOf(mesh).concat(copies.flat()));
    const style={faceStyle:f=>f.cut||f.tag==='flat'?{fill:'rose',alpha:t<2.8?.09:.18}:{fill:'sky',alpha:.08}};
    if(m.kind==='threequarter'||m.kind==='seveneighth')concaveBody(G,D,mesh,style);else body(D,mesh,'sky',style);
    if(t<2.8)D.radius(v(0,0),v((m.kind==='quarter'||m.kind==='eighth'?-1:1)*m.r,0),`반지름 ${m.r}`,{size:12,dash:true});
    if(u>.01)copies.forEach((pts,i)=>{
      D.panel(pts,'rose',.15*u,'rose',2.1);
      tag(D,center(pts),t>=5.4?plain(m.flats[i]):m.flatFractions[i]===1?'원':m.flatFractions[i]===.5?'반원':'사분원','rose',{dy:18,size:12});
    });
    if(t>=1.2)tag(D,v(-m.r*.45,(m.kind==='eighth'?-1:1)*m.r*.7,-m.r*.35),t>=5.4?`곡면 ${plain(m.curve)}`:'남은 곡면','sky',{dy:-22,size:12});
  }
  function sphereCutFrame(t,m) {
    if(t<1.2)return{label:`현재 ${m.name}입니다. 곡면과 절단면을 구분합니다.`,formula:''};
    if(t<2.8)return{label:'곡면만 원래 구의 해당 비율로 줄어듭니다.',formula:`곡면 $=${number(m.fraction)}\\times4\\pi\\times${m.r}^2=${tex(m.curve)}$`};
    if(t<5.4)return{label:`실제 절단면 ${m.flats.length}개를 회전해 하나씩 확인합니다.`,formula:`절단면 $=${m.flats.map(tex).join('+')}$`};
    if(t<6.8)return{label:'절단면은 새로 드러난 겉면이므로 남은 곡면에 더합니다.',formula:`겉넓이 = 곡면 + 절단면 ${m.flats.length}개`};
    return{label:'곡면의 비율과 절단면의 개수를 따로 계산합니다.',formula:`겉넓이 $=${tex(m.curve)}+(${tex(sum(...m.flats))})=${tex(m.surface)}${unit(2)}$`};
  }
  function sphereBandsDraw(G,b,t,m) {
    const D=scene(G,b,m,t,{yaw:18,pitch:18}),r=m.r,u=phase(t,.8,2),off=D.hx(3.1*r*u),sphere=sphereGeometry(G,{...m,kind:'full'}),cyl=G.revolveMesh([[0,-r],[r,-r],[r,r],[0,r]],{N:48,O:off});
    fit(D,pointsOf(sphere).concat(t>.8?pointsOf(cyl):[]));
    body(D,sphere,'sky',{alpha:.035});
    if(t>.8)body(D,cyl,'green',{alpha:.025,edge:'muted',edgeW:1.4});
    const bands=8,active=Math.min(bands-1,Math.floor(phase(t,2,5.5)*bands));
    for(let j=0;j<bands;j++) {
      if(t<2||j>active)continue;
      const y0=-r+2*r*j/bands,y1=-r+2*r*(j+1)/bands,profile=Array.from({length:5},(_,i)=>{const y=y0+(y1-y0)*i/4;return[Math.sqrt(Math.max(0,r*r-y*y)),y];});
      body(D,G.revolveMesh(profile,{N:48,cap:false}),'sky',{edge:'sky',alpha:j===active?.14:.05,edgeW:1.1});
      body(D,G.revolveMesh([[r,y0],[r,y1]],{N:48,O:off,cap:false}),'green',{edge:'green',alpha:j===active?.14:.05,edgeW:1.1});
    }
    D.radius(v(0,0),v(r,0),`반지름 ${r}`,{size:12,dash:true});
    if(t>=2) {
      D.height(add3(v(r,-r),off),add3(v(r,r),off),`높이 ${2*r}`,{size:12,side:{x:1,y:0},color:'green'});
      tag(D,v(0,r),'구의 띠','sky',{dy:-18});tag(D,add3(v(0,r),off),'같은 높이의 원기둥 띠','green',{dy:-18,size:12});
    }
  }
  function sphereBandsFrame(t,m) {
    if(t<.8)return{label:'구를 같은 높이의 아주 얇은 띠들로 나눠 봅니다.',formula:''};
    if(t<2)return{label:'반지름이 같고 높이가 지름인 원기둥을 나란히 놓습니다.',formula:`원기둥 반지름 ${m.r} cm · 높이 ${2*m.r} cm`};
    if(t<5.5)return{label:'구의 띠는 둘레가 짧은 만큼 더 기울어져 폭이 넓어집니다. 두 띠의 넓이는 같습니다.',formula:'얇은 띠 넓이: $2\\pi\\rho\\times\\frac{r}{\\rho}\\Delta h=2\\pi r\\Delta h$'};
    if(t<6.8)return{label:'같은 넓이의 띠를 모두 더하면 원기둥의 옆면 넓이입니다.',formula:`구의 겉넓이 = 원기둥 옆넓이 = $(2\\pi\\times${m.r})\\times${2*m.r}$`};
    return{label:'구의 겉넓이는 같은 반지름인 원 네 개의 넓이와 같습니다.',formula:`겉넓이 $=4\\pi\\times${m.r}^2=${tex(m.surface)}${unit(2)}$`};
  }
  // Horizontal-section equality: hemisphere area pi(r²-y²) equals a cylinder
  // with the upward widening cone removed. Both have height r.
  function sphereSectionArea(r,y) {return PI*Math.max(0,r*r-y*y);}
  function sphereVolumeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),r=m.r,original=sphereGeometry(G,m),u=phase(t,.8,2),off=D.hx(3.1*r*u),cyl=G.revolveMesh([[0,0],[r,0],[r,r],[0,r]],{N:48,O:off}),cone=G.revolveMesh([[0,0],[r,r],[0,r]],{N:48,O:off});
    fit(D,pointsOf(original).concat(t>.8?pointsOf(cyl):[]));body(D,original,'sky',{alpha:.06});
    if(t>.8){body(D,cyl,'green',{alpha:.03,edge:'green',edgeW:1.7});body(D,cone,'rose',{alpha:.08,edge:'rose',edgeW:1.7});}
    if(t>=2) {
      const y=r*(.15+.7*phase(t,2,5.5)),rho=Math.sqrt(r*r-y*y);
      D.disc(v(0,y),v(1,0),v(0,0,1),rho,'amber',.2,'amber',2);
      const outer=ring(G,r,y),inner=ring(G,y,y);
      for(let i=0;i<outer.length;i++){const j=(i+1)%outer.length;D.panel([outer[i],outer[j],inner[j],inner[i]].map(p=>add3(p,off)),'amber',.1);}
      D.path(outer.map(p=>add3(p,off)),'amber',2,{close:true});D.path(inner.map(p=>add3(p,off)),'rose',1.5,{close:true});
      tag(D,v(0,r),'반구의 단면','sky',{dy:-20,size:12});tag(D,add3(v(0,r),off),'원기둥 − 원뿔','green',{dy:-20,size:12});
    }
    D.radius(v(0,0),v(r,0),`반지름 ${r}`,{dash:true,size:12});
  }
  function sphereVolumeFrame(t,m) {
    const half=value(0,2*m.r**3/3);
    if(t<.8)return{label:`현재 ${m.name}의 반지름을 확인합니다.`,formula:''};
    if(t<2)return{label:'반구와 높이가 같은 원기둥에서 원뿔을 뺀 모양을 비교합니다.',formula:`세 도형의 반지름과 높이 $r=${m.r}$`};
    if(t<5.5)return{label:'어느 높이에서 잘라도 원과 고리의 단면 넓이가 같습니다.',formula:'같은 높이의 단면: $\\pi(r^2-y^2)=\\pi r^2-\\pi y^2$'};
    if(t<6.8)return{label:'높이와 모든 단면의 넓이가 같으므로 부피도 같습니다.',formula:`반구 $=\\pi\\times${m.r}^3-\\frac13\\pi\\times${m.r}^3=${tex(half)}$`};
    return{label:m.kind==='full'?'합동인 반구 두 개를 합쳐 구의 부피를 구합니다.':'반구는 구 전체 부피의 절반입니다.',formula:`${m.kind==='full'?'구':'반구'}의 부피 $=${m.kind==='full'?`2\\times${tex(half)}=`:''}${tex(m.volume)}${unit(3)}$`};
  }
  function remainderVolumeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=m.geometry||(m.geometry=sphereGeometry(G,m)),removed=G.revolveMesh(m.kind==='threequarter'?G.sphereProfile(m.r,-90,90,28):[[0,0],...G.sphereProfile(m.r,0,90,28)],{N:48,a0:0,a1:PI/2}),u=phase(t,1.2,4.5),off=D.hx(3.2*m.r*u),piece=G.xfMesh(removed,G.shiftT(off));
    fit(D,pointsOf(mesh).concat(t>1.2?pointsOf(piece):[]));concaveBody(G,D,mesh,{fill:'green'});
    if(t>1.2)body(D,piece,'rose',{alpha:.1*phase(t,1.2,2),edge:'rose',edgeFn:()=>({alpha:phase(t,1.2,2)})});
    D.radius(v(0,0),v(m.r,0),`반지름 ${m.r}`,{size:12,dash:true});
    if(t>=4.5){tag(D,add3(v(0,m.r),off),`뺀 부피: 전체의 ${plain(value(1-m.fraction))}`,'rose',{dy:-18,size:12});tag(D,v(0,m.r),`남은 부피: 전체의 ${plain(value(m.fraction))}`,'green',{dy:-18,size:12});}
  }
  function remainderVolumeFrame(t,m) {
    if(t<1.2)return{label:'서로 수직인 중심 절단면이 구를 같은 부피의 부분들로 나눕니다.',formula:''};
    if(t<4.5)return{label:`전체 중 ${plain(value(1-m.fraction))}을 잘라 낸 상태입니다.`,formula:`전체 구의 부피 $=\\frac43\\pi\\times${m.r}^3=${tex(m.wholeVolume)}$`};
    if(t<6.8)return{label:'새로 생긴 절단면은 넓이를 바꾸지만 부피를 더하지는 않습니다.',formula:`남은 부피 $=(${tex(m.wholeVolume)})\\times${number(m.fraction)}$`};
    return{label:'실제로 남은 부분의 비율만 곱합니다.',formula:`부피 $=${tex(m.volume)}${unit(3)}$`};
  }
  function sphereInverseDraw(G,b,t,m) {
    if(t>=4){if(m.kind==='full')sphereBandsDraw(G,b,t-2,m);else sphereCutDraw(G,b,t-1.3,m);return;}
    const D=scene(G,b,m,t),mesh=sphereGeometry(G,m);fit(D,pointsOf(mesh));body(D,mesh,'sky');
    D.radius(v(0,0),v(m.r,0),t<3?'반지름 r':`반지름 ${m.r}`,{size:14,dash:true,color:'amber'});
    tag(D,v(0,m.r),`주어진 부피 ${plain(m.volume)}`,'sky',{dy:-22});
  }
  function sphereInverseFrame(t,m) {
    const k=m.kind==='full'?4/3:2/3;
    if(t<.8)return{label:'주어진 것은 부피입니다. 반지름 r부터 구합니다.',formula:''};
    if(t<2)return{label:'현재 구 또는 반구의 부피식을 세웁니다.',formula:`${number(k)}\\pi r^3=${tex(m.volume)}`};
    if(t<3)return{label:'양변에서 같은 계수를 나눕니다.',formula:`$r^3=${m.r**3}$`};
    if(t<4)return{label:'세 번 곱해서 주어진 수가 되는 양의 길이를 찾습니다.',formula:`$${m.r}\\times${m.r}\\times${m.r}=${m.r**3}\\quad\\Rightarrow\\quad r=${m.r}$`};
    if(t<6.8)return{label:m.kind==='half'?'찾은 반지름으로 곡면과 자른 원을 각각 구합니다.':'찾은 반지름으로 구의 겉넓이를 구합니다.',formula:`겉넓이 $=${m.kind==='full'?4:3}\\pi\\times${m.r}^2$`};
    return{label:'부피로 구한 반지름을 겉넓이 식에 대입했습니다.',formula:`겉넓이 $=${tex(m.surface)}${unit(2)}$`};
  }
  function displaced(r,h,kind,depth) {
    const H=kind==='sph'?2*r:h,d=clamp(depth,0,H);
    return kind==='sph'?PI*d*d*(r-d/3):kind==='cone'?PI*r*r*(d-d*d/h+d*d*d/(3*h*h)):PI*r*r*d;
  }
  function overflowDraw(G,b,t,m) {
    const D=scene(G,b,m,t,{yaw:0,pitch:16}),r=m.r,h=m.h,H=m.body==='sph'?2*r:h,y=(h+.12*r)*(1-phase(t,1.2,5.5)),off=v(3*r,0),cupR=.85*r,amount=displaced(r,h,m.body,h-y),depth=amount/(PI*cupR*cupR),cupH=numeric(m.volume)/(PI*cupR*cupR)+r*.3;
    const tank=G.revolveMesh([[0,0],[r,0],[r,h]],{N:48}),cup=G.revolveMesh([[0,0],[cupR,0],[cupR,cupH]],{N:48,O:off});
    const profile=m.body==='sph'?G.sphereProfile(r,-90,90,28):m.body==='cone'?[[0,0],[r,0],[0,h]]:[[0,0],[r,0],[r,h],[0,h]],solid=G.revolveMesh(profile,{N:48,O:v(0,y+(m.body==='sph'?r:0)),round:m.body==='sph'});
    fit(D,[v(-r,0,-r),v(4*r,Math.max(h+H+.2*r,cupH),r)]);
    body(D,G.revolveMesh([[0,0],[r*.99,0],[r*.99,h],[0,h]],{N:40}),'sky',{alpha:.07,edge:'sky',edgeW:1.1,hidden:false});
    body(D,solid,'amber');body(D,tank,'sky',{alpha:.025});body(D,cup,'sky',{alpha:.025});
    if(depth>1e-8)body(D,G.revolveMesh([[0,0],[cupR,0],[cupR,depth],[0,depth]],{N:40,O:off}),'sky',{alpha:.14,edge:'sky',edgeW:1.4});
    if(t>1.2&&t<5.5&&amount>0)D.line(v(r,h),v(3*r-cupR,h),'sky',3,{dash:[6,4]});
    D.radius(v(0,0),v(r,0),`반지름 ${r}`,{size:12,dash:true});measureHeight(D,h,-r,0);
    tag(D,v(0,y+H),m.name,'amber',{dy:-18});tag(D,off,'넘친 물','sky',{dy:22});
  }
  function overflowFrame(t,m) {
    if(t<1.2)return{label:`가득 찬 수조에 현재 선택한 ${m.name}을 완전히 넣습니다.`,formula:''};
    if(t<5.5)return{label:'잠긴 부분이 차지한 공간만큼 물이 밖으로 밀려납니다.',formula:'넘친 물의 부피 = 잠긴 물체의 부피'};
    if(t<6.8)return{label:m.h===2*m.r?'높이가 지름일 때 같은 반지름인 원뿔·구·원기둥의 부피비는 1:2:3입니다.':'현재 수조 높이는 지름과 다릅니다. 실제 높이로 원뿔·원기둥의 부피를 계산합니다.',formula:m.h===2*m.r?'원뿔 : 구 : 원기둥 = $1:2:3$':`수조 높이 $h=${m.h}$ · 구의 지름 $2r=${2*m.r}$`};
    return{label:`${m.name}이 완전히 잠겼으므로 그 전체 부피가 넘쳤습니다.`,formula:`넘친 물 $=${tex(m.volume)}${unit(3)}$`};
  }

  function coneFrustumModel(G,M) {
    const r2=M.r2,r1=M.r1,h=M.h??(M.h2-M.h1),h2=M.h2,h1=M.h1,l2=M.R2,l1=M.R1;
    return {kind:'cone-frustum',name:'원뿔대',r2,r1,h,h2,h1,l2,l1,l:l2-l1,ratio:r1/r2,base:G.circleBase(r2,64),area:value(0,r2*r2),top:value(0,r1*r1),lateral:value(0,r2*l2-r1*l1),surface:value(0,r2*r2+r1*r1+r2*l2-r1*l1),largeVolume:value(0,r2*r2*h2/3),smallVolume:value(0,r1*r1*h1/3),volume:value(0,(r2*r2*h2-r1*r1*h1)/3)};
  }
  function coneFrustumAreaDraw(G,b,t,m) {
    const net=m.geometry||(m.geometry=pyramidGeometry(G,m)),{D,tp,at,u}=netDraw(G,b,t,m,net);
    const bc=center(net.A),tc=center(net.B);
    D.radius(at(net.bot,bc),at(net.bot,net.A[0]),`반지름 ${m.r2}`,{size:12,dash:u<.2});
    D.radius(at(net.top,tc),at(net.top,net.B[0]),`반지름 ${m.r1}`,{size:12});
    if(t>=4) {
      tag(D,tp[net.bot].c,plain(m.area),'sky',{dy:23});tag(D,tp[net.top].c,plain(m.top),'sky',{dy:23});
      const k=net.lat[Math.floor(net.lat.length/2)];tag(D,tp[k].c,`모선 차 ${textNumber(m.l)}`,'green',{dy:18,size:12});
    }
  }
  function coneFrustumAreaFrame(t,m) {
    if(t<.8)return{label:'사다리꼴을 돌려 생긴 원뿔대의 두 밑면을 확인합니다.',formula:''};
    if(t<4)return{label:'옆면을 펼치면 큰 부채꼴에서 작은 부채꼴을 뺀 고리 모양입니다.',formula:`큰 모선 ${textNumber(m.l2)} cm · 작은 모선 ${textNumber(m.l1)} cm`};
    if(t<6.8)return{label:'같은 중심각인 부채꼴 두 개의 차로 옆넓이를 구합니다.',formula:`옆넓이 $=\\pi\\times${m.r2}\\times${number(m.l2)}-\\pi\\times${m.r1}\\times${number(m.l1)}=${tex(m.lateral)}$`};
    return{label:'고리 모양 옆면에 두 원의 넓이를 더합니다.',formula:`겉넓이 $=${tex(m.lateral)}+${tex(m.area)}+${tex(m.top)}=${tex(m.surface)}${unit(2)}$`};
  }
  function component(kind,o) {
    const c={kind,...o},r=o.r,h=o.h,a=o.a,l=o.l;
    if(kind==='cylinder'){c.surface=value(0,2*r*r+2*r*h);c.volume=value(0,r*r*h);c.baseArea=value(0,r*r);c.name='원기둥';}
    else if(kind==='cone'){c.surface=value(0,r*r+r*l);c.volume=value(0,r*r*h/3);c.baseArea=value(0,r*r);c.name='원뿔';}
    else if(kind==='hemisphere'){c.surface=value(0,3*r*r);c.volume=value(0,2*r**3/3);c.baseArea=value(0,r*r);c.name='반구';}
    else if(kind==='box'){c.surface=value(2*a*a+4*a*h);c.volume=value(a*a*h);c.baseArea=value(a*a);c.name='사각기둥';}
    else if(kind==='pyramid'){c.surface=value(a*a+2*a*l);c.volume=value(a*a*h/3);c.baseArea=value(a*a);c.name='사각뿔';}
    return c;
  }
  function componentMesh(G,c) {
    const y=c.y||0;
    if(c.kind==='box')return G.boxMesh(-c.a/2,c.a/2,y,y+c.h,-c.a/2,c.a/2);
    if(c.kind==='pyramid')return G.loftMesh(rectangle(c.a,c.a),y,y+c.h,0);
    let profile;
    if(c.kind==='cylinder')profile=[[0,y],[c.r,y],[c.r,y+c.h],[0,y+c.h]];
    else if(c.kind==='cone')profile=c.down?[[0,y-c.h],[c.r,y],[0,y]]:[[0,y],[c.r,y],[0,y+c.h]];
    else profile=c.down?[...G.sphereProfile(c.r,-90,0,28).map(([r,h])=>[r,h+y]),[0,y]]:[[0,y],...G.sphereProfile(c.r,0,90,28).map(([r,h])=>[r,h+y])];
    return G.revolveMesh(profile,{N:48});
  }
  function joinedModel(id,M) {
    let parts,joins,given;
    const roundJoin=(r,y,lower,upper)=>({kind:'circle',r,y,lower,upper,area:value(0,r*r)});
    if(id==='sv4-2') {
      parts=[component('cylinder',{r:M.hh,h:M.a,y:0}),component('cone',{r:M.hh,h:M.p,l:M.c,y:M.a})];joins=[roundJoin(M.hh,M.a,0,1)];
      given=`사다리꼴 긴 밑변 ${M.b} cm · 짧은 밑변 ${M.a} cm · 높이 ${M.hh} cm · 긴 밑변이 회전축`;
    } else if(id==='sv4-3') {
      parts=[component('cone',{r:M.r,h:M.h2,l:M.R2,y:0,down:true}),component('cone',{r:M.r,h:M.h1,l:M.R1,y:0})];joins=[roundJoin(M.r,0,0,1)];
      given=`공통 반지름 ${M.r} cm · 두 높이 ${M.h1}, ${M.h2} cm · 두 모선 ${M.R1}, ${M.R2} cm`;
    } else if(id==='sv4-4') {
      parts=[component('hemisphere',{r:M.r,y:0,down:true}),component('cylinder',{r:M.r,h:M.H,y:0}),component('cone',{r:M.r,h:M.hc,l:M.R,y:M.H})];joins=[roundJoin(M.r,0,0,1),roundJoin(M.r,M.H,1,2)];
      given=`반지름 ${M.r} cm · 원기둥 높이 ${M.H} cm · 원뿔 높이 ${M.hc} cm, 모선 ${M.R} cm · 아래 반구`;
    } else if(id==='sv5-6') {
      const top=M.top==='cyl'?component('cylinder',{r:M.r,h:M.z,y:M.H}):M.top==='hemi'?component('hemisphere',{r:M.r,y:M.H}):component('cone',{r:M.r,h:M.hc,l:M.R,y:M.H});
      parts=[component('box',{a:M.a,h:M.H,y:0}),top];joins=[roundJoin(M.r,M.H,0,1)];
      given=`정사각기둥: 밑변 ${M.a} cm, 높이 ${M.H} cm · 위 ${top.name}: 반지름 ${M.r} cm${top.h?`, 높이 ${top.h} cm`:''}${top.l?`, 모선 ${top.l} cm`:''}`;
    } else {
      const square=M.kind==='pyramid';
      parts=[square?component('box',{a:M.a,h:M.h,y:0}):component('cylinder',{r:M.r,h:M.h,y:0}),square?component('pyramid',{a:M.a,h:M.topH,l:M.l,y:M.h}):M.kind==='cone'?component('cone',{r:M.r,h:M.topH,l:M.l,y:M.h}):component('hemisphere',{r:M.r,y:M.h})];
      joins=[square?{kind:'square',a:M.a,y:M.h,lower:0,upper:1,area:value(M.a*M.a)}:roundJoin(M.r,M.h,0,1)];
      given=`${M.name} · ${square?`밑면 한 변 ${M.a}`:`공통 반지름 ${M.r}`} cm · 기둥 높이 ${M.h} cm${M.kind==='hemi'?'':` · 뿔 높이 ${M.topH} cm, 옆면 높이/모선 ${M.l} cm`}`;
    }
    const hidden=times(sum(...joins.map(j=>j.area)),2),closed=sum(...parts.map(p=>p.surface));
    return{parts,joins,name:parts.map(p=>p.name).join(' + '),given,closed,hidden,surface:minus(closed,hidden),volume:sum(...parts.map(p=>p.volume))};
  }
  function joinedDraw(G,b,t,m) {
    const D=scene(G,b,m,t),u=phase(t,1.1,4.3),extent=Math.max(...m.parts.map(p=>p.r||p.a/2)),offsets=m.parts.map((_,i)=>D.hx(i*(2.6*extent+1)*u)),meshes=m.parts.map((p,i)=>G.xfMesh(componentMesh(G,p),G.shiftT(offsets[i])));
    fit(D,meshes.flatMap(pointsOf));
    D.bodies(meshes.map((mesh,i)=>({mesh,fill:['sky','amber','green'][i],alpha:.1,edge:'ink',edgeW:2.1,dashBack:e=>{const j=m.joins.find(j=>(j.lower===i||j.upper===i)&&Math.abs(e.a.y-j.y)<1e-7&&Math.abs(e.b.y-j.y)<1e-7);return j&&u<.01?add3(v(0,j.y),offsets[i]):null;}})));
    if(t>=1.1)m.joins.forEach(j=>[j.lower,j.upper].forEach((i,k)=>{
      const pts=j.kind==='circle'?ring(G,j.r,j.y):rectangle(j.a,j.a).map(p=>v(p[0],j.y,p[1])),moved=pts.map(p=>add3(p,offsets[i]));
      D.panel(moved,m.target==='volume'?'muted':'rose',m.target==='volume'?.035:.16,'rose',1.7,{dash:[4,4]});
      if(t>=4.3&&m.target!=='volume')tag(D,center(moved),`붙은 면 ${plain(j.area)}`,'rose',{dy:k?-15:18,size:12});
    }));
    if(t>=4.3)m.parts.forEach((p,i)=>{
      const c=center(pointsOf(meshes[i]));tag(D,c,m.target==='volume'?`${p.name} ${t>=5.5?plain(p.volume):''}`:p.name,['sky','amber','green'][i],{dy:-12,size:12});
    });
  }
  function joinedFrame(t,m) {
    if(t<1.1)return{label:`현재 ${m.name}을 이루는 실제 부분을 확인합니다.`,formula:''};
    if(t<4.3)return{label:m.target==='volume'?'입체를 가로로 분리합니다. 서로 겹친 부피는 없습니다.':'입체를 가로로 분리하면 붙어 있던 같은 면이 양쪽에서 드러납니다.',formula:m.target==='volume'?'전체 부피 = 각 입체의 부피의 합':`붙은 자리 ${m.joins.length}곳 · 각 자리에서 두 면 제외`};
    if(t<6.8)return{label:m.target==='volume'?'각 입체의 부피를 원래 치수로 구합니다.':'분리한 입체들의 겉넓이 합에서 맞붙은 두 면씩을 뺍니다.',formula:m.target==='volume'?m.parts.map(p=>`${p.name} $${tex(p.volume)}$`).join(' · '):`겉넓이 $=(${m.parts.map(p=>tex(p.surface)).join('+')})-${tex(m.hidden)}$`};
    return{label:m.target==='volume'?'붙인 면은 넓이만 있으며 따로 더하거나 뺄 부피가 없습니다.':'붙어 내부로 숨은 면을 제외한 바깥 겉면만 남겼습니다.',formula:`${m.target==='volume'?'부피':'겉넓이'} $=${tex(m.target==='volume'?m.volume:m.surface)}${unit(m.target==='volume'?3:2)}$`};
  }
  function trapezoidAxes(G,M) {
    // Both axis constructions come from one trapezoid. The native explorer
    // stores separate slider families; the other family's stale slider is not used.
    const a=M.axis==='leg'?M.r1:M.a,k=M.k,b=a+3*k,h=4*k;
    const frustum=coneFrustumModel(G,{r1:a,r2:b,h,h1:4*a/3,h2:4*b/3,R1:5*a/3,R2:5*b/3});
    const composite=joinedModel('sv4-2',{a,b,hh:h,p:3*k,c:5*k});
    return {a,b,h,k,currentAxis:M.axis,frustum,composite};
  }
  function axesDraw(G,b,t,m) {
    const D=scene(G,b,m,t,{yaw:24,pitch:20}),a=m.a,wide=m.b,h=m.h,first=phase(t,.8,3.4),second=phase(t,3.7,6.1),off=D.hx((wide+2*h)*phase(t,3.4,4.2));
    const trapezoid=[v(0,0),v(wide,0),v(a,h),v(0,h)],frus=G.revolveMesh([[0,0],[wide,0],[a,h],[0,h]],{N:48,a0:0,a1:Math.max(1e-5,TAU*first)}),other=G.revolveMesh([[0,0],[h,0],[h,a],[0,wide]],{N:48,a0:0,a1:Math.max(1e-5,TAU*second),axis:'x',O:off});
    fit(D,t<3.4?[v(-wide,0,-wide),v(wide,h,wide)]:pointsOf(frus).concat(pointsOf(other)));
    if(t<.8)D.panel(trapezoid,'sky',.1,'ink',2.4);else body(D,frus,'sky');
    if(t<3.4){D.line(v(0,-h*.1),v(0,h*1.15),'rose',2,{dash:[4,4]});D.edgeLab(v(0,0),v(wide,0),`긴 밑변 ${wide}`,{size:12,side:{x:0,y:1}});D.edgeLab(v(0,h),v(a,h),`짧은 밑변 ${a}`,{size:12,side:{x:0,y:-1}});D.height(v(0,0),v(0,h),`높이 ${h}`,{side:{x:-1,y:0},size:12});}
    if(t>=3.4) {
      if(second<.00001)D.panel([v(0,0),v(0,h),v(a,h),v(wide,0)].map(p=>add3(p,off)),'amber',.1,'ink',2.2);else body(D,other,'amber');
      D.line(add3(v(-h*.1,0),off),add3(v(wide+h*.1,0),off),'rose',2,{dash:[4,4]});
      tag(D,v(0,h),'수직변을 축으로','sky',{dy:-20,size:12});tag(D,add3(v(wide/2,h),off),'긴 밑변을 축으로','amber',{dy:-20,size:12});
    }
  }
  function axesFrame(t,m) {
    if(t<.8)return{label:'현재 사다리꼴의 치수를 고정하고 두 회전축을 비교합니다.',formula:''};
    if(t<3.4)return{label:'평행한 두 변에 수직인 변을 축으로 돌리면 원뿔대입니다.',formula:`반지름 ${m.a}, ${m.b} cm · 높이 ${m.h} cm`};
    if(t<6.8)return{label:'같은 사다리꼴의 긴 밑변을 축으로 돌리면 원기둥과 원뿔이 붙습니다.',formula:`공통 반지름 ${m.h} cm · 기둥 높이 ${m.a} cm · 뿔 높이 ${m.b-m.a} cm`};
    return{label:'같은 평면도형도 축이 달라지면 반지름·높이와 부피가 달라집니다.',formula:`수직변 축 $V=${tex(m.frustum.volume)}${unit(3)}$ · 긴 밑변 축 $V=${tex(m.composite.volume)}${unit(3)}$`};
  }
  function rotationTrapezoidDraw(G,b,t,m) {
    if(t>=2.2&&m.currentAxis==='base'&&t<3) {
      const D=scene(G,b,m,t),closed=G.revolveMesh([[0,0],[m.h,0],[m.h,m.a],[0,m.b]],{N:48,axis:'x'}),rotation=G.rotAbout(v(0,0),v(0,0,1),PI/2*phase(t,2.2,3)),turned=G.xfMesh(closed,rotation);
      fit(D,pointsOf(turned));body(D,turned,'sky');tag(D,center(pointsOf(turned)),'같은 입체를 돌려 세웁니다','ink',{dy:-22,size:12});return;
    }
    if(t>=2.2) {
      if(m.proof.kind==='cone-frustum'){if(m.target==='volume')frustumVolumeDraw(G,b,t-1.4,m.proof);else coneFrustumAreaDraw(G,b,t-1.4,m.proof);}
      else joinedDraw(G,b,t-2,m.proof);
      return;
    }
    const D=scene(G,b,m,t),a=m.a,wide=m.b,h=m.h,leg=m.currentAxis==='leg',profile=leg?[[0,0],[wide,0],[a,h],[0,h]]:[[0,0],[h,0],[h,a],[0,wide]],theta=TAU*phase(t,.5,2.2),mesh=G.revolveMesh(profile,{N:48,a0:0,a1:Math.max(1e-5,theta),axis:leg?'y':'x'});
    const poly=[v(0,0),v(wide,0),v(a,h),v(0,h)];fit(D,pointsOf(mesh).concat(poly));
    if(theta>.0001)body(D,mesh,'sky');D.panel(poly,'amber',.1,'amber',2.2);
    D.line(leg?v(0,-h*.1):v(-wide*.1,0),leg?v(0,h*1.1):v(wide*1.1,0),'rose',2,{dash:[4,4]});
    D.edgeLab(poly[0],poly[1],`긴 밑변 ${wide}`,{size:12,side:{x:0,y:1}});D.edgeLab(poly[2],poly[3],`짧은 밑변 ${a}`,{size:12,side:{x:0,y:-1}});
  }
  function rotationTrapezoidFrame(t,m) {
    if(t<2.2)return{label:m.currentAxis==='leg'?'현재 수직변을 축으로 회전해 원뿔대를 만듭니다.':'현재 긴 밑변을 축으로 회전해 원기둥과 원뿔을 만듭니다.',formula:t<.5?'':`같은 사다리꼴: 두 밑변 ${m.a}, ${m.b} cm · 높이 ${m.h} cm`};
    return m.proof.kind==='cone-frustum'?(m.target==='volume'?frustumVolumeFrame(t-.8,m.proof):coneFrustumAreaFrame(t-.8,m.proof)):joinedFrame(t-.8,m.proof);
  }

  function holeModel(id,M) {
    const a=M.a,h=M.h,kind=id==='sv5-1'?'ct':M.kind,round=kind==='ct'||kind==='cb',through=kind==='ct'||kind==='st',size=id==='sv5-1'?M.q:M.size,d=through?h:M.d;
    const opening=round?value(0,size*size):value(size*size),perimeter=round?value(0,2*size):value(4*size),removed=times(opening,through?2:1),wall=times(perimeter,d),added=sum(wall,through?value():opening),outer=value(2*a*a+4*a*h);
    return {kind,a,h,size,d,round,through,opening,perimeter,removed,wall,added,outer,surface:sum(outer,times(removed,-1),added),name:round?(through?'관통 원 구멍':'막힌 원 구멍'):(through?'관통 정사각 구멍':'막힌 정사각 구멍')};
  }
  function circleHoleMesh(G,m,N=64) {
    const a=m.a/2,r=m.size,h=m.h,y0=h-m.d,outer=G.boxMesh(-a,a,0,h,-a,a),faces=outer.faces.filter(f=>f.tag==='side'||(f.tag==='bot'&&!m.through)).map(f=>({...f,tag:'out'}));
    const outerRing=Array.from({length:N},(_,i)=>{const th=TAU*i/N,c=Math.cos(th),s=Math.sin(th),rad=a/Math.max(Math.abs(c),Math.abs(s));return[rad*c,rad*s];});
    const inner=G.circleBase(r,N);
    const annulus=(y,ny)=>{for(let i=0;i<N;i++){const j=(i+1)%N;faces.push({pts:[outerRing[i],outerRing[j],inner[j],inner[i]].map(p=>v(p[0],y,p[1])),n:v(0,ny),tag:'out'});}};
    annulus(h,1);if(m.through)annulus(0,-1);
    for(let i=0;i<N;i++){const j=(i+1)%N,th=TAU*(i+.5)/N;faces.push({pts:[v(...[inner[i][0],y0,inner[i][1]]),v(inner[j][0],y0,inner[j][1]),v(inner[j][0],h,inner[j][1]),v(inner[i][0],h,inner[i][1])],n:v(-Math.cos(th),0,-Math.sin(th)),tag:'wall'});}
    if(!m.through)faces.push({pts:inner.map(p=>v(p[0],y0,p[1])),n:v(0,1),tag:'floor'});
    const mesh=G.polyMesh(faces,v(0,h/2));
    mesh.edges=mesh.edges.filter(e=>{
      const a=mesh.faces[e.f1],b=mesh.faces[e.f2];
      if(a&&b&&dot3(a.n,b.n)>1-1e-9)return false;
      if(a?.tag==='wall'&&b?.tag==='wall')e.smooth=true;
      return true;
    });return mesh;
  }
  function holeMesh(G,m) {
    if(m.round)return circleHoleMesh(G,m);
    const A=m.a/2,q=m.size/2;return G.boxMinusBoxes([-A,A,0,m.h,-A,A],[[-q,q,m.h-m.d,m.h,-q,q]]);
  }
  function triangleRayDistance(p,d,a,b,c) {
    const ab=sub3(b,a),ac=sub3(c,a),h=cross3(d,ac),det=dot3(ab,h);
    if(Math.abs(det)<1e-10)return Infinity;
    const inv=1/det,s=sub3(p,a),u=dot3(s,h)*inv;if(u<-.000001||u>1.000001)return Infinity;
    const q=cross3(s,ab),w=dot3(d,q)*inv;if(w<-.000001||u+w>1.000001)return Infinity;
    const t=dot3(ac,q)*inv;return t>1e-6?t:Infinity;
  }
  function meshTriangles(mesh) {return mesh.faces.flatMap((f,k)=>Array.from({length:Math.max(0,f.pts.length-2)},(_,i)=>({a:f.pts[0],b:f.pts[i+1],c:f.pts[i+2],face:k})));}
  function isOccluded(mesh,p,view,skip=[]) {
    const triangles=mesh._triangles||(mesh._triangles=meshTriangles(mesh));
    return triangles.some(t=>!skip.includes(t.face)&&triangleRayDistance(p,view,t.a,t.b,t.c)<Infinity);
  }
  function edgeVisibility(G,D,mesh) {
    const key=[D.vw.x,D.vw.y,D.vw.z].map(x=>x.toFixed(6)).join('|');mesh._visibility=mesh._visibility||new Map();
    if(mesh._visibility.has(key))return mesh._visibility.get(key);
    const list=[],edges=mesh.edges.concat((mesh.silhouetteParts||(mesh.rev?[mesh]:[])).flatMap(part=>G.silLines(part,D.vw).map(([a,b])=>({a,b,f1:-1,f2:-1}))));
    for(const e of edges) {
      if(e.smooth&&D.facing(mesh.faces[e.f1].n)===D.facing(mesh.faces[e.f2].n))continue;
      const pieces=8;let run=null;
      for(let i=0;i<pieces;i++) {
        const a=mix3(e.a,e.b,i/pieces),b=mix3(e.a,e.b,(i+1)/pieces),hidden=isOccluded(mesh,mix3(a,b,.5),D.vw,[e.f1,e.f2]);
        if(!run||run.hidden!==hidden){run={points:[a,b],hidden,faces:[e.f1,e.f2]};list.push(run);}else run.points.push(b);
      }
    }
    mesh._visibility.set(key,list);return list;
  }
  function concaveBody(G,D,mesh,style={}) {
    body(D,mesh,'sky',{...style,edgeFn:()=>({skip:true}),sil:false});
    const runs=edgeVisibility(G,D,mesh);
    for(const hidden of[true,false])for(const r of runs.filter(x=>x.hidden===hidden)) {
      const inner=r.faces.some(k=>['in','wall','floor','cavity'].includes(mesh.faces[k]?.tag));
      D.path(r.points,inner&&style.highlight?'amber':'ink',hidden?1.4:2.1,{dash:hidden?[5,4]:undefined,alpha:hidden?.52:1});
    }
  }
  function unrolledWall(G,m,u) {
    const y0=m.h-m.d,y1=m.h,points=[];
    if(m.round) {
      const curvature=(1-u)/m.size;
      for(let i=0;i<=64;i++){const arc=-PI*m.size+TAU*m.size*i/64;points.push(Math.abs(curvature)<1e-7?[arc,-m.size]:[Math.sin(curvature*arc)/curvature,(1-Math.cos(curvature*arc))/curvature-m.size]);}
    } else {
      points.push([-m.size/2,-m.size/2]);for(let i=0;i<4;i++){const a=i*PI/2*(1-u),p=points.at(-1);points.push([p[0]+m.size*Math.cos(a),p[1]+m.size*Math.sin(a)]);}
    }
    const faces=points.slice(0,-1).map((p,i)=>{const q=points[i+1],n=unit3(v(p[1]-q[1],0,q[0]-p[0]));return{pts:[v(p[0],y0,p[1]),v(q[0],y0,q[1]),v(q[0],y1,q[1]),v(p[0],y1,p[1])],n,tag:'wall'};});
    const mesh=G.polyMesh(faces,v(0,m.h/2));
    if(m.round)mesh.edges.forEach(e=>{if(e.f1>=0&&e.f2>=0)e.smooth=true;});
    return{mesh,points};
  }
  function holeDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=m.geometry||(m.geometry=holeMesh(G,m)),u=phase(t,2.8,5.6),wall=unrolledWall(G,m,u),shift=D.hx((m.a+numeric(m.perimeter)/2+1)*u),moving=G.xfMesh(wall.mesh,G.shiftT(shift));
    fit(D,pointsOf(mesh).concat(t>2.8?pointsOf(moving):[]));
    concaveBody(G,D,mesh,{highlight:t>=1.2,faceStyle:f=>['in','wall','floor'].includes(f.tag)?{fill:'amber',alpha:.13}:{}});
    const opening=y=>(m.round?ring(G,m.size,y):rectangle(m.size,m.size).map(p=>v(p[0],y,p[1])));
    if(t>=1.2&&t<5.6) {
      D.panel(opening(m.h),'rose',.09,'rose',2,{dash:[5,4]});
      if(m.through)D.path(opening(0),'rose',1.7,{close:true,dash:[5,4]});
      else if(t>=2)D.panel(opening(m.h-m.d),'amber',.12,'amber',1.7,{dash:[4,4]});
    }
    if(t>2.8)body(D,moving,'amber',{edge:'amber',edgeW:1.8,alpha:.12});
    if(t>=5.6) {
      const c=add3(v(m.round?0:m.size*1.5,m.h-m.d/2,-m.size),shift);
      tag(D,c,`안쪽 벽: ${plain(m.perimeter)} × ${m.d}`,'amber',{size:12});
    }
    if(t<2.8) {
      measureHeight(D,m.h,-m.a/2,m.a/2);
      D.edgeLab(v(-m.a/2,0,m.a/2),v(m.a/2,0,m.a/2),`한 변 ${m.a}`,{size:12,side:{x:0,y:1}});
      if(m.round)D.radius(v(0,m.h),v(m.size,m.h),`반지름 ${m.size}`,{size:12});else D.edgeLab(v(-m.size/2,m.h,m.size/2),v(m.size/2,m.h,m.size/2),`구멍 한 변 ${m.size}`,{size:12,side:{x:0,y:-1}});
      if(!m.through)tag(D,v(0,m.h-m.d/2),`깊이 ${m.d}`,'amber',{size:12,dx:20});
    }
  }
  function holeFrame(t,m) {
    if(t<1.2)return{label:`현재 ${m.name}이 파인 정사각기둥입니다.`,formula:''};
    if(t<2.8)return{label:m.through?'위·아래의 구멍 입구 두 면이 없어집니다.':'없어진 입구와 새 구멍 바닥은 합동이므로 넓이가 상쇄됩니다.',formula:m.through?`없어진 면 $=2\\times(${tex(m.opening)})=${tex(m.removed)}$`:`입구 $-${tex(m.opening)}$ + 바닥 $+${tex(m.opening)}=0$`};
    if(t<5.6)return{label:'새로 생긴 안쪽 벽을 실제 둘레 길이를 유지하며 펼칩니다.',formula:`안쪽 벽 $=(${tex(m.perimeter)})\\times${m.d}=${tex(m.wall)}$`};
    if(t<6.8)return{label:'바깥 상자의 겉넓이에서 없어진 면을 빼고 새 면을 더합니다.',formula:`$${tex(m.outer)}-${tex(m.removed)}+${tex(m.added)}$`};
    return{label:'구멍의 안쪽 벽도 겉넓이에 포함했습니다.',formula:`겉넓이 $=${tex(m.surface)}${unit(2)}$`};
  }
  function cornerBoxes(a,p,count) {
    const A=a/2,signs=count===1?[[1,1,1]]:count===4?[[1,1,1],[-1,1,1],[1,1,-1],[-1,1,-1]]:[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>[x,y,z])));
    return signs.map(s=>s.flatMap(k=>k>0?[A-p,A]:[-A,-A+p]));
  }
  function removedFaces(bounds,boxes) {
    const out=[];
    for(const B of boxes)for(let d=0;d<3;d++)for(let side=0;side<2;side++)if(Math.abs(B[d*2+side]-bounds[d*2+side])<1e-8) {
      const u=(d+1)%3,w=(d+2)%3,n=[0,0,0];n[d]=side?1:-1;
      const pts=[[0,0],[1,0],[1,1],[0,1]].map(([i,j])=>{const p=[0,0,0];p[d]=B[d*2+side];p[u]=B[u*2+i];p[w]=B[w*2+j];return v(...p);});
      out.push({pts,n:v(...n),c:center(pts),tag:'removed'});
    }return out;
  }
  function notchModel(id,M) {
    const a=M.a,A=a/2,outer=value(6*a*a),bounds=[-A,A,-A,A,-A,A];
    if(id==='sv5-3') {
      const count=M.cnt,p=M.p,amount=3*count*p*p;return {kind:'corners',a,p,count,bounds,boxes:cornerBoxes(a,p,count),outer,removed:value(amount),added:value(amount),delta:value(),surface:outer,name:`모퉁이 ${count}곳 절단`};
    }
    const kind=M.kind,p=M.p,q=M.q,c=kind==='thru'?a:M.c,w=M.w,z=M.z;
    const box=kind==='groove'?[-A,A,A-z,A,-w/2,w/2]:[-c/2,c/2,A-p,A,A-q,A];
    const removed=kind==='groove'?a*w+2*w*z:c*q+c*p+(kind==='thru'?2*p*q:0),added=kind==='groove'?a*w+2*a*z:c*q+c*p+(kind==='thru'?0:2*p*q);
    return {kind,a,p,q,c,w,z,bounds,boxes:[box],outer,removed:value(removed),added:value(added),delta:value(added-removed),surface:value(6*a*a+added-removed),name:{mid:'모서리 중간의 홈',thru:'끝까지 관통한 모서리 홈',groove:'가운데를 끝까지 파낸 홈'}[kind]};
  }
  function notchDraw(G,b,t,m) {
    const D=scene(G,b,m,t),mesh=m.geometry||(m.geometry=G.boxMinusBoxes(m.bounds,m.boxes)),removed=removedFaces(m.bounds,m.boxes),inside=mesh.faces.filter(f=>f.tag==='in'),u=phase(t,2,4.5),pairIndex=m.kind==='corners'?Math.min(2,Math.floor(3*phase(t,2,5.8))):0;
    let focusRemoved=removed,focusAdded=inside;
    if(m.kind==='corners'){focusRemoved=removed.slice(pairIndex,pairIndex+1);focusAdded=inside.filter(f=>dot3(f.n,focusRemoved[0].n)>.99).slice(0,1);}
    else if(m.kind==='mid')focusAdded=inside.filter(f=>Math.abs(f.n.x)>.99);
    else if(m.kind==='thru')focusRemoved=removed.filter(f=>Math.abs(f.n.x)>.99);
    else if(m.kind==='groove'){focusRemoved=removed.filter(f=>Math.abs(f.n.x)>.99);focusAdded=inside.filter(f=>Math.abs(f.n.z)>.99);}
    const copied=[...focusRemoved.slice(0,1).map(f=>({f,color:'rose'})),...focusAdded.slice(0,1).map(f=>({f,color:'amber'}))].map(({f,color},i)=>({pts:faceToViewer(G,D,f,u,m.a*(1.5+1.2*i)*u),color}));
    fit(D,pointsOf(mesh).concat(t>=2?copied.flatMap(x=>x.pts):[]));
    concaveBody(G,D,mesh,{highlight:t>=1.2,faceStyle:f=>f.tag==='in'?{fill:'amber',alpha:.13}:{}});
    if(t>=1.2&&t<6.8)removed.forEach(f=>D.panel(f.pts,'rose',.06,'rose',1.4,{dash:[4,4]}));
    if(t>=2)copied.forEach(({pts,color})=>{D.panel(pts,color,.12,color,2);tag(D,center(pts),color==='rose'?'없어진 면':'새로 생긴 면',color,{dy:20,size:12});});
    D.edgeLab(v(-m.a/2,-m.a/2,m.a/2),v(m.a/2,-m.a/2,m.a/2),`한 모서리 ${m.a}`,{size:12,side:{x:0,y:1}});
    if(t<2)tag(D,v(0,m.a/2,0),m.kind==='corners'?`작은 정육면체 모서리 ${m.p}`:m.kind==='groove'?`폭 ${m.w} · 깊이 ${m.z}`:`길이 ${m.c} · 높이 ${m.p} · 폭 ${m.q}`,'amber',{dy:-22,size:12});
  }
  function notchFrame(t,m) {
    if(t<1.2)return{label:`현재 ${m.name}입니다. 없어진 면과 새로 드러난 면을 찾습니다.`,formula:''};
    if(m.kind==='corners') {
      if(t<5.8)return{label:'각 모퉁이에서 없어진 정사각형 세 개와 새 정사각형 세 개가 각각 합동입니다.',formula:`각 면 넓이 $${m.p}^2$ · 모퉁이 ${m.count}곳`};
      if(t<6.8)return{label:'같은 넓이를 빼고 더하므로 변화가 없습니다.',formula:`변화 $=-${tex(m.removed)}+${tex(m.added)}=0$`};
    } else {
      if(t<4.5)return{label:m.kind==='mid'?'위·앞의 면은 안쪽 바닥·뒷벽과 같고, 양 끝의 벽 두 개가 늘어납니다.':m.kind==='thru'?'끝까지 파면 양 끝의 두 면이 없어지고 새 끝벽은 생기지 않습니다.':'윗면과 홈 바닥은 같고, 양 끝의 작은 면과 긴 옆벽을 비교합니다.',formula:`없어진 면 $${tex(m.removed)}$ · 새 면 $${tex(m.added)}$`};
      if(t<6.8)return{label:'넓이가 같은 부분을 상쇄하고 달라진 면만 남깁니다.',formula:`변화 $=${tex(m.added)}-${tex(m.removed)}=${tex(m.delta)}$`};
    }
    return{label:m.kind==='corners'?'겉넓이는 원래 정육면체와 같습니다.':'원래 정육면체에 겉면의 변화량을 반영합니다.',formula:`겉넓이 $=6\\times${m.a}^2${numeric(m.delta)?`${numeric(m.delta)>0?'+':''}${tex(m.delta)}`:''}=${tex(m.surface)}${unit(2)}$`};
  }
  function cavityModel(M) {
    const {r2,r1,h2,h1,R2,R1}=M,outer=value(0,r2*R2),ringArea=value(0,r2*r2-r1*r1),inner=value(0,r1*R1),largeVolume=value(0,r2*r2*h2/3),smallVolume=value(0,r1*r1*h1/3);
    return {r2,r1,h2,h1,R2,R1,outer,ringArea,inner,surface:sum(outer,ringArea,inner),largeVolume,smallVolume,volume:minus(largeVolume,smallVolume)};
  }
  function cavityMesh(G,m,N=64) {
    const outer=G.revolveMesh([[m.r2,0],[0,m.h2]],{N,tags:['outer']}),inner=G.flipMesh(G.revolveMesh([[m.r1,0],[0,m.h1]],{N,tags:['cavity']})),a=ring(G,m.r2,0,N),b=ring(G,m.r1,0,N),faces=a.map((p,i)=>({pts:[p,a[(i+1)%N],b[(i+1)%N],b[i]],n:v(0,-1),tag:'ring'})),ann=G.polyMesh(faces,v(0,1));ann.edges=[];
    const mesh=mergeMeshes([outer,inner,ann]);mesh.silhouetteParts=[outer,inner];return mesh;
  }
  function cavityDraw(G,b,t,m) {
    const D=scene(G,b,m,t,{yaw:m.camera.svYaw,pitch:Math.min(-12,m.camera.svPitch)}),mesh=m.geometry||(m.geometry=cavityMesh(G,m)),u=phase(t,2.2,5.6),shift=D.hx((m.r2+2*m.r1)*u),small=G.revolveMesh([[0,0],[m.r1,0],[0,m.h1]],{N:48,O:shift});
    fit(D,pointsOf(mesh).concat(t>2.2?pointsOf(small):[]));
    concaveBody(G,D,mesh,{highlight:t>=4,faceStyle:f=>({fill:f.tag==='outer'?'sky':f.tag==='ring'?'amber':'rose',alpha:t<1.2?.05:.12})});
    if(t>2.2)body(D,small,'rose',{alpha:.06,edge:'rose',edgeFn:()=>({alpha:phase(t,2.2,3)})});
    D.radius(v(0,0),v(m.r2,0),`큰 반지름 ${m.r2}`,{size:12});
    if(t>=3)D.radius(shift,add3(shift,v(m.r1,0)),`작은 반지름 ${m.r1}`,{size:12,color:'rose'});
    if(m.target==='volume') {
      D.height(v(0,0),v(0,m.h2),`높이 ${m.h2}`,{size:12,side:{x:-1,y:0},dash:true});
      if(t>=3)D.height(shift,add3(shift,v(0,m.h1)),`높이 ${m.h1}`,{size:12,side:{x:1,y:0},color:'rose'});
    }else{
      D.edgeLab(v(-m.r2,0),v(0,m.h2),`큰 모선 ${m.R2}`,{size:12,side:{x:-1,y:0}});
      if(t>=3)D.edgeLab(add3(v(m.r1,0),shift),add3(v(0,m.h1),shift),`작은 모선 ${m.R1}`,{size:12,side:{x:1,y:0},color:'rose'});
    }
    if(t>=5.6)tag(D,add3(v(0,m.h1),shift),'파낸 부분 · 보조 모형','rose',{dy:-20,size:12});
  }
  function cavityFrame(t,m) {
    if(t<1.2)return{label:'큰 원뿔의 밑면 안쪽에서 작은 원뿔만큼 파냈습니다.',formula:''};
    if(m.target==='volume') {
      if(t<3.8)return{label:'원래 큰 원뿔의 부피를 먼저 구합니다.',formula:`큰 원뿔 $=\\frac13\\pi\\times${m.r2}^2\\times${m.h2}=${tex(m.largeVolume)}$`};
      if(t<6.8)return{label:'속에서 빠진 작은 원뿔의 부피를 구합니다.',formula:`작은 원뿔 $=\\frac13\\pi\\times${m.r1}^2\\times${m.h1}=${tex(m.smallVolume)}$`};
      return{label:'빈 공간은 부피에서 뺍니다.',formula:`부피 $=${tex(m.largeVolume)}-${tex(m.smallVolume)}=${tex(m.volume)}${unit(3)}$`};
    }
    if(t<3.8)return{label:'바깥 옆면과 구멍을 제외한 밑면의 고리를 셉니다.',formula:`바깥 옆면 $${tex(m.outer)}$ · 밑면 고리 $${tex(m.ringArea)}$`};
    if(t<6.8)return{label:'파낸 원뿔의 옆면은 새 안쪽 겉면이므로 넓이에 더합니다.',formula:`안쪽 옆넓이 $=\\pi\\times${m.r1}\\times${m.R1}=${tex(m.inner)}$`};
    return{label:'바깥 옆면·밑면 고리·안쪽 옆면을 모두 더합니다.',formula:`겉넓이 $=${tex(m.outer)}+${tex(m.ringArea)}+${tex(m.inner)}=${tex(m.surface)}${unit(2)}$`};
  }

  // More families below use these geometric operations, not native lesson steps.
  const registry={},lessonInfo={};
  function bind(id,lab,state,patch={}) {
    const G=typeof window==='undefined'?(lab.G||lab.api):window.APL_SV;
    if(!G||!lab.scene.sv?.model)throw Error(`Missing native measurement model: ${id}`);
    const s=Object.assign(clone(state),patch),M=lab.scene.sv.model(s);
    return{G,M,state:s,tab:lab.tab,camera:{svYaw:s.svYaw??28,svPitch:s.svPitch??22},sceneId:id};
  }
  function plan(d,legacyLabel,title,m,draw,frame,given,method) {
    const model={...m,camera:d.camera,sceneId:d.sceneId,legacyLabel};
    return {id:`${d.sceneId}-${method||legacyLabel||'proof'}`,title,label:method==='distance'?'한 바퀴 굴린 거리':title,legacyLabel,duration:DURATION,stops:[.8,2,4,5.2,6.8],model,given,
      draw:(b,t,M)=>draw(d.G,b,t,M),frame};
  }
  function register(id,labels,build) {
    const key=`g7-surface-volume/${id}`;registry[key]=build;
    lessonInfo[key]=labels.map(legacyLabel=>({legacyLabel,duration:DURATION}));
  }
  ['sv1-1','sv1-2','sv1-3','sv1-4','sv1-5'].forEach(id=>{
    const labels=id==='sv1-1'||id==='sv1-5'?['겉넓이','부피']:id==='sv1-3'?['굴린 거리','겉넓이']:[''];
    register(id,labels,(lab,s)=>{
      const d=bind(id,lab,s),m=prismModel(d.G,id,d.M),given=`밑면 ${m.base.name}: ${m.base.given} · 기둥 높이 ${m.h} cm`;
      return labels.map(label=>{
        const isVolume=label==='부피'||id==='sv1-4',isRoll=label==='굴린 거리';
        return plan(d,label,isRoll?'원의 둘레만큼 굴리기':isVolume?'같은 단면을 쌓은 부피':'실제 면을 펼친 겉넓이',m,isRoll?rollDraw:isVolume?prismVolumeDraw:prismAreaDraw,isRoll?rollFrame:isVolume?prismVolumeFrame:prismAreaFrame,given,isRoll?'distance':isVolume?'volume':'surface');
      });
    });
  });
  register('sv2-1',[''],(lab,s)=>{
    const d=bind('sv2-1',lab,s),M=d.M;
    if(M.mode==='cube')return[plan(d,'','세 합동 뿔로 나눈 정육면체',{a:M.a,big:value(M.a**3),volume:value(M.a**3/3)},cubeThirdDraw,cubeThirdFrame,`정육면체 모서리 ${M.a} cm · 한 꼭짓점에서 마주 보는 세 면에 이은 사각뿔`,'third')];
    const m=coneModel(M);return[plan(d,'','같은 밑면·높이의 원뿔과 원기둥',m,pyramidVolumeDraw,pyramidVolumeFrame,`원뿔과 원기둥: 반지름 ${m.r} cm · 수직 높이 ${m.h} cm`,'third')];
  });
  ['sv2-2','sv2-3','sv4-1'].forEach(id=>{
    const labels=id==='sv2-2'?['겉넓이']:['겉넓이','부피'];
    register(id,labels,(lab,s)=>{
      const d=bind(id,lab,s),m=coneModel(d.M),rotated=id==='sv4-1';
      return labels.map(label=>{const volume=label==='부피';return plan(d,label,rotated?(volume?'회전축을 높이로 보는 부피':'회전해서 펼친 원뿔의 겉넓이'):(volume?'같은 밑면·높이의 기둥과 비교':'호와 모선으로 구한 겉넓이'),{...m,target:volume?'volume':'surface'},rotated?(volume?rotatedConeVolumeDraw:rotationConeDraw):volume?pyramidVolumeDraw:pyramidAreaDraw,rotated?rotatedConeFrame:volume?pyramidVolumeFrame:pyramidAreaFrame,rotated?`직각변 ${d.M.legA}, ${d.M.legB} cm · 빗변 ${d.M.hyp} cm · 회전축: ${d.M.axis==='long'?'긴':'짧은'} 직각변 ${m.h} cm`:`반지름 ${m.r} cm · ${volume?`수직 높이 ${textNumber(m.h)}`:`모선 ${textNumber(m.l)}`} cm`,volume?'volume':'surface');});
    });
  });
  ['sv2-5','sv2-6','sv2-7'].forEach(id=>register(id,['겉넓이','부피'],(lab,s)=>{
    const d=bind(id,lab,s),m=id==='sv2-5'?squarePyramidModel(d.M):triangularPyramidModel(id==='sv2-7');
    const given=id==='sv2-5'?`정사각형 밑면 · 네 옆면은 합동 · 아랫변 ${m.a} cm${m.b?` · 윗변 ${m.b} cm`:''} · 수직 높이 ${textNumber(m.h)} cm · 옆면 높이 ${textNumber(m.l)} cm`:`밑면 직각변 6, 8 cm · 꼭짓점은 밑면의 직각 꼭짓점 바로 위 · 큰 높이 9 cm${m.ratio?' · 평행 절단 길이비 1:2, 남은 높이 4.5 cm':''}`;
    return ['겉넓이','부피'].map(label=>{
      const volume=label==='부피';let conditions=given;
      if(d.tab==='problem'&&id==='sv2-6')conditions=volume?'문제 조건: 직각삼각형 밑면의 직각변 6, 8 cm · 밑면에 수직인 높이 9 cm':'문제 조건: 밑넓이 24 cm² · 세 옆면 넓이 27, 36, 51 cm²';
      if(d.tab==='problem'&&id==='sv2-7')conditions=volume?'문제 조건: 큰 삼각뿔 부피 72 cm³ · 잘라 낸 작은 뿔 부피 9 cm³':'문제 조건: 아랫면 24 cm² · 윗면 6 cm² · 옆면 85.5 cm²';
      return plan(d,label,`${m.name}: ${volume?(m.ratio?'큰 뿔에서 작은 뿔 빼기':'밑면·수직 높이로 부피'):'모든 면을 펼쳐 더하기'}`,m,volume?(m.ratio?frustumVolumeDraw:pyramidVolumeDraw):pyramidAreaDraw,volume?(m.ratio?frustumVolumeFrame:pyramidVolumeFrame):pyramidAreaFrame,conditions,volume?'volume':'surface');
    });
  }));
  register('sv3-1',[''],(lab,s)=>{const d=bind('sv3-1',lab,s),m=sphereModel(d.M.r);return[plan(d,'','같은 넓이의 띠로 보는 구의 겉넓이',m,sphereBandsDraw,sphereBandsFrame,`구의 반지름 ${m.r} cm · 비교 원기둥: 같은 반지름, 높이 ${2*m.r} cm`,'bands')];});
  register('sv3-2',[''],(lab,s)=>{const d=bind('sv3-2',lab,s),m=sphereModel(d.M.r,'half');return[plan(d,'','반구의 곡면과 자른 원',m,sphereCutDraw,sphereCutFrame,`반구 반지름 ${m.r} cm · 중심을 지나는 평면으로 구를 절반으로 자름`,'surface')];});
  register('sv3-3',[''],(lab,s)=>{const d=bind('sv3-3',lab,s),M=d.M,m={r:M.r,h:M.h,body:M.body,name:{sph:'구',cone:'원뿔',cyl:'원기둥'}[M.body],volume:value(0,M.body==='sph'?4*M.r**3/3:M.r*M.r*M.h/(M.body==='cone'?3:1))};return[plan(d,'','현재 물체가 밀어낸 물의 부피',m,overflowDraw,overflowFrame,`처음 가득 찬 수조: 반지름 ${m.r} cm, 높이 ${m.h} cm · ${m.name}을 완전히 잠기게 함`,'overflow')];});
  register('sv3-5',['사분의 일','팔분의 일'],(lab,s)=>['사분의 일','팔분의 일'].map((label,i)=>{const d=bind('sv3-5',lab,s,{svFrac:i?'eighth':'quarter'}),m=sphereModel(d.M.r,i?'eighth':'quarter');return plan(d,label,`${m.name}의 실제 절단면 세기`,m,sphereCutDraw,sphereCutFrame,`선택한 풀이 조건: ${m.name} · 현재 반지름 ${m.r} cm · 중심에서 서로 수직인 절단면`,'surface-'+i);}));
  register('sv3-6',['겉넓이','부피','역으로'],(lab,s)=>{
    const d=bind('sv3-6',lab,s),m=sphereModel(d.M.r,d.M.shape==='half'?'half':'full');
    return ['겉넓이','부피','역으로'].map(label=>{const vol=label==='부피',inverse=label==='역으로';return plan(d,label,inverse?'주어진 부피에서 반지름과 겉넓이':`${m.name}의 ${vol?'같은 단면으로 구한 부피':'곡면과 겉넓이'}`,m,inverse?sphereInverseDraw:vol?sphereVolumeDraw:m.kind==='full'?sphereBandsDraw:sphereCutDraw,inverse?sphereInverseFrame:vol?sphereVolumeFrame:m.kind==='full'?sphereBandsFrame:sphereCutFrame,inverse?`${m.name} · 주어진 부피 ${exact(m.volume,3)} · 반지름 r와 겉넓이 구하기`:`${m.name} · 현재 반지름 ${m.r} cm`,inverse?'inverse':vol?'volume':'surface');});
  });
  register('sv3-7',['겉넓이','부피'],(lab,s)=>{const d=bind('sv3-7',lab,s),m=sphereModel(d.M.r,d.M.oct?'seveneighth':'threequarter');return ['겉넓이','부피'].map(label=>{const vol=label==='부피';return plan(d,label,vol?'잘라 낸 비율과 남은 부피':'남은 곡면에 새 절단면 더하기',m,vol?remainderVolumeDraw:sphereCutDraw,vol?remainderVolumeFrame:sphereCutFrame,`${m.name} · 반지름 ${m.r} cm · 중심을 지나는 서로 수직인 절단면`,vol?'volume':'surface');});});
  register('sv4-2',['겉넓이','부피','축 바꾸기'],(lab,s)=>{
    const d=bind('sv4-2',lab,s),m=trapezoidAxes(d.G,d.M),given=`같은 사다리꼴: 짧은 밑변 ${m.a} cm · 긴 밑변 ${m.b} cm · 높이 ${m.h} cm · 현재 축: ${m.currentAxis==='leg'?'수직변':'긴 밑변'}`;
    return ['겉넓이','부피','축 바꾸기'].map(label=>{if(label==='축 바꾸기')return plan(d,label,'같은 치수에서 두 회전축 비교',m,axesDraw,axesFrame,given,'axes');const target=label==='부피'?'volume':'surface',proof={...(m.currentAxis==='leg'?m.frustum:m.composite),target,camera:d.camera};return plan(d,label,`현재 회전축의 ${label}`,{...m,target,proof},rotationTrapezoidDraw,rotationTrapezoidFrame,given,target);});
  });
  ['sv4-3','sv4-4','sv5-6','sv6-1'].forEach(id=>register(id,['겉넓이','부피'],(lab,s)=>{const d=bind(id,lab,s),m=joinedModel(id,d.M);return ['겉넓이','부피'].map(label=>{const target=label==='부피'?'volume':'surface';return plan(d,label,target==='volume'?'겹치지 않는 부분의 부피 더하기':'맞붙은 두 면씩 빼는 겉넓이',{...m,target},joinedDraw,joinedFrame,m.given,target);});}));
  register('sv5-1',[''],(lab,s)=>{const d=bind('sv5-1',lab,s),m=holeModel('sv5-1',d.M);return[plan(d,'','관통 원 구멍의 입구와 안쪽 벽',m,holeDraw,holeFrame,`정사각기둥 밑변 ${m.a} cm · 높이 ${m.h} cm · 관통 구멍 반지름 ${m.size} cm`,'surface')];});
  register('sv5-2',['막힌 원','관통 사각','막힌 사각'],(lab,s)=>['막힌 원','관통 사각','막힌 사각'].map((label,i)=>{
    const d=bind('sv5-2',lab,s,{svK52:['cb','st','sb'][i]}),m=holeModel('sv5-2',d.M);
    return plan(d,label,`${m.name}: 입구·바닥·안쪽 벽`,m,holeDraw,holeFrame,`선택한 풀이 조건: ${m.name} · 바깥 밑변 ${m.a} cm, 높이 ${m.h} cm · 구멍 ${m.round?'반지름':'한 변'} ${m.size} cm${m.through?' · 끝까지 관통':` · 깊이 ${m.d} cm`}`,'surface-'+i);
  }));
  register('sv5-3',[''],(lab,s)=>{const d=bind('sv5-3',lab,s),m=notchModel('sv5-3',d.M);return[plan(d,'','모퉁이에서 없어지고 생긴 합동 면',m,notchDraw,notchFrame,`정육면체 모서리 ${m.a} cm · 작은 정육면체 모서리 ${m.p} cm · 모퉁이 ${m.count}곳 절단`,'surface')];});
  register('sv5-4',['모서리중간','끝까지','가운데홈'],(lab,s)=>['모서리중간','끝까지','가운데홈'].map((label,i)=>{
    const d=bind('sv5-4',lab,s,{svK54:['mid','thru','groove'][i]}),m=notchModel('sv5-4',d.M),given=`선택한 풀이 조건: ${m.name} · 정육면체 모서리 ${m.a} cm · ${m.kind==='groove'?`홈 폭 ${m.w} cm, 깊이 ${m.z} cm`:`파낸 길이 ${m.c} cm, 높이 ${m.p} cm, 폭 ${m.q} cm`}`;
    return plan(d,label,`${m.name}의 겉면 변화`,m,notchDraw,notchFrame,given,'surface-'+i);
  }));
  register('sv5-5',['겉넓이','부피'],(lab,s)=>{const d=bind('sv5-5',lab,s),m=cavityModel(d.M);return ['겉넓이','부피'].map(label=>{const target=label==='부피'?'volume':'surface';return plan(d,label,target==='volume'?'파낸 원뿔의 부피 빼기':'원뿔 안쪽에 생긴 겉면 더하기',{...m,target},cavityDraw,cavityFrame,`큰 원뿔: 반지름 ${m.r2} cm, 높이 ${m.h2} cm, 모선 ${m.R2} cm · 같은 밑면 평면에서 파낸 작은 원뿔: ${m.r1}, ${m.h1}, ${m.R1} cm`,target);});});
  return{registry,lessonInfo,bind,value,sum,times,minus,numeric,tex,rational,prismModel,prismGeometry,sectorPolygon,stadiumHalf,coneModel,squarePyramidModel,triangularPyramidModel,triangularNet,pyramidGeometry,pyramidMesh,cubePyramids,mergeMeshes,sphereModel,sphereGeometry,sphericalFlats,sphereSectionArea,displaced,coneFrustumModel,component,componentMesh,joinedModel,trapezoidAxes,holeModel,holeMesh,circleHoleMesh,unrolledWall,triangleRayDistance,isOccluded,edgeVisibility,notchModel,cornerBoxes,removedFaces,cavityModel,cavityMesh};
});
