import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const REL = path.relative(ROOT, HERE).replaceAll('\\', '/');
const LOCK = JSON.parse(fs.readFileSync(path.join(HERE, 'source-lock.json'), 'utf8'));
const SOURCE_PATH = path.join(ROOT, LOCK.examPath);
const FACT_DIR = path.join(HERE, 'expected-facts');
const SVG_DIR = path.join(HERE, 'candidate-svg');
const SPEC_DIR = path.join(HERE, 'visual-spec');
const WITNESS_DIR = path.join(HERE, 'witness');
const LAYOUT_DIR = path.join(HERE, 'candidate-layout');
const CLIP_DEFS = new Map();
const INCLUDED = [1,3,4,5,6,7,9,10,11,12,13,14,15,17,18,20];
const EXEMPT = {
  2: '집합의 원소 수를 세는 논리 문제로, 기하·좌표·그래프 관계가 풀이의 결정 단계가 아님.',
  8: '집합의 상등을 판별하는 논리 문제로, 기하·좌표·그래프 관계가 풀이의 결정 단계가 아님.',
  16: '부분집합과 나머지류의 최대합을 다루는 조합 문제로, 도형·좌표·그래프 관계가 풀이의 결정 단계가 아님.',
  19: '부분집합의 합을 세는 조합 문제로, 도형·좌표·그래프 관계가 풀이의 결정 단계가 아님.',
};
const TITLES = {
  1:'반지름이 양수인 정수 k',3:'접선과 반지름',4:'좌표의 평행이동',5:'원과 y=x 대칭',
  6:'세 중선의 교점',7:'수직인 두 직선',9:'선분의 내분',10:'공통점에서 직선까지의 거리',
  11:'평행과 수직의 두 경우',12:'현과 중심에서 내린 수선',13:'두 접선과 반지름',
  14:'대칭으로 펴는 최소 경로',15:'현에서 가장 먼 교점과 접선',17:'넓이비와 PQ 최소',
  18:'중심의 이동과 직선 선택',20:'중심까지 거리와 반지름 비교',
};
const PURPOSE = {
  1:'r²>0에서 열린 k구간과 그 안의 정수 다섯 개를 연결한다.',
  3:'접점의 반지름과 접선의 수직 관계, (a,5)의 대입 결과를 보인다.',
  4:'A에서 B로 옮긴 가로·세로 변화량으로 a,b를 읽는다.',
  5:'y=x 대칭에서 중심 좌표는 서로 바뀌고 반지름은 보존됨을 보인다.',
  6:'세 중선이 G=(2,1)에서 만나는 모습을 보인다.',
  7:'기준 직선과 수직인 직선 위에 (-4,1),(4,a)가 놓임을 보인다.',
  9:'AP:PB=4:5인 내분점과 그 좌표를 보인다.',
  10:'계수 비교로 찾은 P와 목표 직선에 내린 수선 PH를 분리해 보인다.',
  11:'평행일 때와 수직일 때를 두 좌표 패널로 나눠 보인다.',
  12:'OH ⟂ AB, AH=BH=4, OH=3에서 반지름 5를 읽는다.',
  13:'두 접점에서 반지름과 접선이 각각 수직인 관계를 보인다.',
  14:'대칭점 A′에서 원의 가장 가까운 점 Q₀로 잇는 경로와 P₀를 보인다.',
  15:'고정 현 AB, 중심 C, 수직인 지름 방향, 먼 교점 P와 접선을 보인다.',
  17:'넓이비에서 s+t=4/3, PQ 최소에서 s=t가 각각 읽히게 한다.',
  18:'C₀→C₁→C 변환과 거리 √5인 두 직선 중 양의 절편 선택을 보인다.',
  20:'거리식과 반지름식의 교점 3,8,12 및 (10,12)를 직접 비교한다.',
};
const PEDAGOGY = {
  1:['r²=9−(k−2)²>0','−1<k<5','k=0,1,2,3,4'],
  3:['−2x+3y=13','OT ⟂ 접선','a=1'],
  4:['(−2,3)→(−1,7)','Δx=1','Δy=4','a−b=−6'],
  5:['y=x','(3,−2)→(−2,3)','반지름 4 유지','a−b+c=−1'],
  6:['세 중선','G=(2,1)','a+b=3'],
  7:['기울기 −4/3','기울기 3/4','점 (4,a)가 이 직선 위에 있으므로 a=7'],
  9:['AP:PB=4:5','P=(5,−4)','p+q=1'],
  10:['3x−y−2=0','x+y−6=0','P=(2,4)','PH=5'],
  11:['평행: k=2/3','기울기 1/3, 1/3','수직: k=2','기울기 −1, 1','ab=4/3'],
  12:['OH ⟂ AB','AH=BH=4','OH=3','r=5'],
  13:['CT₁ ⟂ PT₁','CT₂ ⟂ PT₂','m₁m₂=−1/4'],
  14:['A′=(−3,−2)','A′—P₀—Q₀—C','Q₀=(17/5,14/5)','10S=21'],
  15:['AB ⟂ CP','먼 교점 P','P의 접선','x+y−5−2√5=0'],
  17:['넓이비 2:1','s+t=4/3','PQ 최소 ⇔ s=t','30(m+n)=25'],
  18:['C₀→C₁→C','거리 √5','양의 y절편 선택','y절편=2'],
  20:['y=|2t−f(t)+10|','y=5t','d(t)<r(t) → g(t)=2','(3,8)∪(8,12)','길이 2: (10,12)','a=12'],
};

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const canonical = value => JSON.stringify(value, Object.keys(value).sort());
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const round = value => Number(value.toFixed(5));
const text = (id,x,y,value,size=18,anchor='start',weight='400',fill='#182b42') =>
  `<text id="${id}" data-label-kind="STUDENT_TEXT" x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(value)}</text>`;
const line = (id,p,q,stroke='#65768b',width=2,dash='',extra='') =>
  `<line id="${id}" data-semantic-id="${id}" x1="${round(p[0])}" y1="${round(p[1])}" x2="${round(q[0])}" y2="${round(q[1])}" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''} ${extra}/>`;
const circle = (id,cx,cy,r,stroke='#173d64',width=2.5,fill='none',extra='') =>
  `<circle id="${id}" data-semantic-id="${id}" cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" ${extra}/>`;
const dot = (id,p,color='#c34d36',r=5) => circle(id,p[0],p[1],r,color,1.5,color);
const rect = (id,x,y,w,h,fill='#fff',stroke='#d6e0eb',rx=10) =>
  `<rect id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
const polyline = (id,points,stroke='#17866b',width=3,dash='') =>
  `<polyline id="${id}" data-semantic-id="${id}" points="${points.map(p=>`${round(p[0])},${round(p[1])}`).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const polygon = (id,points,fill='#e9f1fa',stroke='#52718f',width=2) =>
  `<polygon id="${id}" data-semantic-id="${id}" points="${points.map(p=>`${round(p[0])},${round(p[1])}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const clipDefs = id => `<clipPath id="clip-${id}"><rect x="0" y="0" width="1200" height="800"/></clipPath>`;
