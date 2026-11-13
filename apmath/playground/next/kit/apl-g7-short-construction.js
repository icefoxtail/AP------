/* Compass, straightedge and congruence proofs from the current native question.
 * No legacy cue is replayed. Explorer values and generated-question seeds are
 * separate immutable inputs; a named variant changes only this proof's copy. */
(function(root,factory){
  'use strict';const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(!root?.APLab)return;
  root.APLab.G7ShortConstruction=api;
  Object.assign(root.APLab.G7Shorts=root.APLab.G7Shorts||{},api.registry);
  Object.assign(root.APLab.G7ShortInfo=root.APLab.G7ShortInfo||{},api.lessonInfo);
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const R=Math.PI/180,P=(x,y)=>({x,y}),O=P(0,0),clamp=x=>Math.max(0,Math.min(1,x));
  const add=(a,b)=>P(a.x+b.x,a.y+b.y),sub=(a,b)=>P(a.x-b.x,a.y-b.y),mul=(a,k)=>P(a.x*k,a.y*k);
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
  const mid=(a,b)=>mul(add(a,b),.5),mix=(a,b,u)=>add(a,mul(sub(b,a),u));
  const polar=(c,r,d)=>P(c.x+r*Math.cos(d*R),c.y+r*Math.sin(d*R));
  const direction=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x)/R;
  const norm=d=>(d%360+360)%360;
  const rotate=(p,c,d)=>{const q=sub(p,c);return P(c.x+q.x*Math.cos(d*R)-q.y*Math.sin(d*R),c.y+q.x*Math.sin(d*R)+q.y*Math.cos(d*R));};
  const phase=(t,a,z)=>{const u=clamp((t-a)/(z-a));return u*u*(3-2*u);};
  const clone=s=>JSON.parse(JSON.stringify(s));
  const center=ps=>mul(ps.reduce(add,O),1/ps.length);
  const near=(a,b)=>Math.abs(a-b)<1e-7;
  function rational(n,d=1){
    if(!Number.isFinite(n)||!Number.isFinite(d)||d===0)throw Error('Non-finite construction quantity');
    const x=n/d;if(near(x,Math.round(x)))return String(Math.round(x));
    for(let den=2;den<=1000;den++)if(near(x*den,Math.round(x*den)))return `${Math.round(x*den)}/${den}`;
    return `≈${Math.round(x*10)/10}`;
  }
  const tex=n=>{const v=rational(n);return v.startsWith('≈')?`\\approx ${v.slice(1)}`:v.includes('/')?`\\frac{${v.split('/')[0]}}{${v.split('/')[1]}}`:v;};
  const deg=n=>`${rational(n)}°`,cm=n=>`${rational(n)} cm`;
  const F=(label,formula='')=>({label,formula});
  const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const colors=['sky','rose','green','amber','violet'];
  const nums=['①','②','③','④','⑤'],letters=['㉠','㉡','㉢','㉣','㉤','㉥'];
  const line=(b,a,z,color='ink',width=3,o={})=>b.path([a,z],{color,width,...o});
  const trace=(b,a,z,u,color='amber',width=3)=>{if(u>0)line(b,a,mix(a,z,u),color,width);};
  const label=(b,p,s,color='ink',o={})=>b.text(p,s,{color,size:b.W<560?13:16,align:'center',baseline:'middle',weight:750,...o});
  const dot=(b,p,name='',color='ink',o={})=>{b.point(p,{color,r:4.2});if(name)label(b,p,name,color,{dy:17,...o});};
  const poly=(b,ps,color='sky',alpha=.1)=>b.path(ps,{close:true,color,fill:color,fillAlpha:alpha,width:2.5});
  function setup(b,ps,pad=.17){
    const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),span=Math.max(2,x1-x0,y1-y0),m=span*pad;
    b.kind='figure';b.aspect='1:1';b.setPanes(null);b.setInsets({top:48,right:30,bottom:88,left:30});b.zoom=1;b.panX=0;b.panY=0;
    b.setFocus({x:[x0-m,x1+m],y:[y0-m,y1+m]},false);
  }
  const relation=(a,n)=>rational(n).startsWith('≈')?`${a}\\approx ${rational(n).slice(1)}`:`${a}=${tex(n)}`;
  const arc=(b,c,r,start,end,u=1,color='amber')=>{if(u>0)b.arc(c,r,start*R,(start+(end-start)*u)*R,{color,width:2.2,ccw:end<start});};
  function angleWedge(v,a,z){let start=direction(v,a),sweep=norm(direction(v,z)-start);if(sweep>180){start=direction(v,z);sweep=360-sweep;}return{c:v,start,sweep};}
  function sector(b,w,color='amber',text='',r,textOptions={}){
    r=r||25/b.k;const n=Math.max(4,Math.ceil(w.sweep/6));
    b.path([w.c,...Array.from({length:n+1},(_,i)=>polar(w.c,r,w.start+w.sweep*i/n))],{close:true,color,fill:color,fillAlpha:.16,width:1.8});
    if(text)label(b,polar(w.c,r+18/b.k,w.start+w.sweep/2),text,color,{size:b.W<560?12:15,...textOptions});
  }
  function tri(b,G,T,names='ABC',o={}){G.drawTri(b,T,{names:names?names.split(''):[],nameSize:b.W<560?12:16,fill:'sky',fa:.06,...o});}
  function side(b,G,T,i,text,color='sky'){G.sideTag(b,T[i],T[(i+1)%3],center(T),text,{color,size:b.W<560?12:15,gap:11});}
  function measureTriangle(T){return [dist(T[0],T[1]),dist(T[1],T[2]),dist(T[2],T[0])];}
  function matchedOrder(A,B){
    const perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
    return perms.find(p=>[[0,1],[1,2],[2,0]].every(([i,j])=>near(dist(A[i],A[j]),dist(B[p[i]],B[p[j]]))));
  }
  // A reflection is a 3-D half-turn, not a shrinking triangle. The projected z
  // is retained so metric invariance is independently testable during the flip.
  function rigidPose(from,to,u){
    const a=center(from),z=center(to),da=direction(from[0],from[1]),dz=direction(to[0],to[1]);
    const cross=T=>(T[1].x-T[0].x)*(T[2].y-T[0].y)-(T[1].y-T[0].y)*(T[2].x-T[0].x);
    const flip=cross(from)*cross(to)<0,turn=(norm(dz-da+180)-180)*u,theta=(da+turn)*R,c=mix(a,z,u);
    return from.map(p=>{const q=rotate(p,a,-da),x=q.x-a.x,y=q.y-a.y,fy=flip?y*Math.cos(Math.PI*u):y;return{x:c.x+x*Math.cos(theta)-fy*Math.sin(theta),y:c.y+x*Math.sin(theta)+fy*Math.cos(theta),z:flip?y*Math.sin(Math.PI*u):0};});
  }
  function translated(T,x,y=0){return T.map(p=>P(p.x+x,p.y+y));}
  function initialImage(T,mode='rot',gap){
    const c=center(T),span=Math.max(...T.map(p=>p.x))-Math.min(...T.map(p=>p.x)),off=gap||span+3;
    return T.map(p=>{const q=mode==='flip'?P(2*c.x-p.x,p.y):mode==='slide'?p:rotate(p,c,150);return P(q.x+off,q.y);});
  }
  function pairDraw(b,d,t,T,opts={}){
    const image=opts.image||initialImage(T,opts.mode||'rot'),moving=rigidPose(image,T,phase(t,2.4,6.7));
    setup(b,[...T,...image,...rigidPose(image,T,.5)]);
    tri(b,d.G,T,opts.namesA||'ABC',opts.a||{});
    tri(b,d.G,moving,t>=6.7?'':opts.namesB||'DEF',{fill:'green',color:'green',dash:t>=6.7?[5,4]:undefined,...(opts.b||opts.a||{})});
    return{T,image,moving};
  }
  const recipe={};
  function register(scene,label,motion,bind,draw,frame,given,duration=9.6){(recipe[scene]||=[]).push({label,motion,bind,draw,frame,given,duration});}
  function source(d,updates={}){return d.D.model({...clone(d.s),...updates,lessonOn:false,lessonEntry:false});}
  function reviewed(d,m=d.m){return d.D.reviewModel?d.D.reviewModel(m):m;}
  function question(d,m=d.m){return d.D.prob(m,d.s);}
  function correct(Q){return Q.choices.findIndex(q=>q.ok);}
  function compass(b,N,E){const q=mid(N,E),v=sub(E,N),len=Math.hypot(v.x,v.y)||1,h=add(q,P(v.y/len,-v.x/len));line(b,N,h,'muted',2);line(b,E,h,'muted',2);dot(b,N);dot(b,E,'','amber');}

  // ① Straightedge connects points; a compass preserves a radius or a chord.
  for(const goal of ['ruler','compass','length','tools']){
    register('c1-1',{ruler:'자의쓰임',compass:'컴퍼스',length:'길이문제',tools:'도구판별'}[goal],'unmarked-straightedge-or-fixed-radius-compass',d=>{
      const Q=goal==='tools'?question(d,{...d.m,kind:0}):null;
      return{...d,goal,Q,which:goal==='tools'?d.m.pk.c:goal==='ruler'?0:1,answer:Q?correct(Q)+1:goal==='length'?d.m.L:null};
    },(b,t,d)=>{
      const {m}=d,A=P(-5,0),B=P(-5+m.L,0),C=P(1,0),E=polar(C,m.L,-m.phi),end=polar(C,4.8,-m.phi);
      setup(b,[A,B,C,end,P(1,-m.L-1),P(-5,1)]);dot(b,A,'A');dot(b,B,'B');line(b,A,B,'sky',3.5);
      if(d.which===0){
        const q=[P(-5.7,.2),P(5.7,.2),P(5.7,.85),P(-5.7,.85)];poly(b,q,'muted',.08);label(b,P(0,.55),'눈금 없는 자','muted',{size:13});
        trace(b,P(-5.7,0),P(5.7,0),phase(t,.8,5.8),'green');
      }else{
        label(b,mid(A,B),cm(m.L),'sky',{dy:35});dot(b,C,'P');line(b,C,end);
        const move=phase(t,.8,3),N=mix(A,C,move),open=move<1?P(N.x+m.L,N.y):polar(C,m.L,-(d.which===2?360:m.phi+30)*phase(t,3.2,6.5));
        compass(b,N,open);arc(b,C,m.L,0,d.which===2?-360:-m.phi-30,phase(t,3.2,6.5),'green');
        if(t>=6.5){dot(b,E,'Q','green',{dy:-17});b.ticks(A,B,{color:'amber',count:1});b.ticks(C,E,{color:'amber',count:1});if(goal==='length')label(b,mid(C,E),t>=7.3?cm(m.L):'x cm','green',{dy:34});}
      }
    },(t,d)=>t<.8?F('주어진 두 점과 선분을 확인합니다.'):d.which===0?t<7.3?F('눈금 없는 자의 곧은 가장자리를 따라 두 점을 잇습니다.'):F('자에는 길이를 읽는 눈금이 없습니다.',d.Q?`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`:'두 점을 지나는 직선'):t<3.2?F('AB에 맞춘 컴퍼스 벌림을 바꾸지 않고 옮깁니다.'):t<7.3?F('바늘을 고정하면 연필 끝까지의 거리가 일정합니다.'):F('그 호 위의 점은 모두 중심에서 같은 거리입니다.',d.Q?`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`:`$PQ=AB=${tex(d.m.L)}\\text{ cm}$`),d=>d.Q?clean(d.Q.stem):`현재 AB=${cm(d.m.L)} · ${goal==='ruler'?'눈금 없는 자':goal==='length'?'PQ의 길이':'컴퍼스의 벌림'}`);
  }
  function copyGeometry(m,parallel=false){
    if(!parallel){const A0=O,P0=P(6,0),a=P(m.r,0),z=polar(O,m.r,-m.th),c=P(6+m.r,0),e=polar(P0,m.r,-m.th);return{origin:A0,target:P0,a,z,c,e,r:m.r,chord:dist(a,z),first:0,second:-m.th,targetFirst:0,targetSecond:-m.th};}
    const al=-m.al,dl=polar(O,1,al),n=P(dl.y,-dl.x),Q=O,P0=add(mul(dl,m.px),mul(n,m.ph)),u=direction(Q,P0),off=m.mode==='alt'?180:0;
    const a=polar(Q,m.r,al),z=polar(Q,m.r,u),c=polar(P0,m.r,u+off),e=polar(P0,m.r,al+off);
    return{origin:Q,target:P0,a,z,c,e,r:m.r,chord:dist(a,z),first:al,second:u,targetFirst:u+off,targetSecond:al+off,dl};
  }
  function arcAcross(b,c,r,a,z,u,color){let turn=norm(z-a);if(turn>180)turn-=360;arc(b,c,r,a-8,a+turn+(turn<0?-8:8),u,color);}
  function drawCopy(b,t,d){
    const g=d.geo,G=d.G,parallel=d.parallel;
    const ends=parallel?[polar(g.origin,5,g.first),polar(g.origin,5,g.first+180),polar(g.target,4,g.targetSecond),polar(g.target,4,g.targetSecond+180)]:[polar(g.origin,3.5,g.first),polar(g.origin,3.5,g.second),polar(g.target,3.5,g.targetFirst)];
    setup(b,[g.origin,g.target,g.a,g.z,g.c,g.e,...ends],.14);
    if(parallel){line(b,ends[0],ends[1],'sky',3);dot(b,g.target,'P');dot(b,g.origin,'Q');label(b,ends[0],'l','sky',{dy:16});trace(b,polar(g.origin,1,g.second+180),polar(g.target,1,g.second),phase(t,.45,1.2),'muted',2);}
    else{line(b,g.origin,ends[0]);line(b,g.origin,ends[1]);line(b,g.target,ends[2]);dot(b,g.origin,'O');dot(b,g.target,'P');dot(b,ends[0],'X');dot(b,ends[1],'Y','ink',{dy:-17});dot(b,ends[2],'Q');}
    const swapped=d.order&&d.order[1]===2,qStart=swapped?2.4:parallel?1.2:.7,qEnd=swapped?3.8:2.4,pStart=swapped?1.2:2.4,pEnd=swapped?2.4:3.8;
    arcAcross(b,g.origin,g.r,g.first,g.second,phase(t,qStart,qEnd),'sky');
    if(t>=qEnd){dot(b,g.a,'A','sky',{dy:18});dot(b,g.z,'B','sky',{dy:-16});}
    arcAcross(b,g.target,g.r,g.targetFirst,g.targetSecond,phase(t,pStart,pEnd),'sky');
    if(t>=pEnd)dot(b,g.c,'C','sky',{dy:18});
    if(t>=3.8){line(b,g.a,g.z,'amber',3.5);const f=phase(t,3.8,4.8),N=mix(g.a,g.c,f),E=add(N,sub(g.z,g.a));compass(b,N,E);}
    arc(b,g.c,g.chord,direction(g.c,g.e)-18,direction(g.c,g.e)+18,phase(t,4.9,6.1),'amber');
    if(t>=6.1){dot(b,g.e,'D','green',{dy:-17});line(b,g.c,g.e,'amber',2);}
    if(t>=6.2)trace(b,g.target,polar(g.target,parallel?4:3.5,g.targetSecond),phase(t,6.2,7.1),'green',3.5);
    if(t>=7.1){[[g.origin,g.a],[g.origin,g.z],[g.target,g.c],[g.target,g.e]].forEach(([a,z])=>b.ticks(a,z,{color:'sky',count:1}));[[g.a,g.z],[g.c,g.e]].forEach(([a,z])=>b.ticks(a,z,{color:'amber',count:2}));}
    if(t>=7.5){sector(b,angleWedge(g.origin,g.a,g.z),'sky','');sector(b,angleWedge(g.target,g.c,g.e),'green','');}
  }
  function copyBind(d,parallel,mode,problem,relations){
    let m=problem?reviewed(d):d.m;if(parallel)m={...m,mode};
    const Q=problem?question(d,{...d.m,pmode:mode||d.m.pmode}):null;
    return{...d,m,Q,parallel,relations,geo:copyGeometry(m,parallel),answer:Q?correct(Q)+1:null};
  }
  for(const [scene,label,parallel,mode,problem,relations] of [
    ['c1-2','각옮기기',false,null,false,false],['c1-2','선분관계',false,null,true,true],
    ['c1-3','동위각작도',true,'corr',false,false],['c1-3','선분관계',true,'corr',true,true],
    ['c1-4','엇각작도',true,'alt',false,false],['c1-4','엇각판별',true,'alt',true,false],['c1-4','동위각판별',true,'corr',true,false]]){
    register(scene,label,'same-radius-arcs-and-compass-chord-copy',d=>copyBind(d,parallel,mode,problem,relations),drawCopy,
      (t,d)=>t<2.4?F('원래 꼭짓점에서 같은 원 위의 두 점을 찾습니다.'):t<3.8?F('컴퍼스 벌림을 유지하고 새 꼭짓점에도 호를 긋습니다.'):t<4.9?F('두 교점 사이의 현 AB를 컴퍼스로 옮깁니다.'):t<6.2?F('C 중심의 호와 앞의 호가 만나는 점 D를 찾습니다.'):t<7.5?F('PD를 그으면 같은 세 변을 가진 두 삼각형이 생깁니다.'):d.relations?F('반지름 네 개와 현 두 개는 서로 다른 길이 묶음입니다.',`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`):F(parallel?`${mode==='alt'?'엇각':'동위각'}이 같으므로 두 직선이 평행합니다.`:'SSS 합동이므로 두 각의 크기가 같습니다.',d.Q?`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`:parallel?'$l\\parallel PD$':`$\\angle QPD=\\angle XOY=${tex(d.m.th)}^{\\circ}$`),d=>d.Q?clean(d.Q.stem):parallel?`현재 직선 l과 점 P · ${mode==='alt'?'엇각':'동위각'}을 같게 작도`:`현재 ∠XOY=${deg(d.m.th)} · 반지름 ${rational(d.m.r)}`);
  }
  const prerequisites=[[],[0],[0],[1,2],[2,3],[4]];
  const validOrder=order=>order.length===6&&new Set(order).size===6&&order.every((step,i)=>prerequisites[step].every(j=>order.indexOf(j)>=0&&order.indexOf(j)<i));
  for(const problem of [false,true])register('c1-5',problem?'순서문제':'순서익히기','dependency-ordered-compass-construction',d=>{
    const m=problem?reviewed(d):d.m,Q=problem?question(d):null,order=problem?(m.pk.good||[0,1,2,3,4,5]):[0,1,2,3,4,5];
    return{...d,m,Q,order,parallel:true,geo:copyGeometry({...m,al:0,r:1.4,mode:'corr'},true),answer:Q?correct(Q)+1:null};
  },(b,t,d)=>{drawCopy(b,t,d);if(t>=.5){const j=t>=6.2?5:t>=4.9?4:t>=3.8?3:t>=2.4?2:t>=1.2?1:0;label(b,P(0,1.3),`${letters[d.m.perm.indexOf(d.order[j])]} · ${['직선 PQ','Q 중심 호','같은 반지름의 P 중심 호','AB 벌림','C 중심 호','직선 PD'][d.order[j]]}`,'amber',{size:12});}},
  (t,d)=>t<3.8?F('PQ가 먼저 있어야 두 원의 교점을 찾을 수 있습니다.'):t<4.9?F('같은 반지름의 두 원을 먼저 그린 뒤 컴퍼스를 AB로 바꿉니다.'):t<7.5?F('C와 AB가 있어야 D를 찾고, D가 있어야 PD를 긋습니다.'):F('필요한 점과 길이가 준비되는 순서를 따릅니다.',d.Q?`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`:d.order.map(i=>letters[d.m.perm.indexOf(i)]).join(' → ')),d=>d.Q?clean(d.Q.stem||d.Q.html):'현재 순서 카드의 글자와 실제 작도 단계를 대응하기');

  // ② The strict inequality is visible in the endpoints of rigid rods.
  function rodModel(values){const sorted=[...values].sort((a,b)=>a-b),[a,b,L]=sorted;return{values:[...values],a,b,L,lo:Math.abs(a-b),sum:a+b,ok:a+b>L};}
  function rodPose(m,u){
    const x=(m.a*m.a+m.L*m.L-m.b*m.b)/(2*m.L),h=m.ok?Math.sqrt(Math.max(0,m.a*m.a-x*x)):0;
    const left=m.ok?Math.atan2(h,x)/R:0,right=m.ok?Math.atan2(h,m.L-x)/R:0;
    return{A:O,B:P(m.L,0),C:polar(O,m.a,-(55+(left-55)*u)),D:polar(P(m.L,0),m.b,-180+55+(right-55)*u)};
  }
  function drawRods(b,t,d,mini=false,convert=p=>p){
    const m=d.rods,p=rodPose(m,phase(t,.9,5.8)),G=d.G,A=convert(p.A),B=convert(p.B),C=convert(p.C),D=convert(p.D);
    if(!mini)setup(b,[O,P(m.L,0),P(-.5,-Math.max(m.a,m.b)),P(m.L+1,1)],.16);
    line(b,A,B,'amber',mini?3:5);line(b,A,C,'sky',mini?3:5);line(b,B,D,'rose',mini?3:5);
    [A,B,C,D].forEach(p=>dot(b,p));
    if(!mini){label(b,mid(A,B),cm(m.L),'amber',{dy:24});label(b,mid(A,C),cm(m.a),'sky',{dx:-20});label(b,mid(B,D),cm(m.b),'rose',{dx:20});
      if(t>=6.1)label(b,mid(A,B),`${rational(m.L)} ${m.ok?'<':m.L===m.sum?'=':'>'} ${rational(m.a)}+${rational(m.b)}`,t>=7.3?(m.ok?'green':'rose'):'ink',{dy:50});
    }
  }
  function cells(b,count){const cols=b.W<560?2:3,rows=Math.ceil(count/cols),cw=3.6,ch=3;setup(b,[P(-cols*cw/2,-rows*ch/2),P(cols*cw/2,rows*ch/2)],.035);return Array.from({length:count},(_,i)=>P((i%cols-(cols-1)/2)*cw,(Math.floor(i/cols)-(rows-1)/2)*ch));}
  function drawRodCards(b,t,d){
    const cs=cells(b,d.cards.length),max=Math.max(...d.cards.map(c=>c.rods.L));
    d.cards.forEach((card,i)=>{const c=cs[i],scale=2.5/max,conv=p=>P(c.x+(p.x-card.rods.L/2)*scale,c.y+.45+p.y*scale);
      drawRods(b,t,{...d,rods:card.rods},true,conv);label(b,P(c.x,c.y-1.2),`${card.name} ${card.rods.values.map(v=>rational(v)).join('·')} cm`,'ink',{size:12});
      if(t>=6.6)label(b,P(c.x,c.y+1.1),card.rods.ok?'두 끝이 만남':card.rods.L===card.rods.sum?'일직선':'끝이 닿지 않음',card.rods.ok?'green':'rose',{size:12});
      if(t>=7.7&&card.selected)label(b,P(c.x,c.y+1.38),'정답','green',{size:12});
    });
  }
  for(const boundary of [false,true])register('c2-1',boundary?'같은합':'성립조건','rigid-rods-meet-or-flatten',d=>{
    const values=d.m.it.map(x=>x.v),r=rodModel(values),rods=boundary?rodModel([r.a,r.b,r.a+r.b]):r;return{...d,rods,boundary,answer:rods.ok};
  },drawRods,(t,d)=>t<.9?F('가장 긴 막대를 밑에 놓고 두 짧은 막대를 끝에 답니다.'):t<5.8?F('길이를 바꾸지 않고 막대만 돌려 두 끝이 만나는지 봅니다.'):t<7.3?F('삼각형의 넓이가 생기는지, 일직선으로만 닿는지 구별합니다.'):F(d.rods.ok?'짧은 두 변의 합이 가장 긴 변보다 큽니다.':'합이 같으면 일직선, 더 작으면 끝이 닿지 않습니다.',`$${tex(d.rods.a)}+${tex(d.rods.b)}${d.rods.ok?'>':d.rods.sum===d.rods.L?'=':'<'}${tex(d.rods.L)}$`),d=>d.boundary?`현재 짧은 막대 ${cm(d.rods.a)}, ${cm(d.rods.b)} · 긴 막대를 그 합으로 놓은 경계 보기`:`현재 세 막대 ${d.rods.values.map(cm).join(', ')}`);
  for(const kind of [0,1])register('c2-1',kind?'가능한값':'불가능값','current-five-rod-candidates-tested-by-hinges',d=>{
    const m={...d.m,pk:{...d.m.pk,kind}},Q=question(d,m),answer=correct(Q),cards=Q.choices.map((q,i)=>({name:nums[i],rods:rodModel([m.pk.a,m.pk.b,parseFloat(q.p)]),selected:i===answer}));
    return{...d,m,Q,cards,answer:answer+1};
  },drawRodCards,(t,d)=>t<.9?F('현재 문제의 다섯 막대 후보를 같은 방법으로 놓습니다.'):t<5.8?F('각 후보에서 가장 긴 막대와 나머지 두 막대를 비교합니다.'):t<7.7?F('길이를 유지해도 끝이 만나지 않거나 일직선이면 삼각형이 아닙니다.'):F(kind?'삼각형을 만들 수 있는 후보를 고릅니다.':'삼각형을 만들 수 없는 후보를 고릅니다.',`${nums[d.answer-1]} ${d.Q.choices[d.answer-1].p}`),d=>clean(d.Q.stem));
  for(const goal of ['range','count','max','min'])register('c2-2',{range:'범위',count:'정수개수',max:'최댓값',min:'최솟값'}[goal],'two-rigid-rods-bound-endpoint-separation',d=>{
    const m=goal==='range'?d.m:reviewed(d),lo=Math.abs(m.a-m.b),hi=m.a+m.b;
    return{...d,m,lo,hi,goal,answer:goal==='count'?hi-lo-1:goal==='max'?hi-1:goal==='min'?lo+1:null};
  },(b,t,d)=>{
    const {a,b:bb}=d.m,theta=t<3.3?90*(1-phase(t,.8,3.3)):t<5.5?180*phase(t,3.3,5.5):180-90*phase(t,5.5,6.8);
    const A=P(-a,0),B=O,C=polar(O,bb,-theta);setup(b,[P(-a-1,-Math.max(a,bb)-1),P(bb+1,3)]);
    line(b,A,B,'sky',4);line(b,B,C,'rose',4);line(b,A,C,'muted',1.8,{dash:[5,4]});
    label(b,mid(A,B),cm(a),'sky',{dy:23});label(b,mid(B,C),cm(bb),'rose',{dy:-22});label(b,mid(A,C),'x','amber',{dy:-18});
    if(t>=5.5){const x0=-a,x1=bb,scale=(x1-x0)/d.hi,y=2.1;line(b,P(x0,y),P(x1,y),'muted',1.5);
      const l=P(x0+d.lo*scale,y),h=P(x0+d.hi*scale,y);line(b,l,h,'green',3);[l,h].forEach(p=>b.circle(p,5/b.k,{color:'green',fill:'halo',width:2}));
      label(b,l,rational(d.lo),'ink',{dy:20});label(b,h,rational(d.hi),'ink',{dy:20});
      if(t>=6.8&&d.goal!=='range')for(let v=d.lo+1;v<d.hi;v++){const p=P(x0+v*scale,y);dot(b,p,'',d.goal==='max'&&v===d.hi-1||d.goal==='min'&&v===d.lo+1?'amber':'green');if(d.hi-d.lo<12)label(b,p,String(v),'green',{dy:-19,size:11});}
    }
  },(t,d)=>t<3.3?F('두 막대를 곧게 펴면 끝점 사이 거리는 두 길이의 합입니다.'):t<5.5?F('반대쪽으로 포개면 끝점 사이 거리는 두 길이의 차입니다.'):t<7.5?F('두 경계에서는 일직선이므로 양 끝값을 뺍니다.',`$${tex(d.lo)}\\lt x\\lt ${tex(d.hi)}$`):F(goal==='range'?'열린 두 끝값 사이에서만 삼각형이 생깁니다.':goal==='count'?'열린 구간 안의 정수만 셉니다.':goal==='max'?'합보다 한 칸 작은 정수가 최댓값입니다.':'차보다 한 칸 큰 정수가 최솟값입니다.',goal==='range'?`$${tex(d.lo)}\\lt x\\lt ${tex(d.hi)}$`:`$${tex(d.answer)}${goal==='count'?'\\text{개}':'\\text{ cm}'}$`),d=>`${goal==='range'?'현재 탐구':'현재 생성 문제'}의 두 변 ${cm(d.m.a)}, ${cm(d.m.b)} · ${goal==='range'?'x의 범위':goal==='count'?'정수 x 개수':goal==='max'?'정수 x 최댓값':'정수 x 최솟값'}`);
  for(const problem of [false,true])register('c2-3',problem?'조합문제':'조합익히기','omit-each-stick-once-and-test-four-triples',d=>{
    const m=problem?reviewed(d):d.m;return{...d,m,cards:m.cards.map((c,i)=>({name:letters[i],rods:rodModel(c.t),selected:false})),answer:m.cards.filter(c=>c.ok).length};
  },drawRodCards,(t,d)=>t<.9?F('막대 하나씩을 제외하면 서로 다른 세 막대 조합은 네 개입니다.'):t<5.8?F('네 조합의 막대를 각각 돌려 가장 긴 변의 양 끝을 이어 봅니다.'):t<7.7?F('끝이 만나는 조합만 남깁니다. 같은 막대를 순서만 바꾸어 다시 세지 않습니다.'):F('삼각형을 만들 수 있는 조합의 개수입니다.',`$${d.answer}\\text{개}$`),d=>`${problem?'현재 생성 문제':'현재 탐구'}의 네 막대 ${d.m.v.map(cm).join(', ')}`);

  // ③ A triangle is fixed by intersections, not by the appearance of a sketch.
  function ssaModel(adjacent,opposite,A){
    const base=[O,P(adjacent,0)],u=polar(O,1,-A),projection=adjacent*Math.cos(A*R),disc=opposite**2-adjacent**2*Math.sin(A*R)**2;
    const roots=disc< -1e-8?[]:disc<=1e-8?[projection]:[projection-Math.sqrt(disc),projection+Math.sqrt(disc)];
    const lengths=roots.filter(x=>x>1e-8),points=lengths.map(x=>mul(u,x));return{adjacent,opposite,A,base,lengths,points,count:points.length};
  }
  function conditionTriangle(G,c){
    if(c.kind==='sss'||c.kind==='sssx')return G.triSSS(c.a,c.b,c.c);
    if(c.kind==='asa'||c.kind==='aaa')return G.triASA(c.c||5,c.A,c.B);
    if(c.kind==='ssa'){const m=ssaModel(c.adjacent,c.opposite,c.A);return m.points[0]?[O,P(c.adjacent,0),m.points[0]]:null;}
    return G.triSAS(c.b||4,c.c||6,c.A||55);
  }
  function conditionVerdict(c){
    if(c.kind==='sss'||c.kind==='sssx')return Math.max(c.a,c.b,c.c)<c.a+c.b+c.c-Math.max(c.a,c.b,c.c)?'하나로 정해짐':'만들 수 없음';
    if(c.kind==='sas'||c.kind==='asa')return '하나로 정해짐';
    if(c.kind==='ssa')return `${ssaModel(c.adjacent,c.opposite,c.A).count}개 후보`;
    return '여러 크기·모양';
  }
  function conditionDraw(b,t,d,c=d.condition,mini=false,convert=p=>p){
    const G=d.G;const T=conditionTriangle(G,c);
    const n=p=>convert(p);
    if(c.kind==='sss'||c.kind==='sssx'){
      const m=rodModel([c.a,c.b,c.c]);if(mini){drawRods(b,t,{...d,rods:m},true,convert);return;}setup(b,[P(-c.b,-Math.max(c.a,c.b)),P(c.c+c.a,1)],.08);
      const A=O,B=P(c.c,0);line(b,n(A),n(B),'amber',mini?2:3.5);dot(b,n(A),'A');dot(b,n(B),'B');
      const u=phase(t,.8,3.2),v=phase(t,3.3,5.6);
      // The two compass circles intersect exactly at the admissible apex.
      if(!mini){arc(b,A,c.b,-175,-5,u,'sky');arc(b,B,c.a,-175,-5,v,'rose');}
      else{const p=rodPose(m,phase(t,.8,5.6));line(b,n(p.A),n(p.C),'sky',2);line(b,n(p.B),n(p.D),'rose',2);}
      if(T&&t>=5.6){line(b,n(T[0]),n(T[2]),'sky',2.7);line(b,n(T[1]),n(T[2]),'rose',2.7);dot(b,n(T[2]),'C');}
      if(!mini){label(b,mid(A,B),cm(c.c),'amber',{dy:25});label(b,P(-.5,-c.b/2),`AC=${cm(c.b)}`,'sky',{dx:-15});label(b,P(c.c+.5,-c.a/2),`BC=${cm(c.a)}`,'rose',{dx:18});}
      return;
    }
    if(c.kind==='ssa'){
      const m=ssaModel(c.adjacent,c.opposite,c.A),ray=polar(O,Math.max(c.adjacent+c.opposite,7),-c.A);
      if(!mini)setup(b,[O,P(c.adjacent+c.opposite,1),P(-1,-c.opposite),ray],.18);
      line(b,n(O),n(P(c.adjacent,0)),'amber',3);line(b,n(O),n(ray),'muted',1.7,{dash:[4,4]});if(!mini){dot(b,O,(c.names||'ABC')[0]);dot(b,P(c.adjacent,0),(c.names||'ABC')[1]);}
      if(mini){sector(b,angleWedge(n(O),n(P(c.adjacent,0)),n(ray)),'sky',deg(c.A),9/b.k);const u=phase(t,.9,4.5);if(u>0)b.path(Array.from({length:25},(_,i)=>n(polar(P(c.adjacent,0),c.opposite,-180+180*u*i/24))),{color:'rose',width:1.3});}
      if(!mini){arc(b,P(c.adjacent,0),c.opposite,-180,0,phase(t,.9,4.5),'rose');sector(b,angleWedge(O,P(1,0),ray),'sky',deg(c.A));label(b,P(c.adjacent/2,0),cm(c.adjacent),'amber',{dy:22});label(b,P(c.adjacent,-c.opposite),cm(c.opposite),'rose',{dy:-17});}
      m.points.forEach((q,i)=>{if(t>=4.5){if(mini){line(b,n(P(c.adjacent,0)),n(q),i?'rose':'green',2);dot(b,n(q));}else{line(b,P(c.adjacent,0),q,i?'rose':'green',2.6);dot(b,q,`C${i+1}`,i?'rose':'green',{dx:-24,dy:i?-18:0,align:'right'});}}});
      return;
    }
    let other=null;
    if(c.kind==='aaa'){other=T.map(p=>mul(p,1+phase(t,1.5,5.6)*.7));}
    if(c.kind==='s2'){other=G.triSAS(c.b,c.c,35+65*phase(t,1.5,5.6));}
    if(c.kind==='sa'){other=G.triSAS(3+4*phase(t,1.5,5.6),c.c,c.A);}
    if(!mini){const extent=other?[...T,...G.triSAS(8,c.c||8,c.A||100),...T.map(p=>mul(p,1.7))]:T;setup(b,extent,.23);}
    const show=other||T;
    if(c.kind==='sas'){
      line(b,n(T[0]),n(T[1]),'amber',3);line(b,n(T[0]),n(T[2]),'sky',3);
      if(t>=4.7)trace(b,n(T[1]),n(T[2]),phase(t,4.7,6.5),'green');
    }else if(c.kind==='asa'){
      line(b,n(T[0]),n(T[1]),'amber',3);trace(b,n(T[0]),n(T[2]),phase(t,.9,3.3),'sky');trace(b,n(T[1]),n(T[2]),phase(t,3.4,5.7),'rose');
    }else{poly(b,T.map(n),'muted',.03);poly(b,show.map(n),'rose',.07);}
    if(mini){if(c.A)sector(b,angleWedge(n(show[0]),n(show[1]),n(show[2])),'sky',deg(c.A),9/b.k);if(c.B)sector(b,angleWedge(n(show[1]),n(show[0]),n(show[2])),'rose',deg(c.B),9/b.k);}
    if(!mini){
      if(c.c)side(b,G,T,0,cm(c.c),'amber');if(c.b&&(c.kind==='sas'||c.kind==='s2'))side(b,G,T,2,cm(c.b),'sky');
      if(c.A)sector(b,angleWedge(show[0],show[1],show[2]),'sky',deg(c.A));if(c.B)sector(b,angleWedge(show[1],show[0],show[2]),'rose',deg(c.B));
      if(c.kind==='aaa')sector(b,angleWedge(show[2],show[0],show[1]),'green',deg(180-c.A-c.B));
      T.forEach((p,i)=>dot(b,p,(c.names||'ABC')[i]));
    }
  }
  function conditionGiven(c){return c.kind==='sss'||c.kind==='sssx'?`세 변 ${[c.a,c.b,c.c].map(cm).join(', ')}`:c.kind==='ssa'?`두 변 ${cm(c.adjacent)}, ${cm(c.opposite)} · 끼인각이 아닌 ${deg(c.A)}`:c.kind==='aaa'?`세 각 ${deg(c.A)}, ${deg(c.B)}, ${deg(180-c.A-c.B)}`:c.kind==='asa'?`AB=${cm(c.c)}, ∠A=${deg(c.A)}, ∠B=${deg(c.B)}`:c.kind==='s2'?`두 변 ${cm(c.b)}, ${cm(c.c)}`:`AB=${cm(c.c)}${c.b?`, AC=${cm(c.b)}`:''} · ∠A=${deg(c.A)}`;}
  function conditionFrame(t,d){const c=d.condition;
    if(t<.8)return F('숫자뿐 아니라 그 변과 각이 놓인 위치를 확인합니다.');
    if(c.kind==='sss'||c.kind==='sssx')return t<5.6?F('밑변 양 끝에서 두 길이를 반지름으로 하는 호를 그립니다.'):t<7.3?F(c.kind==='sssx'?'두 호가 만나지 않거나 밑변 위에서만 닿아 넓이가 생기지 않습니다.':'두 호의 교점이 세 번째 꼭짓점을 정합니다. 거울상은 뒤집어 포갤 수 있습니다.'):F(conditionVerdict(c),c.kind==='sss'?'$SSS$':'가장 긴 변 ≥ 나머지 두 변의 합');
    if(c.kind==='ssa')return t<4.5?F('주어진 각의 반직선과 맞은편 변 길이의 원을 만납니다.'):t<7.3?F('두 교점이면 같은 조건에서 서로 다른 두 삼각형이 생깁니다.'):F(`현재 조건의 양의 교점은 ${ssaModel(c.adjacent,c.opposite,c.A).count}개입니다.`, 'SSA는 일반적인 합동 조건이 아닙니다.');
    if(c.kind==='sas')return t<4.7?F('주어진 두 변을 그 사이의 각에 고정합니다.'):t<7.3?F('남은 두 끝점을 이으면 세 번째 변도 정해집니다.'):F('두 변과 끼인각이 삼각형을 하나로 정합니다.','$SAS$');
    if(c.kind==='asa')return t<5.7?F('정해진 변의 양 끝에서 주어진 두 각의 반직선을 그립니다.'):t<7.3?F('두 반직선의 교점이 세 번째 꼭짓점입니다.'):F('한 변과 양 끝각이 삼각형을 하나로 정합니다.','$ASA$');
    return t<7.3?F(c.kind==='aaa'?'각의 크기를 유지한 채 전체 길이를 바꾸어 봅니다.':c.kind==='s2'?'주어진 두 변의 길이를 유지하고 사이 각을 바꿉니다.':'주어진 변과 각을 유지해도 다른 변은 늘릴 수 있습니다.'):F('같은 조건으로 크기나 모양이 다른 삼각형이 생깁니다.','조건이 부족합니다.');
  }
  for(const [scene,label,type] of [['c3-1','세 변','sss'],['c3-2','끼인각','sas'],['c3-2','끼인각 아님','ssa'],['c3-3','양 끝각','asa'],['c3-3','각만 같음','aaa'],['c3-4','세 각만','aaa'],['c3-4','끼인각 아님','ssa'],['c3-4','삼각형 성립','sssx']]){
    register(scene,label,'compass-intersections-or-condition-preserving-counterexample',d=>{
      let condition={kind:type,...d.m};condition.kind=type;
      if(type==='ssa')condition={kind:type,adjacent:d.m.c||d.m.sc,opposite:d.m.b||d.m.sb,A:scene==='c3-4'?d.m.sA:d.m.A,names:['B','A','C']};
      if(type==='sssx')condition={kind:type,a:d.m.la,b:d.m.lb,c:d.m.la+d.m.lb+d.m.ld};
      return{...d,condition,answer:type==='ssa'?ssaModel(condition.adjacent,condition.opposite,condition.A).count:conditionVerdict(condition)};
    },conditionDraw,conditionFrame,d=>`현재 조건: ${conditionGiven(d.condition)}`);
  }
  function conditionBounds(G,c){
    let ps=conditionTriangle(G,c)||[O,P(c.c||6,0)];
    if(c.kind==='sss'||c.kind==='sssx'){const m=rodModel([c.a,c.b,c.c]);ps=[P(-m.a,-Math.max(m.a,m.b)),P(m.L+m.b,0)];}
    if(c.kind==='ssa'){const ray=polar(O,Math.max(c.adjacent+c.opposite,7),-c.A);ps=[...ps,ray,P(c.adjacent-c.opposite,-c.opposite),P(c.adjacent+c.opposite,0)];}
    if(c.kind==='aaa')ps=[...ps,...ps.map(p=>mul(p,1.7))];
    if(c.kind==='s2')ps=[...ps,...[35,55,70,90,100].flatMap(a=>G.triSAS(c.b,c.c,a))];
    if(c.kind==='sa')ps=[...ps,...G.triSAS(3,c.c,c.A),...G.triSAS(7,c.c,c.A)];
    return G.bboxOf(ps);
  }
  function conditionCards(b,t,d){
    const cs=cells(b,d.conditions.length);
    d.conditions.forEach((c,i)=>{
      const bb=conditionBounds(d.G,c),scale=2.2/Math.max(bb.x1-bb.x0,bb.y1-bb.y0,2),centre=P((bb.x0+bb.x1)/2,(bb.y0+bb.y1)/2),cell=cs[i],conv=p=>P(cell.x+(p.x-centre.x)*scale,cell.y+(p.y-centre.y)*scale);
      conditionDraw(b,t,{...d,condition:c},c,true,conv);
      label(b,P(cell.x,cell.y-1.25),`${nums[i]}${t>=5.7?' '+c.kind.toUpperCase():''}`,'ink',{size:12});
      const detail=c.kind==='sss'||c.kind==='sssx'?[c.a,c.b,c.c].map(v=>rational(v)).join('·')+' cm':c.kind==='ssa'?`${rational(c.adjacent)}·${rational(c.opposite)} cm`:c.kind==='aaa'?[c.A,c.B,180-c.A-c.B].map(deg).join('·'):c.kind==='asa'?cm(c.c):c.kind==='s2'?`${rational(c.b)}·${rational(c.c)} cm`:`${rational(c.c)}${c.b?'·'+rational(c.b):''} cm`;
      label(b,P(cell.x,cell.y+1.02),detail,'ink',{size:11});
      if(t>=7.3)label(b,P(cell.x,cell.y+1.35),d.answer===i+1?'정답':conditionVerdict(c),'green',{size:11});
    });
  }
  for(const scene of ['c3-1','c3-2','c3-3','c3-4'])register(scene,'보기 판별','current-generated-conditions-compared-by-constructibility',d=>{const Q=question(d);return{...d,Q,conditions:Q.sourceChoices.map(c=>({...c})),answer:correct(Q)+1};},conditionCards,
    (t,d)=>t<.8?F('현재 생성된 다섯 보기의 길이·각과 위치를 비교합니다.'):t<5.7?F('호의 교점, 끼인각, 양 끝각이 꼭짓점을 하나로 정하는지 확인합니다.'):t<7.3?F('삼각형이 안 되거나 크기·모양이 달라질 수 있는 조건을 구별합니다.'):F('현재 보기에서 삼각형이 하나로 정해지는 조건입니다.',`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`),d=>clean(d.Q.stem));

  const GIVEN=[[0,3],[0,1],[3,4],[0,5]],PART=['AB','BC','CA','∠A','∠B','∠C'],PART2=['DE','EF','FD','∠D','∠E','∠F'];
  const rotatedPart=(i,r)=>i<3?(i+r)%3:3+(i-3+r)%3;
  function partsKind(parts){
    const s=new Set(parts),sides=[0,1,2].filter(i=>s.has(i)),angles=[3,4,5].filter(i=>s.has(i)),all=angles.length>=2?[3,4,5]:angles;
    if(sides.length===3)return'SSS';
    if(sides.length===2){const vertex=sides.includes(0)&&sides.includes(2)?3:sides.includes(0)&&sides.includes(1)?4:5;if(all.includes(vertex))return'SAS';}
    return sides.length&&all.length===3?'ASA':'';
  }
  function markParts(b,T,parts,color='sky'){
    parts.forEach((p,i)=>{if(p<3)b.ticks(T[p],T[(p+1)%3],{count:p+1,color});else{const v=p-3;sector(b,angleWedge(T[v],T[(v+1)%3],T[(v+2)%3]),color,'',(.48+i*.025));}});
  }
  function partText(i){return`${PART[i]}=${PART2[i]}`;}
  function partsCondition(G,T,parts){
    const sides=[0,1,2].filter(i=>parts.includes(i)),angs=[0,1,2].filter(i=>parts.includes(i+3)),A=[0,1,2].map(i=>G.angBetween(T[i],T[(i+1)%3],T[(i+2)%3]));
    if(sides.length===3)return{kind:'sss',a:dist(T[1],T[2]),b:dist(T[2],T[0]),c:dist(T[0],T[1])};
    if(sides.length===2){const endpoints=sides.map(i=>[i,(i+1)%3]),v=endpoints[0].find(i=>endpoints[1].includes(i));
      if(angs.includes(v)||angs.length>=2){const x=(v+1)%3,y=(v+2)%3;return{kind:'sas',c:dist(T[v],T[x]),b:dist(T[v],T[y]),A:A[v],names:[v,x,y].map(i=>'ABC'[i])};}
      const a=angs[0],adj=endpoints.find(e=>e.includes(a)),opp=endpoints.find(e=>!e.includes(a));
      if(adj&&opp)return{kind:'ssa',adjacent:dist(T[adj[0]],T[adj[1]]),opposite:dist(T[opp[0]],T[opp[1]]),A:A[a],names:[a,adj.find(i=>i!==a),[0,1,2].find(i=>!adj.includes(i))].map(i=>'ABC'[i])};
      return{kind:'s2',c:dist(T[v],T[(v+1)%3]),b:dist(T[v],T[(v+2)%3])};
    }
    if(sides.length&&angs.length>=2){const v=sides[0],w=(v+1)%3;return{kind:'asa',c:dist(T[v],T[w]),A:A[v],B:A[w],names:[v,w,(v+2)%3].map(i=>'ABC'[i])};}
    if(!sides.length)return{kind:'aaa',A:A[0],B:A[1]};
    const v=sides[0],w=(v+1)%3;return{kind:'sa',c:dist(T[v],T[w]),A:A[angs[0]??v]};
  }
  for(const count of [false,true])register('c3-5',count?'조건 개수':'조건 더하기','each-additional-part-tested-by-compass-constraints',d=>{
    const g=count?d.m.pk.g:d.m.g,rot=count?d.m.pk.rot||0:0,base=GIVEN[g].map(i=>rotatedPart(i,rot)),T=[O,P(6,0),P(count?2.6:d.m.Cx,-(count?3.7:d.m.Cy))];
    const candidates=[0,1,2,3,4,5].filter(i=>!GIVEN[g].includes(i)).map(i=>rotatedPart(i,rot)),valid=candidates.filter(i=>partsKind([...base,i]));
    const added=count?[]:d.m.add.length?d.m.add:[valid[0]],conditions=candidates.map(i=>partsCondition(d.G,T,[...base,i]));
    return{...d,count,T,base,candidates,valid,added,conditions,answer:count?valid.length:partsKind([...base,...added]),Q:count?question(d):null,condition:partsCondition(d.G,T,[...base,...added])};
  },(b,t,d)=>{
    if(d.count){const cs=cells(b,4);d.candidates.forEach((p,i)=>{const c=cs[i],scale=.29,conv=q=>P(c.x+(q.x-3)*scale,c.y+(q.y+1.5)*scale),T=d.T.map(conv);
      if(t<2.1){poly(b,T,'sky',.04);markParts(b,T,d.base);if(t>=1)markParts(b,T,[p],'amber');}
      label(b,P(c.x,c.y-1.2),`${letters[i]} ${partText(p)}`,'ink',{size:12});
      if(t>=2.1){const cnd=d.conditions[i],box=conditionBounds(d.G,cnd),s=2.2/Math.max(box.x1-box.x0,box.y1-box.y0,2),cnv=q=>P(c.x+(q.x-(box.x0+box.x1)/2)*s,c.y+(q.y-(box.y0+box.y1)/2)*s);conditionDraw(b,t-1,{...d,condition:cnd},cnd,true,cnv);}
      if(t>=7.3)label(b,P(c.x,c.y+1.25),partsKind([...d.base,p])||'조건 부족',d.valid.includes(p)?'green':'rose',{size:12});
    });return;}
    const all=[...d.base,...d.added],image=initialImage(d.T),target=partsKind(all)?d.T:null,moving=target?rigidPose(image,target,phase(t,3.3,6.7)):image;
    if(!target&&t>=2){conditionDraw(b,t-1.2,d);return;}
    setup(b,[...d.T,...image]);tri(b,d.G,d.T);tri(b,d.G,moving,t>=6.7&&target?'':'DEF',{fill:'green'});markParts(b,d.T,d.base);markParts(b,moving,d.base);
    if(t>=1.3){markParts(b,d.T,d.added,'amber');markParts(b,moving,d.added,'amber');}
    if(!target&&t>=3.3)label(b,center(moving),'같다는 보장 없음','rose',{dy:26,size:12});
  },(t,d)=>t<1.3?F('현재 알려진 두 조건을 같은 표시로 묶습니다.'):t<3.3?F(d.count?'네 후보를 각각 하나씩 더합니다.':'선택한 추가 조건을 노란색으로 표시합니다.'):t<7.3?F('세 변, 두 변과 끼인각, 한 변과 양 끝각으로 꼭짓점이 정해지는지 확인합니다.'):d.count?F('충분한 조건에 해당하는 후보만 셉니다.',`${d.valid.map(p=>letters[d.candidates.indexOf(p)]).join(', ')} → ${d.answer}개`):F(d.answer?`${d.answer} 조건이므로 같은 삼각형으로 정해집니다.`:'이 조건만으로 항상 합동이라고 할 수 없습니다.',d.answer?'$\\triangle ABC\\equiv\\triangle DEF$':''),d=>`${d.count?'현재 문제':'현재 탐구'}: ${d.base.map(partText).join(', ')}${d.count?' · 추가 조건 네 후보 중 개수':` · ${d.added.map(partText).join(', ')} 추가${d.m.add.length?'':' 보기'}`}`);

  // ④ Congruent figures keep lengths while their vertex names travel with them.
  for(const goal of ['overlay','point','side','angle'])register('c4-1',{overlay:'포개기',point:'대응점',side:'대응변',angle:'대응각'}[goal],'rigid-translation-rotation-or-three-dimensional-reflection',d=>{
    const kind={point:0,side:1,angle:2}[goal],m=goal==='overlay'?d.m:reviewed(d,{...d.m,pk:{...d.m.pk,kind}}),T=[O,P(6,0),P(m.Cx,-m.Cy)],names=goal==='overlay'?'DEF':m.pk.p.map(i=>'DEF'[i]).join(''),q=m.pk.q;
    const Q=goal==='overlay'?null:question(d,{...d.m,pk:{...d.m.pk,kind}});return{...d,m,T,names,q,goal,Q,answer:goal==='point'?names[q]:goal==='side'?names[q]+names[(q+1)%3]:goal==='angle'?`∠${names[q]}`:true};
  },(b,t,d)=>{
    const p=pairDraw(b,d,t,d.T,{mode:d.m.mode,namesB:d.names});
    const selected=d.goal==='side'?[d.q,(d.q+1)%3]:d.goal==='overlay'?[0,1,2]:[d.q];
    if(t>=.8){for(const i of selected){dot(b,p.T[i],'','amber');dot(b,p.moving[i],'','amber');}}
    if(d.goal==='side'&&t>=1.2){line(b,p.T[d.q],p.T[(d.q+1)%3],'amber',4);line(b,p.moving[d.q],p.moving[(d.q+1)%3],'amber',4);}
    if(d.goal==='angle'&&t>=1.2){[p.T,p.moving].forEach(T=>sector(b,angleWedge(T[d.q],T[(d.q+1)%3],T[(d.q+2)%3]),'amber'));}
    if(t>=7.3)selected.forEach(i=>label(b,d.T[i],`${'ABC'[i]}↔${d.names[i]}`,'green',{dy:i===2?-24:29}));
  },(t,d)=>t<.8?F('꼭짓점 이름을 붙인 두 도형을 확인합니다.'):t<6.7?F(d.m.mode==='flip'?'종이를 공간에서 반 바퀴 뒤집어 길이를 유지한 채 포갭니다.':d.m.mode==='slide'?'방향을 유지하고 삼각형 전체를 밀어 포갭니다.':'삼각형 전체를 돌리고 이동하여 세 꼭짓점을 포갭니다.'):t<7.3?F('같은 자리에 도착한 점을 따라 대응하는 부분을 확인합니다.'):F(d.goal==='overlay'?'모양과 크기가 같아서 꼭 포개어집니다.':d.goal==='point'?`점 ${'ABC'[d.q]}의 대응점은 ${d.answer}입니다.`:d.goal==='side'?`변 ${PART[d.q]}의 두 끝점에 대응하는 점을 잇습니다.`:`∠${'ABC'[d.q]}와 같은 자리에 도착한 각입니다.`,d.Q?`${nums[correct(d.Q)]} ${clean(d.Q.choices[correct(d.Q)].h)}`:`$\\triangle ABC\\equiv\\triangle ${d.names}$`),d=>d.Q?clean(d.Q.stem):`현재 삼각형 ABC · ${d.m.mode==='flip'?'뒤집기':d.m.mode==='slide'?'밀기':'돌리기'}로 포개기`);

  function rectangle(w,h,x=0){return[P(x,0),P(x+w,0),P(x+w,-h),P(x,-h)];}
  function rectanglePose(w,h,w2,h2,u){const A=rectangle(w,h),I=rectangle(w2,h2,w+3),same=near(w2,w)||near(w2,h);if(same){const ordered=near(w2,w)?I:[I[1],I[2],I[3],I[0]],triFrom=ordered.slice(0,3),triTo=A.slice(0,3),first=rigidPose(triFrom,triTo,u),fourth=add(first[0],sub(first[2],first[1]));return[...first,fourth];}return I.map(p=>P(p.x-(w+3)*u,p.y));}
  register('c4-2','대응순서','named-vertices-carried-by-rigid-superposition',d=>({...d,T:d.m.g.Tr,image:d.m.g.img,names:d.m.g.sg.map(i=>'DEF'[i]).join(''),answer:d.m.g.sg.map(i=>'DEF'[i]).join('')}),(b,t,d)=>{
    const p=pairDraw(b,d,t,d.T,{image:d.image,namesB:d.names});
    [[0,1],[1,2],[2,0]].forEach(([i,j],k)=>{if(t<6.7){side(b,d.G,d.T,i,cm(dist(d.T[i],d.T[j])),colors[k]);side(b,d.G,p.moving,i,cm(dist(d.T[i],d.T[j])),colors[k]);}if(t>=1.2){b.ticks(d.T[i],d.T[j],{count:k+1,color:colors[k]});b.ticks(p.moving[i],p.moving[j],{count:k+1,color:colors[k]});}});
    if(t>=7.3)d.T.forEach((p,i)=>label(b,p,`${'ABC'[i]}↔${d.names[i]}`,'green',{dy:i===2?-23:27}));
  },(t,d)=>t<2.4?F('현재 도형의 변 길이와 꼭짓점 이름을 함께 봅니다.'):t<6.7?F('길이가 같은 세 변을 겹치도록 도형 전체를 돌려 옮깁니다.'):t<7.3?F('ABC의 순서대로 포개진 상대 꼭짓점 이름을 읽습니다.'):F('대응점의 순서를 맞추어 합동식을 씁니다.',`$\\triangle ABC\\equiv\\triangle ${d.answer}$`),d=>`현재 AB=${cm(d.m.g.c)}, BC=${cm(d.m.g.a)}, CA=${cm(d.m.g.b)} · 같은 세 변의 대응 순서`);
  register('c4-2','같은넓이','equal-area-rectangles-translated-without-changing-shape',d=>{const w=d.m.Rw,h=d.m.Rh,w2=d.m.Rw2,h2=w*h/w2;return{...d,w,h,w2,h2,area:w*h,same:near(w,w2)||near(h,w2),answer:near(w,w2)||near(h,w2)};},(b,t,d)=>{
    const A=rectangle(d.w,d.h),I=rectangle(d.w2,d.h2,d.w+3),B=rectanglePose(d.w,d.h,d.w2,d.h2,phase(t,1.7,5.9));setup(b,[...A,...I]);poly(b,A,'sky',.14);poly(b,B,'rose',.1);
    label(b,center(A),`${rational(d.area)} cm²`,'sky');if(t<5.9)label(b,center(B),`${rational(d.area)} cm²`,'rose');
    [[A[0],A[1],d.w,'sky'],[A[0],A[3],d.h,'sky']].forEach(([p,q,n,c],i)=>label(b,mid(p,q),cm(n),c,i?{dx:-22}:{dy:25}));
    if(t<2)label(b,mid(I[1],I[2]),cm(d.h2),'rose',{dx:22});if(t<2)label(b,mid(I[0],I[1]),cm(d.w2),'rose',{dy:25});
  },(t,d)=>t<1.7?F('두 직사각형의 넓이는 같고, 각 변의 길이는 그림과 같습니다.'):t<5.9?F('변 길이를 그대로 유지하며 한 꼭짓점을 맞추어 포갭니다.'):t<7.3?F('넓이가 같은 것과 네 변이 꼭 포개지는 것을 구별합니다.'):F(d.same?'현재 값에서는 회전하거나 이동하면 꼭 포개집니다.':'현재 값에서는 남는 부분이 서로 달라 꼭 포개지지 않습니다.',d.same?'현재 두 직사각형은 합동':'같은 넓이만으로 합동을 보장할 수 없습니다.'),d=>`현재 직사각형 ${cm(d.w)}×${cm(d.h)}, ${cm(d.w2)}×${cm(d.h2)} · 넓이 ${rational(d.area)} cm²`);
  register('c4-2','보기판별','counterexample-for-the-current-false-congruence-statement',d=>{const Q=question(d),f=(d.m.pk.f||0)%7,T=d.G.triSSS(6,7,8);return{...d,Q,f,T,answer:correct(Q)+1};},(b,t,d)=>{
    if(d.f<=1){const w=d.f===0?6:6,h=4,w2=d.f===0?8:7,h2=d.f===0?3:3,A=rectangle(w,h),I=rectangle(w2,h2,w+3),B=I.map(p=>P(p.x-(w+3)*phase(t,1.5,5.8),p.y));setup(b,[...A,...I]);poly(b,A,'sky',.12);poly(b,B,'rose',.1);
      [[A,w,h,'sky'],[B,w2,h2,'rose']].forEach(([T,x,y,c])=>{if(t<1.5||t>=5.8){label(b,mid(T[0],T[1]),`${x}` ,c,{dy:c==='sky'?26:43});label(b,mid(T[1],T[2]),`${y}`,c,{dx:c==='sky'?-18:18});}});
      if(t>=6.2)label(b,P(3,-5),d.f===0?'6×4 = 8×3':'2(6+4) = 2(7+3)','amber',{size:14});return;}
    if(d.f<5){const T=d.T,I=translated(T.map(p=>mul(p,d.f===4?1.3:1.5)),12),B=I.map(p=>P(p.x-12*phase(t,1.7,5.8),p.y));setup(b,[...T,...I]);tri(b,d.G,T);tri(b,d.G,B,t>=5.8?'':'DEF',{fill:'rose'});[0,1,2].filter(i=>d.f===4?i===0:true).forEach(i=>{sector(b,angleWedge(T[i],T[(i+1)%3],T[(i+2)%3]),'amber');sector(b,angleWedge(B[i],B[(i+1)%3],B[(i+2)%3]),'amber');});return;}
    const p=pairDraw(b,d,t,d.T);if(d.f===5){line(b,d.T[0],d.T[1],'sky',4);line(b,p.moving[1],p.moving[2],'rose',4);if(t>=6.7){side(b,d.G,d.T,0,'AB=8','sky');side(b,d.G,d.T,1,'EF=6','rose');}}
    else{sector(b,angleWedge(d.T[0],d.T[1],d.T[2]),'sky');sector(b,angleWedge(p.moving[1],p.moving[0],p.moving[2]),'rose');}
  },(t,d)=>t<1.5?F('현재 보기의 주장을 실제 조건을 만족하는 도형으로 확인합니다.'):t<5.8?F(d.f<5?'주어진 조건을 유지한 두 도형을 움직여 차이를 찾습니다.':'같은 순서의 꼭짓점과 대응하는 변·각을 포개어 확인합니다.'):t<7.3?F(['넓이가 같아도 가로와 세로가 다를 수 있습니다.','둘레가 같아도 가로와 세로가 다를 수 있습니다.','세 각을 유지한 확대는 변 길이를 바꿉니다.','같은 모양이어도 크기가 다르면 포개지지 않습니다.','한 각을 같게 해도 다른 변을 정할 수 없습니다.','AB의 대응변은 DE입니다. EF는 BC와 대응합니다.','A의 대응점은 D입니다. E는 B와 대응합니다.'][d.f]):F('현재 보기에서 옳지 않은 설명입니다.',`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`),d=>`${clean(d.Q.stem||d.Q.html)} · 합동 관계와 길이를 유지한 비교 도형`);

  function linearExpression(k,m){return`${k===1?'':rational(k)}x${m===0?'':m>0?'+'+rational(m):rational(m)}`;}
  function equationBind(d,goal,square=false){
    const kind=goal==='angle'?1:0,active=d.m.pk.kind===kind,pk=d.m.pk,m=active?reviewed(d):d.m;
    const coefficient=active?(kind?pk.p:pk.k):1,constant=active?(kind?pk.q:pk.m):0;
    const target=active?(kind?(square?pk.th:pk.r):pk.n):kind?(square?m.th:m.B):square?dist(m.g.D,m.g.G):m.a;
    const T=square?null:kind?d.G.triASA(6,m.A,m.B):d.G.triSSS(m.a,m.b,m.c),value=(target-constant)/coefficient;
    return{...d,m,kind,active,auxiliary:!active,coefficient,constant,target,value,T,expr:linearExpression(coefficient,constant),Q:active?question(d):null,answer:value};
  }
  function equationFrame(t,d,pair){return t<1.2?F(d.active?'현재 문제의 식과 대응하는 부분을 확인합니다.':'현재 탐구 도형의 대응하는 양을 x로 둔 보조 문제입니다.'):t<6.6?F(pair):t<7.6?F('포개진 대응변의 길이 또는 대응각의 크기는 같습니다.',`$${relation(d.expr,d.target)}$`):F(d.active?'같은 양끼리 놓은 일차방정식을 풉니다.':'대응하는 양은 같은 값입니다.',d.active?`$x=\\frac{${tex(d.target)}${d.constant===0?'':d.constant>0?'-'+tex(d.constant):'+'+tex(-d.constant)}}{${tex(d.coefficient)}}=${tex(d.value)}$`:`$${relation('x',d.value)}$`);}
  for(const goal of ['length','angle'])register('c4-3',goal==='length'?'길이식':'각도식','corresponding-part-overlay-before-solving-current-equation',d=>equationBind(d,goal),(b,t,d)=>{
    const p=pairDraw(b,d,t,d.T);if(d.kind){sector(b,angleWedge(d.T[1],d.T[0],d.T[2]),'sky',`${d.expr}°`);if(t<6.7)sector(b,angleWedge(p.moving[1],p.moving[0],p.moving[2]),'green',deg(d.target));}
    else{side(b,d.G,d.T,1,`(${d.expr}) cm`,'sky');if(t<6.7)side(b,d.G,p.moving,1,cm(d.target),'green');line(b,d.T[1],d.T[2],'sky',4);line(b,p.moving[1],p.moving[2],'green',3.5);}
    if(t>=7.6)label(b,center(d.T),`x=${rational(d.value)}`,'green',{dy:22});
  },(t,d)=>equationFrame(t,d,'합동인 두 삼각형을 돌려 포개어 대응하는 부분을 확인합니다.'),d=>d.active?clean(d.Q.stem||d.Q.html):`현재 탐구 도형의 ${d.kind?'∠B=x°, 대응각 ∠E='+deg(d.target):'BC=x cm, 대응변 EF='+cm(d.target)} · 보조 문제`);

  // ⑤ The sufficient constraints determine the third vertex; AAA and SSA do not.
  const conditionParts={SSS:[0,1,2],SAS:[0,2,3],ASA:[0,3,4]};
  for(const kind of ['SSS','SAS','ASA'])register('c5-1',kind,'sufficient-constraints-lock-a-rigid-triangle-pair',d=>({...d,T:[O,P(6,0),P(d.m.Cx,-d.m.Cy)],parts:conditionParts[kind],kind,answer:kind}),(b,t,d)=>{
    const image=initialImage(d.T),moving=rigidPose(image,d.T,phase(t,3.4,6.7));setup(b,[...d.T,...image]);tri(b,d.G,d.T);tri(b,d.G,moving,t>=6.7?'':'DEF',{fill:'green'});markParts(b,d.T,d.parts);markParts(b,moving,d.parts);
    if(t>=1.1&&t<3.4){
      if(d.kind==='SSS'){arcAcross(b,d.T[0],dist(d.T[0],d.T[2]),direction(d.T[0],d.T[2])-20,direction(d.T[0],d.T[2])+20,phase(t,1.1,2.2),'amber');arcAcross(b,d.T[1],dist(d.T[1],d.T[2]),direction(d.T[1],d.T[2])-20,direction(d.T[1],d.T[2])+20,phase(t,2.2,3.4),'rose');}
      else if(d.kind==='SAS'){line(b,d.T[0],d.T[1],'amber',4.5);line(b,d.T[0],d.T[2],'amber',4.5);sector(b,angleWedge(d.T[0],d.T[1],d.T[2]),'rose');}
      else{trace(b,d.T[0],d.T[2],phase(t,1.1,2.2),'amber',4.5);trace(b,d.T[1],d.T[2],phase(t,2.2,3.4),'rose',4.5);}
    }
  },(t,d)=>t<1.1?F('같다고 주어진 변과 각만 같은 표시로 나타냅니다.'):t<3.4?F(d.kind==='SSS'?'밑변 양 끝의 두 원이 세 번째 꼭짓점을 정합니다.':d.kind==='SAS'?'고정된 끼인각 위에 두 변의 끝점을 정하면 나머지 변도 정해집니다.':'한 변 양 끝의 두 각이 그리는 반직선은 한 점에서 만납니다.'):t<6.7?F('이 조건으로 정해진 두 삼각형을 길이를 유지하며 포갭니다.'):t<7.3?F('주어지지 않은 나머지 부분까지 함께 겹칩니다.'):F(`${d.kind} 합동 조건입니다.`,'$\\triangle ABC\\equiv\\triangle DEF$'),d=>`${d.parts.map(partText).join(', ')} · 현재 탐구 삼각형`);
  function textCondition(d,text){
    const G=d.G,T=[O,P(6,0),P(d.m.Cx,-d.m.Cy)],A=G.angBetween(T[0],T[1],T[2]),B=G.angBetween(T[1],T[0],T[2]),b=dist(T[0],T[2]),a=dist(T[1],T[2]);
    if(text.includes('세 변'))return{kind:'sss',a,b,c:6};
    if(text.includes('세 각'))return{kind:'aaa',A,B};
    if(text.includes('양 끝각')||text.includes('두 각'))return{kind:'asa',c:6,A,B};
    if(text.includes('그 끼인각'))return{kind:'sas',b,c:6,A};
    if(text.includes('끼인각이 아닌')||text.includes('두 변의 길이와 한 각'))return{kind:'ssa',adjacent:6,opposite:3*(1+Math.sin(A*R)),A};
    if(text.includes('한 변의 길이와 한 각'))return{kind:'sa',c:6,A};
    return{kind:'s2',b,c:6};
  }
  register('c5-1','보기 판별','current-congruence-claims-with-constraint-preserving-counterexamples',d=>{const Q=question(d);return{...d,Q,conditions:Q.choices.map(c=>textCondition(d,clean(c.h))),answer:correct(Q)+1};},conditionCards,
    (t,d)=>t<.8?F('현재 문제의 다섯 문장을 도형의 조건으로 나타냅니다.'):t<5.7?F('꼭짓점이 고정되는 조건과, 조건을 유지하며 바뀔 수 있는 도형을 비교합니다.'):t<7.3?F('끼인각과 양 끝각의 위치를 확인합니다. 두 각이 같으면 셋째 각도 같습니다.'):F(d.m.pk.k%2?'합동을 보장하는 조건입니다.':'합동을 보장하지 못하는 조건입니다.',`${nums[d.answer-1]} ${clean(d.Q.choices[d.answer-1].h)}`),d=>`${clean(d.Q.html)} · 도형은 현재 탐구 삼각형에서 만든 조건 비교 예시`);

  function wedgeTransport(b,w,target,start,u,color,text=''){
    const turn=(norm(start-w.start+180)-180)*u;sector(b,{c:mix(w.c,target,u),start:w.start+turn,sweep:w.sweep},color,text);
  }
  for(const reason of [false,true])register('c5-2',reason?'합동 이유':'셋째 각','two-known-angle-sectors-fill-a-straight-angle-before-asa-overlay',d=>({...d,T:d.G.triASA(6,d.m.A,d.m.B),reason,answer:180-d.m.A-d.m.B}),(b,t,d)=>{
    const T=d.T,I=translated(T,9),B=rigidPose(I,T,phase(t,5.8,7.2)),bottom=P(7,2.2);setup(b,[...T,...I,P(0,4.2)]);tri(b,d.G,T);tri(b,d.G,B,t>=7.2?'':'DEF',{fill:'green'});
    [T,B].forEach(X=>{sector(b,angleWedge(X[0],X[1],X[2]),'sky',deg(d.m.A));sector(b,angleWedge(X[1],X[0],X[2]),'rose',deg(d.m.B));b.ticks(X[1],X[2],{color:'amber',count:2});if(t<7.6)sector(b,angleWedge(X[2],X[0],X[1]),'green','x');});
    if(t>=1.2){line(b,P(3,2.2),P(11,2.2),'muted',1.5);wedgeTransport(b,angleWedge(T[0],T[1],T[2]),bottom,180,phase(t,1.2,2.9),'sky');}
    if(t>=2.9)wedgeTransport(b,angleWedge(T[1],T[0],T[2]),bottom,180+d.m.A,phase(t,2.9,4.6),'rose');
    if(t>=4.6)sector(b,{c:bottom,start:180+d.m.A+d.m.B,sweep:d.answer},'green',t>=7.6?deg(d.answer):'x');
    if(t>=7.6)sector(b,angleWedge(T[2],T[0],T[1]),'green',deg(d.answer));
  },(t,d)=>t<1.2?F('같다고 주어진 두 각과 변 BC, EF를 확인합니다.'):t<4.6?F('두 알려진 각을 크기 그대로 일직선 위에 나란히 옮깁니다.'):t<5.8?F('180°에서 두 각을 제외한 나머지 각이 두 삼각형에서 같습니다.',`$x=180^{\\circ}-${tex(d.m.A)}^{\\circ}-${tex(d.m.B)}^{\\circ}$`):t<7.6?F('BC와 EF의 양 끝각까지 같아졌으므로 두 삼각형을 포갭니다.'):F(d.reason?'BC=EF와 그 양 끝각이 같으므로 ASA 합동입니다.':'두 각을 뺀 나머지 각의 크기입니다.',d.reason?'$\\triangle ABC\\equiv\\triangle DEF\\quad(ASA)$':`$x=${tex(d.answer)}^{\\circ}$`),d=>`현재 ∠A=∠D=${deg(d.m.A)}, ∠B=∠E=${deg(d.m.B)}, BC=EF · ${reason?'합동 이유':'∠F=x°'}`);

  function candidateDraw(b,t,d){
    const ds=[d.set.base,...d.set.cands.map(x=>x.dsc)],tags=['기준','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ'];
    if(t<4.7){const cs=cells(b,6),span=Math.max(...ds.flatMap(x=>{const box=d.G.bboxOf(x.pts);return[box.x1-box.x0,box.y1-box.y0];})),scale=2/span;
      ds.forEach((D,i)=>{const cell=cs[i],bb=d.G.bboxOf(D.pts),c=P((bb.x0+bb.x1)/2,(bb.y0+bb.y1)/2),T=D.pts.map(p=>add(cell,mul(sub(p,c),scale)));
        poly(b,T,i?'sky':'amber',.08);label(b,P(cell.x,cell.y-1.27),tags[i],i?'ink':'amber',{size:12});
        D.sides.forEach(([a,z,value],j)=>d.G.sideTag(b,T[a],T[z],center(T),rational(value),{color:colors[j],size:11,gap:7}));
        D.angs.forEach(([v,value])=>sector(b,angleWedge(T[v],T[(v+1)%3],T[(v+2)%3]),'rose',deg(value),11/b.k));
        if(t>=2.4){D.sides.forEach(([a,z],j)=>b.ticks(T[a],T[z],{color:colors[j],count:j+1,size:5}));}
      });return;}
    const T=d.set.base.pts,C=d.set.cands[d.answer].dsc.pts,order=matchedOrder(T,C),image=translated(order.map(i=>C[i]),Math.max(...T.map(p=>p.x))+4),moving=rigidPose(image,T,phase(t,4.7,7.2));setup(b,[...T,...image,...rigidPose(image,T,.5)]);tri(b,d.G,T);tri(b,d.G,moving,t>=7.2?'':order.map(i=>'DEF'[i]).join(''),{fill:'green'});
    d.set.base.sides.forEach(([a,z,value],i)=>{b.ticks(T[a],T[z],{color:colors[i],count:i+1});b.ticks(moving[a],moving[z],{color:colors[i],count:i+1});});
    d.set.base.angs.forEach(([v])=>[T,moving].forEach(X=>sector(b,angleWedge(X[v],X[(v+1)%3],X[(v+2)%3]),'rose')));
    if(t>=7.6)label(b,center(T),['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ'][d.answer],'green',{dy:30});
  }
  for(const [ty,legacy] of [[0,'세 변 보기'],[1,'끼인각 보기'],[2,'끝각 보기']])register('c5-3',legacy,'current-five-candidates-compared-at-common-scale-then-rigidly-superposed',d=>{
    const m=source(d,{cnTy:ty}),set=m.set,answer=set.cands.findIndex(c=>c.ok);return{...d,m,set,ty,answer};
  },candidateDraw,(t,d)=>t<1.2?F('현재 값으로 만들어진 기준 및 다섯 보기를 확인합니다.'):t<4.7?F(d.ty===0?'세 변의 길이를 순서와 상관없이 대응시킵니다.':d.ty===1?'같은 두 길이 사이에 같은 각이 놓였는지 확인합니다.':'주어진 변의 양 끝에 같은 두 각이 놓였는지 확인합니다.'):t<7.6?F('조건이 일치하는 후보의 대응점을 정해 크기 그대로 포갭니다.'):F(`${['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ'][d.answer]}이 기준과 합동입니다.`,d.set.cands[d.answer].why),d=>`현재 ${['세 변','두 변과 끼인각','한 변과 양 끝각'][d.ty]}: ${d.m.nums.map((n,i)=>d.ty===0||d.ty===1&&i<2||d.ty===2&&i===0?cm(n):deg(n)).join(', ')} · 그림의 ㄱ~ㅁ 중 합동인 도형`);

  // ⑥ Two regular figures expose an exact 60°/90° rotation or a reflection.
  function regularBase(b,d,polygons,segments=[],extra=[]){
    const ps=polygons.flat().concat(extra);setup(b,ps,.16);polygons.forEach((p,i)=>poly(b,p,i?'rose':'sky',.055));segments.forEach(([a,z])=>line(b,a,z,'muted',1.8));
    const g=d.geo;Object.entries(g).filter(([k,p])=>/^[A-GP]$/.test(k)&&p&&typeof p.x==='number').forEach(([n,p])=>dot(b,p,n,'ink',{dy:['A','D','F','G'].includes(n)?-17:18}));
  }
  function rotateTriangle(b,T,c,angle,t,a=1.6,z=6.4){const u=phase(t,a,z),moving=T.map(p=>rotate(p,c,angle*u));poly(b,T,'amber',.09);poly(b,moving,'green',.14);return moving;}
  function hidden1Bind(d,goal){
    const m=goal==='congruence'?d.m:reviewed(d,{...d.m,pk:{...d.m.pk,kind:goal==='correspond'?0:1}}),geo=m,query=goal==='adjacent'?['BPE','DPA'][Math.floor((m.pk.q||0)/2)]:['APB','EPD'][Math.floor((m.pk.q||0)/2)];
    return{...d,m,geo,goal,query,answer:goal==='correspond'?60-m.y:goal==='adjacent'?120:goal==='cross'?60:'SAS'};
  }
  for(const goal of ['congruence','correspond','cross','adjacent'])register('c6-1',{congruence:'합동찾기',correspond:'대응각',cross:'교차각',adjacent:'이웃각'}[goal],'sixty-degree-rotation-around-the-shared-equilateral-vertex',d=>hidden1Bind(d,goal),(b,t,d)=>{
    const g=d.geo,{A,B,C,D,E,P:X}=g;regularBase(b,d,[[A,B,C],[C,D,E]],[[B,D],[A,E]]);const moving=rotateTriangle(b,[B,C,D],C,60,t);
    [[B,C],[A,C]].forEach(([a,z])=>b.ticks(a,z,{color:'sky',count:1}));[[C,D],[C,E]].forEach(([a,z])=>b.ticks(a,z,{color:'rose',count:2}));
    if(t>=.8){sector(b,angleWedge(C,B,D),'amber',t>=2? '120°':'');sector(b,angleWedge(C,A,E),'amber',t>=2?'120°':'');}
    if(d.goal==='correspond'){sector(b,angleWedge(D,B,C),'sky',deg(g.y));if(t>=6.4)sector(b,angleWedge(E,A,C),'sky',deg(g.y));sector(b,angleWedge(E,D,A),'green',t>=7.7?deg(d.answer):'x');if(t>=6.8)sector(b,angleWedge(E,D,C),'rose','60°',40/b.k,{dx:18,dy:-28});}
    else if(d.goal!=='congruence'&&X){const ray=d.query.split('').map(n=>g[n]);sector(b,angleWedge(ray[1],ray[0],ray[2]),'green',t>=7.7?deg(d.answer):'x');if(t>=6.4){line(b,B,D,'amber',3.5);line(b,A,E,'green',3.5);arc(b,C,1.1,direction(C,B),direction(C,B)+60,1,'green');label(b,C,'60°','green',{dx:-33,dy:-31});}}
    void moving;
  },(t,d)=>t<1.6?F('정삼각형의 같은 변과 한 직선 위의 B, C, E를 확인합니다.'):t<6.4?F('△BCD를 점 C 중심으로 60° 돌리면 B→A, D→E가 됩니다.'):t<7.7?F(d.goal==='correspond'?'대응각 ∠AEC=∠BDC를 정삼각형의 60°에서 뺍니다.':d.goal==='congruence'?'두 변과 그 사이 120°가 각각 같아 두 삼각형이 포개집니다.':'BD가 AE에 평행한 방향으로 60° 회전하므로 교차하는 두 직선의 예각은 60°입니다.'):F(d.goal==='congruence'?'SAS 합동이므로 대응하는 변과 각이 같습니다.':d.goal==='adjacent'?'이웃한 각은 일직선을 이루므로 180°에서 60°를 뺍니다.':'대응 관계로 목표 각을 구했습니다.',d.goal==='congruence'?'$\\triangle BCD\\equiv\\triangle ACE$':d.goal==='correspond'?`$x=60^{\\circ}-${tex(d.m.y)}^{\\circ}=${tex(d.answer)}^{\\circ}$`:`$\\angle ${d.query}=${tex(d.answer)}^{\\circ}$`),d=>`△ABC, △CDE 정삼각형 · B,C,E는 일직선${d.goal==='correspond'?` · 현재 ∠BDC=${deg(d.m.y)}, ∠DEA=x°`:d.goal==='congruence'?` · 현재 BC=${cm(d.m.a)}, CE=${cm(d.m.b)}`:` · AE∩BD=P, ∠${d.query}=x°`}`);

  for(const goal of ['congruence','CE','CD','angle'])register('c6-2',{congruence:'합동찾기',CE:'CE길이',CD:'CD길이',angle:'C의각'}[goal],'sixty-degree-rotation-about-a-common-equilateral-apex',d=>{
    const kind={CE:0,CD:1,angle:2}[goal],m=goal==='congruence'?d.m:reviewed(d,{...d.m,pk:{...d.m.pk,kind}});return{...d,m,geo:m.g,goal,answer:goal==='angle'?120:goal==='congruence'?'SAS':m.pk.L-m.pk.c};
  },(b,t,d)=>{
    const {A,B,C,D,E}=d.geo;regularBase(b,d,[[A,B,C],[A,D,E]],[[C,E]]);rotateTriangle(b,[A,B,D],A,-60,t);
    [[A,B],[A,C]].forEach(([p,q])=>b.ticks(p,q,{color:'sky',count:1}));[[A,D],[A,E]].forEach(([p,q])=>b.ticks(p,q,{color:'rose',count:2}));
    if(d.goal==='CE'){label(b,mid(B,C),`BC=${cm(d.m.L)}`,'sky',{dy:38});label(b,mid(D,C),`CD=${cm(d.m.pk.c)}`,'rose',{dy:18});label(b,mid(C,E),t>=7.7?cm(d.answer):'x cm','green',{dx:26});}
    if(d.goal==='CD'){label(b,mid(B,C),`BC=${cm(d.m.L)}`,'sky',{dy:38});label(b,mid(C,E),`CE=${cm(d.m.pk.c)}`,'rose',{dx:26});label(b,mid(D,C),t>=7.7?cm(d.answer):'x cm','green',{dy:18});}
    if(t>=6.4){[[B,D],[C,E]].forEach(([p,q])=>b.ticks(p,q,{color:'green',count:3}));if(d.goal==='angle'){sector(b,angleWedge(C,D,A),'sky','60°');sector(b,angleWedge(C,A,E),'rose','60°');sector(b,angleWedge(C,D,E),'green',t>=7.7?'120°':'x',45/b.k);}}
  },(t,d)=>t<1.6?F('두 정삼각형에서 A에 붙은 두 쌍의 변과 60°를 확인합니다.'):t<6.4?F('점 A를 중심으로 △ABD를 60° 돌리면 B→C, D→E가 됩니다.'):t<7.7?F(d.goal==='angle'?'C의 목표 각은 정삼각형의 60°와 포개져 온 60°로 나뉩니다.':d.goal==='congruence'?'AB=AC, AD=AE이고 끼인각도 같아서 꼭 포개집니다.':'대응변 BD와 CE가 같으므로 BC를 BD와 CD로 나눕니다.'):F(d.goal==='congruence'?'SAS 합동으로 BD=CE입니다.':d.goal==='angle'?'두 60°를 더합니다.':'전체 변에서 주어진 부분을 뺍니다.',d.goal==='congruence'?'$\\triangle ABD\\equiv\\triangle ACE$':d.goal==='angle'?'$\\angle DCE=60^{\\circ}+60^{\\circ}=120^{\\circ}$':`$${d.goal}=${tex(d.m.L)}-${tex(d.m.pk.c)}=${tex(d.answer)}\\text{ cm}$`),d=>`△ABC, △ADE 정삼각형 · D는 BC 위${d.goal==='congruence'?` · 현재 BC=${cm(d.m.L)}, BD=${cm(d.m.d)}`:d.goal==='angle'?' · ∠DCE=x°':` · 현재 BC=${cm(d.m.L)}, ${d.goal==='CE'?'CD':'CE'}=${cm(d.m.pk.c)} · ${d.goal}=x cm`}`);

  for(const goal of ['congruence','length','angle'])register('c6-3',{congruence:'합동찾기',length:'길이식',angle:'각도식'}[goal],'quarter-turn-matches-two-square-sides-and-their-corresponding-triangles',d=>{
    if(goal==='congruence')return{...d,geo:d.m.g,goal,answer:'SAS'};const m=equationBind(d,goal,true);return{...m,geo:m.m.g,goal};
  },(b,t,d)=>{
    const {A,B,C,D,E,F:X,G:H}=d.geo;regularBase(b,d,[[A,B,C,D],[A,E,X,H]],[[B,E],[D,H]]);rotateTriangle(b,[A,B,E],A,-90,t);
    [[A,B],[A,D]].forEach(([p,q])=>b.ticks(p,q,{color:'sky',count:1}));[[A,E],[A,H]].forEach(([p,q])=>b.ticks(p,q,{color:'rose',count:2}));
    if(d.goal==='length'){label(b,mid(B,E),`(${d.expr}) cm`,'sky',{dx:20,dy:16});label(b,mid(D,H),cm(d.target),'rose',{dx:-18,dy:-15});}
    if(d.goal==='angle'){sector(b,angleWedge(A,B,E),'sky',`${d.expr}°`);sector(b,angleWedge(A,D,H),'rose',deg(d.target));}
    if(t>=6.4){[[B,E],[D,H]].forEach(([p,q])=>b.ticks(p,q,{color:'green',count:3}));if(d.goal==='congruence'){sector(b,angleWedge(A,B,E),'green');sector(b,angleWedge(A,D,H),'green');}}
  },(t,d)=>d.goal==='congruence'?t<1.6?F('두 정사각형의 같은 변과 A의 직각을 확인합니다.'):t<6.4?F('△ABE를 A 중심으로 90° 돌리면 B→D, E→G가 됩니다.'):t<7.6?F('두 변과 끼인각이 같아서 두 삼각형이 포개집니다.'):F('대응변 BE=DG, 대응각 ∠BAE=∠DAG입니다.','$\\triangle ABE\\equiv\\triangle ADG$'):equationFrame(t,d,'점 A를 중심으로 90° 돌리면 두 대응 부분이 정확히 포개집니다.'),d=>d.goal==='congruence'?`현재 □ABCD, □AEFG · AB=${cm(d.m.a)}, AE=${cm(d.m.e)}, ∠BAE=${deg(d.m.th)}`:d.active?clean(d.Q.stem):`현재 탐구 도형의 ${d.kind?'∠BAE=x°, ∠DAG='+deg(d.target):'BE=x cm, DG'+(rational(d.target).startsWith('≈')?'':'=')+cm(d.target)} · 보조 문제`);

  function horizontalFold(T,y,u){return T.map(p=>({x:p.x,y:y+(p.y-y)*Math.cos(Math.PI*u),z:(p.y-y)*Math.sin(Math.PI*u)}));}
  function hidden4Bind(d,goal){
    const m=goal==='current'?reviewed(d):goal==='in'||goal==='out'?source(d,{cnJm:goal}):d.m,geo=m.g,q=goal==='current'?m.pk.q:1;
    const Bangle=m.inside?30:150,base=(180-Bangle)/2,values=[base,180-2*(90-base),90-base,base];
    return{...d,m,geo,goal,q,Bangle,base,values,target:['BAE','AED','EAD','AEB'][q],answer:goal==='congruence'?'SAS':values[q]};
  }
  for(const goal of ['congruence','current','in','out'])register('c6-4',{congruence:'합동찾기',current:'기본각',in:'안쪽각',out:'바깥각'}[goal],'rigid-space-reflection-and-two-isosceles-angle-partitions',d=>hidden4Bind(d,goal),(b,t,d)=>{
    const {A,B,C,D,E}=d.geo;regularBase(b,d,[[A,B,C,D],[B,C,E]],[[A,E],[D,E]]);const from=[A,B,E],moving=horizontalFold(from,-d.m.a/2,phase(t,1.6,4.8));poly(b,from,'amber',.08);poly(b,moving,'green',.13);line(b,P(-.5,-d.m.a/2),P((d.m.inside?1.4:2.2)*d.m.a,-d.m.a/2),'muted',1.3,{dash:[4,5]});
    [[A,B],[D,C]].forEach(([p,q])=>b.ticks(p,q,{color:'sky',count:1}));[[B,E],[C,E]].forEach(([p,q])=>b.ticks(p,q,{color:'rose',count:2}));
    if(t>=.9){sector(b,angleWedge(B,A,E),'amber',t>=2?deg(d.Bangle):'');sector(b,angleWedge(C,D,E),'amber',t>=2?deg(d.Bangle):'');}
    if(t>=4.8){[[A,E],[D,E]].forEach(([p,q])=>b.ticks(p,q,{color:'green',count:3}));}
    if(d.goal!=='congruence'){
      const target=d.target.split('').map(n=>d.geo[n]);sector(b,angleWedge(target[1],target[0],target[2]),'green',t>=7.7?deg(d.answer):'x',35/b.k);
      if(t>=5.4&&!(d.q===0||d.q===3))sector(b,angleWedge(A,B,E),'sky',deg(d.base));
      if(t>=6.4&&d.q===1){sector(b,angleWedge(A,E,D),'rose',deg(90-d.base));sector(b,angleWedge(D,E,A),'rose',deg(90-d.base));}
    }
  },(t,d)=>t<1.6?F(`정삼각형이 정사각형 ${d.m.inside?'안쪽':'바깥쪽'}에 놓인 현재 조건입니다.`):t<4.8?F(`끼인각은 90°${d.m.inside?'−':'+'}60°입니다. △ABE를 가로 접는 선에서 뒤집습니다.`):t<5.4?F('AB=DC, BE=CE와 끼인각이 같아 포개지므로 AE=DE입니다.'):t<7.7?F(d.goal==='congruence'?'뒤집기도 변 길이와 각의 크기를 보존합니다.':`AB=BE인 이등변삼각형의 밑각은 (180°−${d.Bangle}°)÷2입니다.`,d.goal==='congruence'?'':d.q===0||d.q===3?`$x=(180^{\\circ}-${d.Bangle}^{\\circ})\\div2$`:`$\\angle EAD=\\angle ADE=90^{\\circ}-${tex(d.base)}^{\\circ}$`):F(d.goal==='congruence'?'SAS 합동에서 AE=DE를 얻습니다.':'목표 각이 어느 두 반직선 사이인지 확인해 마무리합니다.',d.goal==='congruence'?'$\\triangle ABE\\equiv\\triangle DCE$':`$\\angle ${d.target}=${tex(d.answer)}^{\\circ}$`),d=>`□ABCD, △BCE · E는 ${d.m.inside?'안쪽':'바깥쪽'}${d.goal==='congruence'?` · 현재 AB=${cm(d.m.a)}`:` · ${d.goal==='current'?'현재 문제':'현재 탐구 크기의 위치 비교'} ∠${d.target}=x°`}`);

  function build(lab,state){
    const G=typeof window==='undefined'?lab.api:window.APL_CN,D=lab.scene.cn;if(!G||!D||!recipe[D.id])return[];
    const s=clone(state),m=D.model({...s,lessonOn:false,lessonEntry:false});
    return recipe[D.id].map((r,i)=>{const d=r.bind({G,D,s,m});return{id:`construction-${D.id}-${i}`,title:D.title,label:r.label,legacyLabel:r.label,duration:r.duration,stops:[.8,2.4,4.8,6.7,7.7].filter(x=>x<r.duration),model:d,given:r.given(d),motion:r.motion,draw:r.draw,frame:r.frame};});
  }
  const registry=Object.fromEntries(Object.keys(recipe).map(id=>[`g7-construction/${id}`,build]));
  const lessonInfo=Object.fromEntries(Object.entries(recipe).map(([id,rs])=>[`g7-construction/${id}`,rs.map(r=>({legacyLabel:r.label,duration:r.duration}))]));
  return{build,registry,lessonInfo,rigidPose,horizontalFold,copyGeometry,ssaModel,rodModel,rodPose,partsKind,partsCondition,rectanglePose,rational,matchedOrder,validOrder,measureTriangle};
});
