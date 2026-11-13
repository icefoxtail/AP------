/* Middle 1 coordinate graphs and proportion: Archive pattern adaptations.
 * Originals are immutable; source refs identify intake evidence, not copied answers.
 * Student reasoning uses signs, coordinate differences, ratios and elementary area.
 */
(function () {
  'use strict';
  const M = window.APL_MF;
  const SOURCES = {
  "A01": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q15@15",
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q16@16",
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q1@1",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q1@1",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q1@1",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ15@15",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ11@11",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ05@5"
  ],
  "A02": [
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q2@2"
  ],
  "A03": [
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q2@2",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q3@3",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ15@15"
  ],
  "A04": [
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q4@4",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ01@1"
  ],
  "A05": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q17@17",
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q2@2",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q3@3",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q4@4",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q15@15",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q20@20",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ16@16",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ12@12"
  ],
  "A06": [
    "archive/exams/original/middle/m1/2mid/23_향림중_2학기_중간_중1_기출.js#q4@4"
  ],
  "A07": [
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q21@21",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q21@21",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ14@14",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ24@24"
  ],
  "A08": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q18@18",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q7@7",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ17@17",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ20@20",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ06@6",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ11@11"
  ],
  "A09": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q19@19",
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q3@3"
  ],
  "A10": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q24@24",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q21@21",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q6@6",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ23@23"
  ],
  "A11": [
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q4@4",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q5@5",
    "archive/exams/original/middle/m1/2mid/23_금당중_2학기_중간_중1_기출.js#q5@5",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ13@13"
  ],
  "A12": [
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ16@16"
  ],
  "A13": [
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q17@17"
  ],
  "B01": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q20@20",
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q7@7",
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q10@10",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q4@4",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q5@5",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ14@14",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ10@10"
  ],
  "B02": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q6@6",
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q13@13",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q7@7",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ08@8"
  ],
  "B03": [
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q5@5",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q3@3",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ17@17",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ21@21"
  ],
  "B04": [
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q8@8",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q2@2",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ18@18",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ15@15"
  ],
  "B05": [
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q6@6",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q6@6",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q1@1"
  ],
  "B06": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q8@8",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q4@4"
  ],
  "B07": [
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q8@8",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q10@10",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q6@6",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ17@17",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ14@14"
  ],
  "B08": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q7@7",
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q11@11",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q9@9",
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q2@2",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ19@19",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ18@18",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ16@16"
  ],
  "B09": [
    "archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js#q21@21",
    "archive/exams/original/middle/m1/2mid/25_왕의중_2학기_중간_중1_수학.js#q22@22",
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q7@7",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ19@19",
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ21@21"
  ],
  "B10": [
    "archive/exams/original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#q21@21"
  ],
  "B11": [
    "archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js#q5@5"
  ],
  "B12": [
    "archive/exams/original/middle/m1/2mid/23_왕운중_2학기_중간_중1_기출.js#q24@24",
    "archive/exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#qQ20@20",
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ18@18"
  ],
  "B13": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q14@14"
  ],
  "B14": [
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ19@19"
  ],
  "B15": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q10@10"
  ],
  "B16": [
    "archive/exams/original/middle/m1/1final/19_연향중_1학기_기말_중1_수학.js#qQ20@20"
  ],
  "B17": [
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q12@12",
    "archive/exams/original/middle/m1/1final/19_동산중_1학기_기말_중1_수학.js#qQ25@25"
  ],
  "B18": [
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ20@20"
  ],
  "B19": [
    "archive/exams/original/middle/m1/1final/19_왕운중_1학기_기말_중1_수학.js#qQ16@16"
  ],
  "B20": [
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q22@22"
  ],
  "B21": [
    "archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js#q20@20"
  ],
  "B22": [
    "archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js#q22@22"
  ]
};
  const P = M.p, N = M.n, F = M.f, T = String.raw;
  const O = P(0, 0), sky = { color: 'sky', width: 3 }, rose = { color: 'rose', width: 2.5 };
  const muted = { color: 'muted', width: 1.5, dash: [5, 4] };
  const V = (label, value, min, max, step = 1, hidden = false) => ({ label, value, min, max, step, hidden });
  const xy = q => `(${F(q.x)},${F(q.y)})`;
  const pointName = (q, name, show) => show ? `${name}(${N(q.x)}, ${N(q.y)})` : name;
  const quadrant = q => !q.x || !q.y ? '어느 사분면에도 속하지 않음' : `제${q.y > 0 ? (q.x > 0 ? 1 : 2) : (q.x > 0 ? 4 : 3)}사분면`;
  const sign = x => x > 0 ? '+' : x < 0 ? '−' : '0';
  const lin = a => a === 1 ? 'y=x' : a === -1 ? 'y=-x' : `y=${F(a)}x`;
  const inv = k => `y=\\frac{${F(k)}}{x}`;
  const rect = (b, x0, y0, x1, y1, opts = {}) => M.polygon(b, [P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)], opts);
  const close = (a, b) => Math.abs(a-b) < 1e-7;
  const graphPoints = (b, points, opts = sky) => { b.path(points, opts); };
  const interpolate = (points, x) => {
    if (x <= points[0].x) return points[0].y;
    for (let i=1;i<points.length;i++) if (x <= points[i].x) {
      const a=points[i-1],q=points[i];return a.y+(q.y-a.y)*(x-a.x)/(q.x-a.x);
    }
    return points[points.length-1].y;
  };
  function source(types) {
    return { kind:'archive-adapted', types, refs:[...new Set(types.flatMap(k=>SOURCES[k] || []))], label:'Archive 기출 유형 재구성' };
  }
  function make(spec) {
    spec.source = spec.source || source(spec.types || []);
    spec.finalStep = 4;
    spec.focus = spec.focus || {x:[-6,6],y:[-6,6]};
    spec.lesson = (v,m) => {
      const steps=spec.steps(v,m), follow=typeof spec.follow==='function'?spec.follow(v,m):spec.follow;
      const defaults=['축의 이름과 주어진 값을 먼저 보아요.','강조한 선과 점의 관계를 설명해 보아요.','같은 조건을 식에도 적용해요.','처음 값으로 돌아가 다시 확인해 보세요.'];
      const groups=spec.tier==='concept'?[[0,1],[2,3]]:
        spec.tier==='advanced'&&['remaining-work','between-graphs-area','bisect-rectangle','square-graphs','area-ratio','horizontal-division'].includes(spec.id)?[[0],[1],[2],[3]]:[[0],[1,2],[3]];
      return { title:spec.title.slice(0,20),tab:'review',answer:spec.answer(v,m),answerText:spec.answer(v,m),
        summary:'주어진 조건을 그림과 식으로 연결해 확인합니다.',task:spec.guide,
        chapters:groups.map(indices=>{const i=indices[0],j=indices[1];return {title:['조건을 읽기','그림과 관계','식으로 계산','답과 그림 확인'][i],length:indices.length===2?12:10,
          cues:[{at:0,step:i+1,say:steps[i]},j===undefined?{at:5,say:follow?.[i] || defaults[i]}:{at:6,step:j+1,say:steps[j]}]};}) };
    };
    spec.readouts = spec.readouts || ((v,m,c)=>c.solved?[{label:'정리',value:spec.answer(v,m),color:'green'}]:[]);
    delete spec.types;
    return spec;
  }
  const coord=[];
  coord.push(make({
    id:'coord-order',tier:'concept',title:'순서쌍과 두 좌표축',types:['A01'],grid:{step:1},axes:{tickStep:1},nativeFocus:{x:[-5,5],y:[-5,5]},shortFocus:{x:[-5,5],y:[-5,5]},
    vars:{x:V('점의 가로 좌표',3,-5,5),y:V('점의 세로 좌표',2,-5,5)},
    model:v=>({P:P(v.x,v.y)}),question:()=> '점 P를 움직여 보세요. 순서쌍의 첫째 수와 둘째 수는 무엇을 나타낼까요?',
    guide:'노란 점 P를 움직여 두 좌표와 축까지의 보조선을 비교하세요.',
    steps:(v,m)=>['원점에서 가로 방향을 먼저 읽어요.',T`가로 좌표는 $x=${F(v.x)}$예요.`,T`세로 좌표는 $y=${F(v.y)}$예요.`,T`순서쌍은 $P${xy(m.P)}$예요.`],
    answer:(v,m)=>T`$P${xy(m.P)}$: 가로 좌표 다음에 세로 좌표`,
    draw:(b,v,m,c)=>{M.projection(b,m.P);M.riseRun(b,O,m.P,{dxLabel:c.step>=2?N(v.x):'x',dyLabel:c.step>=2?N(v.y):'y'});M.drag(b,c,'P',m.P,{x:'x',y:'y',label:'P'});},
    verify:(v,m)=>[!close(m.P.x,v.x)&&'가로 좌표 불일치',!close(m.P.y,v.y)&&'세로 좌표 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'quadrants-boundary',tier:'concept',title:'사분면과 축 위의 점',types:['A04'],grid:{step:1},axes:{tickStep:1},nativeFocus:{x:[-5,5],y:[-5,5]},shortFocus:{x:[-5,5],y:[-5,5]},
    vars:{x:V('점의 가로 좌표',-3,-5,5),y:V('점의 세로 좌표',2,-5,5)},
    presets:[{label:'축 위로',values:{x:0,y:3}},{label:'원점으로',values:{x:0,y:0}},{label:'다른 위치',values:{x:4,y:-2}}],
    model:v=>({P:P(v.x,v.y),q:quadrant(P(v.x,v.y))}),
    question:()=> '좌표의 부호와 점의 위치를 연결해 보세요. 축 위의 점은 어느 사분면에 속할까요?',guide:'점을 축 위와 원점까지 옮겨 사분면의 경계를 확인하세요.',
    steps:(v,m)=>['두 좌표축이 평면을 네 부분으로 나누어요.',T`좌표의 부호는 $(${sign(v.x)},${sign(v.y)})$예요.`,v.x===0||v.y===0?'좌표가 0이면 점은 축 위에 있어요.':'가로·세로 부호를 함께 확인해요.',m.q],
    answer:(v,m)=>m.q,
    draw:(b,v,m,c)=>{[['I',3,3],['II',-3,3],['III',-3,-3],['IV',3,-3]].forEach(([n,x,y])=>M.label(b,P(x,y),n,{color:'muted',size:18}));M.drag(b,c,'P',m.P,{x:'x',y:'y',label:'P'});if(c.step>=1)M.projection(b,m.P);},
    verify:(v,m)=>[(v.x===0||v.y===0)&&m.q!=='어느 사분면에도 속하지 않음'&&'축 위 사분면 오분류'].filter(Boolean)
  }));
  coord.push(make({
    id:'point-move',tier:'concept',title:'좌표평면 위 점의 이동',grid:{step:1},axes:{tickStep:1},source:{kind:'supplement',types:[],refs:[],label:'좌표 이동 개념 보충',reason:'수집 기출에 적합한 직접 조작 장면이 없어 좌표의 변화를 보충합니다.'},
    vars:{ax:V('출발점 가로',-2,-4,2),ay:V('출발점 세로',1,-3,3),dx:V('가로 이동량',4,-4,4),dy:V('세로 이동량',-3,-4,4)},
    model:v=>({A:P(v.ax,v.ay),B:P(v.ax+v.dx,v.ay+v.dy)}),focus:(v,m)=>M.box([m.A,m.B],{pad:2,minSpan:10}),
    question:(v,m)=>T`점 $A${xy(m.A)}$를 가로로 $${F(v.dx)}$, 세로로 $${F(v.dy)}$만큼 옮깁니다. 도착점 B를 확인하세요.`,
    guide:'이동량의 부호를 바꾸어 오른쪽·왼쪽, 위·아래 움직임을 비교하세요.',
    steps:(v,m)=>[T`출발점은 $A${xy(m.A)}$예요.`,T`가로 좌표에 $${F(v.dx)}$를 더해요.`,T`세로 좌표에 $${F(v.dy)}$를 더해요.`,T`도착점은 $B${xy(m.B)}$예요.`],
    answer:(v,m)=>T`$B${xy(m.B)}$`,draw:(b,v,m,c)=>{M.riseRun(b,m.A,m.B,{color:'muted',width:1.5,dash:[5,4]});M.point(b,m.A,'A');M.point(b,m.B,'B',{color:'amber'});if(c.step>=1)M.riseRun(b,m.A,m.B,{dxLabel:N(v.dx),dyLabel:N(v.dy)});},
    verify:(v,m)=>[!close(m.B.x-m.A.x,v.dx)&&'가로 이동 불일치',!close(m.B.y-m.A.y,v.dy)&&'세로 이동 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'graph-story',tier:'concept',title:'그래프가 말하는 변화',types:['A08'],aspect:'free',
    vars:{time:V('살펴볼 시각(분)',3,0,10,.5)},state:{mode:0},presets:[{label:'집과의 거리',values:{mode:0}},{label:'움직이는 속력',values:{mode:1}}],
    axes:v=>({xLabel:'시간(분)',yLabel:v.mode?'속력(m/분)':'집과의 거리(m)'}),focus:{x:[-1,11],y:[-1,11]},
    model:v=>{const points=v.mode?[P(0,2),P(4,8),P(7,8),P(10,2)]:[O,P(4,8),P(7,8),P(10,2)];return {points,P:P(v.time,interpolate(points,v.time)),mode:v.mode};},
    question:v=>v.mode?'세로축이 속력일 때, 수평인 구간은 어떤 움직임을 뜻할까요?':'집에서 이어진 직선길 위에서 움직입니다. 세로축이 집과의 거리일 때, 수평인 구간은 어떤 상황을 뜻할까요?',
    guide:'시각을 바꾸고 세로축의 이름도 바꾸어 같은 모양의 그래프를 다르게 읽어 보세요.',
    steps:(v,m)=>['먼저 가로축과 세로축의 단위를 읽어요.','4분부터 7분까지 세로값이 같아요.',v.mode?'속력이 같으므로 일정하게 움직여요.':'집과의 거리가 변하지 않아요.',v.mode?'수평선은 정지가 아니라 일정한 속력이에요.':'집과의 거리가 같은 곳에 머문 상황이에요.'],
    answer:v=>v.mode?'4~7분: 속력 8m/분으로 일정하게 이동':'4~7분: 집과의 거리 8m로 일정',
    draw:(b,v,m,c)=>{graphPoints(b,m.points);M.point(b,m.P,'현재',{color:'amber'});if(c.step>=1)M.projection(b,m.P);if(c.step>=2)b.seg(P(4,8),P(7,8),{color:'amber',width:5});},
    follow:['높이와 빠르기를 혼동하지 않아요.','수평선의 뜻도 세로축에 따라 달라져요.','같은 시간의 세로값을 비교해요.','축의 이름을 바꾼 두 상황을 비교해 보세요.']
  }));
  function water(v) {
    const mode=v.mode, total=[4,5,6][mode];
    const height=t=>mode===0?t:mode===1?(t<=4?t/2:2+(t-4)*2):-4+Math.sqrt(16+8*t);
    const time=v.fill*total,h=height(time);
    return {mode,total,height,time,h,P:P(time,h)};
  }
  coord.push(make({
    id:'water-vessels',tier:'concept',title:'그릇을 채우면 그래프는',types:['A11'],aspect:'free',
    vars:{fill:V('채운 비율',.5,0,1,.05)},state:{mode:0},presets:[{label:'일정한 넓이',values:{mode:0}},{label:'위쪽이 좁은 그릇',values:{mode:1}},{label:'위로 넓어지는 그릇',values:{mode:2}}],
    model:water,focus:{x:[-1,11],y:[-.8,5.5]},axes:{xLabel:'시간(초)',yLabel:'물높이(cm)'},
    question:()=> '같은 양의 물을 같은 시간마다 넣습니다. 그릇의 수평 단면이 넓어지거나 좁아지면 물높이 그래프는 어떻게 달라질까요?',
    guide:'그릇 모양을 고른 뒤 채운 비율을 움직여 물높이와 그래프의 점을 함께 보세요.',
    steps:(v,m)=>['같은 시간마다 들어오는 물의 양은 같아요.','수평 단면이 넓으면 높이는 천천히 올라요.',m.mode===0?'단면이 일정하면 높이도 일정하게 증가해요.':m.mode===1?'좁은 목에 닿으면 높이가 더 빨리 올라요.':'위로 넓어지므로 높이가 점점 천천히 올라요.','그릇의 넓이와 그래프의 가파름을 연결해요.'],
    answer:(v,m)=>['일정한 넓이 → 일정한 증가','넓은 아래·좁은 위 → 가파름 증가','위로 넓어짐 → 가파름 감소'][m.mode],
    draw:(b,v,m,c)=>{M.curve(b,m.height,{from:0,to:m.total});M.point(b,m.P,'물높이',{color:'amber'});if(c.step>=1)M.projection(b,m.P);
      const cx=8.7,r0=.75,w=h=>m.mode===0?r0:m.mode===1?(h<=2?r0*Math.sqrt(2):r0/Math.sqrt(2)):r0*Math.sqrt(1+h/4);
      const side=[];for(let i=0;i<=40;i++){const h=4*i/40;side.push(P(cx-w(h),h));}for(let i=40;i>=0;i--){const h=4*i/40;side.push(P(cx+w(h),h));}
      M.polygon(b,side,{color:'muted',fill:'muted',fillAlpha:.04});const filled=[];for(let i=0;i<=30;i++){const h=m.h*i/30;filled.push(P(cx-w(h),h));}for(let i=30;i>=0;i--){const h=m.h*i/30;filled.push(P(cx+w(h),h));}M.polygon(b,filled,{color:'sky',fill:'sky',fillAlpha:.25});M.label(b,P(cx,4.6),'그릇 단면',{color:'muted'});},
    verify:(v,m)=>[m.h<-.0001||m.h>4.0001?'물높이 범위 오류':false,!close(m.height(m.total),4)&&'완료높이 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'read-coordinates',tier:'basic',title:'점의 좌표를 읽기',types:['A01'],grid:{step:1},axes:{tickStep:1},nativeFocus:{x:[-5,5],y:[-5,5]},shortFocus:{x:[-5,5],y:[-5,5]},
    vars:{x:V('점의 가로 위치',4,-5,5,1,true),y:V('점의 세로 위치',3,-5,5,1,true)},presets:[{label:'다른 위치',values:{x:-3,y:2}},{label:'축 위의 점',values:{x:0,y:-4}}],
    model:v=>({P:P(v.x,v.y)}),question:()=> '그림의 점 P의 좌표를 순서쌍으로 나타내세요.',guide:'점을 움직여 새 문제를 만들고 가로·세로 순서대로 좌표를 읽으세요.',
    steps:(v,m)=>['P에서 두 축에 보조선을 내려요.',T`가로축에서 $${F(v.x)}$를 읽어요.`,T`세로축에서 $${F(v.y)}$를 읽어요.`,T`따라서 $P${xy(m.P)}$예요.`],answer:(v,m)=>T`$P${xy(m.P)}$`,
    draw:(b,v,m,c)=>{M.drag(b,c,'P',m.P,{x:'x',y:'y',label:'P'});if(c.step>=1)M.projection(b,m.P);}
  }));
  coord.push(make({
    id:'axis-pair',tier:'basic',title:'축 위의 점과 같은 순서쌍',types:['A02','A03'],state:{mode:0},grid:{step:1},axes:{tickStep:1},
    vars:{a:V('조건 바꾸기',3,1,5,1,true),b:V('둘째 조건 바꾸기',2,1,5,1,true)},presets:[{label:'좌표축 조건',values:{mode:0,a:3,b:2}},{label:'같은 순서쌍',values:{mode:1,a:2,b:1}},{label:'새로운 조건',values:{a:4,b:3}}],
    model:v=>({A:P(2*v.a,0),B:P(0,-2*v.b),Q:P(3*v.a,2*v.b+2)}),focus:(v,m)=>M.box(v.mode?[m.Q]:[m.A,m.B],{minSpan:12,pad:2}),
    nativeFocus:(v,m)=>M.box(v.mode?[m.Q]:[m.A,m.B],{minSpan:10,pad:2}),
    shortFocus:(v,m)=>M.box(v.mode?[m.Q]:[m.A,m.B],{minSpan:10,pad:2}),
    question:v=>v.mode?T`$(3a,2b+2)=(${F(4*v.a)}-a,-2b+${F(4*v.b+2)})$일 때 $a,b$를 구하세요.`:T`$A(2a,a-${F(v.a)})$는 x축, $B(b-${F(v.b)},-2b)$는 y축 위에 있습니다. $a,b$를 구하세요.`,
    guide:'조건 프리셋을 바꾸어 축의 0인 좌표와 순서쌍의 같은 성분을 비교하세요.',
    steps:v=>v.mode?['같은 순서쌍은 같은 위치의 수가 같아요.',T`첫째 성분에서 $3a=${F(4*v.a)}-a$예요.`,T`둘째 성분에서 $2b+2=-2b+${F(4*v.b+2)}$예요.`,T`$a=${F(v.a)},\ b=${F(v.b)}$예요.`]:['x축 위의 점은 세로 좌표가 0이에요.',T`$a-${F(v.a)}=0$을 세워요.`,T`y축 위에서는 $b-${F(v.b)}=0$이에요.`,T`$a=${F(v.a)},\ b=${F(v.b)}$예요.`],
    answer:v=>T`$a=${F(v.a)},\ b=${F(v.b)}$`,draw:(b,v,m,c)=>{if(v.mode){M.point(b,m.Q,'두 순서쌍');if(c.step)M.projection(b,m.Q);}else{b.seg(O,m.A,{color:'sky',width:3});b.seg(O,m.B,rose);M.point(b,m.A,'A');M.point(b,m.B,'B',{color:'rose'});if(c.step>=1){M.label(b,P(m.A.x,0),'y=0',{dy:23});M.label(b,P(0,m.B.y),'x=0',{dx:32,dy:14});}}}
  }));
  coord.push(make({
    id:'axis-distance',tier:'basic',title:'점과 좌표축 사이의 거리',types:['A06'],grid:{step:1},axes:{tickStep:1},nativeFocus:{x:[-5,5],y:[-5,5]},shortFocus:{x:[-5,5],y:[-5,5]},vars:{x:V('점의 가로 좌표',5,-5,5),y:V('점의 세로 좌표',4,-5,5)},model:v=>({P:P(v.x,v.y),dx:Math.abs(v.x),dy:Math.abs(v.y)}),
    question:(v,m)=>T`$P${xy(m.P)}$에서 x축까지, y축까지의 거리를 각각 구하세요.`,guide:'점을 다른 사분면으로 옮겨도 거리가 음수가 되지 않는 이유를 보세요.',
    steps:(v,m)=>['축과 수직인 가장 짧은 선분을 그어요.',T`x축까지의 거리는 $|${F(v.y)}|=${F(m.dy)}$예요.`,T`y축까지의 거리는 $|${F(v.x)}|=${F(m.dx)}$예요.`,'거리는 0 이상이므로 좌표의 절댓값을 써요.'],answer:(v,m)=>T`x축까지 $${F(m.dy)}$, y축까지 $${F(m.dx)}$`,
    draw:(b,v,m,c)=>{b.seg(m.P,P(v.x,0),{color:'amber',width:3});b.seg(m.P,P(0,v.y),{color:'rose',width:3});M.drag(b,c,'P',m.P,{x:'x',y:'y',label:'P'});if(c.solved){M.label(b,P(v.x,v.y/2),N(m.dy),{dx:15,color:'amber'});M.label(b,P(v.x/2,v.y),N(m.dx),{dy:-15,color:'rose'});}},
    verify:(v,m)=>[m.dx<0||m.dy<0?'음의 거리':false,!close(m.dx*m.dx,v.x*v.x)&&'x축성분 거리 오류'].filter(Boolean)
  }));
  coord.push(make({
    id:'read-time',tier:'basic',title:'그래프의 값과 구간 읽기',types:['A08'],aspect:'free',vars:{time:V('살펴볼 시각',9,0,24,3)},
    model:v=>{const points=[P(0,12),P(3,10),P(9,14),P(15,22),P(21,16),P(24,18)];return {points,P:P(v.time,interpolate(points,v.time))};},focus:{x:[-2,26],y:[-1,25]},axes:{xLabel:'시각(시)',yLabel:'기온(℃)'},
    question:v=>T`하루 기온 그래프입니다. $${F(v.time)}$시의 기온을 읽고, 기온이 높아지는 구간을 찾으세요.`,guide:'시각을 바꾸고 그래프의 높이와 증가·감소 방향을 비교하세요.',
    steps:(v,m)=>[T`가로축에서 $${F(v.time)}$시를 찾아요.`,'그래프까지 세로로 올라가요.','오른쪽으로 갈 때 높아지는 구간을 찾아요.',T`기온 $${F(m.P.y)}$℃, 증가 구간은 3~15시와 21~24시예요.`],
    answer:(v,m)=>T`$${F(v.time)}$시 기온 $${F(m.P.y)}$℃ · 증가: 3~15시, 21~24시`,
    draw:(b,v,m,c)=>{graphPoints(b,m.points);M.point(b,m.P,'현재',{color:'amber'});if(c.step>=1)M.projection(b,m.P);if(c.step>=3){b.path(m.points.slice(1,4),{color:'green',width:4});b.path(m.points.slice(4),{color:'green',width:4});}}
  }));
  coord.push(make({
    id:'baseline-change',tier:'basic',title:'변화량과 실제 값',types:['A13'],aspect:'free',vars:{week:V('살펴볼 주',1,0,6)},
    model:v=>{const changes=[0,-.5,-1,-1,0,1,1.5];return {changes,P:P(v.week,changes[v.week]),actual:9+changes[v.week]};},focus:{x:[-.5,6.7],y:[-1.8,2.4]},axes:{xLabel:'지난 시간(주)',yLabel:'변화량(kg)'},
    question:v=>T`처음 몸무게는 9kg입니다. 그래프는 처음에 비한 변화량입니다. $${F(v.week)}$주 뒤 실제 몸무게를 구하세요.`,guide:'주를 바꾸며 세로축이 실제 몸무게가 아니라 변화량임을 확인하세요.',
    steps:(v,m)=>['세로축은 실제 무게가 아니라 변화량이에요.',T`변화량은 $${F(m.P.y)}$kg이에요.`,'실제 무게는 처음 무게에 변화량을 더해요.',T`$9+(${F(m.P.y)})=${F(m.actual)}$kg이에요.`],answer:(v,m)=>T`$9+(${F(m.P.y)})=${F(m.actual)}$kg`,
    draw:(b,v,m,c)=>{m.changes.forEach((y,x)=>M.point(b,P(x,y),'',{r:4,color:x===v.week?'amber':'sky'}));if(c.step>=1)M.projection(b,m.P);if(c.step>=3)M.label(b,P(3,2),'기준 몸무게 9kg',{color:'muted'});},verify:(v,m)=>[!close(m.actual-m.P.y,9)&&'기준값 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'quantity-table',tier:'basic',title:'상황·표·순서쌍 연결',types:['A12'],vars:{count:V('공고문의 수(장)',3,1,6)},model:v=>({P:P(v.count,v.count+1),points:Array.from({length:6},(_,i)=>P(i+1,i+2))}),focus:{x:[-1,8],y:[-1,9]},grid:{step:1},axes:{xLabel:'공고문(장)',yLabel:'압정(개)',tickStep:1},
    question:v=>T`공고문 한 장에 압정 2개가 필요하고, 이어 붙일 때마다 압정을 1개 추가합니다. 공고문 $${F(v.count)}$장에 필요한 압정 수를 구하세요.`,
    guide:'장 수를 바꾸어 표에 해당하는 점을 확인하세요. 공고문은 자연수 장만 셉니다.',
    steps:()=>['처음 한 장에는 압정 2개가 필요해요.','한 장을 더할 때마다 압정 1개가 늘어요.','공고문 수보다 압정 수가 항상 1개 많아요.','두 양의 관계는 y=x+1이에요.'],answer:(v,m)=>T`압정 $${F(m.P.y)}$개 · 순서쌍 $${xy(m.P)}$`,
    draw:(b,v,m,c)=>{m.points.forEach(q=>M.point(b,q,'',{color:q.x===v.count?'amber':'sky',r:5}));if(c.step>=1)M.projection(b,m.P);if(c.step>=3)M.label(b,P(3,8),'1장→2개, 2장→3개, …',{color:'muted'});},
    verify:(v,m)=>[m.P.y-v.count!==1&&'증가 규칙 오류'].filter(Boolean)
  }));
  coord.push(make({
    id:'sign-reasoning',tier:'advanced',title:'식으로 주어진 좌표의 부호',types:['A05'],vars:{a:V('양의 크기',2,1,4),b:V('다른 크기',3,1,4)},state:{mode:0},
    presets:[{label:'사분면 조건',values:{mode:0}},{label:'합과 곱 조건',values:{mode:1}}],
    model:v=>{const a=v.mode?-v.a:v.a,b=-v.b;return {a,b,A:P(a,b),given:v.mode?P(a+b,a*b):P(a,b),B:v.mode?P(b,-a):P(b-a,-a/b),q:quadrant(v.mode?P(b,-a):P(b-a,-a/b))};},focus:(v,m)=>M.box([m.A,m.B,m.given],{minSpan:12,pad:2}),
    question:v=>v.mode?'점 (a+b,ab)가 제2사분면에 있습니다. 점 (b,−a)는 어느 사분면에 있을까요?':'점 (a,b)가 제4사분면에 있습니다. 점 (b−a,−a/b)는 어느 사분면에 있을까요?',
    guide:'크기를 바꾸어도 부호로 결정한 사분면이 유지되는지 확인하세요.',
    steps:v=>v.mode?['제2사분면이므로 a+b<0, ab>0이에요.','곱이 양수이므로 a,b는 같은 부호예요.','합이 음수이므로 a,b는 모두 음수예요.','(b,−a)의 부호는 (−,+): 제2사분면이에요.']:['제4사분면이므로 a>0, b<0이에요.','음수에서 양수를 빼므로 b−a<0이에요.','−a와 b가 모두 음수여서 −a/b>0이에요.','새 좌표의 부호는 (−,+): 제2사분면이에요.'],
    answer:(v,m)=>m.q,draw:(b,v,m,c)=>{M.point(b,m.given,v.mode?'(a+b, ab)':'(a,b)');if(c.step>=2&&v.mode)M.point(b,m.A,'(a,b)',{color:'muted'});if(c.solved){M.point(b,m.B,'새 점',{color:'amber'});M.projection(b,m.B);}else M.label(b,P(3,4),'새 점의 위치는?',{color:'muted'});},
    verify:(v,m)=>[m.q!=='제2사분면'&&'부호 추론 오류',v.mode&&(m.a+m.b>=0||m.a*m.b<=0)&&'합·곱 조건 오류'].filter(Boolean)
  }));
  coord.push(make({
    id:'coordinate-area',tier:'advanced',title:'좌표로 구하는 도형의 넓이',types:['A07'],state:{mode:0},grid:{step:1},axes:{tickStep:1},vars:{width:V('가로 간격',4,2,10,1,true),height:V('왼쪽 세로 길이',5,4,8,1,true)},
    presets:[{label:'삼각형',values:{mode:0,width:4,height:5}},{label:'사다리꼴',values:{mode:1,width:10,height:7}}],
    model:v=>{const left=-1,bottom=-1,A=P(left,bottom+v.height),B=P(left,bottom),C=P(left+v.width,bottom),D=P(left+v.width,bottom+3),Q=P(left+v.width,0);return {A,B,C,D,Q,area:v.mode?(v.height+3)*v.width/2:v.width*v.height/2};},
    focus:(v,m)=>M.box([m.A,m.B,m.C,m.D],{pad:2,minSpan:10}),
    question:(v,m)=>v.mode?T`$A${xy(m.A)},B${xy(m.B)},C${xy(m.C)},D${xy(m.D)}$인 사다리꼴 ABCD의 넓이를 구하세요.`:T`$A${xy(m.A)},B${xy(m.B)},C${xy(m.Q)}$인 삼각형 ABC의 넓이를 구하세요.`,
    guide:'점 A를 위아래로, 점 C를 좌우로 움직이고 좌표의 차가 어느 길이가 되는지 보세요.',
    steps:(v,m)=>[T`왼쪽 세로변은 $${F(v.height)}$예요.`,T`수직인 가로 간격은 $${F(v.width)}$예요.`,v.mode?T`두 평행변의 합은 $${F(v.height+3)}$예요.`:'삼각형의 높이는 꼭짓점에서 밑변까지의 거리예요.',v.mode?T`넓이는 $(${F(v.height)}+3)\times${F(v.width)}\div2=${F(m.area)}$예요.`:T`넓이는 $${F(v.height)}\times${F(v.width)}\div2=${F(m.area)}$예요.`],
    answer:(v,m)=>T`넓이 $${F(m.area)}$`,draw:(b,v,m,c)=>{M.polygon(b,v.mode?[m.A,m.B,m.C,m.D]:[m.A,m.B,m.Q]);b.handle(c.spec.id+':A',m.A,{label:'A',color:'amber',size:14,drag:q=>c.set({height:q.y+1})});M.point(b,m.B,'B',{dy:18});b.handle(c.spec.id+':C',v.mode?m.C:m.Q,{label:'C',color:'amber',size:14,drag:q=>c.set({width:q.x+1})});if(v.mode)M.point(b,m.D,'D');if(c.step>=1)b.seg(m.A,m.B,{color:'amber',width:4});if(c.step>=2)b.seg(P(m.B.x,0),P(m.C.x,0),{color:'rose',width:3,dash:[5,4]});},
    verify:(v,m)=>[m.area<=0&&'퇴화 넓이',!close(m.C.x-m.B.x,v.width)&&'밑변 거리 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'repeated-graph',tier:'advanced',title:'반복 그래프의 높이와 주기',types:['A09'],aspect:'free',vars:{time:V('살펴볼 시각(분)',10,0,60,1),period:V('한 바퀴 걸린 시간',20,10,30,5)},
    model:v=>{const height=t=>15-15*Math.cos(2*Math.PI*t/v.period);return {height,P:P(v.time,height(v.time)),topTimes:Array.from({length:7},(_,i)=>v.period*(i+.5)).filter(t=>t<=60)};},
    focus:{x:[-3,63],y:[-2,34]},axes:{xLabel:'시간(분)',yLabel:'높이(m)'},question:v=>T`회전기구의 높이가 반복됩니다. 이 그래프에서 가장 높은 높이와 같은 높이로 돌아오는 반복 간격을 읽으세요.`,
    guide:'시각을 움직여 최고점과 최저점을 찾고, 한 바퀴 시간을 바꾸어 반복 간격을 비교하세요.',
    steps:(v,m)=>['높이의 변화가 같은 모양으로 반복돼요.','같은 모양의 최고점 사이 시간을 비교해요.',T`이웃한 최고점 사이 간격은 $${F(v.period)}$분이에요.`,'가장 높은 높이는 30m예요.'],
    answer:v=>T`최고 높이 30m · 반복 간격 $${F(v.period)}$분`,draw:(b,v,m,c)=>{M.curve(b,m.height,{from:0,to:60});M.point(b,m.P,'현재',{color:'amber'});if(c.step>=1)M.projection(b,m.P);if(c.step>=2)m.topTimes.forEach(t=>M.point(b,P(t,30),'',{color:'green',r:4}));if(c.step>=3)b.seg(P(v.period/2,30),P(v.period*1.5,30),{color:'rose',width:2});},
    follow:['모양이 반복되는 간격을 찾는 활동이에요.','높이의 차가 아닌 시간의 차를 읽어요.','계산식 없이 그래프의 반복을 확인해요.','시각을 바꾸어도 최고 높이는 같아요.'],verify:(v,m)=>[!close(m.height(v.period),0)&&'주기 불일치',!close(m.height(v.period/2),30)&&'최고높이 불일치'].filter(Boolean)
  }));
  coord.push(make({
    id:'journey-compare',tier:'advanced',title:'두 사람의 만남과 도착',types:['A10'],aspect:'free',state:{mode:0},vars:{time:V('살펴볼 시각(분)',20,0,75,1)},
    presets:[{label:'토끼와 거북이',values:{mode:0,time:20}},{label:'걷기와 자전거',values:{mode:1,time:15}}],
    model:v=>{const fast=t=>v.mode?Math.min(6,.4*t):Math.min(2,Math.max(0,(t-10)/15)),slow=t=>v.mode?Math.min(6,.08*t):t/30;return {fast,slow,A:P(v.time,fast(v.time)),B:P(v.time,slow(v.time))};},
    focus:v=>({x:[-4,80],y:[-.3,v.mode?6.7:3]}),axes:{xLabel:'시간(분)',yLabel:'이동 거리(km)'},
    question:v=>v.mode?'6km 떨어진 학교까지 자전거는 분속400m, 걷기는 분속80m로 동시에 출발합니다. 도착 시간 차를 구하세요.':'토끼는 10분 뒤 출발해 40분에 2km 지점에서 멈춥니다. 거북이는 60분에 2km 갑니다. 거북이가 출발한 뒤 두 동물이 다시 만나는 시각을 찾으세요.',
    guide:'시각을 움직여 같은 시간의 거리와 목표 지점에 도착하는 시각을 비교하세요.',
    steps:v=>v.mode?['6km를 6000m로 바꾸어요.','자전거 시간은 6000÷400이에요.','걷는 시간은 6000÷80이에요.','75−15=60분 기다리면 만나요.']:['같은 시각에 두 거리값이 같으면 만나요.','첫 교점은 토끼가 따라잡는 시각이에요.','둘째 교점은 멈춘 토끼에게 도착한 시각이에요.','만나는 시각은 20분과 60분이에요.'],
    answer:v=>v.mode?'도착 15분·75분 → 차이 60분':'20분, 60분',draw:(b,v,m,c)=>{M.curve(b,m.fast,{from:0,to:75,color:'sky'});M.curve(b,m.slow,{from:0,to:75,color:'rose'});M.point(b,m.A,v.mode?'자전거':'토끼',{color:'sky',dy:-14});M.point(b,m.B,v.mode?'걷기':'거북이',{color:'rose',dy:18});if(c.step>=1){M.projection(b,m.A);M.projection(b,m.B);}if(c.solved){const pts=v.mode?[P(15,6),P(75,6)]:[P(20,2/3),P(60,2)];pts.forEach(q=>M.point(b,q,'',{color:'green'}));}},
    verify:(v,m)=>v.mode?[!close(m.fast(15),6)&&'자전거 도착 오류',!close(m.slow(75),6)&&'보행 도착 오류'].filter(Boolean):[!close(m.fast(20),m.slow(20))&&'첫 교점 오류',!close(m.fast(60),m.slow(60))&&'둘째 교점 오류'].filter(Boolean)
  }));
  M.register({id:'g7-coordinate-graphs',title:'좌표평면과 그래프',course:'g7',courseName:'중1',unit:'좌표평면과 그래프',description:'좌표의 의미에서 생활 그래프와 좌표 넓이까지 연결합니다.',scenes:coord});
  const prop=[];
  prop.push(make({
    id:'direct-change',tier:'concept',title:'정비례의 비례상수',types:['B05'],vars:{magnitude:V('비례상수의 크기',2,.5,4,.5),x:V('살펴볼 x좌표',2,-4,4)},state:{sign:1},presets:[{label:'양의 상수',values:{sign:1}},{label:'음의 상수',values:{sign:-1}}],
    model:v=>({a:v.sign*v.magnitude,P:P(v.x,v.sign*v.magnitude*v.x),U:P(1,v.sign*v.magnitude)}),focus:(v,m)=>M.box([m.P,m.U,P(-m.P.x,-m.P.y)],{minSpan:10,pad:2}),
    question:()=> '정비례 y=ax에서 a의 부호와 크기를 바꾸면 직선은 어떻게 변할까요?',guide:'상수의 크기를 바꾸고, 양수·음수 프리셋을 비교하세요. x좌표가 바뀔 때 y도 함께 움직입니다.',
    steps:(v,m)=>['정비례 그래프는 원점을 지나요.','x=1일 때 y=a인 점을 확인해요.',m.a>0?'a>0이면 오른쪽으로 갈수록 높아져요.':'a<0이면 오른쪽으로 갈수록 낮아져요.',T`현재 직선은 $${lin(m.a)}$예요.`],answer:(v,m)=>T`$${lin(m.a)}$ · 같은 x에서 |a|가 커지면 |y|도 커져요.`,
    draw:(b,v,m,c)=>{M.line(b,m.a,0);M.point(b,O,'O',{color:'muted',dy:18});M.point(b,m.P,'P',{color:'amber'});if(c.step>=1)M.projection(b,m.P);if(c.step>=2)M.point(b,m.U,'(1,a)',{color:'green'});},verify:(v,m)=>[!close(m.P.y,m.a*m.P.x)&&'정비례 조건 오류',m.a===0&&'상수0'].filter(Boolean)
  }));
  prop.push(make({
    id:'inverse-change',tier:'concept',title:'반비례의 그래프와 상수',types:['B08'],vars:{magnitude:V('비례상수의 크기',6,2,16),x:V('살펴볼 x의 크기',3,1,6)},state:{sign:1,branch:1},
    presets:[{label:'양의 상수',values:{sign:1,branch:1}},{label:'음의 상수',values:{sign:-1,branch:1}},{label:'다른 가지',values:{branch:-1}}],
    model:v=>{const k=v.sign*v.magnitude,x=v.branch*v.x;return {k,P:P(x,k/x)};},focus:(v,m)=>M.box([m.P,P(-m.P.x,-m.P.y),P(5,5),P(-5,-5)],{minSpan:12,pad:2}),
    question:()=> '반비례 y=k/x의 상수와 점을 움직여 보세요. 곡선이 좌표축을 지나지 않는 이유도 생각해 보세요.',guide:'상수의 부호와 곡선의 가지를 바꾸어 xy가 일정한지 비교하세요. x=0은 선택할 수 없습니다.',
    steps:(v,m)=>[T`좌표의 곱은 $xy=${F(m.k)}$로 같아요.`,'x가 0이면 나눗셈을 할 수 없어요.',m.k>0?'양의 상수이면 두 좌표의 부호가 같아요.':'음의 상수이면 두 좌표의 부호가 달라요.',m.k>0?'그래프는 제1·3사분면에 있어요.':'그래프는 제2·4사분면에 있어요.'],answer:(v,m)=>T`$${inv(m.k)}$, $x\ne0$`,
    draw:(b,v,m,c)=>{M.inverse(b,m.k);M.point(b,m.P,'P',{color:'amber'});if(c.step>=1)M.projection(b,m.P);if(c.step>=2)M.point(b,P(-m.P.x,-m.P.y),'대응점',{color:'green'});},verify:(v,m)=>[!close(m.P.x*m.P.y,m.k)&&'곱 불일치',m.P.x===0&&'x=0'].filter(Boolean)
  }));
  prop.push(make({
    id:'relation-sort',tier:'concept',title:'정비례·반비례·그 밖의 관계',types:['B01'],aspect:'free',state:{mode:0},vars:{x:V('살펴볼 양 x',2,1,6)},
    presets:[{label:'한 개당 가격',values:{mode:0}},{label:'나누어 갖기',values:{mode:1}},{label:'처음 양에 더하기',values:{mode:2}}],
    model:v=>{const f=x=>v.mode===0?2*x:v.mode===1?12/x:x+3;return {f,P:P(v.x,f(v.x)),ratio:f(v.x)/v.x,product:v.x*f(v.x)};},focus:{x:[-.7,7],y:[-.5,13.5]},axes:{xLabel:'x',yLabel:'y'},
    question:v=>['한 개에 2천 원인 물건 x개의 가격 y천 원: 어떤 관계일까요?','12L를 x명이 똑같이 나눌 때 한 사람의 양 yL: 어떤 관계일까요?','처음 3L에 매분 1L를 넣을 때 x분 뒤 yL: 어떤 관계일까요?'][v.mode],
    guide:'x를 바꾸어 비 y/x와 곱 xy 중 무엇이 변하지 않는지 확인하세요.',
    steps:v=>['표의 x값을 두 배로 바꾸어 비교해요.','정비례는 y/x가 일정해요.','반비례는 xy가 일정해요.',['y=2x는 정비례예요.','y=12/x는 반비례예요.','y=x+3은 두 관계에 해당하지 않아요.'][v.mode]],
    answer:v=>['정비례: y=2x','반비례: y=12/x','정비례·반비례가 아님: y=x+3'][v.mode],draw:(b,v,m,c)=>{M.curve(b,m.f,{from:.7,to:6.3});for(let x=1;x<=6;x++)M.point(b,P(x,m.f(x)),'',{r:3});M.point(b,m.P,'현재',{color:'amber'});if(c.step>=1)M.projection(b,m.P);},
    readouts:(v,m,c)=>c.step>=2?[{label:'비 y/x',value:T`$${F(m.ratio)}$`,color:'sky'},{label:'곱 xy',value:T`$${F(m.product)}$`,color:'rose'}]:[]
  }));
  prop.push(make({
    id:'inverse-area',tier:'concept',title:'넓이가 일정한 직사각형',types:['B11'],vars:{k:V('비례상수 k',15,4,24),x:V('직사각형의 가로',3,1,8)},model:v=>({P:P(v.x,v.k/v.x),area:v.k}),focus:(v,m)=>M.box([m.P,P(0,0),P(5,5)],{minSpan:10,pad:2}),
    question:v=>T`점 P가 $${inv(v.k)}\ (x>0)$ 위를 움직입니다. P와 두 좌표축으로 만든 직사각형의 넓이를 관찰하세요.`,guide:'가로 길이를 움직여 세로 길이와 넓이가 어떻게 달라지는지 확인하세요.',
    steps:()=>['직사각형의 가로는 x, 세로는 y예요.','넓이는 가로와 세로의 곱 xy예요.','반비례에서는 xy가 비례상수와 같아요.','모양이 달라져도 넓이는 같아요.'],answer:(v,m)=>T`직사각형의 넓이 $xy=${F(m.area)}$`,
    draw:(b,v,m,c)=>{M.inverse(b,v.k,{from:.02});rect(b,0,0,m.P.x,m.P.y,{fill:'sky',color:'sky'});M.point(b,m.P,'P',{color:'amber'});if(c.step>=2){M.label(b,P(m.P.x/2,0),'x',{dy:18});M.label(b,P(0,m.P.y/2),'y',{dx:-18});}},verify:(v,m)=>[!close(m.P.x*m.P.y,m.area)&&'직사각형 넓이 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'direct-table',tier:'basic',title:'정비례 표의 빈칸',types:['B02'],vars:{givenX:V('주어진 x',2,1,5),givenY:V('주어진 y',5,1,10),targetX:V('빈칸 열의 x',4,1,8)},
    model:v=>({a:v.givenY/v.givenX,A:P(v.givenX,v.givenY),Q:P(v.targetX,v.targetX*v.givenY/v.givenX)}),focus:(v,m)=>M.box([m.A,m.Q],{minSpan:10,pad:2}),
    question:v=>T`y가 x에 정비례합니다. $(x,y)=(${F(v.givenX)},${F(v.givenY)})$일 때, $x=${F(v.targetX)}$인 표의 y값을 구하세요.`,guide:'주어진 열의 값이나 빈칸 열의 x를 바꾸어 같은 비를 유지하는지 확인하세요.',
    steps:(v,m)=>['정비례에서는 y를 x로 나눈 값이 같아요.',T`상수는 $a=${F(v.givenY)}/${F(v.givenX)}$예요.`,T`구할 y는 $a\times${F(v.targetX)}$예요.`,T`표의 빈칸은 $${F(m.Q.y)}$예요.`],
    answer:(v,m)=>T`빈칸 $y=${F(m.Q.y)}$`,draw:(b,v,m,c)=>{M.line(b,m.a,0);M.point(b,m.A,pointName(m.A,'A',true));b.vline(v.targetX,muted);if(c.step>=2){M.point(b,m.Q,'빈칸의 점',{color:'amber'});M.projection(b,m.Q);}},verify:(v,m)=>[!close(m.Q.y/m.Q.x,m.A.y/m.A.x)&&'표의 비 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'direct-points',tier:'basic',title:'정비례 식과 그래프 위의 점',types:['B03','B04'],vars:{px:V('주어진 점의 x',-3,-6,-1),py:V('주어진 점의 y',-2,-6,-1),qx:V('다른 점의 x',2,1,6)},state:{mode:0,offset:1},
    presets:[{label:'한 점에서 식',values:{mode:0}},{label:'미지 좌표',values:{mode:1}},{label:'점 판정',values:{mode:2,offset:1}},{label:'다른 후보',values:{mode:2,offset:0}}],
    model:v=>{const a=v.py/v.px;return {a,A:P(v.px,v.py),Q:P(v.qx,a*v.qx),C:P(v.qx,a*v.qx+v.offset)};},focus:(v,m)=>M.box([m.A,m.Q,m.C],{minSpan:12,pad:2}),
    question:(v,m)=>v.mode===0?T`정비례 그래프가 $A${xy(m.A)}$를 지납니다. 관계식을 구하세요.`:v.mode===1?T`정비례 그래프가 $A${xy(m.A)}$와 $(${F(v.qx)},b)$를 지납니다. b를 구하세요.`:T`$A${xy(m.A)}$를 지나는 정비례 그래프에 $C${xy(m.C)}$가 있는지 판정하세요.`,
    guide:'주어진 점을 바꾸거나 문제 프리셋을 골라 식·미지 좌표·대입 판정을 연결하세요.',
    steps:(v,m)=>[T`주어진 점 $A${xy(m.A)}$를 읽어요.`,T`상수는 $a=${F(v.py)}/${F(v.px)}$예요.`,v.mode===0?'그 상수를 y=ax에 써요.':T`$x=${F(v.qx)}$를 같은 식에 대입해요.`,v.mode===0?T`$${lin(m.a)}$예요.`:v.mode===1?T`$b=${F(m.Q.y)}$예요.`:v.offset===0?'C의 좌표가 식을 만족하므로 그래프 위예요.':'C의 좌표가 식을 만족하지 않으므로 밖이에요.'],
    answer:(v,m)=>v.mode===0?T`$${lin(m.a)}$`:v.mode===1?T`$b=${F(m.Q.y)}$`:v.offset===0?'C는 그래프 위의 점':'C는 그래프 위의 점이 아님',
    draw:(b,v,m,c)=>{M.line(b,m.a,0);M.point(b,m.A,'A');if(v.mode===2)M.point(b,m.C,'C',{color:'rose'});if(c.step>=1)M.projection(b,m.A);if(c.step>=3&&v.mode)M.point(b,m.Q,'대입한 점',{color:'amber'});},verify:(v,m)=>[!close(m.a*m.A.x,m.A.y)&&'주어진점 미통과',v.mode===2&&((Math.abs(m.C.y-m.a*m.C.x)<1e-8)!==(v.offset===0))&&'점판정 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'inverse-points',tier:'basic',title:'반비례 식과 그래프 위의 점',types:['B06','B07'],vars:{px:V('주어진 점의 x 크기',2,1,6),py:V('주어진 점의 y 크기',4,1,8),qx:V('다른 x의 크기',4,1,8)},state:{sign:-1,mode:0,offset:1},
    presets:[{label:'한 점에서 식',values:{mode:0}},{label:'미지 좌표',values:{mode:1}},{label:'점 판정',values:{mode:2,offset:1}},{label:'다른 후보',values:{mode:2,offset:0}},{label:'양의 상수',values:{sign:1}}],
    model:v=>{const k=v.sign*v.px*v.py;return {k,A:P(-v.px,-v.sign*v.py),Q:P(v.qx,k/v.qx),C:P(v.qx,k/v.qx+v.offset)};},focus:(v,m)=>M.box([m.A,m.Q,m.C],{minSpan:12,pad:2}),
    question:(v,m)=>v.mode===0?T`반비례 그래프가 $A${xy(m.A)}$를 지납니다. 관계식을 구하세요.`:v.mode===1?T`반비례 그래프가 $A${xy(m.A)}$를 지납니다. $x=${F(v.qx)}$일 때 y를 구하세요.`:T`반비례 그래프가 $A${xy(m.A)}$를 지납니다. $C${xy(m.C)}$가 같은 그래프 위에 있는지 판정하세요.`,
    guide:'점의 좌표를 바꾸어 곱이 같아지는 조건을 관찰하세요.',
    steps:(v,m)=>['반비례에서는 좌표의 곱 xy가 같아요.',T`주어진 점으로 $k=(${F(m.A.x)})(${F(m.A.y)})$예요.`,v.mode===0?'상수를 y=k/x에 써요.':T`$x=${F(v.qx)}$에서 $y=k/${F(v.qx)}$예요.`,v.mode===0?T`$${inv(m.k)}$예요.`:v.mode===1?T`$y=${F(m.Q.y)}$예요.`:v.offset===0?'C의 좌표 곱이 같으므로 그래프 위예요.':'C의 좌표 곱이 다르므로 그래프 밖이에요.'],
    answer:(v,m)=>v.mode===0?T`$${inv(m.k)}$`:v.mode===1?T`$y=${F(m.Q.y)}$`:v.offset===0?'C는 그래프 위의 점':'C는 그래프 위의 점이 아님',
    draw:(b,v,m,c)=>{M.inverse(b,m.k);M.point(b,m.A,'A');if(v.mode===2)M.point(b,m.C,'C',{color:'rose'});if(c.step>=1)M.projection(b,m.A);if(c.step>=3&&v.mode){M.point(b,m.Q,'대입한 점',{color:'amber'});M.projection(b,m.Q);}},verify:(v,m)=>[!close(m.A.x*m.A.y,m.k)&&'주어진점 미통과',!close(m.Q.x*m.Q.y,m.k)&&'미지좌표 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'graph-signs',tier:'basic',title:'비례 그래프와 사분면',types:['B05','B08'],vars:{mag:V('상수의 크기',2,1,4)},state:{sign:1,kind:0},
    presets:[{label:'정비례 양수',values:{kind:0,sign:1}},{label:'정비례 음수',values:{kind:0,sign:-1}},{label:'반비례 양수',values:{kind:1,sign:1}},{label:'반비례 음수',values:{kind:1,sign:-1}}],
    model:v=>({k:v.sign*v.mag}),question:(v,m)=>T`$${v.kind?inv(m.k):lin(m.k)}$의 그래프가 지나는 사분면을 찾으세요.`,guide:'같은 부호의 정비례와 반비례를 골라 사분면과 모양의 차이를 비교하세요.',
    steps:(v,m)=>[m.k>0?'상수가 양수예요.':'상수가 음수예요.',m.k>0?'x와 y의 부호가 같아요.':'x와 y의 부호가 달라요.',v.kind?'반비례 곡선은 두 가지로 나뉘어요.':'정비례 직선은 원점을 지나요.',m.k>0?'제1사분면과 제3사분면을 지나요.':'제2사분면과 제4사분면을 지나요.'],
    answer:(v,m)=>m.k>0?'제1·3사분면':'제2·4사분면',draw:(b,v,m,c)=>{v.kind?M.inverse(b,m.k):M.line(b,m.k,0);if(c.step>=2){const q=P(1,m.k);M.point(b,q,'x>0');M.point(b,P(-1,-m.k),'x<0',{color:'rose'});}},
    verify:(v,m)=>[m.k===0&&'비례상수0'].filter(Boolean)
  }));
  prop.push(make({
    id:'shared-point',tier:'basic',title:'두 비례 그래프의 공통점',types:['B09'],vars:{x:V('공통점 x의 크기',6,1,8),y:V('공통점 y',2,1,6)},state:{sign:-1},presets:[{label:'다른 사분면',values:{sign:1}},{label:'처음 방향',values:{sign:-1}}],
    model:v=>{const x=v.sign*v.x;return {A:P(x,v.y),a:v.y/x,k:x*v.y,product:v.y*v.y};},focus:(v,m)=>M.box([m.A,P(-m.A.x,-m.A.y)],{minSpan:12,pad:2}),
    question:(v,m)=>T`$y=ax$와 $y=b/x$가 $A${xy(m.A)}$에서 만납니다. $a,b$와 $ab$를 구하세요.`,guide:'공통점 좌표를 바꾸어 같은 점에서 비와 곱이 각각 상수를 정하는지 보세요.',
    steps:(v,m)=>['공통점의 좌표는 두 식을 모두 만족해요.',T`정비례는 $a=${F(m.A.y)}/(${F(m.A.x)})$예요.`,T`반비례는 $b=(${F(m.A.x)})\times${F(m.A.y)}$예요.`,T`$a=${F(m.a)},b=${F(m.k)},ab=${F(m.product)}$예요.`],
    answer:(v,m)=>T`$a=${F(m.a)},\ b=${F(m.k)},\ ab=${F(m.product)}$`,draw:(b,v,m,c)=>{M.line(b,m.a,0);M.inverse(b,m.k,{color:'rose'});M.point(b,m.A,'A',{color:'amber'});if(c.step>=1)M.projection(b,m.A);},
    verify:(v,m)=>[!close(m.a*m.A.x,m.A.y)&&'정비례 공통점 오류',!close(m.A.x*m.A.y,m.k)&&'반비례 공통점 오류',!close(m.a*m.k,m.product)&&'곱 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'direct-triangle',tier:'basic',title:'정비례와 삼각형 넓이',types:['B10'],vars:{x:V('밑변의 길이',8,2,8),numerator:V('상수의 분자',5,1,6)},
    model:v=>({a:v.numerator/4,A:P(v.x,v.numerator*v.x/4),B:P(v.x,0),area:v.numerator*v.x*v.x/8}),focus:(v,m)=>M.box([m.A,m.B],{minSpan:10,pad:2}),
    question:(v,m)=>T`$${lin(m.a)}$ 위의 점 A에서 x축에 내린 수선의 발은 $B(${F(v.x)},0)$입니다. A의 좌표와 삼각형 AOB의 넓이를 구하세요.`,guide:'밑변과 정비례 상수를 바꾸어 높이가 식에서 결정되는 과정을 보세요.',
    steps:(v,m)=>[T`A의 x좌표도 $${F(v.x)}$예요.`,T`대입하면 $y=${F(m.a)}\times${F(v.x)}=${F(m.A.y)}$예요.`,T`밑변 OB는 $${F(v.x)}$, 높이 AB는 $${F(m.A.y)}$예요.`,T`넓이는 $${F(v.x)}\times${F(m.A.y)}\div2=${F(m.area)}$예요.`],answer:(v,m)=>T`$A${xy(m.A)}$, 넓이 $${F(m.area)}$`,
    draw:(b,v,m,c)=>{M.line(b,m.a,0);M.polygon(b,[O,m.B,m.A]);M.point(b,m.A,'A');M.point(b,m.B,'B',{dy:18});if(c.step>=2)b.seg(m.A,m.B,{color:'amber',width:3});if(c.solved)M.label(b,P(v.x*.65,m.A.y/3),`넓이 ${N(m.area,3)}`,{color:'green'});},
    verify:(v,m)=>[!close(m.A.y,m.a*m.A.x)&&'점-식 불일치',!close(v.x*m.A.y/2,m.area)&&'삼각형넓이 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'work-product',tier:'basic',title:'사람 수와 작업 기간',types:['B14'],aspect:'free',vars:{workers:V('작업 인원(명)',10,5,24)},
    model:v=>({work:120,P:P(v.workers,120/v.workers)}),focus:{x:[-1,26],y:[-1,27]},axes:{xLabel:'사람 수(명)',yLabel:'기간(일)'},
    question:v=>T`같은 일을 10명이 12일 동안 합니다. 한 명의 하루 작업량이 같을 때, $${F(v.workers)}$명이 걸리는 기간을 구하세요.`,
    guide:'작업 인원을 바꾸어 전체 일량은 같고 기간은 어떻게 달라지는지 보세요.',steps:(v,m)=>['전체 일량은 사람 수×일수로 비교해요.','10×12=120명·일의 작업이에요.','x명이 y일 일하면 xy=120이에요.',T`기간은 $120/${F(v.workers)}=${F(m.P.y)}$일이에요.`],
    answer:(v,m)=>T`$y=120/${F(v.workers)}=${F(m.P.y)}$일`,draw:(b,v,m,c)=>{M.inverse(b,120,{from:4.5,to:24.5});rect(b,0,0,m.P.x,m.P.y);M.point(b,m.P,'현재',{color:'amber'});if(c.step>=2)M.label(b,P(m.P.x/2,m.P.y/2),'같은 일량',{color:'green'});},
    verify:(v,m)=>[!close(v.workers*m.P.y,120)&&'전체 일량 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'gear-product',tier:'basic',title:'톱니 수와 회전 수',types:['B16'],aspect:'free',vars:{teeth:V('B의 톱니 수(개)',30,12,36)},
    model:v=>({passed:108,P:P(v.teeth,108/v.teeth)}),focus:{x:[-2,39],y:[-.5,11]},axes:{xLabel:'톱니 수(개)',yLabel:'회전 수(바퀴)'},
    question:v=>T`톱니가 18개인 A가 6바퀴 돌았습니다. 맞물린 B의 톱니가 $${F(v.teeth)}$개일 때 B의 회전 수를 구하세요.`,
    guide:'B의 톱니 수를 바꾸어 두 바퀴가 맞물린 톱니의 총수를 같게 유지하세요.',
    steps:(v,m)=>['한 바퀴 돌면 모든 톱니가 한 번 지나가요.','A에서 지나간 톱니는 18×6개예요.','맞물린 B도 같은 수의 톱니가 지나가요.',T`B는 $108/${F(v.teeth)}=${F(m.P.y)}$바퀴예요.`],answer:(v,m)=>T`B는 $108/${F(v.teeth)}=${F(m.P.y)}$바퀴`,
    draw:(b,v,m,c)=>{M.inverse(b,108,{from:10,to:38});rect(b,0,0,18,6,{color:'muted',fill:'muted',fillAlpha:.05});M.point(b,P(18,6),'A',{color:'muted'});rect(b,0,0,m.P.x,m.P.y,{color:'sky',fill:'sky'});M.point(b,m.P,'B',{color:'amber'});if(c.step>=2)M.label(b,P(9,3),'같은 톱니 총수',{color:'green'});},
    verify:(v,m)=>[!close(v.teeth*m.P.y,18*6)&&'맞물린 톱니수 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'physical-inverse',tier:'basic',title:'물리 상황의 반비례',types:['B17'],aspect:'free',state:{mode:0},vars:{x:V('살펴볼 가로축 값',4,1,60)},
    presets:[{label:'압력과 부피',values:{mode:0,x:4}},{label:'주파수와 파장',values:{mode:1,x:60}}],
    model:v=>({k:v.mode?300:24,A:v.mode?P(20,15):P(2,12),Q:P(v.x,(v.mode?300:24)/v.x)}),focus:(v,m)=>({x:[-1,Math.max(v.mode?65:12,v.x+2)],y:[-1,Math.max(v.mode?32:27,m.Q.y*1.1)]}),axes:v=>({xLabel:v.mode?'주파수(MHz)':'압력(기압)',yLabel:v.mode?'파장(m)':'부피(L)'}),
    question:(v,m)=>v.mode?T`주파수와 파장이 반비례하고 20MHz일 때 파장이 15m입니다. $${F(v.x)}$MHz일 때 파장을 구하세요.`:T`압력과 부피가 반비례하고 2기압일 때 부피가 12L입니다. $${F(v.x)}$기압일 때 부피를 구하세요.`,
    guide:'주어진 반비례 관계에서 가로축 값을 바꾸어 양의 영역의 점을 읽으세요.',
    steps:(v,m)=>['주어진 반비례 관계를 양의 영역에서 읽어요.',T`주어진 곱은 $${F(m.A.x)}\times${F(m.A.y)}$예요.`,T`구할 값은 $${F(m.k)}/${F(v.x)}$예요.`,T`$y=${F(m.Q.y)}$${v.mode?'m':'L'}예요.`],answer:(v,m)=>T`$y=${F(m.Q.y)}$${v.mode?'m':'L'}`,
    draw:(b,v,m,c)=>{M.inverse(b,m.k,{from:.2});M.point(b,m.A,'주어진 점');M.point(b,m.Q,'현재',{color:'amber'});if(c.step>=1)M.projection(b,m.Q);},verify:(v,m)=>[!close(m.Q.x*m.Q.y,m.k)&&'물리량 곱 불일치',m.Q.x<=0||m.Q.y<=0?'물리량 양수범위 오류':false].filter(Boolean)
  }));
  function integerPoints(k,negativeOnly=false) {
    const points=[];for(let x=1;x<=k;x++)if(k%x===0){if(!negativeOnly)points.push(P(x,k/x));points.push(P(-x,-k/x));}return points;
  }
  prop.push(make({
    id:'integer-points',tier:'advanced',title:'반비례 그래프의 정수점',types:['B12'],vars:{k:V('비례상수 k',10,2,24)},state:{negativeOnly:false},
    presets:[{label:'모든 정수점',values:{negativeOnly:false}},{label:'두 좌표가 음수',values:{negativeOnly:true}},{label:'다른 상수',values:{k:16}}],
    model:v=>({points:integerPoints(v.k,v.negativeOnly)}),focus:v=>({x:[-v.k-2,v.negativeOnly?2:v.k+2],y:[-v.k-2,v.negativeOnly?2:v.k+2]}),
    question:v=>T`$${inv(v.k)}$ 위에서 ${v.negativeOnly?'두 좌표가 모두 음의 정수인':'두 좌표가 모두 정수인'} 점을 모두 찾고 개수를 구하세요.`,
    guide:'비례상수를 정수로 바꾸고 정수 약수쌍이 곡선의 점이 되는지 확인하세요.',
    steps:(v,m)=>[T`정수 좌표는 $xy=${F(v.k)}$를 만족해요.`,T`양의 약수는 $${[...new Set(m.points.map(q=>Math.abs(q.x)))].sort((a,b)=>a-b).join(',')}$예요.`,'각 약수마다 y=k/x가 하나씩 정해져요.',v.negativeOnly?T`음의 약수쌍만 세면 $${m.points.length}$개예요.`:T`양과 음의 쌍을 합해 $${m.points.length/2}\times2=${m.points.length}$개예요.`],
    answer:(v,m)=>T`정수점 $${m.points.length}$개`,draw:(b,v,m,c)=>{M.inverse(b,v.k);if(c.step>=2)m.points.forEach(q=>M.point(b,q,'',{color:'amber',r:4}));},
    verify:(v,m)=>[m.points.some(q=>!Number.isInteger(q.x)||!Number.isInteger(q.y)||q.x*q.y!==v.k)&&'정수점 조건 오류',new Set(m.points.map(q=>`${q.x},${q.y}`)).size!==m.points.length&&'중복 정수점'].filter(Boolean)
  }));
  function lattice(k) { const pts=[],edge=[];for(let x=1;x<k;x++)for(let y=1;y<k;y++){if(x*y<k)pts.push(P(x,y));else if(x*y===k)edge.push(P(x,y));}return {pts,edge}; }
  prop.push(make({
    id:'lattice-below',tier:'advanced',title:'곡선 아래의 격자점',types:['B13'],state:{target:8},vars:{column:V('살펴볼 x좌표',1,1,11)},
    presets:[{label:'격자점 16개',values:{target:8,column:1}},{label:'격자점 10개',values:{target:6,column:1}},{label:'격자점 23개',values:{target:10,column:1}}],
    model:v=>({...lattice(v.target),k:v.target}),focus:v=>({x:[-1,Math.max(v.target,v.column)+1],y:[-1,v.target+1]}),
    question:(v,m)=>T`제1사분면에서 $y=k/x$ 아래에 두 좌표가 양의 정수인 점이 $${m.pts.length}$개 있습니다. 곡선 위의 점은 제외합니다. 2 이상 12 이하의 정수 k를 구하세요.`,
    guide:'x좌표를 옮겨 각 세로줄에 있는 점을 세어 보세요. 빈 동그라미는 곡선 위라서 제외합니다.',
    steps:(v,m)=>[T`곡선 아래는 $xy\lt k$인 점이에요.`,'곡선 위의 점을 빼고 세로줄마다 세어요.',T`합은 $${Array.from({length:m.k-1},(_,i)=>m.pts.filter(q=>q.x===i+1).length).filter(Boolean).join('+')}=${m.pts.length}$개예요.`,T`조건과 맞는 상수는 $k=${m.k}$예요.`],
    answer:(v,m)=>T`$k=${m.k}$ · ${Array.from({length:m.k-1},(_,i)=>m.pts.filter(q=>q.x===i+1).length).filter(Boolean).join('+')} = ${m.pts.length}`,
    draw:(b,v,m,c)=>{M.inverse(b,m.k,{from:.05});b.vline(v.column,{color:'muted',width:1.5,dash:[4,4]});if(c.step>=1){m.pts.forEach(q=>M.point(b,q,'',{color:q.x===v.column?'amber':'sky',r:3.5}));m.edge.forEach(q=>M.point(b,q,'',{hollow:true,color:'rose',r:4}));}if(c.step>=2){const amount=m.pts.filter(q=>q.x===v.column).length;M.label(b,P(Math.min(v.column,m.k),m.k-.2),`${amount}개`,{color:'amber'});}},
    verify:(v,m)=>[m.pts.some(q=>q.x*q.y>=m.k)&&'경계 포함 오류',m.edge.some(q=>q.x*q.y!==m.k)&&'경계점 오류',Array.from({length:11},(_,i)=>i+2).filter(k=>lattice(k).pts.length===m.pts.length).length!==1&&'상수 유일성 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'remaining-work',tier:'advanced',title:'작업 도중 바뀐 기계 수',types:['B15'],aspect:'free',vars:{elapsed:V('이미 작업한 시간',5,2,8),remainingTime:V('남은 작업 시간',10,6,12)},
    model:v=>({total:480,done:24*v.elapsed,left:480-24*v.elapsed,required:(480-24*v.elapsed)/v.remainingTime,extra:(480-24*v.elapsed)/v.remainingTime-24}),
    focus:(v,m)=>({x:[-1,Math.max(55,m.required+5)],y:[-1,22]}),axes:{xLabel:'기계 수(대)',yLabel:'작업 시간(시간)'},
    question:v=>T`24대가 20시간 할 작업을 먼저 $${F(v.elapsed)}$시간 했습니다. 나머지를 $${F(v.remainingTime)}$시간 안에 마치려면 같은 성능의 기계가 최소 몇 대 더 필요할까요?`,
    guide:'이미 한 시간과 남은 시간을 바꾸어 완료한 일량과 남은 일량을 나누어 보세요.',
    steps:(v,m)=>['전체 작업은 24×20=480대·시간이에요.',T`이미 한 일은 $24\times${F(v.elapsed)}=${F(m.done)}$예요.`,T`남은 일은 $480-${F(m.done)}=${F(m.left)}$예요.`,T`전체 최소 $${Math.ceil(m.required-1e-9)}$대, 추가 $${Math.max(0,Math.ceil(m.required-1e-9)-24)}$대예요.`],
    follow:(v,m)=>['일량은 기계 수와 시간의 곱이에요.','이미 끝낸 일은 다시 계산하지 않아요.',T`필요한 수 $${F(m.left)}/${F(v.remainingTime)}=${F(m.required)}$를 올림해요.`,'처음 24대를 빼고 추가할 수만 구해요.'],
    answer:(v,m)=>T`전체 최소 $${Math.ceil(m.required-1e-9)}$대 · 추가 $${Math.max(0,Math.ceil(m.required-1e-9)-24)}$대`,
    draw:(b,v,m,c)=>{rect(b,0,0,24,20,{color:'muted',fill:'muted',fillAlpha:.04});rect(b,0,0,24,v.elapsed,{color:'rose',fill:'rose',fillAlpha:.15});if(c.step>=2){M.inverse(b,m.left,{from:1});rect(b,0,0,m.required,v.remainingTime,{color:'sky',fill:'sky'});M.point(b,P(m.required,v.remainingTime),'남은 일',{color:'amber'});}M.label(b,P(12,21),'전체 일량');},
    verify:(v,m)=>[!close(m.done+m.left,480)&&'남은일 계산 오류',Math.max(24,Math.ceil(m.required-1e-9))*v.remainingTime<m.left-1e-7&&'완료시간 부족'].filter(Boolean)
  }));
  prop.push(make({
    id:'between-graphs-area',tier:'advanced',title:'두 그래프 사이의 직사각형',types:['B18'],vars:{x:V('오른쪽 변의 x좌표',3,2,5),area:V('직사각형의 넓이',18,6,30,6)},
    model:v=>{const low=v.x/3,high=low+v.area/v.x;return {A:P(0,low),B:P(0,high),C:P(v.x,high),D:P(v.x,low),k:v.x*high,h:high-low};},focus:(v,m)=>M.box([m.A,m.B,m.C,m.D],{minSpan:10,pad:2}),
    question:v=>T`직사각형의 왼쪽 변은 y축, 오른쪽 변은 $x=${F(v.x)}$입니다. 오른쪽 아래 꼭짓점은 $y=x/3$, 오른쪽 위 꼭짓점은 $y=a/x$ 위에 있고 넓이는 $${F(v.area)}$입니다. a를 구하세요.`,
    guide:'공통 x좌표와 넓이를 바꾸어 두 그래프 사이의 높이를 계산하세요.',
    steps:(v,m)=>[T`아래 꼭짓점의 y좌표는 $${F(v.x)}/3$예요.`,T`직사각형 높이는 $${F(v.area)}/${F(v.x)}$예요.`,'위쪽 y좌표는 아래 y좌표에 높이를 더해요.',T`좌표 곱으로 $a=${F(m.k)}$예요.`],
    answer:(v,m)=>T`$a=${F(m.k)}$`,draw:(b,v,m,c)=>{M.line(b,1/3,0);M.inverse(b,m.k,{color:'rose',from:.05});M.polygon(b,[m.A,m.B,m.C,m.D]);[['A',m.A],['B',m.B],['C',m.C],['D',m.D]].forEach(([name,q])=>M.point(b,q,name));if(c.step>=2)b.seg(m.C,m.D,{color:'amber',width:4});},
    verify:(v,m)=>[!close(m.D.y,m.D.x/3)&&'아래 직선 미통과',!close(m.C.x*m.C.y,m.k)&&'위 곡선 미통과',!close(v.x*(m.C.y-m.D.y),v.area)&&'직사각형 넓이 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'bisect-rectangle',tier:'advanced',title:'직사각형의 넓이를 이등분',types:['B19'],vars:{width:V('직사각형의 가로',6,4,8),low:V('아래변의 y좌표',2,1,4),height:V('직사각형의 세로',4,2,6)},
    model:v=>{const high=v.low+v.height,C=P(v.width/2,v.low+v.height/2),a=C.y/C.x;return {C,a,high,L:P(v.low/a,v.low),U:P(high/a,high),area:v.width*v.height,rect:[P(0,v.low),P(v.width,v.low),P(v.width,high),P(0,high)]};},
    focus:(v,m)=>M.box(m.rect,{minSpan:12,pad:2}),question:(v,m)=>T`직사각형의 가로는 $${F(v.width)}$, 아래변과 위변은 $y=${F(v.low)},\ y=${F(m.high)}$입니다. 원점을 지나는 직선 y=ax가 넓이를 이등분할 때 a를 구하세요.`,
    guide:'직사각형의 크기를 바꾸어 중심을 지나는 직선의 양쪽 넓이가 같은 이유를 보세요.',
    steps:(v,m)=>['직사각형의 중심을 찾아요.','중심을 기준으로 반 바퀴 돌리면 겹쳐져요.','중심을 지나는 직선의 양쪽 영역이 대응해요.',T`중심 $${xy(m.C)}$를 대입해 $a=${F(m.a)}$예요.`],answer:(v,m)=>T`$a=${F(m.a)}$ · 양쪽 넓이 각각 $${F(m.area/2)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,m.rect,{fill:'muted',fillAlpha:.04,color:'sky'});M.line(b,m.a,0,rose);if(c.step>=1){M.point(b,m.C,'중심',{color:'amber'});b.seg(m.rect[0],m.rect[2],muted);b.seg(m.rect[1],m.rect[3],muted);}if(c.step>=2){M.polygon(b,[m.rect[0],m.L,m.U,m.rect[3]],{fill:'sky',color:'sky'});M.polygon(b,[m.L,m.rect[1],m.rect[2],m.U],{fill:'green',color:'green'});}},
    verify:(v,m)=>[!close(m.L.x+m.U.x,v.width)&&'대응 밑변 합 오류',!close((m.L.x+m.U.x)*v.height/2,m.area/2)&&'이등분 넓이 오류'].filter(Boolean)
  }));
  prop.push(make({
    id:'square-graphs',tier:'advanced',title:'정사각형과 두 비례 그래프',types:['B20'],vars:{side:V('정사각형 한 변',4,2,5,1,true),dx:V('D의 x좌표',-2,-4,-1),dy:V('D의 y좌표',-3,-4,-1)},
    presets:[{label:'넓이 4',values:{side:2}},{label:'넓이 9',values:{side:3}},{label:'넓이 16',values:{side:4}},{label:'넓이 25',values:{side:5}}],
    model:v=>{const A=P(v.dx-v.side,v.dy),B=P(v.dx-v.side,v.dy-v.side),C=P(v.dx,v.dy-v.side),D=P(v.dx,v.dy);return {A,B,C,D,a:A.y/A.x,k:B.x*B.y,product:A.y/A.x*B.x*B.y};},
    focus:(v,m)=>M.box([m.A,m.B,m.C,m.D],{minSpan:12,pad:2}),question:(v,m)=>T`넓이가 $${F(v.side*v.side)}$인 정사각형 ABCD의 변들은 좌표축과 평행하고 $D${xy(m.D)}$입니다. A는 $y=ax$, B는 $y=b/x$ 위에 있을 때 ab를 구하세요.`,
    guide:'그림의 D에서 왼쪽·아래쪽으로 한 변씩 이동하여 꼭짓점의 좌표를 정하세요.',
    steps:(v,m)=>[T`넓이가 $${F(v.side*v.side)}$이므로 한 변은 $${F(v.side)}$예요.`,'D에서 왼쪽으로 한 변만큼 가면 A예요.','A에서 아래로 한 변만큼 가면 B예요.',T`$a=${F(m.a)},b=${F(m.k)}$이므로 $ab=${F(m.product)}$예요.`],answer:(v,m)=>T`$ab=${F(m.product)}$`,
    draw:(b,v,m,c)=>{M.line(b,m.a,0);M.inverse(b,m.k,{color:'rose'});M.polygon(b,[m.A,m.B,m.C,m.D]);[['A',m.A],['B',m.B],['C',m.C],['D',m.D]].forEach(([name,q])=>M.point(b,q,name));if(c.step>=2)b.seg(m.D,m.A,{color:'amber',width:4});if(c.step>=3)b.seg(m.A,m.B,{color:'amber',width:4});},
    verify:(v,m)=>[!close(m.D.x-m.A.x,m.A.y-m.B.y)&&'정사각형 길이 불일치',!close(m.A.y,m.a*m.A.x)&&'A 직선 불일치',!close(m.B.x*m.B.y,m.k)&&'B 곡선 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'area-ratio',tier:'advanced',title:'공통 높이와 삼각형 넓이비',types:['B21'],vars:{x:V('세 점의 공통 x',4,3,6),k:V('반비례상수',24,12,30,3)},
    model:v=>{const A=P(v.x,v.k/v.x),B=P(v.x,-v.x/2),C=P(v.x,v.k/v.x-(v.k/v.x+v.x/2)*2.5);return {A,B,C,c:C.y/v.x,small:v.x*(A.y-B.y)/2,large:v.x*(A.y-C.y)/2};},
    focus:(v,m)=>M.box([m.A,m.B,m.C],{minSpan:12,pad:2}),question:v=>T`세 점 A,B,C의 x좌표는 $${F(v.x)}$로 같고 A,B,C 순서로 아래에 있습니다. A는 $y=${F(v.k)}/x$, B는 $y=-x/2$ 위에 있습니다. 삼각형 AOB:AOC=2:5일 때 C를 지나는 y=cx의 c를 구하세요.`,
    guide:'같은 높이를 가진 두 삼각형의 넓이비가 어느 선분의 비가 되는지 비교하세요.',
    steps:(v,m)=>[T`대입하면 $A${xy(m.A)},\ B${xy(m.B)}$예요.`,'높이가 같으므로 AB:AC=2:5예요.',T`$AC=${F(m.A.y-m.B.y)}\times\frac52=${F(m.A.y-m.C.y)}$예요.`,T`$c=${F(m.C.y)}/${F(v.x)}=${F(m.c)}$예요.`],
    follow:(v,m)=>['A와 B의 y좌표는 각 그래프에서 읽어요.','원점에서 공통 수직선까지의 높이가 같아요.',T`C의 y좌표는 $${F(m.A.y)}-${F(m.A.y-m.C.y)}=${F(m.C.y)}$예요.`,'C를 정비례 식에 대입해 다시 확인해요.'],
    answer:(v,m)=>T`$C${xy(m.C)}$, $c=${F(m.c)}$`,draw:(b,v,m,c)=>{M.inverse(b,v.k);M.line(b,-.5,0,{color:'rose'});M.line(b,m.c,0,{color:'muted'});M.polygon(b,[O,m.A,m.C],{fill:'sky',color:'sky'});M.polygon(b,[O,m.A,m.B],{fill:'green',color:'green'});[['A',m.A],['B',m.B],['C',m.C]].forEach(([name,q])=>M.point(b,q,name));if(c.step>=2)b.seg(O,P(v.x,0),{color:'amber',width:3});if(c.step>=3)b.seg(m.A,m.C,{color:'rose',width:4});},
    verify:(v,m)=>[!close(m.small/m.large,2/5)&&'넓이비 오류',!close(m.A.x*m.A.y,v.k)&&'A 곡선 불일치',!close(m.B.y,-m.B.x/2)&&'B 직선 불일치',!close(m.C.y,m.c*m.C.x)&&'C 직선 불일치'].filter(Boolean)
  }));
  prop.push(make({
    id:'horizontal-division',tier:'advanced',title:'수평선과 두 정비례 그래프',types:['B22'],vars:{height:V('x축 아래 거리',5,2,6),p:V('첫 직선 상수의 분자',5,3,6),ratio:V('AK:KB의 앞 수',3,1,4)},
    model:v=>{const a=v.p/6,y=-v.height,A=P(y/a,y),B=P(-2*y,y),K=P(y/a+(-2*y-y/a)*v.ratio/(v.ratio+1),y);return {a,A,B,K,H:P(K.x,0),length:B.x-A.x};},
    focus:(v,m)=>M.box([m.A,m.B,m.H],{minSpan:12,pad:2}),question:(v,m)=>T`$${lin(m.a)}$, $y=-x/2$가 $y=-${F(v.height)}$와 만나는 점을 A,B라 합니다. 선분 AB 위에서 AK:KB=${F(v.ratio)}:1인 점 K에서 x축에 내린 수선의 발 H를 구하세요.`,
    guide:'수평선의 높이나 비를 바꾸고 가로 길이를 같은 칸으로 나누어 점 K를 찾으세요.',
    steps:(v,m)=>[T`대입하면 $A${xy(m.A)},\ B${xy(m.B)}$예요.`,T`$AB=${F(m.B.x)}-(${F(m.A.x)})=${F(m.length)}$예요.`,T`$AK=${F(m.length)}\times\frac{${v.ratio}}{${v.ratio+1}}=${F(m.K.x-m.A.x)}$예요.`,T`같은 x좌표의 수선발은 $H${xy(m.H)}$예요.`],
    follow:(v,m)=>[T`두 식에서 $y=-${F(v.height)}$로 놓았어요.`,'수평선분의 길이는 x좌표의 차예요.',T`K의 x좌표는 $${F(m.A.x)}+${F(m.K.x-m.A.x)}=${F(m.K.x)}$예요.`,'x축 위에서는 y좌표가 0이에요.'],
    answer:(v,m)=>T`$H${xy(m.H)}$`,draw:(b,v,m,c)=>{M.line(b,m.a,0);M.line(b,-.5,0,{color:'rose'});b.hline(-v.height,muted);b.seg(m.A,m.B,{color:'sky',width:3});M.point(b,m.A,'A');M.point(b,m.B,'B');if(c.step>=2){for(let i=1;i<=v.ratio;i++)M.point(b,P(m.A.x+m.length*i/(v.ratio+1),-v.height),'',{color:'muted',r:3});M.point(b,m.K,'K',{color:'amber'});}if(c.step>=3)b.seg(m.K,m.H,{color:'amber',dash:[5,4]});if(c.solved)M.point(b,m.H,'H',{color:'green'});},
    verify:(v,m)=>[!close(m.A.y,m.a*m.A.x)&&'A 교점 오류',!close(m.B.y,-m.B.x/2)&&'B 교점 오류',!close((m.K.x-m.A.x)/(m.B.x-m.K.x),v.ratio)&&'선분비 오류',m.H.y!==0||m.H.x!==m.K.x?'수선발 오류':false].filter(Boolean)
  }));
  M.register({id:'g7-proportion',title:'정비례와 반비례',course:'g7',courseName:'중1',unit:'정비례와 반비례',description:'비와 곱의 일정함에서 좌표·넓이·조건 추론으로 이어집니다.',scenes:prop});
})();
