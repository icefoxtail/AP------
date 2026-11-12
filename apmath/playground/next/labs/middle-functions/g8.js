/* Grade 8: Archive-derived linear-function investigations. Original exam data remains untouched. */
(function () {
  'use strict';
  const M = window.APL_MF;
  const SOURCES = {
  "mapping": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q1@1",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q7@7",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q9@9"
  ],
  "linear-definition": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q3@3",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q10@10",
    "archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js#q11@11"
  ],
  "value": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q2@2",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q2@2",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q10@10"
  ],
  "slope": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q5@5",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q7@7",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q3@3"
  ],
  "intercepts": [
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q12@12",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q23@23",
    "archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js#q13@13"
  ],
  "quadrants": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q10@10",
    "archive/exams/original/middle/m2/1final/25_왕운중_1학기_기말_중2_수학.js#q18@18",
    "archive/exams/original/middle/m2/1final/25_왕의중_1학기_기말_중2_기출.js#q16@16"
  ],
  "quadrant-parameters": [
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q15@15",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q14@14",
    "archive/exams/original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js#q20@20"
  ],
  "translation": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q4@4",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q13@13",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q11@11"
  ],
  "two-points": [
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q14@14",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q15@15",
    "archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js#q15@15"
  ],
  "slope-point": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q8@8",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q9@9",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q15@15"
  ],
  "point-membership": [
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q3@3",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q2@2",
    "archive/exams/original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js#q5@5"
  ],
  "equation-graph": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q6@6",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q12@12",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q14@14"
  ],
  "axis-parallel": [
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q6@6",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q19@19",
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q4@4"
  ],
  "intersection": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q16@16",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q17@17",
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q19@19"
  ],
  "positions": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q21@21",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q8@8",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q20@20"
  ],
  "concurrency": [
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q19@19",
    "archive/exams/original/middle/m2/1final/24_삼산중_1학기_기말_중2_기출.js#q23@23",
    "archive/exams/original/middle/m2/2final/23_금당중_2학기_기말_중2_기출.js#q10@10"
  ],
  "no-triangle": [
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q24@24",
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q19@19",
    "archive/exams/original/middle/m2/2mid/25_연향중_2학기_중간_중2_수학.js#q21@21"
  ],
  "axes-area": [
    "archive/exams/original/middle/m2/1final/25_왕의중_1학기_기말_중2_기출.js#q21@21",
    "archive/exams/original/middle/m2/1final/24_삼산중_1학기_기말_중2_기출.js#q8@8",
    "archive/exams/original/middle/m2/1final/22_향림중_1학기_기말_중2_수학.js#q17@17"
  ],
  "multi-area": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q24@24",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q18@18",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q23@23"
  ],
  "rectangle-bisect": [
    "archive/exams/original/middle/m2/1final/24_왕운중_1학기_기말_중2_기출.js#q20@20",
    "archive/exams/original/middle/m2/1final/23_연향중_1학기_기말_중2_기출.js#q12@12",
    "archive/exams/original/middle/m2/2final/23_금당중_2학기_기말_중2_기출.js#q8@8"
  ],
  "triangle-ratio": [
    "archive/exams/original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js#q19@19",
    "archive/exams/original/middle/m2/1final/24_승평중_1학기_기말_중2_기출.js#q20@20",
    "archive/exams/original/middle/m2/1final/21_왕운중_1학기_기말_중2_수학.js#q17@17"
  ],
  "slope-range": [
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q19@19",
    "archive/exams/original/middle/m2/1final/25_왕의중_1학기_기말_중2_기출.js#q17@17",
    "archive/exams/original/middle/m2/1final/24_왕운중_1학기_기말_중2_기출.js#q20@20"
  ],
  "moving-area": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q11@11",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q16@16",
    "archive/exams/original/middle/m2/1mid/26_왕의중_1학기_중간_중2_수학.js#q24@24"
  ],
  "rate": [
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q15@15",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q16@16",
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q23@23"
  ],
  "fit-data": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q22@22",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q22@22",
    "archive/exams/original/middle/m2/2mid/21_향림중_2학기_중간_중2_수학.js#q25@25"
  ],
  "motion": [
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q20@20",
    "archive/exams/original/middle/m2/1final/24_승평중_1학기_기말_중2_기출.js#q6@6",
    "archive/exams/original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js#q23@23"
  ],
  "pattern": [
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q8@8",
    "archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q9@9",
    "archive/exams/original/middle/m2/1final/24_연향중_1학기_기말_중2_기출.js#q6@6"
  ],
  "lattice": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q13@13",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q1@1",
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q1@1"
  ],
  "pythagoras": [
    "archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#q21@21",
    "archive/exams/original/middle/m2/2final/22_연향중_2학기_기말_중2_기출.js#q11@11"
  ],
  "rotation": [
    "archive/exams/original/middle/m2/1final/21_신흥중_1학기_기말_중2_수학.js#q24@24",
    "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js#q11@11",
    "archive/exams/original/middle/m2/2final/20_신흥중_2학기_기말_중2_기출.js#q5@5"
  ],
  "probability": [
    "archive/exams/original/middle/m2/2mid/25_삼산중_2학기_중간_중2_수학.js#q23@23",
    "archive/exams/original/middle/m2/2final/24_왕운중_2학기_기말_중2_수학.js#q17@17",
    "archive/exams/original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js#q19@19"
  ],
  "misread": [
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q23@23",
    "archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q22@22"
  ],
  "cost": [
    "archive/exams/original/middle/m2/1mid/26_동산중_1학기_중간_중2_기출.js#q24@24",
    "archive/exams/original/middle/m2/1mid/25_삼산중_1학기_중간_중2_수학.js#q23@23",
    "archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js#q18@18"
  ],
  "system-parameters": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q18@18",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q11@11",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q16@16"
  ],
  "system-model": [
    "archive/exams/original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js#q23@23",
    "archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q17@17",
    "archive/exams/original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js#q22@22"
  ],
  "coordinate-walk": [
    "archive/exams/original/middle/m2/2final/21_매산중_2학기_기말_중2_수학.js#q23@23"
  ],
  "travel-budget": [
    "archive/exams/original/middle/m2/1mid/26_왕운중_1학기_중간_중2_기출.js#q24@24",
    "archive/exams/original/middle/m2/1mid/26_왕의중_1학기_중간_중2_수학.js#q19@19",
    "archive/exams/original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js#q20@20"
  ]
};
  const { p, f, n } = M;
  const O = p(0, 0), scenes = [];
  const V = (label, value, min, max, step = 1) => ({ label, value, min, max, step });
  const xy = P => `(${f(P.x)},${f(P.y)})`;
  const eq = (a, b) => {
    const t = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '-x' : `${f(a)}x`;
    return t + (b > 0 ? `${t ? '+' : ''}${f(b)}` : b < 0 ? f(b) : t ? '' : '0');
  };
  const givenLine = (a, b) => `$y=${eq(a,b)}$`;
  const near = (a, b) => Math.abs(a-b) < 1e-8;
  function through(b, A, B, opts = {}) {
    if (near(A.x,B.x)) b.vline(A.x, { color:'sky', width:3, ...opts });
    else M.line(b, (B.y-A.y)/(B.x-A.x), A.y-(B.y-A.y)/(B.x-A.x)*A.x, opts);
  }
  function point(b, P, name, color='sky') { M.point(b,P,name,{color}); }
  function pts(b, pairs) { pairs.forEach(([P,name,color])=>point(b,P,name,color)); }
  function expression(A,B) { return near(A.x,B.x) ? `x=${f(A.x)}` : `y=${eq((B.y-A.y)/(B.x-A.x),A.y-(B.y-A.y)/(B.x-A.x)*A.x)}`; }
  const empty = () => [];
  function add(type, spec) {
    const types = Array.isArray(type) ? type : [type];
    const scene = {
      tier:'basic', finalStep:4,
      guide:'슬라이더나 표시된 점을 움직여 조건과 그래프를 함께 비교하세요. 해설 재생 한 번으로 풀이 전체를 볼 수 있어요.',
      readouts:empty, chips:empty,
      source:{kind:'archive-adapted',types:types.map(t=>'M2F-'+t),refs:[...new Set(types.flatMap(t=>SOURCES[t]||[]))],label:'Archive 기출 유형 재구성'},
      ...spec
    };
    scene.lesson = (v,m) => {
      const voice = typeof scene.voice === 'function' ? scene.voice(v,m) : (scene.voice || ['조건을 그래프에서 확인해요.','각 수가 무엇을 뜻하는지 살펴봐요.','보조선으로 관계를 연결해요.','그림의 관계를 식으로 나타내요.','계산한 결과를 그래프에 대입해요.','마지막으로 조건과 답을 확인해요.']);
      return {title:scene.title,tab:'review',answer:scene.answer(v,m),answerText:scene.answer(v,m),summary:'조건을 그림에 옮기고 식과 연결합니다.',task:'수치를 바꾸고 같은 원리가 유지되는지 확인하세요.',chapters:[
        {title:'조건을 그림에',length:10,cues:[{at:0,step:1,say:voice[0]},{at:5,say:voice[1]}]},
        {title:'관계를 식으로',length:10,cues:[{at:0,step:2,say:voice[2]},{at:5,step:3,say:voice[3]}]},
        {title:'풀이와 확인',length:10,cues:[{at:0,say:voice[4]},{at:5,step:4,say:voice[5]}]}
      ]};
    };
    scenes.push(scene);
  }
  function quadrants(a,b) { return b===0 ? (a>0?[1,3]:[2,4]) : a>0 ? (b>0?[1,2,3]:[1,3,4]) : (b>0?[1,2,4]:[2,3,4]); }
  function area(poly) { let a=0; for(let i=0;i<poly.length;i++){const P=poly[i],Q=poly[(i+1)%poly.length];a+=P.x*Q.y-Q.x*P.y;}return Math.abs(a)/2; }
  // Polygon clipping is a drawing calculation only. Student explanations use triangles and symmetry.
  function clip(poly,a,b,side=1) {
    const out=[];const value=P=>side*(P.y-a*P.x-b);
    for(let i=0;i<poly.length;i++){
      const P=poly[i],Q=poly[(i+1)%poly.length],u=value(P),w=value(Q);
      if(u>=-1e-10)out.push(P);
      if((u<0&&w>0)||(u>0&&w<0)){const t=u/(u-w);out.push(p(P.x+t*(Q.x-P.x),P.y+t*(Q.y-P.y)));}
    }return out;
  }

  add('mapping',{
    id:'function-mapping',tier:'concept',title:'한 입력에 한 출력',
    vars:{x:V('살펴볼 입력 x',2,1,5)},state:{mode:0},
    presets:[{label:'출력이 하나',values:{mode:0}},{label:'출력이 둘',values:{mode:1}}],
    model:v=>({outputs:v.mode?[v.x+2,-v.x-2]:[v.x+2],isFunction:v.mode===0}),
    focus:{x:[-1,7],y:[-9,9]},
    question:()=>'$x$는 1부터 5까지의 자연수예요. 표시된 대응에서 $y$가 $x$의 함수인지 확인해 보세요.',
    guide:'입력 x를 바꾸면 같은 세로선 위의 출력이 강조돼요. 출력이 하나인 대응과 둘인 대응을 비교하세요.',
    steps:(v,m)=>['함수에서는 정해진 입력 하나에 출력이 하나씩 대응합니다.',`입력 $x=${v.x}$에서 세로선을 그립니다.`,`이 입력에 대응하는 출력은 $${m.outputs.map(f).join(', ')}$입니다.`,m.isFunction?'모든 입력에 출력이 하나씩 있으므로 함수입니다.':'한 입력에 서로 다른 두 출력이 있으므로 함수가 아닙니다.'],
    answer:(v,m)=>m.isFunction?'$y=x+2$는 주어진 입력 범위에서 함수입니다.':'한 입력에 출력이 둘이므로 함수가 아닙니다.',
    draw:(b,v,m,c)=>{for(let x=1;x<=5;x++){point(b,p(x,x+2),'',x===v.x?'amber':'sky');if(v.mode)point(b,p(x,-x-2),'',x===v.x?'amber':'rose');}if(c.step>=1)b.vline(v.x,{color:'amber',dash:[5,4]});m.outputs.forEach(y=>M.projection(b,p(v.x,y),{color:'amber'}));},
    voice:['함수는 입력과 출력의 약속이에요.','입력 하나를 골라 보세요.','같은 세로선 위의 점을 살펴봐요.','그 입력에 출력이 몇 개인가요?','다른 입력에서도 같은 기준을 적용해요.','출력이 하나씩인지 확인했어요.']
  });
  add('linear-definition',{
    id:'linear-or-not',tier:'concept',title:'일차함수인가요?',
    vars:{x:V('관찰할 x',2,1,4)},state:{mode:0},
    presets:[{label:'2x+1',values:{mode:0}},{label:'상수 3',values:{mode:1}},{label:'반비례 6/x',values:{mode:2}},{label:'전개하면?',values:{mode:3}}],
    model:v=>({form:['2x+1','3','\\frac{6}{x}','(x+1)^2-x^2'][v.mode],y:v.mode===1?3:v.mode===2?6/v.x:2*v.x+1,linear:v.mode===0||v.mode===3}),
    focus:{x:[-5,5],y:[-10,11]},
    question:(v,m)=>`$y=${m.form}$을 정리한 뒤 일차함수인지 판단해 보세요.`,
    steps:(v,m)=>[`일차함수는 $y=ax+b$에서 $a\\ne0$인 함수입니다.`,v.mode===3?'식을 전개하면 $x^2+2x+1-x^2=2x+1$입니다.':`주어진 식은 $y=${m.form}$입니다.`,v.mode===1?'상수함수의 기울기는 0입니다.':v.mode===2?'입력 x가 분모에 있어 변화량의 비가 일정하지 않습니다.':'x의 계수는 2이고 상수항은 1입니다.',m.linear?'정리한 식은 기울기 2의 일차함수입니다.':'함수이지만 일차함수는 아닙니다.'],
    answer:(v,m)=>m.linear?'$y=2x+1$: 일차함수입니다.':v.mode===1?'$y=3$: 상수함수이며 일차함수는 아닙니다.':'$y=6/x$: 반비례 함수이며 일차함수는 아닙니다.',
    draw:(b,v,m,c)=>{if(v.mode===2)M.inverse(b,6);else M.line(b,v.mode===1?0:2,v.mode===1?3:1);point(b,p(v.x,m.y),'P','amber');M.projection(b,p(v.x,m.y));if(c.step>=2&&m.linear)M.riseRun(b,p(0,1),p(1,3),{dxLabel:'1',dyLabel:'2'});},
    verify:(v,m)=>m.linear?[near(m.y,2*v.x+1)?null:'linear value'].filter(Boolean):[]
  });
  add('value',{
    id:'function-value',title:'함숫값은 점의 높이',
    vars:{a:V('기울기 a',2,-3,3),b:V('y절편 b',1,-4,4),x:V('입력 x',2,-4,4)},
    model:v=>({P:p(v.x,v.a*v.x+v.b)}),focus:(v,m)=>M.box([m.P,p(0,v.b)],{pad:2}),
    question:v=>`$f(x)=${eq(v.a,v.b)}$일 때 $f(${f(v.x)})$의 값을 구하세요.`,
    steps:(v,m)=>[`입력값은 $x=${f(v.x)}$입니다.`,`식의 x 자리에 ${f(v.x)}을 대입합니다.`,`$f(${f(v.x)})=${f(v.a)}\\times(${f(v.x)})${v.b>=0?'+':''}${f(v.b)}=${f(m.P.y)}$입니다.`,`그래프 위의 점 $${xy(m.P)}$에서 y좌표가 함숫값입니다.`],
    answer:(v,m)=>`$f(${f(v.x)})=${f(m.P.y)}$`,
    draw:(b,v,m,c)=>{M.line(b,v.a,v.b);point(b,m.P,'P','amber');M.projection(b,m.P);M.drag(b,c,'input',p(v.x,0),{x:'x'});if(c.solved)M.label(b,m.P,`f(${n(v.x)})=${n(m.P.y)}`,{dy:-22});},
    verify:(v,m)=>[near(m.P.y-v.a*m.P.x,v.b)?null:'point does not satisfy function'].filter(Boolean)
  });
  add('slope',{
    id:'slope-change',tier:'concept',title:'가로 변화와 세로 변화',
    vars:{dx:V('x의 증가량',4,1,6),dy:V('y의 증가량',3,-6,6)},
    model:v=>{const A=p(-3,-2),B=p(-3+v.dx,-2+v.dy),a=v.dy/v.dx;return{A,B,a,b:A.y-a*A.x};},
    focus:(v,m)=>M.box([m.A,m.B],{pad:2}),
    question:()=>'두 점 사이의 가로·세로 변화량으로 직선의 기울기를 구해 보세요.',
    steps:(v,m)=>[`A에서 B까지 x는 $${v.dx}$만큼 증가합니다.`,`같은 동안 y는 $${v.dy}$만큼 변합니다.`,`기울기 $=\\frac{y의 증가량}{x의 증가량}=${M.frac(v.dy,v.dx)}$입니다.`,v.dy>0?'기울기가 양수이므로 오른쪽으로 갈수록 올라갑니다.':v.dy<0?'기울기가 음수이므로 오른쪽으로 갈수록 내려갑니다.':'기울기가 0이므로 수평선입니다.'],
    answer:(v,m)=>`기울기 $a=${f(m.a)}$`,
    draw:(b,v,m,c)=>{M.line(b,m.a,m.b);pts(b,[[m.A,'A'],[m.B,'B','amber']]);M.riseRun(b,m.A,m.B,{dxLabel:`Δx=${v.dx}`,dyLabel:`Δy=${v.dy}`});b.handle('g8-slope-B',m.B,{color:'amber',drag:q=>c.set({dx:q.x-m.A.x,dy:q.y-m.A.y})});},
    verify:(v,m)=>[near((m.B.y-m.A.y),m.a*(m.B.x-m.A.x))?null:'rise/run'].filter(Boolean),
    voice:['두 점을 잇는 직선을 봐요.','오른쪽 점을 움직일 수 있어요.','가로 변화량을 먼저 읽어요.','세로 변화량을 가로 변화량으로 나눠요.','변화량의 부호도 함께 확인해요.','이 비가 직선의 기울기예요.']
  });
  add('intercepts',{
    id:'intercepts',title:'절편과 점의 좌표',
    vars:{mag:V('기울기의 크기',2,1,4),b:V('y절편',4,-6,6)},state:{sign:-1},
    presets:[{label:'내려가는 직선',values:{sign:-1}},{label:'올라가는 직선',values:{sign:1}}],
    model:v=>{const a=v.sign*v.mag;return{a,A:p(-v.b/a,0),B:p(0,v.b)};},focus:(v,m)=>M.box([m.A,m.B],{pad:2}),
    question:(v,m)=>`$y=${eq(m.a,v.b)}$의 x절편과 y절편을 각각 구하세요.`,
    steps:(v,m)=>['x축 위에서는 y좌표가 0입니다.',`$0=${eq(m.a,v.b)}$이므로 x절편은 $${f(m.A.x)}$입니다.`,'y축 위에서는 x좌표가 0입니다.',`y절편은 $${f(v.b)}$이고 두 절편점은 $${xy(m.A)},${xy(m.B)}$입니다.`],
    answer:(v,m)=>`x절편 $${f(m.A.x)}$, y절편 $${f(v.b)}$`,
    draw:(b,v,m,c)=>{M.line(b,m.a,v.b);pts(b,[[m.A,'A','amber'],[m.B,'B','rose']]);if(c.step>=2){b.seg(O,m.A,{color:'amber',width:4});b.seg(O,m.B,{color:'rose',width:4});}if(c.solved){M.label(b,m.A,`(${n(m.A.x)},${n(m.A.y)})`,{dy:22});}},
    verify:(v,m)=>[near(m.a*m.A.x+v.b,0)?null:'x intercept',m.B.x===0&&m.B.y===v.b?null:'y intercept'].filter(Boolean)
  });
  add('quadrants',{
    id:'signs-quadrants',tier:'concept',title:'부호와 사분면',
    vars:{mag:V('기울기의 크기',1,1,3),b:V('y절편 b',2,-4,4)},state:{sign:1},
    presets:[{label:'양의 기울기',values:{sign:1}},{label:'음의 기울기',values:{sign:-1}},{label:'원점을 지남',values:{b:0}}],
    model:v=>{const a=v.sign*v.mag;return{a,quadrants:quadrants(a,v.b),A:p(-v.b/a,0),B:p(0,v.b)};},
    focus:{x:[-7,7],y:[-7,7]},question:(v,m)=>`$y=${eq(m.a,v.b)}$의 그래프가 지나는 사분면을 찾아보세요.`,
    steps:(v,m)=>[`기울기 $${f(m.a)}$의 부호로 직선이 올라가는지 내려가는지 봅니다.`,`y절편 $${v.b}$의 위치를 표시합니다.`,`x절편은 $${f(m.A.x)}$입니다. 두 절편을 지나 직선을 양쪽으로 늘립니다.`,`직선이 지나는 사분면은 제${m.quadrants.join(', 제')}사분면입니다.`],
    answer:(v,m)=>`제${m.quadrants.join(', 제')}사분면`,
    draw:(b,v,m,c)=>{[['Ⅰ',4,4],['Ⅱ',-4,4],['Ⅲ',-4,-4],['Ⅳ',4,-4]].forEach(([q,x,y])=>M.label(b,p(x,y),q,{color:'muted',size:20}));M.line(b,m.a,v.b);pts(b,[[m.A,'A','amber'],[m.B,'B','rose']]);},
    notes:()=>['축 위의 점은 어느 사분면에도 속하지 않습니다.']
  });
  add('quadrant-parameters',{
    id:'quadrant-parameters',tier:'advanced',title:'계수 조건을 부호로',
    vars:{a:V('양수 a',3,1,5),b:V('음수 b',-2,-5,-1)},
    model:v=>({slope:v.a*v.b,intercept:v.a+v.b,quadrants:quadrants(v.a*v.b,v.a+v.b)}),focus:{x:[-5,5],y:[-10,10]},
    question:()=>'$a>0$, $b<0$일 때 $y=abx+(a+b)$를 살펴보세요. a와 b의 현재 값에서 지나는 사분면을 구하세요.',
    steps:(v,m)=>[`$a=${v.a}>0$, $b=${v.b}<0$이므로 $ab=${m.slope}<0$입니다.`,`y절편은 $a+b=${m.intercept}$입니다.`,`$a$와 $-b$의 크기를 비교하면 y절편이 ${m.intercept>0?'양수':m.intercept<0?'음수':'0'}임을 알 수 있습니다.`,`따라서 제${m.quadrants.join(', 제')}사분면을 지납니다.`],
    answer:(v,m)=>`$y=${eq(m.slope,m.intercept)}$: 제${m.quadrants.join(', 제')}사분면`,
    draw:(b,v,m,c)=>{M.line(b,m.slope,m.intercept);point(b,p(0,m.intercept),'B','rose');if(c.step>=2)M.riseRun(b,p(0,m.intercept),p(Math.min(1,4/Math.abs(m.slope)),m.intercept-Math.min(Math.abs(m.slope),4)));},
    notes:()=>['a>0, b<0만으로 a+b의 부호는 정해지지 않습니다. 경계 a=-b를 직접 확인하세요.']
  });
  add('translation',{
    id:'vertical-translation',title:'기울기는 그대로 평행이동',
    vars:{a:V('기울기 a',1,1,3),b:V('처음 y절편',1,-3,3),k:V('위아래 이동량',3,-5,5)},
    model:v=>({shifted:v.b+v.k,P:p(1,v.a+v.b),Q:p(1,v.a+v.b+v.k)}),focus:(v,m)=>M.box([p(0,v.b),p(0,m.shifted),m.P,m.Q],{pad:2}),
    question:v=>`$y=${eq(v.a,v.b)}$를 y축 방향으로 $${f(v.k)}$만큼 평행이동한 식을 구하세요.`,
    steps:(v,m)=>[`처음 기울기는 $${v.a}$, y절편은 $${v.b}$입니다.`,`같은 x에서 y값에 이동량 $${f(v.k)}$을 더합니다.`,`$y=${eq(v.a,v.b)}${v.k>=0?'+':''}${f(v.k)}$입니다.`,`정리하면 $y=${eq(v.a,m.shifted)}$이며 기울기는 그대로입니다.`],
    answer:(v,m)=>givenLine(v.a,m.shifted),
    draw:(b,v,m,c)=>{M.line(b,v.a,v.b,{color:'muted',dash:[5,4]});M.line(b,v.a,m.shifted);pts(b,[[m.P,'P','muted'],[m.Q,'Q','amber']]);if(c.step>=1){b.seg(m.P,m.Q,{color:'amber',width:3});M.label(b,p(1,(m.P.y+m.Q.y)/2),`이동 ${n(v.k)}`,{dx:35});}},
    verify:(v,m)=>[near(m.Q.y-m.P.y,v.k)?null:'translation distance'].filter(Boolean)
  });
  add('two-points',{
    id:'two-points',title:'두 점으로 직선의 식',
    vars:{x1:V('A의 x좌표',-1,-4,-1),y1:V('A의 y좌표',4,-5,5),x2:V('B의 x좌표',3,1,4),y2:V('B의 y좌표',-4,-5,5)},
    model:v=>{const A=p(v.x1,v.y1),B=p(v.x2,v.y2),a=(v.y2-v.y1)/(v.x2-v.x1);return{A,B,a,b:v.y1-a*v.x1};},focus:(v,m)=>M.box([m.A,m.B,p(0,m.b)],{pad:2}),
    question:(v,m)=>`두 점 $A${xy(m.A)}$, $B${xy(m.B)}$를 지나는 직선의 식을 구하세요.`,
    steps:(v,m)=>[`가로 변화량은 $${v.x2}-${f(v.x1)}=${v.x2-v.x1}$입니다.`,`기울기 $a=\\frac{${f(v.y2)}-(${f(v.y1)})}{${v.x2}-(${f(v.x1)})}=${f(m.a)}$입니다.`,`A를 $y=ax+b$에 대입하면 $b=${f(m.b)}$입니다.`,`$y=${eq(m.a,m.b)}$에 A와 B를 각각 대입해 확인합니다.`],
    answer:(v,m)=>givenLine(m.a,m.b),
    draw:(b,v,m,c)=>{M.line(b,m.a,m.b);pts(b,[[m.A,'A','amber'],[m.B,'B','rose']]);M.drag(b,c,'A',m.A,{x:'x1',y:'y1'});M.drag(b,c,'B',m.B,{x:'x2',y:'y2',color:'rose'});if(c.step>=2)M.riseRun(b,m.A,m.B,{dxLabel:`Δx=${n(v.x2-v.x1)}`,dyLabel:`Δy=${n(v.y2-v.y1)}`});},
    verify:(v,m)=>[near(m.a*m.A.x+m.b,m.A.y)?null:'A off line',near(m.a*m.B.x+m.b,m.B.y)?null:'B off line'].filter(Boolean),
    voice:['주어진 두 점을 표시해요.','두 점을 연결한 직선을 살펴봐요.','가로와 세로 변화량을 비교해요.','변화량의 비로 기울기를 구해요.','한 점을 대입해 절편을 정해요.','두 점이 모두 식을 만족하는지 확인해요.']
  });
  add('slope-point',{
    id:'slope-and-point',title:'같은 기울기와 한 점',
    vars:{mag:V('기울기의 크기',2,1,3),x:V('점 P의 x',2,-4,4),y:V('점 P의 y',-1,-5,5)},state:{sign:1},
    presets:[{label:'양의 기울기',values:{sign:1}},{label:'음의 기울기',values:{sign:-1}}],
    model:v=>{const a=v.sign*v.mag,P=p(v.x,v.y);return{a,P,b:v.y-a*v.x};},focus:(v,m)=>M.box([m.P,p(m.P.x+1,m.P.y+m.a),p(0,m.b),p(0,-3)],{pad:2}),
    question:(v,m)=>`$y=${eq(m.a,-3)}$과 기울기가 같고 점 $P${xy(m.P)}$를 지나는 직선의 식을 구하세요.`,
    steps:(v,m)=>[`두 직선의 기울기가 같으므로 $a=${f(m.a)}$입니다.`,`찾는 식을 $y=${eq(m.a,0)}+b$로 놓습니다.`,`P를 대입하면 $${f(v.y)}=${f(m.a)}\\times(${f(v.x)})+b$이므로 $b=${f(m.b)}$입니다.`,`따라서 $y=${eq(m.a,m.b)}$입니다.`],
    answer:(v,m)=>givenLine(m.a,m.b),
    draw:(b,v,m,c)=>{M.line(b,m.a,-3,{color:'muted',dash:[5,4]});M.line(b,m.a,m.b);point(b,m.P,'P','amber');M.drag(b,c,'P',m.P,{x:'x',y:'y'});if(c.step>=2)M.riseRun(b,m.P,p(m.P.x+1,m.P.y+m.a));},
    verify:(v,m)=>[near(m.a*v.x+m.b,v.y)?null:'given point'].filter(Boolean)
  });
  add('point-membership',{
    id:'point-membership',title:'점이 그래프 위에 있을까?',
    vars:{b:V('직선의 y절편',1,-3,3),x:V('P의 x좌표',2,-4,4),y:V('P의 y좌표',5,-6,8)},
    model:v=>({P:p(v.x,v.y),expected:2*v.x+v.b,on:near(v.y,2*v.x+v.b)}),focus:(v,m)=>M.box([m.P,p(v.x,m.expected),p(0,v.b)],{pad:2}),
    question:(v,m)=>`점 $P${xy(m.P)}$는 $y=${eq(2,v.b)}$의 그래프 위에 있나요?`,
    steps:(v,m)=>[`P의 x좌표 $${f(v.x)}$를 식에 대입합니다.`,`그래프의 y좌표는 $2\\times(${f(v.x)})${v.b>=0?'+':''}${v.b}=${f(m.expected)}$입니다.`,`P의 y좌표 $${f(v.y)}$와 비교합니다.`,m.on?'두 값이 같으므로 P는 그래프 위에 있습니다.':'두 값이 다르므로 P는 그래프 위에 없습니다.'],
    answer:(v,m)=>m.on?'P는 그래프 위에 있습니다.':`P는 그래프 밖에 있습니다. 같은 x의 그래프 높이는 $${f(m.expected)}$입니다.`,
    draw:(b,v,m,c)=>{M.line(b,2,v.b);point(b,m.P,'P','amber');M.drag(b,c,'P',m.P,{x:'x',y:'y'});if(c.step>=2){point(b,p(v.x,m.expected),'Q','rose');b.seg(m.P,p(v.x,m.expected),{color:'rose',dash:[4,3]});}},
    verify:(v,m)=>[m.on===near(v.y-2*v.x,v.b)?null:'membership'].filter(Boolean)
  });
  add('equation-graph',{
    id:'equation-graph',tier:'concept',title:'방정식의 해가 만드는 직선',
    vars:{A:V('x의 계수',2,-4,4),B:V('y의 계수',3,1,4),C:V('우변의 수',6,-8,8),x:V('관찰할 x',1,-4,4)},
    model:v=>({a:-v.A/v.B,b:v.C/v.B,P:p(v.x,(v.C-v.A*v.x)/v.B),samples:[v.x-1,v.x,v.x+1].map(x=>p(x,(v.C-v.A*x)/v.B))}),focus:(v,m)=>M.box([...m.samples,p(0,m.b)],{pad:2}),
    question:v=>`일차방정식 $${f(v.A)}x+${v.B}y=${f(v.C)}$의 해를 점으로 표시하면 어떤 그래프가 될까요?`,
    steps:(v,m)=>[`x를 이항하면 $${v.B}y=${eq(-v.A,v.C)}$입니다.`,`양변을 ${v.B}로 나누면 $y=${eq(m.a,m.b)}$입니다.`,`$x=${f(v.x)}$의 해는 점 $${xy(m.P)}$로 표시됩니다.`,'식의 모든 해가 같은 직선 위의 점으로 모입니다.'],
    answer:(v,m)=>givenLine(m.a,m.b),
    draw:(b,v,m,c)=>{M.line(b,m.a,m.b);for(const P of m.samples)point(b,P,'','muted');point(b,m.P,'P','amber');M.projection(b,m.P);M.drag(b,c,'input',p(v.x,0),{x:'x'});},
    verify:(v,m)=>[near(v.A*m.P.x+v.B*m.P.y,v.C)?null:'equation residual'].filter(Boolean)
  });
  add('axis-parallel',{
    id:'axis-parallel',title:'x가 일정할 때와 y가 일정할 때',
    vars:{k:V('일정한 x값',3,-5,5),h:V('일정한 y값',2,-5,5)},
    model:v=>({P:p(v.k,v.h)}),focus:{x:[-7,7],y:[-7,7]},
    question:v=>`$x=${f(v.k)}$, $y=${f(v.h)}$의 그래프를 비교하고 두 직선의 교점을 구하세요.`,
    steps:(v,m)=>[`$x=${f(v.k)}$는 모든 점의 x좌표가 같은 세로 직선입니다.`,`$y=${f(v.h)}$는 모든 점의 y좌표가 같은 가로 직선입니다.`,'두 조건을 동시에 만족하는 점이 교점입니다.',`교점은 $${xy(m.P)}$입니다.`],
    answer:(v,m)=>`교점 $${xy(m.P)}$`,
    draw:(b,v,m,c)=>{b.vline(v.k,{color:'sky',width:3});b.hline(v.h,{color:'rose',width:3});for(let t=-4;t<=4;t+=2){point(b,p(v.k,t),'','sky');point(b,p(t,v.h),'','rose');}if(c.step>=2)point(b,m.P,'P','amber');M.drag(b,c,'P',m.P,{x:'k',y:'h'});},
    notes:()=>['x=k는 y가 x의 함수가 아닙니다. y=k는 상수함수이며 일차함수는 아닙니다.']
  });
  add('intersection',{
    id:'intersection',title:'연립방정식의 해와 교점',
    vars:{a:V('첫 직선의 기울기',2,1,3),b:V('첫 직선의 y절편',-1,-4,4),c:V('둘째 직선의 기울기',-1,-3,-1),d:V('둘째 직선의 y절편',5,-4,6)},
    model:v=>{const x=(v.d-v.b)/(v.a-v.c);return{P:p(x,v.a*x+v.b)};},focus:(v,m)=>M.box([m.P,p(0,v.b),p(0,v.d)],{pad:2}),
    question:v=>`두 직선 $y=${eq(v.a,v.b)}$, $y=${eq(v.c,v.d)}$의 교점 좌표를 구하세요.`,
    steps:(v,m)=>['교점에서는 두 식의 x값과 y값이 모두 같습니다.',`$${eq(v.a,v.b)}=${eq(v.c,v.d)}$에서 $x=${f(m.P.x)}$입니다.`,`x를 한 식에 대입하면 $y=${f(m.P.y)}$입니다.`,`두 식을 모두 만족하는 교점은 $${xy(m.P)}$입니다.`],
    answer:(v,m)=>`교점 $${xy(m.P)}$`,
    draw:(b,v,m,c)=>{M.line(b,v.a,v.b);M.line(b,v.c,v.d,{color:'rose'});point(b,m.P,'P','amber');if(c.step>=2)M.projection(b,m.P,{color:'amber'});},
    verify:(v,m)=>[near(v.a*m.P.x+v.b,m.P.y)?null:'first equation',near(v.c*m.P.x+v.d,m.P.y)?null:'second equation'].filter(Boolean),
    voice:['두 직선을 각각 그려요.','두 조건이 함께 맞는 점을 찾아요.','교점에서는 y값이 같아요.','두 식을 같게 놓고 x를 구해요.','한 식에 대입해 y도 구해요.','두 식에 모두 대입해 확인해요.']
  });
  add('positions',{
    id:'line-positions',tier:'concept',title:'교점이 하나·없음·무수히 많음',
    vars:{a:V('둘째 기울기',-1,-2,3,0.5),b:V('둘째 y절편',3,-3,4)},
    presets:[{label:'한 점에서 만남',values:{a:-1,b:3}},{label:'평행',values:{a:1,b:3}},{label:'일치',values:{a:1,b:1}}],
    model:v=>({kind:v.a!==1?'one':v.b!==1?'parallel':'same',P:v.a!==1?p((v.b-1)/(1-v.a),(v.b-1)/(1-v.a)+1):null}),
    focus:(v,m)=>M.box([p(-3,-2),p(3,4),p(0,v.b),m.P],{pad:2}),
    question:v=>`$y=x+1$, $y=${eq(v.a,v.b)}$의 교점은 몇 개일까요?`,
    steps:(v,m)=>[`두 기울기 1과 $${f(v.a)}$를 비교합니다.`,v.a!==1?'기울기가 다르면 반드시 한 점에서 만납니다.':`기울기가 같으므로 y절편 1과 $${f(v.b)}$를 비교합니다.`,m.kind==='one'?`두 식을 같게 놓으면 $x=${f(m.P.x)}$입니다.`:m.kind==='parallel'?'기울기는 같고 절편은 다르므로 서로 평행합니다.':'기울기와 절편이 모두 같아 같은 직선입니다.',m.kind==='one'?`교점은 $${xy(m.P)}$ 하나입니다.`:m.kind==='parallel'?'교점이 없으므로 연립방정식의 해가 없습니다.':'직선 위 모든 점이 공통이므로 해가 무수히 많습니다.'],
    answer:(v,m)=>m.kind==='one'?`교점 1개: $${xy(m.P)}$`:m.kind==='parallel'?'교점 0개, 해가 없음':'교점이 무수히 많음',
    draw:(b,v,m,c)=>{M.line(b,1,1);M.line(b,v.a,v.b,{color:'rose',dash:[8,4]});point(b,p(0,1),'B₁');point(b,p(0,v.b),'B₂','rose');if(m.P&&c.step>=2){point(b,m.P,'P','amber');M.projection(b,m.P);}},
    verify:(v,m)=>m.P?[near(m.P.x+1,m.P.y)&&near(v.a*m.P.x+v.b,m.P.y)?null:'intersection'].filter(Boolean):[]
  });
  add('concurrency',{
    id:'three-line-concurrency',tier:'advanced',title:'세 직선이 한 점에서',
    vars:{K:V('세 번째 식의 우변',5,1,8),trial:V('움직여 볼 a',2,1,8,0.5)},
    model:v=>({P:p(3,-1),answer:9-v.K,slope:-3/v.trial,intercept:v.K/v.trial}),
    focus:(v,m)=>M.box([m.P,p(0,0.5),p(0,-7),p(0,m.intercept)],{pad:2}),
    question:v=>`세 직선 $x+2y=1$, $2x-y=7$, $3x+ay=${v.K}$가 한 점에서 만나도록 하는 a를 구하세요.`,
    steps:(v,m)=>['첫 두 식을 연립하여 먼저 공통점을 찾습니다.','$x=3$, $y=-1$이므로 공통점은 $(3,-1)$입니다.',`세 번째 식에 대입하면 $9-a=${v.K}$입니다.`,`따라서 $a=${m.answer}$일 때 세 직선이 한 점에서 만납니다.`],
    answer:(v,m)=>`$a=${m.answer}$`,
    draw:(b,v,m,c)=>{M.line(b,-0.5,0.5);M.line(b,2,-7,{color:'rose'});M.line(b,m.slope,m.intercept,{color:'amber',dash:[7,3]});point(b,m.P,'P','green');if(c.step>=3)M.line(b,-3/m.answer,v.K/m.answer,{color:'green',width:3});},
    readouts:(v,m,c)=>[{label:'탐색 중 a',value:`$${f(v.trial)}$`,color:'amber'}],
    verify:(v,m)=>[near(m.P.x+2*m.P.y,1)?null:'first condition',near(2*m.P.x-m.P.y,7)?null:'second condition',near(3*m.P.x+m.answer*m.P.y,v.K)?null:'third condition'].filter(Boolean)
  });
  add('no-triangle',{
    id:'triangle-degeneracy',tier:'advanced',title:'삼각형이 사라지는 세 경우',
    vars:{b:V('세 번째 y절편',1,1,3),trial:V('움직여 볼 기울기',1,-5,3,0.25)},
    presets:[{label:'첫 직선과 평행',values:{trial:2}},{label:'둘째와 평행',values:{trial:-0.5}},{label:'처음 조건의 공점',values:{b:1,trial:-2}}],
    model:v=>{const P=p(1,-1),u=2-v.trial,w=-0.5-v.trial;return{P,common:-1-v.b,Q:near(u,0)?null:p((v.b+3)/u,2*(v.b+3)/u-3),R:near(w,0)?null:p((v.b+0.5)/w,-0.5*(v.b+0.5)/w-0.5)};},
    focus:(v,m)=>M.box([m.P,m.Q,m.R,p(0,v.b)],{pad:2}),
    question:v=>`$y=2x-3$, $y=-\\frac12x-\\frac12$, $y=ax+${v.b}$가 삼각형을 만들지 않는 a를 모두 구하세요.`,
    steps:(v,m)=>['첫째, 세 번째 직선이 첫 직선과 평행하면 a=2입니다.','둘째, 세 번째 직선이 둘째 직선과 평행하면 a=-1/2입니다.',`셋째, 첫 두 직선의 교점 $(1,-1)$을 지나면 $-1=a+${v.b}$입니다.`,`세 경우를 합하면 $a=2,-\\frac12,${m.common}$입니다.`],
    answer:(v,m)=>`$a=2,-\\frac12,${m.common}$`,
    draw:(b,v,m,c)=>{if(m.Q&&m.R)M.polygon(b,[m.P,m.Q,m.R]);M.line(b,2,-3);M.line(b,-0.5,-0.5,{color:'rose'});M.line(b,v.trial,v.b,{color:'amber'});point(b,m.P,'P','green');if(m.Q)point(b,m.Q,'Q','amber');if(m.R)point(b,m.R,'R','amber');},
    notes:()=>['평행한 경우만 찾으면 공점인 경우를 놓칩니다. 서로 다른 세 직선의 위치를 모두 나눕니다.'],
    verify:(v,m)=>[near(m.common*m.P.x+v.b,m.P.y)?null:'concurrency value',m.Q&&!near(2*m.Q.x-3,v.trial*m.Q.x+v.b)?'Q':null,m.R&&!near(-0.5*m.R.x-0.5,v.trial*m.R.x+v.b)?'R':null].filter(Boolean)
  });
  add('axes-area',{
    id:'axes-triangle-area',tier:'advanced',title:'절편에서 삼각형 넓이',
    vars:{r:V('x절편의 크기',4,1,8),h:V('y절편의 크기',6,1,8)},state:{sx:1,sy:1},
    presets:[{label:'제1사분면',values:{sx:1,sy:1}},{label:'음의 x절편',values:{sx:-1,sy:1}},{label:'두 절편 음수',values:{sx:-1,sy:-1}}],
    model:v=>{const A=p(v.sx*v.r,0),B=p(0,v.sy*v.h);return{A,B,a:-B.y/A.x,b:B.y,area:v.r*v.h/2};},focus:(v,m)=>M.box([O,m.A,m.B],{pad:2}),
    question:(v,m)=>`$y=${eq(m.a,m.b)}$와 두 좌표축으로 둘러싸인 삼각형의 넓이를 구하세요.`,
    steps:(v,m)=>[`$y=0$을 대입하면 x절편은 $${f(m.A.x)}$입니다.`,`$x=0$을 대입하면 y절편은 $${f(m.B.y)}$입니다.`,`밑변과 높이는 길이이므로 각각 $${v.r},${v.h}$입니다.`,`넓이 $=\\frac12\\times${v.r}\\times${v.h}=${f(m.area)}$입니다.`],
    answer:(v,m)=>`넓이 $${f(m.area)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,[O,m.A,m.B]);M.line(b,m.a,m.b);pts(b,[[O,'O','muted'],[m.A,'A','amber'],[m.B,'B','rose']]);if(c.step>=2){b.seg(O,m.A,{color:'amber',width:4});b.seg(O,m.B,{color:'rose',width:4});}},
    verify:(v,m)=>[near(area([O,m.A,m.B]),m.area)?null:'triangle area',near(m.a*m.A.x+m.b,0)?null:'intercept'].filter(Boolean)
  });
  add('multi-area',{
    id:'lines-polygon-area',tier:'advanced',title:'교점으로 도형의 넓이',
    vars:{L:V('왼쪽 길이',3,1,6),R:V('오른쪽 길이',4,1,6),h:V('높이',4,2,7),base:V('기준선 위치',-1,-3,3)},state:{mode:0},
    presets:[{label:'가로 밑변 삼각형',values:{mode:0}},{label:'세로 밑변 삼각형',values:{mode:1}},{label:'비스듬한 세 직선',values:{mode:2}},{label:'네 직선 직사각형',values:{mode:3}}],
    model:v=>{
      let A=p(-v.L,v.base),B=p(v.R,v.base),C=p(0,v.base+v.h),poly=[A,B,C],S=(v.L+v.R)*v.h/2;
      if(v.mode===1){A=p(v.base,-v.L);B=p(v.base,v.R);C=p(v.base+v.h,0);poly=[A,B,C];}
      if(v.mode===2){B=p(v.R,v.base+1);poly=[A,B,C];S-=v.L/2;}
      if(v.mode===3){poly=[A,B,p(v.R,v.base+v.h),p(-v.L,v.base+v.h)];S=(v.L+v.R)*v.h;}
      return{A,B,C,poly,area:S,lines:v.mode===3?[`x=${-v.L}`,`x=${v.R}`,`y=${v.base}`,`y=${v.base+v.h}`]:[expression(A,B),expression(A,C),expression(B,C)]};
    },focus:(v,m)=>M.box(m.poly,{pad:2}),
    question:(v,m)=>`직선 $${m.lines.join('$, $')}$로 둘러싸인 도형의 넓이를 구하세요.`,
    steps:(v,m)=>v.mode===3?[`좌우 경계는 $x=${-v.L},x=${v.R}$입니다.`,`위아래 경계는 $y=${v.base},y=${v.base+v.h}$입니다.`,`가로 길이는 $${v.L+v.R}$, 세로 길이는 $${v.h}$입니다.`,`넓이는 $${v.L+v.R}\\times${v.h}=${f(m.area)}$입니다.`]:v.mode===2?[`두 식씩 연립하면 꼭짓점은 $${m.poly.map(xy).join(',')}$입니다.`,`가로 $${v.L+v.R}$, 세로 $${v.h}$인 바깥 직사각형을 잡습니다.`,`바깥 세 직각삼각형의 넓이 $${f(v.L*v.h/2)},${f(v.R*(v.h-1)/2)},${f((v.L+v.R)/2)}$를 뺍니다.`,`넓이 $=${(v.L+v.R)*v.h}-${f(v.L*v.h/2)}-${f(v.R*(v.h-1)/2)}-${f((v.L+v.R)/2)}=${f(m.area)}$입니다.`]:[`두 식씩 연립하여 꼭짓점 $${m.poly.map(xy).join(',')}$을 구합니다.`,`좌표의 차로 밑변 길이 $${v.L+v.R}$를 구합니다.`,`밑변에 수직인 높이는 $${v.h}$입니다.`,`넓이 $=\\frac12\\times${v.L+v.R}\\times${v.h}=${f(m.area)}$입니다.`],
    answer:(v,m)=>`넓이 $${f(m.area)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,m.poly);for(let i=0;i<m.poly.length;i++)through(b,m.poly[i],m.poly[(i+1)%m.poly.length],{color:i%2?'rose':'sky'});m.poly.forEach((P,i)=>point(b,P,'ABCD'[i],'amber'));if(c.step>=2&&v.mode===2)M.polygon(b,[p(-v.L,v.base),p(v.R,v.base),p(v.R,v.base+v.h),p(-v.L,v.base+v.h)],{color:'muted',fillAlpha:0,dash:[4,3]});if(c.step>=2&&v.mode<2)b.seg(m.C,v.mode===1?p(v.base,0):p(0,v.base),{color:'green',dash:[4,3],width:3});},
    verify:(v,m)=>[near(area(m.poly),m.area)?null:'polygon decomposition'].filter(Boolean),
    voice:['경계가 되는 직선들을 그려요.','어떤 점들이 도형의 꼭짓점인가요?','두 식씩 연립해 좌표를 구해요.','밑변과 높이 또는 바깥 넓이를 읽어요.','삼각형과 직사각형의 넓이를 이용해요.','구한 넓이가 색칠한 도형과 맞아요.']
  });
  add('rectangle-bisect',{
    id:'rectangle-bisection',tier:'advanced',title:'넓이를 반으로 나누는 직선',
    vars:{b:V('y절편 b',-2,-4,1),trial:V('움직여 볼 기울기',1,0.25,2.5,0.25)},
    model:v=>{const rect=[p(2,3),p(6,3),p(6,5),p(2,5)],C=p(4,4);return{rect,C,a:(4-v.b)/4,upper:clip(rect,v.trial,v.b,1),lower:clip(rect,v.trial,v.b,-1)};},focus:{x:[-1,8],y:[-6,8]},
    question:v=>`$2\\le x\\le6$, $3\\le y\\le5$인 직사각형을 $y=ax${v.b>=0?'+':''}${v.b}$가 이등분할 때 a를 구하세요.`,
    steps:(v,m)=>['직사각형 중심은 가로·세로 중간인 $(4,4)$입니다.','중심을 지나는 직선은 마주 보는 두 부분을 같은 넓이로 나눕니다.',`중심을 대입하면 $4=4a${v.b>=0?'+':''}${v.b}$입니다.`,`따라서 $a=${f(m.a)}$이며 두 부분의 넓이는 각각 4입니다.`],
    answer:(v,m)=>`$a=${f(m.a)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,m.upper,{fill:'sky',color:'sky',fillAlpha:0.18});M.polygon(b,m.lower,{fill:'rose',color:'rose',fillAlpha:0.18});M.polygon(b,m.rect,{fillAlpha:0,color:'muted'});M.line(b,v.trial,v.b,{color:'amber'});point(b,m.C,'C','green');if(c.step>=3)M.line(b,m.a,v.b,{color:'green',dash:[5,3]});},
    readouts:(v,m,c)=>[{label:'탐색 직선 위쪽',value:`$${f(area(m.upper))}$`,color:'sky'},{label:'탐색 직선 아래쪽',value:`$${f(area(m.lower))}$`,color:'rose'}],
    verify:(v,m)=>[near(area(m.upper)+area(m.lower),8)?null:'partition area',near(area(clip(m.rect,m.a,v.b,1)),4)?null:'bisector area'].filter(Boolean)
  });
  add('triangle-ratio',{
    id:'triangle-area-ratio',tier:'advanced',title:'같은 높이와 넓이의 비',
    vars:{r:V('x절편',8,4,12),h:V('y절편',6,3,9),m:V('BOP의 넓이 비',3,1,4),q:V('POA의 넓이 비',1,1,4)},
    model:v=>{const t=v.m/(v.m+v.q),A=p(v.r,0),B=p(0,v.h),P=p(t*v.r,(1-t)*v.h);return{A,B,P,a:P.y/P.x,area1:v.r*v.h*t/2,area2:v.r*v.h*(1-t)/2};},focus:(v,m)=>M.box([O,m.A,m.B],{pad:2}),
    question:(v,m)=>`직선 $y=${eq(-v.h/v.r,v.h)}$ 위의 점 P에 대해 넓이 BOP:POA가 $${v.m}:${v.q}$입니다. OP의 식을 구하세요.`,
    steps:(v,m)=>['두 삼각형은 O에서 직선 AB까지의 높이가 같습니다.',`따라서 밑변비 $BP:PA=${v.m}:${v.q}$입니다.`,`AB를 그 비로 나눈 점은 $P${xy(m.P)}$입니다.`,`OP는 원점을 지나므로 $y=${eq(m.a,0)}$입니다.`],
    answer:(v,m)=>givenLine(m.a,0),
    draw:(b,v,m,c)=>{M.polygon(b,[m.B,O,m.P],{fill:'sky',color:'sky'});M.polygon(b,[m.P,O,m.A],{fill:'rose',color:'rose'});through(b,m.A,m.B);if(c.step>=2)M.line(b,m.a,0,{color:'green'});pts(b,[[O,'O','muted'],[m.A,'A'],[m.B,'B'],[m.P,'P','amber']]);},
    verify:(v,m)=>[near(area([m.B,O,m.P])/area([m.P,O,m.A]),v.m/v.q)?null:'area ratio',near(m.P.y,-v.h/v.r*m.P.x+v.h)?null:'P on AB'].filter(Boolean)
  });
  add('slope-range',{
    id:'slope-range',tier:'advanced',title:'선분·도형을 만나는 직선',
    vars:{b:V('고정점의 y좌표',-2,-3,0),trial:V('움직여 볼 계수',3,-8,10,0.25)},state:{closed:true,mode:0},
    presets:[{label:'기울기 범위',values:{mode:0,closed:true}},{label:'y절편 범위',values:{mode:1,closed:true}},{label:'직사각형과 만남',values:{mode:2,b:-1,closed:true}},{label:'경계 제외',values:{closed:false}}],
    model:v=>{
      const A=v.mode===1?p(1,4):v.mode===2?p(1,3):p(1,6),B=v.mode===1?p(3,3):v.mode===2?p(3,1):p(4,2),P=p(0,v.mode===1?v.trial:v.b);
      const lo=v.mode===1?B.y-3*B.x:(B.y-v.b)/B.x,hi=v.mode===1?A.y-3*A.x:(A.y-v.b)/A.x,ints=[];
      for(let a=v.mode===1?-12:1;a<=20;a++)if(v.closed?a>=lo&&a<=hi:a>lo&&a<hi)ints.push(a);
      return{P,A,B,lo,hi,ints,rect:[p(1,1),p(3,1),p(3,3),p(1,3)]};
    },focus:(v,m)=>M.box([m.P,m.A,m.B],{pad:2}),
    question:(v,m)=>v.mode===1?`$y=3x+b$가 A(1,4), B(3,3)를 잇는 선분을 만나는 b의 범위와 정수 b의 개수를 구하세요. 끝점은 ${v.closed?'포함':'제외'}합니다.`:v.mode===2?`$y=ax${v.b>=0?'+':''}${v.b}$가 $1\\le x\\le3$, $1\\le y\\le3$인 직사각형${v.closed?'과':'의 내부와'} 만나는 a의 범위와 자연수 a의 개수를 구하세요.`:`고정점 $(0,${v.b})$을 지나는 $y=ax${v.b>=0?'+':''}${v.b}$가 A(1,6), B(4,2)를 잇는 선분을 만나는 a의 범위와 자연수 a의 개수를 구하세요. 끝점은 ${v.closed?'포함':'제외'}합니다.`,
    steps:(v,m)=>v.mode===1?['A를 지날 때 y절편은 $4-3×1=1$입니다.','B를 지날 때 y절편은 $3-3×3=-6$입니다.',`기울기 3을 유지하며 두 경계 직선 사이로 평행이동하면 선분을 만납니다. 경계는 ${v.closed?'포함':'제외'}합니다.`,`범위의 정수는 $${m.ints.join(',')}$, ${m.ints.length}개입니다.`]:[`가장 낮은 경계의 ${v.mode===2?'꼭짓점':'끝점'} B를 지나는 기울기는 $${f(m.lo)}$입니다.`,`가장 높은 경계의 ${v.mode===2?'꼭짓점':'끝점'} A를 지나는 기울기는 $${f(m.hi)}$입니다.`,`그 사이로 회전한 직선은 ${v.mode===2?'직사각형 내부':'선분 내부'}를 만납니다. 경계는 ${v.closed?'포함':'제외'}합니다.`,`범위의 자연수는 $${m.ints.join(',')}$, ${m.ints.length}개입니다.`],
    answer:(v,m)=>`$${f(m.lo)}${v.closed?'\\le ':'<'}${v.mode===1?'b':'a'}${v.closed?'\\le ':'<'}${f(m.hi)}$, ${v.mode===1?'정수':'자연수'} ${m.ints.length}개`,
    draw:(b,v,m,c)=>{
      if(v.mode===2)M.polygon(b,m.rect,{color:'rose',fill:'rose'});else b.seg(m.A,m.B,{color:'rose',width:5});
      M.line(b,v.mode===1?3:v.trial,v.mode===1?v.trial:v.b,{color:'amber'});point(b,m.P,'P','green');
      M.point(b,m.A,'A',{color:'rose',hollow:!v.closed});M.point(b,m.B,'B',{color:'rose',hollow:!v.closed});
      if(c.step>=2){M.line(b,v.mode===1?3:m.lo,v.mode===1?m.lo:v.b,{color:'muted',dash:[4,4]});M.line(b,v.mode===1?3:m.hi,v.mode===1?m.hi:v.b,{color:'muted',dash:[4,4]});}
    },
    notes:v=>[v.mode===1?'기울기를 고정하면 경계는 y절편으로 비교합니다.':'고정점을 중심으로 직선을 회전하면 경계는 기울기로 비교합니다.',v.closed?'경계에서 만나도 조건을 만족합니다.':'경계는 포함하지 않으며 엄격한 부등호를 사용합니다.'],
    verify:(v,m)=>[near(v.mode===1?3*m.B.x+m.lo:m.lo*m.B.x+v.b,m.B.y)?null:'lower boundary',near(v.mode===1?3*m.A.x+m.hi:m.hi*m.A.x+v.b,m.A.y)?null:'upper boundary'].filter(Boolean)
  });
  function shapeInset(b,m,mode) {
    // A separate labelled schematic below the coordinate graph, in screen pixels.
    // Its lengths share one scale; it does not pretend to use the time/area axes.
    if(!b.ctx||!b.W||!b.H)return;
    const c=b.ctx,scale=Math.min(b.W*0.58/m.W,b.H*0.18/m.H),w=m.W*scale,h=m.H*scale,x=(b.W-w)/2,y=b.H*0.80;
    const P=[x+m.distance*scale,y+h],Q=[x+m.otherDistance*scale,y];
    c.save();c.fillStyle=b.color('halo');c.fillRect(x-32,y-27,w+64,h+48);
    c.strokeStyle=b.color('muted');c.lineWidth=1.8;c.strokeRect(x,y,w,h);
    c.beginPath();
    if(mode===0){c.moveTo(P[0],P[1]);c.lineTo(x+w,y);c.lineTo(x+w,y+h);}
    else if(mode===1){c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w,y+h);c.lineTo(P[0],P[1]);}
    else {c.moveTo(Q[0],Q[1]);c.lineTo(x+w,y);c.lineTo(x+w,y+h);c.lineTo(P[0],P[1]);}
    c.closePath();c.fillStyle=b.color('green',0.22);c.fill();c.strokeStyle=b.color('green');c.stroke();
    c.fillStyle=b.color('amber');c.beginPath();c.arc(P[0],P[1],4,0,Math.PI*2);c.fill();
    if(mode===2){c.beginPath();c.arc(Q[0],Q[1],4,0,Math.PI*2);c.fill();}
    c.font='12px sans-serif';c.textAlign='center';c.fillStyle=b.color('ink');
    c.fillText(`도형 모형 · 가로 ${m.W} cm, 세로 ${m.H} cm`,x+w/2,y-10);
    c.fillText('P',P[0],P[1]+16);if(mode===2)c.fillText('Q',Q[0],Q[1]-6);c.restore();
  }
  add('moving-area',{
    id:'moving-area',tier:'advanced',title:'움직이는 점과 넓이',aspect:'free',axes:{xLabel:'시간(초)',yLabel:'넓이(cm²)'},
    vars:{W:V('직사각형 가로(cm)',24,12,30,2),H:V('세로(cm)',10,6,12),s:V('P의 속력(cm/초)',2,1,4),u:V('Q의 속력(cm/초)',1,1,3),phase:V('이동 구간의 진행(%)',35,0,100,5)},state:{mode:0},
    presets:[{label:'삼각형',values:{mode:0}},{label:'사다리꼴',values:{mode:1}},{label:'두 점이 움직임',values:{mode:2}}],
    model:v=>{const end=v.W/(v.mode===2?Math.max(v.s,v.u):v.s),t=end*v.phase/100,a=-v.H*(v.mode===2?v.s+v.u:v.s)/2,b=v.W*v.H*(v.mode===0?0.5:1);return{W:v.W,H:v.H,end,t,a,b,S:a*t+b,distance:v.s*t,otherDistance:v.u*t};},
    focus:(v,m)=>({x:[-m.end*0.12,m.end*1.15],y:[-m.b*0.75,m.b*1.2]}),
    question:v=>`가로 ${v.W} cm, 세로 ${v.H} cm인 직사각형에서 P는 아래 변을 왼쪽부터 초속 ${v.s} cm로 움직입니다.${v.mode===2?` Q도 위 변을 왼쪽부터 초속 ${v.u} cm로 움직입니다.`:''} 색칠한 ${v.mode===0?'삼각형':'사다리꼴'}의 넓이 y와 시간 x의 관계식을 구하세요.`,
    guide:'진행 슬라이더를 움직이면 아래 도형의 점과 위 넓이 그래프의 점이 함께 움직입니다. 끝점에 도달하면 유효 구간이 끝납니다.',
    steps:(v,m)=>[`이동거리 P는 $${v.s}x$${v.mode===2?`, Q는 $${v.u}x$`:''} cm입니다.`,v.mode===0?`삼각형의 밑변은 $${v.W}-${v.s}x$, 높이는 $${v.H}$입니다.`:v.mode===1?`사다리꼴의 두 밑변은 $${v.W}$와 $${v.W}-${v.s}x$입니다.`:`두 밑변은 $${v.W}-${v.s}x$, $${v.W}-${v.u}x$입니다.`,`넓이 공식을 정리하면 $y=${eq(m.a,m.b)}$입니다.`,`점이 변 위에 있는 범위는 $0\\le x\\le${f(m.end)}$입니다.`],
    answer:(v,m)=>`$y=${eq(m.a,m.b)}$, $0\\le x\\le${f(m.end)}$`,
    draw:(b,v,m,c)=>{M.curve(b,x=>m.a*x+m.b,{from:0,to:m.end});point(b,p(m.t,m.S),'T','amber');M.projection(b,p(m.t,m.S));point(b,p(0,m.b),'','sky');point(b,p(m.end,m.a*m.end+m.b),'','sky');shapeInset(b,m,v.mode);},
    readouts:(v,m,c)=>[{label:'현재 시간',value:`$${f(m.t)}$초`,color:'amber'},...(c.solved?[{label:'현재 넓이',value:`$${f(m.S)}\\,\\mathrm{cm}^2$`,color:'green'}]:[])],
    verify:(v,m)=>{const expected=v.mode===0?(v.W-m.distance)*v.H/2:v.mode===1?(2*v.W-m.distance)*v.H/2:(2*v.W-m.distance-m.otherDistance)*v.H/2;return[near(m.S,expected)?null:'geometric area',m.distance<=v.W+1e-8?null:'P outside segment',v.mode===2&&m.otherDistance>v.W+1e-8?'Q outside segment':null,m.S>=-1e-8?null:'negative area'].filter(Boolean);},
    voice:['도형에서 움직이는 점을 찾아요.','점은 정해진 변 위에서만 움직여요.','속력에 시간을 곱해 이동거리를 구해요.','남은 밑변을 넓이 공식에 넣어요.','식과 넓이 그래프가 같은 변화를 보여요.','이동 가능한 시간 범위도 답에 써요.']
  });
  add('rate',{
    id:'constant-rate',title:'초깃값과 일정한 변화율',aspect:'free',axes:{xLabel:'시간(분)',yLabel:'물의 양(L)'},
    vars:{b:V('처음 물의 양(L)',40,20,60,5),r:V('분당 변화량의 크기(L)',2,1,5),phase:V('관찰 구간 진행(%)',40,0,100,5)},state:{sign:-1},
    presets:[{label:'물을 빼요',values:{sign:-1}},{label:'물을 넣어요',values:{sign:1}}],
    model:v=>{const end=v.b/v.r,t=end*v.phase/100,a=v.sign*v.r;return{end,t,a,P:p(t,v.b+a*t),target:v.sign===-1?0:2*v.b};},
    focus:(v,m)=>({x:[-m.end*0.12,m.end*1.18],y:[-v.b*0.12,v.b*(v.sign===1?2.35:1.35)]}),
    question:v=>`처음 ${v.b} L인 물이 매분 ${v.r} L씩 ${v.sign===1?'늘어납니다':'줄어듭니다'}. x분 후 물의 양 y의 식과 ${v.sign===1?'처음 양의 두 배가':'0 L가'} 되는 시간을 구하세요.`,
    steps:(v,m)=>[`처음 물의 양은 $${v.b}$ L이므로 y절편은 ${v.b}입니다.`,`분당 변화율은 $${m.a}$ L이므로 기울기는 ${m.a}입니다.`,`따라서 $y=${eq(m.a,v.b)}$입니다.`,`$y=${m.target}$를 대입하면 $x=${f(m.end)}$분입니다.`],
    answer:(v,m)=>`$y=${eq(m.a,v.b)}$, 목표 시간 $${f(m.end)}$분`,
    draw:(b,v,m,c)=>{M.curve(b,x=>v.b+m.a*x,{from:0,to:m.end});point(b,p(0,v.b),'시작','sky');point(b,m.P,'현재','amber');M.projection(b,m.P);if(c.step>=3)point(b,p(m.end,m.target),'목표','green');},
    readouts:(v,m,c)=>[{label:'관찰 시간',value:`$${f(m.t)}$분`,color:'amber'},{label:'관찰량',value:`$${f(m.P.y)}$L`,color:'sky'}],
    verify:(v,m)=>[m.P.y>=-1e-8?null:'negative water',near(v.b+m.a*m.end,m.target)?null:'target time'].filter(Boolean)
  });
  add('fit-data',{
    id:'rate-from-data',title:'두 관측값으로 시작값 찾기',aspect:'free',axes:{xLabel:'시간(분)',yLabel:'높이(cm)'},
    vars:{y1:V('5분의 높이(cm)',20,20,30),y2:V('15분의 높이(cm)',40,40,50),target:V('목표 높이(cm)',90,70,100,5)},
    model:v=>{const a=(v.y2-v.y1)/10,b=v.y1-5*a,x=(v.target-b)/a;return{a,b,A:p(5,v.y1),B:p(15,v.y2),T:p(x,v.target)};},
    focus:(v,m)=>({x:[-m.T.x*0.1,m.T.x*1.15],y:[-v.target*0.1,v.target*1.15]}),
    question:v=>`일정하게 물이 차는 수조가 5분 후 ${v.y1} cm, 15분 후 ${v.y2} cm입니다. 관계식과 ${v.target} cm가 되는 시간을 구하세요.`,
    steps:(v,m)=>[`10분 동안 높이가 $${v.y2-v.y1}$ cm 늘었습니다.`,`분당 증가량 $a=\\frac{${v.y2-v.y1}}{10}=${f(m.a)}$입니다.`,`5분의 자료를 대입하면 시작 높이 $b=${f(m.b)}$입니다.`,`$y=${eq(m.a,m.b)}$에 $y=${v.target}$를 대입하면 $x=${f(m.T.x)}$분입니다.`],
    answer:(v,m)=>`$y=${eq(m.a,m.b)}$, $${f(m.T.x)}$분`,
    draw:(b,v,m,c)=>{M.curve(b,x=>m.a*x+m.b,{from:0,to:m.T.x});pts(b,[[m.A,'A','amber'],[m.B,'B','amber']]);if(c.step>=2)M.riseRun(b,m.A,m.B,{dxLabel:'10분',dyLabel:`${v.y2-v.y1} cm`});if(c.step>=3){point(b,m.T,'목표','green');M.projection(b,m.T);}},
    verify:(v,m)=>[near(m.a*5+m.b,v.y1)?null:'observation 1',near(m.a*15+m.b,v.y2)?null:'observation 2',near(m.a*m.T.x+m.b,v.target)?null:'target',m.b>=0?null:'initial level'].filter(Boolean)
  });
  add('motion',{
    id:'motion-intersection',tier:'advanced',title:'두 변화가 같아지는 순간',aspect:'free',
    vars:{a:V('빠른 변화율의 크기',4,3,6),b:V('느린 변화율의 크기',2,1,2),d:V('처음 차이 또는 출발 지연',6,4,12),phase:V('관찰 구간 진행(%)',45,0,100,5)},state:{mode:0},
    presets:[{label:'앞선 사람 따라잡기',values:{mode:0}},{label:'물통의 양이 같아짐',values:{mode:1}},{label:'늦게 출발해 따라잡기',values:{mode:2}}],
    axes:v=>({xLabel:'시간(분)',yLabel:v.mode===1?'물의 양(L)':'거리(m)'}),
    model:v=>{let a=v.a,b=v.b,c=0,d=v.d,start=0;if(v.mode===1){a=-v.a;b=-v.b;c=40+v.d;d=40;}if(v.mode===2){c=-v.a*v.d;d=0;start=v.d;}const t=(d-c)/(a-b),P=p(t,a*t+c),end=t*1.3,time=end*v.phase/100;return{a,b,c,d,t,P,start,end,time,A:p(time,time<start?0:a*time+c),B:p(time,b*time+d)};},
    focus:(v,m)=>({x:[-m.end*0.1,m.end*1.15],y:[-Math.max(m.P.y,40)*0.1,Math.max(m.P.y*1.5,m.c,m.d,1)*1.2]}),
    question:v=>v.mode===1?`A에는 ${40+v.d} L, B에는 40 L가 있습니다. 매분 각각 ${v.a} L, ${v.b} L씩 빼면 언제 양이 같아지나요?`:v.mode===2?`먼저 출발한 사람은 분속 ${v.b} m, ${v.d}분 늦게 출발한 사람은 분속 ${v.a} m입니다. 처음 출발한 때부터 몇 분 후 만나나요?`:`앞선 사람은 ${v.d} m 앞에서 분속 ${v.b} m로, 뒤 사람은 분속 ${v.a} m로 이동합니다. 몇 분 후 만나나요?`,
    steps:(v,m)=>[`첫 변화는 $y=${eq(m.a,m.c)}$${m.start?` ($x\\ge${m.start}$)`:''}입니다.`,`다른 변화는 $y=${eq(m.b,m.d)}$입니다.`,`같아지는 순간 두 식을 같게 놓으면 $x=${f(m.t)}$입니다.`,`교점 $${xy(m.P)}$의 x좌표가 걸린 시간입니다.`],
    answer:(v,m)=>`$${f(m.t)}$분 후, ${v.mode===1?'물의 양':'거리'} $${f(m.P.y)}${v.mode===1?'\\,\\mathrm L':'\\,\\mathrm m'}$`,
    draw:(b,v,m,c)=>{M.curve(b,x=>m.a*x+m.c,{from:m.start,to:m.end});if(m.start)b.seg(O,p(m.start,0),{color:'sky',dash:[4,3]});M.curve(b,x=>m.b*x+m.d,{from:0,to:m.end,color:'rose'});point(b,m.A,'A','sky');point(b,m.B,'B','rose');if(c.step>=2){point(b,m.P,'만남','green');M.projection(b,m.P,{color:'green'});}},
    readouts:(v,m)=>[{label:'현재 시간',value:`$${f(m.time)}$분`,color:'amber'}],
    verify:(v,m)=>[near(m.a*m.t+m.c,m.b*m.t+m.d)?null:'meeting equality',m.t>=m.start?null:'meeting before start',v.mode===1&&m.P.y<0?'empty before meeting':null].filter(Boolean)
  });
  add('pattern',{
    id:'pattern-count',title:'반복되는 모양에서 식 찾기',aspect:'free',axes:{xLabel:'정사각형 개수',yLabel:'성냥 개수'},
    vars:{count:V('이어 붙인 정사각형 수',4,1,8)},
    model:v=>({sticks:3*v.count+1,P:p(v.count,3*v.count+1)}),focus:{x:[-1,10],y:[-6,29]},
    question:v=>`성냥으로 정사각형 ${v.count}개를 일렬로 이어 붙입니다. 정사각형 x개에 필요한 성냥 수 y의 식을 구하세요.`,
    steps:v=>['첫 정사각형에는 성냥 4개가 필요합니다.','정사각형이 하나 늘 때마다 공유 변을 빼고 3개가 늘어납니다.',`$y=4+3(x-1)$을 정리하면 $y=3x+1$입니다.`,`현재 ${v.count}개를 만들 때 성냥은 $${3*v.count+1}$개입니다.`],
    answer:(v,m)=>`$y=3x+1$ ($x$는 자연수), 현재 ${m.sticks}개`,
    draw:(b,v,m,c)=>{M.curve(b,x=>3*x+1,{from:1,to:8,color:'muted',dash:[4,4]});for(let x=1;x<=8;x++)point(b,p(x,3*x+1),'',x===v.count?'amber':'sky');point(b,m.P,'P','amber');for(let i=0;i<v.count;i++){const y=-4;b.seg(p(i,y),p(i+1,y),{color:'green',width:3});b.seg(p(i,y+2),p(i+1,y+2),{color:'green',width:3});b.seg(p(i,y),p(i,y+2),{color:i===0?'sky':'green',width:3});}b.seg(p(v.count,-4),p(v.count,-2),{color:'green',width:3});},
    notes:()=>['성냥 수와 정사각형 수는 자연수입니다. 점 사이 점선은 변화 경향을 안내합니다.'],
    verify:(v,m)=>[m.sticks===(v.count+1)+2*v.count?null:'shared-edge count'].filter(Boolean)
  });
  add('lattice',{
    id:'lattice-solutions',title:'자연수 해를 격자점으로',
    vars:{a:V('x의 계수',3,1,4),b:V('y의 계수',2,1,4),c:V('우변의 자연수',20,8,24)},
    model:v=>{const points=[];for(let x=1;x<v.c/v.a;x++){const y=(v.c-v.a*x)/v.b;if(Number.isInteger(y)&&y>0)points.push(p(x,y));}return{points,X:p(v.c/v.a,0),Y:p(0,v.c/v.b)};},
    focus:(v,m)=>M.box([O,m.X,m.Y],{pad:2,minSpan:8}),
    question:v=>`$${v.a}x+${v.b}y=${v.c}$를 만족하는 자연수 x,y의 순서쌍을 모두 구하세요.`,
    steps:(v,m)=>[`식을 $y=-\\frac{${v.a}}{${v.b}}x+\\frac{${v.c}}{${v.b}}$로 읽습니다.`,'자연수 좌표만 찾으므로 두 좌표가 모두 1 이상인 격자점을 봅니다.','직선 위의 격자점인지 원래 식에 대입해 확인합니다.',m.points.length?`가능한 점은 $${m.points.map(xy).join(',')}$, ${m.points.length}개입니다.`:'조건을 만족하는 자연수 순서쌍이 없습니다.'],
    answer:(v,m)=>m.points.length?`$${m.points.map(xy).join(',')}$: ${m.points.length}개`:'해 0개',
    draw:(b,v,m,c)=>{M.line(b,-v.a/v.b,v.c/v.b);for(let x=1;x<=Math.min(24,Math.floor(m.X.x));x++)for(let y=1;y<=Math.min(24,Math.floor(m.Y.y));y++)M.point(b,p(x,y),'',{r:1.6,color:'muted'});if(c.step>=2)m.points.forEach(P=>point(b,P,'','amber'));},
    verify:(v,m)=>[...m.points.map(P=>Number.isInteger(P.x)&&Number.isInteger(P.y)&&P.x>0&&P.y>0&&v.a*P.x+v.b*P.y===v.c?null:'invalid lattice point')].filter(Boolean)
  });
  add('pythagoras',{
    id:'graph-pythagoras',tier:'advanced',title:'좌표축 삼각형의 높이',
    vars:{k:V('도형의 확대 배수',1,1,3)},
    model:v=>{const r=5*v.k,h=12*v.k,A=p(r,0),B=p(0,h),length=13*v.k,H=p(h*h*r/(r*r+h*h),r*r*h/(r*r+h*h));return{r,h,A,B,H,length,altitude:60*v.k/13};},focus:(v,m)=>M.box([O,m.A,m.B],{pad:2}),
    question:(v,m)=>`$y=${eq(-12/5,m.h)}$가 두 축과 만나는 점을 A,B라고 합니다. O에서 AB에 내린 수선의 길이를 구하세요.`,
    steps:(v,m)=>[`절편으로 $OA=${m.r}$, $OB=${m.h}$를 구합니다.`,`피타고라스 정리로 $AB=\\sqrt{${m.r}^2+${m.h}^2}=${m.length}$입니다.`,`같은 삼각형의 넓이를 두 번 쓰면 $\\frac12\\times${m.r}\\times${m.h}=\\frac12\\times${m.length}\\times OH$입니다.`,`따라서 $OH=${f(m.altitude)}$입니다.`],
    answer:(v,m)=>`$OH=${f(m.altitude)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,[O,m.A,m.B]);through(b,m.A,m.B);pts(b,[[O,'O','muted'],[m.A,'A'],[m.B,'B']]);if(c.step>=2){b.seg(O,m.H,{color:'amber',width:3});point(b,m.H,'H','amber');if(b.right)b.right(m.H,O,m.A);}},
    notes:()=>['좌표 거리 공식이나 수직인 직선의 기울기 공식 없이 피타고라스 정리와 넓이로 해결합니다.'],
    verify:(v,m)=>[near(m.length*m.length,m.r*m.r+m.h*m.h)?null:'Pythagoras',near(Math.hypot(m.H.x,m.H.y),m.altitude)?null:'altitude length',near(m.H.y,-12/5*m.H.x+m.h)?null:'foot on line',near(m.r*m.h,m.length*m.altitude)?null:'equal-area altitude'].filter(Boolean)
  });
  add('rotation',{
    id:'graph-rotation',tier:'advanced',title:'절편 삼각형을 회전하면',
    vars:{r:V('x절편의 길이',4,2,8),h:V('y절편의 길이',6,3,9)},state:{axis:0},
    presets:[{label:'x축 둘레로',values:{axis:0}},{label:'y축 둘레로',values:{axis:1}}],
    model:v=>({A:p(v.r,0),B:p(0,v.h),radius:v.axis?v.r:v.h,height:v.axis?v.h:v.r,factor:(v.axis?v.r*v.r*v.h:v.h*v.h*v.r)/3}),
    focus:v=>({x:[-v.r-2,v.r+2],y:[-v.h-2,v.h+2]}),
    question:(v,m)=>`직선 $y=${eq(-v.h/v.r,v.h)}$와 두 좌표축이 둘러싼 유한한 삼각형 OAB를 ${v.axis?'y':'x'}축 둘레로 한 바퀴 회전시킵니다. 만들어진 원뿔의 부피를 구하세요.`,
    steps:(v,m)=>[`두 절편의 길이는 $OA=${v.r}$, $OB=${v.h}$입니다.`,`${v.axis?'y':'x'}축 위의 변이 원뿔의 높이 ${m.height}입니다.`,`축에 수직인 변은 밑면 원의 반지름 ${m.radius}입니다.`,`부피 $=\\frac13\\pi\\times${m.radius}^2\\times${m.height}=${f(m.factor)}\\pi$입니다.`],
    answer:(v,m)=>`부피 $${f(m.factor)}\\pi$`,
    draw:(b,v,m,c)=>{M.polygon(b,[O,m.A,m.B]);through(b,m.A,m.B);pts(b,[[O,'O','muted'],[m.A,'A','sky'],[m.B,'B','rose']]);if(v.axis)b.vline(0,{color:'amber',width:4});else b.hline(0,{color:'amber',width:4});if(c.step>=2){const other=v.axis?p(-v.r,0):p(0,-v.h);M.polygon(b,v.axis?[other,O,m.B]:[other,O,m.A],{fill:'rose',color:'rose',fillAlpha:0.08,dash:[4,3]});M.label(b,p(-v.r*0.5,-v.h*0.65),'축을 지나는 단면',{size:13,color:'muted'});}},
    notes:()=>['그림은 회전체의 축을 지나는 단면입니다. 회전 대상은 무한 직선 전체가 아니라 좌표축으로 닫힌 삼각형입니다.'],
    verify:(v,m)=>[near(m.factor,m.radius*m.radius*m.height/3)?null:'cone volume',m.radius>0&&m.height>0?null:'cone dimensions'].filter(Boolean)
  });
  add('probability',{
    id:'graph-probability',tier:'advanced',title:'그래프 조건과 36가지 경우',
    vars:{k:V('조건의 수 k',1,1,3),a:V('첫 번째 주사위 눈',2,1,6),b:V('두 번째 주사위 눈',3,1,6)},state:{mode:0},
    presets:[{label:'직선 위의 점',values:{mode:0}},{label:'두 직선의 위치 관계',values:{mode:1}},{label:'교점의 x좌표',values:{mode:2}}],
    axes:{xLabel:'첫 번째 눈 a',yLabel:'두 번째 눈 b'},
    model:v=>{const good=(a,b)=>v.mode===0?b===a+v.k:v.mode===1?a!==b&&a!==v.k:a-b===v.k,points=[];for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(good(a,b))points.push(p(a,b));return{points,current:good(v.a,v.b)};},
    focus:{x:[-0.5,7.5],y:[-0.5,7.5]},
    question:v=>v.mode===0?`주사위를 두 번 던져 나온 눈 a,b에 대해 점 (a,b)가 $y=x+${v.k}$ 위에 있을 확률을 구하세요.`:v.mode===1?`두 눈 a,b가 $a\\ne b$를 만족하고 $y=${v.k}x+3$과 $y=ax+b$가 정확히 한 점에서 만날 확률을 구하세요.`:`두 눈 a,b가 정하는 $y=2x-a$, $y=x-b$의 교점 x좌표가 ${v.k}일 확률을 구하세요.`,
    steps:(v,m)=>['두 번의 눈을 순서쌍으로 세면 전체 경우는 6×6=36가지입니다.',v.mode===0?`직선의 조건은 $b=a+${v.k}$입니다.`:v.mode===1?`한 점에서 만나려면 기울기가 달라야 하므로 $a\\ne${v.k}$입니다.`:`교점에서는 $2x-a=x-b$이므로 $x=a-b=${v.k}$입니다.`,v.mode===1?`$a=b$인 대각선과 $a=${v.k}$인 세로선을 제외합니다.`:'1부터 6까지의 격자점 중 조건에 맞는 점을 찾습니다.',`유리한 경우는 ${m.points.length}가지이므로 확률은 $${M.frac(m.points.length,36)}$입니다.`],
    answer:(v,m)=>`확률 $${M.frac(m.points.length,36)}$`,
    draw:(b,v,m,c)=>{for(let a=1;a<=6;a++)for(let y=1;y<=6;y++)M.point(b,p(a,y),'',{color:'muted',r:3});if(v.mode===1){M.line(b,1,0,{color:'rose',dash:[4,3]});b.vline(v.k,{color:'rose',dash:[4,3]});}else M.line(b,1,v.mode===0?v.k:-v.k);if(c.step>=2)m.points.forEach(P=>M.point(b,P,'',{color:'green',r:5}));point(b,p(v.a,v.b),'P','amber');M.drag(b,c,'dice',p(v.a,v.b),{x:'a',y:'b'});},
    readouts:(v,m,c)=>[{label:'선택한 두 눈',value:`$(${v.a},${v.b})$`,color:'amber'},...(c.solved?[{label:'선택한 경우',value:m.current?'조건 만족':'조건 불만족',color:'green'}]:[])],
    verify:(v,m)=>{const expected=v.mode===0||v.mode===2?6-v.k:25;return[m.points.length===expected?null:'independent count'].filter(Boolean);}
  });
  add('misread',{
    id:'misread-graphs',tier:'advanced',title:'잘못 그린 그래프에서 복원',
    vars:{a:V('민수가 본 기울기',2,1,3),b:V('지수가 본 y절편',1,-4,4)},
    model:v=>({a:v.a,b:v.b,wrongB:v.b+3,wrongA:-v.a}),focus:(v,m)=>M.box([p(-2,m.a*-2+m.wrongB),p(2,m.a*2+m.wrongB),p(-2,m.wrongA*-2+m.b),p(2,m.wrongA*2+m.b),p(0,m.b)],{pad:2}),
    question:(v,m)=>`민수는 y절편만 잘못 보아 $y=${eq(m.a,m.wrongB)}$를, 지수는 기울기만 잘못 보아 $y=${eq(m.wrongA,m.b)}$를 그렸습니다. 원래 식을 구하세요.`,
    steps:(v,m)=>['민수는 y절편만 잘못 보았으므로 기울기는 맞게 보았습니다.',`원래 기울기는 민수의 그래프에서 $a=${m.a}$입니다.`,'지수는 기울기만 잘못 보았으므로 y절편은 맞게 보았습니다.',`지수의 y절편 $b=${m.b}$와 합치면 $y=${eq(m.a,m.b)}$입니다.`],
    answer:(v,m)=>givenLine(m.a,m.b),
    draw:(b,v,m,c)=>{M.line(b,m.a,m.wrongB,{color:'sky',dash:[6,3]});M.line(b,m.wrongA,m.b,{color:'rose',dash:[6,3]});if(c.step>=2)M.riseRun(b,p(0,m.wrongB),p(1,m.wrongB+m.a),{color:'sky'});point(b,p(0,m.b),'B','rose');if(c.step>=3)M.line(b,m.a,m.b,{color:'green',width:4});},
    voice:['두 사람이 잘못 본 부분을 구분해요.','각 그래프에서 맞게 본 조건을 남겨요.','민수의 기울기는 정확해요.','지수의 y절편은 정확해요.','맞는 기울기와 절편을 합쳐요.','원래 직선의 식을 복원했어요.']
  });
  add('cost',{
    id:'cost-comparison',tier:'advanced',title:'어느 요금이 유리할까?',aspect:'free',axes:{xLabel:'개수',yLabel:'비용(백원)'},
    vars:{a:V('A의 한 개 가격(원)',500,300,600,50),b:V('B의 한 개 가격(원)',200,100,250,50),fee:V('B의 배송비(원)',2500,1000,3000,500),count:V('비교할 개수',10,0,80)},
    model:v=>{const x=v.fee/(v.a-v.b),first=Math.floor(x+1e-10)+1;return{x,first,P:p(x,v.a*x/100),A:p(v.count,v.a*v.count/100),B:p(v.count,(v.b*v.count+v.fee)/100)};},
    focus:(v,m)=>({x:[-3,Math.max(m.first+4,v.count+3)],y:[-v.fee/500,Math.max(m.P.y*1.3,m.A.y,m.B.y,v.fee/100)*1.2]}),
    question:v=>`A에서는 한 개 ${v.a}원, B에서는 한 개 ${v.b}원에 배송비 ${v.fee}원이 듭니다. B가 더 저렴하려면 최소 몇 개를 사야 하나요?`,
    steps:(v,m)=>[`A의 비용은 $${v.a}x$, B의 비용은 $${v.b}x+${v.fee}$원입니다.`,`같은 비용이 되는 교점은 $${v.a}x=${v.b}x+${v.fee}$에서 $x=${f(m.x)}$입니다.`,'B는 단가가 더 작으므로 교점 오른쪽에서 비용이 더 작습니다.',`같은 비용인 경우를 제외하고 자연수 조건을 적용하면 최소 ${m.first}개입니다.`],
    answer:(v,m)=>`최소 ${m.first}개`,
    draw:(b,v,m,c)=>{M.curve(b,x=>v.a*x/100,{from:0});M.curve(b,x=>(v.b*x+v.fee)/100,{from:0,color:'rose'});point(b,m.A,'A','sky');point(b,m.B,'B','rose');b.seg(m.A,m.B,{color:'amber',width:3});if(c.step>=2){point(b,m.P,'동일 비용','green');M.projection(b,m.P);}},
    readouts:(v,m)=>[{label:'A 비용',value:`${v.a*v.count}원`,color:'sky'},{label:'B 비용',value:`${v.b*v.count+v.fee}원`,color:'rose'}],
    verify:(v,m)=>[v.b*m.first+v.fee<v.a*m.first?null:'minimum not cheaper',m.first>1&&v.b*(m.first-1)+v.fee<v.a*(m.first-1)?'previous already cheaper':null].filter(Boolean)
  });
  add('system-parameters',{
    id:'system-parameters',tier:'advanced',title:'공통해로 미지 계수 찾기',
    vars:{S:V('첫 식의 우변',5,5,11),D:V('둘째 식의 우변',1,1,7),K:V('계수식의 우변',10,10,20),trial:V('움직여 볼 a',2,0.5,10,0.5)},
    model:v=>{const x=(v.S+v.D)/3,y=v.S-x;return{P:p(x,y),a:(v.K-y)/x};},
    focus:(v,m)=>M.box([m.P,p(0,v.S),p(0,-v.D),p(0,v.K)],{pad:2}),
    question:v=>`$x+y=${v.S}$, $2x-y=${v.D}$의 공통해가 $ax+y=${v.K}$도 만족합니다. a를 구하세요.`,
    steps:(v,m)=>[`앞의 두 식을 더하면 $3x=${v.S+v.D}$입니다.`,`따라서 공통해는 $${xy(m.P)}$입니다.`,`공통해를 마지막 식에 넣으면 $${f(m.P.x)}a+${f(m.P.y)}=${v.K}$입니다.`,`이 식을 풀면 $a=${f(m.a)}$입니다.`],
    answer:(v,m)=>`$a=${f(m.a)}$`,
    draw:(b,v,m,c)=>{M.line(b,-1,v.S);M.line(b,2,-v.D,{color:'rose'});M.line(b,-v.trial,v.K,{color:'amber',dash:[5,4]});point(b,m.P,'P','green');if(c.step>=3)M.line(b,-m.a,v.K,{color:'green'});},
    verify:(v,m)=>[near(m.P.x+m.P.y,v.S)?null:'sum condition',near(2*m.P.x-m.P.y,v.D)?null:'difference condition',near(m.a*m.P.x+m.P.y,v.K)?null:'parameter condition'].filter(Boolean)
  });
  add('system-model',{
    id:'system-model',title:'문장의 두 조건을 두 직선으로',
    vars:{score:V('농구에서 얻은 총점',53,41,59),percent:V('혼합 소금물 목표 농도(%)',8,6,9)},state:{mode:0},
    presets:[{label:'2점 슛과 3점 슛',values:{mode:0}},{label:'두 농도의 소금물',values:{mode:1}}],
    model:v=>{const total=v.mode?500:20,c1=v.mode?5:2,c2=v.mode?10:3,value=v.mode?v.percent*500:v.score,y=(value-c1*total)/(c2-c1),x=total-y;return{total,c1,c2,value,P:p(x,y)};},
    axes:v=>v.mode?{xLabel:'5% 소금물(g)',yLabel:'10% 소금물(g)'}:{xLabel:'2점 슛 개수',yLabel:'3점 슛 개수'},
    focus:(v,m)=>({x:[-m.total*0.15,m.total*1.2],y:[-m.total*0.15,m.total*1.2]}),
    question:v=>v.mode?`5%와 10% 소금물을 섞어 ${v.percent}% 소금물 500 g을 만듭니다. 각각 몇 g을 섞어야 하나요?`:`2점 슛과 3점 슛을 합하여 20골, 총 ${v.score}점입니다. 각각 몇 골을 넣었나요?`,
    steps:(v,m)=>[`두 양을 x,y로 놓으면 전체 양 조건은 $x+y=${m.total}$입니다.`,v.mode?`소금의 양 조건은 $0.05x+0.10y=${v.percent/100}\\times500$입니다.`:`점수 조건은 $2x+3y=${v.score}$입니다.`,`두 직선의 공통해는 $${xy(m.P)}$입니다.`,v.mode?`5% 소금물 ${f(m.P.x)} g, 10% 소금물 ${f(m.P.y)} g을 섞습니다.`:`2점 슛 ${m.P.x}골, 3점 슛 ${m.P.y}골입니다.`],
    answer:(v,m)=>v.mode?`5%: ${f(m.P.x)} g, 10%: ${f(m.P.y)} g`:`2점 슛 ${m.P.x}골, 3점 슛 ${m.P.y}골`,
    draw:(b,v,m,c)=>{M.line(b,-1,m.total);M.line(b,-m.c1/m.c2,m.value/m.c2,{color:'rose'});point(b,m.P,'P','amber');if(c.step>=2)M.projection(b,m.P,{color:'amber'});},
    notes:()=>['각 직선은 문장의 한 조건을 나타냅니다. 교점은 두 조건을 동시에 만족하는 실제 양입니다.'],
    verify:(v,m)=>[near(m.P.x+m.P.y,m.total)?null:'total amount',near(m.c1*m.P.x+m.c2*m.P.y,m.value)?null:'weighted amount',m.P.x>=0&&m.P.y>=0?null:'negative quantity'].filter(Boolean)
  });
  function walks(x,y) {
    const out=[];
    const visit=(a,b,path)=>{if(a===0&&b===0){out.push(path);return;}for(const n of [1,3,5])if(n<=a)visit(a-n,b,[...path,p(n,0)]);if(b>=2)visit(a,b-2,[...path,p(0,2)]);};
    visit(x,y,[]);return out;
  }
  add('coordinate-walk',{
    id:'coordinate-walk',tier:'advanced',title:'좌표 이동과 경로의 수',
    vars:{x:V('도착점의 x좌표',3,1,5),phase:V('가능한 경로 둘러보기(%)',0,0,100,5)},
    model:v=>{const paths=walks(v.x,2),index=Math.round((paths.length-1)*v.phase/100),route=paths[index],points=[O];for(const d of route){const last=points[points.length-1];points.push(p(last.x+d.x,last.y+d.y));}const groups={};for(const path of paths){const key=path.filter(d=>d.x>0).map(d=>d.x).join('+');groups[key]=(groups[key]||0)+1;}return{paths,index,route,points,groups,target:p(v.x,2)};},
    focus:{x:[-1,7],y:[-2,6]},
    question:v=>`주사위의 눈이 홀수이면 그 수만큼 오른쪽으로, 짝수이면 그 수만큼 위로 이동합니다. 원점에서 $(${v.x},2)$에 도착하는 눈의 순서는 몇 가지인가요?`,
    steps:(v,m)=>['위로 이동한 합이 2이므로 짝수 눈은 2가 한 번만 나와야 합니다.',`오른쪽 이동의 합이 ${v.x}이 되도록 1,3,5를 순서대로 나열합니다.`,`각 가로 이동 순서에 2를 끼워 넣는 위치를 셉니다: ${Object.entries(m.groups).map(([k,c])=>`${k} → ${c}가지`).join('; ')}.`,`모든 경우를 더하면 ${m.paths.length}가지입니다.`],
    answer:(v,m)=>`${m.paths.length}가지`,
    draw:(b,v,m,c)=>{b.path(m.points,{color:'amber',width:4});m.points.forEach((P,i)=>point(b,P,i===0?'O':i===m.points.length-1?'도착':String(i),'amber'));point(b,m.target,'','green');M.projection(b,m.target,{color:'muted'});},
    readouts:(v,m,c)=>[{label:'보는 눈의 순서',value:m.route.map(d=>d.x||d.y).join(' → '),color:'amber'},...(c.solved?[{label:'경로 번호',value:`${m.index+1} / ${m.paths.length}`,color:'green'}]:[])],
    verify:(v,m)=>[...m.paths.map(path=>{const x=path.reduce((s,d)=>s+d.x,0),y=path.reduce((s,d)=>s+d.y,0);return x===v.x&&y===2&&path.every(d=>(d.x===0&&d.y===2)||([1,3,5].includes(d.x)&&d.y===0))?null:'invalid route';}),new Set(m.paths.map(path=>path.map(d=>d.x||d.y).join(','))).size===m.paths.length?null:'duplicate routes'].filter(Boolean)
  });
  add('travel-budget',{
    id:'travel-budget',tier:'advanced',title:'시간 안에 다녀올 수 있는 거리',aspect:'free',axes:{xLabel:'한쪽 거리(km)',yLabel:'전체 시간(시간)'},
    vars:{out:V('갈 때 속력(km/h)',3,3,6),back:V('올 때 속력(km/h)',4,4,8),limit:V('허용 전체 시간(h)',6,3,6),rest:V('쉬는 시간(h)',1.5,0.5,1.5,0.5),x:V('비교할 한쪽 거리(km)',5,0,15,0.5)},
    model:v=>{const a=1/v.out+1/v.back,max=(v.limit-v.rest)/a;return{a,max,P:p(max,v.limit),current:p(v.x,a*v.x+v.rest)};},
    focus:(v,m)=>({x:[-1,Math.max(m.max,v.x)*1.25+1],y:[-1,Math.max(v.limit,m.current.y)*1.25+0.5]}),
    question:v=>`갈 때 시속 ${v.out} km, 올 때 시속 ${v.back} km로 걷고 ${f(v.rest)}시간을 쉽니다. 총 ${v.limit}시간 이내로 다녀오려면 한쪽 거리는 몇 km 이하여야 하나요?`,
    steps:(v,m)=>[`한쪽 거리를 x km라 하면 갈 때 시간은 $x/${v.out}$, 올 때 시간은 $x/${v.back}$입니다.`,`전체 시간은 $y=${f(m.a)}x+${f(v.rest)}$입니다.`,`허용 시간과 만나는 곳은 $${f(m.a)}x+${f(v.rest)}=${v.limit}$입니다.`,`시간은 거리에 따라 늘어나므로 $0\\le x\\le${f(m.max)}$ km입니다.`],
    answer:(v,m)=>`한쪽 거리 $${f(m.max)}$ km 이하`,
    draw:(b,v,m,c)=>{M.curve(b,x=>m.a*x+v.rest,{from:0});b.hline(v.limit,{color:'rose',width:3});point(b,m.current,'현재','amber');M.projection(b,m.current);if(c.step>=2){point(b,m.P,'경계','green');M.projection(b,m.P,{color:'green'});}if(c.solved)b.seg(O,p(m.max,0),{color:'green',width:5});},
    readouts:(v,m)=>[{label:'현재 거리의 왕복·휴식 시간',value:`$${f(m.current.y)}$시간`,color:'amber'}],
    verify:(v,m)=>[near(m.max/v.out+m.max/v.back+v.rest,v.limit)?null:'time boundary',m.max>0?null:'empty feasible domain'].filter(Boolean)
  });
  // The following subtypes require different reasoning from direct area evaluation.
  SOURCES['area-to-equation']=[
    'archive/exams/original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js#q12@12',
    'archive/exams/original/middle/m2/1final/25_왕의중_1학기_기말_중2_기출.js#q21@21',
    'archive/exams/original/middle/m2/1final/24_승평중_1학기_기말_중2_기출.js#q22@22'
  ];
  add('area-to-equation',{
    id:'area-to-equation',tier:'advanced',title:'넓이 조건에서 식을 거꾸로',
    vars:{H:V('y절편의 높이',6,3,6),S:V('주어진 넓이',15,12,30,3)},state:{mode:1},
    presets:[{label:'두 직선과 x축',values:{mode:1}},{label:'한 직선과 두 축',values:{mode:0}}],
    model:v=>{const totalBase=2*v.S/v.H,r=v.mode?totalBase-v.H/2:totalBase,A=p(-r,0),B=v.mode?p(v.H/2,0):O,C=p(0,v.H),a=v.H/r;return{totalBase,r,A,B,C,a};},
    focus:(v,m)=>M.box([m.A,m.B,m.C],{pad:2}),
    question:v=>v.mode?`$y=ax+${v.H}$, $y=-2x+${v.H}$와 x축으로 둘러싸인 삼각형의 넓이가 ${v.S}이고 a>0입니다. a를 구하세요.`:`$y=ax+${v.H}$와 두 좌표축이 둘러싼 삼각형의 넓이가 ${v.S}이고 a>0입니다. a를 구하세요.`,
    steps:(v,m)=>[`높이가 ${v.H}이므로 전체 밑변은 $2\\times${v.S}\\div${v.H}=${f(m.totalBase)}$입니다.`,v.mode?`알고 있는 직선의 양의 x절편은 $${v.H}\\div2=${f(v.H/2)}$입니다.`:'a>0이고 y절편이 양수이므로 x절편은 음수입니다.',`미지 직선의 음의 x절편은 $-${f(m.r)}$입니다.`,`두 절편으로 기울기를 구하면 $a=\\frac{${v.H}}{${f(m.r)}}=${f(m.a)}$입니다.`],
    answer:(v,m)=>`$a=${f(m.a)}$, $y=${eq(m.a,v.H)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,[m.A,m.B,m.C]);M.line(b,m.a,v.H);if(v.mode)M.line(b,-2,v.H,{color:'rose'});pts(b,[[m.A,'A','amber'],[m.B,'B','rose'],[m.C,'C','green']]);if(c.step>=2){b.seg(m.A,m.B,{color:'amber',width:4});b.seg(O,m.C,{color:'green',width:3,dash:[4,3]});}},
    verify:(v,m)=>[near(area([m.A,m.B,m.C]),v.S)?null:'given area',near(m.a*m.A.x+v.H,0)?null:'unknown line intercept',m.r>0?null:'invalid sign condition'].filter(Boolean),
    voice:['이번에는 넓이가 먼저 주어졌어요.','알고 있는 높이로 전체 밑변을 구해요.','알고 있는 절편 부분을 빼요.','남은 길이에서 음의 절편을 읽어요.','두 절편으로 기울기를 구해요.','구한 식으로 넓이를 다시 확인해요.']
  });
  SOURCES['quadrant-parameter-range']=[
    'archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js#q13@13',
    'archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js#q14@14'
  ];
  add('quadrant-parameter-range',{
    id:'quadrant-parameter-range',tier:'advanced',title:'지나지 않는 사분면과 범위',
    vars:{k:V('관찰할 k',-1,-5,4,0.5)},
    model:v=>({a:v.k-2,b:-3-v.k,allowed:v.k>=-3&&v.k<2}),
    focus:{x:[-7,7],y:[-9,9]},
    question:()=>'$y=(k-2)x-(3+k)$가 일차함수이고 제1사분면을 지나지 않도록 하는 k의 범위를 구하세요.',
    steps:()=>['제1사분면을 지나지 않는 일차함수는 기울기가 음수이고 y절편은 0 이하입니다.','기울기 조건 $k-2<0$에서 $k<2$입니다.','절편 조건 $-(3+k)≤0$에서 $k≥-3$입니다.','두 조건을 함께 만족하는 범위는 $-3≤k<2$입니다.'],
    answer:()=>'$-3\\le k<2$',
    draw:(b,v,m,c)=>{M.polygon(b,[O,p(7,0),p(7,9),p(0,9)],{fill:'rose',color:'rose',fillAlpha:0.06,width:0.5});M.label(b,p(4,6),'제1사분면',{color:'rose'});M.line(b,m.a,m.b);point(b,p(0,m.b),'B','amber');if(c.step>=2)M.label(b,p(-4,6),m.a===0?'기울기 0':'기울기 '+n(m.a),{size:13});},
    readouts:(v,m)=>[{label:'현재 기울기',value:`$${f(m.a)}$`,color:'sky'},{label:'현재 y절편',value:`$${f(m.b)}$`,color:'amber'}],
    notes:()=>['k=2에서는 상수함수이므로 제외합니다. k=-3이면 원점을 지나는 내려가는 직선이라 포함합니다.'],
    verify:(v,m)=>[m.allowed===(m.a<0&&m.b<=0)?null:'combined inequalities'].filter(Boolean)
  });
  SOURCES['intersection-parameter']=[
    'archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js#q20@20'
  ];
  add('intersection-parameter',{
    id:'intersection-parameter',tier:'advanced',title:'교점이 제2사분면에 있으려면',
    vars:{m:V('움직여 볼 m',-1.5,-4,2,0.25)},
    presets:[{label:'왼쪽 경계: 평행',values:{m:-2}},{label:'제2사분면 교점',values:{m:-1.5}},{label:'오른쪽 경계: x축',values:{m:-1}}],
    model:v=>({P:near(v.m,-2)?null:p(-2/(v.m+2),4/(v.m+2)-4),allowed:v.m>-2&&v.m<-1}),
    focus:(v,m)=>M.box([p(-2,0),p(0,-4),p(0,-2),m.P],{pad:2}),
    question:()=>'$2x+y+4=0$과 $mx-y-2=0$의 교점이 제2사분면 위에 있도록 하는 m의 범위를 구하세요.',
    steps:()=>['두 식을 같게 놓으면 $(m+2)x=-2$입니다.','교점의 x<0이려면 m+2>0, 즉 m>-2입니다.','첫 직선에서 y>0이려면 x<-2입니다. 양수 m+2를 곱하면 0<m+2<1입니다.','따라서 -2<m<-1입니다. 두 경계에서는 평행하거나 교점이 축 위에 있습니다.'],
    answer:()=>'$-2<m<-1$',
    draw:(b,v,m,c)=>{M.line(b,-2,-4);M.line(b,v.m,-2,{color:'rose'});point(b,p(-2,0),'경계','muted');if(m.P){point(b,m.P,'P','amber');if(c.step>=2)M.projection(b,m.P,{color:'amber'});}else M.label(b,p(-2,3),'두 직선이 평행해요',{color:'amber'});},
    readouts:(v,m)=>[{label:'관찰 중 교점',value:m.P?`$${xy(m.P)}$`:'교점 없음',color:'amber'}],
    verify:(v,m)=>[m.P&&!near(2*m.P.x+m.P.y+4,0)?'first equation':null,m.P&&!near(v.m*m.P.x-m.P.y-2,0)?'second equation':null,m.allowed!==!!(m.P&&m.P.x<0&&m.P.y>0)?'quadrant condition':null].filter(Boolean)
  });
  SOURCES['area-cancellation']=[
    'archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js#q23@23'
  ];
  add('area-cancellation',{
    id:'area-cancellation',tier:'advanced',title:'변하는데 밑변은 일정하다?',
    vars:{S:V('삼각형의 넓이',140,112,196,14)},
    model:v=>{const a=v.S/14-4,b=a*a+18*a,P=p(a,2*a),B=p(a,-8),A=p(a+14,-8);return{a,b,P,A,B,slope:-(a+4)/7,intercept:b/7,height:2*a+8};},
    focus:(v,m)=>M.box([m.P,m.A,m.B],{pad:2}),
    question:v=>`$(a+4)x+7y-b=0$이 $(a,2a)$를 지나며 a>0입니다. 이 직선과 $x=a$, $y=-8$이 둘러싼 삼각형의 넓이가 ${v.S}일 때 a,b를 구하세요.`,
    steps:(v,m)=>['세로 높이는 $2a+8=2(a+4)$이고 기울기의 크기는 $(a+4)/7$입니다.','가로 길이는 $2(a+4)÷((a+4)/7)=14$로 일정합니다.',`넓이는 $\\frac12×14×2(a+4)=14(a+4)=${v.S}$이므로 $a=${m.a}$입니다.`,`점 $(a,2a)$를 원래 식에 대입하면 $b=a(a+4)+14a=a^2+18a=${m.b}$입니다.`],
    answer:(v,m)=>`$a=${m.a},\\quad b=${m.b}$`,
    draw:(b,v,m,c)=>{M.polygon(b,[m.P,m.A,m.B]);M.line(b,m.slope,m.intercept);b.vline(m.a,{color:'rose',width:2});b.hline(-8,{color:'rose',width:2});pts(b,[[m.P,'P','green'],[m.A,'A','amber'],[m.B,'B','amber']]);if(c.step>=2){b.seg(m.A,m.B,{color:'amber',width:4});b.seg(m.B,m.P,{color:'green',width:4});M.label(b,p((m.A.x+m.B.x)/2,-8),'14',{dy:21,color:'amber'});}},
    verify:(v,m)=>[near(area([m.P,m.A,m.B]),v.S)?null:'area',near((m.a+4)*m.P.x+7*m.P.y-m.b,0)?null:'given point',near((m.a+4)*m.A.x+7*m.A.y-m.b,0)?null:'lower intersection',near(m.A.x-m.B.x,14)?null:'constant base'].filter(Boolean),
    voice:['점의 좌표가 a에 따라 달라져요.','세로 높이부터 a로 나타내요.','기울기와 높이의 같은 인수를 찾아요.','약분하면 가로 길이는 14예요.','넓이 조건으로 a를 먼저 구해요.','점의 조건에 넣어 b까지 구해요.']
  });
  SOURCES['area-integer-condition']=[
    'archive/exams/original/middle/m2/1final/23_매산중_1학기_기말_중2_수학.js#q24@24'
  ];
  add('area-integer-condition',{
    id:'area-integer-condition',tier:'advanced',title:'넓이 조건과 정수 매개변수',
    vars:{c:V('공통 y절편',1,-2,2),bound:V('넓이의 상한',6,2,12,2),m:V('움직일 수평선 y=m',2,-7,7)},
    model:v=>{const height=Math.abs(v.m-v.c),A=p((v.m-v.c)/3,v.m),B=p(v.c-v.m,v.m),P=p(0,v.c),S=2*height*height/3,ints=[];for(let m=v.c-5;m<=v.c+5;m++){const h=Math.abs(m-v.c);if(h>0&&2*h*h/3<v.bound)ints.push(m);}return{A,B,P,height,S,ints,sum:ints.reduce((a,b)=>a+b,0),maxHeight:Math.max(...ints.map(m=>Math.abs(m-v.c)))};},
    focus:(v,m)=>M.box([m.A,m.B,m.P],{pad:2}),
    question:v=>`$y=3x${v.c>=0?'+':''}${v.c}$, $y=-x${v.c>=0?'+':''}${v.c}$, $y=m$이 삼각형을 이루고 넓이가 ${v.bound} 미만입니다. 모든 정수 m의 합을 구하세요.`,
    steps:(v,m)=>[`두 기울기 직선의 교점은 $(0,${v.c})$입니다. 수평선까지의 거리를 h라고 합시다.`,'기울기에서 밑변은 h/3+h=4h/3, 넓이는 2h²/3입니다.',`h가 자연수이므로 차례로 대입하면 가능한 높이는 $1,\\ldots,${m.maxHeight}$입니다. h=0에서는 삼각형이 되지 않습니다.`,`가능한 정수 m은 $${m.ints.join(',')}$이므로 합은 ${m.sum}입니다.`],
    answer:(v,m)=>`$m=${m.ints.join(',')}$, 합 $${m.sum}$`,
    draw:(b,v,m,c)=>{M.polygon(b,[m.P,m.A,m.B]);M.line(b,3,v.c);M.line(b,-1,v.c,{color:'rose'});b.hline(v.m,{color:'amber',width:3});pts(b,[[m.P,'P','green'],[m.A,'A','amber'],[m.B,'B','amber']]);if(c.step>=2)b.seg(m.P,p(0,v.m),{color:'green',width:3,dash:[4,3]});},
    readouts:(v,m,c)=>[{label:'현재 수평선',value:`$m=${v.m}$`,color:'amber'},...(c.step>=2?[{label:'현재 도형의 넓이',value:`$${f(m.S)}$${m.height===0?' (삼각형 아님)':''}`,color:'green'}]:[])],
    notes:()=>['이차부등식의 해법을 사용하지 않고 정수 높이별 넓이를 비교합니다. 높이가 0인 퇴화한 도형은 제외합니다.'],
    verify:(v,m)=>[near(area([m.P,m.A,m.B]),m.S)?null:'height area',m.ints.every(k=>k!==v.c&&2*Math.abs(k-v.c)**2/3<v.bound)?null:'integer condition',near(m.sum,2*m.maxHeight*v.c)?null:'symmetric integer sum'].filter(Boolean)
  });
  SOURCES['parallel-area']=[
    'archive/exams/original/middle/m2/1final/21_매산중_1학기_기말_중2_수학.js#q23@23'
  ];
  add('parallel-area',{
    id:'parallel-area',tier:'advanced',title:'평행이동 전후 넓이의 차',
    vars:{a:V('공통 기울기',2,1,4),b:V('처음 y절편',8,6,10),drop:V('아래로 이동한 양',4,1,5)},
    model:v=>{const low=v.b-v.drop,A=p(-v.b/v.a,0),B=p(-low/v.a,0),C=p(0,low),D=p(0,v.b),outer=v.b*v.b/(2*v.a),inner=low*low/(2*v.a);return{low,A,B,C,D,outer,inner,poly:[A,B,C,D],S:outer-inner};},
    focus:(v,m)=>M.box([O,m.A,m.B,m.C,m.D],{pad:2}),
    question:v=>`$y=${eq(v.a,v.b)}$를 아래로 ${v.drop}만큼 평행이동합니다. 두 직선과 두 좌표축 사이에 생기는 색칠한 사각형의 넓이를 구하세요.`,
    steps:(v,m)=>[`이동한 직선은 $y=${eq(v.a,m.low)}$입니다.`,`큰 축 삼각형의 넓이는 $\\frac12\\times${f(v.b/v.a)}\\times${v.b}=${f(m.outer)}$입니다.`,`작은 축 삼각형의 넓이는 $\\frac12\\times${f(m.low/v.a)}\\times${m.low}=${f(m.inner)}$입니다.`,`색칠한 넓이는 큰 넓이에서 작은 넓이를 빼서 $${f(m.S)}$입니다.`],
    answer:(v,m)=>`넓이 $${f(m.S)}$`,
    draw:(b,v,m,c)=>{M.polygon(b,m.poly);M.line(b,v.a,v.b);M.line(b,v.a,m.low,{color:'rose'});m.poly.forEach((P,i)=>point(b,P,'ABCD'[i],i<2?'amber':'green'));if(c.step>=2)M.polygon(b,[O,m.A,m.D],{fillAlpha:0,color:'muted',dash:[4,3]});},
    verify:(v,m)=>[near(area(m.poly),m.S)?null:'area difference',m.low>0?null:'intercept order'].filter(Boolean)
  });
  M.register({id:'g8-linear-functions',title:'일차함수와 그래프',course:'g8',courseName:'중2',unit:'일차함수와 그래프',description:'Archive 기출의 함수·직선·연립조건을 개념, 기본, 심화로 연결합니다.',scenes});
})();
