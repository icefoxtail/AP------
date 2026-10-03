const fs = require('fs');
const vm = require('vm');

const examPath = 'archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js';
const assetDir = 'archive/assets/images/22_신흥중_2학기_기말_중3_기출';

function assert(ok, message) {
  if (!ok) throw new Error(message);
}
function near(a, b, eps = 1e-3) { return Math.abs(a - b) <= eps; }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function angle(a, o, b) {
  const ux=a.x-o.x, uy=a.y-o.y, vx=b.x-o.x, vy=b.y-o.y;
  const c=(ux*vx+uy*vy)/(Math.hypot(ux,uy)*Math.hypot(vx,vy));
  return Math.acos(Math.max(-1,Math.min(1,c))) * 180 / Math.PI;
}
function attrs(tag) {
  const out={};
  for (const m of tag.matchAll(/([a-zA-Z][\w:-]*)="([^"]*)"/g)) out[m[1]]=m[2];
  return out;
}
function parseLines(svg) {
  return [...svg.matchAll(/<line\b[^>]*\/>/g)].map(m => {
    const a=attrs(m[0]);
    return {x1:+a.x1,y1:+a.y1,x2:+a.x2,y2:+a.y2,dash:a['stroke-dasharray']||''};
  });
}
function pointLineDistance(p,l) {
  const dx=l.x2-l.x1, dy=l.y2-l.y1;
  return Math.abs(dy*p.x-dx*p.y+l.x2*l.y1-l.y2*l.x1)/Math.hypot(dx,dy);
}

const sandbox={window:{}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(examPath,'utf8'),sandbox,{filename:examPath});
const bank=sandbox.window.questionBank;
assert(Array.isArray(bank) && bank.length===22,'JS_LOAD_OR_COUNT_FAIL');
const q=id => bank.find(x=>x.id===id);
assert(q(3).answer==='①' && q(3).image===assetDir+'/q3.png','Q3_SOURCE_PARITY_FAIL');
assert(q(9).answer==='①, ④' && q(9).image===assetDir+'/q9.png','Q9_SOURCE_PARITY_FAIL');
assert(q(17).answer==='두 현의 수직이등분선을 그어 그 교점을 원의 중심으로 정한다.' && q(17).image===assetDir+'/q17.png','Q17_SOURCE_PARITY_FAIL');
for (const id of [12,19]) {
  assert(!Object.prototype.hasOwnProperty.call(q(id),'problemTypeKey'),'Q'+id+'_FALSE_PT_PROJECTION_REMAINS');
  assert(!Object.prototype.hasOwnProperty.call(q(id),'templateKey'),'Q'+id+'_FALSE_TPL_PROJECTION_REMAINS');
}
assert(q(12).answer==='④','Q12_ANSWER_DRIFT');
assert(q(19).answer==='원에 내접하지 않는다. 한 내각은 $110^\\circ$이고 그 맞은각은 $60^\\circ$이므로 합이 $170^\\circ$이다.','Q19_ANSWER_DRIFT');

const s3=fs.readFileSync(assetDir+'/q3-solution.svg','utf8');
const l3=parseLines(s3);
const fromA=l3.filter(l=>near(l.x1,210)&&near(l.y1,30));
assert(fromA.length===2,'Q3_TRIANGLE_RAYS_MISSING');
const A={x:210,y:30}, B={x:fromA[0].x2,y:fromA[0].y2}, C={x:fromA[1].x2,y:fromA[1].y2};
assert(Math.abs(angle(B,A,C)-52)<0.02,'Q3_APEX_NOT_52');
assert(Math.abs(angle(A,B,C)-64)<0.02,'Q3_BASE_NOT_64');

const s9=fs.readFileSync(assetDir+'/q9-solution.svg','utf8');
const l9=parseLines(s9);
const O={x:230,y:150};
const centerRays=l9.filter(l=>near(l.x1,O.x)&&near(l.y1,O.y));
assert(centerRays.length===2,'Q9_CENTER_RAYS_MISSING');
const PB={x:centerRays[0].x2,y:centerRays[0].y2}, PS={x:centerRays[1].x2,y:centerRays[1].y2};
const groups=new Map();
for(const l of l9.slice(2)){
  const k=l.x1.toFixed(3)+','+l.y1.toFixed(3);
  if(!groups.has(k)) groups.set(k,[]);
  groups.get(k).push(l);
}
const candidates=[];
for(const lines of groups.values()){
  if(lines.length!==2) continue;
  const P={x:lines[0].x1,y:lines[0].y1};
  const ends=lines.map(l=>({x:l.x2,y:l.y2}));
  const owns=[PB,PS].every(t=>ends.some(e=>dist(e,t)<0.01));
  if(owns) candidates.push({P,a:angle(PB,P,PS),r:dist(P,O)});
}
assert(candidates.length===3,'Q9_OWNER_RAY_PAIRS_MISSING');
const a40=candidates.find(x=>Math.abs(x.a-40)<0.02);
const a42=candidates.find(x=>Math.abs(x.a-42)<0.02);
const a38=candidates.find(x=>Math.abs(x.a-38)<0.02);
assert(a40&&a42&&a38,'Q9_38_40_42_GEOMETRY_MISSING');
assert(Math.abs(a40.r-100)<0.02 && a42.r<100 && a38.r>100,'Q9_DISTANCE_CLASSIFICATION_FAIL');

const s17=fs.readFileSync(assetDir+'/q17-solution.svg','utf8');
const c17=attrs((s17.match(/<circle\b[^>]*r="90"[^>]*\/>/)||[])[0]||'');
const O17={x:+c17.cx,y:+c17.cy}, R=+c17.r;
assert(near(O17.x,210)&&near(O17.y,120)&&near(R,90),'Q17_CIRCLE_PARSE_FAIL');
const l17=parseLines(s17);
const chords=l17.slice(0,2);
for(const [i,l] of chords.entries()){
  const p1={x:l.x1,y:l.y1}, p2={x:l.x2,y:l.y2};
  assert(Math.abs(dist(p1,O17)-R)<0.02 && Math.abs(dist(p2,O17)-R)<0.02,'Q17_CHORD_ENDPOINT_OFF_CIRCLE_'+i);
}
const bisectors=l17.slice(2,4);
for(let i=0;i<2;i++){
  const ch=chords[i], mid={x:(ch.x1+ch.x2)/2,y:(ch.y1+ch.y2)/2};
  assert(pointLineDistance(O17,bisectors[i])<0.02,'Q17_BISECTOR_MISSES_CENTER_'+i);
  assert(pointLineDistance(mid,bisectors[i])<0.02,'Q17_BISECTOR_MISSES_MIDPOINT_'+i);
  const cv={x:ch.x2-ch.x1,y:ch.y2-ch.y1}, bv={x:bisectors[i].x2-bisectors[i].x1,y:bisectors[i].y2-bisectors[i].y1};
  const cos=Math.abs((cv.x*bv.x+cv.y*bv.y)/(Math.hypot(cv.x,cv.y)*Math.hypot(bv.x,bv.y)));
  assert(cos<0.001,'Q17_BISECTOR_NOT_PERPENDICULAR_'+i);
}

console.log('O68_TARGETED_REPAIR_VALIDATOR_PASS');
console.log(JSON.stringify({questionCount:bank.length,openQids:[3,9,12,17,19],geometry:{q3:'PASS',q9:'PASS',q17:'PASS'},metaProjection:{q12:'UNMATERIALIZED',q19:'UNMATERIALIZED'},jsLoad:'PASS'}));
