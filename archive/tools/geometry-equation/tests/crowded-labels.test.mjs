// Crowded labels (CL), the render side: a segment label on a part of a longer segment, a point name on a leader across thin strokes, an angle mark on a short side.
// The layout and frame cases without a browser are in test_crowded_labels.py. These render tests need Chrome: run with --test-concurrency=1 (golden items 154, 155).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url),'utf8'));
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'crowded-labels-'));
const render=async(plan,item)=>{const out=tmp(),result=await renderPlan({item,plan,outDir:out});return {result,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,item.dir+'-solution.svg'),'utf8'):''};};
const leaders=svg=>[...svg.matchAll(/<line [^>]*data-role="leader"[^>]*>/g)].map(match=>match[0]);

test('radius label on the half of a diameter: the label stands on a leader from its own segment (20 효천 고1 기말 q23)',async()=>{
  const item={sourcePath:'archive/exams/original/high/h1/1final/20_효천고_1학기_기말_고1_기출.js',ordinal:23,dir:'cl23'};
  const {result,svg}=await render(read('../ops/golden/item155collinearlabel23/plan.json'),item);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  const own=leaders(svg).filter(tag=>tag.includes('data-owner-label="radiusMO"'));
  assert.equal(own.length,1);
  assert.ok(own[0].includes('data-owner="sMO"'));
  assert.ok(!svg.includes('data-leader-crossing'),'a leader that crosses nothing is not marked as a crossing one');
});

test('the centre of a small circle with lines through it: the name A′ goes out on a leader across thin strokes, marked data-leader-crossing (21 팔마 고1 기말 q18)',async()=>{
  const item={sourcePath:'archive/exams/original/high/h1/1final/21_팔마고_1학기_기말_고1_기출.js',ordinal:18,dir:'cl18'};
  const {result,svg}=await render(read('../ops/golden/item154crowdnames18/plan.json'),item);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  const crossing=leaders(svg).filter(tag=>tag.includes('data-leader-crossing="1"'));
  assert.equal(crossing.length,1);
  assert.ok(crossing[0].includes('data-owner="A1"'));
  assert.ok(crossing[0].includes('data-owner-label="A1-name"'));
});

test('an angle mark on a 20 px side is drawn with a small arc and still labelled; on a 3 px side it is still refused',async()=>{
  const item={sourcePath:'archive/exams/original/middle/m2/2mid/25_연향중_2학기_중간_중2_수학.js',ordinal:2,dir:'cla'};
  const ok=await render(read('cl-fixtures/angle-compact.json'),item);
  assert.equal(ok.result.status,'ARCHIVE_BOUND',JSON.stringify(ok.result.detail));
  // the usual first arc stands 16 px from the vertex; on this short side it shrinks with the ray (the sector polygon starts at the vertex, the arc at the first ray)
  const sector=ok.svg.match(/id="aV-sector"[^>]*points="([^"]+)"/)?.[1].split(' ').map(pair=>pair.split(',').map(Number));
  const arc=ok.svg.match(/id="aV-arc-1"[^>]*points="([^"]+)"/)?.[1].split(' ').map(pair=>pair.split(',').map(Number));
  assert.ok(sector&&arc,'the angle mark is drawn');
  const radius=Math.hypot(arc[0][0]-sector[0][0],arc[0][1]-sector[0][1]);
  assert.ok(radius>=3&&radius<16,'the arc shrinks with the short ray: '+radius);
  assert.ok(ok.svg.includes('id="aV-label"'),'the value of the angle is still written');
  const refused=await render(read('cl-fixtures/angle-too-short.json'),{...item,dir:'clb'});
  assert.equal(refused.result.status,'FAILED');
  assert.ok(String(refused.result.detail).includes('MARK_SEGMENT_TOO_SHORT'),String(refused.result.detail));
});
