// multi-curve-figure-v1 with a RATIONAL curve whose numerator is a quadratic (y=x+16/(x+2) has a vertical and an oblique asymptote), and the 21 강남여고 q21
// figure drawn with overlays instead of a linear referenceCurves entry. Rendered end to end through renderPlan (Chrome: run with --test-concurrency=1).
// Framing and observer tests without Chrome: test_graph_multi_curve_oblique_rational.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('../ops/golden.manifest.json',import.meta.url),'utf8'));
const goldenPlan=dir=>JSON.parse(fs.readFileSync(new URL(`../ops/golden/${dir}/plan.json`,import.meta.url),'utf8'));
const goldenItem=dir=>{const meta=manifest.items.find(value=>value.dir===dir);return {sourcePath:meta.sourcePath,ordinal:meta.ordinal,dir:'ob'};};

const render=async(item,plan,name)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`oblique-${name}-`));
  const result=await renderPlan({item,plan,outDir:out});
  return {result,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,'ob-solution.svg'),'utf8'):''};
};
const titleOf=svg=>svg.match(/<title id="visual-title">([^<]*)<\/title>/)[1];

test('the contract text and the guide describe the quadratic numerator',()=>{
  assert.ok(contractText().includes('OBLIQUE RATIONAL (multi-curve-figure-v1)'));
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  assert.ok(guide.includes('분자가 이차인 유리곡선')&&guide.includes('item156obliquerationalq05'));
  assert.ok(guide.includes('g가 일차식(직선)이면 `referenceCurves`가 아니라 `overlays`로 그린다')&&guide.includes('item157linegq21'));
});

test('21 순천고 q05: y=x+16/(x+2) on x>-2 with the dashed asymptote y=x is ARCHIVE_BOUND, and p, q, p+q are not printed',{timeout:600000},async()=>{
  const {result,svg}=await render(goldenItem('item156obliquerationalq05'),goldenPlan('item156obliquerationalq05'),'q05');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  assert.ok(['medium','full'].includes(result.sizeClass),result.sizeClass);
  assert.ok(svg.includes('data-branch="CURVE_f_R"')&&svg.includes('data-branch="ASYM_f_V"'));
  assert.ok(!svg.includes('data-branch="ASYM_f_H"'),'a quadratic numerator has no horizontal asymptote');
  const title=titleOf(svg);
  assert.ok(!/\b8\b|\(2,\s*6\)/.test(title),'no answer value in the figure text');
});

test('21 강남여고 q21: f, the line g and the points O, A, B, C, H with the right angle at H are ARCHIVE_BOUND at full, and the minimum of CH is not printed',{timeout:600000},async()=>{
  const {result,svg}=await render(goldenItem('item157linegq21'),goldenPlan('item157linegq21'),'q21');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  assert.equal(result.sizeClass,'full');
  assert.ok(!/√6|sqrt\(6\)/.test(titleOf(svg)),'no answer value in the figure text');
});
