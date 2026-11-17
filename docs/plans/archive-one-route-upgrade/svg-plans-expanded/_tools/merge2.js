// 2순위: 한 문항에 플랜 여러 개 -> 한 장
const fs=require('fs'),path=require('path');
const L=require('./lib.js');const M=require('./merge.js');
const S=__dirname;const R=L.W;
const rows=JSON.parse(fs.readFileSync(S+'/multirows.json','utf8')).filter(r=>fs.existsSync(S+'/ex/archive/exams/'+r.k.slice(2,r.k.lastIndexOf('#'))+'.js'));
const GRAPH=['polynomial-spike-v1','piecewise-polynomial-spike-v1','piecewise-discontinuous-spike-v1'];
function readPlans(files){return files.map(f=>({f,p:JSON.parse(fs.readFileSync(R+f.replace(/^\.\//,''),'utf8'))}));}
function isLinearOne(p){const g=p.graphPlan;return p.capability==='piecewise-polynomial-spike-v1'&&g&&g.pieces&&g.pieces.length===1&&g.pieces[0].coefficients.length===2&&g.pieces[0].coefficients[1]!=='0'&&!(g.breakpoints&&g.breakpoints.length);}
function deg2(p){const c=p.graphPlan&&p.graphPlan.coefficients;return Array.isArray(c)&&c.reduce((h,v,k)=>v==='0'?h:k,0)===2;}
// returns {ok:true, plan, family} or {ok:false, reason}
function build(row,files){
  const exam=row.k.match(/^\.\/(.*)#/)[1];const ord=row.ord;
  const list=readPlans(files.sort());const plans=list.map(x=>x.p);
  const caps=[...new Set(plans.map(p=>p.capability))];
  if(caps.length>1)return {ok:false,reason:'MIXED',detail:caps.join('+')};
  const cap=caps[0],n=plans.length;
  const caption=plans.map(p=>p.caption||'');
  const mk=(panels,extra,family)=>({ok:true,family,plan:L.composite(panels,M.topCaption(caption),L.src(exam,ord,'한 문항 한 장: '+n+'개 그림을 패널로 합쳤다.'),extra)});
  const t=M.titles(caption);
  if(cap==='set-diagram-figure-v1'){
    if(n>6)return {ok:false,reason:'SET_PANELS_OVER_6'};
    if(plans.some(p=>!p.diagram||!['VENN','MAPPING'].includes(p.diagram.kind)))return {ok:false,reason:'SET_KIND_UNSUPPORTED'};
    const wide=plans.some(p=>p.diagram.kind==='MAPPING'&&Array.isArray(p.diagram.columns)&&p.diagram.columns.length>2);
    return mk(plans.map((p,i)=>[t[i],{capability:p.capability,diagram:p.diagram}]),wide?{columns:1}:null,'SET');
  }
  if(cap==='construction-spike-v1'){
    const okp=plans.every(p=>p.mathPlan&&p.mathPlan.realization&&p.mathPlan.realization.recipeId==='PLANE_FIGURE_v1'&&p.graphPlan===undefined);
    if(!okp)return {ok:false,reason:'CONSTRUCTION_AXES_OR_NONPLANE'};
    if(plans.some(p=>p.mathPlan.nodes.some(nd=>String(nd.op).startsWith('NORMALIZATION_'))))return {ok:false,reason:'PLANE_NORMALIZATION'};
    if(n>5)return {ok:false,reason:'PLANE_PANELS_OVER_5'};
    const panels=plans.map((p,i)=>{const c=M.clean(p);const cv=c.coordinateCanvas||{width:384,height:320};
      c.coordinateCanvas={width:Math.max(384,Math.min(cv.width,420)),height:Math.max(320,Math.min(cv.height,600))};return [t[i],c];});
    return mk(panels,null,'PLANE');
  }
  if(GRAPH.includes(cap)){
    if(plans.some(p=>!p.graphPlan))return {ok:false,reason:'GRAPH_NO_GRAPHPLAN'};
    if(n===2)return mk(plans.map((p,i)=>[t[i],M.clean(p)]),null,'GRAPH2');
    if(n===3){
      if(plans.every(isLinearOne))return mk(plans.map((p,i)=>[t[i],M.clean(p)]),{linearStack:true},'GRAPH3L');
      if(plans.every(p=>p.capability==='polynomial-spike-v1'&&deg2(p)))return mk(plans.map((p,i)=>[t[i],M.clean(p)]),null,'GRAPH3Q');
      return {ok:false,reason:'GRAPH3_NOT_LINEAR_OR_QUADRATIC'};
    }
    return {ok:false,reason:'GRAPH_PANELS_OVER_3'};
  }
  if(cap==='multi-curve-figure-v1'){
    if(n!==2)return {ok:false,reason:'MULTICURVE_NOT_2'};
    return mk(plans.map((p,i)=>[t[i],M.clean(p)]),null,'MULTI2');
  }
  if(cap==='number-line-figure-v1'){
    const first=plans[0];
    const keys=p=>Object.keys(p.numberLine).filter(k=>k!=='rows').sort().join(',')+JSON.stringify(Object.fromEntries(Object.entries(p.numberLine).filter(([k])=>k!=='rows')));
    if(plans.some(p=>!p.numberLine||!Array.isArray(p.numberLine.rows)))return {ok:false,reason:'NL_NO_ROWS'};
    if(plans.some(p=>keys(p)!==keys(first)))return {ok:false,reason:'NL_FIELDS_DIFFER'};
    if(plans.some(p=>p.numberLine.rows.some(r=>r.kind==='RESULT')))return {ok:false,reason:'NL_RESULT_ROW'};
    let rowsAll=[].concat(...plans.map((p,i)=>p.numberLine.rows.map(r=>Object.assign({},r))));
    const defd=rowsAll.filter(r=>r.label!==undefined).length;
    if(defd&&defd!==rowsAll.length)return {ok:false,reason:'NL_LABELS_PARTIAL'};
    if(defd){const labels=rowsAll.map(r=>r.label);if(new Set(labels).size!==labels.length){let k=0;rowsAll=[].concat(...plans.map((p,i)=>p.numberLine.rows.map(r=>Object.assign({},r,{label:String(r.label)+(i+1)}))));if(rowsAll.some(r=>r.label.length>6))return {ok:false,reason:'NL_DUP_LABELS'};}}
    const rest=Object.fromEntries(Object.entries(first).filter(([k])=>!['caption','sourceConditions','newVisualInformation','numberLine','accessibilityDescription'].includes(k)));
    if(rowsAll.length>4)return {ok:false,reason:'NL_ROWS_OVER_4'};
    const nl=Object.assign({},first.numberLine,{rows:rowsAll});
    const cp=M.topCaption(caption);
    return {ok:true,family:'NL',plan:Object.assign({},rest,{capability:cap,numberLine:nl,caption:cp,sourceConditions:L.src(exam,ord,'한 문항 한 장: '+n+'개 수직선을 한 그림의 줄로 합쳤다.'),newVisualInformation:[cp]})};
  }
  if(cap==='stat-chart-figure-v1'){
    if(plans.some(p=>!p.chart||!['DOT_PLOT','SCATTER','NORMAL_CURVE'].includes(p.chart.kind)))return {ok:false,reason:'STAT_KIND_UNSUPPORTED'};
    if(n>4)return {ok:false,reason:'STAT_PANELS_OVER_4'};
    return mk(plans.map((p,i)=>[t[i],{capability:p.capability,chart:p.chart}]),null,'STAT');
  }
  if(cap==='solid-figure-v1'){
    if(n>6)return {ok:false,reason:'SOLID_OVER_6'};
    return mk(plans.map((p,i)=>{const c=M.clean(p);delete c.panelWidth;return [t[i],c]}),null,'SOLID');
  }
  return {ok:false,reason:'CAP_NOT_COMPOSABLE',detail:cap};
}
module.exports={build,rows,readPlans};
if(require.main===module){
  const cnt={};const res=[];
  for(const row of rows){
    const files=JSON.parse(fs.readFileSync(S+'/multilist.json','utf8')).find(([k])=>k===row.k)[1];
    const r=build(row,files);
    const key=(r.ok?'OK '+r.family:'HOLD '+r.reason)+' | '+row.scope+(row.led==='PUBLISHED'?' PUB':'');
    cnt[key]=(cnt[key]||0)+1;
  }
  for(const [k,v] of Object.entries(cnt).sort())console.log(v,k);
}
