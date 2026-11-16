import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {assetIdentity} from '../production/contracts.mjs';
import {specFor} from '../production/phase2.mjs';
import {typesetter} from '../production/typography.mjs';
import {pythonWorker} from '../production/worker.mjs';

const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const identity=assetIdentity('palma-log-levels|22','SOLUTION_VISUAL','decisive-relation');
const capability='multi-curve-figure-v1';
const caption='두 로그곡선과 공통 절편, 높이의 관계';
const logCurve=(id,base,color)=>({id,kind:'LOGARITHMIC',base,coefficients:['1','1','0','0'],
  domain:['1/4','17'],color,weight:'BOLD',hideLabel:true});
const graphPlan={
  family:'multi-curve',
  curves:[logCurve('la','2','BLUE'),logCurve('lb','4','WARM'),
    {id:'level',kind:'LINE',coefficients:['2','0'],domain:['0','17'],style:'DASHED',color:'GREEN',label:'y=2'}],
  axisTickValues:{x:[],y:[]},viewport:[-.5,17.5,-2.5,4.5],axisScale:{x:1,y:3},
  overlays:{
    points:[
      {id:'I',x:'1',y:'0',unnamed:true},{id:'A',x:'4',y:'2',color:'BLUE'},{id:'B',x:'16',y:'2',color:'WARM'},
      {id:'C',x:'4',y:'1',color:'WARM'},{id:'D',x:'16',y:'4',color:'BLUE'}
    ],
    segments:[{id:'AC',from:'A',to:'C',dashed:true},{id:'BD',from:'B',to:'D',dashed:true}],
    callouts:[
      {id:'x1Label',point:'I',text:'x=1',labelKind:'MATH',direction:'S'},
      {id:'logaLabel',point:'A',text:'y=logb(a,x)',labelKind:'MATH',direction:'NW'},
      {id:'loga2Label',point:'B',text:'y=logb((a+2),x)',labelKind:'MATH',direction:'NE'}
    ]
  }
};

async function invoke(payload,options){
  const {status,result}=await pythonWorker(payload,options);
  assert.equal(status,'OK',JSON.stringify(result));
  return result;
}

// This fixture exercises the real typesetter, layout builder and static observer with intrinsic sizes.
// The actual browser measurement and publication checks remain in the official composer.
async function build(input){
  const {graphPlan:framed}=await invoke({action:'frame_graph',graphPlan:input});
  const model=await invoke({action:'graph',graphPlan:framed});
  const spec=specFor({capability,caption,graphPlan:framed},model,identity.assetId);
  const bridges=new Map();
  for(const object of spec.objects){
    if(!object.branch?.startsWith('CURVE_'))continue;
    const reserved='REF_MC'+(bridges.size+1);
    bridges.set(reserved,object.branch);
    object.branch=reserved;
  }
  const {labels}=await invoke({action:'prepare',spec});
  const typeset=typesetter(),fragments={},measurements={};
  for(const label of labels){
    const factRole=spec.displayFacts.factRolesByLabel?.[label.id]||'DERIVED_INTERMEDIATE';
    const math=label.math||label.kind==='POINT_NAME';
    const fragment=typeset({id:label.id,owner:label.target||label.id,factRole,fontPx:13.5,
      ...(math?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    fragments[label.id]=fragment;
    measurements[label.id]=[fragment.intrinsic.width,fragment.intrinsic.height];
  }
  const built=await invoke({action:'build',spec,measurements,fragments});
  assert.deepEqual(built.witness.layout.unresolved,[]);
  assert.deepEqual(built.witness.layout.suppressed,[]);
  let svg=built.svg;
  for(const [reserved,branch] of bridges){
    const token='data-branch="'+reserved+'"';
    assert.equal(svg.split(token).length,2,token);
    svg=svg.replace(token,'data-branch="'+branch+'"');
  }
  const {aspectPolicy:_,...coordinateModel}=built.witness.coordinateModel;
  const transform={...coordinateModel,displayScale:1};
  const observe=(candidate=svg)=>invoke({action:'graphAudit',graphPlan:framed,svg:candidate,transform},{script:observer});
  return {svg,labels,observe};
}

let symbolicBuild;
const buildSymbolic=()=>symbolicBuild??=build(graphPlan);

function replaceLabel(svg,id,mutate){
  const start=svg.indexOf('<g id="overlay-callout-'+id+'"');
  assert.notEqual(start,-1,id);
  const end=svg.indexOf('</svg>',start)+6;
  assert.ok(end>start);
  const original=svg.slice(start,end),changed=mutate(original);
  assert.notEqual(changed,original,id);
  return svg.slice(0,start)+changed+svg.slice(end);
}

test('the real MathJax glyphs for both Q22 symbolic log bases pass the independent static observer',async()=>{
  const {labels,observe}=await buildSymbolic();
  assert.deepEqual(labels.filter(label=>label.id.startsWith('overlay-callout-')).map(label=>label.tex),[
    'x=1',String.raw`y=\log_{a}\left(x\right)`,String.raw`y=\log_{(a+2)}\left(x\right)`
  ]);
  const audit=await observe();
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('a numeric log base uses the same independent readback',async()=>{
  const input=structuredClone(graphPlan);
  input.overlays.callouts[1].text='y=logb(2,x)';
  const {labels,observe}=await build(input);
  assert.equal(labels.find(label=>label.id==='overlay-callout-logaLabel').tex,String.raw`y=\log_{2}\left(x\right)`);
  const audit=await observe();
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
});

test('the log callout observer rejects tampered base, argument, operator, placement and owner',async()=>{
  const {svg,observe}=await buildSymbolic();
  const changes=[
    fragment=>fragment.replace('data-c="2B"','data-c="2212"'),
    fragment=>fragment.replace('data-c="1D465"','data-c="1D466"'),
    fragment=>fragment.replace('data-c="6C"','data-c="1D459"'),
    fragment=>fragment.replace('data-mml-node="msub"','data-mml-node="mrow"'),
    fragment=>fragment.replace(/(translate\([\d.]+,)-[\d.]+(\) scale\()/,(_before,opening,closing)=>opening+'0'+closing),
    fragment=>fragment.replace('data-c="2061"','data-c="2062"'),
    fragment=>fragment.replace('data-c="32" d="','data-c="32" d="" data-unused="'),
  ];
  for(const change of changes){
    const audit=await observe(replaceLabel(svg,'loga2Label',change));
    assert.ok(audit.errors.includes('OVERLAY_CALLOUT_TEXT_MISMATCH:loga2Label'),JSON.stringify(audit.errors));
  }
  const wrongOwner=replaceLabel(svg,'loga2Label',fragment=>fragment.replace('data-owner="B"','data-owner="A"'));
  assert.ok((await observe(wrongOwner)).errors.includes('OVERLAY_CALLOUT_OWNER_MISMATCH:loga2Label'));
  const missingLeader=svg.replace(/<line[^>]*id="overlay-callout-loga2Label-owner-leader"[^>]*\/>/,'');
  assert.notEqual(missingLeader,svg);
  assert.ok((await observe(missingLeader)).errors.includes('OVERLAY_CALLOUT_LEADER_MISSING:loga2Label'));
});
