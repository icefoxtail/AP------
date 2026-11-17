// plan 작성 도우미 (batch64)
const fs=require('fs'),vm=require('vm'),path=require('path');
const S=__dirname;
const W='C:/Users/USER/Desktop/AP------/.claude/worktrees/svg-plans/docs/plans/archive-one-route-upgrade/svg-plans-expanded/';
function question(exam,ord){ // exam: 'original/high/...' without .js
  const c={window:{}};vm.runInNewContext(fs.readFileSync(S+'/ex/archive/exams/'+exam+'.js','utf8'),c);
  const q=c.window.questionBank||c.window.examData.questions;return q[ord-1];}
function src(exam,ord,method){
  const q=question(exam,ord);
  const a=[{id:'source',condition:q.content,mappedTo:'PRESERVED_ARCHIVE_BANK'}];
  if(method)a.push({id:'method',condition:method,mappedTo:'diagram'});
  return a;}
function num(v){ // number|string -> typed scalar
  if(typeof v==='number'){ if(Number.isInteger(v))return {kind:'integer',value:String(v)}; throw new Error('use fraction string');}
  const s=String(v); if(/^-?\d+$/.test(s))return {kind:'integer',value:s};
  const m=s.match(/^(-?\d+)\/(\d+)$/); if(m)return {kind:'rational',numerator:m[1],denominator:m[2]};
  throw new Error('bad num '+s);}
// 평면도형(construction-spike PLANE_FIGURE_v1) plan
function plane(o){
  const ids=Object.keys(o.pts);const first=ids[0];
  const nodes=[];
  for(const id of ids){
    const [x,y]=o.pts[id];
    if(id===first)nodes.push({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[num(x),num(y)]},outputType:'POINT',factRole:'GIVEN'});
    else{const [x0,y0]=o.pts[first];
      // dx,dy relative to first via fraction arithmetic (inputs given as ints or n/d)
      nodes.push({id,op:'TRANSLATE_POINT',inputs:[first],args:{dx:num(sub(x,x0)),dy:num(sub(y,y0))},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'});}
  }
  const p={capability:'construction-spike-v1',
    mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes},
    displayPoints:o.show||ids.filter(i=>!o.hide||!o.hide.includes(i)),
    displaySegments:o.segs.map(s=>typeof s==='string'?{id:s,refs:[s[0],s[1]]}:s),
    displayCircles:o.circles||[],displayLines:o.lines||[]};
  if(o.hidden){p.hiddenPointNames=o.hidden;}
  if(o.canvas)p.coordinateCanvas=o.canvas;
  const pm={};
  if(o.dims)pm.expressionLabels=o.dims.map((d,i)=>({id:'v'+d[0]+i,ownerSegment:d[0],text:d[1],factRole:d[2]||'DERIVED_INTERMEDIATE'}));
  for(const k of ['angles','equalLengths','parallels','regions','arcs','dimensions','callouts'])if(o[k])pm[k]=o[k];
  if(Object.keys(pm).length)p.planeMarks=pm;
  p.rightAngles=(o.right||[]).map((r,i)=>({id:'r'+i,refs:r}));
  if(!o.panel)p.caption=o.caption;
  return p;}
function sub(a,b){ // a-b for ints or n/d strings
  const f=x=>{const s=String(x);const m=s.match(/^(-?\d+)\/(\d+)$/);return m?[+m[1],+m[2]]:[+s,1]};
  const [an,ad]=f(a),[bn,bd]=f(b);let n=an*bd-bn*ad,d=ad*bd;const g=(x,y)=>y?g(y,x%y):Math.abs(x);const k=g(n,d)||1;n/=k;d/=k;if(d<0){n=-n;d=-d}
  return d===1?String(n):n+'/'+d;}
function composite(panels,caption,sc,extra){
  const p={capability:'composite-panels-v1',panels:panels.map(([t,plan])=>({caption:{text:t},plan})),caption,sourceConditions:sc,newVisualInformation:[caption]};
  return Object.assign(p,extra||{});}
function write(rel,obj){const f=W+rel;fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(obj,null,2)+'\n');return f;}
module.exports={question,src,plane,composite,write,W,S,num};
