// Inverse proportion on the rational family (nonzero constant numerator) and the overlay polygon label, composed and rendered end to end
// through renderPlan (Chrome: run with --test-concurrency=1). Unit-level framing/observer tests are in test_rational_inverse_proportion.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const item={sourcePath:'archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js',ordinal:7,dir:'inv'};
const base={family:'rational',numerator:['6','0'],denominator:['0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-10,10],viewport:[-10,10,-10,10],axisTickValues:{x:[],y:[]}};
const RECTANGLE={capability:'rational-spike-v1',graphPlan:{...base,formulaLabel:'y=b/x',overlays:{points:[{id:'P',curveX:'3'},{id:'A',axis:'x',value:'3'},{id:'B',axis:'y',value:'2'},{id:'O',x:'0',y:'0'}],polygons:[{id:'R',points:['O','A','P','B'],label:'b'}]}},
  caption:'반비례 그래프 위의 점 P에서 두 축에 내린 수선의 발 A, B로 만든 직사각형 OAPB의 넓이는 b이다.',pointNames:{P:'P',A:'A',B:'B',O:'O'}};
const SHIFTED={capability:'rational-spike-v1',graphPlan:{...base,denominator:['-2','1'],requiredPoints:[{id:'P',x:5,y:2}]},caption:'y=6/(x-2)의 그래프와 점근선 x=2'};

const render=async(plan,name)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`inverse-${name}-`));
  const result=await renderPlan({item,plan,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  return fs.readFileSync(path.join(out,'inv-solution.svg'),'utf8');
};
const lines=(svg,role)=>[...svg.matchAll(/<line [^>]*>/g)].map(match=>match[0]).filter(tag=>tag.includes(`data-role="${role}"`));

test('the contract text and the guide state the inverse-proportion rule and the polygon label',()=>{
  const text=contractText();
  assert.ok(text.includes('INVERSE PROPORTION'));assert.ok(text.includes('UNSUPPORTED_RATIONAL_NUMERATOR_ZERO'));
  assert.ok(text.includes('OVERLAY_POLYGON_LABEL_INVALID'));
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  assert.ok(guide.includes('반비례 y=k/x')&&guide.includes('정비례 y=ax'));
});

test('y=b/x with the rectangle OAPB labelled b renders: no dashed line over an axis, the label inside the polygon',{timeout:600000},async()=>{
  const svg=await render(RECTANGLE,'rectangle');
  assert.equal(lines(svg,'asymptote').length,0,'both asymptotes lie on the axes: nothing is drawn over them');
  assert.ok(svg.includes('id="overlay-polygon-R-label"'));
  assert.ok(svg.includes('id="overlay-polygon-R-fill"'));
});

test('y=6/(x-2) with a required point renders one dashed vertical asymptote and the coordinate label',{timeout:600000},async()=>{
  const svg=await render(SHIFTED,'shifted');
  const asymptotes=lines(svg,'asymptote');
  assert.equal(asymptotes.length,1);assert.ok(asymptotes[0].includes('stroke-dasharray'));
  assert.ok(svg.includes('id="vertical-asymptote-label"'));assert.ok(svg.includes('id="required-point-1-coordinates"'));
});
