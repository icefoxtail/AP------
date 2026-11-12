// A drawn segment over an axis tick keeps the tick number (26 왕운중 중1 q22): the number moves beside the tick on a short owner leader instead of the
// whole figure failing with LAYOUT_INVENTORY_INCOMPLETE. Chrome: run with --test-concurrency=1. The layout rule itself: test_label_layout.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const golden=JSON.parse(fs.readFileSync(new URL('../ops/golden/item152tickundersegment/plan.json',import.meta.url),'utf8'));
const ITEM={sourcePath:'archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js',ordinal:22};

test('the golden plan uses the real tick, not the hidden point and text label workaround',()=>{
  assert.deepEqual(golden.axisTickValues,{x:[],y:[-5]});
  assert.ok(!('hiddenPointNames' in golden)&&!('planeMarks' in golden));
  assert.ok(!golden.mathPlan.nodes.some(node=>node.id==='P5'));
  assert.ok(!golden.displayPoints.includes('P5'));
});

test('q22: the figure renders and the number -5 stands beside the tick on an owner leader',{timeout:600000},async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'tick-under-segment-'));
  const result=await renderPlan({item:{...ITEM,dir:'fig'},plan:golden,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,800));
  const svg=fs.readFileSync(path.join(out,'fig-solution.svg'),'utf8');
  const label=svg.match(/<g id="tick-y--5-label"[^>]*>/)?.[0];assert.ok(label,'the tick label is drawn');
  assert.match(label,/data-tick-display-value="−5"/);assert.match(label,/data-tick-callout="TICK_LABEL_OWNER_LEADER_v1"/);
  assert.match(svg,/id="tick-y--5-label-owner-leader"/);
  assert.ok(svg.includes('role="img"')&&/<title id="visual-title">[^<]+<\/title>/.test(svg));
});

test('the author guide says the number is kept and the workaround is not needed',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const word of ['그린 선분·직선이 눈금 자리를 지나는 경우','item152tickundersegment'])assert.ok(guide.includes(word),'guide lacks '+word);
});