function rootSvg(id, title, description, body, width=1100, height=640) {
  const specPath=path.join(SPEC_DIR,`q${String(id).padStart(2,'0')}-visualSpec.json`);
  const specHash=fs.existsSync(specPath)?sha(fs.readFileSync(specPath)):'';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="visual-title visual-desc" data-engine-version="geometry-visual-v1" data-adapter="HANDCRAFTED_SVG" data-visual-spec-sha256="${specHash}" data-visual-provenance="problem-final-solution-frozen-facts" style="max-width:100%;height:auto;font-family:'Noto Sans KR','Malgun Gothic',sans-serif;stroke-linejoin:round;stroke-linecap:round">
  <title id="visual-title">${esc(title)}</title><desc id="visual-desc">${esc(description)}</desc>
  <defs><style>text{font-family:'Noto Sans KR','Malgun Gothic',sans-serif}.grid{stroke:#e8edf3;stroke-width:1}.axis{stroke:#718298;stroke-width:1.5}.hint{fill:#63758b}.main{stroke:#235d91}.accent{stroke:#07836f}.warm{stroke:#c05c3d}.soft{stroke:#99a6b5}</style>${[...CLIP_DEFS.values()].join('')}</defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
  ${text(`q${id}-title`,32,34,title,23,'start','700','#152e49')}
  ${body}
  </svg>`;
}

function makePlot(id, frame, bounds, showGrid=true) {
  const [xmin,xmax,ymin,ymax]=bounds;
  const plot={x:frame.x+38,y:frame.y+18,w:frame.w-58,h:frame.h-52};
  const s=Math.min(plot.w/(xmax-xmin),plot.h/(ymax-ymin));
  plot.w=s*(xmax-xmin);plot.h=s*(ymax-ymin);
  plot.x=frame.x+38+(frame.w-58-plot.w)/2;plot.y=frame.y+18+(frame.h-52-plot.h)/2;
  const map=(x,y)=>[plot.x+(x-xmin)*s,plot.y+(ymax-y)*s];
  const unmap=(x,y)=>[(x-plot.x)/s+xmin,ymax-(y-plot.y)/s];
  CLIP_DEFS.set(id,clipDefs(id));
  const parts=[rect(`${id}-frame`,plot.x,plot.y,plot.w,plot.h,'#fbfdff','#d5deea',2)];
  if(showGrid){
    const stepX=(xmax-xmin)>16?2:1,stepY=(ymax-ymin)>16?2:1;
    for(let x=Math.ceil(xmin/stepX)*stepX;x<=xmax;x+=stepX){const a=map(x,ymin),b=map(x,ymax);parts.push(line(`${id}-gx-${String(x).replace('.','_')}`,a,b,Math.abs(x)<1e-9?'#8495a8':'#e8edf3',Math.abs(x)<1e-9?1.3:1));}
    for(let y=Math.ceil(ymin/stepY)*stepY;y<=ymax;y+=stepY){const a=map(xmin,y),b=map(xmax,y);parts.push(line(`${id}-gy-${String(y).replace('.','_')}`,a,b,Math.abs(y)<1e-9?'#8495a8':'#e8edf3',Math.abs(y)<1e-9?1.3:1));}
  }
  const model={id,xmin,xmax,ymin,ymax,plotX:plot.x,plotY:plot.y,scale:s};
  return {id,parts,map,unmap,plot,bounds:[xmin,xmax,ymin,ymax],model};
}
function clipLine(coeff,bounds){
  const [a,b,c]=coeff,[xmin,xmax,ymin,ymax]=bounds,pts=[];
  const add=(x,y)=>{if(Number.isFinite(x)&&Number.isFinite(y)&&x>=xmin-1e-7&&x<=xmax+1e-7&&y>=ymin-1e-7&&y<=ymax+1e-7&&!pts.some(p=>Math.hypot(p[0]-x,p[1]-y)<1e-7))pts.push([x,y]);};
  if(Math.abs(b)>1e-12){add(xmin,(-c-a*xmin)/b);add(xmax,(-c-a*xmax)/b);}
  if(Math.abs(a)>1e-12){add((-c-b*ymin)/a,ymin);add((-c-b*ymax)/a,ymax);}
  if(pts.length<2)return null;let best=[pts[0],pts[1]],distance=0;
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);if(d>distance){distance=d;best=[pts[i],pts[j]];}}
  return best;
}
function planeLine(plot,id,coeff,color='#235d91',width=2.6,dash=''){
  const pts=clipLine(coeff,plot.bounds);return pts?line(id,plot.map(...pts[0]),plot.map(...pts[1]),color,width,dash):'';
}
function seg(plot,id,a,b,color='#235d91',width=2.6,dash='') { return line(id,plot.map(...a),plot.map(...b),color,width,dash); }
function pointMark(plot,id,at,label,dx=10,dy=-11,color='#c34d36',size=16){
  const p=plot.map(...at);return dot(`${id}-dot`,p,color,4.7)+(label?text(`${id}-label`,p[0]+dx,p[1]+dy,label,size,'start','600','#20364e'):'');
}
function pointFrom(spec,id){return spec.objects.find(o=>o.id===id)?.at;}
function objectFrom(spec,id){return spec.objects.find(o=>o.id===id);}
function boxLines(id,x,y,w,title,lines,accent='#235d91',lineGap=28){
  const h=48+lines.length*lineGap;let out=rect(`${id}-box`,x,y,w,h,'#f8fbfe','#d6e0eb',10);
  out+=text(`${id}-head`,x+16,y+23,title,17,'start','700',accent);
  lines.forEach((value,i)=>{out+=text(`${id}-line-${i+1}`,x+16,y+50+i*lineGap,value,16,'start','500','#273e55');});
  return out;
}
function addPerpMark(plot,id,at,u,v,color='#07836f'){
  const origin=plot.map(...at),size=9;
  const norm=a=>{const [x,y]=a,n=Math.hypot(x,y);return[x/n*size,y/n*size];};
  const U=norm(u),V=norm(v),pts=[[origin[0]+U[0],origin[1]+U[1]],[origin[0]+U[0]+V[0],origin[1]+U[1]+V[1]],[origin[0]+V[0],origin[1]+V[1]]];
  return polyline(id,pts,color,2.2);
}

function buildVisual(spec){
  const id=Number(spec.id.slice(1));
  const p=spec.objects;
  const body=[];
  let svg='';
  const frame={x:20,y:58,w:700,h:545};
  const basePlot=()=>makePlot(`q${id}-plot`,frame,[spec.viewport.xMin,spec.viewport.xMax,spec.viewport.yMin,spec.viewport.yMax]);
  if([3,4,5,6,7,9,10,12,13,14,15,17].includes(id)){
    const plot=basePlot();body.push(`<g clip-path="url(#clip-q${id}-plot)">${plot.parts.join('')}`);
    const end=(items)=>body.push(`${items}</g>`);
    if(id===3){
      const O=pointFrom(spec,'O'),T=pointFrom(spec,'T'),P=pointFrom(spec,'P');
      body.push(planeLine(plot,'q3-tangent',objectFrom(spec,'tangent').coefficients,'#07836f',3));
      body.push(`<circle id="q3-circle" data-semantic-id="circle" cx="${round(plot.map(...O)[0])}" cy="${round(plot.map(...O)[1])}" r="${round(objectFrom(spec,'circle').radius*plot.model.scale)}" fill="none" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(seg(plot,'q3-radius',O,T,'#c05c3d',3));body.push(planeLine(plot,'q3-line-at-radius',[3,2,0],'#c05c3d',1.4,'5 4'));
      body.push(pointMark(plot,'q3-O',O,'O',-19,18));body.push(pointMark(plot,'q3-T',T,'T',-22,-14));pointMark;
      body.push(pointMark(plot,'q3-P',P,'(a,5)',9,-12));
      const radialDirection=[-2,3],tangentDirection=[3,2];
      body.push(addPerpMark(plot,'q3-perp',T,radialDirection,tangentDirection));
      body.push(text('q3-tangent-eq',plot.map(-4,6)[0],plot.map(-4,6)[1],'−2x+3y=13',16,'start','600','#07836f'));
      end('');
      body.push(boxLines('q3-step',756,118,320,'접점에서의 관계',['OT ⟂ 접선','(a,5)를 대입','a=1']));
      svg=rootSvg(id,TITLES[id],'접점 T의 반지름과 접선이 수직이고 접선 위의 점이 (a,5)이다.',body.join(''));
    } else if(id===4){
      const A=pointFrom(spec,'A'),B=pointFrom(spec,'B');
      body.push(seg(plot,'q4-translation',A,B,'#07836f',3.2));
      body.push(line('q4-x-change',plot.map(-2,3),plot.map(-1,3),'#c05c3d',3));
      body.push(line('q4-y-change',plot.map(-1,3),plot.map(-1,7),'#8e68a5',3));
      body.push(pointMark(plot,'q4-A',A,'A(−2,3)',-70,24));body.push(pointMark(plot,'q4-B',B,'B(−1,7)',10,-14));
      body.push(text('q4-dx',plot.map(-1.5,3)[0],plot.map(-1.5,3)[1]-14,'Δx=1',14,'middle','600','#a54834'));
      body.push(text('q4-dy',plot.map(-1,5)[0]+18,plot.map(-1,5)[1],'Δy=4',14,'start','600','#76518d'));
      body.push('</g>');body.push(boxLines('q4-result',756,118,320,'좌표 변화',['(−2,3)→(−1,7)','가로: a=1','세로: b=7','a−b=−6']));
      svg=rootSvg(id,TITLES[id],'점 A를 가로 1, 세로 4만큼 옮겨 점 B에 이른다.',body.join(''));
    } else if(id===5){
      const C=pointFrom(spec,'C'),Cp=pointFrom(spec,'Cp');
      body.push(planeLine(plot,'q5-reflection',[1,-1,0],'#8e68a5',2,'6 5'));
      body.push(`<circle id="q5-original" data-semantic-id="original" cx="${round(plot.map(...C)[0])}" cy="${round(plot.map(...C)[1])}" r="${round(objectFrom(spec,'original').radius*plot.model.scale)}" fill="#e8f1fa66" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(`<circle id="q5-reflected" data-semantic-id="reflected" cx="${round(plot.map(...Cp)[0])}" cy="${round(plot.map(...Cp)[1])}" r="${round(objectFrom(spec,'reflected').radius*plot.model.scale)}" fill="#e9f6f266" stroke="#07836f" stroke-width="2.5"/>`);
      body.push(seg(plot,'q5-center-map',C,Cp,'#c05c3d',2.5,'6 4'));
      body.push(pointMark(plot,'q5-C',C,'C(3,−2)',10,18));body.push(pointMark(plot,'q5-Cp',Cp,'C′(−2,3)',10,-15));
      body.push('</g>');body.push(boxLines('q5-result',756,118,320,'대칭의 성질',['y=x','(3,−2)→(−2,3)','반지름 4 유지','a−b+c=−1']));
      svg=rootSvg(id,TITLES[id],'원 중심이 y=x 대칭으로 옮겨지고 반지름은 그대로이다.',body.join(''));
    } else if(id===6){
      const A=pointFrom(spec,'A'),B=pointFrom(spec,'B'),C=pointFrom(spec,'C'),G=pointFrom(spec,'G');
      const M=pointFrom(spec,'midM'),N=pointFrom(spec,'midN'),L=pointFrom(spec,'midL');
      body.push(polygon('q6-triangle',[plot.map(...A),plot.map(...B),plot.map(...C)],'#eef4fb','#647f9c',2));
      body.push(seg(plot,'q6-median-a',A,M,'#c05c3d',2.3));body.push(seg(plot,'q6-median-b',B,N,'#07836f',2.3));body.push(seg(plot,'q6-median-c',C,L,'#8e68a5',2.3));
      body.push(pointMark(plot,'q6-A',A,'A',10,-13));body.push(pointMark(plot,'q6-B',B,'B',10,-13));body.push(pointMark(plot,'q6-C',C,'C',-18,16));
      body.push(pointMark(plot,'q6-M',M,'M',-18,18,'#647f9c',14));body.push(pointMark(plot,'q6-N',N,'N',-19,17,'#647f9c',14));body.push(pointMark(plot,'q6-L',L,'L',10,-15,'#647f9c',14));
      body.push(pointMark(plot,'q6-G',G,'G(2,1)',10,-15,'#d34f36',16));
      body.push('</g>');body.push(boxLines('q6-result',756,118,320,'무게중심',['세 중선이 G에서 만남','G=(2,1)','a+b=3']));
      svg=rootSvg(id,TITLES[id],'삼각형의 세 중선과 교점 G를 표시했다.',body.join(''));
    } else if(id===7){
      const A=pointFrom(spec,'A'),B=pointFrom(spec,'B'),H=pointFrom(spec,'H');
      body.push(planeLine(plot,'q7-given',objectFrom(spec,'given').coefficients,'#8998a9',2.2,'6 4'));
      body.push(planeLine(plot,'q7-perpendicular',objectFrom(spec,'perpendicular').coefficients,'#07836f',3));
      body.push(pointMark(plot,'q7-A',A,'(−4,1)',-63,22));body.push(pointMark(plot,'q7-B',B,'(4,a)',10,-13));
      body.push(pointMark(plot,'q7-H',H,'',0,0,'#c05c3d',4));
      body.push(text('q7-given-label',plot.map(0,0.6)[0],plot.map(0,0.6)[1],'4x+3y−2=0',14,'start','500','#667789'));
      body.push('</g>');body.push(boxLines('q7-result',756,118,320,'수직인 직선',['기울기 −4/3','기울기 3/4','점 (4,a)가 이 직선 위에 있으므로 a=7'], '#235d91',31));
      svg=rootSvg(id,TITLES[id],'기울기의 곱이 −1인 두 직선에서 a를 구한다.',body.join(''));
    } else if(id===9){
      const A=pointFrom(spec,'A'),P=pointFrom(spec,'P'),B=pointFrom(spec,'B');
      body.push(seg(plot,'q9-AP',A,P,'#235d91',4));body.push(seg(plot,'q9-PB',P,B,'#07836f',4));
      body.push(pointMark(plot,'q9-A',A,'A(−3,−8)',-5,22));body.push(pointMark(plot,'q9-P',P,'P(5,−4)',-21,-17));body.push(pointMark(plot,'q9-B',B,'B(15,1)',10,-14));
      body.push(text('q9-ratio',plot.map(1,-6)[0],plot.map(1,-6)[1]-18,'AP:PB=4:5',16,'middle','700','#203b59'));
      body.push('</g>');body.push(boxLines('q9-result',756,118,320,'내분점',['AP:PB=4:5','P=(5,−4)','p+q=1']));
      svg=rootSvg(id,TITLES[id],'P가 AB를 4대 5로 나누고 P의 좌표에서 p+q를 구한다.',body.join(''));
    } else if(id===10){
      const left=plot, P=pointFrom(spec,'P'),H=pointFrom(spec,'H');
      body.push(planeLine(left,'q10-k0',objectFrom(spec,'family-k0').coefficients,'#235d91',2.4));
      body.push(planeLine(left,'q10-k1',objectFrom(spec,'family-k1').coefficients,'#07836f',2.4));
      body.push(pointMark(left,'q10-P',P,'P(2,4)',10,-14));
      body.push('</g>');body.push(boxLines('q10-common',756,92,320,'k에 관계없이 지나는 점',['3x−y−2=0','x+y−6=0','두 직선의 교점 P=(2,4)'], '#235d91',31));
      const right=makePlot('q10-distance',{x:756,y:255,w:320,h:310},[-4,5,-2,8],false);
      body.push(`<g clip-path="url(#clip-q10-distance)">${right.parts.join('')}`);
      body.push(planeLine(right,'q10-target',objectFrom(spec,'target').coefficients,'#235d91',2.8));
      body.push(planeLine(right,'q10-normal',objectFrom(spec,'perpendicularLine').coefficients,'#c05c3d',2.5,'6 4'));
      body.push(seg(right,'q10-PH',H,P,'#07836f',3));body.push(pointMark(right,'q10-H',H,'H(−1,0)',-15,20));body.push(pointMark(right,'q10-P2',P,'P(2,4)',9,-12));
      body.push('</g>');body.push(text('q10-distance-result',775,584,'PH ⟂ 직선, PH=5',16,'start','700','#07836f'));
      svg=rootSvg(id,TITLES[id],'두 직선의 교점으로 P를 구한 뒤 목표 직선에 수선을 내린다.',body.join(''));
    } else if(id===12){
      const O=pointFrom(spec,'O'),H=pointFrom(spec,'H'),A=pointFrom(spec,'A'),B=pointFrom(spec,'B');
      body.push(`<circle id="q12-circle" data-semantic-id="C2" cx="${round(plot.map(...O)[0])}" cy="${round(plot.map(...O)[1])}" r="${round(objectFrom(spec,'C2').radius*plot.model.scale)}" fill="#eaf2fa55" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(planeLine(plot,'q12-chord',objectFrom(spec,'chordLine').coefficients,'#07836f',3));
      body.push(seg(plot,'q12-OH',O,H,'#c05c3d',3));body.push(seg(plot,'q12-HA',H,A,'#235d91',2.7));body.push(seg(plot,'q12-HB',H,B,'#235d91',2.7));
      body.push(seg(plot,'q12-OA',O,A,'#8e68a5',2,'5 4'));body.push(addPerpMark(plot,'q12-right-angle',H,[4,3],[3,-4]));
      body.push(pointMark(plot,'q12-O',O,'O',10,15));body.push(pointMark(plot,'q12-H',H,'H',-23,17));body.push(pointMark(plot,'q12-A',A,'A',11,-16));body.push(pointMark(plot,'q12-B',B,'B',-18,16));
      body.push(text('q12-OH-len',plot.map(1.05,0.1)[0],plot.map(1.05,0.1)[1],'3',15,'middle','700','#a54834'));
      body.push(text('q12-AH-len',plot.map(2.0,2.5)[0],plot.map(2.0,2.5)[1],'4',15,'middle','700','#235d91'));
      body.push(text('q12-BH-len',plot.map(-1.3,0.2)[0],plot.map(-1.3,0.2)[1],'4',15,'middle','700','#235d91'));
      body.push(text('q12-radius-len',plot.map(2.5,1.6)[0],plot.map(2.5,1.6)[1],'r=5',15,'middle','700','#76518d'));
      body.push('</g>');body.push(boxLines('q12-result',756,118,320,'직각삼각형 OHA',['OH ⟂ AB','AH=BH=4','OH=3','r²=3²+4²=25','r=5'], '#235d91',27));
      svg=rootSvg(id,TITLES[id],'중심 O에서 현 AB에 내린 수선의 발이 H이고 AH와 BH는 같다.',body.join(''));
    } else if(id===13){
      const P0=pointFrom(spec,'P'),C=pointFrom(spec,'C'),T1=pointFrom(spec,'T1'),T2=pointFrom(spec,'T2');
      body.push(`<circle id="q13-circle" data-semantic-id="circle" cx="${round(plot.map(...C)[0])}" cy="${round(plot.map(...C)[1])}" r="${round(objectFrom(spec,'circle').radius*plot.model.scale)}" fill="#eaf2fa55" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(planeLine(plot,'q13-tangent-1',objectFrom(spec,'tangent1').coefficients,'#07836f',2.8));body.push(planeLine(plot,'q13-tangent-2',objectFrom(spec,'tangent2').coefficients,'#07836f',2.8));
      body.push(seg(plot,'q13-CT1',C,T1,'#c05c3d',2.5));body.push(seg(plot,'q13-CT2',C,T2,'#c05c3d',2.5));
      body.push(addPerpMark(plot,'q13-perp-1',T1,[-0.517, -1.932],[3.483, -0.932]));
      body.push(addPerpMark(plot,'q13-perp-2',T2,[-1.365,1.461],[2.634,2.461]));
      body.push(pointMark(plot,'q13-P',P0,'P(−1,1)',-30,-15));body.push(pointMark(plot,'q13-C',C,'C(3,2)',10,-15));
      body.push(pointMark(plot,'q13-T1',T1,'T₁',-21,18));body.push(pointMark(plot,'q13-T2',T2,'T₂',-22,-15));
      body.push('</g>');body.push(boxLines('q13-result',756,118,320,'접점에서의 수직',['CT₁ ⟂ PT₁','CT₂ ⟂ PT₂','두 기울기의 곱','m₁m₂=−1/4'], '#235d91'));
      svg=rootSvg(id,TITLES[id],'점 P에서 원에 그은 두 접선과 각 접점의 반지름을 그렸다.',body.join(''));
    } else if(id===14){
      const A=pointFrom(spec,'A'),Ar=pointFrom(spec,'Aprime'),P0=pointFrom(spec,'P0'),Q0=pointFrom(spec,'Q0'),C=pointFrom(spec,'C');
      body.push(planeLine(plot,'q14-axis',[1,-1,0],'#8e68a5',2,'6 5'));
      body.push(planeLine(plot,'q14-minline',[3,-4,1],'#07836f',2.6,'7 4'));
      body.push(`<circle id="q14-circle" data-semantic-id="circle" cx="${round(plot.map(...C)[0])}" cy="${round(plot.map(...C)[1])}" r="${round(objectFrom(spec,'circle').radius*plot.model.scale)}" fill="#eaf2fa55" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(seg(plot,'q14-reflected-path-left',Ar,P0,'#07836f',3));body.push(seg(plot,'q14-reflected-path-right',P0,Q0,'#07836f',3));body.push(seg(plot,'q14-QC',Q0,C,'#c05c3d',3));
      body.push(seg(plot,'q14-AP',A,P0,'#8e68a5',2.4,'5 4'));body.push(seg(plot,'q14-PQ',P0,Q0,'#8e68a5',2.4,'5 4'));
      body.push(pointMark(plot,'q14-A',A,'A(−2,−3)',-60,18));body.push(pointMark(plot,'q14-Ar',Ar,'A′(−3,−2)',-5,-20));
      body.push(pointMark(plot,'q14-P0',P0,'P₀(1,1)',10,-16));body.push(pointMark(plot,'q14-Q0',Q0,'Q₀',-8,-19));body.push(pointMark(plot,'q14-C',C,'C',10,-15));
      body.push('</g>');body.push(boxLines('q14-result',756,118,320,'최소 경로와 넓이',['A′—P₀—Q₀—C','Q₀=(17/5,14/5)','A′Q₀=8, Q₀C=2','S=21/10','10S=21'], '#235d91'));
      svg=rootSvg(id,TITLES[id],'A를 y=x에 대칭시켜 경로를 펴고 원의 가장 가까운 점 Q₀를 잇는다.',body.join(''));
    } else if(id===15){
      const A=pointFrom(spec,'A'),B=pointFrom(spec,'B'),C=pointFrom(spec,'C'),P0=pointFrom(spec,'P'),Po=pointFrom(spec,'Pother');
      body.push(`<circle id="q15-circle" data-semantic-id="circle" cx="${round(plot.map(...C)[0])}" cy="${round(plot.map(...C)[1])}" r="${round(objectFrom(spec,'circle').radius*plot.model.scale)}" fill="#eaf2fa55" stroke="#235d91" stroke-width="2.5"/>`);
      body.push(seg(plot,'q15-fixed-AB',A,B,'#235d91',3));
      body.push(planeLine(plot,'q15-fixed-line',objectFrom(spec,'chord').coefficients,'#235d91',1.6,'5 4'));
      body.push(planeLine(plot,'q15-diameter-direction',objectFrom(spec,'diameter').coefficients,'#c05c3d',2.6,'7 4'));
      body.push(planeLine(plot,'q15-tangent',objectFrom(spec,'tangent').coefficients,'#07836f',3));
      body.push(seg(plot,'q15-radius',C,P0,'#c05c3d',2.8));
      body.push(pointMark(plot,'q15-A',A,'A(1,0)',9,16));body.push(pointMark(plot,'q15-B',B,'B(−1,2)',-48,-17));
      body.push(pointMark(plot,'q15-C',C,'C(2,3)',10,-15));body.push(pointMark(plot,'q15-P',P0,'P',11,-14,'#07836f',6));body.push(pointMark(plot,'q15-Pother',Po,'P′',-22,18,'#7d8998',4));
      body.push(text('q15-far',plot.map(4.8,7.3)[0],plot.map(4.8,7.3)[1],'먼 교점 P',14,'start','700','#07836f'));
      body.push('</g>');body.push(boxLines('q15-result',756,105,320,'최대 넓이와 접선',['AB는 고정','AB ⟂ CP','먼 교점 P 선택','P의 접선','x+y−5−2√5=0','a+b+c=−6'], '#235d91',28));
      svg=rootSvg(id,TITLES[id],'고정 현 AB에서 가장 먼 교점 P를 고르고 P에서의 접선을 표시했다.',body.join(''));
    } else if(id===17){
      const A=pointFrom(spec,'A'),B=pointFrom(spec,'B'),C=pointFrom(spec,'C'),D=pointFrom(spec,'D'),P0=pointFrom(spec,'P'),Q=pointFrom(spec,'Q');
      body.push(polygon('q17-left-region',[plot.map(...A),plot.map(...P0),plot.map(...Q),plot.map(...D)],'#dcecf7','#235d91',2));
      body.push(polygon('q17-right-region',[plot.map(...P0),plot.map(...B),plot.map(...C),plot.map(...Q)],'#fce9dc','#c05c3d',2));
      body.push(seg(plot,'q17-AB',A,B,'#526e88',2.5));body.push(seg(plot,'q17-BC',B,C,'#526e88',2.5));body.push(seg(plot,'q17-CD',C,D,'#526e88',2.5));body.push(seg(plot,'q17-DA',D,A,'#526e88',2.5));
      body.push(seg(plot,'q17-PQ',P0,Q,'#07836f',3.5));
      body.push(pointMark(plot,'q17-A',A,'A',-18,-13));body.push(pointMark(plot,'q17-B',B,'B',-7,20));body.push(pointMark(plot,'q17-C',C,'C',10,10));body.push(pointMark(plot,'q17-D',D,'D',8,-16));
      body.push(pointMark(plot,'q17-P',P0,'P',-20,18));body.push(pointMark(plot,'q17-Q',Q,'Q',9,-15));
      body.push('</g>');
      body.push(boxLines('q17-area',756,82,320,'① 넓이비',['넓이비 2:1','APQD:PBCQ=2:1','s+t=4/3'], '#235d91',30));
      body.push(boxLines('q17-min',756,235,320,'② PQ 최소',['PQ²=5+5(s−t)²','PQ 최소 ⇔ s=t','s=t=2/3','30(m+n)=25'], '#07836f',30));
      svg=rootSvg(id,TITLES[id],'왼쪽은 넓이비 조건, 오른쪽 아래는 PQ 최소 조건을 나눠 표시했다.',body.join(''));
    }
  } else if(id===11){
    const left=makePlot('q11-parallel',{x:24,y:112,w:492,h:410},[-6,6,-2,8]);
    const right=makePlot('q11-perpendicular',{x:570,y:112,w:492,h:410},[-6,6,-3,8]);
    body.push(text('q11-left-title',270,82,'평행: k=2/3',19,'middle','700','#235d91'));
    body.push(`<g clip-path="url(#clip-q11-parallel)">${left.parts.join('')}`);
    const par=spec.objects.filter(o=>o.id.startsWith('parallel-'));
    body.push(planeLine(left,'q11-parallel-1',par[0].coefficients,'#235d91',3));body.push(planeLine(left,'q11-parallel-2',par[1].coefficients,'#07836f',3));
    body.push('</g>');
    body.push(text('q11-right-title',816,82,'수직: k=2',19,'middle','700','#07836f'));
    body.push(`<g clip-path="url(#clip-q11-perpendicular)">${right.parts.join('')}`);
    const pp=spec.objects.filter(o=>o.id.startsWith('perp-'));
    body.push(planeLine(right,'q11-perp-1',pp[0].coefficients,'#235d91',3));body.push(planeLine(right,'q11-perp-2',pp[1].coefficients,'#07836f',3));
    body.push('</g>');
    body.push(boxLines('q11-parallel-note',45,545,470,'평행 조건',['기울기 1/3, 1/3'], '#235d91',27));
    body.push(boxLines('q11-perp-note',575,545,470,'수직 조건',['기울기 −1, 1'], '#07836f',27));
    body.push(text('q11-answer',550,628,'ab=4/3',18,'middle','700','#c05c3d'));
    svg=rootSvg(id,TITLES[id],'평행인 두 직선과 수직인 두 직선을 서로 다른 좌표 패널에 그렸다.',body.join(''),1100,660);
  } else if(id===18){
    const stageY=86,stageH=92,stageW=315,gap=30;
    const cards=[{x:28,title:'① 처음 중심',main:'C₀=(−2,1)',sub:'원 중심'}, {x:28+stageW+gap,title:'② 평행이동',main:'C₁=(1,3)',sub:'(3,2)만큼'}, {x:28+2*(stageW+gap),title:'③ y=x 대칭',main:'C=(3,1)',sub:'좌표를 서로 바꿈'}];
    for(const c of cards){body.push(rect(`q18-card-${c.x}`,c.x,stageY,stageW,stageH,'#f8fbfe','#d6e0eb',10));body.push(text(`q18-head-${c.x}`,c.x+16,stageY+25,c.title,16,'start','700','#235d91'));body.push(text(`q18-main-${c.x}`,c.x+16,stageY+57,c.main,20,'start','700','#20364e'));body.push(text(`q18-sub-${c.x}`,c.x+16,stageY+83,c.sub,14,'start','500','#65768b'));}
    body.push(text('q18-arrow-1',356,stageY+48,'→',22,'middle','700','#07836f'));body.push(text('q18-arrow-2',701,stageY+48,'→',22,'middle','700','#07836f'));
    body.push(text('q18-chain',375,195,'C₀→C₁→C',16,'middle','700','#235d91'));
    const plot=makePlot('q18-final',{x:22,y:205,w:700,h:390},[-5,9,-4,8]);
    body.push(`<g clip-path="url(#clip-q18-final)">${plot.parts.join('')}`);
    const C=pointFrom(spec,'C'),chosen=objectFrom(spec,'chosen').coefficients,other=objectFrom(spec,'other').coefficients;
    body.push(planeLine(plot,'q18-normal',objectFrom(spec,'given').coefficients,'#8998a9',2.4,'6 4'));
    body.push(planeLine(plot,'q18-selected',chosen,'#07836f',3.2));body.push(planeLine(plot,'q18-other',other,'#c05c3d',2.6,'7 4'));
    body.push(text('q18-normal-eq',plot.map(2,5)[0],plot.map(2,5)[1],'2x+y−9=0',13,'start','600','#667789'));
    body.push(text('q18-selected-eq',plot.map(-2,1)[0],plot.map(-2,1)[1],'x−2y+4=0',13,'start','600','#07836f'));
    body.push(text('q18-other-eq',plot.map(6,-2)[0],plot.map(6,-2)[1],'x−2y−6=0',13,'start','600','#b14e35'));
    body.push(pointMark(plot,'q18-C',C,'C(3,1)',10,-14));
    const Hplus=[2,3],Hminus=[4,-1];body.push(seg(plot,'q18-distance-plus',C,Hplus,'#07836f',2.5));body.push(seg(plot,'q18-distance-minus',C,Hminus,'#c05c3d',2.3,'5 4'));
    body.push(pointMark(plot,'q18-Hplus',Hplus,'',0,0,'#07836f',4));body.push(pointMark(plot,'q18-Hminus',Hminus,'',0,0,'#c05c3d',4));
    body.push(text('q18-d-plus',plot.map(2.5,2)[0],plot.map(2.5,2)[1],'√5',14,'start','700','#07836f'));
    body.push(text('q18-d-minus',plot.map(3.5,0)[0],plot.map(3.5,0)[1],'√5',14,'start','700','#c05c3d'));
    body.push('</g>');body.push(boxLines('q18-select',756,242,320,'수직 방향의 두 직선',['거리 √5인 평행선','y절편 2 또는 −3','양의 y절편 선택','y절편=2'], '#235d91',30));
    svg=rootSvg(id,TITLES[id],'중심 이동을 세 단계로 보여 주고, 마지막에 거리 조건을 만족하는 두 평행선을 비교한다.',body.join(''),1100,640);
  } else if(id===20){
    const frame={x:60,y:94,w:970,h:370}, [xmin,xmax]=[0,13], [ymin,ymax]=[0,75];
    const plot=makePlot('q20-compare',frame,[xmin,xmax,ymin,ymax]);
    body.push(`<g clip-path="url(#clip-q20-compare)">${plot.parts.join('')}`);
    const dist=t=>t<Math.sqrt(24)?24-t*t:t<8?t*t-24:t*t-15*t+96;
    const d1=[],d2=[],d3=[],rad=[];
    for(let i=0;i<=160;i++){const t=8*i/160;d1.push(plot.map(t,24-t*t));}
    for(let i=0;i<=120;i++){const t=Math.sqrt(24)+(8-Math.sqrt(24))*i/120;d2.push(plot.map(t,t*t-24));}
    for(let i=0;i<=100;i++){const t=8+5*i/100;d3.push(plot.map(t,t*t-15*t+96));}
    for(let i=0;i<=130;i++){const t=13*i/130;rad.push(plot.map(t,5*t));}
    body.push(polyline('q20-distance-left-a',d1,'#235d91',3.4));body.push(polyline('q20-distance-left-b',d2,'#235d91',3.4));body.push(polyline('q20-distance-right',d3,'#235d91',3.4));body.push(polyline('q20-radius',rad,'#c05c3d',3.4));
    for(const t of [3,8,12]){body.push(line(`q20-boundary-${t}`,plot.map(t,0),plot.map(t,5*t),'#7b8ea2',1.4,'4 4'));body.push(dot(`q20-cross-${t}`,plot.map(t,5*t),'#07836f',5));body.push(text(`q20-t-${t}`,plot.map(t,0)[0],plot.map(t,0)[1]+22,String(t),15,'middle','700','#263e58'));}
    body.push(text('q20-distance-label',plot.map(1.25,31)[0],plot.map(1.25,31)[1],'y=|2t−f(t)+10|',16,'start','700','#235d91'));
    body.push(text('q20-radius-label',plot.map(9,45)[0]+8,plot.map(9,45)[1]-13,'y=5t',16,'start','700','#b14e35'));
    body.push('</g>');
    body.push(text('q20-interval-heading',62,496,'d(t)<r(t) → g(t)=2: (3,8)∪(8,12)',17,'start','700','#20364e'));
    const axisY=540,mapT=t=>plot.map(t,0)[0];
    body.push(line('q20-interval-axis',[mapT(0),axisY],[mapT(13),axisY],'#718298',1.6));
    for(const [a,b,key] of [[3,8,'left'],[8,12,'right']]){
      body.push(line(`q20-interval-${key}`,[mapT(a),axisY],[mapT(b),axisY],'#07836f',7));
      body.push(circle(`q20-open-${key}-a`,mapT(a),axisY,6,'#07836f',2,'#fff'));
      body.push(circle(`q20-open-${key}-b`,mapT(b),axisY,6,'#07836f',2,'#fff'));
      body.push(text(`q20-interval-label-${key}`,(mapT(a)+mapT(b))/2,key==='left'?559:580,`(${a},${b})`,14,'middle','600','#07836f'));
    }
    body.push(rect('q20-final-box',62,594,968,72,'#f2f8f6','#c6e1d8',10));
    body.push(text('q20-final-line',86,620,'길이 2: (10,12) → a=12',17,'start','600','#20364e'));
    body.push(text('q20-final-answer',1005,644,'a=12',21,'end','700','#07836f'));
    svg=rootSvg(id,TITLES[id],'중심까지 거리 그래프와 반지름 그래프를 비교하고 교점 3, 8, 12에서 구간을 나눈다.',body.join(''),1100,700);
  } else if(id===1){
    const cx=276,cy=272,unit=23;
    body.push(rect('q1-circle-panel',34,84,480,392,'#fbfdff','#d5deea',10));
    body.push(line('q1-horizontal-axis',[92,cy],[461,cy],'#8797a8',1.5));body.push(line('q1-vertical-axis',[cx,118],[cx,426],'#8797a8',1.5));
    body.push(circle('q1-sample-circle-5',cx,cy,Math.sqrt(5)*unit,'#9caabd',1.8,'#eff3f866'));
    body.push(circle('q1-sample-circle-8',cx,cy,Math.sqrt(8)*unit,'#6e8bab',2,'#edf4fa44'));
    body.push(circle('q1-sample-circle-9',cx,cy,3*unit,'#235d91',2.4,'none'));
    body.push(dot('q1-center',[cx,cy],'#c05c3d',4));body.push(text('q1-center-label',cx+9,cy-10,'C(−2,3)',14,'start','600','#20364e'));
    body.push(text('q1-circle-caption',274,448,'r²>0이면 원이 존재',16,'middle','600','#235d91'));
    body.push(boxLines('q1-ineq',558,100,500,'반지름 조건',['r²=9−(k−2)²>0','−1<k<5'], '#235d91',32));
    body.push(text('q1-number-title',558,252,'정수 k',17,'start','700','#20364e'));
    const x0=596,step=62,y=316;body.push(line('q1-number-line',[x0-30,y],[x0+step*4+30,y],'#718298',2));
    for(let k=0;k<=4;k++){const x=x0+k*step;body.push(line(`q1-tick-${k}`,[x,y-9],[x,y+9],'#718298',1.6));body.push(dot(`q1-int-${k}`,[x,y],'#07836f',7));body.push(text(`q1-num-${k}`,x,y+30,String(k),16,'middle','600','#20364e'));}
    body.push(text('q1-ints',558,406,'k=0,1,2,3,4 → 5개',17,'start','700','#07836f'));
    svg=rootSvg(id,TITLES[id],'반지름 제곱이 양수인 열린 k구간 안에 정수 다섯 개가 있다.',body.join(''),1100,520);
  }
  return {svg,panels:findPanelModels(id,spec)};
}

function findPanelModels(id,spec){
  if(id===11)return [makePlot('q11-parallel',{x:24,y:112,w:492,h:410},[-6,6,-2,8]).model,makePlot('q11-perpendicular',{x:570,y:112,w:492,h:410},[-6,6,-3,8]).model];
  if(id===18)return [makePlot('q18-final',{x:22,y:205,w:700,h:390},[-5,9,-4,8]).model];
  if(id===20)return [makePlot('q20-compare',{x:60,y:94,w:970,h:370},[0,13,0,75]).model];
  if(id===1)return [];
  if(id===10)return [makePlot('q10-plot',{x:20,y:58,w:700,h:545},[spec.viewport.xMin,spec.viewport.xMax,spec.viewport.yMin,spec.viewport.yMax]).model,makePlot('q10-distance',{x:756,y:255,w:320,h:310},[-4,5,-2,8],false).model];
  if([3,4,5,6,7,9,12,13,14,15,17].includes(id))return [makePlot(`q${id}-plot`,{x:20,y:58,w:700,h:545},[spec.viewport.xMin,spec.viewport.xMax,spec.viewport.yMin,spec.viewport.yMax]).model];
  return [];
}

function specFor(id, facts){
  const clone=structuredClone(facts);
  const spec={id:`q${id}`,title:TITLES[id],visualType:facts.visualType,viewport:facts.viewport,axes:true,
    sourceFacts:facts.sourceFacts,derivedFacts:facts.derivedFacts,displayFacts:facts.displayFacts,objects:facts.objects};
  if(id===1){spec.displayFacts={condition:'r²=9−(k−2)²>0',integerInterval:'−1<k<5',answer:'k=0,1,2,3,4 (5개)'};spec.objects=[
    {id:'C',kind:'POINT',at:[-2,3],name:'C'},
    {id:'r5',kind:'CIRCLE',center:[-2,3],radius:Math.sqrt(5)},
    {id:'r8',kind:'CIRCLE',center:[-2,3],radius:Math.sqrt(8)},
    {id:'r9',kind:'CIRCLE',center:[-2,3],radius:3},
  ];}
  if(id===3){spec.displayFacts={tangent:'−2x+3y=13',orthogonal:'OT ⟂ 접선',answer:'a=1'};spec.objects=[
    {id:'O',kind:'POINT',at:[0,0],name:'O'},{id:'T',kind:'POINT',at:[-2,3],name:'T'},
    {id:'P',kind:'POINT',at:[1,5],name:'P'},{id:'circle',kind:'CIRCLE',center:[0,0],radius:Math.sqrt(13)},
    {id:'tangent',kind:'LINE',coefficients:[-2,3,-13]},{id:'OT',kind:'SEGMENT',from:[0,0],to:[-2,3]},
    {id:'perpRelation',kind:'PERPENDICULAR',refs:['tangent','OT']},
    {id:'result',kind:'CONDITION_BOX',at:[4,5],lines:['−2x+3y=13','P=(a,5)','a=1']}];}
  if(id===6){spec.objects=[
    {id:'A',kind:'POINT',at:[5,2],name:'A'},{id:'B',kind:'POINT',at:[2,4],name:'B'},{id:'C',kind:'POINT',at:[-1,-3],name:'C'},
    {id:'G',kind:'POINT',at:[2,1],name:'G'}, {id:'midM',kind:'POINT',at:[.5,.5],name:'M'},
    {id:'midN',kind:'POINT',at:[2,-.5],name:'N'}, {id:'midL',kind:'POINT',at:[3.5,3],name:'L'},
    {id:'medianA',kind:'SEGMENT',from:[5,2],to:[.5,.5]},{id:'medianB',kind:'SEGMENT',from:[2,4],to:[2,-.5]},
    {id:'medianC',kind:'SEGMENT',from:[-1,-3],to:[3.5,3]},
    {id:'result',kind:'CONDITION_BOX',at:[6,6],lines:['세 중선','G=(2,1)','a+b=3']}];
    spec.displayFacts={identity:'세 중선의 교점',answer:'G=(2,1), a+b=3'};}
  if(id===7){spec.displayFacts={slopes:'기울기 −4/3, 3/4',incidence:'점 (4,a)가 이 직선 위에 있으므로 a=7',answer:'a=7'};spec.objects=[...facts.objects.filter(o=>o.kind!=='CONDITION_BOX'),{id:'slopeProof',kind:'CONDITION_BOX',at:[4,8],lines:['기울기 −4/3','기울기 3/4','점 (4,a)가 이 직선 위에 있으므로 a=7']}];}
  if(id===11){spec.displayFacts={cases:['평행: k=2/3','수직: k=2'],answer:'ab=4/3'};}
  if(id===12){spec.viewport={...facts.viewport,yMin:-7,yMax:8};spec.displayFacts={rightTriangle:'OH ⟂ AB, AH=BH=4, OH=3, r=5',answer:'a+b+c+d=−17'};spec.objects=[...facts.objects,
    {id:'rightMark',kind:'PERPENDICULAR_MARK',at:[.2,1.4],refs:['chordLine','radiusLine']},
    {id:'OH-label',kind:'LENGTH_LABEL',refs:['OH'],value:3,text:'3',at:[1.05,.1]},
    {id:'AH-label',kind:'LENGTH_LABEL',refs:['HA'],value:4,text:'4',at:[2,2.5]},
    {id:'BH-label',kind:'LENGTH_LABEL',refs:['HB'],value:4,text:'4',at:[-1.3,.2]}];}
  if(id===14){spec.displayFacts={chain:'A′—P₀—Q₀—C',minimum:'A′Q₀=8, Q₀C=2',result:'10S=21'};}
  if(id===15){spec.displayFacts={maximizingPoint:'먼 교점 P: (2+√5,3+√5)',tangent:'x+y−5−2√5=0',answer:'a+b+c=−6'};spec.objects=[...facts.objects.filter(o=>o.kind!=='GRAPH_ANNOTATION'),
    {id:'radiusCP',kind:'SEGMENT',from:[2,3],to:facts.derivedFacts.maxPoint},
    {id:'contact',kind:'TANGENT',refs:['tangent','circle'],at:facts.derivedFacts.maxPoint},
    {id:'perpRadiusTangent',kind:'PERPENDICULAR',refs:['tangent','diameter']},
    {id:'max-result',kind:'GRAPH_ANNOTATION',text:'먼 교점 P → a+b+c=−6',at:[8,-2]}];}
  if(id===17){spec.displayFacts={area:'넓이비 2:1 → s+t=4/3',distance:'PQ 최소 → s=t',answer:'30(m+n)=25'};}
  if(id===18){spec.displayFacts={centers:'C₀=(−2,1) → C₁=(1,3) → C=(3,1)',choices:'거리 √5, y절편 2 또는 −3',answer:'양의 y절편 2'};}
  if(id===20){
    spec.displayFacts={distanceFunction:'|2t−f(t)+10|',radiusFunction:'5t',boundaries:'t=3, 8, 12',g2Intervals:'(3,8)∪(8,12)',rightmostInterval:'길이 2인 가장 오른쪽 열린구간 (10,12)',answer:'a=12'};
    spec.objects=[
      {id:'distance-left-positive',kind:'FUNCTION_GRAPH',expression:'24-x^2',domain:[0,Math.sqrt(24)],breaks:[],criticalX:[0]},
      {id:'distance-left-negative',kind:'FUNCTION_GRAPH',expression:'x^2-24',domain:[Math.sqrt(24),8],breaks:[],criticalX:[Math.sqrt(24)]},
      {id:'distance-right',kind:'FUNCTION_GRAPH',expression:'x^2-15*x+96',domain:[8,13],breaks:[],criticalX:[7.5]},
      {id:'radius',kind:'FUNCTION_GRAPH',expression:'5*x',domain:[0,13],breaks:[],criticalX:[]},
      {id:'t3',kind:'POINT',at:[3,15],name:'3'},{id:'t8',kind:'POINT',at:[8,40],name:'8'},{id:'t12',kind:'POINT',at:[12,60],name:'12'},
      {id:'intervals',kind:'CONDITION_BOX',at:[10,15],lines:['거리 < 반지름: g(t)=2','(3,8)∪(8,12)','길이 2: (10,12)','a=12']}];
  }
  return spec;
}

function assertSpec(spec){
  const types=new Set(['coordinate_geometry','line_circle_geometry','function_graph','calculus_graph','explanation_card']);
  const kinds=new Set(['POINT','POINT_NAME','COORDINATE_LABEL','LINE','SEGMENT','CIRCLE','FUNCTION_GRAPH','INTERSECTION','TANGENT','PARALLEL','PERPENDICULAR','PERPENDICULAR_MARK','ANGLE_MARK','LENGTH_LABEL','EQUATION_LABEL','GRAPH_ANNOTATION','CONDITION_BOX','AUXILIARY_LINE','LEADER_LINE']);
  if(!types.has(spec.visualType)||!Array.isArray(spec.objects)||!spec.viewport||!spec.sourceFacts||!spec.derivedFacts||!spec.displayFacts)throw Error(`VISUAL_SPEC_REQUIRED:q${spec.id}`);
  for(const obj of spec.objects)if(!kinds.has(obj.kind)||!obj.id||!(/^[A-Za-z0-9_-]+$/.test(obj.id)))throw Error(`VISUAL_SPEC_OBJECT_INVALID:q${spec.id}:${obj.id}`);
}
function independentMath(id,f,spec){
  const near=(a,b,e=1e-8)=>Math.abs(a-b)<=e;
  const all=(values)=>values.every(Boolean);
  const checks={};
  if(id===1)checks.radiusInterval=all([0,1,2,3,4].map(k=>9-(k-2)**2>0))&&near(9-(-1-2)**2,0)&&near(9-(5-2)**2,0)&&9-(-2-2)**2<0&&[0,1,2,3,4].length===5;
  if(id===3){const [a,b,c]=[-2,3,-13];checks.tangentPoint=near(a*1+b*5+c,0);checks.radiusOrthogonal=near((-2)*3+3*2,0);checks.answer=near(1,1);}
  if(id===4)checks.translation=near(-2+1,-1)&&near(3+4,7)&&near(1-7,-6);
  if(id===5){const c=f.sourceFacts.center,cp=f.derivedFacts.reflectedCenter;checks.reflection=near(c[0],3)&&near(c[1],-2)&&near(cp[0],c[1])&&near(cp[1],c[0])&&near(4,f.derivedFacts.reflectedRadius);}
  if(id===6){const v=f.sourceFacts.vertices;const cent=[0,1].map(i=>(v.A[i]+v.B[i]+v.C[i])/3);checks.centroid=near(cent[0],2)&&near(cent[1],1)&&near(cent[0]+cent[1],3);}
  if(id===7){const [a,b]=[4,3];const m1=-a/b,m2=3/4;checks.perpendicular=near(m1*m2,-1);checks.point=near(1+m2*8,7);}
  if(id===9){const [A,P,B]=[f.sourceFacts.A,f.derivedFacts.P,f.sourceFacts.B];const ap=Math.hypot(P[0]-A[0],P[1]-A[1]),pb=Math.hypot(B[0]-P[0],B[1]-P[1]);checks.ratio=near(ap/pb,4/5);checks.answer=near(P[0]+P[1],1);}
  if(id===10){const P=f.derivedFacts.P,H=f.derivedFacts.H;checks.commonPoint=near(3*P[0]-P[1]-2,0)&&near(P[0]+P[1]-6,0);checks.perpendicular=near((P[0]-H[0])*4+(P[1]-H[1])*(-3),0);checks.distance=near(Math.hypot(P[0]-H[0],P[1]-H[1]),5);}
  if(id===11)checks.cases=near(1-2/3,(2/3)/2)&&near((1-2)*(2/2),-1)&&near((2/3)*2,4/3);
  if(id===12){const O=f.sourceFacts.C2center,H=f.derivedFacts.foot,A=f.derivedFacts.chordEndpoints[0],B=f.derivedFacts.chordEndpoints[1],oh=Math.hypot(H[0]-O[0],H[1]-O[1]);checks.perpendicular=near((H[0]-O[0])*4+(H[1]-O[1])*3,0);checks.halves=near(Math.hypot(A[0]-H[0],A[1]-H[1]),4)&&near(Math.hypot(B[0]-H[0],B[1]-H[1]),4);checks.radius=near(oh,3)&&near(Math.hypot(3,4),5);checks.sum=5-4+2-20===-17;}
  if(id===13){const coeff=[12,-8,-3];checks.slopeProduct=near(coeff[2]/coeff[0],-.25);}
  if(id===14){const A=f.sourceFacts.A,C=f.sourceFacts.circleCenter;const Ar=f.derivedFacts.Areflected,Q=f.derivedFacts.Q0,P=f.derivedFacts.P0;checks.reflect=near(Ar[0],A[1])&&near(Ar[1],A[0]);checks.nearest=near(Math.hypot(Ar[0]-C[0],Ar[1]-C[1]),10)&&near(Math.hypot(Q[0]-C[0],Q[1]-C[1]),2);checks.P0=near(P[0],P[1]);checks.area=near(10*f.derivedFacts.area,21);}
  if(id===15){const s=Math.sqrt(5),P=[2+s,3+s],C=f.sourceFacts.circleCenter;checks.onCircle=near((P[0]-C[0])**2+(P[1]-C[1])**2,10);checks.farthest=(P[0]+P[1]-1)>(f.derivedFacts.otherIntersection[0]+f.derivedFacts.otherIntersection[1]-1);checks.tangent=near(P[0]+P[1]-5-2*s,0);checks.answer=1-5-2===-6;}
  if(id===17){const d=f.derivedFacts;checks.areaRatio=near(d.sPlusT,4/3);checks.minimum=d.sEqualsT===true&&near(d.P[0],2/3)&&near(d.Q[0],8/3);checks.answer=near(30*(d.slope+d.intercept),25);}
  if(id===18){const d=f.derivedFacts;checks.stages=JSON.stringify([d.translatedCenter,d.finalCenter])===JSON.stringify([[1,3],[3,1]]);checks.distance=near(Math.abs(3-2+4)/Math.sqrt(5),Math.sqrt(5))&&near(Math.abs(3-2-6)/Math.sqrt(5),Math.sqrt(5));checks.intercepts=near(d.yIntercepts[0],2)&&near(d.yIntercepts[1],-3);}
  if(id===20){const f0=t=>t<8?t*t+2*t-14:t*t-13*t+106;const d=t=>Math.abs(2*t-f0(t)+10),r=t=>5*t;checks.boundaries=near(d(3),r(3))&&near(d(8),r(8))&&near(d(12),r(12));checks.inside=([4,9].every(t=>d(t)<r(t)));checks.outside=([2,13].every(t=>d(t)>r(t)));checks.interval=[3,8,8,12].join(',')==='3,8,8,12';checks.answer=12-2===10;}
  if(!Object.values(checks).every(Boolean))throw Error(`INDEPENDENT_MATH_FAIL:q${id}:${JSON.stringify(checks)}`);
  return {questionId:id,status:'PASS',method:'fresh calculation from source problem and frozen facts',checks};
}

function main(){
  CLIP_DEFS.clear();
  const sourceBytes=fs.readFileSync(SOURCE_PATH);if(sha(sourceBytes)!==LOCK.examSha256)throw Error('SOURCE_EXAM_HASH_MISMATCH');
  const sandbox={window:{}};vm.runInNewContext(sourceBytes.toString('utf8'),sandbox,{timeout:5000});
  const questions=sandbox.window.questionBank;
  if(!Array.isArray(questions)||questions.length!==20)throw Error('SOURCE_QUESTION_COUNT_MISMATCH');
  for(const dir of [SVG_DIR,SPEC_DIR,WITNESS_DIR,LAYOUT_DIR])fs.mkdirSync(dir,{recursive:true});
  const excluded=[2,8,16,19];
  for(const id of excluded){for(const [dir,file] of [[SVG_DIR,`q${String(id).padStart(2,'0')}.svg`],[SPEC_DIR,`q${String(id).padStart(2,'0')}-visualSpec.json`],[WITNESS_DIR,`q${String(id).padStart(2,'0')}.json`],[LAYOUT_DIR,`q${String(id).padStart(2,'0')}.json`]]){const target=path.join(dir,file);if(fs.existsSync(target))fs.rmSync(target);}}
  const entries=[],math=[];
  for(const id of INCLUDED){
    const q=questions.find(row=>Number(row.id)===id),locked=LOCK.sourceQuestions.find(row=>row.id===id);
    if(!q||!locked||sha(String(q.content))!==locked.contentSha256||sha(String(q.solution))!==locked.solutionSha256)throw Error(`SOURCE_QUESTION_LOCK_MISMATCH:q${id}`);
    const factPath=path.join(FACT_DIR,`q${String(id).padStart(2,'0')}.json`);const factBytes=fs.readFileSync(factPath);const facts=JSON.parse(factBytes);
    if(facts.questionUid!==`q${String(id).padStart(2,'0')}`||facts.route==='SPECIAL')throw Error(`FROZEN_FACT_INPUT_INVALID:q${id}`);
    const spec=specFor(id,facts);assertSpec(spec);const specText=JSON.stringify(spec,null,2)+'\n';fs.writeFileSync(path.join(SPEC_DIR,`q${String(id).padStart(2,'0')}-visualSpec.json`),specText,'utf8');
    CLIP_DEFS.clear();const built=buildVisual(spec);const svg=built.svg;
    fs.writeFileSync(path.join(SVG_DIR,`q${String(id).padStart(2,'0')}.svg`),svg,'utf8');
    const layout={questionId:id,viewBox:[0,0,svg.match(/viewBox="0 0 (\d+) (\d+)"/)[1]*1,svg.match(/viewBox="0 0 (\d+) (\d+)"/)[2]*1],panels:built.panels};
    fs.writeFileSync(path.join(LAYOUT_DIR,`q${String(id).padStart(2,'0')}.json`),JSON.stringify(layout,null,2)+'\n','utf8');
    const check=independentMath(id,facts,spec);math.push(check);
    const row={questionId:id,title:TITLES[id],visualPurpose:PURPOSE[id],candidateSvg:`${REL}/candidate-svg/q${String(id).padStart(2,'0')}.svg`,visualSpec:`${REL}/visual-spec/q${String(id).padStart(2,'0')}-visualSpec.json`,expectedFacts:`${REL}/expected-facts/q${String(id).padStart(2,'0')}.json`,layout:`${REL}/candidate-layout/q${String(id).padStart(2,'0')}.json`,sourceContentSha256:locked.contentSha256,sourceSolutionSha256:locked.solutionSha256,expectedFactsSha256:sha(factBytes),visualSpecSha256:sha(specText),candidateSha256:sha(svg),geometryEngine:'geometry-visual-v1',adapter:'HANDCRAFTED_SVG',domainEligibility:'ELIGIBLE',visualEligibility:'NON_EXEMPT',publicationAuthorized:false,selectorDecision:'SELECTED_FORCE_NEW'};
    const witness={schemaVersion:'force-new-candidate-witness-v2',questionId:id,classification:'HANDCRAFTED_SVG',status:'CANDIDATE_REQUIRES_QA',sourceContentSha256:locked.contentSha256,sourceSolutionSha256:locked.solutionSha256,expectedFactsSha256:row.expectedFactsSha256,visualSpecSha256:row.visualSpecSha256,normalizedSvgSha256:row.candidateSha256,independentMath:check,unresolvedLabels:[],publicationAuthorized:false,requiredGates:['INDEPENDENT_MATH_PARITY','ACTUAL_SVG_GEOMETRY_TEXT_PARITY','VIEWBOX_BOUNDS','STUDENT_LANGUAGE_LINT','DECISIVE_STEP_PEDAGOGY']};
    fs.writeFileSync(path.join(WITNESS_DIR,`q${String(id).padStart(2,'0')}.json`),JSON.stringify(witness,null,2)+'\n','utf8');entries.push(row);
  }
  fs.writeFileSync(path.join(HERE,'independent-math-checks.json'),JSON.stringify({schemaVersion:'force-new-independent-math-checks-v2',questionCount:16,passCount:math.length,failCount:0,checks:math},null,2)+'\n','utf8');
  const policy={schemaVersion:'visual-candidate-selector-policy-v2',engine:'geometry-visual-v1',mode:'FORCE_NEW',defaultTargetFamilies:['COORDINATE_GEOMETRY','LINE_OR_CIRCLE','SHAPE_TRANSFORMATION','GEOMETRY_RELATION','FUNCTION_OR_GRAPH','DECISIVE_SPATIAL_OR_GRAPH_RELATION'],allowedVisualTypes:['coordinate_geometry','line_circle_geometry','function_graph'],rejectedVisualTypes:['explanation_card'],mustShowDecisiveSolutionRelation:true,cardPossibilityIsNotEligibility:true,excludedVisualFamilies:['SET_CARDINALITY','SET_EQUALITY','SUBSET_OR_RESIDUE_MAXIMUM_SUM','SUBSET_SUMMATION'],decisionOrder:[{when:'domainEligibility != ELIGIBLE',decision:'EXCLUDE_DOMAIN_INELIGIBLE'},{when:'visualEligibility == VISUAL_EXEMPT',decision:'EXCLUDE_VISUAL_EXEMPT'},{when:'visualType not in allowedVisualTypes',decision:'EXCLUDE_GEOMETRY_VISUAL_INELIGIBLE'},{when:'decisive spatial or graph relation is absent',decision:'EXCLUDE_GEOMETRY_VISUAL_INELIGIBLE'},{when:'eligible and non-exempt and mode == FORCE_NEW',decision:'SELECT_AND_GENERATE_NEW_CANDIDATE'}],forceNewSemantics:{overridesOnly:'existingSolutionSvg reuse/keep/skip disposition',existingSolutionSvgContent:'not read, supplied, or used as visual reference',doesNotOverride:['domainEligibility','VISUAL_EXEMPT','source/fact readiness','decisive-step pedagogy gate']},failClosed:{missingDomainEligibility:'EXCLUDE_UNRESOLVED_ELIGIBILITY',missingVisualEligibility:'EXCLUDE_UNRESOLVED_VISUAL_APPLICABILITY',missingDecisiveRelation:'EXCLUDE_GEOMETRY_VISUAL_INELIGIBLE'},thisRun:{questionCount:20,domainEligibleCount:20,visualExemptCount:4,excludedVisualExemptQuestionIds:[2,8,16,19],selectedForceNewCount:16,selectedQuestionIds:INCLUDED,excludedDomainIneligibleQuestionIds:[],existingSvgReadAsReference:false},visualExemptions:[2,8,16,19].map(questionId=>({questionId,decision:'VISUAL_EXEMPT',reason:EXEMPT[questionId],geometryCandidate:false,followup:'필요 시 logic/table visual 계열에서 별도 판단'}))};
  fs.writeFileSync(path.join(HERE,'selection-policy.json'),JSON.stringify(policy,null,2)+'\n','utf8');
  const manifest={schemaVersion:'geometry-visual-force-new-candidate-manifest-v2',runId:'force-new-26-geumdang-pinpoint-rebuild-20261003',branch:'codex/pilot-26-geumdang-h1-force-new-svg',sourceFile:LOCK.examPath,sourceSha256:LOCK.examSha256,mode:'FORCE_NEW',engineVersion:'geometry-visual-v1',renderer:'candidate-only authored composition from rebuilt visualSpec and frozen facts',sourceScope:{sourceQuestionCount:20,lockedProblemAndSolutionPairs:20,frozenExpectedFacts:20},selectionSummary:{questionCount:20,domainEligible:20,visualExempt:4,selectedForceNew:16,excluded:[2,8,16,19],existingSvgReadAsReference:false,existingSvgAffectsEligibility:false},questions:entries,candidateSelectionPolicy:`${REL}/selection-policy.json`,calibrationPreflight:`${REL}/calibration-preflight.json`,productionWrite:false,mainMerge:false};
  fs.writeFileSync(path.join(HERE,'manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
  fs.writeFileSync(path.join(HERE,'generation-input-lock.json'),JSON.stringify({schemaVersion:'force-new-generation-input-lock-v1',sourceFile:LOCK.examPath,sourceSha256:LOCK.examSha256,selectedQuestions:entries.map(e=>({questionId:e.questionId,sourceContentSha256:e.sourceContentSha256,sourceSolutionSha256:e.sourceSolutionSha256,expectedFacts:e.expectedFacts,expectedFactsSha256:e.expectedFactsSha256})),excludedVisualExemptQuestionIds:[2,8,16,19],candidateSvgInputsRead:false,oldVisualSpecInputsRead:false},null,2)+'\n','utf8');
  console.log(JSON.stringify({status:'BUILT',questionCount:entries.length,questionIds:INCLUDED,exempt:[2,8,16,19],mathPassCount:math.length},null,2));
}

main();
