// Graph-region labels on a leader, composed and rendered end to end through renderPlan (Chrome: run with --test-concurrency=1).
// A band too thin to hold its name (the hump A and the dip B of a quartic, the band S between a parabola and a line) puts the label outside the band on a leader from
// the band's outer boundary; the leader runs away from the band and crosses no curve. The independent graph observer accepts that and still refuses a label outside its
// band without a leader (unit cases in test_graph_region_leader.py).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const QUARTIC={capability:'piecewise-polynomial-spike-v1',caption:'곡선과 x축으로 둘러싸인 두 도형 A, B의 넓이를 비교한다.',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['0','0','5/3','-8/3','1']}],breakpoints:[],
  sourceDomain:{kind:'ALL_REALS'},domain:[-0.2,2],viewport:[-0.2,2,-0.4,1.5],
  requiredPoints:[{id:'E0',x:'0',y:'0'},{id:'E1',x:'1 - sqrt(6)/6',y:'-1/36 + 2*sqrt(6)/27'},{id:'E2',x:'sqrt(6)/6 + 1',y:'-2*sqrt(6)/27 - 1/36'}],
  axisTickValues:{x:[],y:[]},coordinateBand:{hide:['E0','E1','E2']},
  regions:[{id:'A',upper:'f',lower:'axis',from:'0',to:'1',label:'A'},{id:'B',upper:'axis',lower:'f',from:'1',to:'5/3',label:'B',fill:'MEDIUM'}]}};
const item={sourcePath:'archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js',ordinal:15,dir:'gl'};
const attr=(tag,name)=>tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

test('the labels of two thin bands stand outside them on leaders that start on the band and cross no curve',{timeout:600000},async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'graph-region-leader-'));
  const result=await renderPlan({item,plan:QUARTIC,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const svg=fs.readFileSync(path.join(out,'gl-solution.svg'),'utf8');
  for(const id of ['A','B']){
    const leader=svg.match(new RegExp(`<line [^>]*data-owner-label="region-${id}-label"[^>]*>`))?.[0];
    assert.ok(leader,'a leader ties the label of band '+id);
    assert.equal(attr(leader,'data-role'),'leader');assert.equal(attr(leader,'data-owner'),'region-'+id);
    assert.ok(Math.hypot(attr(leader,'x2')-attr(leader,'x1'),attr(leader,'y2')-attr(leader,'y1'))>6,'the leader is visible');
    assert.ok(svg.includes(`id="region-${id}-label"`),'the label is kept');
  }
});
