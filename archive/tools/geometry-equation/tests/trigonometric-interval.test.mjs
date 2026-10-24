import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pythonWorker} from '../production/worker.mjs';
import {renderPlan} from '../production/render-plan.mjs';

const PLAN={capability:'trigonometric-spike-v1',
  graphPlan:{family:'trigonometric',function:'SIN',coefficients:['1','1','0'],phasePi:'0',sourceDomain:{kind:'INTERVAL_PI',rangePi:['0','6'],states:['OPEN','OPEN']},
    domain:[0,19],viewport:[-1,20,-2,2],referenceLines:[{id:'k',y:'1/2',intersectionCount:6}],axisTickValues:{x:[],y:[1]}},
  caption:'n=6일 때 0<x<6π에서 y=sin x의 그래프와 직선 y=1/2은 6개의 점에서 만난다.',
  sourceConditions:[{id:'c1',condition:'0<x<nπ에서 sin x = 3/n, 표본 n=6',mappedTo:'graphPlan'}],newVisualInformation:['양의 구간마다 수평선과 두 점에서 만난다']};

test('the author guide and contract describe INTERVAL_PI, referenceLines and their error codes',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const text of ['INTERVAL_PI','referenceLines','intersectionCount','TRIG_LINE_INTERSECTION_COUNT_MISMATCH','TRIG_LINE_THROUGH_INTERVAL_END','TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED'])assert.ok(guide.includes(text),text);
});

test('framing finds the six crossings and refuses a wrong claim with the engine count',async()=>{
  const ok=await pythonWorker({action:'frame_graph',graphPlan:PLAN.graphPlan});assert.equal(ok.status,'OK',JSON.stringify(ok.result));
  assert.equal(ok.result.graphPlan.trigIntervalFeatures.lines[0].intersections.length,6);
  const bad=structuredClone(PLAN.graphPlan);bad.referenceLines[0].intersectionCount=5;
  const refused=await pythonWorker({action:'frame_graph',graphPlan:bad});assert.notEqual(refused.status,'OK');
  assert.match(JSON.stringify(refused.result),/TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:engine finds 6 intersection/);
});

test('the figure is drawn in the Archive with the curve, open ends, the line and six crossing dots',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'trig-interval-'));
  const result=await renderPlan({item:{sourcePath:'archive/exams/original/high/h2/1final/22_금당고_1학기_기말_고2_수학I.js',ordinal:19},plan:PLAN,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const svg=fs.readFileSync(path.join(out,'figure-solution.svg'),'utf8');
  assert.equal((svg.match(/id="intersection-k-\d"/g)||[]).length,6);
  assert.equal((svg.match(/id="interval-endpoint-(start|end)"/g)||[]).length,2);
});
