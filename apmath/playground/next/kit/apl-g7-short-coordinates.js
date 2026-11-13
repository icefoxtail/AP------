/* Coordinate proofs have individual constructions, not a shortened legacy
 * timeline. Native question models bind every numerical condition; this layer
 * animates only a separate proof state and never rewrites the student's values. */
(function(root,factory){
  'use strict';const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root?.APLab){root.APLab.G7ShortCoordinates=api;Object.assign(root.APLab.G7Shorts=root.APLab.G7Shorts||{},api.registry);}
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const P=(x,y)=>({x,y}),O=P(0,0),clamp=x=>Math.max(0,Math.min(1,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const phase=(t,a,b)=>smooth((t-a)/(b-a));
  const lerp=(a,b,u)=>P(a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u);
  const clone=x=>JSON.parse(JSON.stringify(x));
  const call=(f,...a)=>typeof f==='function'?f(...a):f;
  const line=(b,a,z,color='amber',width=3.5)=>b.seg(a,z,{color,width});
  const point=(b,q,name='',color='amber')=>b.point(q,{color,r:5,label:name,size:14,dx:9,dy:-12});
  const label=(b,q,text,color='ink',opts={})=>b.text(q,text,{color,size:b.W<560?13:16,align:'center',baseline:'middle',...opts});
  const poly=(b,pts,color='sky',alpha=.15)=>b.path(pts,{close:true,color,fill:color,fillAlpha:alpha,width:2});
  const rect=(b,x,y,w,h,color='sky',alpha=.15)=>poly(b,[P(x,y),P(x+w,y),P(x+w,y+h),P(x,y+h)],color,alpha);
  const rotate=(q,c,a)=>P(c.x+(q.x-c.x)*Math.cos(a)-(q.y-c.y)*Math.sin(a),c.y+(q.x-c.x)*Math.sin(a)+(q.y-c.y)*Math.cos(a));
  function travel(b,a,z,u,color='amber',name='') {const q=lerp(a,z,u);line(b,a,q,color);point(b,q,name,color);return q;}
  function setup(b,d,focus,plain=false){
    b.kind='cartesian';b.aspect=d.spec.aspect||'1:1';b.setPanes(null);
    b.setInsets({top:74,right:36,bottom:100,left:40});
    b.zoom=1;b.panX=0;b.panY=0;
    b.setFocus(focus||call(d.spec.focus,d.v,d.m),false);
    if(!plain){b.grid(call(d.spec.grid,d.v,d.m)||{});d.M.axes(b,call(d.spec.axes,d.v,d.m)||{});}
  }
  function projections(b,q,t,start=.8){
    if(t>=start)travel(b,q,P(q.x,0),phase(t,start,start+1.5),'sky');
    if(t>=start+1.8)travel(b,q,P(0,q.y),phase(t,start+1.8,start+3.3),'rose');
  }
  function xy(M,q){return `(${M.f(q.x)},${M.f(q.y)})`;}
  const describe=(label,formula='')=>({label,formula});
  const recipes={};

  recipes['coord-order']={
    motion:'origin-to-horizontal-coordinate-to-point',duration:8.6,
    given:d=>`점 P의 가로·세로 위치를 순서대로 읽기`,
    draw(b,t,d){const {v,m}=d;point(b,m.P,'P','muted');const X=P(v.x,0);
      if(t<3.6)travel(b,O,X,phase(t,.8,3.1),'sky');
      else {line(b,O,X,'sky');travel(b,X,m.P,phase(t,3.6,5.9),'rose');}
      if(t>=3.1)label(b,X,`가로 ${d.M.n(v.x)}`,'sky',{dy:22});
      if(t>=5.9)label(b,P(v.x,v.y/2),`세로 ${d.M.n(v.y)}`,'rose',{dx:v.x<0?-30:30});
    },
    frame(t,d){return t<.8?describe('원점 O에서 출발합니다.'):t<3.6?describe('첫째 좌표만큼 가로로 이동합니다.',`$x=${d.M.f(d.v.x)}$`):t<6?describe('둘째 좌표만큼 세로로 이동합니다.',`$y=${d.M.f(d.v.y)}$`):describe('가로 다음 세로, 순서를 바꾸지 않습니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['read-coordinates']={
    motion:'perpendicular-projections-to-both-axes',duration:8.4,
    given:d=>'그림의 P를 (가로 좌표, 세로 좌표)로 나타내기',
    draw(b,t,d){point(b,d.m.P,'P');projections(b,d.m.P,t);if(t>=4.1){point(b,P(d.v.x,0),'가로','sky');point(b,P(0,d.v.y),'세로','rose');}},
    frame(t,d){return t<.8?describe('점 P의 위치를 먼저 확인합니다.'):t<2.6?describe('x축에 수직으로 내려 가로 좌표를 읽습니다.',`$x=${d.M.f(d.v.x)}$`):t<4.4?describe('y축으로 수평하게 옮겨 세로 좌표를 읽습니다.',`$y=${d.M.f(d.v.y)}$`):describe('읽은 두 수를 순서대로 묶습니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['quadrants-boundary']={
    motion:'intersect-sign-halfplanes-or-highlight-axis',duration:8.4,
    given:d=>`좌표의 부호와 축 위의 점 구별`,
    draw(b,t,d){const {v,m}=d;const sx=v.x>=0?1:-1,sy=v.y>=0?1:-1;
      if(v.x&&v.y){const w=6*phase(t,.8,2.7),h=6*phase(t,3,5);rect(b,0,-6,sx*w,12,'sky',.07);if(t>=3)rect(b,0,0,sx*6,sy*h,'green',.16);}
      else {const end=P(v.x===0?0:v.x,v.y===0?0:v.y);travel(b,O,end,phase(t,1,4),'rose');}
      point(b,m.P,'P');if(t>=5)projections(b,m.P,10);[['제1',3,3],['제2',-3,3],['제3',-3,-3],['제4',3,-3]].forEach(([s,x,y])=>label(b,P(x,y),s+'사분면','muted',{size:13}));
    },
    frame(t,d){const {v,m,M}=d;return t<2.8?describe(v.x===0?'x=0인 점은 y축 위에 있습니다.':v.x>0?'x가 양수이므로 오른쪽입니다.':'x가 음수이므로 왼쪽입니다.',`$x=${M.f(v.x)}$`):t<5?describe(v.y===0?'y=0인 점은 x축 위에 있습니다.':v.y>0?'y가 양수이므로 위쪽입니다.':'y가 음수이므로 아래쪽입니다.',`$y=${M.f(v.y)}$`):describe(v.x===0||v.y===0?'축과 원점은 사분면에 포함되지 않습니다.':'두 부호가 지정하는 부분이 만납니다.',m.q);}
  };
  recipes['point-move']={
    motion:'orthogonal-two-leg-translation',duration:8.6,
    given:d=>d.spec.question(d.v,d.m),
    draw(b,t,d){const {m,v,M}=d,C=P(m.B.x,m.A.y);point(b,m.A,'A','sky');b.path([m.A,C,m.B],{color:'muted',dash:[4,5],width:1.3});
      if(t<3.7)travel(b,m.A,C,phase(t,.8,3.3),'amber');else{line(b,m.A,C);travel(b,C,m.B,phase(t,3.7,6),'rose',t>=6?'B':'');}
      if(t>=3.3)label(b,lerp(m.A,C,.5),M.n(v.dx),'amber',{dy:20});if(t>=6)label(b,lerp(C,m.B,.5),M.n(v.dy),'rose',{dx:25});
    },
    frame(t,d){const {v,m,M}=d;return t<.8?describe('출발점 A를 유지하며 이동을 시작합니다.'):t<3.7?describe('가로 이동은 x좌표에만 더합니다.',`$${M.f(v.ax)}+(${M.f(v.dx)})=${M.f(m.B.x)}$`):t<6.3?describe('세로 이동은 y좌표에만 더합니다.',`$${M.f(v.ay)}+(${M.f(v.dy)})=${M.f(m.B.y)}$`):describe('도착점의 두 좌표를 확인합니다.',d.spec.answer(v,m));}
  };
  recipes['graph-story']={
    motion:'clock-point-traces-constant-ordinate-interval',duration:8.8,
    given:d=>`가로축: 시간 · 세로축: ${d.v.mode?'속력':'집과의 거리'}`,
    draw(b,t,d){b.path(d.m.points,{color:'muted',width:2});const x=4+3*phase(t,1.3,5.2),Q=P(x,8);travel(b,P(4,8),Q,1,'green');point(b,Q,'현재');line(b,P(x,0),Q,'amber',1.8);point(b,P(x,0),'시각','sky');if(t>=5.2)line(b,P(4,8),P(7,8),'green',5);},
    frame(t,d){return t<1.3?describe('먼저 세로축이 무엇인지 확인합니다.'):t<5.2?describe('시간은 4분에서 7분으로 흐르지만 세로값은 8로 같습니다.'):describe(d.v.mode?'속력이 8이므로 멈춘 것이 아닙니다.':'같은 직선길에서 집과의 거리가 변하지 않습니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['water-vessels']={
    motion:'equal-volume-filling-coupled-to-height-time-point',duration:9,
    given:d=>`${['단면이 일정한','위쪽이 좁은','위로 넓어지는'][d.v.mode]} 그릇 · 같은 시간에 같은 물의 양`,
    draw(b,t,d){const v={...d.v,fill:phase(t,.8,6.6)},m=d.spec.model(v);d.spec.draw(b,v,m,{step:1,solved:false,spec:d.spec,set(){}});const times=[.25,.5,.75,1].filter(x=>x<=v.fill);times.forEach(x=>point(b,P(x*m.total,m.height(x*m.total)),'','green'));},
    frame(t,d){return t<.8?describe('현재 선택한 그릇을 빈 상태부터 채웁니다.'):t<6.6?describe(d.v.mode===0?'같은 물의 양이 들어올 때 높이도 같은 만큼 오릅니다.':d.v.mode===1?'넓은 아래쪽은 천천히, 좁은 위쪽은 빠르게 올라갑니다.':'위로 넓어져 같은 물의 양으로 높이는 점점 덜 올라갑니다.'):describe('그릇 속 물높이와 그래프의 높이는 같은 값입니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['axis-pair']={
    motion:'separate-matching-coordinate-components',duration:9,
    given:d=>d.spec.question(d.v,d.m),
    draw(b,t,d){const {v,m}=d;if(v.mode){point(b,m.Q,'같은 점');projections(b,m.Q,t);if(t>=4.3){point(b,P(m.Q.x,0),'첫째 성분','sky');point(b,P(0,m.Q.y),'둘째 성분','rose');}}else{point(b,m.A,'A','sky');point(b,m.B,'B','rose');travel(b,O,m.A,phase(t,.8,3),'sky');if(t>=3.3)travel(b,O,m.B,phase(t,3.3,5.5),'rose');if(t>=2.8)label(b,m.A,'y=0','sky',{dy:25});if(t>=5.4)label(b,m.B,'x=0','rose',{dx:30,dy:10});}},
    frame(t,d){const s=d.spec.steps(d.v,d.m);return t<2?describe(s[0]):t<4?describe(s[1]):t<6.4?describe(s[2]):describe('두 성분의 조건을 각각 만족하는 값을 확인합니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['axis-distance']={
    motion:'perpendicular-distance-segments-not-signed-coordinates',duration:8.8,
    given:d=>d.spec.question(d.v,d.m),
    draw(b,t,d){const {m,v,M}=d;point(b,m.P,'P');projections(b,m.P,t);if(t>=2.4)label(b,P(v.x,v.y/2),M.n(m.dy),'sky',{dx:22});if(t>=4.2)label(b,P(v.x/2,v.y),M.n(m.dx),'rose',{dy:-18});},
    frame(t,d){const {v,m,M}=d;return t<.8?describe('점에서 축으로 수직인 선분을 찾습니다.'):t<2.6?describe('x축까지는 세로 방향의 거리입니다.',`$|${M.f(v.y)}|=${M.f(m.dy)}$`):t<4.6?describe('y축까지는 가로 방향의 거리입니다.',`$|${M.f(v.x)}|=${M.f(m.dx)}$`):describe('좌표의 부호와 달리 거리는 항상 0 이상입니다.',d.spec.answer(v,m));}
  };
  recipes['read-time']={
    motion:'given-time-to-graph-to-temperature-and-increasing-traces',duration:9,
    given:d=>`${d.M.n(d.v.time)}시의 기온 · 기온이 높아지는 구간 찾기`,
    draw(b,t,d){b.path(d.m.points,{color:'muted',width:2});if(t<3.3)travel(b,P(d.v.time,0),d.m.P,phase(t,.8,3),'amber');else{point(b,d.m.P,'현재');travel(b,d.m.P,P(0,d.m.P.y),phase(t,3.3,4.8),'rose');}
      if(t>=5.1){const u=phase(t,5.1,7.2),p=d.m.points;const X=3+12*u,Y=X<=9?10+(X-3)*4/6:14+(X-9)*8/6;b.path([p[1],...(X>9?[p[2]]:[]),P(X,Y)],{color:'green',width:4});travel(b,p[4],p[5],u,'green');}},
    frame(t,d){return t<3.3?describe('주어진 시각에서 그래프까지 올라갑니다.'):t<5.1?describe('그 높이를 세로축에서 읽습니다.',`기온 $${d.M.f(d.m.P.y)}$℃`):t<7.3?describe('오른쪽으로 갈수록 올라가는 구간을 따라갑니다.'):describe('값 하나와 증가 구간은 서로 다른 정보를 나타냅니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['baseline-change']={
    motion:'read-change-then-offset-on-labelled-weight-numberline',duration:9,
    given:d=>`처음 9kg · ${d.v.week}주 뒤의 변화량 그래프`,
    draw(b,t,d){if(t<4.2){d.m.changes.forEach((y,x)=>point(b,P(x,y),'',x===d.v.week?'amber':'muted'));projections(b,d.m.P,t);return;}
      b.kind='figure';b.setFocus({x:[6.5,11.5],y:[-1.5,2.5]},false);
      const A=P(9,.5),B=P(d.m.actual,.5);line(b,P(7,.5),P(11,.5),'muted',1.5);
      for(let x=7;x<=11;x+=.5){line(b,P(x,.42),P(x,.58),'muted',1);if(Number.isInteger(x))label(b,P(x,.8),String(x),'muted');}
      point(b,A,'','sky');label(b,A,'처음 9kg','sky',{dy:-26});travel(b,A,B,phase(t,4.3,6.8),'rose');if(t>=6.8)label(b,B,'실제 몸무게','rose',{dy:35});label(b,P(9,-.4),'몸무게를 나타낸 별도의 수직선(kg)','ink',{size:13});
    },
    frame(t,d){return t<4.2?describe('세로축은 실제 몸무게가 아니라 처음에 비한 변화량입니다.',`변화량 $${d.M.f(d.m.P.y)}$kg`):t<6.8?describe(d.m.P.y<0?'처음 9kg에서 변화량만큼 왼쪽으로 이동합니다.':'처음 9kg에서 변화량만큼 오른쪽으로 이동합니다.'):describe('처음 값에 변화량을 더한 곳이 실제 값입니다.',d.spec.answer(d.v,d.m));},
    customAxes:true
  };
  recipes['quantity-table']={
    motion:'add-papers-and-shared-pins-before-discrete-coordinate',duration:8.8,
    given:d=>`공고문 ${d.v.count}장 · 첫 장 압정 2개, 한 장마다 1개 추가`,
    draw(b,t,d){const n=d.v.count,u=phase(t,.8,4.5),count=1+(n-1)*u;
      if(t<5.8){b.kind='figure';b.setFocus({x:[-.5,Math.max(3,n)+.5],y:[-1,3]},false);for(let i=0;i<n;i++){if(i>=Math.ceil(count))continue;const alpha=i===Math.floor(count)?Math.max(.08,count-i):1;rect(b,i,.2,.96,1.4,'sky',.16*alpha);label(b,P(i+.5,.9),String(i+1),'sky');}for(let i=0;i<=Math.ceil(count);i++)point(b,P(i,.12),'','rose');label(b,P(n/2,2.2),'서로 붙은 두 장은 경계의 압정 하나를 함께 씁니다.','ink',{size:12});}
      else{d.m.points.forEach(q=>point(b,q,'','muted'));point(b,d.m.P,'현재');projections(b,d.m.P,t,5.8);}},
    frame(t,d){return t<1?describe('한 장의 양쪽 끝에 압정 두 개를 놓습니다.'):t<5.8?describe('다음 장은 경계를 함께 쓰므로 압정 하나만 추가합니다.',`압정 수 = 공고문 수 + 1`):describe('물건의 수는 자연수이므로 점들을 선으로 잇지 않습니다.',d.spec.answer(d.v,d.m));},customAxes:true
  };
  recipes['sign-reasoning']={
    motion:'signed-quantities-to-quadrant-not-arbitrary-point-morph',duration:9,
    given:d=>d.spec.question(d.v,d.m),
    draw(b,t,d){point(b,d.m.given,d.v.mode?'(a+b, ab)':'(a,b)','sky');if(t>=2.6&&d.v.mode)point(b,d.m.A,'(a,b)','muted');if(t>=4.8){rect(b,0,0,-6*phase(t,4.8,6.5),6,'green',.09);travel(b,O,P(d.m.B.x,0),phase(t,4.8,5.8),'amber');if(t>=5.8){line(b,O,P(d.m.B.x,0),'amber');travel(b,P(d.m.B.x,0),d.m.B,phase(t,5.8,7.2),'rose');}if(t>=7.2)point(b,d.m.B,'새 점','green');}},
    frame(t,d){const steps=d.spec.steps(d.v,d.m);return t<2.4?describe(steps[0]):t<4.6?describe(steps[1]):t<6.8?describe(steps[2]):describe(steps[3],d.spec.answer(d.v,d.m));}
  };
  recipes['coordinate-area']={
    motion:'coordinate-differences-and-perpendicular-height',duration:9,
    given:d=>d.spec.question(d.v,d.m),
    draw(b,t,d){const {v,m,M}=d,vertices=v.mode?[m.A,m.B,m.C,m.D]:[m.A,m.B,m.Q];poly(b,vertices,'green');vertices.forEach((q,i)=>point(b,q,['A','B','C','D'][i],'muted'));
      travel(b,m.B,m.A,phase(t,.8,2.6),'sky');if(t>=2.6)label(b,lerp(m.A,m.B,.5),M.n(v.height),'sky',{dx:-23});
      if(t>=3)travel(b,P(m.B.x,0),P(m.C.x,0),phase(t,3,5),'rose');if(t>=5)label(b,P((m.B.x+m.C.x)/2,0),M.n(v.width),'rose',{dy:20});
      if(v.mode&&t>=5.2){travel(b,m.C,m.D,phase(t,5.2,6.2),'amber');label(b,lerp(m.C,m.D,.5),'3','amber',{dx:18});}
      const e=.2;if(t>=5)b.path([P(m.B.x,e),P(m.B.x+e,e),P(m.B.x+e,0)],{color:'rose',width:2});
    },
    frame(t,d){const {v,m,M}=d;return t<2.8?describe('같은 x좌표의 두 점에서 세로 길이를 좌표의 차로 읽습니다.',`$${M.f(m.A.y)}-(${M.f(m.B.y)})=${M.f(v.height)}$`):t<5.2?describe('높이는 밑변에 수직인 가로 간격입니다.',`$${M.f(m.C.x)}-(${M.f(m.B.x)})=${M.f(v.width)}$`):t<6.8?describe(v.mode?'두 세로 평행변과 그 사이 거리를 대응합니다.':'빗변의 길이가 아니라 수직인 높이를 사용합니다.'):describe(d.spec.steps(v,m)[3],d.spec.answer(v,m));}
  };
  recipes['repeated-graph']={
    motion:'trace-one-period-between-corresponding-maxima',duration:9,
    given:d=>'높이의 최고값과 반복되는 시간 간격 읽기',
    draw(b,t,d){const {v,m,M}=d;M.curve(b,m.height,{from:0,to:60,color:'muted'});const a=v.period/2,z=a+v.period,u=phase(t,1,5.8),x=a+(z-a)*u;
      M.curve(b,m.height,{from:a,to:x,color:'green',width:4});point(b,P(x,m.height(x)),'현재','amber');point(b,P(a,30),'첫 최고점','sky');if(t>=5.8){point(b,P(z,30),'다음 최고점','rose');line(b,P(a,30),P(z,30),'rose');label(b,P((a+z)/2,30),`${v.period}분`,'rose',{dy:-24});}if(t>=6.4)projections(b,P(a,30),10);},
    frame(t,d){return t<1?describe('이웃한 두 최고점을 비교합니다.'):t<5.8?describe('첫 최고점에서 다음 최고점까지 한 번의 같은 모양을 따라갑니다.'):describe('세로 높이는 최고값, 가로 간격은 반복 시간입니다.',d.spec.answer(d.v,d.m));}
  };
  recipes['journey-compare']={
    motion:'two-time-synchronized-travellers-and-two-meeting-events',duration:9,
    given:d=>d.v.mode?'학교까지 6km · 자전거 400m/분 · 걷기 80m/분':'토끼 10분 뒤 출발·40분에 정지 · 거북이 60분에 2km',
    draw(b,t,d){const {v,m,M}=d;M.curve(b,m.fast,{from:0,to:75,color:'sky'});M.curve(b,m.slow,{from:0,to:75,color:'rose'});
      const end=v.mode?75:60,x=t<3.8?(v.mode?15:20)*phase(t,.8,3.3):(v.mode?15:20)+(end-(v.mode?15:20))*phase(t,4.2,6.8);
      const A=P(x,m.fast(x)),B=P(x,m.slow(x));point(b,A,v.mode?'자전거':'토끼','sky');point(b,B,v.mode?'걷기':'거북이','rose');b.vline(x,{color:'muted',dash:[4,5],width:1.5});
      if(t>=3.3)point(b,v.mode?P(15,6):P(20,2/3),'①','green');if(t>=6.8)point(b,v.mode?P(75,6):P(60,2),'②','green');
    },
    frame(t,d){return t<.8?describe('두 사람을 같은 시각에서 비교합니다.'):t<3.8?describe(d.v.mode?'자전거가 15분에 6km에 도착합니다.':'20분에 두 점이 만나 토끼가 따라잡습니다.'):t<6.8?describe(d.v.mode?'자전거는 기다리고, 걷는 사람은 계속 이동합니다.':'토끼가 40분에 멈춘 뒤 거북이가 계속 이동합니다.'):describe(d.v.mode?'두 도착 시각의 차가 기다린 시간입니다.':'60분에 두 점이 다시 만납니다.',d.spec.answer(d.v,d.m));}
  };
  function build(lab,state){
    const M=typeof window==='undefined'?lab.M:window.APL_MF,spec=lab.scene._mf,recipe=recipes[spec?.id];
    if(!M||!recipe)return[];
    const v=M.values(spec,clone(state)),m=spec.model(v),errors=spec.verify?.(v,m)||[];
    if(errors.length)throw Error(errors.join('; '));
    const d={M,spec,v,m};
    const plan={id:`coordinate-${spec.id}`,title:spec.title,label:'그림으로 풀이',legacyLabel:'',duration:recipe.duration,stops:[.8,2.6,4.3,6.8],model:d,given:recipe.given(d),motion:recipe.motion,
      draw(b,t,data){const plain=recipe.customAxes&&((spec.id==='baseline-change'&&t>=4.2)||(spec.id==='quantity-table'&&t<5.8));setup(b,data,undefined,plain);recipe.draw(b,t,data);},
      frame:(t,data)=>recipe.frame(t,data)};
    return[plan];
  }
  const registry=Object.fromEntries(Object.keys(recipes).map(id=>[`g7-coordinate-graphs/${id}`,build]));
  return{recipes,registry,build,phase,lerp,rotate};
});
