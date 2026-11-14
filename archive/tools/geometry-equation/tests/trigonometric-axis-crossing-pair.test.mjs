import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';

const q23=()=>({
  family:'trigonometric',
  sourceDomain:{kind:'ALL_REALS'},
  pairedAxisCrossing:{xPi:'7/4',windowPi:['-1/6','12/5'],guidesPi:['1/3','2/3','1','4/3','5/3','2']},
  axisTickPi:true,
  axisTickValues:{x:['1','7/4','2'],y:[]},
});
const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));

test('the two-curve opt-in rejects a tangency, an extra y number and an omitted crossing tick',async()=>{
  const cases=[
    [{...q23(),pairedAxisCrossing:{...q23().pairedAxisCrossing,xPi:'3/2'}},'TRIG_AXIS_CROSSING_PAIR_NOT_TRANSVERSE'],
    [{...q23(),axisTickValues:{x:['7/4'],y:['1']}},'TRIG_AXIS_CROSSING_PAIR_TICKS_INVALID'],
    [{...q23(),axisTickValues:{x:['1','2'],y:[]}},'TRIG_AXIS_CROSSING_PAIR_TICKS_INVALID'],
    [{...q23(),coefficients:['1','1','1']},'TRIG_AXIS_CROSSING_PAIR_SOURCE_INVALID'],
  ];
  for(const [graphPlan,code] of cases){
    const framed=await pythonWorker({action:'frame_graph',graphPlan});
    assert.equal(framed.status,'ERROR');
    assert.equal(framed.result.code,code);
  }
});

test('Q23 shares the exact x-axis crossing and audits the final diagram',async()=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:q23()});
  assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  assert.equal(framed.result.sourceDomainPreserved,true);
  const {graphPlan}=framed.result;
  const model=await pythonWorker({action:'graph',graphPlan});
  assert.equal(model.status,'OK',JSON.stringify(model.result));
  let transform;
  const worker=async(payload,options)=>{
    const result=await pythonWorker(payload,options);
    if(payload.action==='build'&&result.status==='OK'){
      const {aspectPolicy,...observed}=result.result.witness.coordinateModel;
      transform={...observed,displayScale:1};
    }
    return result;
  };
  const composed=await composeConstructionCandidate({
    plan:{capability:'trigonometric-spike-v1',graphPlan,caption:'두 삼각함수의 그래프',
      accessibilityDescription:'두 곡선은 가로축의 7π/4 눈금에서 만난다.'},
    model:model.result,identity:assetIdentity('25_효천고_1학기_중간_고2_대수|23','PROBLEM_VISUAL','body'),
    typographyPolicy:{schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:27.7,displayScale:.4,fontFloorCssPx:11},
    worker,
  });
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal((composed.svg.match(/data-role="curve"/g)??[]).length,2);
  assert.equal((composed.svg.match(/data-role="guide"/g)??[]).length,6);
  assert.deepEqual([...composed.svg.matchAll(/data-tick-pi-value="([^"]+)"/g)].map(match=>match[1]),['1','7/4','2']);
  const coordinate=[transform.originX+transform.sx*7*Math.PI/4,transform.originY];
  const from=[...composed.svg.matchAll(/<polyline\b[^>]+>/g)].find(match=>match[0].includes('REF_NEGCOS'))[0];
  const changed=from.replace(/points="([^"]+)"/,(_match,points)=>{
    const samples=points.split(' ');
    const anchor=samples.findIndex(point=>{
      const [x,y]=point.split(',').map(Number);
      return Math.hypot(x-coordinate[0],y-coordinate[1])<.35;
    });
    assert.ok(anchor>0&&anchor<samples.length-1);
    samples[anchor]=coordinate[0]+','+(coordinate[1]+2);
    return 'points="'+samples.join(' ')+'"';
  });
  const audit=async(svg,code)=>{
    assert.notEqual(svg,composed.svg);
    const response=await pythonWorker({action:'graphAudit',graphPlan,svg,transform},{script:observer});
    assert.ok(response.result.errors.includes(code),JSON.stringify(response.result));
  };
  await audit(composed.svg.replace(from,changed),'TRIG_AXIS_CROSSING_PAIR_ZERO_NOT_DRAWN:REF_NEGCOS');
  await audit(composed.svg.replace('stroke-dasharray="6 4"','stroke-dasharray="2 4"'),
    'TRIG_AXIS_CROSSING_PAIR_CURVE_STYLE:REF_NEGCOS');
  await audit(composed.svg.replace('만난다.','만난다. a=√2/2'),
    'TRIG_AXIS_CROSSING_PAIR_ACCESSIBLE_ANSWER');
});
