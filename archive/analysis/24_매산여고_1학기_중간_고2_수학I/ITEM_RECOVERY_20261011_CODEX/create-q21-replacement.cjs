const fs=require('fs'),vm=require('vm');
const jsPath='archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js';
const svgPath='archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution.svg';
const source=fs.readFileSync(jsPath,'utf8');
const context={window:{}};vm.runInNewContext(source,context,{filename:jsPath});
const bank=context.window.questionBank||context.window.questions;
const q=structuredClone(bank.find(x=>Number(x.id)===21));
if(!q || q.questionUid!=='qid_v1_ba92ec2f949fde56fa87778d5a915793ce3fbc134b658d78867d43b3ad76855e') throw new Error('Q21_IDENTITY_MISMATCH');
Object.assign(q,{
  id:21,
  questionType:'객관식',
  content:'함수 $f(x)=2\\sin\\frac{\\pi x}{2}+1$에 대하여 함수 $h(x)$를 $h(x)=\\frac{f(x-1)+f(x+3)}{2}$로 정의하자. $1\\le x\\le5$일 때, $h(x)$는 $x=a$에서 최댓값 $b$, $x=c$에서 최솟값 $d$를 갖는다. 이때 $ad+bc$의 값을 구하면? (단, $a,b,c,d$는 상수이다.) [4.4점]',
  choices:['$4$','$7$','$8$','$10$','$11$'],
  tags:['객관식','삼각함수','삼각함수의 그래프','그래프'],
  answer:'④',
  solution:'함수 $f$의 주기는 $4$이다. 따라서 $f(x+3)=f((x-1)+4)=f(x-1)$이므로\\n$h(x)=f(x-1)$이다.\\n\\n$u=x-1$이라 하면 $1\\le x\\le5$에서 $0\\le u\\le4$이다.\\n$f(u)=2\\sin\\frac{\\pi u}{2}+1$은 이 구간에서 $u=1$일 때 최댓값 $3$, $u=3$일 때 최솟값 $-1$을 갖는다. 이때 사인값 $1$과 $-1$은 각각 해당 점에서만 얻어진다.\\n\\n$x=u+1$이므로 최댓값은 $x=a=2$에서, 최솟값은 $x=c=4$에서 얻는다. 따라서 $b=3$, $d=-1$이고\\n$ad+bc=2(-1)+3\\cdot4=10$이다.\\n\\n따라서 정답은 ④이다.',
  category:'삼각함수',
  originalCategory:'삼각함수',
  standardCourse:'수학I',
  standardUnitKey:'H15-M1-06',
  standardUnit:'삼각함수의 그래프',
  standardUnitOrder:6,
  subUnitKey:'H15-M1-06-TRIGONOMETRIC_GRAPH',
  subUnit:'삼각함수의 그래프',
  subUnitConfidence:'candidate_evidence',
  subUnitClassificationDepth:'complete_candidate',
  conceptClusterKey:'H15-M1-06-TRIGONOMETRIC_GRAPH',
  problemTypeKey:null,
  templateKey:null,
  crossConceptKeys:[],
  conditionKeys:['COND_RANGE'],
  integrationPattern:'SEQUENTIAL',
  difficultyBucket:3,
  difficultyConfidence:'medium',
  difficultyBoundaryFlag:'NONE',
  legacyLevelCompatibility:'NORMAL',
  solutionImage:'assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution.svg'
});
for(const k of ['itemStatus','itemHoldReason','reviewStatus']) delete q[k];
const start=source.indexOf('\n  {\n    "id": 21,');
const end=source.indexOf('\n  },\n  {\n    "id": 22,',start);
if(start<0||end<0) throw new Error('Q21_OBJECT_BOUNDARY_NOT_FOUND');
const qText=JSON.stringify(q,null,2).split('\n').map(line=>'  '+line).join('\n');
const final=source.slice(0,start+1)+qText+','+source.slice(end+5);
fs.writeFileSync(jsPath,final);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function graphPath(xMin,xMax,left,right,top,bottom){const points=[];for(let i=0;i<=120;i++){const x=xMin+(xMax-xMin)*i/120;const y=2*Math.sin(Math.PI*(x-(xMin===1?1:0))/2)+1;const X=left+(x-xMin)/(xMax-xMin)*(right-left);const Y=bottom-(y+1)/4*(bottom-top);points.push((i?'L':'M')+X.toFixed(2)+' '+Y.toFixed(2));}return points.join(' ')}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 390" width="900" height="390" role="img" aria-label="주기 4인 사인함수와 이동된 구간의 최댓값·최솟값">
<style>text{font-family:"Noto Sans KR","Malgun Gothic",sans-serif;fill:#172033}.title{font-size:23px;font-weight:700}.panelTitle{font-size:18px;font-weight:700}.label{font-size:15px}.small{font-size:13px}.axis{stroke:#334155;stroke-width:1.8}.grid{stroke:#e2e8f0;stroke-width:1}.curve{fill:none;stroke:#2563eb;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.max{fill:#dc2626;stroke:#fff;stroke-width:2}.min{fill:#0f766e;stroke:#fff;stroke-width:2}.panel{fill:#fff;stroke:#cbd5e1;stroke-width:1.5}.shift{stroke:#9333ea;stroke-width:2;stroke-dasharray:6 5;fill:none}</style>
<rect width="900" height="390" fill="#fff"/><text x="30" y="34" class="title">주기 4를 이용해 h(x)의 극값 위치를 옮긴다</text>
<rect x="24" y="54" width="408" height="290" rx="10" class="panel"/><text x="45" y="82" class="panelTitle">f(u)=2 sin(πu/2)+1, 0≤u≤4</text>
<path d="M 78 268 H 405 M 78 112 V 268" class="axis"/><path d="M78 190 H405 M78 151 H405 M78 229 H405" class="grid"/>
${[0,1,2,3,4].map(i=>{const X=78+i/4*327;return `<path d="M${X} 112 V268" class="grid"/><text x="${X-5}" y="291" class="small">${i}</text>`}).join('')}
<text x="397" y="286" class="small">u</text><text x="53" y="119" class="small">y</text><path d="${graphPath(0,4,78,405,112,268)}" class="curve"/>
<circle cx="159.75" cy="112" r="7" class="max"/><text x="128" y="103" class="label">(1,3) 최대</text><circle cx="323.25" cy="268" r="7" class="min"/><text x="287" y="255" class="label">(3,−1) 최소</text>
<text x="52" y="323" class="small">u=1, 3에서만 각각 최댓값·최솟값을 얻는다.</text>
<rect x="468" y="54" width="408" height="290" rx="10" class="panel"/><text x="489" y="82" class="panelTitle">h(x)=f(x−1), 1≤x≤5</text>
<path d="M 522 268 H 849 M 522 112 V 268" class="axis"/><path d="M522 190 H849 M522 151 H849 M522 229 H849" class="grid"/>
${[1,2,3,4,5].map(i=>{const X=522+(i-1)/4*327;return `<path d="M${X} 112 V268" class="grid"/><text x="${X-5}" y="291" class="small">${i}</text>`}).join('')}
<text x="841" y="286" class="small">x</text><text x="497" y="119" class="small">h</text><path d="${graphPath(1,5,522,849,112,268)}" class="curve"/>
<circle cx="603.75" cy="112" r="7" class="max"/><text x="576" y="103" class="label">(2,3) 최대</text><circle cx="767.25" cy="268" r="7" class="min"/><text x="731" y="255" class="label">(4,−1) 최소</text>
<text x="498" y="323" class="small">x=u+1: 극값 위치가 오른쪽으로 1만큼 이동</text>
<path d="M432 196 H468" class="shift"/><text x="420" y="183" class="small">+1</text>
</svg>`;
fs.writeFileSync(svgPath,svg);
console.log(JSON.stringify({jsPath,svgPath,questionCount:bank.length,changedQid:21,answer:q.answer,choices:q.choices},null,2));
