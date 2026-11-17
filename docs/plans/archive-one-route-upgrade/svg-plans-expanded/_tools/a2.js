const L=require('./lib.js');
const out=[];
// ---- 복성고 q14: f∘f = 2
{
 const ex='original/high/h1/2mid/19_복성고_2학기_중간_고1_기출';
 const p={capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',
  pieces:[{coefficients:['3','3']},{coefficients:['3','-1']}],
  breakpoints:[{x:'0',y:'3'}],
  sourceDomain:{kind:'INTERVAL',range:['-1','3'],states:['CLOSED','CLOSED']},
  requiredPoints:[{id:'V',x:'0',y:'3'},{id:'P',x:'-1/3',y:'2'},{id:'Q',x:'1',y:'2'},{id:'R',x:'-2/3',y:'1'},{id:'T',x:'2',y:'1'}],
  exactCoordinates:{V:['0','3'],P:['-1/3','2'],Q:['1','2'],R:['-2/3','1'],T:['2','1']},
  axisTickValues:{x:[],y:[]},
  referenceLines:[{id:'h',y:'2',intersectionX:['-1/3','1']},{id:'k',y:'1',intersectionX:['-2/3','2']}]},
  caption:'f(f(x))=2이면 먼저 f(t)=2에서 t=-1/3 또는 t=1이다(y=2와의 교점 P, Q). 따라서 f(x)=-1/3 또는 f(x)=1이다. f의 치역은 [0,3]이라 f(x)=-1/3은 해가 없고(정의역 밖), f(x)=1에서 x=-2/3, x=2(y=1과의 교점 R, T)이다. 구하는 곱은 (-2/3)·2=-4/3이다 (정답 ④).',
  sourceConditions:L.src(ex,14,'y=2, y=1과의 교점 좌표를 모두 표시하여 합성함수의 역추적 단계를 보인다.'),
  newVisualInformation:['y=2와의 교점 P(-1/3,2), Q(1,2); y=1과의 교점 R(-2/3,1), T(2,1); 곱 -4/3']};
 out.push([ex+'/q14-solution.json',p]);
}
// ---- 팔마고 q16
{
 const ex='original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II';
 const p={capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',
  pieces:[{coefficients:['0','6','-1']}],breakpoints:[],
  sourceDomain:{kind:'INTERVAL',range:['0','6'],states:['CLOSED','CLOSED']},
  requiredPoints:[{id:'V',x:'3',y:'9'},{id:'P',x:'19/4',y:'95/16'}],
  exactCoordinates:{V:['3','9'],P:['19/4','95/16']},
  axisTickValues:{x:['6'],y:[]},
  referenceLines:[{id:'l',slope:'5/4',intercept:'0',intersectionX:['0','19/4']}],
  regions:[{id:'S1',upper:'f',lower:'l',from:'0',to:'19/4',fill:'LIGHT',label:'S_1'},{id:'S2',upper:'l',lower:'axis',from:'0',to:'19/4',fill:'MEDIUM',label:'S_2'},{id:'S3',upper:'f',lower:'axis',from:'19/4',to:'6',fill:'MEDIUM',label:'S_3'}]},
  caption:'곡선 y=-x²+6x와 x축으로 둘러싸인 전체 넓이는 ∫₀⁶(-x²+6x)dx=36이다. 직선 y=mx와의 교점을 x=b라 하면 b=6-m이고, 직선 위쪽·곡선 아래쪽 넓이는 ∫₀ᵇ(bx-x²)dx=b³/6이다(S₁). 이등분 조건 S₁=S₂+S₃=18에서 b³/6=18, b³=108이므로 (6-m)³=108이다 (정답 ⑤). 그림은 m=5/4(b=19/4)인 표본이며 실제 m은 6-∛108이다.',
  sourceConditions:L.src(ex,16,'직선 아래 영역(S₂+S₃)과 위쪽 영역(S₁)이 각각 18임을 표본 직선으로 보이고 b³/6=18을 읽는다.'),
  newVisualInformation:['S1=b³/6=18, S2+S3=18, 전체 36']};
 out.push([ex+'/q16-solution.json',p]);
}
// ---- 순천여고 q18: 한 주기 [0,3]
{
 const ex='original/high/h2/2final/23_순천여고_2학기_기말_고2_수학II';
 const p={capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',
  pieces:[{coefficients:['0','1']},{coefficients:['4','-3']},{coefficients:['0','-3','1']}],
  breakpoints:[{x:'1',y:'1'},{x:'2',y:'-2'}],
  sourceDomain:{kind:'INTERVAL',range:['0','3'],states:['CLOSED','CLOSED']},
  requiredPoints:[{id:'P',x:'1',y:'1',marker:'NONE'},{id:'Q',x:'2',y:'-2',marker:'NONE'}],
  axisTickValues:{x:['1','4/3','2','3'],y:['1','-2']},axisTitles:{x:'x',y:'g(x)'},
  regions:[{id:'S1',upper:'f',lower:'axis',from:'0',to:'1',fill:'LIGHT',label:'S_1'},{id:'S2',upper:'f',lower:'axis',from:'1',to:'4/3',fill:'MEDIUM',label:'S_2'},{id:'S3',upper:'axis',lower:'f',from:'4/3',to:'2',fill:'LIGHT',label:'S_3'},{id:'S4',upper:'axis',lower:'f',from:'2',to:'3',fill:'MEDIUM',label:'S_4'}]},
  caption:'g(x)=f(x)/a의 한 주기 [0,3]이다(부호는 x=4/3에서 바뀐다). 넓이는 S₁=1/2, S₂=1/6, S₃=2/3, S₄=7/6이므로 ∫₀³|g|=5/2이고, 주기 3에 의해 [3,5]는 [0,2]와 같아 ∫₃⁵|g|=S₁+S₂+S₃=4/3이다. 따라서 ∫₀⁵|f|dx=a(5/2+4/3)=23a/6=23에서 a=6이다 (정답 ②).',
  sourceConditions:L.src(ex,18,'한 주기의 네 영역 넓이와 남은 구간 [3,5]≡[0,2]를 합하여 23a/6을 만든다.'),
  newVisualInformation:['S1=1/2, S2=1/6, S3=2/3, S4=7/6, 합 5/2, [3,5]≡[0,2] 합 4/3']};
 out.push([ex+'/q18-solution.json',p]);
}
// ---- 강남여고 미적분I q12: 접선 기울기 세 경우 (composite, 평면 패널)
{
 const ex='original/high/h2/2mid/26_강남여고_2학기_중간_고2_미적분I';
 const tang=(label,dy)=>L.plane({
  pts:{O:[0,0],L:[-2,-dy],R:[2,dy],U:[-2,0],V:[2,0]},hidden:['O','L','R','U','V'],
  segs:[{id:'tangent',refs:['L','R']},...(dy!==0?[{id:'horizontal',refs:['U','V'],dashed:true}]:[])],
  canvas:{width:400,height:320},
  panel:true});
 const mk=(label,dy)=>{const p=tang(label,dy);p.hiddenPointStyle='NONE';return p;};
 const p=L.composite([
  ['x=0, b: f′>0 (올라감)',mk('',1)],
  ['x=c: f′=0 (수평)',mk('',0)],
  ['x=a: f′<0 (내려감)',mk('',-1)],
 ],'접선이 오른쪽으로 올라가면 f′>0, 수평이면 f′=0, 내려가면 f′<0이다(그림은 접선 방향 모형이며 실제 접점 위치나 기울기 크기를 뜻하지 않는다). 그래프에서 f′(0)>0, f′(a)<0, f′(b)>0, f′(c)=0이므로 ② f′(a)f′(b)<0만 참이다(① f′(0)f′(a)<0, ③ f′(c)=0, ④·⑤는 곱이 0) (정답 ②).',
  L.src(ex,12,'x=0,b / c / a에서 접선 방향과 도함수 부호를 세 패널로 비교한다.'));
 out.push([ex+'/q12-solution.json',p]);
}
for(const [rel,p] of out){console.log(L.write(rel,p).slice(-70));}
