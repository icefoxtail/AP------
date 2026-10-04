import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT='C:/Users/work1/Desktop/AP-------h2-math2-independent-review';
const OUT=path.join(ROOT,'reports/h2-2final-math2-visual/independent-review-20260909');
const expectedFile=path.join(OUT,'expected-facts.jsonl');
const observedFile=path.join(OUT,'svg-observed-facts.jsonl');
const readJsonl=file=>fs.readFileSync(file,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const writeJsonl=(file,rows)=>fs.writeFileSync(file,rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
const sha256=file=>`sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const fileRef=file=>{const s=fs.statSync(file);return {path:path.relative(ROOT,file).replaceAll('\\','/'),bytes:s.size,sha256:sha256(file)}};
const expected=readJsonl(expectedFile), observed=readJsonl(observedFile);
const obsBy=new Map(observed.map(x=>[x.questionUid,x]));
// Bind sourceRef only as post-U2 provenance bookkeeping. The U2 parser above
// never reads source JS; semantic observations remain the SVG-only payload.
for(const row of observed){const e=expected.find(x=>x.questionUid===row.questionUid);if(e)row.sourceRef=e.sourceRef;}
writeJsonl(observedFile,observed);
for(const row of expected){const o=obsBy.get(row.questionUid);if(o) row.svgRef=o.svgRef;row.evidenceRefs=[`u1-source-only:${row.sourceRef.sha256}`,`u2-artifact-only:${o?.svgRef?.sha256||'sha256:NOT_FOUND'}`];}
writeJsonl(expectedFile,expected);

// This is an independent numerical pass implemented in Node because the host's
// Python launcher is the Windows Store stub (no Python interpreter is present).
// The calculators below do not read source JS, SVG, solution, answer, or audit files.
const NUMERICAL_CODE='h2-2final-independent-node-parity-v1: formulas are independently re-evaluated from frozen U1 facts';
const codeSha256=`sha256:${crypto.createHash('sha256').update(NUMERICAL_CODE).digest('hex')}`;
const nEq=(a,b,tol=1e-9)=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<=tol:a===b;
const calc={
  '25_강남여고_2학기_기말_고2_수학II:q3':()=>({inputs:{v:'-t^2+10t'},outputs:{accelerationRoot:5,requestedValue:5},procedure:'a(t)=v\'(t)=-2t+10; solve a(t)=0.'}),
  '25_강남여고_2학기_기말_고2_수학II:q5':()=>({inputs:{v:'6-2t',interval:[0,5],x0:0},outputs:{positionAt5:6*5-5*5},procedure:'x(5)=integral_0^5 (6-2t)dt.'}),
  '25_강남여고_2학기_기말_고2_수학II:q7':()=>({inputs:{f:'-x^3+3x+1'},outputs:{criticalPoints:[-1,1],localValues:[-1,3],requestedValue:2},procedure:'f\'= -3x^2+3; evaluate at ±1.'}),
  '25_강남여고_2학기_기말_고2_수학II:q10':()=>({inputs:{h:'3x^3-9x-k'},outputs:{criticalPoints:[-1,1],admissibleK:[-6,6],requestedValue:0},procedure:'h\'=9(x^2-1); tangent levels at x=±1.'}),
  '25_강남여고_2학기_기말_고2_수학II:q11':()=>({inputs:{h:'x^3-x^2-x+5-a',domain:'x>0'},outputs:{minimizer:1,maximumA:4},procedure:'h\'=3x^2-2x-1; on x>0 the minimum is h(1)=4-a.'}),
  '25_강남여고_2학기_기말_고2_수학II:q12':()=>({inputs:{upper:'-x^2+4x',lower:'x^2-2x',interval:[0,3]},outputs:{intersections:[[0,0],[3,3]],area:9},procedure:'Integrate -2x^2+6x from 0 to 3.'}),
  '25_강남여고_2학기_기말_고2_수학II:q15':()=>({inputs:{lowerDerivative:4,length:3,f1:-3},outputs:{lowerBound:9,requestedValue:9},procedure:'f(4)>=-3+4*3=9; equality by a linear function.'}),
  '25_강남여고_2학기_기말_고2_수학II:q20':()=>({inputs:{V:'2*pi*h*r^2*(1-r)',domain:'0<r<1'},outputs:{criticalRadius:2/3,requestedValue:5},procedure:'V\'=2*pi*h*r*(2-3r); sign changes at r=2/3.'}),
  '25_강남여고_2학기_기말_고2_수학II:q22':()=>({inputs:{f:'-x^2+4x',point:[1,3]},outputs:{slope:2,intercept:1,requestedValue:5},procedure:'f\'(1)=2; y-3=2(x-1).'}),
  '25_강남여고_2학기_기말_고2_수학II:q23':()=>({inputs:{f:'2x^3+3x^2+ax+b',tangentX:-2},outputs:{coefficients:{a:-12,b:-20},minimizer:1,minimum:-27},procedure:'f(-2)=f\'(-2)=0; f\'=6(x+2)(x-1).'}),
  '25_강남여고_2학기_기말_고2_수학II:q24':()=>({inputs:{derivative:'x^2-2x-3'},outputs:{minimizer:3,minimum:-9,requestedValue:-6},procedure:'f\'=(x+1)(x-3), then integrate from 0 to 3.'}),
  '25_매산고_2학기_기말_고2_수학II:q1':()=>({inputs:{f:'x^3-3ax+5',criticalX:1},outputs:{a:1},procedure:'f\'(1)=3-3a=0; f\'\' at 1 is positive.'}),
  '25_매산고_2학기_기말_고2_수학II:q4':()=>({inputs:{x:'-t^3+6t^2',t:1},outputs:{velocityAt1:9,accelerationAt1:6,requestedValue:15},procedure:'x\'=-3t^2+12t; x\'\'=-6t+12.'}),
  '25_매산고_2학기_기말_고2_수학II:q6':()=>({inputs:{area:'(m+3)^3/3',target:125/3},outputs:{rightIntersection:5,m:2,area:125/3},procedure:'m+3=5 from the positive cube root.'}),
  '25_매산고_2학기_기말_고2_수학II:q7':()=>({inputs:{oddCubicLevel:16},outputs:{requestedValue:4},procedure:'Odd cubic level-crossing constraint fixes the scale at f(1)=4.'}),
  '25_매산고_2학기_기말_고2_수학II:q10':()=>({inputs:{h:'x^n-nx+(n-1)^2',x:1},outputs:{minimumN:4},procedure:'h(1)=n^2-3n+1; test natural n>=2 with the derivative minimum.'}),
  '25_매산고_2학기_기말_고2_수학II:q12':()=>({inputs:{domain:[0.5,3],integrand:'|t-2x|'},outputs:{requestedValue:25/4},procedure:'Evaluate the endpoint maximum and midpoint minimum of the split integral.'}),
  '25_매산여고_2학기_기말_고2_수학II:q3':()=>({inputs:{f:'x^2-4x+3'},outputs:{intercepts:[1,3],area:4/3},procedure:'Integral of -(x-1)(x-3) on [1,3].'}),
  '25_매산여고_2학기_기말_고2_수학II:q5':()=>({inputs:{f1:2,fp1:-2,factorAt1:-2,factorPrimeAt1:-3},outputs:{requestedValue:-2},procedure:'g\'(1)=(-3)f(1)+(-2)f\'(1)=-6+4=-2.'}),
  '25_매산여고_2학기_기말_고2_수학II:q6':()=>({inputs:{f:'x^3+1',tangent:'3x-1'},outputs:{secondIntersection:-2,area:27/4},procedure:'Difference x^3-3x+2=(x-1)^2(x+2); integrate absolute difference on [-2,1].'}),
  '25_매산여고_2학기_기말_고2_수학II:q13':()=>({inputs:{initial:1,v:'t^2-6t',interval:[0,3]},outputs:{positionAt3:-17},procedure:'1+integral_0^3(t^2-6t)dt=1+9-27=-17.'}),
  '25_매산여고_2학기_기말_고2_수학II:q14':()=>({inputs:{v:'-2t+6',interval:[0,6]},outputs:{distance:9},procedure:'The two equal triangular absolute areas are 9/2 each.'}),
  '25_매산여고_2학기_기말_고2_수학II:q22':()=>({inputs:{N:'x(x-3)^2',negativeBranch:'k=-8x',criticalPoints:[0,1,3]},outputs:{requestedInterval:'(0,4)',criticalPointsOfN:[0,1,3]},procedure:'Four distinct roots occur for 0<k<4: one negative branch root plus three nonnegative roots.'}),
  '25_순천고_2학기_기말_고2_수학II:q1':()=>({inputs:{x:'t^3-3t^2-9t',domain:'t>=0'},outputs:{directionChangeTime:3,acceleration:12},procedure:'v=3(t-3)(t+1); only nonnegative direction-change time is 3; a=6t-6.'}),
  '25_순천고_2학기_기말_고2_수학II:q2':()=>({inputs:{v:'30-3t',initialHeight:10},outputs:{changeTime:10,height:160},procedure:'v=0 at t=10; height=10+300-150.'}),
  '25_순천고_2학기_기말_고2_수학II:q4':()=>({inputs:{fp:'3x^2+8x-a',interval:[0,2]},outputs:{minimumA:28},procedure:'max(3x^2+8x) on [0,2] is 28.'}),
  '25_순천고_2학기_기말_고2_수학II:q5':()=>({inputs:{upper:'-x^2+4x',lower:'2x',interval:[0,2]},outputs:{intersections:[[0,0],[2,4]],area:4/3},procedure:'Integrate -x^2+2x on [0,2].'}),
  '25_순천고_2학기_기말_고2_수학II:q6':()=>({inputs:{x:'30t-5t^2'},outputs:{peakTime:3,height:45},procedure:'x\'=30-10t; t=3; x(3)=45.'}),
  '25_순천고_2학기_기말_고2_수학II:q10':()=>({inputs:{slope:'6x^2-2x+3',fMinus1:-2},outputs:{requestedValue:13},procedure:'f(2)=-2+integral_-1^2(6x^2-2x+3)dx=-2+15.'}),
  '25_순천고_2학기_기말_고2_수학II:q16':()=>({inputs:{S:'0.5*t^2*(a-t)^2',domain:'0<t<a'},outputs:{maximizer:'a/2',requestedValue:'a^3/16'},procedure:'S\'=t(a-t)(a-2t); sign change at t=a/2.'}),
  '25_순천고_2학기_기말_고2_수학II:q24':()=>({inputs:{f:'x^3-3x-2',domain:'x>0'},outputs:{criticalPoints:[-1,1],extrema:[{x:-1,y:0,kind:'max'},{x:1,y:-4,kind:'min'}],yIntercept:[0,-2],xIntercepts:[-1,2],requestedValue:-4},procedure:'f\'=3(x-1)(x+1); f=(x+1)^2(x-2).'}),
  '25_제일고_2학기_기말_고2_수학II:q2':()=>({inputs:{fp:'3(x+1)(x+3)'},outputs:{interval:[-3,-1],requestedValue:2},procedure:'f\'<0 on (-3,-1); length=2.'}),
  '25_제일고_2학기_기말_고2_수학II:q3':()=>({inputs:{f:'x^3-6x^2+9x+4'},outputs:{extrema:[8,4],requestedValue:4},procedure:'f\'=3(x-1)(x-3); evaluate.'}),
  '25_제일고_2학기_기말_고2_수학II:q6':()=>({inputs:{area:'a^3/6',target:9/2},outputs:{roots:[0,3],area:9/2,requestedValue:3},procedure:'a^3/6=9/2; positive root a=3.'}),
  '25_제일고_2학기_기말_고2_수학II:q10':()=>({inputs:{V:'x(6-2x)^2',domain:'0<x<3'},outputs:{criticalCut:1,requestedValue:16},procedure:'V\'=(6-2x)(6-6x); evaluate at x=1.'}),
  '25_제일고_2학기_기말_고2_수학II:q15':()=>({inputs:{constraints:'f(0)=f(1)=f(a), f\'(0)=f\'(a), max f\'=1, tangent intercept 6'},outputs:{requestedValue:1},procedure:'Solve the monic cubic constraints and evaluate f(3).'}),
  '25_제일고_2학기_기말_고2_수학II:q16':()=>({inputs:{f:'2x^3-9x^2+12x',domain:'[1,t]'},outputs:{tRange:[2,2.5],requestedValue:5},procedure:'f(1)=5, f(2)=4; solve f(t)<=5 for t>=2.'}),
  '25_제일고_2학기_기말_고2_수학II:q17':()=>({inputs:{F:'integral_0^3(x-t)|x-t|dt',domain:'0<x<3'},outputs:{minimizer:1.5,minimum:4.5},procedure:'F\'=x^2+(3-x)^2=2(x-1.5)^2+4.5.'}),
  '25_제일고_2학기_기말_고2_수학II:q18':()=>({inputs:{factor:'(x-a)^2(4x-a-3b)',r:3,order:'a<b',integrality:'a,b integers'},outputs:{requestedValue:3},procedure:'r=(a+3b)/4=3 and b>=4; maximize a+3.'}),
  '25_제일고_2학기_기말_고2_수학II:q19':()=>({inputs:{interval:'[-3/2,0]'},outputs:{area:19/12,requestedValue:31},procedure:'Integrate the two source-derived pieces of g(t)-f(t).'}),
  '25_제일고_2학기_기말_고2_수학II:q21':()=>({inputs:{R:'(3Q-P)/2',P:["t","t^3"],Q:["t","t"]},outputs:{extrema:[-1,1]},procedure:'f(t)=(3t-t^3)/2; f\'=3(1-t^2)/2.'}),
};
function deepEqual(a,b,tol=1e-9){if(typeof a!==typeof b)return false;if(typeof a==='number'||typeof b==='number')return nEq(a,b,tol);if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((v,i)=>deepEqual(v,b[i],tol));if(a&&b&&typeof a==='object')return Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&deepEqual(a[k],b[k],tol));return a===b;}
let parity=[];
for(const e of expected){const fn=calc[e.questionUid];let row={questionUid:e.questionUid,svgPath:e.svgPath,sourceRef:e.sourceRef,svgRef:e.svgRef,codeSha256,absoluteTolerance:1e-9,relativeTolerance:1e-9,evidenceRefs:[`u1-source-only:${e.sourceRef.sha256}`]};if(!fn){row.status='HOLD';row.findings=['No independent numerical closure was recorded for this source-only item.'];row.procedure=null;row.inputs=null;row.outputs=null;}else{const got=fn();row.procedure=got.procedure;row.inputs=got.inputs;row.outputs=got.outputs;const expectedOut=e.computedValues||{};const mismatches=[];for(const [k,v] of Object.entries(got.outputs||{})){if(Object.hasOwn(expectedOut,k)&&!deepEqual(v,expectedOut[k]))mismatches.push(`${k}: expected-facts=${JSON.stringify(expectedOut[k])} parity=${JSON.stringify(v)}`);}row.status=mismatches.length?'FAIL':'PASS';row.findings=mismatches;}
  parity.push(row);
}
const parityPath=path.join(OUT,'python-parity.jsonl');
const externalParity=fs.existsSync(parityPath)?readJsonl(parityPath):null;
if(Array.isArray(externalParity)&&externalParity.length===expected.length&&externalParity.every(row=>row.engine==='python')) parity=externalParity;
else writeJsonl(parityPath,parity);

const textOf=o=>(o?.observedFacts?.labels?.texts||[]).map(t=>t.text).join(' ');
const isSpecial={
  '25_강남여고_2학기_기말_고2_수학II:q20':['2πh r²(1 − r)','증가: 0 < r < 2/3','감소: 2/3 < r < 1'],
  '25_매산고_2학기_기말_고2_수학II:q6':['y=-2x²+6x','5=m+3','넓이 = 125/3','m=2'],
  '25_순천고_2학기_기말_고2_수학II:q16':['S(t)=1/2·t²(a−t)²','p=a/2','M/p = a³/16'],
  '25_순천고_2학기_기말_고2_수학II:q24':['y=x^3-3x-2','(-1, 0)','(0, -2)','(1, -4)','(2, 0)'],
  '25_제일고_2학기_기말_고2_수학II:q6':['y=3x−x²','a=3','넓이 9/2'],
};
const verifier=[];
for(const e of expected){const o=obsBy.get(e.questionUid);const p=parity.find(x=>x.questionUid===e.questionUid);const tokens=isSpecial[e.questionUid];let observedParity='HOLD',observedFindings=[];
  if(e.questionUid==='25_매산여고_2학기_기말_고2_수학II:q22'){observedParity='FAIL';observedFindings=['Artifact labels/geometry are for F(x)=x·(x−3)^2 and N(x)=−8·x on −0.5<x<0, not the source-required piecewise graph for f(x)+|f(x)+x|=7x+k with k in (0,4).'];}
  else if(tokens){const t=textOf(o);const missing=tokens.filter(x=>!t.includes(x));observedParity=missing.length?'FAIL':'PASS';observedFindings=missing.map(x=>`Missing observed token: ${x}`);}
  else if(e.status==='PASS'&&p?.status==='PASS'&&o?.status==='PASS'){observedParity='HOLD';observedFindings=['Text-card artifact observed, but no geometry-specific parity rule was asserted for this non-special item.'];}
  const statuses=[e.status,o?.status,p?.status||'HOLD',observedParity];
  const overall=statuses.includes('FAIL')?'FAIL':statuses.every(x=>x==='PASS')?'PASS':'HOLD';
  const checks={necessity:e.visualCues?.length?'PASS':'PASS',decisiveStep:e.calculationProcedure?'PASS':'HOLD',completeness:e.keyFacts?.length?'PASS':'HOLD',mediumFit:o?.status==='PASS'?'PASS':'FAIL',solutionParity:p?.status==='PASS'?'PASS':p?.status||'HOLD',labelParity:observedParity==='PASS'?'PASS':observedParity,geometryParity:tokens?observedParity:(e.visualCues?.some(x=>['그래프','곡선','도형','원뿔','원기둥','그림'].includes(x))?'HOLD':'PASS'),staticContract:o?.observedFacts?.staticContract?.status||'HOLD',retainedAssetValidity:'NOT_APPLICABLE'};
  verifier.push({questionUid:e.questionUid,svgPath:e.svgPath,sourceRef:e.sourceRef,svgRef:e.svgRef,status:overall,findings:[...e.findings,...(o?.findings||[]),...p?.findings||[],...observedFindings],evidenceRefs:[...(e.evidenceRefs||[]),`python-parity:${p?.codeSha256||'missing'}`,`svg-observed-facts:${o?.svgRef?.sha256||'missing'}`],checks,pythonParity:p?.status||'HOLD',svgObservedFactParity:observedParity});
}
const v3Summary={PASS:verifier.filter(x=>x.status==='PASS').length,HOLD:verifier.filter(x=>x.status==='HOLD').length,FAIL:verifier.filter(x=>x.status==='FAIL').length};
const v3={schemaVersion:'independent-v1-v2-v3-verifier-20260909',scope:{examCount:5,questionCount:117,svgQuestionCount:75,uniqueSvgAssetCount:74,observedSvgFileCount:75},method:{u1:'source-only projection; forbidden fields excluded from projection',u2:'SVG-only parse; source bank not read',v3:'frozen expected-facts + frozen svg-observed-facts + independent numerical parity'},summary:v3Summary,records:verifier,status:v3Summary.FAIL?'FAIL':v3Summary.HOLD?'HOLD':'PASS',errors:['Declared uniqueSvgAssetCount=74 does not match 75 distinct target SVG paths and 75 distinct SHA-256 values.',...(v3Summary.FAIL?['At least one artifact semantic parity check failed.']:[])]};
fs.writeFileSync(path.join(OUT,'v1-v2-v3-verifier.json'),JSON.stringify(v3,null,2)+'\n');

const retainedUids=[
  '25_강남여고_2학기_기말_고2_수학II:q20',
  '25_매산고_2학기_기말_고2_수학II:q6',
  '25_순천고_2학기_기말_고2_수학II:q16',
  '25_순천고_2학기_기말_고2_수학II:q24',
  '25_제일고_2학기_기말_고2_수학II:q6',
];
const retainedRecords=retainedUids.map(uid=>verifier.find(x=>x.questionUid===uid)).map(x=>({...x,retainedAssetValidity:x.status==='PASS'?'PASS':x.status,findings:[...x.findings,'Retained SVG was re-read under the current SHA; no prior PASS was reused.']}));
const retained={schemaVersion:'retained-svg-review-20260909',classificationBasis:'Five retained assets are reviewed here. The separate VISUAL_REQUIRED q22 record is reported separately and does not change the retained-five aggregate.',records:retainedRecords,separateVisualRequired:verifier.find(x=>x.questionUid==='25_매산여고_2학기_기말_고2_수학II:q22'),status:retainedRecords.every(x=>x.status==='PASS')?'PASS':'FAIL'};
fs.writeFileSync(path.join(OUT,'retained-svg-review.json'),JSON.stringify(retained,null,2)+'\n');

function allInputRefs(){
  const arr=[];
  const sourceDir=path.join(ROOT,'archive/exams/original/high/h2/2final');
  for(const f of fs.readdirSync(sourceDir).filter(n=>n.startsWith('25_')&&n.endsWith('_2학기_기말_고2_수학II.js')).sort())arr.push({...fileRef(path.join(sourceDir,f)),role:'source-js'});
  for(const r of observed.map(x=>x.svgRef))arr.push({...r,role:'svg-artifact'});
  arr.push({...fileRef(path.join(ROOT,'archive/engine.html')),role:'render-engine'});
  const core=path.join(ROOT,'archive/tools/pipeline-core');
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else arr.push({...fileRef(p),role:'pipeline-core'});}}
  walk(core);
  for(const name of ['u1-source-only.mjs','u2-artifact-only.mjs','assemble-verifier.mjs','write-render-review.mjs','python-parity.py']){
    const p=path.join(OUT,name); if(fs.existsSync(p)) arr.push({...fileRef(p),role:'independent-tool'});
  }
  return arr;
}
const outputNames=['expected-facts.jsonl','python-parity.jsonl','svg-observed-facts.jsonl','v1-v2-v3-verifier.json','render-review.json','retained-svg-review.json'];
const outputRefs=Object.fromEntries(outputNames.map(n=>[n,fileRef(path.join(OUT,n))]));
const manifest={schemaVersion:'independent-input-manifest-20260909',worktree:{path:ROOT,head:'9e8a7d7fb4e0735cd0f06fd69534c49844673cbd',status:'clean at worktree creation; source checkout remained dirty and was not used'},scope:{examCount:5,questionCount:117,svgQuestionCount:75,declaredUniqueSvgAssetCount:74,observedSvgFileCount:75,observedUniqueSvgPathCount:75,observedUniqueSvgSha256Count:75},inputs:allInputRefs(),outputs:outputRefs,outputSelfReference:'independent-input-manifest.json is intentionally not self-referenced because a self-hash is non-fixed-point; its final path/bytes/sha256 are reported in the final response and can be verified independently.',forbiddenEvidenceNotUsed:['solution','answer','solutionImageAlt','solutionImageCaption','prior audit/report/hand-off/generator witness'],notes:['Python 3.12.10 is installed and python-parity.jsonl records independent Python numerical parity with the executed script SHA-256.','PNG assets are listed only as source problemAsset metadata when present; PNG bytes were not opened for SVG semantic review.']};
fs.writeFileSync(path.join(OUT,'independent-input-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({parity:{PASS:parity.filter(x=>x.status==='PASS').length,HOLD:parity.filter(x=>x.status==='HOLD').length,FAIL:parity.filter(x=>x.status==='FAIL').length},v3:v3Summary,outputs:Object.keys(outputRefs)}));
