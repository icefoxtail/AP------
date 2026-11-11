// graphPlan.regions of an inverse proportion (rational-spike-v1), composed and rendered end to end through renderPlan (Chrome: run with --test-concurrency=1).
// Unit-level framing / observer tests, including the tamper cases, are in test_rational_regions.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('../ops/golden.manifest.json',import.meta.url),'utf8'));
const meta=manifest.items.find(value=>value.dir==='item149rationalregions');
const planFile=decodeURIComponent(new URL('../ops/golden/item149rationalregions/plan.json',import.meta.url).pathname).replace(/^\/([A-Za-z]:)/,'$1');
const item={sourcePath:meta.sourcePath,ordinal:meta.ordinal,dir:'rr'};
const attr=(tag,name)=>tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

const render=async(plan,name)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`rational-regions-${name}-`));
  const result=await renderPlan({item,plan,outDir:out});
  return {result,out,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,'rr-solution.svg'),'utf8'):''};
};

test('the contract text and the guide name the regions of an inverse proportion',()=>{
  const text=contractText();
  assert.ok(text.includes('GRAPH_REGION_REQUIRES_INVERSE_PROPORTION')&&text.includes('REGIONS OF AN INVERSE PROPORTION'));
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  assert.ok(guide.includes('GRAPH_REGION_REQUIRES_INVERSE_PROPORTION')&&guide.includes('"under":"f"'));
});

test('Q14: the area under y=8/x, right of the y-axis and above the x-axis is shaded, closed along the top edge of the plot window',{timeout:600000},async()=>{
  const {result,svg}=await render(planFile,'q14');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const region=svg.match(/<path [^>]*data-mark="graph-region"[^>]*>/)[0];
  const points=[...attr(region,'d').matchAll(/-?\d+(?:\.\d+)?/g)].map(match=>Number(match[0]));
  const vertices=Array.from({length:points.length/2},(_,i)=>[points[2*i],points[2*i+1]]);
  const yAxis=svg.match(/<line [^>]*id="y-axis"[^>]*>/)[0],xAxis=svg.match(/<line [^>]*id="x-axis"[^>]*>/)[0];
  const axisX=Number(attr(yAxis,'x1')),top=Math.min(Number(attr(yAxis,'y1')),Number(attr(yAxis,'y2'))),axisY=Number(attr(xAxis,'y1')),right=Number(attr(xAxis,'x2'));
  // the fill starts at the corner of the y-axis and the top edge, follows the edge to where the curve enters the window, and never leaves the plot
  assert.deepEqual(vertices[0],[axisX,top]);
  assert.ok(vertices[1][1]===top&&vertices[1][0]>axisX,'the second vertex runs along the top edge to the curve');
  assert.ok(vertices.every(([x,y])=>x>=axisX-1e-6&&x<=right+1e-6&&y>=top-1e-6&&y<=axisY+1e-6),'no vertex left of the y-axis, right of the plot, above the top edge or below the x-axis');
  assert.ok(vertices.some(([x,y])=>Math.abs(x-axisX)<1e-6&&Math.abs(y-axisY)<1e-6),'the corner at the origin side of the x-axis');
  // painted beneath the curve and the axes
  const at=svg.indexOf(region);
  assert.ok(at<svg.indexOf('id="f-branch-0"')&&at<svg.indexOf('id="x-axis"')&&at<svg.indexOf('id="y-axis"'));
});

test('a pole strictly inside [from,to] is refused with a code, a pole at the end is drawn',{timeout:600000},async()=>{
  const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));
  const inside=await render({...plan,graphPlan:{...plan.graphPlan,regions:[{id:'S',under:'f',from:'-1',to:'11'}]}},'inside');
  assert.notEqual(inside.result.status,'ARCHIVE_BOUND');assert.match(JSON.stringify(inside.result),/GRAPH_REGION_BOUNDARY_UNDEFINED/);
  const left=await render({...plan,graphPlan:{...plan.graphPlan,numerator:['3','0'],denominator:['-5','1'],regions:[{id:'S',under:'f',from:'-1','to':'5'}]}},'left');
  assert.equal(left.result.status,'ARCHIVE_BOUND',JSON.stringify(left.result).slice(0,600));
});
