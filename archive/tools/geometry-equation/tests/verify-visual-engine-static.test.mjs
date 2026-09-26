import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {verifyVisualEngineStatic,displayedMath,structural} from '../verify-visual-engine-static.mjs';

function fixture(mutate=s=>s) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'geometry-static-'));
  const base='<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet"><title>원</title><desc>중심</desc><line id="x-axis" x1="0" y1="300" x2="600" y2="300"/><line id="y-axis" x1="300" y1="0" x2="300" y2="600"/><line id="xu" x1="360" y1="300" x2="360" y2="304"/><line id="yu" x1="300" y1="240" x2="296" y2="240"/><circle id="P" cx="360" cy="180" r="2" fill="black"/><circle id="circle" cx="360" cy="180" r="120" fill="none"/><text id="equation" data-label-kind="EQUATION_LABEL">x<tspan baseline-shift="super">2</tspan>−3x+4</text></svg>';
  fs.writeFileSync(path.join(root,'visual.svg'),mutate(base));
  const input={svg:'visual.svg',sourceFactStatus:'PASS',expectedFactStatus:'PASS',coordinateModel:{originX:300,originY:300,sx:60,sy:60,anchors:{origin:{type:'INTERSECTION',elements:['x-axis','y-axis'],expected:[0,0]},xAxis:{element:'xu',expected:[1,0]},yAxis:{element:'yu',expected:[0,1]}}},expectedFacts:[{factId:'P',type:'POINT',element:'P',expected:[1,2]}],extraFacts:[{type:'CIRCLE',element:'circle',center:[1,2],radius:2}],expectedLabels:[{id:'equation',visible:'x2−3x+4',powers:['2']}]};
  return {root,input,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
test('actual geometry, circle radius, display scope and structure pass',()=>{const f=fixture();try{assert.equal(verifyVisualEngineStatic(f).status,'PASS');}finally{f.cleanup();}});
test('correct metadata cannot spoof actual circle radius',()=>{const f=fixture(s=>s.replace('r="120"','data-radius="2" r="60"'));try{assert.equal(verifyVisualEngineStatic(f).status,'FAIL');}finally{f.cleanup();}});
test('old GOLD greedy exponent corruption fails display parity',()=>{const f=fixture(s=>s.replace('2</tspan>−3x+4','2−3x+4</tspan>'));try{assert.equal(verifyVisualEngineStatic(f).DISPLAYED_MATH_PARITY_PASS,false);}finally{f.cleanup();}});
test('item unresolved cannot be hidden by aggregate',()=>{const f=fixture();try{f.input.review={items:[{unresolved:1}],aggregateUnresolved:0};assert.ok(verifyVisualEngineStatic(f).errors.includes('AGGREGATE_EVIDENCE_FAIL'));}finally{f.cleanup();}});
test('structural rejects duplicate IDs, unsafe tags and malformed XML',()=>{for(const svg of ['<svg viewBox="0 0 1 1"><script/></svg>','<svg><g></svg>','<svg><circle id="x"/><circle id="x"/></svg>'])assert.equal(structural(svg).status,'FAIL');});
test('math display expectation omission fails closed',()=>assert.equal(displayedMath('<text id="a" data-label-kind="COORDINATE_LABEL">(1/2,0)</text>',[]).status,'FAIL'));
test('graph samples and discontinuity are actual polyline checks',()=>{const f=fixture(s=>s.replace('</svg>','<polyline id="g-branch-0" points="240,360 360,240"/></svg>'));try{f.input.extraFacts.push({type:'FUNCTION_GRAPH',prefix:'g',expression:'x'});assert.equal(verifyVisualEngineStatic(f).status,'PASS');f.input.extraFacts.at(-1).poles=[0];assert.ok(verifyVisualEngineStatic(f).errors.includes('FALSE_CONNECTION_ACROSS_DISCONTINUITY'));}finally{f.cleanup();}});
test('wrong sample cannot be rescued by correct function text',()=>{const f=fixture(s=>s.replace('</svg>','<polyline id="g-branch-0" points="240,360 360,180"/><text>y=x</text></svg>'));try{f.input.extraFacts.push({type:'FUNCTION_GRAPH',prefix:'g',expression:'x'});assert.equal(verifyVisualEngineStatic(f).status,'FAIL');}finally{f.cleanup();}});
test('nested superscript scopes cannot collapse to a flat exponent',()=>{const expected=[{id:'e',visible:'x23',powers:['23','3']}];assert.equal(displayedMath('<text id="e">x<tspan baseline-shift="super">2<tspan baseline-shift="super">3</tspan></tspan></text>',expected).status,'PASS');assert.equal(displayedMath('<text id="e">x<tspan baseline-shift="super">23</tspan></text>',expected).status,'FAIL');});
test('right angle orientation is observed from actual vertices and rays',()=>{const f=fixture(s=>s.replace('</svg>','<polyline id="right" points="367.5,180 367.5,187.5 360,187.5"/><line id="h" x1="0" y1="180" x2="600" y2="180"/><line id="v" x1="360" y1="0" x2="360" y2="600"/></svg>'));try{f.input.extraFacts.push({type:'RIGHT_ANGLE_MARK',element:'right',vertexElement:'P',lines:['h','v']});assert.equal(verifyVisualEngineStatic(f).status,'PASS');const file=path.join(f.root,'visual.svg');fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('367.5,180 367.5,187.5 360,187.5','365,175 370,180 365,185'));assert.equal(verifyVisualEngineStatic(f).status,'FAIL');}finally{f.cleanup();}});
